const form = document.querySelector('.profil-info-liste-redacteur form')
const formInput = document.querySelectorAll('.profil-info-liste-redacteur form input')
const updateButton = document.getElementById('profil-btn-update-redacteur')
const validerButton = document.querySelector('.profil-btn-update-redacteur')
const userId = form.dataset.userId;
const messages =document.querySelector('.messages')

updateButton.addEventListener('click', (event) => {
    event.preventDefault()

    validerButton.style.display = 'block'
    updateButton.style.display = 'none'

    formInput.forEach(input => {
        input.removeAttribute('disabled')
    })
    formInput[3].setAttribute('disabled', 'disabled')
    formInput[4].setAttribute('disabled', 'disabled')
})

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const dateUser = {
        username: formInput[0].value,
        email: formInput[1].value,
        password: formInput[2].value,
        first_name: formInput[5].value,
        last_name: formInput[6].value,
        phone: formInput[7].value,
        address_home: formInput[8].value,
    }

    const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dateUser)
    })

    const result = await response.json()

    if (response.ok) {
        
        validerButton.style.display = 'none'
        updateButton.style.display = 'block'
        messages.style.color = 'green'

        formInput.forEach(input => {
            input.setAttribute('disabled', 'disabled')
        })
    
        messages.innerHTML = result.message

        formInput.forEach(input => {
            input.setAttribute('disabled', 'disabled')
        })
    } else {
        messages.style.color = 'red'
        messages.innerHTML = result.error

        console.log(result.error)
    }

})
