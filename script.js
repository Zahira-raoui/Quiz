let timer;
 let countdown;
 let indiceQ;

const typesQuestion={
    VF:"VF",
    QCU:"QCU",
    QCM:"QCM",
    QROC:"QROC",
    QOPR:"QOPR",

}
class Question{
    constructor(numero,type,enonce,reponse_type,duree){
        this.numero=numero;
        this.type=type;
        this.reponse_type=reponse_type;
        this.enonce=enonce;
        this.duree=duree;
        this.reponse_candidact=null;
    }

    set reponseCandidat(value) {
            this.reponse_candidact= value;
            }

    generateHTML(){
        let html = `<div class="question" id="question${this.numero}">`;
        switch (this.type) {
            case typesQuestion.VF:
                html += `\n<p>${this.enonce}</p>`;
                html += "\n<p>Vrai ou Faux :</p>";
                html += `\n<input type="radio" id="vrai" name="question${this.numero}" value="vrai"> Vrai`;
                html += `\n<input type="radio" id="faux" name="question${this.numero}" value="faux"> Faux`;
                break;
            case typesQuestion.QCU:
                html += `\n<p>${this.enonce[0]}</p>`;
                html += "\n<p>Choisissez une seule réponse :</p>";
                for (let i = 1; i < this.enonce.length; i++) {
                   html += `<input type='radio' name='question${this.numero}' value="${this.enonce[i]}" /> ${this.enonce[i]} <br>`;
                }
                break;
            case typesQuestion.QCM:
                        html += `\n<p>${this.enonce[0]}</p>`;
                        html += "\n<p>Choisissez une ou plusieurs réponses :</p>";
                        for (let i = 1; i < this.enonce.length; i++) {
                            html += `<input type='checkbox' name='question${this.numero}' value="${this.enonce[i]}" /> ${this.enonce[i]} <br>`;
                         }
                         break;

            case typesQuestion.QROC:
                            html += `\n<p>${this.enonce}</p>`;
                            html += "\n<p>Répondez dans la zone ci-dessous :</p>";
                            html += `\n<textarea id="reponse_${this.numero}" rows="4" cols="50"></textarea>`;
                            break;

            case typesQuestion.QOPR:
                html += `<br>${this.enonce[0]}<br><br>`; 
                for (let i = 1; i < this.enonce.length; i++) {
                    html += `${this.enonce[i]}<br>`; 
                    html += `<textarea rows='4' id="reponse_${this.numero}" cols='50'></textarea><br>`;
                }
                break;
            default:
                        html += "\n<p>Type de question non reconnu</p>";
    
        }
         // Ferme la balise div.
        html += `</div>`;
         // Retourne la chaîne HTML générée.
        return html;
    
        }
    
}


const questions=[
    new Question(1,typesQuestion.VF,"La Terre tourne autour du Soleil",true,10),
    new Question(2,typesQuestion.QCU,["Quelle est la capitale de la France ?","Paris","Berlin","Rome"],1,10),
    new Question(3,typesQuestion.QCM,["Quelles sont les couleurs primaires ?","Rouge","Vert","Bleu","Jaune"],[1,3,4],10),
    new Question(4,typesQuestion.QROC,"Quel est le plus grand océan du monde ?","Pacifique",10),
    new Question(5,typesQuestion.QOPR,["Décrivez votre expérience académique","Quelle est votre matière préférée ?","Quels sont vos projets d'avenir ?"],["mathematique","reussir dans la vie professionel"],10)
]


function startQuiz() {
           document.querySelector(".quiz").style.display = "none";
            document.getElementById('envoyer').style.display = 'inline-block';
            document.getElementById('stop').style.display = 'inline-block';
            // Affiche la première question
            indiceQ = 0; 
            showQuestion(indiceQ);
            // Démarre le compte à rebours
            startCountdown();
        }


        function startCountdown() {
    let seconds = questions[indiceQ].duree;
    document.getElementById("timer").innerHTML = `Temps restant : ${seconds} secondes`;

    timer = setInterval(function () {
        seconds--;
        document.getElementById("timer").innerHTML = `Temps restant : ${seconds} secondes`;
        if (seconds == 10) {
            triggerReminder();
        }
        if (seconds <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

        function showQuestion() {
            document.getElementById('question-container').innerHTML = questions[indiceQ].generateHTML();
        }

        function nextQuestion() {
            saveResponse();
            clearInterval(timer);
    if(indiceQ == questions.length-1){
            stopQuiz();
        }else {
            indiceQ++;
            showQuestion(indiceQ);
            startCountdown();
        }
    }



    function saveResponse() {
           const question_specifiee=questions[indiceQ];
            switch(question_specifiee.type){
                case typesQuestion.VF:
                const v_Checked = document.getElementById("vrai").checked;
                const f_Checked = document.getElementById("faux").checked;
                  
            if (v_Checked) {
                question_specifiee.reponseCandidat=true;
            } else if (f_Checked) {
                question_specifiee.reponseCandidat=false;
            } else {
                question_specifiee.reponseCandidat=null; // Aucune option sélectionnée
            }
            break;
            case typesQuestion.QCU:
    const radioOptions = document.getElementsByName(`question${question_specifiee.numero}`);
    let selectedOption = null;

    for (let i = 0; i < radioOptions.length; i++) {
        if (radioOptions[i].checked) {
            selectedOption = radioOptions[i].value;
            break; // Sortir de la boucle dès qu'une option est cochée
        }
    }
    question_specifiee.reponseCandidat = selectedOption;
    break;

                case typesQuestion.QCM:
                const qcmOptions=  document.getElementsByName(`question${question_specifiee.numero}`);
                let selectOption = [];
                for (let i = 0; i < qcmOptions.length; i++) {
                    if (qcmOptions[i].checked) {
                        selectOption.push(qcmOptions[i].value);
                           
        }
                }
                question_specifiee.reponseCandidat=selectOption;
                    break;

                case typesQuestion.QROC:
                const responseTextArea = document.getElementById(`reponse_${question_specifiee.numero}`);
                question_specifiee.reponseCandidat= responseTextArea.value.trim();
                    break;
                case typesQuestion.QOPR:
                const qorpTextareas = document.getElementById(`reponse_${question_specifiee.numero}`);
                let qorpResponses = [];
                for (let i = 0; i < qorpTextareas.length; i++) {
                      qorpResponses.push(qorpTextareas[i].value);
    }
                question_specifiee.reponseCandidat=qorpResponses;

                break;
                default :
                question_specifiee.reponseCandidat=null;

            }}


            function triggerReminder() {
}

function stopQuiz() {

    clearInterval(timer);
    const quizContainer = document.querySelector('.quiz');
    quizContainer.innerText = "Merci d'avoir passé le quiz";
    quizContainer.style.display = 'block';
    const timing = document.getElementById('timer');
    timing.style.display='none';
    const questionContainer = document.getElementById('question-container');
    questionContainer.style.display = 'none';

    const envoyerButton = document.getElementById('envoyer');
    const stopButton = document.getElementById('stop');
    
    // Masquer les boutons
    envoyerButton.style.display = 'none';
    stopButton.style.display = 'none';


        }

        
       