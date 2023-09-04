//Warten bis die Seite geladen wurde
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    
    //Definition der Spielerklassen
    var PLAYER_X_CLASS = 'x'
    var PLAYER_O_CLASS = 'circle'

    //Gewinn Kombinationen
    var WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    //Auslesen der HTML Element für eine spätere Steuerung
    var cellElements = document.querySelectorAll("[data-cell]")
    var boardElement = document.getElementById("board")
    var winningMessageElement = document.getElementById("winningMessage")
    var restartButton = document.getElementById("restartButton")
    var winningMessageTextElement = document.getElementById('winningMessageText')
    let isPlayer_O_Turn = false

    //Funktionsaufruf um das Spiel zu starten
    startGame()

    //Restart Logik für nach dem Spielende
    restartButton.addEventListener('click', startGame)

    //Funktion um das Spiel zu starten
    function startGame() {
        //Spieler X beginnt
        isPlayer_O_Turn = false

        //Durchlauf über alle Zellen (9) und entfernen alter Einträge
        cellElements.forEach(cell => {
            cell.classList.remove(PLAYER_X_CLASS)
            cell.classList.remove(PLAYER_O_CLASS)

            //Entfernen und Hinzufügen der Click-Listener 
            cell.removeEventListener('click', handleCellClick)
            cell.addEventListener('click', handleCellClick, { once: true })
        })
        setBoardHoverClass()
        //Die Gewinner Nachricht ausblenden
        winningMessageElement.classList.remove('show')
    }

    //Abhandeln eines Klicks pro Zelle
    function handleCellClick(e) {
        //Die genaue Zelle auslesen
        const cell = e.target
        //Erkennen welche Klasse genutzt werden soll
        const currentClass = isPlayer_O_Turn ? PLAYER_O_CLASS : PLAYER_X_CLASS
        //Setzen des O oder X in die entsprechende Zelle
        placeMark(cell, currentClass)
        //Logik für das Erkennen eines SpielEnde
        if (checkWin(currentClass)) {
            endGame(false)
        } else if (isDraw()) {
            endGame(true)
        } else {
            swapTurns()
            setBoardHoverClass()
        }
    }

    //Spielend Funktion welche überprüft wer gewonnen hat oder falls ein Untentschieden besteht
    function endGame(draw) {
        if (draw) {
            winningMessageTextElement.innerText = "Unentschieden"
        } else {
            winningMessageTextElement.innerText = `Spieler mit ${isPlayer_O_Turn ? "Os" : "Xs"} hat gewonnen`
        }
        winningMessageElement.classList.add("show");
    }
    //Erkennen eines Untentschieden
    function isDraw() {
        return [...cellElements].every(cell => {
            return cell.classList.contains(PLAYER_X_CLASS) || cell.classList.contains(PLAYER_O_CLASS)
        })
    }
    //Setzen von O oder X
    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass)
    }
    //Spieler Wechsel
    function swapTurns() {
        isPlayer_O_Turn = !isPlayer_O_Turn
    }

    //CSS Klassen setzten
    function setBoardHoverClass() {
        boardElement.classList.remove(PLAYER_X_CLASS)
        boardElement.classList.remove(PLAYER_O_CLASS)
        if (isPlayer_O_Turn) {
            boardElement.classList.add(PLAYER_O_CLASS)
        } else {
            boardElement.classList.add(PLAYER_X_CLASS)
        }
    }

    //Überprüfung ob jemand gewonnen hat
    function checkWin(currentClass) {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return cellElements[index].classList.contains(currentClass)
            })
        })
    }
});
