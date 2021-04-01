// const router = require('express').Router();
// const { Blog, User, Comment } = require('../models');
// const withAuth = require('../utils/auth');

// // get all blogs
// // todo edit a blog ie add comment

// // get all of the blogs for dashboard page, with auth, using session id
// router.get('/', withAuth, async (req, res) => {
//     try {
//         const blogData = await Blog.findAll({
//             where: {
//                 user_id: req.session.user_id
//             },
//             include: [
//                 {
//                     model: Comment,
//                 },
//                 {
//                     model: User,
//                     attributes: ['user_name']
//                 }
//             ]

//             // include: [
//             //     {
//             //         model: Comment,
//             //         include: 
//             //             {
//             //                 model: User,
//             //                 attributes: ['user_name'],
//             //             }
//             //     },
//             //     {
//             //         model: User
//             //     },
//             // ],
//         });

//         // serialize data
//         const blogs = blogData.map((blog) => blog.get({ plain: true }));

//         // return blogs
//         res.render('dashboard', {
//             blogs,
//             logged_in: req.session.logged_in
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });



// module.exports = router;

const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
router.get('/', withAuth, (req, res) => {
    Blog.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'title',
                'content',
                'date_created'
            ],
            include: [{
                    model: Comment,
                    attributes: ['id', 'text', 'blog_id', 'user_id', 'date_created'],
                    include: {
                        model: User,
                        attributes: ['user_name']
                    }
                },
                {
                    model: User,
                    attributes: ['user_name']
                }
            ]
        })
        .then(blogData => {
            const blogs = blogData.map(blog => blog.get({ plain: true }));
            res.render('dashboard', { blogs, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
router.get('/edit/:id', withAuth, (req, res) => {
    Blog.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id',
                'title',
                'content',
                'date_created'
            ],
            include: [{
                    model: User,
                    attributes: ['user_name']
                },
                {
                    model: Comment,
                    attributes: ['id', 'text', 'blog_id', 'user_id', 'date_created'],
                    include: {
                        model: User,
                        attributes: ['user_name']
                    }
                }
            ]
        })
        .then(blogData => {
            if (!blogData) {
                res.status(404).json({ message: 'No blog found with this id' });
                return;
            }

            const blog = blogData.get({ plain: true });
            res.render('edit-blog', { blog, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})
router.get('/new', (req, res) => {
    res.render('new-blog');
});



module.exports = router;