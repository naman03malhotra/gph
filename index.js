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
  let trace = {}, queue = [], order = [], toExplore;

  for (v in graph) {
    if(trace[v]) {
      continue;
    }
    trace[v] = 1;
    queue.push(v);

    while(queue.length != 0) {
      toExplore = queue.shift()
      order.push(toExplore);

      for(e in graph[toExplore]) {
        if(trace[e]) {
          continue;
        }
        trace[e] = 1;
        queue.push(e);
      }
    }
  }

  return order;
}


function recursiveUtil(graph, queue, trace, order) {
  if(!queue.length) {
    return;
  }
  let toExplore = queue.shift();

  for(e in graph[toExplore]) {
    if(trace[e]) {
      continue;
    }
    trace[e] = 1;
    queue.push(e);
    order.push(e);
  }

  recursiveUtil(graph, queue, trace, order);
}

function recursiveBfs(graph) {
  let trace = {}, queue = [], order = [], toExplore;

  for (v in graph) {
    if(trace[v]) {
      continue;
    }
    trace[v] = 1;
    queue.push(v);
    order.push(v);

    recursiveUtil(graph, queue, trace, order);
  }

  return order;
}

// console.log('bfs',bfs(graph));
// console.log('bfs_rec', recursiveBfs(graph));

const graph2 = {
  a: {
    b: {
      c: {
        d: {
          x: 1,
        }
      },
      e: {
        h: 1,
      }
    },
    f: 1,
  },
}

const graph3 = {
  a: {
    b: 1,
    f: 1,
  },
  b: {
    c: 1,
    e: 1,
  },
  c: {
    d: 1,
  },
  d: {
    x: 1,
  },
  e: {
    h: 1,
  },
}

function recDfs(index, graph, trace) {
    console.log(index, JSON.stringify(trace));
    if(trace[index]) {
      return;
    }
    trace[index] = 1;
    for(v in graph[index]) {
      if(trace[v]) {
        continue;
      }
      recDfs(v, graph, trace);
    }
}


function dfs(graph) {
  let trace = {};  
  for(index in graph) {
    recDfs(index, graph, trace);
  }

  return Object.keys(trace);
}

// console.log('dfs_rec', dfs(graph3));


const RULES = {
  company: {
    enable_roles: {
      enable_roles_one: {
        enable_roles_two: true,
      },
    },
    enable_roles_management: true,
  },
  company_admin: true,
  enable_roles: false,
  temp: (value) => value > 5,
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
export const NO_SOURCE_PASSED_ERR = 'Please pass source and rules data: matchRule(source, rules)';
const OBJECT_NOT_DEFINED = (key) => `The given key (${key}) is not defined in source object`;
const STRING_MATCHING = (rules, sourceToCompare) =>
  `String matching occured for the given rule, Rule data: ${rules}, Source data: ${sourceToCompare}`;
const FUNCTION_EXECUTED = (value) =>
  `Function was executed for the given rule with value: ${value}`;
const VALUE_EQUATED = (rules, sourceToCompare) =>
  `Value equated for the given rule, Rule data: ${rules}, Source data: ${sourceToCompare}`;

function matchBaseCase(sourceToCompare, rules, key, originalSource) {
  // checking if the source object is preset according to the rules
  if (sourceToCompare === undefined) {
    return {
      value: false,
      message: OBJECT_NOT_DEFINED(key),
    };
  }

  // if there is a string match then do compare
  if (typeof rules === 'string') {
    return {
      value: rules === sourceToCompare,
      message: STRING_MATCHING(rules, sourceToCompare),
    };
  }

  // if no more nested keys are present in the object then
  if (!Object.keys(rules).length) {
    // check for function then execute it with the current value of source object
    if (typeof rules === 'function') {
      return {
        value: rules(sourceToCompare, originalSource),
        message: FUNCTION_EXECUTED(sourceToCompare),
      };
    }

    // else match the value and return with message
    return {
      value: rules === sourceToCompare,
      message: VALUE_EQUATED(rules, sourceToCompare),
    };
  }

  // return continue if no condition is matched
  return { value: 'continue', message: '' };
}

function recursiveRuleUtil(sourceToCompare, rules, trace, key, originalSource) {
  // initializing result with true as rules inside a single object are always compared with AND
  let result = true;

  // matching base case to exit from recursion
  const { value, message } = matchBaseCase(sourceToCompare, rules, key, originalSource);

  // if base condition is met, then set trace value and message, and return boolean value
  if (value !== 'continue') {
    trace.value = value;
    trace.message = message;
    return value;
  }

  // DFS in remaining nodes of the object
  for (const currentDeepKey in rules) {
    // setting key in trace for next depth level
    trace[currentDeepKey] = {};

    // combining results using AND within a single rule
    result =
      result &&
      recursiveRuleUtil(
        sourceToCompare[currentDeepKey],
        rules[currentDeepKey],
        trace[currentDeepKey],
        currentDeepKey,
        originalSource
      );

    // return result if the first negative case is encountered in case of AND
    if (!result) {
      return result;
    }
  }

  return result;
}

function handleResult(result, trace, debug) {
  // if debug mode is on, then return result and log trace
  if (debug) {
    console.log('Trace object from matchRule:', trace);
  }

  return result;
}

function returnBaseError() {
  console.error(NO_SOURCE_PASSED_ERR);
  return false;
}

function matchRule(source, rules, options = {}) {
  const trace = {};
  const { operator = 'and', debug = false } = options;

  if (!source || !rules) {
    return returnBaseError();
  }

  // initial value for result to concatinate outputs from other rules
  let result = operator === 'and' ? true : false;

  // condition to handle if a single role is passed
  rules = Array.isArray(rules) ? rules : [rules];

  // outer loop to iterate multiple rules
  for (const rule in rules) {
    // initializing empty trace object with key of first rule
    trace[rule] = {};

    // update and compare with true if the operator is AND, with false if the operator is OR
    result =
      operator === 'and'
        ? result && recursiveRuleUtil(source, rules[rule], trace[rule], rule, source)
        : result || recursiveRuleUtil(source, rules[rule], trace[rule], rule, source);

    /**
     * return result if the first negative case is encountered in case of AND
     * return result if the first positive case is encountered in case of OR
     */
    if (operator === 'and' ? !result : result) {
      break;
    }
  }

  // this condition will hit when all the rules will be matched in case of AND, and no rules being matched in case of OR
  return handleResult(result, trace, debug);
}
console.log(matchRule(user, RULES));

