const { GraphQLSchema } = require('graphql');
const RootQuery = require('./RootQuery');
const mutation = require('./mutation');

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
