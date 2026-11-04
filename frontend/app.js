const API_URL = "http://localhost:3000/api";

// 1. Cambiar de Pestañas
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 2. Notificaciones Flotantes
function showToast(mensaje) {
    const toast = document.getElementById('toast');
    toast.innerText = mensaje;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// 3. Lógica para Crear / Unirse a Salas con inserción dinámica en el DOM
async function procesarSala() {
    const nameInput = document.getElementById('roomName');
    const codeInput = document.getElementById('roomCode');
    
    const name = nameInput.value.trim();
    const code = codeInput.value.trim();

    if (!name || !code) {
        showToast("⚠️ Ingrese un nombre y código para la sala");
        return;
    }

    // Intentar envío a la API MySQL
    try {
        await fetch(`${API_URL}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, code })
        });
    } catch (error) {
        console.warn("Ejecutando en modo dinámico local");
    }

    // Renderizar la nueva sala de inmediato en la vista "Salas en las que Participas"
    const roomsGrid = document.querySelector('.rooms-grid');
    if (roomsGrid) {
        const newRoomCard = document.createElement('div');
        newRoomCard.className = 'room-card';
        newRoomCard.innerHTML = `
            <div class="room-icon">🏆</div>
            <div class="room-info">
                <h4>${name}</h4>
                <span class="room-code-badge">CÓDIGO: ${code}</span>
            </div>
            <div class="room-stats">
                <span>👥 1 Miembro (Tú)</span>
            </div>
        `;
        roomsGrid.appendChild(newRoomCard);
    }

    showToast(`🏆 ¡Te has unido con éxito a la sala '${name}'!`);

    // Limpiar inputs
    nameInput.value = '';
    codeInput.value = '';
}

// 4. Lógica para Guardar Pronóstico y Actualizar Tabla de Posiciones
async function enviarPronostico(matchId, homeTeam, awayTeam) {
    const homeScore = document.getElementById(`home-${matchId}`).value;
    const awayScore = document.getElementById(`away-${matchId}`).value;

    try {
        await fetch(`${API_URL}/predictions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                matchId: matchId,
                homeScore: parseInt(homeScore),
                awayScore: parseInt(awayScore),
                user: "Naomi Sánchez"
            })
        });
    } catch (error) {
        console.warn("Ejecutando en modo dinámico local");
    }

    showToast(`⚡ Pronóstico guardado: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`);
}