/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import React from 'react';
import {
	Grid,
	Box,
	TextField,
	Checkbox,
	FormControlLabel,
	FormControl,
	FormLabel, FormGroup,
} from '@material-ui/core';

export default function EditCanvas({
	setDisabled,
	coordinates,
	grid,
	algoV,
}) {
	EditCanvas.propTypes = {
		setDisabled: PropTypes.func.isRequired,
		coordinates: PropTypes.object.isRequired,
		grid: PropTypes.object.isRequired,
		algoV: PropTypes.object.isRequired,

	};
	const maxY = Math.max(coordinates.y1, coordinates.y2) + 1;
	const maxX = Math.max(coordinates.x1, coordinates.x2) + 1;
	const handleCheckBox = (e) => {
		algoV.setAlgoValue(prevSate => ({
			...prevSate,
			[e.target.name]: e.target.checked,
		}));
	};

	return (
		<div>
			<Grid
				style={{ marginTop: 20 }}
				container
				direction="row"
				justify="center"
				alignItems="center"
			>
				<Box marginRight={2}>
					<label>Dimension </label>
				</Box>
				<Box width={70}>
					<TextField
						type="number"
						error={grid.cols < maxX}
						inputProps={{
							min: maxX,
						}}
						size="small"
						value={grid.cols}
						onChange={(e) => {
							grid.setCols(e.target.value);
							setDisabled(true);
						}}
						variant="outlined"
						placeholder="cols"
					/>
				</Box>
				<Box width={70} marginLeft={2}>
					<TextField
						error={grid.rows < maxY}
						size="small"
						type="number"
						value={grid.rows}
						inputProps={{
							min: maxY,
						}}
						onChange={(e) => {
							grid.setRows(e.target.value);
							setDisabled(true);
						}}
						variant="outlined"
						placeholder="rows"
					/>
				</Box>
			</Grid>

			<Grid
				style={{ marginTop: 20 }}
				container
				direction="row"
				justify="center"
				alignItems="center"
			>
				<Box marginRight={2}>
					<label>Start node</label>
				</Box>
				<Box width={70}>
					<TextField
						type="number"
						error={coordinates.x1 > grid.cols - 1}
						inputProps={{
							min: 0,
							max: grid.cols - 1,
						}}
						size="small"
						value={coordinates.x1}
						onChange={e => coordinates.setX1(e.target.value)}
						variant="outlined"
						placeholder="x"
					/>
				</Box>
				<Box width={70} marginLeft={2}>
					<TextField
						size="small"
						type="number"
						value={coordinates.y1}
						error={coordinates.y1 > grid.rows - 1}
						inputProps={{
							min: 0,
							max: grid.rows - 1,
						}}
						onChange={e => coordinates.setY1(e.target.value)}
						variant="outlined"
						placeholder="y"
					/>
				</Box>
			</Grid>
			<br />
			<Grid container direction="row" justify="center" alignItems="center">
				<Box marginRight={2}>
					<label>End node</label>
				</Box>
				<Box width={70}>
					<TextField
						error={coordinates.x2 > grid.cols - 1}
						size="small"
						type="number"
						value={coordinates.x2}
						inputProps={{
							min: 0,
							max: grid.cols - 1,
						}}
						onChange={e => coordinates.setX2(e.target.value)}
						variant="outlined"
						placeholder="x"
					/>
				</Box>
				<Box width={70} marginLeft={2}>
					<TextField
						type="number"
						error={coordinates.y2 > grid.rows - 1}
						size="small"
						value={coordinates.y2}
						inputProps={{
							min: 0,
							max: grid.rows - 1,
						}}
						onChange={e => coordinates.setY2(e.target.value)}
						variant="outlined"
						placeholder="y"
					/>
				</Box>
			</Grid>
			<br />
			<Grid container direction="row" justify="center" alignItems="center">
				<FormControl>
					<FormLabel>Choose algorithm </FormLabel>
					<FormGroup row>
						<FormControlLabel
							control={<Checkbox name="astar" onChange={handleCheckBox} />}
							label="A*"
						/>

						<FormControlLabel
							control={<Checkbox name="bfs" onChange={handleCheckBox} />}
							label="BFS"
						/>

						<FormControlLabel
							control={<Checkbox name="dijkstra" onChange={handleCheckBox} />}
							label="Dijkstra"
						/>
					</FormGroup>
				</FormControl>
				{/* <Select
          variant="outlined"
          style={{
            width: "250px",
          }}
          value={algos.algo}
          onChange={(e) => {
            algos.setAlgo(e.target.value);
            setCounter(0);
            setChecked(undefined);
          }}
        >
          <MenuItem value="astar">A*</MenuItem>
          <MenuItem value="dijkstra">Dijkstra</MenuItem>
          <MenuItem value="bfs">Breadth-first Search </MenuItem>
        </Select> */}
			</Grid>
		</div>
	);
}
