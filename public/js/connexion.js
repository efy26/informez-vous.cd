import {isEmailValid, isPasswordValid, isUsernameValid } from './validation.donees.js';

const containerSignIn = document.querySelector('.container-signIn');
const containerLogin = document.querySelector('.container-login');
const form = document.getElementById('connection-form');
const email = document.getElementById('login-email');
const password = document.getElementById('login-password');
const user = document.getElementById('login-user');

const toast = document.getElementById('toast');

const showToast = (message, type = 'success') => {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    window.setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};

const connexion = async (event) => {
    event.preventDefault();

    const userData = {
        email: email.value,
        password: password.value
    };

    if (!isEmailValid(userData.email)) {
        user.textContent = 'Veuillez entrer une adresse e-mail valide.';
        return;
    }

    if (!isPasswordValid(userData.password)) {
        user.textContent = 'Le mot de passe est incorrect';
        return;
    }
    
    const response =  await fetch('/api/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userData)
    });

    let result;
    try {
        result = await response.json();
    } catch (error) {
        result = { error: 'Erreur lors de la connexion' };
    }
    


    if (response.ok) {
        user.textContent = '';
        showToast('Connexion réussie !', 'success');

        setTimeout(() => {
            if (result.user.role === "administrateur") {
                window.location.href = '/admin/dashboard';
            }

            if (result.user.role === "rédacteur") {
                window.location.href = `/redacteur/dashboard`;
            }
        }, 2000);
    } else {
        user.style.color = 'red';
        user.textContent = `Erreur : ${result.error}`;
        showToast(result.error || 'Échec de la connexion', 'error');
    }
    
}



form.addEventListener('submit', connexion);