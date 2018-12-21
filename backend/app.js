module.exports = function (graphql) {
    let module = {};
    const app = require("express")();
    const expressGraphql = require("express-graphql");
    app.use(
        "/graphql",
        expressGraphql({
            schema: graphql.graphQLSchema,
            rootValue: graphql.resolvers,
            graphiql: true
        })
    );
    module.app = app;
    return module;
};