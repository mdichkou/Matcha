import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getCurrentProfile,
  setProfilPic,
  deletePic
} from "../../actions/profile";
import uuid from "uuid";
import useStyles from "../../utils/styleClasses";
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

// FilePond
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFileEncode
);

const Pictures = ({
  getCurrentProfile,
  setProfilPic,
  deletePic,
  auth: { token },
  profile: { profile, loading }
}) => {
  const classes = useStyles();

  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

  const setProfilePicClick = (oldimgid, newimgid) => {
    setProfilPic(oldimgid, newimgid);
    window.location.reload();
  };

  const deletePicClick = imgid => {
    deletePic(imgid);
    window.location.reload();
  };

  return (
    <Fragment>
      {!profile ? (
        ""
      ) : profile.countimg === 1 ? (
        <div className="row text-center text-lg-left">
          <img
            className="img-fluid img-thumbnail img-edit"
            src={JSON.parse(profile.allpictures)}
            alt="Profile"
          />
        </div>
      ) : (
        profile.allpictures && (
          <GridList cellHeight={200}>
            {JSON.parse(profile.allpictures).map(img => (
              <GridListTile key={img.id + uuid.v4()}>
                <img
                  className="img-fluid img-thumbnail img-edit"
                  src={img}
                  alt="Profile"
                />
                {profile.profileimg !== img && (
                  <Fragment>
                    <GridListTileBar
                      titlePosition="top"
                      actionIcon={
                        <IconButton
                          className={classes.icon}
                          size="small"
                          onClick={() =>
                            setProfilePicClick(profile.profileimg, img)
                          }
                        >
                          <StarBorderIcon />
                        </IconButton>
                      }
                      actionPosition="left"
                      className={classes.titleBar}
                    />
                    <GridListTileBar
                      titlePosition="bottom"
                      actionIcon={
                        <IconButton
                          color="secondary"
                          size="small"
                          onClick={() => deletePicClick(img)}
                        >
                          <DeleteOutlinedIcon />
                        </IconButton>
                      }
                      actionPosition="right"
                      className={classes.titleBar}
                    />
                  </Fragment>
                )}
              </GridListTile>
            ))}
          </GridList>
        )
      )}
      {profile && profile.countimg < 5 && (
        <Fragment>
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.fab}
            size="small"
            onClick={handleClickOpen}
          >
            <AddIcon />
          </Fab>
          <Dialog fullWidth open={open} onClose={handleClose}>
            <DialogTitle id="addpic">Add Picture</DialogTitle>
            <DialogContent>
              <FilePond
                required={true}
                allowDrop={true}
                allowMultiple={true}
                maxFileSize={4000000}
                acceptedFileTypes={["image/*"]}
                allowFileEncode={true}
                labelIdle='Drag & Drop your picture or <span class="filepond--label-action">Browse</span>'
                name="picuser"
                maxFiles={"5" - profile.countimg}
                server={{
                  url: "/api/images/",
                  process: {
                    headers: {
                      "x-auth-token": token
                    },
                    method: "POST"
                  }
                }}
                allowRevert={false}
                instantUpload={false}
                onprocessfiles={() => {
                  setTimeout(() => handleClose(), 500);
                }}
              />
            </DialogContent>
          </Dialog>
        </Fragment>
      )}
    </Fragment>
  );
};

Pictures.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  setProfilPic: PropTypes.func.isRequired,
  deletePic: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, setProfilPic, deletePic }
)(Pictures);
