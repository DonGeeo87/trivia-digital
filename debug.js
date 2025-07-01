// Función simplificada para debugging
function showQuestionSimple() {
  console.log('showQuestionSimple called');
  const q = selectedQuestions[currentQuestion];
  const container = document.getElementById('questionContainer');
  
  if (!container) {
    console.error('Container not found');
    return;
  }
  
  if (!q) {
    console.error('No question found');
    return;
  }
  
  console.log('Rendering question:', q.pregunta);
  
  container.innerHTML = `
    <div class="p-8 text-white">
      <h3 class="text-2xl font-bold mb-6">Pregunta ${currentQuestion + 1}</h3>
      <p class="text-xl mb-8">${q.pregunta}</p>
      
      <div class="space-y-4">
        ${q.opciones.map((opt, i) => `
          <button onclick="handleAnswer(${i})" 
                  class="w-full p-4 text-left bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
            ${String.fromCharCode(65 + i)}) ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `;
  
  console.log('Question rendered successfully');
}

function handleAnswer(selected) {
  console.log('handleAnswer called with:', selected);
  answer(selected);
}
