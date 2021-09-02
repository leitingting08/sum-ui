"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var vue = require("vue");
var shared = require("@vuepress/shared");
var nprogress$1 = require("nprogress");
var serverRenderer = require("@vue/server-renderer");
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  var n = { __proto__: null, [Symbol.toStringTag]: "Module" };
  if (e) {
    Object.keys(e).forEach(function(k) {
      if (k !== "default") {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function() {
            return e[k];
          }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}
var nprogress__namespace = /* @__PURE__ */ _interopNamespace(nprogress$1);
/*!
  * vue-router v4.0.11
  * (c) 2021 Eduardo San Martin Morote
  * @license MIT
  */
const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
const PolySymbol = (name) => hasSymbol ? Symbol(name) : "_vr_" + name;
const matchedRouteKey = /* @__PURE__ */ PolySymbol("rvlm");
const viewDepthKey = /* @__PURE__ */ PolySymbol("rvd");
const routerKey = /* @__PURE__ */ PolySymbol("r");
const routeLocationKey = /* @__PURE__ */ PolySymbol("rl");
const routerViewLocationKey = /* @__PURE__ */ PolySymbol("rvl");
const isBrowser = typeof window !== "undefined";
function isESModule(obj) {
  return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === "Module";
}
const assign = Object.assign;
function applyToParams(fn, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value);
  }
  return newParams;
}
const noop = () => {
};
function parseURL(parseQuery2, location, currentLocation = "/") {
  let path, query = {}, searchString = "", hash = "";
  const searchPos = location.indexOf("?");
  const hashPos = location.indexOf("#", searchPos > -1 ? searchPos : 0);
  if (searchPos > -1) {
    path = location.slice(0, searchPos);
    searchString = location.slice(searchPos + 1, hashPos > -1 ? hashPos : location.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location.slice(0, hashPos);
    hash = location.slice(hashPos, location.length);
  }
  path = resolveRelativePath(path != null ? path : location, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash,
    path,
    query,
    hash
  };
}
function stringifyURL(stringifyQuery2, location) {
  const query = location.query ? stringifyQuery2(location.query) : "";
  return location.path + (query && "?") + query + (location.hash || "");
}
function isSameRouteLocation(stringifyQuery2, a, b) {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length)
    return false;
  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a, b) {
  return Array.isArray(a) ? isEquivalentArray(a, b) : Array.isArray(b) ? isEquivalentArray(b, a) : a === b;
}
function isEquivalentArray(a, b) {
  return Array.isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (position === 1 || segment === ".")
      continue;
    if (segment === "..")
      position--;
    else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
}
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
const START = "";
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location) {
  return base.replace(BEFORE_HASH_RE, "#") + location;
}
function getElementPosition(el, offset) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset.behavior,
    left: elRect.left - docRect.left - (offset.left || 0),
    top: elRect.top - docRect.top - (offset.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function scrollToPosition(position) {
  let scrollToOptions;
  if ("el" in position) {
    const positionEl = position.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      return;
    }
    scrollToOptions = getElementPosition(el, position);
  } else {
    scrollToOptions = position;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
  }
}
function getScrollKey(path, delta) {
  const position = history.state ? history.state.position - delta : -1;
  return position + path;
}
const scrollPositions = new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
function createMemoryHistory(base = "") {
  let listeners = [];
  let queue = [START];
  let position = 0;
  function setLocation(location) {
    position++;
    if (position === queue.length) {
      queue.push(location);
    } else {
      queue.splice(position);
      queue.push(location);
    }
  }
  function triggerListeners(to, from, { direction, delta }) {
    const info = {
      direction,
      delta,
      type: NavigationType.pop
    };
    for (const callback of listeners) {
      callback(to, from, info);
    }
  }
  const routerHistory = {
    location: START,
    state: {},
    base,
    createHref: createHref.bind(null, base),
    replace(to) {
      queue.splice(position--, 1);
      setLocation(to);
    },
    push(to, data2) {
      setLocation(to);
    },
    listen(callback) {
      listeners.push(callback);
      return () => {
        const index2 = listeners.indexOf(callback);
        if (index2 > -1)
          listeners.splice(index2, 1);
      };
    },
    destroy() {
      listeners = [];
      queue = [START];
      position = 0;
    },
    go(delta, shouldTrigger = true) {
      const from = this.location;
      const direction = delta < 0 ? NavigationDirection.back : NavigationDirection.forward;
      position = Math.max(0, Math.min(position + delta, queue.length - 1));
      if (shouldTrigger) {
        triggerListeners(this.location, from, {
          direction,
          delta
        });
      }
    }
  };
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => queue[position]
  });
  return routerHistory;
}
function isRouteLocation(route) {
  return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
const NavigationFailureSymbol = /* @__PURE__ */ PolySymbol("nf");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  const score = [];
  let pattern = options.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [90];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict)
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i = 1; i < match.length; i++) {
      const value = match[i] || "";
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (Array.isArray(param) && !repeatable)
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          const text = Array.isArray(param) ? param.join("/") : param;
          if (!text) {
            if (optional) {
              if (segment.length < 2) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }
    return path;
  }
  return {
    re,
    score,
    keys,
    parse,
    stringify
  };
}
function compareScoreArray(a, b) {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    if (diff)
      return diff;
    i++;
  }
  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    if (comp)
      return comp;
    i++;
  }
  return bScore.length - aScore.length;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer = "";
  }
  function addCharToBuffer() {
    buffer += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher = assign(parser, {
    record,
    parent,
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes, globalOptions) {
  const matchers = [];
  const matcherMap = new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [
      mainNormalizedRecord
    ];
    if ("alias" in record) {
      const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases) {
        normalizedRecords.push(assign({}, mainNormalizedRecord, {
          components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
          path: alias,
          aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
        }));
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher))
          removeRoute(record.name);
      }
      if ("children" in mainNormalizedRecord) {
        const children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher;
      insertMatcher(matcher);
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index2 = matchers.indexOf(matcherRef);
      if (index2 > -1) {
        matchers.splice(index2, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    let i = 0;
    while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0)
      i++;
    matchers.splice(i, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve(location, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;
    if ("name" in location && location.name) {
      matcher = matcherMap.get(location.name);
      if (!matcher)
        throw createRouterError(1, {
          location
        });
      name = matcher.record.name;
      params = assign(paramsFromLocation(currentLocation.params, matcher.keys.filter((k) => !k.optional).map((k) => k.name)), location.params);
      path = matcher.stringify(params);
    } else if ("path" in location) {
      path = location.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location,
          currentLocation
        });
      name = matcher.record.name;
      params = assign({}, currentLocation.params, location.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes.forEach((route) => addRoute(route));
  return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
}
function paramsFromLocation(params, keys) {
  const newParams = {};
  for (const key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  return {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: void 0,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: new Set(),
    updateGuards: new Set(),
    enterCallbacks: {},
    components: "components" in record ? record.components || {} : { default: record.component }
  };
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (const name in record.components)
      propsObject[name] = typeof props === "boolean" ? props : props[name];
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
  const options = {};
  for (const key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }
  return options;
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text) {
  return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text) {
  return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
  try {
    return decodeURIComponent("" + text);
  } catch (err) {
  }
  return "" + text;
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    const eqPos = searchParam.indexOf("=");
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!Array.isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    const values = Array.isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (const key in query) {
    const value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = Array.isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
function useCallbacks() {
  let handlers = [];
  function add(handler) {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i > -1)
        handlers.splice(i, 1);
    };
  }
  function reset() {
    handlers = [];
  }
  return {
    add,
    list: () => handlers,
    reset
  };
}
function guardToPromiseFn(guard, to, from, record, name) {
  const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve, reject) => {
    const next = (valid) => {
      if (valid === false)
        reject(createRouterError(4, {
          from,
          to
        }));
      else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function")
          enterCallbackArray.push(valid);
        resolve();
      }
    };
    const guardReturn = guard.call(record && record.instances[name], to, from, next);
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        const options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.components[name] = resolvedComponent;
          const options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name)();
        }));
      }
    }
  }
  return guards;
}
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function useLink(props) {
  const router = vue.inject(routerKey);
  const currentRoute = vue.inject(routeLocationKey);
  const route = vue.computed(() => router.resolve(vue.unref(props.to)));
  const activeRecordIndex = vue.computed(() => {
    const { matched } = route.value;
    const { length } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    const index2 = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index2 > -1)
      return index2;
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index2;
  });
  const isActive = vue.computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = vue.computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      return router[vue.unref(props.replace) ? "replace" : "push"](vue.unref(props.to)).catch(noop);
    }
    return Promise.resolve();
  }
  return {
    route,
    href: vue.computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
const RouterLinkImpl = /* @__PURE__ */ vue.defineComponent({
  name: "RouterLink",
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink,
  setup(props, { slots }) {
    const link = vue.reactive(useLink(props));
    const { options } = vue.inject(routerKey);
    const elClass = vue.computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && slots.default(link);
      return props.custom ? children : vue.h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ vue.defineComponent({
  name: "RouterView",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  setup(props, { attrs, slots }) {
    const injectedRoute = vue.inject(routerViewLocationKey);
    const routeToDisplay = vue.computed(() => props.route || injectedRoute.value);
    const depth = vue.inject(viewDepthKey, 0);
    const matchedRouteRef = vue.computed(() => routeToDisplay.value.matched[depth]);
    vue.provide(viewDepthKey, depth + 1);
    vue.provide(matchedRouteKey, matchedRouteRef);
    vue.provide(routerViewLocationKey, routeToDisplay);
    const viewRef = vue.ref();
    vue.watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
      }
    }, { flush: "post" });
    return () => {
      const route = routeToDisplay.value;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[props.name];
      const currentName = props.name;
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route });
      }
      const routePropsOption = matchedRoute.props[props.name];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = vue.h(ViewComponent, assign({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return normalizeSlot(slots.default, { Component: component, route }) || component;
    };
  }
});
function normalizeSlot(slot, data2) {
  if (!slot)
    return null;
  const slotContent = slot(data2);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter(options) {
  const matcher = createRouterMatcher(options.routes, options);
  const parseQuery$1 = options.parseQuery || parseQuery;
  const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  const routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = vue.shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = applyToParams.bind(null, decode);
  function addRoute(parentOrRoute, route) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name) {
    const recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if ("path" in rawLocation) {
      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      const targetParams = assign({}, rawLocation.params);
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }
      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(rawLocation.params)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);
    return assign({
      fullPath,
      hash,
      query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
        newTargetLocation.params = {};
      }
      return assign({
        query: to.query,
        hash: to.hash,
        params: to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve(to);
    const from = currentRoute.value;
    const data2 = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
        state: data2,
        force,
        replace: replace2
      }), redirectedFrom || targetLocation);
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(from, from, true, false);
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? error : triggerError(error, toLocation, from)).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(failure2, 2)) {
          return pushWithRedirect(assign(locationAsObject(failure2.to), {
            state: data2,
            force,
            replace: replace2
          }), redirectedFrom || toLocation);
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data2);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of to.matched) {
        if (record.beforeEnter && !from.matched.includes(record)) {
          if (Array.isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    for (const guard of afterGuards.list())
      guard(to, from, failure);
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data2) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign({
          scroll: isFirstNavigation && state && state.scroll
        }, data2));
      else
        routerHistory.push(toLocation.fullPath, data2);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      const toLocation = resolve(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(error, 4 | 8)) {
          return error;
        }
        if (isNavigationFailure(error, 2)) {
          pushWithRedirect(error.to, toLocation).then((failure) => {
            if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop);
          return Promise.reject();
        }
        if (info.delta)
          routerHistory.go(-info.delta, false);
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(toLocation, from, false);
        if (failure) {
          if (info.delta) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop);
    });
  }
  let readyHandlers = useCallbacks();
  let errorHandlers = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorHandlers.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve2, reject) => {
      readyHandlers.add([resolve2, reject]);
    });
  }
  function markAsReady(err) {
    if (ready)
      return;
    ready = true;
    setupListeners();
    readyHandlers.list().forEach(([resolve2, reject]) => err ? reject(err) : resolve2());
    readyHandlers.reset();
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return vue.nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta) => routerHistory.go(delta);
  let started;
  const installedApps = new Set();
  const router = {
    currentRoute,
    addRoute,
    removeRoute,
    hasRoute,
    getRoutes,
    resolve,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorHandlers.add,
    isReady,
    install(app) {
      const router2 = this;
      app.component("RouterLink", RouterLink);
      app.component("RouterView", RouterView);
      app.config.globalProperties.$router = router2;
      Object.defineProperty(app.config.globalProperties, "$route", {
        enumerable: true,
        get: () => vue.unref(currentRoute)
      });
      if (isBrowser && !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        reactiveRoute[key] = vue.computed(() => currentRoute.value[key]);
      }
      app.provide(routerKey, router2);
      app.provide(routeLocationKey, vue.reactive(reactiveRoute));
      app.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app.unmount;
      installedApps.add(app);
      app.unmount = function() {
        installedApps.delete(app);
        if (installedApps.size < 1) {
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }
        unmountApp();
      };
    }
  };
  return router;
}
function runGuardQueue(guards) {
  return guards.reduce((promise2, guard) => promise2.then(() => guard()), Promise.resolve());
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
function useRouter() {
  return vue.inject(routerKey);
}
function useRoute() {
  return vue.inject(routeLocationKey);
}
const pagesComponent = {
  "/": vue.defineAsyncComponent(() => Promise.resolve().then(function() {
    return index;
  })),
  "/components/form.html": vue.defineAsyncComponent(() => Promise.resolve().then(function() {
    return form;
  })),
  "/components/layout.html": vue.defineAsyncComponent(() => Promise.resolve().then(function() {
    return layout;
  })),
  "/components/table.html": vue.defineAsyncComponent(() => Promise.resolve().then(function() {
    return table;
  })),
  "/guide/install.html": vue.defineAsyncComponent(() => Promise.resolve().then(function() {
    return install;
  })),
  "/guide/start.html": vue.defineAsyncComponent(() => Promise.resolve().then(function() {
    return start;
  })),
  "/404.html": vue.defineAsyncComponent(() => Promise.resolve().then(function() {
    return _404_html;
  }))
};
const pagesData$2 = {
  "/": () => Promise.resolve().then(function() {
    return v8daa1a0e;
  }).then(({ data: data2 }) => data2),
  "/components/form.html": () => Promise.resolve().then(function() {
    return v89c9a156;
  }).then(({ data: data2 }) => data2),
  "/components/layout.html": () => Promise.resolve().then(function() {
    return v1c7e20af;
  }).then(({ data: data2 }) => data2),
  "/components/table.html": () => Promise.resolve().then(function() {
    return vDf88a5ea;
  }).then(({ data: data2 }) => data2),
  "/guide/install.html": () => Promise.resolve().then(function() {
    return vE45cc9ec;
  }).then(({ data: data2 }) => data2),
  "/guide/start.html": () => Promise.resolve().then(function() {
    return v621628ba;
  }).then(({ data: data2 }) => data2),
  "/404.html": () => Promise.resolve().then(function() {
    return v3706649a;
  }).then(({ data: data2 }) => data2)
};
const pagesData$1 = vue.ref(vue.readonly(pagesData$2));
const pageDataEmpty$1 = vue.readonly({
  key: "",
  path: "",
  title: "",
  lang: "",
  frontmatter: {},
  excerpt: "",
  headers: []
});
const pageData$1 = vue.ref(pageDataEmpty$1);
const usePageData$1 = () => {
  return pageData$1;
};
const resolvePageData = async (routePath) => {
  const pageDataResolver = pagesData$1.value[routePath];
  if (!pageDataResolver) {
    return pageDataEmpty$1;
  }
  const pageData2 = await pageDataResolver();
  return pageData2 !== null && pageData2 !== void 0 ? pageData2 : pageDataEmpty$1;
};
if (false) {
  __VUE_HMR_RUNTIME__.updatePageData = (data2) => {
    if (data2.key === pageData$1.value.key) {
      pageData$1.value = data2;
    }
  };
}
const pageFrontmatterSymbol = Symbol("");
const usePageFrontmatter = () => {
  const pageFrontmatter = vue.inject(pageFrontmatterSymbol);
  if (!pageFrontmatter) {
    throw new Error("usePageFrontmatter() is called without provider.");
  }
  return pageFrontmatter;
};
const resolvePageFrontmatter = (pageData2) => pageData2.frontmatter;
const pageHeadSymbol = Symbol("");
const usePageHead = () => {
  const pageHead = vue.inject(pageHeadSymbol);
  if (!pageHead) {
    throw new Error("usePageHead() is called without provider.");
  }
  return pageHead;
};
const resolvePageHead = (headTitle, frontmatter, siteLocale) => {
  const description = shared.isString(frontmatter.description) ? frontmatter.description : siteLocale.description;
  const head = [
    ...shared.isArray(frontmatter.head) ? frontmatter.head : [],
    ...siteLocale.head,
    ["title", {}, headTitle],
    ["meta", { name: "description", content: description }],
    ["meta", { charset: "utf-8" }],
    [
      "meta",
      { name: "viewport", content: "width=device-width,initial-scale=1" }
    ],
    ["meta", { name: "generator", content: `VuePress ${"2.0.0-beta.6"}` }]
  ];
  return shared.dedupeHead(head);
};
const pageHeadTitleSymbol = Symbol("");
const resolvePageHeadTitle = (page, siteLocale) => `${page.title ? `${page.title} | ` : ``}${siteLocale.title}`;
const pageLangSymbol = Symbol("");
const usePageLang = () => {
  const pageLang = vue.inject(pageLangSymbol);
  if (!pageLang) {
    throw new Error("usePageLang() is called without provider.");
  }
  return pageLang;
};
const resolvePageLang = (pageData2) => pageData2.lang || "en";
const routeLocaleSymbol = Symbol("");
const useRouteLocale = () => {
  const routeLocale = vue.inject(routeLocaleSymbol);
  if (!routeLocale) {
    throw new Error("useRouteLocale() is called without provider.");
  }
  return routeLocale;
};
const resolveRouteLocale = (locales, routePath) => shared.resolveLocalePath(locales, routePath);
const siteData$2 = {
  "base": "/doc-sum-ui/",
  "lang": "en-US",
  "title": "sum-ui",
  "description": "",
  "head": [
    [
      "meta",
      {
        "name": "keywords",
        "content": "Vue3 UI \u7EC4\u4EF6\u5E93"
      }
    ],
    [
      "meta",
      {
        "name": "description",
        "content": "\u6B64\u6846\u67B6\u4F7F\u7528\u4E0E\u4E8C\u6B21\u5F00\u53D1\uFF0C\u524D\u7AEF\u6846\u67B6\u4F7F\u7528 Vue3\uFF0CUI \u6846\u67B6\u4F7F\u7528 element-plus\uFF0C\u5168\u5C40\u6570\u636E\u72B6\u6001\u7BA1\u7406\u4F7F\u7528 vuex\uFF0Cajax \u4F7F\u7528\u5E93\u4E3A axios\u3002\u7528\u4E8E\u5FEB\u901F\u642D\u5EFA\u4E2D\u540E\u53F0\u9875\u9762\u3002"
      }
    ]
  ],
  "locales": {}
};
const siteData$1 = vue.ref(vue.readonly(siteData$2));
const useSiteData = () => siteData$1;
if (false) {
  __VUE_HMR_RUNTIME__.updateSiteData = (data2) => {
    siteData$1.value = vue.readonly(data2);
  };
}
const siteLocaleDataSymbol = Symbol("");
const useSiteLocaleData = () => {
  const siteLocaleData = vue.inject(siteLocaleDataSymbol);
  if (!siteLocaleData) {
    throw new Error("useSiteLocaleData() is called without provider.");
  }
  return siteLocaleData;
};
const resolveSiteLocaleData = (site, routeLocale) => __spreadValues(__spreadValues({}, site), site.locales[routeLocale]);
const useUpdateHead = () => {
  useRoute();
  const head = usePageHead();
  const lang = usePageLang();
  {
    const ssrContext = vue.useSSRContext();
    if (ssrContext) {
      ssrContext.head = head.value;
      ssrContext.lang = lang.value;
    }
    return;
  }
};
const Content = (props) => {
  let key;
  if (props.pagePath) {
    key = props.pagePath;
  } else {
    const page = usePageData$1();
    key = page.value.path;
  }
  const component = pagesComponent[key];
  if (component) {
    return vue.h(component);
  }
  return vue.h("div", "404 Not Found");
};
Content.displayName = "Content";
Content.props = {
  pagePath: {
    type: String,
    required: false
  }
};
var OutboundLink$1 = ".icon.outbound {\n  position: relative;\n  display: inline-block;\n  color: #aaa;\n  vertical-align: middle;\n  top: -1px;\n}\n";
const svg = vue.h("svg", {
  class: "icon outbound",
  xmlns: "http://www.w3.org/2000/svg",
  ariaHidden: "true",
  focusable: "false",
  x: "0px",
  y: "0px",
  viewBox: "0 0 100 100",
  width: "15",
  height: "15"
}, [
  vue.h("path", {
    fill: "currentColor",
    d: "M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
  }),
  vue.h("polygon", {
    fill: "currentColor",
    points: "45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
  })
]);
const OutboundLink = (_, { slots }) => {
  var _a;
  return vue.h("span", [svg, (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
};
OutboundLink.displayName = "OutboundLink";
const layoutComponents = {
  "404": vue.defineAsyncComponent(() => Promise.resolve().then(function() {
    return _404;
  })),
  "Layout": vue.defineAsyncComponent(() => Promise.resolve().then(function() {
    return Layout;
  }))
};
const defineClientAppEnhance = (clientAppEnhance) => clientAppEnhance;
const defineClientAppSetup = (clientAppSetup) => clientAppSetup;
const withBase = (url) => {
  if (shared.isLinkHttp(url))
    return url;
  const base = useSiteData().value.base;
  return `${base}${url}`.replace(/\/+/, "/");
};
const _sfc_main$m = vue.defineComponent({
  name: "Badge",
  props: {
    type: {
      type: String,
      required: false,
      default: "tip"
    },
    text: {
      type: String,
      required: false,
      default: ""
    },
    vertical: {
      type: String,
      required: false,
      default: void 0
    }
  }
});
function _sfc_ssrRender$m(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<span${serverRenderer.ssrRenderAttrs(vue.mergeProps({
    class: ["badge", _ctx.type],
    style: {
      verticalAlign: _ctx.vertical
    }
  }, _attrs))}>`);
  serverRenderer.ssrRenderSlot(_ctx.$slots, "default", {}, () => {
    _push(`${serverRenderer.ssrInterpolate(_ctx.text)}`);
  }, _push, _parent);
  _push(`</span>`);
}
_sfc_main$m.ssrRender = _sfc_ssrRender$m;
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/global/Badge.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
var CodeGroup = vue.defineComponent({
  name: "CodeGroup",
  setup(_, { slots }) {
    const activeIndex = vue.ref(-1);
    return () => {
      var _a;
      const items = (((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)) || []).filter((vnode) => vnode.type.name === "CodeGroupItem").map((vnode) => {
        if (vnode.props === null) {
          vnode.props = {};
        }
        return vnode;
      });
      if (items.length === 0) {
        return null;
      }
      if (activeIndex.value === -1) {
        activeIndex.value = items.findIndex((vnode) => vnode.props.active === "" || vnode.props.active === true);
        if (activeIndex.value === -1) {
          activeIndex.value = 0;
        }
      } else {
        items.forEach((vnode, i) => {
          vnode.props.active = i === activeIndex.value;
        });
      }
      return vue.h("div", { class: "code-group" }, [
        vue.h("div", { class: "code-group__nav" }, vue.h("ul", { class: "code-group__ul" }, items.map((vnode, i) => vue.h("li", { class: "code-group__li" }, vue.h("button", {
          class: `code-group__nav-tab${i === activeIndex.value ? " code-group__nav-tab-active" : ""}`,
          onClick: () => activeIndex.value = i
        }, vnode.props.title))))),
        items
      ]);
    };
  }
});
const _sfc_main$l = vue.defineComponent({
  name: "CodeGroupItem",
  props: {
    title: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: false,
      default: false
    }
  }
});
function _sfc_ssrRender$l(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${serverRenderer.ssrRenderAttrs(vue.mergeProps({
    class: ["code-group-item", { "code-group-item__active": _ctx.active }]
  }, _attrs))}>`);
  serverRenderer.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
_sfc_main$l.ssrRender = _sfc_ssrRender$l;
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/global/CodeGroupItem.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const useResolveRouteWithRedirect = (...args) => {
  const router = useRouter();
  const route = router.resolve(...args);
  const lastMatched = route.matched[route.matched.length - 1];
  if (!(lastMatched === null || lastMatched === void 0 ? void 0 : lastMatched.redirect)) {
    return route;
  }
  const { redirect } = lastMatched;
  const resolvedRedirect = shared.isFunction(redirect) ? redirect(route) : redirect;
  const resolvedRedirectObj = shared.isString(resolvedRedirect) ? { path: resolvedRedirect } : resolvedRedirect;
  return useResolveRouteWithRedirect(__spreadValues({
    hash: route.hash,
    query: route.query,
    params: route.params
  }, resolvedRedirectObj));
};
const useNavLink = (item) => {
  const resolved = useResolveRouteWithRedirect(item);
  return {
    text: resolved.meta.title || item,
    link: resolved.name === "404" ? item : resolved.fullPath
  };
};
let promise = null;
let promiseResolve = null;
const scrollPromise = {
  wait: () => promise,
  pending: () => {
    promise = new Promise((resolve) => promiseResolve = resolve);
  },
  resolve: () => {
    promiseResolve === null || promiseResolve === void 0 ? void 0 : promiseResolve();
    promise = null;
    promiseResolve = null;
  }
};
const useScrollPromise = () => scrollPromise;
const sidebarItemsSymbol = Symbol("sidebarItems");
const useSidebarItems = () => {
  const sidebarItems = vue.inject(sidebarItemsSymbol);
  if (!sidebarItems) {
    throw new Error("useSidebarItems() is called without provider.");
  }
  return sidebarItems;
};
const resolveSidebarItems = (frontmatter, themeLocale) => {
  var _a, _b;
  const sidebarConfig = (_b = (_a = frontmatter.sidebar) !== null && _a !== void 0 ? _a : themeLocale.sidebar) !== null && _b !== void 0 ? _b : "auto";
  if (frontmatter.home === true || sidebarConfig === false) {
    return [];
  }
  if (sidebarConfig === "auto") {
    return resolveAutoSidebarItems();
  }
  if (shared.isArray(sidebarConfig)) {
    return resolveArraySidebarItems(sidebarConfig);
  }
  if (shared.isPlainObject(sidebarConfig)) {
    return resolveMultiSidebarItems(sidebarConfig);
  }
  return [];
};
const headerToSidebarItem = (header) => ({
  text: header.title,
  link: `#${header.slug}`,
  children: header.children.map(headerToSidebarItem)
});
const resolveAutoSidebarItems = () => {
  const page = usePageData$1();
  return [
    {
      isGroup: true,
      text: page.value.title,
      children: page.value.headers.map(headerToSidebarItem)
    }
  ];
};
const resolveArraySidebarItems = (sidebarConfig) => {
  const route = useRoute();
  const page = usePageData$1();
  const handleChildItem = (item) => {
    let childItem;
    if (shared.isString(item)) {
      childItem = useNavLink(item);
    } else {
      childItem = item;
    }
    if (childItem.isGroup && childItem.children) {
      return __spreadProps(__spreadValues({}, childItem), {
        children: childItem.children.map(handleChildItem)
      });
    }
    if (childItem.link === route.path && childItem.children === void 0) {
      return __spreadProps(__spreadValues({}, childItem), {
        children: page.value.headers.map(headerToSidebarItem)
      });
    }
    return childItem;
  };
  return sidebarConfig.map((item) => {
    if (shared.isString(item)) {
      return useNavLink(item);
    }
    if (!item.isGroup) {
      return item;
    }
    return __spreadProps(__spreadValues({}, item), {
      children: item.children.map(handleChildItem)
    });
  });
};
const resolveMultiSidebarItems = (sidebarConfig) => {
  var _a;
  const route = useRoute();
  const sidebarPath = shared.resolveLocalePath(sidebarConfig, route.path);
  const matchedSidebarConfig = (_a = sidebarConfig[sidebarPath]) !== null && _a !== void 0 ? _a : [];
  return resolveArraySidebarItems(matchedSidebarConfig);
};
const themeData$1 = {
  "sidebar": {
    "/": [
      {
        "text": "\u4ECB\u7ECD",
        "children": [
          {
            "text": "sum-ui \u662F\u4EC0\u4E48\uFF1F",
            "link": "/"
          },
          {
            "text": "\u5B89\u88C5",
            "link": "/guide/install"
          },
          {
            "text": "\u5FEB\u901F\u4E0A\u624B",
            "link": "/guide/start"
          }
        ]
      },
      {
        "text": "\u7EC4\u4EF6",
        "children": [
          {
            "text": "Layout \u5E03\u5C40",
            "link": "/components/layout"
          },
          {
            "text": "Table \u8868\u683C",
            "link": "/components/table"
          },
          {
            "text": "Form \u8868\u5355",
            "link": "/components/form"
          }
        ]
      }
    ]
  },
  "sidebarDepth": 2,
  "nav": [
    {
      "text": "\u4ECB\u7ECD",
      "link": "/",
      "activeMatch": "^/$|^/guide/"
    },
    {
      "text": "\u7EC4\u4EF6",
      "link": "/components/layout.html",
      "activeMatch": "^/$|^/components/"
    }
  ],
  "locales": {
    "/": {
      "selectLanguageName": "English",
      "danger": "WARNING"
    }
  },
  "navbar": [],
  "logo": null,
  "repo": null,
  "selectLanguageText": "Languages",
  "selectLanguageAriaLabel": "Select language",
  "editLink": true,
  "editLinkText": "Edit this page",
  "lastUpdated": true,
  "lastUpdatedText": "Last Updated",
  "contributors": true,
  "contributorsText": "Contributors",
  "notFound": [
    "There's nothing here.",
    "How did we get here?",
    "That's a Four-Oh-Four.",
    "Looks like we've got some broken links."
  ],
  "backToHome": "Take me home",
  "openInNewWindow": "open in new window"
};
const themeData = vue.ref(vue.readonly(themeData$1));
const useThemeData = () => themeData;
if (false) {
  __VUE_HMR_RUNTIME__.updateThemeData = (data2) => {
    themeData.value = vue.readonly(data2);
  };
}
const themeLocaleDataSymbol = Symbol("");
const useThemeLocaleData$1 = () => {
  const themeLocaleData = vue.inject(themeLocaleDataSymbol);
  if (!themeLocaleData) {
    throw new Error("useThemeLocaleData() is called without provider.");
  }
  return themeLocaleData;
};
const resolveThemeLocaleData = (theme, routeLocale) => {
  var _a;
  return __spreadValues(__spreadValues({}, theme), (_a = theme.locales) === null || _a === void 0 ? void 0 : _a[routeLocale]);
};
const useThemeLocaleData = () => useThemeLocaleData$1();
const _sfc_main$k = vue.defineComponent({
  name: "OutboundLink",
  components: {
    RawOutboundLink: OutboundLink
  },
  setup() {
    const themeLocale = useThemeLocaleData();
    return {
      themeLocale
    };
  }
});
function _sfc_ssrRender$k(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_RawOutboundLink = vue.resolveComponent("RawOutboundLink");
  _push(serverRenderer.ssrRenderComponent(_component_RawOutboundLink, _attrs, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<span class="sr-only"${_scopeId}>${serverRenderer.ssrInterpolate(_ctx.themeLocale.openInNewWindow)}</span>`);
      } else {
        return [
          vue.createVNode("span", { class: "sr-only" }, vue.toDisplayString(_ctx.themeLocale.openInNewWindow), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
}
_sfc_main$k.ssrRender = _sfc_ssrRender$k;
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/global/OutboundLink.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
var index$1 = 'html,\nbody {\n  padding: 0;\n  margin: 0;\n  background-color: #fff;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  font-size: 16px;\n  color: #2c3e50;\n}\n\na {\n  font-weight: 500;\n  color: #3eaf7c;\n  text-decoration: none;\n}\n\np a code {\n  font-weight: 400;\n  color: #3eaf7c;\n}\n\nkbd {\n  background: #eee;\n  border: solid 0.15rem #ddd;\n  border-bottom: solid 0.25rem #ddd;\n  border-radius: 0.15rem;\n  padding: 0 0.15em;\n}\n\nblockquote {\n  font-size: 1rem;\n  color: #999;\n  border-left: 0.2rem solid #dfe2e5;\n  margin: 1rem 0;\n  padding: 0.25rem 0 0.25rem 1rem;\n}\nblockquote > p {\n  margin: 0;\n}\n\nul,\nol {\n  padding-left: 1.2em;\n}\n\nstrong {\n  font-weight: 600;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-weight: 600;\n  line-height: 1.25;\n}\nh1:hover .header-anchor,\nh2:hover .header-anchor,\nh3:hover .header-anchor,\nh4:hover .header-anchor,\nh5:hover .header-anchor,\nh6:hover .header-anchor {\n  opacity: 1;\n}\n\nh1 {\n  font-size: 2.2rem;\n}\n\nh2 {\n  font-size: 1.65rem;\n  padding-bottom: 0.3rem;\n  border-bottom: 1px solid #eaecef;\n}\n\nh3 {\n  font-size: 1.35rem;\n}\n\nh4 {\n  font-size: 1.15rem;\n}\n\nh5 {\n  font-size: 1.05rem;\n}\n\nh6 {\n  font-size: 1rem;\n}\n\na.header-anchor {\n  font-size: 0.85em;\n  float: left;\n  margin-left: -0.87em;\n  padding-right: 0.23em;\n  margin-top: 0.125em;\n  opacity: 0;\n}\na.header-anchor:hover {\n  text-decoration: none;\n}\n\ncode,\nkbd {\n  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;\n}\n\np,\nul,\nol {\n  line-height: 1.7;\n}\n\nhr {\n  border: 0;\n  border-top: 1px solid #eaecef;\n}\n\ntable {\n  border-collapse: collapse;\n  margin: 1rem 0;\n  display: block;\n  overflow-x: auto;\n}\n\ntr {\n  border-top: 1px solid #dfe2e5;\n}\ntr:nth-child(2n) {\n  background-color: #f6f8fa;\n}\n\nth,\ntd {\n  border: 1px solid #dfe2e5;\n  padding: 0.6em 1em;\n}\n\n.arrow {\n  display: inline-block;\n  width: 0;\n  height: 0;\n}\n.arrow.up {\n  border-left: 4px solid transparent;\n  border-right: 4px solid transparent;\n  border-bottom: 6px solid #ccc;\n}\n.arrow.down {\n  border-left: 4px solid transparent;\n  border-right: 4px solid transparent;\n  border-top: 6px solid #ccc;\n}\n.arrow.right {\n  border-top: 4px solid transparent;\n  border-bottom: 4px solid transparent;\n  border-left: 6px solid #ccc;\n}\n.arrow.left {\n  border-top: 4px solid transparent;\n  border-bottom: 4px solid transparent;\n  border-right: 6px solid #ccc;\n}\n\n.badge {\n  display: inline-block;\n  font-size: 14px;\n  height: 18px;\n  line-height: 18px;\n  border-radius: 3px;\n  padding: 0 6px;\n  color: white;\n  background-color: #42b983;\n  vertical-align: top;\n}\n.table-of-contents .badge {\n  vertical-align: middle;\n}\n.badge.tip {\n  background-color: #42b983;\n}\n.badge.warning {\n  background-color: #e7c000;\n}\n.badge.danger {\n  background-color: #cc0000;\n}\n.badge + .badge {\n  margin-left: 5px;\n}\n\ncode[class*=language-],\npre[class*=language-] {\n  color: #ccc;\n  background: none;\n  font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;\n  font-size: 1em;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -moz-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none;\n}\n\n/* Code blocks */\npre[class*=language-] {\n  padding: 1em;\n  margin: 0.5em 0;\n  overflow: auto;\n}\n\n:not(pre) > code[class*=language-],\npre[class*=language-] {\n  background: #2d2d2d;\n}\n\n/* Inline code */\n:not(pre) > code[class*=language-] {\n  padding: 0.1em;\n  border-radius: 0.3em;\n  white-space: normal;\n}\n\n.token.comment,\n.token.block-comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: #999;\n}\n\n.token.punctuation {\n  color: #ccc;\n}\n\n.token.tag,\n.token.attr-name,\n.token.namespace,\n.token.deleted {\n  color: #ec5975;\n}\n\n.token.function-name {\n  color: #6196cc;\n}\n\n.token.boolean,\n.token.number,\n.token.function {\n  color: #f08d49;\n}\n\n.token.property,\n.token.class-name,\n.token.constant,\n.token.symbol {\n  color: #f8c555;\n}\n\n.token.selector,\n.token.important,\n.token.atrule,\n.token.keyword,\n.token.builtin {\n  color: #cc99cd;\n}\n\n.token.string,\n.token.char,\n.token.attr-value,\n.token.regex,\n.token.variable {\n  color: #7ec699;\n}\n\n.token.operator,\n.token.entity,\n.token.url {\n  color: #67cdcc;\n}\n\n.token.important,\n.token.bold {\n  font-weight: bold;\n}\n\n.token.italic {\n  font-style: italic;\n}\n\n.token.entity {\n  cursor: help;\n}\n\n.token.inserted {\n  color: #3eaf7c;\n}\n\n.theme-default-content code {\n  color: #476582;\n  padding: 0.25rem 0.5rem;\n  margin: 0;\n  font-size: 0.85em;\n  background-color: rgba(27, 31, 35, 0.05);\n  border-radius: 3px;\n}\n\n.theme-default-content pre,\n.theme-default-content pre[class*=language-] {\n  line-height: 1.4;\n  padding: 1.25rem 1.5rem;\n  margin: 0.85rem 0;\n  background-color: #282c34;\n  border-radius: 6px;\n  overflow: auto;\n}\n.theme-default-content pre code,\n.theme-default-content pre[class*=language-] code {\n  color: #fff;\n  padding: 0;\n  background-color: transparent;\n  border-radius: 0;\n}\n.theme-default-content .line-number {\n  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;\n}\n\ndiv[class*=language-] {\n  position: relative;\n  background-color: #282c34;\n  border-radius: 6px;\n}\ndiv[class*=language-]::before {\n  position: absolute;\n  z-index: 3;\n  top: 0.8em;\n  right: 1em;\n  font-size: 0.75rem;\n  color: rgba(255, 255, 255, 0.4);\n}\ndiv[class*=language-] pre,\ndiv[class*=language-] pre[class*=language-] {\n  background: transparent !important;\n  position: relative;\n  z-index: 1;\n}\ndiv[class*=language-] .highlight-lines {\n  user-select: none;\n  padding-top: 1.3rem;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  line-height: 1.4;\n}\ndiv[class*=language-] .highlight-lines .highlight-line {\n  background-color: rgba(0, 0, 0, 0.66);\n}\ndiv[class*=language-]:not(.line-numbers-mode) .line-numbers {\n  display: none;\n}\ndiv[class*=language-].line-numbers-mode .highlight-lines .highlight-line {\n  position: relative;\n}\ndiv[class*=language-].line-numbers-mode .highlight-lines .highlight-line::before {\n  content: " ";\n  position: absolute;\n  z-index: 2;\n  left: 0;\n  top: 0;\n  display: block;\n  width: 3.5rem;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.66);\n}\ndiv[class*=language-].line-numbers-mode pre {\n  margin-left: 3.5rem;\n  padding-left: 1rem;\n  vertical-align: middle;\n}\ndiv[class*=language-].line-numbers-mode .line-numbers {\n  position: absolute;\n  top: 0;\n  width: 3.5rem;\n  text-align: center;\n  color: rgba(255, 255, 255, 0.3);\n  padding-top: 1.25rem;\n  line-height: 1.4;\n}\ndiv[class*=language-].line-numbers-mode .line-numbers br {\n  user-select: none;\n}\ndiv[class*=language-].line-numbers-mode .line-numbers .line-number {\n  position: relative;\n  z-index: 3;\n  user-select: none;\n  font-size: 0.85em;\n}\ndiv[class*=language-].line-numbers-mode::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 3.5rem;\n  height: 100%;\n  border-radius: 6px 0 0 6px;\n  border-right: 1px solid rgba(0, 0, 0, 0.66);\n  background-color: #282c34;\n}\n\ndiv[class*=language-].ext-c:before {\n  content: "c";\n}\n\ndiv[class*=language-].ext-cpp:before {\n  content: "cpp";\n}\n\ndiv[class*=language-].ext-cs:before {\n  content: "cs";\n}\n\ndiv[class*=language-].ext-css:before {\n  content: "css";\n}\n\ndiv[class*=language-].ext-dart:before {\n  content: "dart";\n}\n\ndiv[class*=language-].ext-docker:before {\n  content: "docker";\n}\n\ndiv[class*=language-].ext-fs:before {\n  content: "fs";\n}\n\ndiv[class*=language-].ext-go:before {\n  content: "go";\n}\n\ndiv[class*=language-].ext-html:before {\n  content: "html";\n}\n\ndiv[class*=language-].ext-java:before {\n  content: "java";\n}\n\ndiv[class*=language-].ext-js:before {\n  content: "js";\n}\n\ndiv[class*=language-].ext-json:before {\n  content: "json";\n}\n\ndiv[class*=language-].ext-kt:before {\n  content: "kt";\n}\n\ndiv[class*=language-].ext-less:before {\n  content: "less";\n}\n\ndiv[class*=language-].ext-makefile:before {\n  content: "makefile";\n}\n\ndiv[class*=language-].ext-md:before {\n  content: "md";\n}\n\ndiv[class*=language-].ext-php:before {\n  content: "php";\n}\n\ndiv[class*=language-].ext-py:before {\n  content: "py";\n}\n\ndiv[class*=language-].ext-rb:before {\n  content: "rb";\n}\n\ndiv[class*=language-].ext-rs:before {\n  content: "rs";\n}\n\ndiv[class*=language-].ext-sass:before {\n  content: "sass";\n}\n\ndiv[class*=language-].ext-scss:before {\n  content: "scss";\n}\n\ndiv[class*=language-].ext-sh:before {\n  content: "sh";\n}\n\ndiv[class*=language-].ext-styl:before {\n  content: "styl";\n}\n\ndiv[class*=language-].ext-ts:before {\n  content: "ts";\n}\n\ndiv[class*=language-].ext-toml:before {\n  content: "toml";\n}\n\ndiv[class*=language-].ext-vue:before {\n  content: "vue";\n}\n\ndiv[class*=language-].ext-yml:before {\n  content: "yml";\n}\n\n@media (max-width: 419px) {\n  .theme-default-content div[class*=language-] {\n    margin: 0.85rem -1.5rem;\n    border-radius: 0;\n  }\n}\n.code-group__nav {\n  margin-top: 0.85rem;\n  margin-bottom: calc(-1.7rem - 6px);\n  padding-bottom: calc(1.7rem - 6px);\n  padding-left: 10px;\n  padding-top: 10px;\n  border-top-left-radius: 6px;\n  border-top-right-radius: 6px;\n  background-color: #282c34;\n}\n\n.code-group__ul {\n  margin: auto 0;\n  padding-left: 0;\n  display: inline-flex;\n  list-style: none;\n}\n\n.code-group__nav-tab {\n  border: 0;\n  padding: 5px;\n  cursor: pointer;\n  background-color: transparent;\n  font-size: 0.85em;\n  line-height: 1.4;\n  color: rgba(255, 255, 255, 0.9);\n  font-weight: 600;\n}\n\n.code-group__nav-tab:focus {\n  outline: none;\n}\n\n.code-group__nav-tab-active {\n  border-bottom: #3eaf7c 1px solid;\n}\n\n@media (max-width: 419px) {\n  .code-group__nav {\n    margin-left: -1.5rem;\n    margin-right: -1.5rem;\n    border-radius: 0;\n  }\n}\n/**\n * code-group-item\n */\n.code-group-item {\n  display: none;\n}\n\n.code-group-item__active {\n  display: block;\n}\n\n.code-group-item > pre {\n  background-color: orange;\n}\n\n.custom-container .custom-container-title {\n  font-weight: 600;\n  margin-bottom: -0.4rem;\n}\n.custom-container.tip, .custom-container.warning, .custom-container.danger {\n  padding: 0.1rem 1.5rem;\n  border-left-width: 0.5rem;\n  border-left-style: solid;\n  margin: 1rem 0;\n}\n.custom-container.tip {\n  background-color: #f3f5f7;\n  border-color: #42b983;\n}\n.custom-container.warning {\n  background-color: #fffae3;\n  border-color: #e7c000;\n  color: #746000;\n}\n.custom-container.warning .custom-container-title {\n  color: #ad9000;\n}\n.custom-container.warning a {\n  color: #2c3e50;\n}\n.custom-container.danger {\n  background-color: #ffe0e0;\n  border-color: #cc0000;\n  color: #660000;\n}\n.custom-container.danger .custom-container-title {\n  color: #990000;\n}\n.custom-container.danger a {\n  color: #2c3e50;\n}\n.custom-container.details {\n  display: block;\n  position: relative;\n  border-radius: 2px;\n  margin: 1.6em 0;\n  padding: 1.6em;\n  background-color: #eee;\n}\n.custom-container.details h4 {\n  margin-top: 0;\n}\n.custom-container.details figure:last-child,\n.custom-container.details p:last-child {\n  margin-bottom: 0;\n  padding-bottom: 0;\n}\n.custom-container.details summary {\n  outline: none;\n  cursor: pointer;\n}\n\n.dropdown-wrapper {\n  cursor: pointer;\n}\n.dropdown-wrapper .dropdown-title, .dropdown-wrapper .mobile-dropdown-title {\n  display: block;\n  font-size: 0.9rem;\n  font-family: inherit;\n  cursor: inherit;\n  padding: inherit;\n  line-height: 1.4rem;\n  background: transparent;\n  border: none;\n  font-weight: 500;\n  color: #2c3e50;\n}\n.dropdown-wrapper .dropdown-title:hover, .dropdown-wrapper .mobile-dropdown-title:hover {\n  border-color: transparent;\n}\n.dropdown-wrapper .dropdown-title .arrow, .dropdown-wrapper .mobile-dropdown-title .arrow {\n  vertical-align: middle;\n  margin-top: -1px;\n  margin-left: 0.4rem;\n}\n.dropdown-wrapper .mobile-dropdown-title {\n  display: none;\n  font-weight: 600;\n}\n.dropdown-wrapper .mobile-dropdown-title font-size inherit:hover {\n  color: #3eaf7c;\n}\n.dropdown-wrapper .nav-dropdown .dropdown-item {\n  color: inherit;\n  line-height: 1.7rem;\n}\n.dropdown-wrapper .nav-dropdown .dropdown-item .dropdown-subtitle {\n  margin: 0.45rem 0 0;\n  border-top: 1px solid #eee;\n  padding: 1rem 0 0.45rem 0;\n  font-size: 0.9rem;\n}\n.dropdown-wrapper .nav-dropdown .dropdown-item .dropdown-subtitle > span {\n  padding: 0 1.5rem 0 1.25rem;\n}\n.dropdown-wrapper .nav-dropdown .dropdown-item .dropdown-subtitle > a {\n  font-weight: inherit;\n}\n.dropdown-wrapper .nav-dropdown .dropdown-item .dropdown-subtitle > a.router-link-active::after {\n  display: none;\n}\n.dropdown-wrapper .nav-dropdown .dropdown-item .dropdown-subitem-wrapper {\n  padding: 0;\n  list-style: none;\n}\n.dropdown-wrapper .nav-dropdown .dropdown-item .dropdown-subitem-wrapper .dropdown-subitem {\n  font-size: 0.9em;\n}\n.dropdown-wrapper .nav-dropdown .dropdown-item a {\n  display: block;\n  line-height: 1.7rem;\n  position: relative;\n  border-bottom: none;\n  font-weight: 400;\n  margin-bottom: 0;\n  padding: 0 1.5rem 0 1.25rem;\n}\n.dropdown-wrapper .nav-dropdown .dropdown-item a:hover {\n  color: #3eaf7c;\n}\n.dropdown-wrapper .nav-dropdown .dropdown-item a.router-link-active {\n  color: #3eaf7c;\n}\n.dropdown-wrapper .nav-dropdown .dropdown-item a.router-link-active::after {\n  content: "";\n  width: 0;\n  height: 0;\n  border-left: 5px solid #3eaf7c;\n  border-top: 3px solid transparent;\n  border-bottom: 3px solid transparent;\n  position: absolute;\n  top: calc(50% - 2px);\n  left: 9px;\n}\n.dropdown-wrapper .nav-dropdown .dropdown-item:first-child .dropdown-subtitle {\n  margin-top: 0;\n  padding-top: 0;\n  border-top: 0;\n}\n\n@media (max-width: 719px) {\n  .dropdown-wrapper.open .dropdown-title, .dropdown-wrapper.open .mobile-dropdown-title {\n    margin-bottom: 0.5rem;\n  }\n  .dropdown-wrapper .dropdown-title, .dropdown-wrapper .mobile-dropdown-title {\n    display: none;\n  }\n  .dropdown-wrapper .mobile-dropdown-title {\n    display: block;\n  }\n  .dropdown-wrapper .nav-dropdown {\n    transition: height 0.1s ease-out;\n    overflow: hidden;\n  }\n  .dropdown-wrapper .nav-dropdown .dropdown-item .dropdown-subtitle {\n    border-top: 0;\n    margin-top: 0;\n    padding-top: 0;\n    padding-bottom: 0;\n  }\n  .dropdown-wrapper .nav-dropdown .dropdown-item .dropdown-subtitle, .dropdown-wrapper .nav-dropdown .dropdown-item > a {\n    font-size: 15px;\n    line-height: 2rem;\n  }\n  .dropdown-wrapper .nav-dropdown .dropdown-item .dropdown-subitem {\n    font-size: 14px;\n    padding-left: 1rem;\n  }\n}\n@media (min-width: 719px) {\n  .dropdown-wrapper {\n    height: 1.8rem;\n  }\n  .dropdown-wrapper:hover .nav-dropdown, .dropdown-wrapper.open .nav-dropdown {\n    display: block !important;\n  }\n  .dropdown-wrapper.open:blur {\n    display: none;\n  }\n  .dropdown-wrapper .nav-dropdown {\n    display: none;\n    height: auto !important;\n    box-sizing: border-box;\n    max-height: calc(100vh - 2.7rem);\n    overflow-y: auto;\n    position: absolute;\n    top: 100%;\n    right: 0;\n    background-color: #fff;\n    padding: 0.6rem 0;\n    border: 1px solid #ddd;\n    border-bottom-color: #ccc;\n    text-align: left;\n    border-radius: 0.25rem;\n    white-space: nowrap;\n    margin: 0;\n  }\n}\n/**\n * transition\n */\n.dropdown-enter-from,\n.dropdown-leave-to {\n  height: 0 !important;\n}\n\n.home {\n  padding: 3.6rem 2rem 0;\n  max-width: 960px;\n  margin: 0px auto;\n  display: block;\n}\n.home .hero {\n  text-align: center;\n}\n.home .hero img {\n  max-width: 100%;\n  max-height: 280px;\n  display: block;\n  margin: 3rem auto 1.5rem;\n}\n.home .hero h1 {\n  font-size: 3rem;\n}\n.home .hero h1,\n.home .hero .description,\n.home .hero .actions {\n  margin: 1.8rem auto;\n}\n.home .hero .description {\n  max-width: 35rem;\n  font-size: 1.6rem;\n  line-height: 1.3;\n  color: #6a8bad;\n}\n.home .hero .action-button {\n  display: inline-block;\n  font-size: 1.2rem;\n  padding: 0.8rem 1.6rem;\n  border-width: 2px;\n  border-style: solid;\n  border-radius: 4px;\n  transition: background-color 0.1s ease;\n  box-sizing: border-box;\n}\n.home .hero .action-button:not(:first-child) {\n  margin-left: 1.5rem;\n}\n.home .hero .action-button.primary {\n  color: #fff;\n  background-color: #3eaf7c;\n  border-color: #3eaf7c;\n}\n.home .hero .action-button.primary:hover {\n  background-color: #4abf8a;\n}\n.home .hero .action-button.secondary {\n  color: #3eaf7c;\n  background-color: #fff;\n  border-color: #3eaf7c;\n}\n.home .hero .action-button.secondary:hover {\n  color: #fff;\n  background-color: #4abf8a;\n}\n.home .features {\n  border-top: 1px solid #eaecef;\n  padding: 1.2rem 0;\n  margin-top: 2.5rem;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: flex-start;\n  align-content: stretch;\n  justify-content: space-between;\n}\n.home .feature {\n  flex-grow: 1;\n  flex-basis: 30%;\n  max-width: 30%;\n}\n.home .feature h2 {\n  font-size: 1.4rem;\n  font-weight: 500;\n  border-bottom: none;\n  padding-bottom: 0;\n  color: #3a5169;\n}\n.home .feature p {\n  color: #4e6e8e;\n}\n.home .footer {\n  padding: 2.5rem;\n  border-top: 1px solid #eaecef;\n  text-align: center;\n  color: #4e6e8e;\n}\n\n@media (max-width: 719px) {\n  .home .features {\n    flex-direction: column;\n  }\n  .home .feature {\n    max-width: 100%;\n    padding: 0 2.5rem;\n  }\n}\n@media (max-width: 419px) {\n  .home {\n    padding-left: 1.5rem;\n    padding-right: 1.5rem;\n  }\n  .home .hero img {\n    max-height: 210px;\n    margin: 2rem auto 1.2rem;\n  }\n  .home .hero h1 {\n    font-size: 2rem;\n  }\n  .home .hero h1,\n.home .hero .description,\n.home .hero .actions {\n    margin: 1.2rem auto;\n  }\n  .home .hero .description {\n    font-size: 1.2rem;\n  }\n  .home .hero .action-button {\n    font-size: 1rem;\n    padding: 0.6rem 1.2rem;\n  }\n  .home .feature h2 {\n    font-size: 1.25rem;\n  }\n}\n.theme-default-content:not(.custom) {\n  max-width: 740px;\n  margin: 0 auto;\n  padding: 2rem 2.5rem;\n}\n@media (max-width: 959px) {\n  .theme-default-content:not(.custom) {\n    padding: 2rem;\n  }\n}\n@media (max-width: 419px) {\n  .theme-default-content:not(.custom) {\n    padding: 1.5rem;\n  }\n}\n\n.page {\n  padding-left: 20rem;\n}\n\n.navbar {\n  position: fixed;\n  z-index: 20;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 3.6rem;\n  background-color: #fff;\n  box-sizing: border-box;\n  border-bottom: 1px solid #eaecef;\n}\n\n.sidebar {\n  font-size: 16px;\n  background-color: #fff;\n  width: 20rem;\n  position: fixed;\n  z-index: 10;\n  margin: 0;\n  top: 3.6rem;\n  left: 0;\n  bottom: 0;\n  box-sizing: border-box;\n  border-right: 1px solid #eaecef;\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: #3eaf7c #eaecef;\n}\n.sidebar::-webkit-scrollbar {\n  width: 7px;\n}\n.sidebar::-webkit-scrollbar-track {\n  background-color: #eaecef;\n}\n.sidebar::-webkit-scrollbar-thumb {\n  background-color: #3eaf7c;\n}\n\n.sidebar-mask {\n  position: fixed;\n  z-index: 9;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  display: none;\n}\n\n.theme-container.sidebar-open .sidebar-mask {\n  display: block;\n}\n.theme-container.no-navbar .theme-default-content:not(.custom) > h1,\n.theme-container.no-navbar h2,\n.theme-container.no-navbar h3,\n.theme-container.no-navbar h4,\n.theme-container.no-navbar h5,\n.theme-container.no-navbar h6 {\n  margin-top: 1.5rem;\n  padding-top: 0;\n}\n.theme-container.no-navbar .sidebar {\n  top: 0;\n}\n\n@media (min-width: 720px) {\n  .theme-container.no-sidebar .sidebar {\n    display: none;\n  }\n  .theme-container.no-sidebar .page {\n    padding-left: 0;\n  }\n}\n.theme-default-content:not(.custom) > h1,\n.theme-default-content:not(.custom) > h2,\n.theme-default-content:not(.custom) > h3,\n.theme-default-content:not(.custom) > h4,\n.theme-default-content:not(.custom) > h5,\n.theme-default-content:not(.custom) > h6 {\n  margin-top: -3.1rem;\n  padding-top: 4.6rem;\n  margin-bottom: 0;\n}\n.theme-default-content:not(.custom) > h1:first-child,\n.theme-default-content:not(.custom) > h2:first-child,\n.theme-default-content:not(.custom) > h3:first-child,\n.theme-default-content:not(.custom) > h4:first-child,\n.theme-default-content:not(.custom) > h5:first-child,\n.theme-default-content:not(.custom) > h6:first-child {\n  margin-top: -1.5rem;\n  margin-bottom: 1rem;\n}\n.theme-default-content:not(.custom) > h1:first-child + p,\n.theme-default-content:not(.custom) > h1:first-child + pre,\n.theme-default-content:not(.custom) > h1:first-child + .custom-container,\n.theme-default-content:not(.custom) > h2:first-child + p,\n.theme-default-content:not(.custom) > h2:first-child + pre,\n.theme-default-content:not(.custom) > h2:first-child + .custom-container,\n.theme-default-content:not(.custom) > h3:first-child + p,\n.theme-default-content:not(.custom) > h3:first-child + pre,\n.theme-default-content:not(.custom) > h3:first-child + .custom-container,\n.theme-default-content:not(.custom) > h4:first-child + p,\n.theme-default-content:not(.custom) > h4:first-child + pre,\n.theme-default-content:not(.custom) > h4:first-child + .custom-container,\n.theme-default-content:not(.custom) > h5:first-child + p,\n.theme-default-content:not(.custom) > h5:first-child + pre,\n.theme-default-content:not(.custom) > h5:first-child + .custom-container,\n.theme-default-content:not(.custom) > h6:first-child + p,\n.theme-default-content:not(.custom) > h6:first-child + pre,\n.theme-default-content:not(.custom) > h6:first-child + .custom-container {\n  margin-top: 2rem;\n}\n\n.theme-default-content:not(.custom) > *:first-child {\n  margin-top: 3.6rem;\n}\n.theme-default-content:not(.custom) a:hover {\n  text-decoration: underline;\n}\n.theme-default-content:not(.custom) p.demo {\n  padding: 1rem 1.5rem;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n}\n.theme-default-content:not(.custom) img {\n  max-width: 100%;\n}\n\n.theme-default-content.custom {\n  padding: 0;\n  margin: 0;\n}\n.theme-default-content.custom img {\n  max-width: 100%;\n}\n\n@media (max-width: 959px) {\n  .sidebar {\n    font-size: 15px;\n    width: 16.4rem;\n  }\n\n  .page {\n    padding-left: 16.4rem;\n  }\n}\n@media (max-width: 719px) {\n  .sidebar {\n    top: 0;\n    padding-top: 3.6rem;\n    transform: translateX(-100%);\n    transition: transform 0.2s ease;\n  }\n\n  .page {\n    padding-left: 0;\n  }\n\n  .theme-container.sidebar-open .sidebar {\n    transform: translateX(0);\n  }\n  .theme-container.no-navbar .sidebar {\n    padding-top: 0;\n  }\n}\n@media (max-width: 419px) {\n  h1 {\n    font-size: 1.9rem;\n  }\n}\n.navbar {\n  padding: 0.7rem 1.5rem;\n  line-height: 2.2rem;\n}\n.navbar .logo {\n  height: 2.2rem;\n  min-width: 2.2rem;\n  margin-right: 0.8rem;\n  vertical-align: top;\n}\n.navbar .site-name {\n  font-size: 1.3rem;\n  font-weight: 600;\n  color: #2c3e50;\n  position: relative;\n}\n.navbar .navbar-links-wrapper {\n  padding-left: 1.5rem;\n  box-sizing: border-box;\n  background-color: white;\n  white-space: nowrap;\n  font-size: 0.9rem;\n  position: absolute;\n  right: 1.5rem;\n  top: 0.7rem;\n  display: flex;\n}\n.navbar .navbar-links-wrapper .search-box {\n  flex: 0 0 auto;\n  vertical-align: top;\n}\n\n@media (max-width: 719px) {\n  .navbar {\n    padding-left: 4rem;\n  }\n  .navbar .can-hide {\n    display: none;\n  }\n  .navbar .navbar-links-wrapper {\n    padding-left: 1.5rem;\n  }\n  .navbar .site-name {\n    width: calc(100vw - 9.4rem);\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n  }\n}\n/**\n * navbar-links\n */\n.navbar-links {\n  display: inline-block;\n}\n.navbar-links a {\n  display: inline-block;\n  line-height: 1.4rem;\n  color: inherit;\n}\n.navbar-links a:hover, .navbar-links a.router-link-active {\n  color: #3eaf7c;\n}\n.navbar-links .navbar-links-item {\n  position: relative;\n  display: inline-block;\n  margin-left: 1.5rem;\n  line-height: 2rem;\n}\n.navbar-links .navbar-links-item:first-child {\n  margin-left: 0;\n}\n\n@media (max-width: 719px) {\n  .navbar-links .navbar-links-item {\n    margin-left: 0;\n  }\n}\n@media (min-width: 719px) {\n  .navbar-links a:hover, .navbar-links a.router-link-active {\n    color: #2c3e50;\n  }\n\n  .navbar-links-item > a:not(.external):hover, .navbar-links-item > a:not(.external).router-link-active {\n    margin-bottom: -2px;\n    border-bottom: 2px solid #46bd87;\n  }\n}\n/**\n * toggle sidebar button\n */\n.toggle-sidebar-button {\n  position: absolute;\n  top: 0.6rem;\n  left: 1rem;\n  display: none;\n  padding: 0.6rem;\n  cursor: pointer;\n}\n\n.toggle-sidebar-button .icon {\n  display: block;\n  width: 1.25rem;\n  height: 1.25rem;\n}\n\n@media screen and (max-width: 719px) {\n  .toggle-sidebar-button {\n    display: block;\n  }\n}\n.page-nav, .page-meta {\n  max-width: 740px;\n  margin: 0 auto;\n  padding: 2rem 2.5rem;\n}\n@media (max-width: 959px) {\n  .page-nav, .page-meta {\n    padding: 2rem;\n  }\n}\n@media (max-width: 419px) {\n  .page-nav, .page-meta {\n    padding: 1.5rem;\n  }\n}\n\n.page {\n  padding-bottom: 2rem;\n  display: block;\n}\n\n.page-meta {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n  overflow: auto;\n}\n.page-meta .meta-item {\n  cursor: default;\n  margin-top: 0.8rem;\n}\n.page-meta .meta-item .meta-item-label {\n  font-weight: 500;\n  color: #4e6e8e;\n}\n.page-meta .meta-item .meta-item-info {\n  font-weight: 400;\n  color: #767676;\n}\n.page-meta .edit-link {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.page-meta .last-updated {\n  float: right;\n}\n\n@media (max-width: 719px) {\n  .page-meta .last-updated {\n    font-size: 0.8em;\n    float: none;\n  }\n  .page-meta .contributors {\n    font-size: 0.8em;\n  }\n}\n.page-nav {\n  padding-top: 1rem;\n  padding-bottom: 0;\n}\n.page-nav .inner {\n  min-height: 2rem;\n  margin-top: 0;\n  border-top: 1px solid #eaecef;\n  padding-top: 1rem;\n  overflow: auto;\n}\n.page-nav .next {\n  float: right;\n}\n\n.back-to-top {\n  --back-to-top-color: #3eaf7c;\n  --back-to-top-color-hover: #72cda4;\n}\n\n#nprogress {\n  --nprogress-color: #3eaf7c;\n}\n\n.DocSearch {\n  --docsearch-primary-color: #3eaf7c;\n  --docsearch-highlight-color: var(--docsearch-primary-color);\n  --docsearch-searchbox-shadow: inset 0 0 0 2px var(--docsearch-primary-color);\n}\n\n.sidebar ul {\n  padding: 0;\n  margin: 0;\n  list-style-type: none;\n}\n.sidebar a {\n  display: inline-block;\n}\n.sidebar .navbar-links {\n  display: none;\n  border-bottom: 1px solid #eaecef;\n  padding: 0.5rem 0 0.75rem 0;\n}\n.sidebar .navbar-links a {\n  font-weight: 600;\n}\n.sidebar .navbar-links .navbar-links-item {\n  display: block;\n  line-height: 1.25rem;\n  font-size: 1.1em;\n  padding: 0.5rem 0 0.5rem 1.5rem;\n}\n.sidebar > .sidebar-links {\n  padding: 1.5rem 0;\n}\n.sidebar > .sidebar-links > li > a.sidebar-link {\n  font-size: 1.1em;\n  line-height: 1.7;\n  font-weight: bold;\n}\n.sidebar > .sidebar-links > li:not(:first-child) {\n  margin-top: 0.75rem;\n}\n\n@media (max-width: 719px) {\n  .sidebar .navbar-links {\n    display: block;\n  }\n  .sidebar .navbar-links .dropdown-wrapper .nav-dropdown .dropdown-item a.router-link-active::after {\n    top: calc(1rem - 2px);\n  }\n  .sidebar > .sidebar-links {\n    padding: 1rem 0;\n  }\n}\n/**\n * sidebar child\n */\n.sidebar-links > .sidebar-group:not(:first-child) {\n  margin-top: 0.75rem;\n}\n.sidebar-group .sidebar-group > .sidebar-heading {\n  opacity: 0.5;\n  font-size: 0.95em;\n  line-height: 1.4;\n  font-weight: normal;\n  padding-left: 2rem;\n}\n\n.sidebar-heading {\n  color: #2c3e50;\n  transition: color 0.15s ease;\n  cursor: default;\n  font-size: 1.1em;\n  font-weight: bold;\n  padding: 0.35rem 1.5rem 0.35rem 1.25rem;\n  width: 100%;\n  box-sizing: border-box;\n  margin: 0;\n  border-left: 0.25rem solid transparent;\n}\n.sidebar-heading.open, .sidebar-heading:hover {\n  color: inherit;\n}\n.sidebar-heading .arrow {\n  position: relative;\n  top: -0.12em;\n  left: 0.5em;\n}\n\n.sidebar .sidebar-sub-headers {\n  padding-left: 1rem;\n  font-size: 0.95em;\n}\n\n.sidebar-link {\n  font-size: 1em;\n  font-weight: 400;\n  display: inline-block;\n  color: #2c3e50;\n  border-left: 0.25rem solid transparent;\n  margin: 0;\n  padding: 0.35rem 1rem 0.35rem 1.25rem;\n  line-height: 1.4;\n  width: 100%;\n  box-sizing: border-box;\n}\n.sidebar-group .sidebar-link {\n  padding-left: 2rem;\n}\n.sidebar-sub-headers .sidebar-link {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n  border-left: none;\n}\n.sidebar-sub-headers .sidebar-link.active {\n  font-weight: 500;\n}\n\na.sidebar-heading,\na.sidebar-link {\n  cursor: pointer;\n}\na.sidebar-heading.active,\na.sidebar-link.active {\n  font-weight: 600;\n  color: #3eaf7c;\n  border-left-color: #3eaf7c;\n}\na.sidebar-heading:hover,\na.sidebar-link:hover {\n  color: #3eaf7c;\n}\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n  user-select: none;\n}\n\n.table-of-contents .badge {\n  vertical-align: middle;\n}\n\n.fade-slide-y-enter-active {\n  transition: all 0.3s ease;\n}\n\n.fade-slide-y-leave-active {\n  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);\n}\n\n.fade-slide-y-enter-from,\n.fade-slide-y-leave-to {\n  transform: translateY(10px);\n  opacity: 0;\n}';
var clientAppEnhance0 = defineClientAppEnhance(({ app, router }) => {
  app.component("Badge", _sfc_main$m);
  app.component("CodeGroup", CodeGroup);
  app.component("CodeGroupItem", _sfc_main$l);
  delete app._context.components.OutboundLink;
  app.component("OutboundLink", _sfc_main$k);
  if (typeof DOCSEARCH_PROPS === "undefined") {
    app.component("Docsearch", () => null);
  }
  const scrollBehavior = router.options.scrollBehavior;
  router.options.scrollBehavior = async (...args) => {
    await useScrollPromise().wait();
    return scrollBehavior(...args);
  };
});
var mediumZoom = ":root {\n  --medium-zoom-z-index: 100;\n}\n\n.medium-zoom-overlay {\n  z-index: var(--medium-zoom-z-index);\n}\n\n.medium-zoom-overlay ~ img {\n  z-index: calc(var(--medium-zoom-z-index) + 1);\n}\n";
var clientAppEnhance1 = defineClientAppEnhance(({ app, router }) => {
  return;
});
var clientAppEnhance2 = defineClientAppEnhance(({ app }) => {
  const themeData2 = useThemeData();
  const routeLocale = app._context.provides[routeLocaleSymbol];
  const themeLocaleData = vue.computed(() => resolveThemeLocaleData(themeData2.value, routeLocale.value));
  app.provide(themeLocaleDataSymbol, themeLocaleData);
  Object.defineProperties(app.config.globalProperties, {
    $theme: {
      get() {
        return themeData2.value;
      }
    },
    $themeLocale: {
      get() {
        return themeLocaleData.value;
      }
    }
  });
});
const clientAppEnhances = [
  clientAppEnhance0,
  clientAppEnhance1,
  clientAppEnhance2
];
function r(r2, e, n) {
  var i, t, o;
  e === void 0 && (e = 50), n === void 0 && (n = {});
  var a = (i = n.isImmediate) != null && i, u = (t = n.callback) != null && t, c = n.maxWait, v = Date.now(), l = [];
  function f() {
    if (c !== void 0) {
      var r3 = Date.now() - v;
      if (r3 + e >= c)
        return c - r3;
    }
    return e;
  }
  var d = function() {
    var e2 = [].slice.call(arguments), n2 = this;
    return new Promise(function(i2, t2) {
      var c2 = a && o === void 0;
      if (o !== void 0 && clearTimeout(o), o = setTimeout(function() {
        if (o = void 0, v = Date.now(), !a) {
          var i3 = r2.apply(n2, e2);
          u && u(i3), l.forEach(function(r3) {
            return (0, r3.resolve)(i3);
          }), l = [];
        }
      }, f()), c2) {
        var d2 = r2.apply(n2, e2);
        return u && u(d2), i2(d2);
      }
      l.push({ resolve: i2, reject: t2 });
    });
  };
  return d.cancel = function(r3) {
    o !== void 0 && clearTimeout(o), l.forEach(function(e2) {
      return (0, e2.reject)(r3);
    }), l = [];
  }, d;
}
const getScrollTop = () => window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
var _sfc_main$j = vue.defineComponent({
  name: "BackToTop",
  setup() {
    const scrollTop = vue.ref(0);
    const show = vue.computed(() => scrollTop.value > 300);
    vue.onMounted(() => {
      scrollTop.value = getScrollTop();
      window.addEventListener("scroll", r(() => {
        scrollTop.value = getScrollTop();
      }, 100));
    });
    return {
      show,
      scrollToTop
    };
  }
});
var BackToTop_vue_vue_type_style_index_0_lang = "\n:root {\n  --back-to-top-color: #3eaf7c;\n  --back-to-top-color-hover: #71cda3;\n}\n.back-to-top {\n  cursor: pointer;\n  position: fixed;\n  bottom: 2rem;\n  right: 2.5rem;\n  width: 2rem;\n  color: var(--back-to-top-color);\n  z-index: 1;\n}\n.back-to-top:hover {\n  color: var(--back-to-top-color-hover);\n}\n@media (max-width: 959px) {\n#back-to-top {\n    display: none;\n}\n}\n.back-to-top-enter-active,\n.back-to-top-leave-active {\n  transition: opacity 0.3s;\n}\n.back-to-top-enter-from,\n.back-to-top-leave-to {\n  opacity: 0;\n}\n";
function _sfc_ssrRender$j(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  if (_ctx.show) {
    _push(`<svg${serverRenderer.ssrRenderAttrs(vue.mergeProps({
      class: "back-to-top",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 49.484 28.284"
    }, _attrs))}><g transform="translate(-229 -126.358)"><rect fill="currentColor" width="35" height="5" rx="2" transform="translate(229 151.107) rotate(-45)"></rect><rect fill="currentColor" width="35" height="5" rx="2" transform="translate(274.949 154.642) rotate(-135)"></rect></g></svg>`);
  } else {
    _push(`<!---->`);
  }
}
_sfc_main$j.ssrRender = _sfc_ssrRender$j;
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/plugin-back-to-top/lib/components/BackToTop.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const clientAppRootComponents = [
  _sfc_main$j
];
var clientAppSetup0 = defineClientAppSetup(() => {
  const themeLocale = useThemeLocaleData();
  const frontmatter = usePageFrontmatter();
  const sidebarItems = vue.computed(() => resolveSidebarItems(frontmatter.value, themeLocale.value));
  vue.provide(sidebarItemsSymbol, sidebarItems);
});
var clientAppSetup1 = defineClientAppSetup(() => {
  return;
});
var nprogress = ":root {\n  --nprogress-color: #29d;\n}\n\n#nprogress {\n  pointer-events: none;\n}\n\n#nprogress .bar {\n  background: var(--nprogress-color);\n  position: fixed;\n  z-index: 1031;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 2px;\n}\n\n#nprogress .peg {\n  display: block;\n  position: absolute;\n  right: 0px;\n  width: 100px;\n  height: 100%;\n  box-shadow: 0 0 10px var(--nprogress-color), 0 0 5px var(--nprogress-color);\n  opacity: 1.0;\n  transform: rotate(3deg) translate(0px, -4px);\n}\n";
var clientAppSetup2 = defineClientAppSetup(() => {
  vue.onMounted(() => {
    const router = useRouter();
    const loadedPages = new Set();
    loadedPages.add(router.currentRoute.value.path);
    nprogress__namespace.configure({ showSpinner: false });
    router.beforeEach((to) => {
      if (!loadedPages.has(to.path)) {
        nprogress__namespace.start();
      }
    });
    router.afterEach((to) => {
      loadedPages.add(to.path);
      nprogress__namespace.done();
    });
  });
});
const clientAppSetups = [
  clientAppSetup0,
  clientAppSetup1,
  clientAppSetup2
];
const pagesData = vue.ref(pagesData$2);
const pageDataEmpty = vue.readonly({
  key: "",
  path: "",
  title: "",
  lang: "",
  frontmatter: {},
  excerpt: "",
  headers: []
});
const pageData = vue.ref(pageDataEmpty);
const usePageData = () => pageData;
if (false) {
  __VUE_HMR_RUNTIME__.updatePageData = (data2) => {
    pagesData.value[data2.key] = () => Promise.resolve(data2);
    if (data2.key === pageData.value.key) {
      pageData.value = data2;
    }
  };
}
Symbol(__VUEPRESS_DEV__ ? "pageFrontmatter" : "");
Symbol(__VUEPRESS_DEV__ ? "pageHead" : "");
Symbol(__VUEPRESS_DEV__ ? "pageHeadTitle" : "");
Symbol(__VUEPRESS_DEV__ ? "pageLang" : "");
Symbol(__VUEPRESS_DEV__ ? "routeLocale" : "");
const siteData = vue.ref(siteData$2);
if (false) {
  __VUE_HMR_RUNTIME__.updateSiteData = (data2) => {
    siteData.value = data2;
  };
}
Symbol(__VUEPRESS_DEV__ ? "siteLocaleData" : "");
Symbol(__VUEPRESS_DEV__ ? "updateHead" : "");
const Vuepress = vue.defineComponent({
  name: "Vuepress",
  setup() {
    const page = usePageData();
    const layoutComponent = vue.computed(() => {
      let layoutName;
      if (page.value.path) {
        const frontmatterLayout = page.value.frontmatter.layout;
        if (shared.isString(frontmatterLayout)) {
          layoutName = frontmatterLayout;
        } else {
          layoutName = "Layout";
        }
      } else {
        layoutName = "404";
      }
      return layoutComponents[layoutName] || vue.resolveComponent(layoutName, false);
    });
    return () => vue.h(layoutComponent.value);
  }
});
var pageRoutes0 = [
  {
    name: "v-8daa1a0e",
    path: "/",
    component: Vuepress,
    meta: { title: "\u4ECB\u7ECD" }
  },
  {
    path: "/index.html",
    redirect: "/"
  },
  {
    path: "/index.md",
    redirect: "/"
  }
];
var pageRoutes1 = [
  {
    name: "v-89c9a156",
    path: "/components/form.html",
    component: Vuepress,
    meta: { title: "Form" }
  },
  {
    path: "/components/form.md",
    redirect: "/components/form.html"
  }
];
var pageRoutes2 = [
  {
    name: "v-1c7e20af",
    path: "/components/layout.html",
    component: Vuepress,
    meta: { title: "Layout" }
  },
  {
    path: "/components/layout.md",
    redirect: "/components/layout.html"
  }
];
var pageRoutes3 = [
  {
    name: "v-df88a5ea",
    path: "/components/table.html",
    component: Vuepress,
    meta: { title: "Table" }
  },
  {
    path: "/components/table.md",
    redirect: "/components/table.html"
  }
];
var pageRoutes4 = [
  {
    name: "v-e45cc9ec",
    path: "/guide/install.html",
    component: Vuepress,
    meta: { title: "\u5B89\u88C5" }
  },
  {
    path: "/guide/install.md",
    redirect: "/guide/install.html"
  }
];
var pageRoutes5 = [
  {
    name: "v-621628ba",
    path: "/guide/start.html",
    component: Vuepress,
    meta: { title: "\u5F00\u59CB" }
  },
  {
    path: "/guide/start.md",
    redirect: "/guide/start.html"
  }
];
var pageRoutes6 = [
  {
    name: "v-3706649a",
    path: "/404.html",
    component: Vuepress,
    meta: { title: "" }
  }
];
const pagesRoutes = [
  ...pageRoutes0,
  ...pageRoutes1,
  ...pageRoutes2,
  ...pageRoutes3,
  ...pageRoutes4,
  ...pageRoutes5,
  ...pageRoutes6,
  {
    name: "404",
    path: "/:catchAll(.*)",
    component: Vuepress
  }
];
const createVueApp = async ({ appCreator, historyCreator }) => {
  const appOptions = {
    setup() {
      useUpdateHead();
      for (const clientAppSetup of clientAppSetups) {
        clientAppSetup();
      }
      return () => [
        vue.h(RouterView),
        ...clientAppRootComponents.map((comp) => vue.h(comp))
      ];
    }
  };
  const app = appCreator(appOptions);
  const router = createRouter({
    history: historyCreator(shared.removeEndingSlash(siteData$1.value.base)),
    routes: pagesRoutes,
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      }
      if (to.hash) {
        return { el: to.hash };
      }
      return { top: 0 };
    }
  });
  app.use(router);
  router.beforeResolve(async (to, from) => {
    if (to.path !== from.path || from === START_LOCATION_NORMALIZED) {
      [pageData$1.value] = await Promise.all([
        resolvePageData(to.path),
        pagesComponent[to.path].__asyncLoader()
      ]);
    }
  });
  const routeLocale = vue.computed(() => resolveRouteLocale(siteData$1.value.locales, router.currentRoute.value.path));
  const siteLocaleData = vue.computed(() => resolveSiteLocaleData(siteData$1.value, routeLocale.value));
  const pageFrontmatter = vue.computed(() => resolvePageFrontmatter(pageData$1.value));
  const pageHeadTitle = vue.computed(() => resolvePageHeadTitle(pageData$1.value, siteLocaleData.value));
  const pageHead = vue.computed(() => resolvePageHead(pageHeadTitle.value, pageFrontmatter.value, siteLocaleData.value));
  const pageLang = vue.computed(() => resolvePageLang(pageData$1.value));
  app.provide(routeLocaleSymbol, routeLocale);
  app.provide(siteLocaleDataSymbol, siteLocaleData);
  app.provide(pageFrontmatterSymbol, pageFrontmatter);
  app.provide(pageHeadTitleSymbol, pageHeadTitle);
  app.provide(pageHeadSymbol, pageHead);
  app.provide(pageLangSymbol, pageLang);
  Object.defineProperties(app.config.globalProperties, {
    $routeLocale: {
      get() {
        return routeLocale.value;
      }
    },
    $site: {
      get() {
        return siteData$1.value;
      }
    },
    $siteLocale: {
      get() {
        return siteLocaleData.value;
      }
    },
    $page: {
      get() {
        return pageData$1.value;
      }
    },
    $frontmatter: {
      get() {
        return pageFrontmatter.value;
      }
    },
    $lang: {
      get() {
        return pageLang.value;
      }
    },
    $headTitle: {
      get() {
        return pageHeadTitle.value;
      }
    },
    $withBase: {
      get() {
        return withBase;
      }
    }
  });
  app.component("ClientOnly", () => null);
  app.component("Content", Content);
  app.component("OutboundLink", OutboundLink);
  for (const clientAppEnhance of clientAppEnhances) {
    await clientAppEnhance({ app, router, siteData: siteData$1 });
  }
  return {
    app,
    router
  };
};
const createServerApp = async () => createVueApp({
  appCreator: vue.createSSRApp,
  historyCreator: createMemoryHistory
});
const _sfc_main$i = {};
function _sfc_ssrRender$i(_ctx, _push, _parent, _attrs) {
  const _component_OutboundLink = vue.resolveComponent("OutboundLink");
  _push(`<!--[--><p>sum-ui \u662F\u57FA\u4E8E Vue3 + ElementPlus \u4E8C\u6B21\u5F00\u53D1\u7684\u7EC4\u5408\u7EC4\u4EF6\u5E93\u96C6\u5408</p><h2 id="\u6280\u672F\u6808"><a class="header-anchor" href="#\u6280\u672F\u6808">#</a> \u6280\u672F\u6808</h2><p>Vue3 + vite</p><h2 id="\u7EC4\u4EF6\u770B\u677F"><a class="header-anchor" href="#\u7EC4\u4EF6\u770B\u677F">#</a> \u7EC4\u4EF6\u770B\u677F</h2><table><thead><tr><th>\u7EC4\u4EF6</th><th>\u4E0B\u8F7D\u91CF</th><th>\u7248\u672C</th></tr></thead><tbody><tr><td>@sum-ui/layout</td><td><a href="https://www.npmjs.com/package/@sum-ui/layout" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dw/@sum-ui/layout.svg" alt="layout">`);
  _push(serverRenderer.ssrRenderComponent(_component_OutboundLink, null, null, _parent));
  _push(`</a></td><td><a href="https://www.npmjs.com/package/@sum-ui/layout" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/@sum-ui/layout.svg?style=flat-square?style=flat-square" alt="npm package">`);
  _push(serverRenderer.ssrRenderComponent(_component_OutboundLink, null, null, _parent));
  _push(`</a></td></tr><tr><td>@sum-ui/table</td><td><a href="https://www.npmjs.com/package/@sum-ui/table" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dw/@sum-ui/table.svg" alt="table">`);
  _push(serverRenderer.ssrRenderComponent(_component_OutboundLink, null, null, _parent));
  _push(`</a></td><td><a href="https://www.npmjs.com/package/@sum-ui/table" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/@sum-ui/table.svg?style=flat-square?style=flat-square" alt="npm package">`);
  _push(serverRenderer.ssrRenderComponent(_component_OutboundLink, null, null, _parent));
  _push(`</a></td></tr><tr><td>@sum-ui/field</td><td><a href="https://www.npmjs.com/package/@sum-ui/field" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dw/@sum-ui/field.svg" alt="field">`);
  _push(serverRenderer.ssrRenderComponent(_component_OutboundLink, null, null, _parent));
  _push(`</a></td><td><a href="https://www.npmjs.com/package/@sum-ui/field" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/@sum-ui/field.svg?style=flat-square?style=flat-square" alt="npm package">`);
  _push(serverRenderer.ssrRenderComponent(_component_OutboundLink, null, null, _parent));
  _push(`</a></td></tr><tr><td>@sum-ui/form</td><td><a href="https://www.npmjs.com/package/@sum-ui/form" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dw/@sum-ui/form.svg" alt="form">`);
  _push(serverRenderer.ssrRenderComponent(_component_OutboundLink, null, null, _parent));
  _push(`</a></td><td><a href="https://www.npmjs.com/package/@sum-ui/form" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/@sum-ui/layout.svg?style=flat-square?style=flat-square" alt="npm package">`);
  _push(serverRenderer.ssrRenderComponent(_component_OutboundLink, null, null, _parent));
  _push(`</a></td></tr></tbody></table><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>This is a tip</p></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>This is a warning</p></div><div class="custom-container danger"><p class="custom-container-title">WARNING</p><p>This is a dangerous warning</p></div><!--]-->`);
}
_sfc_main$i.ssrRender = _sfc_ssrRender$i;
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add(".vuepress/.temp/pages/index.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$i
});
const _sfc_main$h = {};
function _sfc_ssrRender$h(_ctx, _push, _parent, _attrs) {
  _push(`<!--[--><h3 id="vue-preview"><a class="header-anchor" href="#vue-preview">#</a> vue preview</h3><div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>sum-layout</span> <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>

</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><!--]-->`);
}
_sfc_main$h.ssrRender = _sfc_ssrRender$h;
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add(".vuepress/.temp/pages/components/form.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
var form = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$h
});
const _sfc_main$g = {};
function _sfc_ssrRender$g(_ctx, _push, _parent, _attrs) {
  _push(`<!--[--><h3 id="vue-preview"><a class="header-anchor" href="#vue-preview">#</a> vue preview</h3><div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>sum-layout</span> <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>
<span class="token keyword">import</span> sumLayout <span class="token keyword">from</span> <span class="token string">&#39;@sum-ui/layout&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  components<span class="token operator">:</span> <span class="token punctuation">{</span> sumLayout <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>

</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><!--]-->`);
}
_sfc_main$g.ssrRender = _sfc_ssrRender$g;
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add(".vuepress/.temp/pages/components/layout.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
var layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$g
});
const _sfc_main$f = {};
function _sfc_ssrRender$f(_ctx, _push, _parent, _attrs) {
  _push(`<!--[--><h3 id="vue-preview"><a class="header-anchor" href="#vue-preview">#</a> vue preview</h3><div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>sum-layout</span> <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>

</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><!--]-->`);
}
_sfc_main$f.ssrRender = _sfc_ssrRender$f;
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add(".vuepress/.temp/pages/components/table.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
var table = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$f
});
const _sfc_main$e = {};
function _sfc_ssrRender$e(_ctx, _push, _parent, _attrs) {
}
_sfc_main$e.ssrRender = _sfc_ssrRender$e;
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add(".vuepress/.temp/pages/guide/install.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
var install = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$e
});
const _sfc_main$d = {};
function _sfc_ssrRender$d(_ctx, _push, _parent, _attrs) {
}
_sfc_main$d.ssrRender = _sfc_ssrRender$d;
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add(".vuepress/.temp/pages/guide/start.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
var start = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$d
});
const _sfc_main$c = {};
function _sfc_ssrRender$c(_ctx, _push, _parent, _attrs) {
}
_sfc_main$c.ssrRender = _sfc_ssrRender$c;
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add(".vuepress/.temp/pages/404.html.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
var _404_html = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$c
});
const data$6 = {
  "key": "v-8daa1a0e",
  "path": "/",
  "title": "\u4ECB\u7ECD",
  "lang": "en-US",
  "frontmatter": {
    "title": "\u4ECB\u7ECD"
  },
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "\u6280\u672F\u6808",
      "slug": "\u6280\u672F\u6808",
      "children": []
    },
    {
      "level": 2,
      "title": "\u7EC4\u4EF6\u770B\u677F",
      "slug": "\u7EC4\u4EF6\u770B\u677F",
      "children": []
    }
  ],
  "filePathRelative": "index.md",
  "git": {
    "updatedTime": null,
    "contributors": []
  }
};
var v8daa1a0e = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  data: data$6
});
const data$5 = {
  "key": "v-89c9a156",
  "path": "/components/form.html",
  "title": "Form",
  "lang": "en-US",
  "frontmatter": {
    "title": "Form",
    "desc": "desc"
  },
  "excerpt": "",
  "headers": [
    {
      "level": 3,
      "title": "vue preview",
      "slug": "vue-preview",
      "children": []
    }
  ],
  "filePathRelative": "components/form.md",
  "git": {
    "updatedTime": null,
    "contributors": []
  }
};
var v89c9a156 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  data: data$5
});
const data$4 = {
  "key": "v-1c7e20af",
  "path": "/components/layout.html",
  "title": "Layout",
  "lang": "en-US",
  "frontmatter": {
    "title": "Layout",
    "desc": "desc"
  },
  "excerpt": "",
  "headers": [
    {
      "level": 3,
      "title": "vue preview",
      "slug": "vue-preview",
      "children": []
    }
  ],
  "filePathRelative": "components/layout.md",
  "git": {
    "updatedTime": null,
    "contributors": []
  }
};
var v1c7e20af = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  data: data$4
});
const data$3 = {
  "key": "v-df88a5ea",
  "path": "/components/table.html",
  "title": "Table",
  "lang": "en-US",
  "frontmatter": {
    "title": "Table",
    "desc": "desc"
  },
  "excerpt": "",
  "headers": [
    {
      "level": 3,
      "title": "vue preview",
      "slug": "vue-preview",
      "children": []
    }
  ],
  "filePathRelative": "components/table.md",
  "git": {
    "updatedTime": null,
    "contributors": []
  }
};
var vDf88a5ea = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  data: data$3
});
const data$2 = {
  "key": "v-e45cc9ec",
  "path": "/guide/install.html",
  "title": "\u5B89\u88C5",
  "lang": "en-US",
  "frontmatter": {
    "title": "\u5B89\u88C5"
  },
  "excerpt": "",
  "headers": [],
  "filePathRelative": "guide/install.md",
  "git": {
    "updatedTime": null,
    "contributors": []
  }
};
var vE45cc9ec = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  data: data$2
});
const data$1 = {
  "key": "v-621628ba",
  "path": "/guide/start.html",
  "title": "\u5F00\u59CB",
  "lang": "en-US",
  "frontmatter": {
    "title": "\u5F00\u59CB"
  },
  "excerpt": "",
  "headers": [],
  "filePathRelative": "guide/start.md",
  "git": {
    "updatedTime": null,
    "contributors": []
  }
};
var v621628ba = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  data: data$1
});
const data = {
  "key": "v-3706649a",
  "path": "/404.html",
  "title": "",
  "lang": "en-US",
  "frontmatter": {
    "layout": "404"
  },
  "excerpt": "",
  "headers": [],
  "filePathRelative": null,
  "git": {}
};
var v3706649a = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  data
});
var _sfc_main$b = vue.defineComponent({
  name: "404",
  setup() {
    var _a, _b, _c;
    const routeLocale = useRouteLocale();
    const themeLocale = useThemeLocaleData();
    const messages = (_a = themeLocale.value.notFound) != null ? _a : ["Not Found"];
    const getMsg = () => messages[Math.floor(Math.random() * messages.length)];
    const homeLink = (_b = themeLocale.value.home) != null ? _b : routeLocale.value;
    const homeText = (_c = themeLocale.value.backToHome) != null ? _c : "Back to home";
    return {
      getMsg,
      homeLink,
      homeText
    };
  }
});
function _sfc_ssrRender$b(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_RouterLink = vue.resolveComponent("RouterLink");
  _push(`<div${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "theme-container" }, _attrs))}><div class="theme-default-content"><h1>404</h1><blockquote>${serverRenderer.ssrInterpolate(_ctx.getMsg())}</blockquote>`);
  _push(serverRenderer.ssrRenderComponent(_component_RouterLink, { to: _ctx.homeLink }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${serverRenderer.ssrInterpolate(_ctx.homeText)}`);
      } else {
        return [
          vue.createTextVNode(vue.toDisplayString(_ctx.homeText), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div>`);
}
_sfc_main$b.ssrRender = _sfc_ssrRender$b;
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/layouts/404.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
var _404 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$b
});
var _sfc_main$a = vue.defineComponent({
  name: "NavLink",
  inheritAttrs: false,
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const route = useRoute();
    const site = useSiteData();
    const { item } = vue.toRefs(props);
    const hasHttpProtocol = vue.computed(() => shared.isLinkHttp(item.value.link));
    const hasNonHttpProtocal = vue.computed(() => shared.isLinkMailto(item.value.link) || shared.isLinkTel(item.value.link));
    const linkTarget = vue.computed(() => {
      if (hasNonHttpProtocal.value)
        return void 0;
      if (item.value.target)
        return item.value.target;
      if (hasHttpProtocol.value)
        return "_blank";
      return void 0;
    });
    const isBlankTarget = vue.computed(() => linkTarget.value === "_blank");
    const isRouterLink = vue.computed(() => !hasHttpProtocol.value && !hasNonHttpProtocal.value && !isBlankTarget.value);
    const linkRel = vue.computed(() => {
      if (hasNonHttpProtocal.value)
        return void 0;
      if (item.value.rel)
        return item.value.rel;
      if (isBlankTarget.value)
        return "noopener noreferrer";
      return void 0;
    });
    const linkAriaLabel = vue.computed(() => item.value.ariaLabel || item.value.text);
    const shouldBeActiveInSubpath = vue.computed(() => {
      const localeKeys = Object.keys(site.value.locales);
      if (localeKeys.length) {
        return !localeKeys.some((key) => key === item.value.link);
      }
      return item.value.link !== "/";
    });
    const isActiveInSubpath = vue.computed(() => {
      if (!isRouterLink.value || !shouldBeActiveInSubpath.value) {
        return false;
      }
      return route.path.startsWith(item.value.link);
    });
    return {
      isActiveInSubpath,
      isBlankTarget,
      isRouterLink,
      linkRel,
      linkTarget,
      linkAriaLabel
    };
  }
});
function _sfc_ssrRender$a(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_RouterLink = vue.resolveComponent("RouterLink");
  const _component_OutboundLink = vue.resolveComponent("OutboundLink");
  if (_ctx.isRouterLink) {
    _push(serverRenderer.ssrRenderComponent(_component_RouterLink, vue.mergeProps({
      class: ["nav-link", { "router-link-active": _ctx.isActiveInSubpath }],
      to: _ctx.item.link,
      "aria-label": _ctx.linkAriaLabel
    }, _ctx.$attrs, _attrs), {
      default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          serverRenderer.ssrRenderSlot(_ctx.$slots, "before", {}, null, _push2, _parent2, _scopeId);
          _push2(` ${serverRenderer.ssrInterpolate(_ctx.item.text)} `);
          serverRenderer.ssrRenderSlot(_ctx.$slots, "after", {}, null, _push2, _parent2, _scopeId);
        } else {
          return [
            vue.renderSlot(_ctx.$slots, "before"),
            vue.createTextVNode(" " + vue.toDisplayString(_ctx.item.text) + " ", 1),
            vue.renderSlot(_ctx.$slots, "after")
          ];
        }
      }),
      _: 3
    }, _parent));
  } else {
    _push(`<a${serverRenderer.ssrRenderAttrs(vue.mergeProps({
      class: "nav-link external",
      href: _ctx.item.link,
      rel: _ctx.linkRel,
      target: _ctx.linkTarget,
      "aria-label": _ctx.linkAriaLabel
    }, _ctx.$attrs, _attrs))}>`);
    serverRenderer.ssrRenderSlot(_ctx.$slots, "before", {}, null, _push, _parent);
    _push(` ${serverRenderer.ssrInterpolate(_ctx.item.text)} `);
    if (_ctx.isBlankTarget) {
      _push(serverRenderer.ssrRenderComponent(_component_OutboundLink, null, null, _parent));
    } else {
      _push(`<!---->`);
    }
    serverRenderer.ssrRenderSlot(_ctx.$slots, "after", {}, null, _push, _parent);
    _push(`</a>`);
  }
}
_sfc_main$a.ssrRender = _sfc_ssrRender$a;
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/NavLink.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
var _sfc_main$9 = vue.defineComponent({
  name: "Home",
  components: {
    NavLink: _sfc_main$a
  },
  setup() {
    const frontmatter = usePageFrontmatter();
    const siteLocale = useSiteLocaleData();
    const heroImage = vue.computed(() => {
      if (!frontmatter.value.heroImage) {
        return null;
      }
      return withBase(frontmatter.value.heroImage);
    });
    const heroText = vue.computed(() => {
      if (frontmatter.value.heroText === null) {
        return null;
      }
      return frontmatter.value.heroText || siteLocale.value.title || "Hello";
    });
    const heroAlt = vue.computed(() => frontmatter.value.heroAlt || heroText.value || "hero");
    const tagline = vue.computed(() => {
      if (frontmatter.value.tagline === null) {
        return null;
      }
      return frontmatter.value.tagline || siteLocale.value.description || "Welcome to your VuePress site";
    });
    const actions = vue.computed(() => {
      if (!shared.isArray(frontmatter.value.actions)) {
        return [];
      }
      return frontmatter.value.actions.map(({ text, link, type = "primary" }) => ({
        text,
        link,
        type
      }));
    });
    const features = vue.computed(() => {
      if (shared.isArray(frontmatter.value.features)) {
        return frontmatter.value.features;
      }
      return [];
    });
    const footer = vue.computed(() => frontmatter.value.footer);
    const footerHtml = vue.computed(() => frontmatter.value.footerHtml);
    return {
      heroImage,
      heroAlt,
      heroText,
      tagline,
      actions,
      features,
      footer,
      footerHtml
    };
  }
});
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NavLink = vue.resolveComponent("NavLink");
  const _component_Content = vue.resolveComponent("Content");
  _push(`<main${serverRenderer.ssrRenderAttrs(vue.mergeProps({
    class: "home",
    "aria-labelledby": _ctx.heroText ? "main-title" : null
  }, _attrs))}><header class="hero">`);
  if (_ctx.heroImage) {
    _push(`<img${serverRenderer.ssrRenderAttr("src", _ctx.heroImage)}${serverRenderer.ssrRenderAttr("alt", _ctx.heroAlt)}>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.heroText) {
    _push(`<h1 id="main-title">${serverRenderer.ssrInterpolate(_ctx.heroText)}</h1>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.tagline) {
    _push(`<p class="description">${serverRenderer.ssrInterpolate(_ctx.tagline)}</p>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.actions.length) {
    _push(`<p class="actions"><!--[-->`);
    serverRenderer.ssrRenderList(_ctx.actions, (action) => {
      _push(serverRenderer.ssrRenderComponent(_component_NavLink, {
        key: action.text,
        class: ["action-button", [action.type]],
        item: action
      }, null, _parent));
    });
    _push(`<!--]--></p>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</header>`);
  if (_ctx.features.length) {
    _push(`<div class="features"><!--[-->`);
    serverRenderer.ssrRenderList(_ctx.features, (feature) => {
      _push(`<div class="feature"><h2>${serverRenderer.ssrInterpolate(feature.title)}</h2><p>${serverRenderer.ssrInterpolate(feature.details)}</p></div>`);
    });
    _push(`<!--]--></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="theme-default-content custom">`);
  _push(serverRenderer.ssrRenderComponent(_component_Content, null, null, _parent));
  _push(`</div>`);
  if (_ctx.footer) {
    _push(`<!--[-->`);
    if (_ctx.footerHtml) {
      _push(`<div class="footer">${_ctx.footer}</div>`);
    } else {
      _push(`<div class="footer">${serverRenderer.ssrInterpolate(_ctx.footer)}</div>`);
    }
    _push(`<!--]-->`);
  } else {
    _push(`<!---->`);
  }
  _push(`</main>`);
}
_sfc_main$9.ssrRender = _sfc_ssrRender$9;
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/Home.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const resolveRepoType = (repo) => {
  if (!shared.isLinkHttp(repo))
    return "GitHub";
  if (/bitbucket\.org/.test(repo))
    return "Bitbucket";
  if (/gitlab\.com/.test(repo))
    return "GitLab";
  return null;
};
const editLinkPatterns = {
  GitHub: ":repo/edit/:branch/:path",
  GitLab: ":repo/-/edit/:branch/:path",
  Bitbucket: ":repo/src/:branch/:path?mode=edit&spa=0&at=:branch&fileviewer=file-view-default"
};
const resolveEditLink = ({ docsRepo, docsBranch, docsDir, filePathRelative, editLinkPattern }) => {
  const repoType = resolveRepoType(docsRepo);
  let pattern;
  if (editLinkPattern) {
    pattern = editLinkPattern;
  } else if (repoType !== null) {
    pattern = editLinkPatterns[repoType];
  }
  if (!pattern)
    return null;
  return pattern.replace(/:repo/, repoType === "GitHub" ? `https://github.com/${docsRepo}` : docsRepo).replace(/:branch/, docsBranch).replace(/:path/, shared.removeLeadingSlash(`${shared.removeEndingSlash(docsDir)}/${filePathRelative}`));
};
const useEditNavLink = () => {
  const themeLocale = useThemeLocaleData();
  const page = usePageData$1();
  const frontmatter = usePageFrontmatter();
  return vue.computed(() => {
    var _a, _b;
    const showEditLink = (_b = (_a = frontmatter.value.editLink) != null ? _a : themeLocale.value.editLink) != null ? _b : true;
    if (!showEditLink) {
      return null;
    }
    const {
      repo,
      docsRepo = repo,
      docsBranch = "main",
      docsDir = "",
      editLinkText
    } = themeLocale.value;
    if (!docsRepo)
      return null;
    const editLink = resolveEditLink({
      docsRepo,
      docsBranch,
      docsDir,
      filePathRelative: page.value.filePathRelative,
      editLinkPattern: themeLocale.value.editLinkPattern
    });
    if (!editLink)
      return null;
    return {
      text: editLinkText != null ? editLinkText : "Edit this page",
      link: editLink
    };
  });
};
const useLastUpdated = () => {
  const siteLocale = useSiteLocaleData();
  const themeLocale = useThemeLocaleData();
  const page = usePageData$1();
  const frontmatter = usePageFrontmatter();
  return vue.computed(() => {
    var _a, _b, _c, _d;
    const showLastUpdated = (_b = (_a = frontmatter.value.lastUpdated) != null ? _a : themeLocale.value.lastUpdated) != null ? _b : true;
    if (!showLastUpdated)
      return null;
    if (!((_c = page.value.git) == null ? void 0 : _c.updatedTime))
      return null;
    const updatedDate = new Date((_d = page.value.git) == null ? void 0 : _d.updatedTime);
    return updatedDate.toLocaleString(siteLocale.value.lang);
  });
};
const useContributors = () => {
  const themeLocale = useThemeLocaleData();
  const page = usePageData$1();
  const frontmatter = usePageFrontmatter();
  return vue.computed(() => {
    var _a, _b, _c, _d;
    const showContributors = (_b = (_a = frontmatter.value.contributors) != null ? _a : themeLocale.value.contributors) != null ? _b : true;
    if (!showContributors)
      return null;
    return (_d = (_c = page.value.git) == null ? void 0 : _c.contributors) != null ? _d : null;
  });
};
var _sfc_main$8 = vue.defineComponent({
  name: "PageMeta",
  components: {
    NavLink: _sfc_main$a
  },
  setup() {
    const themeLocale = useThemeLocaleData();
    const editNavLink = useEditNavLink();
    const lastUpdated = useLastUpdated();
    const contributors = useContributors();
    return {
      themeLocale,
      editNavLink,
      lastUpdated,
      contributors
    };
  }
});
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NavLink = vue.resolveComponent("NavLink");
  _push(`<footer${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "page-meta" }, _attrs))}>`);
  if (_ctx.editNavLink) {
    _push(`<div class="meta-item edit-link">`);
    _push(serverRenderer.ssrRenderComponent(_component_NavLink, {
      class: "meta-item-label",
      item: _ctx.editNavLink
    }, null, _parent));
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.lastUpdated) {
    _push(`<div class="meta-item last-updated"><span class="meta-item-label">${serverRenderer.ssrInterpolate(_ctx.themeLocale.lastUpdatedText)}: </span><span class="meta-item-info">${serverRenderer.ssrInterpolate(_ctx.lastUpdated)}</span></div>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.contributors && _ctx.contributors.length) {
    _push(`<div class="meta-item contributors"><span class="meta-item-label">${serverRenderer.ssrInterpolate(_ctx.themeLocale.contributorsText)}: </span><span class="meta-item-info"><!--[-->`);
    serverRenderer.ssrRenderList(_ctx.contributors, (contributor, index2) => {
      _push(`<!--[--><span class="contributor"${serverRenderer.ssrRenderAttr("title", `email: ${contributor.email}`)}>${serverRenderer.ssrInterpolate(contributor.name)}</span>`);
      if (index2 !== _ctx.contributors.length - 1) {
        _push(`<!--[-->, <!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    });
    _push(`<!--]--></span></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</footer>`);
}
_sfc_main$8.ssrRender = _sfc_ssrRender$8;
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/PageMeta.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const resolveFromFrontmatterConfig = (conf) => {
  if (conf === false) {
    return null;
  }
  if (shared.isString(conf)) {
    return useNavLink(conf);
  }
  if (shared.isPlainObject(conf)) {
    return conf;
  }
  return false;
};
const resolveFromSidebarItems = (sidebarItems, currentPath, offset) => {
  const index2 = sidebarItems.findIndex((item) => item.link === currentPath);
  if (index2 !== -1) {
    const targetItem = sidebarItems[index2 + offset];
    if (!(targetItem == null ? void 0 : targetItem.link)) {
      return null;
    }
    return targetItem;
  }
  for (const item of sidebarItems) {
    if (item.children) {
      const childResult = resolveFromSidebarItems(item.children, currentPath, offset);
      if (childResult) {
        return childResult;
      }
    }
  }
  return null;
};
var _sfc_main$7 = vue.defineComponent({
  name: "PageNav",
  components: {
    NavLink: _sfc_main$a
  },
  setup() {
    const frontmatter = usePageFrontmatter();
    const sidebarItems = useSidebarItems();
    const route = useRoute();
    const prevNavLink = vue.computed(() => {
      const prevConfig = resolveFromFrontmatterConfig(frontmatter.value.prev);
      if (prevConfig !== false) {
        return prevConfig;
      }
      return resolveFromSidebarItems(sidebarItems.value, route.path, -1);
    });
    const nextNavLink = vue.computed(() => {
      const nextConfig = resolveFromFrontmatterConfig(frontmatter.value.next);
      if (nextConfig !== false) {
        return nextConfig;
      }
      return resolveFromSidebarItems(sidebarItems.value, route.path, 1);
    });
    return {
      prevNavLink,
      nextNavLink
    };
  }
});
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NavLink = vue.resolveComponent("NavLink");
  if (_ctx.prevNavLink || _ctx.nextNavLink) {
    _push(`<nav${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "page-nav" }, _attrs))}><p class="inner">`);
    if (_ctx.prevNavLink) {
      _push(`<span class="prev"> \u2190 `);
      _push(serverRenderer.ssrRenderComponent(_component_NavLink, { item: _ctx.prevNavLink }, null, _parent));
      _push(`</span>`);
    } else {
      _push(`<!---->`);
    }
    if (_ctx.nextNavLink) {
      _push(`<span class="next">`);
      _push(serverRenderer.ssrRenderComponent(_component_NavLink, { item: _ctx.nextNavLink }, null, _parent));
      _push(` \u2192 </span>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</p></nav>`);
  } else {
    _push(`<!---->`);
  }
}
_sfc_main$7.ssrRender = _sfc_ssrRender$7;
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/PageNav.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = vue.defineComponent({
  name: "Page",
  components: {
    PageMeta: _sfc_main$8,
    PageNav: _sfc_main$7
  }
});
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Content = vue.resolveComponent("Content");
  const _component_PageMeta = vue.resolveComponent("PageMeta");
  const _component_PageNav = vue.resolveComponent("PageNav");
  _push(`<main${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "page" }, _attrs))}>`);
  serverRenderer.ssrRenderSlot(_ctx.$slots, "top", {}, null, _push, _parent);
  _push(`<div class="theme-default-content">`);
  _push(serverRenderer.ssrRenderComponent(_component_Content, null, null, _parent));
  _push(`</div>`);
  _push(serverRenderer.ssrRenderComponent(_component_PageMeta, null, null, _parent));
  _push(serverRenderer.ssrRenderComponent(_component_PageNav, null, null, _parent));
  serverRenderer.ssrRenderSlot(_ctx.$slots, "bottom", {}, null, _push, _parent);
  _push(`</main>`);
}
_sfc_main$6.ssrRender = _sfc_ssrRender$6;
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/Page.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var _sfc_main$5 = vue.defineComponent({
  name: "DropdownLink",
  components: {
    NavLink: _sfc_main$a
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { item } = vue.toRefs(props);
    const dropdownAriaLabel = vue.computed(() => item.value.ariaLabel || item.value.text);
    const open = vue.ref(false);
    const route = useRoute();
    vue.watch(() => route.path, () => {
      open.value = false;
    });
    const handleDropdown = (e) => {
      const isTriggerByTab = e.detail === 0;
      if (isTriggerByTab) {
        open.value = !open.value;
      } else {
        open.value = false;
      }
    };
    const isLastItemOfArray = (item2, arr) => arr[arr.length - 1] === item2;
    return {
      open,
      dropdownAriaLabel,
      handleDropdown,
      isLastItemOfArray
    };
  }
});
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NavLink = vue.resolveComponent("NavLink");
  _push(`<div${serverRenderer.ssrRenderAttrs(vue.mergeProps({
    class: ["dropdown-wrapper", { open: _ctx.open }]
  }, _attrs))}><button class="dropdown-title" type="button"${serverRenderer.ssrRenderAttr("aria-label", _ctx.dropdownAriaLabel)}><span class="title">${serverRenderer.ssrInterpolate(_ctx.item.text)}</span><span class="arrow down"></span></button><button class="mobile-dropdown-title" type="button"${serverRenderer.ssrRenderAttr("aria-label", _ctx.dropdownAriaLabel)}><span class="title">${serverRenderer.ssrInterpolate(_ctx.item.text)}</span><span class="${serverRenderer.ssrRenderClass([_ctx.open ? "down" : "right", "arrow"])}"></span></button><ul style="${serverRenderer.ssrRenderStyle(_ctx.open ? null : { display: "none" })}" class="nav-dropdown"><!--[-->`);
  serverRenderer.ssrRenderList(_ctx.item.children, (child, index2) => {
    _push(`<li class="dropdown-item">`);
    if (child.children) {
      _push(`<!--[--><h4 class="dropdown-subtitle">`);
      if (child.link) {
        _push(serverRenderer.ssrRenderComponent(_component_NavLink, { item: child }, null, _parent));
      } else {
        _push(`<span>${serverRenderer.ssrInterpolate(child.text)}</span>`);
      }
      _push(`</h4><ul class="dropdown-subitem-wrapper"><!--[-->`);
      serverRenderer.ssrRenderList(child.children, (grandchild) => {
        _push(`<li class="dropdown-subitem">`);
        _push(serverRenderer.ssrRenderComponent(_component_NavLink, { item: grandchild }, null, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul><!--]-->`);
    } else {
      _push(serverRenderer.ssrRenderComponent(_component_NavLink, { item: child }, null, _parent));
    }
    _push(`</li>`);
  });
  _push(`<!--]--></ul></div>`);
}
_sfc_main$5.ssrRender = _sfc_ssrRender$5;
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/DropdownLink.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const useNavbarSelectLanguage = () => {
  const router = useRouter();
  const routeLocale = useRouteLocale();
  const siteLocale = useSiteLocaleData();
  const themeLocale = useThemeLocaleData();
  return vue.computed(() => {
    var _a, _b;
    const localePaths = Object.keys(siteLocale.value.locales);
    if (localePaths.length < 2) {
      return [];
    }
    const currentPath = router.currentRoute.value.path;
    const currentFullPath = router.currentRoute.value.fullPath;
    const languageDropdown = {
      text: (_a = themeLocale.value.selectLanguageText) != null ? _a : "unkown language",
      ariaLabel: (_b = themeLocale.value.selectLanguageAriaLabel) != null ? _b : "unkown language",
      children: localePaths.map((targetLocalePath) => {
        var _a2, _b2, _c, _d, _e, _f;
        const targetSiteLocale = (_b2 = (_a2 = siteLocale.value.locales) == null ? void 0 : _a2[targetLocalePath]) != null ? _b2 : {};
        const targetThemeLocale = (_d = (_c = themeLocale.value.locales) == null ? void 0 : _c[targetLocalePath]) != null ? _d : {};
        const targetLang = `${targetSiteLocale.lang}`;
        const text = (_e = targetThemeLocale.selectLanguageName) != null ? _e : targetLang;
        let link;
        if (targetLang === siteLocale.value.lang) {
          link = currentFullPath;
        } else {
          const targetLocalePage = currentPath.replace(routeLocale.value, targetLocalePath);
          if (router.getRoutes().some((item) => item.path === targetLocalePage)) {
            link = targetLocalePage;
          } else {
            link = (_f = targetThemeLocale.home) != null ? _f : targetLocalePath;
          }
        }
        return {
          text,
          link
        };
      })
    };
    return [languageDropdown];
  });
};
const useNavbarRepo = () => {
  const themeLocale = useThemeLocaleData();
  const repo = vue.computed(() => themeLocale.value.repo);
  const repoType = vue.computed(() => repo.value ? resolveRepoType(repo.value) : null);
  const repoLink = vue.computed(() => {
    if (repoType.value === "GitHub") {
      return `https://github.com/${repo.value}`;
    }
    return repo.value;
  });
  const repoLabel = vue.computed(() => {
    if (!repoLink.value)
      return null;
    if (themeLocale.value.repoLabel)
      return themeLocale.value.repoLabel;
    if (repoType.value === null)
      return "Source";
    return repoType.value;
  });
  return vue.computed(() => {
    if (!repoLink.value || !repoLabel.value) {
      return [];
    }
    return [
      {
        text: repoLabel.value,
        link: repoLink.value
      }
    ];
  });
};
const resolveNavbarItem = (item) => {
  if (shared.isString(item)) {
    return useNavLink(item);
  }
  if (item.children) {
    return __spreadProps(__spreadValues({}, item), {
      children: item.children.map(resolveNavbarItem)
    });
  }
  return item;
};
const useNavbarConfig = () => {
  const themeLocale = useThemeLocaleData();
  return vue.computed(() => (themeLocale.value.navbar || []).map(resolveNavbarItem));
};
var _sfc_main$4 = vue.defineComponent({
  name: "NavbarLinks",
  components: {
    NavLink: _sfc_main$a,
    DropdownLink: _sfc_main$5
  },
  setup() {
    const navbarConfig = useNavbarConfig();
    const navbarSelectLanguage = useNavbarSelectLanguage();
    const navbarRepo = useNavbarRepo();
    const navbarLinks = vue.computed(() => [
      ...navbarConfig.value,
      ...navbarSelectLanguage.value,
      ...navbarRepo.value
    ]);
    return {
      navbarLinks
    };
  }
});
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DropdownLink = vue.resolveComponent("DropdownLink");
  const _component_NavLink = vue.resolveComponent("NavLink");
  if (_ctx.navbarLinks.length) {
    _push(`<nav${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "navbar-links" }, _attrs))}><!--[-->`);
    serverRenderer.ssrRenderList(_ctx.navbarLinks, (item) => {
      _push(`<div class="navbar-links-item">`);
      if (item.children) {
        _push(serverRenderer.ssrRenderComponent(_component_DropdownLink, { item }, null, _parent));
      } else {
        _push(serverRenderer.ssrRenderComponent(_component_NavLink, { item }, null, _parent));
      }
      _push(`</div>`);
    });
    _push(`<!--]--></nav>`);
  } else {
    _push(`<!---->`);
  }
}
_sfc_main$4.ssrRender = _sfc_ssrRender$4;
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/NavbarLinks.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var _sfc_main$3 = vue.defineComponent({
  name: "ToggleSidebarButton",
  emits: ["toggle"]
});
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "toggle-sidebar-button" }, _attrs))}><svg class="icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z" class=""></path></svg></div>`);
}
_sfc_main$3.ssrRender = _sfc_ssrRender$3;
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/ToggleSidebarButton.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var _sfc_main$2 = vue.defineComponent({
  name: "Navbar",
  components: {
    NavbarLinks: _sfc_main$4,
    ToggleSidebarButton: _sfc_main$3
  },
  emits: ["toggle-sidebar"],
  setup() {
    const routeLocale = useRouteLocale();
    const siteLocale = useSiteLocaleData();
    const themeLocale = useThemeLocaleData();
    const navbar = vue.ref(null);
    const siteBrand = vue.ref(null);
    const siteBrandLink = vue.computed(() => themeLocale.value.home || routeLocale.value);
    const siteBrandLogo = vue.computed(() => themeLocale.value.logo);
    const siteBrandTitle = vue.computed(() => siteLocale.value.title);
    const linksWrapperMaxWidth = vue.ref(0);
    const linksWrapperStyle = vue.computed(() => {
      if (!linksWrapperMaxWidth.value) {
        return {};
      }
      return {
        maxWidth: linksWrapperMaxWidth.value + "px"
      };
    });
    vue.onMounted(() => {
      const MOBILE_DESKTOP_BREAKPOINT = 719;
      const navbarHorizontalPadding = getCssValue(navbar.value, "paddingLeft") + getCssValue(navbar.value, "paddingRight");
      const handleLinksWrapWidth = () => {
        var _a;
        if (window.innerWidth < MOBILE_DESKTOP_BREAKPOINT) {
          linksWrapperMaxWidth.value = 0;
        } else {
          linksWrapperMaxWidth.value = navbar.value.offsetWidth - navbarHorizontalPadding - (((_a = siteBrand.value) == null ? void 0 : _a.offsetWidth) || 0);
        }
      };
      handleLinksWrapWidth();
      window.addEventListener("resize", handleLinksWrapWidth, false);
    });
    return {
      navbar,
      siteBrand,
      siteBrandLink,
      siteBrandLogo,
      siteBrandTitle,
      linksWrapperStyle,
      withBase
    };
  }
});
function getCssValue(el, property) {
  var _a, _b, _c;
  const val = (_c = (_b = (_a = el == null ? void 0 : el.ownerDocument) == null ? void 0 : _a.defaultView) == null ? void 0 : _b.getComputedStyle(el, null)) == null ? void 0 : _c[property];
  const num = Number.parseInt(val, 10);
  return Number.isNaN(num) ? 0 : num;
}
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ToggleSidebarButton = vue.resolveComponent("ToggleSidebarButton");
  const _component_RouterLink = vue.resolveComponent("RouterLink");
  const _component_NavbarLinks = vue.resolveComponent("NavbarLinks");
  const _component_Docsearch = vue.resolveComponent("Docsearch");
  _push(`<header${serverRenderer.ssrRenderAttrs(vue.mergeProps({
    ref: "navbar",
    class: "navbar"
  }, _attrs))}>`);
  _push(serverRenderer.ssrRenderComponent(_component_ToggleSidebarButton, null, null, _parent));
  _push(`<span>`);
  _push(serverRenderer.ssrRenderComponent(_component_RouterLink, { to: _ctx.siteBrandLink }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        if (_ctx.siteBrandLogo) {
          _push2(`<img class="logo"${serverRenderer.ssrRenderAttr("src", _ctx.withBase(_ctx.siteBrandLogo))}${serverRenderer.ssrRenderAttr("alt", _ctx.siteBrandTitle)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        if (_ctx.siteBrandTitle) {
          _push2(`<span class="${serverRenderer.ssrRenderClass([{ "can-hide": _ctx.siteBrandLogo }, "site-name"])}"${_scopeId}>${serverRenderer.ssrInterpolate(_ctx.siteBrandTitle)}</span>`);
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          _ctx.siteBrandLogo ? (vue.openBlock(), vue.createBlock("img", {
            key: 0,
            class: "logo",
            src: _ctx.withBase(_ctx.siteBrandLogo),
            alt: _ctx.siteBrandTitle
          }, null, 8, ["src", "alt"])) : vue.createCommentVNode("", true),
          _ctx.siteBrandTitle ? (vue.openBlock(), vue.createBlock("span", {
            key: 1,
            class: ["site-name", { "can-hide": _ctx.siteBrandLogo }]
          }, vue.toDisplayString(_ctx.siteBrandTitle), 3)) : vue.createCommentVNode("", true)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</span><div class="navbar-links-wrapper" style="${serverRenderer.ssrRenderStyle(_ctx.linksWrapperStyle)}">`);
  serverRenderer.ssrRenderSlot(_ctx.$slots, "before", {}, null, _push, _parent);
  _push(serverRenderer.ssrRenderComponent(_component_NavbarLinks, { class: "can-hide" }, null, _parent));
  serverRenderer.ssrRenderSlot(_ctx.$slots, "after", {}, null, _push, _parent);
  _push(serverRenderer.ssrRenderComponent(_component_Docsearch, null, null, _parent));
  _push(`</div></header>`);
}
_sfc_main$2.ssrRender = _sfc_ssrRender$2;
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/Navbar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const normalizePath = (path) => decodeURI(path).replace(/#.*$/, "").replace(/(index)?\.(md|html)$/, "");
const isActiveLink = (route, link) => {
  if (link === void 0) {
    return false;
  }
  if (route.hash === link) {
    return true;
  }
  const currentPath = normalizePath(route.path);
  const targetPath = normalizePath(link);
  return currentPath === targetPath;
};
const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.link)) {
    return true;
  }
  if (item.children) {
    return item.children.some((child) => isActiveItem(route, child));
  }
  return false;
};
const renderItem = (item, props) => {
  if (item.link) {
    return vue.h(_sfc_main$a, __spreadProps(__spreadValues({}, props), {
      item
    }));
  }
  return vue.h("p", props, item.text);
};
const renderChildren = (item, depth) => {
  var _a;
  if (!((_a = item.children) === null || _a === void 0 ? void 0 : _a.length)) {
    return null;
  }
  return vue.h("ul", {
    class: {
      "sidebar-sub-headers": depth > 0
    }
  }, item.children.map((child) => vue.h("li", vue.h(SidebarChild, {
    item: child,
    depth: depth + 1
  }))));
};
const SidebarChild = ({ item, depth = 0 }) => {
  const route = useRoute();
  const active = isActiveItem(route, item);
  if (item.isGroup) {
    return [
      vue.h("section", {
        class: "sidebar-group"
      }, [
        renderItem(item, {
          class: {
            "sidebar-heading": true,
            active
          }
        }),
        renderChildren(item, depth)
      ])
    ];
  }
  return [
    renderItem(item, {
      class: {
        "sidebar-link": true,
        active
      }
    }),
    renderChildren(item, depth)
  ];
};
SidebarChild.displayName = "SidebarChild";
SidebarChild.props = {
  item: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    required: false,
    default: 0
  }
};
var _sfc_main$1 = vue.defineComponent({
  name: "Sidebar",
  components: {
    NavbarLinks: _sfc_main$4,
    SidebarChild
  },
  setup() {
    const sidebarItems = useSidebarItems();
    return {
      sidebarItems
    };
  }
});
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NavbarLinks = vue.resolveComponent("NavbarLinks");
  const _component_SidebarChild = vue.resolveComponent("SidebarChild");
  _push(`<aside${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "sidebar" }, _attrs))}>`);
  _push(serverRenderer.ssrRenderComponent(_component_NavbarLinks, null, null, _parent));
  serverRenderer.ssrRenderSlot(_ctx.$slots, "top", {}, null, _push, _parent);
  _push(`<ul class="sidebar-links"><!--[-->`);
  serverRenderer.ssrRenderList(_ctx.sidebarItems, (item) => {
    _push(serverRenderer.ssrRenderComponent(_component_SidebarChild, { item }, null, _parent));
  });
  _push(`<!--]--></ul>`);
  serverRenderer.ssrRenderSlot(_ctx.$slots, "bottom", {}, null, _push, _parent);
  _push(`</aside>`);
}
_sfc_main$1.ssrRender = _sfc_ssrRender$1;
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/components/Sidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var _sfc_main = vue.defineComponent({
  name: "Layout",
  components: {
    Home: _sfc_main$9,
    Page: _sfc_main$6,
    Navbar: _sfc_main$2,
    Sidebar: _sfc_main$1,
    Transition: vue.Transition
  },
  setup() {
    const page = usePageData$1();
    const frontmatter = usePageFrontmatter();
    const themeLocale = useThemeLocaleData();
    const shouldShowNavbar = vue.computed(() => frontmatter.value.navbar !== false && themeLocale.value.navbar !== false);
    const sidebarItems = useSidebarItems();
    const isSidebarOpen = vue.ref(false);
    const toggleSidebar = (to) => {
      isSidebarOpen.value = typeof to === "boolean" ? to : !isSidebarOpen.value;
    };
    const touchStart = { x: 0, y: 0 };
    const onTouchStart = (e) => {
      touchStart.x = e.changedTouches[0].clientX;
      touchStart.y = e.changedTouches[0].clientY;
    };
    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && touchStart.x <= 80) {
          toggleSidebar(true);
        } else {
          toggleSidebar(false);
        }
      }
    };
    const containerClass = vue.computed(() => ({
      "no-navbar": !shouldShowNavbar.value,
      "no-sidebar": !sidebarItems.value.length,
      "sidebar-open": isSidebarOpen.value
    }));
    let unregisterRouterHook;
    vue.onMounted(() => {
      const router = useRouter();
      unregisterRouterHook = router.afterEach(() => {
        toggleSidebar(false);
      });
    });
    vue.onUnmounted(() => {
      unregisterRouterHook();
    });
    const scrollPromise2 = useScrollPromise();
    const onBeforeEnter = scrollPromise2.resolve;
    const onBeforeLeave = scrollPromise2.pending;
    return {
      frontmatter,
      page,
      containerClass,
      shouldShowNavbar,
      toggleSidebar,
      onTouchStart,
      onTouchEnd,
      onBeforeEnter,
      onBeforeLeave
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Navbar = vue.resolveComponent("Navbar");
  const _component_Sidebar = vue.resolveComponent("Sidebar");
  const _component_Home = vue.resolveComponent("Home");
  const _component_Page = vue.resolveComponent("Page");
  _push(`<div${serverRenderer.ssrRenderAttrs(vue.mergeProps({
    class: ["theme-container", _ctx.containerClass]
  }, _attrs))}>`);
  if (_ctx.shouldShowNavbar) {
    _push(serverRenderer.ssrRenderComponent(_component_Navbar, null, {
      before: vue.withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          serverRenderer.ssrRenderSlot(_ctx.$slots, "navbar-before", {}, null, _push2, _parent2, _scopeId);
        } else {
          return [
            vue.renderSlot(_ctx.$slots, "navbar-before")
          ];
        }
      }),
      after: vue.withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          serverRenderer.ssrRenderSlot(_ctx.$slots, "navbar-after", {}, null, _push2, _parent2, _scopeId);
        } else {
          return [
            vue.renderSlot(_ctx.$slots, "navbar-after")
          ];
        }
      }),
      _: 3
    }, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="sidebar-mask"></div>`);
  _push(serverRenderer.ssrRenderComponent(_component_Sidebar, null, {
    top: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        serverRenderer.ssrRenderSlot(_ctx.$slots, "sidebar-top", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          vue.renderSlot(_ctx.$slots, "sidebar-top")
        ];
      }
    }),
    bottom: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        serverRenderer.ssrRenderSlot(_ctx.$slots, "sidebar-bottom", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          vue.renderSlot(_ctx.$slots, "sidebar-bottom")
        ];
      }
    }),
    _: 3
  }, _parent));
  if (_ctx.frontmatter.home) {
    _push(serverRenderer.ssrRenderComponent(_component_Home, null, null, _parent));
  } else {
    _push(serverRenderer.ssrRenderComponent(_component_Page, vue.mergeProps({
      key: _ctx.page.path
    }, _attrs), {
      top: vue.withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          serverRenderer.ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push2, _parent2, _scopeId);
        } else {
          return [
            vue.renderSlot(_ctx.$slots, "page-top")
          ];
        }
      }),
      bottom: vue.withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          serverRenderer.ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push2, _parent2, _scopeId);
        } else {
          return [
            vue.renderSlot(_ctx.$slots, "page-bottom")
          ];
        }
      }),
      _: 3
    }, _parent));
  }
  _push(`</div>`);
}
_sfc_main.ssrRender = _sfc_ssrRender;
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("../node_modules/vuepress-vite/node_modules/@vuepress/theme-default/lib/layouts/Layout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main
});
exports.createServerApp = createServerApp;
