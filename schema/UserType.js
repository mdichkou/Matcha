const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
} = require('graphql');
const ImageType = require('./imageType');
const { findProfilePicture, findTagsUser } = require('../Utils/FindUser');
const TagsType = require('./TagsType');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    lastname: { type: GraphQLString },
    firstname: { type: GraphQLString },
    token: { type: GraphQLString },
    latitude: { type: GraphQLString },
    longitude: { type: GraphQLString },
    isFirstVisit: { type: GraphQLBoolean },
    profileImage: {
      type: ImageType,
      async resolve(parentValue, args) {
        const profileImage = await findProfilePicture(parentValue.id);
        return profileImage[0];
      },
    },
    age: { type: GraphQLInt },
    birthDay: { type: GraphQLString },
    phone: { type: GraphQLString },
    gender: { type: GraphQLString },
    sexualPreference: { type: GraphQLString },
    bio: { type: GraphQLString },
    tags: {
      type: TagsType,
      async resolve(parentValue, args) {
        const profileTags = await findTagsUser(parentValue.id);
        return profileTags[0];
      },
    },
  },
});

module.exports = UserType;
