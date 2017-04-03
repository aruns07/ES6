
var matrixSize = "4,5";
var matrix = "A,P,P,L,E,N,-,E,D,T,T,-,T,E,E,T,O,A,Z,B";
var dictString = "APPLE,JAVA,COMPUTER,DESK,TEA,TOP,ANT,BEEP,TO,TEST";

const matrixRows = parseInt(matrixSize[0], 10);
const matrixColumns = parseInt(matrixSize[2], 10);
const matrixLogestDirection = matrixRows > matrixColumns ? matrixRows : matrixColumns;

// To optimize coparison with 16bits
const maxWordLength = matrixLogestDirection % 2 === 0 ? matrixLogestDirection : matrixLogestDirection + 1;

const dictArray = dictString.split(',');
const numberOfWords = dictArray.length;

//Buffer Sizes
const foundBufferSize = 1;//byte
const wordLenthEvenBufferSize = 1;//byte
const dictWordTrueLengthBufferSize = 2;//bytes
const dictOneWordBufferSize = (maxWordLength * 2) + (foundBufferSize + wordLenthEvenBufferSize + dictWordTrueLengthBufferSize);

const dictBuffer = new ArrayBuffer(dictOneWordBufferSize * numberOfWords);

function populateDictionayBuffer() {
    for (var dictWordIndex = 0; dictWordIndex < numberOfWords; dictWordIndex++) {
        var wordBufferOffset = dictOneWordBufferSize * dictWordIndex;

        dictArray[dictWordIndex].found = new Uint8Array(
                                                dictBuffer, 
                                                wordBufferOffset, 
                                                foundBufferSize);
        var evenLength = dictArray[dictWordIndex].evenLength = new Uint8Array(
                                                                        dictBuffer, 
                                                                        wordBufferOffset + foundBufferSize,
                                                                        wordLenthEvenBufferSize);
        //start offset of Uint16Array should be a multiple of 2
        var trueLength = dictArray[dictWordIndex].trueLength = new Uint16Array(
                                                                        dictBuffer, 
                                                                        wordBufferOffset + foundBufferSize + wordLenthEvenBufferSize, 
                                                                        dictWordTrueLengthBufferSize);
        var word = dictArray[dictWordIndex].word = new Uint8Array(
                                                            dictBuffer, 
                                                            wordBufferOffset + foundBufferSize + wordLenthEvenBufferSize + dictWordTrueLengthBufferSize, 
                                                            maxWordLength);
        var wordReverse = dictArray[dictWordIndex].wordReverse = new Uint8Array(
                                                                        dictBuffer, 
                                                                        wordBufferOffset + foundBufferSize + wordLenthEvenBufferSize + dictWordTrueLengthBufferSize + maxWordLength, 
                                                                        maxWordLength);

        trueLength[0] = dictArray[dictWordIndex].length;

        var charIndex = 0
        for ( charIndex ; charIndex < trueLength[0]; charIndex++) {
            word[charIndex] = dictArray[dictWordIndex].charCodeAt(charIndex);
        }

        var reverseCharIndex = 0;
        for ( charIndex - 1; charIndex > -1; charIndex--, reverseCharIndex++) {
            wordReverse[reverseCharIndex] = word[charIndex];
        }
    }
}

const linearWordsCount = matrixRows + matrixColumns;
const diagnalWordsCount = ((matrixColumns * 2) - 2)  +  ((matrixRows - 2) * 2);
const DIRECTION_L_DOWN = 1;//Vertical down
const DIRECTION_L_RIGHT = 2;//Horizontal right
const DIRECTION_D_LEFT = 3;//DOWN LEFT
const DIRECTION_D_RIGHT = 4;//DOWN RIGHT

const matrixWordInvalidBufferSize = 1;//byte
const matrixWordDirectBufferSize = 1;//byte
const matrixWordLengthBufferSize = 2;//byte
const matrixOneWordBufferSize = maxWordLength + matrixWordInvalidBufferSize + matrixWordDirectBufferSize + matrixWordLengthBufferSize;
const matrixBuffer = new ArrayBuffer(matrixOneWordBufferSize * (linearWordsCount + diagnalWordsCount));



function createWordDown(rowIndex, columnIndex, matrixBufferOffset) {
        /*var inValid = new Uint8Array(
                                matrixBuffer, 
                                matrixBufferOffset, 
                                matrixWordInvalidBufferSize);
        */

        var wordDirection = new Uint8Array(
                                    matrixBuffer, 
                                    matrixBufferOffset + matrixWordInvalidBufferSize,
                                    matrixWordDirectBufferSize);
        wordDirection[0] = DIRECTION_L_DOWN;

        //start offset of Uint16Array should be a multiple of 2
        var wordLength = new Uint16Array(
                                matrixBuffer, 
                                matrixBufferOffset + matrixWordInvalidBufferSize + matrixWordDirectBufferSize,
                                matrixWordLengthBufferSize);
        wordLength[0] = matrixRows;

        var word = new Uint8Array(
                            matrixBuffer, 
                            matrixBufferOffset + matrixWordInvalidBufferSize + matrixWordDirectBufferSize + matrixWordLengthBufferSize,
                            maxWordLength);

        for (var charIndex = 0; charIndex < matrixRows; charIndex++) {
            word[charIndex] = matrix.charCodeAt(((charIndex * matrixColumns) + columnIndex) * 2);
        }  
}

function createWordRight(rowIndex, columnIndex, matrixBufferOffset) {

        var wordDirection = new Uint8Array(
                                    matrixBuffer, 
                                    matrixBufferOffset + matrixWordInvalidBufferSize,
                                    matrixWordDirectBufferSize);
        wordDirection[0] = DIRECTION_L_RIGHT;

        //start offset of Uint16Array should be a multiple of 2
        var wordLength = new Uint16Array(
                                matrixBuffer, 
                                matrixBufferOffset + matrixWordInvalidBufferSize + matrixWordDirectBufferSize,
                                matrixWordLengthBufferSize);
        wordLength[0] = matrixColumns;

        var word = new Uint8Array(
                            matrixBuffer, 
                            matrixBufferOffset + matrixWordInvalidBufferSize + matrixWordDirectBufferSize + matrixWordLengthBufferSize,
                            maxWordLength);

        for (var charIndex = 0; charIndex < matrixColumns; charIndex++) {
            word[charIndex] = matrix.charCodeAt(((rowIndex * matrixColumns) + charIndex) * 2);
        }  
}

function createWordDiagonalRight(rowIndex, columnIndex, matrixBufferOffset) {

        var wordDirection = new Uint8Array(
                                    matrixBuffer, 
                                    matrixBufferOffset + matrixWordInvalidBufferSize,
                                    matrixWordDirectBufferSize);
        wordDirection[0] = DIRECTION_D_RIGHT;

        //start offset of Uint16Array should be a multiple of 2
        var wordLength = new Uint16Array(
                                matrixBuffer, 
                                matrixBufferOffset + matrixWordInvalidBufferSize + matrixWordDirectBufferSize,
                                matrixWordLengthBufferSize);
        wordLength[0] = 0;//Will increment

        var word = new Uint8Array(
                            matrixBuffer, 
                            matrixBufferOffset + matrixWordInvalidBufferSize + matrixWordDirectBufferSize + matrixWordLengthBufferSize,
                            maxWordLength);

        for (var charIndex = 0, charRowIndex = rowIndex, charColumnIndex = columnIndex;
                charRowIndex < matrixRows && charColumnIndex < matrixColumns; 
                charIndex++, charRowIndex++, charColumnIndex++) {
            word[charIndex] = matrix.charCodeAt(((charRowIndex * matrixColumns) + charColumnIndex) * 2);
            wordLength[0]++;
        }  
}

function createWordDiagonalLeft(rowIndex, columnIndex, matrixBufferOffset) {

        var wordDirection = new Uint8Array(
                                    matrixBuffer, 
                                    matrixBufferOffset + matrixWordInvalidBufferSize,
                                    matrixWordDirectBufferSize);
        wordDirection[0] = DIRECTION_D_LEFT;

        //start offset of Uint16Array should be a multiple of 2
        var wordLength = new Uint16Array(
                                matrixBuffer, 
                                matrixBufferOffset + matrixWordInvalidBufferSize + matrixWordDirectBufferSize,
                                matrixWordLengthBufferSize);
        wordLength[0] = 0;//Will increment

        var word = new Uint8Array(
                            matrixBuffer, 
                            matrixBufferOffset + matrixWordInvalidBufferSize + matrixWordDirectBufferSize + matrixWordLengthBufferSize,
                            maxWordLength);

        for (var charIndex = 0, charRowIndex = rowIndex, charColumnIndex = columnIndex;
                charRowIndex < matrixRows && charColumnIndex > -1; 
                charIndex++, charRowIndex++, charColumnIndex--) {
            word[charIndex] = matrix.charCodeAt(((charRowIndex * matrixColumns) + charColumnIndex) * 2);
            wordLength[0]++;
        }  
}

function populateWordSpace() {
    var matrixBufferOffset = 0;
    for (var rowIndex = 0; rowIndex < matrixRows; rowIndex++) {
        for (var colIndex = 0; colIndex < matrixColumns; colIndex++) {
            if (rowIndex === 0) {
                createWordDown(rowIndex, colIndex, matrixBufferOffset);
                matrixBufferOffset += matrixOneWordBufferSize;
                if (colIndex === 0) {
                    
                    createWordRight(rowIndex, colIndex, matrixBufferOffset);
                    matrixBufferOffset += matrixOneWordBufferSize;

                    createWordDiagonalRight(rowIndex, colIndex, matrixBufferOffset);
                    matrixBufferOffset += matrixOneWordBufferSize;
                } else if (colIndex === matrixColumns - 1 ) {//Last Column
                    createWordDiagonalLeft(rowIndex, colIndex, matrixBufferOffset);
                    matrixBufferOffset += matrixOneWordBufferSize;
                } else {
                    
                    createWordDiagonalLeft(rowIndex, colIndex, matrixBufferOffset);
                    matrixBufferOffset += matrixOneWordBufferSize;

                    createWordDiagonalRight(rowIndex, colIndex, matrixBufferOffset);
                    matrixBufferOffset += matrixOneWordBufferSize;
                }
            } else if ( rowIndex === matrixRows - 1) {//Last Row
                createWordRight(rowIndex, colIndex, matrixBufferOffset);
                matrixBufferOffset += matrixOneWordBufferSize;
            } else { //Intermediate rows
                if (colIndex === 0) {
                    createWordRight(rowIndex, colIndex, matrixBufferOffset);
                    matrixBufferOffset += matrixOneWordBufferSize;
                    
                    createWordDiagonalRight(rowIndex, colIndex, matrixBufferOffset);
                    matrixBufferOffset += matrixOneWordBufferSize;

                } else if (colIndex === matrixColumns - 1 ) {//Last Column
                    createWordDiagonalLeft(rowIndex, colIndex, matrixBufferOffset);
                    matrixBufferOffset += matrixOneWordBufferSize;
                }
            }
        }
    }
}

populateDictionayBuffer();
populateWordSpace();