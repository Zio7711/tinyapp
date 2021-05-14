//IMPORT PACKAGES
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const generateRandomString = require('./generateRandomString');
const app = express();
const { getUserByEmail } = require('./helpers');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');

const PORT = 8080;

//MIDDLEWARE
app.set('view engine', 'ejs');
const morganMiddleware = morgan('dev');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use(express.static('public'));
app.use(methodOverride('_method'))
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);

//HARD CODE DATABASE
const urlDatabase = {
  b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'userRandomID' },
  i3BoGr: { longURL: 'https://www.google.ca', userID: 'userRandomID' },
};

const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    hashedPassword: bcrypt.hashSync('purple-monkey-dinosaur', 10),
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    hashedPassword: bcrypt.hashSync('dishwasher-funk', 10),
  },
};

//
//ROUTES
//

//URLS MAIN PAGE
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  templateVars.user = users[req.session.userIDcookie];
  res.render('urls_index', templateVars);
});

//POST URLS MAIN PAGE
app.post('/urls', (req, res) => {
  if (req.session.userIDcookie) {
    const randomURL = generateRandomString();
    const newShortURL = `/urls/${randomURL}`;
    urlDatabase[randomURL] = {
      longURL: `http://${req.body.longURL}`,
      userID: req.session.userIDcookie,
    };
    return res.redirect(newShortURL);
  }
  res.redirect('/urls');
});

//HOME PAGE REDIRECT TO /URLS
app.get('/', (req, res) => {
  if (req.session.userIDcookie) {
    return res.redirect('/urls');
  }
  res.redirect('/login');
});

//CREATE NEW shortURLS
app.get('/urls/new', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  templateVars.user = users[req.session.userIDcookie];
  res.render('urls_new', templateVars);
});

//understand user's input urls as parameters
app.get('/urls/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send('ShortURL is not found!');
  }

  if (req.session.userIDcookie === urlDatabase[req.params.shortURL]['userID']) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]['longURL'],
    };
    templateVars.user = users[req.session.userIDcookie];
    res.render('urls_show', templateVars);
  } else {
    return res.status(403).send('Permission denied');
  }
});

//URLS JASON
app.get('/urls.json', (req, res) => {
  res.send(urlDatabase);
});

//REDIRECT TO LONGURL
app.get('/u/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send('Page does not exits!');
  }
  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  res.redirect(longURL);
});

//DELETE
app.delete('/urls/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send('Page not found');
  }
  if (urlDatabase[req.params.shortURL]['userID'] === req.session.userIDcookie) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(403).send('You do not have permission!');
  }
});

//UPDATE
app.put('/urls/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(400).send('Page not found!');
  }

  if (urlDatabase[req.params.shortURL]['userID'] === req.session.userIDcookie) {
    urlDatabase[req.params.shortURL]['longURL'] = `http://${req.body.newURL}`;
    res.redirect('/urls');
  } else {
    res.status(403).send('You do not have permission!');
  }
});

//LOGIN
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session.userIDcookie],
  };
  res.render('login', templateVars);
});

//POST LOGIN
app.post('/login', (req, res) => {
  const testEmail = req.body.email;
  const testPassword = req.body.password;
  if (!getUserByEmail(testEmail, users)) {
    return res.status(403).send('Username does not exist!');
  }
  const userHashedPassword =
    users[getUserByEmail(testEmail, users)]['hashedPassword'];
  if (bcrypt.compareSync(testPassword, userHashedPassword)) {
    req.session['userIDcookie'] = getUserByEmail(testEmail, users);
    res.redirect('/urls');
  } else {
    return res.status(403).send('Please check your username and password!');
  }
});

//LOGOUT
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

//REGISTRATION
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session.userIDcookie],
  };
  res.render('registration', templateVars);
});

//POST REGISTRATION
app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Do not leave it blank!');
  }

  if (getUserByEmail(req.body.email, users)) {
    return res.status(400).send('email already exist!');
  }

  const randomID = generateRandomString();
  const inputPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(inputPassword, 10);
  users[randomID] = {
    id: randomID,
    email: req.body.email,
    hashedPassword,
  };
  req.session['userIDcookie'] = randomID;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
