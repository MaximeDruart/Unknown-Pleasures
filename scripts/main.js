let fps = 60
let step = 8
let lines = []
let sketchWidth, sketchHeight
let audio, fft, spectrum, waveform

function preload() {
  audio = loadSound("../transmission.mp3")
}

function setup() {
  sketchWidth = 380
  sketchHeight = windowHeight * 0.8
  createCanvas(sketchWidth, sketchHeight).parent("canvasContainer")
  frameRate(fps)
  background(0)
  stroke(255)
  fill(0)
  // on créé les lignes de base
  for (let i = step; i <= sketchHeight - step; i += step) {
    let line = []
    for (let j = step; j <= sketchWidth - step; j += step) {
      let distanceToCenter = Math.abs(j - sketchWidth / 2) // varies between sketchWidth / 2 and 0
      let variance = Math.max(
        sketchWidth / 2 - sketchWidth * 0.15 - distanceToCenter,
        5
      )
      let random = ((Math.random() * variance) / 2) * -1
      let point = { x: j, y: i + random }
      line.push(point)
    }
    lines.push(line)
  }

  // instancie l'analyseur d'audio
  fft = new p5.FFT(0.8, 64)
  audio.setVolume(0.4)
}

function draw() {
  spectrum = fft.analyze()
  waveform = fft.waveform()
  spectrum.forEach((value, index) => {
    spectrum[index] = map(value, 0, 256, 0, 1)
    waveform[index] = map(waveform[index], -1, 1, 1, 1.02)
  })
  background(0)
  // on dessine chaque ligne
  lines.forEach((line, lineIndex) => {
    // on ignore les 5 premières lignes pour pas que ca depasse du canvas
    if (lineIndex > 5) {
      beginShape()
      line.forEach((point, pointIndex) => {
        // la valeur de chaque point de chaque ligne est multiplié par la valeur du spectre audio correspondant a son index
        let pValue =
          map(spectrum[pointIndex], 0, 1, lineIndex * step, point.y) *
          waveform[pointIndex]
        // on dessine le point
        curveVertex(point.x, pValue)
      })
      endShape()
    }
  })
}

function mouseClicked() {
  audio.isPlaying() ? audio.pause() : audio.play()
}

function windowResized() {
  resizeCanvas(sketchWidth, sketchHeight)
}
