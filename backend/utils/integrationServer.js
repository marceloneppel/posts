'use strict';

const graphql = require('graphql').graphql;
const {request} = require('graphql-request')

async function graphqlCall(app, call, variables) {
    return await request(`http://localhost:${app.app.address().port}/graphql`, call, variables);
}

function start(done) {
    const mongoose = require("../mongoose");
    mongoose.connect();
    mongoose.clearDocuments();
    const graphql = require("../graphql")(mongoose.postModel);
    const app = require('../app')(graphql).app;
    return {
        app: app.listen(3000, () => {
            console.log('Server started at port [%s]', 3000);
            done();
        }),
        mongoose: mongoose
    };
}

function stop(app, done) {
    app.app.close();
    app.mongoose.disconnect();
    done();
}

module.exports = {
    graphqlCall,
    start,
    stop
};