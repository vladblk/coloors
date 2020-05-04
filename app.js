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

    // COLORIZE SLIDERS
    // get the color of each container
    const color = chroma(hexColor);
    // get the sliders of each container
    const containerSliders = container.querySelectorAll('input[type="range"]');
    // get the hue of each container slider input
    const hue = containerSliders[0];
    // get the brightness of each container brightness input
    const brightness = containerSliders[1];
    // get the saturation of each container saturation input
    const saturation = containerSliders[2];

    colorizeSliders(color, hue, brightness, saturation);
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

// Colorize sliders function
const colorizeSliders = (color, hue, brightness, saturation) => {
  // Create brightness scale
  const midBrightness = color.set('hsl.l', 0.5);

  const brightnessScale = chroma.scale(['black', midBrightness, 'white']);

  // Create saturation scale
  const noSaturation = color.set('hsl.s', 0);
  const maxSaturation = color.set('hsl.s', 1);

  const saturationScale = chroma.scale([noSaturation, color, maxSaturation]);

  // Display scale colors
  saturation.style.backgroundImage = `linear-gradient(to right, ${saturationScale(0)}, ${saturationScale(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right, ${brightnessScale(0)}, ${brightnessScale(0.5)}, ${brightnessScale(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204,204 ,75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
}





displayColor();