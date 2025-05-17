// POKE - 粒子インタラクション（ぼかし付き2Dバージョン）
// 開発段階：v1.0.0（2025年5月）
// 機能：肌色パレットを用いたランダム粒子 + グローエフェクト + サイズコントラスト
// スプラッシュ画面付き（中央に"poke-tints"を表示／ランダムな肌色トーン）

let particles = [];
let showSplash = true;
let splashAlpha = 0;
let splashFadeIn = true;
let splashFont;
let splashColor;

const skinTones = [
  '#F3D9CE', '#F9C5B4', '#D96A6A', '#B1786B', '#1F1B1B',
  '#FDF0E7', '#F7C6B7', '#C88E94', '#7D4C58', '#000000',
  '#FFE9D9', '#FBC4B2', '#E3867A', '#9A7A70', '#47292B',
  '#F8D9D6', '#F4AFA1', '#C2626B', '#8A5F58', '#2C1F20'
];

function preload() {
  splashFont = loadFont('https://fonts.gstatic.com/s/portlligatserif/v17/LDI1apSQOAYtSuYWp8ZhfYe8Uc1fYxzJgXk.woff2');
  splashColor = color(random(skinTones));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(splashFont);
  textAlign(CENTER, CENTER);
  textSize(48);
  background(255);
}

function draw() {
  background(255, 255); // 残像を消す

  if (showSplash) {
    fill(splashColor);
    splashAlpha += splashFadeIn ? 5 : -3;
    splashAlpha = constrain(splashAlpha, 0, 255);
    fill(red(splashColor), green(splashColor), blue(splashColor), splashAlpha);
    text("poke-tints", width / 2, height / 2);

    if (splashFadeIn && splashAlpha >= 255) {
      splashFadeIn = false;
    }
    if (!splashFadeIn && splashAlpha <= 0) {
      showSplash = false;
    }
    return;
  }

  if (mouseIsPressed) {
    for (let i = 0; i < 2; i++) {
      particles.push(new Particle(mouseX, mouseY));
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.acc = createVector(0, 0);
    this.lifespan = 255;

    let group = random(1);
    if (group < 0.2) {
      this.r = pow(random(1), 2) * 100 + 2;
    } else if (group < 0.6) {
      this.r = random(10, 15);
    } else {
      this.r = random(4, 5);
    }

    let colHex = random(skinTones);
    this.col = color(colHex);
    this.col.setAlpha(this.lifespan);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 4;
    this.col.setAlpha(this.lifespan);
  }

  show() {
    noStroke();
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = this.col;
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.r);
    drawingContext.shadowBlur = 0;
  }

  isDead() {
    return this.lifespan < 0;
  }
}
