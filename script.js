const clock = document.querySelector('#clock');
const year = document.querySelector('#year');
const frequencyButton = document.querySelector('#frequencyButton');

function updateClock() {
  clock.textContent = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());
}

updateClock();
setInterval(updateClock, 1000);
year.textContent = new Date().getFullYear();

frequencyButton.addEventListener('click', () => {
  document.body.classList.remove('glitch');
  void document.body.offsetWidth;
  document.body.classList.add('glitch');
  frequencyButton.textContent = 'FREQUENCY ALTERED';

  window.setTimeout(() => {
    document.body.classList.remove('glitch');
    frequencyButton.textContent = 'CHANGE FREQUENCY';
  }, 1100);
});
