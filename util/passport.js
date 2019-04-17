const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Player = require('../models/Player');

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password'
},
(name, password, done) => {
    Player.findOne({ name }, (error, player) => {
        if (error) { 
            return done(error); 
        }
        if (!player) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (!player.validatePassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, player);
    }).catch(done);
}));