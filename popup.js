
// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}


//generate random question
let getQuestion = document.getElementById("getQuestion");
getQuestion.addEventListener("click", async () => {
  document.getElementsByClassName("loader1")[0].style.display = "block";
  var e = document.getElementById("topic");
  var topic = e.value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var graphql = JSON.stringify({
    query: `query getTopicTag($slug: String!) {topicTag(slug: $slug){name translatedName questions{status title difficulty titleSlug acRate}} }`,
    variables: { "slug": `${topic}` }
  })
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: graphql
  };

  fetch("https://salty-waters-49462.herokuapp.com/leetcode.com/graphql", requestOptions)
    .then(response => response.json())
    .then(result => {
      var array = ["Easy", "Medium", "Hard"]
      let difficulty = document.querySelector('input[name="difficulty"]:checked').value;
      if (difficulty === "Random") {
        difficulty = array[Math.floor(Math.random() * array.length)];
      }

      let questionsArray = result.data.topicTag.questions || [];
      let filteredquestions = questionsArray.filter(item => item.difficulty === difficulty);
      let size = filteredquestions.length;
      let randomQuestion = Math.floor(Math.random() * size);
      var problemURL = `https://leetcode.com/problems/${filteredquestions[randomQuestion].titleSlug}`;
      document.getElementsByClassName("loader1")[0].style.display = "none";
      document.getElementById("problemURL").setAttribute("href", problemURL);
      document.getElementById("problemURL").style.display = "";
      document.getElementById("question").innerHTML = filteredquestions[randomQuestion].title;
      document.getElementById("difficulty").innerHTML = difficulty;
      // document.getElementById("acRate").innerHTML = filteredquestions[randomQuestion].acRate;
      // document.getElementById("desc").style.visibility = "hidden";
    })
    .catch(error => {
      document.getElementById("question").innerHTML = error;
    });
});


// signUp Button
const signupBtn1 = document.getElementById('submit-btn-signup');

signupBtn1.addEventListener('click', (e) => {
  var signupDiv = document.getElementById("signupDiv");
  var loginDiv = document.getElementById("loginDiv");
  document.getElementById("getQuestion").click();
  document.getElementsByClassName("loader")[0].style.display = "block";
  // display the problem solved status
  let leetCodeId = document.getElementById("leetcodeId").value;
  // let username = leetCodeId;
  chrome.storage.sync.set({ username });
  
  fetch(`https://salty-waters-49462.herokuapp.com/leetcode-stats-six.vercel.app/api?username=${leetCodeId}&theme=dark`, { 'Access-Control-Allow-Origin': '*' })
    .then(response => response.text())
    .then(data => {
      // chrome.storage.sync.get('username', ({ name }) => {
      //   console.log('name: ', name)
      //   document.getElementById('username').innerHTML = name;
      // });
      if (leetCodeId.length <=0 || data === 'Username does not exist') {
        document.getElementsByClassName("loader")[0].style.display = "none";
        document.getElementById("invalidCreds").innerHTML = 'Invalid LeetCode Id';
        document.getElementsByClassName("invalidCreds")[0].style.display = "block";
      }
      else{
        document.getElementById("stats").innerHTML = data;
        signupDiv.classList.add("slide-up");
        loginDiv.classList.remove("slide-up");
        document.getElementById("loginDiv").style.visibility = "visible";
        document.getElementById("signupDiv").style.visibility = "hidden";
        document.getElementsByClassName("loader")[0].style.display = "none";
        document.getElementsByClassName("invalidCreds")[0].style.display = "none";
      }

    }).catch((err) => {
      document.getElementById("stats").innerHTML = err;
      console.log('error: ', err);
    });

});

document.getElementById("login").addEventListener("click", goToLogin);

function goToLogin(){
  signupDiv.classList.remove("slide-up");
  loginDiv.classList.add("slide-up");
  document.getElementById("loginDiv").style.visibility = "hidden";
  document.getElementById("signupDiv").style.visibility = "visible";
}
