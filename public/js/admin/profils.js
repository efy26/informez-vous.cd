const profilListeAdmin = document.querySelector(".profil-liste-admin ol")
const profilInfoListeAdmin = document.querySelector('.profil-info-liste-admin form')

const getUsers = async () => {

    const response = await fetch('/api/users', {
        method: 'GET'
    })

    const result = await response.json()

    if (response.ok) {
        result.users.map(users => {
            const li = document.createElement('li')

            li.innerHTML =
                `
                 <div class="profil-info-admin">
                        <div class="profil-image-admin">
                            ${users.first_name.charAt(0).toUpperCase()}
                            ${users.last_name.charAt(0).toUpperCase()}
                        </div>
                        <div class="profil-details-admin">
                            <p><strong>${users.username}</strong></p>
                            <p class="email">${users.email}</p>
                        </div>
                    </div>
            `
            profilListeAdmin.appendChild(li)

            // Afficher users
            const afficherInfo = async (event) => {
                const allLi = document.querySelectorAll('.profil-liste-admin ol li')
                allLi.forEach(items => {
                    items.classList.remove('active')
                })
                event.currentTarget.classList.add('active')

                profilInfoListeAdmin.innerHTML = `
            
                <li><label>Nom d'utilisateur :</label> 
                <input type="text" value="${users.username}" disabled></li>
                        <li><label>E-mail :</label> 
                        <input type="email" value="${users.email}" disabled></li>
                        <li><label>Nouveau mot de passe :</label> <input type="password" disabled></li>
                        <li><label>Rôle:</label> 
                        <input type="text" value="${users.role}" disabled></li>
                        <li><label>Statut:</label> 
                        <input type="text" value="${users.status}" disabled>
                        <select name="status" id="status" aria-label="Status" disabled>
                            <option value="actif">Actif</option>
                            <option value="bloquer">Bloquer</option>
                        </select>
                        </li>
                        <li><label>Prénom:</label> 
                        <input type="text" value="${users.first_name}" disabled></li>
                        <li><label>Nom:</label> 
                        <input type="text" value="${users.last_name}" disabled></li>
                        <li><label>Téléphone:</label> 
                        <input type="text" value="${users.phone}" disabled></li>
                        <li><label>Adresse:</label> 
                        <input type="text" value="${users.address_home}" disabled></li>
                        <li><label>Ville:</label> 
                        <input type="text" value="${users.city}" disabled></li>
                        <li><label>Code postal/Numero parcelle:</label> 
                        <input type="text" value="${users.postal_code}" disabled></li>
                        <li>
                            <label>Pays:</label> 

                            <select name="country" id="country" aria-label="Pays" disabled>
                            <option value="${users.country}">${users.country}</option>

                            <option value="Afrique du Sud">Afrique du Sud</option>
                            <option value="Algérie">Algérie</option>
                            <option value="Angola">Angola</option>
                            <option value="Bénin">Bénin</option>
                            <option value="Botswana">Botswana</option>
                            <option value="Burkina Faso">Burkina Faso</option>
                            <option value="Burundi">Burundi</option>
                            <option value="Cabo Verde">Cabo Verde</option>
                            <option value="Cameroun">Cameroun</option>
                            <option value="Centrafrique">Centrafrique</option>
                            <option value="Comores">Comores</option>
                            <option value="Congo">Congo</option>
                            <option value="Côte d’Ivoire">Côte d’Ivoire</option>
                            <option value="Djibouti">Djibouti</option>
                            <option value="Égypte">Égypte</option>
                            <option value="Érythrée">Érythrée</option>
                            <option value="Eswatini">Eswatini</option>
                            <option value="Éthiopie">Éthiopie</option>
                            <option value="Gabon">Gabon</option>
                            <option value="Gambie">Gambie</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Guinée">Guinée</option>
                            <option value="Guinée-Bissau">Guinée-Bissau</option>
                            <option value="Guinée équatoriale">Guinée équatoriale</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Lesotho">Lesotho</option>
                            <option value="Liberia">Liberia</option>
                            <option value="Libye">Libye</option>
                            <option value="Madagascar">Madagascar</option>
                            <option value="Malawi">Malawi</option>
                            <option value="Mali">Mali</option>
                            <option value="Maroc">Maroc</option>
                            <option value="Maurice">Maurice</option>
                            <option value="Mauritanie">Mauritanie</option>
                            <option value="Mozambique">Mozambique</option>
                            <option value="Namibie">Namibie</option>
                            <option value="Niger">Niger</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Ouganda">Ouganda</option>
                            <option value="RDC">République démocratique du Congo</option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="Sao Tomé-et-Principe">Sao Tomé-et-Principe</option>
                            <option value="Sénégal">Sénégal</option>
                            <option value="Seychelles">Seychelles</option>
                            <option value="Sierra Leone">Sierra Leone</option>
                            <option value="Somalie">Somalie</option>
                            <option value="Soudan">Soudan</option>
                            <option value="Soudan du Sud">Soudan du Sud</option>
                            <option value="Tanzanie">Tanzanie</option>
                            <option value="Tchad">Tchad</option>
                            <option value="Togo">Togo</option>
                            <option value="Tunisie">Tunisie</option>
                            <option value="Zambie">Zambie</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                            </select>
                        </li>
                        <div class="profil-btn-update-admin">
                            <button type="">Modifier le profil</button>
                        </div>
                        <div class="profil-btn-update-admin">
                            <button type="submit">Valider le profil</button>
                        </div>
                        <div class="profil-btn-update-admin">
                            <input type="button" value="Supprimer le profil">
                        </div>
                        <label class="message">Modifier avec succes</label>
            
            `
                // Modifier et supprimer user
                const profilBtnUpdateAdmin = document.querySelector('.profil-info-liste-admin form button')
                const profilBtnvaliderAdmin = document.querySelector(".profil-info-liste-admin form button[type='submit']")
                const profilInputUpdateAdmin = document.querySelectorAll('.profil-info-liste-admin form input')
                const profilbtnDeleteAdmin = document.querySelector('.profil-info-liste-admin form input[type="button"]')
                const profilSelectUpdateAdmin = document.querySelectorAll('.profil-info-liste-admin form select')

                const ouvrirChamps = async (event) => {
                    event.preventDefault()
                    profilBtnvaliderAdmin.style = 'display: block;'
                    event.currentTarget.style = 'display: none;'
                    document.querySelector(".message").style = "display: none;"

                    profilInputUpdateAdmin.forEach(input => {
                        input.removeAttribute('disabled')
                    })
                    profilSelectUpdateAdmin.forEach(select => {
                        select.removeAttribute('disabled')
                    })


                    profilInfoListeAdmin.addEventListener('submit', async (e) => {
                        e.preventDefault()

                        const dateUpdate = {
                            username: profilInputUpdateAdmin[0].value,
                            email: profilInputUpdateAdmin[1].value,
                            password: profilInputUpdateAdmin[2].value,
                            role: profilInputUpdateAdmin[3].value,
                            status: profilSelectUpdateAdmin[0].value,
                            first_name: profilInputUpdateAdmin[5].value,
                            last_name: profilInputUpdateAdmin[6].value,
                            phone: profilInputUpdateAdmin[7].value,
                            address_home: profilInputUpdateAdmin[8].value,
                            city: profilInputUpdateAdmin[9].value,
                            postal_code: profilInputUpdateAdmin[10].value,
                            country: profilSelectUpdateAdmin[1].value

                        }

                        const response = await fetch(`/api/users/${users.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(dateUpdate)
                        })

                        const result = await response.json()

                        if (response.ok) {

                            profilBtnvaliderAdmin.style = 'display: none;'
                            profilBtnUpdateAdmin.style = 'display: block;'
                            document.querySelector(".message").style = "display: block;"
                            document.querySelector(".message").classList.remove('error')
                            document.querySelector(".message").classList.add('success')

                            profilInputUpdateAdmin.forEach(input => {
                                input.setAttribute('disabled', 'disabled')
                            })
                            profilSelectUpdateAdmin.forEach(select => {
                                select.setAttribute('disabled', 'disabled')
                            })

                            document.querySelector(".message").innerHTML = result.message

                        } else {
                            document.querySelector(".message").classList.add('error')
                            document.querySelector(".message").style = "display: block;"
                            document.querySelector(".message").innerHTML = result.error
                        }

                    })



                }
                const deleteProfil = async (event) => {
                    event.preventDefault()

                    const response = await fetch(`/api/users/${users.id}`, {
                        method: 'DELETE'
                    })

                    const result = await response.json()

                    if (response.ok) {

                        profilListeAdmin.removeChild(li)
                        profilInfoListeAdmin.innerHTML = ''
                    }

                }
                profilbtnDeleteAdmin.addEventListener('click', deleteProfil)
                profilBtnUpdateAdmin.addEventListener('click', ouvrirChamps)
            }

            li.addEventListener('click', afficherInfo)

        }).join('')






    } else {
        let p = document.createElement('p')
        p.style = 'text-align: center;'
        p.innerHTML = result.error
        profilListeAdmin.appendChild(p)


    }
}
getUsers()



