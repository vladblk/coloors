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


// SAVE TO PALETTE AND LOCAL STORAGE
const saveBtn = document.querySelector('.panel__control-save');
const submitSave = document.querySelector('.save__container-popup-save');
const closeSavePopUpBox = document.querySelector('.save__container-popup-close');
const saveContainer = document.querySelector('.save__container');
const savePopUpBox = document.querySelector('.save__container-popup');
const saveInput = document.querySelector('.save__container-popup-input');

const libraryBtn = document.querySelector('.panel__control-library');
const libraryContainer = document.querySelector('.library__container');
const libraryPopUpBox = document.querySelector('.library__container-popup');
const closeLibraryPopUpBox = document.querySelector('.library__container-popup-close');

// Palettes saved to local storage
let savedPalettes = [];

// SAVE TO PALETTE AND LOCAL STORAGE FUNCTIONS
const generatePallete = (palette, paletteObj) => {
  const paletteContainer = document.createElement('div');
  paletteContainer.classList.add('library__container-popup__palette-container');

  const paletteContainerTitle = document.createElement('h4');
  paletteContainerTitle.innerText = paletteObj.name;
  
  const paletteContainerPreview = document.createElement('div');
  paletteContainerPreview.classList.add('library__container-popup__palette-container-preview');

  paletteObj.colors.forEach( (color) => {
    const colorDiv = document.createElement('div');
    colorDiv.style.backgroundColor = color;
    paletteContainerPreview.appendChild(colorDiv);
  });

  const paletteContainerSelectBtn = document.createElement('button');
  paletteContainerSelectBtn.classList.add('library__container-popup__palette-container-select');
  paletteContainerSelectBtn.classList.add(paletteObj.index);
  paletteContainerSelectBtn.innerText = 'Select';

  // append to library
  paletteContainer.appendChild(paletteContainerTitle);
  paletteContainer.appendChild(paletteContainerPreview);
  paletteContainer.appendChild(paletteContainerSelectBtn);

  libraryPopUpBox.appendChild(paletteContainer);

  // attach event to the library select palette button
  paletteContainerSelectBtn.addEventListener('click', () => {
    // close the library after selecting a palette
    closeLibrary();

    // get the index of the selected pelette container
    // const paletteIndex = e.target.classList[1];
    const paletteIndex = paletteObj.index;

    // reset the inital colors array
    initialColors = [];
    
    palette[paletteIndex].colors.forEach( (color, index) => {
      // push the saved colors in the initial colors array
      initialColors.push(color);

      // update the color containers with the saved colors
      colorContainers[index].style.backgroundColor = color;

      // update UI with each saved color hex text and contrast
      updateUI(index);

      // update sliders colors
      const c = chroma(color);
      const sliders = slidersContainers[index].querySelectorAll('input[type="range"]');
      // select the hue slider
      const hue = sliders[0];
      // select the brightness slider
      const brightness = sliders[1];
      // select the saturation slider
      const saturation = sliders[2];

      colorizeSliders(c, hue, brightness, saturation);
    });

    // reset sliders for the saved colors
    resetInputs();
  });
};

const openPaletteSave = () => {
  saveContainer.classList.add('active');
  savePopUpBox.classList.add('active');

  saveInput.focus();
};
const closePaletteSave = () => {
  saveContainer.classList.remove('active');
  savePopUpBox.classList.remove('active');
};

const checkLocalStorage = () => {
  let arr;

  if(localStorage.getItem('palettes') === null){
    arr = [];
  } else {
    arr = JSON.parse(localStorage.getItem('palettes'));
  }

  return arr;
}

const saveToLocal = (paletteObj) => {
  let localPalettes = checkLocalStorage();

  localPalettes.push(paletteObj);
  localStorage.setItem('palettes', JSON.stringify(localPalettes));
};

const generateLibrary = (savedPalettes, paletteObj) => {
  generatePallete(savedPalettes, paletteObj);
};



const savePalette = () => {
  saveContainer.classList.remove('active');
  savePopUpBox.classList.remove('active');

  const paletteName = saveInput.value;
  const paletteColorsArr = [];

  currentHexes.forEach( (hex) => {
    paletteColorsArr.push(hex.innerText);
  });

  // Generate Object
  let paletteIndex;
  const paletteObjects = JSON.parse(localStorage.getItem('palettes'));
  if(paletteObjects){
    paletteIndex = paletteObjects.length;
  } else {
    paletteIndex = savedPalettes.length;
  }

  const paletteObj = {
    name: paletteName,
    colors: paletteColorsArr,
    index: paletteIndex 
  }

  savedPalettes.push(paletteObj); // [{}, {}, {}]
  
  // save to local storage
  saveToLocal(paletteObj);

  // reset the input value after saving
  saveInput.value = '';

  // generate library
  generateLibrary(savedPalettes, paletteObj);
};

const openLibrary = () => {
  libraryContainer.classList.add('active');
  libraryPopUpBox.classList.add('active');
};
const closeLibrary = () => {
  libraryContainer.classList.remove('active');
  libraryPopUpBox.classList.remove('active');
};



const getFromLocal = () => {
  let paletteObjects = checkLocalStorage();

  paletteObjects.forEach( (paletteObj) => {
    generatePallete(paletteObjects, paletteObj);
  });

  savedPalettes = [...paletteObjects];
}


// SAVE TO PALETTE AND LOCAL STORAGE EVENT LISTENERS
saveBtn.addEventListener('click', openPaletteSave);
closeSavePopUpBox.addEventListener('click', closePaletteSave);
submitSave.addEventListener('click', savePalette);

libraryBtn.addEventListener('click', openLibrary);
closeLibraryPopUpBox.addEventListener('click', closeLibrary);


displayColor();
getFromLocal();
