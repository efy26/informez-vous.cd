

const openFormCreatPub = document.querySelector('.btn-creer-publicite-admin')

const formCreatePub = document.querySelector('#create-publicite-form')
const inputCreatePub = document.querySelectorAll('#create-publicite-form input')
const selectCreatePub = document.querySelectorAll('#create-publicite-form select')
const textAreaCreatePub = document.querySelector('#create-publicite-form textarea')
const formUpdatePub = document.querySelector('#update-publicite-form')
const inputUpdatePub = document.querySelectorAll('#update-publicite-form input')
const selectUpdatePub = document.querySelectorAll('#update-publicite-form select')
const textAreaUpdatePub = document.querySelector('#update-publicite-form textarea')
const tbody = document.querySelector('tbody')
let pubToUpdateId = null
let btnUpdatePubCurrent = null
let trContent = null

document.querySelector('.message').innerHTML = ""



const createPub = async (event) => {
    event.preventDefault();



    const formData = new FormData();

    formData.append('titre', textAreaCreatePub.value);
    formData.append('image_url', inputCreatePub[0].files[0]);
    formData.append('lien_url', inputCreatePub[1].value);
    formData.append('position', selectCreatePub[0].value);
    formData.append('actif', inputCreatePub[2].checked);
    formData.append('date_debut', inputCreatePub[3].value);
    formData.append('date_fin', inputCreatePub[4].value);

    const response = await fetch('/api/pub', {
        method: 'POST',
        body: formData
    })

    const result = await response.json()
    const pub = result.pubCreated

    if (response.ok) {


        document.querySelector('.message').innerHTML = result.message
        document.querySelector('.message').style.color = 'unset'
        document.querySelector('.message').style.color = 'green'

        const tr = document.createElement('tr')



        tr.innerHTML = `
                    <td>${inputCreatePub[1].value}</td>
                    <td >${selectCreatePub[0].value}</td>
                    <td style="color:${inputCreatePub[2].checked ? 'green ' : 'red'}; background:${inputCreatePub[2].checked ? 'rgba(0, 128, 0, 0.144) ' : 'rgba(255, 0, 0, 0.125)'}">${inputCreatePub[2].checked}</td>
                    <td>${inputCreatePub[3].value.split('T')[0]}</td>
                    <td>${inputCreatePub[4].value.split('T')[0]}</td>
                    <td>0</td>
                    <td>
                        <button data-id="${pub.id}" class="btn-editer-publicite-admin">
                            <i><ion-icon name="create-outline"></ion-icon></i>
                            <span>Éditer</span>
                        </button>
                        <button class="btn-supprimer-publicite-admin">
                            <i><ion-icon name="trash-outline"></ion-icon></i>
                            <span>Supprimer</span>
                        </button>
                        
                    </td>
                
                `
        tbody.appendChild(tr)
        document.querySelector('.publicite-content-admin h2').innerText = "";
        document.querySelector('.publicite-content-admin h2').innerText = `${tbody.querySelectorAll('tr').length} Publicités`;

        

        const btnUpdatePub = tr.querySelector('.btn-editer-publicite-admin')
        const btnSupprimerPub = tr.querySelector('.btn-supprimer-publicite-admin')



        btnUpdatePub.addEventListener('click', async (event) => {
            event.preventDefault()

            document.querySelector('.edit-publicite-admin').style.display = 'unset'
            document.querySelector('.creer-publicite-admin').style.display = 'none'
            event.currentTarget.style.display = 'none'

        })

        btnSupprimerPub.addEventListener('click', async (event) => {
            event.preventDefault()

            const response = await fetch(`/api/pub/${pub.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })

            const result = await response.json()

            if (response.ok) {

                tbody.removeChild(tr)

            } else {

                document.querySelector('.message').style.color = 'red'
                document.querySelector('.message').innerHTML = result.error

            }

        })

        textAreaCreatePub.value = ""
        inputCreatePub[0].value= ""
        inputCreatePub[1].value = ""
        inputCreatePub[2].checked = false
        inputCreatePub[3].value = ""
        inputCreatePub[4].value = ""

    } else {
        document.querySelector('.message').style.color = 'red'
        document.querySelector('.message').innerHTML = result.error

    }

}
formCreatePub.addEventListener("submit", createPub)

const afficherPubs = async () => {
    const header = 'header'
    const footer = 'footer'
    const nombrePub = tbody




    const response = await fetch('/api/pub');
    const result = await response.json();

    if (response.ok) {

        for (const pub of result.pub) {
            const tr = document.createElement('tr')
            const dateActulle = new Date()
            const dateDeFin = new Date(pub.date_fin)


            if (dateActulle > dateDeFin) {
                const responseUpdatePub = await fetch(`/api/pub/${pub.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ actif: false })
                })
            }




            tr.innerHTML = `
                    <td>${pub.lien_url}</td>
                    <td >${pub.position}</td>
                    <td style="color:${pub.actif ? 'green ' : dateActulle > dateDeFin ? 'gray' : 'red'}; background:${pub.actif ? 'rgba(0, 128, 0, 0.144) ' : dateActulle > dateDeFin ? 'rgba(128, 128, 128, 0.215)' : 'rgba(255, 0, 0, 0.125)'}">${dateActulle > dateDeFin ? 'Expirée' : pub.actif}</td>
                    <td>${pub.date_debut.split('T')[0]}</td>
                    <td>${pub.date_fin.split('T')[0]}</td>
                    <td>${pub.clicks}</td>
                    <td>
                        <button data-id="${pub.id}" class="btn-editer-publicite-admin">
                            <i><ion-icon name="create-outline"></ion-icon></i>
                            <span>Éditer</span>
                        </button>
                        <button class="btn-supprimer-publicite-admin">
                            <i><ion-icon name="trash-outline"></ion-icon></i>
                            <span>Supprimer</span>
                        </button>
                        
                    </td>
                
                `
            tbody.appendChild(tr)

            document.querySelector('.publicite-content-admin h2').innerText = `${tbody.querySelectorAll('tr').length} Publicités`;

            const btnUpdatePub = tr.querySelector('.btn-editer-publicite-admin')
            const btnSupprimerPub = tr.querySelector('.btn-supprimer-publicite-admin')

            btnUpdatePub.addEventListener('click', async (event) => {
                event.preventDefault()

                pubToUpdateId = event.currentTarget.dataset.id;
                btnUpdatePubCurrent = event.currentTarget

                trContent = tr.querySelectorAll('td');

                document.querySelector('.edit-publicite-admin').style.display = 'unset'
                document.querySelector('.creer-publicite-admin').style.display = 'none'
                event.currentTarget.style.display = 'none'

                textAreaUpdatePub.value = pub.titre
                selectUpdatePub[0].value = pub.position
                inputUpdatePub[1].value = pub.lien_url
                inputUpdatePub[2].checked = pub.actif
                inputUpdatePub[3].value = pub.date_debut.split('T')[0];
                inputUpdatePub[4].value = pub.date_fin.split('T')[0];

                document.querySelector('.message').innerHTML = ""


            })



            btnSupprimerPub.addEventListener('click', async (event) => {
                event.preventDefault()

                const response = await fetch(`/api/pub/${pub.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })

                const result = await response.json()

                if (response.ok) {

                    tbody.removeChild(tr)
                    document.querySelector('.publicite-content-admin h2').innerText = "";
                    document.querySelector('.publicite-content-admin h2').innerText = `${tbody.querySelectorAll('tr').length} Publicités`;

                } else {

                    document.querySelector('.message').style.color = 'red'
                    document.querySelector('.message').innerHTML = result.error

                }

            })

        }
       
    }



}
afficherPubs()


const updatePub = async (event) => {
    event.preventDefault()
    


    const formData = new FormData();

    formData.append('titre', textAreaUpdatePub.value);
    formData.append('image_url', inputUpdatePub[0].files[0]);
    formData.append('lien_url', inputUpdatePub[1].value);
    formData.append('position', selectUpdatePub[0].value);
    formData.append('actif', inputUpdatePub[2].checked);
    formData.append('date_debut', inputUpdatePub[3].value);
    formData.append('date_fin', inputUpdatePub[4].value);


    if (!textAreaUpdatePub.value || !selectUpdatePub[0].value || !inputUpdatePub[1].value || !inputUpdatePub[3].value || !inputUpdatePub[4].value) {
        document.querySelector('.message').innerHTML = "Tous les champs sont requis"
        document.querySelector('.message').style.color = 'unset'
        document.querySelector('.message').style.color = 'red'
        return;
    }

    if (!pubToUpdateId) {
        document.querySelector('.message').innerHTML = "Erreur lors de la modification"
        document.querySelector('.message').style.color = 'unset'
        document.querySelector('.message').style.color = 'red'
        return;
    }

    const response = await fetch(`/api/pub/${pubToUpdateId}`, {
        method: 'PATCH',
        body: formData
    })

    const result = await response.json()

    if (response.ok) {
        

        
        btnUpdatePubCurrent.style.display = 'unset'

        const estActif = inputUpdatePub[2].checked
        const statutTd = trContent[2];

        statutTd.style.color = estActif ? 'green' : 'red'
        statutTd.style.background = estActif ? 'rgba(0, 128, 0, 0.144) ' : 'rgba(255, 0, 0, 0.125)'
        statutTd.innerText = estActif ? "true" : "false";

        textAreaUpdatePub.value = ""
        inputUpdatePub[0].value = ""
        inputUpdatePub[1].value = ""
        inputUpdatePub[2].checked = false
        inputUpdatePub[3].value = ""
        inputUpdatePub[4].value = ""
        
        document.querySelector('.message').innerHTML = result.message
        document.querySelector('.message').style.color = 'unset'
        document.querySelector('.message').style.color = 'green'

    } else {
        document.querySelector('.message').innerHTML = result.error
        document.querySelector('.message').style.color = 'unset'
        document.querySelector('.message').style.color = 'red'
    }

}
formUpdatePub.addEventListener('submit', updatePub)




openFormCreatPub.addEventListener('click', (event) => {

    document.querySelector('.creer-publicite-admin').style.display = 'unset'
    document.querySelector('.edit-publicite-admin').style.display = 'none'
})
