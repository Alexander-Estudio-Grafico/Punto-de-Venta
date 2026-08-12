const DB_NAME = "ManitasDeEnsueñoPOS";
const DB_VERSION = 1;

let db = null;

function abrirBaseDatos() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function(event) {

            const database = event.target.result;

            if (!database.objectStoreNames.contains("productos")) {

                const productos = database.createObjectStore(
                    "productos",
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );

                productos.createIndex(
                    "codigo",
                    "codigo",
                    { unique: true }
                );

                productos.createIndex(
                    "nombre",
                    "nombre",
                    { unique: false }
                );

                productos.createIndex(
                    "categoria",
                    "categoria",
                    { unique: false }
                );
            }


            if (!database.objectStoreNames.contains("ventas")) {

                database.createObjectStore(
                    "ventas",
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );
            }


            if (!database.objectStoreNames.contains("clientes")) {

                database.createObjectStore(
                    "clientes",
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );
            }


            if (!database.objectStoreNames.contains("movimientos")) {

                database.createObjectStore(
                    "movimientos",
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );
            }


            if (!database.objectStoreNames.contains("configuracion")) {

                database.createObjectStore(
                    "configuracion",
                    {
                        keyPath: "clave"
                    }
                );
            }

        };


        request.onsuccess = function(event) {

            db = event.target.result;

            console.log("Base de datos conectada.");

            resolve(db);

        };


        request.onerror = function(event) {

            console.error(
                "Error al abrir la base de datos:",
                event.target.error
            );

            reject(event.target.error);

        };

    });

}


/* ==============================
   PRODUCTOS
============================== */

function obtenerProductos() {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(["productos"], "readonly");

        const store =
            transaction.objectStore("productos");

        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

    });

}


function guardarProducto(producto) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(["productos"], "readwrite");

        const store =
            transaction.objectStore("productos");

        let request;

        if (producto.id) {
            request = store.put(producto);
        } else {
            request = store.add(producto);
        }

        request.onsuccess = () => {

            resolve(request.result);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });

}


function eliminarProducto(id) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(["productos"], "readwrite");

        const store =
            transaction.objectStore("productos");

        const request = store.delete(Number(id));

        request.onsuccess = () => resolve();

        request.onerror = () => reject(request.error);

    });

}


/* ==============================
   CLIENTES
============================== */

function obtenerClientes() {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(["clientes"], "readonly");

        const store =
            transaction.objectStore("clientes");

        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

    });

}


/* ==============================
   VENTAS
============================== */

function obtenerVentas() {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(["ventas"], "readonly");

        const store =
            transaction.objectStore("ventas");

        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

    });

}