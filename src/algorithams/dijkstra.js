/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
// eslint-disable-next-line import/named
import { addNeighbors } from '../helper-func/addNeighbor';

const getUnvisitedNeighbors = (node, grid, cols, rows) => {
	const neighbors = addNeighbors(grid, node, cols, rows);

	return neighbors.filter(neighbor => !neighbor.isVisited);
};

const updateUnvisitedNeighbors = (node, grid, cols, rows) => {
	const unvisitedNeighbors = getUnvisitedNeighbors(node, grid, cols, rows);

	for (const neighbor of unvisitedNeighbors) {
		neighbor.distance = node.distance + 1;
		neighbor.parent = node;
	}
};
const sortNodesByDistance = (unvisitedNodes) => {
	unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};
export const getAllNodes = (grid) => {
	const nodes = [];
	for (const row of grid) {
		for (const node of row) {
			nodes.push(node);
		}
	}
	return nodes;
};

export function dijkstraSearch(grid, start, end, cols, rows) {
	const visitedOrder = [];
	start.distance = 0;
	const unvisited = getAllNodes(grid);
	const startTime = window.performance.now();

	while (unvisited.length) {
		sortNodesByDistance(unvisited);
		const closest = unvisited.shift();

		if (closest.wall) continue;

		if (closest.distance === Infinity) return { checked: visitedOrder };
		closest.isVisited = true;

		visitedOrder.push(closest);
		if (closest === end) {
			const endTime = window.performance.now();

			const time = (endTime - startTime).toFixed(4);
			return { checked: visitedOrder, time };
		}
		updateUnvisitedNeighbors(closest, grid, cols, rows);
	}
	return 'none';
}

export function getNodesInShortestPathOrder(end) {
	const nodesInShortestPathOrder = [];
	let currentNode = end;
	while (currentNode !== undefined) {
		nodesInShortestPathOrder.unshift(currentNode);
		currentNode = currentNode.parent;
	}
	return nodesInShortestPathOrder;
}
export async function wait(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
export const animateSearch = async (ctx, dijkstra, size) => {
	for (let i = 0; i < dijkstra.checked.length; i += 1) {
		await wait(50);
		ctx.fillStyle = 'blue';
		ctx.fillRect(dijkstra.checked[i].x * size, dijkstra.checked[i].y * size, size, size);
		ctx.strokeRect(dijkstra.checked[i].x * size, dijkstra.checked[i].y * size, size, size);
	}
	return new Promise(resolve => resolve());
};

export const showPath = async (ctx, path, size, start, end) => {
	for (let i = 0; i < path.length; i += 1) {
		ctx.beginPath();
		ctx.clearRect(path[i].x * size, path[i].y * size, size, size);
		ctx.strokeRect(path[i].x * size, path[i].y * size, size, size);
	}

	for (let i = 0; i < path.length; i += 1) {
		await wait(50);
		ctx.fillStyle = 'yellow';

		ctx.fillRect(path[i].x * size, path[i].y * size, size, size);
		ctx.strokeRect(path[i].x * size, path[i].y * size, size, size);
	}
	ctx.beginPath();
	ctx.fillStyle = '#000000';
	ctx.font = ' 20px  Calibri';
	ctx.fillText('Start', start.x * size + 5, start.y * size + 30);

	ctx.fillText('End', end.x * size + 5, end.y * size + 30);

	return new Promise(resolve => resolve());
};
