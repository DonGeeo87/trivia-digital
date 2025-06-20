let currentQuestion = 0;
let score = 0;
let currentCategory = 'general';
let nombreJugador = '';
let respuestas = [];

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
      alert("Por favor ingresa tu nombre.");
      return;
    }
    localStorage.setItem("jugador", nombreJugador);
  } else {
    nombreJugador = localStorage.getItem("jugador") || "Explorador";
  }

  currentCategory = category;
  currentQuestion = 0;
  score = 0;
  respuestas = [];

  // Filtra por categoría y elige 3 preguntas aleatorias
  const preguntasFiltradas = preguntas.filter(
    (p) => p.categoria.toLowerCase() === currentCategory.toLowerCase()
  );
  selectedQuestions = preguntasFiltradas
    .sort(() => 0.5 - Math.random()) // Mezcla aleatoria
    .slice(0, 3); // Solo 3 preguntas

  document.body.innerHTML = "";
  showQuestion();
}

function showQuestion() {
  const q = selectedQuestions[currentQuestion];

  let html = `<div class='max-w-xl mx-auto text-center p-6 animate-fade-in'>
      <h2 class='text-xl font-semibold mb-4'>${q.pregunta}</h2>`;
  q.opciones.forEach((opt, i) => {
    html += `<button onclick="answer(${i})" class='bg-blue-500 text-white px-4 py-2 m-2 rounded hover:bg-blue-600'>${opt}</button><br>`;
  });
  html += `</div>`;
  document.body.innerHTML = html;
}

function answer(selected) {
  const q = selectedQuestions[currentQuestion];

  respuestas.push({
    pregunta: q.pregunta,
    seleccionada: q.opciones[selected],
    correcta: q.respuesta,
    esCorrecta: q.opciones[selected] === q.respuesta,
  });

  if (q.opciones[selected] === q.respuesta) {
    score++;
  }

  currentQuestion++;
  if (currentQuestion < selectedQuestions.length) {
    showQuestion();
  } else {
    showResult(selectedQuestions.length);
  }
}

function showResult(total) {
  let message = "";
  if (score <= 3) {
    message = "Estás comenzando tu camino digital. ¡Sigue aprendiendo!";
  } else if (score <= 7) {
    message = "Buen trabajo, tienes una base sólida. ¡Vamos por más!";
  } else {
    message = "¡Eres un Explorador Digital avanzado! 🔥";
  }

  let resumen = respuestas
    .map((r) => {
      const estado = r.esCorrecta ? "✅ Correcta" : "❌ Incorrecta";
      return `<li class="mb-2"><strong>${r.pregunta}</strong><br>Tu respuesta: ${r.seleccionada}<br>Correcta: ${r.correcta}<br>${estado}</li>`;
    })
    .join("");

  document.body.innerHTML = `
      <div class='text-center p-6 space-y-4 animate-fade-in'>
          <h2 class='text-2xl font-bold'>Resultado Final</h2>
          <p class='text-lg'>${nombreJugador}, obtuviste ${score} de ${total} respuestas correctas.</p>
          <p class='italic'>${message}</p>
          <ul class="text-left max-w-xl mx-auto mt-4">${resumen}</ul>
          <button onclick="location.reload()" class='bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-4'>Volver al inicio</button>
      </div>
  `;
}
