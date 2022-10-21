import * as React from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import Progress from '@mui/material/CircularProgress';

import chess1 from "../../assets/waiting-room-backgrounds/chess1.jpg";
import chess2 from "../../assets/waiting-room-backgrounds/chess2.jpg";
import conference from "../../assets/waiting-room-backgrounds/conference-hall.jpg";
import monument from "../../assets/waiting-room-backgrounds/monument.jpg";
import plane1 from "../../assets/waiting-room-backgrounds/plane1.jpg";
import plane2 from "../../assets/waiting-room-backgrounds/plane2.jpg";
import plane3 from "../../assets/waiting-room-backgrounds/plane3.jpg";
import soldier from "../../assets/waiting-room-backgrounds/soldier.jpg";
import vessel from "../../assets/waiting-room-backgrounds/vessel.jpg";
import vessel2 from "../../assets/waiting-room-backgrounds/vessel2.jpg";
import veteran from "../../assets/waiting-room-backgrounds/wwii-veteran.jpg";

import unsplash1 from "../../assets/waiting-room-backgrounds/unsplash1.jpg";
import unsplash2 from "../../assets/waiting-room-backgrounds/unsplash2.png";
import unsplash3 from "../../assets/waiting-room-backgrounds/unsplash3.png";
import unsplash4 from "../../assets/waiting-room-backgrounds/unsplash4.jpg";
import { fetchPlayerState } from "../../state/game/game-api-slice";
import { useAppDispatch } from "../../state/hooks";
import { ApplicationBar } from "./AuthCommon"
import {
  getGameApiRequest
} from "../../utils/api";


const Instructions = (props) => {
  var message = (
    <div>
      <Typography gutterBottom variant="h3" style={{maxWidth: 600}}>
        Welcome to Diplomacy. Glad to have you onboard.
      </Typography>

      <Typography
        component="div"
        variant="body1" >

        <div style={{fontSize: "1rem"}}>
          A game admin will assign you to a new game soon. <br />
          This usually doesn’t take long, you will receive an e-mail once the game is ready.
        </div>

        <br />

        <Typography variant="h6">
          In the meantime, a couple of reminders:
        </Typography>

        <ul style={{
          margin: "1rem",
          listStyle: "square",
          fontSize: "1rem"
        }}>
          <li style={{marginBottom: "0.25rem"}}>
            Users must remain anonymous. Do not divulge your identity.
          </li>

          <li>
            Annotate as many incoming/outgoing messages that you believe are meant to deceive a player.
          </li>
        </ul>

        <Typography variant="h6">
          Have fun!
        </Typography>

      </Typography>

    </div>
  );
    return message
};

function WelcomeMessage(){
  const dispatch = useAppDispatch();

  const [playerStatus, setPlayerStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const intervalRef = React.useRef();

  function fetchData() {
    var req = dispatch(fetchPlayerState());

    req.then((response) => {

      /* console.log('Player state response:', response); */

      if (response?.payload) {
        setPlayerStatus(response.payload.state);
      } else {
        console.warn("No player state payload. DEBUG.")
      }
      return null;
    });

    return req;
  }

  React.useEffect(() => {

    setLoading(true);

    fetchData().finally(() => {
      setLoading(false);
    });

    intervalRef.current = setInterval(fetchData, 3000);

    return () => {
      clearInterval(intervalRef.current);
    }

  }, []);

  if (loading) {
    return (
      <div style={{
        fontSize: "35px",
        textAlign: "center",
        width: "100%",
        marginBottom: "1rem"
      }}> loading </div>
    );
  }

  let message = "Waiting for next game to start";
  if (playerStatus === "Cut") {
    message = "Thanks for participating.";
  }
  else if (playerStatus === "Banned") {
    message = "You have been banned from the tournament";
  }
  return (
    <div style={{
      textAlign: "center",
      width: "100%",
    }}>
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {!(["Cut", "Banned"].includes(playerStatus)) && (
        <Box sx={{color: "blue", height: "1.75rem", pr: 1, mt: -1}}>
          <Progress size="1.75rem" color="info" />
        </Box>
      )}
      <Typography
        sx={{fontSize: "35px"}}
        gutterBottom
      >
        {message}
      </Typography>
    </div>

    {playerStatus === "Cut" && (
      <Typography
        gutterBottom
        variant="h6"
        component="div"
      >
        <p>
          Your score did not meet the cutoff to move to the next round.
        </p>
        <p>
          If you have not played a game yet, the tournament filled up.
        </p>
        <p>
          Reach out to Discord if you think this was a mistake or if you have any questions- and stay tuned for the next tournament!
        </p>
      </Typography>
    )}
    </div>
  );
};


// https://www.imgacademy.com/sites/default/files/2022-07/img-homepage-meta.jpg
const Lobby = ({signOut}) => {

  var images = [
    chess1,
    chess2, conference, monument,
    unsplash1,
    unsplash2,
    unsplash3,
    unsplash4
  ];
  var randomNumber = Math.floor((Math.random() * images.length));

  const [image] = React.useState(images[randomNumber]);

  const enoughHeight = useMediaQuery('(min-height:800px)');

  return (
    <div style={{height: "100vh"}}>

      <div
        className="sticky-background"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "100vh",
          position: "fixed",
        }}
      />

      <Box sx={{
        width: "100vw",
        display: "block",
        height: enoughHeight ? "100%" : "unset"
      }}>
        <ApplicationBar signOut={signOut} />

        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "80%",
          pb: 6
        }}>
          <Box sx={{
            margin: "1rem",
            width: "65%",
            backgroundColor: "#FFFFFFE3",
            borderRadius: 2,
            position: "relative"
          }}>

            <Box sx={{
              p: 5,
            }}>
              <Instructions />
              <br />
              <WelcomeMessage />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Lobby;
