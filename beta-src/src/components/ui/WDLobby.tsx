import * as React from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import Progress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';

import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

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

import clipboardImg from "../../assets/png/clipboard-3.png";
import guide1 from "../../assets/gif/Ani_12.gif";
import guide2 from "../../assets/gif/Ani_13.gif";
import discordLogoSvgFull from "../../assets/svg/discord-logo-blue.svg";

const RedHeading = ({sx={}, ...props}) => {
  return (
    <Typography
      sx={{color: "rgb(190,66,100)", fontWeight: "bold", ...sx}}
      variant="h5"
      {...props}
    />
  );
}

const BodyText = ({sx={}, ...props}) => {
  return (
    <Typography
      sx={{fontSize:"1rem" , ...sx}}
      variant="body1"
      {...props}
    />
  );
}

const Instructions = (props) => {

const dispatch = useAppDispatch();

  const [playerStatus, setPlayerStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const intervalRef = React.useRef();

  function fetchData() {
    var req = dispatch(fetchPlayerState());

    req.then((response) => {

      if (response?.payload) {
        setPlayerStatus(response.payload.state);
      } else {
        // Probably related to 401s when backend doesn't know of the user
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

  const displayablePlayerStatus = ["Cut", "Banned"].includes(playerStatus) ? playerStatus : "Queued";

  return (
    <div>
      <Typography
        paragraph
        variant="h4"
        sx={{fontWeight: "bold"}}
      >
        DIPLOMACY ONLINE TOURNAMENT
      </Typography>

      <Box
        className="top-permanent-box"
        sx={{
          backgroundColor: "rgba(241, 236, 205, 0.2)",
          borderRadius: 2,
          p: 2
        }}>

        <RedHeading sx={{marginBottom: 1}}>
          PLAYER STATUS: <span style={{textTransform: "uppercase"}}>{displayablePlayerStatus}</span>
        </RedHeading>

        <BodyText
          component="div"
          sx={{
            paddingLeft: 3, paddingRight: 1
          }}
          >
          <p>
            You have been added to the tournament queue!
          </p>
          <br />
          <p>
            Games will begin once all players have been assigned.
          </p>
          <p>
            In the event that we don’t have a multiple of 7 signed up, we will prioritize players who signed up first.
          </p>
        </BodyText>
      </Box>

    </div>
  );
};

const ScreenshotCaptionBox = ({image, text}) => {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      mt: 2,
      alignItems: "center"
    }}>

      <img
        src={image}
        style={{maxWidth: "70%"}}
      />

      <br />

      <div>
        <BodyText>
          {text}
        </BodyText>
      </div>
    </Box>
  );
};

const ResearchInterfaceOverview = (props) => {
  return (
    <Box>
      <RedHeading gutterBottom>
        Diplomacy Research Game Interface
      </RedHeading>
      <Box sx={{
        maxHeight: "520px",
        overflowY: "auto",
        p: 1,
        borderRadius: 1
      }}>
        <Box
          sx={{
            backgroundColor: "rgba(241, 236, 205, 0.3)",
            display: "flex",
            p: 2,
            borderRadius: 3,
            alignItems: "center"
          }}>
          <img
            src={clipboardImg}
            style={{width: "6rem", height: "6rem", marginRight: "1rem"}}
          />
          <BodyText
            sx={{
              flex: 1,
              maxWidth: "35rem",
            }}>
            Your participation in this Diplomacy tournament can help us understand how some Diplomacy players use deception as part of their strategy.
          </BodyText>
        </Box>

        <Grid
          container
          spacing={1}
          direction="row"
        >
          <Grid
            item
            xs={6}
            sx={{maxWidth: "50%"}}
            lg={6}>
            <ScreenshotCaptionBox
              image={guide2}
              text="We have customized your message interface so that it is easy to share your strategies with our research team! Just annotate your outgoing messages and click 'send!'"
            />
          </Grid>
          <Grid
            item
            sx={{maxWidth: "50%"}}
            xs={6}
            lg={6}>
            <ScreenshotCaptionBox
              image={guide1}
              text="Use our custom interface to keep track of your oponent's deceit! You can easily mark incoming messages as 'Deceptive' or 'Trustworthy'. Use this feature to keep track of who can be trusted!"
            />
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
}

const TournamentDetails = (props) => {
  return (
    <Box>
      <Box>
        <RedHeading gutterBottom>
          Scoring
        </RedHeading>
        <BodyText
          paragraph
          component="div"
        >
          <ul>
            <li> 1 point for playing </li>
            <li> 1 point per supply centre owned </li>
            <li> 38 points for most supply centres at end </li>
            <li> 14 points for second-most supply centres at end </li>
            <li> 7 points for third-most supply centres at end </li>
            <li> In case of ties, points are split amongst tied parties </li>
            <li> If solo victory, winner gets 73 points, other players score nothing </li>
          </ul>
        </BodyText>
      </Box>

      <Box>
        <RedHeading gutterBottom>
          Game Length
        </RedHeading>

        <BodyText
          paragraph
          component="div"
        >
          <ul>
            <li> 7 years (14 seasons) </li>
            <li> 15 minute turns </li>
          </ul>
        </BodyText>
      </Box>

      <Box>
        <RedHeading gutterBottom>
          Tournament Structure
        </RedHeading>
        <BodyText paragraph component="div">
          <p>
            Opening round of 2 games with random table and country assignment per game.
          </p>
          <p>
            After opening round, tally up scores and eliminate half of players, rounded to the nearest 7, based on scores.
          </p>
          <p>
            Second round is a single game, after which eliminate all but the top 7 scoring players.
          </p>
          <p>
            Final round is a single game.
          </p>
        </BodyText>
      </Box>

      <Box>
        <RedHeading gutterBottom>
          Payment Structure
        </RedHeading>
        <BodyText component="ul">
          <li>
            $100 per game completed
          </li>
          <li>
            $100 bonus for making it to the second round
          </li>
          <li>
            $100 bonus for making it to the final round
          </li>
          <li>
            $100 bonus for having the highest overall score across all rounds
          </li>
          <li>
            $50 bonus for having the second highest overall score across all rounds
          </li>
          <li>
            $100 bonus for winning the final game
          </li>
        </BodyText>
      </Box>

    </Box>
  );
};

/**
 *
 **/
const Lobby = ({signOut}) => {

  var images = [
    conference, monument,
    unsplash1,
    unsplash2,
    unsplash3,
    /* unsplash4 */
  ];
  var randomNumber = Math.floor((Math.random() * images.length));

  const [image] = React.useState(images[randomNumber]);

  /* const enoughHeight = useMediaQuery('(min-height:800px)'); */

  // toggles between research and tournament details
  const [panelNumber, setPanelNumber] = React.useState(true);
  const [forcedPanel, setForcedPanel] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);

  // const intervalRef2 = React.useRef();

  // const forceNextPanel = () => {
  //   setForcedPanel(true);
  //   setPanelNumber(!panelNumber);
  // };

  // if (forcedPanel) {
  //   setSeconds(0);
  //   setForcedPanel(false);
  // } else if (seconds >= 100) {
  //   setSeconds(0);
  //   setPanelNumber(!panelNumber);
  // }

  // React.useEffect(() => {

  //   intervalRef2.current = setInterval(() => {
  //     setSeconds(seconds => seconds + 5);
  //   }, 2000);

  //   return () => {
  //     clearInterval(intervalRef2.current);
  //   };
  // }, []);

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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <ApplicationBar
          signOut={signOut}
          sx={{backgroundColor: "transparent"}}
          position="fixed"
        />

        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          pb: 1,
          flexDirection: "column"
        }}>
          <Box sx={{
            maxHeight: "100vh",
            overflowY: "auto",
            margin: "1rem",
            maxWidth: "800px",
            backgroundColor: "#FFFFFFE3",
            borderRadius: 2,
            position: "relative"
          }}>
            <Box sx={{
              p: 5,
              pb: 3
            }}>
              <Instructions />

              <Box
                className="container-and-animation"
                sx={{
                  m: 1,
                  mb: 0.5
                }}
              >
                {panelNumber ? (
                  <ResearchInterfaceOverview />
                ) : (
                  <TournamentDetails />
                )}
              </Box>
              <Box
                component="footer"
                sx={{
                  width: "100%",
                  margin: "auto",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center"
                }}
              >
                <Button
                  sx={{marginTop: 1}}
                  component="a"
                  target="_blank"
                  href="https://www.discord.gg/gAVWYx7Cr9">
                  <img src={discordLogoSvgFull} style={{height: "2rem"}} />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Lobby;

// <Box sx={{
//        mt: 1,
//        width: "50%"
//      }}>
//   <LinearProgress
//     variant="determinate"
//     value={seconds}
//   />
//   <br />
//   <div style={{margin: "auto", textAlign: "center"}}>
//     {panelNumber ? 1 : 2} / 2
//     &nbsp;
//     <span
//       onClick={forceNextPanel}
//       style={{
//         cursor: "pointer",
//         fontWeight: "bold"
//       }}>
//       &gt;
//     </span>
//   </div>
// </Box>
