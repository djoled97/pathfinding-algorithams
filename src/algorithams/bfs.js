import { wait } from "./dijkstra";

const size = 50;
const bfs = async (ctx, start, end) => {
  let queue = [];
  let checked = [];
 
  queue.push(start);

 
 

  while (queue.length) {
    let current = queue.shift();

    current.isVisited = true;
    checked.push(current);
    const { neighbors } = current;
    if (current === end) {
      await animateChecked(ctx, checked);

      return new Promise((resolve) => resolve({ checked: checked }));
    }

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (neighbor.isVisited) continue;

      if (neighbor.wall) continue;
      queue.push(neighbor);
      neighbor.isVisited = true;
      neighbor.parent = current;
    }

    
  }
  return "error";
};

const animateChecked = async (ctx, checked) => {
  for (let i = 0; i < checked.length; i++) {
    await wait(50);
    ctx.fillStyle = "blue";
    ctx.fillRect(checked[i].x * size, checked[i].y * size, size, size);
    ctx.strokeRect(checked[i].x * size, checked[i].y * size, size, size);
  }
};
export const showBfsPath = (ctx, path, start, end) => {
  for (let i = 0; i < path.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.fillRect(path[i].x * size, path[i].y * size, size, size);
    ctx.strokeRect(path[i].x * size, path[i].y * size, size, size);
  }
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = "20px Calibri";
  ctx.fillText("Start", start.x * size + 5, start.y * size + 30);

  ctx.fillText("End", end.x * size + 5, end.y * size + 30); 
};

export { bfs };
