document.addEventListener('DOMContentLoaded', () => {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const contenedor = document.getElementById('favoritos');

    const groupByDate = (data) => {
        return data.reduce((acc, item) => {
            if (!acc[item.fecha]) {
                acc[item.fecha] = [];
            }
            acc[item.fecha].push(item);
            return acc;
        }, {});
    };

    const renderTable = () => {
        contenedor.innerHTML = '';
        const groupedFavoritos = groupByDate(favoritos);

        Object.keys(groupedFavoritos).forEach(fecha => {
            contenedor.innerHTML += `
                <tr>
                    <td colspan="5" class="fecha">${fecha}</td>
                </tr>
            `;
            groupedFavoritos[fecha].forEach((cotizacion, index) => {
                contenedor.innerHTML += `
                    <tr>
                        ${index === 0 ? `<td rowspan="${groupedFavoritos[fecha].length}"></td>` : ''}
                        <td>${cotizacion.titulo}</td>
                        <td>${cotizacion.compra}</td>
                        <td>${cotizacion.venta}</td>
                        <td><button class="delete" data-fecha="${fecha}" data-index="${index}"><img src="../img/Goma_de_borrar.png.png" alt="Borrar" class="goma-de-borrar"></button></td>
                    </tr>
                `;
            });
        });

        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const fecha = e.target.closest('button').getAttribute('data-fecha');
                const index = e.target.closest('button').getAttribute('data-index');
                eliminarFavorito(fecha, index);
            });
        });
    };

    const eliminarFavorito = (fecha, index) => {
        let groupedFavoritos = groupByDate(favoritos);
        index = parseInt(index, 10);

        if (groupedFavoritos[fecha]) {
            groupedFavoritos[fecha].splice(index, 1);

            if (groupedFavoritos[fecha].length === 0) {
                delete groupedFavoritos[fecha];
            }

            favoritos = [];
            Object.keys(groupedFavoritos).forEach(fecha => {
                favoritos.push(...groupedFavoritos[fecha]);
            });

            localStorage.setItem('favoritos', JSON.stringify(favoritos));
            renderTable();
        }
    };

    const ImprSelec = (favoritos) => {
        const contenido = document.getElementById(favoritos).innerHTML;
        const contenidoOriginal = document.body.innerHTML;

        const printWindow = window.open('', '', 'height=600, width=800');
        printWindow.document.write('<html><head><title>Imprimir Tabla</title>');
        printWindow.document.write('<link rel="stylesheet" type="text/css" href="../css/pages.css/miarchivo.css">');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<table>' + contenido + '</table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();

        document.body.innerHTML = contenidoOriginal;
    };
    

    document.getElementById('imprimir-tabla').addEventListener('click', () => ImprSelec('favoritos'));

    renderTable();
});
