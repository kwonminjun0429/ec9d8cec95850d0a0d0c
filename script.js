const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const volumeSlider = document.getElementById("volume");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");
const lyricLines = document.querySelectorAll(".lyrics p");

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸ 일시정지";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶ 재생";
  }
}

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;

  // 진행 바 갱신
  const percent = (currentTime / audio.duration) * 100;
  progressBar.style.width = percent + "%";

  // 현재 가사 강조 및 자동 스크롤
  let currentLine = null;
  for (let i = 0; i < lyricLines.length; i++) {
    const lineTime = parseFloat(lyricLines[i].dataset.time);
    const nextTime = i + 1 < lyricLines.length
      ? parseFloat(lyricLines[i + 1].dataset.time)
      : Infinity;

    if (currentTime >= lineTime && currentTime < nextTime) {
      currentLine = lyricLines[i];
      break;
    }
  }

  lyricLines.forEach((line) => line.classList.remove("active"));
  if (currentLine) {
    currentLine.classList.add("active");
    currentLine.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

function seekAudio(e) {
  if (isNaN(audio.duration) || !isFinite(audio.duration)) return;

  const rect = progress.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percentage = x / progress.offsetWidth;
  audio.currentTime = percentage * audio.duration;
}

audio.addEventListener("ended", () => {
  playPauseBtn.textContent = "▶ 재생";
});