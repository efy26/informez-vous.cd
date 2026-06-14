
const tbody = document.querySelector('.article-liste-planifier-redacteur tbody')
const tbodyBrouillons = document.querySelector('.article-liste-brouillons-redacteur tbody')
const tbodyArticle = document.querySelector('.article-liste-redacteur tbody')
const searchInput = document.querySelector('.article-recherche-redacteur input')
const filtreCategorie = document.getElementById('filtre-categorie')
const filtreOrdre = document.getElementById('filtre-ordre')



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
            let resultCat = { categorie: { name: "Inconnu" } }
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
                        <button class="btn-voir-article-brouillons-redacteur">
                            <i><ion-icon name="eye-outline"></ion-icon></i>
                            <span>Voir</span>
                        </button>
                        <button class="btn-editer-article-brouillons-redacteur">
                            <i><ion-icon name="create-outline"></ion-icon></i>
                            <span>Éditer</span>
                        </button>
                        <button class="btn-supprimer-article-brouillons-redacteur">
                            <i><ion-icon name="trash-outline"></ion-icon></i>
                            <span>Supprimer</span>
                        </button>
                    </td>


            `
            tbodyBrouillons.appendChild(tr)
            const btnUpdate = tr.querySelector('.btn-editer-article-brouillons-redacteur')
            const btnVoiroir = tr.querySelector('.btn-voir-article-brouillons-redacteur')
            const btnDelete = tr.querySelector('.btn-supprimer-article-brouillons-redacteur')

            btnUpdate.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/redacteur/update-article/${article.id}`

            })
            btnVoiroir.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/redacteur/apercu-article/${article.id}`

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
                     
                     <td>${resultCat.categorie.name }</td>
                     <td>${dateFormatee}</td>
                     <td>
                         <button class="btn-voir-article-planifier-redacteur">
                             <i><ion-icon name="eye-outline"></ion-icon></i>
                             <span>Voir</span>
                         </button>
                         <button class="btn-editer-article-planifier-redacteur">
                             <i><ion-icon name="create-outline"></ion-icon></i>
                             <span>Éditer</span>
                         </button>
                         <button class="btn-supprimer-article-planifier-redacteur">
                             <i><ion-icon name="trash-outline"></ion-icon></i>
                             <span>Supprimer</span>
                         </button>
                     </td>

            `
            tbody.appendChild(tr)
            const btnUpdate = tr.querySelector('.btn-editer-article-planifier-redacteur')
            const btnVoiroir = tr.querySelector('.btn-voir-article-planifier-redacteur')
            const btnDelete = tr.querySelector('.btn-supprimer-article-planifier-redacteur')

            btnUpdate.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/redacteur/update-article/${article.id}`

            })
            btnVoiroir.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/redacteur/apercu-article/${article.id}`

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

// Afficher articles planifier dans article
const afficherArticlesInArticle = async () => {
    const status = "brouillon"
    const response = await fetch(`/api/articles-redacteur`, {
        method: 'GET'
    })
    const result = await response.json();

    const responseCat = await fetch(`/api/categories/`, {
        method: 'GET'
    })

    const resultCat = await responseCat.json();

    if (responseCat.ok) {
        for (const categorie of resultCat.categories) {
            let option = document.createElement('option')
            option.value = categorie.name
            option.innerHTML = categorie.name

            filtreCategorie.appendChild(option)
        }
    }

    if (response.ok) {

        document.querySelector('.article-content-redacteur h2').textContent = `${result.articles.length} article(s)`

        for (const article of result.articles) {
            let tr = document.createElement('tr')
            let resultCat = { categorie: { name: "Inconnu" } }
            let resultSubCat = null
            const dateFormatee = formatIsoDate(article.created_at);
            const dateFormateePlanifier = formatIsoDate(article.planifier_date, true);
            const datePlanification = new Date(article.planifier_date);
            const maintenant = new Date();

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







            const estExpire = article.status === 'planifié' && datePlanification < maintenant;
            const statutAffiche = estExpire ? 'brouillon' : article.status;

            tr.innerHTML = `

                    <td>${article.title}</td>
                    <td>${resultCat.categorie.name}</td>
                    <td class="${statutAffiche === 'brouillon' ? 'brouillon' : article.status}">${statutAffiche}</td>
                    <td>${dateFormatee} </br></br> ${article.status === 'planifié' && !estExpire ? `Planifié pour : ${dateFormateePlanifier}` : ''
                }</td>

                    <td>
                    
                        <button class="btn-voir-article-redacteur">
                            <i><ion-icon name="eye-outline"></ion-icon></i>
                            <span>Voir</span>
                        </button>
                        
                   
                    </td>


            `
            tbodyArticle.appendChild(tr)

            const btnVoiroir = tr.querySelector(' .btn-voir-article-redacteur')


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

                if (article.title.toLowerCase().includes(searchTerm) || article.status.toLowerCase().includes(searchTerm) || resultCat.categorie.name.toLowerCase().includes(searchTerm)) {
                    tr.style.display = '';
                } else {
                    tr.style.display = 'none';
                }
            })


            btnVoiroir.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `/redacteur/apercu-article/${article.id}`

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