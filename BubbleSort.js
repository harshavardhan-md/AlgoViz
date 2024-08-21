const arrayContainer = document.getElementById('array');
const startBtn = document.getElementById('startBtn');
const randomBtn = document.getElementById('randomBtn');
const resetBtn = document.getElementById('resetBtn');
const inputArray = document.getElementById('inputArray');
// const timerDisplay = document.getElementById('timer');

const bubbleColors = ['#dd919e', '#91b4e1', '#f39e5c'];

function createBubbles(arr) {
    arrayContainer.innerHTML = '';
    arr.forEach((value, index) => {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.innerText = value;
        bubble.style.backgroundColor = bubbleColors[index % bubbleColors.length];
        arrayContainer.appendChild(bubble);
    });
}

function getRandomArray(size, min, max) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

startBtn.addEventListener('click', () => {
    const input = inputArray.value;
    const arr = input ? input.split(',').map(Number) : getRandomArray(7, 10, 99);
    createBubbles(arr);
    bubbleSort(arr);
});

randomBtn.addEventListener('click', () => {
    const arr = getRandomArray(7, 10, 99);
    createBubbles(arr);
    inputArray.value = arr.join(',');
});

resetBtn.addEventListener('click', () => {
    arrayContainer.innerHTML = '';
    // timerDisplay.innerText = 'Time: 0s';
    inputArray.value = '';
});

function bubbleSort(arr) {
    const bubbles = Array.from(document.querySelectorAll('.bubble'));
    let n = bubbles.length;
    let swapped;
    const startTime = performance.now();

    function swap(i, j) {
        return new Promise(resolve => {
            const bubble1 = bubbles[i];
            const bubble2 = bubbles[j];
            const tempX = parseFloat(getComputedStyle(bubble1).transform.split(',')[4] || 0);
            gsap.to(bubble1, { x: 60 * (j - i), duration: 1 });
            gsap.to(bubble2, { x: -60 * (j - i), duration: 1, onComplete: () => {
                arrayContainer.insertBefore(bubble2, bubble1);
                bubbles[i] = bubble2;
                bubbles[j] = bubble1;
                gsap.set(bubble1, { x: 0 });
                gsap.set(bubble2, { x: 0 });
                resolve();
            }});
        });
    }

    async function sort() {
        for (let i = 0; i < n - 1; i++) {
            swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                const bubble1 = bubbles[j];
                const bubble2 = bubbles[j + 1];
                const val1 = parseInt(bubble1.innerText);
                const val2 = parseInt(bubble2.innerText);

                if (val1 > val2) {
                    await swap(j, j + 1);
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        // timerDisplay.innerText = `Time: ${duration}s`;
    }

    sort();
}

// Initialize with a random array
randomBtn.click();
