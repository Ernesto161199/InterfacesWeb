document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-button");
    const startScreen = document.getElementById("start-screen");
    const gameScreen = document.getElementById("game-screen");
    const endScreen = document.getElementById("end-screen");
    const mouse = document.getElementById("mouse");
    const inputName = document.querySelector(".name");

    let gameStarted = false;
    let timerId;
    let timeout;
    let level;
    let name;

   /* const characterButtons = document.querySelectorAll(".name");
    characterButtons.forEach(button => {
        button.addEventListener("click", function () {
            selectCharacter(button.dataset.name);
        });
    });

    function selectCharacter(characterName) {
        name = characterName.trim(); // Obtener el nombre del personaje seleccionado
        inputName.value = name; // Rellenar el input de nombre con el nombre del personaje

        characterButtons.forEach(button => {
            button.disabled = true;
        });
    }*/

    // Event listeners para seleccionar nivel
    const levelButtons = document.querySelectorAll(".level-button");
    levelButtons.forEach(button => {
        button.addEventListener("click", function() {
            startGame(parseInt(button.dataset.level));
        });
    });

    // Función para iniciar el juego
    function startGame(selectedLevel) {
        // Ocultar pantalla inicial, mostrar pantalla de juego
        startScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        gameStarted = true;
        level = selectedLevel;

        timeout = setTimeout(endGame, level * 10000); // El juego dura 10 segundos por nivel

        // Mover al ratón con la velocidad adecuada según el nivel
        let mouseSpeed;
        switch (level) {
            case 1:
                mouseSpeed = 1000; // Nivel 1: 1 segundo
                break;
            case 2:
                mouseSpeed = 800; // Nivel 2: 0.8 segundos
                break;
            case 3:
                mouseSpeed = 500; // Nivel 3: 0.5 segundos
                break;
            default:
                mouseSpeed = 1000; // Por defecto, nivel 1
        }
        moveMouse(mouseSpeed).then(() => {
            console.log("Mouse stopped moving");
        });
    }

    // Función para mover al ratón con una promesa
    function moveMouse(speed) {
        return new Promise(resolve => {
            if (gameStarted) {
                const x = Math.random() * (window.innerWidth - 50);
                const y = Math.random() * (window.innerHeight - 50);
                mouse.style.left = `${x}px`;
                mouse.style.top = `${y}px`;

                // Mover el ratón con la velocidad especificada
                timerId = setTimeout(() => {
                    moveMouse(speed).then(resolve);
                }, speed);
            }
        });
    }

    // Event listener para atrapar al ratón
    mouse.addEventListener("click", catchMouse);

    // Función para atrapar al ratón
    function catchMouse() {
        clearTimeout(timerId);
        clearTimeout(timeout);
        endGame(true);
    }

    // Función para finalizar el juego
    function endGame(success = false) {
        gameStarted = false;
        clearTimeout(timerId);

        // Ocultar pantalla de juego, mostrar pantalla de fin de juego
        gameScreen.classList.add("hidden");
        endScreen.classList.remove("hidden");

        // Mostrar mensaje de fin de juego
        const endMessage = document.getElementById("end-message");
        if (success) {
            endMessage.innerText = `¡Felicidades! Has atrapado al ratón.`;
        } else {
            endMessage.innerText = "¡Se acabó el tiempo! No pudiste atrapar al ratón.";
        }

        // Mostrar botón para volver a jugar
        const restartButton = document.getElementById("restart-button");
        restartButton.addEventListener("click", restartGame);
    }

    // Función para reiniciar el juego
    function restartGame() {
        // Ocultar pantalla de fin de juego, mostrar pantalla inicial
        endScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");

        // Limpiar cualquier temporizador que pueda estar activo
        clearTimeout(timerId);
        clearTimeout(timeout);
    }
});
