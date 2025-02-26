document.addEventListener('DOMContentLoaded', () => {
    const apiBaseURL = 'https://dolarapi.com/v1/cotizaciones';
    const apiDollarURL = 'https://dolarapi.com/v1/dolares';

    function fetchCotizaciones(moneda) {
        let url = '';
        switch (moneda) {
            case 'dolar':
                url = apiDollarURL;
                break;
            case 'euro':
                url = `${apiBaseURL}/eur`;
                break;
            case 'real':
                url = `${apiBaseURL}/brl`;
                break;
            case 'peso_chileno':
                url = `${apiBaseURL}/clp`;
                break;
            case 'peso_uruguayo':
                url = `${apiBaseURL}/uyu`;
                break;
            case 'TODAS':
                url = apiBaseURL;
                break;
            default:
                return;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                actualizarCotizaciones(moneda, data);
                actualizarFecha();
            });
    }

    function actualizarCotizaciones(moneda, data) {
        const contenedor = document.getElementById('tipoDeCambio');
        contenedor.innerHTML = '';

        const crearDivCotizacion = (titulo, compra, venta) => {
            const div = document.createElement('div');
            div.classList.add('contenedor_precio');

            div.innerHTML = `
                <div class="lado-izquierdo"><p>${titulo}</p></div>
                <div class="lado-derecho">
                    <div><p>Compra</p><p class="precio">${compra}</p></div>
                    <div><p>Venta</p><p class="precio">${venta}</p></div>
                    <div class="contenedor-boton-favoritos">
                        <button class="boton_favoritos"></button>
                    </div>
                </div>
            `;

            const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
            const yaFavorito = favoritos.some(fav => fav.titulo === titulo && fav.compra === compra && fav.venta === venta);//SOME si alguno de los elementos cumple con la condición

            const botonFavoritos = div.querySelector('.boton_favoritos');
            if (yaFavorito) {
                botonFavoritos.classList.add('boton_favoritos_agregado');
            }

            botonFavoritos.addEventListener('click', () => {
                if (botonFavoritos.classList.contains('boton_favoritos_agregado')) {
                    removerDeFavoritos({ titulo, compra, venta });
                    botonFavoritos.classList.remove('boton_favoritos_agregado');
                } else {
                    agregarAFavoritos({ titulo, compra, venta });
                    botonFavoritos.classList.add('boton_favoritos_agregado');
                }
            });

            contenedor.appendChild(div);
        };

        if (data) {
            if (Array.isArray(data)) {
                data.forEach(item => {
                    crearDivCotizacion(item.nombre, item.compra, item.venta);
                });
            } else {
                crearDivCotizacion(data.nombre, data.compra, data.venta);
            }
        }
    }

    function actualizarFecha() {
        const fechaElemento = document.getElementById('actualizacionDatos');
        const fechaActual = new Date();
        const opciones = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        fechaElemento.textContent = `Datos actualizados al ${fechaActual.toLocaleDateString('es-ES', opciones)}`;
    }

    function agregarAFavoritos(cotizacion) {
        const fechaActual = new Date().toLocaleDateString('es-ES');
        const cotizacionConFecha = { ...cotizacion, fecha: fechaActual };
        let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        favoritos.push(cotizacionConFecha);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }

    function removerDeFavoritos(cotizacion) {
        let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        favoritos = favoritos.filter(fav => !(fav.titulo === cotizacion.titulo && fav.compra === cotizacion.compra && fav.venta === cotizacion.venta));
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }

    const monedasSelect = document.getElementById('monedas');
    monedasSelect.addEventListener('change', (event) => {
        fetchCotizaciones(event.target.value);
    });

    setInterval(() => {
        fetchCotizaciones(monedasSelect.value);
    }, 5 * 60 * 1000);

    fetchCotizaciones(monedasSelect.value);
});
