/* ==============================
   INICIO DEL SISTEMA
============================== */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        try {

            await abrirBaseDatos();

            actualizarFecha();

            configurarNavegacion();

            await cargarInventario();

            await actualizarDashboard();

            console.log(
                "POS Manitas de Ensueño iniciado correctamente."
            );

        } catch(error) {

            console.error(error);

            alert(
                "No se pudo iniciar la base de datos del sistema."
            );

        }

    }
);


/* ==============================
   NAVEGACIÓN
============================== */

function configurarNavegacion() {

    const botones =
        document.querySelectorAll(
            ".menu-item"
        );


    botones.forEach(boton => {

        boton.addEventListener(
            "click",
            function() {

                const seccion =
                    this.dataset.section;

                mostrarSeccion(seccion);

            }
        );

    });

}


function mostrarSeccion(nombre) {

    document
        .querySelectorAll(".section")
        .forEach(seccion => {

            seccion.classList.remove(
                "active"
            );

        });


    const destino =
        document.getElementById(
            nombre
        );


    if (destino) {

        destino.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(".menu-item")
        .forEach(boton => {

            boton.classList.remove(
                "active"
            );


            if (
                boton.dataset.section ===
                nombre
            ) {

                boton.classList.add(
                    "active"
                );

            }

        });


    const titulos = {

        dashboard: "Dashboard",

        ventas: "Punto de Venta",

        inventario: "Inventario",

        clientes: "Clientes",

        historial: "Historial",

        caja: "Caja",

        reportes: "Reportes",

        configuracion: "Configuración"

    };


    document.getElementById(
        "section-title"
    ).textContent =
        titulos[nombre] || "POS";


    if (nombre === "inventario") {

        cargarInventario();

    }


    if (nombre === "dashboard") {

        actualizarDashboard();

    }

}


/* ==============================
   FECHA
============================== */

function actualizarFecha() {

    const elemento =
        document.getElementById(
            "current-date"
        );


    const fecha =
        new Date();


    elemento.textContent =
        fecha.toLocaleDateString(
            "es-MX",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}