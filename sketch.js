// 粒子の配列（すべての粒をここで管理）
let particles = [];

function setup() {
  // キャンバスをウィンドウサイズで作成（2Dモード）
  createCanvas(windowWidth, windowHeight);

  // 初期背景を白に塗る
  background(255);
}

function draw() {
  // 毎フレーム背景を白で塗り直す（完全な白：残像を消す）
  background(255, 255);

  // マウスが押されている間、粒子を発生させ続ける
  if (mouseIsPressed) {
    for (let i = 0; i < 2; i++) {
      // 2個ずつ粒子を現在のマウス位置に追加
      particles.push(new Particle(mouseX, mouseY));
    }
  }

  // 粒子の更新と表示処理（後ろからループして削除も安全に）
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update(); // 位置と透明度の更新
    particles[i].show();   // 描画
    if (particles[i].isDead()) {
      particles.splice(i, 1); // 消えた粒子を削除
    }
  }
}

// 粒子クラス
class Particle {
  constructor(x, y) {
    // 初期位置（マウス座標）
    this.pos = createVector(x, y);

    // ランダムな方向への初速ベクトル
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));

    // 加速度（無重力感にするため0）
    this.acc = createVector(0, 0);

    // 粒子の寿命（透明度に使う）
    this.lifespan = 255;

    // サイズに強いバリエーションを持たせる
    let group = random(1);
    if (group < 0.2) {
      // ごく稀に大粒（最大100以上）
      this.r = pow(random(1), 2) * 100 + 2;
    } else if (group < 0.6) {
      // 中くらいのサイズ
      this.r = random(12, 17);
    } else {
      // 小さめのサイズ（最小サイズを少し大きめに）
      this.r = random(4, 7);
    }

    // 肌の質感を連想させるカラーパレットからランダムに色を選ぶ
    const skinTones = [
      '#F3D9CE', '#F9C5B4', '#D96A6A', '#B1786B', '#1F1B1B',
      '#FDF0E7', '#F7C6B7', '#C88E94', '#7D4C58', '#000000',
      '#FFE9D9', '#FBC4B2', '#E3867A', '#9A7A70', '#47292B',
      '#F8D9D6', '#F4AFA1', '#C2626B', '#8A5F58', '#2C1F20'
    ];

    let colHex = random(skinTones);         // HEXから色を選ぶ
    this.col = color(colHex);               // p5.jsのcolorオブジェクトへ
    this.col.setAlpha(this.lifespan);       // 初期透明度を設定
  }

  update() {
    // 位置の更新
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    // 寿命（透明度）を減少させる
    this.lifespan -= 4;
    this.col.setAlpha(this.lifespan);
  }

  show() {
    // 線なしで塗りつぶし
    noStroke();

    // 影（グロー）を設定
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = this.col;

    // 粒の描画（楕円）
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.r);

    // グローを次の描画に影響させないよう解除
    drawingContext.shadowBlur = 0;
  }

  isDead() {
    // 寿命が尽きたら true を返す
    return this.lifespan < 0;
  }
}