
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session')

app.set("view engine", "ejs")

app.use(cookieSession({
  name: 'session',
  keys: ['hello'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))



//data store urls
var urlDatabase = {
  "b2xVn2": {
    user: "userRandomID",
    url: "http://www.lighthouselabs.ca",
    },
  "9sm5xK": {
    user: "userRandomID",
    url: "http://www.google.com",
    }
  };

//data store users
const users = {
  "userRandomID": {
    id: "userRandomId",
    email: "a@b.c",
    password: bcrypt.hashSync("ddf", 10)
  }

}


//handle shortURL requests
app.get("/u/:shortURL", (req, res) => {
  console.log('urlDatabase', urlDatabase)
  let longURL = urlDatabase[req.params.shortURL].url
  console.log('longURL', longURL)
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



//returns subset of urlDatabase that belongs to user with ID id
//comparing userID with logged-in user's ID
function urlsForUser(user_id) {
  let newObj = {};
  for (var id in urlDatabase) {
    if (user_id === urlDatabase[id].user) {
      newObj[id] = urlDatabase[id];
    }
  }
  return newObj;
}


//alternate way of creating urlsForUser

// function urlsForUser(id) {
//     //returning array of shortURLS
//     return Object.keys(urlDatabase)
//        //x is the key, user value matches id being passed in
//        //.filter(x => false) would be empty array
//       .filter( x => urlDatabase[x].user === id)
//       .reduce((obj, id) => {
//         return {...obj, [id]:urlDatabase[id]}
//       }, {}) ;
// }

//root handler for urls
app.get("/urls", (req, res) => {
  const urlsMatch = urlsForUser(req.session.user_id);
  console.log("urlsMatch", urlsMatch)
  console.log("req.session.user_id", req.session.user_id)
  if (req.session.user_id) {
    res.render("urls_index", { urls: urlsMatch, user: users[ req.session.user_id ] });

  } else {
    res.status(400).send('<a href="/login">Please login</a> or <a href="/register">register</a>')
  }
});


//create new urls page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    };
      if (req.session.user_id) {
      res.render("urls_new", templateVars);
      } else {
      res.redirect("/login")
      }
});



//pass in the username to all views that include
//_header.ejs partial
app.get("/urls/:id", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.id].user) {
    let templateVars = {
      user: users[req.session.user_id],
      longURL: urlDatabase[req.params.id].url,
      shortURL: req.params.id
    };
    res.render("urls_show", templateVars);
  } else if (!req.session.user_id){
    res.status(400).send('User not logged in')
  } else {
    res.redirect("/urls");
  }
});

//body parser allows access to POST
//returns undefined for URL without it
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//define route to match POST request
app.post("/urls", (req, res) => {
  let newString = generateRandomString();
  console.log(req.body);  // debug statement to see POST parameters
  urlDatabase[newString] =
  { user : req.session.user_id,
    url: req.body.longURL
  };
  res.redirect("/urls/" + newString)
});


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
  if (req.session.user_id === urlDatabase[req.params.id].user) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls/")
  } else {
    res.redirect("/urls")
  }
});

//The edit feature
// Add a POST route that updates a URL resource;
app.post("/urls/:id/update", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.id].user) {
    console.log(req.body, req.params);
    const { id } = req.params;
    const { longURL } = req.body;
    urlDatabase[id].url = longURL;
  }
  res.redirect('/urls/');
});


//LOGIN
app.get("/login", (req, res) => {
  res.render("login");
});


// if user found compare pswd with existing user pswd
function authenticateUser(email, password) {
  // filter
  const [user_id] = Object.keys(users).filter(
    id =>
      users[id].email === email &&
      bcrypt.compareSync(password, users[id].password)
  );
  return user_id;
}

//find user that matches email submitted via login
// and set user_id
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Authenticate the user
  const user_id = authenticateUser(email, password);
    //if authenticate
    if (user_id) {
      //set the cookie -> store the id
      req.session.user_id = user_id;
      // res.cookie("user_id", user_id);
      res.redirect('/urls');
    // if !user return 403
    } else {
      res.status(403).send('No user found')
    }
});

//implement logout end point
//clear code
app.post("/logout", (req, res) => {
   req.session.user_id = null;
  res.redirect('/urls');
});

//create a registration page
app.get("/register", (req, res) => {
  res.render("register");
});

//handles registration form data
// adds newUser obj in global users obj
// keeps track of email, password, id
function addNewUser(email, password) {
  //create new user object in database
  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password: bcrypt.hashSync(password, 10),
    }
  return id;
}


app.post("/register", (req, res) => {
  const {email, password} = req.body;
    //check for email and password first
    // return error if user and password are missing
      if (!email || !password) {
      res.status(400).send('Please enter email and password')
    // check if user already exists, send an error
      } else if (findUser(email)) {
        res.status(400).send('User already exists')
    // create new user
      } else {
        const user_id = addNewUser(email, password);
        //set cookie
        req.session.user_id = user_id;
        // res.cookie("user_id", user_id);
        res.redirect("/urls");
      }
});


//have to wait until the loop is finished to return false
function findUser(email) {
  console.log(email);
  for (const user_id in users) {
  console.log(user_id)
  console.log(users[user_id]);
    if (users[user_id].email === email) {
      return users[user_id];
    }
  }
}








