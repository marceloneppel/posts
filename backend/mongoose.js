const mongoose = require('mongoose');
const databaseSchema = new mongoose.Schema({
    text: String,
    upvotes: Number
});
module.exports = {
    clearDocuments: function () {
        this.postModel.deleteMany().exec();
    },
    connect: function () {
        mongoose.connect('mongodb://mongo/post', {useNewUrlParser: true, useFindAndModify: false}).then(() => {
        }, (error) => {
            console.log("error on database connection: " + error.toString());
            process.exit()
        });
    },
    disconnect: function () {
        mongoose.disconnect();
    },
    postModel: mongoose.model('Post', databaseSchema)
};