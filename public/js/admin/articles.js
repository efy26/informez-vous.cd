// import e = require("express")

const tbody = document.querySelector('.article-liste-planifier-admin tbody')
const tbodyBrouillons = document.querySelector('.article-liste-brouillons-admin tbody')
const tbodyArticle = document.querySelector('.article-liste-admin tbody')
const searchInput = document.querySelector('.article-recherche-admin input')
const filtreCategorie = document.getElementById('filtre-categorie')
const filtreOrdre = document.getElementById('filtre-ordre')
const afficherLienPartage = document.querySelector('.afficher-lien-partage')
const urlCopierContainer = document.querySelector('.afficher-lien-partage-container')
const btnCopierLien = document.querySelector('.afficher-lien-partage-container ion-icon')



const formatIsoDate = (value, keepTime = false) => {
    if (!value) return '';

    const date = new Date(value);

    const datePart = date.toLocaleDateString('fr-CA');

    if (!keepTime) {
        return datePart;
    }

    const timePart = date.toLocaleTimeString('fr-CA', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return `${datePart} à ${timePart}`;
};

// Afficher articles planifier dans planifier
const afficherArticlesPlanifier = async () => {
    const status = "planifié"
    const response = await fetch(`/api/articles-status/${status}`, {
        method: 'GET'
    })

    const result = await response.json();

    if (response.ok) {

        for (const article of result.article) {
            let tr = document.createElement('tr')
            let resultCat = { categorie: { name: "Inconnu" } }
            let resultSubCat = null
            const dateFormatee = formatIsoDate(article.planifier_date, true);

            if (article.categorie_id) {
                const responseCat = await fetch(`/api/categories/${article.categorie_id}`, {
                    method: 'GET'
                })

                if (responseCat.ok) {
                    resultCat = await responseCat.json();
                }

            }


            if (article.subcategorie_id) {
                const responseSubCat = await fetch(`/api/sub-categories/${article.subcategorie_id}`, {
                    method: 'GET'
                })

                if (responseSubCat.ok) {
                    resultSubCat = await responseSubCat.json();
                }

            }


            tr.innerHTML = `
            <td>${article.title}</td>
                     
                     <td>${resultCat.categorie.name}</td>
                     <td>${dateFormatee}</td>
                     <td>
                         <button class="btn-voir-article-planifier-admin">
                             <i><ion-icon name="eye-outline"></ion-icon></i>
                             <span>Voir</span>
                         </button>
                         <button class="btn-editer-article-planifier-admin">
                             <i><ion-icon name="create-outline"></ion-icon></i>
                             <span>Éditer</span>
                         </button>
                         <button class="btn-supprimer-article-planifier-admin">
                             <i><ion-icon name="trash-outline"></ion-icon></i>
                             <span>Supprimer</span>
                         </button>
                     </td>

            `
            tbody.appendChild(tr)
            const btnUpdate = tr.querySelector('.btn-editer-article-planifier-admin')
            const btnVoiroir = tr.querySelector('.btn-voir-article-planifier-admin')
            const btnDelete = tr.querySelector('.btn-supprimer-article-planifier-admin')

            btnUpdate.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/admin/update-article/${article.id}`

            })
            btnVoiroir.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/admin/apercu-article/${article.id}`

            })
            btnDelete.addEventListener('click', async (e) => {
                e.preventDefault();

                const response = await fetch(`/api/articles/${article.id}`, {
                    method: 'DELETE'
                })

                const result = await response.json()

                if (response.ok) {
                    tbody.removeChild(tr)
                } else {
                    console.log(result.error);

                }

            })


        }
    }
}

// Afficher articles brouillons dans brouillon
const afficherArticlesBrouillon = async () => {
    const status = "brouillon"
    const response = await fetch(`/api/articles-status-brouillon/${status}`, {
        method: 'GET'
    })

    const result = await response.json();

    if (response.ok) {
        const n = 0
        for (const article of result.article) {
            let tr = document.createElement('tr')

            let resultCat = { categorie: { name: "Inconnu" } };
            let resultSubCat = null
            const dateFormatee = formatIsoDate(article.created_at);

            if (article.categorie_id) {

                const responseCat = await fetch(`/api/categories/${article.categorie_id}`, {
                    method: 'GET'
                })

                if (responseCat.ok) {
                    resultCat = await responseCat.json();

                }

            }


            if (article.subcategorie_id) {
                const responseSubCat = await fetch(`/api/sub-categories/${article.subcategorie_id}`, {
                    method: 'GET'
                })

                if (responseSubCat.ok) {
                    resultSubCat = await responseSubCat.json();
                }

            }

            tr.innerHTML = `

                    <td>${article.title}</td>
                    <td>${resultCat.categorie.name}</td>
                    <td>${dateFormatee}</td>
                    <td>
                        <button class="btn-voir-article-brouillons-admin">
                            <i><ion-icon name="eye-outline"></ion-icon></i>
                            <span>Voir</span>
                        </button>
                        <button class="btn-editer-article-brouillons-admin">
                            <i><ion-icon name="create-outline"></ion-icon></i>
                            <span>Éditer</span>
                        </button>
                        <button class="btn-supprimer-article-brouillons-admin">
                            <i><ion-icon name="trash-outline"></ion-icon></i>
                            <span>Supprimer</span>
                        </button>
                    </td>
                    `
            tbodyBrouillons.appendChild(tr)






            const btnUpdate = tr.querySelector('.btn-editer-article-brouillons-admin')
            const btnVoiroir = tr.querySelector('.btn-voir-article-brouillons-admin')
            const btnDelete = tr.querySelector('.btn-supprimer-article-brouillons-admin')

            btnUpdate.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/admin/update-article/${article.id}`

            })
            btnVoiroir.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/admin/apercu-article/${article.id}`

            })
            btnDelete.addEventListener('click', async (e) => {
                e.preventDefault();

                const response = await fetch(`/api/articles/${article.id}`, {
                    method: 'DELETE'
                })

                const result = await response.json()

                if (response.ok) {
                    tbodyBrouillons.removeChild(tr)
                } else {
                    console.log(result.error);

                }

            })


        }
    }
}

if (btnCopierLien) {
    btnCopierLien.addEventListener('click', async (e) => {

        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: "Regarde cet article intéressant",
                    url: afficherLienPartage.innerHTML
                });
            } catch (err) {
                console.log("Partage annulé", err);
            }
        } else {
            // fallback
            navigator.clipboard.writeText(afficherLienPartage.innerHTML);

        }
        urlCopierContainer.style.color = 'green'
        urlCopierContainer.innerHTML = "Lien copié !"

        console.log(afficherLienPartage.innerHTML);


    })
}

// Afficher articles planifier dans article
const afficherArticlesInArticle = async () => {
    const status = "brouillon"
    const response = await fetch(`/api/articles/`, {
        method: 'GET'
    })


    const result = await response.json();




    if (response.ok) {

        const responseAllCategories = await fetch('/api/categories', {
                method: 'GET'
            });

            const resultAllCategories = await responseAllCategories.json();

            if (responseAllCategories.ok) {


                for (const categorie of resultAllCategories.categories) {

                    let option = document.createElement("option");

                    option.value = categorie.name;
                    option.textContent = categorie.name;

                    filtreCategorie.appendChild(option);
                    console.log(categorie.name);


                }

            } else {
                console.log(resultAllCategories.error);
            }

        document.querySelector('.article-content-admin h2').textContent = `${result.articles.length} article(s)`

        for (const article of result.articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))) {
            let tr = document.createElement('tr')

            let resultCat = { categorie: { name: "Inconnu" } };

            if (article.categorie_id) {
                const responseCat = await fetch(`/api/categories/${article.categorie_id}`);



                if (responseCat.ok) {
                    resultCat = await responseCat.json();

                }
            }
            



            let resultSubCat = null

            if (article.subcategorie_id) {
                const responseSubCat = await fetch(`/api/sub-categories/${article.subcategorie_id}`, {
                    method: 'GET'
                })

                if (responseSubCat.ok) {
                    resultSubCat = await responseSubCat.json();
                }
            }


            const responseAuteur = await fetch(`/api/users/${article.author_id}`, {
                method: 'GET'
            })



            const resultAuteur = await responseAuteur.json();

            const dateFormatee = formatIsoDate(article.created_at);
            const dateFormateePlanifier = formatIsoDate(article.planifier_date, true);
            const datePlanification = new Date(article.planifier_date);
            const maintenant = new Date();

            const estExpire = article.status === 'planifié' && datePlanification < maintenant;
            const statutAffiche = estExpire ? 'brouillon' : article.status;
            const estPlanifieNonExpire =
                article.status === 'planifié' &&
                datePlanification > maintenant;


            tr.innerHTML =

                `

                    <td>${article.title}</td>
                    <td>${resultAuteur.users.first_name}</td>
                    <td>${resultCat.categorie.name}</td>
                    <td class="${statutAffiche === 'brouillon' ? 'brouillon' : article.status}">${statutAffiche}</td>
                    <td>${dateFormatee} </br></br> ${article.status === 'planifié' && !estExpire ? `Planifié pour : ${dateFormateePlanifier}` : ''
                }</td>

                    <td>
                    
                        <button class="btn-voir-article-admin">
                            <i><ion-icon name="eye-outline"></ion-icon></i>
                            <span>Voir</span>
                        </button>
                        <button ${estPlanifieNonExpire ? 'disabled' : ''}  id="${article.status === 'publié' ? 'deletebtn' : ''}" class="btn-valider-article-admin">
                            <i>${article.status !== 'publié' ? '<ion-icon name="thumbs-up-outline"></ion-icon>' :
                    '<ion-icon name="return-up-back-outline"></ion-icon>'
                }</i>
                            <span>${article.status === 'publié' ? 'Retirer' : 'Approuver'}</span>
                        </button>
                        <button class="btn-supprimer-article-admin">
                            <i><ion-icon name="trash-outline"></ion-icon></i>
                            <span>Supprimer</span>
                        </button>
                   
                    </td>


            `
            tbodyArticle.appendChild(tr)
            const btnValider = tr.querySelector(' .btn-valider-article-admin')
            const btnVoiroir = tr.querySelector(' .btn-voir-article-admin')
            const btnDelete = tr.querySelector(' .btn-supprimer-article-admin')


            filtreCategorie.addEventListener('change', (e) => {
                const selectedCategory = e.target.value;

                if (selectedCategory === '' || resultCat.categorie.name === selectedCategory) {
                    tr.style.display = '';
                } else {
                    tr.style.display = 'none';
                }
            });

            filtreOrdre.addEventListener('change', (e) => {
                const selectedOrder = e.target.value;

                if (selectedOrder === 'asc') {
                    tbodyArticle.appendChild(tr);
                } else if (selectedOrder === 'desc') {
                    tbodyArticle.insertBefore(tr, tbodyArticle.firstChild);
                }
            });
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();

                console.log(searchTerm);

                if (article.title.toLowerCase().includes(searchTerm) || resultAuteur.users.first_name.toLowerCase().includes(searchTerm) || resultCat.categorie.name.toLowerCase().includes(searchTerm)) {
                    tr.style.display = '';
                } else {
                    tr.style.display = 'none';
                }
            })


            btnValider.addEventListener('click', async (e) => {
                e.preventDefault();

                const nouveauStatus =
                    article.status === 'publié'
                        ? 'brouillon'
                        : 'publié';

                const formData = new FormData();
                formData.append('status', nouveauStatus);

                const response = await fetch(`/api/articles/${article.id}`, {
                    method: 'PATCH',
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {

                    article.status = nouveauStatus;

                    tr.querySelector('td:nth-child(4)').textContent = nouveauStatus;

                    tr.querySelector('td:nth-child(4)').classList.remove(
                        'publié',
                        'planifié',
                        'brouillon'
                    );

                    tr.querySelector('td:nth-child(4)').classList.add(nouveauStatus);

                    const icon = btnValider.querySelector('ion-icon');
                    const span = btnValider.querySelector('span');

                    if (nouveauStatus === 'publié') {
                        urlCopierContainer.style.display = 'flex'
                        icon.setAttribute('name', 'return-up-back-outline');
                        span.textContent = 'Retirer';
                        afficherLienPartage.innerHTML = `
                            https://informez-vous-cd.onrender.com/lire-article?id=${result.articleUpdated.id}
                        `
                    } else {
                        icon.setAttribute('name', 'thumbs-up-outline');
                        span.textContent = 'Approuver';
                    }
                } else {
                    console.log(result.error);
                }
            });




            btnVoiroir.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/admin/apercu-article/${article.id}`

            })

            btnDelete.addEventListener('click', async (e) => {
                e.preventDefault();

                const response = await fetch(`/api/articles/${article.id}`, {
                    method: 'DELETE'
                })

                const result = await response.json()

                if (response.ok) {

                    tbodyArticle.removeChild(tr)

                    const nombreArticles = tbodyArticle.querySelectorAll('tr').length;

                    document.querySelector('.article-content-admin h2').textContent =
                        `${nombreArticles} article(s)`;
                } else {
                    console.log(result.error);

                }

            })


        }
    }
}

if (tbodyArticle) {
    afficherArticlesInArticle();
}

if (tbody) {
    afficherArticlesPlanifier();
}

if (tbodyBrouillons) {
    afficherArticlesBrouillon();
}





