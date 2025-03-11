

let url = "https://node-api-i5ik.onrender.com/buscar"
fetch(url, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        producto: 'modulo a04',
        tienda: "celuphone"
    })

}).then(response => response.json()).then(data => {
    console.log(data)
}).catch(err => {
    
})