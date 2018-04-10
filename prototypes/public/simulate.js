let gametick = 0;
function simulate(delta) {
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
			s.dead = true;
			s.trg.dead = true;
		}
	});

	troops = troops.filter(t => !t.dead);
	shots = shots.filter(sh => !sh.dead);

	troops.forEach(updateSoldier);

	console.log(delta);

	gametick++;

	if (gametick % 100 == 0) {
		console.log("Remaining units: " + troops.length + "  Shots: " + shots.length + "  Reloading: " + troops.filter(t => t.state.type == "reloading").length);
	}
}
