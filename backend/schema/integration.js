'use strict';

const request = require('request-promise');
const integrationServer = require("../utils/integrationServer");
const chai = require('chai');

const expect = chai.expect;

describe('integration test', () => {
    let app;

    before((done) => {
        app = integrationServer.start(done);
    });

    after((done) => {
        integrationServer.stop(app, done);
    });

    it('Should get no posts', () => {
        const query = `{
            posts {
                text
                upvotes
            }
        }`;
        const expected = {
            "posts": []
        };
        return integrationServer
            .graphqlCall(app, query)
            .then((response) => {
                expect(response).to.have.deep.equals(expected);
            });
    });

    it('Should create post', () => {
        const mutation = `
            mutation {
                createPost (
                    text: "integration test"
                ) {
                    text
                    upvotes
                }
            }
        `;
        const expected = {
            "createPost": {
                "text": "integration test",
                "upvotes": 0
            }
        };
        return integrationServer
            .graphqlCall(app, mutation)
            .then((response) => {
                expect(response).to.have.deep.equals(expected);
            });
    });

    it('Should get the post', () => {
        const query = `{
            posts {
                text
                upvotes
            }
        }`;
        const expected = {
            "posts": [
                {
                    "text": "integration test",
                    "upvotes": 0
                }
            ]
        };
        return integrationServer
            .graphqlCall(app, query)
            .then((response) => {
                expect(response).to.have.deep.equals(expected);
            });
    });

    it('Should upvote post', () => {
        const postIdQuery = `{
            posts {
                id
            }
        }`;
        return integrationServer
            .graphqlCall(app, postIdQuery).then(response => {
                if (response.posts.length !== 1) {
                    throw "could not get post id";
                } else {
                    const mutation = `
                        mutation($id: ID!) {
                            upvotePost (
                                id: $id
                            ) {
                                text
                                upvotes
                            }
                        }
                    `;
                    const expected = {
                        "upvotePost": {
                            "text": "integration test",
                            "upvotes": 1
                        }
                    };
                    return integrationServer
                        .graphqlCall(app, mutation, {id: response.posts[0].id})
                        .then((response) => {
                            expect(response).to.have.deep.equals(expected);
                        });
                }
            });
    });

    it('Should get the upvoted post', () => {
        const query = `{
            posts {
                text
                upvotes
            }
        }`;
        const expected = {
            "posts": [
                {
                    "text": "integration test",
                    "upvotes": 1
                }
            ]
        };
        return integrationServer
            .graphqlCall(app, query)
            .then((response) => {
                expect(response).to.have.deep.equals(expected);
            });
    });
});