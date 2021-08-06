const tbnNewDeck = document.getElementById('tbn-new-deck')
const tbnDrawCards = document.getElementById('tbn-draw-cards')
const cardsDisplay =document.getElementById('cards-display')
const message = document.getElementById('message')
const remainingCards = document.getElementById('remaining-cards')
const computer = document.getElementById('computer')
const player = document.getElementById('player')

let cardId = ''
let cardsArray = []
let computerScore = 0
let playerScore = 0


function render2Cards(cardsArray){
    let cardHtml = ''
    for (let card of cardsArray){
        cardHtml += `
            <img id=${card.code} src = ${card.image}>
        `
    }
    cardsDisplay.innerHTML = cardHtml

}

function determineCardWinner(card1, card2){
    const scoreRange = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = scoreRange.indexOf(card1.value)
    const card2ValueIndex = scoreRange.indexOf(card2.value)
    if (card1ValueIndex === card2ValueIndex)
        return "War! Let's draw other cards"
    else if (card1ValueIndex > card2ValueIndex){
        computerScore++
        computer.innerHTML = `Computer score: ${computerScore}` 
        return "Computer Win!"
        }         
        else{
            playerScore++
            player.innerHTML = `Your score: ${playerScore}`
            return "You Win!"            
        } 
}

function reset(){
    localStorage.clear()
    cardsArray = []
    computerScore = 0
    playerScore = 0
    tbnDrawCards.disabled = false
    tbnDrawCards.classList.remove('disabled')
    cardsDisplay.innerHTML = `<div id=first-card class="card-slot"></div>
                    <div id=second-card class="card-slot"></div>`  
    message.textContent = 'Game of War'
    computer.textContent = `Computer score: ${computerScore}` 
    player.innerHTML = `Your score: ${playerScore}`
}

async function newDeck(){
    reset()    
    const response = await fetch('https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/')
    const data = await response.json()
    localStorage.setItem('cardId',data.deck_id)
    remainingCards.textContent = `Remaining cards: ${data.remaining}`
}

async function drawCards(){
    cardId = localStorage.getItem('cardId')
    const response = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${cardId}/draw/?count=2`)
    const data = await response.json()    
    cardsArray = data.cards
    render2Cards(cardsArray)     
    message.textContent = determineCardWinner(cardsArray[0], cardsArray[1])  
    remainingCards.textContent = `Remaining cards: ${data.remaining}`  
    if (data.remaining === 0){
        tbnDrawCards.disabled = true
        tbnDrawCards.classList.add('disabled')
        if (computerScore === playerScore)
            message.textContent = 'No one win the game'
        else if(computerScore > playerScore)
            message.textContent = 'The computer is the winner!'
            else
                message.textContent = 'Congratulation! You are the winner!'
    }

}

tbnNewDeck.addEventListener('click', newDeck)

tbnDrawCards.addEventListener("click", drawCards)
