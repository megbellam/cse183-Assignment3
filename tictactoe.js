"use strict";

var Grid = Vue.component
var app = {};
app.config = {};

app.config.setup = function() {
    return {
        board: Vue.ref([["", "", ""], ["", "", ""], ["", "", ""]]),
        allMoves: ["11", "12","13","21","22","23","31","32","33"],
        doneMoves: [],
        remMoves: [],
        corners: ["11","31","13","33"],
        borders: ["12","21","23","32"],
        state: 0
    };
};

app.config.methods = {};

app.config.methods.play = function(cellRow, cellCol) {

    let cellID = "cell-" + cellRow + "-" + cellCol;
    let curCell = document.getElementById(cellID);
    //Only allow input into unused cells
    if (this.board[cellRow-1][cellCol-1] == ""){
        curCell.innerHTML = "X";
        this.board[cellRow-1][cellCol-1] = "X";
        this.doneMoves.push("" + cellRow + cellCol);
        //let resultField = document.getElementById("result1");
        //resultField.innerHTML = this.doneMoves;
        this.keepGoing(cellRow,cellCol);
    }
};

app.config.methods.reset = function() {
    let resultField = document.getElementById("result1");
    resultField.innerHTML = "";
    this.doneMoves = [];
    this.remMoves = [];
    this.state = 0;
    for (let i=0;i<3;i++){
        for (let j=0;j<3;j++){
            this.board[i][j] = "";
            let cellRow = i+1;
            let cellCol = j+1;
            let cellID = "cell-" + cellRow + "-" + cellCol;
            let curCell = document.getElementById(cellID);
            curCell.innerHTML = "&nbsp;";
            this.board[i][j] = "";
        }
    }
};

//Check if anyone has won the game
//If we pass it cellRow, cellCol and there is no value set for that already, it will set it to
//checkVal and tell us if anyone has one. checkVal can be X or O.
//It will reset the value to "" after it is done
app.config.methods.verifyIfWon = function(cellRow, cellCol, checkVal){
    //cellRowInt = parseInt(cellRow);
    //cellColInt = parseInt(cellCol);
    if (arguments.length > 1){
        if (this.board[cellRow-1][cellCol-1] == ""){
            this.board[cellRow-1][cellCol-1] = checkVal;
        }
    }

    let resultField = document.getElementById("result1");
    if ((this.board[0][0] != "") && (this.board[0][0] == this.board[0][1]) && (this.board[0][0] == this.board[0][2])){
        //resultField.innerHTML = "got here" + 1;
        return true;
    } else {
        if ((this.board[1][0] != "") && (this.board[1][0] == this.board[1][1]) && (this.board[1][0] == this.board[1][2])){
            //resultField.innerHTML = "got here" + 2 + "--"; + this.board;
            return true;
        } else {
            if ((this.board[2][1] != "") && (this.board[2][0] == this.board[2][1]) && (this.board[2][0] == this.board[2][2])){
                //resultField.innerHTML = "got here" + 3;
                return true;
            } else {
                if ((this.board[1][1] != "") && (this.board[0][0] == this.board[1][1]) && (this.board[1][1] == this.board[2][2])){
                    //resultField.innerHTML = "got here" + 4;
                    return true;
                } else {
                    if ((this.board[0][2] != "") && (this.board[0][2] == this.board[1][1]) && (this.board[1][1] == this.board[2][0])){
                        //resultField.innerHTML = "got here" + 5  + "----" + this.board;
                        return true;
                    } else {
                        if ((this.board[2][0] != "") && (this.board[0][0] == this.board[1][0]) && (this.board[1][0] == this.board[2][0])){
                            //resultField.innerHTML = "got here" + 6;
                            return true;
                        } else {
                            if ((this.board[0][1] != "") && (this.board[0][1] == this.board[1][1]) && (this.board[1][1] == this.board[2][1])){
                                //resultField.innerHTML = "got here" + 7;
                                return true;
                            } else {
                                if ((this.board[1][2] != "") && (this.board[0][2] == this.board[1][2]) && (this.board[1][2] == this.board[2][2])){
                                    //resultField.innerHTML = "got here" + 8;
                                    return true;
                                } else {
                                    //No winner yet
                                    //Check if it is a draw
                                    //if (this.board[2][2] != ""){
                                        //resultField.innerHTML = "No Winner Yet!";
                                        if (arguments.length > 1){
                                            this.board[cellRow-1][cellCol-1] = "";
                                        }

                                        //resultField.innerHTML = "got here" + 10 + "----" + this.board;;
                                        return false;
                                    //}
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (arguments.length > 1){
        this.board[cellRow-1][cellCol-1] = "";
    }

    //resultField.innerHTML = "got here" + 11;
    return false;
}

//The last user click was in cellRow, cellCol
app.config.methods.keepGoing = function(cellRow, cellCol){
    //let curCellx = document.getElementById("cell-" + cellRow + "-" + cellCol);
    //curCellx.innerHTML = "O";
    //Update our response in the board
    let lastMove = "" + cellRow + cellCol;
    
    if (this.state == 0){
        this.state = 1;
    } else {
        this.state = 2;
    }

    //STATE SWITCH
    switch (this.state) {
        case 1:
            //State 1
            if (this.corners.find(x=> x==lastMove)){
                //Corner played, play the center
                let curCell = document.getElementById("cell-2-2");
                curCell.innerHTML = "O";
                this.board[1][1] = "O";
                this.doneMoves.push("22");
            } else {
                if (lastMove == "22"){
                    //Center played, play top-left corner
                    let curCell = document.getElementById("cell-1-1");
                    curCell.innerHTML = "O";
                    this.board[0][0] = "O";
                    this.doneMoves.push("11");
                } else {
                    if (this.borders.find(x=> x==lastMove)){
                        //border played, play the center
                        let curCell = document.getElementById("cell-2-2");
                        curCell.innerHTML = "O";
                        this.board[1][1] = "O";
                        this.doneMoves.push("22");
                    }
                }
            }
            break;
        case 2:
            //If processed for a winning move, then set state to 6 and break out
            //What moves are remaining
            this.remMoves = this.allMoves.filter(x=> !this.doneMoves.find(y=> y== x));

            //Check if any of the remaining moves will help us win
            for (var x of this.remMoves){
                if (this.verifyIfWon(x.charAt(0),x.charAt(1),"O")){
                    //If after processing someone has won, then report it
                    //Let us make our WINNING MOVE and finish!
                    //----------x-x-x-x-x-x-x-x-
                    let curCell = document.getElementById("cell-" + x.charAt(0) + "-" + x.charAt(1));
                    curCell.innerHTML = "O";
                    let resultField = document.getElementById("result1");
                    resultField.innerHTML = "Game done!";
                    return;
                }
            }
            //We did not find a move that helps us win

            //let resultField = document.getElementById("result1");
            //resultField.innerHTML = "State=" + this.state + "." + remMoves;

            //Continue checking if there is a potential winning move by player that we need to stop
            //Check if any of the remaining moves will help us win
            var tstr = "";
            for (var x of this.remMoves){
                if (this.verifyIfWon(x.charAt(0),x.charAt(1),"X")){
                    tstr = tstr + "..." + x;
                    //If the player has a move that will help them win, STOP IT
                    let curCell = document.getElementById("cell-" + x.charAt(0) + "-" + x.charAt(1));
                    curCell.innerHTML = "O";
                    let m = parseInt(x.charAt(0));
                    m = m-1;
                    let n = parseInt(x.charAt(1));
                    n=n-1;
                    this.board[m][n] = "O";
                    this.doneMoves.push(x);
                    this.state = 3; //break out of the switch
                    break;
                } 
            }

            if (this.state != 3){
                // Check if the user has made a move that will affect us in the future
                if (this.remMoves.length > 0) {
                    var z = this.remMoves[0];
                    let curCellz = document.getElementById("cell-" + z.charAt(0) + "-" + z.charAt(1));
                    curCellz.innerHTML = "O";
                    let m = parseInt(z.charAt(0));
                    m = m-1;
                    let n = parseInt(z.charAt(1));
                    n=n-1;
                    this.board[m][n] = "O";
                    this.doneMoves.push(z);
                } else {
                    let resultField = document.getElementById("result1");
                    resultField.innerHTML = "The game is a DRAW!";
                    return;
                }
                break;
            }
        default:
            break;
    }

    //Check if anyone has won
    if (this.verifyIfWon()){
        //If after processing someone has won, then report it
        let resultField = document.getElementById("result1");
        resultField.innerHTML = "The game has a WINNER!";
    }
};

//create our app
app.vue = Vue.createApp(app.config).mount("#myapp");
