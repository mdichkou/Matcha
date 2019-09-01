const conn = require("../config/db");

function findUser(email, username) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM `users` WHERE `email` = ? OR `username` = ?",
      [email, username],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findUserbyUsername(username) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM `users` WHERE `username` = ?",
      [username],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findUserbyId(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT id, email, username, firstname, lastname, latitude, longitude, isFirstVisit FROM `users` WHERE `id` = ?",
      [id],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findUserbyIdPwd(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT id, email, password FROM `users` WHERE `id` = ?",
      [id],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findUserForget(token) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token is NOT NULL AND reset_at > DATE_SUB(NOW(), INTERVAL 30 MINUTE )",
      [token],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findUserbyToken(token) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM `users` WHERE `confirmation_token` = ?",
      [token],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findProfilUser(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT age, bdate, phone, gender, sexualpref, bio, latitude, longitude, editPosition FROM `users` WHERE `id` = ?",
      [id],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findProfilePicture(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT path FROM `images` WHERE `user_id` = ? and isProfile = ?",
      [id, "1"],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findCountPicure(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT count(path) AS `count` FROM `images` WHERE `user_id` = ?",
      [id],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllUserPicture(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT path FROM `images` WHERE `user_id` = ?",
      [id],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findTagsUser(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT tags FROM `tags` WHERE `user_id` = ?",
      [id],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllTags() {
  return new Promise((resolve, reject) => {
    conn.query("SELECT tags FROM `tags`", (err, tags) => {
      if (err) reject(err);
      else resolve(tags);
    });
  });
}

function findAllProfiles(age_min, age_max, rating_min, rating_max) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, age, gender, sexualpref, bio, tags, latitude, longitude,path AS profileimg, rating FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id INNER JOIN ratings ON ratings.user_id = users.id WHERE isProfile = ? AND age BETWEEN ? AND ? AND rating BETWEEN ? AND ?",
      [1, age_min, age_max, rating_min, rating_max],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllProfilesWomen(
  age_min,
  age_max,
  sexualpref,
  rating_min,
  rating_max
) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, age, gender, sexualpref, bio, tags, latitude, longitude,path AS profileimg, rating FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id INNER JOIN ratings ON ratings.user_id = users.id WHERE isProfile = ? AND gender = ? AND (sexualpref = ? OR sexualpref = ? ) AND age BETWEEN ? AND ? AND rating BETWEEN ? AND ?",
      [
        1,
        "female",
        sexualpref,
        "both",
        age_min,
        age_max,
        rating_min,
        rating_max
      ],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllProfilesMen(
  age_min,
  age_max,
  sexualpref,
  rating_min,
  rating_max
) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, age, gender, sexualpref, bio, tags, latitude, longitude,path AS profileimg, rating FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id INNER JOIN ratings ON ratings.user_id = users.id WHERE isProfile = ? AND gender = ? AND (sexualpref = ? OR sexualpref = ? ) AND age BETWEEN ? AND ? AND rating BETWEEN ? AND ?",
      [1, "male", sexualpref, "both", age_min, age_max, rating_min, rating_max],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllProfilesByAge(age_min, age_max, rating_min, rating_max) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, age, gender, sexualpref, bio, tags, latitude, longitude,path AS profileimg, rating FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id INNER JOIN ratings ON ratings.user_id = users.id WHERE isProfile = ? AND age BETWEEN ? AND ? AND rating BETWEEN ? AND ? ORDER BY AGE",
      [1, age_min, age_max, rating_min, rating_max],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllProfilesWomenByAge(
  age_min,
  age_max,
  sexualpref,
  rating_min,
  rating_max
) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, age, gender, sexualpref, bio, tags, latitude, longitude,path AS profileimg, rating FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id INNER JOIN ratings ON ratings.user_id = users.id WHERE isProfile = ? AND gender = ? AND (sexualpref = ? OR sexualpref = ? ) AND age BETWEEN ? AND ? AND rating BETWEEN ? AND ? ORDER BY AGE",
      [
        1,
        "female",
        sexualpref,
        "both",
        age_min,
        age_max,
        rating_min,
        rating_max
      ],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllProfilesMenByAge(
  age_min,
  age_max,
  sexualpref,
  rating_min,
  rating_max
) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, age, gender, sexualpref, bio, tags, latitude, longitude,path AS profileimg, rating FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id INNER JOIN ratings ON ratings.user_id = users.id WHERE isProfile = ? AND gender = ? AND (sexualpref = ? OR sexualpref = ? ) AND age BETWEEN ? AND ? AND rating BETWEEN ? AND ? ORDER BY AGE",
      [1, "male", sexualpref, "both", age_min, age_max, rating_min, rating_max],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllProfilesByTags(age_min, age_max, rating_min, rating_max) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, age, gender, sexualpref, bio, tags, latitude, longitude,path AS profileimg, rating FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id INNER JOIN ratings ON ratings.user_id = users.id WHERE isProfile = ? AND age BETWEEN ? AND ? AND rating BETWEEN ? AND ? ORDER BY TAGS",
      [1, age_min, age_max, rating_min, rating_max],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllProfilesWomenByTags(
  age_min,
  age_max,
  sexualpref,
  rating_min,
  rating_max
) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, age, gender, sexualpref, bio, tags, latitude, longitude,path AS profileimg, rating FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id INNER JOIN ratings ON ratings.user_id = users.id WHERE isProfile = ? AND gender = ? AND (sexualpref = ? OR sexualpref = ? ) AND age BETWEEN ? AND ? AND rating BETWEEN ? AND ? ORDER BY TAGS",
      [
        1,
        "female",
        sexualpref,
        "both",
        age_min,
        age_max,
        rating_min,
        rating_max
      ],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllProfilesMenByTags(
  age_min,
  age_max,
  sexualpref,
  rating_min,
  rating_max
) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, age, gender, sexualpref, bio, tags, latitude, longitude,path AS profileimg, rating FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id INNER JOIN ratings ON ratings.user_id = users.id WHERE isProfile = ? AND gender = ? AND (sexualpref = ? OR sexualpref = ? ) AND age BETWEEN ? AND ? AND rating BETWEEN ? AND ? ORDER BY TAGS",
      [1, "male", sexualpref, "both", age_min, age_max, rating_min, rating_max],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllProfilesByRating(age_min, age_max, rating_min, rating_max) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, age, gender, sexualpref, bio, tags, latitude, longitude,path AS profileimg, rating FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id INNER JOIN ratings ON ratings.user_id = users.id WHERE isProfile = ? AND age BETWEEN ? AND ? AND rating BETWEEN ? AND ? ORDER BY rating",
      [1, age_min, age_max, rating_min, rating_max],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllProfilesWomenByRating(
  age_min,
  age_max,
  sexualpref,
  rating_min,
  rating_max
) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, age, gender, sexualpref, bio, tags, latitude, longitude,path AS profileimg, rating FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id INNER JOIN ratings ON ratings.user_id = users.id WHERE isProfile = ? AND gender = ? AND (sexualpref = ? OR sexualpref = ? ) AND age BETWEEN ? AND ? AND rating BETWEEN ? AND ? ORDER BY rating",
      [
        1,
        "female",
        sexualpref,
        "both",
        age_min,
        age_max,
        rating_min,
        rating_max
      ],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findAllProfilesMenByRating(
  age_min,
  age_max,
  sexualpref,
  rating_min,
  rating_max
) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, age, gender, sexualpref, bio, tags, latitude, longitude,path AS profileimg, rating FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id INNER JOIN ratings ON ratings.user_id = users.id WHERE isProfile = ? AND gender = ? AND (sexualpref = ? OR sexualpref = ? ) AND age BETWEEN ? AND ? AND rating BETWEEN ? AND ? ORDER BY rating",
      [1, "male", sexualpref, "both", age_min, age_max, rating_min, rating_max],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findProfileByUserID(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT users.id, username, email, lastname, firstname, age, isOnline, logout_at, phone, gender, sexualpref, bio, latitude, longitude, isOnline , logout_at, tags, path AS userimg FROM users INNER JOIN tags ON tags.user_id = users.id INNER JOIN images ON images.user_id = users.id WHERE users.id = ? AND isProfile = ?",
      [id, 1],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findUserPreference(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM preferences WHERE user_id = ?",
      [id],
      (err, preferences) => {
        if (err) reject(err);
        else resolve(preferences);
      }
    );
  });
}

function findMatchForUser(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT user1_id, user2_id from `match` WHERE (user1_id = ? OR user2_id = ?) AND isMatch = ?",
      [id, id, 1],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function findBlockUser(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT user1_id, user2_id from `match` WHERE (user1_id = ? OR user2_id = ?) AND isBlocked = ?",
      [id, id, 1],
      (err, users) => {
        if (err) reject(err);
        else resolve(users);
      }
    );
  });
}

function checkMatchUser(user1, user2) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT `isMatch` FROM `match` WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)",
      [user1, user2, user2, user1],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

function checkUserIdRow(userid1, userid2) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT `user1_id` FROM `match` WHERE user1_id = ? AND user2_id = ? AND`isMatch` = ?",
      [userid1, userid2, 0],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

function findUserLiked(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT user2_id FROM `match` WHERE user1_id = ?",
      [id],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

function findUserLikedBy(id1, id2) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT user1_id, user2_id FROM `match` WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)",
      [id1, id2, id2, id1],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

function findUserRating(id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT rating FROM `ratings` WHERE user_id = ?",
      [id],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

module.exports = {
  findUser: findUser,
  findUserbyUsername: findUserbyUsername,
  findUserbyId: findUserbyId,
  findUserbyIdPwd: findUserbyIdPwd,
  findUserForget: findUserForget,
  findUserbyToken: findUserbyToken,
  findProfilUser: findProfilUser,
  findProfilePicture: findProfilePicture,
  findTagsUser: findTagsUser,
  findAllTags: findAllTags,
  findCountPicure: findCountPicure,
  findAllUserPicture: findAllUserPicture,
  findAllProfiles: findAllProfiles,
  findProfileByUserID: findProfileByUserID,
  findAllProfilesWomen: findAllProfilesWomen,
  findAllProfilesMen: findAllProfilesMen,
  findMatchForUser: findMatchForUser,
  checkMatchUser: checkMatchUser,
  checkUserIdRow: checkUserIdRow,
  findBlockUser: findBlockUser,
  findUserPreference: findUserPreference,
  findAllProfilesByAge: findAllProfilesByAge,
  findAllProfilesWomenByAge: findAllProfilesWomenByAge,
  findAllProfilesMenByAge: findAllProfilesMenByAge,
  findAllProfilesByTags: findAllProfilesByTags,
  findAllProfilesWomenByTags: findAllProfilesWomenByTags,
  findAllProfilesMenByTags: findAllProfilesMenByTags,
  findUserLiked: findUserLiked,
  findUserLikedBy: findUserLikedBy,
  findUserRating: findUserRating,
  findAllProfilesByRating: findAllProfilesByRating,
  findAllProfilesWomenByRating: findAllProfilesWomenByRating,
  findAllProfilesMenByRating: findAllProfilesMenByRating
};
