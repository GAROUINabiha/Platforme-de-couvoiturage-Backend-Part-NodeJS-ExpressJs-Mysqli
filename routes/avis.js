const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');
const { validationResult } = require('express-validator');
const helper = require('../config/helpers');

router.get('/:Id', (req, res) => {
    let idd = req.params.Id;
    database.table('avis as a')
        .join([{
                table: "users as u",
                on: `u.email = a.email`
            },
            {
                table: "trajet as t",
                on: `t.id = a.idt`
            }
        ])
        .withFields(['u.email', 'u.profile', 'u.lname', 'u.fname', 't.id', 'a.comment', 'a.id'])

    .filter({ 't.id': idd })
        .get()
        .then(prod => {
            console.log(prod);
            if (prod) {
                res.status(200).json(prod);
            } else {
                res.json({ message: `No avis found with id ${idd}` });
            }
        }).catch(err => res.json(err));
});


router.get('/r/:iddd', (req, res) => {
    let idd = req.params.iddd;
    database.table('avis as a')
        .join([{
            table: "users as u",
            on: `u.email = a.email`
        }])
        .withFields(['u.email', 'u.profile', 'a.pseudo', 'a.comment', 'a.id'])
        .filter({ 'u.email': idd })
        .getAll()
        .then(prod => {
            console.log(prod);
            if (prod) {
                res.status(200).json({ avis: prod });
            } else {
                res.json({ message: `No avis found with id ${idd}` });
            }
        }).catch(err => res.json(err));
});

router.post('/n/:comment/:pseudo/:email', async(req, res) => {
    let comment = req.params.comment;
    let pseudo = req.params.pseudo;
    let email = req.params.email;
    // Get the User ID from the parameter
    // Search User in Database if any
    let user = await helper.database.table('avis').filter({
        comment: comment,
        pseudo: pseudo,
        email: email
    }).getAll();
    if (user) {
        helper.database.table('avis').filter({
            email: email
        }).insert({
            comment: comment !== undefined ? comment : comment.password,
            pseudo: pseudo !== undefined ? pseudo : user.pseudo,
            email: email !== undefined ? email : user.email
        });
        res.json({
            message: ` succéss`
        });
    }
});


module.exports = router;
s = router;