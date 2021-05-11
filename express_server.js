//import all the necessary packages.
const express = require('express');  
const morgan = require('morgan');
const bodyParser = require("body-parser");
const generateRandomString = require('./generateRandomString');
const app = express();
//set the server port.
const PORT = 8080;
//config ejs and add morgamMiddleware to track server activities.
app.set('view engine', 'ejs');
const morganMiddleware = morgan('dev');
app.use(bodyParser.urlencoded({extended: true})); //make the post data readable.
app.use(morganMiddleware);

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};
//create routes.
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  const randomURL = generateRandomString();
  const newShortURL = `http://localhost:${PORT}/urls/${randomURL}`;
  urlDatabase[randomURL] = `http://${req.body.longURL}`;
  res.redirect(newShortURL);
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

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(longURL);
});

//DELETE
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//UPDATE
app.post("/urls/:shortURL/edit",(req,res)=>{
  urlDatabase[req.params.shortURL] = `http://${req.body.newURL}`;
  res.redirect('/urls')
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});