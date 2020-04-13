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

// console.log('bfs',bfs(graph));
// console.log('bfs_rec', recursiveBfs(graph));

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


function dfs(graph) {
  let covered = {};  
  for(index in graph) {
    recDfs(index, graph, covered);
  }

  return Object.keys(covered);
}

// console.log('dfs_rec', dfs(graph));


const RULES = {
  company: {
    enable_roles: {
      enable_roles_one: {
        enable_roles_two: true,
      },
      // enable_roles_one: {
      //   enable_roles_two: false,
      // }
    },
    // enable_roles: true,
    enable_roles_management: true,
  },
  company_admin: true,
  enable_roles: false,
  temp: (value) => value > 5,
  // enable_roles: true,
};

const RULES1 = {
  company: {
    country: 'us',
  },
},

const RULE_OR_1 = {
  role: 'role_admin',
}

const RULE_OR_2 = {
  company_admin: true,
}

const user = {
  company: {
    enable_roles: {
      enable_roles_one: {
        enable_roles_two: true,
      }
    },
    enable_roles_management: true,
    extra: 1,
    country: 'us',
  },
  enable_roles: false,
  company_admin: true,
  temp: 10,
  role: 'role_admin',
}

const OBJECT_NOT_DEFINED = 'The given object is not defined in source object';
const STRING_MATCHING = (rules, objectToCompare) => `String matching occured for the given rule, Rule data: ${rules}, Source data: ${objectToCompare}`;
const FUNCTION_EXECUTED = 'Function was executed for the given rule';
const VALUE_EQUATED = (rules, objectToCompare) => `Value equated for the given rule, Rule data: ${rules}, Source data: ${objectToCompare}`;

function matchBaseCase(i, objectToCompare, rules, covered) {
  
  if(objectToCompare === undefined) {
    return {
      value: false,
      message: OBJECT_NOT_DEFINED,
    };
  }

  if(typeof rules === 'string') {
    return {
      value: rules === objectToCompare, 
      message: STRING_MATCHING(rules, objectToCompare),
    };
  }

  if(!Object.keys(rules).length) {
    if(typeof rules === "function") {
      return { 
        value: rules(objectToCompare), 
        message: FUNCTION_EXECUTED 
      };
    } else {
      return { 
        value: rules === objectToCompare, message: VALUE_EQUATED(rules, objectToCompare),
      };
    }
  }

  return 'continue';
}

function recursiveRuleUtil(i, objectToCompare, rules, covered, DEBUG) {
  let count = 0, result = true;
  let baseCase = matchBaseCase(i, objectToCompare, rules, covered);
  const { value, message } = baseCase;

  if(baseCase !== 'continue') {
    covered.value = value;
    covered.message = message;
    return value;
  }
  

  for(v in rules) {
    covered[v] = {};
    result = result && recursiveRuleUtil(v, objectToCompare[v], rules[v], covered[v]);
    if(!result) {
      return result;
    }
    count++;
  }

  if(count === Object.keys(rules).length) {
    console.log('enas', i);
    return result;
  }
}

function matchRule(objectToCompare, rules, operator = 'and', DEBUG = false) {
  let covered = {}, result = operator === 'and' ? true : false;

  for(i in rules) {
    covered[i] = {};
    result = operator === 'and' ? (result && recursiveRuleUtil(i, objectToCompare, rules[i], covered[i])) : (result || recursiveRuleUtil(i, objectToCompare, rules[i], covered[i]));
    if(operator === 'and' ? !result : result) {
      return handleResult(result, covered, DEBUG);
    }
  }

  return handleResult(result, covered, DEBUG);
}

console.log(matchRule(user, [RULE_OR_1, RULE_OR_2], 'or', true));

function handleResult(result, covered, DEBUG) {
  if(DEBUG) {
    return {
      result,
      trace: covered,
    };
  }

  return result;
}

