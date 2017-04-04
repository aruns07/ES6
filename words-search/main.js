
/*Input 1
var matrixSize = "4,5";
var matrix = "A,P,P,L,E,N,-,E,D,T,T,-,T,E,E,T,O,A,Z,B";
var dictString = "APPLE,JAVA,COMPUTER,DESK,TEA,TOP,ANT,BEEP,TO,TEST";
*/

/* Input 2*/
var matrixSize = "12,8";
var matrix = "G,D,X,I,P,L,K,I,A,S,C,O,U,T,L,P,N,A,S,A,M,A,Z,N,E,A,H,L,N,M,L,R,U,N,I,A,A,C,K,T,B,S,M,N,Q,K,L,O,F,Y,L,S,I,O,N,C,T,P,A,D,J,T,V,U,C,R,I,O,C,G,A,L,K,E,O,W,T,N,E,L,N,T,I,N,S,A,G,U,Y,M,N,E,S,G,I,K";
var dictString = "NAINITAL,LANSDOWNE,SHIMLA,KULLU,MANALI,OOTY,SHILLONG,GANGTOK";

const matrixSizeArray = matrixSize.split(',');
const matrixRows = parseInt(matrixSizeArray[0], 10);
const matrixColumns = parseInt(matrixSizeArray[1], 10);
const matrixLogestDirection = matrixRows > matrixColumns ? matrixRows : matrixColumns;

// To optimize coparison with 16bits
const maxWordLength = matrixLogestDirection % 2 === 0 ? matrixLogestDirection : matrixLogestDirection + 1;
const maxWordLengthHalf = maxWordLength / 2;

const dictArray = dictString.split(',');
const numberOfWords = dictArray.length;

//Buffer Sizes
const foundBufferSize = 1;//byte
const wordLenthEvenBufferSize = 1;//byte
const foundRowIndexBufferSize = 2;//byte
const foundColIndexBufferSize = 2;//byte
const dictWordTrueLengthBufferSize = 2;//bytes
const dictOneWordBufferSize = (maxWordLength * 2) + (foundBufferSize + wordLenthEvenBufferSize + foundRowIndexBufferSize + foundColIndexBufferSize + dictWordTrueLengthBufferSize);

const wordLenthEvenBufferOffset = foundBufferSize;
const foundRowIndexBufferOffset = wordLenthEvenBufferOffset + wordLenthEvenBufferSize;
const foundColIndexBufferOffset = foundRowIndexBufferOffset + foundRowIndexBufferSize;
const dictWordTrueLengthBufferOffset = foundColIndexBufferOffset + foundColIndexBufferSize;
const dictOneWordBufferOffset = dictWordTrueLengthBufferOffset + dictWordTrueLengthBufferSize;
const dictReverseWordBufferOffset = dictOneWordBufferOffset + maxWordLength;

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
                                                                        wordBufferOffset + wordLenthEvenBufferOffset,
                                                                        wordLenthEvenBufferSize);
        
        dictArray[dictWordIndex].foundRowIndex = new Uint16Array(
                                                        dictBuffer, 
                                                        wordBufferOffset + foundRowIndexBufferOffset, 
                                                        foundRowIndexBufferSize / 2);
        
        dictArray[dictWordIndex].foundColIndex = new Uint16Array(
                                                        dictBuffer, 
                                                        wordBufferOffset + foundColIndexBufferOffset, 
                                                        foundColIndexBufferSize / 2);

        //start offset of Uint16Array should be a multiple of 2
        var trueLength = dictArray[dictWordIndex].trueLength = new Uint16Array(
                                                                        dictBuffer, 
                                                                        wordBufferOffset + dictWordTrueLengthBufferOffset, 
                                                                        dictWordTrueLengthBufferSize / 2);
        var word = dictArray[dictWordIndex].word = new Uint8Array(
                                                            dictBuffer, 
                                                            wordBufferOffset + dictOneWordBufferOffset, 
                                                            maxWordLength);

        var wordReverse = dictArray[dictWordIndex].wordReverse = new Uint8Array(
                                                                        dictBuffer, 
                                                                        wordBufferOffset + dictReverseWordBufferOffset, 
                                                                        maxWordLength);

        trueLength[0] = dictArray[dictWordIndex].length;
        evenLength[0] = trueLength[0] % 2 === 0 ? 1 : 0;

        var charIndex = 0
        for ( charIndex ; charIndex < trueLength[0]; charIndex++) {
            word[charIndex] = dictArray[dictWordIndex].charCodeAt(charIndex);
        }

        var reverseCharIndex = 0;
        for ( charIndex--; charIndex > -1; charIndex--, reverseCharIndex++) {
            wordReverse[reverseCharIndex] = word[charIndex];
        }
    }
}

const linearWordsCount = matrixRows + matrixColumns;
const diagnalWordsCount = ((matrixColumns * 2) - 2)  +  ((matrixRows - 2) * 2);
const matrixWordCount = linearWordsCount + diagnalWordsCount;
const DIRECTION_L_DOWN = 1;//Vertical down
const DIRECTION_L_RIGHT = 2;//Horizontal right
const DIRECTION_D_LEFT = 3;//DOWN LEFT
const DIRECTION_D_RIGHT = 4;//DOWN RIGHT

const matrixWordInvalidBufferSize = 1;//byte
const matrixWordDirectBufferSize = 1;//byte
const matrixWordLengthBufferSize = 2;//byte
const matrixOneWordBufferSize = maxWordLength + matrixWordInvalidBufferSize + matrixWordDirectBufferSize + matrixWordLengthBufferSize;
const matrixBuffer = new ArrayBuffer(matrixOneWordBufferSize * matrixWordCount);

const matrixWordDirectBufferOffset = matrixWordInvalidBufferSize;
const matrixWordLengthBufferOffset = matrixWordDirectBufferOffset + matrixWordDirectBufferSize;
const matrixOneWordBufferOffset = matrixWordLengthBufferOffset + matrixWordLengthBufferSize;

function createWordDown(rowIndex, columnIndex, matrixBufferOffset) {
        /*var inValid = new Uint8Array(
                                matrixBuffer, 
                                matrixBufferOffset, 
                                matrixWordInvalidBufferSize);
        */

        var wordDirection = new Uint8Array(
                                    matrixBuffer, 
                                    matrixBufferOffset + matrixWordDirectBufferOffset,
                                    matrixWordDirectBufferSize);
        wordDirection[0] = DIRECTION_L_DOWN;

        //start offset of Uint16Array should be a multiple of 2
        var wordLength = new Uint16Array(
                                matrixBuffer, 
                                matrixBufferOffset + matrixWordLengthBufferOffset,
                                matrixWordLengthBufferSize / 2);
        wordLength[0] = matrixRows;

        var word = new Uint8Array(
                            matrixBuffer, 
                            matrixBufferOffset + matrixOneWordBufferOffset,
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
                                matrixWordLengthBufferSize / 2);
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
                                matrixWordLengthBufferSize / 2);
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
                                matrixWordLengthBufferSize / 2);
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
    var lastColumnIndex = matrixColumns - 1;
    var lastRowIndex = matrixRows - 1;

    //First row first column (first cell)
    createWordDown(0, 0, matrixBufferOffset);
    matrixBufferOffset += matrixOneWordBufferSize;
    createWordRight(0, 0, matrixBufferOffset);
    matrixBufferOffset += matrixOneWordBufferSize;
    createWordDiagonalRight(0, 0, matrixBufferOffset);
    matrixBufferOffset += matrixOneWordBufferSize;

    //First row intermediate columns
    for(var colIndex=1; colIndex < lastColumnIndex; colIndex++) {
        createWordDown(0, colIndex, matrixBufferOffset);
        matrixBufferOffset += matrixOneWordBufferSize;
        createWordDiagonalLeft(0, colIndex, matrixBufferOffset);
        matrixBufferOffset += matrixOneWordBufferSize;
        createWordDiagonalRight(0, colIndex, matrixBufferOffset);
        matrixBufferOffset += matrixOneWordBufferSize;
    }

    //First row last column
    createWordDown(0, lastColumnIndex, matrixBufferOffset);
    matrixBufferOffset += matrixOneWordBufferSize;
    createWordDiagonalLeft(0, lastColumnIndex, matrixBufferOffset);
    matrixBufferOffset += matrixOneWordBufferSize;

    //Intermediate rows first column and last column
    for(var rowIndex = 1; rowIndex < lastRowIndex; rowIndex++) {
        createWordRight(rowIndex, 0, matrixBufferOffset);
        matrixBufferOffset += matrixOneWordBufferSize;
        createWordDiagonalRight(rowIndex, 0, matrixBufferOffset);
        matrixBufferOffset += matrixOneWordBufferSize;
        createWordDiagonalLeft(rowIndex, lastColumnIndex, matrixBufferOffset);
        matrixBufferOffset += matrixOneWordBufferSize;
    }

    //Last row first column
    createWordRight(lastRowIndex, 0, matrixBufferOffset);
    matrixBufferOffset += matrixOneWordBufferSize;

}


function storeFoundWordInfo(dictOffset, matrixOffset, foundIndex) {

}

function searchArrayIn(dictWord, matrixWord, dictLength, matrixLenght) {
    var dictCharIndex = 0;
    var matrixCharIndex = 0;
    var foundIndex = -1;

    for (matrixCharIndex; matrixCharIndex < matrixLenght; matrixCharIndex++) {
        while (dictCharIndex < dictLength ) {
            if (matrixWord[matrixCharIndex] !== dictWord[dictCharIndex]) {
                
                dictCharIndex = 0;
                
                if (foundIndex > -1) {
                    foundIndex = -1;
                    continue;    
                }

                break;
            }
            if (foundIndex === -1) {
                foundIndex = matrixCharIndex;
            }
            dictCharIndex++;
            break;

        }

        if (dictCharIndex === dictLength) {
            return foundIndex;
        }

    }
    return -1;
}

function searchWithByteOptim(dictBufferOffset, dictWordOffset,  matrixWordOffset) {
    var dictWord8 = [],
        dictWord16 = [],
        dictTrueLength = [],
        dictEventLength = [],
        matrixWord8 = [],
        matrixWord16 = [],
        foundIndex = -1;


    dictTrueLength = new Uint16Array(
                        dictBuffer, 
                        dictBufferOffset + dictWordTrueLengthBufferOffset, 
                        dictWordTrueLengthBufferSize / 2);

    dictEventLength = new Uint8Array(
                            dictBuffer, 
                            dictBufferOffset + wordLenthEvenBufferOffset,
                            wordLenthEvenBufferSize);

    dictWord8 = new Uint8Array(
                    dictBuffer, 
                    dictWordOffset, 
                    maxWordLength);
    matrixWord8 = new Uint8Array(
                        matrixBuffer, 
                        matrixWordOffset,
                        maxWordLength);

    dictWord16 = new Uint16Array(
                    dictBuffer, 
                    dictWordOffset, 
                    maxWordLength / 2);

    matrixWord16 = new Uint16Array(
                        matrixBuffer, 
                        matrixWordOffset,
                        maxWordLength / 2);

    if (dictEventLength[0]) {
        foundIndex = searchArrayIn(dictWord16, matrixWord16, dictTrueLength[0] / 2, maxWordLengthHalf);
        foundIndex *= 2;
    } else {
        dictWordLengthHalf = (dictTrueLength[0] - 1) / 2;
        foundIndex = searchArrayIn(dictWord16, matrixWord16, dictWordLengthHalf, maxWordLengthHalf);
        foundIndex *= 2;

        
        if (foundIndex > -1) {
            var lastCharIndex = dictTrueLength[0] - 1;
            if (dictWord8[lastCharIndex] !== matrixWord8[foundIndex + lastCharIndex]) {
                foundIndex = -1;
            }
        }
    }

    if (foundIndex < 0) {
        foundIndex = searchArrayIn(dictWord8, matrixWord8, dictTrueLength[0], maxWordLength);
    }
    return foundIndex;
}

function searchInMatrix() {
    var dictWord = [];
    var dictBufferOffset = 0;
    var dictTrueLength = [];
    var matrixWordInValid = [];
    var matrixWordStructOffSet = 0;
    var matrixWordLength = 0;
    var matrixWord = [];
    var foundIndex = -1;
    var wordLengthHalf = 0;

    var foundCount = 0;
    for (var dictIndex=0; 
            dictIndex < dictArray.length;// && dictArray[dictIndex].found === 0; 
            dictIndex++) {
        dictBufferOffset = dictOneWordBufferSize * dictIndex;

        dictTrueLength = new Uint16Array(
                                dictBuffer, 
                                dictBufferOffset + dictWordTrueLengthBufferOffset, 
                                dictWordTrueLengthBufferSize / 2);
        //dictWord = dictArray[dictIndex].word;
        for (var matrixIndex = 0; matrixIndex < matrixWordCount; matrixIndex++) {
            matrixWordStructOffSet = matrixOneWordBufferSize * matrixIndex;
            matrixWordInValid = new Uint8Array(
                                        matrixBuffer, 
                                        matrixWordStructOffSet, 
                                        matrixWordInvalidBufferSize);
            matrixWordLength = new Uint16Array(
                                        matrixBuffer, 
                                        matrixWordStructOffSet + matrixWordLengthBufferOffset,
                                        matrixWordLengthBufferSize / 2);

            if (matrixWordInValid[0] !== 1 && matrixWordLength[0] >= dictTrueLength[0]) {
                foundIndex = searchWithByteOptim(dictBufferOffset, dictBufferOffset + dictOneWordBufferOffset,  matrixWordStructOffSet + matrixOneWordBufferOffset);

                if (foundIndex === -1) {
                    foundIndex = searchWithByteOptim(dictBufferOffset, dictBufferOffset + dictReverseWordBufferOffset,  matrixWordStructOffSet + matrixOneWordBufferOffset);
                }
            }

            if (foundIndex > -1) {
                matrixWordLength[0] -= dictTrueLength[0];
                foundCount++;
                break;
            }
        }

    }
    console.log('Found', foundCount);
}

populateDictionayBuffer();
populateWordSpace();
searchInMatrix();
console.log('Code End');