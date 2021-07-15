const express = require('express');
const { check, validationResult, body } = require('express-validator');
const router = express.Router();
const helper = require('../config/helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


router.get('/', function(req, res) {
    helper.database.table('users')
        .withFields(['fname', 'lname', 'date', 'profile', 'typev', 'email', 'username', 'password', 'id'])
        .getAll().then((list) => {
            if (list.length > 0) {
                res.json({ users: list });
            } else {
                res.json({ message: 'NO USER FOUND' });
            }
        }).catch(err => res.json(err));
});
// LOGIN ROUTE
router.post('/log', [helper.hasAuthFields, helper.isPasswordAndUserMatch], (req, res) => {
    let token = jwt.sign({ state: 'true', email: req.body.email, username: req.body.username }, helper.secret, {
        algorithm: 'HS512',
        expiresIn: '4h'
    });
    res.json({ token: token, auth: true, email: req.body.email, username: req.body.username });
});

// REGISTER ROUTE
router.post('/register', [
    check('email').isEmail().not().isEmpty().withMessage('Field can\'t be empty')
    .normalizeEmail({ all_lowercase: true }),
    check('password').escape().trim().not().isEmpty().withMessage('Field can\'t be empty')
    .isLength({ min: 6 }).withMessage("must be 6 characters long"),
    body('email').custom(value => {
        return helper.database.table('users').filter({
            $or: [
                { email: value }
            ]
        }).get().then(user => {
            if (user) {
                console.log(user);
                return Promise.reject('Email / Username already exists, choose another one.');
            }
        })
    })
], async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        let fname = req.body.fname;
        let lname = req.body.lname;
        let date = req.body.date;
        let profile = req.body.profile;
        let typev = req.body.typev;
        let email = req.body.email;
        let username = req.body.username;
        let password = await bcrypt.hash(req.body.password, 10);

        helper.database.table('users').insert({
            fname: fname,
            lname: lname,
            date: date,
            profile: profile,
            typev: typev,
            email: email,
            username: username,
            password: password,
        }).then(lastId => {
            if (lastId > 0) {
                res.status(201).json({ message: 'vos coordonnées sont enregistrés avec succès' });
            } else {
                res.status(501).json({ message: 'Registration failed.' });
            }
        }).catch(err => res.status(433).json({ error: err }));
    }
});


/* vérifier l'adresse email */
router.post('/verif', async(req, res) => {
    const email = req.body.email;
    const user = await helper.database.table('users').filter({ email: email }).get()
        .then(user => {
            const match = (user.email);
            req.email = user.email;
            res.json({ message: `true` });
        });
});


//update//

router.post('/v/:email', async(req, res) => {
    let email = req.params.email;

    // Get the User ID from the parameter
    // Search User in Database if any
    let user = await helper.database.table('users').filter({ email: email }).get();
    if (user) {
        const salt = await bcrypt.genSalt(10); //await
        let pass = await bcrypt.hash(req.body.pass, 10);

        user.pass = await bcrypt.hash(user.pass, salt); // await
        // Replace the user's information with the form data ( keep the data as is if no info is modified )
        helper.database.table('users').filter({ email: email }).update({

            password: pass !== undefined ? pass : user.password
        });
        res.json({
            message: `chèr(e) utilisateur votre mot de passe à été changé avec succéss`
        });
    }
});




module.exports = router;