const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const generateRandomString = require('./generateRandomString');

const app = express();
const PORT = 8080;



app.set('view engine', 'ejs');
const morganMiddleware = morgan('dev');

app.use(bodyParser.urlencoded({extended: true}));
app.use(morganMiddleware);

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get('/urls.json', (req, res) => {
  res.send(urlDatabase);
});

app.get('/hello', (req, res) => {
  const templateVars = { greeting: 'Hello, World' };
  res.render('hello_world', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
