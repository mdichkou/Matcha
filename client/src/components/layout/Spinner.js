import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import useStyles from "../../utils/styleClasses";
import { Box } from "@material-ui/core";

const Spinner = () => {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    function tick() {
      // reset when reaching 100%
      setProgress(oldProgress => (oldProgress >= 100 ? 0 : oldProgress + 1));
    }

    const timer = setInterval(tick, 20);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box m={4}>
      <div>
        <CircularProgress
          className={classes.progress}
          variant="determinate"
          value={progress}
          color="secondary"
        />
      </div>
    </Box>
  );
};

export default Spinner;
