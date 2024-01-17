const FLASHING_INTERVAL = 900000; // 15 minutes
const FLASH_DURATION = 15000; // 15 seconds
const FLASHING_FREQUENCY = 500; // 500 ms interval between flashes


const START_TIME = 6; // 6:00
const END_TIME = 20; // 8:00

const GREEN_COLOR = '#4CAF50';
const RED_COLOR = '#F44336';

function shouldFlash(currentTime) {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  // Check if the current time is within the flashing window and on a 15-minute mark
  return hours >= START_TIME && hours < END_TIME && totalMinutes % 15 === 0;
}

function formatTime(time) {
  // formate time to hh:mm
  const hours = time.getHours();
  const minutes = time.getMinutes();
  return `${hours}:${minutes}`;
}


document.addEventListener('DOMContentLoaded', function() {
  const background = document.getElementById('background');
  const alarm = document.getElementById('alarmAudio');
  const startButton = document.getElementById('startButton');

  startButton.addEventListener('click', function() {
    startButton.style.display = 'none'; // Hide the button after clicking
  });

  setInterval(function() {
    const currentTime = new Date();
    console.debug(`Checking if should flash at ${currentTime.toString()}...`);
    if (shouldFlash(currentTime)) {
      console.debug(`Starting flashing at ${currentTime.toString()}...`);
      flashBackground();
    }
  }, 1000); // Check every second

  function flashBackground() {
    let count = 0;
    let isRed = false;

    console.debug(`Starting audio playback at ${new Date().toString()}...`)
    alarm.play(); // Start playing the alarm when flashing starts

    const flashInterval = setInterval(function() {
      background.style.backgroundColor = isRed ? GREEN_COLOR : RED_COLOR;
      isRed = !isRed;

      if (++count >= FLASH_DURATION / FLASHING_FREQUENCY) {
        clearInterval(flashInterval);
        alarm.pause(); // Stop the alarm when flashing ends
        alarm.currentTime = 0; // Reset alarm to start
        background.style.backgroundColor = GREEN_COLOR; // Revert to green
      }
    }, FLASHING_FREQUENCY);
  }
});
