const API_URL = "http://localhost:3000/api";

// 1. Cambiar entre pestañas
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.classList.add('active');
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

// 2. Notificaciones flotantes
function showToast(mensaje) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = mensaje;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }
}

// 3. Crear / Unirse a Sala e insertar la tarjeta dinámica inmediatamente
async function procesarSala() {
    const nameInput = document.getElementById('roomName');
    const codeInput = document.getElementById('roomCode');
    
    if (!nameInput || !codeInput) return;

    const name = nameInput.value.trim();
    const code = codeInput.value.trim();

    if (!name || !code) {
        showToast("⚠️ Ingrese un nombre y código para la sala");
        return;
    }

    // Intentar llamada a API Backend
    try {
        await fetch(`${API_URL}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, code })
        });
    } catch (error) {
        console.warn("Modo local reactivo activo");
    }

    // Buscar el contenedor de las salas
    let container = document.querySelector('.rooms-grid') || document.querySelector('.rooms-list');
    
    // Si no encuentra la grilla, la busca por la sección de salas
    if (!container) {
        const parentCard = document.querySelector('#salas-tab .glass-card.margin-top') || document.querySelector('#salas-tab .card.margin-top');
        if (parentCard) {
            container = document.createElement('div');
            container.className = 'rooms-grid';
            parentCard.appendChild(container);
        }
    }

    // Inserción dinámica de la tarjeta de sala
    if (container) {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        roomCard.style.marginTop = '10px';
        roomCard.innerHTML = `
            <div class="room-icon">🏆</div>
            <div class="room-info">
                <h4>${name}</h4>
                <span class="room-code-badge" style="background:#e0f2fe; color:#0284c7; padding:2px 8px; border-radius:6px; font-weight:700; font-size:0.75rem;">CÓDIGO: ${code}</span>
            </div>
            <div class="room-stats" style="margin-top:6px; font-size:0.85rem; color:#64748b;">
                <span>👥 1 Miembro (Tú)</span>
            </div>
        `;
        container.appendChild(roomCard);
    }

    showToast(`🏆 ¡Unido con éxito a la sala '${name}'!`);

    nameInput.value = '';
    codeInput.value = '';
}

// 4. Guardar pronósticos
async function enviarPronostico(matchId, homeTeam, awayTeam) {
    const homeScore = document.getElementById(`home-${matchId}`)?.value || 0;
    const awayScore = document.getElementById(`away-${matchId}`)?.value || 0;

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
        console.warn("Modo local reactivo activo");
    }

    showToast(`⚡ Pronóstico guardado: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`);
}