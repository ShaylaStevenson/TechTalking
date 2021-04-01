const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all comments
// create comment

// get all of the comments
router.get('/', (req, res) => {
    Comment.findAll({})
        .then(commentData => res.json(commentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// create comment
router.post('/', withAuth, (req, res) => {
    if (req.session) {
        Comment.create({
                text: req.body.text,
                post_id: req.body.blog_id,
                user_id: req.session.user_id,
            })
            .then(commentData => res.json(commentData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    }
});


module.exports = router;