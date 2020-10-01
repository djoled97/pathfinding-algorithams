function addNeighbors(arr2D, arr, cols, rows, diagonals) {
	const neighbors = [];
	const { x } = arr;
	const { y } = arr;

	if (x < cols - 1) {
		neighbors.push(arr2D[x + 1][y]); // right
	}
	if (x > 0) {
		neighbors.push(arr2D[x - 1][y]); // left
	}
	if (y < rows - 1) {
		neighbors.push(arr2D[x][y + 1]);
	}
	if (y > 0) {
		neighbors.push(arr2D[x][y - 1]);
	}
	if (diagonals === true) {
		if (x > 0 && y > 0) {
			neighbors.push(arr2D[x - 1][y - 1]);
		}
		if (x < cols - 1 && y < rows - 1) {
			neighbors.push(arr2D[x + 1][y + 1]);
		}
		if (x > 0 && y < rows - 1) {
			neighbors.push(arr2D[x - 1][y + 1]);
		}
		if (x < cols - 1 && y > 0) {
			neighbors.push(arr2D[x + 1][y - 1]);
		}
	}
	return neighbors;
}

// eslint-disable-next-line import/prefer-default-export
export { addNeighbors };
