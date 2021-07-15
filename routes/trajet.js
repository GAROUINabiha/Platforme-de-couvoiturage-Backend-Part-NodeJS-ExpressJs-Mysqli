const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');
const { validationResult, body } = require('express-validator');
const helper = require('../config/helpers');
const querystring = require('querystring');


/* GET users listing. */
router.get('/', function(req, res) {
    database.table('trajet as t')
        .join([{
            table: "users as u",
            on: `u.email = t.email`
        }])
        .withFields(['u.email', 'u.fname', 'u.lname', 'u.typev', 'u.profile', 't.vdepart', 't.varrive', 't.date', 't.heure', 't.nbrep', 't.tarif', 't.checkArray', 't.id'])
        .getAll().then((list) => {
            if (list.length > 0) {
                res.json({ trajet: list });
            } else {
                res.json({ message: 'NO trajet FOUND' });
            }
        }).catch(err => res.json(err));
});
router.get('/count', function(req, res) {
    helper.database.table('trajet')
        .withFields(['id'])
        .count()
        .then(total => {
            res.json({
                nombre: total
            });
        })
});
router.get('/count2', function(req, res) {
    helper.database.table('users')
        .withFields(['id'])
        .count()
        .then(total => {
            res.json({ nombre: total });
        })

});


router.get('/:Id', (req, res) => {
    let trajetId = req.params.Id;
    helper.database.table('trajet as t')
        .join([{
            table: "users as u",
            on: `u.email = t.email`
        }])
        .withFields(['u.email', 'u.fname', 'u.lname', 'u.typev', 'u.profile', 't.vdepart', 't.varrive', 't.date', 't.heure', 't.nbrep', 't.tarif', 't.checkArray', 't.id'])

    .filter({ 't.id': trajetId })
        .get()
        .then(prod => {
            console.log(prod);
            if (prod) {
                res.status(200).json(prod);
            } else {
                res.json({ message: `No trajet found with id ${trajetId}` });
            }
        }).catch(err => res.json(err));
});

router.get('/v/:v/:a/:d', (req, res) => {
    let trajetId = req.params.v;
    let trajet = req.params.a;
    let trajetd = req.params.d;
    database.table('trajet as t')
        .join([{
            table: "users as u",
            on: `u.email = t.email`
        }])
        .withFields(['u.email', 'u.typev', 'u.profile', 't.vdepart', 't.varrive', 't.date', 't.heure', 't.nbrep', 't.tarif', 't.checkArray', 't.id'])

    .filter({ 't.vdepart': trajetId, 't.varrive': trajet, 't.date': trajetd })
        .getAll()
        .then(prod => {
            console.log(prod);
            if (prod) {
                res.status(200).json({ trajet: prod });
            } else {
                res.json({ message: `No trajet found!` });
            }
        }).catch(err => res.json(err));
});
//find by type v
router.get('/r/:v', (req, res) => {
    let trajetId = req.params.v;
    database.table('trajet as t')
        .join([{
            table: "users as u",
            on: `u.email = t.email`
        }])
        .withFields(['u.email', 'u.typev', 'u.profile', 't.vdepart', 't.varrive', 't.date', 't.heure', 't.nbrep', 't.tarif', 't.checkArray', 't.id'])
        .filter({ 'u.email': trajetId })
        .getAll()
        .then(prod => {
            console.log(prod);
            if (prod) {
                res.status(200).json({ trajet: prod });
            } else {
                res.json({ message: `No trajet found!` });
            }
        }).catch(err => res.json(err));
});
// REGISTER ROUTE
router.post('/new', async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        let email = req.body.email;
        let vdepart = req.body.vdepart;
        let varrive = req.body.varrive;
        let date = req.body.date;
        let heure = req.body.heure;
        let nbrep = req.body.nbrep;
        let tarif = req.body.tarif;
        let checkArray = JSON.stringify(req.body['checkArray']);
        helper.database.table('trajet')
            .insert({
                email: email,
                vdepart: vdepart,
                varrive: varrive,
                date: date,
                heure: heure || null,
                nbrep: nbrep || null,
                tarif: tarif,
                checkArray: checkArray.toString()
            }).then(lastId => {
                if (lastId > 0) {
                    res.status(201).json({ message: 'votre trajet a été publiée avec succès' });
                } else {
                    res.status(501).json({ message: 'vérifier vos informations.' });
                }
            }).catch(err => res.status(433).json({ error: err }));
    }
});






module.exports = router;
s = router;