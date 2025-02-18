
document.addEventListener('DOMContentLoaded', async () => {
    // Elementos del DOM
    const selectMoneda = document.getElementById('moneda');
    const ctx = document.getElementById("miGrafica").getContext("2d");
    const apiUrl = 'https://dolarapi.com/v1/cotizaciones';
    let chart; // Variable para la instancia del gráfico

    // Función para obtener datos de la API según la moneda seleccionada
    async function fetchData(moneda) {
        try {
            const response = await fetch(`${apiUrl}?moneda=${encodeURIComponent(moneda)}`);
            if (!response.ok) throw new Error("Error al obtener los datos");
            return await response.json();
        } catch (error) {
            console.error("Fetch error:", error);
            return [];
        }
    }

    // Función para renderizar la gráfica con Chart.js
    function renderChart(data, moneda) {
        // Crear etiquetas basadas en las fechas
        const etiquetas = data.map(item => item.fecha || "N/A");

        let datasetLabel, datasetData, borderColor, yAxisTitle;

        if (moneda !== "TODAS") {
            // Si se selecciona una moneda específica, mostramos la variación (venta - compra)
            datasetLabel = "Variación (Venta - Compra)";
            datasetData = data.map(item => item.venta - item.compra);
            borderColor = "blue";
            yAxisTitle = "Variación";
        } else {
            // Para "TODAS" mostramos el precio de compra
            datasetLabel = "Compra";
            datasetData = data.map(item => item.compra);
            borderColor = "green";
            yAxisTitle = "Precio de Compra";
        }

        // Si existe un gráfico previo, destruirlo
        if (chart) chart.destroy();

        // Crear nuevo gráfico
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: etiquetas,
                datasets: [{
                    label: datasetLabel,
                    data: datasetData,
                    borderColor: borderColor,
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: "Fecha"
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: yAxisTitle
                        }
                    }
                }
            }
        });
    }

    // Función que carga los datos, y actualiza la tabla y el gráfico
    async function loadData(moneda) {
        const data = await fetchData(moneda);
        if (!data.length) {
            console.error("No se obtuvieron datos");
            if (chart) chart.destroy();
            return;
        }
        renderChart(data, moneda);
    }

    // Evento: Cuando se cambie el select, se actualiza la gráfica
    selectMoneda.addEventListener('change', () => {
        loadData(selectMoneda.value);
    });

    // Carga inicial con la moneda seleccionada por defecto
    loadData(selectMoneda.value);
});
