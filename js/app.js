/* Declare constants and variables */
const searchableWords = [
    'aero',
    'agentzero',
    'ironman',
    'captainamerica',
    'antman',
    'wolverine',
    'spiderman',
    'electra',
    'blackpanther',
    'thor',
    'vision',
    'deadpool',
    'professorx',
    'magne to',
    'iceman'
];
const maxAttempts = 10;
const keySound = new Audio ("./assets/sounds/typewriter-key.wav");
const gameLostSound = new Audio ("./assets/sounds/you-lose.wav");
const gameWonSound = new Audio ("./assets/sounds/you-win.wav");
const randomIndex = Math.floor(Math.random() * searchableWords.length);
var guessingWord = [];
let guessedLetters = [];
let isGameOver = false;
let gameWon = false;
var positions = [];
var remainingGuesses = 0; // How many tries the player has left
var currentSelectedWord = '';

/* Load game */
/* Display the current word as a series of '-'*/
const loadGame = () => {
    currentSelectedWord = searchableWords[randomIndex];
    //console.log('Selected word is:', currentSelectedWord);    
    document.getElementById('winImage').style.display = 'none';
    document.getElementById('gameoverImage').style.display = 'none';
    document.getElementById('hangmanImage').style.display = 'none';
    document.getElementById('pressKeyTryAgain').style.display = 'block';    

    for (var i = 0; i < currentSelectedWord.length; i++) {
        guessingWord.push(" _ ");
    }   
    document.getElementById('currentword').innerText = guessingWord.join('');
    remainingGuesses = maxAttempts;
}
/* Declare game functions */
const playGame = (code) =>{
    //console.log('Playing game with key code:', keyCode);
    document.getElementById('pressKeyTryAgain').style.display = 'none';
    keySound.play();        
    // evaluate the guessed letter
    evaluateGuess(code);
    updateDisplay(code);
    updateImage();
}
const evaluateGuess = (letter) => {
    positions = [];    

    // Check if the guessed letter is in the current selected word 
    // Do nothing if letter is already in the guessedWord array
    for (let i = 0; i < currentSelectedWord.length; i++) {       
        if (currentSelectedWord[i].toLowerCase() === letter.toLowerCase()) {
            positions.push(i);            
        }
    }
    //console.log('positions:', positions);

    // if there are no position indicies, remove a guess and update the hangman image
    if (positions.length <= 0) {
        // incorrect guesses        
        // Add letter to guessedLetters array
        // Do nothing if letter is already in the guessedLetters array
        if(!guessedLetters.includes(letter)){
            guessedLetters.push(letter);
            document.getElementById("incorrectGuesses").textContent = guessedLetters.join(', '); 
            remainingGuesses--;      
        }
    } else {
        // correct guesses        
        if(guessingWord.includes(letter)){
            // Do nothing if letter is already in the guessedWord array               
            return;
        }
        else{           
            //console.log('Replacing positions:', positions);
            //console.log('Letters guessed : ', guessingWord);

            // Loop through all the indicies and replace the '_' with a letter.
            for(var i = 0; i < positions.length; i++) {           
                guessingWord[positions[i]] = letter;            
            }
            remainingGuesses--;
        }
    }        
};
const updateImage = () =>{    
    document.getElementById('hangmanImage').style.display = 'block';
     document.getElementById('hangmanImage').classList.remove('bounce'); 
    // Update the hangman image based on the number of remaining guesses    
    document.getElementById('hangmanImage').src = `./assets/images/${maxAttempts - remainingGuesses}.jpg`;
}
const checkLoss = ()=> {
    if(remainingGuesses <=0 && !gameWon){
        document.getElementById('hangmanImage').classList.add('bounce'); 
        document.getElementById('hangmanImage').src = './assets/images/lose.jpg';
        gameLostSound.play()
        isGameOver = true;
    }
}
const checkWin = ()=> {
    if(remainingGuesses >=0 && guessingWord.join('') === currentSelectedWord){      
        document.getElementById('hangmanImage').classList.add('bounce'); 
        document.getElementById('hangmanImage').src = './assets/images/you-win.png';        
        gameWonSound.play()
        isGameOver = true;
        gameWon = true;
    }
}
const updateDisplay=(code)=>{
    //guessingWord.push(code);
    //find index
    document.getElementById('currentword').innerText = guessingWord.join('');
    document.getElementById("remainingGuesses").textContent = remainingGuesses;
}
const resetGame = () => {
    remainingGuesses = maxAttempts;   
    currentWordIndex = Math.floor(Math.random() * (searchableWords.length));
    positions = [];
    guessingWord = [];
    guessedLetters = [];    
    document.getElementById('hangmanImage').style.display = 'none';   
     document.getElementById('pressKeyTryAgain').style.display = 'block';
    document.getElementById("incorrectGuesses").textContent = guessedLetters.join(', ');     

     for (var i = 0; i < searchableWords[currentWordIndex].length; i++) {
        guessingWord.push(" _ ");
    }   
    updateDisplay();
    window.location.reload();
}

loadGame();   
document.addEventListener('keydown',(event)=>{    
    if(isGameOver){        
        isGameOver = false;
        resetGame();
    }
    else if(event.keyCode >= 65 && event.keyCode <= 90) // A-Z
    {            
        playGame(event.key.toLocaleLowerCase());
        checkWin();     
        checkLoss();
        
    }
    
});