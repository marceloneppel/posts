'use strict';

const graphql = require('graphql');
const chai = require('chai');

const mongoose = require("../mongoose");
const appGraphql = require('../graphql')(mongoose.postModel);
const graphQLSchema = appGraphql.graphQLSchema;
const postType = graphQLSchema.getTypeMap().Post;
const expect = chai.expect;

describe('unit test: post type', () => {
    it('Should have an id field of type ID', () => {
        expect(postType.getFields()).to.have.property('id');
        expect(postType.getFields().id.type).to.deep.equals(graphql.GraphQLID);
    });

    it('Should have a text field of type String', () => {
        expect(postType.getFields()).to.have.property('text');
        expect(postType.getFields().text.type).to.deep.equals(graphql.GraphQLString);
    });

    it('Should have a upvotes field of type Integer', () => {
        expect(postType.getFields()).to.have.property('upvotes');
        expect(postType.getFields().upvotes.type).to.deep.equals(graphql.GraphQLInt);
    });
});

const resolvers = appGraphql.resolvers;
const sinon = require('sinon');
const sandbox = sinon.createSandbox();
chai.use(require('sinon-chai'));

describe('unit test: resolvers', () => {
    beforeEach(() => {
        sandbox.stub(mongoose.postModel, 'find');
        sandbox.stub(mongoose.postModel, 'findByIdAndUpdate');
        sandbox.stub(mongoose.postModel.prototype, 'save');
    });
    afterEach(() => sandbox.restore());

    it('Should call posts', () => {
        resolvers.posts();
        expect(mongoose.postModel.find).to.have.been.called;
    });

    it('Should call createPost', () => {
        resolvers.createPost({text: 'text'});
        expect(mongoose.postModel.prototype.save).to.have.been.called;
    });

    it('Should call upvotePost', () => {
        resolvers.upvotePost({id: 'id'});
        expect(mongoose.postModel.findByIdAndUpdate).to.have.been.calledWith({_id: "id"}, {$inc: {upvotes: 1}}, {new: true});
    });
});