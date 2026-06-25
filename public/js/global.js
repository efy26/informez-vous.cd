// Référence : met à jour automatiquement l'année affichée dans le pied de page.
const currentYear = new Date().getFullYear();
const yearElement = document.querySelector('.annee');
if (yearElement) {
    yearElement.textContent = currentYear;
}





// Référence : contrôle l'ouverture et la fermeture du menu mobile.
const openMenu = document.querySelector('.menu-outline');
const closeMenu = document.querySelector('.close-outline');
const menu = document.querySelector('header');
const searchInput = document.getElementById('searchInput');
const shareArticle = document.getElementById('btn-share')
const toast = document.getElementById('toast');

// Partager article
if (shareArticle) {
    shareArticle.addEventListener('click', async (e) => {
        console.log('eeeee');
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: "Regarde cet article intéressant",
                    url: window.location.href,
                    // image: document.image
                });
            } catch (err) {
                console.log("Partage annulé", err);
            }
        } else {
            // fallback
            navigator.clipboard.writeText(window.location.href);
            e.currentTarget.innerHTML = "Lien copié !"
            e.currentTarget.classList.add('copierLien')
            setTimeout(() => {
                shareArticle.innerHTML = "Partager l'article"
                shareArticle.classList.remove('copierLien')

            }, 2000);

        }

    });
}

const menuOpen = (event) => {
    event.preventDefault();
    menu.classList.add('open-menu');
}

const menuClose = (event) => {
    event.preventDefault();
    menu.classList.remove('open-menu');
}

// Référence : charge les catégories dans le footer et sur la page d'accueil.
const afficherCategorieFooterAndHome = async () => {
    const response = await fetch('/api/categories', {
        method: 'GET'
    });

    const result = await response.json();

    if (response.ok) {
        const footerCategories = document.querySelector('.footer-categories');
        const listeCategorieContainer = document.querySelector('.liste-categorie-container');

        if (!footerCategories) return;

        result.categories.forEach(categorie => {
            const a = document.createElement('a');
            const div = document.createElement('div');

            a.innerHTML = categorie.name;
            a.href = '/categories'
            footerCategories.appendChild(a);

            if (listeCategorieContainer) {
                div.innerHTML = `
                    <ion-icon name="globe-outline"></ion-icon>
                    <p>${categorie.name}</p>
                `;
                listeCategorieContainer.appendChild(div);
            }
        });
    } else {
        console.log(result.error);
    }
}

// Référence : affiche les membres de l'équipe sur la page d'accueil.
const afficherEquipe = async () => {
    const response = await fetch('/api/users', {
        method: 'GET'
    });

    const result = await response.json();

    if (response.ok) {
        result.users.forEach(user => {
            const div = document.createElement('div');
            div.setAttribute('class', 'equipe-info');

            const date = new Date(user.created_at).toLocaleDateString('fr-FR');
            const initial = ` ${user.first_name[0].toUpperCase()} ${user.last_name[0].toUpperCase()}`;

            div.innerHTML = `
                <div class="initial-info">
                    <div class="initial">${initial}</div>
                    <span>
                        <p><strong>${capitalize(user.first_name)} ${capitalize(user.last_name)}</strong></p>
                        <p>${user.role}</p>
                    </span>
                </div>
                <div class="info-detail">
                    <p>${user.phone}</p>
                    <p>${user.email}</p>
                    <p><strong class="name">Depuis le </strong> ${date}</p>
                </div>
            `;

            document.querySelector('.equipe-container').appendChild(div);
        });
    } else {
        console.log(result.error);
    }
}

// Référence : affiche les quatre dernières actualités publiées.
const dernieresActualites = async () => {
    const response = await fetch('/api/articles', {
        method: 'GET'
    });

    const result = await response.json();

    if (response.ok) {
        result.articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5).forEach(async (article) => {




                const div = document.createElement('div');
                const date = new Date(article.created_at).toLocaleDateString('fr-FR');
                let resultCat = { categorie: { name: "Inconnu" } };


                if (article.categorie_id) {
                    const responseCat = await fetch(`/api/categories/${article.categorie_id}`);
                    if (responseCat.ok) {
                        resultCat = await responseCat.json();
                    }

                }


                div.innerHTML = `
                    <img src="${article.image}" alt="" />
                    <a href="/lire-article?id=${article.id}" aria-label="Lire l'article">
                        <h3>${resultCat.categorie.name}</h3>
                    </a>
                    <p><strong>${article.summary}</strong></p>
                    <p>${date}</p>
                `;

                if (article.status === 'publié') {
                    document.querySelector('.dernieres-actualites-container').appendChild(div);
                }

            });
    } else {
        console.log(result.error);
    }
}

// Référence : affiche l'article le plus récent dans le bloc à la une.
const actualitesALaUne = async () => {
    const response = await fetch('/api/articles', {
        method: 'GET'
    });

    const result = await response.json();

    if (response.ok) {
        const articleALaUne = result.articles
            .filter(article => article.status === 'publié')
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

        if (!articleALaUne) return;

        const img = document.createElement('img');
        const div = document.createElement('div');

        div.classList.add('a-la-une-details');

        img.src = `${articleALaUne.image}`;

        div.innerHTML = `
            <p class="a-la-une-titre">À LA UNE</p>
            <h2>${articleALaUne.title}</h2>
            <p class="sommaire">${articleALaUne.summary}</p>
            <a href="/lire-article?id=${articleALaUne.id}" aria-label="Lire l'article">Lire l'article</a>
        `;

        document.querySelector('.a-la-une').appendChild(img);
        document.querySelector('.a-la-une').appendChild(div);

    } else {
        console.log(result.error);
    }
}

// Référence : liste toutes les actualités publiées et active le filtre par catégorie.
const voirToutesActualites = async () => {
    const response = await fetch('/api/articles', {
        method: 'GET'
    });

    const result = await response.json();

    if (response.ok) {
        result.articles.forEach(async (article) => {
            if (article.status !== 'publié') return;

            const a = document.createElement('a');

            a.setAttribute('href', `/lire-article?id=${article.id}`);

            const date = new Date(article.created_at).toLocaleDateString('fr-FR');

            let catName = "Inconnu"

            if (article.categorie_id) {
                const responseCat = await fetch(`/api/categories/${article.categorie_id}`);

                if (responseCat.ok) {
                    const resultCat = await responseCat.json();
                    catName = resultCat.categorie?.name ?? "Inconnu";
                }
            }


            a.dataset.cat = catName;
            a.innerHTML = `
                <img src="${article.image}" alt="" srcset="">
                <div class="actualite-description">
                    <h3><strong>${article.title}</strong></h3>
                    <div class="actualite-cate">
                        <p class="cat">${catName}</p>
                        <p>${date}</p>
                    </div>
                    <p>${article.summary}</p>
                </div>
            `;


            document.querySelector('.actualite-contenu').appendChild(a);

        });

        const input = document.querySelector('#filtre-by-categorie');
        if (input) {
            input.addEventListener('change', (event) => {
                event.preventDefault();
                const valeur = event.target.value;

                document.querySelectorAll('.actualite-contenu a').forEach(article => {
                    const cat = article.dataset.cat;

                    if (!valeur || cat === valeur) {
                        article.style.display = '';
                    } else {
                        article.style.display = 'none';
                    }
                });
            });
        }
    } else {
        console.log(result.error);
    }
}

// Référence : remplit la liste déroulante des catégories sur la page Actualités.
const afficherCategorieFiltre = async () => {
    const response = await fetch('/api/categories', {
        method: 'GET'
    });

    const result = await response.json();

    if (response.ok) {
        result.categories.forEach(categorie => {
            const option = document.createElement('option');
            option.value = categorie.name;
            option.innerHTML = categorie.name;
            document.querySelector('#filtre-by-categorie').appendChild(option);
        });
    }
}

// Référence : filtre les résultats de recherche par titre ou par catégorie.
const handleSearch = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const articles = document.querySelectorAll('#searchResults a');

    articles.forEach(article => {
        const title = article.querySelector('h3').textContent.toLowerCase();
        const category = article.dataset.cat.toLowerCase();

        if (title.includes(searchTerm) || category.includes(searchTerm)) {
            article.style.display = '';
        } else {
            article.style.display = 'none';
        }
    });
};

export function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Référence : initialise seulement les blocs présents sur la page courante.
if (document.querySelector('.actualite-contenu')) {
    voirToutesActualites();
}
afficherCategorieFooterAndHome();

if (document.querySelector('.equipe-container')) {
    afficherEquipe();
}
if (document.querySelector('.dernieres-actualites-container')) {
    dernieresActualites();
}
if (document.querySelector('.a-la-une')) {
    actualitesALaUne();
}
if (document.querySelector('#filtre-by-categorie')) {
    afficherCategorieFiltre();
}
if (openMenu) {
    openMenu.addEventListener('click', menuOpen);
}
if (closeMenu) {
    closeMenu.addEventListener('click', menuClose);
}
if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}
