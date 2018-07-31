let ii = 0;

function draw() {
	ii++;
	//if (ii % 30 != 1) return;

	ctx.clearRect(0, 0, 1280, 1024);

	troops.forEach(t => {
		if (t.dead) {
			ctx.fillStyle = 'red'
			ctx.fillRect(t.x-2, t.y-2, 4, 4);
		} else {
			ctx.fillStyle = (t.army == 0 ? 'green' : 'blue');
			ctx.fillRect(t.x-1, t.y-1, 2, 2);
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