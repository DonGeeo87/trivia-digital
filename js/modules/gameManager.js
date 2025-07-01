// ===== LÓGICA PRINCIPAL DEL JUEGO =====
import { gameState, playerData, resetGameState, updateGameState } from './gameConfig.js';
import { savePlayerData, awardBadge, calculateLevel } from './playerManager.js';
import { showQuestion, updateProgressBar, updateScoreDisplay, showScorePopup } from './questionManager.js';

// Clase principal del juego
export class GameManager {
    constructor() {
        this.speedTimer = null;
        this.timeLeft = 0;
    }

    // Manejar respuesta
    answer(selected) {
        // Usar función específica para modo supervivencia
        if (gameState.gameMode === 'survival') {
            this.handleSurvivalAnswer(selected);
            return;
        }
        
        // Usar función específica para modo velocidad
        if (gameState.gameMode === 'speed') {
            this.handleSpeedAnswer(selected);
            return;
        }
        
        const q = gameState.selectedQuestions[gameState.currentQuestion];
        const isCorrect = q.opciones[selected] === q.respuesta;
        const buttons = document.querySelectorAll('.answer-btn');
        
        // Deshabilitar todos los botones
        buttons.forEach(btn => btn.style.pointerEvents = 'none');
        
        // Mostrar respuesta correcta/incorrecta
        buttons[selected].classList.add(isCorrect ? 'correct-answer' : 'wrong-answer');
        
        // Mostrar la respuesta correcta si la seleccionada es incorrecta
        if (!isCorrect) {
            const correctIndex = q.opciones.indexOf(q.respuesta);
            buttons[correctIndex].classList.add('correct-answer');
        }

        gameState.respuestas.push({
            pregunta: q.pregunta,
            seleccionada: q.opciones[selected],
            correcta: q.respuesta,
            esCorrecta: isCorrect,
        });

        if (isCorrect) {
            gameState.score++;
            gameState.consecutiveCorrect++;
            playerData.currentStreak = Math.max(playerData.currentStreak, gameState.consecutiveCorrect);
            showScorePopup('+1 Punto! 🎉', 'correct');
            
            // Verificar logros
            if (gameState.consecutiveCorrect >= 5 && !playerData.badges.includes('streakFive')) {
                setTimeout(() => awardBadge('streakFive'), 1000);
            }
        } else {
            gameState.consecutiveCorrect = 0;
            showScorePopup('¡Sigue intentando! 💪', 'incorrect');
        }

        // Actualizar displays
        updateProgressBar();
        updateScoreDisplay();

        setTimeout(() => {
            gameState.currentQuestion++;
            if (gameState.currentQuestion < gameState.selectedQuestions.length) {
                showQuestion();
            } else {
                this.completeQuiz();
            }
        }, 2000);
    }

    // Manejar respuesta en modo supervivencia
    handleSurvivalAnswer(selected) {
        const q = gameState.selectedQuestions[gameState.currentQuestion];
        const isCorrect = q.opciones[selected] === q.respuesta;
        const buttons = document.querySelectorAll('.answer-btn');
        
        // Deshabilitar todos los botones
        buttons.forEach(btn => btn.style.pointerEvents = 'none');
        
        // Mostrar respuesta correcta/incorrecta
        buttons[selected].classList.add(isCorrect ? 'correct-answer' : 'wrong-answer');
        
        if (!isCorrect) {
            const correctIndex = q.opciones.indexOf(q.respuesta);
            buttons[correctIndex].classList.add('correct-answer');
            
            gameState.survivalLives--;
            showScorePopup(`¡Incorrecto! Vidas restantes: ${gameState.survivalLives} 💔`, 'incorrect');
            
            if (gameState.survivalLives <= 0) {
                setTimeout(() => this.endSurvivalMode(), 2000);
                return;
            }
        } else {
            gameState.score++;
            let bonus = Math.floor(gameState.currentQuestion / 5);
            gameState.score += bonus;
            showScorePopup(`+${1 + bonus} Puntos! ⚡`, 'correct');
        }

        gameState.respuestas.push({
            pregunta: q.pregunta,
            seleccionada: q.opciones[selected],
            correcta: q.respuesta,
            esCorrecta: isCorrect,
        });

        setTimeout(() => {
            gameState.currentQuestion++;
            if (gameState.currentQuestion < gameState.selectedQuestions.length) {
                showQuestion();
            } else {
                this.endSurvivalMode();
            }
        }, 2000);
    }

    // Manejar respuesta en modo velocidad
    handleSpeedAnswer(selected) {
        if (this.speedTimer) {
            clearTimeout(this.speedTimer);
        }
        
        const q = gameState.selectedQuestions[gameState.currentQuestion];
        const isCorrect = q.opciones[selected] === q.respuesta;
        const buttons = document.querySelectorAll('.answer-btn');
        
        buttons.forEach(btn => btn.style.pointerEvents = 'none');
        buttons[selected].classList.add(isCorrect ? 'correct-answer' : 'wrong-answer');
        
        if (!isCorrect) {
            const correctIndex = q.opciones.indexOf(q.respuesta);
            buttons[correctIndex].classList.add('correct-answer');
        }

        gameState.respuestas.push({
            pregunta: q.pregunta,
            seleccionada: q.opciones[selected],
            correcta: q.respuesta,
            esCorrecta: isCorrect,
        });

        if (isCorrect) {
            gameState.score++;
            let speedBonus = Math.max(0, Math.floor(this.timeLeft / 3));
            gameState.score += speedBonus;
            showScorePopup(`+${1 + speedBonus} Puntos! ⚡`, 'correct');
            
            if (this.timeLeft >= 8) {
                if (!playerData.badges.includes('speedDemon')) {
                    setTimeout(() => awardBadge('speedDemon'), 1000);
                }
            }
        } else {
            showScorePopup('¡Incorrecto! 💪', 'incorrect');
        }

        setTimeout(() => {
            gameState.currentQuestion++;
            if (gameState.currentQuestion < gameState.selectedQuestions.length) {
                this.startSpeedQuestion();
            } else {
                this.completeQuiz();
            }
        }, 2000);
    }

    // Completar quiz
    completeQuiz() {
        // Actualizar estadísticas del jugador según el modo
        let multiplier = 1;
        switch(gameState.gameMode) {
            case 'daily':
                multiplier = 3;
                break;
            case 'mixed':
                multiplier = 2.5;
                break;
            case 'survival':
                multiplier = 2;
                break;
            case 'speed':
                multiplier = 1.5;
                break;
        }
        
        const finalScore = Math.floor(gameState.score * multiplier);
        playerData.totalScore += finalScore;
        playerData.completedQuiz++;
        
        if (gameState.consecutiveCorrect > playerData.maxStreak) {
            playerData.maxStreak = gameState.consecutiveCorrect;
        }
        
        // Verificar logros
        if (playerData.completedQuiz === 1) awardBadge('firstQuiz');
        if (gameState.score === gameState.selectedQuestions.length) awardBadge('perfectScore');
        if (gameState.currentCategory === 'canva' && gameState.score >= 8) awardBadge('canvaMaster');
        if (gameState.currentCategory === 'redes' && gameState.score >= 8) awardBadge('socialGuru');
        if (gameState.currentCategory === 'whatsapp' && gameState.score >= 8) awardBadge('whatsappPro');
        
        // Verificar si completó todas las categorías
        const completedCategories = ['canva', 'redes', 'whatsapp'].filter(cat => 
            localStorage.getItem(`completed_${cat}`) === 'true'
        );
        localStorage.setItem(`completed_${gameState.currentCategory}`, 'true');
        if (completedCategories.length === 2) awardBadge('explorer');
        
        calculateLevel();
        savePlayerData();
        this.showResults();
    }

    // Mostrar resultados
    showResults() {
        // Implementation for showing results
        // This would be moved from the main.js file
    }

    // Iniciar pregunta con cronómetro (modo velocidad)
    startSpeedQuestion() {
        this.timeLeft = 10;
        showQuestion();
        
        const updateTimer = () => {
            const timerEl = document.querySelector('.text-yellow-400.text-xl.font-bold');
            if (timerEl) {
                timerEl.textContent = `${this.timeLeft}s ⏰`;
            }
            
            if (this.timeLeft <= 0) {
                this.handleSpeedAnswer(-1); // Tiempo agotado
                return;
            }
            
            this.timeLeft--;
            this.speedTimer = setTimeout(updateTimer, 1000);
        };
        
        updateTimer();
    }

    // Terminar modo supervivencia
    endSurvivalMode() {
        if (gameState.currentQuestion > playerData.survivalRecord) {
            playerData.survivalRecord = gameState.currentQuestion;
            showScorePopup('¡Nuevo récord de supervivencia! 🏆', 'achievement');
        }
        
        if (gameState.currentQuestion >= 10) {
            awardBadge('survivor');
        }
        
        this.completeQuiz();
    }
}

// Crear instancia global del gestor de juego
window.gameManager = new GameManager();
