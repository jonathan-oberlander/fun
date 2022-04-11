// // CONFIG -------------------------------------
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const
    w = 500,
    h = 500,
    ch = h / 2,
    cw = w / 2

canvas.width = w
canvas.height = h

const fps = 60
const minTime = (1000 / 60) * (60 / fps) - (1000 / 60) * 0.5
let lastFrameTime = 0

// DRAW -------------------------------------
const Point = (x, y) => ({ x, y })
const Line = (p1, p2) => ({ p1, p2 })
const drawLine = (line, { width, color }) => {
    ctx.lineWidth = width
    ctx.strokeStyle = color
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.lineTo(line.p1.x, line.p1.y)
    ctx.lineTo(line.p2.x, line.p2.y)
    ctx.stroke()
}

const constructLine = ({ x, y, dir, len }) => Line(
    Point(
        x - Math.cos(dir) * len * 0.5,
        y - Math.sin(dir) * len * 0.5
    ),
    Point(
        x + Math.cos(dir) * len * 0.5,
        y + Math.sin(dir) * len * 0.5
    )
)

const lup = [
    0.38930919217295235,
    0.5021091235619197,
    0.45119781076618715,
    0.17485080649378104,
    0.9544256530200839,
    0.6131862720641412,
    0.09424846644905416,
    0.9240043649090439,
    0.24499115818777129,
    0.05523262737530321
]

let config = {
    scale: { x: 1, y: 1 },
    translate: { x: 0, y: 0 },
    span: 100,
    spanHeight: 10
}

ctx.fillStyle = "gray"
ctx.font = "12px Arial"
ctx.scale(config.scale.x, config.scale.y)

const p_1 = ({ x, y, i, j, lfo, lfo2 }) => {
    const absI = Math.abs(i)
    const absJ = Math.abs(j)

    drawLine(
        constructLine({
            // base + offset + ((elongation * i) + displacement * j) * wrap
            x: x + 200 + ((10 * i) + 100 * j) * lfo,
            y: y + 200 + ((10 * j * lfo2) + 20 * j),
            dir: Math.sin((Math.PI / j + i * lup[9]) * lfo),
            len: 200
        }),
        {
            width: absI * lup[9],
            color:
                `rgb(
                    ${(5 * absJ * lfo2) + 50}, 
                    ${(9 * j * lup[8]) + 0}, 
                    ${(50 * lfo) + 150}
                )`
        })
}

const p_2 = ({ x, y, i, j, lfo, lfo2 }) => {
    const noise = Math.random() * 0.01

    drawLine(
        constructLine({
            x: (400 * (noise * 60)) + (90 * j) + x,
            y: 200 + y + (3 * i * (noise * 100)),
            dir: Math.PI / lup[8],
            len: 100
        }),
        {
            width: 1,
            color:
                `rgb(
                ${(25 * j * lfo2) + 90}, 
                ${(90 * j * lup[8]) + 20}, 
                ${(5 * lfo) + 100}
            )`
        })
}

const p_3 = ({ x, y, i, j, lfo, lfo2 }) => {
    const noise = Math.random()
    const lfo3 = (lfo * noise)

    drawLine(
        constructLine({
            x: (700 * noise) + x + ((90 * 0.5) + 11 * j) - 300,
            y: (y + 20 * i) - (600 * lfo3),
            dir: Math.cos(Math.PI / (lfo3 * i * 0.2)) + 200,
            len: 80
        }),
        {
            width: 6 * noise,
            color:
                `rgb(
                ${(25 * i) + 90}, 
                ${(90 * j * lup[8]) + 100}, 
                ${(5 * lfo3) + 10}
            )`
        })
}

const p_4 = ({ x, y, i, j, lfo2 }) => {
    const lfo3 = saw(delta * 0.003)
    ctx.fillText(`${lfo3.toPrecision(3)}`, 3, 24)

    drawLine(
        constructLine({
            x: ch + x + (i * 13 * lfo3),
            y: cw + y + (j * 3) * lfo3,
            dir: (Math.PI / 2 * j * i * 0.02) + lfo3,
            len: 50 ** lfo3
        }),
        {
            width: 1,
            color:
                `rgb(
                    ${10 * lfo2 + 50}, 
                    ${50 * lfo3}, 
                    ${150}
                )`
        })
}

const p_5 = ({ x, y, i, j }) => {
    const lfo1 = Math.sin(delta * 0.02)
    const lfo2 = Math.cos(delta * 0.1)
    const lfo3 = saw(delta * 0.03)
    // ctx.fillText(`${lfo3.toPrecision(3)}`, 3, 24)a

    const a = `rgb(
            ${100 * i * lfo3 + 200},
            ${90 * j * lfo1 + 100},
            ${100 * i * lfo2 * j}
        )`

    const b = `rgb(
            ${(25 * i) + 100}, 
            ${(90 * j * lup[8]) + 100}, 
            ${100 * lfo1}
        )`

    let color = a

    // if (delta % 30 === 0) {
    //     color = a
    // }

    // if (delta % 40 === 0) {
    //     color = b
    // }

    drawLine(
        constructLine({
            x: cw + x + i * 2,
            y: ch + y + j * 15,
            dir: (Math.PI / 3),
            len: 80
        }),
        {
            width: 1.3,
            color,
        })
}


const linePresets = [p_1, p_2, p_3, p_4, p_5]
let delta = 0
let line = linePresets[0]
ctx.globalAlpha = 0.5

function draw() {
    const { translate: { x, y }, span, spanHeight } = config

    const lfo = Math.sin(delta * 0.006)
    const lfo2 = Math.cos(delta * 0.01)

    // ctx.fillText(`${lfo}`, 3, 12)
    // ctx.fillText(`${lfo2}`, 3, 24)

    const xs = w / config.scale.x / 2 - cw
    const ys = h / config.scale.y / 2 - ch

    for (let j = -spanHeight; j < spanHeight; j++) {
        for (let i = -span; i < span; i++) {
            // linePresets[0]({ x: xs, y: ys, i, j, lfo, lfo2 })
            linePresets[1]({ x: xs, y: ys, i, j, lfo, lfo2 })
            // linePresets[2]({ x: xs, y: ys, i, j, lfo, lfo2 })
            // linePresets[3]({ x: xs, y: ys, i, j, lfo, lfo2 })
            // linePresets[4]({ x: xs, y: ys, i, j, lfo, lfo2 })
        }
    }
}

// LOOP -------------------------------------
function clear() {
    ctx.clearRect(
        0,
        0,
        w * 1 / config.scale.x,
        h * 1 / config.scale.y
    )
}

function loop(time) {
    if (time - lastFrameTime < minTime) {
        requestAnimationFrame(loop)
        return
    }
    lastFrameTime = time
    delta++
    clear()
    draw()
    requestAnimationFrame(loop) // get next farme
}

requestAnimationFrame(loop) // start animation

// HELPERS -------------------------------------

function saw(x) {
    return x % Math.PI
}

function percent(n, p) {
    return n * p / 100
}

// function generateLup() {
//     const out = []
//     const step = 1
//     let i = 0
//     while (i < 10) {
//         i += step
//         const v = Math.random()
//         out.push(v)
//     }
//     return out
// }

// function rndColor() {
//     let r = 0 | (255 * Math.random()),
//         g = 0 | (255 * Math.random()),
//         b = 0 | (255 * Math.random());
//     return 'rgb(' + r + ',' + g + ',' + b + ')';
// }
