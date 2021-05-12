const emailLookup = (obj, id) => {
  for (const key in obj) {
    if (obj[key]['email'] === id) {
      return true;
    }
  }
  return false;
};

module.exports = emailLookup;

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

console.log(emailLookup(users, "user@examplasde.com")); */