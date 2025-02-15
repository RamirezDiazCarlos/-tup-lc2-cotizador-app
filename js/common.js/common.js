document.addEventListener("DOMContentLoaded", () => {
    const apiBaseURL = "https://dolarapi.com/v1/cotizaciones";
    const apiDollarURL = "https://dolarapi.com/v1/dolares";
    const endpoints = {
        dolar: apiDollarURL,
        euro: `${apiBaseURL}/eur`,
        real: `${apiBaseURL}/brl`,
        peso_chileno: `${apiBaseURL}/clp`,
        peso_uruguayo: `${apiBaseURL}/uyu`,
        TODAS: apiBaseURL,
    };

    const fetchCotizaciones = async (moneda) => {
        const url = endpoints[moneda];
        if (!url) return;
        try {
            const response = await fetch(url);
            const data = await response.json();
            actualizarCotizaciones(data);
            actualizarFecha();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const actualizarCotizaciones = (data) => {
        const contenedor = document.getElementById("tipoDeCambio");
        contenedor.innerHTML = "";
        const cotizaciones = Array.isArray(data) ? data : [data];
        cotizaciones.forEach(({ nombre, compra, venta }) =>
            crearDivCotizacion(nombre, compra, venta, contenedor)
        );
    };

    const crearDivCotizacion = (titulo, compra, venta, contenedor) => {
        const div = document.createElement("div");
        div.classList.add("contenedor_precio");
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

        const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        const yaFavorito = favoritos.some(
            (fav) =>
                fav.titulo === titulo && fav.compra === compra && fav.venta === venta
        );
        const botonFavoritos = div.querySelector(".boton_favoritos");

        if (yaFavorito) {
            botonFavoritos.classList.add("boton_favoritos_agregado");
        }

        botonFavoritos.addEventListener("click", () => {
            if (botonFavoritos.classList.contains("boton_favoritos_agregado")) {
                removerDeFavoritos({ titulo, compra, venta });
                botonFavoritos.classList.remove("boton_favoritos_agregado");
            } else {
                agregarAFavoritos({ titulo, compra, venta });
                botonFavoritos.classList.add("boton_favoritos_agregado");
            }
        });

        contenedor.appendChild(div);
    };

    const actualizarFecha = () => {
        const fechaElemento = document.getElementById("actualizacionDatos");
        const fechaActual = new Date();
        const opciones = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        };
        fechaElemento.textContent = `Datos actualizados al ${fechaActual.toLocaleDateString(
            "es-ES",
            opciones
        )}`;
    };

    const agregarAFavoritos = (cotizacion) => {
        const fechaActual = new Date().toLocaleDateString("es-ES");
        const cotizacionConFecha = { ...cotizacion, fecha: fechaActual };
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        favoritos.push(cotizacionConFecha);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    };

    const removerDeFavoritos = (cotizacion) => {
        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        favoritos = favoritos.filter(
            (fav) =>
                !(
                    fav.titulo === cotizacion.titulo &&
                    fav.compra === cotizacion.compra &&
                    fav.venta === cotizacion.venta
                )
        );
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    };

    const monedasSelect = document.getElementById("monedas");
    monedasSelect.addEventListener("change", ({ target: { value } }) =>
        fetchCotizaciones(value)
    );

    setInterval(() => fetchCotizaciones(monedasSelect.value), 5 * 60 * 1000);

    fetchCotizaciones(monedasSelect.value);
});
