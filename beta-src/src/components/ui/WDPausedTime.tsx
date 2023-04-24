import * as React from "react";

import formatTime from "../../utils/formatTime";
import parseSeconds from "../../utils/parseSeconds";

export function getFormattedTimeElapsed(seconds: number) {
  const parsedTime = parseSeconds(seconds);
  return formatTime(parsedTime, "");
}

const WDPausedTime = function ({}) {

  const [secondsElapsed, setSecondsElapsed] =  React.useState(1);

  const tick = () => {
    setSecondsElapsed(secondsElapsed => secondsElapsed + 1);
  };

  React.useEffect(() => {
    const interval = setInterval(tick, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <span>Paused for {getFormattedTimeElapsed(secondsElapsed)} since last page reload.</span>
  )
};

export default WDPausedTime;
