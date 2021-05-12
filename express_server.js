//import all the necessary packages.
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const generateRandomString = require('./generateRandomString');
const app = express();
const cookieParser = require('cookie-parser');
const {emailLookup, passwordCheck, checkUserID} = require("./emailLookup");

//set the server port.
const PORT = 8080;
//config ejs and add morgamMiddleware to track server activities.
app.set('view engine', 'ejs');
const morganMiddleware = morgan('dev');
app.use(bodyParser.urlencoded({ extended: true })); //make the post data readable.
app.use(cookieParser());

app.use(morganMiddleware);

//hard coded databases
const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
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

//create routes.
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  templateVars.user = users[req.cookies['user_id']];
  // templateVars.user = req.cookies['allUsers'][req.cookies['user_id']];
  res.render('urls_index', templateVars);
});

//post method to add new shoreURL-longURL pair into database.
app.post('/urls', (req, res) => {
  if (req.cookies['user_id']) {
    const randomURL = generateRandomString();
    const newShortURL = `http://localhost:${PORT}/urls/${randomURL}`;
    urlDatabase[randomURL] = `http://${req.body.longURL}`;
    res.redirect(newShortURL);
  } 
  res.redirect('/urls');
});

//setup homepage
app.get('/', (req, res) => {
  res.send('Hello!');
});

//setup create new URL page
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
    longURL: urlDatabase[req.params.shortURL],
  };
  templateVars.user = users[req.cookies['user_id']];
  res.render('urls_show', templateVars);
});

//setup a page for database jason file
app.get('/urls.json', (req, res) => {
  res.send(urlDatabase);
});

//redirect to longURL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//DELETE
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//UPDATE
app.post('/urls/:shortURL/edit', (req, res) => {
  urlDatabase[req.params.shortURL] = `http://${req.body.newURL}`;
  res.redirect('/urls');
});

//login get method
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']]
  };
  res.render('login', templateVars)
});

//login cookie setup
app.post('/login', (req, res) => {
  const testEmail = req.body.email;
  const testPassword = req.body.password;
  if (passwordCheck(users, testEmail, testPassword)) {
    res.cookie('user_id', checkUserID(users, testEmail, testPassword))
    res.redirect('/urls');
  } else {
    res.redirect(403, '/login')
  }
});

//logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

//registration page
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']],
  };
  if (req.query === 'error') {
    templateVars['loginMsg'] = req.cookies['loginMsg'];
  } else {
    res.clearCookie('loginMsg');
    templateVars['loginMsg'] = req.cookies['loginMsg'];
  }
  console.log('templateVars', templateVars)
  res.render('registration', templateVars);
});

//save registration info into account database
app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.redirect(400, '/register');
  } else {
    if (emailLookup(users, req.body.email)) {
      res.cookie('loginMsg', "email aready exist!")
      res.redirect('/register?error');
    } else {
      const randomID = generateRandomString();
      users[randomID] = {
        id: randomID,
        email: req.body.email,
        password: req.body.password
      };
      res.cookie('user_id', randomID);
      loginMsg = ''
      // res.cookie('allUsers', users);
      res.redirect('/urls');
    }
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
