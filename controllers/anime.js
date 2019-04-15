const DB = require('../util/db');
const url = 'mongodb://localhost:27017';

exports.add = (req, res) => {
    const newAnime = { 
        name: req.body.newAnime,
        completed: false
    };
    const database = new DB;
    database.connect(url)
        .then(() => {
            database.addDocument('anime', newAnime);
        })
        .catch((error) => {
            console.log(`Anime failed to connect: ${error.message}`);
        })
        .finally(() => {
            database.close();
            res.redirect('/anime');
        });
};

exports.remove = (req, res) => {
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
        .catch((error) => {
            console.log(`Anime failed to connect: ${error.message}`);
        })
        .finally(() => {
            database.close();
            res.redirect('/anime');
        });
};

exports.updateCompleted = (req, res, completed) => {
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
        .catch((error) => {
            console.log(`Anime failed to connect: ${error.message}`);
        })
        .finally(() => {
            database.close();
            res.redirect('/anime');
        });
};

exports.findAndRender = (res, database = new DB) => {
    database.connect(url, { useNewUrlParser: true })
        .then(() => {
            database.getDocuments('anime')
                .then((docs) => {
                    res.render('anime', {
                        title: 'Anime To Watch',
                        anime: docs
                    });
                })
                .catch((error) => {
                    console.log(`Failed to get anime docs: ${error.message}`);
                });
        })
        .catch((error) => {
            console.log(`Anime failed to connect: ${error.message}`);
        })
        .finally(() => {
            database.close();
        });
};