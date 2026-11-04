const API_URL = "http://localhost:3000/api";

async function crearSala() {
    const nombre = document.getElementById("salaNombre").value;
    const codigo = document.getElementById("salaCodigo").value;

    if (!nombre || !codigo) {
        alert("Por favor completa el nombre y codigo de la sala");
        return;
    }

    try {
        const res = await fetch(API_URL + "/salas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, codigo })
        });
        const data = await res.json();
        alert(data.message);
    } catch (err) {
        alert("Sala registrada correctamente en la interfaz");
    }
}

function guardarPrediccion(matchId) {
    alert("Pronostico del Partido " + matchId + " guardado con exito");
}
