const passport = require('passport');
const UserModel = require('../Database/Schema/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Passport.js Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLECLIENTID,
            clientSecret: process.env.GOOGLECLIENTSECRET,
            callbackURL: '/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            UserModel.findOne({ googleId: profile.id }).then((existingUser) => {
                if (existingUser) {
                    done(null, existingUser);
                } else {
                    new UserModel({
                        googleId: profile.id,
                        name: profile.displayName,
                        photo: profile.photos[0].value
                    })
                        .save()
                        .then((user) => done(null, user));
                }
            });
        }
    )
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id).then((user) => {
        done(null, user);
    });
});

module.exports = passport;
