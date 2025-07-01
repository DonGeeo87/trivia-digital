// ===== ARCHIVO PRINCIPAL MODULAR =====
import { gameState, playerData, badges, dailyChallenges } from './modules/gameConfig.js';
import { loadPlayerData, savePlayerData, displayBadges, awardBadge } from './modules/playerManager.js';
import { showQuestion, showScorePopup } from './modules/questionManager.js';
import { GameManager } from './modules/gameManager.js';
import { preguntas, getPreguntasPorCategoria, mezclarPreguntas, getPreguntasMixtas } from './modules/questions.js';

// Instancia del gestor de juego
const gameManager = new GameManager();
window.gameManager = gameManager;

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadPlayerData();
    displayBadges();
    checkDailyChallenge();
});

// Funciones principales del juego
function startQuiz(categoria) {
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        alert('Por favor ingresa tu nombre');
        return;
    }
    
    gameState.nombreJugador = nombre;
    gameState.currentCategory = categoria;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.respuestas = [];
    gameState.consecutiveCorrect = 0;
    gameState.gameMode = 'normal';
    
    // Obtener preguntas de la categoría
    const preguntasFiltradas = getPreguntasPorCategoria(categoria);
    gameState.selectedQuestions = mezclarPreguntas(preguntasFiltradas).slice(0, 10);
    
    showGameScreen();
    showQuestion();
}

// Modos de juego especiales
function startSurvivalMode() {
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        alert('Por favor ingresa tu nombre');
        return;
    }
    
    gameState.nombreJugador = nombre;
    gameState.gameMode = 'survival';
    gameState.survivalLives = 3;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.respuestas = [];
    
    // Preguntas infinitas mezcladas
    gameState.selectedQuestions = mezclarPreguntas([...preguntas]);
    
    showGameScreen();
    showQuestion();
}

function startDailyChallenge() {
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        alert('Por favor ingresa tu nombre');
        return;
    }
    
    const today = new Date().toDateString();
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const challenge = dailyChallenges[dayName];
    
    if (playerData.lastDailyChallenge === today) {
        alert('¡Ya completaste el desafío de hoy! Vuelve mañana 🌟');
        return;
    }
    
    gameState.nombreJugador = nombre;
    gameState.gameMode = 'daily';
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.respuestas = [];
    gameState.consecutiveCorrect = 0;
    
    // Configurar preguntas según el desafío del día
    if (challenge.category === 'mixed') {
        gameState.selectedQuestions = getPreguntasMixtas();
    } else if (challenge.category === 'survival') {
        startSurvivalMode();
        return;
    } else if (challenge.category === 'speed') {
        startSpeedMode();
        return;
    } else {
        const preguntasFiltradas = getPreguntasPorCategoria(challenge.category);
        gameState.selectedQuestions = mezclarPreguntas(preguntasFiltradas).slice(0, 10);
    }
    
    showGameScreen();
    showQuestion();
}

function startSpeedMode() {
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        alert('Por favor ingresa tu nombre');
        return;
    }
    
    gameState.nombreJugador = nombre;
    gameState.gameMode = 'speed';
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.respuestas = [];
    gameState.consecutiveCorrect = 0;
    
    // Preguntas mixtas para el modo velocidad
    gameState.selectedQuestions = getPreguntasMixtas();
    
    showGameScreen();
    gameManager.startSpeedQuestion();
}

function startMixedChallenge() {
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        alert('Por favor ingresa tu nombre');
        return;
    }
    
    gameState.nombreJugador = nombre;
    gameState.gameMode = 'mixed';
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.respuestas = [];
    gameState.consecutiveCorrect = 0;
    
    // Preguntas de todas las categorías
    gameState.selectedQuestions = getPreguntasMixtas();
    
    showGameScreen();
    showQuestion();
}

// Función para mostrar la pantalla de juego
function showGameScreen() {
    document.querySelector('main').innerHTML = `
        <div class="max-w-4xl mx-auto p-4">
            <!-- Header del juego -->
            <div class="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/10">
                <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div class="text-center md:text-left">
                        <h2 class="text-2xl font-bold text-white mb-2">¡Hola, ${gameState.nombreJugador}! 👋</h2>
                        <p class="text-lg text-blue-200">${getCategoryName(gameState.currentCategory)}</p>
                    </div>
                    <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-center">
                        <div class="text-blue-400 font-semibold">💎 ${gameState.score} puntos</div>
                        <div class="text-yellow-400 font-semibold">🔥 ${gameState.consecutiveCorrect} racha</div>
                        <div class="text-purple-400 font-semibold">
                            <span>${gameState.currentQuestion}/${gameState.selectedQuestions.length}</span>
                        </div>
                    </div>
                </div>
                <div class="w-full bg-white/10 rounded-full h-3 mt-4">
                    <div class="progress-bar bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-500" 
                         style="width: ${(gameState.currentQuestion/gameState.selectedQuestions.length)*100}%"></div>
                </div>
            </div>
            
            <!-- Contenedor de la pregunta -->
            <div id="questionContainer" class="bg-gradient-to-br from-gray-900/40 via-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
                <div class="text-center text-white">
                    <div class="relative">
                        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-400/30 border-t-blue-400 mx-auto mb-6"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p class="text-xl text-blue-200 font-medium animate-pulse">⚡ Preparando tu desafío...</p>
                    <div class="mt-4 flex justify-center space-x-1">
                        <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                        <div class="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para obtener el nombre de la categoría
function getCategoryName(category) {
    const names = {
        'canva': '🎨 Maestro de Canva',
        'redes': '📱 Gurú de Redes',
        'whatsapp': '💬 Experto WhatsApp',
        'mixed': '🎯 Desafío Mixto',
        'survival': '⚡ Modo Supervivencia',
        'speed': '🚀 Modo Velocidad',
        'daily': '⭐ Desafío Diario'
    };
    return names[category] || category;
}

// Verificar desafío diario
function checkDailyChallenge() {
    const today = new Date().toDateString();
    const lastChallenge = playerData.lastDailyChallenge;
    
    if (lastChallenge !== today) {
        showDailyChallengeNotification();
    }
}

// Mostrar notificación del desafío diario
function showDailyChallengeNotification() {
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const challenge = dailyChallenges[dayName];
    
    setTimeout(() => {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-2xl z-50 max-w-sm animate-bounce-in';
        notification.innerHTML = `
            <div class="text-center">
                <div class="text-4xl mb-2">⭐</div>
                <h3 class="font-bold text-lg mb-2">¡Desafío del Día!</h3>
                <p class="text-sm mb-3">${challenge.theme}</p>
                <p class="text-xs mb-4">Bonus: ${challenge.bonus}x puntos</p>
                <button onclick="startDailyChallenge(); this.parentElement.parentElement.remove();" 
                        class="bg-white text-blue-600 px-4 py-2 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors mr-2">
                    ¡Aceptar!
                </button>
                <button onclick="this.parentElement.parentElement.remove();" 
                        class="bg-transparent border border-white text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-white/10 transition-colors">
                    Más tarde
                </button>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }, 2000);
}

// Funciones para compartir
function compartirResultados(plataforma) {
    const texto = `¡Obtuve ${gameState.score}/${gameState.selectedQuestions.length} puntos en ${getCategoryName(gameState.currentCategory)}! 🎯 ¿Puedes superarme?`;
    const url = window.location.href;
    
    const enlaces = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(texto)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(texto + ' ' + url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(texto)}`
    };
    
    if (enlaces[plataforma]) {
        window.open(enlaces[plataforma], '_blank');
        
        // Incrementar contador de compartidos
        playerData.shareCount = (playerData.shareCount || 0) + 1;
        if (playerData.shareCount >= 5 && !playerData.badges.includes('socialInfluencer')) {
            setTimeout(() => awardBadge('socialInfluencer'), 500);
        }
        savePlayerData();
    }
}

// Exponer funciones globalmente
window.startQuiz = startQuiz;
window.startSurvivalMode = startSurvivalMode;
window.startDailyChallenge = startDailyChallenge;
window.startSpeedMode = startSpeedMode;
window.startMixedChallenge = startMixedChallenge;
window.compartirResultados = compartirResultados;
