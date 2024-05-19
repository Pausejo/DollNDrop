let cara;
let ojos = [];
let bocas = [];
let cejas = [];
let arrastrando = null;
let offsetX, offsetY;

function preload() {
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
  let canvas = createCanvas(650, 700);
  canvas.parent('canvas-container');
  
  // Posicionar partes iniciales en la cara
  ojos.forEach((ojo, index) => {
    ojo.x = 80 + index * 150;  // Ajustar según el espacio deseado entre ojos
    ojo.y = 20;
    ojo.width = 140;
    ojo.height = 140;
    ojo.targetX = 150 + index * 240; // Posición objetivo para los ojos en la cara
    ojo.targetY = 320;
    ojo.initialX = ojo.x;
    ojo.initialY = ojo.y;
  });

  bocas.forEach((boca, index) => {
    boca.x = 370 + index * 100;  // Ajustar según el espacio deseado entre bocas
    boca.y = 90;
    boca.width = 100;
    boca.height = 50;
    boca.targetX = 290; // Posición objetivo para la boca en la cara
    boca.targetY = 450;
    boca.initialX = boca.x;
    boca.initialY = boca.y;
  });

  cejas.forEach((ceja, index) => {
    ceja.x = 370 + index * 120;  // Ajustar según el espacio deseado entre cejas
    ceja.y = 20;
    ceja.width = 100;
    ceja.height = 50;
    ceja.targetX = 162 + index * 250; // Posición objetivo para las cejas en la cara
    ceja.targetY = 290;
    ceja.initialX = ceja.x;
    ceja.initialY = ceja.y;
  });
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
}

function mousePressed() {
  arrastrando = null;

  // Verifica si se hace clic en alguna parte de la cara
  [...ojos, ...bocas, ...cejas].forEach(parte => {
    if (mouseX > parte.x && mouseX < parte.x + parte.width &&
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

    if (arrastrando === ojos[0] || arrastrando === ojos[1]) {
      partes = ojos;
    } else if (arrastrando === bocas[0] || arrastrando === bocas[1]) {
      partes = bocas;
    } else if (arrastrando === cejas[0] || arrastrando === cejas[1]) {
      partes = cejas;
    }

    partes.forEach(parte => {
      if (parte !== arrastrando && 
          dist(arrastrando.x, arrastrando.y, parte.x, parte.y) < 50) {
        parte.x = parte.initialX;
        parte.y = parte.initialY;
        colision = true;
      }
    });

    // Ajusta la posición de la parte de la cara si está cerca de la posición objetivo
    if (dist(arrastrando.x, arrastrando.y, arrastrando.targetX, arrastrando.targetY) < 50) {
      arrastrando.x = arrastrando.targetX;
      arrastrando.y = arrastrando.targetY;
    } else {
      // Vuelve a la posición inicial si no está cerca de la posición objetivo o si hay colisión
      arrastrando.x = arrastrando.initialX;
      arrastrando.y = arrastrando.initialY;
    }

    arrastrando = null;
  }
}
