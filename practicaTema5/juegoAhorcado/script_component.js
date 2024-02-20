// Definición de la clase HangmanGame que extiende de HTMLElement
class HangmanGame extends HTMLElement {
    constructor() {
        super();

        // Palabras para el juego
        this.words = ['javascript', 'html', 'css', 'python', 'java', 'ruby', 'php', 'swift', 'typescript', 'cplusplus'];

        // Palabra seleccionada para el juego actual
        this.selectedWord = '';
        // Conjunto de letras adivinadas por el jugador
        this.guessedLetters = new Set();
        // Número de partes mostradas
        this.hangmanParts = 0;

        // Creación del Shadow DOM para el encapsulamiento
        this.attachShadow({ mode: 'open' });
        // Renderizar el juego
        this.render();
    }

    // Método para renderizar el juego
    render() {
        // Estructura HTML del juego dentro del Shadow DOM
        this.shadowRoot.innerHTML = `
            <div id="game-container">
                <h1>Adivina el idioma de programacion</h1>
                <div id="word-display"></div>
                <div id="hangman-drawing"></div>
                <div id="letters"></div>
                <button id="restart-button">Reiniciar juego</button>
            </div>
        `;

        // Obtener referencias a elementos del DOM
        const wordDisplay = this.shadowRoot.getElementById('word-display');
        const hangmanDrawing = this.shadowRoot.getElementById('hangman-drawing');
        const lettersContainer = this.shadowRoot.getElementById('letters');
        const restartButton = this.shadowRoot.getElementById('restart-button');

        // Evento click del botón de reinicio del juego
        restartButton.addEventListener('click', () => this.startGame());

        // Iniciar el juego
        this.startGame();

        // Evento click en las letras disponibles
        lettersContainer.addEventListener('click', event => {
            const letterButton = event.target.closest('.letter');
            if (letterButton) {
                this.handleGuess(letterButton.textContent);
            }
        });
    }

    // Método para iniciar el juego
    startGame() {
        // Seleccionar una palabra aleatoria
        this.selectedWord = this.getRandomWord();
        // Limpiar letras adivinadas y partes del ahorcado
        this.guessedLetters.clear();
        this.hangmanParts = 0;

        // Obtener referencias a elementos del DOM
        const wordDisplay = this.shadowRoot.getElementById('word-display');
        const hangmanDrawing = this.shadowRoot.getElementById('hangman-drawing');
        const lettersContainer = this.shadowRoot.getElementById('letters');

        // Mostrar palabra oculta con guiones bajos
        wordDisplay.textContent = this.getMaskedWord();
        hangmanDrawing.textContent = '';
        lettersContainer.innerHTML = '';

        // Crear botones para cada letra del alfabeto
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        for (const letter of alphabet) {
            const letterButton = document.createElement('button');
            letterButton.textContent = letter;
            letterButton.classList.add('letter');
            lettersContainer.appendChild(letterButton);
        }
    }

    // Método para obtener una palabra aleatoria
    getRandomWord() {
        return this.words[Math.floor(Math.random() * this.words.length)];
    }

    // Método para obtener la palabra oculta con letras adivinadas
    getMaskedWord() {
        return this.selectedWord.split('').map(letter => this.guessedLetters.has(letter) ? letter : '_').join('');
    }

    // Método para manejar la adivinanza de una letra
    handleGuess(letter) {
        // Si la letra no ha sido adivinada antes
        if (!this.guessedLetters.has(letter)) {
            this.guessedLetters.add(letter);
            // Si la palabra no contiene la letra, aumentar partes del ahorcado
            if (!this.selectedWord.includes(letter)) {
                this.hangmanParts++;
            }
        }

        // Obtener referencias a elementos del DOM
        const wordDisplay = this.shadowRoot.getElementById('word-display');
        const hangmanDrawing = this.shadowRoot.getElementById('hangman-drawing');

        // Actualizar la pantalla de palabra oculta
        wordDisplay.textContent = this.getMaskedWord();

        // Mostrar partes del ahorcado
        if (this.hangmanParts < 6) {
            hangmanDrawing.textContent = 'X'.repeat(this.hangmanParts);
        } else {
            // Si se completan las partes del ahorcado, mostrar mensaje de pérdida
            hangmanDrawing.textContent = '¡Has perdido! La palabra era: ' + this.selectedWord;
            // Deshabilitar botones de letras
            this.disableLetterButtons();
        }

        // Si se adivina la palabra completa, mostrar mensaje de victoria
        if (!wordDisplay.textContent.includes('_')) {
            hangmanDrawing.textContent = '¡Felicidades! ¡Has adivinado la palabra!';
            // Deshabilitar botones de letras
            this.disableLetterButtons();
        }
    }

    // Método para deshabilitar los botones de letras
    disableLetterButtons() {
        const letterButtons = this.shadowRoot.querySelectorAll('.letter');
        letterButtons.forEach(button => button.disabled = true);
    }
}

// Definir el elemento personalizado 'hangman-game'
customElements.define('hangman-game', HangmanGame);
