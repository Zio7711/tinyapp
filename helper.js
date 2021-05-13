/* const bcrypt = require('bcrypt');

const passwordCheck = (obj, email, password) => {
  for (const key in obj) {
    if (obj[key]['email'] === email && bcrypt.compareSync(password, obj[key]['hashedPassword'])) {
      return true;
    }
  }
  return false
} */

const getUserByEmail = (users, email) => {
  for (const user in users) {
    if (users[user]['email'] === email) {
      return user;
    }
  }
  return false
}

module.exports = getUserByEmail;

/* const users = { 
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

console.log(emailLookup(users, "user@example.com")); */