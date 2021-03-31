// base code from mini project
const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

// get all users
// get user by id
// create new user
// login
// logout

// get all users
router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll({
      include: [
        {
          model: Blog,
          attributes: ['title'],
        },
      ],
    });

    // serialize the data
    const users = userData.map((user) => user.get({ plain: true }));

    // pass serialized data and session flag into template
    res.render('/', {
      users,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user by id
router.get('/user/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [
        {
          model: Blog,
          attributes: ['title'],
        },
      ],
    });

    // serialize the data
    const user = user.data.get({ plain: true });

    // return user
    res.render('user', {
      ...user,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new user
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    // login to start session
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// login existing user
router.post('/login', async (req, res) => {
  try {
    // find saved user by user_name
    const userData = await User.findOne(
      {
        where: {
          user_name: req.body.user_name
        } 
      });

    // check for username
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    // check if input password matches stored password
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // login and start session
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.user_name = userData.user_name;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// logout and end session if logged in
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;