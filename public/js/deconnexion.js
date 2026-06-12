const deconnectButton = document.querySelector('.logout-button');

const deconnexion = async () => {
    const response = await fetch('/api/deconnexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await response.json();

    if (response.ok) {
        alert(result.message);
        window.location.href = '/';
    } else {
        // On laisse Express gérer l'erreur.
         alert(`Erreur : ${result.error}`); 
    }
}

deconnectButton.addEventListener('click', deconnexion)
