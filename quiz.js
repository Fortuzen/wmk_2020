
var quizData = null;
var currentQuestionIndex = -1;
var correctAnswerIndex = -1;
var correctCount = 0
var wasAnswerCorrect = true;

$(function() {
    let asd = document.getElementById("quiz-placeholder").getAttribute("data-file");
    console.log(asd);
    loadQuiz(asd);
});


function loadQuiz(fileName) {
    console.log(fileName);
    fetch(fileName)
        .then((response) => {
            return response.json();
        })
        .then((data)=>{
            console.log(data)
            quizData = data;
            nextQuestion()
        });
}

function randomizer(a, b) {
    return 0.5 - Math.random();
}

function nextQuestion() {
    currentQuestionIndex += 1;
    wasAnswerCorrect = true;

    let q = quizData[currentQuestionIndex]
    correctAnswerIndex = q["correctIndex"];
  
    let cardBody = document.getElementById("quiz-buttons");
    let cardQuestionProgress = document.getElementById("quiz-question-progress");
    let cardQuestion = document.getElementById("quiz-question");
    cardBody.innerHTML = "";

    cardQuestionProgress.innerHTML = (currentQuestionIndex+1) + "/" + quizData.length;
    cardQuestion.innerHTML = q["question"];
    let buttons = [];
    // Create answer buttons and add them to the element
    for(let i=0; i < q["answers"].length; i++) {
        let answer = q["answers"][i];
        //cardBody.innerHTML += `<button id="answer-button-${i}" type="button" class="btn btn-primary btn-block" onclick="handleAnswerButton()" >${answer}</button>`;
        //let button = document.createElement("button");

        let button = document.createElement("label");      
        button.setAttribute("type", "button");
        button.setAttribute("class", "btn btn-primary btn-block");
        button.setAttribute("id", "button-"+i);
        button.innerHTML = answer;
        button.disabled = false;
    
        button.addEventListener("click", e => {
            e.preventDefault()
            if (!button.disabled) 
                handleAnswerButton(e, i);
        });

        buttons[i] = button;
    }
    // Randomize answer order
    buttons = buttons.sort(randomizer);
    for(let i = 0; i<buttons.length; i++) {
        cardBody.appendChild(buttons[i]);
    }
}

function handleAnswerButton(e, answerIndex) {
    if (answerIndex === correctAnswerIndex) {
        onCorrectAnswer(e);
    } else {
        onWrongAnswer(e)
    }

}

function onCorrectAnswer(event) {
    console.log("Correct");
    let b = event.target;
    b.setAttribute("class", "btn btn-success btn-block");
    b.disabled = true;

    if(wasAnswerCorrect) {
        correctCount += 1;
    }

    if (currentQuestionIndex < quizData.length - 1) {
        setTimeout( () => {
            $("#quiz-buttons").animate({opacity: '0'}, complete = () => {       
                nextQuestion();
                $("#quiz-buttons").animate({opacity: '1'});
            });
        }, 500);
     
    } else {
        setTimeout( () => {
            $("#quiz-buttons").animate({opacity: '0'}, complete = () => {       
                onFinishQuiz()
                $("#quiz-buttons").animate({opacity: '1'});
            });
        }, 1000);
    }
    
}

function onWrongAnswer(event) {
    console.log("Wrong");
    console.log(event.target);
    let b = event.target;
    b.setAttribute("class", "btn btn-danger btn-block");
    b.disabled = true;
    wasAnswerCorrect = false;
    
}

function onFinishQuiz() {
    console.log("Finish");
    let cardButtons = document.getElementById("quiz-buttons");
    let cardQuestion = document.getElementById("quiz-question");
    cardQuestion.innerHTML = "Quiz Correct Answers: " + correctCount;

    // Retry
    cardButtons.innerHTML = "";
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-primary btn-block");
    button.innerHTML = "Try again";

    cardButtons.appendChild(button);
    button.addEventListener("click", e => {
        currentQuestionIndex = -1;
        correctCount = 0;
        nextQuestion();
    });
}