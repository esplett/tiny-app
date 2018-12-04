
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs")


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//registers handler on root path
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//root handler for urls
app.get("/urls", (req, res) => {
  res.render("urls_index", { urls: urlDatabase });
});

//render page for FORM
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//new route
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    longURL: urlDatabase[req.params.id],
    shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

//body parser allows access to POST
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));