/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
import { wait } from './dijkstra';

const size = 50;

// const animateChecked = async (ctx, checked) => {
// 	for (let i = 0; i < checked.length; i += 1) {
// 		await wait(100);
// 		ctx.fillStyle = 'blue';
// 		ctx.fillRect(checked[i].x * size, checked[i].y * size, size, size);
// 		ctx.strokeRect(checked[i].x * size, checked[i].y * size, size, size);
// 	}
// };

const bfs = async (ctx, start, end) => {
	const startime = window.performance.now();

	const queue = [];
	const checked = [];

	queue.push(start);

	while (queue.length > 0) {
		const current = queue.shift();

		current.isVisited = true;
		checked.push(current);
		const { neighbors } = current;
		if (current === end) {
			// await animateChecked(ctx, checked);

			const endTime = window.performance.now();
			const time = (endTime - startime).toFixed(4);

			return new Promise(resolve => resolve({ checked, time }));
		}

		for (let i = 0; i < neighbors.length; i += 1) {
			const neighbor = neighbors[i];

			if (neighbor.isVisited) {
				continue;
			}

			if (neighbor.wall) continue;
			queue.push(neighbor);
			neighbor.isVisited = true;
			neighbor.parent = current;
		}
	}
	return 'error';
};

export const showBfsPath = async (ctx, path, start, end) => {
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
};

export { bfs };
