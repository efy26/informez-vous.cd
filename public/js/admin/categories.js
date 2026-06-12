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

            const responseSubCat = await fetch(`/api/sub-categories/categories/${categorie.id}`, {
                method: 'GET'
            })
            const resultSubCat = await responseSubCat.json();





            tr.innerHTML = `
                <td>${categorie.name}</td>
                    <td>${responseSubCat.ok ? resultSubCat.subCategories.length : 0}</td>
                    <td>${categorie.created_at.split('T')[0]}</td>
                    <td>
                        <button class="btn-editer-categorie-admin">
                            <i><ion-icon name="create-outline"></ion-icon></i>
                            <span>Éditer</span>
                        </button>
                        
                    </td>
            
            `
            tbody.appendChild(tr)
            sousCategorieSelect.appendChild(option)

            const btnUpdateCategorie = tr.querySelector('.btn-editer-categorie-admin')



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


            btnUpdateCategorie.addEventListener('click', editeBtn)


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

        createCategorieInput.value = ''
    } else {
        createCategorieBlock.style = 'display: block;'
        sousCategorieLabel.style = 'display: block;'
        sousCategorieLabel.classList.remove('success')
        sousCategorieLabel.classList.add('error')
        sousCategorieLabel.innerHTML = result.error
    }
}
createCategorieForm.addEventListener('submit', btnCreateCat)
btnCreateCategorie.addEventListener('click', createCategorie)



sousCategorieForm.addEventListener('submit', createSubCategorie)