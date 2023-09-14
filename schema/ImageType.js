const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = require('graphql');

const imageType = new GraphQLObjectType({
  name: 'Image',
  fields: {
    id: { type: GraphQLString },
    user_id: { type: GraphQLString },
    path: { type: GraphQLString },
    isProfile: { type: GraphQLBoolean },
  },
});

module.exports = imageType;
