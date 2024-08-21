document.getElementById('randomize').addEventListener('click', () => {
    for (let i = 1; i <= 6; i++) {
        document.getElementById('box' + i).value = Math.floor(Math.random() * 100);
    }
});

document.getElementById('clear').addEventListener('click', () => {
    for (let i = 1; i <= 6; i++) {
        document.getElementById('box' + i).value = '';
    }
});

document.getElementById('start').addEventListener('click', () => {
    const array = [];
    for (let i = 1; i <= 6; i++) {
        const value = document.getElementById('box' + i).value;
        if (value !== '') {
            array.push(Number(value));
        }
    }
    console.log('Start sorting with array:', array);
    visualizeSplitting(array);
});

function visualizeSplitting(array) {
    const display = document.getElementById('array-display');
    display.innerHTML = '';
    const steps = [];
    
    steps.push(createArrayRow([array]));
    
    const firstHalf = array.slice(0, array.length / 2);
    const secondHalf = array.slice(array.length / 2);
    
    steps.push(createArrayRow([firstHalf, secondHalf]));

    const firstQuarter = firstHalf.slice(0, firstHalf.length / 2);
    const secondQuarter = firstHalf.slice(firstHalf.length / 2);
    const thirdQuarter = secondHalf.slice(0, secondHalf.length / 2);
    const fourthQuarter = secondHalf.slice(secondHalf.length / 2);

    steps.push(createArrayRow([firstQuarter, secondQuarter, thirdQuarter, fourthQuarter]));

    const finalStep = firstQuarter.concat(secondQuarter).concat(thirdQuarter).concat(fourthQuarter).map(value => [value]);
    steps.push(createArrayRow(finalStep));

    const timeline = gsap.timeline();
    steps.forEach((step, index) => {
        const row = step;
        row.style.opacity = 0;
        display.appendChild(row);
        timeline.to(row, {
            duration: 1,
            opacity: 1,
            y: index * 3,
            ease: "power1.inOut"
        });
    });

    setTimeout(() => visualizeMerging(finalStep), steps.length * 1000);
}

function createArrayRow(subArrays) {
    const row = document.createElement('div');
    row.className = 'array-row';
    subArrays.forEach(subArray => {
        const subArrayDiv = document.createElement('div');
        subArrayDiv.className = 'sub-array';
        subArray.forEach(value => {
            const el = document.createElement('div');
            el.className = 'array-element';
            el.innerHTML = value !== null ? value : '';
            subArrayDiv.appendChild(el);
        });
        row.appendChild(subArrayDiv);
    });
    return row;
}

async function visualizeMerging(array) {
    const display = document.getElementById('merge-display');
    display.innerHTML = '';
    const steps = [];
    
    steps.push(createArrayRow(array));
    
    let mergedArray = [];
    for (let i = 0; i < array.length; i += 2) {
        if (i + 1 < array.length) {
            mergedArray.push(await mergeArrays(array[i], array[i + 1]));
        } else {
            mergedArray.push(array[i]);
        }
    }
    steps.push(createArrayRow(mergedArray));

    let nextMergedArray = [];
    for (let i = 0; i < mergedArray.length; i += 2) {
        if (i + 1 < mergedArray.length) {
            nextMergedArray.push(await mergeArrays(mergedArray[i], mergedArray[i + 1]));
        } else {
            nextMergedArray.push(mergedArray[i]);
        }
    }
    steps.push(createArrayRow(nextMergedArray));

    const finalMergedArray = await mergeArrays(nextMergedArray[0], nextMergedArray[1]);
    steps.push(createArrayRow([finalMergedArray]));

    const timeline = gsap.timeline();
    steps.forEach((step, index) => {
        const row = step;
        row.style.opacity = 0;
        display.appendChild(row);
        timeline.to(row, {
            duration: 1,
            opacity: 1,
            y: index * 3,
            ease: "power1.inOut"
        });
    });

    timeline.eventCallback("onComplete", () => {
        displayOutput(finalMergedArray);
    });
}

function displayOutput(finalArray) {
    const outputDisplay = document.getElementById('output-display');
    outputDisplay.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'array-row';
    finalArray.forEach(value => {
        const el = document.createElement('div');
        el.className = 'array-element';
        el.innerHTML = value;
        row.appendChild(el);
    });

    outputDisplay.appendChild(row);

    gsap.from(row.children, {
        duration: 1.2,
        opacity: 0,
        scale: 0.5,
        stagger: {
            amount: 0.3,
            from: "start"
        },
        ease: "back.out(1.7)"
    });

    gsap.from(row, {
        duration: 1.5,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 1
    });
}

async function mergeArrays(arr1, arr2) {
    const merged = [];
    let i = 0, j = 0;

    while (i < arr1.length && j < arr2.length) {
        // Display comparison and swapping animations concurrently
        await Promise.all([
            displayComparison(arr1[i], arr2[j]),
            displaySwapping(arr1[i], arr2[j])
        ]);
        
        if (arr1[i] < arr2[j]) {
            merged.push(arr1[i]);
            i++;
        } else {
            merged.push(arr2[j]);
            j++;
        }
    }

    while (i < arr1.length) {
        merged.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        merged.push(arr2[j]);
        j++;
    }
    return merged;
}

function displayComparison(a, b) {
    return new Promise((resolve) => {
        const comparisonDisplay = document.getElementById('comparison-display');

        const comparisonText = document.createElement('div');
        comparisonText.className = 'comparison-text';
        if (a > b) {
            comparisonText.innerHTML = `[${a}] > [${b}]. Swapping now.`;
        } else {
            comparisonText.innerHTML = `[${a}] < [${b}]. No swap needed.`;
        }

        comparisonDisplay.appendChild(comparisonText); // Append new comparison text

        // Resolve the promise after 1 second if no swap is needed
        if (a <= b) {
            setTimeout(resolve, 1000); // Wait 1 second before continuing
        } else {
            // Resolve the promise immediately if swap is needed
            resolve();
        }
    });
}

function displaySwapping(a, b) {
    return new Promise((resolve) => {
        const swappingDisplay = document.getElementById('swapping-display');
        swappingDisplay.innerHTML = '';

        const swapText = document.createElement('div');
        swapText.className = 'swapping-text';
        swapText.innerHTML = `Swapping [${a}] and [${b}]`;

        const swapContainer = document.createElement('div');
        swapContainer.className = 'swapping-animation';

        const elementA = document.createElement('div');
        elementA.className = 'array-element swapping-element';
        elementA.innerHTML = a;

        const elementB = document.createElement('div');
        elementB.className = 'array-element swapping-element';
        elementB.innerHTML = b;

        swapContainer.appendChild(elementA);
        swapContainer.appendChild(elementB);
        swappingDisplay.appendChild(swapText);
        swappingDisplay.appendChild(swapContainer);

        // Initial positions with 200px gap
        gsap.set(elementA, { x: -100 });
        gsap.set(elementB, { x: 100 });

        // Create a GSAP timeline for the swapping animation
        let tl = gsap.timeline();
        
        // Add animations for elementB and elementA simultaneously
        tl.to(elementB, { duration: 0.5, y: -40, ease: "power2.inOut" })
          .to(elementA, { duration: 0.5, y: 40, ease: "power2.inOut" }, "-=0.5")
          .to(elementB, { duration: 0.5, x: -100, ease: "power2.inOut" })
          .to(elementA, { duration: 0.5, x: 100, ease: "power2.inOut" }, "-=0.5")
          .to(elementB, { duration: 0.5, y: 0, ease: "power2.inOut" })
          .to(elementA, { duration: 0.5, y: 0, ease: "power2.inOut" }, "-=0.5")
          .eventCallback("onComplete", resolve)
          .play();
    });
}
