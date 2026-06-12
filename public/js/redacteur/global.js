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
