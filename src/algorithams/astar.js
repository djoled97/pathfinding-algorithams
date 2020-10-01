/* eslint-disable no-await-in-loop */
import { wait } from './dijkstra';

const size = 50;

const heuristic = (a, b) => {
	const result1 = Math.abs(b.x - a.x);
	const result2 = Math.abs(b.y - a.y);

	return result1 + result2;
};

const astarSearch = async (ctx, start, end) => {
	const startTime = window.performance.now();
	const openSet = [];
	const closedSet = [];
	const path = [];

	const walls = [];
	start.wall = false;
	end.wall = false;
	openSet.push(start);

	while (openSet.length > 0) {
		let lowest = 0;

		for (let i = 0; i < openSet.length; i += 1) {
			if (openSet[i].f < openSet[lowest].f) {
				lowest = i;
			}
		}

		const current = openSet[lowest];

		if (current === end) {
			console.log('END');

			let temp = current;
			path.push(temp);
			while (temp.parent) {
				path.push(temp.parent);
				temp = temp.parent;
			}
			// await  animateAstar(ctx, closedSet, openSet)
			//  await  animatePath(ctx, start, end, path)
			const time = (window.performance.now() - startTime).toFixed(4);
			const result = {
				path: path.reverse(),
				checked: closedSet,
				walls,
				time,
			};

			return new Promise(resolve => resolve(result));
		}

		openSet.splice(openSet.indexOf(current), 1);

		closedSet.push(current);

		for (let i = 0; i < current.neighbors.length; i += 1) {
			const neighbor = current.neighbors[i];

			if (!closedSet.includes(neighbor) && !neighbor.wall) {
				const tempG = current.g + heuristic(neighbor, current);
				if (!openSet.includes(neighbor)) {
					openSet.push(neighbor);
				} else if (tempG >= neighbor.g) {
					// eslint-disable-next-line no-continue
					continue;
				}

				neighbor.g = tempG;

				neighbor.h = heuristic(neighbor, end);
				neighbor.f = neighbor.g + neighbor.h;
				neighbor.parent = current;
			}
		}
	}

	return 'no solution';
};
export const animateAstar = async (ctx, closedSet, openSet) => {
	const max = Math.max(closedSet.length, openSet.length);
	let i = 0;
	while (i < max) {
		await wait(100);
		if (i < openSet.length) {
			ctx.beginPath();
			ctx.rect(openSet[i].x * size, openSet[i].y * size, size, size);
			ctx.fillStyle = 'green';
			ctx.stroke();
			ctx.fill();
		}
		if (i < closedSet.length) {
			ctx.beginPath();
			ctx.clearRect(closedSet[i].x * size, closedSet[i].y * size, size, size);
			ctx.rect(closedSet[i].x * size, closedSet[i].y * size, size, size);
			ctx.fillStyle = 'red';
			ctx.stroke();
			ctx.fill();
			ctx.closePath();
		}
		i += 1;
	}

	return new Promise(resolve => resolve());
};

export const animatePath = async (ctx, start, end, path) => {
	for (let i = 0; i < path.length; i += 1) {
		ctx.beginPath();
		ctx.clearRect(path[i].x * size, path[i].y * size, size, size);
		ctx.strokeRect(path[i].x * size, path[i].y * size, size, size);
	}

	for (let i = 0; i < path.length; i += 1) {
		await wait(50);
		ctx.beginPath();

		ctx.fillStyle = 'yellow';

		ctx.fillRect(path[i].x * size, path[i].y * size, size, size);
		ctx.strokeRect(path[i].x * size, path[i].y * size, size, size);
	}
	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.font = '20px Calibri';
	ctx.fillText('Start', start.x * size + 5, start.y * size + 30);

	ctx.fillText('End', end.x * size + 5, end.y * size + 30);

	return new Promise(resolve => resolve());
};

export { astarSearch };
