const mongoose = require("./mongoose");
mongoose.connect();
const graphql = require("./graphql")(mongoose.postModel);
const app = require('./app')(graphql).app;
app.listen(3000, () => {
    console.log('Server started at port [%s]', 3000);
});
