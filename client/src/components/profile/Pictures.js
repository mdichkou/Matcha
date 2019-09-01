import React, { Fragment } from "react";
import PropTypes from "prop-types";
import uuid from "uuid";
import { GridList, GridListTile } from "@material-ui/core";

const Pictures = ({ profile }) => {
  return (
    <Fragment>
      <GridList cellHeight={200}>
        {profile.countimg[0].count === 1 ? (
          <GridListTile key={uuid.v4()}>
            <img
              className="img-fluid img-thumbnail img-edit"
              src={`/${JSON.parse(profile.profileimg)}`}
              alt="Profile"
            />
          </GridListTile>
        ) : (
          JSON.parse(profile.profileimg).map(img => (
            <GridListTile key={img.id + uuid.v4()}>
              <img
                className="img-fluid img-thumbnail img-edit"
                src={`/${img}`}
                alt="Profile"
              />
            </GridListTile>
          ))
        )}
      </GridList>
    </Fragment>
  );
};

Pictures.propTypes = {
  profile: PropTypes.object.isRequired
};

export default Pictures;
