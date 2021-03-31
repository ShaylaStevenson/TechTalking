const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// get all projects to display when visiting page
router.get('/', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include:[
        {
          model: User,
          attributes: ['user_name'],
        },
      ],
    }),

    // serialize data
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    // pass serialized data and session flag into template
    res.render('homepage', {
      blogs,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a blog by id
router.get('/blog/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['user_name'],
        },
      ],
    });

    const blog = blogData.get({ plain: true });

    res.render('blog', {
      ...blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// login option
router.get('/login', (req, res) => {
  // if logged in already, send to homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// signup option
router.get('/signup', (req, res) => {
  // if logged in already, send to homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

module.exports = router;