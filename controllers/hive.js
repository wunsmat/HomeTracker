const DB = require('../util/db');
const url = 'mongodb://localhost:27017';

exports.findAndRender = (res) => {
    const database = new DB;
    database.connect(url)
        .then(() => {
            database.getDocuments('players')
                .then((docs) => {
                    res.render('hive', {
                        title: 'Hive Scoreboard',
                        players: docs
                    });
                })
                .catch((error) => {
                    console.log('Failed to get players docs: ' + error.message);
                });
        })
        .catch((error) => {
            console.log('Hive failed to connect: ' + error.message);
        })
        .finally(() => {
            database.close();
        });
};

exports.updateWins = (req, res, amount) => {
    const name = req.params.name;
    const database = new DB;
    database.connect(url)
        .then(() => {
            database.getCollection('players')
                .updateOne({name}, {$inc: { wins: amount}})
                .then(() => {
                    res.redirect('/hive');
                });
            database.close();
        })
        .catch((error) => {
            console.log('Hive failed to connect: ' + error.message);
        })
        .finally(() => {
            database.close();
        });
};