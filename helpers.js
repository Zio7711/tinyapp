const getUserByEmail = (email, users) => {
  for (const user in users) {
    if (users[user]['email'] === email) {
      return user;
    }
  }
  return undefined;
}

module.exports = { getUserByEmail };

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