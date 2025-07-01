# 🧠 Explorador Digital - Trivia Gamificada

Una aplicación de trivia interactiva y gamificada diseñada para capacitar a emprendedores digitales en herramientas esenciales como Canva, redes sociales y WhatsApp Business.

![Versión](https://img.shields.io/badge/versión-2.0-blue.svg)
![Estado](https://img.shields.io/badge/estado-activo-brightgreen.svg)
![Licencia](https://img.shields.io/badge/licencia-MIT-green.svg)

## 🌟 Características Principales

### 🎮 Modos de Juego Múltiples
- **Modo Normal**: Quiz tradicional con 10 preguntas por categoría
- **Modo Supervivencia**: Juega hasta quedarte sin vidas (3 corazones)
- **Desafío Diario**: Retos especiales que cambian cada día
- **Modo Velocidad**: Responde rápido para obtener bonificaciones
- **Desafío Mixto**: Preguntas de todas las categorías

### 🏆 Sistema de Gamificación Completo
- **12 logros únicos** con emojis y descripciones
- **Sistema de niveles** basado en puntuación total
- **Rachas de respuestas** correctas consecutivas
- **Estadísticas persistentes** del jugador
- **Notificaciones animadas** de logros

### 🎨 Interfaz Moderna y Atractiva
- **Diseño gaming** con gradientes y efectos neon
- **Animaciones fluidas** en todas las interacciones
- **Efectos de partículas** y elementos visuales dinámicos
- **Responsive design** optimizado para móviles
- **Tema oscuro** con colores vibrantes

### 📊 Seguimiento de Progreso
- **Barra de progreso** visual en cada quiz
- **Contador de preguntas** en tiempo real
- **Display de puntuación** y racha actualizados
- **Historial de logros** desbloqueados
- **Nivel del jugador** y experiencia acumulada

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica moderna
- **CSS3**: Animaciones avanzadas y efectos visuales
- **Tailwind CSS**: Framework de utilidades para diseño rápido
- **JavaScript ES6+**: Lógica de juego y interactividad
- **LocalStorage**: Persistencia de datos del jugador
- **Responsive Design**: Compatible con todos los dispositivos

## 📂 Estructura del Proyecto

```
trivia-digital/
├── index.html              # Página principal
├── css/
│   └── style.css           # Estilos personalizados y animaciones
├── js/
│   ├── main.js            # Lógica principal del juego
│   ├── main-modular.js    # Versión modular (alternativa)
│   └── modules/           # Módulos organizados (opcional)
│       ├── gameConfig.js  # Configuración del juego
│       ├── gameManager.js # Gestión de estados
│       ├── playerManager.js # Gestión de jugadores
│       ├── questionManager.js # Gestión de preguntas
│       └── questions.js   # Base de datos de preguntas
├── debug.js               # Herramientas de debugging
└── README.md              # Este archivo
```

## 🚀 Instalación y Uso

### Opción 1: Uso Directo
1. Clona o descarga el repositorio
2. Abre `index.html` en tu navegador web
3. ¡Comienza a jugar!

### Opción 2: Servidor Local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server

# Luego visita http://localhost:8000
```

### Opción 3: Live Server (VS Code)
1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

## 🎯 Categorías de Preguntas

### 🎨 Canva
- Diseño gráfico básico
- Herramientas y funciones
- Mejores prácticas
- Tips profesionales

### 📱 Redes Sociales
- Estrategias de marketing
- Gestión de contenido
- Engagement y alcance
- Análisis y métricas

### 💬 WhatsApp Business
- Configuración profesional
- Automatización básica
- Atención al cliente
- Mejores prácticas comerciales

## 🏅 Sistema de Logros

| Logro | Emoji | Descripción | Condición |
|-------|-------|-------------|-----------|
| Primer Paso | 🎯 | Completaste tu primer quiz | Completar 1 quiz |
| Perfección | 💎 | Respuestas 100% correctas | Puntaje perfecto |
| Maestro Canva | 🎨 | Dominas Canva | 8+ puntos en categoría Canva |
| Gurú Social | 📱 | Experto en redes sociales | 8+ puntos en categoría Redes |
| WhatsApp Pro | 💬 | Profesional de WhatsApp | 8+ puntos en categoría WhatsApp |
| Racha x5 | 🔥 | 5 respuestas correctas seguidas | Racha de 5 |
| Explorador | 🗺️ | Completaste todas las categorías | Todas las categorías |
| Superviviente | ⚡ | Sobreviviste 10 preguntas seguidas | 10 preguntas en supervivencia |
| Guerrero Diario | ⚔️ | 7 días consecutivos de desafíos | 7 días seguidos |
| Influencer | 🌟 | Compartiste tus logros 5 veces | 5 shares |
| Maestro Nivel 10 | 👑 | Alcanzaste el nivel 10 | Nivel 10 |
| Demonio Veloz | ⚡ | Respondiste en menos de 5 segundos | Respuesta rápida |

## 🔧 Funcionalidades Técnicas

### Persistencia de Datos
- Los datos del jugador se guardan automáticamente en LocalStorage
- Estadísticas persistentes entre sesiones
- Historial de logros y progreso

### Gestión de Estados
- Sistema robusto de manejo de estados de juego
- Prevención de respuestas múltiples accidentales
- Transiciones fluidas entre pantallas

### Responsive Design
- Optimizado para móviles, tablets y escritorio
- Interfaz adaptable a diferentes tamaños de pantalla
- Touch-friendly en dispositivos móviles

## 🎨 Personalización

### Agregar Nuevas Preguntas
Edita el array `preguntas` en `js/main.js`:

```javascript
{
  categoria: "nueva-categoria",
  pregunta: "¿Tu pregunta aquí?",
  opciones: ["Opción A", "Opción B", "Opción C"],
  respuesta: "Respuesta correcta"
}
```

### Modificar Logros
Edita el objeto `badges` en `js/main.js`:

```javascript
nuevoLogro: { 
  name: "Nombre del Logro", 
  emoji: "🎉", 
  description: "Descripción del logro" 
}
```

### Personalizar Estilos
- Modifica `css/style.css` para cambiar colores y animaciones
- Utiliza las clases de Tailwind para ajustes rápidos
- Personaliza gradientes y efectos visuales

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

## 📝 Roadmap

### Versión 2.1 (Próximamente)
- [ ] Modo multijugador en tiempo real
- [ ] Integración con API externa de preguntas
- [ ] Sistema de rankings global
- [ ] Notificaciones push

### Versión 2.2
- [ ] Modo torneo
- [ ] Preguntas con imágenes
- [ ] Sistema de recompensas
- [ ] Integración con redes sociales

## 🐛 Reportar Bugs

Si encuentras algún problema, por favor [abre un issue](../../issues) con:
- Descripción detallada del bug
- Pasos para reproducirlo
- Navegador y versión utilizada
- Screenshots si es necesario

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**AK Creaciones**
- GitHub: [@DonGeeo87](https://github.com/DonGeeo87)
- Email: lanzatumarcadigital@gmail.com

## 🙏 Agradecimientos

- Tailwind CSS por el excelente framework de utilidades
- La comunidad de desarrolladores que inspira innovación
- Todos los testers que ayudaron a mejorar la experiencia

---

⭐ ¡Si te gusta este proyecto, dale una estrella en GitHub!

🚀 **¡Convierte el aprendizaje en una aventura gamificada!**
