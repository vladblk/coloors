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
    // get the h2 from all color containers
    const hexText = container.children[0];
    // generate a random hex color code
    const hexColor = generateHex();

    // update each color containers background color
    container.style.backgroundColor = hexColor;
    // update each color containers h2 text
    hexText.innerText = hexColor;


    // check the contrast for each color container and modify the color of the h2 based on the color's contrast
    checkContrast(hexColor, hexText);
  });
}

// Check contrast function
const checkContrast = (color, text) => {
  // luminance() will generate a number between 0 and 1 -> 0: darker 1: lighter
  const luminance = chroma(color).luminance();

  if(luminance > 0.5) {
    text.style.color = 'black';
  } else {
    text.style.color = 'white';
  }
}

displayColor();
