const quizData = [
  {
    zh: "在雪下走路的人",
    en: "A person walking in the snow",
    image: "assets/snow_walk.gif",
    options: [
      { zh: "繼續走，不回頭", en: "Keep walking without looking back", trait: "T" },
      { zh: "猶豫，但前進", en: "Hesitate but move on", trait: "F" }
    ]
  },
  {
    zh: "結冰的溪水，一個人掉進去",
    en: "A frozen stream where someone falls in",
    image: "assets/stream_fall.gif",
    options: [
      { zh: "立刻求救", en: "Call for help immediately", trait: "F" },
      { zh: "自己掙扎爬出來", en: "Struggle to climb out yourself", trait: "T" }
    ]
  },
  {
    zh: "在雪下點火，火熄滅",
    en: "Lighting a fire in the snow, then it goes out",
    image: "assets/fire_out.gif",
    options: [
      { zh: "立刻再點一次", en: "Try to light it again immediately", trait: "J" },
      { zh: "等一下再試", en: "Wait a while and try later", trait: "P" }
    ]
  },
  {
    zh: "手抖抖抖，不能動",
    en: "Hands shaking uncontrollably, unable to move",
    image: "assets/hands_shake.gif",
    options: [
      { zh: "冷靜想解法", en: "Calmly think of a solution", trait: "I" },
      { zh: "大喊求救", en: "Shout for help", trait: "E" }
    ]
  }
];

const radarLabels = {
  I: "內向 I / Introversion",
  E: "外向 E / Extraversion",
  T: "思考 T / Thinking",
  F: "情感 F / Feeling",
  J: "判斷 J / Judging",
  P: "知覺 P / Perceiving"
};

let currentQuestion = 0;
let scores = { I: 0, E: 0, T: 0, F: 0, J: 0, P: 0 };
let currentLang = 'zh';

const questionContainer = document.getElementById("question-container");
const answerButtons = document.getElementById("answer-buttons");
const resultSection = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const resultImage = document.getElementById("result-image");
const resultText = document.getElementById("result-text");

function showQuestion() {
  const q = quizData[currentQuestion];
  document.getElementById("quiz-container").style.backgroundImage = `url('${q.image}')`;
  questionContainer.innerText = q[currentLang];
  answerButtons.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt[currentLang];
    btn.onclick = () => handleAnswer(opt.trait);
    answerButtons.appendChild(btn);
  });
}

function handleAnswer(trait) {
  scores[trait]++;
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quiz-container").classList.add("hidden");
  resultSection.classList.remove("hidden");

  let mbti = "";
  mbti += scores["I"] >= scores["E"] ? "I" : "E";
  mbti += scores["T"] >= scores["F"] ? "T" : "F";
  mbti += scores["J"] >= scores["P"] ? "J" : "P";

  resultTitle.innerText = `你的類型是 ${mbti}`;
  resultImage.src = `assets/mbti/${mbti}.png`;
  resultText.innerText = "（根據你的選擇，這是你在極地生存中的人格傾向）";

  const ctx = document.getElementById("radarChart").getContext("2d");
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: Object.values(radarLabels),
      datasets: [{
        label: "性格傾向",
        data: [
          scores["I"], scores["E"],
          scores["T"], scores["F"],
          scores["J"], scores["P"]
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      }]
    },
    options: {
      scale: {
        ticks: { beginAtZero: true, max: 3 }
      }
    }
  });
}

function switchLanguage(lang) {
  currentLang = lang;
  document.getElementById("quiz-title").textContent =
    lang === "zh" ? "To Build a Fire：極地環境下看你的性格" : "To Build a Fire: Discover Your Arctic Personality";
  if (currentQuestion < quizData.length) showQuestion();
}
