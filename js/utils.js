function formatearMoneda(valor) {

    return new Intl.NumberFormat(
        "es-MX",
        {
            style: "currency",
            currency: "MXN"
        }
    ).format(Number(valor) || 0);

}


function escaparHTML(texto) {

    const div = document.createElement("div");

    div.textContent = texto ?? "";

    return div.innerHTML;

}


function obtenerFechaActual() {

    return new Date().toLocaleDateString(
        "es-MX",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


function generarIdTemporal() {

    return Date.now() +
        Math.floor(Math.random() * 1000);

}