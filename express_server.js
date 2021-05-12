//import all the necessary packages.
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const generateRandomString = require('./generateRandomString');
const app = express();
const cookieParser = require('cookie-parser');

//set the server port.
const PORT = 8080;
//config ejs and add morgamMiddleware to track server activities.
app.set('view engine', 'ejs');
const morganMiddleware = morgan('dev');
app.use(bodyParser.urlencoded({ extended: true })); //make the post data readable.
app.use(cookieParser());

app.use(morganMiddleware);

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};
//create routes.
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  if (req.cookies) {
    templateVars.username = req.cookies['username'];
  }
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const randomURL = generateRandomString();
  const newShortURL = `http://localhost:${PORT}/urls/${randomURL}`;
  urlDatabase[randomURL] = `http://${req.body.longURL}`;
  res.redirect(newShortURL);
});

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  if (req.cookies) {
    templateVars.username = req.cookies['username'];
  }
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  if (req.cookies) {
    templateVars.username = req.cookies['username'];
  }
  res.render('urls_show', templateVars);
});

app.get('/urls.json', (req, res) => {
  res.send(urlDatabase);
});

app.get('/hello', (req, res) => {
  const templateVars = { greeting: 'Hello, World' };
  res.render('hello_world', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  // console.log('longURL', longURL);
  res.redirect(longURL);
});

//DELETE
app.post('/urls/:shortURL/delete', (req, res) => {
  console.log('urlDatabase[req.params.shortURL]',urlDatabase[req.params.shortURL])
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//UPDATE
app.post('/urls/:shortURL/edit', (req, res) => {
  urlDatabase[req.params.shortURL] = `http://${req.body.newURL}`;
  res.redirect('/urls');
});

//login cookie setup
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  // console.log('req.body.username', req.body.username);

  res.redirect('/urls');
});

//logout
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
