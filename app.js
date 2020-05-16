// GLOBAL SELECTIONS AND VARIABLES
const colorContainers = document.querySelectorAll('.color');
const generateColorsBtn = document.querySelector('.panel__control-generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');

const copyContainer = document.querySelector('.copy__container');
const copyPopUpBox = document.querySelector('.copy__container-popup');

const slidersContainers = document.querySelectorAll('.color__sliders');
const adjustBtn = document.querySelectorAll('.color__controls-adjust');
const lockBtn = document.querySelectorAll('.color__controls-lock');
const closeAdjustBtn = document.querySelectorAll('.color__sliders-close-adjustment');

let initialColors;

// Palettes saved to local storage
let savePalettes = [];


// FUNCTIONS
// Generate hex code function
const generateHex = () => {
  return chroma.random();
};

// Display colors function
const displayColor = () => {
  // create empty array for inital colors
  initialColors = [];

  colorContainers.forEach( (container) => {
    // get the h2 from all color containers
    let hexText = container.children[0];
    // generate a random hex color code
    const randomColor = generateHex();
    

    // add the colors to the array
    if(container.classList.contains('locked')){
      return initialColors.push(hexText.innerText);
    } else {
      initialColors.push(randomColor.hex());
    }

    // update each color containers background color
    container.style.backgroundColor = randomColor;
    // update each color containers h2 text
    hexText.innerText = randomColor;

    // check the contrast for each color container and modify the color of the h2 and control buttons based on the color's contrast
    checkContrast(randomColor, hexText);

    const controlIcons = container.querySelectorAll('.color__controls button');
    for(const icon of controlIcons){
      checkContrast(randomColor, icon);
    };

    // COLORIZE SLIDERS
    // get the color of each container
    const color = chroma(randomColor);
    // get the sliders of each container
    const containerSliders = container.querySelectorAll('input[type="range"]');
    // get the hue of each container slider input
    const hue = containerSliders[0];
    // get the brightness of each container brightness input
    const brightness = containerSliders[1];
    // get the saturation of each container saturation input
    const saturation = containerSliders[2];

    // colorize sliders
    colorizeSliders(color, hue, brightness, saturation);
  });
  
  // reset the sliders
  resetInputs();
};


// Check contrast function
const checkContrast = (color, element) => {
  // luminance() will generate a number between 0 and 1 -> 0: darkest black 1: lightest white
  const luminance = chroma(color).luminance();

  if(luminance > 0.5) {
    element.style.color = 'black';
  } else {
    element.style.color = 'white';
  }
};

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
};

const hslControls = (e) => {
  // get the index of each container based on data-hue, data-bright, data-sat attributes
  const index = e.target.getAttribute('data-hue') || e.target.getAttribute('data-bright') || e.target.getAttribute('data-sat');

  // get a nodelist of each container's sliders
  const sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  // select the hue slider
  const hue = sliders[0];
  // select the brightness slider
  const brightness = sliders[1];
  // select the saturation slider
  const saturation = sliders[2];

  // get the hexCode from the each h2
  const containerColor = initialColors[index];
  
  // get the color based on the sliders modifications
  const color = chroma(containerColor).set('hsl.h', hue.value).set('hsl.l', brightness.value).set('hsl.s', saturation.value);
  
  // update the containers background color
  colorContainers[index].style.backgroundColor = color;

  // update the background color of the sliders on change
  colorizeSliders(color, hue, brightness, saturation);
};

const updateUI = (index) => {
  // get the active container
  const activeContainer = colorContainers[index];
  // get the color of the active container (rgb)
  const color = chroma(activeContainer.style.backgroundColor);
  // get the text from the h2
  const hexText = activeContainer.querySelector('h2');
  // get the color controls buttons icon
  const controlIcons = activeContainer.querySelectorAll('.color__controls button');

  // change the text of the h2 with the new color that we changed from the slider (converting back to hex code)
  hexText.innerText = color.hex();
  
  // update the contrast for h2 text and buttons
  checkContrast(color, hexText);
  for(const icon of controlIcons){
    checkContrast(color, icon);
  }
};


const resetInputs = () => {
  sliders.forEach( (slider) => {
    if(slider.name === 'hue'){
      const hueColor = initialColors[slider.getAttribute('data-hue')];
      const hueValue = chroma(hueColor).hsl()[0];

      slider.value = Math.floor(hueValue);

    } else if(slider.name === 'brightness'){
      const brightnessColor = initialColors[slider.getAttribute('data-bright')];
      const brightnessValue = chroma(brightnessColor).hsl()[2];

      slider.value = brightnessValue.toFixed(2);
      
    } else if(slider.name === 'saturation'){
      const saturationColor = initialColors[slider.getAttribute('data-sat')];
      const saturationValue = chroma(saturationColor).hsl()[1];

      slider.value = saturationValue.toFixed(2);
    }
  });
};

const copyToClipboard = (hex) => {
  // create a text area
  const el = document.createElement('textarea');
  // each text area will have the value of each h2
  el.value = hex.innerText;
  document.body.appendChild(el);

  // select the element
  el.select();
  // execute the copy command
  document.execCommand('copy');
  // remove the element
  document.body.removeChild(el);

  // pop-up animation
  copyPopUpBox.classList.add('active');
  copyContainer.classList.add('active');
};


// open and close sliders container functions
const openAdjustmentContainer = (index) => {
  slidersContainers[index].classList.toggle('active');
};
const closeAdjustmentContainer = (index) => {
  slidersContainers[index].classList.remove('active');
};

// lock function
const lockContainer = (index) => {
  colorContainers[index].classList.toggle('locked');

  const lockIcon = lockBtn[index].children[0];

  if(colorContainers[index].classList.contains('locked')){
    lockIcon.classList.remove('fa-lock-open');
    lockIcon.classList.add('fa-lock');
  } else {
    lockIcon.classList.remove('fa-lock');
    lockIcon.classList.add('fa-lock-open');
  }
};

displayColor();


// SAVE TO PALETTE AND LOCAL STORAGE
const saveBtn = document.querySelector('.panel__control-save');
const submitSave = document.querySelector('.save__container-popup-save');
const closeSavePopUpBox = document.querySelector('.save__container-popup-close');
const saveContainer = document.querySelector('.save__container');
const savePopUpBox = document.querySelector('.save__container-popup');
const saveInput = document.querySelector('.save__container-popup-input');

// SAVE TO PALETTE AND LOCAL STORAGE FUNCTIONS
const openPaletteSave = () => {
  saveContainer.classList.add('active');
  savePopUpBox.classList.add('active');
};
const closePaletteSave = () => {
  saveContainer.classList.remove('active');
  savePopUpBox.classList.remove('active');
}

const submitPalette = () => {
  saveContainer.classList.remove('active');
  savePopUpBox.classList.remove('active');

  savePalettes.push(initialColors);
  console.log(savePalettes);
}

// SAVE TO PALETTE AND LOCAL STORAGE EVENT LISTENERS
saveBtn.addEventListener('click', openPaletteSave);
closeSavePopUpBox.addEventListener('click', closePaletteSave);
submitSave.addEventListener('click', submitPalette);







// EVENT LISTENERS

sliders.forEach( (slider) => {
  slider.addEventListener('input', hslControls);
});

colorContainers.forEach( (container, index) => {
  container.addEventListener('input', () => {
    updateUI(index);
  });
});

currentHexes.forEach( (hex) => {
  hex.addEventListener('click', () => {
    copyToClipboard(hex);
  });
});

copyContainer.addEventListener('transitionend', () => {
  copyContainer.classList.remove('active');
  copyPopUpBox.classList.remove('active');
});

adjustBtn.forEach( (btn, index) => {
  btn.addEventListener('click', () => {
    openAdjustmentContainer(index);
  });
});

closeAdjustBtn.forEach( (btn, index) => {
  btn.addEventListener('click', () => {
    closeAdjustmentContainer(index);
  });
});

lockBtn.forEach( (btn, index) => {
  btn.addEventListener('click', () => {
    lockContainer(index);
  });
});

generateColorsBtn.addEventListener('click', displayColor);