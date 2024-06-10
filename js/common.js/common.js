

fetch("https://dolarapi.com/v1/dolares/oficial")
    .then(response => response.json())
    .then(data => {
        document.getElementById("precio_compra_oficial").textContent = `$${data.compra}`;
        document.getElementById("precio_venta_oficial").textContent = `$${data.venta}`;
    });

fetch("https://dolarapi.com/v1/dolares/blue")
    .then(response => response.json())
    .then(data => {
        document.getElementById("precio_compra_blue").textContent = `$${data.compra}`;
        document.getElementById("precio_venta_blue").textContent = `$${data.venta}`;
    });

fetch("https://dolarapi.com/v1/dolares/tarjeta")
    .then(response => response.json())
    .then(data => {
        document.getElementById("precio_compra_tarjeta").textContent = `$${data.compra}`;
        document.getElementById("precio_venta_tarjeta").textContent = `$${data.venta}`;
    });

fetch("https://dolarapi.com/v1/dolares/bolsa")
    .then(response => response.json())
    .then(data => {
        document.getElementById("precio_compra_mep").textContent = `$${data.compra}`;
        document.getElementById("precio_venta_mep").textContent = `$${data.venta}`;
    });

fetch("https://dolarapi.com/v1/dolares/contadoconliqui")
    .then(response => response.json())
    .then(data => {
        document.getElementById("precio_compra_ccl").textContent = `$${data.compra}`;
        document.getElementById("precio_venta_ccl").textContent = `$${data.venta}`;
    });

fetch("https://dolarapi.com/v1/dolares/cripto")
    .then(response => response.json())
    .then(data => {
        document.getElementById("precio_compra_cripto").textContent = `$${data.compra}`;
        document.getElementById("precio_venta_cripto").textContent = `$${data.venta}`;
    });