const express = require("express");
const router = express.Router();
const conn = require("../../config/db");
const Validator = require("../../Validator/validator");
const auth = require("../../middleware/auth");
const bcrypt = require("bcrypt");
const transporter = require("../../middleware/transporter");
const findUser = require("../../Utils/FindUser");
const GetUserPosition = require("../../Utils/GetUserPosition");
const GetDistance = require("../../Utils/GetDistance");
const countRating = require("../../Utils/CountRating");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await findUser.findProfilUser(req.user.id);
    const profileimg = await findUser.findProfilePicture(req.user.id);
    const countimg = await findUser.findCountPicure(req.user.id);
    const userimg = await findUser.findAllUserPicture(req.user.id);
    const profiletags = await findUser.findTagsUser(req.user.id);

    if (
      !profile ||
      !profileimg.length ||
      !countimg ||
      !userimg.length ||
      !profiletags.length
    )
      return res.json({ msg: "There is no profile for this user" });

    const stringfindAllPictures = JSON.stringify(userimg);
    const parsefindAllPictures = JSON.parse(stringfindAllPictures);

    let result = [];
    for (x = 0; x < userimg.length; x++) {
      if (userimg.length === 1) result = parsefindAllPictures[0].path;
      else result = result.concat(parsefindAllPictures[x].path);
    }

    const FinalAllpictures = JSON.stringify(result);

    const user = {
      age: profile[0].age,
      bdate: profile[0].bdate,
      phone: profile[0].phone,
      gender: profile[0].gender,
      sexualpref: profile[0].sexualpref,
      bio: profile[0].bio,
      latitude: profile[0].latitude,
      longitude: profile[0].longitude,
      editPosition: profile[0].editPosition,
      profileimg: profileimg[0].path,
      countimg: countimg[0].count,
      tags: profiletags[0].tags,
      allpictures: FinalAllpictures
    };

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.send("Server error");
  }
});

// @route   POST api/profile/firstvisit
// @desc    More information about user in first visit
// @acess   Private
router.post("/firstvisit", auth, async (req, res) => {
  const { age, bdate, phone, gender, sexualpref, bio, tags } = req.body;

  const errors = [];

  try {
    if (!Validator.validateAge(age))
      errors.push({ msg: "Your age is invalid" });

    if (!Validator.validatePhone(phone))
      errors.push({ msg: "Your phone is invalid" });

    if (!Validator.validateBio(bio))
      errors.push({
        msg: "Your biography must be between 20 and 250 characters"
      });

    if (!Validator.validateGender(gender))
      errors.push({ msg: "Select a valid gender " });

    if (!Validator.validateSexualpref(sexualpref))
      errors.push({ msg: "Select a valid sexual preference " });

    if (!Validator.validateTags(tags))
      errors.push({ msg: "Select at least one tag" });

    if (errors.length) return res.json({ errors });

    await conn.query(
      "UPDATE users SET age = ?, bdate = ?, phone = ?, gender = ?, sexualpref = ?, bio= ?, isFirstvisit = ? WHERE id = ?",
      [age, bdate, phone, gender, sexualpref, bio, "0", req.user.id]
    );

    await conn.query("INSERT INTO tags SET tags = ?, user_id = ?", [
      JSON.stringify(tags),
      req.user.id
    ]);

    res.json({ msg: "Your profile has been updated" });
  } catch (err) {
    console.error(err.message);
    res.send("Server error");
  }
});

// @route   POST api/profile/editpassword
// @desc    Edit Password user
// @acess   Private
router.post("/editpassword", auth, async (req, res) => {
  const { oldpassword, newpassword, newpassword2 } = req.body;

  const user = await findUser.findUserbyIdPwd(req.user.id);

  const isMatch = await bcrypt.compare(oldpassword, user[0].password);

  if (!isMatch) {
    return res.json({ errors: [{ msg: "Invalid Credentials" }] });
  }

  if (!Validator.validatePassword(newpassword))
    return res.json({ errors: [{ msg: "Your password is incorrect" }] });

  if (newpassword != newpassword2)
    return res.json({
      errors: [{ msg: "The two passwords are not identical" }]
    });

  let userpwd = {
    newpassword
  };

  const salt = await bcrypt.genSalt(10);

  userpwd.newpassword = await bcrypt.hash(newpassword, salt);

  await conn.query("UPDATE users SET password = ?, reset_at = ? WHERE id = ?", [
    userpwd.newpassword,
    new Date(),
    user[0].id
  ]);

  const mailOptions = {
    from: "matcha@matcha.com",
    to: user[0].email,
    subject: "Reset password",
    html:
      "Your password has ben reseted, click on this link to login http://localhost:3000/login"
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err.message);
      res.send("Server Error");
    }

    res.json({ msg: `Your Password has been reseted` });
  });
});

// @route   POST api/profile/editinformation
// @desc    Edit information user
// @access  Private
router.post("/editinformation", auth, async (req, res) => {
  const { lastname, firstname, email, username } = req.body;

  const errors = [];

  try {
    if (!Validator.validateEmail(email))
      errors.push({ msg: "Your email is invalid" });

    if (!Validator.validateName(firstname))
      errors.push({ msg: "Your firstname is invalid" });

    if (!Validator.validateName(lastname))
      errors.push({ msg: "Your lastname is invalid" });

    if (!Validator.validateUsername(username))
      errors.push({ msg: "Your username is invalid" });

    if (errors.length) return res.json({ errors });

    await conn.query(
      "UPDATE users SET email = ?, username = ? , lastname = ? , firstname = ? WHERE id = ?",
      [email, username, lastname, firstname, req.user.id]
    );

    res.json({ msg: "Your information has been updated" });
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

// @route   POST api/profile/editpreferences
// @desc    Edit preference user
// @access  Private
router.post("/editpreferences", auth, async (req, res) => {
  const {
    age,
    bdate,
    phone,
    gender,
    sexualpref,
    bio,
    tags,
    editPosition
  } = req.body;

  const errors = [];

  let prefPosition = "";

  try {
    if (!Validator.validateAge(age))
      errors.push({ msg: "Your age is invalid" });

    if (!Validator.validateBdate(bdate))
      errors.push({ msg: "Your birthday date is invalid" });

    if (!Validator.validatePhone(phone))
      errors.push({ msg: "Your phone is invalid" });

    if (!Validator.validateBio(bio))
      errors.push({
        msg: "Your biography must be between 20 and 250 characters"
      });

    if (!Validator.validateTags(tags))
      errors.push({ msg: "Select at least one tag" });

    if (errors.length) return res.json({ errors });

    editPosition ? (prefPosition = 0) : (prefPosition = 1);

    await conn.query(
      "UPDATE users SET age = ?, bdate = ?, phone = ?, gender = ?, sexualpref = ?, bio = ?, editPosition = ? WHERE id = ?",
      [age, bdate, phone, gender, sexualpref, bio, prefPosition, req.user.id]
    );

    await conn.query("UPDATE tags SET tags = ? WHERE user_id = ?", [
      JSON.stringify(tags),
      req.user.id
    ]);

    res.json({ msg: "Your profile has been updated" });
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

// @route   Get api/profile
// @desc    Get all Profiles for every user based in preferences
// @acess   Private
router.get("/", auth, async (req, res) => {
  try {
    const profileID = await findUser.findProfileByUserID(req.user.id);
    const profilePreference = await findUser.findUserPreference(req.user.id);
    const blockUser = await findUser.findBlockUser(req.user.id);

    let profileGood = [];
    let profileBlocked = [];
    let profiles = null;
    let profilesWomen = null;
    let profilesMen = null;

    const Block = blockUser.map(value => {
      value.user1_id === req.user.id && delete value.user1_id;
      value.user2_id === req.user.id && delete value.user2_id;
      return value;
    });

    Block.forEach(obj => profileBlocked.push(Object.values(obj)[0]));

    if (profilePreference[0].filter === "age") {
      profiles = await findUser.findAllProfilesByAge(
        profilePreference[0].age_min,
        profilePreference[0].age_max,
        profilePreference[0].rating_min,
        profilePreference[0].rating_max
      );

      if (profileID[0].gender === "male")
        profilesWomen = await findUser.findAllProfilesWomenByAge(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "men",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );
      else
        profilesWomen = await findUser.findAllProfilesWomenByAge(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "women",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );

      if (profileID[0].gender === "male")
        profilesMen = await findUser.findAllProfilesMenByAge(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "men",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );
      else
        profilesMen = await findUser.findAllProfilesMenByAge(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "women",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );
    } else if (profilePreference[0].filter === "tags") {
      profiles = await findUser.findAllProfilesByTags(
        profilePreference[0].age_min,
        profilePreference[0].age_max,
        profilePreference[0].rating_min,
        profilePreference[0].rating_max
      );

      if (profileID[0].gender === "male")
        profilesWomen = await findUser.findAllProfilesWomenByTags(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "men",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );
      else
        profilesWomen = await findUser.findAllProfilesWomenByTags(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "women",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );

      if (profileID[0].gender === "male")
        profilesMen = await findUser.findAllProfilesMenByTags(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "men",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );
      else
        profilesMen = await findUser.findAllProfilesMenByTags(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "women",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );
    } else if (profilePreference[0].filter === "rating") {
      profiles = await findUser.findAllProfilesByRating(
        profilePreference[0].age_min,
        profilePreference[0].age_max,
        profilePreference[0].rating_min,
        profilePreference[0].rating_max
      );

      if (profileID[0].gender === "male")
        profilesWomen = await findUser.findAllProfilesWomenByRating(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "men",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );
      else
        profilesWomen = await findUser.findAllProfilesWomenByRatingr(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "women",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );

      if (profileID[0].gender === "male")
        profilesMen = await findUser.findAllProfilesMenByTags(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "men",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );
      else
        profilesMen = await findUser.findAllProfilesMenByTags(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "women",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );
    } else {
      profiles = await findUser.findAllProfiles(
        profilePreference[0].age_min,
        profilePreference[0].age_max,
        profilePreference[0].rating_min,
        profilePreference[0].rating_max
      );

      if (profileID[0].gender === "male")
        profilesWomen = await findUser.findAllProfilesWomen(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "men",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );
      else
        profilesWomen = await findUser.findAllProfilesWomen(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "women",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );

      if (profileID[0].gender === "male")
        profilesMen = await findUser.findAllProfilesMen(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "men",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );
      else
        profilesMen = await findUser.findAllProfilesMen(
          profilePreference[0].age_min,
          profilePreference[0].age_max,
          "women",
          profilePreference[0].rating_min,
          profilePreference[0].rating_max
        );
    }

    if (profileID[0].sexualpref === "women")
      profilesWomen.map(profile => {
        if (profileBlocked.length) {
          profileBlocked.map(userBlocked => {
            if (profile.id !== profileID[0].id && userBlocked !== profile.id) {
              const distance = GetDistance(
                profileID[0].latitude,
                profileID[0].longitude,
                profile.latitude,
                profile.longitude
              );

              Object.assign(profile, { distance: distance });

              const profileTags = JSON.parse(profile.tags.split(","));
              const userTags = JSON.parse(profileID[0].tags.split(","));
              let count = 0;

              for (x = 0; x < profileTags.length; x++) {
                for (y = 0; y < userTags.length; y++)
                  if (profileTags[x] === userTags[y]) count++;
              }

              if (
                distance <= profilePreference[0].distance_max &&
                count === profilePreference[0].tags_match
              ) {
                profileGood.push([profile]);
                if (profilePreference[0].filter === "distance") {
                  profileGood.sort((a, b) => {
                    return a[0].distance - b[0].distance;
                  });
                }
              }
            }
          });
        } else {
          if (profile.id !== profileID[0].id) {
            const distance = GetDistance(
              profileID[0].latitude,
              profileID[0].longitude,
              profile.latitude,
              profile.longitude
            );

            Object.assign(profile, { distance: distance });

            const profileTags = JSON.parse(profile.tags.split(","));
            const userTags = JSON.parse(profileID[0].tags.split(","));
            let count = 0;

            for (x = 0; x < profileTags.length; x++) {
              for (y = 0; y < userTags.length; y++)
                if (profileTags[x] === userTags[y]) count++;
            }

            if (
              distance <= profilePreference[0].distance_max &&
              count === profilePreference[0].tags_match
            ) {
              profileGood.push([profile]);
              if (profilePreference[0].filter === "distance") {
                profileGood.sort((a, b) => {
                  return a[0].distance - b[0].distance;
                });
              }
            }
          }
        }
      });
    else if (profileID[0].sexualpref === "men")
      profilesMen.map(profile => {
        if (profileBlocked.length) {
          profileBlocked.map(userBlocked => {
            if (profile.id !== profileID[0].id && userBlocked !== profile.id) {
              const distance = GetDistance(
                profileID[0].latitude,
                profileID[0].longitude,
                profile.latitude,
                profile.longitude
              );

              Object.assign(profile, { distance: distance });

              const profileTags = JSON.parse(profile.tags.split(","));
              const userTags = JSON.parse(profileID[0].tags.split(","));
              let count = 0;

              for (x = 0; x < profileTags.length; x++) {
                for (y = 0; y < userTags.length; y++)
                  if (profileTags[x] === userTags[y]) count++;
              }

              if (
                distance <= profilePreference[0].distance_max &&
                count === profilePreference[0].tags_match
              ) {
                profileGood.push([profile]);
                if (profilePreference[0].filter === "distance") {
                  profileGood.sort((a, b) => {
                    return a[0].distance - b[0].distance;
                  });
                }
              }
            }
          });
        } else {
          if (profile.id !== profileID[0].id) {
            const distance = GetDistance(
              profileID[0].latitude,
              profileID[0].longitude,
              profile.latitude,
              profile.longitude
            );

            Object.assign(profile, { distance: distance });

            const profileTags = JSON.parse(profile.tags.split(","));
            const userTags = JSON.parse(profileID[0].tags.split(","));
            let count = 0;

            for (x = 0; x < profileTags.length; x++) {
              for (y = 0; y < userTags.length; y++)
                if (profileTags[x] === userTags[y]) count++;
            }

            if (
              distance <= profilePreference[0].distance_max &&
              count === profilePreference[0].tags_match
            ) {
              profileGood.push([profile]);
              if (profilePreference[0].filter === "distance") {
                profileGood.sort((a, b) => {
                  return a[0].distance - b[0].distance;
                });
              }
            }
          }
        }
      });
    else {
      profiles.map(profile => {
        if (profileBlocked.length) {
          profileBlocked.map(userBlocked => {
            if (profile.id !== profileID[0].id && userBlocked !== profile.id) {
              const distance = GetDistance(
                profileID[0].latitude,
                profileID[0].longitude,
                profile.latitude,
                profile.longitude
              );

              Object.assign(profile, { distance: distance });

              const profileTags = JSON.parse(profile.tags.split(","));
              const userTags = JSON.parse(profileID[0].tags.split(","));
              let count = 0;

              for (x = 0; x < profileTags.length; x++) {
                for (y = 0; y < userTags.length; y++)
                  if (profileTags[x] === userTags[y]) count++;
              }

              if (
                distance <= profilePreference[0].distance_max &&
                count === profilePreference[0].tags_match
              ) {
                profileGood.push([profile]);
                if (profilePreference[0].filter === "distance") {
                  profileGood.sort((a, b) => {
                    return a[0].distance - b[0].distance;
                  });
                }
              }
            }
          });
        } else {
          if (profile.id !== profileID[0].id) {
            const distance = GetDistance(
              profileID[0].latitude,
              profileID[0].longitude,
              profile.latitude,
              profile.longitude
            );

            Object.assign(profile, { distance: distance });

            const profileTags = JSON.parse(profile.tags.split(","));
            const userTags = JSON.parse(profileID[0].tags.split(","));
            let count = 0;

            for (x = 0; x < profileTags.length; x++) {
              for (y = 0; y < userTags.length; y++)
                if (profileTags[x] === userTags[y]) count++;
            }

            if (
              distance <= profilePreference[0].distance_max &&
              count === profilePreference[0].tags_match
            ) {
              profileGood.push([profile]);
              if (profilePreference[0].filter === "distance") {
                profileGood.sort((a, b) => {
                  return a[0].distance - b[0].distance;
                });
              }
            }
          }
        }
      });
    }

    const Profiles = { profiles: profileGood, preferences: profilePreference };

    if (!profileGood.length)
      return res.json({
        msg: "No Profile found ...",
        preferences: profilePreference
      });
    else return res.json(Profiles);
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

// @route   Get api/profile/user/:user_id
// @desc    Get profile by user ID
// @acess   Private
router.get("/user/:user_id", auth, async (req, res) => {
  try {
    const profileinfo = await findUser.findProfileByUserID(req.params.user_id);
    const userimg = await findUser.findAllUserPicture(req.params.user_id);
    const countimg = await findUser.findCountPicure(req.params.user_id);
    const userLiked = await findUser.findUserLikedBy(
      req.params.user_id,
      req.user.id
    );
    const userRating = await findUser.findUserRating(req.params.user_id);

    const visitCount = await countRating.countVisit(req.params.user_id);
    const likeCount = await countRating.countLike(req.params.user_id);
    const matchCount = await countRating.countMatch(req.params.user_id);
    const blockCount = await countRating.countBlock(req.params.user_id);

    const finalRating = Math.round(
      Number(
        (visitCount[0].countVisit * 0.25 +
          likeCount[0].countLike * 0.5 +
          matchCount[0].countMatch * 1 -
          blockCount[0].countBlock * 1) /
          2
      )
    );

    if (!profileinfo.length) return res.json({ msg: "Profile not found" });

    const likeStringify = JSON.stringify(userLiked);
    const likeParse = JSON.parse(likeStringify);

    const stringfindAllPictures = JSON.stringify(userimg);
    const parsefindAllPictures = JSON.parse(stringfindAllPictures);

    let result = [];
    for (x = 0; x < userimg.length; x++) {
      if (userimg.length === 1) result = parsefindAllPictures[0].path;
      else result = result.concat(parsefindAllPictures[x].path);
    }

    const Like = likeParse.map(value => {
      value.user1_id === req.params.user_id && delete value.user1_id;
      value.user2_id === req.params.user_id && delete value.user2_id;
      return value;
    });

    const likedArray = [];
    Like.forEach(obj => likedArray.push(Object.values(obj)[0]));

    const LikedBy = JSON.stringify(likedArray);

    const profileimg = JSON.stringify(result);

    if (userRating.length > 0) {
      conn.query(
        "UPDATE `ratings` SET rating = ? , rating_at = ? WHERE user_id = ?",
        [finalRating, new Date(), req.params.user_id]
      );
    } else {
      conn.query("INSERT INTO `ratings` SET rating = ? , user_id = ?", [
        finalRating,
        req.params.user_id
      ]);
    }

    const profile = {
      profileinfo: profileinfo,
      profileimg: profileimg,
      countimg: countimg,
      LikedBy: LikedBy,
      finalRating: finalRating
    };

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

// @route   Post api/profile/positionupdate
// @desc    Post Position update
// @acess   Private
router.post("/positionupdate", auth, async (req, res) => {
  const { longitude, latitude } = req.body;

  await conn.query(
    "UPDATE users SET latitude = ? , longitude = ?  WHERE id = ?",
    [latitude, longitude, req.user.id]
  );
  res.send("Good");
});

// @route   Post api/profile/customposition
// @desc    Let user choose our position
// @acess   Private
router.post("/customposition", auth, async (req, res) => {
  const { longitude, latitude } = req.body;

  if (
    !Validator.validatePosition(longitude) ||
    !Validator.validatePosition(longitude)
  )
    res.json({ msg: "Enter a valid position" });

  await conn.query(
    "UPDATE users SET latitude =? , longitude = ?  WHERE id = ?",
    [latitude, longitude, req.user.id]
  );

  res.json({ msg: "Your Position has been updated" });
});

// @route   Get api/profile/getposition
// @desc    Update position automatically
// @acess   Private
router.get("/getposition", auth, async (req, res) => {
  const position = await GetUserPosition();

  const [latitude, longitude] = position.loc
    .split(",")
    .map(value => Number(value));

  await conn.query(
    "UPDATE users SET latitude =? , longitude = ?  WHERE id = ?",
    [latitude, longitude, req.user.id]
  );
});

// @route   Post api/profile/preferences
// @desc    Update Preferences
// @acess   Private
router.post("/preferences", auth, async (req, res) => {
  const errors = [];

  const {
    age_min,
    age_max,
    rating_min,
    rating_max,
    distance_max,
    tags_match
  } = req.body;

  if (age_min > age_max) errors.push({ msg: "Select a good Average for Age" });

  if (rating_min > rating_max)
    errors.push({ msg: "Select a good Average for Rating" });

  if (errors.length) return res.json({ errors });

  await conn.query(
    "UPDATE preferences SET age_min =? , age_max = ?, rating_min = ?,  rating_max = ?, distance_max = ?, tags_match = ? WHERE user_id = ?",
    [
      age_min,
      age_max,
      rating_min,
      rating_max,
      distance_max,
      tags_match,
      req.user.id
    ]
  );
});

// @route   Post api/profile/filter
// @desc    Update Filter
// @acess   Private
router.post("/filter", auth, async (req, res) => {
  const { target } = req.body;

  if (target === "age")
    await conn.query("UPDATE preferences SET filter = ? WHERE user_id = ?", [
      target,
      req.user.id
    ]);
  else if (target === "distance")
    await conn.query("UPDATE preferences SET filter = ? WHERE user_id = ?", [
      target,
      req.user.id
    ]);
  else if (target === "rating")
    await conn.query("UPDATE preferences SET filter = ? WHERE user_id = ?", [
      target,
      req.user.id
    ]);
  else if (target === "tags")
    await conn.query("UPDATE preferences SET filter = ? WHERE user_id = ?", [
      target,
      req.user.id
    ]);
  else
    await conn.query("UPDATE preferences SET filter = ? WHERE user_id = ?", [
      undefined,
      req.user.id
    ]);
});

// @route   Post api/profile/report
// @desc    Report User
// @acess   Private
router.post("/report", auth, async (req, res) => {
  const { userid } = req.body;

  conn.query("INSERT INTO reported SET user_id = ?, user_id_reported = ?", [
    req.user.id,
    userid
  ]);

  res.json({ msg: "User Reported" });
});

module.exports = router;
