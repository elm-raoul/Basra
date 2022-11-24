/* DECLARE VARIABLES FOR PAGE ELEMENTS IN THIS SECTION */

let round = document.getElementById('round_number')
let next_round_button = document.getElementById('nextRound')
let end_game_button = document.getElementById('endGame')
let playerNames = document.getElementsByClassName('playerName')
let roundScores = document.getElementsByClassName('roundScore')
let currentScores = document.getElementsByClassName('currentScore')
let target = parseInt(document.getElementById('targetScore').innerHTML)
let leaderboardPlayers = document.getElementsByClassName('leaderboardName')
let leaderboardScores = document.getElementsByClassName('leaderboardScore')
let sendToBackendInput = document.getElementById('sendToBackendInput')
let turnList = document.getElementsByClassName('turn')

/* END OF SECTION */



/* DECLARE FUNCTIONS IN THIS SECTION */

function nextRound(roundNumElement){ /* ADDS 1 TO THE CURRENT ROUND NUMBER */
    let current_num = parseInt(roundNumElement.innerHTML)
    let new_num = current_num + 1
    roundNumElement.innerHTML = new_num
}

function throwError(error){ /* THROWS AN ERROR ON REQUEST, AT THE TOP OF THE PAGE */
    let error_msg = document.getElementsByClassName('error_area_h5')[0]
    let error_area = document.getElementsByClassName('error_area')[0]
    error_msg.innerHTML = error
    error_area.classList.remove('hidden')
    setTimeout(function(){
        error_area.classList.add('hidden')
    },7500);
}

function sendToBackend(final_round, winner, winner_score, leaderboard){
    json_format = {"Winner": winner, "Winning Score": winner_score, "Last Round": final_round, "Leaderboard" : [...leaderboard]}
    sendToBackendInput.value = JSON.stringify(json_format)
     /* THIS FUNCTION STORES ALL THE NECESSARY DATA AS THE INPUT VALUE. THE VALUE WILL THEN BE FETHCED BY THE BACKEND USING FORM SUBMITION */
}


function updateTurn(turnElementsList){
    /* FIRST WE NEED TO CHECK WHERE THE CURRENT TURN IS */
    let curr_pos = 0
    let new_pos = 0
    let noOneIsActive = true /* THIS NORMALLY STAYS TRUE ONLY WHEN THE PAGE LOADS FOR THE FIRST TIME */ 

    for (let i = 0; i < turnElementsList.length; i++){
        if (turnElementsList[i].classList.contains('active')){
            noOneIsActive = false
            curr_pos = i
            break
        }
    }

    /* REMOVE THE ACTIVE CLASS FROM OLD TURN AND ADD IT TO THE NEW TURN */ 
    if (noOneIsActive){ /* WHEN THERE IS NO ACTIVE TURN AT FIRST LOAD, MAKES THE FIRST PLAYER IN THE LIST ACTIVE */
        turnElementsList[0].classList.add('active')
    } else if (curr_pos == (turnElementsList.length - 1)){  /* IF THE CURRENT TURN IS AT LAST INDEX, GO BACK TO THE BEGINNING */
        turnElementsList[curr_pos].classList.remove('active')
        turnElementsList[new_pos].classList.add('active')
    } else {
        turnElementsList[curr_pos].classList.remove('active')
        new_pos = curr_pos + 1
        turnElementsList[new_pos].classList.add('active')
    }

}


function updateLeaderboard(listOfPlayers, currentScoreList, listOfLeaderboardPlayers, listOfLeaderboardScores){

    let unsortedPlayersList = [...listOfPlayers]  /* SHALLOW COPIES THE PLAYERS LIST AND SCORES LIST*/
    let unsortedScoresList = [...currentScoreList] /* FOR SOME REASON, DEEP COPYING USING JSON METHODS BROKE THE FUNCTION */
    /* BUT IT DOESN'T METTER HERE, AS ARRAYS ARE NOT MULTI-DIMENTIONAL */

    let sortedPlayersList = [] /* CREATES LISTS TO STORE THE SORTED DATA (PLAYERS AND SCORES) */
    let sortedScoresList = []

    let maxScore = 0  /* TO BE USED LATER AT EATCH ITERATION */
    let maxPlayer = ''
    let indexOfMax = 0
    let removedPlayers = []
    let removedScores = []

    do{
        maxScore = 0
        maxPlayer = ''
        indexOfMax = 0

        for (let i = 0; i < unsortedPlayersList.length; i++){  /* SEARCHES FOR THE PLAYER WITH THE HIGHEST SCORE AND STORES THEM IN VARIABLES */
            let player = unsortedPlayersList[i].innerHTML
            let score = parseInt(unsortedScoresList[i].innerHTML)
            if (score >= maxScore){
                maxPlayer = player
                maxScore = score
                indexOfMax = i /* STORES THE INDEX OF THE MAX PLAYER AND SCORE */
            }
        }
        sortedPlayersList.push(maxPlayer)
        sortedScoresList.push(maxScore)

        removedPlayers = unsortedPlayersList.splice(indexOfMax,1) /* DELETES THE MAX PLAYER AND SCORE FROM THE UNSORTED LIST */
        removedScores = unsortedScoresList.splice(indexOfMax,1)

    }while(unsortedPlayersList.length !== 0)


    for (let i = 0; i < listOfLeaderboardPlayers.length; i++){ /* UPDATES THE LEADERBOARD ON THE PAGE */
        listOfLeaderboardPlayers[i].innerHTML = sortedPlayersList[i]
        listOfLeaderboardScores[i].innerHTML = sortedScoresList[i]
    }

}


function validateRound(listOfPlayers, roundScoreList, currentScoreList, targetScore, listOfLeaderboardPlayers, listOfLeaderboardScores){

    let game_over = false
    let isInvalid = false
    let winner = ''
    let highestScore = 0

    /* THIS SECTION ADDS ROUND SCORES TO TOTAL PLAYER SCORES */

    for (let i = 0; i < listOfPlayers.length; i++){ /* CHECKS IF THE NEW SCORES ARE ALL VALID */
        let added_score = parseInt(roundScoreList[i].value) 
        if (isNaN(added_score) || added_score < 0){
            throwError('All fields should be filled with positive numbers (0 included)!')
            isInvalid = True
            break
        } 
    }

    if (isInvalid === false){  /* ADDS THE NEW SCORES ONLY IF ALL NEW SCORES ARE VALID */
        for (let i = 0; i < listOfPlayers.length; i++){
            let current_score = parseInt(currentScoreList[i].innerHTML)
            let added_score = parseInt(roundScoreList[i].value) 
            let new_score = current_score + added_score
            currentScoreList[i].innerHTML = new_score
            roundScoreList[i].value = ''
        }

        updateLeaderboard(listOfPlayers, currentScoreList, listOfLeaderboardPlayers, listOfLeaderboardScores)
        updateTurn(turnList)

    }

    /* THIS SECTION CHECKS FOR WINNERS */
    for (let i = 0; i < listOfPlayers.length; i++){
        if (isInvalid){
            break   /* DOES NOT CHECK FOR WINNERS IF THERE WAS AN ERROR WITH NEW SCORES <=> IF NOT ALL SCORES HAVE BEEN ADDED */
        }
        let current_score = parseInt(currentScoreList[i].innerHTML)
        if (current_score >= targetScore){
            game_over = true
            if (current_score >= highestScore){
                highestScore = current_score
                winner = listOfPlayers[i].innerHTML
            }

        }
    }

    if (game_over === true){
        let final_leaderboard = []   /* FETCHES THE FINAL LEADERBOARD AND PUTS IT IN A LIST TO SEND IT TO THE BACKEND */
        for (let i = 0; i < listOfLeaderboardPlayers.length; i++){
            final_leaderboard.push([listOfLeaderboardPlayers[i].innerHTML,parseInt(listOfLeaderboardScores[i].innerHTML)])
        }
        sendToBackend(parseInt(round.innerHTML), winner, highestScore, final_leaderboard) 
        document.forms['sendToBackendForm'].submit() /* SUBMITS THE HIDDEN FORM TO SEND THE FINAL VALUES TO BACKEND */
    } else{
        nextRound(round)
    }

}



/* END OF SECTION */


/* DECLARE EVENT LISTENERS IN THIS SECTION */ 


next_round_button.addEventListener("click", function(){
    validateRound(playerNames, roundScores, currentScores, target, leaderboardPlayers, leaderboardScores)
})

end_game_button.addEventListener("click", function(){
    if (confirm("Are you sure you want to leave? All scores will be lost.")){
        location = "/"
    }
})



/* END OF SECTION */

/* PERFORM ADDITIONAL CODE IN THIS SECTION */

updateTurn(turnList)

/* END OF SECTION */
