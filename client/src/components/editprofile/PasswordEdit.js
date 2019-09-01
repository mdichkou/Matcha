import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { logout } from "../../actions/auth";
import { editPassword } from "../../actions/profile";
import useStyles from "../../utils/styleClasses";
import {
  CssBaseline,
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const PasswordEdit = ({
  auth: { user },
  profile: { edited },
  editPassword,
  logout
}) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
    newpassword2: "",
    showPassword: false
  });

  const { oldpassword, newpassword, newpassword2, showPassword } = formData;

  const ClickshowPassword = () =>
    setFormData({ ...formData, showPassword: !showPassword });

  const passwordChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    editPassword(oldpassword, newpassword, newpassword2);
  };

  if (edited) logout();

  return !user ? (
    <Spinner />
  ) : (
    <Fragment>
      <CssBaseline />
      <div className={classes.paperEdit}>
        <form className={classes.formEdit} onSubmit={e => onSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                id="oldpassword"
                label="Current Password"
                fullWidth
                type={showPassword ? "text" : "password"}
                name="oldpassword"
                value={oldpassword}
                onChange={e => passwordChange(e)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={ClickshowPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                id="newpassword"
                label="New Password"
                fullWidth
                type={showPassword ? "text" : "password"}
                name="newpassword"
                value={newpassword}
                onChange={e => passwordChange(e)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={ClickshowPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                id="newpassword2"
                label="New Password Again"
                fullWidth
                type={showPassword ? "text" : "password"}
                name="newpassword2"
                value={newpassword2}
                onChange={e => passwordChange(e)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={ClickshowPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            fullWidth
            color="secondary"
            type="submit"
            className={classes.submit}
            disabled={!oldpassword || !newpassword || !newpassword2}
          >
            <SaveIcon />
            Save
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

PasswordEdit.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  editPassword: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { editPassword, logout }
)(PasswordEdit);
