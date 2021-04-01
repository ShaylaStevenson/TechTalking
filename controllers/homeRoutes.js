// const router = require('express').Router();
// const { Blog, User, Comment } = require('../models');
// const withAuth = require('../utils/auth');

// // get all blogs
// // get blog by id
// // login
// // signup

// // get all blogs to display when visiting homepage
// router.get('/', async (req, res) => {
//   try {
//     const blogData = await Blog.findAll({
//       include:[
//         {
//           model: User,
//           attributes: ['user_name'],
//         },
//       ],
//     });

//     // serialize data
//     const blogs = blogData.map((blog) => blog.get({ plain: true }));

//     // pass serialized data and session flag into template
//     res.render('homepage', {
//       blogs,
//       logged_in: req.session.logged_in
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // get the page showing a single blog
// router.get('/blog/:id', withAuth, async (req, res) => {
//   try {
//     const blogData = await Blog.findByPk(req.params.id, {
//       include: [
//         {
//           model: User,
//           attributes: ['user_name'],
//         },
//         {
//           model: Comment,
//           attributes: ['user_id', 'date_created', 'text'],
//           include: {
//             model: User,
//             attributes: ['user_name']
//           }
//         }
//       ],
//     });

//     // serialize the data
//     const blog = blogData.get({ plain: true });

//     // return blog
//     res.render('blog', {
//       ...blog,
//       logged_in: req.session.logged_in
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // login option
// router.get('/login', (req, res) => {
//   // if logged in already, send to homepage
//   if (req.session.logged_in) {
//     res.redirect('/');
//     return;
//   }

//   res.render('login');
// });

// // signup option
// router.get('/signup', (req, res) => {
//   // if logged in already, send to homepage
//   if (req.session.logged_in) {
//     res.redirect('/');
//     return;
//   }

//   res.render('signup');
// });

// module.exports = router;

const sequelize = require('../config/connection');
const { Blog, User, Comment } = require('../models');
const router = require('express').Router();
router.get('/', (req, res) => {
    Blog.findAll({
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
            res.render('homepage', { blogs, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/blog/:id', (req, res) => {
    Blog.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'content',
                'title',
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
            if (!blogData) {
                res.status(404).json({ message: 'No blog found with this id' });
                return;
            }
            const blog = blogData.get({ plain: true });
            console.log(blog);
            res.render('single-blog', { blog, loggedIn: req.session.loggedIn });


        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
router.get('/blogs-comments', (req, res) => {
    Blog.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'content',
                'title',
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
            if (!blogData) {
                res.status(404).json({ message: 'No blog found with this id' });
                return;
            }
            const blog = blogData.get({ plain: true });

            res.render('blogs-comments', { blog, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;