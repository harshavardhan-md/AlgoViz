let isRunning = false;
let timeoutIds = [];
let startTime, endTime;
// const timerElement = document.getElementById('timer');

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');

  startButton.addEventListener('click', startSorting);
  stopButton.addEventListener('click', stopSorting);
});

function startSorting() {
  if (isRunning) return;

  const inputArray = document.getElementById('inputArray').value.split(',').map(Number);
  const container = document.getElementById('container');
  container.innerHTML = '';

  inputArray.forEach(value => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${value * 2}px`; // Adjusting height scaling for better visualization
    bar.textContent = value;
    container.appendChild(bar);
  });

  const bars = document.querySelectorAll('.bar');
  isRunning = true;
  startTime = new Date();
  // updateTimer();
  insertionSort(bars);
}

function stopSorting() {
  isRunning = false;
  timeoutIds.forEach(id => clearTimeout(id));
  timeoutIds = [];
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => bar.classList.remove('comparing', 'swapping', 'sorted'));
  // updateTimer(true);
}

function insertionSort(bars) {
  let i = 1;

  function moveNext() {
    if (!isRunning) return;
    if (i < bars.length) {
      let j = i;
      const tempHeight = bars[j].style.height;
      const tempValue = bars[j].textContent;

      function compareAndSwap() {
        if (!isRunning) return;
        if (j > 0 && parseInt(bars[j].textContent) < parseInt(bars[j - 1].textContent)) {
          bars[j].classList.add('comparing');
          bars[j - 1].classList.add('comparing');

          const compareId = setTimeout(() => {
            bars[j].classList.remove('comparing');
            bars[j - 1].classList.remove('comparing');
            
            gsap.to(bars[j], { x: -35, duration: 0.3, yoyo: true, repeat: 1, ease: "power1.inOut" });
            gsap.to(bars[j - 1], { x: 35, duration: 0.3, yoyo: true, repeat: 1, ease: "power1.inOut" });

            bars[j].classList.add('swapping');
            bars[j - 1].classList.add('swapping');

            const swapId = setTimeout(() => {
              swap(bars, j, j - 1);
              bars[j].classList.remove('swapping');
              bars[j - 1].classList.remove('swapping');
              j--;
              compareAndSwap();
            }, 600);
            timeoutIds.push(swapId);
          }, 600);
          timeoutIds.push(compareId);
        } else {
          bars[j].classList.add('sorted');
          i++;
          moveNext();
        }
      }
      compareAndSwap();
    } else {
      for (let k = 0; k < bars.length; k++) {
        bars[k].classList.add('sorted');
      }
      isRunning = false;
      // updateTimer(true);
    }
  }

  moveNext();
}

function swap(bars, i, j) {
  const tempHeight = bars[i].style.height;
  const tempValue = bars[i].textContent;
  bars[i].style.height = bars[j].style.height;
  bars[i].textContent = bars[j].textContent;
  bars[j].style.height = tempHeight;
  bars[j].textContent = tempValue;
}



