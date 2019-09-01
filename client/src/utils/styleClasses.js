import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  Avatar: {
    width: 30,
    height: 30
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  paperEdit: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  formEdit: {
    width: "100%" // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  fixedHeight: {
    height: 240
  },
  card: {
    maxWidth: 345
  },
  media: {
    height: 140
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  fabmap: {
    position: "absolute",
    bottom: theme.spacing(1),
    right: theme.spacing(2)
  },
  titleBar: {
    background: "rgba(0,0,0,0)",
    width: 200,
    height: 50
  },
  icon: {
    color: "white"
  },
  distanceicon: {
    marginLeft: "auto"
  },
  fabprofile: {
    margin: theme.spacing(1)
  },
  appBarSearch: {
    position: "relative"
  },
  titleSearch: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    flex: 1
  }
}));

export default useStyles;
