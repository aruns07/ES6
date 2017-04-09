
console.log('starting execution');
var fs = require("fs");
var fileName = process.argv.length > 2 ? process.argv[2] : 'input1.txt';

(function(inputFileName) {

    console.time('performance');

    var data = fs.readFileSync(inputFileName);
    var input = data.toString().split('\n');
    var matrixSize = input[0];
    var matrix = input[1];
    var dictString = input[2];


    const matrixSizeArray = matrixSize.split(',');
    const matrixRows = parseInt(matrixSizeArray[0], 10);
    const matrixColumns = parseInt(matrixSizeArray[1], 10);
    const matrixLogestDirection = matrixRows > matrixColumns ? matrixRows : matrixColumns;

    // To optimize coparison with 16bits
    var lengthMod4 = matrixLogestDirection % 4;
    const maxWordLength = lengthMod4 === 0 ? matrixLogestDirection + 4 : matrixLogestDirection + (4-lengthMod4) + 4;
    const maxWordLengthHalf = maxWordLength / 2;

    const dictArray = dictString.split(',');
    const numberOfDictWords = dictArray.length;

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

    const dictBuffer = new ArrayBuffer(dictOneWordBufferSize * numberOfDictWords);

    function populateDictionayBuffer() {
        var wordBufferOffset = [];
        var evenLength = [];
        var foundRowIndex = [];
        var foundColIndex = [];
        var trueLength = [];
        var word = [];
        var wordReverse = [];
        var charIndex = 0;
        var reverseCharIndex = 0;
        for (var dictWordIndex = 0; dictWordIndex < numberOfDictWords; dictWordIndex++) {
            wordBufferOffset = dictOneWordBufferSize * dictWordIndex;

            /*var found = new Uint8Array(
                                dictBuffer, 
                                wordBufferOffset, 
                                foundBufferSize);
            */
            evenLength = new Uint8Array(
                                    dictBuffer, 
                                    wordBufferOffset + wordLenthEvenBufferOffset,
                                    wordLenthEvenBufferSize);
            
            foundRowIndex = new Uint16Array(
                                        dictBuffer, 
                                        wordBufferOffset + foundRowIndexBufferOffset, 
                                        foundRowIndexBufferSize / 2);
            foundRowIndex[0] = -1;
            
            foundColIndex = new Uint16Array(
                                        dictBuffer, 
                                        wordBufferOffset + foundColIndexBufferOffset, 
                                        foundColIndexBufferSize / 2);
            foundColIndex[0] = -1;

            //start offset of Uint16Array should be a multiple of 2
            trueLength = new Uint16Array(
                                        dictBuffer, 
                                        wordBufferOffset + dictWordTrueLengthBufferOffset, 
                                        dictWordTrueLengthBufferSize / 2);

            word = new Uint8Array(
                                dictBuffer, 
                                wordBufferOffset + dictOneWordBufferOffset, 
                                maxWordLength);

            wordReverse = new Uint8Array(
                                        dictBuffer, 
                                        wordBufferOffset + dictReverseWordBufferOffset, 
                                        maxWordLength);

            trueLength[0] = dictArray[dictWordIndex].length;
            //console.log('Adding true length', dictArray[dictWordIndex] , dictArray[dictWordIndex].length )
            evenLength[0] = trueLength[0] % 2 === 0 ? 1 : 0;

            charIndex = 0;
            for ( charIndex ; charIndex < trueLength[0]; charIndex++) {
                word[charIndex] = dictArray[dictWordIndex].charCodeAt(charIndex);
            }

            reverseCharIndex = 0;
            for ( charIndex--; charIndex > -1; charIndex--, reverseCharIndex++) {
                wordReverse[reverseCharIndex] = word[charIndex];
            }
        }
    }

    const linearWordsCount = matrixRows + matrixColumns;
    const diagnalWordsCount = ((matrixColumns * 2) - 2)  +  ((matrixRows - 2) * 2);
    let matrixWordCount = linearWordsCount + diagnalWordsCount;
    const DIRECTION_L_DOWN = 1;//Vertical down
    const DIRECTION_L_RIGHT = 2;//Horizontal right
    const DIRECTION_D_LEFT = 3;//DIAGONAL LEFT
    const DIRECTION_D_RIGHT = 4;//DIAGONAL RIGHT

    const matrixWordInvalidBufferSize = 1;//byte
    const matrixWordDirectBufferSize = 1;//byte
    const matrixWordLengthBufferSize = 2;//byte
    const matrixWordBaseRowIndexBufferSize = 2;//byte
    const matrixWordBaseColIndexBufferSize = 2;//byte
    const matrixOneStructBufferSize = (maxWordLength * 2) + matrixWordInvalidBufferSize + matrixWordDirectBufferSize + matrixWordLengthBufferSize;
    const matrixBuffer = new ArrayBuffer(matrixOneStructBufferSize * (matrixWordCount + numberOfDictWords + 2));

    const matrixWordDirectBufferOffset = matrixWordInvalidBufferSize;
    const matrixWordLengthBufferOffset = matrixWordDirectBufferOffset + matrixWordDirectBufferSize;
    const matrixWordBaseRowIndexBufferOffset = matrixWordLengthBufferOffset + matrixWordLengthBufferSize;
    const matrixWordBaseColIndexBufferOffset = matrixWordBaseRowIndexBufferOffset + matrixWordBaseRowIndexBufferSize;
    const matrixWordBufferOffset = matrixWordBaseColIndexBufferOffset + matrixWordBaseColIndexBufferSize;
    const matrixByteShiftWordBufferOffset = matrixWordBufferOffset + maxWordLength;

    var create_wordDirection = [];
    var create_wordRowIndex = [];
    var create_wordColIndex = [];
    var create_wordLength = [];
    var create_word = [];
    var create_wordByteShift = [];
    var create_charIndex = 0;
    var create_charRowIndex = 0;
    var create_charColumnIndex = 0;

    //Used by populateWordSpace to create a word going down direction
    function createWordDown(rowIndex, columnIndex, matrixBufferOffset) {
            /*var inValid = new Uint8Array(
                                    matrixBuffer, 
                                    matrixBufferOffset, 
                                    matrixWordInvalidBufferSize);
            */

            create_wordDirection = new Uint8Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordDirectBufferOffset,
                                        matrixWordDirectBufferSize);
            create_wordDirection[0] = DIRECTION_L_DOWN;

            create_wordRowIndex = new Uint16Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordBaseRowIndexBufferOffset,
                                        matrixWordBaseRowIndexBufferSize / 2);
            create_wordRowIndex[0] = rowIndex;

            create_wordColIndex = new Uint16Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordBaseColIndexBufferOffset,
                                        matrixWordBaseColIndexBufferSize / 2);
            create_wordColIndex[0] = columnIndex;

            //start offset of Uint16Array should be a multiple of 2
            create_wordLength = new Uint16Array(
                                    matrixBuffer, 
                                    matrixBufferOffset + matrixWordLengthBufferOffset,
                                    matrixWordLengthBufferSize / 2);
            create_wordLength[0] = matrixRows;

            create_word = new Uint8Array(
                                matrixBuffer, 
                                matrixBufferOffset + matrixWordBufferOffset,
                                maxWordLength);

            create_wordByteShift = new Uint8Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixByteShiftWordBufferOffset,
                                        maxWordLength);

            for (create_charIndex = 0; create_charIndex < matrixRows; create_charIndex++) {
                create_word[create_charIndex] = matrix.charCodeAt(((create_charIndex * matrixColumns) + columnIndex) * 2);
                create_wordByteShift[create_charIndex + 1] = create_word[create_charIndex];
            }  
    }

    //Used by populateWordSpace to create a word going right direction
    function createWordRight(rowIndex, columnIndex, matrixBufferOffset) {

            create_wordDirection = new Uint8Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordDirectBufferOffset,
                                        matrixWordDirectBufferSize);
            create_wordDirection[0] = DIRECTION_L_RIGHT;

            create_wordRowIndex = new Uint16Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordBaseRowIndexBufferOffset,
                                        matrixWordBaseRowIndexBufferSize / 2);
            create_wordRowIndex[0] = rowIndex;

            create_wordColIndex = new Uint16Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordBaseColIndexBufferOffset,
                                        matrixWordBaseColIndexBufferSize / 2);
            create_wordColIndex[0] = columnIndex;


            //start offset of Uint16Array should be a multiple of 2
            create_wordLength = new Uint16Array(
                                    matrixBuffer, 
                                    matrixBufferOffset + matrixWordLengthBufferOffset,
                                    matrixWordLengthBufferSize / 2);
            create_wordLength[0] = matrixColumns;

            create_word = new Uint8Array(
                                matrixBuffer, 
                                matrixBufferOffset + matrixWordBufferOffset,
                                maxWordLength);

            create_wordByteShift = new Uint8Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixByteShiftWordBufferOffset,
                                        maxWordLength);

            for (create_charIndex = 0; create_charIndex < matrixColumns; create_charIndex++) {
                create_word[create_charIndex] = matrix.charCodeAt(((rowIndex * matrixColumns) + create_charIndex) * 2);
                create_wordByteShift[create_charIndex + 1] = create_word[create_charIndex];
            }  
    }

    //Used by populateWordSpace to create a word going Diagonaly right down
    function createWordDiagonalRight(rowIndex, columnIndex, matrixBufferOffset) {

            create_wordDirection = new Uint8Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordDirectBufferOffset,
                                        matrixWordDirectBufferSize);
            create_wordDirection[0] = DIRECTION_D_RIGHT;

            create_wordRowIndex = new Uint16Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordBaseRowIndexBufferOffset,
                                        matrixWordBaseRowIndexBufferSize / 2);
            create_wordRowIndex[0] = rowIndex;

            create_wordColIndex = new Uint16Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordBaseColIndexBufferOffset,
                                        matrixWordBaseColIndexBufferSize / 2);
            create_wordColIndex[0] = columnIndex;

            //start offset of Uint16Array should be a multiple of 2
            create_wordLength = new Uint16Array(
                                    matrixBuffer, 
                                    matrixBufferOffset + matrixWordLengthBufferOffset,
                                    matrixWordLengthBufferSize / 2);
            create_wordLength[0] = 0;//Will increment

            create_word = new Uint8Array(
                                matrixBuffer, 
                                matrixBufferOffset + matrixWordBufferOffset,
                                maxWordLength);

            create_wordByteShift = new Uint8Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixByteShiftWordBufferOffset,
                                        maxWordLength);

            for (create_charIndex = 0, charRowIndex = rowIndex, create_charColumnIndex = columnIndex;
                    charRowIndex < matrixRows && create_charColumnIndex < matrixColumns; 
                    create_charIndex++, charRowIndex++, create_charColumnIndex++) {
                create_word[create_charIndex] = matrix.charCodeAt(((charRowIndex * matrixColumns) + create_charColumnIndex) * 2);
                create_wordByteShift[create_charIndex + 1] = create_word[create_charIndex];
                create_wordLength[0]++;
            }  
    }

    //Used by populateWordSpace to create a word going Diagonaly left down
    function createWordDiagonalLeft(rowIndex, columnIndex, matrixBufferOffset) {

            create_wordDirection = new Uint8Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordDirectBufferOffset,
                                        matrixWordDirectBufferSize);
            create_wordDirection[0] = DIRECTION_D_LEFT;

            create_wordRowIndex = new Uint16Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordBaseRowIndexBufferOffset,
                                        matrixWordBaseRowIndexBufferSize / 2);
            create_wordRowIndex[0] = rowIndex;

            create_wordColIndex = new Uint16Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordBaseColIndexBufferOffset,
                                        matrixWordBaseColIndexBufferSize / 2);
            create_wordColIndex[0] = columnIndex;

            //start offset of Uint16Array should be a multiple of 2
            create_wordLength = new Uint16Array(
                                    matrixBuffer, 
                                    matrixBufferOffset + matrixWordLengthBufferOffset,
                                    matrixWordLengthBufferSize / 2);
            create_wordLength[0] = 0;//Will increment

            create_word = new Uint8Array(
                                matrixBuffer, 
                                matrixBufferOffset + matrixWordBufferOffset,
                                maxWordLength);

            create_wordByteShift = new Uint8Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixByteShiftWordBufferOffset,
                                        maxWordLength);

            for (create_charIndex = 0, create_charRowIndex = rowIndex, create_charColumnIndex = columnIndex;
                    create_charRowIndex < matrixRows && create_charColumnIndex > -1; 
                    create_charIndex++, create_charRowIndex++, create_charColumnIndex--) {
                create_word[create_charIndex] = matrix.charCodeAt(((create_charRowIndex * matrixColumns) + create_charColumnIndex) * 2);
                create_wordByteShift[create_charIndex + 1] = create_word[create_charIndex];
                create_wordLength[0]++;
            }  
    }

    function populateWordSpace() {
        var matrixBufferOffset = 0;
        var lastColumnIndex = matrixColumns - 1;
        var lastRowIndex = matrixRows - 1;

        //First row first column (first cell)
        createWordDown(0, 0, matrixBufferOffset);
        matrixBufferOffset += matrixOneStructBufferSize;
        createWordRight(0, 0, matrixBufferOffset);
        matrixBufferOffset += matrixOneStructBufferSize;
        createWordDiagonalRight(0, 0, matrixBufferOffset);
        matrixBufferOffset += matrixOneStructBufferSize;

        //First row intermediate columns
        for(var colIndex=1; colIndex < lastColumnIndex; colIndex++) {
            createWordDown(0, colIndex, matrixBufferOffset);
            matrixBufferOffset += matrixOneStructBufferSize;
            createWordDiagonalLeft(0, colIndex, matrixBufferOffset);
            matrixBufferOffset += matrixOneStructBufferSize;
            createWordDiagonalRight(0, colIndex, matrixBufferOffset);
            matrixBufferOffset += matrixOneStructBufferSize;
        }

        //First row last column
        createWordDown(0, lastColumnIndex, matrixBufferOffset);
        matrixBufferOffset += matrixOneStructBufferSize;
        createWordDiagonalLeft(0, lastColumnIndex, matrixBufferOffset);
        matrixBufferOffset += matrixOneStructBufferSize;

        //Intermediate rows first column and last column
        for(var rowIndex = 1; rowIndex < lastRowIndex; rowIndex++) {
            createWordRight(rowIndex, 0, matrixBufferOffset);
            matrixBufferOffset += matrixOneStructBufferSize;
            createWordDiagonalRight(rowIndex, 0, matrixBufferOffset);
            matrixBufferOffset += matrixOneStructBufferSize;
            createWordDiagonalLeft(rowIndex, lastColumnIndex, matrixBufferOffset);
            matrixBufferOffset += matrixOneStructBufferSize;
        }

        //Last row first column
        createWordRight(lastRowIndex, 0, matrixBufferOffset);
        matrixBufferOffset += matrixOneStructBufferSize;

    }

    var split_srcWordDirection = [];
    var split_srcWordRowIndex = [];
    var split_srcWordColIndex = [];
    var split_srcWordLength = [];
    var split_srcWord = [];
    var split_srcWordByteShift = [];
    var split_newWordOffset = [];
    var split_desWordDirection = [];
    var split_desWordRowIndex = [];
    var split_desWordColIndex = [];
    var split_desWordLength = [];
    var split_desWord = [];
    var split_desWordByteShift = [];
    var split_srcCharIndex = [];

    //When a dictionay word is found in a word, split the matrix word in two
    //store second word at last
    function splitMatrixWord(matrixBufferOffset, foundIndex, dictLength) {
            /*var inValid = new Uint8Array(
                                    matrixBuffer, 
                                    matrixBufferOffset, 
                                    matrixWordInvalidBufferSize);
            */

            split_srcWordDirection = new Uint8Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordDirectBufferOffset,
                                        matrixWordDirectBufferSize);

            split_srcWordRowIndex = new Uint16Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordBaseRowIndexBufferOffset,
                                        matrixWordBaseRowIndexBufferSize / 2);

            split_srcWordColIndex = new Uint16Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixWordBaseColIndexBufferOffset,
                                        matrixWordBaseColIndexBufferSize / 2);       

            //start offset of Uint16Array should be a multiple of 2
            split_srcWordLength = new Uint16Array(
                                    matrixBuffer, 
                                    matrixBufferOffset + matrixWordLengthBufferOffset,
                                    matrixWordLengthBufferSize / 2);

            split_srcWord = new Uint8Array(
                                matrixBuffer, 
                                matrixBufferOffset + matrixWordBufferOffset,
                                maxWordLength);

            split_srcWordByteShift = new Uint8Array(
                                        matrixBuffer, 
                                        matrixBufferOffset + matrixByteShiftWordBufferOffset,
                                        maxWordLength);

            split_newWordOffset = matrixOneStructBufferSize * matrixWordCount;
            matrixWordCount++;

            split_desWordDirection = new Uint8Array(
                                        matrixBuffer, 
                                        split_newWordOffset + matrixWordDirectBufferOffset,
                                        matrixWordDirectBufferSize);
            split_desWordDirection[0] = split_srcWordDirection[0];


            split_desWordRowIndex = new Uint16Array(
                                        matrixBuffer, 
                                        split_newWordOffset + matrixWordBaseRowIndexBufferOffset,
                                        matrixWordBaseRowIndexBufferSize / 2);

            split_desWordColIndex = new Uint16Array(
                                        matrixBuffer, 
                                        split_newWordOffset + matrixWordBaseColIndexBufferOffset,
                                        matrixWordBaseColIndexBufferSize / 2);

            if (split_srcWordDirection[0] === 1) {
                split_desWordRowIndex[0] = split_srcWordRowIndex[0] + foundIndex + dictLength;
                split_desWordColIndex[0] = split_srcWordColIndex[0];
            } else if (split_srcWordDirection[0] === 2) {
                split_desWordRowIndex[0] = split_srcWordRowIndex[0];
                split_desWordColIndex[0] = split_srcWordColIndex[0] + foundIndex + dictLength;
            } else if (split_srcWordDirection[0] === 3) {
                split_desWordRowIndex[0] = split_srcWordRowIndex[0] + foundIndex + dictLength;
                split_desWordColIndex[0] = split_srcWordColIndex[0] - foundIndex - dictLength;
            } else if (split_srcWordDirection[0] === 4) {
                split_desWordRowIndex[0] = split_srcWordRowIndex[0] + foundIndex + dictLength;
                split_desWordColIndex[0] = split_srcWordColIndex[0] + foundIndex + dictLength;
            }
            //start offset of Uint16Array should be a multiple of 2
            split_desWordLength = new Uint16Array(
                                    matrixBuffer, 
                                    split_newWordOffset + matrixWordLengthBufferOffset,
                                    matrixWordLengthBufferSize / 2);

            split_desWord = new Uint8Array(
                                matrixBuffer, 
                                split_newWordOffset + matrixWordBufferOffset,
                                maxWordLength);

            split_desWordByteShift = new Uint8Array(
                                        matrixBuffer, 
                                        split_newWordOffset + matrixByteShiftWordBufferOffset,
                                        maxWordLength);
            for (split_srcCharIndex = foundIndex, desCharIndex = 0;
                    split_srcCharIndex < split_srcWordLength;
                    split_srcCharIndex++, desCharIndex++) {
                split_desWord[desCharIndex] = split_srcWord[split_srcCharIndex];
                split_desWordByteShift[desCharIndex + 1] = split_srcWord[split_srcCharIndex];
            } 

            split_desWordLength[0] = split_srcWordLength[0] - foundIndex;
            split_srcWordLength[0] = foundIndex + dictLength;

            //split_srcWord[split_srcWordLength[0] - 1] = 0;//Erase 16bits in source end
            //split_srcWord[split_srcWordLength[0]] = 0;//Erase 16bits in source end

            //split_srcWordByteShift[split_srcWordLength[0]] = 0;
            //split_srcWordByteShift[split_srcWordLength[0] + 1] = 0;
    }

    //A basic algo to search an array in another array
    function searchArrayIn(dictWord, matrixWord, dictLength, matrixLenght) {
        var dictCharIndex = 0;
        var matrixCharIndex = 0;
        var foundIndex = -1;

        for (matrixCharIndex; matrixCharIndex < matrixLenght; matrixCharIndex++) {
            while (dictCharIndex < dictLength ) {
                if (matrixWord[matrixCharIndex] !== dictWord[dictCharIndex]) {
                    //keep dictionay word index at start
                    dictCharIndex = 0;
                    
                    if (foundIndex > -1) {
                        //Previous found is not valid
                        //start new search in matrix word next to the previous found
                        matrixCharIndex = foundIndex + 1;
                        foundIndex = -1;
                        continue;    
                    }

                    break;
                }
                
                //When while loop hasn't break
                //means characters matched.
                //Store the first position
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

    //Search by combining bytes into bigger memory size
    function searchWithByteOptim(dictBufferOffset, dictWordOffset,  matrixWordOffset, matrixWordByteShiftOffset) {
        var dictWord8 = [],
            dictWord16 = [],
            dictWord32 = [],
            dictTrueLength = [],
            dictEvenLength = [],
            matrixWord8 = [],
            matrixWord16 = [],
            matrixWordByteShift16 = [],
            matrixWord32 = [],
            matrixWordByteShift32 = [],
            foundIndex = -1;

        dictTrueLength = new Uint16Array(
                            dictBuffer, 
                            dictBufferOffset + dictWordTrueLengthBufferOffset, 
                            dictWordTrueLengthBufferSize / 2);

        dictEvenLength = new Uint8Array(
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


        matrixWordByteShift16 = new Uint16Array(
                                        matrixBuffer, 
                                        matrixWordByteShiftOffset,
                                        maxWordLength / 2);


        if (dictTrueLength[0] % 4 === 0) {
            
            dictWord32 = new Uint32Array(
                            dictBuffer, 
                            dictWordOffset, 
                            maxWordLength / 4);

            matrixWord32 = new Uint32Array(
                                matrixBuffer, 
                                matrixWordOffset,
                                maxWordLength / 4);


            matrixWordByteShift32 = new Uint32Array(
                                            matrixBuffer, 
                                            matrixWordByteShiftOffset,
                                            maxWordLength / 4);        
            foundIndex = searchArrayIn(dictWord32, matrixWord32, dictTrueLength[0] / 4, maxWordLengthHalf / 2);
            foundIndex *= 4;

            if (foundIndex < 0) {
                foundIndex = searchArrayIn(dictWord32, matrixWordByteShift32, dictTrueLength[0] / 4, maxWordLengthHalf / 2);
                foundIndex = (foundIndex * 4) - 1;//Because word is right shifted by one index
            }
        }

        if ( foundIndex < 0) {
            if (dictEvenLength[0]) {
                foundIndex = searchArrayIn(dictWord16, matrixWord16, dictTrueLength[0] / 2, maxWordLengthHalf);
                foundIndex *= 2;

                if (foundIndex < 0) {
                    foundIndex = searchArrayIn(dictWord16, matrixWordByteShift16, dictTrueLength[0] / 2, maxWordLengthHalf);
                    foundIndex = (foundIndex * 2) - 1;//Because word is right shifted by one index
                }
                
            } else {
                dictWordLengthHalf = (dictTrueLength[0] - 1) / 2;
                foundIndex = searchArrayIn(dictWord16, matrixWord16, dictWordLengthHalf, maxWordLengthHalf);
                foundIndex *= 2;
                if (foundIndex < 0) {
                    foundIndex = searchArrayIn(dictWord16, matrixWordByteShift16, dictWordLengthHalf, maxWordLengthHalf);
                    foundIndex = (foundIndex * 2) - 1;//Because word is right shifted by one index
                }

                if (foundIndex > -1) {
                    var lastCharIndex = dictTrueLength[0] - 1;
                    if (dictWord8[lastCharIndex] !== matrixWord8[foundIndex + lastCharIndex]) {
                        foundIndex = -1;
                    }
                }
            }
        }


        return foundIndex;
    }

    function searchInMatrix() {
        var dictWord = [];
        var dictBufferOffset = 0;
        var dictTrueLength = [];
        var dictFoundFlag = [];
        var dictFoundRowIndex = [];
        var dictFoundColIndex = [];
        var matrixWordInValid = [];
        var matrixWordStructOffSet = 0;
        var matrixWordLength = 0;
        var matrixWord = [];
        var foundIndex = -1;
        var wordLengthHalf = 0;
        var dictWordTrueLengthBufferSize_half = dictWordTrueLengthBufferSize / 2;
        var matrixWordLengthBufferSize_half = matrixWordLengthBufferSize / 2;
        var dictIndex=0;
        var matrixIndex = 0;
        var wordDirection = 0;

        for (dictIndex=0; 
                dictIndex < dictArray.length;// && dictArray[dictIndex].found === 0; 
                dictIndex++) {
            dictBufferOffset = dictOneWordBufferSize * dictIndex;

            dictTrueLength = new Uint16Array(
                                    dictBuffer, 
                                    dictBufferOffset + dictWordTrueLengthBufferOffset, 
                                    dictWordTrueLengthBufferSize_half);

            dictEvenLength = new Uint8Array(
                                    dictBuffer, 
                                    dictBufferOffset + wordLenthEvenBufferOffset,
                                    wordLenthEvenBufferSize);

            foundIndex = -1;
            //dictWord = dictArray[dictIndex].word;
            for (matrixIndex = 0; matrixIndex < matrixWordCount; matrixIndex++) {
                matrixWordStructOffSet = matrixOneStructBufferSize * matrixIndex;
                /*matrixWordInValid = new Uint8Array(
                                            matrixBuffer, 
                                            matrixWordStructOffSet, 
                                            matrixWordInvalidBufferSize);
                */
                matrixWordLength = new Uint16Array(
                                            matrixBuffer, 
                                            matrixWordStructOffSet + matrixWordLengthBufferOffset,
                                            matrixWordLengthBufferSize_half);

                if (matrixWordLength[0] >= dictTrueLength[0]) {
                    foundIndex = searchWithByteOptim(dictBufferOffset, dictBufferOffset + dictOneWordBufferOffset,  matrixWordStructOffSet + matrixWordBufferOffset, matrixWordStructOffSet + matrixByteShiftWordBufferOffset);
                    wordDirection = 5;//Reused for direction purpose;
                    if (foundIndex < 0) {
                        foundIndex = searchWithByteOptim(dictBufferOffset, dictBufferOffset + dictReverseWordBufferOffset,  matrixWordStructOffSet + matrixWordBufferOffset, matrixWordStructOffSet + matrixByteShiftWordBufferOffset);
                        wordDirection = 10;//Reused for direction purpose;
                    }
                }

                if (foundIndex > -1) {
                    splitMatrixWord(matrixWordStructOffSet, foundIndex, dictTrueLength[0]);
                    //matrixWordLength[0] -= dictTrueLength[0];
                    dictFoundFlag = new Uint8Array(
                                dictBuffer, 
                                dictBufferOffset, 
                                foundBufferSize);
                    dictFoundFlag[0] = (new Uint8Array(
                                        matrixBuffer, 
                                        matrixWordStructOffSet + matrixWordDirectBufferOffset,
                                        matrixWordDirectBufferSize))[0];

                    dictFoundRowIndex = new Uint16Array(
                                        dictBuffer, 
                                        dictBufferOffset + foundRowIndexBufferOffset, 
                                        foundRowIndexBufferSize / 2);


                    dictFoundRowIndex[0] = (new Uint16Array(
                                            matrixBuffer, 
                                            matrixWordStructOffSet + matrixWordBaseRowIndexBufferOffset,
                                            matrixWordBaseRowIndexBufferSize / 2))[0];
                    
                    dictFoundColIndex = new Uint16Array(
                                                dictBuffer, 
                                                dictBufferOffset + foundColIndexBufferOffset, 
                                                foundColIndexBufferSize / 2);
                    
                    dictFoundColIndex[0] = (new Uint16Array(
                                            matrixBuffer, 
                                            matrixWordStructOffSet + matrixWordBaseColIndexBufferOffset,
                                            matrixWordBaseRowIndexBufferSize / 2))[0];

                    dictEvenLength[0] = wordDirection;
                    break;
                }
            }

        }
    }

    function printResult() {

        var dictBufferOffset = 0;
        var foundCount = 0;
        var found = [];
        var dictFoundDirection = [];
        var trueLength = [];
        var dictFoundRowIndex = [];
        var dictFoundColIndex = [];
        var str = '';
        var position = '';
        for (var dictIndex=0; 
                    dictIndex < dictArray.length;// && dictArray[dictIndex].found === 0; 
                    dictIndex++) {
                dictBufferOffset = dictOneWordBufferSize * dictIndex;

                found = new Uint8Array(
                                    dictBuffer, 
                                    dictBufferOffset, 
                                    foundBufferSize);

                trueLength = new Uint16Array(
                                    dictBuffer, 
                                    dictBufferOffset + dictWordTrueLengthBufferOffset, 
                                    dictWordTrueLengthBufferSize / 2);

                dictFoundRowIndex = new Uint16Array(
                                    dictBuffer, 
                                    dictBufferOffset + foundRowIndexBufferOffset, 
                                    foundRowIndexBufferSize / 2);

                dictFoundColIndex = new Uint16Array(
                                        dictBuffer, 
                                        dictBufferOffset + foundColIndexBufferOffset, 
                                        foundColIndexBufferSize / 2);
                dictFoundDirection = new Uint8Array(
                                    dictBuffer, 
                                    dictBufferOffset + wordLenthEvenBufferOffset,
                                    wordLenthEvenBufferSize);

                if (found[0] !== 0) {
                    foundCount++;
                    str = dictArray[dictIndex] + " Found at ";

                    if (dictFoundDirection[0] === 5) {
                        if (found[0] === 1) {
                            for (var rowIndex = dictFoundRowIndex[0]; rowIndex < trueLength[0]; rowIndex++) {
                                str += " [" + rowIndex + "][" + dictFoundColIndex + "]";
                            }
                        } else if (found[0] === 2) {
                            for (var colIndex = dictFoundColIndex[0]; colIndex < trueLength[0]; colIndex++) {
                                str += " [" + dictFoundRowIndex + "][" + colIndex + "]";
                            }
                        } else if (found[0] === 3) {
                            for (var step = 0,rowIndex = dictFoundRowIndex[0], colIndex = dictFoundColIndex[0]; step < trueLength[0]; step++, rowIndex++, colIndex--) {
                                str += " [" + rowIndex + "][" + colIndex + "]";
                            }
                        } else if (found[0] === 4) {
                            for (var step = 0, rowIndex = dictFoundRowIndex[0], colIndex = dictFoundColIndex[0]; step < trueLength[0]; step++, rowIndex++, colIndex++) {
                                str += " [" + rowIndex + "][" + colIndex + "]";
                            }
                        }
                    } else if (dictFoundDirection[0] === 10) {
                        position = '';
                        if (found[0] === 1) {
                            for (var rowIndex = dictFoundRowIndex[0]; rowIndex < trueLength[0]; rowIndex++) {
                                position = " [" + rowIndex + "][" + dictFoundColIndex + "]" + position;
                            }
                        } else if (found[0] === 2) {
                            for (var colIndex = dictFoundColIndex[0]; colIndex < trueLength[0]; colIndex++) {
                                position = " [" + dictFoundRowIndex + "][" + colIndex + "]" + position;
                            }
                        } else if (found[0] === 3) {
                            for (var step = 0, rowIndex = dictFoundRowIndex[0], colIndex = dictFoundColIndex[0]; step < trueLength[0]; step++, rowIndex++, colIndex--) {
                                position = " [" + rowIndex + "][" + colIndex + "]" + position;
                            }
                        } else if (found[0] === 4) {
                            for (var step = 0, rowIndex = dictFoundRowIndex[0], colIndex = dictFoundColIndex[0]; step < trueLength[0]; step++, rowIndex++, colIndex++) {
                                position = " [" + rowIndex + "][" + colIndex + "]" + position;
                            }
                        }
                        str += position;
                    }
                    console.log(str);
                } else {
                    console.log(dictArray[dictIndex] + " Not Found ");
                }
            }
            console.log('Found', foundCount);
    }


    populateDictionayBuffer();
    populateWordSpace();
    searchInMatrix();
    printResult();
    console.timeEnd('performance');

})(fileName);