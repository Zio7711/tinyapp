//IMPORT PACKAGES
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const generateRandomString = require('./generateRandomString');
const app = express();
const cookieParser = require('cookie-parser');
const {emailLookup, passwordCheck, checkUserID} = require("./emailLookup");

const PORT = 8080;

//MIDDLEWARE
app.set('view engine', 'ejs');
const morganMiddleware = morgan('dev');
app.use(bodyParser.urlencoded({ extended: true })); //make the post data readable.
app.use(cookieParser());

app.use(morganMiddleware);

//HARD CODE DATABASE
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

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
  }
};

//
//ROUTES
//

//URLS MAIN PAGE
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  templateVars.user = users[req.cookies['user_id']];
  res.render('urls_index', templateVars);
});


//POST URLS MAIN PAGE
app.post('/urls', (req, res) => {
  if (req.cookies['user_id']) {
    const randomURL = generateRandomString();
    const newShortURL = `/urls/${randomURL}`;
    urlDatabase[randomURL] = { longURL: `http://${req.body.longURL}`, userID: req.cookies['user_id']};
    res.redirect(newShortURL);
  } 
  res.redirect('/urls');
});

//HOME PAGE REDIRECT TO /URLS
app.get('/', (req, res) => {
  res.redirect('/urls')
});

//CREATE NEW shortURLS
app.get('/urls/new', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  templateVars.user = users[req.cookies['user_id']];
  res.render('urls_new', templateVars);
});

//understand user's input urls as parameters
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]['longURL'],
  };
  templateVars.user = users[req.cookies['user_id']];
  res.render('urls_show', templateVars);
});

//URLS JASON
app.get('/urls.json', (req, res) => {
  res.send(urlDatabase);
});

//REDIRECT TO LONGURL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  res.redirect(longURL);
});

//DELETE
app.post('/urls/:shortURL/delete', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send("Page not found");
    // res.redirect(404, '/urls')
  } else {
    if (urlDatabase[req.params.shortURL]['userID'] === req.cookies['user_id']) {
      delete urlDatabase[req.params.shortURL];
      res.redirect('/urls');
    } else {
      res.redirect(403, '/urls')
    }
  }
});

//UPDATE
app.post('/urls/:shortURL/edit', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.redirect(404, '/urls')
  } else {
    if (urlDatabase[req.params.shortURL]['userID'] === req.cookies['user_id']) {
      urlDatabase[req.params.shortURL]['longURL'] = `http://${req.body.newURL}`;
      res.redirect('/urls');
    } else {
      res.redirect(403, '/urls')
    }
  }
});

//LOGIN
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']]
  };
  res.render('login', templateVars)
});

//POST LOGIN
app.post('/login', (req, res) => {
  const testEmail = req.body.email;
  const testPassword = req.body.password;
  if (passwordCheck(users, testEmail, testPassword)) {
    res.cookie('user_id', checkUserID(users, testEmail, testPassword))
    res.redirect('/urls');
  } else {
    return res.status(403).send("Please check your username and password!")
  }
});

//LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

//REGISTRATION
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']],
  };
  res.render('registration', templateVars);
});

//POST REGISTRATION
app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Do not leave it blank!");
  } else {
    if (emailLookup(users, req.body.email)) {
      res.status(400).send("email already exist!");
    } else {
      const randomID = generateRandomString();
      users[randomID] = {
        id: randomID,
        email: req.body.email,
        password: req.body.password
      };
      res.cookie('user_id', randomID);
      res.redirect('/urls');
    }
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
