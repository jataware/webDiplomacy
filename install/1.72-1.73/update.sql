UPDATE `wD_Misc` SET `value` = '173' WHERE `name` = 'Version';

CREATE TABLE `wD_API_Sessions`
  (
    `userID` mediumint(8) unsigned NOT NULL,
    `lastRequest` int(11) unsigned NOT NULL,
    `ip` varchar(15) NOT NULL,
    `userAgent` varchar(30) NOT NULL,
    PRIMARY KEY (`userID`),
    KEY `lastrequesttime` (`lastRequest`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
