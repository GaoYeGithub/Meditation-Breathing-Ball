let mic, fft, particle;
let energyHistory = [];  
let countdownValue = 3;
let countdownTimer;

let Particle = function(position) {
  this.position = position;
  this.diameter = 100;
  this.color = [random(0, 255), random(0, 255), random(0, 255)];

  this.draw = function() {
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.diameter);
  };

  this.update = function() {
    let averageEnergy = energyHistory.reduce((a, b) => a + b, 0) / energyHistory.length;
    this.diameter = map(averageEnergy, 0, 255, 100, 800);  // Adjusted for larger size
  };
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.9, 64);
  fft.setInput(mic);
  particle = new Particle(createVector(width / 2, height / 2));
  touchStarted();
  startCountdown();
}

function draw() {
  background(0);
  let spectrum = fft.analyze();
  let energy = spectrum[5];
  energyHistory.push(energy);
  if (energyHistory.length > 10) {
    energyHistory.shift();
  }
  particle.update(energy);
  particle.draw();
  displayCountdown();
}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

function startCountdown() {
  countdownValue = 3;
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    countdownValue--;
    if (countdownValue < 1) {
      countdownValue = 3;
    }
  }, 1000);
}

function displayCountdown() {
  textAlign(CENTER, CENTER);
  textSize(72);
  fill(255);
  text(countdownValue, width / 2, height / 2);
}
