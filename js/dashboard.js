async function actualizarDashboard() {

    try {

        const productos = await obtenerProductos();

        const clientes = await obtenerClientes();

        const ventas = await obtenerVentas();


        document.getElementById(
            "total-productos"
        ).textContent = productos.length;


        document.getElementById(
            "total-clientes"
        ).textContent = clientes.length;


        const productosBajoStock =
            productos.filter(producto => {

                const stock = Number(producto.stock) || 0;

                const minimo =
                    Number(producto.stockMinimo) || 0;

                return stock <= minimo;

            });


        document.getElementById(
            "stock-bajo"
        ).textContent = productosBajoStock.length;


        const hoy = new Date();

        const ventasHoy = ventas.filter(venta => {

            if (!venta.fecha) {
                return false;
            }

            const fechaVenta = new Date(venta.fecha);

            return (
                fechaVenta.getFullYear() === hoy.getFullYear() &&
                fechaVenta.getMonth() === hoy.getMonth() &&
                fechaVenta.getDate() === hoy.getDate()
            );

        });


        const totalHoy =
            ventasHoy.reduce(
                (total, venta) =>
                    total + Number(venta.total || 0),
                0
            );


        document.getElementById(
            "ventas-dia"
        ).textContent = formatearMoneda(totalHoy);


        mostrarAlertasInventario(
            productosBajoStock
        );

    } catch(error) {

        console.error(
            "Error actualizando dashboard:",
            error
        );

    }

}


function mostrarAlertasInventario(productos) {

    const contenedor =
        document.getElementById(
            "alertas-inventario"
        );


    if (!productos.length) {

        contenedor.innerHTML = `
            <div class="empty-state">
                <span>✓</span>
                <p>No hay alertas de inventario.</p>
            </div>
        `;

        return;

    }


    contenedor.innerHTML = productos
        .slice(0, 5)
        .map(producto => {

            const stock =
                Number(producto.stock) || 0;

            return `
                <div style="
                    padding:14px 20px;
                    border-bottom:1px solid #eee;
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">

                    <div>
                        <strong>
                            ${escaparHTML(producto.nombre)}
                        </strong>

                        <small style="
                            display:block;
                            color:#888;
                            margin-top:4px;
                        ">
                            ${escaparHTML(producto.codigo)}
                        </small>
                    </div>

                    <span class="stock-badge ${
                        stock === 0
                            ? "stock-out"
                            : "stock-low"
                    }">
                        ${
                            stock === 0
                                ? "Agotado"
                                : `Quedan ${stock}`
                        }
                    </span>

                </div>
            `;

        })
        .join("");

}