var express = require('express');
var router = express.Router();

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function (user, done) {
    // console.log('---serializeUser---')
    // console.log(user)
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    // console.log('---deserializeUser---')
    done(null, obj);
});


/* GET auth. */
passport.use(new GitHubStrategy({
    clientID: '6daabcd30ad3751793ff',
    clientSecret: '91d62eaa37f9a0cdca5acee1db3b27208b38f7a8',
    // callbackURL: "http://post.hunger-valley.com/auth/github/callback"
    callbackURL: "http://127.0.0.1:5000/auth/github/callback"    
},
    function (accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        // });
        done(null, profile);
    }
));


router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
})

router.get('/github',
    passport.authenticate('github')
);

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        // console.log(req);
        
        req.session.user = {
            id: req.user.id,
            username: req.user.displayName || req.user.username,
            avatar: req.user._json.avatar_url,
            provider: req.user.provider
        };
        res.redirect('/');
});
module.exports = router;