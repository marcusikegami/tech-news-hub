const router = require('express').Router();
const { User, Post, Vote } = require('../../models');
//SELECT * FROM users;
router.get('/', (req, res) =>{
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
//SELECT * FROM users WHERE id = 1
router.get('/:id', (req, res) => {
    User.findOne({
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ],
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});;
//INSERT INTO users
// (username, email, password)
// VALUES
//   ("Lernantino", "lernantino@gmail.com", "password1234");
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });  
});

router.post('/login', (req, res) => {
// expects {email: 'lernantino@gmail.com', password: 'password1234'}
User.findOne({
    where: {
        email: req.body.email
    }
}).then(dbUserData => {
    
    if(!dbUserData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
    }
    const validPassword = dbUserData.checkPassword(req.body.password);
    if(!validPassword) {
        res.status(400).json({ message: 'Incorrect password.'});
        return;
    }

    res.json({ user: dbUserData, message: 'You are now logged in!' });
});

});

// UPDATE users
// SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
// WHERE id = 1;
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
      .then(dbUserData => {
          if(!dbUserData[0]) {
              res.status(404).json({ message: 'No user found with this id' });
              return;
          }
          res.json(dbUserData);
      })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
      .then(dbUserData => {
          if(!dbUserData) {
              res.status(4040).json({ message: 'No user found with this id' });
              return;
          }
          res.json(dbUserData);
      })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        }) ;
});

module.exports = router;