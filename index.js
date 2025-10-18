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

function StartGame() {
  // input 열 nodelist 로 가져오기
  const inputRows = document.querySelectorAll(".wordle-row");
  // NodeList to Array
  let currentRowInputs = [...inputRows[currentRow].children];

  if (currentRowInputs) {
    currentRowInputs.forEach((input) => {
      input.removeAttribute("disabled");
    });
    currentRowInputs[0].focus();
  }

  const keyboard = [
    "a","b","c","d","e","f","g","h","i","j",
    "k","l","m","n","o","p","q","r","s","t",
    "u","v","w","x","y","z","backspace"
  ];
  
  currentRowInputs.forEach((input, index) => {
    input.addEventListener("keyup", (e) => {
        const userKeyEvent = e.key.toLowerCase()
        console.log(userKeyEvent)
        if(keyboard.includes(`${userKeyEvent}`)) { //알파벳과 Backspace 선별
            if(e.key !== "Backspace") {
                if(index < 3) {
                    //input에 입력시 다음칸으로 이동
                    currentRowInputs[index+1].focus()
                }
            } else {
                //백스페이스 눌렀을때 이전 칸 이동
                if(!currentRowInputs[index].value) {
                    if(index > 0) {
                        currentRowInputs[index-1].focus()
                    }
                }
            }
        }
    })
  })

  //채점 및 다음 줄 이동
  document.addEventListener("keypress", (e) => {
    //Enter키 입력확인
      if(e.key === "Enter") {        
        //글자 합치기
        let userAnswer = ""
        for(let i=0; i < 4; i++) {
            userAnswer += currentRowInputs[i].value
        }

        //현재 열의 input 안에 모두 글자가 입력된 상태인지 확인
        if(userAnswer.length == 4) {
            if(userAnswer === answer) { //답 비교
                //색 처리
                document.write("Correct!!")
            } else{
                //색처리 후 다음줄로 이동
                currentRowInputs.forEach((input) => {
                    input.setAttribute("disabled", "");
                });
                currentRow++;
                currentRowInputs = [...inputRows[currentRow].children];
                currentRowInputs.forEach((input) => {
                    input.removeAttribute("disabled");
                });
                currentRowInputs[0].focus();
                // 네글자 넘어가면 실패화면 표시
            }
        } else {
            // 네글자 모두 입력하라고 안내
        }

    }
  })

}

StartGame();
//disabled 클래스
