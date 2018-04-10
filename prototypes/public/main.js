let ctx;
let canvas;

let formations = [
	{x: 350, y: 400, rX: 1, rY: 0, rowSize: 105, rowSpacing: 5, army: 0, soldiers: []},
	{x: 700, y: 400, rX: -1, rY: 0, rowSize: 123, rowSpacing: 5, army: 1, soldiers: []}
]

let troops = [
	{x: 100, y: 50, army: 0, state: { type: 'idle' }},
	{x: 110, y: 53, army: 0, state: { type: 'idle' }},
	{x: 105, y: 40, army: 0, state: { type: 'idle' }},
	{x: 107, y: 57, army: 0, state: { type: 'idle' }},
	{x: 200, y: 70, army: 1, state: { type: 'idle' }},
	{x: 210, y: 73, army: 1, state: { type: 'idle' }},
	{x: 207, y: 65, army: 1, state: { type: 'idle' }},

	{x: 100, y: 150, army: 0, state: { type: 'idle' }},
	{x: 110, y: 129, army: 0, state: { type: 'idle' }},
	{x: 105, y: 119, army: 0, state: { type: 'idle' }},
	{x: 107, y: 112, army: 0, state: { type: 'idle' }},
	{x: 200, y: 152, army: 1, state: { type: 'idle' }},
	{x: 210, y: 112, army: 1, state: { type: 'idle' }},
	{x: 207, y: 105, army: 1, state: { type: 'idle' }},
];

for (var i = 0; i < 100000; i++) {
	let s1 = {x: 275 + Math.random() * 50, y: 150 + Math.random() * 300, army: 0, loaded: true, state: { type: 'idle' } };
	let s2 = {x: 730 + Math.random() * 50, y: 150 + Math.random() * 300, army: 1, loaded: true, state: { type: 'idle' } };

	troops.push(s1);
	troops.push(s2);

	addSoldierToFormation(s1, formations[0]);
	addSoldierToFormation(s2, formations[1]);
}

let shots = [
	{src: troops[1], trg: troops[5], dist: 0, speed: 60}
];

window.onload = function() {
	
	canvas = document.querySelector('#canvas');
	ctx = canvas.getContext('2d');

	cmd_formUp(0);
	cmd_formUp(1);
	gameLoop();
}

let lastTime;
function gameLoop(timeStamp) {
	let delta = 0;
	if (lastTime) delta = timeStamp - lastTime;
	lastTime = timeStamp;

	simulate(delta);

	draw();

	window.requestAnimationFrame(gameLoop);
}