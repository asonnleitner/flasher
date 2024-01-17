const FLASHING_FREQUENCY = 500; // 500 ms interval between flashes
const FLASHING_MINUTE_INTERVAL = 15; // 15 minutes
const FLASHING_DURATION = 15; // 15 seconds
const FLASHING_DURATION_MS = FLASHING_DURATION * 1000;

const START_TIME = 6; // 6:00 AM
const END_TIME = 20; // 8:00 PM

const GREEN_COLOR = '#4CAF50';
const RED_COLOR = '#F44336';

let soundEnabled = false;
let isFlashing = false;
let background, alarm;

function isWithinOperatingHours() {
  const hours = new Date().getHours();
  return hours >= START_TIME && hours < END_TIME;
}

function getNextFlashTime() {
  const now = new Date();
  if (now.getMinutes() % FLASHING_MINUTE_INTERVAL === 0 && now.getSeconds() < FLASHING_DURATION) {
    return now; // Flash now if within the current flashing period
  }
  const next = new Date(now);
  next.setMinutes(FLASHING_MINUTE_INTERVAL * Math.ceil(now.getMinutes() / FLASHING_MINUTE_INTERVAL), 0, 0);
  return next;
}

function getFlashPeriodStart() {
  const now = new Date();
  now.setSeconds(0, 0); // Reset seconds and milliseconds
  const minutes = now.getMinutes();
  const roundedMinutes = minutes - (minutes % FLASHING_MINUTE_INTERVAL);
  now.setMinutes(roundedMinutes);
  return now;
}

function flashBackground() {
  if (isFlashing || !isWithinOperatingHours()) return;

  const flashPeriodStart = getFlashPeriodStart();
  const flashPeriodEnd = new Date(flashPeriodStart.getTime() + FLASHING_DURATION_MS);
  const now = new Date();

  if (now >= flashPeriodStart && now < flashPeriodEnd) {


    isFlashing = true;
    let isRed = false;

    if (soundEnabled && !document.hidden) {
      alarm.play();
    }

    const interval = setInterval(() => {
      const currentTime = new Date();

      if (currentTime >= flashPeriodEnd) {
        clearInterval(interval);
        isFlashing = false;

        // Ensure the alarm is stopped at the exact end time of the flashing period
        if (soundEnabled) {
          alarm.pause();
          alarm.currentTime = 0;
        }

        background.style.backgroundColor = GREEN_COLOR;
        return;
      }

      isRed = !isRed;
      background.style.backgroundColor = isRed ? RED_COLOR : GREEN_COLOR;
    }, FLASHING_FREQUENCY);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  background = document.getElementById('background');
  alarm = document.getElementById('alarmAudio');
  const startButton = document.getElementById('startButton');

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      alarm.pause();
      alarm.currentTime = 0;
    }
  });

  startButton.addEventListener('click', () => {
    soundEnabled = true;
    startButton.style.display = 'none';
  });

  setInterval(() => {
    const now = new Date();
    const nextFlashTime = getNextFlashTime();
    if (now >= nextFlashTime && now < new Date(nextFlashTime.getTime() + FLASHING_DURATION_MS)) {
      flashBackground();
    }
  }, 250);
});
