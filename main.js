let audio1 = new Audio();
audio1.src = "Isaac Riley - Another Ocean - 01 Dehydrated.mp3";

const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
const moodXEle = document.querySelector("#moodX");
const moodYEle = document.querySelector("#moodY");
const intense = document.querySelector('#intense');
const mimiEQ = document.querySelector('#mimiEQ');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let audioCtx;

audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;
let analyser = null;

audioSource = audioCtx.createMediaElementSource(audio1);
analyser = audioCtx.createAnalyser();
audioSource.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 1024;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const barWidth = canvas.width / bufferLength;

let x = 0;
function animate() {
    x = 0;
    y = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    let barHeight;
    ctx.fillStyle = `rgb(${dataArray[31] * intense.value}, ${dataArray[63]* intense.value}, ${dataArray[127] * intense.value} )`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * intense.value;
        const red = moodYEle.value;
        const green = Math.trunc((moodYEle.value + moodXEle.value) / 2);
        const blue = moodXEle.value;
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(x, y, barWidth, -barHeight - 50);
        ctx.fillRect(x, y, barWidth, barHeight + 50);
        x += barWidth;
        y = Math.sin(Math.PI * (x / canvas.width) * 2) * (150 * mimiEQ.value) + (canvas.height / 2);
    }

    requestAnimationFrame(animate);
}

animate();