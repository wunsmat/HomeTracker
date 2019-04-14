const express = require('express');
const router = express.Router();
const DB = require('../db');

const url = 'mongodb://localhost:27017';

/* GET users listing. */
router.get('/', function(req, res) {
    findAndRender(res);
});

router.post('/inc/:name', function(req, res) {
    const name = req.params.name;
    var database = new DB;
    database.connect(url)
        .then(() => {
            database.getCollection('players').updateOne({name}, {$inc: { wins: 1}}).then(() => {
                res.redirect('/hive');
            });
            database.close();
        });
});

router.post('/dec/:name', function(req, res) {
    const name = req.params.name;
    var database = new DB;
    database.connect(url)
        .then(() => {
            database.getCollection('players').updateOne({name}, {$inc: { wins: -1}}).then(() => {
                res.redirect('/hive');
            });
            database.close();
        });
});

function findAndRender(res) {
    var database = new DB;
    database.connect(url)
        .then(() => {
            database.getDocuments('players')
                .then((docs) => {
                    res.render('hive', {
                        title: 'Hive Scoreboard',
                        players: docs
                    });
                    database.close();
                })
                .catch((err) => {
                    console.log('Failed to get players docs: ' + err.message);
                });
        })
        .catch((err) => {
            console.log('Hive failed to connect: ' + err.message);
        });
}

module.exports = router;
