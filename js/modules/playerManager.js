// ===== GESTIÓN DE DATOS DEL JUGADOR =====
import { playerData, badges } from './gameConfig.js';

// Cargar datos del jugador
export function loadPlayerData() {
    const saved = localStorage.getItem('playerData');
    if (saved) {
        Object.assign(playerData, JSON.parse(saved));
    }
    calculateLevel();
    updateStatsDisplay();
    checkDailyChallenge();
}

// Guardar datos del jugador
export function savePlayerData() {
    localStorage.setItem('playerData', JSON.stringify(playerData));
}

// Calcular nivel del jugador
export function calculateLevel() {
    const newLevel = Math.floor(playerData.totalScore / 100) + 1;
    if (newLevel > playerData.level) {
        const oldLevel = playerData.level;
        playerData.level = newLevel;
        
        // Animación de subida de nivel
        setTimeout(() => {
            showLevelUpAnimation(oldLevel, newLevel);
            if (newLevel === 10) awardBadge('levelMaster');
        }, 1000);
    }
}

// Actualizar display de estadísticas
export function updateStatsDisplay() {
    const totalScoreEl = document.getElementById('totalScore');
    const completedQuizEl = document.getElementById('completedQuiz');
    const currentStreakEl = document.getElementById('currentStreak');
    const playerLevelEl = document.getElementById('playerLevel');
    
    if (totalScoreEl) totalScoreEl.textContent = playerData.totalScore;
    if (completedQuizEl) completedQuizEl.textContent = playerData.completedQuiz;
    if (currentStreakEl) currentStreakEl.textContent = playerData.currentStreak;
    if (playerLevelEl) playerLevelEl.textContent = playerData.level;
    
    // Mostrar stats si hay datos
    const statsEl = document.getElementById('playerStats');
    if (statsEl && (playerData.totalScore > 0 || playerData.completedQuiz > 0)) {
        statsEl.classList.remove('hidden');
    }
}

// Mostrar animación de subida de nivel
export function showLevelUpAnimation(oldLevel, newLevel) {
    const levelUpDiv = document.createElement('div');
    levelUpDiv.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm';
    levelUpDiv.innerHTML = `
        <div class="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl p-8 text-center text-white shadow-2xl animate-bounce-in max-w-md mx-4">
            <div class="text-6xl mb-4">🎉</div>
            <h2 class="text-3xl font-bold mb-2">¡SUBISTE DE NIVEL!</h2>
            <p class="text-xl mb-4">Nivel ${oldLevel} → Nivel ${newLevel}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="bg-white text-orange-500 px-6 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors">
                ¡Genial!
            </button>
        </div>
    `;
    document.body.appendChild(levelUpDiv);
    
    setTimeout(() => {
        if (levelUpDiv.parentElement) {
            levelUpDiv.remove();
        }
    }, 5000);
}

// Otorgar insignia
export function awardBadge(badgeId) {
    if (!playerData.badges.includes(badgeId)) {
        playerData.badges.push(badgeId);
        const badge = badges[badgeId];
        
        showBadgeAnimation(badge);
        savePlayerData();
        displayBadges();
    }
}

// Mostrar animación de insignia
export function showBadgeAnimation(badge) {
    const badgeDiv = document.createElement('div');
    badgeDiv.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm';
    badgeDiv.innerHTML = `
        <div class="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl p-8 text-center text-white shadow-2xl animate-bounce-in max-w-md mx-4">
            <div class="text-6xl mb-4">${badge.emoji}</div>
            <h2 class="text-3xl font-bold mb-2">¡NUEVO LOGRO!</h2>
            <h3 class="text-2xl font-semibold mb-2">${badge.name}</h3>
            <p class="text-lg mb-4">${badge.description}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="bg-white text-orange-500 px-6 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors">
                ¡Awesome!
            </button>
        </div>
    `;
    document.body.appendChild(badgeDiv);
    
    setTimeout(() => {
        if (badgeDiv.parentElement) {
            badgeDiv.remove();
        }
    }, 5000);
}

// Mostrar insignias
export function displayBadges() {
    const container = document.getElementById('badgeContainer');
    if (!container) return;
    
    if (playerData.badges.length === 0) {
        document.getElementById('achievements').classList.add('hidden');
        return;
    }
    
    document.getElementById('achievements').classList.remove('hidden');
    container.innerHTML = playerData.badges.map(badgeId => {
        const badge = badges[badgeId];
        return `
            <div class="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-4 border border-yellow-400/20 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20">
                <div class="text-4xl mb-2">${badge.emoji}</div>
                <div class="font-bold text-yellow-400 text-sm">${badge.name}</div>
                <div class="text-xs text-yellow-200 mt-1">${badge.description}</div>
            </div>
        `;
    }).join('');
}

// Verificar desafío diario
export function checkDailyChallenge() {
    const today = new Date().toDateString();
    const lastChallenge = playerData.lastDailyChallenge;
    
    if (lastChallenge !== today) {
        showDailyChallengeNotification();
    }
}
