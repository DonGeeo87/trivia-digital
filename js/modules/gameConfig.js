// ===== CONFIGURACIÓN DEL JUEGO =====
// Variables globales del estado del juego
export let gameState = {
    currentQuestion: 0,
    score: 0,
    currentCategory: 'general',
    nombreJugador: '',
    respuestas: [],
    consecutiveCorrect: 0,
    gameMode: 'normal', // 'normal', 'survival', 'daily', 'speed', 'mixed'
    survivalLives: 3,
    selectedQuestions: []
};

// Datos persistentes del jugador
export let playerData = {
    totalScore: 0,
    completedQuiz: 0,
    currentStreak: 0,
    maxStreak: 0,
    level: 1,
    badges: [],
    unlockedCategories: ['canva', 'redes', 'whatsapp'],
    lastDailyChallenge: null,
    dailyStreak: 0,
    survivalRecord: 0,
    shareCount: 0
};

// Sistema de logros
export const badges = {
    firstQuiz: { name: "Primer Paso", emoji: "🎯", description: "Completaste tu primer quiz" },
    perfectScore: { name: "Perfección", emoji: "💎", description: "Respuestas 100% correctas" },
    canvaMaster: { name: "Maestro Canva", emoji: "🎨", description: "Dominas Canva" },
    socialGuru: { name: "Gurú Social", emoji: "📱", description: "Experto en redes sociales" },
    whatsappPro: { name: "WhatsApp Pro", emoji: "💬", description: "Profesional de WhatsApp" },
    streakFive: { name: "Racha x5", emoji: "🔥", description: "5 respuestas correctas seguidas" },
    explorer: { name: "Explorador", emoji: "🗺️", description: "Completaste todas las categorías" },
    survivor: { name: "Superviviente", emoji: "⚡", description: "Sobreviviste 10 preguntas seguidas" },
    dailyWarrior: { name: "Guerrero Diario", emoji: "⚔️", description: "7 días consecutivos de desafíos" },
    socialInfluencer: { name: "Influencer", emoji: "🌟", description: "Compartiste tus logros 5 veces" },
    levelMaster: { name: "Maestro Nivel 10", emoji: "👑", description: "Alcanzaste el nivel 10" },
    speedDemon: { name: "Demonio Veloz", emoji: "⚡", description: "Respondiste en menos de 5 segundos" }
};

// Desafíos diarios
export const dailyChallenges = {
    monday: { category: 'canva', theme: "Lunes de Diseño", bonus: 2 },
    tuesday: { category: 'redes', theme: "Martes Social", bonus: 2 },
    wednesday: { category: 'whatsapp', theme: "Miércoles de Comunicación", bonus: 2 },
    thursday: { category: 'mixed', theme: "Jueves Mixto", bonus: 3 },
    friday: { category: 'survival', theme: "Viernes de Supervivencia", bonus: 5 },
    saturday: { category: 'speed', theme: "Sábado Veloz", bonus: 4 },
    sunday: { category: 'mixed', theme: "Domingo de Repaso", bonus: 3 }
};

// Funciones para actualizar el estado
export function updateGameState(updates) {
    Object.assign(gameState, updates);
}

export function resetGameState() {
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.respuestas = [];
    gameState.consecutiveCorrect = 0;
}
