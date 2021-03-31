const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all comments
// create comment

// get all of the comments, with auth
router.get('/', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findAll({});

        // serialize the data
        //const comments = commentData.map((comment) => comment.get({ plain: true }));

    } catch (err) {
        res.status(500).json(err);
    }
});

// create comment


module.exports = router;