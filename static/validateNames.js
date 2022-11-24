/* DECLARE VARIABLES FOR PAGE ELEMENTS IN THIS SECTION */


let list_of_names = document.getElementsByClassName('name_input')
let start_button = document.getElementById('start_game')

/* END OF SECTION */



/* DECLARE FUNCTIONS IN THIS SECTION */

function throwError(error){
    let error_msg = document.getElementsByClassName('error_area_h5')[0]
    let error_area = document.getElementsByClassName('error_area')[0]
    error_msg.innerHTML = error
    error_area.classList.remove('hidden')
    setTimeout(function(){
        error_area.classList.add('hidden')
    },7500);
}

function Validate(list_of_names, formName){
    let regex = /^[A-Za-z0-9 ]+$/
    let validated = true
    for (let i = 0; i < list_of_names.length; i++){
        if (regex.test(list_of_names[i].value) === false){
            validated = false
            throwError('Player names cannot <strong>be empty</strong> or <strong>contain symbols</strong>!')
        }
    }
    if (validated){
        document.forms[formName].submit()
    }
}




/* END OF SECTION */


/* DECLARE EVENT LISTENERS IN THIS SECTION */ 

start_button.addEventListener("click", function(){
    Validate(list_of_names, "name_form")
})




/* END OF SECTION */


