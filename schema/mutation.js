const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } = require('graphql');
const UserType = require('./userType');
const { CreateUser, deleteUser, editUser, firstVisitUpdate } = require('../Utils/UserMutation');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        passwordConfirmation: { type: new GraphQLNonNull(GraphQLString) },
        lastname: { type: new GraphQLNonNull(GraphQLString) },
        firstname: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentValue, args) {
        return CreateUser(args);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentValue, { id }) {
        return deleteUser(id);
      },
    },
    userFirstVisit: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        birthDay: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
        gender: { type: new GraphQLNonNull(GraphQLString) },
        sexualPreference: { type: new GraphQLNonNull(GraphQLString) },
        bio: { type: new GraphQLNonNull(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) },
      },
      async resolve(parentValue, args) {
        return firstVisitUpdate(args);
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        newPassword: { type: GraphQLString },
        oldPassword: { type: GraphQLString },
        lastname: { type: GraphQLString },
        firstname: { type: GraphQLString },
        age: { type: GraphQLInt },
        birthDay: { type: GraphQLString },
        phone: { type: GraphQLString },
        gender: { type: GraphQLString },
        sexualPreference: { type: GraphQLString },
        bio: { type: GraphQLString },
        tags: { type: new GraphQLList(GraphQLString) },
      },
      async resolve(parentValue, args) {
        return editUser(args);
      },
    },
  },
});

module.exports = mutation;
