var current = 0;

window.addEventListener("load", () => {
/*--------------------------Square Initialization for Input--------------------------*/    
    const ninetiles = document.getElementsByClassName("ninetile");

    let ninetile_counter = 0;
    let value_counter = 0;
    let current_Value = 0; 
    
    while(ninetile_counter < 9){
        let squaresInNinetile = ninetiles[ninetile_counter].getElementsByTagName("td");
        while(value_counter < 9){
            let currentTD = squaresInNinetile[value_counter];
            let square = currentTD.getElementsByTagName("input")[0];
            square.addEventListener("click", () => {
                current = Number(currentTD.getAttribute("id"));
            })
            value_counter++; 
        }
        value_counter = 0;
        ninetile_counter++;
    }
    

 /*-------------------listen for numpad button clicks-------------------*/   
    let numPad = document.getElementById("numpad");
    let numpadRows = numPad.getElementsByTagName("tr");
    let rowCounter = 0;
    let buttonCounter = 0;

 //initialize and implement the number buttons
    while(rowCounter < 3){
        let buttonRow = numpadRows[rowCounter].getElementsByTagName("button");
        while(buttonCounter < 3){
            let button = buttonRow[buttonCounter];
            button.addEventListener("click", () => {
              let square = document.getElementById(current).getElementsByTagName("input");
              square[0].value = button.innerHTML;
            });
            buttonCounter++;
        }
        buttonCounter = 0;
        rowCounter++;
    }
/*-----------------------Utility Button initialization-----------------------*/
    let submit = document.getElementById("input");
    submit.addEventListener("click", () => {
        console.log("Data being submitted");
        let sudoku = [82];
        
        if(initializeSudoku(sudoku) === true){

            return;

        }
        solve(sudoku);
    });

    let clear = document.getElementById("clear");
    clear.addEventListener("click", () => {
    console.log("clearing all inputted values");
    current = 0;
    let counter = 1;
    let squareValueId;
    let currentSquare;
    
    for(let counter = 1; counter <= 81; counter++){
        squareValueId = "square" + counter;
        currentSquare = document.getElementById(squareValueId);
        currentSquare.value = "";
    }
    });
});



function initializeSudoku(sudoku){
    let squareValueId;
    let currentSquare;
    let counter = 1;
    let contradiction = false;
    
    while(counter <= 81 && contradiction != true){
        squareValueId = "square" + counter;
        currentSquare = document.getElementById(squareValueId);
        if(currentSquare.value.length === 0){
            sudoku[counter] = 0;
        }
        else if(Number(currentSquare.value) === NaN){
            alert("Only integer numbers between 1 and 9 can be accepted as input!");
            contradiction = true;
        }
        else if(Number(currentSquare.value) > 9 || Number(currentSquare.value) < 1 || Number.isInteger(Number(currentSquare.value)) === false){

            alert("Given values cannot be less than 1 nor greater than 9 and must be integers!");
            contradiction = true;
        }
        else if(findContradiction(counter, sudoku, Number(currentSquare.value))){
            alert("Only one copy of a digit between 1 and 9 can be allowed in a given row, column, or ninetile!");
            contradiction = true;
        }
        else{
            sudoku[counter] = Number(currentSquare.value) + 10; 
        }
        counter++;
    }
    return contradiction;
}

function outputSudokuConsole(sudoku){
    for(let counter = 1; counter <= 81; counter++){
        console.log(convertConstantValue(sudoku[counter]));
    }   
}

//Algorithm and helper functions

//Returns the sudoku row the index belongs to
function getRow(index){
    return Math.ceil(index / 9);
}

//true = contradiction
//false = no contradiction found
//looks for a contradiction in the row of the index
function checkRowContradiction(index, sudoku, value){
    let row = getRow(index);
    let startingIndex = 1 + (9 * (row - 1));
    let counter = 1;
    
    while(counter <= 9){
        if(convertConstantValue(sudoku[startingIndex]) == value){
            return true;
        }
        startingIndex++;
        counter += 1;
    }
    return false;
}

//constant values are represented by double digit teen numbers
//converts constants to single digit
function convertConstantValue(value){
    if(value <= 9){
        return value;
    }
    return value - 10;
}

//finds the column that contains the index
function getColumn(index){
    if(index % 9 === 0){
        return 9;
    }
    
    let counter = 1;
    
    while((index + counter) % 9 != 0){
        counter++;
    }
    return 9 - counter;
}

//checks the column containing the index for any contradictions with the value
function checkColumnContradiction(index, sudoku, value){
    //every column starts with the # of column    
    let startingIndex = getColumn(index);
    //every column ends with its starting index + 72 because after 72 is the last row    
    let endingIndex = startingIndex + 72;
        
    while(startingIndex <= endingIndex){
        if(convertConstantValue(sudoku[startingIndex]) === value){
            return true;
        }
        startingIndex += 9;
    }
        return false; 
    }

//returns the starting column for a given column's ninetile
function getNinetileStartingColumn(column){
    if(column <= 3){
        return 1;
    }
    else if(column <= 6){
        return 4;
    }
    else{
        return 7;
    }
}

//returns the starting row of the ninetile
function getNinetileStartingRow(row){
    if(row <= 3){
        return 1;
    }
    else if(row <= 6){
        return 4;
    }
    else{
        return 7;
    }
}

//returns an array of numbers of all values in the ninetile
//array starts tradtionally from 0
function getNinetile(index, sudoku){
    let row = getRow(index);
    let column = getColumn(index);
    let startingRow = getNinetileStartingRow(row);
    let startingColumn = getNinetileStartingColumn(column);
    let startingIndex = startingColumn + (9 * (startingRow - 1));
    let ninetile = [9];
    
    for(let counter = 0; counter <= 2; counter++){
        ninetile[counter] = sudoku[startingIndex + counter];
    }
    
    startingIndex += 9;
    for(let counter = 3; counter <= 5; counter++){
        ninetile[counter] = sudoku[startingIndex + (counter - 3)];
    }
    
    startingIndex += 9;
    for(let counter = 6; counter <= 8; counter++){
        ninetile[counter] = sudoku[startingIndex + (counter - 6)];
    }
    return ninetile;
}

//looks for a contradiction given a value in the ninetile of an index
function checkNinetileContradiction(index, sudoku, value){
    let ninetile = Array.from(getNinetile(index, sudoku));
    let counter = 0;
    
    while(counter <= 8){
        if(convertConstantValue(ninetile[counter]) === value){
            return true;
        }
        counter++;
    }
    return false;
}

function findContradiction(index, sudoku, value){
    if(checkNinetileContradiction(index, sudoku, value)){
        return true;
    }
    else if(checkRowContradiction(index, sudoku, value)){
        return true;
    }
    else if(checkColumnContradiction(index, sudoku, value)){
        return true;
    }
    else{
        return false;
    }
}

//looks at a value at the index
//if the value is 9, resets value to 0 and returns false
//else returns true
function peekValue(index, sudoku){
    if(sudoku[index] > 9){
        return false;
    }
    else if(sudoku[index] === 9){
        sudoku[index] = 0;
        return false;
    }
    else{
        return true;
    }
}

//traverses an skewed tree array representation of a sudoku
//returns the next index that does not have a constant
//index = index to traverse from
function traverseDown(index, sudoku){
    do{
        ++index;
    }while(index <= 81 && sudoku[index] > 9);
    return index;
}

function backTrack(index, sudoku){
    do{
        index--;
    }while(sudoku[index] > 9 && index >= 1 && !peekValue(index, sudoku));
    return index;
}

function traversalDirector(index, sudoku, value){
    if(index > 81){
        return index;
    }
    
    while(value < 10){
        if(findContradiction(index, sudoku, value) === true){
            ++value;
        }
        else{
            sudoku[index] = value;
            break;
        }
    }

//this conditional makes sure the value at an index returned is not greater than 9
    if(value > 9){
        sudoku[index] = 0;
        return backTrack(index, sudoku);
    }
    else{
        return traverseDown(index, sudoku);
    }
}

function solve(sudoku){
    let startingIndex = traverseDown(0, sudoku);
    
    while(startingIndex <= 81){
        startingIndex = traversalDirector(startingIndex, sudoku, sudoku[startingIndex] + 1);
    }
    outputUI(sudoku);
}

function outputUI(sudoku){
    let currentSquare;
    let counter = 1;
    
    while(counter <= 81){
        currentSquare = document.getElementById("square" + counter);
        currentSquare.value = convertConstantValue(sudoku[counter]);
        counter++;
    }
}