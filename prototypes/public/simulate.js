let gametick = 0;
let time = 0;
function simulate(delta) {
	//if (delta > 1000) delta = 0;
	
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

	time += delta;
	// Tick every 100ms
	if (time > 100) {
		time -= 100;

		troops = troops.filter(t => !t.dead);
		shots = shots.filter(sh => !sh.dead);

		troops.forEach(updateSoldier);
		formations.forEach(updateFormation);

		gametick++;

		if (gametick % 10 == 0) {
			console.log("Remaining units: " + troops.length + "  Shots: " + shots.length + "  Reloading: " + troops.filter(t => t.state.type == "reloading").length);
		}
	}
}
