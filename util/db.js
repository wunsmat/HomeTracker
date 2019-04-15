const { MongoClient, ObjectID } = require('mongodb');

class DB {
    constructor() {
        this.client = null;
        this.db = null;
    }
    connect(uri, options) {
        const _this = this;
        options = Object.assign({useNewUrlParser: true} , options);
        return new Promise((resolve, reject) => {
            if (_this.client && _this.db) {
                resolve();
            } else {
                MongoClient.connect(uri, options)
                    .then(function (client) {
                        _this.client = client;
                        _this.db = client.db('home-tracker');
                        resolve();
                    })
                    .catch(function (error) {
                        console.error('Error connecting: ' + error.message);
                        reject(error.message);
                    });
            }
        });
    }

    getDocuments(coll) {
        const _this = this;
        return new Promise((resolve, reject) => {
            _this.getCollection(coll)
                .find()
                .toArray()
                .then((docs) => resolve(docs))
                .catch((error) => {
                    console.error(`Failed to retrieve documents: ${error.message}`);
                    reject(error.message);
                });
        });
    }

    addDocument(coll, doc) {
        const _this = this;
        return new Promise((resolve, reject) => {
            _this.getCollection(coll)
                .insertOne(doc)
                .then(() => resolve())
                .catch((error) => {
                    console.error('Failed to insert document: ' + error.message);
                    reject(error.message);
                });
        });
    }

    deleteDocumentByIdList(coll, idList) {
        const _this = this;
        const query = _this.generateIdListQuery(idList);
        return new Promise((resolve, reject) => {
            _this.getCollection(coll)
                .deleteMany(query)
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    console.error(`Failed to delete documents: ${error.message}`);
                    reject(error.message);
                });
        });
    }

    deleteDocumentById(coll, id) {
        const _this = this;
        const query = _this.generateIdQuery(id);
        return new Promise((resolve, reject) => {
            _this.getCollection(coll)
                .deleteOne(query)
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    console.error(`Failed to delete document: ${error.message}`);
                    reject(error.message);
                });
        });
    }

    getCollection(coll) {
        return this.db.collection(coll);
    }

    countDocuments(coll) {
        const _this = this;
        return new Promise((resolve, reject) => {
            _this.getCollection(coll)
                .count()
                .then((count) => resolve(count))
                .catch((error) => {
                    console.error(`countDocuments failed: ${error.message}`);
                    reject(error.message);
                });
        });
    }
    close() {
        if (this.client) {
            this.client.close()
                .then(() => { })
                .catch((error) => {
                    console.error(`Failed to close the database: ${error.message}`);
                });
        }
    }

    generateIdListQuery(idList) {
        return { 
            _id: { 
                $in: this.toObjectIdList(idList)
            }
        };
    }

    generateIdQuery(id) {
        return { 
            _id: this.toObjectId(id) 
        };
    }

    toObjectIdList(idList) {
        return idList.map(id => this.toObjectId(id));
    }

    toObjectId(id) {
        return new ObjectID(id);
    }
}

module.exports = DB;
