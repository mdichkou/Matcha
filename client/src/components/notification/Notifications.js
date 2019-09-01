import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { getAllNotification } from "../../actions/notifications";
import uuid from "uuid";
import moment from "moment";

const Notifications = ({
  getAllNotification,
  notifications: { notifications },
  auth: { isFirstVisit }
}) => {
  useEffect(() => {
    getAllNotification();
  }, [getAllNotification]);

  // Redirect to FirstVisit if firstvisit
  if (isFirstVisit) return <Redirect to="/connect" />;

  return (
    <div className="container py-2">
      {notifications.length > 0 ? (
        <h2 className="font-weight-light text-center text-muted py-3">
          Notifications
        </h2>
      ) : (
        <h2 className="font-weight-light text-center text-muted py-3">
          No Notifications
        </h2>
      )}
      {notifications.length > 0 &&
        notifications.map(notification => (
          <Fragment key={uuid.v4()}>
            <div className="row">
              <div className="col-auto text-center flex-column d-none d-sm-flex">
                <div className="row h-50">
                  <div className="col">&nbsp;</div>
                  <div className="col">&nbsp;</div>
                </div>
                <h5 className="m-2">
                  {!notification.seen ? (
                    <span className="badge badge-pill bg-success border">
                      &nbsp;
                    </span>
                  ) : (
                    <span className="badge badge-pill bg-light border">
                      &nbsp;
                    </span>
                  )}
                </h5>
                <div className="row h-50">
                  <div className="col border-right">&nbsp;</div>
                  <div className="col">&nbsp;</div>
                </div>
              </div>
              <div className="col py-2">
                {!notification.seen ? (
                  <div className="card border-success">
                    <div className="card-body">
                      <div className="float-right text-muted">
                        {moment(notification.created_at).format(
                          "DD MMMM HH:mm"
                        )}
                      </div>
                      <h4 className="card-title text-muted">
                        {notification.notification}
                      </h4>
                    </div>
                  </div>
                ) : (
                  <div className="card">
                    <div className="card-body">
                      <div className="float-right text-muted">
                        {moment(notification.created_at).format(
                          "DD MMMM HH:mm"
                        )}
                      </div>
                      <h4 className="card-title text-muted">
                        {notification.notification}
                      </h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Fragment>
        ))}
    </div>
  );
};

Notifications.propTypes = {
  getAllNotification: PropTypes.func.isRequired,
  notifications: PropTypes.object.isRequired,
  auth: PropTypes.object
};

const mapStateToProps = state => ({
  notifications: state.notifications,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getAllNotification }
)(Notifications);
