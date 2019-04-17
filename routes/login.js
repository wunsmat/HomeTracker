const passport = require('passport');
const express = require('express');
const router = express.Router();
const loggedIn = require('../middleware/auth').loggedIn;
const Player = require('../models/Player');

router.get('/', function(req, res) {
    res.render('login', { title: 'Home Tracker' });
});

router.get('/login', function(req, res) {
    res.render('login', { title: 'Home Tracker' });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, player) => {
        if (error) {
            next(error);
        }
        if (player) {
            req.login(player, (error) => {
                if (error) {
                    next(error);
                }
                res.redirect('/anime');
            });
        }
    })(req, res, next);
});

router.post('/signup', function(req, res, next) {
    passport.authenticate('local', (error, player) => {
        if (error) {
            next(error);
        }
        if (player) {
            next('Player already exists in database');
        }
        const name = req.body.name;
        const password = req.body.password;
        if (!name) {
            next('Username is required');
        } else if (!password) {
            next('Password is required');
        } else {
            const player = new Player({
                name, 
                password, 
                wins: 0
            });
            player.save();
            req.login(player, (error) => {
                if (error) {
                    next(error);
                }
                res.redirect('/anime');
            });
        }
    })(req, res, next);
});

router.get('/terminate', loggedIn, function(req, res, next) {
    Player.deleteOne(req.user, (error) => {
        next(error);
    });
    res.redirect('/login');
});

router.get('/logout', loggedIn, function(req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
