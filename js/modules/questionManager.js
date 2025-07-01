// ===== SISTEMA DE PREGUNTAS Y UI =====
import { gameState, playerData } from './gameConfig.js';
import { savePlayerData } from './playerManager.js';

// Mostrar pregunta con diseño moderno
export function showQuestion() {
    const q = gameState.selectedQuestions[gameState.currentQuestion];
    const container = document.getElementById('questionContainer');
    
    // Determinar estilo según el modo de juego
    const getModeStyle = () => {
        switch(gameState.gameMode) {
            case 'survival':
                return {
                    gradient: 'from-red-900 via-red-800 to-orange-900',
                    accent: 'border-red-400/30',
                    buttonHover: 'hover:bg-red-500/20 hover:border-red-400',
                    icon: '⚡'
                };
            case 'speed':
                return {
                    gradient: 'from-yellow-900 via-yellow-800 to-orange-900',
                    accent: 'border-yellow-400/30',
                    buttonHover: 'hover:bg-yellow-500/20 hover:border-yellow-400',
                    icon: '🚀'
                };
            case 'mixed':
                return {
                    gradient: 'from-purple-900 via-purple-800 to-pink-900',
                    accent: 'border-purple-400/30',
                    buttonHover: 'hover:bg-purple-500/20 hover:border-purple-400',
                    icon: '🎯'
                };
            case 'daily':
                return {
                    gradient: 'from-blue-900 via-blue-800 to-indigo-900',
                    accent: 'border-blue-400/30',
                    buttonHover: 'hover:bg-blue-500/20 hover:border-blue-400',
                    icon: '⭐'
                };
            default:
                return {
                    gradient: 'from-gray-900 via-gray-800 to-gray-900',
                    accent: 'border-orange-400/30',
                    buttonHover: 'hover:bg-orange-500/20 hover:border-orange-400',
                    icon: '💎'
                };
        }
    };
    
    const style = getModeStyle();
    
    container.innerHTML = `
        <div class="question-card relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.gradient} p-8 border ${style.accent} backdrop-blur-xl shadow-2xl">
            <!-- Partículas decorativas -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
                <div class="absolute top-1/4 -right-2 w-6 h-6 bg-white/5 rounded-full animate-pulse delay-700"></div>
                <div class="absolute bottom-1/4 left-1/4 w-4 h-4 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            </div>
            
            <!-- Contenido principal -->
            <div class="relative z-10 text-center space-y-8">
                <!-- Header de la pregunta -->
                <div class="space-y-4">
                    <div class="flex items-center justify-center space-x-2 mb-4">
                        <span class="text-3xl">${style.icon}</span>
                        <h3 class="text-2xl font-bold text-white">Pregunta ${gameState.currentQuestion + 1}</h3>
                        <span class="text-3xl">${style.icon}</span>
                    </div>
                    
                    <!-- Pregunta principal -->
                    <div class="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <p class="text-xl text-white font-medium leading-relaxed">${q.pregunta}</p>
                    </div>
                </div>
                
                <!-- Opciones de respuesta -->
                <div class="space-y-4" id="answersContainer">
                    ${q.opciones.map((opt, i) => `
                        <button onclick="window.gameManager.answer(${i})" 
                                class="answer-btn group w-full p-5 text-left rounded-xl border-2 border-white/20 bg-black/10 backdrop-blur-sm text-white transition-all duration-300 transform hover:scale-105 ${style.buttonHover} hover:shadow-lg hover:shadow-white/10">
                            <div class="flex items-center space-x-4">
                                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm group-hover:bg-white/30 transition-colors">
                                    ${String.fromCharCode(65 + i)}
                                </div>
                                <span class="font-medium text-lg">${opt}</span>
                            </div>
                        </button>
                    `).join('')}
                </div>
                
                <!-- Indicadores adicionales para modos especiales -->
                ${gameState.gameMode === 'survival' ? `
                    <div class="mt-6 flex justify-center items-center space-x-2">
                        <span class="text-red-300 font-bold">Vidas:</span>
                        ${Array(gameState.survivalLives).fill().map(() => '<span class="text-red-400 text-xl">❤️</span>').join('')}
                    </div>
                ` : ''}
                
                ${gameState.gameMode === 'speed' && window.timeLeft ? `
                    <div class="mt-6 flex justify-center items-center space-x-2">
                        <span class="text-yellow-300 font-bold">Tiempo:</span>
                        <span class="text-yellow-400 text-xl font-bold">${window.timeLeft}s ⏰</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Actualizar barra de progreso
export function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${((gameState.currentQuestion + 1)/gameState.selectedQuestions.length)*100}%`;
    }
}

// Actualizar display de puntuación
export function updateScoreDisplay() {
    const scoreElement = document.querySelector('.text-blue-600.font-semibold');
    const streakElement = document.querySelector('.text-yellow-600.font-semibold');
    
    if (scoreElement) scoreElement.textContent = `💎 ${gameState.score} puntos`;
    if (streakElement) streakElement.textContent = `🔥 ${gameState.consecutiveCorrect} racha`;
}

// Mostrar popup de puntuación
export function showScorePopup(message, type) {
    const popup = document.createElement('div');
    
    // Estilos dinámicos según el tipo
    const getPopupStyle = () => {
        switch(type) {
            case 'correct':
                return {
                    gradient: 'from-green-600 to-emerald-600',
                    shadow: 'shadow-green-500/50',
                    border: 'border-green-400',
                    icon: '🎉'
                };
            case 'achievement':
                return {
                    gradient: 'from-yellow-500 to-orange-500',
                    shadow: 'shadow-yellow-500/50',
                    border: 'border-yellow-400',
                    icon: '🏆'
                };
            default:
                return {
                    gradient: 'from-red-500 to-red-600',
                    shadow: 'shadow-red-500/50',
                    border: 'border-red-400',
                    icon: '💪'
                };
        }
    };
    
    const style = getPopupStyle();
    
    popup.className = `score-popup fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r ${style.gradient} rounded-2xl p-6 shadow-2xl ${style.shadow} border-2 ${style.border} backdrop-blur-xl animate-bounce-in`;
    
    popup.innerHTML = `
        <div class="text-center text-white">
            <div class="text-3xl mb-2">${style.icon}</div>
            <div class="font-bold text-lg">${message}</div>
        </div>
    `;
    
    // Agregar partículas de celebración para respuestas correctas
    if (type === 'correct' || type === 'achievement') {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-2 h-2 bg-white rounded-full opacity-70';
            particle.style.cssText = `
                left: 50%;
                top: 50%;
                animation: particle-${i} 1s ease-out forwards;
            `;
            popup.appendChild(particle);
        }
        
        // Definir animaciones de partículas dinámicamente
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes particle-0 { to { transform: translate(-30px, -30px); opacity: 0; } }
            @keyframes particle-1 { to { transform: translate(30px, -30px); opacity: 0; } }
            @keyframes particle-2 { to { transform: translate(-40px, 10px); opacity: 0; } }
            @keyframes particle-3 { to { transform: translate(40px, 10px); opacity: 0; } }
            @keyframes particle-4 { to { transform: translate(-20px, 40px); opacity: 0; } }
            @keyframes particle-5 { to { transform: translate(20px, 40px); opacity: 0; } }
        `;
        document.head.appendChild(styleElement);
        
        setTimeout(() => styleElement.remove(), 1500);
    }
    
    document.body.appendChild(popup);
    
    // Animación de salida
    setTimeout(() => {
        popup.style.animation = 'fadeOut 0.3s ease-in forwards';
        setTimeout(() => popup.remove(), 300);
    }, 1200);
}
