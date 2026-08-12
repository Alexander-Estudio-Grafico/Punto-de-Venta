let productosActuales = [];

let productoEditando = null;


/* ==============================
   CARGAR INVENTARIO
============================== */

async function cargarInventario() {

    productosActuales =
        await obtenerProductos();

    llenarCategorias();

    renderizarProductos();

}


/* ==============================
   RENDERIZAR PRODUCTOS
============================== */

function renderizarProductos() {

    const tabla =
        document.getElementById(
            "tabla-productos"
        );


    const busqueda =
        document.getElementById(
            "buscar-producto"
        ).value
        .toLowerCase()
        .trim();


    const categoria =
        document.getElementById(
            "filtro-categoria"
        ).value;


    const filtroStock =
        document.getElementById(
            "filtro-stock"
        ).value;


    let productos =
        productosActuales.filter(producto => {


            const coincideBusqueda =
                !busqueda ||
                producto.nombre
                    .toLowerCase()
                    .includes(busqueda) ||
                producto.codigo
                    .toLowerCase()
                    .includes(busqueda);


            const coincideCategoria =
                !categoria ||
                producto.categoria === categoria;


            const stock =
                Number(producto.stock) || 0;

            const minimo =
                Number(producto.stockMinimo) || 0;


            let coincideStock = true;


            if (filtroStock === "bajo") {

                coincideStock =
                    stock > 0 &&
                    stock <= minimo;

            }


            if (filtroStock === "agotado") {

                coincideStock =
                    stock === 0;

            }


            return (
                coincideBusqueda &&
                coincideCategoria &&
                coincideStock
            );

        });


    if (!productos.length) {

        tabla.innerHTML = `
            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:45px;
                        color:#777;
                    "
                >

                    No hay productos que mostrar.

                </td>

            </tr>
        `;

        return;

    }


    tabla.innerHTML =
        productos.map(producto => {


            const stock =
                Number(producto.stock) || 0;

            const minimo =
                Number(producto.stockMinimo) || 0;


            let estado = "";

            if (stock === 0) {

                estado =
                    `<span class="stock-badge stock-out">
                        Agotado
                    </span>`;

            } else if (stock <= minimo) {

                estado =
                    `<span class="stock-badge stock-low">
                        Stock bajo
                    </span>`;

            } else {

                estado =
                    `<span class="stock-badge stock-ok">
                        Disponible
                    </span>`;

            }


            return `

                <tr>

                    <td>

                        <div class="product-name">
                            ${escaparHTML(producto.nombre)}
                        </div>

                    </td>


                    <td>

                        <span class="product-code">
                            ${escaparHTML(producto.codigo)}
                        </span>

                    </td>


                    <td>
                        ${escaparHTML(producto.categoria)}
                    </td>


                    <td>
                        ${formatearMoneda(producto.costo)}
                    </td>


                    <td>
                        <strong>
                            ${formatearMoneda(producto.precio)}
                        </strong>
                    </td>


                    <td>
                        ${stock}
                    </td>


                    <td>
                        ${estado}
                    </td>


                    <td>

                        <div class="action-buttons">

                            <button
                                class="action-button"
                                title="Editar"
                                onclick="editarProducto(${producto.id})"
                            >
                                ✏️
                            </button>


                            <button
                                class="action-button delete"
                                title="Eliminar"
                                onclick="borrarProducto(${producto.id})"
                            >
                                🗑️
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }).join("");

}


/* ==============================
   CATEGORÍAS
============================== */

function llenarCategorias() {

    const select =
        document.getElementById(
            "filtro-categoria"
        );


    const categorias =
        [...new Set(
            productosActuales
                .map(producto => producto.categoria)
                .filter(Boolean)
        )]
        .sort();


    select.innerHTML =
        `<option value="">
            Todas las categorías
        </option>`;


    categorias.forEach(categoria => {

        select.innerHTML += `
            <option value="${escaparHTML(categoria)}">
                ${escaparHTML(categoria)}
            </option>
        `;

    });

}


/* ==============================
   MODAL
============================== */

function abrirModalProducto() {

    productoEditando = null;

    document.getElementById(
        "modal-titulo"
    ).textContent =
        "Agregar producto";


    document.getElementById(
        "form-producto"
    ).reset();


    document.getElementById(
        "producto-id"
    ).value = "";


    document.getElementById(
        "producto-costo"
    ).value = "0";


    document.getElementById(
        "producto-precio"
    ).value = "0";


    document.getElementById(
        "producto-stock"
    ).value = "0";


    document.getElementById(
        "producto-stock-minimo"
    ).value = "3";


    document.getElementById(
        "modal-producto"
    ).classList.add("active");

}


function cerrarModalProducto() {

    document.getElementById(
        "modal-producto"
    ).classList.remove("active");

}


/* ==============================
   GUARDAR
============================== */

document.getElementById(
    "form-producto"
).addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "producto-id"
            ).value;


        const producto = {

            nombre:
                document.getElementById(
                    "producto-nombre"
                ).value.trim(),

            codigo:
                document.getElementById(
                    "producto-codigo"
                ).value.trim(),

            categoria:
                document.getElementById(
                    "producto-categoria"
                ).value.trim(),

            proveedor:
                document.getElementById(
                    "producto-proveedor"
                ).value.trim(),

            costo:
                Number(
                    document.getElementById(
                        "producto-costo"
                    ).value
                ) || 0,

            precio:
                Number(
                    document.getElementById(
                        "producto-precio"
                    ).value
                ) || 0,

            stock:
                Number(
                    document.getElementById(
                        "producto-stock"
                    ).value
                ) || 0,

            stockMinimo:
                Number(
                    document.getElementById(
                        "producto-stock-minimo"
                    ).value
                ) || 0,

            actualizado:
                new Date().toISOString()

        };


        if (id) {

            producto.id =
                Number(id);

        }


        try {

            await guardarProducto(producto);


            cerrarModalProducto();

            await cargarInventario();

            await actualizarDashboard();


            alert(
                id
                    ? "Producto actualizado correctamente."
                    : "Producto agregado correctamente."
            );


        } catch(error) {

            console.error(error);

            if (
                error.name ===
                "ConstraintError"
            ) {

                alert(
                    "Ya existe un producto con ese código."
                );

            } else {

                alert(
                    "No se pudo guardar el producto."
                );

            }

        }

    }
);


/* ==============================
   EDITAR
============================== */

function editarProducto(id) {

    const producto =
        productosActuales.find(
            p => p.id === Number(id)
        );


    if (!producto) {
        return;
    }


    document.getElementById(
        "modal-titulo"
    ).textContent =
        "Editar producto";


    document.getElementById(
        "producto-id"
    ).value =
        producto.id;


    document.getElementById(
        "producto-nombre"
    ).value =
        producto.nombre;


    document.getElementById(
        "producto-codigo"
    ).value =
        producto.codigo;


    document.getElementById(
        "producto-categoria"
    ).value =
        producto.categoria;


    document.getElementById(
        "producto-proveedor"
    ).value =
        producto.proveedor || "";


    document.getElementById(
        "producto-costo"
    ).value =
        producto.costo;


    document.getElementById(
        "producto-precio"
    ).value =
        producto.precio;


    document.getElementById(
        "producto-stock"
    ).value =
        producto.stock;


    document.getElementById(
        "producto-stock-minimo"
    ).value =
        producto.stockMinimo;


    document.getElementById(
        "modal-producto"
    ).classList.add("active");

}


/* ==============================
   ELIMINAR
============================== */

async function borrarProducto(id) {

    const producto =
        productosActuales.find(
            p => p.id === Number(id)
        );


    if (!producto) {
        return;
    }


    const confirmar =
        confirm(
            `¿Eliminar "${producto.nombre}" del inventario?`
        );


    if (!confirmar) {
        return;
    }


    try {

        await eliminarProducto(id);

        await cargarInventario();

        await actualizarDashboard();

    } catch(error) {

        console.error(error);

        alert(
            "No se pudo eliminar el producto."
        );

    }

}


/* ==============================
   FILTROS
============================== */

document.getElementById(
    "buscar-producto"
).addEventListener(
    "input",
    renderizarProductos
);


document.getElementById(
    "filtro-categoria"
).addEventListener(
    "change",
    renderizarProductos
);


document.getElementById(
    "filtro-stock"
).addEventListener(
    "change",
    renderizarProductos
);