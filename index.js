const graph = {
  a: {
    c: 1,
    d: 1,
  },
  b: {
    c: 1,
  },
  c: {
    a: 1,
    b: 1,
    d: 1,
    e: 1,
  },
  d: {
    a: 1,
    c: 1,
    f: 1,
  },
  e: {
    c: 1,
  },
  f: {
    d: 1,
  },
  x: { y:1 },
};


function bfs(graph) {
  let covered = {}, queue = [], order = [], toExplore;

  for (v in graph) {
    if(covered[v]) {
      continue;
    }
    covered[v] = 1;
    queue.push(v);

    while(queue.length != 0) {
      toExplore = queue.shift()
      order.push(toExplore);

      for(e in graph[toExplore]) {
        if(covered[e]) {
          continue;
        }
        covered[e] = 1;
        queue.push(e);
      }
    }
  }

  return order;
}


function recursiveUtil(graph, queue, covered, order) {
  if(!queue.length) {
    return;
  }
  let toExplore = queue.shift();

  for(e in graph[toExplore]) {
    if(covered[e]) {
      continue;
    }
    covered[e] = 1;
    queue.push(e);
    order.push(e);
  }

  recursiveUtil(graph, queue, covered, order);
}

function recursiveBfs(graph) {
  let covered = {}, queue = [], order = [], toExplore;

  for (v in graph) {
    if(covered[v]) {
      continue;
    }
    covered[v] = 1;
    queue.push(v);
    order.push(v);

    recursiveUtil(graph, queue, covered, order);
  }

  return order;
}

console.log('bfs',bfs(graph));
console.log('bfs_rec', recursiveBfs(graph));

function recDfs(index, graph, covered) {
    if(covered[index]) {
      return;
    }
    covered[index] = 1;
    for(v in graph[index]) {
      if(covered[v]) {
        continue;
      }
      recDfs(v, graph, covered);
    }
}

z
function dfs(graph) {
  let covered = {};  
  for(index in graph) {
    recDfs(index, graph, covered);
  }

  return Object.keys(covered);
}

console.log('dfs_rec', dfs(graph));
