const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    console.log('Google profile received:', profile);
    try {
        // Buscar usuario por email
        let user = await authModel.findUserByEmail(profile.emails[0].value);

        // Si no existe, crear usuario de Google
        if (!user) {
            console.log('Creando nuevo usuario de Google');
            user = await authModel.createGoogleUser(
                profile.displayName,
                profile.emails[0].value,
                profile.id
            );
        }

        // Generar JWT
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        return done(null, { user, token });
        
    } catch (error) {
        console.error('Error en la estrategia de Google:', error.message);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});