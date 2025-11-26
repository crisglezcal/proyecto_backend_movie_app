const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');
require('dotenv').config();

// Configuración dinámica del callback URL
const isProduction = process.env.NODE_ENV === 'production';
const callbackURL = isProduction 
    ? 'https://ejercicio-api-rest-sql-entries-authors-q822.onrender.com/google/callback'
    : 'http://localhost:3000/google/callback';

console.log('🔧 ===== CONFIGURACIÓN GOOGLE OAUTH =====');
console.log('📍 Entorno:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
console.log('🌐 Callback URL:', callbackURL);
console.log('🔑 Client ID existe:', !!process.env.GOOGLE_CLIENT_ID);
console.log('🔒 Client Secret existe:', !!process.env.GOOGLE_CLIENT_SECRET);
console.log('==========================================');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL, // ← URL dinámica
}, async (accessToken, refreshToken, profile, done) => {
    console.log('🎯 Google profile received:', {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value,
        provider: profile.provider
    });
    
    try {
        // Verificar que tenemos email
        if (!profile.emails || !profile.emails[0]) {
            console.log('❌ ERROR: No email provided by Google');
            return done(new Error('No email provided by Google'), null);
        }

        const email = profile.emails[0].value;
        const name = profile.displayName || 'Google User';
        const googleId = profile.id;

        console.log('🔍 Buscando usuario con email:', email);

        // Buscar usuario por email
        let user = await authModel.findUserByEmail(email);
        
        if (!user) {
            console.log('🆕 Creando nuevo usuario de Google');
            user = await authModel.createGoogleUser(name, email, googleId);
            console.log('✅ Usuario creado:', user.email);
        } else {
            console.log('✅ Usuario existente encontrado:', user.email);
            
            // Si el usuario existe pero no tiene google_id, actualizarlo
            if (!user.google_id) {
                console.log('🔄 Actualizando usuario existente con Google ID');
                user = await authModel.updateUserWithGoogleId(user.id, googleId);
            }
        }

        // Generar JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                name: user.name,
                role: user.role 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        console.log('🎉 Autenticación Google EXITOSA para:', user.email);
        
        return done(null, { user, token });
        
    } catch (error) {
        console.error('💥 ERROR en Google Strategy:', error.message);
        console.error('Stack trace:', error.stack);
        return done(error, null);
    }
}));

passport.serializeUser((data, done) => {
    console.log('📦 Serializing user:', data.user.email);
    done(null, data.user.id); // Solo guardar el ID
});

passport.deserializeUser(async (id, done) => {
    console.log('📤 Deserializing user ID:', id);
    try {
        const user = await authModel.findUserById(id);
        if (!user) {
            console.log('❌ User not found during deserialize');
            return done(new Error('User not found'), null);
        }
        console.log('✅ User deserialized:', user.email);
        done(null, user);
    } catch (error) {
        console.error('💥 Error deserializing user:', error);
        done(error, null);
    }
});

console.log('✅ Google OAuth configurado correctamente');

// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const jwt = require('jsonwebtoken');
// const authModel = require('../models/authModel');
// require('dotenv').config();

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL,
// }, async (accessToken, refreshToken, profile, done) => {
//     console.log('Google profile received:', profile);
//     try {
//         // Buscar usuario por email
//         let user = await authModel.findUserByEmail(profile.emails[0].value);

//         // Si no existe, crear usuario de Google
//         if (!user) {
//             console.log('Creando nuevo usuario de Google');
//             user = await authModel.createGoogleUser(
//                 profile.displayName,
//                 profile.emails[0].value,
//                 profile.id
//             );
//         }

//         // Generar JWT
//         const token = jwt.sign(
//             { id: user.id, role: user.role }, 
//             process.env.JWT_SECRET, 
//             { expiresIn: '1h' }
//         );
        
//         return done(null, { user, token });
        
//     } catch (error) {
//         console.error('Error en la estrategia de Google:', error.message);
//         return done(error, null);
//     }
// }));

// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((user, done) => {
//     done(null, user);
// });