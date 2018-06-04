function updateFormation(formation) {

	let cX = 0;
	let cY = 0;
	formation.soldiers.forEach(s => {
		cX += s.x;
		cY += s.y;
	});
	formation.centerX = cX / formation.soldiers.length;
	formation.centerY = cY / formation.soldiers.length;
	
	let st = formation.state;

	// Skip if current state is still waiting
	if (st.finishTime && st.finishTime > gametick)
		return;

	// Current state is ready to transition
	switch(st.type) {
		case 'firing':
			// TODO

		default:
			break;
	}
	
	formation.state = decideNextStateFormation(formation);
}

function decideNextStateFormation(formation) {
	return {
		type: 'waiting',
		finishTime: gametick + 10
	}
}

function cmd_formUp(formationId) {
	formUp(formations[formationId]);
}

function move(formation, x, y, rX, rY) {
	formation.x = x;
	formation.y = y;
	formation.rX = rX;
	formation.rY = rY;
	formUp(formation);
}

function formUp(formation) {
	let rowNum = 0;
	let rowPos = 0;

	formation.soldiers.forEach(s => {
		if (rowPos > formation.rowSize) {
			rowPos = 0;
			rowNum++;
		}

		if (s.dead) return;
		let xAmount = rowNum * formation.rowSpacing;
		let yAmount = (rowPos - formation.rowSize / 2) * formation.rowSpacing;
		let xTarget = formation.x - (xAmount * formation.rX + yAmount * formation.rY);
		let yTarget = formation.y - (yAmount * formation.rX + xAmount * formation.rY);
		let len = Math.sqrt(Math.pow(xTarget - s.x, 2) + Math.pow(yTarget - s.y, 2));

		s.state = {
			type: 'moving',
			sX: s.x,
			sY: s.y,
			tX: xTarget,
			tY: yTarget,
			d: 1 / len,
			t: 0,
			_len: len
		}
		s.rank = rowNum;

		rowPos++;
	});

	formation.numRanks = rowNum;

}
