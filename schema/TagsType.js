const { GraphQLObjectType, GraphQLString } = require('graphql');

const TagsType = new GraphQLObjectType({
  name: 'Tags',
  fields: {
    id: { type: GraphQLString },
    user_id: { type: GraphQLString },
    tags: { type: GraphQLString },
  },
});

module.exports = TagsType;