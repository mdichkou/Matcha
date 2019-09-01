import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { getAllMembers } from "../../actions/members";
import uuid from "uuid";
import { Avatar } from "@material-ui/core";
import useStyles from "../../utils/styleClasses";

const Chat = ({
  getAllMembers,
  members: { members },
  auth: { isFirstVisit, user, loading }
}) => {
  const classes = useStyles();

  useEffect(() => {
    getAllMembers();
  }, [getAllMembers]);

  // Redirect to FirstVisit if firstvisit
  if (isFirstVisit) return <Redirect to="/connect" />;

  return (
    <Fragment>
      <div className="container py-2">
        {members.length > 0 ? (
          <h2 className="font-weight-light text-center text-muted py-3">
            Members
          </h2>
        ) : (
          <h2 className="font-weight-light text-center text-muted py-3">
            No Members already
          </h2>
        )}
        {members.length > 0 &&
          members.map(user => (
            <Fragment key={uuid.v4()}>
              <div className="col py-2">
                <div className="card">
                  <div className="card-body">
                    <div className="float-right text-muted">
                      <Avatar
                        alt="avataruser"
                        src={`/${user.path}`}
                        className={classes.Avatar}
                      />
                    </div>
                    <a
                      href={"/conversation/" + user.c_id}
                      data-toggle="tabs"
                      className="nav-link"
                    >
                      <h4 className="card-title text-muted">{user.username}</h4>
                    </a>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
      </div>
    </Fragment>
  );
};

Chat.propTypes = {
  members: PropTypes.object.isRequired,
  getAllMembers: PropTypes.func.isRequired,
  auth: PropTypes.object
};

const mapStateToProps = state => ({
  members: state.members,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getAllMembers }
)(Chat);
