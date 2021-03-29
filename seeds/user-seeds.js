// base code referenced from ecom backend homework
const { User } = require('../models');

const userData = [
  {
    "user_name": "Toast",
    "password": "password12345"
  },
  {
    "user_name": "Kraken",
    "password": "password12345"
  },
  {
    "user_name": "Will",
    "password": "password12345"
  },
  {
    "user_name": "Murf",
    "password": "password12345"
  },
  {
    "user_name": "Bai",
    "password": "password12345"
  }
];

const seedUser = () => User.bulkCreate(userData);

module.exports = seedUser;