// Importation des librairies nécessaires
import dotenv from 'dotenv';

import express, { json, response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import session from 'express-session';
import pgSession from "connect-pg-simple";
import { pool } from "./db.js";
import cloudinary from "./cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import passport from 'passport';
import multer from 'multer';
import path from 'path';
import { engine } from 'express-handlebars';

// =================================
// Importation des routes
import { createUser, getusers, updateUser, deleteUser, getUserById } from './model/user.model.js';
import { createArticle, getArticles, getArticleById, updateArticle, deleteArticle, getArticleStatusCounts, getArticleCountByCategory, getArticleByStatus, getArticleByStatusBrouillons, getArticlesForRedacteur, incrementArticleViews, getAticleViewsByIdArticle } from './model/article.model.js';
import { createCategorie, getCategories, getCategorieById, updateCategorie, deleteCategorie } from './model/categorie.model.js';
import { createSubCategorie, getSubCategories, getSubCategorieById, updateSubCategorie, getSubCategoriesByCategoryId } from './model/sub.categorie.model.js';
import {
    usernameValidationMiddleware,
    emailValidationMiddleware,
    passwordValidationMiddleware,
    firstNameValidationMiddleware,
    lastNameValidationMiddleware,
    phoneValidationMiddleware,
    addressHomeValidationMiddleware,
    postalCodeValidationMiddleware
} from './middlewares/validation.middlewares.js';
import { isAuthenticated, isAdmin, isRedacteur } from './middlewares/validation.routes.middlewares.js';
import './auth.js';
import { request } from 'http';
import { title } from 'process';
import { error } from 'console';

// Configuration de l'environnement
dotenv.config();

// Création d'un serveur Express.
const app = express();

app.use((req, res, next) => {

    const ua = req.headers['user-agent'] || '';




    if (
        ua.includes('facebookexternalhit') ||
        ua.includes('Facebot')
    ) {
        console.log("FACEBOOK BOT DETECTE");
    }


    next();
});



// Configuration de la session
const PgSession = pgSession(session);

// Référence : configuration de Multer pour téléverser les images des articles.
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "informez-vous",
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
});

const assets = multer({ storage });

// Référence : configuration du moteur de rendu Handlebars.
app.engine('handlebars', engine(
    {
        helpers: {
            eq: function (a, b) {
                return a === b
            },
            or: function (a, b) {
                return a || b
            },
            sup: function (a, b) {
                return  Number(a) > Number(b)
            },
            eqs: function (a, b) {
                return Number(a) === Number(b)
            }
        }
    }
));
app.set('view engine', 'handlebars');
app.set('views', './views');



// Middlewares pour la sécurité, la compression et le CORS
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
    contentSecurityPolicy:
    {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https:",
                "http:",
                "https://unpkg.com", "https://cdn.jsdelivr.net", "https://cdn.ckeditor.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdn.jsdelivr.net", "https://cdn.ckeditor.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https:",
                "http:",
                "https://unpkg.com", "https://cdn.jsdelivr.net", "https://cdn.ckeditor.com"],
            faviconSrc: ["'self'", "data:"]
        }
    }
}));

app.use(compression());
app.use(cors({
    origin: [
        "http://localhost:5000",
        "http://192.168.2.175:5000",
        "https://informez-vous-cd.onrender.com"
    ],
    credentials: true
}));
app.use(json());
app.use(express.static('public'));
app.use('/assets', express.static('assets'));
const store = new PgSession({
    pool: pool,
    tableName: "session",
    createTableIfMissing: true
});
app.use(session({
    cookie: {
        maxAge: 1000 * 60 * 60

    },
    name: process.env.npm_package_name,
    store: store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    secret: process.env.SESSION_SECRET
}))
app.use(passport.initialize());
app.use(passport.session());
// ===== Désactiver le cache =====
app.use((request, response, next) => {
    response.set('Cache-Control', 'no-cache, private, must-revalidate');
    response.set('Pragma', 'no-cache');
    response.set('Expires', '0');
    next();
});

app.use((request, response, next) => {

    response.locals.title = 'INFORMEZ-VOUS.CD';

    response.locals.description =
        'Actualités fiables, rapides et diversifiées.';

    response.locals.image =
"https://informez-vous-cd.onrender.com/assets/logo.jpeg";

    response.locals.url =
        `${request.protocol}://${request.get('host')}${request.originalUrl}`;

    next();
});


// Création des routes.
//========= DÉBUT ROUTES UTILISATEURS ========================
/**
 * Route pour récupérer tous les utilisateurs
*/
app.get('/api/users', async (request, response) => {
    const users = await getusers();

    if (users == null || users.length === 0) {
        return response.status(404).json({ error: 'Aucun utilisateur trouvé' });
    }
    response.status(200).json({ message: 'Utilisateurs récupérés avec succès', users });
});
app.get('/api/users/:id', async (request, response) => {
    const { id } = request.params;
    const users = await getUserById(id);

    if (users == null || users.length === 0) {
        return response.status(404).json({ error: 'Aucun utilisateur trouvé' });
    }
    response.status(200).json({ message: 'Utilisateurs récupérés avec succès', users });
});
/**
 * Route pour mettre à jour un utilisateur
 */
app.patch('/api/users/:id', async (request, response) => {

    const { id } = request.params;
    let { username, email, password, role, status, first_name, last_name, phone, address_home, city, postal_code, country } = request.body;
    if (!password || password.trim() === '') {
        password = null;
    }

    if (username === '' || email === '' || status === '' || first_name === '' || last_name == '' || phone === '' || address_home === '' || city === '' || postal_code === '') {
        return response.status(400).json({
            error: 'Tous les champs sont requis'
        });
    }

    const userData = { username, email, password, role, status, first_name, last_name, phone, address_home, city, postal_code, country };
    const userUpdated = await updateUser(id, userData);

    if (!userUpdated) {
        return response.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    response.status(200).json({ message: 'Utilisateur mis à jour avec succès', userUpdated });
});
/**
 * Route pour supprimer un utilisateur
 */
app.delete('/api/users/:id', async (request, response) => {
    try {

        const { id } = request.params;

        const userDeleted = await deleteUser(id);

        response.status(200).json({
            message: 'Utilisateur supprimé avec succès',
            userDeleted
        });

    } catch (error) {

        response.status(404).json({
            error: 'Utilisateur non trouvé'
        });

    }
});
//========= FIN ROUTES UTILISATEURS ========================
/**
 * 
 * 
 * 
 */
//========= DÉBUT ROUTES CATÉGORIES ========================
app.post('/api/categories', async (request, response) => {
    try {
        const { name, slug } = request.body;

        if (name === '') {
            return response.status(400).json({
                error: 'Le nom de la catégorie est requis'
            });
        }

        const categorieData = { name };
        const categorieCreated = await createCategorie(categorieData);

        if (!categorieCreated) {
            return response.status(500).json({ error: 'Erreur lors de la création de la catégorie' });
        }

        response.status(201).json({ message: 'Catégorie créée avec succès', categorieCreated });
    } catch (error) {
        // Duplication PostgreSQL
        if (error.code === '23505') {
            return response.status(400).json({
                error: 'Cette catégorie existe déjà'
            });
        }

        response.status(500).json({
            error: 'Erreur serveur'
        });
    }

})

app.get('/api/categories', async (request, response) => {
    const categories = await getCategories();
    if (categories == null || categories.length === 0) {
        return response.status(200).json({ categories: [] });
    }

    return response.status(200).json({ message: 'Catégories récupérées avec succès', categories });

});

app.get('/api/categories/:id', async (request, response) => {
    const { id } = request.params;
    const categorie = await getCategorieById(id);

    if (!categorie) {
        return response.status(404).json({ error: 'Catégorie non trouvée' });
    }

    response.status(200).json({ message: 'Catégorie récupérée avec succès', categorie });
});

app.patch('/api/categories/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { name, slug } = request.body;

        if (name === '') {
            return response.status(400).json({
                error: 'Le nom de la catégorie est requis'
            });
        }
        const categorieData = { name, slug };
        const categorieUpdated = await updateCategorie(id, categorieData);

        if (!categorieUpdated) {
            return response.status(404).json({ error: 'Catégorie non trouvée' });
        }

        response.status(200).json({ message: 'Catégorie mise à jour avec succès', categorieUpdated });
    } catch (error) {
        if (error.code === '23505') {
            return response.status(409).json({
                error: 'Cette catégorie existe déjà'
            });
        }

        return response.status(500).json({
            error: 'Erreur serveur'
        });
    }
});
app.delete('/api/categories/:id', async (request, response) => {
    const { id } = request.params

    const result = await deleteCategorie(id)

    response.status(200).json({ message: "catégorie supprimée" })
})

//========= FIN ROUTES CATEGORIES ========================
/**
 * 
 * 
 * 
 */
//========= DÉBUT ROUTES SOUS-CATÉGORIES ========================
app.post('/api/sub-categories', async (request, response) => {
    try {
        const { categorie_id, name, slug } = request.body;

        if (name === '' || !categorie_id) {
            return response.status(400).json({
                error: 'Le nom de la sous-catégorie et de la catégorie parent sont requis'
            });
        }

        const subCategorieData = { categorie_id, name, slug };
        const subCategorieCreated = await createSubCategorie(subCategorieData);

        if (!subCategorieCreated) {
            return response.status(500).json({ error: 'Erreur lors de la création de la sous-catégorie' });
        }

        response.status(201).json({ message: 'Sous-catégorie créée avec succès', subCategorieCreated });
    } catch (error) {
        // Duplication PostgreSQL
        if (error.code === '23505') {
            return response.status(400).json({
                error: 'Cette sous-catégorie existe déjà'
            });
        }

        response.status(500).json({
            error: 'Erreur serveur'
        });

    }

})

app.get('/api/sub-categories', async (request, response) => {
    const subCategories = await getSubCategories();
    if (subCategories == null || subCategories.length === 0) {
        return response.status(404).json({ error: 'Aucune sous-catégorie trouvée' });
    }

    response.status(200).json({ message: 'Sous-catégories récupérées avec succès', subCategories });
});

app.get('/api/sub-categories/:id', async (request, response) => {
    const { id } = request.params;
    const subCategorie = await getSubCategorieById(id);

    if (!subCategorie) {
        return response.status(404).json({ error: 'Sous-catégorie non trouvée' });
        return
    }



    response.status(200).json({ message: 'Sous-catégorie récupérée avec succès', subCategorie });
});

app.get('/api/sub-categories/categories/:id', async (request, response) => {
    const { id } = request.params
    const subCategories = await getSubCategoriesByCategoryId(id)

    if (!subCategories || subCategories.length === 0) {
        return response.status(404).json({
            error: 'Aucune sous-catégorie trouvée'
        })
    }

    response.status(200).json({
        message: 'Sous-catégories récupérées avec succès',
        subCategories
    });
})

app.patch('/api/sub-categories/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { name, slug } = request.body;

        const subCategorieData = { name, slug };
        const subCategorieUpdated = await updateSubCategorie(id, subCategorieData);

        if (!subCategorieUpdated) {
            return response.status(404).json({ error: 'Sous-catégorie non trouvée' });
        }

        response.status(200).json({ message: 'Sous-catégorie mise à jour avec succès', subCategorieUpdated });
    } catch (error) {
        if (error.code === '23505') {
            return response.status(409).json({
                error: 'Cette sous-catégorie existe déjà'
            });
        }

        return response.status(500).json({
            error: 'Erreur serveur'
        });
    }
});

//========= FIN ROUTES SOUS-CATEGORIES ========================
/**
 * 
 * 
 * 
 */
//========= DÉBUT ROUTES ARTICLES ========================
app.post('/api/articles', assets.single('image'), async (request, response) => {
    try {
        const author_id = request.user.id
        const { title, summary, content, status, categorie_id, subcategorie_id, planifier_date } = request.body;

        const image = request.file.path;



        if (title === '' || summary === '' || content === '' || image === '' || categorie_id === '' || subcategorie_id === '') {
            return response.status(400).json({
                error: 'Tous les champs sont requis'
            });
        }
        // Validation de la date de planification
        if (status === 'planifié' && planifier_date) {

            const datePlanifiee = new Date(planifier_date);
            const aujourdHui = new Date();


            if (datePlanifiee <= aujourdHui) {
                return response.status(400).json({
                    error: 'La date de planification doit être postérieure à la date actuelle.'
                });
            }
        }

        const datePlanification =
            planifier_date && planifier_date.trim() !== ''
                ? planifier_date
                : null;

        const articleData = { title, summary, content, image, status, categorie_id, subcategorie_id, author_id, planifier_date: datePlanification };
        const articleCreated = await createArticle(articleData);

        if (!articleCreated) {
            return response.status(500).json({ error: 'Erreur lors de la création de l\'article' });
        }

        response.status(201).json({ message: 'Article créé avec succès', articleCreated });
    } catch (error) {
        console.log(error);

        return response.status(500).json({ error: 'Erreur lors de la création de l\'article' });

    }

})

app.get('/api/articles', async (request, response) => {
    const articles = await getArticles();
    if (articles == null || articles.length === 0) {
        return response.status(404).json({ error: 'Aucun article trouvé' });
    }

    response.status(200).json({ message: 'Articles récupérés avec succès', articles });
});

app.get('/api/articles-redacteur', async (request, response) => {
    const authorId = request.user.id;
    const articles = await getArticlesForRedacteur(authorId);
    if (articles == null || articles.length === 0) {
        return response.status(404).json({ error: 'Aucun article trouvé' });
    }

    response.status(200).json({ message: 'Articles récupérés avec succès', articles });
});

app.get('/api/articles/:id', async (request, response) => {
    const { id } = request.params;
    const article = await getArticleById(id);

    if (!article) {
        return response.status(404).json({ error: 'Article non trouvé' });
    }

    response.status(200).json({ message: 'Article récupéré avec succès', article });
});

app.get('/api/articles-status/:status', async (request, response) => {
    const { status } = request.params;
    const authorId = request.user.id;
    const article = await getArticleByStatus(status, authorId);

    if (!article) {
        return response.status(404).json({ error: 'Article non trouvé' });
    }

    response.status(200).json({ message: 'Article récupéré avec succès', article });
});

app.
    get('/api/articles-status-brouillon/:status', async (request, response) => {
        const { status } = request.params;
        const authorId = request.user.id;
        const article = await getArticleByStatusBrouillons(status, authorId);

        if (!article) {
            return response.status(404).json({ error: 'Article non trouvé' });
        }

        response.status(200).json({ message: 'Article récupéré avec succès', article });
    });

app.patch('/api/articles/:id', assets.single('image'), async (request, response) => {
    try {
        const { id } = request.params;
        const { title, summary, content, status, categorie_id, subcategorie_id, planifier_date } = request.body;

        const articleActuel = await getArticleById(id);

        let image = articleActuel.image;

        if (request.file) {
            image = request.file.path;
        }


        if (title === '' || summary === '' || content === '' || status === '' || image === '' || categorie_id === '' || subcategorie_id === '') {
            return response.status(400).json({
                error: 'Tous les champs sont requis'
            });
        }

        // Validation de la date de planification
        if (status === 'planifié' && planifier_date) {

            const datePlanifiee = new Date(planifier_date);
            const aujourdHui = new Date();


            if (datePlanifiee <= aujourdHui) {
                return response.status(400).json({
                    error: 'La date de planification doit être postérieure à la date actuelle.'
                });
            }
        }
        const datePlanification =
            planifier_date && planifier_date.trim() !== ''
                ? planifier_date
                : articleActuel.planifier_date;


        const articleData = { title, summary, content, image, status, categorie_id, subcategorie_id, author_id: articleActuel.author_id, planifier_date: datePlanification };
        const articleUpdated = await updateArticle(id, articleData);

        if (!articleUpdated) {
            return response.status(404).json({ error: 'Article non trouvé' });
        }

        response.status(200).json({ message: 'Article mis à jour avec succès', articleUpdated });

    } catch (error) {
        console.log(error);

        return response.status(500).json({ error: 'Erreur lors de la création de l\'article' });
    }

});

app.delete('/api/articles/:id', async (request, response) => {
    const { id } = request.params;

    const articleDeleted = await deleteArticle(id);

    if (!articleDeleted) {
        return response.status(404).json({ error: 'Article non trouvé' });
    }

    response.status(200).json({ message: 'Article supprimé avec succès', articleDeleted });
});

//========= FIN ROUTES ARTICLES ========================
/**
 * 
 * 
 * 
 */
//========= DÉBUT ROUTES INSCRIPTION, CONNEXION, DÉCONNEXION ========================
/**
 * Route pour l'inscription des utilisateurs
 */
app.post('/api/inscription',
    usernameValidationMiddleware,
    emailValidationMiddleware,
    passwordValidationMiddleware,
    firstNameValidationMiddleware,
    lastNameValidationMiddleware,
    phoneValidationMiddleware,
    addressHomeValidationMiddleware,
    postalCodeValidationMiddleware, async (request, response, next) => {

        try {
            // Si la validation passe, on crée l'utilisateur
            const { username, email, password, role, status, first_name, last_name, phone, address_home, city, postal_code, country } = request.body;
            if (
                username === '' || email === '' || password === '' || first_name === '' || last_name === '' || phone === '' || address_home === '' || city === '' || postal_code === '') {
                return response.status(400).json({
                    error: 'Tous les champs sont requis'
                });
            }

            const userData = { username, email, password, role, status, first_name, last_name, phone, address_home, city, postal_code, country };
            const userCreated = await createUser(userData);
            if (!userCreated) {
                return response.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
            }
            response.status(201).json({ message: 'Utilisateur créé avec succès', userCreated });

        } catch (error) {
            console.error(error);
            // S'il y a une erreur SQL, on regarde
            // si c'est parce qu'il y a conflit
            // d'identifiant.
            if (error.code === '23505') {
                return response.status(409).json({ error: 'Cet e-mail ou ce mot de passe est déjà utilisé' });
            }
            else {
                return next(error);
            }
        }

    });
/**
 * Route pour la connexion des utilisateurs
 */
app.post('/api/connexion', emailValidationMiddleware, passwordValidationMiddleware, (request, response, next) => {
    // On lance l'authentification avec passport.js
    passport.authenticate('local', (error, user, info) => {

        if (error) {
            // S'il y a une erreur, on laisse Express la
            // gérer.
            return next(error);

        }
        if (!user) {
            // Si la connexion échoue, on envoie
            // l'information au client avec un code
            // 401 (Unauthorized).
            response.status(401).json({ error: info?.error || 'Identifiants incorrects' });
        }

        // Si tout fonctionne, on ajoute
        // l'utilisateur dans la session et on
        // retourne un code 200 (OK).
        request.logIn(user, (error) => {
            if (error) {
                // On laisse Express gérer l'erreur.
                return next(error);
            }
            return response.status(200).json({ message: 'Connexion réussie', user });
        })

    })(request, response, next);

});
/** 
 * Route pour la déconnexion des utilisateurs
 */
app.post('/api/deconnexion', (request, response, next) => {

    request.logout((error) => {
        if (error) {
            // On laisse Express gérer l'erreur.
            return next(error);
        } else {
            // Déconnecte l'utilisateur.
            request.session.destroy(() => {
                response.clearCookie(process.env.npm_package_name);

                return response.status(200).json({
                    message: 'Déconnexion réussie'

                })
            })
        }
    });

})
//========= FIN ROUTES INSCRIPTION, CONNEXION, DECONNEXION ========================
/**
 * 
 * 
 * 
 */

//========= DÉBUT ROUTES RENDU DES PAGES ========================
app.get('/', (request, response) => {
    response.render('home', {
        title: 'INFORMEZ-VOUS.CD - Actualités en temps réel',
        description: 'Découvrez les dernières actualités nationales et internationales sur INFORMEZ-VOUS.CD.',
        image: "logo.jpeg",
        url: 'https://informez-vous-cd.onrender.com/',
        currentPage: '/'

    });
});
app.get('/admin/dashboard', isAuthenticated, isAdmin, async (request, response) => {
    const datePlanification = new Date();
    const idUser = request.user.id
    const firstName = request.user.first_name
    const lastName = request.user.last_name
    const roles = request.user.role
    const initial = firstName.charAt(0).toUpperCase() + ' ' +
        lastName.charAt(0).toUpperCase()
    const users = await getusers()
    const redacteur = users.filter(user => user.role === 'rédacteur')
    const nombreUser = redacteur.length
    const articles = await getArticles()
    const nombreArticle = articles.filter(article => article.status === 'publié').length
    const nombreMesArticle = articles.filter(article => article.status === 'publié' && article.author_id === request.user.id).length
    const nombreArticleBrouillon = articles.filter(article =>

    (
        article.status === 'brouillon' ||
        (
            article.status === 'planifié' && new Date(article.planifier_date) < datePlanification
        )
    )
    ).length


    const nombreArticlePlanifier = articles.filter(article =>
        article.status === 'planifié' &&
        article.author_id === idUser &&
        new Date(article.planifier_date) > datePlanification).length

    const statusCounts = await getArticleStatusCounts()
    const categoryCounts = await getArticleCountByCategory()

    const statusMap = statusCounts.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
    }, {});

    const publishedCount = statusMap['publié'] || 0;
    const draftCount = statusMap['brouillon'] || 0;

    const categoryLabels = categoryCounts.map(item => item.category || 'Non classé');
    const categoryData = categoryCounts.map(item => item.count);

    response.render('admin/dashboard', {
        layout: 'admin',
        title: 'Dashboard',
        menuTitles: 'Tableau de bord',
        currentPage: 'dashboard',
        firstName,
        lastName,
        roles,
        initial,
        nombreUser,
        nombreArticle,
        nombreMesArticle,
        nombreArticleBrouillon,
        publishedCount,
        draftCount,
        nombreArticlePlanifier,
        categoryLabelsJson: JSON.stringify(categoryLabels),
        categoryDataJson: JSON.stringify(categoryData),
        styles: ['admin/dashboard.css'],
        scripts: ['admin/dashboard.js']
    });
});

app.get('/admin/articles', isAuthenticated, isAdmin, async (request, response) => {
    const articles = await getArticles()
    const nombreArticle = articles.length

    const status = {
        'publié': 'Publié',
        'brouillon': 'Brouillon',
        'planifié': 'Planifié'
    }

    response.render('admin/articles', {
        layout: 'admin',
        title: 'Articles',
        menuTitles: 'Gestion des articles',
        nombreArticle,
        status,
        currentPage: 'articles',
        styles: ['admin/articles.css'],
        scripts: ['admin/articles.js']
    });
})

app.get('/admin/apercu-article/:id', isAuthenticated, isAdmin, async (request, response) => {

    const { id } = request.params

    const article = await getArticleById(id)
    const categorieId = article.categorie_id
    const subCategorieId = article.subcategorie_id
    const auteuId = article.author_id
    const auteur = await getUserById(auteuId)
    const categorie = await getCategorieById(categorieId)


    let categoriecase, subCategorie = null
    if (categorie && categorie.slug) {
        categoriecase = categorie.slug.toUpperCase()
    }

    if (subCategorieId) {
        subCategorie = await getSubCategorieById(subCategorieId)
    }





    if (!article) {
        return response.redirect('/admin/planifier');
    }

    const dateFormatee = article.created_at
        ? new Date(article.created_at).toISOString().split('T')[0]
        : '';

    response.render('admin/apercu-article', {
        layout: 'admin',
        title: 'Voir un article',
        menuTitles: 'Aperçu d\'un article',
        article: {
            ...article,
            created_at: dateFormatee
        },
        auteur,
        categoriecase,
        subCategorie,
        currentPage: 'articles',
        styles: ['admin/create-article.css']
    });
})

app.get('/admin/create-article', isAuthenticated, isAdmin, (request, response) => {
    response.render('admin/create-article', {
        layout: 'admin',
        title: 'Créer un article',
        menuTitles: 'Création d\'un article',
        currentPage: 'create-article',
        styles: ['admin/create-article.css'],
        scripts: ['admin/create-article.js']
    });
})

app.get('/admin/update-article/:id', isAuthenticated, isAdmin, async (request, response) => {
    const { id } = request.params

    const article = await getArticleById(id)

    if (!article) {
        return response.redirect('/admin/planifier');
    }

    const formatDateTimeLocal = (value) => {
        if (!value) return '';

        const date = new Date(value);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const dateFormatee = formatDateTimeLocal(article.planifier_date);


    response.render('admin/update-article', {
        layout: 'admin',
        title: 'Modifier un article',
        menuTitles: 'Mise à jour d\'un article',
        article: {
            ...article,
            planifier_date: dateFormatee
        },
        currentPage: 'update-article',
        styles: ['admin/update-article.css'],
        scripts: ['admin/update-article.js']
    });
})

app.get('/admin/planifier', isAuthenticated, isAdmin, async (request, response) => {
    const idUser = request.user.id
    const articles = await getArticles()
    const mesArticlePlanifier = articles.filter(article => article.status === 'planifié' && article.author_id === idUser)


    response.render('admin/planifier', {
        layout: 'admin',
        title: 'Articles Planifié',
        menuTitles: 'Publication Planifiée',
        mesArticlePlanifier,
        currentPage: 'planifier',
        styles: ['admin/planifier.css'],
        scripts: ['admin/articles.js']
    });
})

app.get('/admin/brouillons', isAuthenticated, isAdmin, (request, response) => {
    response.render('admin/brouillons', {
        layout: 'admin',
        title: 'Articles en Brouillons',
        menuTitles: 'Brouillons',
        currentPage: 'brouillons',
        styles: ['admin/brouillons.css'],
        scripts: ['admin/articles.js']
    });
})

app.get('/admin/categories', isAuthenticated, isAdmin, async (request, response) => {

    response.render('admin/categories', {
        layout: 'admin',
        title: 'Catégories',
        menuTitles: 'Gestion des catégories',
        currentPage: 'categories',
        styles: ['admin/categories.css'],
        scripts: ['admin/categories.js']
    })
})

app.get('/admin/profils', isAuthenticated, isAdmin, (request, response) => {
    response.render('admin/profils', {
        layout: 'admin',
        title: 'Profils',
        menuTitles: 'Gestion des profils',
        currentPage: 'profils',
        styles: ['admin/profils.css'],
        scripts: ['admin/profils.js']
    })
})

app.get('/register', isAuthenticated, isAdmin, (request, response) => {
    response.render('auth/register', {
        layout: 'admin',
        title: 'Register',
        menuTitles: 'Crée un rédacteur',
        currentPage: 'register',
        styles: ['global.css']
    });
});

//route pour le redacteur
app.get('/redacteur/dashboard', isAuthenticated, isRedacteur, async (request, response) => {
    const datePlanification = new Date();
    const idUser = request.user.id
    const firstName = request.user.first_name
    const lastName = request.user.last_name
    const roles = request.user.role
    const initial = firstName.charAt(0).toUpperCase() + ' ' +
        lastName.charAt(0).toUpperCase()
    const users = await getusers()
    const redacteur = users.filter(user => user.role === 'rédacteur')
    const nombreUser = redacteur.length
    const articles = await getArticles()
    const mesArticles = articles.filter(article => article.author_id === idUser)
    const categories = await Promise.all(
        mesArticles.map(article =>
            getCategorieById(article.categorie_id)
        )
    );
    const mesArticlesAvecCategorie = await Promise.all(
        mesArticles.map(async article => {
            const categorie = await getCategorieById(article.categorie_id);

            return {
                ...article,
                categorie: categorie?.name ?? 'Catégorie supprimée',
                dateOriginale: new Date(article.created_at),
                created_at: new Date(article.created_at).toLocaleDateString(
                    'fr-CA',
                    {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }
                )
            };
        })
    );
    const mesArticlesLimites = mesArticlesAvecCategorie
        .sort((a, b) => b.dateOriginale - a.dateOriginale)
        .slice(0, 5);
    const nombreArticle = articles.filter(article => article.status === 'publié').length
    const nombreMesArticle = articles.filter(article => article.status === 'publié' && article.author_id === request.user.id).length
    const nombreArticleBrouillon = articles.filter(article =>
        article.author_id === idUser
        && (
            article.status === 'brouillon' ||
            (
                article.status === 'planifié' && new Date(article.planifier_date) < datePlanification
            )
        )
    ).length




    const nombreArticlePlanifier = articles.filter(article =>
        article.status === 'planifié' &&
        article.author_id === idUser &&
        new Date(article.planifier_date) > datePlanification).length
    const nombreArticlePlanifierExpire = articles.filter(article =>
        article.status === 'planifié' &&
        article.author_id === idUser &&
        new Date(article.planifier_date) > datePlanification).length


    response.render('redacteur/dashboard', {
        layout: 'redacteur',
        title: 'Dashboard',
        mesArticles: mesArticlesLimites,
        nombreMesArticle,
        nombreArticleBrouillon,
        nombreArticlePlanifier,
        nombreArticlePlanifierExpire,
        firstName,
        lastName,
        roles,
        initial,
        currentPage: 'dashboard',
        menuTitles: 'Tableau de bord',
        styles: ['redacteur/dashboard.css'],
        // scripts: ['redacteur/dashboard.js']
    });
});

app.get('/redacteur/articles', isAuthenticated, isRedacteur, (request, response) => {
    response.render('redacteur/articles', {
        layout: 'redacteur',
        title: 'Articles',
        currentPage: 'articles',
        menuTitles: 'Gestion des articles',
        styles: ['redacteur/articles.css'],
        scripts: ['redacteur/articles.js']
    });
})

app.get('/redacteur/apercu-article/:id', isAuthenticated, isRedacteur, async (request, response) => {

    const { id } = request.params

    const article = await getArticleById(id)
    const categorieId = article.categorie_id
    const subCategorieId = article.subcategorie_id
    const auteuId = article.author_id
    const auteur = await getUserById(auteuId)
    const categorie = await getCategorieById(categorieId)

    let categoriecase, subCategorie = null

    if (categorie && categorie.slug) {
        categoriecase = categorie.slug.toUpperCase()
    }

    if (subCategorieId) {
        subCategorie = await getSubCategorieById(subCategorieId)
    }



    if (!article) {
        return response.redirect('/admin/planifier');
    }

    const dateFormatee = article.created_at
        ? new Date(article.created_at).toISOString().split('T')[0]
        : '';

    response.render('redacteur/apercu-article', {
        layout: 'redacteur',
        title: 'Voir un article',
        menuTitles: 'Aperçu d\'un article',
        article: {
            ...article,
            created_at: dateFormatee
        },
        auteur,
        categoriecase,
        subCategorie,
        currentPage: 'articles',
    });
})

app.get('/redacteur/create-article', isAuthenticated, isRedacteur, async (request, response) => {
    response.render('redacteur/create-article', {
        layout: 'redacteur',
        title: 'Créer un article',
        currentPage: 'create-article',
        menuTitles: 'Création d\'un article',
        styles: ['redacteur/create-article.css'],
        scripts: ['redacteur/create-article.js']
    });
})

app.get('/redacteur/update-article/:id', isAuthenticated, isRedacteur, async (request, response) => {
    const { id } = request.params

    const article = await getArticleById(id)

    if (!article) {
        return response.redirect('/admin/planifier');
    }

    const formatDateTimeLocal = (value) => {
        if (!value) return '';

        const date = new Date(value);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };


    const dateFormatee = formatDateTimeLocal(article.planifier_date, true);


    response.render('redacteur/update-article', {
        layout: 'redacteur',
        title: 'Modifier un article',
        currentPage: 'update-article',
        menuTitles: 'Mise à jour d\'un article',
        article: {
            ...article,
            planifier_date: dateFormatee
        },
        styles: ['redacteur/update-article.css'],
        scripts: ['redacteur/update-article.js']
    });
})

app.get('/redacteur/planifier', isAuthenticated, isRedacteur, async (request, response) => {
    response.render('redacteur/planifier', {
        layout: 'redacteur',
        title: 'Articles Planifié',
        currentPage: 'planifier',
        menuTitles: 'Publication Planifiée',
        styles: ['redacteur/planifier.css'],
        scripts: ['redacteur/articles.js']
    });
})

app.get('/redacteur/brouillons', isAuthenticated, isRedacteur, async (request, response) => {
    response.render('redacteur/brouillons', {
        layout: 'redacteur',
        title: 'Articles en Brouillons',
        currentPage: 'brouillons',
        menuTitles: 'Brouillons',
        styles: ['redacteur/brouillons.css'],
        scripts: ['redacteur/articles.js']
    });
})

app.get('/redacteur/profils', isAuthenticated, isRedacteur, async (request, response) => {
    const userId = request.user.id;
    const user = await getUserById(userId);
    const firstName = request.user.first_name
    const lastName = request.user.last_name
    const email = request.user.email
    const roles = request.user.role
    const status = request.user.status
    const username = request.user.username
    const phone = request.user.phone
    const address_home = request.user.address_home
    const postal_code = request.user.postal_code
    const initial = firstName.charAt(0).toUpperCase() + ' ' +
        lastName.charAt(0).toUpperCase()
    const pays = request.user.country
    const city = request.user.city

    response.render('redacteur/profils', {
        layout: 'redacteur',
        title: 'Profils',
        firstName,
        lastName,
        roles,
        status,
        initial,
        email,
        pays,
        city,
        username,
        phone,
        address_home,
        postal_code,
        userId,
        currentPage: 'profils',
        menuTitles: 'Mon profil',
        styles: ['redacteur/profils.css'],
        scripts: ['redacteur/profil.js']
    })
})

// Routes pour visiteurs
app.get('/actualite', (request, response) => {
    response.render('actualite', {
        layout: 'main',
        title: 'Actualité',
        description: 'Les dernières nouvelles publiées sur INFORMEZ-VOUS.CD.',
        image: "logo.jpeg",
        url: "https://informez-vous-cd.onrender.com/actualite",
        currentPage: 'actualite',
        styles: ['actualites.css'],
        scripts: ['global.js']
    })
})

app.get('/categories', (request, response) => {
    response.render('categories', {
        layout: 'main',
        title: 'Categories',
        description: 'Parcourez toutes les catégories disponibles sur INFORMEZ-VOUS.CD.',
        image: "logo.jpeg",
        url: "https://informez-vous-cd.onrender.com/categories",

        currentPage: 'categories',
        styles: ['categories.css'],
        scripts: ['categories.js']
    })
})

app.get('/apropos', (request, response) => {
    response.render('apropos', {
        layout: 'main',
        title: 'À propos',
        currentPage: 'apropos',
        styles: ['global.css'],
    })
})

app.get('/confidentialite', (request, response) => {
    response.render('confidentialite', {
        layout: 'main',
        title: 'Confidentialité',
        currentPage: 'confidentialite',
        styles: ['global.css'],
        scripts: []
    })
})

app.get('/mention-legale', (request, response) => {
    response.render('mention-legale', {
        layout: 'main',
        title: 'Mentions légales',
        currentPage: 'mention-legale',
        styles: ['global.css'],
    })
})


const getClientIp = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0]
        || req.socket.remoteAddress;
};

app.post('/api/articles/:id/view', async (req, res) => {
    const { id } = req.params;
    const ip = getClientIp(req);


    try {
        await incrementArticleViews(id, ip);

        res.json({ message: 'Vue enregistrée' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
app.get('/api/article-views/:id', async (request, response) => {
    const { id } = request.params

     try {
        const articleViews = await getAticleViewsByIdArticle(id);

        return response.status(200).json({
            message: "Article trouvé",
            articleViews
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "Erreur serveur" });
    }
})

app.get('/robots.txt', (req,res)=>{
    res.type('text/plain');
    res.send(`
User-agent: *
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Facebot
Allow: /
    `);
});

app.use((req,res,next)=>{

    const ua = req.headers['user-agent'] || '';

    if(
        ua.includes('facebookexternalhit') ||
        ua.includes('Facebot')
    ){

        res.setHeader(
            "Cache-Control",
            "public, max-age=3600"
        );

    }

    next();

});

app.get('/lire-article', async (request, response) => {
    const articleId = request.query.id;



    if (!articleId) {
        return response.redirect('/categories');
    }

    try {
        const articleRecuperer = await getArticleById(articleId);
        if (!articleRecuperer) {
            return response.status(404).send('Article non trouvé');
        }

        if (articleRecuperer.status !== 'publié') {
            return response.status(404).send('Article non trouvé');
        }

        const recuperationArticles = await getArticles();

        const articlesMelanges = [...recuperationArticles];

        for (let i = articlesMelanges.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [articlesMelanges[i], articlesMelanges[j]] =
                [articlesMelanges[j], articlesMelanges[i]];
        }

        const articlesAleatoires = articlesMelanges
            .filter(article => article.id !== Number(articleId) && article.status === 'publié')
            .slice(0, 10)
            .map(article => ({
                ...article,
                created_at: new Date(article.created_at).toLocaleString('fr-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                })
            }));

        const formatViews = (views) => {
            if (views >= 1000) {
                return (views / 1000).toFixed(1).replace('.0', '') + 'K';
            }
            return views;
        };

        const article =
        {
            ...articleRecuperer,
            created_at: new Date(articleRecuperer.created_at).toLocaleDateString(
                'fr-CA',
                {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }
            ),
            views: formatViews(articleRecuperer.views)
        }

        if (!article) {
            return response.status(404).send('Article non trouvé');
        }




        const auteur = await getUserById(article.author_id);
        const categorie = await getCategorieById(article.categorie_id);
        const subCategorie = article.subcategorie_id ? await getSubCategorieById(article.subcategorie_id) : null;

        response.render('lire-article', {
            layout: 'main',
            title: article.title,

            description: article.summary,

            image: article.image || 'logo.jpeg',

            url: `https://informez-vous-cd.onrender.com/lire-article?id=${article.id}`,

            currentPage: 'lire-article',
            styles: ['global.css'],
            article,
            auteur,
            categoriecase: categorie?.name,
            subCategorie,
            suggestions: articlesAleatoires,
            scripts: ['views-article.js']


        });
    } catch (error) {
        console.error(error);
        response.status(500).send('Erreur serveur');
    }
})


app.get('/search', (request, response) => {
    response.render('search', {
        layout: 'main',
        title: 'Rechercher un article',
        currentPage: 'search',
        styles: ['search.css'],
        scripts: ['global.js']
    })
})

app.get('/login', (request, response) => {
    if (request.isAuthenticated()) {
        if (request.user.role === 'administrateur') {
            return response.redirect('/admin/dashboard');
        }
        if (request.user.role === 'rédacteur') {
            return response.redirect('/redacteur/dashboard');
        }
    }

    response.render('auth/login', {
        layout: 'main',
        title: 'Login',
        currentPage: 'login',
        styles: ['global.css'],
        scripts: ['connexion.js']
    });
});


//========= FIN ROUTES RENDU PAGES ========================

// Ecoute du serveur sur le port 5000
app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log("Serveur OK sur le port 5000");
});
