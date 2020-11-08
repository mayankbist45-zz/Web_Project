let questions = [];
let solutions = [];
let curList = ["1", "2", "3", "4"];
let curList2 = ["A). ", "B). ", "C). ", "D). "];
let interval;
let correct = 0;

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
  doquiz();
}
function doTimer() {
  // todo need to change it to 20
  let count = 19;
  interval = setInterval(function () {
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
      resetThings();
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
  // TODO: do not animate text it sucks find something else
  // animateQuestion();
  const choice = document.getElementsByClassName("choice");
  Object.keys(choice).forEach((ele) => {
    choice[ele].style.visibility = "visible";
  });
  let mx = 0;
  for (let i = 0; i < 4; i++)
    if (mx < questions[now][1][i].length) mx = questions[now][1][i].length;

  for (let i = 0; i < 4; i++) {
    document.getElementById(curList[i]).style.width = mx;
    document.getElementById(curList[i]).innerHTML =
      curList2[i] + questions[now][1][i];
  }
  doTimer();
  now++;
  // if (now < questions.length) setTimeout(doquiz, 3000);
}
function resetThings() {
  clearInterval(interval);
  document.getElementById("timer").innerHTML = "00:20";
  document.getElementById("timer").classList.remove("btn-outline-danger");
  document.getElementById("timer").classList.add("btn-outline-success");
  if (now < questions.length) doquiz();
  else showScore();
}
function gotTheAnswer(elem) {
  if (elem.id == solutions[now - 1]) correct++;
  resetThings();
}

function showScore() {
  let lt = [correct, questions.length];
  localStorage.setItem("result", lt);
  // window.location.href = "../result/result.html";
  document.getElementsByClassName("container")[0].remove();
  document.getElementById("timer").innerHTML = "Results";
  const choice = document.getElementsByClassName("choice");
  Object.keys(choice).forEach((ele) => {
    choice[ele].remove();
  });
  document.getElementById("score").innerHTML =
    "Your score is " + correct.toString() + " out of 10";
  var tp = document.getElementById("complement");
  if (correct < 3) tp.innerHTML = "You need more practice.";
  else if (correct < 6) tp.innerHTML = "U are okeish";
  else if (correct < 10) tp.innerHTML = "U are some kind of weird cheater";
  else tp.innerHTML = "ok ok you are a genius";
}
