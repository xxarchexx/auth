/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"vendors~main"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/actions/action-types.js":
/*!****************************************!*\
  !*** ./src/js/actions/action-types.js ***!
  \****************************************/
/*! exports provided: SIGNUP, LOGIN, SUGN_UP_SUCCESS, LOGIN_SICESS, SUGN_UP_FAILED, LOGIN_FAILED, SIGN_UP_CLEAR */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SIGNUP", function() { return SIGNUP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGIN", function() { return LOGIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUGN_UP_SUCCESS", function() { return SUGN_UP_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGIN_SICESS", function() { return LOGIN_SICESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUGN_UP_FAILED", function() { return SUGN_UP_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGIN_FAILED", function() { return LOGIN_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SIGN_UP_CLEAR", function() { return SIGN_UP_CLEAR; });
var SIGNUP = 'SUGN_UP';
var LOGIN = 'LOGIN';
var SUGN_UP_SUCCESS = 'SUGN_UP_SUCCESS';
var LOGIN_SICESS = 'LOGIN_SICESS';
var SUGN_UP_FAILED = 'SUGN_UP_FAILED';
var LOGIN_FAILED = 'LOGIN_FAILED';
var SIGN_UP_CLEAR = 'SIGN_UP_CLEAR';

/***/ }),

/***/ "./src/js/actions/index.js":
/*!*********************************!*\
  !*** ./src/js/actions/index.js ***!
  \*********************************/
/*! exports provided: signUp, ifUserExists, userSignupRequest, signIn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "signUp", function() { return signUp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ifUserExists", function() { return ifUserExists; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userSignupRequest", function() { return userSignupRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "signIn", function() { return signIn; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _action_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action-types */ "./src/js/actions/action-types.js");


function signUp(userData) {
  return function (dispatch) {
    return axios__WEBPACK_IMPORTED_MODULE_0___default.a.post("api/users,userData");
  };
}
function ifUserExists(identifier) {
  return function (dispatch) {
    return axios__WEBPACK_IMPORTED_MODULE_0___default.a.get("/api/users/".concat(identifier));
  };
}

var userSignup = function userSignup(data) {
  return {
    payload: data,
    type: _action_types__WEBPACK_IMPORTED_MODULE_1__["SUGN_UP_SUCCESS"]
  };
};

var clearData = function clearData() {
  return {
    payload: null,
    type: _action_types__WEBPACK_IMPORTED_MODULE_1__["SIGN_UP_CLEAR"]
  };
};

function userSignupRequest(userData) {
  return function (dispatch) {
    axios__WEBPACK_IMPORTED_MODULE_0___default.a.post("/registration", userData).then(function (res) {
      dispatch(userSignup(res.data));
    }).then(function () {
      dispatch(userClearData());
    });
  };
}

function test(data) {
  return {
    type: "TEST",
    data: data
  };
}

function signIn(login, password) {
  return function (dispatch) {
    axios__WEBPACK_IMPORTED_MODULE_0___default.a.post("/login", {
      login: login,
      password: password
    }).then(function (e) {
      console.log(e);
      dispatch(test(e));
    });
  };
}

/***/ }),

/***/ "./src/js/components/generalComponents/CardGrid/ResponsiveCard.jsx":
/*!*************************************************************************!*\
  !*** ./src/js/components/generalComponents/CardGrid/ResponsiveCard.jsx ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/styles */ "./node_modules/@material-ui/core/esm/styles/index.js");
/* harmony import */ var _material_ui_core_Card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/core/Card */ "./node_modules/@material-ui/core/esm/Card/index.js");
/* harmony import */ var _ResponsiveConstants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ResponsiveConstants */ "./src/js/components/generalComponents/CardGrid/ResponsiveConstants.jsx");





var styleSheet = Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__["makeStyles"])(function (theme) {
  var _root;

  return {
    root: (_root = {}, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_root, theme.breakpoints.down(_ResponsiveConstants__WEBPACK_IMPORTED_MODULE_4__["default"].mobileBreakpoint), {
      boxShadow: "0px 0px 0px 0px"
    }), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_root, theme.breakpoints.up(_ResponsiveConstants__WEBPACK_IMPORTED_MODULE_4__["default"].mobileBreakpoint), {
      "max-width": 500
    }), _root)
  };
});

function ResponsiveCard(props) {
  var classes = props.classes;
  var children = props.children;
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core_Card__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: classes.root
  }, children);
}

/* harmony default export */ __webpack_exports__["default"] = (Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__["withStyles"])(styleSheet)(ResponsiveCard));

/***/ }),

/***/ "./src/js/components/generalComponents/CardGrid/ResponsiveConstants.jsx":
/*!******************************************************************************!*\
  !*** ./src/js/components/generalComponents/CardGrid/ResponsiveConstants.jsx ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  mobileBreakpoint: "sm"
});

/***/ }),

/***/ "./src/js/components/generalComponents/CardGrid/ResponsiveContainerGrid.jsx":
/*!**********************************************************************************!*\
  !*** ./src/js/components/generalComponents/CardGrid/ResponsiveContainerGrid.jsx ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/styles */ "./node_modules/@material-ui/core/esm/styles/index.js");
/* harmony import */ var _material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/core/Grid */ "./node_modules/@material-ui/core/esm/Grid/index.js");
/* harmony import */ var _ResponsiveConstants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ResponsiveConstants */ "./src/js/components/generalComponents/CardGrid/ResponsiveConstants.jsx");






var styleSheet = Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__["makeStyles"])(function (theme) {
  return {
    root: _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()({}, theme.breakpoints.up(_ResponsiveConstants__WEBPACK_IMPORTED_MODULE_4__["default"].mobileBreakpoint), {
      "min-height": 500
    })
  };
});

function ResponsiveContainerGrid(props) {
  var classes = props.classes;
  var children = props.children;
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: classes.root,
    container: true,
    direction: "row",
    justify: "center",
    align: "center"
  }, children);
}

/* harmony default export */ __webpack_exports__["default"] = (Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__["withStyles"])(styleSheet)(ResponsiveContainerGrid));

/***/ }),

/***/ "./src/js/components/signIn.jsx":
/*!**************************************!*\
  !*** ./src/js/components/signIn.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SignIn; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var _material_ui_core_Button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/esm/Button/index.js");
/* harmony import */ var _material_ui_core_TextField__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @material-ui/core/TextField */ "./node_modules/@material-ui/core/esm/TextField/index.js");
/* harmony import */ var _material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @material-ui/core/Grid */ "./node_modules/@material-ui/core/esm/Grid/index.js");
/* harmony import */ var _material_ui_core_Card__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @material-ui/core/Card */ "./node_modules/@material-ui/core/esm/Card/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");
/* harmony import */ var _material_ui_icons__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @material-ui/icons */ "./node_modules/@material-ui/icons/esm/index.js");
/* harmony import */ var _icons_google_svg__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @/icons/google.svg */ "./src/js/icons/google.svg");
/* harmony import */ var _icons_google_svg__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_icons_google_svg__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _styles_css_test_scss__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @/styles/css/test.scss */ "./src/js/styles/css/test.scss");
/* harmony import */ var _styles_css_test_scss__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_styles_css_test_scss__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _generalComponents_CardGrid_ResponsiveCard__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./generalComponents/CardGrid/ResponsiveCard */ "./src/js/components/generalComponents/CardGrid/ResponsiveCard.jsx");
/* harmony import */ var _generalComponents_CardGrid_ResponsiveContainerGrid__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./generalComponents/CardGrid/ResponsiveContainerGrid */ "./src/js/components/generalComponents/CardGrid/ResponsiveContainerGrid.jsx");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_20__);






















var SignIn =
/*#__PURE__*/
function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(SignIn, _Component);

  function SignIn(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, SignIn);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(SignIn).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "facebookLogin", function () {
      console.log('facebook login');
      axios__WEBPACK_IMPORTED_MODULE_20___default.a.get('/facebooklogin').then(function (res) {
        window.location.replace('http://www.google.com');
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "googleLogin", function () {
      console.log('google login');
    });

    _this.signIn = _this.signIn.bind(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this));
    _this.state = {
      location: "",
      login: {
        value: null,
        error: false,
        helperText: null
      },
      password: {
        value: null,
        error: false,
        helperText: null
      }
    };
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(SignIn, [{
    key: "signIn",
    value: function signIn(e) {
      if (this.loginInput.value === "") {
        this.setState({
          email: {
            value: this.loginInput.value,
            error: true,
            helperText: "Your login must be specified."
          }
        });
        this.loginInput.focus();
      }

      e.preventDefault();
      this.props.SignIn(this.loginInput.value, this.passwordInput.value);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_generalComponents_CardGrid_ResponsiveContainerGrid__WEBPACK_IMPORTED_MODULE_19__["default"], null, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
        item: true,
        xs: 12,
        sm: 6
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_generalComponents_CardGrid_ResponsiveCard__WEBPACK_IMPORTED_MODULE_18__["default"], null, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("form", {
        onSubmit: this.signIn.bind(this)
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_14__["CardHeader"], {
        title: "Sign in",
        subheader: "to continue to TPWC"
      }), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_14__["CardContent"], null, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core_TextField__WEBPACK_IMPORTED_MODULE_11__["default"], {
        label: "Enter your email",
        fullWidth: true,
        autoFocus: true,
        required: true,
        inputRef: function inputRef(input) {
          return _this2.loginInput = input;
        },
        error: this.state.login.error,
        helperText: this.state.login.helperText
      }), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core_TextField__WEBPACK_IMPORTED_MODULE_11__["default"], {
        label: "Enter your password",
        fullWidth: true,
        required: true,
        type: "password",
        inputRef: function inputRef(input) {
          return _this2.passwordInput = input;
        }
      })), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_14__["CardActions"], {
        p: 1,
        style: {
          justifyContent: "space-between"
        }
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_10__["default"], {
        variant: "outlined"
      }, "Forgot password"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_10__["default"], {
        type: "submit",
        variant: "contained",
        color: "primary"
      }, "Sign in"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_9__["Link"], {
        to: "/signup"
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_10__["default"], {
        variant: "contained",
        color: "default"
      }, "Sign Up"))))), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_generalComponents_CardGrid_ResponsiveCard__WEBPACK_IMPORTED_MODULE_18__["default"], null, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_14__["CardHeader"], {
        title: "",
        subheader: ""
      }), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_14__["Paper"], null, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_14__["IconButton"], {
        onClick: this.facebookLogin,
        m: 1
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_icons__WEBPACK_IMPORTED_MODULE_15__["Facebook"], null)), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_14__["IconButton"], {
        onClick: this.googleLogin,
        m: 1
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(GoogleIcon, null))))))));
    }
  }]);

  return SignIn;
}(react__WEBPACK_IMPORTED_MODULE_7__["Component"]);



var GoogleIcon = function GoogleIcon(props) {
  return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_14__["Icon"], props, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("img", {
    src: _icons_google_svg__WEBPACK_IMPORTED_MODULE_16___default.a
  }));
};

/***/ }),

/***/ "./src/js/components/signUp.jsx":
/*!**************************************!*\
  !*** ./src/js/components/signUp.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _material_ui_core_Avatar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material-ui/core/Avatar */ "./node_modules/@material-ui/core/esm/Avatar/index.js");
/* harmony import */ var _material_ui_core_Button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/core/Button */ "./node_modules/@material-ui/core/esm/Button/index.js");
/* harmony import */ var _material_ui_core_CssBaseline__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @material-ui/core/CssBaseline */ "./node_modules/@material-ui/core/esm/CssBaseline/index.js");
/* harmony import */ var _material_ui_core_TextField__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @material-ui/core/TextField */ "./node_modules/@material-ui/core/esm/TextField/index.js");
/* harmony import */ var _material_ui_core_FormControlLabel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @material-ui/core/FormControlLabel */ "./node_modules/@material-ui/core/esm/FormControlLabel/index.js");
/* harmony import */ var _material_ui_core_Checkbox__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @material-ui/core/Checkbox */ "./node_modules/@material-ui/core/esm/Checkbox/index.js");
/* harmony import */ var _material_ui_core_Link__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @material-ui/core/Link */ "./node_modules/@material-ui/core/esm/Link/index.js");
/* harmony import */ var _material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @material-ui/core/Grid */ "./node_modules/@material-ui/core/esm/Grid/index.js");
/* harmony import */ var _material_ui_core_Box__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @material-ui/core/Box */ "./node_modules/@material-ui/core/esm/Box/index.js");
/* harmony import */ var _material_ui_icons_LockOutlined__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @material-ui/icons/LockOutlined */ "./node_modules/@material-ui/icons/LockOutlined.js");
/* harmony import */ var _material_ui_icons_LockOutlined__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_LockOutlined__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @material-ui/core/Typography */ "./node_modules/@material-ui/core/esm/Typography/index.js");
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @material-ui/core/styles */ "./node_modules/@material-ui/core/esm/styles/index.js");
/* harmony import */ var _material_ui_core_Container__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @material-ui/core/Container */ "./node_modules/@material-ui/core/esm/Container/index.js");




















function Copyright() {
  return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_16__["default"], {
    variant: "body2",
    color: "textSecondary",
    align: "center"
  }, 'Copyright © ', react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Link__WEBPACK_IMPORTED_MODULE_12__["default"], {
    color: "inherit",
    href: "https://material-ui.com/"
  }, "Your Website"), ' ', new Date().getFullYear(), '.');
}

var styles = function styles(theme) {
  return {
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
    },
    form: {
      width: '100%',
      // Fix IE 11 issue.
      marginTop: theme.spacing(3)
    },
    submit: {
      margin: theme.spacing(3, 0, 2)
    }
  };
};

var SignUp =
/*#__PURE__*/
function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(SignUp, _Component);

  function SignUp() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, SignUp);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(SignUp).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(SignUp, [{
    key: "render",
    value: function render() {
      function signUp() {
        console.log(this.state);
      }

      var classes = this.props;
      return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Container__WEBPACK_IMPORTED_MODULE_18__["default"], {
        component: "main",
        maxWidth: "xs"
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_CssBaseline__WEBPACK_IMPORTED_MODULE_8__["default"], null), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: classes.paper
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Avatar__WEBPACK_IMPORTED_MODULE_6__["default"], {
        className: classes.avatar
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_icons_LockOutlined__WEBPACK_IMPORTED_MODULE_15___default.a, null)), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_16__["default"], {
        component: "h1",
        variant: "h5"
      }, "Sign up"), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("form", {
        className: classes.form,
        noValidate: true
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_13__["default"], {
        container: true,
        spacing: 2
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_13__["default"], {
        item: true,
        xs: 12,
        sm: 6
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_TextField__WEBPACK_IMPORTED_MODULE_9__["default"], {
        autoComplete: "fname",
        name: "firstName",
        variant: "outlined",
        required: true,
        fullWidth: true,
        id: "firstName",
        label: "First Name",
        autoFocus: true
      })), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_13__["default"], {
        item: true,
        xs: 12,
        sm: 6
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_TextField__WEBPACK_IMPORTED_MODULE_9__["default"], {
        variant: "outlined",
        required: true,
        fullWidth: true,
        id: "lastName",
        label: "Last Name",
        name: "lastName",
        autoComplete: "lname"
      })), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_13__["default"], {
        item: true,
        xs: 12
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_TextField__WEBPACK_IMPORTED_MODULE_9__["default"], {
        variant: "outlined",
        required: true,
        fullWidth: true,
        id: "email",
        label: "Email Address",
        name: "email",
        autoComplete: "email"
      })), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_13__["default"], {
        item: true,
        xs: 12
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_TextField__WEBPACK_IMPORTED_MODULE_9__["default"], {
        variant: "outlined",
        required: true,
        fullWidth: true,
        name: "password",
        label: "Password",
        type: "password",
        id: "password",
        autoComplete: "current-password"
      })), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_13__["default"], {
        item: true,
        xs: 12
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_FormControlLabel__WEBPACK_IMPORTED_MODULE_10__["default"], {
        control: react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Checkbox__WEBPACK_IMPORTED_MODULE_11__["default"], {
          value: "allowExtraEmails",
          color: "primary"
        }),
        label: "I want to receive inspiration, marketing promotions and updates via email."
      }))), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Button__WEBPACK_IMPORTED_MODULE_7__["default"], {
        onSubmit: this.signUp,
        type: "submit",
        fullWidth: true,
        variant: "contained",
        color: "primary",
        className: classes.submit
      }, "Sign Up"), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_13__["default"], {
        container: true,
        justify: "flex-end"
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_13__["default"], {
        item: true
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Link__WEBPACK_IMPORTED_MODULE_12__["default"], {
        href: "#",
        variant: "body2"
      }, "Already have an account? Sign in"))))), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_material_ui_core_Box__WEBPACK_IMPORTED_MODULE_14__["default"], {
        mt: 5
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(Copyright, null)));
    }
  }]);

  return SignUp;
}(react__WEBPACK_IMPORTED_MODULE_5__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_17__["withStyles"])(styles)(SignUp));

/***/ }),

/***/ "./src/js/containers/signInContainer.js":
/*!**********************************************!*\
  !*** ./src/js/containers/signInContainer.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _components_signIn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/signIn */ "./src/js/components/signIn.jsx");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../actions */ "./src/js/actions/index.js");




var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    SignIn: function SignIn(login, password) {
      dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_2__["signIn"])(login, password));
    }
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(null, mapDispatchToProps)(_components_signIn__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./src/js/containers/signUpContainer.js":
/*!**********************************************!*\
  !*** ./src/js/containers/signUpContainer.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _components_signUp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/signUp */ "./src/js/components/signUp.jsx");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../actions */ "./src/js/actions/index.js");




var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    SignUp: function SignUp(data) {
      dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_2__["userSignupRequest"])(data));
    }
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(null, mapDispatchToProps)(_components_signUp__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./src/js/icons/google.svg":
/*!*********************************!*\
  !*** ./src/js/icons/google.svg ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "google.21eba9f8661ab1e024758ac6665bfa8d.svg";

/***/ }),

/***/ "./src/js/index.jsx":
/*!**************************!*\
  !*** ./src/js/index.jsx ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! redux-thunk */ "./node_modules/redux-thunk/es/index.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _rootReducer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rootReducer */ "./src/js/rootReducer.js");
/* harmony import */ var jwt_decode__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! jwt-decode */ "./node_modules/jwt-decode/lib/index.js");
/* harmony import */ var jwt_decode__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(jwt_decode__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var _containers_signUpContainer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./containers/signUpContainer */ "./src/js/containers/signUpContainer.js");
/* harmony import */ var _containers_signInContainer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./containers/signInContainer */ "./src/js/containers/signInContainer.js");
/* harmony import */ var _registerServiceWorker__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./registerServiceWorker */ "./src/js/registerServiceWorker.js");







 // import App from './rootContainers/App';
// import Greetings from './components/Greetings';

 // import SignIn from './components/login';



var devTools =  true ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : undefined;
var store = Object(redux__WEBPACK_IMPORTED_MODULE_4__["createStore"])(_rootReducer__WEBPACK_IMPORTED_MODULE_5__["default"], Object(redux__WEBPACK_IMPORTED_MODULE_4__["compose"])(Object(redux__WEBPACK_IMPORTED_MODULE_4__["applyMiddleware"])(redux_thunk__WEBPACK_IMPORTED_MODULE_3__["default"])));

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  store.dispatch(setCurrentUser(jwt_decode__WEBPACK_IMPORTED_MODULE_6___default()(localStorage.jwtToken)));
}

Object(react_dom__WEBPACK_IMPORTED_MODULE_1__["render"])(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  store: store
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_7__["BrowserRouter"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_7__["Route"], {
  path: "/login",
  component: _containers_signInContainer__WEBPACK_IMPORTED_MODULE_9__["default"]
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_7__["Route"], {
  path: "/signup",
  component: _containers_signUpContainer__WEBPACK_IMPORTED_MODULE_8__["default"]
}))), document.getElementById('app'));
Object(_registerServiceWorker__WEBPACK_IMPORTED_MODULE_10__["default"])();

/***/ }),

/***/ "./src/js/reducers/auth.js":
/*!*********************************!*\
  !*** ./src/js/reducers/auth.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _actions_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/action-types */ "./src/js/actions/action-types.js");
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/isEmpty */ "./node_modules/lodash/isEmpty.js");
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1__);


var initialState = {
  isRegistratedSuccess: false,
  payload: {},
  user: {}
};

var Auth = function Auth() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  switch (action.type) {
    case _actions_action_types__WEBPACK_IMPORTED_MODULE_0__["SIGNUP"]:
      return Object.assign({}, state, {
        action: action.type,
        payload: action.payload,
        redirect: true
      });

    case _actions_action_types__WEBPACK_IMPORTED_MODULE_0__["SIGN_UP_CLEAR"]:
      return Object.assign({}, state, {
        action: action.type,
        payload: null,
        redirect: false
      });

    case _actions_action_types__WEBPACK_IMPORTED_MODULE_0__["SUGN_UP_SUCCESS"]:
      return Object.assign({}, state, {
        action: action.type,
        payload: action.payload,
        redirect: true
      });

    default:
      return state;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Auth);

/***/ }),

/***/ "./src/js/registerServiceWorker.js":
/*!*****************************************!*\
  !*** ./src/js/registerServiceWorker.js ***!
  \*****************************************/
/*! exports provided: default, unregister */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return register; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unregister", function() { return unregister; });
// In production, we register a service worker to serve assets from local cache.
// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.
// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.
var isLocalhost = Boolean(window.location.hostname === 'localhost' || // [::1] is the IPv6 localhost address.
window.location.hostname === '[::1]' || // 127.0.0.1/8 is considered localhost for IPv4.
window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
function register() {
  if (false) { var publicUrl; }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker.register(swUrl).then(function (registration) {
    registration.onupdatefound = function () {
      var installingWorker = registration.installing;

      installingWorker.onstatechange = function () {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // At this point, the old content will have been purged and
            // the fresh content will have been added to the cache.
            // It's the perfect time to display a "New content is
            // available; please refresh." message in your web app.
            console.log('New content is available; please refresh.');
          } else {
            // At this point, everything has been precached.
            // It's the perfect time to display a
            // "Content is cached for offline use." message.
            console.log('Content is cached for offline use.');
          }
        }
      };
    };
  })["catch"](function (error) {
    console.error('Error during service worker registration:', error);
  });
}

function checkValidServiceWorker(swUrl) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl).then(function (response) {
    // Ensure service worker exists, and that we really are getting a JS file.
    if (response.status === 404 || response.headers.get('content-type').indexOf('javascript') === -1) {
      // No service worker found. Probably a different app. Reload the page.
      navigator.serviceWorker.ready.then(function (registration) {
        registration.unregister().then(function () {
          window.location.reload();
        });
      });
    } else {
      // Service worker found. Proceed as normal.
      registerValidSW(swUrl);
    }
  })["catch"](function () {
    console.log('No internet connection found. App is running in offline mode.');
  });
}

function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.unregister();
    });
  }
}

/***/ }),

/***/ "./src/js/rootReducer.js":
/*!*******************************!*\
  !*** ./src/js/rootReducer.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _reducers_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reducers/auth */ "./src/js/reducers/auth.js");


/* harmony default export */ __webpack_exports__["default"] = (Object(redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"])({
  rootRedicer: _reducers_auth__WEBPACK_IMPORTED_MODULE_1__["default"]
}));

/***/ }),

/***/ "./src/js/styles/css/test.scss":
/*!*************************************!*\
  !*** ./src/js/styles/css/test.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 0:
/*!************************************************!*\
  !*** multi @babel/polyfill ./src/js/index.jsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! @babel/polyfill */"./node_modules/@babel/polyfill/lib/index.js");
module.exports = __webpack_require__(/*! ./src/js/index.jsx */"./src/js/index.jsx");


/***/ })

/******/ });