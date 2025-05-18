// POKE - 粒子インタラクション（ぼかし付き2Dバージョン）

let particles = [];

let splashImage;
let showSplash = true;
let splashAlpha = 255;
let splashTimer = 0;

// 肌色パレット（20色）
const skinTones = [
  '#F3D9CE', '#F9C5B4', '#D96A6A', '#B1786B', '#1F1B1B',
  '#FDF0E7', '#F7C6B7', '#C88E94', '#7D4C58', '#000000',
  '#FFE9D9', '#FBC4B2', '#E3867A', '#9A7A70', '#47292B',
  '#F8D9D6', '#F4AFA1', '#C2626B', '#8A5F58', '#2C1F20'
];

function preload() {
  splashImage = loadImage("splash.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
}

function draw() {
  background(255, 255); // フレーム毎に白でうっすら上書き（残像表現）

  if (showSplash) {
    tint(255, splashAlpha);
    imageMode(CENTER);
    image(splashImage, width / 2, height / 2);

    splashTimer++;

    if (splashTimer > 60) {
      splashAlpha -= 5;
    }

    if (splashAlpha <= 0) {
      showSplash = false;
    }
    return;
  }

  // マウス押下中は粒子を出し続ける（水道のように）
  if (mouseIsPressed) {
    for (let i = 0; i < 2; i++) {
      particles.push(new Particle(mouseX, mouseY));
    }
  }

  // 粒子の更新と描画
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
    this.acc = createVector(0, 0); // 無重力感
    this.lifespan = 255;

    // サイズを3段階でランダムに決定（大中小のコントラスト）
    let group = random(1);
    if (group < 0.2) {
      this.r = pow(random(1), 2) * 100 + 2;
    } else if (group < 0.6) {
      this.r = random(10, 15);
    } else {
      this.r = random(4, 5); // 小さめサイズを少し大きく
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
    drawingContext.shadowBlur = 30;           // 外側ぼかし（グロー）
    drawingContext.shadowColor = this.col;
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.r);
    drawingContext.shadowBlur = 0;            // 次の描画に影響しないようにリセット
  }

  isDead() {
    return this.lifespan < 0;
  }
}