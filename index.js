var express = require("express");
var passport = require("passport")
var keys = require('./config/keys')
const GoogleStrategy = require("passport-google-oauth20").Strategy
var app = express();


// passport.use() - telling passport to be aware of a new strategy available
// new GoogleStrategy() - Creates a new google passport stratety instance for passport to use. Config goes into the contructor ().
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done)=>{
        console.log('access token: ', accessToken);
        console.log('refresh token: ', refreshToken);
        console.log('profile token: ', profile);
    })
);


// - The GoogleStrategy() instance has some code in it which looks out for the 'google' string when using the passport.authenticate
//      method below. Read docs for finding which string to use here for other auth providers (e.g. facebook)
// - The passport.authenticate takes in the passport strategty we want to use, then a scope of the stuff that we want from that login
//      e.g. the users profile and email. Check docs for available scope options
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google')
);

const PORT = process.env.PORT || 8000
app.listen(PORT);