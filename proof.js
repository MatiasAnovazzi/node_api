let url = "https://node-api-i5ik.onrender.com:3000/buscar"
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
})