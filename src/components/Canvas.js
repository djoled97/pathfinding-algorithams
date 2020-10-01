/* eslint-disable no-shadow */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import React, { useRef, useEffect, useState } from 'react';
import {
	Grid,
	Box,
	Button,
	Card,
	Typography,
	CardHeader,
	CardContent,

} from '@material-ui/core';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import ReplayIcon from '@material-ui/icons/Replay';
import { animatePath, astarSearch } from '../algorithams/astar';
import {
	dijkstraSearch,
	getNodesInShortestPathOrder,
	showPath,
	wait,
} from '../algorithams/dijkstra';
import EditCanvas from './EditCanvas';
import draw from '../helper-func/draw';
import { bfs, showBfsPath } from '../algorithams/bfs';

export default function Canvas() {
	const canvasRef = useRef(null);
	const size = 50;

	const [x1, setX1] = useState(0);
	const [y1, setY1] = useState(4);
	const [x2, setX2] = useState(9);
	const [y2, setY2] = useState(4);
	const [cols, setCols] = useState(10);
	const [rows, setRows] = useState(10);
	const [checked, setChecked] = useState();
	const [counter, setCounter] = useState(0);
	const [disabled, setDisabled] = useState(false);
	const [algoValue, setAlgoValue] = useState({
		astar: false,
		bfs: false,
		dijkstra: false,
	});
	const [algo, setAlgo] = useState('');
	const [animValue, setAnimValue] = useState({ sortedTimes: '', results: '' });
	let ctx;

	const twoDimArray = (col, row) => {
		const arr = new Array(+col);
		for (let i = 0; i < arr.length; i += 1) {
			arr[i] = new Array(+row);
		}

		return arr;
	};
	const arr = twoDimArray(cols, rows);
	const [arr2D, setArr2D] = useState(arr);

	useEffect(() => {
		const canvasObj = canvasRef.current;

		ctx = canvasObj.getContext('2d');
		ctx.clearRect(0, 0, size * rows, size * cols);
		draw(ctx, arr2D, arr2D[x1][y1], arr2D[x2][y2], 0, cols, rows, true);
		setCounter(0);
		setDisabled(false);
	}, [arr2D]);

	const animate = async (sortedTimes, results) => {
		setDisabled(true);
		const ctx = canvasRef.current.getContext('2d');

		switch (sortedTimes[0].algo) {
		case 'bfs':
			setAlgo('bfs');

			await showBfsPath(
				ctx,
				getNodesInShortestPathOrder(arr2D[x2][y2]),
				arr2D[x1][y1],
				arr2D[x2][y2]
			);

			break;
		case 'astar':
			setAlgo('astar');

			await animatePath(
				ctx,
				arr2D[x1][y1],
				arr2D[x2][y2],
				results.resultAstar.path
			).then(() => {
				setChecked(results.resultAstar);
			});
			break;
		case 'dijkstra':
			setAlgo('dijkstra');

			await showPath(
				ctx,
				results.shortestPath,
				size,
				arr2D[x1][y1],
				arr2D[x2][y2]
			).then(() => {
				setChecked(results.resultDijkstra);
			});
			break;
		default:
		}
	};

	const search = async (x1, y1, x2, y2, autoCounter) => {
		if (autoCounter === undefined) {
			if (counter >= 2) {
				setCounter(0);
			} else {
				setCounter(counter + 1);
			}
		}

		const ctx = canvasRef.current.getContext('2d');
		let resultAstar; let resultBfs; let
			resultDijkstra;
		let shortestPath;
		const grid = { cols, rows, autoCounter };
		const times = [];
		if (algoValue.astar) {
			ctx.clearRect(0, 0, size * cols, size * rows);
			draw(ctx, arr2D, arr2D[x1][y1], arr2D[x2][y2], counter, grid, true);

			resultAstar = await astarSearch(ctx, arr2D[x1][y1], arr2D[x2][y2]);

			times.push({ algo: 'astar', time: resultAstar.time });
		}
		if (algoValue.dijkstra) {
			ctx.clearRect(0, 0, size * cols, size * rows);
			draw(ctx, arr2D, arr2D[x1][y1], arr2D[x2][y2], counter, grid, true);

			resultDijkstra = dijkstraSearch(
				arr2D,
				arr2D[x1][y1],
				arr2D[x2][y2],
				cols,
				rows
			);
			times.push({ algo: 'dijkstra', time: resultDijkstra.time });
			shortestPath = getNodesInShortestPathOrder(arr2D[x2][y2]);
		}
		if (algoValue.bfs) {
			ctx.clearRect(0, 0, size * cols, size * rows);
			draw(ctx, arr2D, arr2D[x1][y1], arr2D[x2][y2], counter, grid, true);

			resultBfs = await bfs(ctx, arr2D[x1][y1], arr2D[x2][y2]);

			setChecked(resultBfs);

			times.push({ algo: 'bfs', time: resultBfs.time });
		}
		const sortedTimes = times.sort((a, b) => a.time - b.time);
		const results = {
			resultAstar, resultBfs, resultDijkstra, shortestPath,
		};

		setAnimValue({ sortedTimes, results });

		await animate(sortedTimes, results);

		return counter;
	};

	const allFalse = (obj) => {
		for (const o in obj) if (obj[o]) return false;

		return true;
	};

	const autoRun = async () => {
		let autoCounter = 1;

		while (autoCounter < 4) {
			await search(x1, y1, x2, y2, autoCounter);
			setCounter(autoCounter);
			await wait(500);

			autoCounter += 1;
		}
		setCounter(0);
		setDisabled(false);
	};

	const maxY = Math.max(y1, y2) + 1;
	const maxX = Math.max(x1, x2) + 1;

	return (
		<div>
			<EditCanvas
				coordinates={{
					x1,
					x2,
					y1,
					y2,
					setX1,
					setX2,
					setY1,
					setY2,
				}}
				grid={{
					cols,
					rows,
					setCols,
					setRows,
				}}

				setDisabled={setDisabled}

				algoV={{ algoValue, setAlgoValue }}
			/>

			<br />
			<Grid container direction="row" justify="center" alignItems="center">
				<Button
					color="primary"
					variant="outlined"
					disabled={cols === '' || rows === '' || cols < maxX || rows < maxY}
					onClick={() => setArr2D(twoDimArray(cols, rows), setChecked(undefined))}
				>
					Change size
				</Button>
			</Grid>
			<br />
			<Grid container direction="row" justify="center" alignItems="center">
				<Button
					endIcon={<PlayCircleFilledWhiteIcon />}
					color="primary"
					variant="outlined"
					disabled={
						disabled ||

            x1 === '' ||
            x2 === '' ||
            y2 === '' ||
            y1 === '' ||
        allFalse(algoValue) === true
					}
					onClick={() => { search(x1, y1, x2, y2).then(() => setDisabled(false)); }}
				>
					Start
				</Button>
				<Box marginLeft={2}><Button variant="outlined" disabled={disabled || allFalse(algoValue) === true} onClick={() => { autoRun(counter); setDisabled(true); }}>Automatic</Button></Box>
				<Box marginLeft={2}>
					<Button
						variant="outlined"
						endIcon={<ReplayIcon />}
						onClick={() => animate(animValue.sortedTimes, animValue.results)}
						disabled={animValue.sortedTimes === '' || disabled}
					>
						Replay
					</Button>

				</Box>
			</Grid>
			<br />

			<Grid container direction="column" justify="center" alignItems="center">
				<canvas
					resize="true"
					ref={canvasRef}
					width={cols * size}
					height={rows * size}
				/>
				<br />
			</Grid>
			{checked !== undefined && (
				<Grid container direction="column" justify="center" alignItems="center">
					<Box marginBottom={5}>
						<Card variant="outlined">
							<CardHeader title="Results">
								<Typography variant="h4">Results</Typography>
							</CardHeader>
							<CardContent>
								<Typography variant="subtitle2">
									Algoritham:
									{algo}
								</Typography>
								<Typography variant="subtitle2">
									Checked fields:
									{' '}
									{checked.checked.length || ''}
								</Typography>
								<Typography variant="subtitle2">
									Time
									{' '}
									{checked.time || ''}
								</Typography>

								<Typography variant="subtitle2">
									Level :
									{counter === 0 ? 3 : counter}
								</Typography>
							</CardContent>
						</Card>
					</Box>
				</Grid>
			)}
		</div>
	);
}
