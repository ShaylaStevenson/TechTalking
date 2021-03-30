// base code referenced from ecom backend homework
const { Comment } = require('../models');

const commentData = [
  {
    "blog_id": 1,
    "user_id": 3,
    "text": "I don't remember waht concerts are anymore."
  },
  {
    "blog_id": 1,
    "user_id": 4,
    "text": "I agree."
  },
  {
    "blog_id": 2,
    "user_id": 1,
    "text": "This is a comment."
  },
  {
    "blog_id": 3,
    "user_id": 2,
    "text": "What do you mean."
  },
  {
    "blog_id": 4,
    "user_id": 2,
    "text": "Here are some words."
  },
]

const seedComment = () => Comment.bulkCreate(commentData);

module.exports = seedComment;