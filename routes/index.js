
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const url = 'mongodb://localhost:27017';

mongoose.connect(url);

const Schema = mongoose.Schema;
const UserDetail = new Schema({
    username: String,
    password: String
});
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');

router.get('/login', function(req, res) {
    res.render('login', { title: 'Home Tracker' });
});

router.post('/login', function(req, res) {
    res.render('login', { title: 'Home Tracker' });
});

module.exports = router;
