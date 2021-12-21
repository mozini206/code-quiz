function addQuestion(indexOfQuestion) {
    var question = questions[indexOfQuestion].question;

    $("#question").text(question);

    var answers = questions[indexOfQuestion].answers;

    $('#answer').empty();

    for (var i = 0; i < answers.length; i++) {
        var answerBtn = $('<button>' + answers[i] + '</button>');
        $('#answer').append(answerBtn);
        answerBtn.addClass("answer-button");
    }
}

function ShowQuiz() {
    $("#content").show();
    $("#questiondiv").hide();
    $("#scorediv").hide();
    $('#highscoresdiv').hide();
}

function showQuestion() {
    $("#content").hide();
    $("#questiondiv").show();
    $("#scorediv").hide();
    $('#highscoresdiv').hide();
}

function showSubmitScore(timeScore) {
    $("#content").hide();
    $("#questiondiv").hide();
    $("#scorediv").show();
    $('#highscoresdiv').hide();

    $('#score').text(timeScore);
}

$(document).ready(function () {
    ShowQuiz();

    var currentQuestionIndex = 0;
    var secondsLeft = 60;
    var secondsOnQuestion = 10;
    var timerInterval;

    $('#start').on('click', function () {
        showQuestion();
        addQuestion(currentQuestionIndex);
        setTime();
    });

    $('#questiondiv').on('click', 'button.answer-button', function () {
        var selectedAnswer = $(this).text();

        if (questions[currentQuestionIndex].correctAnswer === selectedAnswer) {
            $('#result').text('Yes!');
        } else {
            secondsLeft -= 10;
            $('#result').text('Noooo!');
        }

        currentQuestionIndex++;

        if (currentQuestionIndex > questions.length - 1) {
            $('#timer').text(secondsLeft);
            clearInterval(timerInterval);
            showSubmitScore(secondsLeft);
        } else {
            addQuestion(currentQuestionIndex);
        }
    });

 
    $('.submit-button').on('click', function () {
        var initials = $('#user-initals').val();
        if (initials != null &&
            initials != undefined &&
            initials.length != 0) {

            var localHighScores = JSON.parse(localStorage.getItem('localHighScores'));
        
  
            if (localHighScores == null) {
                localHighScores = [
                    {
                        initials: initials,
                        score: secondsLeft
                    }
                ];
            } else {
                if (localHighScores.length < 10) {
                    var scoreEntry = {
                        initials: initials,
                        score: secondsLeft
                    };

                    localHighScores.push(scoreEntry);

                    localHighScores.sort(function (a, b) { return b.score - a.score });
                } else {
                    var minScore = localHighScores[0].score;
                    for (var i = 1; i < localHighScores.length; i++) {
                        if (localHighScores[i].score < minScore) {
                            minScore = localHighScores[i].score;
                        }
                    }
                    if (secondsLeft > minScore) {
                        var scoreEntry = {
                            initials: initials,
                            score: secondsLeft
                        };

                        localHighScores.push(scoreEntry);
                        localHighScores.sort(function (a, b) { return b.score - a.score });
                        localHighScores.pop();
                    }
                }
            }

            localStorage.setItem('localHighScores', JSON.stringify(localHighScores));

            showHighScores();
        }
    });
    
    $('#back-button').on('click', function () {
        currentQuestionIndex = 0;
        secondsLeft = 75;
        secondsOnQuestion = 15;
        $('#result').text('');
        ShowQuiz();
    });

    $('#clear-button').on('click', function () {
        localStorage.removeItem('localHighScores');
        $('#recorded-score').empty();
    });

    
    $('.highscore').on('click', function () {
        showHighScores();
    })

    function setTime() {
        timerInterval = setInterval(function () {
            --secondsLeft;
            $('#timer').text(secondsLeft);

            --secondsOnQuestion;

            
            if (secondsOnQuestion === 0) {
                currentQuestionIndex++;
                addQuestion(currentQuestionIndex);
                secondsOnQuestion = 15;
            }


            if (secondsLeft === 0) {
                clearInterval(timerInterval);
                showSubmitScore(0);
            }
        }, 1000);


    }

    function showHighScores() {
        var localHighScores = JSON.parse(localStorage.getItem('localHighScores'));

        $('#recorded-score').empty();

        if (localHighScores != null) {
            for (var i = 0; i < localHighScores.length; i++) {
                var initials = localHighScores[i].initials;
                var score = localHighScores[i].score;

                $('#recorded-score').append("<li>" + initials + ": " + score + "</li>");
            }
        }

        clearInterval(timerInterval);

        $("#content").hide();
        $("#questiondiv").hide();
        $("#scorediv").hide();
        $('#highscoresdiv').show();
    }
});
