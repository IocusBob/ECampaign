const passport = require('passport');


module.exports = (app) => {
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
    passport.authenticate('google'),
    (req, res) => {
        res.redirect('/surveys')
    });

    app.get('/api/current_user', (req, res) =>{
        res.send(req.user)
    });

    app.get('/api/logout', (req, res)=>{
        // .logout() is attached to the req object and it kills the users cookie, thus the user is "logged out".
        req.logout();
        res.redirect('/')
    });
};