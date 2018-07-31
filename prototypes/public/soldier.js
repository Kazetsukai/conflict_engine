
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

	var action;
	var targetFormation;

	if (unit.formation) {
		if ((unit.formation.order === 'fire_at_will' || unit.formation.order === 'fire:' + unit.rank) && gametick >= unit.formation.time) {
			action = 'fire';
			targetFormation = unit.formation.target;
		}
	} else {
		action = 'fire';
	}

	if (action === 'fire') {
		var target;
		if (targetFormation) {
			target = targetFormation.soldiers[Math.floor(Math.random() * troops.length)];	
		} else {
			//target = troops[Math.floor(Math.random() * troops.length)];
		}

		if (target) {
			if (target.army == unit.army)
				return { type: 'idle' }

			if (unit.loaded) {
				return {
					type: 'aiming',
					target: target,
					finishTime: gametick + Math.floor(Math.random() * 10) + 10
				}
			} else {
				return {
					type: 'reloading',
					finishTime: gametick + 300 + Math.floor(Math.random() * 200)
				}
			}
		}
	}

	return {
		type: 'waiting',
		finishTime: gametick + 10
	}
}

function addSoldierToFormation(soldier, formation) {
	if (soldier.formation) {
		soldier.formation.soldiers = soldier.formation.soldiers.filter(s => s !== soldier)
	}
	formation.soldiers.push(soldier);
	soldier.formation = formation;
}