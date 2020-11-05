let questions = [],
  solutions = [];
let curList = ["1", "2", "3", "4"];
let interval,
  correct = 0;

function playAudio() {
  document.getElementById("myAudio").play();
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function getProblems() {
  const response = await fetch(
    "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple"
  );
  const data = await response.json();
  data.results.forEach((question) => {
    let tp = [];
    let cur = 1,
      time = getRandomInt(1, 4);
    question.incorrect_answers.forEach((ele) => {
      if (cur == time) {
        solutions.push(cur.toString());
        tp.push(question.correct_answer);
        cur++;
      }
      tp.push(ele);
      cur++;
    });
    if (cur == 4)
      tp.push(question.correct_answer), solutions.push(cur.toString());
    questions.push([question.question, tp]);
  });
  console.log(questions);
  console.log(solutions);
  doquiz();
}
function doTimer() {
  // todo need to change it to 20
  let count = 20;
  interval = setInterval(function () {
    if (count == 10) {
      // playAudio();
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
  // TODO: do not animate text is sucks find something else
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
function resetThings() {
  clearInterval(interval);
  document.getElementById("timer").innerHTML = "--:--";
  document.getElementById("timer").classList.remove("btn-outline-danger");
  document.getElementById("timer").classList.add("btn-outline-success");
  if (now < questions.length) doquiz();
}
function gotTheAnswer(elem) { 
  if (elem.id == solutions[now - 1]) correct++;
  resetThings();
}
