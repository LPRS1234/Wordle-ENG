import { wordList } from "./word.js";

// 정답 생성
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // 최댓값은 제외, 최솟값은 포함
}

const index = getRandomInt(0, wordList.length);
const answer = wordList[index];
console.log(answer);

let currentRow = 0;
let isPlaying = true;


// input 열 nodelist 로 가져오기
const inputRows = document.querySelectorAll(".wordle-row");
// NodeList to Array
let currentRowInputs = [...inputRows[currentRow].children];

//현재 줄 비활성화 해제
if (currentRowInputs) {
  currentRowInputs.forEach((input) => {
    input.removeAttribute("disabled");
  });
  currentRowInputs[0].focus();
}

const keyboard = [..."abcdefghijklmnopqrstuvwxyz", "backspace"];

const board = document.querySelector(".inputs");

board.addEventListener("keyup", (e) => {
  const input = e.target;

  if (input.tagName !== "INPUT") return; //input이 아닌 태그에 대한 이벤트 다 제외

  const userKeyEvent = e.key.toLowerCase();
  if (!keyboard.includes(userKeyEvent)) return; //허용 키 선별

  let index = currentRowInputs.indexOf(input);

  if (e.key !== "Backspace") {
    if (index < 3) {
      //input에 입력시 다음칸으로 이동
      currentRowInputs[index + 1].focus();
    }
  } else {
    //백스페이스 눌렀을때 이전 칸 이동
    if (!currentRowInputs[index].value) {
      if (index > 0) {
        currentRowInputs[index - 1].focus();
      }
    }
  }
});

//결과 화면 가져오기
const popUpPage = document.querySelector(".popup-page");

//채점 및 다음 줄 이동
document.addEventListener("keypress", (e) => {
  //색 정의
  const green = "#538D4E";
  const yellow = "#B59F3B";
  const grey = "#3A3A3C";
  const text = "#F8F8F8";

  // 정답 분리
  let splitedAnswer = answer.split("");


  //Enter키 입력확인
  if (e.key === "Enter") {
    //글자 합치기
    let userAnswer = "";
    for (let i = 0; i < 4; i++) {
      userAnswer += currentRowInputs[i].value;
    }

    //현재 열의 input 안에 모두 글자가 입력된 상태인지 확인
    if (userAnswer.length == 4) {
      if (userAnswer === answer) {
        //답 비교
        currentRowInputs.forEach((input) => {
          //색 처리
          input.style.color = text;
          input.style.backgroundColor = green;
          //현재 줄 비활성화
          input.setAttribute("disabled", "");

          //승리화면 표시

          popUpPage.innerHTML = `
            <div>
                <h2>You Win!!</h2>
                <h3>Answer was ${answer}!!</h3>
                <button class="restart">Restart</button>
            </div>
          `;

          popUpPage.classList.remove("none");
        });
      } else {
        if (currentRow == 4) {
          // 기회 모두 소진 시 실패화면 표시

          currentRowInputs.forEach((input, index) => {
            // 색처리, 줄 비활성화
            const value = input.value;
            if (value === splitedAnswer[index]) {
              input.style.color = text;
              input.style.backgroundColor = green;
              input.setAttribute("disabled", "");
            } else if (splitedAnswer.includes(value)) {
              input.style.color = text;
              input.style.backgroundColor = yellow;
              input.setAttribute("disabled", "");
            } else {
              input.style.color = text;
              input.style.backgroundColor = grey;
              input.setAttribute("disabled", "");
            }
          });

          //실패 화면 띄우기
          popUpPage.innerHTML = `
            <div>
                <h2>You Lose..</h2>
                <h3>Answer is ${answer}!</h3>
                <button class="restart">Restart</button>
            </div>
          `;

          popUpPage.classList.remove("none");
          return;
        }
        //색처리 후 다음줄로 이동 (색처리 아직 안됨)

        currentRowInputs.forEach((input, index) => {
          // 색처리, 줄 비활성화
          const value = input.value;
          if (value === splitedAnswer[index]) {
            input.style.color = text;
            input.style.backgroundColor = green;
            input.setAttribute("disabled", "");
          } else if (splitedAnswer.includes(value)) {
            input.style.color = text;
            input.style.backgroundColor = yellow;
            input.setAttribute("disabled", "");
          } else {
            input.style.color = text;
            input.style.backgroundColor = grey;
            input.setAttribute("disabled", "");
          }
        });

        currentRowInputs.forEach((input) => {
          input.setAttribute("disabled", "");
        });
        currentRow++;
        currentRowInputs = [...inputRows[currentRow].children];
        currentRowInputs.forEach((input) => {
          input.removeAttribute("disabled");
        });
        currentRowInputs[0].focus();
      }
    } else {
      //경고 메시지 띄우기
      const warningMessage = document.querySelector(".warning");
      warningMessage.classList.remove("none");
      setTimeout(() => {
        warningMessage.classList.add("none");
      }, 3000);
    }
  }
});