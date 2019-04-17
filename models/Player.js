const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/home-tracker';
mongoose.connect(url, {useNewUrlParser: true});

const playerSchema = new mongoose.Schema({
    name: String,
    password: String
});

playerSchema.methods.validatePassword = function(password) {
    return this.password === password;
};

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;