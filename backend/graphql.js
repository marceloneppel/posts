// 9-9966-8600
const {buildSchema} = require("graphql");
module.exports = function (postModel) {
    let module = {};
    module.graphQLSchema = buildSchema(`
      type Post {
        id: ID
        text: String
        upvotes: Int
      }
      type Query {
        posts: [Post]
      }
      type Mutation {
        createPost(text: String!): Post
        upvotePost(id: ID!): Post
      }
    `);
    module.resolvers = {
        posts() {
            return postModel.find();
        },
        async createPost({text}) {
            const post = new postModel({
                text: text,
                upvotes: 0
            });
            return await post.save();
        },
        async upvotePost({id}) {
            return await postModel.findByIdAndUpdate({_id: id}, {$inc: {upvotes: 1}}, {new: true});
        }
    };
    return module;
};