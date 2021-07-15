const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');
/* GET users listing. */


router.get('/', function(req, res) {
    database.table('users')
        .withFields(['fname', 'lname', 'date', 'profile', 'typev', 'email', 'username', 'password', 'id'])
        .getAll().then((list) => {
            if (list.length > 0) {
                res.json({ users: list });
            } else {
                res.json({ message: 'NO USER FOUND' });
            }
        }).catch(err => res.json(err));
});
/* GET ONE USER MATCHING ID */
router.get('/:userId', (req, res) => {
    let userId = req.params.userId;
    database.table('users').filter({ id: userId })
        .withFields(['fname', 'lname', 'date', 'profile', 'typev', 'email', 'username', 'password', 'id'])
        .get().then(user => {
            if (user) {
                res.json({ user });
            } else {
                res.json({ message: `NO USER FOUND WITH ID : ${userId}` });
            }
        }).catch(err => res.json(err));
});




module.exports = router;