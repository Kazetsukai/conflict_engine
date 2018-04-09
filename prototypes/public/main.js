let ctx;
let canvas;

let troops = [
	{x: 100, y: 50, army: 0, state: { type: 'idle' } },
	{x: 110, y: 53, army: 0, state: { type: 'idle' }},
	{x: 105, y: 40, army: 0, state: { type: 'idle' }},
	{x: 107, y: 57, army: 0, state: { type: 'idle' }},
	{x: 200, y: 70, army: 1, state: { type: 'idle' }},
	{x: 210, y: 73, army: 1, state: { type: 'idle' }},
	{x: 207, y: 65, army: 1, state: { type: 'idle' }},

	{x: 100, y: 150, army: 0, state: { type: 'idle' } },
	{x: 110, y: 129, army: 0, state: { type: 'idle' }},
	{x: 105, y: 119, army: 0, state: { type: 'idle' }},
	{x: 107, y: 112, army: 0, state: { type: 'idle' }},
	{x: 200, y: 152, army: 1, state: { type: 'idle' }},
	{x: 210, y: 112, army: 1, state: { type: 'idle' }},
	{x: 207, y: 105, army: 1, state: { type: 'idle' }},
];

for (var i = 0; i < 1000; i++) {
	troops.push({x: 100 + Math.random() * 50, y: 150 + Math.random() * 300, army: 0, state: { type: 'idle' } });
	troops.push({x: 200 + Math.random() * 50, y: 150 + Math.random() * 300, army: 1, state: { type: 'idle' } });
}

let shots = [
	{src: troops[1], trg: troops[5], dist: 0, speed: 60}
];

window.onload = function() {
	
	canvas = document.querySelector('#canvas');
	ctx = canvas.getContext('2d');

	gameLoop();
}

let lastTime;
function gameLoop(timeStamp) {
	let delta = 0;
	if (lastTime) delta = timeStamp - lastTime;
	lastTime = timeStamp;

	update(delta);

	draw();

	window.requestAnimationFrame(gameLoop);
}

let gametick = 0;
function update(delta) {
	// 
	shots.forEach(s => {
		s.dist += s.speed * (delta / 1000);

		let xa = s.src.x;
		let ya = s.src.y;
		let xb = s.trg.x;
		let yb = s.trg.y;
		let len = Math.sqrt(Math.pow(xb-xa, 2) + Math.pow(yb-ya, 2));
		if (s.dist - 10 > len) {
			// Kill
			troops = troops.filter(t => t !== s.trg);
			shots = shots.filter(sh => sh !== s);
			s.trg.dead = true;
		}
	});

	troops.forEach(updateUnit);

	gametick++;

	if (gametick % 100 == 0) {
		console.log("Remaining units: " + troops.length + "  Shots: " + shots.length + "  Reloading: " + troops.filter(t => t.state.type == "reloading").length);
	}
}

function updateUnit(unit) {
	// Skip if current state is still waiting
	if (unit.state.finishTime && unit.state.finishTime > gametick)
		return;

	// Current state is ready to transition
	switch(unit.state.type) {
		case 'aiming':
			shots.push({
				src: unit, trg: unit.state.target, dist: 0, speed: 250
			});
			unit.state = {
				type: 'reloading',
				finishTime: gametick + 5000 + Math.floor(Math.random() * 500)
			}
			break;

		default:
			unit.state = decideNextState(unit);
			//console.log('changed state to ' + unit.state.type);
			break;
	}
}

function decideNextState(unit) {
	var target = _.shuffle(troops.filter(t => t.army != unit.army))[0]

	if (target) {
		return {
			type: 'aiming',
			target: target,
			finishTime: gametick + Math.floor(Math.random() * 1000) + 100
		}
	}

	return {
		type: 'waiting',
		finishTime: gametick + 1000
	}
}

function draw() {
	ctx.clearRect(0, 0, 1024, 768);

	troops.forEach(t => {
		if (t.dead) {
			ctx.fillStyle = 'red'
			ctx.fillRect(t.x-2, t.y-2, 4, 4);
		} else {
			ctx.fillStyle = (t.army == 0 ? 'green' : 'blue');
			ctx.fillRect(t.x-3, t.y-3, 6, 6);
		}
	});

	ctx.strokeStyle = 'black';
	shots.forEach(s => {
		let xa = s.src.x;
		let ya = s.src.y;
		let xb = s.trg.x;
		let yb = s.trg.y;

		let len = Math.sqrt(Math.pow(xb-xa, 2) + Math.pow(yb-ya, 2));
		let [dirX, dirY] = [(xb-xa) / len, (yb-ya) / len];

		let x1 = s.src.x + dirX * Math.min(len, Math.max(0, s.dist-5));
		let y1 = s.src.y + dirY * Math.min(len, Math.max(0, s.dist-5));
		let x2 = s.src.x + dirX * Math.min(len, Math.max(0, s.dist+5));
		let y2 = s.src.y + dirY * Math.min(len, Math.max(0, s.dist+5));

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.closePath();
	});
}