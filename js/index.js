let powerOn = false;
let standardMode = false;
let strictMode = false;

let game = {
  gameStarted: false,
  compSequence: [],
  userSequence: [],
  correctSequence: false,
  displayBox: function(text) {
    document.getElementById("rounds").textContent = text;
  },
  regEx: /[1-4]/,
  elName: "",
  clName: "",
  indexName: function(index) {
    switch (index) {
      case 1:
        game.elName = "red";
        game.clName = "redLight";
        break;
      case 2:
        game.elName = "green";
        game.clName = "greenLight";
        break;
      case 3:
        game.elName = "yellow";
        game.clName = "yellowLight";
        break;
      case 4:
        game.elName = "blue";
        game.clName = "blueLight";
        break;
      default:
        return "No element found";
    }
  },
  randNum: function() {
    game.compSequence.push(Math.floor(Math.random() * 4 + 1));
  },
  convertStringToClass: function(k) {
    let lightColor = `${k}Light`;
    return lightColor;
  },
  animateLight: function(el, cl) {
    el.classList.add(cl);
    setTimeout(function() {
      el.classList.remove(cl);
    }, 750);
  },
  playAudio: function(input) {
    const audioFile = new Audio(
      `https://s3.amazonaws.com/freecodecamp/simonSound${input}.mp3`
    );
    audioFile.play();
  },
  generateSequence: function(arr) {
    for (var i = 0; i < arr.length; i++) {
      (function(e) {
        setTimeout(function() {
          game.playAudio(arr[e]);
          game.indexName(arr[e]);
          game.animateLight(document.getElementById(game.elName), game.clName);
        }, 1000 * e);
      })(i);
    }
  },
  testEquality: function(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] === arr2[i]) {
        game.correctSequence = true;
      } else if (arr1[i] !== arr2[i]) {
        game.correctSequence = false;
        game.fail();
        game.gameStarted = false;
      }
    }
  },
  success: function() {
    document.getElementById("game-wrapper").classList.add("greenLight");
    setTimeout(function() {
      document.getElementById("game-wrapper").classList.remove("greenLight");
    }, 750);
  },
  fail: function() {
    document.getElementById("game-wrapper").classList.add("redLight");
    setTimeout(function() {
      document.getElementById("game-wrapper").classList.remove("redLight");
    }, 750);
  }
};
let roundsWon = 0;
var modal = document.getElementById("modal");
var close = document.getElementsByClassName("close")[0];

function modalMessage(text) {
  document.getElementById("message-body").textContent = text;
}

game.displayBox(roundsWon);

document.addEventListener("click", function(e) {
  var element = e.target.id;
  var el = document.getElementById(element);
  var lightColor = game.convertStringToClass(element);
  var input = parseInt(e.target.dataset.val);
  if(document.getElementById('switch').checked) {
    powerOn = true;
    console.log('true');
  } else {
    powerOn = false;
    game.userSequence = [];
    game.compSequence = [];
    roundsWon = 0;
    game.displayBox(roundsWon);
    game.gameStarted = false;
  }
  if (powerOn == true) {
   
    console.log(input);
    
    if (input === 0 && game.gameStarted === false) {
      game.randNum();
      game.generateSequence(game.compSequence);
      standardMode = true;
    }
    
    if (input === 7 && game.gameStarted === false) {
      game.randNum();
      game.generateSequence(game.compSequence);
      strictMode = true;
    }
    
    game.playAudio(input);
    game.animateLight(el, lightColor);
    
    if (game.regEx.test(input)) {
      game.userSequence.push(input);
      game.gameStarted = true;

      if (game.userSequence.length === game.compSequence.length) {
        game.testEquality(game.compSequence, game.userSequence);

        if (game.correctSequence) {
          game.success();
          roundsWon++;
          game.displayBox(roundsWon);
          game.userSequence = [];
          game.randNum();
          setTimeout(function() {
            game.generateSequence(game.compSequence);
          }, 1200);
          if (roundsWon === 20) {
            modalMessage("You Win!");
            roundsWon = roundsWon * 0;
            game.displayBox(roundsWon);
            document.getElementById("switch").checked = false;
            game.userSequence = [];
            game.compSequence = [];
            modal.style.display = "block";
            close.onclick = function() {
              modal.style.display = "none";
              game.gameStarted = false;
            };
            
            window.onclick = function(event) {
              if (event.target == modal) {
                modal.style.display = "none";
              }
            };
          }
        } else if (strictMode) {
          game.fail();
          modalMessage("You Lose!");
          game.userSequence = [];
          game.compSequence = [];
          modal.style.display = "block";
          close.onclick = function() {
            modal.style.display = "none";
            roundsWon = 0;
            game.gameStarted = false;
          };
          window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
          };
        } else if (standardMode) {
          game.fail();
          game.userSequence = [];
          setTimeout(function() {
            game.generateSequence(game.compSequence);
          }, 1200);
        }
      }
    }
  }
});