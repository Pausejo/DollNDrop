let cara;
let ojos = [];
let bocas = [];
let cejas = [];
let arrastrando = null;
let offsetX, offsetY;
let mySound;
let okSound;
let startButton;
let resetButton, nextButton;

function preload() {
  soundFormats('mp3', 'wav');
  mySound = loadSound('assets/main.mp3');
  okSound = loadSound('assets/knock.wav');
  
  // Cargar la imagen de la cara
  cara = loadImage('https://i.ibb.co/XpZYxWp/OIG2.jpg');
  
  // Cargar las imágenes de las partes de la cara
  ojos.push(loadImage('https://i.ibb.co/ww7nVxf/OIG2-removebg-preview.png'));
  ojos.push(loadImage('https://i.ibb.co/s6Q0z1J/OIG2-removebg-preview-1.png'));
  bocas.push(loadImage('https://i.ibb.co/Dzs5y0B/OIG2-removebg-preview-2.png'));
  bocas.push(loadImage('https://i.ibb.co/S7xs43Y/OIG2-3-removebg-preview.png'));
  cejas.push(loadImage('https://i.ibb.co/mJ11T3s/OIG2-removebg-preview-3.png'));
  cejas.push(loadImage('https://i.ibb.co/DgT07Zd/OIG2-removebg-preview-4.png'));
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  
  // Crear el botón para empezar el juego
  startButton = createButton('Empezar');
  startButton.size(200, 100);
  startButton.style("font-family", "Comic Sans MS");
  startButton.style("font-size", "32px");
  startButton.position(windowWidth / 2 - 150, windowHeight - 150);
  startButton.mousePressed(startGame);
  
  // Crear botones de reiniciar y siguiente
  if (!resetButton) {
    resetButton = createButton('Reiniciar');
    resetButton.size(200, 100);
    resetButton.style("font-family", "Comic Sans MS");
    resetButton.style("font-size", "32px");
    resetButton.position(windowWidth / 2 - 200, windowHeight - 150);
    resetButton.mousePressed(startGame);
  }
  
  if (!nextButton) {
    nextButton = createButton('Siguiente');
    nextButton.size(200, 100);
    nextButton.style("font-family", "Comic Sans MS");
    nextButton.style("font-size", "32px");
    nextButton.position(windowWidth / 2 + 20, windowHeight - 150);
    nextButton.mousePressed(()=>{alert('not implemented')});
  }

  resetButton.hide();
  nextButton.hide();
  
  // Inicialmente ocultar las partes de la cara
  resetParts();
}

function draw() {
  background(240);

  // Dibuja la cara
  image(cara, 100, 170, 460, 460);

  // Dibuja las partes de la cara
  ojos.forEach(ojo => {
    image(ojo, ojo.x, ojo.y, ojo.width, ojo.height);
  });

  bocas.forEach(boca => {
    image(boca, boca.x, boca.y, boca.width, boca.height);
  });

  cejas.forEach(ceja => {
    image(ceja, ceja.x, ceja.y, ceja.width, ceja.height);
  });

  // Arrastra la parte seleccionada
  if (arrastrando) {
    arrastrando.x = mouseX + offsetX;
    arrastrando.y = mouseY + offsetY;
  }

  // Dibujar las letras desordenadas si todas las partes están en su lugar
  if (allPartsPlaced()) {
    resetButton.show();
    nextButton.show();
  } else if (resetButton && nextButton) {
    resetButton.hide();
    nextButton.hide();
  }
}

function startGame() {
  if (!mySound.isPlaying()){
    mySound.play()
  }
  startButton.hide()
  
  // Posicionar partes iniciales en la cara de manera aleatoria
  ojos.forEach((ojo, index) => {
    ojo.x = random(0, width - ojo.width);
    ojo.y = random(0, height - ojo.height);
    ojo.initialX = ojo.x;
    ojo.initialY = ojo.y;
    ojo.colocado = false; // Inicialmente, las partes no están bloqueadas
  });

  bocas.forEach((boca, index) => {
    boca.x = random(0, width - boca.width);
    boca.y = random(0, height - boca.height);
    boca.initialX = boca.x;
    boca.initialY = boca.y;
    boca.colocado = false; // Inicialmente, las partes no están bloqueadas
  });

  cejas.forEach((ceja, index) => {
    ceja.x = random(0, width - ceja.width);
    ceja.y = random(0, height - ceja.height);
    ceja.initialX = ceja.x;
    ceja.initialY = ceja.y;
    ceja.colocado = false; // Inicialmente, las partes no están bloqueadas
  });
}

function resetParts() {
  ojos.forEach((ojo, index) => {
    ojo.x = -ojo.width;
    ojo.y = -ojo.height;
    ojo.width = 140;
    ojo.height = 140;
    ojo.targetX = 150 + index * 240; // Posición objetivo para los ojos en la cara
    ojo.targetY = 330;
  });

  bocas.forEach((boca, index) => {
    boca.x = -boca.width;
    boca.y = -boca.height;
    boca.width = 100;
    boca.height = 50;
    boca.targetX = 290; // Posición objetivo para la boca en la cara
    boca.targetY = 430;
  });

  cejas.forEach((ceja, index) => {
    ceja.x = -ceja.width;
    ceja.y = -ceja.height;
    ceja.width = 100;
    ceja.height = 50;
    ceja.targetX = 162 + index * 250; // Posición objetivo para las cejas en la cara
    ceja.targetY = 290;
  });
}

function allPartsPlaced() {
  return ojos.every(ojo => ojo.colocado) &&
         bocas.some(boca => boca.colocado) &&
         cejas.every(ceja => ceja.colocado);
}

function mousePressed() {
  arrastrando = null;

// Verifica si se hace clic en alguna parte de la cara que no esté colocada
[...ojos, ...bocas, ...cejas].forEach(parte => {
  if (!parte.colocado && 
      mouseX > parte.x && mouseX < parte.x + parte.width &&
      mouseY > parte.y && mouseY < parte.y + parte.height) {
    arrastrando = parte;
    offsetX = parte.x - mouseX;
    offsetY = parte.y - mouseY;
  }
});
}

function mouseReleased() {
  if (arrastrando) {
    // Verificar colisiones solo con otras partes del mismo tipo
    let colision = false;
    let partes = [];

    if (ojos.includes(arrastrando)) {
      partes = ojos;
    } else if (bocas.includes(arrastrando)) {
      partes = bocas;
    } else if (cejas.includes(arrastrando)) {
      partes = cejas;
    }

    partes.forEach(parte => {
      if (parte !== arrastrando && 
          dist(arrastrando.x, arrastrando.y, parte.x, parte.y) < 50) {
        colision = true;
      }
    });

    // Ajusta la posición de la parte de la cara si está cerca de la posición objetivo
    if (dist(arrastrando.x, arrastrando.y, arrastrando.targetX, arrastrando.targetY) < 50) {
      arrastrando.x = arrastrando.targetX;
      arrastrando.y = arrastrando.targetY;
      arrastrando.colocado = true;
      okSound.play();
    } else if (colision) {
      // Vuelve a la posición inicial si hay colisión
      arrastrando.x = arrastrando.initialX;
      arrastrando.y = arrastrando.initialY;
    } else {
      // Vuelve a la posición inicial si no está cerca de la posición objetivo
      arrastrando.x = arrastrando.initialX;
      arrastrando.y = arrastrando.initialY;
    }

    arrastrando = null;
  }
}
