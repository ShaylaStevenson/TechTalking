const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        // get all blogs
        const blogData = await Blog.findAll({
            where: {
                user_id: req.session.user_id
            },
            include: [
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ['user_name']
                    }
                },
            ],
        });

        // serialize date
        const blogs = blogData.map((blog) => blog.get({ plain: true}));

        // pass data into template
        res.render('dashboard', {
            blogs,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;