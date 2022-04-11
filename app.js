// CONFIG -------------------------------------
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const w = 400, h = 400, ch = h / 2, cw = w / 2

canvas.width = w
canvas.height = h

let config = {
    scale: { x: 0.1, y: 0.1 },
    translate: { x: 2000, y: 2000 },
    lineWidth: 6
}

let shape = {
    speed: 0.0001,
    n: 100,
    spacing: 20,
}

ctx.lineCap = 'round'
ctx.lineWidth = config.lineWidth
ctx.strokeStyle = 'rgb(142,121,229)'

// INPUTS -------------------------------------
const spacingInput = document.getElementById('spacing')
const speedInput = document.getElementById('speed')
const scaleInput = document.getElementById('scale')

spacingInput.addEventListener('change', (e) => {
    shape.spacing = e.target.value
})

speedInput.addEventListener('change', (e) => {
    shape.speed = e.target.value * 0.001
})

// scaleInput.addEventListener('change', (e) => {
//     const s = e.target.value
//     config = {
//         ...config,
//         scale: {x: s, y:};
//     }
// })

// DRAW -------------------------------------
let delta = 0
ctx.scale(config.scale.x, config.scale.y)
ctx.translate(config.translate.x, config.translate.y)

function draw() {
    const lfo = Math.sin(delta * (shape.speed))

    for (let i = -shape.n; i < shape.n; i++) {
        matrix({
            cb: () => line({
                x1: shape.n * shape.spacing,
                y1: percent(h, 3) * 20 * lfo,
                x2: shape.spacing - 10,
                y2: percent(h, 10) * 2 * lfo
            }),
            x: shape.spacing,
            y: shape.spacing * i * 0.2,
            rad: lfo * shape.n * i * (Math.PI / 180)
        })
        // matrix({
        //     cb: () => line({
        //         x1: shape.n * shape.spacing,
        //         y1: percent(h, 3) * 20 * lfo,
        //         x2: shape.spacing - 10,
        //         y2: percent(h, 10) * 2 * lfo
        //     }),
        //     x: shape.spacing,
        //     y: shape.spacing * i * 0.2,
        //     rad: lfo * shape.n * i * (Math.PI / 180)
        // })
        // matrix({
        //     cb: () => line({
        //         x1: shape.n,
        //         y1: percent(h, 3) * 2,
        //         x2: shape.spacing - 10,
        //         y2: percent(h, 10) * 2
        //     }),
        //     x: shape.spacing * lfo,
        //     y: shape.spacing * i * 0.2,
        //     rad: lfo * shape.n * i * (Math.PI / 180)
        // })
    }
}

// LOOP -------------------------------------
function clear() {
    ctx.clearRect(
        -config.translate.x,
        -config.translate.y,
        w * 1 / config.scale.x,
        h * 1 / config.scale.y
    )
}

function loop() {
    clear()
    draw()
    delta++
    if (delta % 30 === 0) {
        shape.spacing = Math.random() * 100
    }
    if (delta % 70 === 0) {
        shape.speed = Math.random() * 0.001
    }
    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)

// HELPERS -------------------------------------
function percent(n, p) {
    return n * p / 100
}

function line({ x1, y1, x2, y2 }) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function matrix({ cb, x, y, rad }) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rad);
    cb()
    ctx.restore()
}

function generateLup() {
    const out = []
    const step = 0.1
    let i = 0
    while (i < 1) {
        i += step
        const v = Math.atan2(i, Math.random())
        out.push(v)
    }
    return out
}


// function rndColor() {
//     let r = 0 | (255 * Math.random()),
//         g = 0 | (255 * Math.random()),
//         b = 0 | (255 * Math.random());
//     return 'rgb(' + r + ',' + g + ',' + b + ')';
// }

// requestAnimationFrame(update);

// const ctx = canvas.getContext("2d");

// var w = canvas.width;
// var h = canvas.height;
// function update(timer) {
//     if (w !== innerWidth || h !== innerHeight) {
//         w = canvas.width = innerWidth;
//         h = canvas.height = innerHeight;
//     }
//     jiggle();
//     sweepLine(line, moveBy, rotateBy, scaleBy);
//     drawLine(line);
//     requestAnimationFrame(update);
// }


// // A Point also defines a vector.
// const Point = (x, y) => ({ x, y });
// const Line = (p1, p2) => ({ p1, p2 });
// const lengthOfVec = vec => (vec.x ** 2 + vec.y ** 2) ** 0.5;
// const normalVec = line => { // normalize the line and return a vector
//     const vec = Point(line.p2.x - line.p1.x, line.p2.y - line.p1.y);
//     const length = lengthOfVec(vec);
//     vec.x /= length;
//     vec.y /= length;
//     return vec;
// }
// const rotateVec90 = vec => {
//     const t = vec.x;
//     vec.x = - vec.y;
//     vec.y = t;
//     return vec;
// }




// function sweepLine(line, dist, rot, scale) {
//     const center = Point((line.p1.x + line.p2.x) / 2, (line.p1.y + line.p2.y) / 2);
//     const len = lengthOfVec(Point(line.p1.x - line.p2.x, line.p1.y - line.p2.y));
//     const lineNorm = normalVec(line);
//     const norm = rotateVec90(Point(lineNorm.x, lineNorm.y));
//     if (rot === 0) {
//         const ax = (line.p2.x - center.x) * scale;
//         const ay = (line.p2.y - center.y) * scale;
//         center.x += norm.x * dist;
//         center.y += norm.y * dist;
//         line.p1.x = center.x - ax
//         line.p1.y = center.y - ay;
//         line.p2.x = center.x + ax;
//         line.p2.y = center.y + ay;
//     } else {
//         const arcRadius = dist / rot;
//         const arcCenter = Point(
//             center.x - lineNorm.x * arcRadius, center.y - lineNorm.y * arcRadius
//         );
//         const endAngle = Math.atan2(lineNorm.y, lineNorm.x) + rot;
//         var ax = Math.cos(endAngle);
//         var ay = Math.sin(endAngle);
//         center.x = arcCenter.x + ax * arcRadius;
//         center.y = arcCenter.y + ay * arcRadius;
//         const len = lengthOfVec(Point(line.p1.x - line.p2.x, line.p1.y - line.p2.y));
//         ax *= len * scale * 0.5;
//         ay *= len * scale * 0.5;
//         line.p1.x = center.x - ax;
//         line.p1.y = center.y - ay;
//         line.p2.x = center.x + ax;
//         line.p2.y = center.y + ay;
//     }
// }



// function drawLine(line) {
//     ctx.lineWidth = 8;
//     ctx.lineCap = "round";
//     ctx.strokeStyle = col;
//     ctx.beginPath();
//     ctx.lineTo(line.p1.x, line.p1.y);
//     ctx.lineTo(line.p2.x, line.p2.y);
//     ctx.stroke();
// }


// function createRandomLine() {
//     const x = Math.random() * w * 0.3 + w * 0.35;
//     const y = Math.random() * h * 0.3 + h * 0.35;
//     const len = Math.random() * 40 + 10;
//     const dir = Math.random() * Math.PI * 2;
//     return Line(
//         Point(x - Math.cos(dir) * len * 0.5, y - Math.sin(dir) * len * 0.5),
//         Point(x + Math.cos(dir) * len * 0.5, y + Math.sin(dir) * len * 0.5)
//     );
// }


// // sweep the line randomly needs some settings
// var line, rotateBy, moveBy, scaleBy, col, l = 50, s = 70, hue = 0, moveFor = 0; //
// function randomize() {
//     rotateBy = Math.random() * 0.5 - 0.25;
//     moveBy = Math.random() * 5 + 5;
//     scaleBy = 1;
//     moveFor = 200;
//     line = createRandomLine();

// }
// function jiggle() {
//     if (moveFor === 0) { randomize() }
//     rotateBy += (Math.random() - 0.5) * 0.2;

//     scaleBy = Math.random() < 0.2 ? 1 / 1.1 : Math.random() < 0.2 ? 1.1 : 1;
//     moveBy += (Math.random() - 0.5) * 4;
//     moveFor--;
//     hue = (hue + 1) % 360;
//     s = (s + 100 + Math.random() - 0.5) % 100;
//     l = (l + 100 + Math.random() - 0.5) % 100;
//     col = "hsl(" + hue + "," + s + "%," + l + "%)";
// }
