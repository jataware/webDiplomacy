<?php
/*
    Copyright (C) 2004-2010 Kestas J. Kuliukas

	This file is part of webDiplomacy.

    webDiplomacy is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    webDiplomacy is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with webDiplomacy.  If not, see <http://www.gnu.org/licenses/>.
 */

defined('IN_CODE') or die('This script can not be run by itself.');

/**
 * Send a message to a member of a countryID in a game, from another member. Used by GameMaster in processGame, and
 * Chatbox
 *
 * @package Base
 * @subpackage Game
 */
class libGameMessage
{
	/**
	 * Send a game message. Messages are sanitized
	 *
	 * @param string $toCountryID The countryID being sent to. 'Global' sends to all.
	 * @param string $fromCountryID The county being sent from. 'GameMaster' can also be used.
	 * @param string|array $message The message(s) to be sent (Can be an array of messages for)
	 * @param int[optional] $gameID The game ID to use. If not given the current global Game is sent to.
	 * 
	 * @return int $timeSent The time of this message in the DB.
	 */
	static public function send($toCountryID, $fromCountryID, $message, $gameID=-1)
	{
		global $DB, $Game, $MC;
		if ( ! is_object($Game) )
		{
			$Variant=libVariant::loadFromGameID($gameID);
			$Game = $Variant->Game($gameID);
		}

		$message = $DB->msg_escape($message);

		if ( !is_numeric($toCountryID) )
			$toCountryID=0;

		if ( !is_numeric($fromCountryID) )
		{
			$message = '<strong>'.$fromCountryID.':</strong> '.$message;
			$fromCountryID=0;
		}

		if( 65000 < strlen($message) )
		{
			throw new Exception(l_t("Message too long"));
		}
		$timeSent = time();

		if ($toCountryID == 0) {
			$MC->set("lastmsgtime_{$Game->id}_0", $timeSent); // spectators
			foreach($Game->Members->ByCountryID as $countryID => $member) {
				$MC->set("lastmsgtime_{$Game->id}_{$countryID}", $timeSent);
			}
		} else {
			$MC->set("lastmsgtime_{$Game->id}_{$fromCountryID}", $timeSent);
			$MC->set("lastmsgtime_{$Game->id}_{$toCountryID}", $timeSent);
		}

		$DB->sql_put("INSERT INTO wD_GameMessages
					(gameID, toCountryID, fromCountryID, turn, message, phaseMarker, timeSent)
					VALUES(".$Game->id.",
						".$toCountryID.",
						".$fromCountryID.",
						".$Game->turn.",
						'".$message."',
						'".$Game->phase."',
						".$timeSent.")");

		if ($toCountryID != $fromCountryID || $fromCountryID == 0)
		{
			libGameMessage::notify($toCountryID, $fromCountryID);
		}

		require_once('lib/pusher.php');
		$channel = "private-game" . $Game->id . "-country";

		if ($toCountryID == 0) {
			foreach($Game->Members->ByCountryID as $countryID => $member) {
				libPusher::trigger($channel . $countryID, 'message', 'messageSent');
			}
		} else {
			$channel = $channel . $toCountryID;
			libPusher::trigger($channel, 'message', 'messageSent');
		}

		return $timeSent;
	}

    /**
	 * Annotate a previously-sent game message.
	 *
	 * @param int $toCountryID The countryID being sent to. 'Global' sends to all.
	 * @param int $fromCountryID The county being sent from. 'GameMaster' can also be used.
	 * @param string $timeSent timestamp of previous sent msg since we don't have an ID for it
	 * @param int $gameID The game ID to use. If not given the current global Game is sent to.
     * @param string $answer the annotation itself (yes/no/unsure/backstab)
     * @param string $direction if the message annotated is incoming or outgoing (to user or by user)
	 *
	 * @return boolean $result true if successful, false otherwise
	 */
	static public function annotate($toCountryID, $fromCountryID, $timeSent, $gameID=-1, $answer, $direction="outgoing")
	{
		global $DB;

		if ( !is_numeric($toCountryID) )
			$toCountryID=0;

		if ( !is_numeric($fromCountryID) )
		{
			$fromCountryID=0;
		}

        // TODO check if incoming or outgoing and save annotation
        //   if outgoing check country/user is "author" of previous message
        //   if incoming verify the annotation can be done by recipient only
        // TODO check correct turn, etc so that messages can't be revised/annotated when they shouldn't?
        $result = false;
        if ($direction === "outgoing") {
            $result = $DB->sql_put_safe("UPDATE wD_GameMessages
                        SET intentDeceive = ?
                      WHERE
                        toCountryID = ?
                      AND
                        fromCountryID = ?
                      AND
                        timeSent = ?
                      AND
                        gameID = ?", [$answer, $toCountryID, $fromCountryID, $timeSent, $gameID], "siiii");
        } elseif ($direction === "incoming") {
            $intAnswer = intval($answer);

            if ($intAnswer === 2) {
                $intAnswer = null;
            }

            $result = $DB->sql_put_safe("UPDATE wD_GameMessages
                        SET suspectedIncomingDeception = ?
                      WHERE
                        toCountryID = ?
                      AND
                        fromCountryID = ?
                      AND
                        timeSent = ?
                      AND
                        gameID = ?", [$intAnswer, $toCountryID, $fromCountryID, $timeSent, $gameID], "iiiii");
        }

		return $result;
	}

	/**
	 * Notify a countryID that you sent them a message, uses the global Game
	 *
	 * @param string $toCountryID The countryID sent to, can be 'Global'
	 * @param string $fromCountryID The countryID sent from
	 * @param Game $Game The game being referred to
	 */
	private static function notify($toCountryID, $fromCountryID)
	{
		global $DB, $Game;

		$DB->sql_put("COMMIT"); // Prevent deadlocks

		if ( $toCountryID == 0 )
		{
			$DB->sql_put("UPDATE wD_Members
						SET newMessagesFrom = IF( (newMessagesFrom+0) = 0,
												'0',
												CONCAT_WS(',',newMessagesFrom,'0') )
						WHERE gameID = ".$Game->id." AND NOT countryID=".$fromCountryID);
		}
		else
		{
			$DB->sql_put("UPDATE wD_Members
						SET newMessagesFrom = IF( (newMessagesFrom+0) = 0,
												'".$fromCountryID."',
												CONCAT_WS(',',newMessagesFrom,'".$fromCountryID."') )
						WHERE gameID = ".$Game->id." AND countryID=".$toCountryID);
		}
		$DB->sql_put("COMMIT");

	}
}
?>
