function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

module.exports = {
  isPositiveInteger,
  isValidEmail,
};

