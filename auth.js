import bcrypt from 'bcrypt';
import { compare } from "bcrypt";
import passport from 'passport';
import { Strategy } from 'passport-local';
import { getUserById, getUserByEmail } from './model/user.model.js';

// Configuration générale de la stratégie.
// On indique ici qu'on s'attend à ce que le client
// envoie les variables "email" et "password" au
// serveur pour l'authentification.
const config = {
    usernameField: 'email',
    passwordField: 'password'
}

// Configuration de la stratégie d'authentification locale
passport.use(new Strategy(config, async (email, password, done) => {
    // S'il y a une erreur avec la base de données,
    // on retourne l'erreur au serveur

    try {
        // On récupère l'utilisateur dans la base
        // de données avec son adresse e-mail.
        const user = await getUserByEmail(email);

        // Si on ne trouve pas l'utilisateur, on
        // retourne que l'authentification a échoué
        // avec un code d'erreur.
        if (!user) {
            return done(null, false, { error: 'Utilisateur non trouvé' });
        }

        if (!user.password) {
            return done(null, false, { error: 'Mot de passe invalide en base' });
        }

        // Si l'utilisateur a un status qui ne pas actif

        if (user.status !== 'actif') {
            return done(null, false, { error: 'Votre compte a été bloqué' });
        }


        // Si on a trouvé l'utilisateur, on compare
        // son mot de passe dans la base de données
        // avec celui envoyé au serveur.
        const validPassword = await bcrypt.compare(password, user.password);
        console.log("EMAIL:", email);
        console.log("USER:", user);
        // Si les mots de passe ne concordent pas, on
        // retourne que l'authentification a échoué
        // avec un code d'erreur.

        if (!validPassword) {
            return done(null, false, { error: 'Mot de passe incorrect' });
        }


        // Si les mots de passe concordent, on retourne
        // les informations de l'utilisateur au serveur.
        return done(null, user);




    } catch (error) {
        return done(error);
    }
}));

// Sérialisation de l'utilisateur dans la session.
passport.serializeUser((user, done) => {
    // On met uniquement l'identifiant dans la session.
    done(null, user.id);
});

// Désérialisation de l'utilisateur depuis la session.
passport.deserializeUser(async (id, done) => {
    // S'il y a une erreur de base de données, on
    // retourne l'erreur au serveur.
    try {
        // Puisqu'on a juste l'identifiant dans la 
        // session, on doit être capable d'aller chercher 
        // l'utilisateur avec celui-ci dans la base de 
        // données.
        const user = await getUserById(id);

        // Si on trouve l'utilisateur, on retourne ses
        // informations au serveur.
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
