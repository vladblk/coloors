// GLOBAL SELECTIONS AND VARIABLES
const colorContainers = document.querySelectorAll('.color');
const generateColorsBtn = document.querySelector('.panel__control-btn');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelector('.color h2');



// FUNCTIONS

// Generate hex code function
const generateHex = () => {
  return chroma.random();
}

// Display colors function
const displayColor = () => {
  colorContainers.forEach( (container) => {
    const hexText = container.children[0];
    const hexCode = generateHex();

    container.style.backgroundColor = hexCode;
    hexText.innerText = hexCode;
  });
}

displayColor();
