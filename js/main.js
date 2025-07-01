let currentQuestion = 0;
let score = 0;
let currentCategory = 'general';
let nombreJugador = '';
let respuestas = [];
let consecutiveCorrect = 0;
let gameMode = 'normal'; // 'normal', 'survival', 'daily'
let survivalLives = 3;
let playerData = {
    totalScore: 0,
    completedQuiz: 0,
    currentStreak: 0,
    maxStreak: 0,
    level: 1,
    badges: [],
    unlockedCategories: ['canva', 'redes', 'whatsapp'],
    lastDailyChallenge: null,
    dailyStreak: 0,
    survivalRecord: 0
};

// Sistema de logros expandido
const badges = {
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
const dailyChallenges = {
    monday: { category: 'canva', theme: "Lunes de Diseño", bonus: 2 },
    tuesday: { category: 'redes', theme: "Martes Social", bonus: 2 },
    wednesday: { category: 'whatsapp', theme: "Miércoles de Comunicación", bonus: 2 },
    thursday: { category: 'mixed', theme: "Jueves Mixto", bonus: 3 },
    friday: { category: 'survival', theme: "Viernes de Supervivencia", bonus: 5 },
    saturday: { category: 'speed', theme: "Sábado Veloz", bonus: 4 },
    sunday: { category: 'mixed', theme: "Domingo de Repaso", bonus: 3 }
};

// Actualizar display de estadísticas
function updateStatsDisplay() {
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

// Cargar datos del jugador
function loadPlayerData() {
    const saved = localStorage.getItem('playerData');
    if (saved) {
        playerData = { ...playerData, ...JSON.parse(saved) };
    }
    calculateLevel();
    updateStatsDisplay();
    checkDailyChallenge();
}

// Guardar datos del jugador
function savePlayerData() {
    localStorage.setItem('playerData', JSON.stringify(playerData));
}

// Calcular nivel del jugador
function calculateLevel() {
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

// Mostrar animación de subida de nivel
function showLevelUpAnimation(oldLevel, newLevel) {
    const popup = document.createElement('div');
    popup.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-8 shadow-2xl border-4 border-yellow-300 backdrop-blur-xl';
    popup.style.cssText = `
        animation: badgePopupAnimation 3s ease-out forwards;
        min-width: 320px;
        max-width: 90vw;
    `;
    popup.innerHTML = `
        <div class="text-center">
            <div class="text-6xl mb-4 animate-bounce">🎉</div>
            <div class="text-3xl font-black mb-2 text-yellow-100">¡LEVEL UP!</div>
            <div class="text-xl text-white">Nivel ${oldLevel} → Nivel ${newLevel}</div>
            <div class="text-sm mt-2 opacity-80 text-yellow-100">¡Sigues creciendo como Explorador Digital!</div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

// Otorgar logro
function awardBadge(badgeId) {
    if (!playerData.badges.includes(badgeId)) {
        playerData.badges.push(badgeId);
        const badge = badges[badgeId];
        
        if (badge) {
            showBadgePopup(badge);
            savePlayerData();
        }
    }
}

// Mostrar popup de logro
function showBadgePopup(badge) {
    const popup = document.createElement('div');
    popup.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-6 shadow-2xl border-4 border-yellow-300 backdrop-blur-xl';
    popup.style.cssText = `
        animation: badgePopupAnimation 4s ease-out forwards;
        min-width: 320px;
        max-width: 90vw;
    `;
    popup.innerHTML = `
        <div class="text-center">
            <div class="text-5xl mb-3 animate-bounce">${badge.emoji}</div>
            <div class="text-2xl font-black mb-2 text-yellow-100">¡LOGRO DESBLOQUEADO!</div>
            <div class="text-xl font-bold text-white">${badge.name}</div>
            <div class="text-sm mt-2 opacity-90 text-yellow-100">${badge.description}</div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 4000);
}

// Verificar desafío diario
function checkDailyChallenge() {
    const today = new Date().toDateString();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[new Date().getDay()];
    
    if (playerData.lastDailyChallenge !== today) {
        showDailyChallengeNotification(dayName);
    }
}

// Mostrar notificación de desafío diario
function showDailyChallengeNotification(dayName) {
    const challenge = dailyChallenges[dayName];
    if (!challenge) return;
    
    const dayDisplayNames = {
        'sunday': 'Domingo',
        'monday': 'Lunes', 
        'tuesday': 'Martes',
        'wednesday': 'Miércoles',
        'thursday': 'Jueves',
        'friday': 'Viernes',
        'saturday': 'Sábado'
    };
    
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg shadow-2xl z-50 daily-challenge animate-slide-in-right';
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="text-2xl">🎯</div>
            <div>
                <div class="font-bold">¡Desafío de ${dayDisplayNames[dayName]}!</div>
                <div class="text-sm">${challenge.theme}</div>
                <div class="text-xs opacity-80">Bonus x${challenge.bonus}</div>
            </div>
            <button class="accept-challenge bg-white/20 px-3 py-1 rounded text-sm font-bold hover:bg-white/30 transition-all">
                ¡Aceptar!
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Agregar event listener al botón
    const acceptButton = notification.querySelector('.accept-challenge');
    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            notification.remove();
            startDailyChallenge(dayName);
        });
    }
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 8000);
}

// Iniciar desafío diario
function startDailyChallenge(dayName) {
    const challenge = dailyChallenges[dayName];
    if (!challenge) {
        console.error('Desafío no encontrado para:', dayName);
        return;
    }
    
    gameMode = 'daily';
    
    // Obtener el nombre del jugador si no está definido
    const input = document.getElementById("nombre");
    if (input && input.value.trim()) {
        nombreJugador = input.value.trim();
        localStorage.setItem("jugador", nombreJugador);
    } else if (!nombreJugador) {
        nombreJugador = localStorage.getItem("jugador") || "Explorador";
    }
    
    if (challenge.category === 'survival') {
        startSurvivalMode();
    } else if (challenge.category === 'speed') {
        startSpeedMode();
    } else if (challenge.category === 'mixed') {
        startMixedChallenge();
    } else {
        startQuiz(challenge.category);
    }
}

// Modo supervivencia
function startSurvivalMode() {
    gameMode = 'survival';
    survivalLives = 3;
    currentCategory = 'mixed';
    currentQuestion = 0;
    score = 0;
    respuestas = [];
    consecutiveCorrect = 0;
    
    // Mezclar todas las preguntas y tomar una buena cantidad
    selectedQuestions = [...preguntas].sort(() => 0.5 - Math.random()).slice(0, 50);
    
    showSurvivalInterface();
    // Dar un pequeño tiempo para que se renderice la interfaz
    setTimeout(() => showQuestion(), 200);
}

// Interfaz del modo supervivencia
function showSurvivalInterface() {
    document.body.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 p-4">
            <div class="max-w-2xl mx-auto">
                <div class="bg-black/20 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-orange-400/30 survival-mode">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-black text-orange-400">🔥 MODO SUPERVIVENCIA</h2>
                        <div class="flex space-x-2">
                            ${Array.from({length: survivalLives}, () => '<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">❤️</div>').join('')}
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-4 text-center mb-4">
                        <div class="bg-orange-500/20 rounded-lg p-3">
                            <div class="text-2xl font-bold text-orange-400">${score}</div>
                            <div class="text-xs text-orange-200">PUNTOS</div>
                        </div>
                        <div class="bg-red-500/20 rounded-lg p-3">
                            <div class="text-2xl font-bold text-red-400">${consecutiveCorrect}</div>
                            <div class="text-xs text-red-200">RACHA</div>
                        </div>
                        <div class="bg-yellow-500/20 rounded-lg p-3">
                            <div class="text-2xl font-bold text-yellow-400">${survivalLives}</div>
                            <div class="text-xs text-yellow-200">VIDAS</div>
                        </div>
                    </div>
                </div>
                
                <div id="questionContainer" class="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-400/20">
                    <!-- Las preguntas se cargan aquí -->
                </div>
            </div>
        </div>
    `;
}

// Función para compartir en redes sociales
function shareResults(platform) {
    const text = `🧠 ¡Acabo de completar un quiz en Explorador Digital!\n\n` +
                `📊 Puntuación: ${score}/${selectedQuestions.length}\n` +
                `🎯 Categoría: ${getCategoryName(currentCategory)}\n` +
                `🏆 Logros desbloqueados: ${playerData.badges.length}\n` +
                `⭐ Nivel: ${playerData.level}\n\n` +
                `¡Únete al desafío digital! 🚀`;
    
    const url = window.location.href;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        
        // Incrementar contador de compartidos
        if (!playerData.socialShares) playerData.socialShares = 0;
        playerData.socialShares++;
        
        if (playerData.socialShares >= 5) {
            awardBadge('socialInfluencer');
        }
        
        savePlayerData();
    }
}

// Botones de compartir mejorados
function createShareButtons() {
    return `
        <div class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/20 mb-6">
            <h3 class="text-xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                📱 ¡Comparte tu Logro!
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onclick="shareResults('twitter')" 
                        class="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg">
                    🐦 Twitter
                </button>
                <button onclick="shareResults('facebook')" 
                        class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg">
                    📘 Facebook
                </button>
                <button onclick="shareResults('whatsapp')" 
                        class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg">
                    💬 WhatsApp
                </button>
                <button onclick="shareResults('linkedin')" 
                        class="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-4 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg">
                    💼 LinkedIn
                </button>
            </div>
        </div>
    `;
}

const preguntas = [
  // --- canva (10) ---
  {
    categoria: "canva",
    pregunta: "¿Para qué sirve canva?",
    opciones: ["Crear documentos legales", "Diseñar contenido visual", "Editar hojas de cálculo"],
    respuesta: "Diseñar contenido visual"
  },
  {
    categoria: "canva",
    pregunta: "¿Qué tipo de contenido puedes hacer con canva?",
    opciones: ["Currículums", "Posts para Instagram", "Ambas anteriores"],
    respuesta: "Ambas anteriores"
  },
  {
    categoria: "canva",
    pregunta: "¿Cuál es una función de canva Pro?",
    opciones: ["Descargar videos HD", "Remover fondo de imágenes", "Insertar fórmulas"],
    respuesta: "Remover fondo de imágenes"
  },
  {
    categoria: "canva",
    pregunta: "¿Qué permite una plantilla en canva?",
    opciones: ["Ver recetas", "Reutilizar un diseño base", "Programar redes"],
    respuesta: "Reutilizar un diseño base"
  },
  {
    categoria: "canva",
    pregunta: "¿Qué opción en canva permite animar elementos?",
    opciones: ["Transiciones", "Texto decorado", "Animaciones"],
    respuesta: "Animaciones"
  },
  {
    categoria: "canva",
    pregunta: "¿Puedo trabajar en equipo desde canva?",
    opciones: ["No", "Sí, compartiendo el diseño", "Solo desde PC"],
    respuesta: "Sí, compartiendo el diseño"
  },
  {
    categoria: "canva",
    pregunta: "¿canva permite descargar en formato PDF?",
    opciones: ["No", "Sí", "Solo en Word"],
    respuesta: "Sí"
  },
  {
    categoria: "canva",
    pregunta: "¿Cuál es una ventaja de canva frente a Photoshop?",
    opciones: ["Más fácil de usar", "Menos opciones de exportación", "Requiere instalación"],
    respuesta: "Más fácil de usar"
  },
  {
    categoria: "canva",
    pregunta: "¿Qué puedes hacer con el kit de marca en canva Pro?",
    opciones: ["Cambiar idioma", "Subir logos y definir colores", "Modificar velocidad de internet"],
    respuesta: "Subir logos y definir colores"
  },
  {
    categoria: "canva",
    pregunta: "¿Qué tipo de contenido NO es ideal crear en canva?",
    opciones: ["Recetas médicas", "Presentaciones", "Flyers"],
    respuesta: "Recetas médicas"
  },

  // --- redes (10) ---
  {
    categoria: "redes",
    pregunta: "¿Qué plataforma es conocida por contenido en video corto?",
    opciones: ["Instagram", "TikTok", "Pinterest"],
    respuesta: "TikTok"
  },
  {
    categoria: "redes",
    pregunta: "¿Qué red social es más usada para buscar trabajo?",
    opciones: ["LinkedIn", "Facebook", "YouTube"],
    respuesta: "LinkedIn"
  },
  {
    categoria: "redes",
    pregunta: "¿Cuál es una estrategia efectiva en redes?",
    opciones: ["Publicar una vez al mes", "Ignorar comentarios", "Publicar con constancia"],
    respuesta: "Publicar con constancia"
  },
  {
    categoria: "redes",
    pregunta: "¿Qué contenido genera más interacción?",
    opciones: ["Publicaciones sin imágenes", "Videos cortos y dinámicos", "Textos largos sin formato"],
    respuesta: "Videos cortos y dinámicos"
  },
  {
    categoria: "redes",
    pregunta: "¿Qué red social permite crear canales de difusión?",
    opciones: ["Instagram", "WhatsApp", "X (Twitter)"],
    respuesta: "Instagram"
  },
  {
    categoria: "redes",
    pregunta: "¿Qué significa 'engagement'?",
    opciones: ["Número de seguidores", "Interacción de tu audiencia", "Cantidad de publicaciones"],
    respuesta: "Interacción de tu audiencia"
  },
  {
    categoria: "redes",
    pregunta: "¿Qué significa 'algoritmo' en redes?",
    opciones: ["Una herramienta de pago", "Sistema que decide qué mostrarte", "Aplicación de edición"],
    respuesta: "Sistema que decide qué mostrarte"
  },
  {
    categoria: "redes",
    pregunta: "¿Qué formato es ideal para publicaciones en Instagram?",
    opciones: ["Cuadrado 1080x1080", "A4", "Carta horizontal"],
    respuesta: "Cuadrado 1080x1080"
  },
  {
    categoria: "redes",
    pregunta: "¿Para qué sirve usar hashtags?",
    opciones: ["Decorar el texto", "Aumentar alcance y visibilidad", "Ocultar publicaciones"],
    respuesta: "Aumentar alcance y visibilidad"
  },
  {
    categoria: "redes",
    pregunta: "¿Qué día suele tener mejor alcance?",
    opciones: ["Lunes", "Miércoles", "Domingo"],
    respuesta: "Miércoles"
  },

  // --- whatsapp (10) ---
  {
    categoria: "whatsapp",
    pregunta: "¿Qué es Whatsapp Business?",
    opciones: ["Un juego", "Una versión de WhatsApp para empresas", "Una red social"],
    respuesta: "Una versión de WhatsApp para empresas"
  },
  {
    categoria: "whatsapp",
    pregunta: "¿Qué función exclusiva tiene Whatsapp Business?",
    opciones: ["Publicar historias", "Crear catálogo de productos", "Cambiar colores del chat"],
    respuesta: "Crear catálogo de productos"
  },
  {
    categoria: "whatsapp",
    pregunta: "¿Qué puedes configurar en tu perfil de empresa?",
    opciones: ["Logo, descripción, horario", "Contraseña del celular", "Filtros de cámara"],
    respuesta: "Logo, descripción, horario"
  },
  {
    categoria: "whatsapp",
    pregunta: "¿Qué son los mensajes automáticos?",
    opciones: ["Spam", "Respuestas que se envían sin intervención manual", "Videos automáticos"],
    respuesta: "Respuestas que se envían sin intervención manual"
  },
  {
    categoria: "whatsapp",
    pregunta: "¿Puedes vincular WhatsApp Business con una página web?",
    opciones: ["Sí, con enlaces o botones", "No", "Solo en Android"],
    respuesta: "Sí, con enlaces o botones"
  },
  {
    categoria: "whatsapp",
    pregunta: "¿Qué función ayuda a organizar clientes?",
    opciones: ["Filtros de color", "Etiquetas", "Modos oscuros"],
    respuesta: "Etiquetas"
  },
  {
    categoria: "whatsapp",
    pregunta: "¿Qué permite el botón de llamada?",
    opciones: ["Contactar con amigos", "Ofrecer soporte directo", "Pedir comida"],
    respuesta: "Ofrecer soporte directo"
  },
  {
    categoria: "whatsapp",
    pregunta: "¿Qué ventaja tiene conectar WhatsApp Business con Facebook?",
    opciones: ["Sincronización de mensajes", "Poder correr anuncios con contacto directo", "Aumentar likes"],
    respuesta: "Poder correr anuncios con contacto directo"
  },
  {
    categoria: "whatsapp",
    pregunta: "¿Whatsapp Business es gratuito?",
    opciones: ["No", "Sí", "Solo 7 días"],
    respuesta: "Sí"
  },
  {
    categoria: "whatsapp",
    pregunta: "¿Cuál es una buena práctica para emprendedores en WhatsApp?",
    opciones: ["No responder rápido", "Usar mensajes largos", "Responder con prontitud y claridad"],
    respuesta: "Responder con prontitud y claridad"
  }
];

let selectedQuestions = [];

function startQuiz(category) {
  const input = document.getElementById("nombre");
  if (input) {
    nombreJugador = input.value.trim();
    if (!nombreJugador) {
      alert("Por favor ingresa tu nombre de explorador.");
      return;
    }
    localStorage.setItem("jugador", nombreJugador);
    loadPlayerData();
  } else {
    nombreJugador = localStorage.getItem("jugador") || "Explorador";
  }

  currentCategory = category;
  currentQuestion = 0;
  score = 0;
  respuestas = [];
  consecutiveCorrect = 0;

  // Filtra por categoría y elige 3 preguntas aleatorias
  const preguntasFiltradas = preguntas.filter(
    (p) => p.categoria.toLowerCase() === currentCategory.toLowerCase()
  );
  selectedQuestions = preguntasFiltradas
    .sort(() => 0.5 - Math.random())
    .slice(0, 10); // Cambiar a 10 preguntas en lugar de 3

  showGameInterface();
  // Dar un pequeño tiempo para que se renderice la interfaz
  setTimeout(() => {
    showQuestion();
    // Asegurar que los displays se actualicen después del render
    setTimeout(() => updateScoreDisplay(), 100);
  }, 200);
}

function showGameInterface() {
  document.body.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4">
      <!-- Header del juego -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-white">🧠 ${nombreJugador}</h2>
            <div class="text-lg text-blue-200">
              ${getCategoryName(currentCategory)}
            </div>
          </div>
          
          <!-- Barra de progreso -->
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-2 text-purple-200">
              <span>Progreso</span>
              <span id="progress-text">${currentQuestion + 1}/${selectedQuestions.length}</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-3">
              <div class="progress-bar bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-500" 
                   style="width: ${((currentQuestion + 1)/selectedQuestions.length)*100}%"></div>
            </div>
          </div>
          
          <!-- Puntuación actual -->
          <div class="flex justify-between items-center text-sm">
            <div class="bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/20">
              <span id="score-display" class="text-blue-400 font-semibold">💎 ${score} puntos</span>
            </div>
            <div class="bg-yellow-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-400/20">
              <span id="streak-display" class="text-yellow-400 font-semibold">🔥 ${consecutiveCorrect} racha</span>
            </div>
          </div>
        </div>
        
        <!-- Contenedor de pregunta -->
        <div id="questionContainer" class="bg-gradient-to-br from-gray-900/40 via-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
          <!-- Las preguntas se cargan aquí -->
        </div>
      </div>
    </div>
  `;
}

function getCategoryName(category) {
  const names = {
    'canva': '🎨 Maestro de Canva',
    'redes': '📱 Gurú de Redes',
    'whatsapp': '💬 Experto WhatsApp'
  };
  return names[category] || category;
}

function showQuestion() {
  const q = selectedQuestions[currentQuestion];
  const container = document.getElementById('questionContainer');
  
  if (!container) {
    setTimeout(() => showQuestion(), 100);
    return;
  }
  
  if (!q) {
    console.error('❌ No question found at index:', currentQuestion);
    return;
  }
  
  // Versión ultra-simplificada para debugging
  container.innerHTML = `
    <div class="p-8 text-white bg-gray-800 rounded-lg">
      <h3 class="text-xl font-bold mb-4">Pregunta ${currentQuestion + 1} de ${selectedQuestions.length}</h3>
      <p class="text-lg mb-6">${q.pregunta}</p>
      
      <div class="space-y-3">
        ${q.opciones.map((opt, i) => `
          <button class="answer-btn w-full p-3 text-left bg-blue-600 hover:bg-blue-700 rounded text-white" 
                  data-answer="${i}" type="button">
            ${String.fromCharCode(65 + i)}) ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `;
  
  // Actualizar barra de progreso
  updateProgressBar();
  
  // Actualizar displays de puntaje
  updateScoreDisplay();
  
  // Agregar event listeners a los botones
  setTimeout(() => {
    const answerButtons = container.querySelectorAll('.answer-btn');
    
    answerButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const answerIndex = parseInt(button.getAttribute('data-answer'));
        answer(answerIndex);
      });
    });
  }, 100);
}

function answer(selected) {
  // Verificar si ya se está procesando una respuesta
  if (window.processingAnswer) {
    return;
  }
  
  window.processingAnswer = true;
  
  // Usar función específica para modo supervivencia
  if (gameMode === 'survival') {
    handleSurvivalAnswer(selected);
    return;
  }
  
  const q = selectedQuestions[currentQuestion];
  const isCorrect = q.opciones[selected] === q.respuesta;
  const buttons = document.querySelectorAll('.answer-btn');
  
  if (buttons.length === 0) {
    console.error('No answer buttons found!');
    window.processingAnswer = false;
    return;
  }
  
  // Deshabilitar todos los botones
  buttons.forEach(btn => btn.style.pointerEvents = 'none');
  
  // Mostrar respuesta correcta/incorrecta
  if (buttons[selected]) {
    buttons[selected].classList.add(isCorrect ? 'correct-answer' : 'wrong-answer');
  }
  
  // Mostrar la respuesta correcta si la seleccionada es incorrecta
  if (!isCorrect) {
    const correctIndex = q.opciones.indexOf(q.respuesta);
    if (buttons[correctIndex]) {
      buttons[correctIndex].classList.add('correct-answer');
    }
  }

  respuestas.push({
    pregunta: q.pregunta,
    seleccionada: q.opciones[selected],
    correcta: q.respuesta,
    esCorrecta: isCorrect,
  });

  if (isCorrect) {
    score++;
    consecutiveCorrect++;
    playerData.currentStreak = Math.max(playerData.currentStreak, consecutiveCorrect);
    showScorePopup('+1 Punto! 🎉', 'correct');
    
    // Verificar logros
    if (consecutiveCorrect >= 5 && !playerData.badges.includes('streakFive')) {
      setTimeout(() => awardBadge('streakFive'), 1000);
    }
  } else {
    consecutiveCorrect = 0;
    showScorePopup('¡Sigue intentando! 💪', 'incorrect');
  }

  // Actualizar displays
  updateProgressBar();
  updateScoreDisplay();

  setTimeout(() => {
    window.processingAnswer = false; // Reset the flag
    currentQuestion++;
    if (currentQuestion < selectedQuestions.length) {
      showQuestion();
    } else {
      completeQuiz();
    }
  }, 2000);
}

function updateProgressBar() {
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar && selectedQuestions) {
    const progress = ((currentQuestion + 1) / selectedQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
  }
}

function updateScoreDisplay() {
  // Para el modo normal - usar IDs específicos
  const scoreElement = document.getElementById('score-display');
  const streakElement = document.getElementById('streak-display');
  const progressElement = document.getElementById('progress-text');
  
  if (scoreElement) scoreElement.textContent = `💎 ${score} puntos`;
  if (streakElement) streakElement.textContent = `🔥 ${consecutiveCorrect} racha`;
  if (progressElement) progressElement.textContent = `${currentQuestion + 1}/${selectedQuestions.length}`;
  
  // Para el modo supervivencia - actualizar los números en el display
  const survivalScoreElements = document.querySelectorAll('.text-2xl.font-bold');
  if (survivalScoreElements.length >= 3) {
    survivalScoreElements[0].textContent = score;
    survivalScoreElements[1].textContent = consecutiveCorrect;
    survivalScoreElements[2].textContent = survivalLives;
  }
}

function showScorePopup(message, type) {
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
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particle-0 { to { transform: translate(-30px, -30px); opacity: 0; } }
      @keyframes particle-1 { to { transform: translate(30px, -30px); opacity: 0; } }
      @keyframes particle-2 { to { transform: translate(-40px, 10px); opacity: 0; } }
      @keyframes particle-3 { to { transform: translate(40px, 10px); opacity: 0; } }
      @keyframes particle-4 { to { transform: translate(-20px, 40px); opacity: 0; } }
      @keyframes particle-5 { to { transform: translate(20px, 40px); opacity: 0; } }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => style.remove(), 1500);
  }
  
  document.body.appendChild(popup);
  
  // Animación de salida
  setTimeout(() => {
    popup.style.animation = 'fadeOut 0.3s ease-in forwards';
    setTimeout(() => popup.remove(), 300);
  }, 1200);
}

function completeQuiz() {
  // Actualizar estadísticas del jugador según el modo
  let multiplier = 1;
  switch(gameMode) {
    case 'daily':
      multiplier = 3;
      break;
    case 'mixed':
      completeMixedMode();
      return;
    case 'speed':
      completeSpeedMode();
      return;
    case 'survival':
      // Ya se maneja en endSurvivalMode
      return;
    default:
      multiplier = 1;
  }
  
  playerData.totalScore += score * multiplier;
  playerData.completedQuiz++;
  playerData.maxStreak = Math.max(playerData.maxStreak, consecutiveCorrect);
  
  // Marcar desafío diario como completado
  if (gameMode === 'daily') {
    playerData.lastDailyChallenge = new Date().toDateString();
    playerData.dailyStreak = (playerData.dailyStreak || 0) + 1;
    
    if (playerData.dailyStreak >= 7) {
      awardBadge('dailyWarrior');
    }
  }
  
  // Verificar y otorgar logros
  checkAndAwardBadges();
  
  // Calcular nivel
  calculateLevel();
  
  // Guardar progreso
  savePlayerData();
  
  // Mostrar resultados
  showResult(selectedQuestions.length);
}

function checkAndAwardBadges() {
  // Primer quiz completado
  if (playerData.completedQuiz === 1) {
    awardBadge('firstQuiz');
  }
  
  // Puntuación perfecta
  if (score === selectedQuestions.length) {
    awardBadge('perfectScore');
  }
  
  // Logros por categoría
  if (score >= 2) { // Al menos 2 de 3 correctas
    if (currentCategory === 'canva') awardBadge('canvaMaster');
    if (currentCategory === 'redes') awardBadge('socialGuru');
    if (currentCategory === 'whatsapp') awardBadge('whatsappPro');
  }
  
  // Explorador completo
  const categoryBadges = ['canvaMaster', 'socialGuru', 'whatsappPro'];
  if (categoryBadges.every(badge => playerData.badges.includes(badge))) {
    awardBadge('explorer');
  }
}

function showResult(total) {
  const percentage = Math.round((score / total) * 100);
  let message = "";
  let emoji = "";
  let color = "";
  
  if (percentage >= 90) {
    message = "¡Eres un Explorador Digital excepcional! 🌟";
    emoji = "🏆";
    color = "text-yellow-600";
  } else if (percentage >= 70) {
    message = "¡Excelente trabajo! Tienes una base sólida. 💪";
    emoji = "⭐";
    color = "text-blue-600";
  } else if (percentage >= 50) {
    message = "Buen intento. ¡Sigue aprendiendo y mejorando! 📚";
    emoji = "📈";
    color = "text-green-600";
  } else {
    message = "¡No te rindas! Cada intento te acerca más al éxito. 🚀";
    emoji = "💡";
    color = "text-purple-600";
  }

  let resumen = respuestas
    .map((r, index) => {
      const estado = r.esCorrecta ? "✅ Correcta" : "❌ Incorrecta";
      const bgColor = r.esCorrecta ? "bg-green-500/20 border-green-400/30" : "bg-red-500/20 border-red-400/30";
      const textColor = r.esCorrecta ? "text-green-200" : "text-red-200";
      return `
        <div class="${bgColor} backdrop-blur-xl border rounded-2xl p-4 mb-3">
          <div class="font-semibold text-white">Pregunta ${index + 1}: ${r.pregunta}</div>
          <div class="text-sm ${textColor} mt-1">Tu respuesta: <span class="font-medium text-white">${r.seleccionada}</span></div>
          <div class="text-sm ${textColor}">Correcta: <span class="font-medium text-white">${r.correcta}</span></div>
          <div class="text-sm font-semibold mt-2 ${r.esCorrecta ? 'text-green-400' : 'text-red-400'}">${estado}</div>
        </div>
      `;
    })
    .join("");

  document.body.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4">
      <div class="max-w-2xl mx-auto">
        <!-- Resultado principal -->
        <div class="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 text-center mb-6 animate-bounce-in overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 animate-pulse"></div>
          <div class="relative z-10">
            <div class="text-8xl mb-4">${emoji}</div>
            <h2 class="text-4xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">¡QUIZ COMPLETADO!</h2>
            <div class="text-6xl font-black mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">${score}/${total}</div>
            <div class="text-2xl mb-4 text-blue-200">${percentage}% de aciertos</div>
            <p class="text-xl font-semibold mb-6 text-purple-200">${message}</p>
            
            <!-- Estadísticas del jugador mejoradas -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-blue-500/20 backdrop-blur-xl rounded-2xl p-4 border border-blue-400/20">
                <div class="text-3xl font-black text-blue-400">${playerData.totalScore}</div>
                <div class="text-xs text-blue-200">PUNTOS TOTALES</div>
              </div>
              <div class="bg-green-500/20 backdrop-blur-xl rounded-2xl p-4 border border-green-400/20">
                <div class="text-3xl font-black text-green-400">${playerData.completedQuiz}</div>
                <div class="text-xs text-green-200">QUIZ COMPLETADOS</div>
              </div>
              <div class="bg-yellow-500/20 backdrop-blur-xl rounded-2xl p-4 border border-yellow-400/20">
                <div class="text-3xl font-black text-yellow-400">${playerData.currentStreak}</div>
                <div class="text-xs text-yellow-200">MEJOR RACHA</div>
              </div>
              <div class="bg-purple-500/20 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/20">
                <div class="text-3xl font-black text-purple-400">${playerData.level}</div>
                <div class="text-xs text-purple-200">NIVEL</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Logros obtenidos mejorados -->
        ${playerData.badges.length > 0 ? `
        <div class="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-yellow-400/20 p-6 mb-6">
          <h3 class="text-2xl font-black mb-4 text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">🏆 LOGROS DESBLOQUEADOS</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            ${playerData.badges.map(badgeKey => {
              const badge = badges[badgeKey];
              return `<div class="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-white px-4 py-3 rounded-2xl text-sm font-bold badge-glow shadow-2xl border border-yellow-300/50 text-center">
                <div class="text-2xl mb-1">${badge.emoji}</div>
                <div class="text-xs">${badge.name}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
        ` : ''}
        
        <!-- Botones de compartir -->
        ${createShareButtons()}
        
        <!-- Revisión de respuestas -->
        <div class="bg-gradient-to-r from-gray-600/20 to-gray-700/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-400/20 p-6 mb-6">
          <h3 class="text-2xl font-black mb-4 text-center bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">📋 REVISIÓN DE RESPUESTAS</h3>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            ${resumen}
          </div>
        </div>
        
        <!-- Acciones mejoradas -->
        <div class="text-center space-y-6">
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button onclick="location.reload()" 
                    class="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-4 rounded-2xl hover:from-indigo-500 hover:to-purple-600 font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl border border-indigo-400/30">
              🏠 Volver al Inicio
            </button>
            
            <button onclick="startSurvivalMode()" 
                    class="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl hover:from-red-500 hover:to-red-600 font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl border border-red-400/30">
              🔥 Modo Supervivencia
            </button>
          </div>
          
          <div class="text-lg font-semibold mb-4 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
            🎯 Prueba otras categorías:
          </div>
          
          <div class="flex flex-wrap gap-3 justify-center">
            ${currentCategory !== 'canva' ? `
            <button onclick="startQuiz('canva')" 
                    class="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg border border-purple-400/30">
              🎨 Probar Canva
            </button>` : ''}
            
            ${currentCategory !== 'redes' ? `
            <button onclick="startQuiz('redes')" 
                    class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg border border-blue-400/30">
              📱 Probar Redes
            </button>` : ''}
            
            ${currentCategory !== 'whatsapp' ? `
            <button onclick="startQuiz('whatsapp')" 
                    class="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-500 hover:to-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg border border-green-400/30">
              💬 Probar WhatsApp
            </button>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  loadPlayerData();
  
  // Mostrar stats del jugador si ya tiene historial
  if (playerData.completedQuiz > 0) {
    document.getElementById('playerStats').classList.remove('hidden');
  }
});

// Modo supervivencia - manejo de respuestas
function handleSurvivalAnswer(selected) {
    const q = selectedQuestions[currentQuestion];
    const isCorrect = q.opciones[selected] === q.respuesta;
    const buttons = document.querySelectorAll('.answer-btn');
    
    // Deshabilitar todos los botones
    buttons.forEach(btn => btn.style.pointerEvents = 'none');
    
    // Mostrar respuesta correcta/incorrecta
    buttons[selected].classList.add(isCorrect ? 'correct-answer' : 'wrong-answer');
    
    if (!isCorrect) {
        const correctIndex = q.opciones.indexOf(q.respuesta);
        buttons[correctIndex].classList.add('correct-answer');
        
        // Perder una vida
        survivalLives--;
        updateSurvivalDisplay();
        
        // Mostrar popup de respuesta incorrecta
        showScorePopup(`-1 Vida 💔`, 'wrong');
        
        if (survivalLives <= 0) {
            setTimeout(() => {
                window.processingAnswer = false;
                endSurvivalMode();
            }, 2000);
            return;
        }
    } else {
        score++;
        consecutiveCorrect++;
        
        // Mostrar popup de respuesta correcta
        showScorePopup(`+1 Punto 🎯`, 'correct');
        
        // Verificar record de supervivencia
        if (score >= 10 && !playerData.badges.includes('survivor')) {
            setTimeout(() => awardBadge('survivor'), 1000);
        }
    }

    // Actualizar displays
    updateSurvivalDisplay();
    updateScoreDisplay();

    respuestas.push({
        pregunta: q.pregunta,
        seleccionada: q.opciones[selected],
        correcta: q.respuesta,
        esCorrecta: isCorrect,
    });

    setTimeout(() => {
        window.processingAnswer = false; // Reset the flag
        currentQuestion++;
        if (currentQuestion < selectedQuestions.length) {
            showQuestion();
        } else {
            // Recargar más preguntas si sobrevive
            selectedQuestions = [...preguntas].sort(() => 0.5 - Math.random());
            currentQuestion = 0;
            showQuestion();
        }
    }, 2000);
}

// Actualizar display del modo supervivencia
function updateSurvivalDisplay() {
    const livesContainer = document.querySelector('.flex.space-x-2');
    if (livesContainer) {
        livesContainer.innerHTML = Array.from({length: survivalLives}, () => 
            '<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">❤️</div>'
        ).join('') + 
        Array.from({length: 3 - survivalLives}, () => 
            '<div class="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold opacity-30">💔</div>'
        ).join('');
    }
    
    // Actualizar estadísticas
    const scoreElements = document.querySelectorAll('.text-2xl.font-bold');
    if (scoreElements[0]) scoreElements[0].textContent = score;
    if (scoreElements[1]) scoreElements[1].textContent = consecutiveCorrect;
    if (scoreElements[2]) scoreElements[2].textContent = survivalLives;
}

// Finalizar modo supervivencia
function endSurvivalMode() {
    playerData.survivalRecord = Math.max(playerData.survivalRecord || 0, score);
    playerData.totalScore += score * 2; // Bonus por supervivencia
    calculateLevel();
    savePlayerData();
    showSurvivalResults();
}

// Resultados del modo supervivencia
function showSurvivalResults() {
    const isNewRecord = score >= (playerData.survivalRecord || 0);
    
    document.body.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 p-4">
            <div class="max-w-2xl mx-auto">
                <div class="bg-black/20 backdrop-blur-xl rounded-3xl p-8 text-center mb-6 animate-bounce-in border border-orange-400/30">
                    <div class="text-8xl mb-4">${isNewRecord ? '🏆' : '💀'}</div>
                    <h2 class="text-4xl font-black mb-4 text-orange-400">
                        ${isNewRecord ? '¡NUEVO RÉCORD!' : 'GAME OVER'}
                    </h2>
                    <div class="text-6xl font-black mb-2 text-yellow-400">${score}</div>
                    <div class="text-xl mb-4 text-orange-200">Preguntas Correctas</div>
                    <div class="text-lg text-yellow-300 mb-6">
                        Récord Personal: ${playerData.survivalRecord || 0}
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-orange-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-orange-400">${score * 2}</div>
                            <div class="text-sm text-orange-200">Puntos Ganados</div>
                        </div>
                        <div class="bg-red-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-red-400">${playerData.level}</div>
                            <div class="text-sm text-red-200">Nivel Actual</div>
                        </div>
                    </div>
                </div>
                
                ${createShareButtons()}
                
                <div class="text-center space-y-4">
                    <button onclick="startSurvivalMode()" 
                            class="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 font-bold text-lg transform hover:scale-105 transition-all duration-200 shadow-2xl">
                        🔥 Intentar de Nuevo
                    </button>
                    <button onclick="location.reload()" 
                            class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold text-lg transform hover:scale-105 transition-all duration-200 shadow-2xl">
                        🏠 Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Agregar botón de modo supervivencia a la página principal
function addSurvivalModeButton() {
    const startForm = document.getElementById('startForm');
    if (startForm && !document.getElementById('survivalButton')) {
        const survivalButton = document.createElement('div');
        survivalButton.id = 'survivalButton';
        survivalButton.className = 'mt-6';
        survivalButton.innerHTML = `
            <div class="text-center mb-4">
                <div class="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    🔥 MODO EXTREMO
                </div>
            </div>
            <button onclick="startSurvivalMode()" 
                    class="group relative w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 shadow-2xl border border-red-400/30 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="relative z-10 flex items-center justify-between">
                    <div class="text-left">
                        <div class="text-2xl font-black text-white mb-1">⚡ MODO SUPERVIVENCIA</div>
                        <div class="text-red-200 text-sm">¿Cuánto puedes resistir?</div>
                    </div>
                    <div class="text-right">
                        <div class="bg-white/20 px-4 py-2 rounded-full text-sm font-bold">3 VIDAS</div>
                        <div class="text-yellow-400 text-xs mt-1">💀⚡💀</div>
                    </div>
                </div>
                <div class="absolute top-0 right-0 w-32 h-32 bg-red-400/10 rounded-full -translate-y-8 translate-x-8"></div>
            </button>
        `;
        startForm.appendChild(survivalButton);
    }
}

// Llamar esta función cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadPlayerData();
    
    // Mostrar stats del jugador si ya tiene historial
    if (playerData.completedQuiz > 0) {
        const playerStatsEl = document.getElementById('playerStats');
        if (playerStatsEl) playerStatsEl.classList.remove('hidden');
    }
    
    // Agregar botón de modo supervivencia
    setTimeout(addSurvivalModeButton, 100);
});

// Función para inicializar la página principal
function initMainPage() {
    loadPlayerData();
    if (playerData.completedQuiz > 0) {
        const playerStatsEl = document.getElementById('playerStats');
        if (playerStatsEl) playerStatsEl.classList.remove('hidden');
    }
    addSurvivalModeButton();
}

// Llamar cuando sea necesario reinicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMainPage);
} else {
    initMainPage();
}

// Modo velocidad (Speed Mode)
function startSpeedMode() {
    gameMode = 'speed';
    currentCategory = 'mixed';
    currentQuestion = 0;
    score = 0;
    respuestas = [];
    consecutiveCorrect = 0;
    
    // Mezclar todas las preguntas y tomar 5
    selectedQuestions = [...preguntas].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    showSpeedInterface();
    showSpeedQuestion();
}

// Interfaz del modo velocidad
function showSpeedInterface() {
    document.body.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 p-4">
            <div class="max-w-2xl mx-auto">
                <div class="bg-black/20 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-yellow-400/30">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-black text-yellow-400">⚡ MODO VELOCIDAD</h2>
                        <div id="speedTimer" class="text-3xl font-black text-red-400">10</div>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-4 text-center mb-4">
                        <div class="bg-yellow-500/20 rounded-lg p-3">
                            <div class="text-2xl font-bold text-yellow-400" id="speedScore">${score}</div>
                            <div class="text-xs text-yellow-200">PUNTOS</div>
                        </div>
                        <div class="bg-orange-500/20 rounded-lg p-3">
                            <div class="text-2xl font-bold text-orange-400">${currentQuestion + 1}/5</div>
                            <div class="text-xs text-orange-200">PREGUNTA</div>
                        </div>
                        <div class="bg-red-500/20 rounded-lg p-3">
                            <div class="text-2xl font-bold text-red-400" id="speedBonus">0</div>
                            <div class="text-xs text-red-200">BONUS</div>
                        </div>
                    </div>
                </div>
                
                <div id="questionContainer" class="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/20">
                    <!-- Las preguntas se cargan aquí -->
                </div>
            </div>
        </div>
    `;
}

// Mostrar pregunta en modo velocidad
function showSpeedQuestion() {
    const q = selectedQuestions[currentQuestion];
    const container = document.getElementById('questionContainer');
    let timeLeft = 10;
    
    container.innerHTML = `
        <div class="question-card text-center space-y-6">
            <div class="mb-6">
                <h3 class="text-2xl font-bold mb-2 text-white">Pregunta ${currentQuestion + 1}</h3>
                <p class="text-lg text-gray-200">${q.pregunta}</p>
            </div>
            
            <div class="space-y-3" id="answersContainer">
                ${q.opciones.map((opt, i) => `
                    <button onclick="answerSpeed(${i}, ${timeLeft})" 
                            class="answer-btn w-full p-4 text-left rounded-lg border-2 border-yellow-400/30 bg-yellow-400/10 hover:border-yellow-400 hover:bg-yellow-400/20 transition-all duration-200 transform hover:scale-105 text-white">
                        <span class="font-semibold">${String.fromCharCode(65 + i)})</span> ${opt}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    // Contador regresivo
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('speedTimer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            answerSpeed(-1, 0); // Tiempo agotado
        }
    }, 1000);
    
    // Guardar el timer para poder limpiarlo
    container.dataset.timer = timer;
}

// Responder en modo velocidad
function answerSpeed(selected, timeRemaining) {
    const timer = document.getElementById('questionContainer').dataset.timer;
    if (timer) clearInterval(timer);
    
    const q = selectedQuestions[currentQuestion];
    const isCorrect = selected >= 0 && q.opciones[selected] === q.respuesta;
    const buttons = document.querySelectorAll('.answer-btn');
    
    // Deshabilitar todos los botones
    buttons.forEach(btn => btn.style.pointerEvents = 'none');
    
    if (selected >= 0) {
        buttons[selected].classList.add(isCorrect ? 'correct-answer' : 'wrong-answer');
    }
    
    if (!isCorrect) {
        const correctIndex = q.opciones.indexOf(q.respuesta);
        if (correctIndex >= 0) buttons[correctIndex].classList.add('correct-answer');
    }

    respuestas.push({
        pregunta: q.pregunta,
        seleccionada: selected >= 0 ? q.opciones[selected] : 'Sin respuesta',
        correcta: q.respuesta,
        esCorrecta: isCorrect,
        timeUsed: 10 - timeRemaining
    });

    if (isCorrect) {
        score++;
        consecutiveCorrect++;
        
        // Bonus por velocidad
        const speedBonus = Math.max(0, timeRemaining);
        score += speedBonus;
        document.getElementById('speedBonus').textContent = speedBonus;
        
        showScorePopup(`+${1 + speedBonus} Puntos! ⚡`, 'correct');
        
        // Verificar logro de velocidad
        if (timeRemaining >= 7 && !playerData.badges.includes('speedDemon')) {
            setTimeout(() => awardBadge('speedDemon'), 1000);
        }
    } else {
        consecutiveCorrect = 0;
        showScorePopup(selected >= 0 ? '¡Incorrecto! 💪' : '¡Tiempo agotado! ⏰', 'incorrect');
    }

    // Actualizar displays
    document.getElementById('speedScore').textContent = score;

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < selectedQuestions.length) {
            showSpeedQuestion();
        } else {
            completeSpeedMode();
        }
    }, 2000);
}

// Completar modo velocidad
function completeSpeedMode() {
    playerData.totalScore += score * 4; // Bonus x4 por modo velocidad
    playerData.completedQuiz++;
    calculateLevel();
    savePlayerData();
    showSpeedResults();
}

// Resultados del modo velocidad
function showSpeedResults() {
    const avgTime = respuestas.reduce((acc, r) => acc + (r.timeUsed || 10), 0) / respuestas.length;
    
    document.body.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 p-4">
            <div class="max-w-2xl mx-auto">
                <div class="bg-black/20 backdrop-blur-xl rounded-3xl p-8 text-center mb-6 animate-bounce-in border border-yellow-400/30">
                    <div class="text-8xl mb-4">⚡</div>
                    <h2 class="text-4xl font-black mb-4 text-yellow-400">¡MODO VELOCIDAD COMPLETADO!</h2>
                    <div class="text-6xl font-black mb-2 text-orange-400">${score}</div>
                    <div class="text-xl mb-4 text-yellow-200">Puntos Totales</div>
                    <div class="text-lg text-orange-300 mb-6">
                        Tiempo promedio: ${avgTime.toFixed(1)}s por pregunta
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-yellow-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-yellow-400">${score * 4}</div>
                            <div class="text-sm text-yellow-200">Puntos Ganados</div>
                        </div>
                        <div class="bg-orange-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-orange-400">${playerData.level}</div>
                            <div class="text-sm text-orange-200">Nivel Actual</div>
                        </div>
                    </div>
                </div>
                
                ${createShareButtons()}
                
                <div class="text-center space-y-4">
                    <button onclick="startSpeedMode()" 
                            class="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-orange-500 font-bold text-lg transform hover:scale-105 transition-all duration-200 shadow-2xl">
                        ⚡ Intentar de Nuevo
                    </button>
                    <button onclick="location.reload()" 
                            class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold text-lg transform hover:scale-105 transition-all duration-200 shadow-2xl">
                        🏠 Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Modo mixto (Mixed Challenge)
function startMixedChallenge() {
    gameMode = 'mixed';
    currentCategory = 'mixed';
    currentQuestion = 0;
    score = 0;
    respuestas = [];
    consecutiveCorrect = 0;
    
    // Tomar 2 preguntas de cada categoría
    const canvaQuestions = preguntas.filter(p => p.categoria === 'canva').sort(() => 0.5 - Math.random()).slice(0, 2);
    const redesQuestions = preguntas.filter(p => p.categoria === 'redes').sort(() => 0.5 - Math.random()).slice(0, 2);
    const whatsappQuestions = preguntas.filter(p => p.categoria === 'whatsapp').sort(() => 0.5 - Math.random()).slice(0, 2);
    
    selectedQuestions = [...canvaQuestions, ...redesQuestions, ...whatsappQuestions].sort(() => 0.5 - Math.random());
    
    showMixedInterface();
    showQuestion();
}

// Interfaz del modo mixto
function showMixedInterface() {
    document.body.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900 p-4">
            <div class="max-w-2xl mx-auto">
                <div class="bg-black/20 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-purple-400/30">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-black text-purple-400">🌈 DESAFÍO MIXTO</h2>
                        <div class="text-sm text-purple-200">Todas las categorías</div>
                    </div>
                    
                    <!-- Barra de progreso -->
                    <div class="mb-4">
                        <div class="flex justify-between text-sm mb-1 text-purple-200">
                            <span>Progreso</span>
                            <span>${currentQuestion}/${selectedQuestions.length}</span>
                        </div>
                        <div class="w-full bg-purple-900/50 rounded-full h-2">
                            <div class="progress-bar bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full" 
                                 style="width: ${(currentQuestion/selectedQuestions.length)*100}%"></div>
                        </div>
                    </div>
                    
                    <!-- Puntuación actual -->
                    <div class="flex justify-between items-center text-sm">
                        <div class="bg-purple-100/20 px-3 py-1 rounded-full">
                            <span class="text-purple-300 font-semibold">💎 ${score} puntos</span>
                        </div>
                        <div class="bg-blue-100/20 px-3 py-1 rounded-full">
                            <span class="text-blue-300 font-semibold">🔥 ${consecutiveCorrect} racha</span>
                        </div>
                    </div>
                </div>
                
                <div id="questionContainer" class="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/20">
                    <!-- Las preguntas se cargan aquí -->
                </div>
            </div>
        </div>
    `;
}

// Completar modo mixto
function completeMixedMode() {
    playerData.totalScore += score * 3; // Bonus x3 por modo mixto
    playerData.completedQuiz++;
    calculateLevel();
    savePlayerData();
    showMixedResults();
}

// Resultados del modo mixto
function showMixedResults() {
    const categoryStats = {
        canva: respuestas.filter(r => preguntas.find(p => p.pregunta === r.pregunta)?.categoria === 'canva'),
        redes: respuestas.filter(r => preguntas.find(p => r.pregunta === r.pregunta)?.categoria === 'redes'),
        whatsapp: respuestas.filter(r => preguntas.find(p => r.pregunta === r.pregunta)?.categoria === 'whatsapp')
    };
    
    document.body.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900 p-4">
            <div class="max-w-2xl mx-auto">
                <div class="bg-black/20 backdrop-blur-xl rounded-3xl p-8 text-center mb-6 animate-bounce-in border border-purple-400/30">
                    <div class="text-8xl mb-4">🌈</div>
                    <h2 class="text-4xl font-black mb-4 text-purple-400">¡DESAFÍO MIXTO COMPLETADO!</h2>
                    <div class="text-6xl font-black mb-2 text-blue-400">${score}/6</div>
                    <div class="text-xl mb-4 text-purple-200">${Math.round((score/6)*100)}% de aciertos</div>
                    
                    <!-- Estadísticas por categoría -->
                    <div class="grid grid-cols-3 gap-4 mb-6">
                        <div class="bg-purple-500/20 rounded-lg p-4">
                            <div class="text-xl font-bold text-purple-400">${categoryStats.canva.filter(r => r.esCorrecta).length}/2</div>
                            <div class="text-sm text-purple-200">🎨 Canva</div>
                        </div>
                        <div class="bg-blue-500/20 rounded-lg p-4">
                            <div class="text-xl font-bold text-blue-400">${categoryStats.redes.filter(r => r.esCorrecta).length}/2</div>
                            <div class="text-sm text-blue-200">📱 Redes</div>
                        </div>
                        <div class="bg-teal-500/20 rounded-lg p-4">
                            <div class="text-xl font-bold text-teal-400">${categoryStats.whatsapp.filter(r => r.esCorrecta).length}/2</div>
                            <div class="text-sm text-teal-200">💬 WhatsApp</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-purple-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-purple-400">${score * 3}</div>
                            <div class="text-sm text-purple-200">Puntos Ganados</div>
                        </div>
                        <div class="bg-blue-500/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-blue-400">${playerData.level}</div>
                            <div class="text-sm text-blue-200">Nivel Actual</div>
                        </div>
                    </div>
                </div>
                
                ${createShareButtons()}
                
                <div class="text-center space-y-4">
                    <button onclick="startMixedChallenge()" 
                            class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-500 hover:to-blue-500 font-bold text-lg transform hover:scale-105 transition-all duration-200 shadow-2xl">
                        🌈 Intentar de Nuevo
                    </button>
                    <button onclick="location.reload()" 
                            class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold text-lg transform hover:scale-105 transition-all duration-200 shadow-2xl">
                        🏠 Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    `;
}
