const tbody = document.querySelector('tbody')
const sousCategorieForm = document.querySelector('#sous-categorie-form')
const sousCategorieInput = document.querySelector('#sous-categorie-form input')
const sousCategorieSelect = document.querySelector('#sous-categorie-form select')
const sousCategorieLabel = document.querySelector('.creer-sous-categorie-admin label')
const updateCategorieForm = document.querySelector('.sous-categorie-form')
const updateCategorieInput = document.querySelector('.sous-categorie-form input')
const editeBlock = document.querySelector('#edite-block-admin')
const createCategorieBlock = document.querySelector('#create-categorie-block-admin')
const createCategorieForm = document.querySelector('.create-categorie-form')
const createCategorieInput = document.querySelector('.create-categorie-form input')
const btnCreateCategorie = document.querySelector('.btn-creer-categorie-admin')




const afficherCategorie = async () => {
    const response = await fetch('/api/categories', {
        method: 'GET'
    })

    const result = await response.json();

    if (response.ok) {



        for (const categorie of result.categories) {
            let tr = document.createElement('tr')
            let option = document.createElement('option')
            option.value = categorie.id
            option.innerHTML = categorie.name

            const responseSubCat = await fetch('/api/sub-categories', {
                method: 'GET'
            })


            const resultSubCat = await responseSubCat.json();


            const count = responseSubCat.ok
                ? resultSubCat.subCategories.filter(
                    sc => sc.categorie_id === categorie.id
                ).length
                : 0;


            tr.innerHTML = `
                <td>${categorie.name}</td>
                    <td>${responseSubCat.ok ? count : 0}</td>
                    <td class="count">${categorie.created_at.split('T')[0]}</td>
                    <td>
                        <button class="btn-editer-categorie-admin">
                            <i><ion-icon name="create-outline"></ion-icon></i>
                            <span>Éditer</span>
                        </button>
                        <button class="btn-supprimer-categorie-admin">
                            <i><ion-icon name="trash-outline"></ion-icon></i>
                            <span>Supprimer</span>
                        </button>
                        
                    </td>
            
            `
            tbody.appendChild(tr)
            sousCategorieSelect.appendChild(option)

            const btnUpdateCategorie = tr.querySelector('.btn-editer-categorie-admin')
            const btnSupprimerCategorie = tr.querySelector('.btn-supprimer-categorie-admin')



            const editeBtn = async (event) => {
                event.preventDefault();

                editeBlock.style = 'display: block;'

                updateCategorieInput.value = categorie.name

                const updateCategorie = async (event) => {
                    event.preventDefault();

                    const dateUpdate = {
                        name: updateCategorieInput.value
                    }
                    const response = await fetch(`/api/categories/${categorie.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dateUpdate)
                    })

                    const result = await response.json();

                    if (response.ok) {
                        editeBlock.style = 'display: none;'
                        sousCategorieLabel.style = 'display: block;'
                        sousCategorieLabel.classList.remove('error')
                        sousCategorieLabel.classList.add('success')
                        sousCategorieLabel.innerHTML = result.message
                    } else {
                        editeBlock.style = 'display: block;'
                        sousCategorieLabel.style = 'display: block;'
                        sousCategorieLabel.classList.remove('success')
                        sousCategorieLabel.classList.add('error')
                        sousCategorieLabel.innerHTML = result.error
                    }


                }

                updateCategorieForm.addEventListener('submit', updateCategorie)



            }

            const deleteBtn = async (event) => {
                event.preventDefault();

                const response = await fetch(`/api/categories/${categorie.id}`, {
                    method: 'DELETE'
                })

                const result = await response.json()

                if (response.ok) {
                    tbody.removeChild(tr)
                } else {
                    return

                }
            }


            btnUpdateCategorie.addEventListener('click', editeBtn)
            btnSupprimerCategorie.addEventListener('click', deleteBtn)


        };



    } else {
        let tr = document.createElement('tr')
        tr.innerHTML = result.error
    }

}
afficherCategorie()

const createSubCategorie = async (event) => {
    event.preventDefault()

    const dataSubCategorie = {
        name: sousCategorieInput.value,
        categorie_id: sousCategorieSelect.value
    }

    const responseCreateSubCat = await fetch('/api/sub-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataSubCategorie)

    })

    const resultCreateSubCat = await responseCreateSubCat.json();

    if (responseCreateSubCat.ok) {
        tbody.innerHTML = ''
        await afficherCategorie();


        sousCategorieInput.value = ''
        sousCategorieSelect.value = ''
        sousCategorieLabel.style = 'display: block;'
        sousCategorieLabel.classList.remove('error')
        sousCategorieLabel.classList.add('success')
        sousCategorieLabel.innerHTML = resultCreateSubCat.message

    } else {
        sousCategorieLabel.style = 'display: block;'
        sousCategorieLabel.classList.add('error')
        sousCategorieLabel.innerHTML = resultCreateSubCat.error
    }


}
const createCategorie = async (event) => {
    event.preventDefault();
    event.currentTarget.style = 'display: none;'
    createCategorieBlock.style = 'display: block;'


}

const btnCreateCat = async (e) => {
    e.preventDefault();

    const dataCategorie = {
        name: createCategorieInput.value
    }

    const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataCategorie)
    })

    const result = await response.json();

    if (response.ok) {
        createCategorieBlock.style = 'display: none;'
        btnCreateCategorie.style = 'display: block;'
        sousCategorieLabel.style = 'display: block;'
        sousCategorieLabel.classList.remove('error')
        sousCategorieLabel.classList.add('success')
        sousCategorieLabel.innerHTML = result.message



        const responseGet = await fetch('/api/categories', {
            method: 'GET'
        })

        const resultGET = await responseGet.json();

        if (responseGet.ok) {

            const tr = document.createElement('tr')


            const lastCategory = resultGET.categories[resultGET.categories.length - 1];
            tr.innerHTML = `
                <td>${createCategorieInput.value}</td>
                    <td>0</td>
                    <td>${lastCategory.created_at.split('T')[0]}</td>
                    <td>
                        <button class="btn-editer-categorie-admin">
                            <i><ion-icon name="create-outline"></ion-icon></i>
                            <span>Éditer</span>
                        </button>
                        <button class="btn-supprimer-categorie-admin">
                            <i><ion-icon name="trash-outline"></ion-icon></i>
                            <span>Supprimer</span>
                        </button>
                        
                    </td>
            
            `
            tbody.appendChild(tr)
            createCategorieInput.value = ''

        }




    } else {
        createCategorieBlock.style = 'display: block;'
        sousCategorieLabel.style = 'display: block;'
        sousCategorieLabel.classList.remove('success')
        sousCategorieLabel.classList.add('error')
        sousCategorieLabel.innerHTML = result.error
    }
}

if (createCategorieForm) {
    createCategorieForm.addEventListener('submit', btnCreateCat)
}
if (btnCreateCategorie) {
    btnCreateCategorie.addEventListener('click', createCategorie)
}
if (sousCategorieForm) {

    sousCategorieForm.addEventListener('submit', createSubCategorie)
}




