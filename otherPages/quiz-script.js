let questions = [];
let curList = ["1", "2", "3", "4"];
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
    questions.push([question.question, tp]);
  });
  doquiz();
}
function doTimer(){
  let count = 15;
  var interval = setInterval(function () {
    console.log(document.getElementById("timer"));
    document.getElementById("timer").innerHTML = count;
    count--;
    if (count == 0) {
      clearInterval(interval);
      document.getElementById("timer").innerHTML = "Timer";
      if (now < questions.length) doquiz();
    }
  }, 1000);
}
getProblems();
let now = 0;
function doquiz() {
  //put question and answers here
  // alert('getting called');
  let question = document.getElementById("question");
  document.getElementById("number").textContent = (
    (now + 1).toString() + ")."
  ).toString();
  question.textContent = questions[now][0];
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
