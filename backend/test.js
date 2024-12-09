const fetch = require('node-fetch');

const url = 'https://wxvmssqfidodxyoxjtju.supabase.co/functions/v1/login';
const data = {
    username: 'test1234!',
    password: 'test1234!'
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));

// RUN WITH BUN