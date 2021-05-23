const board = [];
let colorFlag = false;
let winner = false;

function generateBoard() {
    //42 boxes
    var columnCounter = 0;
    var i;
    for (i = 0; i < 42; i++) { 
        var box = {
            column: columnCounter, //0-6
            piece: false,
            color: "",
            winnerSquare: false
        }

        board.push(box);

        columnCounter++
        if (columnCounter === 7){
            columnCounter = 0;
        }
    }
    generateBoardHTML();
}

function generateBoardHTML() {
    var boardRoot = document.getElementsByClassName("board-root")[0];
    boardRoot.innerHTML = "";

    board.forEach(box => {
        // <div class="board-piece-box">
        //     <div class="board-piece-red"></div>
        // </div>
        var boxObject = document.createElement("div");
        boxObject.className = "board-piece-box";
        if (box.winnerSquare){
            boxObject.classList.add("winnerSquare");
        }
        boxObject.onclick = function() { columnClicked(`${box.column}`); };
        if (box.piece){
            boxObject.innerHTML = `<div class="board-piece-${box.color}"></div>`;
        }
        boardRoot.appendChild(boxObject);
    });

    var fireworks = document.getElementsByClassName("pyro")[0];
    fireworks.style.display = "none";
}

function columnClicked(col) {
    var colNum = parseInt(col);
    var boxIndex = -1;
    board.forEach(box => {
        if (box.column === colNum && !box.piece){
            var index = board.indexOf(box);
            if (index > boxIndex){
                boxIndex = index;
            }
        }
    });
    if (boxIndex > -1 && !winner){
        board[boxIndex].piece = true;
        if (colorFlag){
            board[boxIndex].color = "yellow";
            colorFlag = false;
        }else{
            board[boxIndex].color = "red";
            colorFlag = true;
        }
        checkForWinner();
        generateBoardHTML();
    }
}

function checkForWinner() {
    var checkArray = [-8, -7, -6, -1, 1, 6, 7, 8];
    var redBoxes = [];
    var yellowBoxes = [];

    board.forEach(box => {
        if (box.piece){
            var index = board.indexOf(box);
            if (box.color === "red"){
                redBoxes.push(index);
            }else{
                yellowBoxes.push(index);
            }
        }
    });

    tallyPoints(redBoxes, checkArray);
    tallyPoints(yellowBoxes, checkArray);
}

function tallyPoints(boxIndexes, checkArray){
    boxIndexes.forEach(index => {
        checkArray.forEach(direction => {
            searchDirection(index, direction, 1, boxIndexes, []);
        });
    });
}

async function searchDirection(index, direction, temp, boxIndexes, searchIndexes){
    searchIndexes.push(index);
    // 8, 6, 1 Janky fix for issue with the match going out of bounds
    if (((direction === 8 || direction === -8) || (direction === 6 || direction === -6) || (direction === 1 || direction === -1)) && (index === 0 || index === 7 || index === 14 || index === 21 || index === 28 || index === 35 ||index === 6 || index === 13 || index === 20 || index === 27 || index === 34 || index === 41)){
        //pass
    }else{
        var search = index + direction;
        var p = temp;
        if (boxIndexes.includes(search)){
            p = p + 1;
            await searchDirection(search, direction, p, boxIndexes, searchIndexes);
            if (p === 4 && !winner){
                console.log(`Winner! Points: ${p} Direction: ${direction} Search Indexes: ${searchIndexes}`);
                winner = true;
                win(searchIndexes);
            }
        }
    }
}

function win(indexes){
    indexes.forEach(index => {
        board[index].winnerSquare = true;
    });
    generateBoardHTML();
    var fireworks = document.getElementsByClassName("pyro")[0];
    fireworks.style.display = "block";
}

function resetBoard(){
    console.log("Resetting Board");
    board.length = 0;
    colorFlag = false;
    winner = false;
    generateBoard();
}