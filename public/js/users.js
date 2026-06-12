const user = document.getElementById('user');

window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/users',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const result = await response.json();
    
    if (response.ok) {
        
        result.users.forEach(users => {
            const li = document.createElement('li');
            li.textContent = `
                ${users.username} - 
                ${users.email} - 
                ${users.password}
                \n`;
                user.appendChild(li);
        });
        
    }
});