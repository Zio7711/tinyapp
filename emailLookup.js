const emailLookup = (obj, id) => {
  for (const key in obj) {
    if (obj[key]['email'] === id) {
      return true;
    }
  }
  return false;
};

const passwordCheck = (obj, email, password) => {
  for (const key in obj) {
    if (obj[key]['email'] === email && obj[key]['password'] === password) {
      return true;
    }
  }
  return false
}

const checkUserID = (obj, email, password) => {
  for (const key in obj) {
    if (obj[key]['email'] === email && obj[key]['password'] === password) {
      return key;
    }
  }
}

module.exports = {emailLookup, passwordCheck, checkUserID};

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