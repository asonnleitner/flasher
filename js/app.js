const FLASHING_INTERVAL = 900000; // 15 minutes


const START_TIME = 6; // 6:00
const END_TIME = 20; // 8:00


document.addEventListener('DOMContentLoaded', function() {
  const background = document.getElementById('background');
  const alarm = document.getElementById('alarmAudio');
  const startButton = document.getElementById('startButton');

  startButton.addEventListener('click', function() {
    startButton.style.display = 'none'; // Hide the button after clicking

    setInterval(function() {
      const currentTime = new Date();
      const hours = currentTime.getHours();

      // Check if the current time is between 6:00 and 20:00
      if (hours >= START_TIME && hours < END_TIME) {
        flashBackground();
      }
    }, FLASHING_INTERVAL);
  });

  function flashBackground() {
    let count = 0;
    let isRed = false;

    // Start playing the alarm
    alarm.play();

    const flashInterval = setInterval(function() {
      if (isRed) {
        background.style.backgroundColor = '#4CAF50'; // Green
      } else {
        background.style.backgroundColor = '#F44336'; // Red
      }
      isRed = !isRed;

      if (++count >= 30) { // 15 seconds have passed
        clearInterval(flashInterval);
        alarm.pause(); // Stop the alarm
        alarm.currentTime = 0; // Reset the alarm to start
        background.style.backgroundColor = '#008000'; // Revert to green
      }
    }, 500); // 500 ms interval between flashes
  }
});

