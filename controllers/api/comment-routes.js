const router = require('express').Router();
const { Comment, User } = require('../../models');

router.get('/', (req, res) => {
    console.log('===============');
    Comment.findAll({
        attributes: ['id', 'comment_text', 'user_id', 'post_id'],
        order: [['created_at', 'ASC']],
        // include: [
        //     {
        //         model: User,
        //         attribute: ['username']
        //     }
        // ]
    })
        .then(commentData => res.json(commentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

router.post('/', (req, res) => {

    if(req.session) {

        Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.session.user_id,
        post_id: req.body.post_id
    })
        .then(commentData => res.json(commentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });

    }

    
});

router.delete('/:id', (req, res) => {

    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(commentData => {
        if(!commentData) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }
        res.json(commentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

module.exports = router;