
function removerDeFavoritos(cotizacion) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    favoritos = favoritos.filter(fav => !(fav.titulo === cotizacion.titulo && fav.compra === cotizacion.compra && fav.venta === cotizacion.venta));
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

document.addEventListener('DOMContentLoaded', () => {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
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
                        <td><button class="delete" data-fecha="${fecha}" data-index="${index}"><img src="../img/Goma_de_borrar.png" alt="Borrar" class="goma-de-borrar"></button></td>
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
        const groupedFavoritos = groupByDate(favoritos);
        groupedFavoritos[fecha].splice(index, 1);

        if (groupedFavoritos[fecha].length === 0) {
            delete groupedFavoritos[fecha];
        }

        const nuevosFavoritos = [];
        Object.keys(groupedFavoritos).forEach(fecha => {
            nuevosFavoritos.push(...groupedFavoritos[fecha]);
        });

        localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
        renderTable();
    };

    renderTable();
});