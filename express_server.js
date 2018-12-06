
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.set("view engine", "ejs")

//data store urls
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

//data store users
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
 "user3RandomID": {
    id: "user3RandomID",
    email: "estherina@gmail.com",
    password: "dumbcookies"
  }
}


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
  res.render("urls_index", { urls: urlDatabase, user: users[ req.cookies["user_id"] ] });
});

//render page for FORM
app.get("/urls/new", (req, res) => {
  let templateVars = {
  username: req.cookies["user_id"],
  };
  res.render("urls_new", templateVars);
});

//new route
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    user: req.cookies["user_id"],
    longURL: urlDatabase[req.params.id],
    shortURL: req.params.id
  };
  res.render("urls_show", templateVars);
});
//pass in the username to all views that include
//_header.ejs partial
//urls_index, _new, and _show


//body parser allows access to POST
//returns undefined for URL without it
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//define route to match POST request
app.post("/urls", (req, res) => {
  let newString = generateRandomString();
  console.log(req.body);  // debug statement to see POST parameters
  urlDatabase[newString] = req.body.longURL;
  res.redirect("/urls/" +
    newString)
});
//if you don't know what it is [] notation


//produce a string of 6 random alphanumeric characters
function generateRandomString() {
var anysize = 6;//the size of string
var charset = "abcdefghijklmnopqrstuvwxyz1234567890"; //from where to create
var result="";
for( var i=0; i < anysize; i++ ) {
        result += charset[Math.floor(Math.random() * charset.length)];
  } return result;
}

//handle Post delete requests
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls/")
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

//COOKIES

// add an endpoint to handle a POST to /login in your
// Express server. It should set a cookie named username
// to the value/urls/username/login submitted in the request body
// via the login form.
// after set cookie redirect to /urls


//LOGIN

app.get("/login", (req, res) => {
  res.render("login");
});

//find user that matches email submitted via login
// if user found compare pswd with existing user pswd
// and set user_id // if !user return 403
// if !user return 403
app.post("/login", (req, res) => {
  console.log(req.body);
  const { email } = req.body;
    res.cookie('user_id', email);
    res.redirect('/urls');
});

//implement logout end point
//clear code
app.post("/logout", (req, rest) => {
  res.clearCookie('user_id', { path: '/urls' });
  res.redirect('/urls');
});

//create a registration page
app.get("/register", (req, res) => {
  res.render("register");
});

//handles registration form data
// adds newUser obj in global users obj
// keeps track of email, password, id

//req.params travels in URL not body

app.post("/register", (req, res) => {
  const {email, password} = req.body;

    //check for email and password first
    // return error if user and password are missing
      if (!email || !password) {
      //redirect
      res.status(400).send('Please enter email and password')
    // check if user already exists, send an error
      } else if (findUser(email)) {
        res.status(400).send('User already exists')
    // create new user
      } else {
        const user_id = addNewUser(email, password);
        //set cookie
        res.cookie("user_id", user_id);
        res.redirect("/urls");
      }
});

//btw steps 4 and 7

function addNewUser(email, password) {
  //create new user object in database
  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password,
    }
  return id;
}

//have to wait until the loop is finished to return false
function findUser(email) {
  console.log(email);
  for (const user_id in users) {
  console.log(user_id)
  console.log(users[user_id]);
    if (users[user_id].email === email) {
      return users[user_id];
    // } else {
    //   return false;
    //
    }
  }
}






//LOGIN page?
//get the info from the form
//Authenticate the user
//redirect

// function authenticateUser(email, password) {
//   const [newUser] = Object.keys(users).filter()
//    id ==> users[id].email && users[id].password === password
// }

//registration

// app.post("/register", (req, res) => {
//   const {email, password} = req.body;
//   const newUser =  authenticateUser(email, password);
//   //if authenticates set cookie, store id
//    if (newUser){
//     res.cookie('newUser', newUser)
//   }
// })


