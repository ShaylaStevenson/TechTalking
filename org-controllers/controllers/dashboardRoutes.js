const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// get all blogs
// create a blog
// edit a blog

// get all of the blogs, with auth, using session id
router.get('/', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.findAll({
            where: {
                user_id: req.session.user_id
            },
            include: [
                {
                    model: Comment,
                    include: 
                        {
                            model: User,
                            attributes: ['user_name'],
                        }
                },
                {
                    model: User
                },
            ],
        });

        // serialize data
        const blogs = blogData.map((blog) => blog.get({ plain: true }));

        // return blogs
        res.render('dashboard', {
            blogs,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;