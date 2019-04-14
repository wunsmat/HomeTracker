const express = require('express');
const router = express.Router();
const DB = require('../db');

const url = 'mongodb://localhost:27017';

router.get('/', function(req, res) {
    findAndRender(res);
});

router.post('/add', function(req, res) {
    var newAnime = { 
        name: req.body.newAnime,
        completed: false
    };
    const database = new DB;
    database.connect(url)
        .then(() => {
            database.addDocument('anime', newAnime);
        })
        .catch((err) => {
            console.log('Anime failed to connect: ' + err.message);
        })
        .finally(() => {
            database.close();
            res.redirect('/anime');
        });
});

router.post('/remove', function(req, res) {
    const idSelect = req.body.idSelect;
    const database = new DB;
    database.connect(url)
        .then(() => {
            if (Array.isArray(idSelect)) {
                database.deleteDocumentByIdList('anime', idSelect);
            } else {
                database.deleteDocumentById('anime', idSelect);
            }
        })
        .catch((err) => {
            console.log('Anime failed to connect: ' + err.message);
        })
        .finally(() => {
            database.close();
            res.redirect('/anime');
        });
});

router.post('/complete', function(req, res) {
    updateCompleted(req, res, true);
});

router.post('/watch', function(req, res) {
    updateCompleted(req, res, false);
});

const updateCompleted = (req, res, completed) => {
    const idSelect = req.body.idSelect;
    const database = new DB;
    database.connect(url)
        .then(() => {
            const collection = database.getCollection('anime');
            const updateValue = {$set: {completed: completed}};
            if (Array.isArray(idSelect)) {
                const query = database.generateIdListQuery(idSelect);
                collection.updateMany(query, updateValue);
            } else {
                const query = database.generateIdQuery(idSelect);
                collection.updateOne(query, updateValue);
            }
        })
        .catch((err) => {
            console.log('Anime failed to connect: ' + err.message);
        })
        .finally(() => {
            database.close();
            res.redirect('/anime');
        });
};

const findAndRender = (res, database = new DB) => {
    database.connect(url, { useNewUrlParser: true })
        .then(() => {
            database.getDocuments('anime')
                .then((docs) => {
                    res.render('anime', {
                        title: 'Anime To Watch',
                        anime: docs
                    });
                })
                .catch((err) => {
                    console.log('Failed to get anime docs: ' + err.message);
                });
        })
        .catch((err) => {
            console.log('Anime failed to connect: ' + err.message);
        })
        .finally(() => {
            database.close();
        });
};

module.exports = router;