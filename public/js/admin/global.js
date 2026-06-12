window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        window.location.reload();
    }
});

// Référence : bouton du menu latéral.
const btnOpenMenu = document.querySelector('.menu-outline')
const btnCloseMenu = document.querySelector('.close-outline')
const aside = document.querySelector('aside ')
const asideMenu = document.querySelectorAll('.aside-menu a')
const btnDeconnexion = document.querySelector('.logout-button')

const openMenu = (event) => {

    aside.classList.add("open-menu")
}
const closeMenu = (event) => {

    aside.classList.remove("open-menu")
}

const menuOption = (event) => {

    asideMenu.forEach(asideMenus => {
        asideMenus.classList.remove('activeLink')
    })

    event.currentTarget.classList.add('activeLink')
}

asideMenu.forEach(asideMenus => {
    asideMenus.addEventListener('click', menuOption)
})

const createToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast show ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => {
        toast.classList.remove('show');
        toast.remove();
    }, 3000);
};

const deconnecter = async () => {

    const response = await fetch('/api/deconnexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const result = await response.json();

    if (response.ok) {
        createToast('Déconnexion réussie !', 'success');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
    } else {
        createToast(result.error || 'Échec de la déconnexion', 'error');
    }

}

// Référence : formulaire d'inscription des utilisateurs.
const inscriptionForm = document.getElementById('inscription-form')
const inputText = document.querySelectorAll('#inscription-form input[type="text"]')
const email = document.querySelector('#inscription-form input[type="email"]')
const password = document.querySelectorAll('#inscription-form input[type="password"]')
const select = document.querySelectorAll('#inscription-form select')
let messages = document.querySelector('#inscription-form p')



const afficherPassword = () => {
    password.forEach(inputPassword => {
        inputPassword.type = 'text';
    });
};

const masquerPassword = () => {
    password.forEach(inputPassword => {
        inputPassword.type = 'password';
    });
};


const inscrire = async (event) => {
    event.preventDefault();

    if (password[0].value !== password[1].value) {
         messages.classList.add('error')
        messages.innerHTML = "Les mots de passe ne correspondent pas"
    }else {

        const dataUser = {
            username: inputText[0].value,
            email: email.value,
            password: password[1].value,
            role: select[0].value,
            first_name: inputText[1].value,
            last_name: inputText[2].value,
            phone: inputText[3].value,
            address_home: inputText[4].value,
            city: inputText[5].value,
            postal_code: inputText[6].value,
            country: select[1].value,
        }
    
    const response = await fetch('/api/inscription', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataUser)
    })

    const result = await response.json()

    if (response.ok) {
        console.log(result);
        messages.classList.remove('error')
        messages.classList.add('success')
        messages.innerHTML = result.message


        inputText[0].value = ''
        email.value = ''
        password.value = ''
        inputText[1].value = ''
        inputText[2].value = ''
        inputText[3].value = ''
        inputText[4].value = ''
        inputText[5].value = ''
        inputText[6].value = ''

        
    }else {
        messages.classList.add('error')
        messages.innerHTML = result.error
        console.log(result.error)
    }
    }

}







if (password) {
    password.forEach(inputPassword => {
    inputPassword.addEventListener('mouseover', afficherPassword);
    inputPassword.addEventListener('mouseout', masquerPassword);
});
}

if (inscriptionForm) {
    inscriptionForm.addEventListener('submit', inscrire)
}
if (btnDeconnexion) {
    btnDeconnexion.addEventListener('click', deconnecter)
}

if (btnOpenMenu) {
    btnOpenMenu.addEventListener('click', openMenu)
}

if (btnCloseMenu) {
    btnCloseMenu.addEventListener('click', closeMenu)
}

















// Référence : met à jour automatiquement l'année affichée dans le pied de page.
const currentYear = new Date().getFullYear();
const yearElement = document.querySelector('.annee');
if (yearElement) {
    yearElement.textContent = currentYear;
}
