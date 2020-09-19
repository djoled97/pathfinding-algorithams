import React, { useRef, useEffect, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Card,
  Typography,
  CardHeader,
  CardContent,
} from "@material-ui/core";

import { astarSearch } from "../algorithams/astar";
import {
  dijkstraSearch,
  getNodesInShortestPathOrder,
  animateSearch,
  showPath,
} from "../algorithams/dijkstra";

import EditCanvas from "./EditCanvas";
import { draw } from "../helper-func/draw";
import { bfs, showBfsPath } from "../algorithams/bfs";
export default function Canvas() {
  const canvasRef = useRef(null);
  const size = 50;

  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(4);
  const [x2, setX2] = useState(9);
  const [y2, setY2] = useState(5);
  const [cols, setCols] = useState(10);
  const [rows, setRows] = useState(10);
  const [checked, setChecked] = useState();
  const [counter, setCounter] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [sizeDis, setSizeDis] = useState(false);
  const [algo, setAlgo] = useState("");
  let ctx;

  const twoDimArray = (cols, rows) => {
    let arr = new Array(+cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(+rows);
    }

    return arr;
  };
  const arr = twoDimArray(cols, rows);
  const [arr2D, setArr2D] = useState(arr);

  useEffect(() => {
    const canvasObj = canvasRef.current;

    ctx = canvasObj.getContext("2d");
    ctx.clearRect(0, 0, size * rows, size * cols);
    draw(ctx, arr2D, arr2D[x1][y1], arr2D[x2][y2], 0, cols, rows, true);
    setCounter(0);
    setDisabled(false);
  }, [arr2D]);

  // useEffect(() => {

  // }, [arr2D]);

  const search = (x1, y1, x2, y2, algo) => {
    setCounter(counter + 1);

    if (counter === 2) {
      setCounter(0);
    }

    const ctx = canvasRef.current.getContext("2d");

    if (algo === "astar") {
      ctx.clearRect(0, 0, size * cols, size * rows);
      draw(ctx, arr2D, arr2D[x1][y1], arr2D[x2][y2], counter, cols, rows, true);
      setDisabled(true);

      astarSearch(ctx, arr2D[x1][y1], arr2D[x2][y2]).then((data) => {
        setDisabled(false);
        setChecked(data);
      });
    } else if (algo === "dijkstra") {
      ctx.clearRect(0, 0, size * cols, size * rows);
      draw(ctx, arr2D, arr2D[x1][y1], arr2D[x2][y2], counter, cols, rows, true);

      const data = dijkstraSearch(
        arr2D,
        arr2D[x1][y1],
        arr2D[x2][y2],
        cols,
        rows
      );

      const shortestPath = getNodesInShortestPathOrder(arr2D[x2][y2]);
      setDisabled(true);
      animateSearch(ctx, data, size).then(() => {
        showPath(ctx, shortestPath, size, arr2D[x1][y1], arr2D[x2][y2]);
        setDisabled(false);
        setChecked(data);
      });
    } else if (algo === "bfs") {
      ctx.clearRect(0, 0, size * cols, size * rows);
      draw(ctx, arr2D, arr2D[x1][y1], arr2D[x2][y2], counter, cols, rows, true);
      setDisabled(true);
      bfs(ctx,  arr2D[x1][y1], arr2D[x2][y2]).then((data) => {
        setDisabled(false);
        showBfsPath(
          ctx,
          getNodesInShortestPathOrder(arr2D[x2][y2]),
          arr2D[x1][y1],
          arr2D[x2][y2]
        );
        setChecked(data);
      });
    }
  };

 const maxY= Math.max(y1, y2) + 1
const maxX=Math.max(x1, x2) + 1
  return (
    <div>
      <EditCanvas
        coordinates={{ x1, x2, y1, y2, setX1, setX2, setY1, setY2 }}
        grid={{ cols, rows, setCols, setRows }}
        arr2D={arr2D}
        setDisabled={setDisabled}
        algos={{ algo, setAlgo }}
        setCounter={setCounter}
        setChecked={setChecked}
      />

      <br />
      <Grid container direction="row" justify="center" alignItems="center">
        <Button
          color="primary"
          variant="outlined"
          disabled={cols==="" || rows==="" || cols<maxX || rows<maxY}
          onClick={() =>
            setArr2D(twoDimArray(cols, rows), setChecked(undefined))
          }
        >
          Change size
        </Button>
      </Grid>
      <br />
      <Grid container direction="row" justify="center" alignItems="center">
        <Button
          color="primary"
          variant="outlined"
          disabled={
            disabled ||
            algo === "" ||
            x1 === "" ||
            x2 === "" ||
            y2 === "" ||
            y1 === ""
          }
          onClick={() => search(x1, y1, x2, y2, algo)}
        >
          Start
        </Button>
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
                <Typography variant="subtitle2">Algoritham: {algo}</Typography>
                <Typography variant="subtitle2">
                  Checked fields: {checked.checked.length || ""}
                </Typography>
                <Typography variant="subtitle2">
                  Level :{counter === 0 ? 3 : counter}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      )}
    </div>
  );
}
