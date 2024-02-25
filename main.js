const cells = document.querySelectorAll('.cell');
const startButton = document.querySelector('.start');
const names = document.querySelectorAll('input');
const gridCells = document.querySelectorAll('.cell p');

const gameBoard = (function () {
    let cleanBoard=[];
    //makes a new board
    const newBoard = () =>
    {
        cleanBoard=[[,,,],[,,,],[,,,]];
        return {cleanBoard};
    };
    const board=()=>cleanBoard;
    //marks the board
    const marked = (choice, mark) => board()[choice[0]][choice[1]] = mark;
    return {board, newBoard, marked};
})();

function Player(name, mark, turn, winner){
    return {name, mark, turn, winner};
};

function Game(name1,name2){
    let turnsPlayed=0;
    //create players
    const player1 = Player(name1,'O', true, false);
    const player2 = Player(name2,'X',false, false);
    //change turn
    const nextTurn = () => { 
        if(player1.turn){
            player1.turn = false;
            player2.turn = true;
        }
    else {
            player1.turn = true;
            player2.turn = false;
        }
    }
    
    const checkWinner = () => {
        
        let gameCondition = 'ongoing';
        //with the for loop I check if there is a winner in a row or in a column
        for (let i=0;i<3;i++){
            //js is gay and you cannot compare 3 things at the same time
            if (gameBoard.board()[i][0]===gameBoard.board()[i][1] && gameBoard.board()[i][1]===gameBoard.board()[i][2] && gameBoard.board()[i][0]!==undefined){
                gameCondition = 'finished';
                (player1.mark===gameBoard.board()[i][0]) ? player1.winner=true : player2.winner=true;
            }
            else if (gameBoard.board()[0][i]===gameBoard.board()[1][i] && gameBoard.board()[1][i]===gameBoard.board()[2][i] && gameBoard.board()[0][i]!==undefined){
                gameCondition = 'finished';
                (player1.mark===gameBoard.board()[0][i]) ? player1.winner=true : player2.winner=true;
            }
        };
        //with this if i check if there is a diagonal winner
        if ((gameBoard.board()[0][0]===gameBoard.board()[1][1] && gameBoard.board()[1][1]===gameBoard.board()[2][2] || gameBoard.board()[0][2]===gameBoard.board()[1][1] && gameBoard.board()[1][1]===gameBoard.board()[2][0]) && gameBoard.board()[1][1]!==undefined){
            gameCondition = 'finished';
            (player1.mark===gameBoard.board()[1][1]) ? player1.winner=true : player2.winner=true;
        }
        //this checks if the board is full
        if (turnsPlayed===9){
            gameCondition = 'finished';
        }
        return {gameCondition};
    };

    //play a round
    const playRound = (choice) => {
        //checks if there is already a mark in that cell
        if (gameBoard.board()[choice[0]][choice[1]]!==undefined){
            return;
        }
        //if its player1 turn, it first checks if the game is ongoing
        //and if it is, it marks the chosen cell with player1 mark,
        //it changes turn and updates the turnsplayed counter
        if (player1.turn){
            if(checkWinner().gameCondition === 'ongoing'){
                gameBoard.marked(choice,player1.mark);
                nextTurn();
                turnsPlayed++;
            }

        }
        //same but for player2
        else {
            if(checkWinner().gameCondition === 'ongoing'){
                gameBoard.marked(choice,player2.mark);
                nextTurn();
                turnsPlayed++;
            }
        }
    };
    return {player1, player2, playRound,checkWinner};
};


//add the event listener to all the cells
for (let cell of cells){
    cell.addEventListener('click',(e)=>{
        //if the button classname is restart, it means the user pressed start
        if (startButton.className==='restart'){
            //choice gets the data value of the cell which is the position of the cell
            //I don't need to make any objects, but it is more readable this way
            let choice = e.target.attributes[1].value;
            let choiceRow=parseInt(choice[0]);
            let choiceColumn=parseInt(choice[1]);
            //plays a round for the current player with the current choice
            gameStart.playRound([choiceRow,choiceColumn]);
            //changes the cell text with the mark that is saved in the board
            e.target.firstChild.textContent=gameBoard.board()[choiceRow][choiceColumn];
            //checks if the game condition is finished, and then checks who won
            if (gameStart.checkWinner().gameCondition==='finished'){
                if (gameStart.player1.winner===gameStart.player2.winner){
                    window.alert(`It's a tie!`);
                }
                else {
                    (gameStart.player1.winner) ? window.alert(`${gameStart.player1.name} wins!`):window.alert(`${gameStart.player2.name} wins!`);
                }
            };
        };
    });
};


startButton.addEventListener('click',()=>{
    //if the class name is restart, we enable input 
    //so that you can change the name, we set the class name as start
    //and lastly we clear the grid
    if(startButton.className==='restart'){
        names[0].disabled=false;
        names[1].disabled=false;
        startButton.setAttribute('class','start')
        startButton.textContent='Start';

        for (let gridCell of gridCells){
            gridCell.textContent=''
        }
    }
    //if the class name is start, we disable the input
    //we set the class name to restart and lastly we
    //create a new game and board
    else {
        names[0].disabled=true;
        names[1].disabled=true;
        startButton.setAttribute('class','restart');
        startButton.textContent='Restart';

        gameStart = Game(names[0].value,names[1].value);
        gameBoard.newBoard();
        
    }

});
