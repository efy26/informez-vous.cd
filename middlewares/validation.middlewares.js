import {
    isEmailValid,
    isPasswordValid,
    isUsernameValid,
    isFirstNameValid,
    isLastNameValid,
    isPhoneValid,
    isAddressHomeValid,
    isCityValid,
    isPostalCodeValid
} from '../public/js/validation.donees.js'

export const emailValidationMiddleware = (request, response, next) => {
    const { email } = request.body;
    if (!isEmailValid(email)) {
        return response.status(400).json({ error: 'Adresse e-mail invalide' });
    }
    next();
}

export const passwordValidationMiddleware = (request, response, next) => {
    const { password } = request.body;
    if (!isPasswordValid(password)) {
        return response.status(400).json({ error: 'Mot de passe invalide. Il doit comporter au moins 8 caractères et peut contenir des lettres, des chiffres et des caractères spéciaux @$!%*?&.' });
    }
    next();
}

export const usernameValidationMiddleware = (request, response, next) => {
    const { username } = request.body;
    if (!isUsernameValid(username)) {
        return response.status(400).json({ error: 'Nom d\'utilisateur invalide. Il doit comporter entre 3 et 20 caractères et ne peut contenir que des lettres, des chiffres et des underscores.' });
    }
    next();
}

export const firstNameValidationMiddleware = (request, response, next) => {
    const { first_name } = request.body;

    if (!isFirstNameValid(first_name)) {
        return response.status(400).json({
            error: 'Prénom invalide'
        });
    }

    next();
}

export const lastNameValidationMiddleware = (request, response, next) => {
    const { last_name } = request.body;

    if (!isLastNameValid(last_name)) {
        return response.status(400).json({
            error: 'Nom invalide'
        });
    }

    next();
}

export const phoneValidationMiddleware = (request, response, next) => {
    const { phone } = request.body;

    if (!isPhoneValid(phone)) {
        return response.status(400).json({
            error: 'Numéro de téléphone invalide'
        });
    }

    next();
}

export const addressHomeValidationMiddleware = (request, response, next) => {
    const { address_home } = request.body;

    if (!isAddressHomeValid(address_home)) {
        return response.status(400).json({
            error: 'Adresse invalide'
        });
    }

    next();
}

export const cityValidationMiddleware = (request, response, next) => {
    const { city } = request.body;

    if (!isCityValid(city)) {
        return response.status(400).json({
            error: 'Ville invalide'
        });
    }

    next();
}

export const postalCodeValidationMiddleware = (request, response, next) => {
    const { postal_code } = request.body;

    if (!isPostalCodeValid(postal_code)) {
        return response.status(400).json({
            error: 'Code postal invalide'
        });
    }

    next();
}