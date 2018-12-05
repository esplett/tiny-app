
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser')

app.use(cookieParser())

app.set("view engine", "ejs")


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

//handle shortURL requests
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

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
//returns undefined for URL without it
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//define route to match POST request
app.post("/urls", (req, res) => {
  let newString = generateRandomString();
  console.log(req.body);  // debug statement to see POST parameters
  urlDatabase[newString] = req.body.longURL;
  res.redirect("http://localhost:8080/urls/" +
    newString)
});
//if you don't know what it is [] notation


//produce a string of 6 random alphanumeric characters
function generateRandomString() {
var anysize = 6;//the size of string
var charset = "abcdefghijklmnopqrstuvwxyz1234567890"; //from where to create
result="";
for( var i=0; i < anysize; i++ )
        result += charset[Math.floor(Math.random() * charset.length)];
        return result;
}

//handle Post delete requests
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("http://localhost:8080/urls/")
});
//shorturl is key, and longurl is value


// Add a POST route that updates a URL resource;
app.post("/urls/:id/update", (req, res) => {
  console.log(req.body, req.params);
  const { id } = req.params;
  const { longURL } = req.body;
  urlDatabase[id] = longURL;
  res.redirect('/urls/' + id);
});


