// const router = require('express').Router();
// const { Blog } = require('../../models');
// const withAuth = require('../../utils/auth');

// // get all blogs
// // get blog by id
// // create a blog
// // edit blog
// // delete blog
 
// // create a new blog
// router.post('/', withAuth, async (req, res) => {
//   try {
//     const newBlog = await Blog.create({
//       ...req.body,
//       user_id: req.session.user_id,
//     });

//     res.status(200).json(newBlog);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

// // delete a blog
// router.delete('/:id', withAuth, async (req, res) => {
//   try {
//     const blogData = await Blog.destroy({
//       where: {
//         id: req.params.id,
//         user_id: req.session.user_id,
//       },
//     });

//     if (!blogData) {
//       res.status(404).json({ message: 'No blogs found with this id!' });
//       return;
//     }

//     res.status(200).json(blogData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;

const router = require('express').Router();
const { Blog, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    console.log('======================');
    Blog.findAll({
            attributes: ['id',
                'title',
                'content',
                'date_created'
            ],
            order: [
                ['date_created', 'DESC']
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
        .then(blogData => res.json(blogData.reverse()))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});
router.get('/:id', (req, res) => {
    Blog.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id',
                'content',
                'title',
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
            res.json(blogData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', withAuth, (req, res) => {
    Blog.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id
        })
        .then(blogData => res.json(blogData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.put('/:id', withAuth, (req, res) => {
    Blog.update({
            title: req.body.title,
            content: req.body.content
        }, {
            where: {
                id: req.params.id
            }
        }).then(blogData => {
            if (!blogData) {
                res.status(404).json({ message: 'No blog found with this id' });
                return;
            }
            res.json(blogData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
router.delete('/:id', withAuth, (req, res) => {
    Blog.destroy({
        where: {
            id: req.params.id
        }
    }).then(blogData => {
        if (!blogData) {
            res.status(404).json({ message: 'No blog found with this id' });
            return;
        }
        res.json(blogData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;