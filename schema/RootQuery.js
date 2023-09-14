const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');
const { findUserbyId, findAllProfiles } = require('../Utils/FindUser');
const UserType = require('./userType');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const user = await findUserbyId(args.id);
        return user[0];
      },
    },
    profiles: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {},
    },
  },
});

module.exports = RootQuery;