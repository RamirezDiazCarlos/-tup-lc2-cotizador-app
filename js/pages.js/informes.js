document.addEventListener('DOMContentLoaded', () => {
    const selectMoneda = document.getElementById('moneda');
    const botonBusqueda = document.querySelector('.boton_busqueda');
    const contenedorTabla = document.querySelector('.contenedor-tabla tbody');
    const compartirButton = document.querySelector('.boton-compartir');
    const contenedorGrafico = document.getElementById('grafico');

    const apiUrl = 'https://dolarapi.com/v1/cotizaciones';

    let chart; // Variable para almacenar la instancia del gráfico

    // Función para obtener datos de la API
    async function obtenerDatos(monedaSeleccionada = 'TODAS') {
        try {
            const response = await fetch(`${apiUrl}?moneda=${monedaSeleccionada}`);
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            const datos = await response.json();
            return datos;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    // Función para cargar los datos
    async function cargarDatos(monedaSeleccionada = 'TODAS') {
        const datos = await obtenerDatos(monedaSeleccionada);
        contenedorTabla.innerHTML = ''; // Limpiar la tabla

        if (datos.length === 0) {
            contenedorTabla.innerHTML = '<tr><td colspan="5">No hay datos guardados hasta el momento</td></tr>';
            if (chart) {
                chart.destroy();
            }
            return;
        }

        // Agrupar los datos por moneda
        const datosAgrupados = agruparPorMoneda(datos);

        for (const [moneda, cotizaciones] of Object.entries(datosAgrupados)) {
            // Agregar una fila de encabezado para cada moneda
            const filaEncabezado = document.createElement('tr');
            filaEncabezado.innerHTML = `<td colspan="5" class="moneda-seleccionada">${moneda}</td>`;
            contenedorTabla.appendChild(filaEncabezado);

            cotizaciones.forEach(dato => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td></td>
                    <td>${dato.fecha ? dato.fecha : 'N/A'}</td>
                    <td>$${dato.compra}</td>
                    <td>$${dato.venta}</td>
                    <td><img src="../img/flecha-${dato.variacion}.png" alt="${dato.variacion}" class="flechas"></td>
                `;
                contenedorTabla.appendChild(fila);
            });
        }

        generarGrafico(datos); // Generar el gráfico con los nuevos datos
    }

    function agruparPorMoneda(datos) {
        const grupos = datos.reduce((acc, dato) => {
            if (!acc[dato.moneda]) {
                acc[dato.moneda] = [];
            }
            acc[dato.moneda].push(dato);
            return acc;
        }, {});

        // Ordenar las cotizaciones por fecha y calcular la variación
        for (const moneda in grupos) {
            grupos[moneda] = grupos[moneda]
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                .map((dato, index, arr) => {
                    if (index > 0) {
                        const variacion = dato.venta > arr[index - 1].venta ? 'arriba' : 'abajo';
                        return { ...dato, variacion };
                    } else {
                        return { ...dato, variacion: 'neutra' }; // Primer dato no tiene comparación
                    }
                });
        }

        return grupos;
    }

    function generarGrafico(datos) {
        const etiquetas = datos.map(dato => dato.fecha ? dato.fecha : 'N/A');
        const valoresCompra = datos.map(dato => dato.compra);
        const valoresVenta = datos.map(dato => dato.venta);

        const ctx = contenedorGrafico.getContext('2d');

        if (chart) {
            chart.destroy(); // Destruir el gráfico anterior si existe
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: etiquetas,
                datasets: [
                    {
                        label: 'Compra',
                        data: valoresCompra,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: 'Venta',
                        data: valoresVenta,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Fecha'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Valor'
                        }
                    }
                }
            }
        });
    }

    // Cambio en el combo box
    selectMoneda.addEventListener('change', () => {
        const monedaSeleccionada = selectMoneda.value;
        cargarDatos(monedaSeleccionada);
    });

    // Botón de búsqueda
    botonBusqueda.addEventListener('click', () => {
        const monedaSeleccionada = selectMoneda.value;
        cargarDatos(monedaSeleccionada);
    });

    // Compartir por email
    compartirButton.addEventListener('click', () => {
        const email = prompt('Ingrese el correo electrónico para compartir la información:');
        if (email && validarEmail(email)) {
            alert(`Información compartida con ${email}`);
        } else {
            alert('Correo electrónico no válido.');
        }
    });

    cargarDatos();
});
