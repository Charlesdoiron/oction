/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/queue-tick";
exports.ids = ["vendor-chunks/queue-tick"];
exports.modules = {

/***/ "(rsc)/./node_modules/queue-tick/process-next-tick.js":
/*!******************************************************!*\
  !*** ./node_modules/queue-tick/process-next-tick.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (typeof process !== 'undefined' && typeof process.nextTick === 'function')\n  ? process.nextTick.bind(process)\n  : __webpack_require__(/*! ./queue-microtask */ \"(rsc)/./node_modules/queue-tick/queue-microtask.js\")\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvcXVldWUtdGljay9wcm9jZXNzLW5leHQtdGljay5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0EsSUFBSSxtQkFBTyxDQUFDLDZFQUFtQiIsInNvdXJjZXMiOlsid2VicGFjazovL2F1Y3Rpb24tc2NyYXBwZXIvLi9ub2RlX21vZHVsZXMvcXVldWUtdGljay9wcm9jZXNzLW5leHQtdGljay5qcz8xNjI3Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2Vzcy5uZXh0VGljayA9PT0gJ2Z1bmN0aW9uJylcbiAgPyBwcm9jZXNzLm5leHRUaWNrLmJpbmQocHJvY2VzcylcbiAgOiByZXF1aXJlKCcuL3F1ZXVlLW1pY3JvdGFzaycpXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/queue-tick/process-next-tick.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/queue-tick/queue-microtask.js":
/*!****************************************************!*\
  !*** ./node_modules/queue-tick/queue-microtask.js ***!
  \****************************************************/
/***/ ((module) => {

eval("module.exports = typeof queueMicrotask === 'function' ? queueMicrotask : (fn) => Promise.resolve().then(fn)\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvcXVldWUtdGljay9xdWV1ZS1taWNyb3Rhc2suanMiLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdWN0aW9uLXNjcmFwcGVyLy4vbm9kZV9tb2R1bGVzL3F1ZXVlLXRpY2svcXVldWUtbWljcm90YXNrLmpzPzRhZjAiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB0eXBlb2YgcXVldWVNaWNyb3Rhc2sgPT09ICdmdW5jdGlvbicgPyBxdWV1ZU1pY3JvdGFzayA6IChmbikgPT4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmbilcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/queue-tick/queue-microtask.js\n");

/***/ })

};
;