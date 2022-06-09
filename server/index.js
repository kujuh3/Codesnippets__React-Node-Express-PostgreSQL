const express = require('express');
const app = express();
const db = require('./db/dbconfig');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const query = require('./db/codes');

var fs = require('fs');
var http = require("http");
app.set('view engine', 'html');

app.use(fileUpload({
  createParentPath: true
}));

/* HEROKU BUILD INITIALS
setInterval(function() {
  http.get("http://quicksnippets.herokuapp.com/");
}, 300000); // every 5 minutes (300000)


app.use(express.static(path.resolve(__dirname, "../client/build")));
*/
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/snippets", query.getAllSnippets);

app.post("/newsnippet", query.addNewSnippet);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port 3001.`);
});

module.exports = app;