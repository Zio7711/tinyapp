const generateRandomString = () => {
  let result = '';
  let chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789';
  for (let i = 6; i > 0; i--) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

// console.log(generateRandomString());

module.exports = generateRandomString;
