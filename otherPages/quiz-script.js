let questions = [];
let curList = ["1", "2", "3", "4"];

function playAudio() {
  document.getElementById("myAudio").play();
}
//shuffle credits :- https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
async function getProblems() {
  const response = await fetch(
    "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple"
  );
  const data = await response.json();
  data.results.forEach((question) => {
    let tp = [];
    question.incorrect_answers.forEach((ele) => {
      tp.push(ele);
    });
    tp.push(question.correct_answer);
    shuffle(tp);
    questions.push([question.question, tp]);
  });
  doquiz();
}
function doTimer() {
  let count = 20;
  var interval = setInterval(function () {
    if (count == 10) {
      playAudio();
      document.getElementById("timer").classList.add("btn-outline-danger");
      document.getElementById("timer").classList.remove("btn-outline-success");
    }
    let hr = Math.trunc(count / 60),
      mn = count % 60;
    let app =
      ("00" + hr).slice(-2).toString() + ":" + ("00" + mn).slice(-2).toString();
    document.getElementById("timer").innerHTML = app;
    count--;
    if (count == -1) {
      clearInterval(interval);
      document.getElementById("timer").innerHTML = "--:--";
      document.getElementById("timer").classList.remove("btn-outline-danger");
      document.getElementById("timer").classList.add("btn-outline-success");
      if (now < questions.length) doquiz();
    }
  }, 1000);
}
getProblems();
let now = 0;
function animateQuestion() {
  var textWrapper = document.querySelector(".ml11 .letters");
  textWrapper.innerHTML = textWrapper.textContent.replace(
    /([^\x00-\x80]|\w)/g,
    "<span class='letter'>$&</span>"
  );
  anime.timeline({ loop: false }).add({
    targets: ".ml11 .letter",
    opacity: [0, 1],
    easing: "easeOutExpo",
    duration: 600,
    offset: "-=775",
    delay: (el, i) => 34 * (i + 1),
  });
}
function doquiz() {
  //put question and answers here
  // alert('getting called');
  let question = document.getElementById("question");
  document.getElementById("number").textContent = (
    (now + 1).toString() + ")."
  ).toString();
  question.textContent = questions[now][0];
  // animateQuestion();
  const choice = document.getElementsByClassName("choice");
  Object.keys(choice).forEach((ele) => {
    choice[ele].style.visibility = "visible";
  });
  for (let i = 0; i < 4; i++) {
    document.getElementById(curList[i]).innerHTML = questions[now][1][i];
  }
  doTimer();
  now++;
  // if (now < questions.length) setTimeout(doquiz, 3000);
}
