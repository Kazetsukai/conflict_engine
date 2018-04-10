
function updateSoldier(unit) {
	// Skip if current state is still waiting
	if (unit.state.finishTime && unit.state.finishTime > gametick)
		return;

	// Current state is ready to transition
	switch(unit.state.type) {
		case 'moving':
			unit.state.t += unit.state.d;
			if (unit.state.t < 1) {
				unit.x = (unit.state.sX * (1-unit.state.t)) + (unit.state.tX * unit.state.t);
				unit.y = (unit.state.sY * (1-unit.state.t)) + (unit.state.tY * unit.state.t);
				// Early return watch out!
				return;
			}
			unit.x = unit.state.tX;
			unit.y = unit.state.tY;
			console.log(unit.state.d + "  " + unit.state._len)
			break;

		case 'aiming':
			shots.push({
				src: unit, trg: unit.state.target, dist: 0, speed: 250
			});
			unit.loaded = false;
			break;

		case 'reloading':
			unit.loaded = true;
			break;

		default:
			break;
	}
	
	unit.state = decideNextStateSoldier(unit);
}

function decideNextStateSoldier(unit) {
	var target = _.shuffle(troops.filter(t => t.army != unit.army))[0]

	if (target) {
		if (unit.loaded) {
			return {
				type: 'aiming',
				target: target,
				finishTime: gametick + Math.floor(Math.random() * 300) + 100
			}
		} else {
			return {
				type: 'reloading',
				finishTime: gametick + 5000 + Math.floor(Math.random() * 500)
			}
		}
	}

	return {
		type: 'waiting',
		finishTime: gametick + 1000
	}
}

function addSoldierToFormation(soldier, formation) {
	if (soldier.formation) {
		soldier.formation.soldiers = soldier.formation.soldiers.filter(s => s !== soldier)
	}
	formation.soldiers.push(soldier);
	soldier.formation = formation;
}

function cmd_formUp(formationId) {
	let frm = formations[formationId];

	let rowNum = 0;
	let rowPos = 0;

	frm.soldiers.forEach(s => {
		if (s.dead) return;
		let xTarget = frm.x + rowNum * frm.rowSpacing * -frm.rX;
		let yTarget = frm.y + (rowPos - frm.rowSize / 2) * frm.rowSpacing;
		let len = Math.sqrt(Math.pow(xTarget - s.x, 2) + Math.pow(yTarget - s.y, 2));

		s.state = {
			type: 'moving',
			sX: s.x,
			sY: s.y,
			tX: xTarget,
			tY: yTarget,
			d: 0.1 / len,
			t: 0,
			_len: len
		}

		rowPos++;
		if (rowPos > frm.rowSize) {
			rowPos = 0;
			rowNum++;
		}
	});
}