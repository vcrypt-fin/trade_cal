import _node_timers from "https://deno.land/std@0.90.0/node/timers.ts";
  !globalThis.setImmediate && Object.defineProperty(globalThis, "setImmediate", {
    value: _node_timers.setImmediate,
    enumerable: true,
    writable: true,
    configurable: true,
  });
  !globalThis.clearImmediate && Object.defineProperty(globalThis, "clearImmediate", {
    value: _node_timers.clearImmediate,
    enumerable: true,
    writable: true,
    configurable: true,
  });import { Buffer as bufferModule } from "https://deno.land/std@0.90.0/node/buffer.ts";
  !globalThis.Buffer && Object.defineProperty(globalThis, "Buffer", {
    value: bufferModule,
    enumerable: false,
    writable: true,
    configurable: true,
  });!globalThis.global && Object.defineProperty(globalThis, "global", {
    value: globalThis,
    writable: false,
    enumerable: false,
    configurable: true,
  });import processModule from "https://deno.land/std@0.90.0/node/process.ts";
  !globalThis.process && Object.defineProperty(globalThis, "process", {
    value: processModule,
    enumerable: false,
    writable: true,
    configurable: true,
  });import require$$0 from 'https://deno.land/std@0.90.0/node/crypto.ts';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var dist = {};

var api = {};

var accountInformationApi = {};

var accountInformationApiGenerated = {};

var axios_1;
var hasRequiredAxios;

function requireAxios () {
	if (hasRequiredAxios) return axios_1;
	hasRequiredAxios = 1;

	function bind(fn, thisArg) {
	  return function wrap() {
	    return fn.apply(thisArg, arguments);
	  };
	}

	// utils is a library of generic helper functions non-specific to axios

	const {toString} = Object.prototype;
	const {getPrototypeOf} = Object;

	const kindOf = (cache => thing => {
	    const str = toString.call(thing);
	    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
	})(Object.create(null));

	const kindOfTest = (type) => {
	  type = type.toLowerCase();
	  return (thing) => kindOf(thing) === type
	};

	const typeOfTest = type => thing => typeof thing === type;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 *
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	const {isArray} = Array;

	/**
	 * Determine if a value is undefined
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	const isUndefined = typeOfTest('undefined');

	/**
	 * Determine if a value is a Buffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Buffer, otherwise false
	 */
	function isBuffer(val) {
	  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
	    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	const isArrayBuffer = kindOfTest('ArrayBuffer');


	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  let result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
	  }
	  return result;
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	const isString = typeOfTest('string');

	/**
	 * Determine if a value is a Function
	 *
	 * @param {*} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	const isFunction = typeOfTest('function');

	/**
	 * Determine if a value is a Number
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	const isNumber = typeOfTest('number');

	/**
	 * Determine if a value is an Object
	 *
	 * @param {*} thing The value to test
	 *
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	const isObject = (thing) => thing !== null && typeof thing === 'object';

	/**
	 * Determine if a value is a Boolean
	 *
	 * @param {*} thing The value to test
	 * @returns {boolean} True if value is a Boolean, otherwise false
	 */
	const isBoolean = thing => thing === true || thing === false;

	/**
	 * Determine if a value is a plain Object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a plain Object, otherwise false
	 */
	const isPlainObject = (val) => {
	  if (kindOf(val) !== 'object') {
	    return false;
	  }

	  const prototype = getPrototypeOf(val);
	  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
	};

	/**
	 * Determine if a value is a Date
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	const isDate = kindOfTest('Date');

	/**
	 * Determine if a value is a File
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	const isFile = kindOfTest('File');

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	const isBlob = kindOfTest('Blob');

	/**
	 * Determine if a value is a FileList
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	const isFileList = kindOfTest('FileList');

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	const isStream = (val) => isObject(val) && isFunction(val.pipe);

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {*} thing The value to test
	 *
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	const isFormData = (thing) => {
	  let kind;
	  return thing && (
	    (typeof FormData === 'function' && thing instanceof FormData) || (
	      isFunction(thing.append) && (
	        (kind = kindOf(thing)) === 'formdata' ||
	        // detect form-data instance
	        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
	      )
	    )
	  )
	};

	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	const isURLSearchParams = kindOfTest('URLSearchParams');

	const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 *
	 * @returns {String} The String freed of excess whitespace
	 */
	const trim = (str) => str.trim ?
	  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 *
	 * @param {Boolean} [allOwnKeys = false]
	 * @returns {any}
	 */
	function forEach(obj, fn, {allOwnKeys = false} = {}) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  let i;
	  let l;

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object') {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray(obj)) {
	    // Iterate over array values
	    for (i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
	    const len = keys.length;
	    let key;

	    for (i = 0; i < len; i++) {
	      key = keys[i];
	      fn.call(null, obj[key], key, obj);
	    }
	  }
	}

	function findKey(obj, key) {
	  key = key.toLowerCase();
	  const keys = Object.keys(obj);
	  let i = keys.length;
	  let _key;
	  while (i-- > 0) {
	    _key = keys[i];
	    if (key === _key.toLowerCase()) {
	      return _key;
	    }
	  }
	  return null;
	}

	const _global = (() => {
	  /*eslint no-undef:0*/
	  if (typeof globalThis !== "undefined") return globalThis;
	  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : commonjsGlobal)
	})();

	const isContextDefined = (context) => !isUndefined(context) && context !== _global;

	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 *
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  const {caseless} = isContextDefined(this) && this || {};
	  const result = {};
	  const assignValue = (val, key) => {
	    const targetKey = caseless && findKey(result, key) || key;
	    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
	      result[targetKey] = merge(result[targetKey], val);
	    } else if (isPlainObject(val)) {
	      result[targetKey] = merge({}, val);
	    } else if (isArray(val)) {
	      result[targetKey] = val.slice();
	    } else {
	      result[targetKey] = val;
	    }
	  };

	  for (let i = 0, l = arguments.length; i < l; i++) {
	    arguments[i] && forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 *
	 * @param {Boolean} [allOwnKeys]
	 * @returns {Object} The resulting value of object a
	 */
	const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
	  forEach(b, (val, key) => {
	    if (thisArg && isFunction(val)) {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  }, {allOwnKeys});
	  return a;
	};

	/**
	 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
	 *
	 * @param {string} content with BOM
	 *
	 * @returns {string} content value without BOM
	 */
	const stripBOM = (content) => {
	  if (content.charCodeAt(0) === 0xFEFF) {
	    content = content.slice(1);
	  }
	  return content;
	};

	/**
	 * Inherit the prototype methods from one constructor into another
	 * @param {function} constructor
	 * @param {function} superConstructor
	 * @param {object} [props]
	 * @param {object} [descriptors]
	 *
	 * @returns {void}
	 */
	const inherits = (constructor, superConstructor, props, descriptors) => {
	  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
	  constructor.prototype.constructor = constructor;
	  Object.defineProperty(constructor, 'super', {
	    value: superConstructor.prototype
	  });
	  props && Object.assign(constructor.prototype, props);
	};

	/**
	 * Resolve object with deep prototype chain to a flat object
	 * @param {Object} sourceObj source object
	 * @param {Object} [destObj]
	 * @param {Function|Boolean} [filter]
	 * @param {Function} [propFilter]
	 *
	 * @returns {Object}
	 */
	const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
	  let props;
	  let i;
	  let prop;
	  const merged = {};

	  destObj = destObj || {};
	  // eslint-disable-next-line no-eq-null,eqeqeq
	  if (sourceObj == null) return destObj;

	  do {
	    props = Object.getOwnPropertyNames(sourceObj);
	    i = props.length;
	    while (i-- > 0) {
	      prop = props[i];
	      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
	        destObj[prop] = sourceObj[prop];
	        merged[prop] = true;
	      }
	    }
	    sourceObj = filter !== false && getPrototypeOf(sourceObj);
	  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

	  return destObj;
	};

	/**
	 * Determines whether a string ends with the characters of a specified string
	 *
	 * @param {String} str
	 * @param {String} searchString
	 * @param {Number} [position= 0]
	 *
	 * @returns {boolean}
	 */
	const endsWith = (str, searchString, position) => {
	  str = String(str);
	  if (position === undefined || position > str.length) {
	    position = str.length;
	  }
	  position -= searchString.length;
	  const lastIndex = str.indexOf(searchString, position);
	  return lastIndex !== -1 && lastIndex === position;
	};


	/**
	 * Returns new array from array like object or null if failed
	 *
	 * @param {*} [thing]
	 *
	 * @returns {?Array}
	 */
	const toArray = (thing) => {
	  if (!thing) return null;
	  if (isArray(thing)) return thing;
	  let i = thing.length;
	  if (!isNumber(i)) return null;
	  const arr = new Array(i);
	  while (i-- > 0) {
	    arr[i] = thing[i];
	  }
	  return arr;
	};

	/**
	 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
	 * thing passed in is an instance of Uint8Array
	 *
	 * @param {TypedArray}
	 *
	 * @returns {Array}
	 */
	// eslint-disable-next-line func-names
	const isTypedArray = (TypedArray => {
	  // eslint-disable-next-line func-names
	  return thing => {
	    return TypedArray && thing instanceof TypedArray;
	  };
	})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

	/**
	 * For each entry in the object, call the function with the key and value.
	 *
	 * @param {Object<any, any>} obj - The object to iterate over.
	 * @param {Function} fn - The function to call for each entry.
	 *
	 * @returns {void}
	 */
	const forEachEntry = (obj, fn) => {
	  const generator = obj && obj[Symbol.iterator];

	  const iterator = generator.call(obj);

	  let result;

	  while ((result = iterator.next()) && !result.done) {
	    const pair = result.value;
	    fn.call(obj, pair[0], pair[1]);
	  }
	};

	/**
	 * It takes a regular expression and a string, and returns an array of all the matches
	 *
	 * @param {string} regExp - The regular expression to match against.
	 * @param {string} str - The string to search.
	 *
	 * @returns {Array<boolean>}
	 */
	const matchAll = (regExp, str) => {
	  let matches;
	  const arr = [];

	  while ((matches = regExp.exec(str)) !== null) {
	    arr.push(matches);
	  }

	  return arr;
	};

	/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
	const isHTMLForm = kindOfTest('HTMLFormElement');

	const toCamelCase = str => {
	  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
	    function replacer(m, p1, p2) {
	      return p1.toUpperCase() + p2;
	    }
	  );
	};

	/* Creating a function that will check if an object has a property. */
	const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

	/**
	 * Determine if a value is a RegExp object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a RegExp object, otherwise false
	 */
	const isRegExp = kindOfTest('RegExp');

	const reduceDescriptors = (obj, reducer) => {
	  const descriptors = Object.getOwnPropertyDescriptors(obj);
	  const reducedDescriptors = {};

	  forEach(descriptors, (descriptor, name) => {
	    let ret;
	    if ((ret = reducer(descriptor, name, obj)) !== false) {
	      reducedDescriptors[name] = ret || descriptor;
	    }
	  });

	  Object.defineProperties(obj, reducedDescriptors);
	};

	/**
	 * Makes all methods read-only
	 * @param {Object} obj
	 */

	const freezeMethods = (obj) => {
	  reduceDescriptors(obj, (descriptor, name) => {
	    // skip restricted props in strict mode
	    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
	      return false;
	    }

	    const value = obj[name];

	    if (!isFunction(value)) return;

	    descriptor.enumerable = false;

	    if ('writable' in descriptor) {
	      descriptor.writable = false;
	      return;
	    }

	    if (!descriptor.set) {
	      descriptor.set = () => {
	        throw Error('Can not rewrite read-only method \'' + name + '\'');
	      };
	    }
	  });
	};

	const toObjectSet = (arrayOrString, delimiter) => {
	  const obj = {};

	  const define = (arr) => {
	    arr.forEach(value => {
	      obj[value] = true;
	    });
	  };

	  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

	  return obj;
	};

	const noop = () => {};

	const toFiniteNumber = (value, defaultValue) => {
	  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
	};

	const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

	const DIGIT = '0123456789';

	const ALPHABET = {
	  DIGIT,
	  ALPHA,
	  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
	};

	const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
	  let str = '';
	  const {length} = alphabet;
	  while (size--) {
	    str += alphabet[Math.random() * length|0];
	  }

	  return str;
	};

	/**
	 * If the thing is a FormData object, return true, otherwise return false.
	 *
	 * @param {unknown} thing - The thing to check.
	 *
	 * @returns {boolean}
	 */
	function isSpecCompliantForm(thing) {
	  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
	}

	const toJSONObject = (obj) => {
	  const stack = new Array(10);

	  const visit = (source, i) => {

	    if (isObject(source)) {
	      if (stack.indexOf(source) >= 0) {
	        return;
	      }

	      if(!('toJSON' in source)) {
	        stack[i] = source;
	        const target = isArray(source) ? [] : {};

	        forEach(source, (value, key) => {
	          const reducedValue = visit(value, i + 1);
	          !isUndefined(reducedValue) && (target[key] = reducedValue);
	        });

	        stack[i] = undefined;

	        return target;
	      }
	    }

	    return source;
	  };

	  return visit(obj, 0);
	};

	const isAsyncFn = kindOfTest('AsyncFunction');

	const isThenable = (thing) =>
	  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

	// original code
	// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

	const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
	  if (setImmediateSupported) {
	    return setImmediate;
	  }

	  return postMessageSupported ? ((token, callbacks) => {
	    _global.addEventListener("message", ({source, data}) => {
	      if (source === _global && data === token) {
	        callbacks.length && callbacks.shift()();
	      }
	    }, false);

	    return (cb) => {
	      callbacks.push(cb);
	      _global.postMessage(token, "*");
	    }
	  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
	})(
	  typeof setImmediate === 'function',
	  isFunction(_global.postMessage)
	);

	const asap = typeof queueMicrotask !== 'undefined' ?
	  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

	// *********************

	var utils$1 = {
	  isArray,
	  isArrayBuffer,
	  isBuffer,
	  isFormData,
	  isArrayBufferView,
	  isString,
	  isNumber,
	  isBoolean,
	  isObject,
	  isPlainObject,
	  isReadableStream,
	  isRequest,
	  isResponse,
	  isHeaders,
	  isUndefined,
	  isDate,
	  isFile,
	  isBlob,
	  isRegExp,
	  isFunction,
	  isStream,
	  isURLSearchParams,
	  isTypedArray,
	  isFileList,
	  forEach,
	  merge,
	  extend,
	  trim,
	  stripBOM,
	  inherits,
	  toFlatObject,
	  kindOf,
	  kindOfTest,
	  endsWith,
	  toArray,
	  forEachEntry,
	  matchAll,
	  isHTMLForm,
	  hasOwnProperty,
	  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
	  reduceDescriptors,
	  freezeMethods,
	  toObjectSet,
	  toCamelCase,
	  noop,
	  toFiniteNumber,
	  findKey,
	  global: _global,
	  isContextDefined,
	  ALPHABET,
	  generateString,
	  isSpecCompliantForm,
	  toJSONObject,
	  isAsyncFn,
	  isThenable,
	  setImmediate: _setImmediate,
	  asap
	};

	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [config] The config.
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 *
	 * @returns {Error} The created error.
	 */
	function AxiosError(message, code, config, request, response) {
	  Error.call(this);

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, this.constructor);
	  } else {
	    this.stack = (new Error()).stack;
	  }

	  this.message = message;
	  this.name = 'AxiosError';
	  code && (this.code = code);
	  config && (this.config = config);
	  request && (this.request = request);
	  response && (this.response = response);
	}

	utils$1.inherits(AxiosError, Error, {
	  toJSON: function toJSON() {
	    return {
	      // Standard
	      message: this.message,
	      name: this.name,
	      // Microsoft
	      description: this.description,
	      number: this.number,
	      // Mozilla
	      fileName: this.fileName,
	      lineNumber: this.lineNumber,
	      columnNumber: this.columnNumber,
	      stack: this.stack,
	      // Axios
	      config: utils$1.toJSONObject(this.config),
	      code: this.code,
	      status: this.response && this.response.status ? this.response.status : null
	    };
	  }
	});

	const prototype$1 = AxiosError.prototype;
	const descriptors = {};

	[
	  'ERR_BAD_OPTION_VALUE',
	  'ERR_BAD_OPTION',
	  'ECONNABORTED',
	  'ETIMEDOUT',
	  'ERR_NETWORK',
	  'ERR_FR_TOO_MANY_REDIRECTS',
	  'ERR_DEPRECATED',
	  'ERR_BAD_RESPONSE',
	  'ERR_BAD_REQUEST',
	  'ERR_CANCELED',
	  'ERR_NOT_SUPPORT',
	  'ERR_INVALID_URL'
	// eslint-disable-next-line func-names
	].forEach(code => {
	  descriptors[code] = {value: code};
	});

	Object.defineProperties(AxiosError, descriptors);
	Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

	// eslint-disable-next-line func-names
	AxiosError.from = (error, code, config, request, response, customProps) => {
	  const axiosError = Object.create(prototype$1);

	  utils$1.toFlatObject(error, axiosError, function filter(obj) {
	    return obj !== Error.prototype;
	  }, prop => {
	    return prop !== 'isAxiosError';
	  });

	  AxiosError.call(axiosError, error.message, code, config, request, response);

	  axiosError.cause = error;

	  axiosError.name = error.name;

	  customProps && Object.assign(axiosError, customProps);

	  return axiosError;
	};

	// eslint-disable-next-line strict
	var httpAdapter = null;

	/**
	 * Determines if the given thing is a array or js object.
	 *
	 * @param {string} thing - The object or array to be visited.
	 *
	 * @returns {boolean}
	 */
	function isVisitable(thing) {
	  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
	}

	/**
	 * It removes the brackets from the end of a string
	 *
	 * @param {string} key - The key of the parameter.
	 *
	 * @returns {string} the key without the brackets.
	 */
	function removeBrackets(key) {
	  return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
	}

	/**
	 * It takes a path, a key, and a boolean, and returns a string
	 *
	 * @param {string} path - The path to the current key.
	 * @param {string} key - The key of the current object being iterated over.
	 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
	 *
	 * @returns {string} The path to the current key.
	 */
	function renderKey(path, key, dots) {
	  if (!path) return key;
	  return path.concat(key).map(function each(token, i) {
	    // eslint-disable-next-line no-param-reassign
	    token = removeBrackets(token);
	    return !dots && i ? '[' + token + ']' : token;
	  }).join(dots ? '.' : '');
	}

	/**
	 * If the array is an array and none of its elements are visitable, then it's a flat array.
	 *
	 * @param {Array<any>} arr - The array to check
	 *
	 * @returns {boolean}
	 */
	function isFlatArray(arr) {
	  return utils$1.isArray(arr) && !arr.some(isVisitable);
	}

	const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
	  return /^is[A-Z]/.test(prop);
	});

	/**
	 * Convert a data object to FormData
	 *
	 * @param {Object} obj
	 * @param {?Object} [formData]
	 * @param {?Object} [options]
	 * @param {Function} [options.visitor]
	 * @param {Boolean} [options.metaTokens = true]
	 * @param {Boolean} [options.dots = false]
	 * @param {?Boolean} [options.indexes = false]
	 *
	 * @returns {Object}
	 **/

	/**
	 * It converts an object into a FormData object
	 *
	 * @param {Object<any, any>} obj - The object to convert to form data.
	 * @param {string} formData - The FormData object to append to.
	 * @param {Object<string, any>} options
	 *
	 * @returns
	 */
	function toFormData(obj, formData, options) {
	  if (!utils$1.isObject(obj)) {
	    throw new TypeError('target must be an object');
	  }

	  // eslint-disable-next-line no-param-reassign
	  formData = formData || new (FormData)();

	  // eslint-disable-next-line no-param-reassign
	  options = utils$1.toFlatObject(options, {
	    metaTokens: true,
	    dots: false,
	    indexes: false
	  }, false, function defined(option, source) {
	    // eslint-disable-next-line no-eq-null,eqeqeq
	    return !utils$1.isUndefined(source[option]);
	  });

	  const metaTokens = options.metaTokens;
	  // eslint-disable-next-line no-use-before-define
	  const visitor = options.visitor || defaultVisitor;
	  const dots = options.dots;
	  const indexes = options.indexes;
	  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
	  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

	  if (!utils$1.isFunction(visitor)) {
	    throw new TypeError('visitor must be a function');
	  }

	  function convertValue(value) {
	    if (value === null) return '';

	    if (utils$1.isDate(value)) {
	      return value.toISOString();
	    }

	    if (!useBlob && utils$1.isBlob(value)) {
	      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
	    }

	    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
	      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
	    }

	    return value;
	  }

	  /**
	   * Default visitor.
	   *
	   * @param {*} value
	   * @param {String|Number} key
	   * @param {Array<String|Number>} path
	   * @this {FormData}
	   *
	   * @returns {boolean} return true to visit the each prop of the value recursively
	   */
	  function defaultVisitor(value, key, path) {
	    let arr = value;

	    if (value && !path && typeof value === 'object') {
	      if (utils$1.endsWith(key, '{}')) {
	        // eslint-disable-next-line no-param-reassign
	        key = metaTokens ? key : key.slice(0, -2);
	        // eslint-disable-next-line no-param-reassign
	        value = JSON.stringify(value);
	      } else if (
	        (utils$1.isArray(value) && isFlatArray(value)) ||
	        ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))
	        )) {
	        // eslint-disable-next-line no-param-reassign
	        key = removeBrackets(key);

	        arr.forEach(function each(el, index) {
	          !(utils$1.isUndefined(el) || el === null) && formData.append(
	            // eslint-disable-next-line no-nested-ternary
	            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
	            convertValue(el)
	          );
	        });
	        return false;
	      }
	    }

	    if (isVisitable(value)) {
	      return true;
	    }

	    formData.append(renderKey(path, key, dots), convertValue(value));

	    return false;
	  }

	  const stack = [];

	  const exposedHelpers = Object.assign(predicates, {
	    defaultVisitor,
	    convertValue,
	    isVisitable
	  });

	  function build(value, path) {
	    if (utils$1.isUndefined(value)) return;

	    if (stack.indexOf(value) !== -1) {
	      throw Error('Circular reference detected in ' + path.join('.'));
	    }

	    stack.push(value);

	    utils$1.forEach(value, function each(el, key) {
	      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
	        formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers
	      );

	      if (result === true) {
	        build(el, path ? path.concat(key) : [key]);
	      }
	    });

	    stack.pop();
	  }

	  if (!utils$1.isObject(obj)) {
	    throw new TypeError('data must be an object');
	  }

	  build(obj);

	  return formData;
	}

	/**
	 * It encodes a string by replacing all characters that are not in the unreserved set with
	 * their percent-encoded equivalents
	 *
	 * @param {string} str - The string to encode.
	 *
	 * @returns {string} The encoded string.
	 */
	function encode$1(str) {
	  const charMap = {
	    '!': '%21',
	    "'": '%27',
	    '(': '%28',
	    ')': '%29',
	    '~': '%7E',
	    '%20': '+',
	    '%00': '\x00'
	  };
	  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
	    return charMap[match];
	  });
	}

	/**
	 * It takes a params object and converts it to a FormData object
	 *
	 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
	 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
	 *
	 * @returns {void}
	 */
	function AxiosURLSearchParams(params, options) {
	  this._pairs = [];

	  params && toFormData(params, this, options);
	}

	const prototype = AxiosURLSearchParams.prototype;

	prototype.append = function append(name, value) {
	  this._pairs.push([name, value]);
	};

	prototype.toString = function toString(encoder) {
	  const _encode = encoder ? function(value) {
	    return encoder.call(this, value, encode$1);
	  } : encode$1;

	  return this._pairs.map(function each(pair) {
	    return _encode(pair[0]) + '=' + _encode(pair[1]);
	  }, '').join('&');
	};

	/**
	 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
	 * URI encoded counterparts
	 *
	 * @param {string} val The value to be encoded.
	 *
	 * @returns {string} The encoded value.
	 */
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}

	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @param {?object} options
	 *
	 * @returns {string} The formatted url
	 */
	function buildURL(url, params, options) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	  
	  const _encode = options && options.encode || encode;

	  const serializeFn = options && options.serialize;

	  let serializedParams;

	  if (serializeFn) {
	    serializedParams = serializeFn(params, options);
	  } else {
	    serializedParams = utils$1.isURLSearchParams(params) ?
	      params.toString() :
	      new AxiosURLSearchParams(params, options).toString(_encode);
	  }

	  if (serializedParams) {
	    const hashmarkIndex = url.indexOf("#");

	    if (hashmarkIndex !== -1) {
	      url = url.slice(0, hashmarkIndex);
	    }
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }

	  return url;
	}

	class InterceptorManager {
	  constructor() {
	    this.handlers = [];
	  }

	  /**
	   * Add a new interceptor to the stack
	   *
	   * @param {Function} fulfilled The function to handle `then` for a `Promise`
	   * @param {Function} rejected The function to handle `reject` for a `Promise`
	   *
	   * @return {Number} An ID used to remove interceptor later
	   */
	  use(fulfilled, rejected, options) {
	    this.handlers.push({
	      fulfilled,
	      rejected,
	      synchronous: options ? options.synchronous : false,
	      runWhen: options ? options.runWhen : null
	    });
	    return this.handlers.length - 1;
	  }

	  /**
	   * Remove an interceptor from the stack
	   *
	   * @param {Number} id The ID that was returned by `use`
	   *
	   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
	   */
	  eject(id) {
	    if (this.handlers[id]) {
	      this.handlers[id] = null;
	    }
	  }

	  /**
	   * Clear all interceptors from the stack
	   *
	   * @returns {void}
	   */
	  clear() {
	    if (this.handlers) {
	      this.handlers = [];
	    }
	  }

	  /**
	   * Iterate over all the registered interceptors
	   *
	   * This method is particularly useful for skipping over any
	   * interceptors that may have become `null` calling `eject`.
	   *
	   * @param {Function} fn The function to call for each interceptor
	   *
	   * @returns {void}
	   */
	  forEach(fn) {
	    utils$1.forEach(this.handlers, function forEachHandler(h) {
	      if (h !== null) {
	        fn(h);
	      }
	    });
	  }
	}

	var InterceptorManager$1 = InterceptorManager;

	var transitionalDefaults = {
	  silentJSONParsing: true,
	  forcedJSONParsing: true,
	  clarifyTimeoutError: false
	};

	var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

	var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

	var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

	var platform$1 = {
	  isBrowser: true,
	  classes: {
	    URLSearchParams: URLSearchParams$1,
	    FormData: FormData$1,
	    Blob: Blob$1
	  },
	  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
	};

	const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 * nativescript
	 *  navigator.product -> 'NativeScript' or 'NS'
	 *
	 * @returns {boolean}
	 */
	const hasStandardBrowserEnv = (
	  (product) => {
	    return hasBrowserEnv && ['ReactNative', 'NativeScript', 'NS'].indexOf(product) < 0
	  })(typeof navigator !== 'undefined' && navigator.product);

	/**
	 * Determine if we're running in a standard browser webWorker environment
	 *
	 * Although the `isStandardBrowserEnv` method indicates that
	 * `allows axios to run in a web worker`, the WebWorker will still be
	 * filtered out due to its judgment standard
	 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
	 * This leads to a problem when axios post `FormData` in webWorker
	 */
	const hasStandardBrowserWebWorkerEnv = (() => {
	  return (
	    typeof WorkerGlobalScope !== 'undefined' &&
	    // eslint-disable-next-line no-undef
	    self instanceof WorkerGlobalScope &&
	    typeof self.importScripts === 'function'
	  );
	})();

	const origin = hasBrowserEnv && window.location.href || 'http://localhost';

	var utils = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  hasBrowserEnv: hasBrowserEnv,
	  hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
	  hasStandardBrowserEnv: hasStandardBrowserEnv,
	  origin: origin
	});

	var platform = {
	  ...utils,
	  ...platform$1
	};

	function toURLEncodedForm(data, options) {
	  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
	    visitor: function(value, key, path, helpers) {
	      if (platform.isNode && utils$1.isBuffer(value)) {
	        this.append(key, value.toString('base64'));
	        return false;
	      }

	      return helpers.defaultVisitor.apply(this, arguments);
	    }
	  }, options));
	}

	/**
	 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
	 *
	 * @param {string} name - The name of the property to get.
	 *
	 * @returns An array of strings.
	 */
	function parsePropPath(name) {
	  // foo[x][y][z]
	  // foo.x.y.z
	  // foo-x-y-z
	  // foo x y z
	  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
	    return match[0] === '[]' ? '' : match[1] || match[0];
	  });
	}

	/**
	 * Convert an array to an object.
	 *
	 * @param {Array<any>} arr - The array to convert to an object.
	 *
	 * @returns An object with the same keys and values as the array.
	 */
	function arrayToObject(arr) {
	  const obj = {};
	  const keys = Object.keys(arr);
	  let i;
	  const len = keys.length;
	  let key;
	  for (i = 0; i < len; i++) {
	    key = keys[i];
	    obj[key] = arr[key];
	  }
	  return obj;
	}

	/**
	 * It takes a FormData object and returns a JavaScript object
	 *
	 * @param {string} formData The FormData object to convert to JSON.
	 *
	 * @returns {Object<string, any> | null} The converted object.
	 */
	function formDataToJSON(formData) {
	  function buildPath(path, value, target, index) {
	    let name = path[index++];

	    if (name === '__proto__') return true;

	    const isNumericKey = Number.isFinite(+name);
	    const isLast = index >= path.length;
	    name = !name && utils$1.isArray(target) ? target.length : name;

	    if (isLast) {
	      if (utils$1.hasOwnProp(target, name)) {
	        target[name] = [target[name], value];
	      } else {
	        target[name] = value;
	      }

	      return !isNumericKey;
	    }

	    if (!target[name] || !utils$1.isObject(target[name])) {
	      target[name] = [];
	    }

	    const result = buildPath(path, value, target[name], index);

	    if (result && utils$1.isArray(target[name])) {
	      target[name] = arrayToObject(target[name]);
	    }

	    return !isNumericKey;
	  }

	  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
	    const obj = {};

	    utils$1.forEachEntry(formData, (name, value) => {
	      buildPath(parsePropPath(name), value, obj, 0);
	    });

	    return obj;
	  }

	  return null;
	}

	/**
	 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
	 * of the input
	 *
	 * @param {any} rawValue - The value to be stringified.
	 * @param {Function} parser - A function that parses a string into a JavaScript object.
	 * @param {Function} encoder - A function that takes a value and returns a string.
	 *
	 * @returns {string} A stringified version of the rawValue.
	 */
	function stringifySafely(rawValue, parser, encoder) {
	  if (utils$1.isString(rawValue)) {
	    try {
	      (parser || JSON.parse)(rawValue);
	      return utils$1.trim(rawValue);
	    } catch (e) {
	      if (e.name !== 'SyntaxError') {
	        throw e;
	      }
	    }
	  }

	  return (0, JSON.stringify)(rawValue);
	}

	const defaults = {

	  transitional: transitionalDefaults,

	  adapter: ['xhr', 'http', 'fetch'],

	  transformRequest: [function transformRequest(data, headers) {
	    const contentType = headers.getContentType() || '';
	    const hasJSONContentType = contentType.indexOf('application/json') > -1;
	    const isObjectPayload = utils$1.isObject(data);

	    if (isObjectPayload && utils$1.isHTMLForm(data)) {
	      data = new FormData(data);
	    }

	    const isFormData = utils$1.isFormData(data);

	    if (isFormData) {
	      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
	    }

	    if (utils$1.isArrayBuffer(data) ||
	      utils$1.isBuffer(data) ||
	      utils$1.isStream(data) ||
	      utils$1.isFile(data) ||
	      utils$1.isBlob(data) ||
	      utils$1.isReadableStream(data)
	    ) {
	      return data;
	    }
	    if (utils$1.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils$1.isURLSearchParams(data)) {
	      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
	      return data.toString();
	    }

	    let isFileList;

	    if (isObjectPayload) {
	      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
	        return toURLEncodedForm(data, this.formSerializer).toString();
	      }

	      if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
	        const _FormData = this.env && this.env.FormData;

	        return toFormData(
	          isFileList ? {'files[]': data} : data,
	          _FormData && new _FormData(),
	          this.formSerializer
	        );
	      }
	    }

	    if (isObjectPayload || hasJSONContentType ) {
	      headers.setContentType('application/json', false);
	      return stringifySafely(data);
	    }

	    return data;
	  }],

	  transformResponse: [function transformResponse(data) {
	    const transitional = this.transitional || defaults.transitional;
	    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
	    const JSONRequested = this.responseType === 'json';

	    if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
	      return data;
	    }

	    if (data && utils$1.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
	      const silentJSONParsing = transitional && transitional.silentJSONParsing;
	      const strictJSONParsing = !silentJSONParsing && JSONRequested;

	      try {
	        return JSON.parse(data);
	      } catch (e) {
	        if (strictJSONParsing) {
	          if (e.name === 'SyntaxError') {
	            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
	          }
	          throw e;
	        }
	      }
	    }

	    return data;
	  }],

	  /**
	   * A timeout in milliseconds to abort a request. If set to 0 (default) a
	   * timeout is not created.
	   */
	  timeout: 0,

	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',

	  maxContentLength: -1,
	  maxBodyLength: -1,

	  env: {
	    FormData: platform.classes.FormData,
	    Blob: platform.classes.Blob
	  },

	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  },

	  headers: {
	    common: {
	      'Accept': 'application/json, text/plain, */*',
	      'Content-Type': undefined
	    }
	  }
	};

	utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
	  defaults.headers[method] = {};
	});

	var defaults$1 = defaults;

	// RawAxiosHeaders whose duplicates are ignored by node
	// c.f. https://nodejs.org/api/http.html#http_message_headers
	const ignoreDuplicateOf = utils$1.toObjectSet([
	  'age', 'authorization', 'content-length', 'content-type', 'etag',
	  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
	  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
	  'referer', 'retry-after', 'user-agent'
	]);

	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} rawHeaders Headers needing to be parsed
	 *
	 * @returns {Object} Headers parsed into an object
	 */
	var parseHeaders = rawHeaders => {
	  const parsed = {};
	  let key;
	  let val;
	  let i;

	  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
	    i = line.indexOf(':');
	    key = line.substring(0, i).trim().toLowerCase();
	    val = line.substring(i + 1).trim();

	    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
	      return;
	    }

	    if (key === 'set-cookie') {
	      if (parsed[key]) {
	        parsed[key].push(val);
	      } else {
	        parsed[key] = [val];
	      }
	    } else {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });

	  return parsed;
	};

	const $internals = Symbol('internals');

	function normalizeHeader(header) {
	  return header && String(header).trim().toLowerCase();
	}

	function normalizeValue(value) {
	  if (value === false || value == null) {
	    return value;
	  }

	  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
	}

	function parseTokens(str) {
	  const tokens = Object.create(null);
	  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
	  let match;

	  while ((match = tokensRE.exec(str))) {
	    tokens[match[1]] = match[2];
	  }

	  return tokens;
	}

	const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

	function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
	  if (utils$1.isFunction(filter)) {
	    return filter.call(this, value, header);
	  }

	  if (isHeaderNameFilter) {
	    value = header;
	  }

	  if (!utils$1.isString(value)) return;

	  if (utils$1.isString(filter)) {
	    return value.indexOf(filter) !== -1;
	  }

	  if (utils$1.isRegExp(filter)) {
	    return filter.test(value);
	  }
	}

	function formatHeader(header) {
	  return header.trim()
	    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
	      return char.toUpperCase() + str;
	    });
	}

	function buildAccessors(obj, header) {
	  const accessorName = utils$1.toCamelCase(' ' + header);

	  ['get', 'set', 'has'].forEach(methodName => {
	    Object.defineProperty(obj, methodName + accessorName, {
	      value: function(arg1, arg2, arg3) {
	        return this[methodName].call(this, header, arg1, arg2, arg3);
	      },
	      configurable: true
	    });
	  });
	}

	class AxiosHeaders {
	  constructor(headers) {
	    headers && this.set(headers);
	  }

	  set(header, valueOrRewrite, rewrite) {
	    const self = this;

	    function setHeader(_value, _header, _rewrite) {
	      const lHeader = normalizeHeader(_header);

	      if (!lHeader) {
	        throw new Error('header name must be a non-empty string');
	      }

	      const key = utils$1.findKey(self, lHeader);

	      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
	        self[key || _header] = normalizeValue(_value);
	      }
	    }

	    const setHeaders = (headers, _rewrite) =>
	      utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

	    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
	      setHeaders(header, valueOrRewrite);
	    } else if(utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
	      setHeaders(parseHeaders(header), valueOrRewrite);
	    } else if (utils$1.isHeaders(header)) {
	      for (const [key, value] of header.entries()) {
	        setHeader(value, key, rewrite);
	      }
	    } else {
	      header != null && setHeader(valueOrRewrite, header, rewrite);
	    }

	    return this;
	  }

	  get(header, parser) {
	    header = normalizeHeader(header);

	    if (header) {
	      const key = utils$1.findKey(this, header);

	      if (key) {
	        const value = this[key];

	        if (!parser) {
	          return value;
	        }

	        if (parser === true) {
	          return parseTokens(value);
	        }

	        if (utils$1.isFunction(parser)) {
	          return parser.call(this, value, key);
	        }

	        if (utils$1.isRegExp(parser)) {
	          return parser.exec(value);
	        }

	        throw new TypeError('parser must be boolean|regexp|function');
	      }
	    }
	  }

	  has(header, matcher) {
	    header = normalizeHeader(header);

	    if (header) {
	      const key = utils$1.findKey(this, header);

	      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
	    }

	    return false;
	  }

	  delete(header, matcher) {
	    const self = this;
	    let deleted = false;

	    function deleteHeader(_header) {
	      _header = normalizeHeader(_header);

	      if (_header) {
	        const key = utils$1.findKey(self, _header);

	        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
	          delete self[key];

	          deleted = true;
	        }
	      }
	    }

	    if (utils$1.isArray(header)) {
	      header.forEach(deleteHeader);
	    } else {
	      deleteHeader(header);
	    }

	    return deleted;
	  }

	  clear(matcher) {
	    const keys = Object.keys(this);
	    let i = keys.length;
	    let deleted = false;

	    while (i--) {
	      const key = keys[i];
	      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
	        delete this[key];
	        deleted = true;
	      }
	    }

	    return deleted;
	  }

	  normalize(format) {
	    const self = this;
	    const headers = {};

	    utils$1.forEach(this, (value, header) => {
	      const key = utils$1.findKey(headers, header);

	      if (key) {
	        self[key] = normalizeValue(value);
	        delete self[header];
	        return;
	      }

	      const normalized = format ? formatHeader(header) : String(header).trim();

	      if (normalized !== header) {
	        delete self[header];
	      }

	      self[normalized] = normalizeValue(value);

	      headers[normalized] = true;
	    });

	    return this;
	  }

	  concat(...targets) {
	    return this.constructor.concat(this, ...targets);
	  }

	  toJSON(asStrings) {
	    const obj = Object.create(null);

	    utils$1.forEach(this, (value, header) => {
	      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
	    });

	    return obj;
	  }

	  [Symbol.iterator]() {
	    return Object.entries(this.toJSON())[Symbol.iterator]();
	  }

	  toString() {
	    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
	  }

	  get [Symbol.toStringTag]() {
	    return 'AxiosHeaders';
	  }

	  static from(thing) {
	    return thing instanceof this ? thing : new this(thing);
	  }

	  static concat(first, ...targets) {
	    const computed = new this(first);

	    targets.forEach((target) => computed.set(target));

	    return computed;
	  }

	  static accessor(header) {
	    const internals = this[$internals] = (this[$internals] = {
	      accessors: {}
	    });

	    const accessors = internals.accessors;
	    const prototype = this.prototype;

	    function defineAccessor(_header) {
	      const lHeader = normalizeHeader(_header);

	      if (!accessors[lHeader]) {
	        buildAccessors(prototype, _header);
	        accessors[lHeader] = true;
	      }
	    }

	    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

	    return this;
	  }
	}

	AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

	// reserved names hotfix
	utils$1.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
	  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
	  return {
	    get: () => value,
	    set(headerValue) {
	      this[mapped] = headerValue;
	    }
	  }
	});

	utils$1.freezeMethods(AxiosHeaders);

	var AxiosHeaders$1 = AxiosHeaders;

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Array|Function} fns A single function or Array of functions
	 * @param {?Object} response The response object
	 *
	 * @returns {*} The resulting transformed data
	 */
	function transformData(fns, response) {
	  const config = this || defaults$1;
	  const context = response || config;
	  const headers = AxiosHeaders$1.from(context.headers);
	  let data = context.data;

	  utils$1.forEach(fns, function transform(fn) {
	    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
	  });

	  headers.normalize();

	  return data;
	}

	function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	}

	/**
	 * A `CanceledError` is an object that is thrown when an operation is canceled.
	 *
	 * @param {string=} message The message.
	 * @param {Object=} config The config.
	 * @param {Object=} request The request.
	 *
	 * @returns {CanceledError} The created error.
	 */
	function CanceledError(message, config, request) {
	  // eslint-disable-next-line no-eq-null,eqeqeq
	  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
	  this.name = 'CanceledError';
	}

	utils$1.inherits(CanceledError, AxiosError, {
	  __CANCEL__: true
	});

	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 *
	 * @returns {object} The response.
	 */
	function settle(resolve, reject, response) {
	  const validateStatus = response.config.validateStatus;
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(new AxiosError(
	      'Request failed with status code ' + response.status,
	      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
	      response.config,
	      response.request,
	      response
	    ));
	  }
	}

	function parseProtocol(url) {
	  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
	  return match && match[1] || '';
	}

	/**
	 * Calculate data maxRate
	 * @param {Number} [samplesCount= 10]
	 * @param {Number} [min= 1000]
	 * @returns {Function}
	 */
	function speedometer(samplesCount, min) {
	  samplesCount = samplesCount || 10;
	  const bytes = new Array(samplesCount);
	  const timestamps = new Array(samplesCount);
	  let head = 0;
	  let tail = 0;
	  let firstSampleTS;

	  min = min !== undefined ? min : 1000;

	  return function push(chunkLength) {
	    const now = Date.now();

	    const startedAt = timestamps[tail];

	    if (!firstSampleTS) {
	      firstSampleTS = now;
	    }

	    bytes[head] = chunkLength;
	    timestamps[head] = now;

	    let i = tail;
	    let bytesCount = 0;

	    while (i !== head) {
	      bytesCount += bytes[i++];
	      i = i % samplesCount;
	    }

	    head = (head + 1) % samplesCount;

	    if (head === tail) {
	      tail = (tail + 1) % samplesCount;
	    }

	    if (now - firstSampleTS < min) {
	      return;
	    }

	    const passed = startedAt && now - startedAt;

	    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
	  };
	}

	/**
	 * Throttle decorator
	 * @param {Function} fn
	 * @param {Number} freq
	 * @return {Function}
	 */
	function throttle(fn, freq) {
	  let timestamp = 0;
	  let threshold = 1000 / freq;
	  let lastArgs;
	  let timer;

	  const invoke = (args, now = Date.now()) => {
	    timestamp = now;
	    lastArgs = null;
	    if (timer) {
	      clearTimeout(timer);
	      timer = null;
	    }
	    fn.apply(null, args);
	  };

	  const throttled = (...args) => {
	    const now = Date.now();
	    const passed = now - timestamp;
	    if ( passed >= threshold) {
	      invoke(args, now);
	    } else {
	      lastArgs = args;
	      if (!timer) {
	        timer = setTimeout(() => {
	          timer = null;
	          invoke(lastArgs);
	        }, threshold - passed);
	      }
	    }
	  };

	  const flush = () => lastArgs && invoke(lastArgs);

	  return [throttled, flush];
	}

	const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
	  let bytesNotified = 0;
	  const _speedometer = speedometer(50, 250);

	  return throttle(e => {
	    const loaded = e.loaded;
	    const total = e.lengthComputable ? e.total : undefined;
	    const progressBytes = loaded - bytesNotified;
	    const rate = _speedometer(progressBytes);
	    const inRange = loaded <= total;

	    bytesNotified = loaded;

	    const data = {
	      loaded,
	      total,
	      progress: total ? (loaded / total) : undefined,
	      bytes: progressBytes,
	      rate: rate ? rate : undefined,
	      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
	      event: e,
	      lengthComputable: total != null,
	      [isDownloadStream ? 'download' : 'upload']: true
	    };

	    listener(data);
	  }, freq);
	};

	const progressEventDecorator = (total, throttled) => {
	  const lengthComputable = total != null;

	  return [(loaded) => throttled[0]({
	    lengthComputable,
	    total,
	    loaded
	  }), throttled[1]];
	};

	const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));

	var isURLSameOrigin = platform.hasStandardBrowserEnv ?

	// Standard browser envs have full support of the APIs needed to test
	// whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    const msie = /(msie|trident)/i.test(navigator.userAgent);
	    const urlParsingNode = document.createElement('a');
	    let originURL;

	    /**
	    * Parse a URL to discover its components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      let href = url;

	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }

	      urlParsingNode.setAttribute('href', href);

	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	          urlParsingNode.pathname :
	          '/' + urlParsingNode.pathname
	      };
	    }

	    originURL = resolveURL(window.location.href);

	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      const parsed = (utils$1.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	          parsed.host === originURL.host);
	    };
	  })() :

	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })();

	var cookies = platform.hasStandardBrowserEnv ?

	  // Standard browser envs support document.cookie
	  {
	    write(name, value, expires, path, domain, secure) {
	      const cookie = [name + '=' + encodeURIComponent(value)];

	      utils$1.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

	      utils$1.isString(path) && cookie.push('path=' + path);

	      utils$1.isString(domain) && cookie.push('domain=' + domain);

	      secure === true && cookie.push('secure');

	      document.cookie = cookie.join('; ');
	    },

	    read(name) {
	      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	      return (match ? decodeURIComponent(match[3]) : null);
	    },

	    remove(name) {
	      this.write(name, '', Date.now() - 86400000);
	    }
	  }

	  :

	  // Non-standard browser env (web workers, react-native) lack needed support.
	  {
	    write() {},
	    read() {
	      return null;
	    },
	    remove() {}
	  };

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 *
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
	}

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 *
	 * @returns {string} The combined URL
	 */
	function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	}

	/**
	 * Creates a new URL by combining the baseURL with the requestedURL,
	 * only when the requestedURL is not already an absolute URL.
	 * If the requestURL is absolute, this function returns the requestedURL untouched.
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} requestedURL Absolute or relative URL to combine
	 *
	 * @returns {string} The combined full path
	 */
	function buildFullPath(baseURL, requestedURL) {
	  if (baseURL && !isAbsoluteURL(requestedURL)) {
	    return combineURLs(baseURL, requestedURL);
	  }
	  return requestedURL;
	}

	const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

	/**
	 * Config-specific merge-function which creates a new config-object
	 * by merging two configuration objects together.
	 *
	 * @param {Object} config1
	 * @param {Object} config2
	 *
	 * @returns {Object} New object resulting from merging config2 to config1
	 */
	function mergeConfig(config1, config2) {
	  // eslint-disable-next-line no-param-reassign
	  config2 = config2 || {};
	  const config = {};

	  function getMergedValue(target, source, caseless) {
	    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
	      return utils$1.merge.call({caseless}, target, source);
	    } else if (utils$1.isPlainObject(source)) {
	      return utils$1.merge({}, source);
	    } else if (utils$1.isArray(source)) {
	      return source.slice();
	    }
	    return source;
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDeepProperties(a, b, caseless) {
	    if (!utils$1.isUndefined(b)) {
	      return getMergedValue(a, b, caseless);
	    } else if (!utils$1.isUndefined(a)) {
	      return getMergedValue(undefined, a, caseless);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function valueFromConfig2(a, b) {
	    if (!utils$1.isUndefined(b)) {
	      return getMergedValue(undefined, b);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function defaultToConfig2(a, b) {
	    if (!utils$1.isUndefined(b)) {
	      return getMergedValue(undefined, b);
	    } else if (!utils$1.isUndefined(a)) {
	      return getMergedValue(undefined, a);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDirectKeys(a, b, prop) {
	    if (prop in config2) {
	      return getMergedValue(a, b);
	    } else if (prop in config1) {
	      return getMergedValue(undefined, a);
	    }
	  }

	  const mergeMap = {
	    url: valueFromConfig2,
	    method: valueFromConfig2,
	    data: valueFromConfig2,
	    baseURL: defaultToConfig2,
	    transformRequest: defaultToConfig2,
	    transformResponse: defaultToConfig2,
	    paramsSerializer: defaultToConfig2,
	    timeout: defaultToConfig2,
	    timeoutMessage: defaultToConfig2,
	    withCredentials: defaultToConfig2,
	    withXSRFToken: defaultToConfig2,
	    adapter: defaultToConfig2,
	    responseType: defaultToConfig2,
	    xsrfCookieName: defaultToConfig2,
	    xsrfHeaderName: defaultToConfig2,
	    onUploadProgress: defaultToConfig2,
	    onDownloadProgress: defaultToConfig2,
	    decompress: defaultToConfig2,
	    maxContentLength: defaultToConfig2,
	    maxBodyLength: defaultToConfig2,
	    beforeRedirect: defaultToConfig2,
	    transport: defaultToConfig2,
	    httpAgent: defaultToConfig2,
	    httpsAgent: defaultToConfig2,
	    cancelToken: defaultToConfig2,
	    socketPath: defaultToConfig2,
	    responseEncoding: defaultToConfig2,
	    validateStatus: mergeDirectKeys,
	    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
	  };

	  utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
	    const merge = mergeMap[prop] || mergeDeepProperties;
	    const configValue = merge(config1[prop], config2[prop], prop);
	    (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
	  });

	  return config;
	}

	var resolveConfig = (config) => {
	  const newConfig = mergeConfig({}, config);

	  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

	  newConfig.headers = headers = AxiosHeaders$1.from(headers);

	  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);

	  // HTTP basic authentication
	  if (auth) {
	    headers.set('Authorization', 'Basic ' +
	      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
	    );
	  }

	  let contentType;

	  if (utils$1.isFormData(data)) {
	    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
	      headers.setContentType(undefined); // Let the browser set it
	    } else if ((contentType = headers.getContentType()) !== false) {
	      // fix semicolon duplication issue for ReactNative FormData implementation
	      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
	      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
	    }
	  }

	  // Add xsrf header
	  // This is only done if running in a standard browser environment.
	  // Specifically not if we're in a web worker, or react-native.

	  if (platform.hasStandardBrowserEnv) {
	    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

	    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
	      // Add xsrf header
	      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

	      if (xsrfValue) {
	        headers.set(xsrfHeaderName, xsrfValue);
	      }
	    }
	  }

	  return newConfig;
	};

	const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

	var xhrAdapter = isXHRAdapterSupported && function (config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    const _config = resolveConfig(config);
	    let requestData = _config.data;
	    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
	    let {responseType, onUploadProgress, onDownloadProgress} = _config;
	    let onCanceled;
	    let uploadThrottled, downloadThrottled;
	    let flushUpload, flushDownload;

	    function done() {
	      flushUpload && flushUpload(); // flush events
	      flushDownload && flushDownload(); // flush events

	      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

	      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
	    }

	    let request = new XMLHttpRequest();

	    request.open(_config.method.toUpperCase(), _config.url, true);

	    // Set the request timeout in MS
	    request.timeout = _config.timeout;

	    function onloadend() {
	      if (!request) {
	        return;
	      }
	      // Prepare the response
	      const responseHeaders = AxiosHeaders$1.from(
	        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
	      );
	      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
	        request.responseText : request.response;
	      const response = {
	        data: responseData,
	        status: request.status,
	        statusText: request.statusText,
	        headers: responseHeaders,
	        config,
	        request
	      };

	      settle(function _resolve(value) {
	        resolve(value);
	        done();
	      }, function _reject(err) {
	        reject(err);
	        done();
	      }, response);

	      // Clean up request
	      request = null;
	    }

	    if ('onloadend' in request) {
	      // Use onloadend if available
	      request.onloadend = onloadend;
	    } else {
	      // Listen for ready state to emulate onloadend
	      request.onreadystatechange = function handleLoad() {
	        if (!request || request.readyState !== 4) {
	          return;
	        }

	        // The request errored out and we didn't get a response, this will be
	        // handled by onerror instead
	        // With one exception: request that using file: protocol, most browsers
	        // will return status as 0 even though it's a successful request
	        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	          return;
	        }
	        // readystate handler is calling before onerror or ontimeout handlers,
	        // so we should call onloadend on the next 'tick'
	        setTimeout(onloadend);
	      };
	    }

	    // Handle browser request cancellation (as opposed to a manual cancellation)
	    request.onabort = function handleAbort() {
	      if (!request) {
	        return;
	      }

	      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
	      const transitional = _config.transitional || transitionalDefaults;
	      if (_config.timeoutErrorMessage) {
	        timeoutErrorMessage = _config.timeoutErrorMessage;
	      }
	      reject(new AxiosError(
	        timeoutErrorMessage,
	        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
	        config,
	        request));

	      // Clean up request
	      request = null;
	    };

	    // Remove Content-Type if data is undefined
	    requestData === undefined && requestHeaders.setContentType(null);

	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
	        request.setRequestHeader(key, val);
	      });
	    }

	    // Add withCredentials to request if needed
	    if (!utils$1.isUndefined(_config.withCredentials)) {
	      request.withCredentials = !!_config.withCredentials;
	    }

	    // Add responseType to request if needed
	    if (responseType && responseType !== 'json') {
	      request.responseType = _config.responseType;
	    }

	    // Handle progress if needed
	    if (onDownloadProgress) {
	      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
	      request.addEventListener('progress', downloadThrottled);
	    }

	    // Not all browsers support upload events
	    if (onUploadProgress && request.upload) {
	      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

	      request.upload.addEventListener('progress', uploadThrottled);

	      request.upload.addEventListener('loadend', flushUpload);
	    }

	    if (_config.cancelToken || _config.signal) {
	      // Handle cancellation
	      // eslint-disable-next-line func-names
	      onCanceled = cancel => {
	        if (!request) {
	          return;
	        }
	        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
	        request.abort();
	        request = null;
	      };

	      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
	      if (_config.signal) {
	        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
	      }
	    }

	    const protocol = parseProtocol(_config.url);

	    if (protocol && platform.protocols.indexOf(protocol) === -1) {
	      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
	      return;
	    }


	    // Send the request
	    request.send(requestData || null);
	  });
	};

	const composeSignals = (signals, timeout) => {
	  let controller = new AbortController();

	  let aborted;

	  const onabort = function (cancel) {
	    if (!aborted) {
	      aborted = true;
	      unsubscribe();
	      const err = cancel instanceof Error ? cancel : this.reason;
	      controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
	    }
	  };

	  let timer = timeout && setTimeout(() => {
	    onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
	  }, timeout);

	  const unsubscribe = () => {
	    if (signals) {
	      timer && clearTimeout(timer);
	      timer = null;
	      signals.forEach(signal => {
	        signal &&
	        (signal.removeEventListener ? signal.removeEventListener('abort', onabort) : signal.unsubscribe(onabort));
	      });
	      signals = null;
	    }
	  };

	  signals.forEach((signal) => signal && signal.addEventListener && signal.addEventListener('abort', onabort));

	  const {signal} = controller;

	  signal.unsubscribe = unsubscribe;

	  return [signal, () => {
	    timer && clearTimeout(timer);
	    timer = null;
	  }];
	};

	var composeSignals$1 = composeSignals;

	const streamChunk = function* (chunk, chunkSize) {
	  let len = chunk.byteLength;

	  if (len < chunkSize) {
	    yield chunk;
	    return;
	  }

	  let pos = 0;
	  let end;

	  while (pos < len) {
	    end = pos + chunkSize;
	    yield chunk.slice(pos, end);
	    pos = end;
	  }
	};

	const readBytes = async function* (iterable, chunkSize, encode) {
	  for await (const chunk of iterable) {
	    yield* streamChunk(ArrayBuffer.isView(chunk) ? chunk : (await encode(String(chunk))), chunkSize);
	  }
	};

	const trackStream = (stream, chunkSize, onProgress, onFinish, encode) => {
	  const iterator = readBytes(stream, chunkSize, encode);

	  let bytes = 0;
	  let done;
	  let _onFinish = (e) => {
	    if (!done) {
	      done = true;
	      onFinish && onFinish(e);
	    }
	  };

	  return new ReadableStream({
	    async pull(controller) {
	      try {
	        const {done, value} = await iterator.next();

	        if (done) {
	         _onFinish();
	          controller.close();
	          return;
	        }

	        let len = value.byteLength;
	        if (onProgress) {
	          let loadedBytes = bytes += len;
	          onProgress(loadedBytes);
	        }
	        controller.enqueue(new Uint8Array(value));
	      } catch (err) {
	        _onFinish(err);
	        throw err;
	      }
	    },
	    cancel(reason) {
	      _onFinish(reason);
	      return iterator.return();
	    }
	  }, {
	    highWaterMark: 2
	  })
	};

	const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
	const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

	// used only inside the fetch adapter
	const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
	    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
	    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
	);

	const test = (fn, ...args) => {
	  try {
	    return !!fn(...args);
	  } catch (e) {
	    return false
	  }
	};

	const supportsRequestStream = isReadableStreamSupported && test(() => {
	  let duplexAccessed = false;

	  const hasContentType = new Request(platform.origin, {
	    body: new ReadableStream(),
	    method: 'POST',
	    get duplex() {
	      duplexAccessed = true;
	      return 'half';
	    },
	  }).headers.has('Content-Type');

	  return duplexAccessed && !hasContentType;
	});

	const DEFAULT_CHUNK_SIZE = 64 * 1024;

	const supportsResponseStream = isReadableStreamSupported &&
	  test(() => utils$1.isReadableStream(new Response('').body));


	const resolvers = {
	  stream: supportsResponseStream && ((res) => res.body)
	};

	isFetchSupported && (((res) => {
	  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
	    !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res) => res[type]() :
	      (_, config) => {
	        throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
	      });
	  });
	})(new Response));

	const getBodyLength = async (body) => {
	  if (body == null) {
	    return 0;
	  }

	  if(utils$1.isBlob(body)) {
	    return body.size;
	  }

	  if(utils$1.isSpecCompliantForm(body)) {
	    return (await new Request(body).arrayBuffer()).byteLength;
	  }

	  if(utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
	    return body.byteLength;
	  }

	  if(utils$1.isURLSearchParams(body)) {
	    body = body + '';
	  }

	  if(utils$1.isString(body)) {
	    return (await encodeText(body)).byteLength;
	  }
	};

	const resolveBodyLength = async (headers, body) => {
	  const length = utils$1.toFiniteNumber(headers.getContentLength());

	  return length == null ? getBodyLength(body) : length;
	};

	var fetchAdapter = isFetchSupported && (async (config) => {
	  let {
	    url,
	    method,
	    data,
	    signal,
	    cancelToken,
	    timeout,
	    onDownloadProgress,
	    onUploadProgress,
	    responseType,
	    headers,
	    withCredentials = 'same-origin',
	    fetchOptions
	  } = resolveConfig(config);

	  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

	  let [composedSignal, stopTimeout] = (signal || cancelToken || timeout) ?
	    composeSignals$1([signal, cancelToken], timeout) : [];

	  let finished, request;

	  const onFinish = () => {
	    !finished && setTimeout(() => {
	      composedSignal && composedSignal.unsubscribe();
	    });

	    finished = true;
	  };

	  let requestContentLength;

	  try {
	    if (
	      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
	      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
	    ) {
	      let _request = new Request(url, {
	        method: 'POST',
	        body: data,
	        duplex: "half"
	      });

	      let contentTypeHeader;

	      if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
	        headers.setContentType(contentTypeHeader);
	      }

	      if (_request.body) {
	        const [onProgress, flush] = progressEventDecorator(
	          requestContentLength,
	          progressEventReducer(asyncDecorator(onUploadProgress))
	        );

	        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush, encodeText);
	      }
	    }

	    if (!utils$1.isString(withCredentials)) {
	      withCredentials = withCredentials ? 'include' : 'omit';
	    }

	    request = new Request(url, {
	      ...fetchOptions,
	      signal: composedSignal,
	      method: method.toUpperCase(),
	      headers: headers.normalize().toJSON(),
	      body: data,
	      duplex: "half",
	      credentials: withCredentials
	    });

	    let response = await fetch(request);

	    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

	    if (supportsResponseStream && (onDownloadProgress || isStreamResponse)) {
	      const options = {};

	      ['status', 'statusText', 'headers'].forEach(prop => {
	        options[prop] = response[prop];
	      });

	      const responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));

	      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
	        responseContentLength,
	        progressEventReducer(asyncDecorator(onDownloadProgress), true)
	      ) || [];

	      response = new Response(
	        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
	          flush && flush();
	          isStreamResponse && onFinish();
	        }, encodeText),
	        options
	      );
	    }

	    responseType = responseType || 'text';

	    let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || 'text'](response, config);

	    !isStreamResponse && onFinish();

	    stopTimeout && stopTimeout();

	    return await new Promise((resolve, reject) => {
	      settle(resolve, reject, {
	        data: responseData,
	        headers: AxiosHeaders$1.from(response.headers),
	        status: response.status,
	        statusText: response.statusText,
	        config,
	        request
	      });
	    })
	  } catch (err) {
	    onFinish();

	    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
	      throw Object.assign(
	        new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request),
	        {
	          cause: err.cause || err
	        }
	      )
	    }

	    throw AxiosError.from(err, err && err.code, config, request);
	  }
	});

	const knownAdapters = {
	  http: httpAdapter,
	  xhr: xhrAdapter,
	  fetch: fetchAdapter
	};

	utils$1.forEach(knownAdapters, (fn, value) => {
	  if (fn) {
	    try {
	      Object.defineProperty(fn, 'name', {value});
	    } catch (e) {
	      // eslint-disable-next-line no-empty
	    }
	    Object.defineProperty(fn, 'adapterName', {value});
	  }
	});

	const renderReason = (reason) => `- ${reason}`;

	const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;

	var adapters = {
	  getAdapter: (adapters) => {
	    adapters = utils$1.isArray(adapters) ? adapters : [adapters];

	    const {length} = adapters;
	    let nameOrAdapter;
	    let adapter;

	    const rejectedReasons = {};

	    for (let i = 0; i < length; i++) {
	      nameOrAdapter = adapters[i];
	      let id;

	      adapter = nameOrAdapter;

	      if (!isResolvedHandle(nameOrAdapter)) {
	        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

	        if (adapter === undefined) {
	          throw new AxiosError(`Unknown adapter '${id}'`);
	        }
	      }

	      if (adapter) {
	        break;
	      }

	      rejectedReasons[id || '#' + i] = adapter;
	    }

	    if (!adapter) {

	      const reasons = Object.entries(rejectedReasons)
	        .map(([id, state]) => `adapter ${id} ` +
	          (state === false ? 'is not supported by the environment' : 'is not available in the build')
	        );

	      let s = length ?
	        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
	        'as no adapter specified';

	      throw new AxiosError(
	        `There is no suitable adapter to dispatch the request ` + s,
	        'ERR_NOT_SUPPORT'
	      );
	    }

	    return adapter;
	  },
	  adapters: knownAdapters
	};

	/**
	 * Throws a `CanceledError` if cancellation has been requested.
	 *
	 * @param {Object} config The config that is to be used for the request
	 *
	 * @returns {void}
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }

	  if (config.signal && config.signal.aborted) {
	    throw new CanceledError(null, config);
	  }
	}

	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 *
	 * @returns {Promise} The Promise to be fulfilled
	 */
	function dispatchRequest(config) {
	  throwIfCancellationRequested(config);

	  config.headers = AxiosHeaders$1.from(config.headers);

	  // Transform request data
	  config.data = transformData.call(
	    config,
	    config.transformRequest
	  );

	  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
	    config.headers.setContentType('application/x-www-form-urlencoded', false);
	  }

	  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);

	    // Transform response data
	    response.data = transformData.call(
	      config,
	      config.transformResponse,
	      response
	    );

	    response.headers = AxiosHeaders$1.from(response.headers);

	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);

	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData.call(
	          config,
	          config.transformResponse,
	          reason.response
	        );
	        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
	      }
	    }

	    return Promise.reject(reason);
	  });
	}

	const VERSION = "1.7.4";

	const validators$1 = {};

	// eslint-disable-next-line func-names
	['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
	  validators$1[type] = function validator(thing) {
	    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
	  };
	});

	const deprecatedWarnings = {};

	/**
	 * Transitional option validator
	 *
	 * @param {function|boolean?} validator - set to false if the transitional option has been removed
	 * @param {string?} version - deprecated version / removed since version
	 * @param {string?} message - some message with additional info
	 *
	 * @returns {function}
	 */
	validators$1.transitional = function transitional(validator, version, message) {
	  function formatMessage(opt, desc) {
	    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
	  }

	  // eslint-disable-next-line func-names
	  return (value, opt, opts) => {
	    if (validator === false) {
	      throw new AxiosError(
	        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
	        AxiosError.ERR_DEPRECATED
	      );
	    }

	    if (version && !deprecatedWarnings[opt]) {
	      deprecatedWarnings[opt] = true;
	      // eslint-disable-next-line no-console
	      console.warn(
	        formatMessage(
	          opt,
	          ' has been deprecated since v' + version + ' and will be removed in the near future'
	        )
	      );
	    }

	    return validator ? validator(value, opt, opts) : true;
	  };
	};

	/**
	 * Assert object's properties type
	 *
	 * @param {object} options
	 * @param {object} schema
	 * @param {boolean?} allowUnknown
	 *
	 * @returns {object}
	 */

	function assertOptions(options, schema, allowUnknown) {
	  if (typeof options !== 'object') {
	    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
	  }
	  const keys = Object.keys(options);
	  let i = keys.length;
	  while (i-- > 0) {
	    const opt = keys[i];
	    const validator = schema[opt];
	    if (validator) {
	      const value = options[opt];
	      const result = value === undefined || validator(value, opt, options);
	      if (result !== true) {
	        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
	      }
	      continue;
	    }
	    if (allowUnknown !== true) {
	      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
	    }
	  }
	}

	var validator = {
	  assertOptions,
	  validators: validators$1
	};

	const validators = validator.validators;

	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 *
	 * @return {Axios} A new instance of Axios
	 */
	class Axios {
	  constructor(instanceConfig) {
	    this.defaults = instanceConfig;
	    this.interceptors = {
	      request: new InterceptorManager$1(),
	      response: new InterceptorManager$1()
	    };
	  }

	  /**
	   * Dispatch a request
	   *
	   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
	   * @param {?Object} config
	   *
	   * @returns {Promise} The Promise to be fulfilled
	   */
	  async request(configOrUrl, config) {
	    try {
	      return await this._request(configOrUrl, config);
	    } catch (err) {
	      if (err instanceof Error) {
	        let dummy;

	        Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : (dummy = new Error());

	        // slice off the Error: ... line
	        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
	        try {
	          if (!err.stack) {
	            err.stack = stack;
	            // match without the 2 top stack lines
	          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
	            err.stack += '\n' + stack;
	          }
	        } catch (e) {
	          // ignore the case where "stack" is an un-writable property
	        }
	      }

	      throw err;
	    }
	  }

	  _request(configOrUrl, config) {
	    /*eslint no-param-reassign:0*/
	    // Allow for axios('example/url'[, config]) a la fetch API
	    if (typeof configOrUrl === 'string') {
	      config = config || {};
	      config.url = configOrUrl;
	    } else {
	      config = configOrUrl || {};
	    }

	    config = mergeConfig(this.defaults, config);

	    const {transitional, paramsSerializer, headers} = config;

	    if (transitional !== undefined) {
	      validator.assertOptions(transitional, {
	        silentJSONParsing: validators.transitional(validators.boolean),
	        forcedJSONParsing: validators.transitional(validators.boolean),
	        clarifyTimeoutError: validators.transitional(validators.boolean)
	      }, false);
	    }

	    if (paramsSerializer != null) {
	      if (utils$1.isFunction(paramsSerializer)) {
	        config.paramsSerializer = {
	          serialize: paramsSerializer
	        };
	      } else {
	        validator.assertOptions(paramsSerializer, {
	          encode: validators.function,
	          serialize: validators.function
	        }, true);
	      }
	    }

	    // Set config.method
	    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

	    // Flatten headers
	    let contextHeaders = headers && utils$1.merge(
	      headers.common,
	      headers[config.method]
	    );

	    headers && utils$1.forEach(
	      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	      (method) => {
	        delete headers[method];
	      }
	    );

	    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

	    // filter out skipped interceptors
	    const requestInterceptorChain = [];
	    let synchronousRequestInterceptors = true;
	    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
	        return;
	      }

	      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

	      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
	    });

	    const responseInterceptorChain = [];
	    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
	    });

	    let promise;
	    let i = 0;
	    let len;

	    if (!synchronousRequestInterceptors) {
	      const chain = [dispatchRequest.bind(this), undefined];
	      chain.unshift.apply(chain, requestInterceptorChain);
	      chain.push.apply(chain, responseInterceptorChain);
	      len = chain.length;

	      promise = Promise.resolve(config);

	      while (i < len) {
	        promise = promise.then(chain[i++], chain[i++]);
	      }

	      return promise;
	    }

	    len = requestInterceptorChain.length;

	    let newConfig = config;

	    i = 0;

	    while (i < len) {
	      const onFulfilled = requestInterceptorChain[i++];
	      const onRejected = requestInterceptorChain[i++];
	      try {
	        newConfig = onFulfilled(newConfig);
	      } catch (error) {
	        onRejected.call(this, error);
	        break;
	      }
	    }

	    try {
	      promise = dispatchRequest.call(this, newConfig);
	    } catch (error) {
	      return Promise.reject(error);
	    }

	    i = 0;
	    len = responseInterceptorChain.length;

	    while (i < len) {
	      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
	    }

	    return promise;
	  }

	  getUri(config) {
	    config = mergeConfig(this.defaults, config);
	    const fullPath = buildFullPath(config.baseURL, config.url);
	    return buildURL(fullPath, config.params, config.paramsSerializer);
	  }
	}

	// Provide aliases for supported request methods
	utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(mergeConfig(config || {}, {
	      method,
	      url,
	      data: (config || {}).data
	    }));
	  };
	});

	utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/

	  function generateHTTPMethod(isForm) {
	    return function httpMethod(url, data, config) {
	      return this.request(mergeConfig(config || {}, {
	        method,
	        headers: isForm ? {
	          'Content-Type': 'multipart/form-data'
	        } : {},
	        url,
	        data
	      }));
	    };
	  }

	  Axios.prototype[method] = generateHTTPMethod();

	  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
	});

	var Axios$1 = Axios;

	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @param {Function} executor The executor function.
	 *
	 * @returns {CancelToken}
	 */
	class CancelToken {
	  constructor(executor) {
	    if (typeof executor !== 'function') {
	      throw new TypeError('executor must be a function.');
	    }

	    let resolvePromise;

	    this.promise = new Promise(function promiseExecutor(resolve) {
	      resolvePromise = resolve;
	    });

	    const token = this;

	    // eslint-disable-next-line func-names
	    this.promise.then(cancel => {
	      if (!token._listeners) return;

	      let i = token._listeners.length;

	      while (i-- > 0) {
	        token._listeners[i](cancel);
	      }
	      token._listeners = null;
	    });

	    // eslint-disable-next-line func-names
	    this.promise.then = onfulfilled => {
	      let _resolve;
	      // eslint-disable-next-line func-names
	      const promise = new Promise(resolve => {
	        token.subscribe(resolve);
	        _resolve = resolve;
	      }).then(onfulfilled);

	      promise.cancel = function reject() {
	        token.unsubscribe(_resolve);
	      };

	      return promise;
	    };

	    executor(function cancel(message, config, request) {
	      if (token.reason) {
	        // Cancellation has already been requested
	        return;
	      }

	      token.reason = new CanceledError(message, config, request);
	      resolvePromise(token.reason);
	    });
	  }

	  /**
	   * Throws a `CanceledError` if cancellation has been requested.
	   */
	  throwIfRequested() {
	    if (this.reason) {
	      throw this.reason;
	    }
	  }

	  /**
	   * Subscribe to the cancel signal
	   */

	  subscribe(listener) {
	    if (this.reason) {
	      listener(this.reason);
	      return;
	    }

	    if (this._listeners) {
	      this._listeners.push(listener);
	    } else {
	      this._listeners = [listener];
	    }
	  }

	  /**
	   * Unsubscribe from the cancel signal
	   */

	  unsubscribe(listener) {
	    if (!this._listeners) {
	      return;
	    }
	    const index = this._listeners.indexOf(listener);
	    if (index !== -1) {
	      this._listeners.splice(index, 1);
	    }
	  }

	  /**
	   * Returns an object that contains a new `CancelToken` and a function that, when called,
	   * cancels the `CancelToken`.
	   */
	  static source() {
	    let cancel;
	    const token = new CancelToken(function executor(c) {
	      cancel = c;
	    });
	    return {
	      token,
	      cancel
	    };
	  }
	}

	var CancelToken$1 = CancelToken;

	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 *
	 * @returns {Function}
	 */
	function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	}

	/**
	 * Determines whether the payload is an error thrown by Axios
	 *
	 * @param {*} payload The value to test
	 *
	 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
	 */
	function isAxiosError(payload) {
	  return utils$1.isObject(payload) && (payload.isAxiosError === true);
	}

	const HttpStatusCode = {
	  Continue: 100,
	  SwitchingProtocols: 101,
	  Processing: 102,
	  EarlyHints: 103,
	  Ok: 200,
	  Created: 201,
	  Accepted: 202,
	  NonAuthoritativeInformation: 203,
	  NoContent: 204,
	  ResetContent: 205,
	  PartialContent: 206,
	  MultiStatus: 207,
	  AlreadyReported: 208,
	  ImUsed: 226,
	  MultipleChoices: 300,
	  MovedPermanently: 301,
	  Found: 302,
	  SeeOther: 303,
	  NotModified: 304,
	  UseProxy: 305,
	  Unused: 306,
	  TemporaryRedirect: 307,
	  PermanentRedirect: 308,
	  BadRequest: 400,
	  Unauthorized: 401,
	  PaymentRequired: 402,
	  Forbidden: 403,
	  NotFound: 404,
	  MethodNotAllowed: 405,
	  NotAcceptable: 406,
	  ProxyAuthenticationRequired: 407,
	  RequestTimeout: 408,
	  Conflict: 409,
	  Gone: 410,
	  LengthRequired: 411,
	  PreconditionFailed: 412,
	  PayloadTooLarge: 413,
	  UriTooLong: 414,
	  UnsupportedMediaType: 415,
	  RangeNotSatisfiable: 416,
	  ExpectationFailed: 417,
	  ImATeapot: 418,
	  MisdirectedRequest: 421,
	  UnprocessableEntity: 422,
	  Locked: 423,
	  FailedDependency: 424,
	  TooEarly: 425,
	  UpgradeRequired: 426,
	  PreconditionRequired: 428,
	  TooManyRequests: 429,
	  RequestHeaderFieldsTooLarge: 431,
	  UnavailableForLegalReasons: 451,
	  InternalServerError: 500,
	  NotImplemented: 501,
	  BadGateway: 502,
	  ServiceUnavailable: 503,
	  GatewayTimeout: 504,
	  HttpVersionNotSupported: 505,
	  VariantAlsoNegotiates: 506,
	  InsufficientStorage: 507,
	  LoopDetected: 508,
	  NotExtended: 510,
	  NetworkAuthenticationRequired: 511,
	};

	Object.entries(HttpStatusCode).forEach(([key, value]) => {
	  HttpStatusCode[value] = key;
	});

	var HttpStatusCode$1 = HttpStatusCode;

	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 *
	 * @returns {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  const context = new Axios$1(defaultConfig);
	  const instance = bind(Axios$1.prototype.request, context);

	  // Copy axios.prototype to instance
	  utils$1.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

	  // Copy context to instance
	  utils$1.extend(instance, context, null, {allOwnKeys: true});

	  // Factory for creating new instances
	  instance.create = function create(instanceConfig) {
	    return createInstance(mergeConfig(defaultConfig, instanceConfig));
	  };

	  return instance;
	}

	// Create the default instance to be exported
	const axios = createInstance(defaults$1);

	// Expose Axios class to allow class inheritance
	axios.Axios = Axios$1;

	// Expose Cancel & CancelToken
	axios.CanceledError = CanceledError;
	axios.CancelToken = CancelToken$1;
	axios.isCancel = isCancel;
	axios.VERSION = VERSION;
	axios.toFormData = toFormData;

	// Expose AxiosError class
	axios.AxiosError = AxiosError;

	// alias for CanceledError for backward compatibility
	axios.Cancel = axios.CanceledError;

	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};

	axios.spread = spread;

	// Expose isAxiosError
	axios.isAxiosError = isAxiosError;

	// Expose mergeConfig
	axios.mergeConfig = mergeConfig;

	axios.AxiosHeaders = AxiosHeaders$1;

	axios.formToJSON = thing => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

	axios.getAdapter = adapters.getAdapter;

	axios.HttpStatusCode = HttpStatusCode$1;

	axios.default = axios;

	axios_1 = axios;
	
	return axios_1;
}

var common = {};

var base = {};

var hasRequiredBase;

function requireBase () {
	if (hasRequiredBase) return base;
	hasRequiredBase = 1;
	(function (exports) {
		/* tslint:disable */
		/* eslint-disable */
		/*
		SnapTrade

		Connect brokerage accounts to your app for live positions and trading

		The version of the OpenAPI document: 1.0.0
		Contact: api@snaptrade.com

		NOTE: This file is auto generated by Konfig (https://konfigthis.com).
		*/
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.RequiredError = exports.BaseAPI = exports.COLLECTION_FORMATS = exports.BASE_PATH = void 0;
		// Some imports not used depending on template conditions
		// @ts-ignore
		const axios_1 = /*@__PURE__*/ requireAxios();
		exports.BASE_PATH = "https://api.snaptrade.com/api/v1".replace(/\/+$/, "");
		/**
		 *
		 * @export
		 */
		exports.COLLECTION_FORMATS = {
		    csv: ",",
		    ssv: " ",
		    tsv: "\t",
		    pipes: "|",
		};
		/**
		 *
		 * @export
		 * @class BaseAPI
		 */
		class BaseAPI {
		    constructor(configuration, basePath = exports.BASE_PATH, axios = axios_1.default) {
		        this.basePath = basePath;
		        this.axios = axios;
		        if (configuration) {
		            this.configuration = configuration;
		            this.basePath = configuration.basePath || this.basePath;
		        }
		    }
		}
		exports.BaseAPI = BaseAPI;
		/**
		 *
		 * @export
		 * @class RequiredError
		 * @extends {Error}
		 */
		class RequiredError extends Error {
		    constructor(field, msg) {
		        super(msg);
		        this.field = field;
		        this.name = "RequiredError";
		    }
		}
		exports.RequiredError = RequiredError; 
	} (base));
	return base;
}

var requestAfterHook = {};

var hasRequiredRequestAfterHook;

async function hmacSha256Base64(message, key) {
	const enc = new TextEncoder();
	const rawKey = enc.encode(key);
	const msgBytes = enc.encode(message);
  
	// 1) Import the key into Web Crypto
	const cryptoKey = await crypto.subtle.importKey(
	  "raw",
	  rawKey,
	  { name: "HMAC", hash: { name: "SHA-256" } },
	  false, // not exportable
	  ["sign"] // can only sign
	);
  
	// 2) Sign the message (compute HMAC)
	const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgBytes);
  
	// 3) Convert the signature (ArrayBuffer) to Base64
	const signatureBytes = new Uint8Array(signature);
	const signatureBase64 = btoa(String.fromCharCode(...signatureBytes));
	return signatureBase64;
  }

function requireRequestAfterHook () {
	if (hasRequiredRequestAfterHook) return requestAfterHook;
	hasRequiredRequestAfterHook = 1;
	var __awaiter = (requestAfterHook.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(requestAfterHook, "__esModule", { value: true });
	requestAfterHook.requestAfterHook = void 0;
	// Function to check if the code is running in a Node.js environment
	function isNodeEnvironment() {
	    return (typeof process !== "undefined" && process.versions && process.versions.node);
	}
	// Compute HMAC SHA256
	function computeHmacSha256(message, key) {
	    return __awaiter(this, void 0, void 0, function* () {
	        if (isNodeEnvironment()) {
	            // // Node.js environment
	            // const crypto = require$$0;
	            // const hmac = crypto.createHmac("sha256", key);
	            // hmac.update(message);
	            // return hmac.digest("base64"); // or return Buffer if you want raw bytes

				return hmacSha256Base64(message, key);
	        }
	        else {
	            // Browser environment
	            const encoder = new TextEncoder();
	            const keyBuffer = encoder.encode(key);
	            const msgBuffer = encoder.encode(message);
	            const cryptoKey = yield window.crypto.subtle.importKey("raw", keyBuffer, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
	            const signature = yield window.crypto.subtle.sign("HMAC", cryptoKey, msgBuffer);
	            const byteArray = Array.from(new Uint8Array(signature));
	            // Convert byte array to base64
	            const base64 = btoa(String.fromCharCode.apply(null, byteArray));
	            return base64;
	        }
	    });
	}
	const JSONstringifyOrder = (obj) => {
	    var allKeys = [];
	    var seen = {};
	    JSON.stringify(obj, function (key, value) {
	        if (!(key in seen)) {
	            allKeys.push(key);
	            seen[key] = null;
	        }
	        return value;
	    });
	    allKeys.sort();
	    return JSON.stringify(obj, allKeys);
	};
	function requestAfterHook$1(request) {
	    return __awaiter(this, void 0, void 0, function* () {
	        const { configuration, basePath, axiosArgs, url } = request;
	        if ((configuration === null || configuration === void 0 ? void 0 : configuration.consumerKey) === undefined)
	            throw Error("Consumer key is required");
	        const consumerKey = encodeURI(configuration.consumerKey);
	        const requestData = axiosArgs.options.data === undefined || axiosArgs.options.data === "{}"
	            ? null
	            : JSON.parse(axiosArgs.options.data);
	        const path = axiosArgs.url.indexOf("?") === -1
	            ? `${axiosArgs.url}`
	            : `${axiosArgs.url.split("?")[0]}`;
	        const requestPath = `/api/v1${path}`;
	        const requestQuery = url
	            .replace(basePath, "")
	            .replace(path, "")
	            .replace("?", "");
	        const sigObject = {
	            content: requestData,
	            path: requestPath,
	            query: requestQuery,
	        };
	        const sigContent = JSONstringifyOrder(sigObject);
	        const signature = yield computeHmacSha256(sigContent, consumerKey);
	        if (axiosArgs.options.headers)
	            axiosArgs.options.headers["Signature"] = signature;
	    });
	}
	requestAfterHook.requestAfterHook = requestAfterHook$1;
	return requestAfterHook;
}

var requestBeforeUrlHook = {};

var hasRequiredRequestBeforeUrlHook;

function requireRequestBeforeUrlHook () {
	if (hasRequiredRequestBeforeUrlHook) return requestBeforeUrlHook;
	hasRequiredRequestBeforeUrlHook = 1;
	Object.defineProperty(requestBeforeUrlHook, "__esModule", { value: true });
	requestBeforeUrlHook.requestBeforeUrlHook = void 0;
	function requestBeforeUrlHook$1(request) { }
	requestBeforeUrlHook.requestBeforeUrlHook = requestBeforeUrlHook$1;
	return requestBeforeUrlHook;
}

var error = {};

var hasRequiredError;

function requireError () {
	if (hasRequiredError) return error;
	hasRequiredError = 1;
	/*
	SnapTrade

	Connect brokerage accounts to your app for live positions and trading

	The version of the OpenAPI document: 1.0.0
	Contact: api@snaptrade.com

	NOTE: This file is auto generated by Konfig (https://konfigthis.com).
	*/
	var __awaiter = (error.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(error, "__esModule", { value: true });
	error.parseIfJson = error.readableStreamToString = error.SnaptradeError = void 0;
	/**
	 * This class provides a wrapper for network errors when making requests to SnapTrade
	 */
	class SnaptradeError extends Error {
	    constructor(axiosError, responseBody, headers) {
	        var _a, _b, _c, _d, _e;
	        const message = axiosError.message + "\nRESPONSE HEADERS:\n" + JSON.stringify(headers, null, 2);
	        super(message);
	        this.name = "SnaptradeError";
	        this.code = axiosError.code;
	        this.method = (_b = (_a = axiosError.config) === null || _a === void 0 ? void 0 : _a.method) === null || _b === void 0 ? void 0 : _b.toUpperCase();
	        this.url = (_c = axiosError.config) === null || _c === void 0 ? void 0 : _c.url;
	        this.status = (_d = axiosError.response) === null || _d === void 0 ? void 0 : _d.status;
	        this.statusText = (_e = axiosError.response) === null || _e === void 0 ? void 0 : _e.statusText;
	        this.responseBody = responseBody;
	    }
	    toJSON() {
	        return {
	            name: this.name,
	            message: this.message,
	            method: this.method,
	            url: this.url,
	            code: this.code,
	            status: this.status,
	            statusText: this.statusText,
	            responseBody: this.responseBody,
	        };
	    }
	}
	error.SnaptradeError = SnaptradeError;
	function readableStreamToString(stream) {
	    return __awaiter(this, void 0, void 0, function* () {
	        // Step 1: Create a new TextDecoder
	        const decoder = new TextDecoder();
	        // Step 2: Create a new ReadableStreamDefaultReader
	        const reader = stream.getReader();
	        // Step 3: Initialize an empty string to hold the result
	        let result = "";
	        try {
	            while (true) {
	                // Step 4: Read data from the stream
	                const { done, value } = yield reader.read();
	                // If there is no more data to read, break the loop
	                if (done)
	                    break;
	                // Convert the chunk of data to a string using the TextDecoder
	                const chunk = decoder.decode(value, { stream: true });
	                // Concatenate the chunk to the result
	                result += chunk;
	            }
	        }
	        finally {
	            // Step 5: Release the ReadableStreamDefaultReader when done or in case of an error
	            reader.releaseLock();
	        }
	        // Return the final result as a string
	        return result;
	    });
	}
	error.readableStreamToString = readableStreamToString;
	function parseIfJson(input) {
	    if (typeof input !== "string") {
	        // If the input is not a string, return the original input
	        return input;
	    }
	    try {
	        // Attempt to parse the input as JSON
	        const parsedJSON = JSON.parse(input);
	        // Check if the parsed result is an object (not an array or primitive value)
	        if (typeof parsedJSON === "object" && parsedJSON !== null) {
	            return parsedJSON;
	        }
	        else {
	            // Return the original input if the parsed result is not an object
	            return input;
	        }
	    }
	    catch (error) {
	        // Return the original input if parsing fails (invalid JSON)
	        return input;
	    }
	}
	error.parseIfJson = parseIfJson;
	return error;
}

var hasRequiredCommon;

function requireCommon () {
	if (hasRequiredCommon) return common;
	hasRequiredCommon = 1;
	(function (exports) {
		/* tslint:disable */
		/* eslint-disable */
		/*
		SnapTrade

		Connect brokerage accounts to your app for live positions and trading

		The version of the OpenAPI document: 1.0.0
		Contact: api@snaptrade.com

		NOTE: This file is auto generated by Konfig (https://konfigthis.com).
		*/
		var __awaiter = (common.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.isBrowser = exports.createRequestFunction = exports.removeTrailingSlash = exports.toPathString = exports.serializeDataIfNeeded = exports.setSearchParams = exports.setBearerAuthToObject = exports.setBasicAuthToObject = exports.setApiKeyToObject = exports.assertParamExists = exports.DUMMY_BASE_URL = void 0;
		const base_1 = requireBase();
		const axios_1 = /*@__PURE__*/ requireAxios();
		const requestAfterHook_1 = requireRequestAfterHook();
		const requestBeforeUrlHook_1 = requireRequestBeforeUrlHook();
		const error_1 = requireError();
		/**
		 *
		 * @export
		 */
		exports.DUMMY_BASE_URL = 'https://example.com';
		/**
		 *
		 * @throws {RequiredError}
		 * @export
		 */
		const assertParamExists = function (functionName, paramName, paramValue) {
		    if (paramValue === null || paramValue === undefined) {
		        throw new base_1.RequiredError(paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
		    }
		};
		exports.assertParamExists = assertParamExists;
		/**
		 *
		 * @export
		 */
		const setApiKeyToObject = function ({ object, key, type, keyParamName, configuration, prefix }) {
		    return __awaiter(this, void 0, void 0, function* () {
		        key = key ? key : keyParamName;
		        let apiKey = null;
		        if (configuration && configuration.apiKey) {
		            if (typeof configuration.apiKey === 'function')
		                apiKey = yield configuration.apiKey(keyParamName);
		            else if (typeof configuration.apiKey === 'string')
		                apiKey = configuration.apiKey;
		            else if (typeof configuration.apiKey === 'object') {
		                if (keyParamName in configuration.apiKey)
		                    apiKey = configuration.apiKey[keyParamName];
		            }
		            else
		                throw Error(`Unexpected type ${typeof configuration.apiKey} for Configuration.apiKey`);
		        }
		        if (!apiKey)
		            return;
		        object[key] = prefix !== undefined ? `${prefix}${apiKey}` : apiKey;
		        if (type === "Cookie")
		            object[key] = `${keyParamName}=${object[key]}`;
		    });
		};
		exports.setApiKeyToObject = setApiKeyToObject;
		/**
		 *
		 * @export
		 */
		const setBasicAuthToObject = function (object, configuration) {
		    if (configuration && (configuration.username || configuration.password)) {
		        object["auth"] = { username: configuration.username, password: configuration.password };
		    }
		};
		exports.setBasicAuthToObject = setBasicAuthToObject;
		/**
		 *
		 * @export
		 */
		const setBearerAuthToObject = function (object, configuration) {
		    return __awaiter(this, void 0, void 0, function* () {
		        if (configuration && configuration.accessToken) {
		            const accessToken = typeof configuration.accessToken === 'function'
		                ? yield configuration.accessToken()
		                : yield configuration.accessToken;
		            object["Authorization"] = "Bearer " + accessToken;
		        }
		    });
		};
		exports.setBearerAuthToObject = setBearerAuthToObject;
		function setFlattenedQueryParams(urlSearchParams, parameter, key = "") {
		    if (typeof parameter === "object") {
		        if (Array.isArray(parameter)) {
		            parameter.forEach(item => setFlattenedQueryParams(urlSearchParams, item, key));
		        }
		        else {
		            Object.keys(parameter).forEach(currentKey => setFlattenedQueryParams(urlSearchParams, parameter[currentKey], `${key}${key !== '' ? '.' : ''}${currentKey}`));
		        }
		    }
		    else {
		        if (urlSearchParams.has(key)) {
		            urlSearchParams.append(key, parameter);
		        }
		        else {
		            urlSearchParams.set(key, parameter);
		        }
		    }
		}
		/**
		 *
		 * @export
		 */
		const setSearchParams = function (url, ...objects) {
		    const searchParams = new URLSearchParams(url.search);
		    setFlattenedQueryParams(searchParams, objects);
		    url.search = searchParams.toString();
		};
		exports.setSearchParams = setSearchParams;
		/**
		 *
		 * @export
		 */
		const serializeDataIfNeeded = function (value, requestOptions, configuration) {
		    const nonString = typeof value !== 'string';
		    const needsSerialization = nonString && configuration && configuration.isJsonMime
		        ? configuration.isJsonMime(requestOptions.headers['Content-Type'])
		        : nonString;
		    return needsSerialization
		        ? JSON.stringify(value !== undefined ? value : {})
		        : (value || "");
		};
		exports.serializeDataIfNeeded = serializeDataIfNeeded;
		/**
		 *
		 * @export
		 */
		const toPathString = function (url) {
		    return (0, exports.removeTrailingSlash)(url.pathname) + url.search + url.hash;
		};
		exports.toPathString = toPathString;
		/**
		 * remove trailing slash from string
		 */
		const removeTrailingSlash = function (url) {
		    return url.replace(/\/$/, "");
		};
		exports.removeTrailingSlash = removeTrailingSlash;
		/**
		 * Wrap an axios request in a try/catch block to catch network errors and parse the response body
		 */
		function wrapAxiosRequest(makeRequest) {
		    var _a, _b, _c, _d, _e, _f;
		    return __awaiter(this, void 0, void 0, function* () {
		        const maxAttempts = 3;
		        let attempt = 0;
		        let delay = 5000;
		        while (attempt < maxAttempts) {
		            try {
		                return yield makeRequest();
		            }
		            catch (e) {
		                if (e instanceof axios_1.AxiosError && e.isAxiosError) {
		                    if (((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) == 429) {
		                        attempt++;
		                        console.log(`429 error encountered, retrying in ${delay / 1000} seconds...`);
		                        yield new Promise(resolve => setTimeout(resolve, delay));
		                        delay *= 2;
		                        continue;
		                    }
		                    try {
		                        const responseBody = ((_b = e.response) === null || _b === void 0 ? void 0 : _b.data) instanceof ReadableStream
		                            ? yield (0, error_1.readableStreamToString)(e.response.data)
		                            : (_c = e.response) === null || _c === void 0 ? void 0 : _c.data;
		                        throw new error_1.SnaptradeError(e, (0, error_1.parseIfJson)(responseBody), (_d = e.response) === null || _d === void 0 ? void 0 : _d.headers);
		                    }
		                    catch (innerError) {
		                        if (innerError instanceof ReferenceError) {
		                            // Got: "ReferenceError: ReadableStream is not defined"
		                            // This means we are in a Node environment so just throw the original error
		                            throw new error_1.SnaptradeError(e, (_e = e.response) === null || _e === void 0 ? void 0 : _e.data, (_f = e.response) === null || _f === void 0 ? void 0 : _f.headers);
		                        }
		                        if (innerError instanceof error_1.SnaptradeError) {
		                            // Got "SnaptradeError" from the above try block
		                            throw innerError;
		                        }
		                        // Something unexpected happened: propagate the error
		                        throw e;
		                    }
		                }
		                throw e;
		            }
		        }
		        throw new Error(`Request failed after ${maxAttempts} retries due to 429 (rate limit) errors.`);
		    });
		}
		/**
		 *
		 * @export
		 */
		const createRequestFunction = function (axiosArgs, globalAxios, BASE_PATH, configuration) {
		    return (axios = globalAxios, basePath = BASE_PATH) => __awaiter(this, void 0, void 0, function* () {
		        (0, requestBeforeUrlHook_1.requestBeforeUrlHook)({ axiosArgs, basePath, configuration });
		        const url = ((configuration === null || configuration === void 0 ? void 0 : configuration.basePath) || basePath) + axiosArgs.url;
		        yield (0, requestAfterHook_1.requestAfterHook)({ axiosArgs, basePath, url, configuration });
		        return wrapAxiosRequest(() => __awaiter(this, void 0, void 0, function* () { return yield axios.request(Object.assign(Object.assign({}, axiosArgs.options), { url })); }));
		    });
		};
		exports.createRequestFunction = createRequestFunction;
		function isBrowser() {
		    return typeof window !== "undefined";
		}
		exports.isBrowser = isBrowser; 
	} (common));
	return common;
}

var requestBeforeHook = {};

var hasRequiredRequestBeforeHook;

function requireRequestBeforeHook () {
	if (hasRequiredRequestBeforeHook) return requestBeforeHook;
	hasRequiredRequestBeforeHook = 1;
	Object.defineProperty(requestBeforeHook, "__esModule", { value: true });
	requestBeforeHook.requestBeforeHook = void 0;
	function requestBeforeHook$1(request) {
	    const { queryParameters } = request;
	    queryParameters["timestamp"] = Math.round(new Date().getTime() / 1000).toString();
	}
	requestBeforeHook.requestBeforeHook = requestBeforeHook$1;
	return requestBeforeHook;
}

var hasRequiredAccountInformationApiGenerated;

function requireAccountInformationApiGenerated () {
	if (hasRequiredAccountInformationApiGenerated) return accountInformationApiGenerated;
	hasRequiredAccountInformationApiGenerated = 1;
	(function (exports) {
		/* tslint:disable */
		/* eslint-disable */
		/*
		SnapTrade

		Connect brokerage accounts to your app for live positions and trading

		The version of the OpenAPI document: 1.0.0
		Contact: api@snaptrade.com

		NOTE: This file is auto generated by Konfig (https://konfigthis.com).
		*/
		var __awaiter = (accountInformationApiGenerated.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.AccountInformationApiGenerated = exports.AccountInformationApiFactory = exports.AccountInformationApiFp = exports.AccountInformationApiAxiosParamCreator = void 0;
		const axios_1 = /*@__PURE__*/ requireAxios();
		// Some imports not used depending on template conditions
		// @ts-ignore
		const common_1 = requireCommon();
		// @ts-ignore
		const base_1 = requireBase();
		const requestBeforeHook_1 = requireRequestBeforeHook();
		/**
		 * AccountInformationApi - axios parameter creator
		 * @export
		 */
		const AccountInformationApiAxiosParamCreator = function (configuration) {
		    return {
		        /**
		         * **Deprecated, please use the account-specific holdings endpoint instead.**  List all accounts for the user, plus balances, positions, and orders for each account.
		         * @summary List all accounts for the user, plus balances, positions, and orders for each account.
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} [brokerageAuthorizations] Optional. Comma separated list of authorization IDs (only use if filtering is needed on one or more authorizations).
		         * @param {*} [options] Override http request option.
		         * @deprecated
		         * @throws {RequiredError}
		         */
		        getAllUserHoldings: (userId, userSecret, brokerageAuthorizations, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getAllUserHoldings', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getAllUserHoldings', 'userSecret', userSecret);
		            const localVarPath = `/holdings`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            if (brokerageAuthorizations !== undefined) {
		                localVarQueryParameter['brokerage_authorizations'] = brokerageAuthorizations;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/holdings',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of balances for the account. Each element of the list has a distinct currency. Some brokerages like Questrade [allows holding multiple currencies in the same account](https://www.questrade.com/learning/questrade-basics/balances-and-reports/understanding-your-account-balances).  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account balances
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountBalance: (userId, userSecret, accountId, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountBalance', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountBalance', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountBalance', 'accountId', accountId);
		            const localVarPath = `/accounts/{accountId}/balances`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/balances',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns account detail known to SnapTrade for the specified account.  The data returned here is always cached and refreshed once a day. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary Get account detail
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountDetails: (userId, userSecret, accountId, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountDetails', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountDetails', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountDetails', 'accountId', accountId);
		            const localVarPath = `/accounts/{accountId}`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of recent orders in the specified account.  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account recent orders
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId
		         * @param {'all' | 'open' | 'executed'} [state] defaults value is set to \&quot;all\&quot;
		         * @param {number} [days] Number of days in the past to fetch the most recent orders. Defaults to the last 30 days if no value is passed in.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountOrders: (userId, userSecret, accountId, state, days, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountOrders', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountOrders', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountOrders', 'accountId', accountId);
		            const localVarPath = `/accounts/{accountId}/orders`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            if (state !== undefined) {
		                localVarQueryParameter['state'] = state;
		            }
		            if (days !== undefined) {
		                localVarQueryParameter['days'] = days;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/orders',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of stock/ETF/crypto/mutual fund positions in the specified account. For option positions, please use the [options endpoint](/reference/Options/Options_listOptionHoldings).  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account positions
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountPositions: (userId, userSecret, accountId, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountPositions', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountPositions', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountPositions', 'accountId', accountId);
		            const localVarPath = `/accounts/{accountId}/positions`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/positions',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of orders executed in the last 24 hours in the specified account. This endpoint is realtime and can be used to quickly check if account state has recently changed due to an execution Differs from /orders in that it only returns orders that have been *executed* in the last 24 hours as opposed to pending or cancelled orders up to 30 days old *Please contact support for access as this endpoint is not enabled by default.*
		         * @summary List account recent executed orders
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId
		         * @param {boolean} [onlyExecuted] Defaults to true. Indicates if request should fetch only executed orders. Set to false to retrieve non executed orders as well
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountRecentOrders: (userId, userSecret, accountId, onlyExecuted, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountRecentOrders', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountRecentOrders', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountRecentOrders', 'accountId', accountId);
		            const localVarPath = `/accounts/{accountId}/recentOrders`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            if (onlyExecuted !== undefined) {
		                localVarQueryParameter['only_executed'] = onlyExecuted;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/recentOrders',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of rate of return percents for a given account. Will include timeframes available from the brokerage, for example \"ALL\", \"1Y\", \"6M\", \"3M\", \"1M\"
		         * @summary List account rate of returns
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountReturnRates: (userId, userSecret, accountId, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountReturnRates', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountReturnRates', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountReturnRates', 'accountId', accountId);
		            const localVarPath = `/accounts/{accountId}/returnRates`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/returnRates',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of balances, positions, and recent orders for the specified account. The data returned is similar to the data returned over the more fine-grained [balances](/reference/Account%20Information/AccountInformation_getUserAccountBalance), [positions](/reference/Account%20Information/AccountInformation_getUserAccountPositions) and [orders](/reference/Account%20Information/AccountInformation_getUserAccountOrders) endpoints. __The finer-grained APIs are preferred. They are easier to work with, faster, and have better error handling than this coarse-grained API.__  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account holdings
		         * @param {string} accountId
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserHoldings: (accountId, userId, userSecret, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserHoldings', 'accountId', accountId);
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserHoldings', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getUserHoldings', 'userSecret', userSecret);
		            const localVarPath = `/accounts/{accountId}/holdings`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/holdings',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns all brokerage accounts across all connections known to SnapTrade for the authenticated user.  The data returned here is always cached and refreshed once a day. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List accounts
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listUserAccounts: (userId, userSecret, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('listUserAccounts', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('listUserAccounts', 'userSecret', userSecret);
		            const localVarPath = `/accounts`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Updates various properties of a specified account.
		         * @summary Update details of an investment account
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId The ID of the account to update.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        updateUserAccount: (userId, userSecret, accountId, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('updateUserAccount', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('updateUserAccount', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('updateUserAccount', 'accountId', accountId);
		            const localVarPath = `/accounts/{accountId}`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}',
		                httpMethod: 'PUT'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		    };
		};
		exports.AccountInformationApiAxiosParamCreator = AccountInformationApiAxiosParamCreator;
		/**
		 * AccountInformationApi - functional programming interface
		 * @export
		 */
		const AccountInformationApiFp = function (configuration) {
		    const localVarAxiosParamCreator = (0, exports.AccountInformationApiAxiosParamCreator)(configuration);
		    return {
		        /**
		         * **Deprecated, please use the account-specific holdings endpoint instead.**  List all accounts for the user, plus balances, positions, and orders for each account.
		         * @summary List all accounts for the user, plus balances, positions, and orders for each account.
		         * @param {AccountInformationApiGetAllUserHoldingsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @deprecated
		         * @throws {RequiredError}
		         */
		        getAllUserHoldings(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getAllUserHoldings(requestParameters.userId, requestParameters.userSecret, requestParameters.brokerageAuthorizations, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of balances for the account. Each element of the list has a distinct currency. Some brokerages like Questrade [allows holding multiple currencies in the same account](https://www.questrade.com/learning/questrade-basics/balances-and-reports/understanding-your-account-balances).  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account balances
		         * @param {AccountInformationApiGetUserAccountBalanceRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountBalance(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getUserAccountBalance(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns account detail known to SnapTrade for the specified account.  The data returned here is always cached and refreshed once a day. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary Get account detail
		         * @param {AccountInformationApiGetUserAccountDetailsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountDetails(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getUserAccountDetails(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of recent orders in the specified account.  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account recent orders
		         * @param {AccountInformationApiGetUserAccountOrdersRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountOrders(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getUserAccountOrders(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, requestParameters.state, requestParameters.days, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of stock/ETF/crypto/mutual fund positions in the specified account. For option positions, please use the [options endpoint](/reference/Options/Options_listOptionHoldings).  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account positions
		         * @param {AccountInformationApiGetUserAccountPositionsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountPositions(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getUserAccountPositions(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of orders executed in the last 24 hours in the specified account. This endpoint is realtime and can be used to quickly check if account state has recently changed due to an execution Differs from /orders in that it only returns orders that have been *executed* in the last 24 hours as opposed to pending or cancelled orders up to 30 days old *Please contact support for access as this endpoint is not enabled by default.*
		         * @summary List account recent executed orders
		         * @param {AccountInformationApiGetUserAccountRecentOrdersRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountRecentOrders(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getUserAccountRecentOrders(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, requestParameters.onlyExecuted, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of rate of return percents for a given account. Will include timeframes available from the brokerage, for example \"ALL\", \"1Y\", \"6M\", \"3M\", \"1M\"
		         * @summary List account rate of returns
		         * @param {AccountInformationApiGetUserAccountReturnRatesRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountReturnRates(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getUserAccountReturnRates(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of balances, positions, and recent orders for the specified account. The data returned is similar to the data returned over the more fine-grained [balances](/reference/Account%20Information/AccountInformation_getUserAccountBalance), [positions](/reference/Account%20Information/AccountInformation_getUserAccountPositions) and [orders](/reference/Account%20Information/AccountInformation_getUserAccountOrders) endpoints. __The finer-grained APIs are preferred. They are easier to work with, faster, and have better error handling than this coarse-grained API.__  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account holdings
		         * @param {AccountInformationApiGetUserHoldingsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserHoldings(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getUserHoldings(requestParameters.accountId, requestParameters.userId, requestParameters.userSecret, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns all brokerage accounts across all connections known to SnapTrade for the authenticated user.  The data returned here is always cached and refreshed once a day. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List accounts
		         * @param {AccountInformationApiListUserAccountsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listUserAccounts(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.listUserAccounts(requestParameters.userId, requestParameters.userSecret, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Updates various properties of a specified account.
		         * @summary Update details of an investment account
		         * @param {AccountInformationApiUpdateUserAccountRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        updateUserAccount(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.updateUserAccount(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		    };
		};
		exports.AccountInformationApiFp = AccountInformationApiFp;
		/**
		 * AccountInformationApi - factory interface
		 * @export
		 */
		const AccountInformationApiFactory = function (configuration, basePath, axios) {
		    const localVarFp = (0, exports.AccountInformationApiFp)(configuration);
		    return {
		        /**
		         * **Deprecated, please use the account-specific holdings endpoint instead.**  List all accounts for the user, plus balances, positions, and orders for each account.
		         * @summary List all accounts for the user, plus balances, positions, and orders for each account.
		         * @param {AccountInformationApiGetAllUserHoldingsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @deprecated
		         * @throws {RequiredError}
		         */
		        getAllUserHoldings(requestParameters, options) {
		            return localVarFp.getAllUserHoldings(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of balances for the account. Each element of the list has a distinct currency. Some brokerages like Questrade [allows holding multiple currencies in the same account](https://www.questrade.com/learning/questrade-basics/balances-and-reports/understanding-your-account-balances).  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account balances
		         * @param {AccountInformationApiGetUserAccountBalanceRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountBalance(requestParameters, options) {
		            return localVarFp.getUserAccountBalance(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns account detail known to SnapTrade for the specified account.  The data returned here is always cached and refreshed once a day. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary Get account detail
		         * @param {AccountInformationApiGetUserAccountDetailsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountDetails(requestParameters, options) {
		            return localVarFp.getUserAccountDetails(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of recent orders in the specified account.  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account recent orders
		         * @param {AccountInformationApiGetUserAccountOrdersRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountOrders(requestParameters, options) {
		            return localVarFp.getUserAccountOrders(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of stock/ETF/crypto/mutual fund positions in the specified account. For option positions, please use the [options endpoint](/reference/Options/Options_listOptionHoldings).  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account positions
		         * @param {AccountInformationApiGetUserAccountPositionsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountPositions(requestParameters, options) {
		            return localVarFp.getUserAccountPositions(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of orders executed in the last 24 hours in the specified account. This endpoint is realtime and can be used to quickly check if account state has recently changed due to an execution Differs from /orders in that it only returns orders that have been *executed* in the last 24 hours as opposed to pending or cancelled orders up to 30 days old *Please contact support for access as this endpoint is not enabled by default.*
		         * @summary List account recent executed orders
		         * @param {AccountInformationApiGetUserAccountRecentOrdersRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountRecentOrders(requestParameters, options) {
		            return localVarFp.getUserAccountRecentOrders(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of rate of return percents for a given account. Will include timeframes available from the brokerage, for example \"ALL\", \"1Y\", \"6M\", \"3M\", \"1M\"
		         * @summary List account rate of returns
		         * @param {AccountInformationApiGetUserAccountReturnRatesRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountReturnRates(requestParameters, options) {
		            return localVarFp.getUserAccountReturnRates(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of balances, positions, and recent orders for the specified account. The data returned is similar to the data returned over the more fine-grained [balances](/reference/Account%20Information/AccountInformation_getUserAccountBalance), [positions](/reference/Account%20Information/AccountInformation_getUserAccountPositions) and [orders](/reference/Account%20Information/AccountInformation_getUserAccountOrders) endpoints. __The finer-grained APIs are preferred. They are easier to work with, faster, and have better error handling than this coarse-grained API.__  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account holdings
		         * @param {AccountInformationApiGetUserHoldingsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserHoldings(requestParameters, options) {
		            return localVarFp.getUserHoldings(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns all brokerage accounts across all connections known to SnapTrade for the authenticated user.  The data returned here is always cached and refreshed once a day. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List accounts
		         * @param {AccountInformationApiListUserAccountsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listUserAccounts(requestParameters, options) {
		            return localVarFp.listUserAccounts(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Updates various properties of a specified account.
		         * @summary Update details of an investment account
		         * @param {AccountInformationApiUpdateUserAccountRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        updateUserAccount(requestParameters, options) {
		            return localVarFp.updateUserAccount(requestParameters, options).then((request) => request(axios, basePath));
		        },
		    };
		};
		exports.AccountInformationApiFactory = AccountInformationApiFactory;
		/**
		 * AccountInformationApiGenerated - object-oriented interface
		 * @export
		 * @class AccountInformationApiGenerated
		 * @extends {BaseAPI}
		 */
		class AccountInformationApiGenerated extends base_1.BaseAPI {
		    /**
		     * **Deprecated, please use the account-specific holdings endpoint instead.**  List all accounts for the user, plus balances, positions, and orders for each account.
		     * @summary List all accounts for the user, plus balances, positions, and orders for each account.
		     * @param {AccountInformationApiGetAllUserHoldingsRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @deprecated
		     * @throws {RequiredError}
		     * @memberof AccountInformationApiGenerated
		     */
		    getAllUserHoldings(requestParameters, options) {
		        return (0, exports.AccountInformationApiFp)(this.configuration).getAllUserHoldings(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of balances for the account. Each element of the list has a distinct currency. Some brokerages like Questrade [allows holding multiple currencies in the same account](https://www.questrade.com/learning/questrade-basics/balances-and-reports/understanding-your-account-balances).  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		     * @summary List account balances
		     * @param {AccountInformationApiGetUserAccountBalanceRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AccountInformationApiGenerated
		     */
		    getUserAccountBalance(requestParameters, options) {
		        return (0, exports.AccountInformationApiFp)(this.configuration).getUserAccountBalance(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns account detail known to SnapTrade for the specified account.  The data returned here is always cached and refreshed once a day. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		     * @summary Get account detail
		     * @param {AccountInformationApiGetUserAccountDetailsRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AccountInformationApiGenerated
		     */
		    getUserAccountDetails(requestParameters, options) {
		        return (0, exports.AccountInformationApiFp)(this.configuration).getUserAccountDetails(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of recent orders in the specified account.  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		     * @summary List account recent orders
		     * @param {AccountInformationApiGetUserAccountOrdersRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AccountInformationApiGenerated
		     */
		    getUserAccountOrders(requestParameters, options) {
		        return (0, exports.AccountInformationApiFp)(this.configuration).getUserAccountOrders(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of stock/ETF/crypto/mutual fund positions in the specified account. For option positions, please use the [options endpoint](/reference/Options/Options_listOptionHoldings).  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		     * @summary List account positions
		     * @param {AccountInformationApiGetUserAccountPositionsRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AccountInformationApiGenerated
		     */
		    getUserAccountPositions(requestParameters, options) {
		        return (0, exports.AccountInformationApiFp)(this.configuration).getUserAccountPositions(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of orders executed in the last 24 hours in the specified account. This endpoint is realtime and can be used to quickly check if account state has recently changed due to an execution Differs from /orders in that it only returns orders that have been *executed* in the last 24 hours as opposed to pending or cancelled orders up to 30 days old *Please contact support for access as this endpoint is not enabled by default.*
		     * @summary List account recent executed orders
		     * @param {AccountInformationApiGetUserAccountRecentOrdersRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AccountInformationApiGenerated
		     */
		    getUserAccountRecentOrders(requestParameters, options) {
		        return (0, exports.AccountInformationApiFp)(this.configuration).getUserAccountRecentOrders(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of rate of return percents for a given account. Will include timeframes available from the brokerage, for example \"ALL\", \"1Y\", \"6M\", \"3M\", \"1M\"
		     * @summary List account rate of returns
		     * @param {AccountInformationApiGetUserAccountReturnRatesRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AccountInformationApiGenerated
		     */
		    getUserAccountReturnRates(requestParameters, options) {
		        return (0, exports.AccountInformationApiFp)(this.configuration).getUserAccountReturnRates(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of balances, positions, and recent orders for the specified account. The data returned is similar to the data returned over the more fine-grained [balances](/reference/Account%20Information/AccountInformation_getUserAccountBalance), [positions](/reference/Account%20Information/AccountInformation_getUserAccountPositions) and [orders](/reference/Account%20Information/AccountInformation_getUserAccountOrders) endpoints. __The finer-grained APIs are preferred. They are easier to work with, faster, and have better error handling than this coarse-grained API.__  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		     * @summary List account holdings
		     * @param {AccountInformationApiGetUserHoldingsRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AccountInformationApiGenerated
		     */
		    getUserHoldings(requestParameters, options) {
		        return (0, exports.AccountInformationApiFp)(this.configuration).getUserHoldings(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns all brokerage accounts across all connections known to SnapTrade for the authenticated user.  The data returned here is always cached and refreshed once a day. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		     * @summary List accounts
		     * @param {AccountInformationApiListUserAccountsRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AccountInformationApiGenerated
		     */
		    listUserAccounts(requestParameters, options) {
		        return (0, exports.AccountInformationApiFp)(this.configuration).listUserAccounts(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Updates various properties of a specified account.
		     * @summary Update details of an investment account
		     * @param {AccountInformationApiUpdateUserAccountRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AccountInformationApiGenerated
		     */
		    updateUserAccount(requestParameters, options) {
		        return (0, exports.AccountInformationApiFp)(this.configuration).updateUserAccount(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		}
		exports.AccountInformationApiGenerated = AccountInformationApiGenerated; 
	} (accountInformationApiGenerated));
	return accountInformationApiGenerated;
}

var hasRequiredAccountInformationApi;

function requireAccountInformationApi () {
	if (hasRequiredAccountInformationApi) return accountInformationApi;
	hasRequiredAccountInformationApi = 1;
	(function (exports) {
		var __createBinding = (accountInformationApi.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (accountInformationApi.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.AccountInformationApi = void 0;
		const account_information_api_generated_1 = requireAccountInformationApiGenerated();
		__exportStar(requireAccountInformationApiGenerated(), exports);
		class AccountInformationApi extends account_information_api_generated_1.AccountInformationApiGenerated {
		}
		exports.AccountInformationApi = AccountInformationApi; 
	} (accountInformationApi));
	return accountInformationApi;
}

var apiStatusApi = {};

var apiStatusApiGenerated = {};

var hasRequiredApiStatusApiGenerated;

function requireApiStatusApiGenerated () {
	if (hasRequiredApiStatusApiGenerated) return apiStatusApiGenerated;
	hasRequiredApiStatusApiGenerated = 1;
	(function (exports) {
		/* tslint:disable */
		/* eslint-disable */
		/*
		SnapTrade

		Connect brokerage accounts to your app for live positions and trading

		The version of the OpenAPI document: 1.0.0
		Contact: api@snaptrade.com

		NOTE: This file is auto generated by Konfig (https://konfigthis.com).
		*/
		var __awaiter = (apiStatusApiGenerated.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ApiStatusApiGenerated = exports.ApiStatusApiFactory = exports.ApiStatusApiFp = exports.ApiStatusApiAxiosParamCreator = void 0;
		const axios_1 = /*@__PURE__*/ requireAxios();
		// Some imports not used depending on template conditions
		// @ts-ignore
		const common_1 = requireCommon();
		// @ts-ignore
		const base_1 = requireBase();
		const requestBeforeHook_1 = requireRequestBeforeHook();
		/**
		 * ApiStatusApi - axios parameter creator
		 * @export
		 */
		const ApiStatusApiAxiosParamCreator = function (configuration) {
		    return {
		        /**
		         * Check whether the API is operational and verify timestamps.
		         * @summary Get API Status
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        check: (options = {}) => __awaiter(this, void 0, void 0, function* () {
		            const localVarPath = `/`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		    };
		};
		exports.ApiStatusApiAxiosParamCreator = ApiStatusApiAxiosParamCreator;
		/**
		 * ApiStatusApi - functional programming interface
		 * @export
		 */
		const ApiStatusApiFp = function (configuration) {
		    const localVarAxiosParamCreator = (0, exports.ApiStatusApiAxiosParamCreator)(configuration);
		    return {
		        /**
		         * Check whether the API is operational and verify timestamps.
		         * @summary Get API Status
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        check(options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.check(options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		    };
		};
		exports.ApiStatusApiFp = ApiStatusApiFp;
		/**
		 * ApiStatusApi - factory interface
		 * @export
		 */
		const ApiStatusApiFactory = function (configuration, basePath, axios) {
		    const localVarFp = (0, exports.ApiStatusApiFp)(configuration);
		    return {
		        /**
		         * Check whether the API is operational and verify timestamps.
		         * @summary Get API Status
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        check(options) {
		            return localVarFp.check(options).then((request) => request(axios, basePath));
		        },
		    };
		};
		exports.ApiStatusApiFactory = ApiStatusApiFactory;
		/**
		 * ApiStatusApiGenerated - object-oriented interface
		 * @export
		 * @class ApiStatusApiGenerated
		 * @extends {BaseAPI}
		 */
		class ApiStatusApiGenerated extends base_1.BaseAPI {
		    /**
		     * Check whether the API is operational and verify timestamps.
		     * @summary Get API Status
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ApiStatusApiGenerated
		     */
		    check(options) {
		        return (0, exports.ApiStatusApiFp)(this.configuration).check(options).then((request) => request(this.axios, this.basePath));
		    }
		}
		exports.ApiStatusApiGenerated = ApiStatusApiGenerated; 
	} (apiStatusApiGenerated));
	return apiStatusApiGenerated;
}

var hasRequiredApiStatusApi;

function requireApiStatusApi () {
	if (hasRequiredApiStatusApi) return apiStatusApi;
	hasRequiredApiStatusApi = 1;
	(function (exports) {
		var __createBinding = (apiStatusApi.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (apiStatusApi.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ApiStatusApi = void 0;
		const api_status_api_generated_1 = requireApiStatusApiGenerated();
		__exportStar(requireApiStatusApiGenerated(), exports);
		class ApiStatusApi extends api_status_api_generated_1.ApiStatusApiGenerated {
		}
		exports.ApiStatusApi = ApiStatusApi; 
	} (apiStatusApi));
	return apiStatusApi;
}

var authenticationApi = {};

var authenticationApiGenerated = {};

var hasRequiredAuthenticationApiGenerated;

function requireAuthenticationApiGenerated () {
	if (hasRequiredAuthenticationApiGenerated) return authenticationApiGenerated;
	hasRequiredAuthenticationApiGenerated = 1;
	(function (exports) {
		/* tslint:disable */
		/* eslint-disable */
		/*
		SnapTrade

		Connect brokerage accounts to your app for live positions and trading

		The version of the OpenAPI document: 1.0.0
		Contact: api@snaptrade.com

		NOTE: This file is auto generated by Konfig (https://konfigthis.com).
		*/
		var __awaiter = (authenticationApiGenerated.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.AuthenticationApiGenerated = exports.AuthenticationApiFactory = exports.AuthenticationApiFp = exports.AuthenticationApiAxiosParamCreator = void 0;
		const axios_1 = /*@__PURE__*/ requireAxios();
		// Some imports not used depending on template conditions
		// @ts-ignore
		const common_1 = requireCommon();
		// @ts-ignore
		const base_1 = requireBase();
		const requestBeforeHook_1 = requireRequestBeforeHook();
		/**
		 * AuthenticationApi - axios parameter creator
		 * @export
		 */
		const AuthenticationApiAxiosParamCreator = function (configuration) {
		    return {
		        /**
		         * Deletes a registered user and all associated data. This action is irreversible. This API is asynchronous and will return a 200 status code if the request is accepted. The user and all associated data will be queued for deletion. Once deleted, a `USER_DELETED` webhook will be sent.
		         * @summary Delete user
		         * @param {string} userId
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        deleteSnapTradeUser: (userId, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('deleteSnapTradeUser', 'userId', userId);
		            const localVarPath = `/snapTrade/deleteUser`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'DELETE' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/snapTrade/deleteUser',
		                httpMethod: 'DELETE'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of all registered user IDs. Please note that the response is not currently paginated.
		         * @summary List all users
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listSnapTradeUsers: (options = {}) => __awaiter(this, void 0, void 0, function* () {
		            const localVarPath = `/snapTrade/listUsers`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/snapTrade/listUsers',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Authenticates a SnapTrade user and returns the Connection Portal URL used for connecting brokerage accounts. Please check [this guide](/docs/implement-connection-portal) for how to integrate the Connection Portal into your app.  Please note that the returned URL expires in 5 minutes.
		         * @summary Generate Connection Portal URL
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {SnapTradeLoginUserRequestBody} [snapTradeLoginUserRequestBody]
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        loginSnapTradeUser: (userId, userSecret, snapTradeLoginUserRequestBody, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('loginSnapTradeUser', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('loginSnapTradeUser', 'userSecret', userSecret);
		            const localVarPath = `/snapTrade/login`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            localVarHeaderParameter['Content-Type'] = 'application/json';
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                requestBody: snapTradeLoginUserRequestBody,
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/snapTrade/login',
		                httpMethod: 'POST'
		            });
		            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(snapTradeLoginUserRequestBody, localVarRequestOptions, configuration);
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Registers a new SnapTrade user under your Client ID. A user secret will be automatically generated for you and must be properly stored in your system. Most SnapTrade operations require a user ID and user secret to be passed in as parameters.
		         * @summary Register user
		         * @param {SnapTradeRegisterUserRequestBody} snapTradeRegisterUserRequestBody
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        registerSnapTradeUser: (snapTradeRegisterUserRequestBody, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'snapTradeRegisterUserRequestBody' is not null or undefined
		            (0, common_1.assertParamExists)('registerSnapTradeUser', 'snapTradeRegisterUserRequestBody', snapTradeRegisterUserRequestBody);
		            const localVarPath = `/snapTrade/registerUser`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            localVarHeaderParameter['Content-Type'] = 'application/json';
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                requestBody: snapTradeRegisterUserRequestBody,
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/snapTrade/registerUser',
		                httpMethod: 'POST'
		            });
		            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(snapTradeRegisterUserRequestBody, localVarRequestOptions, configuration);
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Rotates the secret for a SnapTrade user. You might use this if `userSecret` is compromised. Please note that if you call this endpoint and fail to save the new secret, you\'ll no longer be able to access any data for this user, and your only option will be to delete and recreate the user, then ask them to reconnect.
		         * @summary Rotate user secret
		         * @param {UserIDandSecret} userIDandSecret
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        resetSnapTradeUserSecret: (userIDandSecret, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userIDandSecret' is not null or undefined
		            (0, common_1.assertParamExists)('resetSnapTradeUserSecret', 'userIDandSecret', userIDandSecret);
		            const localVarPath = `/snapTrade/resetUserSecret`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            localVarHeaderParameter['Content-Type'] = 'application/json';
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                requestBody: userIDandSecret,
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/snapTrade/resetUserSecret',
		                httpMethod: 'POST'
		            });
		            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(userIDandSecret, localVarRequestOptions, configuration);
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		    };
		};
		exports.AuthenticationApiAxiosParamCreator = AuthenticationApiAxiosParamCreator;
		/**
		 * AuthenticationApi - functional programming interface
		 * @export
		 */
		const AuthenticationApiFp = function (configuration) {
		    const localVarAxiosParamCreator = (0, exports.AuthenticationApiAxiosParamCreator)(configuration);
		    return {
		        /**
		         * Deletes a registered user and all associated data. This action is irreversible. This API is asynchronous and will return a 200 status code if the request is accepted. The user and all associated data will be queued for deletion. Once deleted, a `USER_DELETED` webhook will be sent.
		         * @summary Delete user
		         * @param {AuthenticationApiDeleteSnapTradeUserRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        deleteSnapTradeUser(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.deleteSnapTradeUser(requestParameters.userId, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of all registered user IDs. Please note that the response is not currently paginated.
		         * @summary List all users
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listSnapTradeUsers(options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.listSnapTradeUsers(options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Authenticates a SnapTrade user and returns the Connection Portal URL used for connecting brokerage accounts. Please check [this guide](/docs/implement-connection-portal) for how to integrate the Connection Portal into your app.  Please note that the returned URL expires in 5 minutes.
		         * @summary Generate Connection Portal URL
		         * @param {AuthenticationApiLoginSnapTradeUserRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        loginSnapTradeUser(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const snapTradeLoginUserRequestBody = {
		                    broker: requestParameters.broker,
		                    immediateRedirect: requestParameters.immediateRedirect,
		                    customRedirect: requestParameters.customRedirect,
		                    reconnect: requestParameters.reconnect,
		                    connectionType: requestParameters.connectionType,
		                    connectionPortalVersion: requestParameters.connectionPortalVersion
		                };
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.loginSnapTradeUser(requestParameters.userId, requestParameters.userSecret, snapTradeLoginUserRequestBody, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Registers a new SnapTrade user under your Client ID. A user secret will be automatically generated for you and must be properly stored in your system. Most SnapTrade operations require a user ID and user secret to be passed in as parameters.
		         * @summary Register user
		         * @param {AuthenticationApiRegisterSnapTradeUserRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        registerSnapTradeUser(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const snapTradeRegisterUserRequestBody = {
		                    userId: requestParameters.userId
		                };
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.registerSnapTradeUser(snapTradeRegisterUserRequestBody, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Rotates the secret for a SnapTrade user. You might use this if `userSecret` is compromised. Please note that if you call this endpoint and fail to save the new secret, you\'ll no longer be able to access any data for this user, and your only option will be to delete and recreate the user, then ask them to reconnect.
		         * @summary Rotate user secret
		         * @param {AuthenticationApiResetSnapTradeUserSecretRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        resetSnapTradeUserSecret(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const userIDandSecret = {
		                    userId: requestParameters.userId,
		                    userSecret: requestParameters.userSecret
		                };
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.resetSnapTradeUserSecret(userIDandSecret, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		    };
		};
		exports.AuthenticationApiFp = AuthenticationApiFp;
		/**
		 * AuthenticationApi - factory interface
		 * @export
		 */
		const AuthenticationApiFactory = function (configuration, basePath, axios) {
		    const localVarFp = (0, exports.AuthenticationApiFp)(configuration);
		    return {
		        /**
		         * Deletes a registered user and all associated data. This action is irreversible. This API is asynchronous and will return a 200 status code if the request is accepted. The user and all associated data will be queued for deletion. Once deleted, a `USER_DELETED` webhook will be sent.
		         * @summary Delete user
		         * @param {AuthenticationApiDeleteSnapTradeUserRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        deleteSnapTradeUser(requestParameters, options) {
		            return localVarFp.deleteSnapTradeUser(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of all registered user IDs. Please note that the response is not currently paginated.
		         * @summary List all users
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listSnapTradeUsers(options) {
		            return localVarFp.listSnapTradeUsers(options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Authenticates a SnapTrade user and returns the Connection Portal URL used for connecting brokerage accounts. Please check [this guide](/docs/implement-connection-portal) for how to integrate the Connection Portal into your app.  Please note that the returned URL expires in 5 minutes.
		         * @summary Generate Connection Portal URL
		         * @param {AuthenticationApiLoginSnapTradeUserRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        loginSnapTradeUser(requestParameters, options) {
		            return localVarFp.loginSnapTradeUser(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Registers a new SnapTrade user under your Client ID. A user secret will be automatically generated for you and must be properly stored in your system. Most SnapTrade operations require a user ID and user secret to be passed in as parameters.
		         * @summary Register user
		         * @param {AuthenticationApiRegisterSnapTradeUserRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        registerSnapTradeUser(requestParameters, options) {
		            return localVarFp.registerSnapTradeUser(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Rotates the secret for a SnapTrade user. You might use this if `userSecret` is compromised. Please note that if you call this endpoint and fail to save the new secret, you\'ll no longer be able to access any data for this user, and your only option will be to delete and recreate the user, then ask them to reconnect.
		         * @summary Rotate user secret
		         * @param {AuthenticationApiResetSnapTradeUserSecretRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        resetSnapTradeUserSecret(requestParameters, options) {
		            return localVarFp.resetSnapTradeUserSecret(requestParameters, options).then((request) => request(axios, basePath));
		        },
		    };
		};
		exports.AuthenticationApiFactory = AuthenticationApiFactory;
		/**
		 * AuthenticationApiGenerated - object-oriented interface
		 * @export
		 * @class AuthenticationApiGenerated
		 * @extends {BaseAPI}
		 */
		class AuthenticationApiGenerated extends base_1.BaseAPI {
		    /**
		     * Deletes a registered user and all associated data. This action is irreversible. This API is asynchronous and will return a 200 status code if the request is accepted. The user and all associated data will be queued for deletion. Once deleted, a `USER_DELETED` webhook will be sent.
		     * @summary Delete user
		     * @param {AuthenticationApiDeleteSnapTradeUserRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AuthenticationApiGenerated
		     */
		    deleteSnapTradeUser(requestParameters, options) {
		        return (0, exports.AuthenticationApiFp)(this.configuration).deleteSnapTradeUser(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of all registered user IDs. Please note that the response is not currently paginated.
		     * @summary List all users
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AuthenticationApiGenerated
		     */
		    listSnapTradeUsers(options) {
		        return (0, exports.AuthenticationApiFp)(this.configuration).listSnapTradeUsers(options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Authenticates a SnapTrade user and returns the Connection Portal URL used for connecting brokerage accounts. Please check [this guide](/docs/implement-connection-portal) for how to integrate the Connection Portal into your app.  Please note that the returned URL expires in 5 minutes.
		     * @summary Generate Connection Portal URL
		     * @param {AuthenticationApiLoginSnapTradeUserRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AuthenticationApiGenerated
		     */
		    loginSnapTradeUser(requestParameters, options) {
		        return (0, exports.AuthenticationApiFp)(this.configuration).loginSnapTradeUser(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Registers a new SnapTrade user under your Client ID. A user secret will be automatically generated for you and must be properly stored in your system. Most SnapTrade operations require a user ID and user secret to be passed in as parameters.
		     * @summary Register user
		     * @param {AuthenticationApiRegisterSnapTradeUserRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AuthenticationApiGenerated
		     */
		    registerSnapTradeUser(requestParameters, options) {
		        return (0, exports.AuthenticationApiFp)(this.configuration).registerSnapTradeUser(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Rotates the secret for a SnapTrade user. You might use this if `userSecret` is compromised. Please note that if you call this endpoint and fail to save the new secret, you\'ll no longer be able to access any data for this user, and your only option will be to delete and recreate the user, then ask them to reconnect.
		     * @summary Rotate user secret
		     * @param {AuthenticationApiResetSnapTradeUserSecretRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof AuthenticationApiGenerated
		     */
		    resetSnapTradeUserSecret(requestParameters, options) {
		        return (0, exports.AuthenticationApiFp)(this.configuration).resetSnapTradeUserSecret(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		}
		exports.AuthenticationApiGenerated = AuthenticationApiGenerated; 
	} (authenticationApiGenerated));
	return authenticationApiGenerated;
}

var hasRequiredAuthenticationApi;

function requireAuthenticationApi () {
	if (hasRequiredAuthenticationApi) return authenticationApi;
	hasRequiredAuthenticationApi = 1;
	(function (exports) {
		var __createBinding = (authenticationApi.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (authenticationApi.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.AuthenticationApi = void 0;
		const authentication_api_generated_1 = requireAuthenticationApiGenerated();
		__exportStar(requireAuthenticationApiGenerated(), exports);
		class AuthenticationApi extends authentication_api_generated_1.AuthenticationApiGenerated {
		}
		exports.AuthenticationApi = AuthenticationApi; 
	} (authenticationApi));
	return authenticationApi;
}

var connectionsApi = {};

var connectionsApiGenerated = {};

var hasRequiredConnectionsApiGenerated;

function requireConnectionsApiGenerated () {
	if (hasRequiredConnectionsApiGenerated) return connectionsApiGenerated;
	hasRequiredConnectionsApiGenerated = 1;
	(function (exports) {
		/* tslint:disable */
		/* eslint-disable */
		/*
		SnapTrade

		Connect brokerage accounts to your app for live positions and trading

		The version of the OpenAPI document: 1.0.0
		Contact: api@snaptrade.com

		NOTE: This file is auto generated by Konfig (https://konfigthis.com).
		*/
		var __awaiter = (connectionsApiGenerated.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ConnectionsApiGenerated = exports.ConnectionsApiFactory = exports.ConnectionsApiFp = exports.ConnectionsApiAxiosParamCreator = void 0;
		const axios_1 = /*@__PURE__*/ requireAxios();
		// Some imports not used depending on template conditions
		// @ts-ignore
		const common_1 = requireCommon();
		// @ts-ignore
		const base_1 = requireBase();
		const requestBeforeHook_1 = requireRequestBeforeHook();
		/**
		 * ConnectionsApi - axios parameter creator
		 * @export
		 */
		const ConnectionsApiAxiosParamCreator = function (configuration) {
		    return {
		        /**
		         * Returns a single connection for the specified ID.
		         * @summary Get connection detail
		         * @param {string} authorizationId
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        detailBrokerageAuthorization: (authorizationId, userId, userSecret, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'authorizationId' is not null or undefined
		            (0, common_1.assertParamExists)('detailBrokerageAuthorization', 'authorizationId', authorizationId);
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('detailBrokerageAuthorization', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('detailBrokerageAuthorization', 'userSecret', userSecret);
		            const localVarPath = `/authorizations/{authorizationId}`
		                .replace(`{${"authorizationId"}}`, encodeURIComponent(String(authorizationId !== undefined ? authorizationId : `-authorizationId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/authorizations/{authorizationId}',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Manually force the specified connection to become disabled. This should only be used for testing a reconnect flow, and never used on production connections. Will trigger a disconnect as if it happened naturally, and send a [`CONNECTION_BROKEN` webhook](/docs/webhooks#webhooks-connection_broken) for the connection.  *Please contact us in order to use this endpoint as it is disabled by default.*
		         * @summary Force disable connection
		         * @param {string} authorizationId
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        disableBrokerageAuthorization: (authorizationId, userId, userSecret, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'authorizationId' is not null or undefined
		            (0, common_1.assertParamExists)('disableBrokerageAuthorization', 'authorizationId', authorizationId);
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('disableBrokerageAuthorization', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('disableBrokerageAuthorization', 'userSecret', userSecret);
		            const localVarPath = `/authorizations/{authorizationId}/disable`
		                .replace(`{${"authorizationId"}}`, encodeURIComponent(String(authorizationId !== undefined ? authorizationId : `-authorizationId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/authorizations/{authorizationId}/disable',
		                httpMethod: 'POST'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of all connections for the specified user. Note that `Connection` and `Brokerage Authorization` are interchangeable, but the term `Connection` is preferred and used in the doc for consistency.  A connection is usually tied to a single login at a brokerage. A single connection can contain multiple brokerage accounts.  SnapTrade performs de-duping on connections for a given user. If the user has an existing connection with the brokerage, when connecting the brokerage with the same credentials, SnapTrade will return the existing connection instead of creating a new one.
		         * @summary List all connections
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listBrokerageAuthorizations: (userId, userSecret, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('listBrokerageAuthorizations', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('listBrokerageAuthorizations', 'userSecret', userSecret);
		            const localVarPath = `/authorizations`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/authorizations',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Trigger a holdings update for all accounts under this connection. Updates will be queued asynchronously. [`ACCOUNT_HOLDINGS_UPDATED` webhook](/docs/webhooks#webhooks-account_holdings_updated) will be sent once the sync completes for each account under the connection.  *Please contact support for access as this endpoint is not enabled by default.*
		         * @summary Refresh holdings for a connection
		         * @param {string} authorizationId
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        refreshBrokerageAuthorization: (authorizationId, userId, userSecret, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'authorizationId' is not null or undefined
		            (0, common_1.assertParamExists)('refreshBrokerageAuthorization', 'authorizationId', authorizationId);
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('refreshBrokerageAuthorization', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('refreshBrokerageAuthorization', 'userSecret', userSecret);
		            const localVarPath = `/authorizations/{authorizationId}/refresh`
		                .replace(`{${"authorizationId"}}`, encodeURIComponent(String(authorizationId !== undefined ? authorizationId : `-authorizationId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/authorizations/{authorizationId}/refresh',
		                httpMethod: 'POST'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Deletes the connection specified by the ID. This will also delete all accounts and holdings associated with the connection. This action is irreversible. This endpoint is synchronous, a 204 response indicates that the connection has been successfully deleted.
		         * @summary Delete connection
		         * @param {string} authorizationId
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        removeBrokerageAuthorization: (authorizationId, userId, userSecret, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'authorizationId' is not null or undefined
		            (0, common_1.assertParamExists)('removeBrokerageAuthorization', 'authorizationId', authorizationId);
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('removeBrokerageAuthorization', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('removeBrokerageAuthorization', 'userSecret', userSecret);
		            const localVarPath = `/authorizations/{authorizationId}`
		                .replace(`{${"authorizationId"}}`, encodeURIComponent(String(authorizationId !== undefined ? authorizationId : `-authorizationId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'DELETE' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/authorizations/{authorizationId}',
		                httpMethod: 'DELETE'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of rate of return percents for a given connection. Will include timeframes available from the brokerage, for example \"ALL\", \"1Y\", \"6M\", \"3M\", \"1M\"
		         * @summary List connection rate of returns
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} authorizationId
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        returnRates: (userId, userSecret, authorizationId, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('returnRates', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('returnRates', 'userSecret', userSecret);
		            // verify required parameter 'authorizationId' is not null or undefined
		            (0, common_1.assertParamExists)('returnRates', 'authorizationId', authorizationId);
		            const localVarPath = `/authorizations/{authorizationId}/returnRates`
		                .replace(`{${"authorizationId"}}`, encodeURIComponent(String(authorizationId !== undefined ? authorizationId : `-authorizationId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/authorizations/{authorizationId}/returnRates',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of session events associated with a user.
		         * @summary Get all session events for a user
		         * @param {string} partnerClientId
		         * @param {string} [userId] Optional comma separated list of user IDs used to filter the request on specific users
		         * @param {string} [sessionId] Optional comma separated list of session IDs used to filter the request on specific users
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        sessionEvents: (partnerClientId, userId, sessionId, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'partnerClientId' is not null or undefined
		            (0, common_1.assertParamExists)('sessionEvents', 'partnerClientId', partnerClientId);
		            const localVarPath = `/sessionEvents`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (partnerClientId !== undefined) {
		                localVarQueryParameter['PartnerClientId'] = partnerClientId;
		            }
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (sessionId !== undefined) {
		                localVarQueryParameter['sessionId'] = sessionId;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/sessionEvents',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		    };
		};
		exports.ConnectionsApiAxiosParamCreator = ConnectionsApiAxiosParamCreator;
		/**
		 * ConnectionsApi - functional programming interface
		 * @export
		 */
		const ConnectionsApiFp = function (configuration) {
		    const localVarAxiosParamCreator = (0, exports.ConnectionsApiAxiosParamCreator)(configuration);
		    return {
		        /**
		         * Returns a single connection for the specified ID.
		         * @summary Get connection detail
		         * @param {ConnectionsApiDetailBrokerageAuthorizationRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        detailBrokerageAuthorization(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.detailBrokerageAuthorization(requestParameters.authorizationId, requestParameters.userId, requestParameters.userSecret, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Manually force the specified connection to become disabled. This should only be used for testing a reconnect flow, and never used on production connections. Will trigger a disconnect as if it happened naturally, and send a [`CONNECTION_BROKEN` webhook](/docs/webhooks#webhooks-connection_broken) for the connection.  *Please contact us in order to use this endpoint as it is disabled by default.*
		         * @summary Force disable connection
		         * @param {ConnectionsApiDisableBrokerageAuthorizationRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        disableBrokerageAuthorization(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.disableBrokerageAuthorization(requestParameters.authorizationId, requestParameters.userId, requestParameters.userSecret, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of all connections for the specified user. Note that `Connection` and `Brokerage Authorization` are interchangeable, but the term `Connection` is preferred and used in the doc for consistency.  A connection is usually tied to a single login at a brokerage. A single connection can contain multiple brokerage accounts.  SnapTrade performs de-duping on connections for a given user. If the user has an existing connection with the brokerage, when connecting the brokerage with the same credentials, SnapTrade will return the existing connection instead of creating a new one.
		         * @summary List all connections
		         * @param {ConnectionsApiListBrokerageAuthorizationsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listBrokerageAuthorizations(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.listBrokerageAuthorizations(requestParameters.userId, requestParameters.userSecret, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Trigger a holdings update for all accounts under this connection. Updates will be queued asynchronously. [`ACCOUNT_HOLDINGS_UPDATED` webhook](/docs/webhooks#webhooks-account_holdings_updated) will be sent once the sync completes for each account under the connection.  *Please contact support for access as this endpoint is not enabled by default.*
		         * @summary Refresh holdings for a connection
		         * @param {ConnectionsApiRefreshBrokerageAuthorizationRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        refreshBrokerageAuthorization(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.refreshBrokerageAuthorization(requestParameters.authorizationId, requestParameters.userId, requestParameters.userSecret, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Deletes the connection specified by the ID. This will also delete all accounts and holdings associated with the connection. This action is irreversible. This endpoint is synchronous, a 204 response indicates that the connection has been successfully deleted.
		         * @summary Delete connection
		         * @param {ConnectionsApiRemoveBrokerageAuthorizationRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        removeBrokerageAuthorization(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.removeBrokerageAuthorization(requestParameters.authorizationId, requestParameters.userId, requestParameters.userSecret, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of rate of return percents for a given connection. Will include timeframes available from the brokerage, for example \"ALL\", \"1Y\", \"6M\", \"3M\", \"1M\"
		         * @summary List connection rate of returns
		         * @param {ConnectionsApiReturnRatesRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        returnRates(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.returnRates(requestParameters.userId, requestParameters.userSecret, requestParameters.authorizationId, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of session events associated with a user.
		         * @summary Get all session events for a user
		         * @param {ConnectionsApiSessionEventsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        sessionEvents(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.sessionEvents(requestParameters.partnerClientId, requestParameters.userId, requestParameters.sessionId, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		    };
		};
		exports.ConnectionsApiFp = ConnectionsApiFp;
		/**
		 * ConnectionsApi - factory interface
		 * @export
		 */
		const ConnectionsApiFactory = function (configuration, basePath, axios) {
		    const localVarFp = (0, exports.ConnectionsApiFp)(configuration);
		    return {
		        /**
		         * Returns a single connection for the specified ID.
		         * @summary Get connection detail
		         * @param {ConnectionsApiDetailBrokerageAuthorizationRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        detailBrokerageAuthorization(requestParameters, options) {
		            return localVarFp.detailBrokerageAuthorization(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Manually force the specified connection to become disabled. This should only be used for testing a reconnect flow, and never used on production connections. Will trigger a disconnect as if it happened naturally, and send a [`CONNECTION_BROKEN` webhook](/docs/webhooks#webhooks-connection_broken) for the connection.  *Please contact us in order to use this endpoint as it is disabled by default.*
		         * @summary Force disable connection
		         * @param {ConnectionsApiDisableBrokerageAuthorizationRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        disableBrokerageAuthorization(requestParameters, options) {
		            return localVarFp.disableBrokerageAuthorization(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of all connections for the specified user. Note that `Connection` and `Brokerage Authorization` are interchangeable, but the term `Connection` is preferred and used in the doc for consistency.  A connection is usually tied to a single login at a brokerage. A single connection can contain multiple brokerage accounts.  SnapTrade performs de-duping on connections for a given user. If the user has an existing connection with the brokerage, when connecting the brokerage with the same credentials, SnapTrade will return the existing connection instead of creating a new one.
		         * @summary List all connections
		         * @param {ConnectionsApiListBrokerageAuthorizationsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listBrokerageAuthorizations(requestParameters, options) {
		            return localVarFp.listBrokerageAuthorizations(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Trigger a holdings update for all accounts under this connection. Updates will be queued asynchronously. [`ACCOUNT_HOLDINGS_UPDATED` webhook](/docs/webhooks#webhooks-account_holdings_updated) will be sent once the sync completes for each account under the connection.  *Please contact support for access as this endpoint is not enabled by default.*
		         * @summary Refresh holdings for a connection
		         * @param {ConnectionsApiRefreshBrokerageAuthorizationRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        refreshBrokerageAuthorization(requestParameters, options) {
		            return localVarFp.refreshBrokerageAuthorization(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Deletes the connection specified by the ID. This will also delete all accounts and holdings associated with the connection. This action is irreversible. This endpoint is synchronous, a 204 response indicates that the connection has been successfully deleted.
		         * @summary Delete connection
		         * @param {ConnectionsApiRemoveBrokerageAuthorizationRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        removeBrokerageAuthorization(requestParameters, options) {
		            return localVarFp.removeBrokerageAuthorization(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of rate of return percents for a given connection. Will include timeframes available from the brokerage, for example \"ALL\", \"1Y\", \"6M\", \"3M\", \"1M\"
		         * @summary List connection rate of returns
		         * @param {ConnectionsApiReturnRatesRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        returnRates(requestParameters, options) {
		            return localVarFp.returnRates(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of session events associated with a user.
		         * @summary Get all session events for a user
		         * @param {ConnectionsApiSessionEventsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        sessionEvents(requestParameters, options) {
		            return localVarFp.sessionEvents(requestParameters, options).then((request) => request(axios, basePath));
		        },
		    };
		};
		exports.ConnectionsApiFactory = ConnectionsApiFactory;
		/**
		 * ConnectionsApiGenerated - object-oriented interface
		 * @export
		 * @class ConnectionsApiGenerated
		 * @extends {BaseAPI}
		 */
		class ConnectionsApiGenerated extends base_1.BaseAPI {
		    /**
		     * Returns a single connection for the specified ID.
		     * @summary Get connection detail
		     * @param {ConnectionsApiDetailBrokerageAuthorizationRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ConnectionsApiGenerated
		     */
		    detailBrokerageAuthorization(requestParameters, options) {
		        return (0, exports.ConnectionsApiFp)(this.configuration).detailBrokerageAuthorization(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Manually force the specified connection to become disabled. This should only be used for testing a reconnect flow, and never used on production connections. Will trigger a disconnect as if it happened naturally, and send a [`CONNECTION_BROKEN` webhook](/docs/webhooks#webhooks-connection_broken) for the connection.  *Please contact us in order to use this endpoint as it is disabled by default.*
		     * @summary Force disable connection
		     * @param {ConnectionsApiDisableBrokerageAuthorizationRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ConnectionsApiGenerated
		     */
		    disableBrokerageAuthorization(requestParameters, options) {
		        return (0, exports.ConnectionsApiFp)(this.configuration).disableBrokerageAuthorization(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of all connections for the specified user. Note that `Connection` and `Brokerage Authorization` are interchangeable, but the term `Connection` is preferred and used in the doc for consistency.  A connection is usually tied to a single login at a brokerage. A single connection can contain multiple brokerage accounts.  SnapTrade performs de-duping on connections for a given user. If the user has an existing connection with the brokerage, when connecting the brokerage with the same credentials, SnapTrade will return the existing connection instead of creating a new one.
		     * @summary List all connections
		     * @param {ConnectionsApiListBrokerageAuthorizationsRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ConnectionsApiGenerated
		     */
		    listBrokerageAuthorizations(requestParameters, options) {
		        return (0, exports.ConnectionsApiFp)(this.configuration).listBrokerageAuthorizations(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Trigger a holdings update for all accounts under this connection. Updates will be queued asynchronously. [`ACCOUNT_HOLDINGS_UPDATED` webhook](/docs/webhooks#webhooks-account_holdings_updated) will be sent once the sync completes for each account under the connection.  *Please contact support for access as this endpoint is not enabled by default.*
		     * @summary Refresh holdings for a connection
		     * @param {ConnectionsApiRefreshBrokerageAuthorizationRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ConnectionsApiGenerated
		     */
		    refreshBrokerageAuthorization(requestParameters, options) {
		        return (0, exports.ConnectionsApiFp)(this.configuration).refreshBrokerageAuthorization(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Deletes the connection specified by the ID. This will also delete all accounts and holdings associated with the connection. This action is irreversible. This endpoint is synchronous, a 204 response indicates that the connection has been successfully deleted.
		     * @summary Delete connection
		     * @param {ConnectionsApiRemoveBrokerageAuthorizationRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ConnectionsApiGenerated
		     */
		    removeBrokerageAuthorization(requestParameters, options) {
		        return (0, exports.ConnectionsApiFp)(this.configuration).removeBrokerageAuthorization(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of rate of return percents for a given connection. Will include timeframes available from the brokerage, for example \"ALL\", \"1Y\", \"6M\", \"3M\", \"1M\"
		     * @summary List connection rate of returns
		     * @param {ConnectionsApiReturnRatesRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ConnectionsApiGenerated
		     */
		    returnRates(requestParameters, options) {
		        return (0, exports.ConnectionsApiFp)(this.configuration).returnRates(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of session events associated with a user.
		     * @summary Get all session events for a user
		     * @param {ConnectionsApiSessionEventsRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ConnectionsApiGenerated
		     */
		    sessionEvents(requestParameters, options) {
		        return (0, exports.ConnectionsApiFp)(this.configuration).sessionEvents(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		}
		exports.ConnectionsApiGenerated = ConnectionsApiGenerated; 
	} (connectionsApiGenerated));
	return connectionsApiGenerated;
}

var hasRequiredConnectionsApi;

function requireConnectionsApi () {
	if (hasRequiredConnectionsApi) return connectionsApi;
	hasRequiredConnectionsApi = 1;
	(function (exports) {
		var __createBinding = (connectionsApi.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (connectionsApi.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ConnectionsApi = void 0;
		const connections_api_generated_1 = requireConnectionsApiGenerated();
		__exportStar(requireConnectionsApiGenerated(), exports);
		class ConnectionsApi extends connections_api_generated_1.ConnectionsApiGenerated {
		}
		exports.ConnectionsApi = ConnectionsApi; 
	} (connectionsApi));
	return connectionsApi;
}

var optionsApi = {};

var optionsApiGenerated = {};

var hasRequiredOptionsApiGenerated;

function requireOptionsApiGenerated () {
	if (hasRequiredOptionsApiGenerated) return optionsApiGenerated;
	hasRequiredOptionsApiGenerated = 1;
	(function (exports) {
		/* tslint:disable */
		/* eslint-disable */
		/*
		SnapTrade

		Connect brokerage accounts to your app for live positions and trading

		The version of the OpenAPI document: 1.0.0
		Contact: api@snaptrade.com

		NOTE: This file is auto generated by Konfig (https://konfigthis.com).
		*/
		var __awaiter = (optionsApiGenerated.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.OptionsApiGenerated = exports.OptionsApiFactory = exports.OptionsApiFp = exports.OptionsApiAxiosParamCreator = void 0;
		const axios_1 = /*@__PURE__*/ requireAxios();
		// Some imports not used depending on template conditions
		// @ts-ignore
		const common_1 = requireCommon();
		// @ts-ignore
		const base_1 = requireBase();
		const requestBeforeHook_1 = requireRequestBeforeHook();
		/**
		 * OptionsApi - axios parameter creator
		 * @export
		 */
		const OptionsApiAxiosParamCreator = function (configuration) {
		    return {
		        /**
		         * Creates an option strategy object that will be used to place an option strategy order.
		         * @summary Create options strategy
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId The ID of the account to create the option strategy object in.
		         * @param {OptionsGetOptionStrategyRequest} optionsGetOptionStrategyRequest
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getOptionStrategy: (userId, userSecret, accountId, optionsGetOptionStrategyRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getOptionStrategy', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getOptionStrategy', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('getOptionStrategy', 'accountId', accountId);
		            // verify required parameter 'optionsGetOptionStrategyRequest' is not null or undefined
		            (0, common_1.assertParamExists)('getOptionStrategy', 'optionsGetOptionStrategyRequest', optionsGetOptionStrategyRequest);
		            const localVarPath = `/accounts/{accountId}/optionStrategy`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            localVarHeaderParameter['Content-Type'] = 'application/json';
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                requestBody: optionsGetOptionStrategyRequest,
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/optionStrategy',
		                httpMethod: 'POST'
		            });
		            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(optionsGetOptionStrategyRequest, localVarRequestOptions, configuration);
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns the option chain for the specified symbol in the specified account.
		         * @summary Get the options chain for a symbol
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId The ID of the account to get the options chain from.
		         * @param {string} symbol Universal symbol ID if symbol
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getOptionsChain: (userId, userSecret, accountId, symbol, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getOptionsChain', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getOptionsChain', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('getOptionsChain', 'accountId', accountId);
		            // verify required parameter 'symbol' is not null or undefined
		            (0, common_1.assertParamExists)('getOptionsChain', 'symbol', symbol);
		            const localVarPath = `/accounts/{accountId}/optionsChain`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            if (symbol !== undefined) {
		                localVarQueryParameter['symbol'] = symbol;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/optionsChain',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a Strategy Quotes object which has latest market data of the specified option strategy.
		         * @summary Get options strategy quotes
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId The ID of the account the strategy will be placed in.
		         * @param {string} optionStrategyId Option strategy id obtained from response when creating option strategy object
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getOptionsStrategyQuote: (userId, userSecret, accountId, optionStrategyId, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getOptionsStrategyQuote', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getOptionsStrategyQuote', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('getOptionsStrategyQuote', 'accountId', accountId);
		            // verify required parameter 'optionStrategyId' is not null or undefined
		            (0, common_1.assertParamExists)('getOptionsStrategyQuote', 'optionStrategyId', optionStrategyId);
		            const localVarPath = `/accounts/{accountId}/optionStrategy/{optionStrategyId}`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)))
		                .replace(`{${"optionStrategyId"}}`, encodeURIComponent(String(optionStrategyId !== undefined ? optionStrategyId : `-optionStrategyId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/optionStrategy/{optionStrategyId}',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of option positions in the specified account. For stock/ETF/crypto/mutual fund positions, please use the [positions endpoint](/reference/Account%20Information/AccountInformation_getUserAccountPositions).  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account option positions
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listOptionHoldings: (userId, userSecret, accountId, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('listOptionHoldings', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('listOptionHoldings', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('listOptionHoldings', 'accountId', accountId);
		            const localVarPath = `/accounts/{accountId}/options`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/options',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Places the option strategy order and returns the order record received from the brokerage.
		         * @summary Place an option strategy order
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId The ID of the account to execute the strategy in.
		         * @param {string} optionStrategyId Option strategy id obtained from response when creating option strategy object
		         * @param {OptionsPlaceOptionStrategyRequest} optionsPlaceOptionStrategyRequest
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        placeOptionStrategy: (userId, userSecret, accountId, optionStrategyId, optionsPlaceOptionStrategyRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('placeOptionStrategy', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('placeOptionStrategy', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('placeOptionStrategy', 'accountId', accountId);
		            // verify required parameter 'optionStrategyId' is not null or undefined
		            (0, common_1.assertParamExists)('placeOptionStrategy', 'optionStrategyId', optionStrategyId);
		            // verify required parameter 'optionsPlaceOptionStrategyRequest' is not null or undefined
		            (0, common_1.assertParamExists)('placeOptionStrategy', 'optionsPlaceOptionStrategyRequest', optionsPlaceOptionStrategyRequest);
		            const localVarPath = `/accounts/{accountId}/optionStrategy/{optionStrategyId}/execute`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)))
		                .replace(`{${"optionStrategyId"}}`, encodeURIComponent(String(optionStrategyId !== undefined ? optionStrategyId : `-optionStrategyId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            localVarHeaderParameter['Content-Type'] = 'application/json';
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                requestBody: optionsPlaceOptionStrategyRequest,
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/optionStrategy/{optionStrategyId}/execute',
		                httpMethod: 'POST'
		            });
		            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(optionsPlaceOptionStrategyRequest, localVarRequestOptions, configuration);
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		    };
		};
		exports.OptionsApiAxiosParamCreator = OptionsApiAxiosParamCreator;
		/**
		 * OptionsApi - functional programming interface
		 * @export
		 */
		const OptionsApiFp = function (configuration) {
		    const localVarAxiosParamCreator = (0, exports.OptionsApiAxiosParamCreator)(configuration);
		    return {
		        /**
		         * Creates an option strategy object that will be used to place an option strategy order.
		         * @summary Create options strategy
		         * @param {OptionsApiGetOptionStrategyRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getOptionStrategy(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const optionsGetOptionStrategyRequest = {
		                    underlying_symbol_id: requestParameters.underlying_symbol_id,
		                    legs: requestParameters.legs,
		                    strategy_type: requestParameters.strategy_type
		                };
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getOptionStrategy(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, optionsGetOptionStrategyRequest, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns the option chain for the specified symbol in the specified account.
		         * @summary Get the options chain for a symbol
		         * @param {OptionsApiGetOptionsChainRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getOptionsChain(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getOptionsChain(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, requestParameters.symbol, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a Strategy Quotes object which has latest market data of the specified option strategy.
		         * @summary Get options strategy quotes
		         * @param {OptionsApiGetOptionsStrategyQuoteRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getOptionsStrategyQuote(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getOptionsStrategyQuote(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, requestParameters.optionStrategyId, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of option positions in the specified account. For stock/ETF/crypto/mutual fund positions, please use the [positions endpoint](/reference/Account%20Information/AccountInformation_getUserAccountPositions).  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account option positions
		         * @param {OptionsApiListOptionHoldingsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listOptionHoldings(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.listOptionHoldings(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Places the option strategy order and returns the order record received from the brokerage.
		         * @summary Place an option strategy order
		         * @param {OptionsApiPlaceOptionStrategyRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        placeOptionStrategy(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const optionsPlaceOptionStrategyRequest = {
		                    order_type: requestParameters.order_type,
		                    time_in_force: requestParameters.time_in_force,
		                    price: requestParameters.price
		                };
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.placeOptionStrategy(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, requestParameters.optionStrategyId, optionsPlaceOptionStrategyRequest, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		    };
		};
		exports.OptionsApiFp = OptionsApiFp;
		/**
		 * OptionsApi - factory interface
		 * @export
		 */
		const OptionsApiFactory = function (configuration, basePath, axios) {
		    const localVarFp = (0, exports.OptionsApiFp)(configuration);
		    return {
		        /**
		         * Creates an option strategy object that will be used to place an option strategy order.
		         * @summary Create options strategy
		         * @param {OptionsApiGetOptionStrategyRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getOptionStrategy(requestParameters, options) {
		            return localVarFp.getOptionStrategy(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns the option chain for the specified symbol in the specified account.
		         * @summary Get the options chain for a symbol
		         * @param {OptionsApiGetOptionsChainRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getOptionsChain(requestParameters, options) {
		            return localVarFp.getOptionsChain(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a Strategy Quotes object which has latest market data of the specified option strategy.
		         * @summary Get options strategy quotes
		         * @param {OptionsApiGetOptionsStrategyQuoteRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getOptionsStrategyQuote(requestParameters, options) {
		            return localVarFp.getOptionsStrategyQuote(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of option positions in the specified account. For stock/ETF/crypto/mutual fund positions, please use the [positions endpoint](/reference/Account%20Information/AccountInformation_getUserAccountPositions).  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary List account option positions
		         * @param {OptionsApiListOptionHoldingsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listOptionHoldings(requestParameters, options) {
		            return localVarFp.listOptionHoldings(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Places the option strategy order and returns the order record received from the brokerage.
		         * @summary Place an option strategy order
		         * @param {OptionsApiPlaceOptionStrategyRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        placeOptionStrategy(requestParameters, options) {
		            return localVarFp.placeOptionStrategy(requestParameters, options).then((request) => request(axios, basePath));
		        },
		    };
		};
		exports.OptionsApiFactory = OptionsApiFactory;
		/**
		 * OptionsApiGenerated - object-oriented interface
		 * @export
		 * @class OptionsApiGenerated
		 * @extends {BaseAPI}
		 */
		class OptionsApiGenerated extends base_1.BaseAPI {
		    /**
		     * Creates an option strategy object that will be used to place an option strategy order.
		     * @summary Create options strategy
		     * @param {OptionsApiGetOptionStrategyRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof OptionsApiGenerated
		     */
		    getOptionStrategy(requestParameters, options) {
		        return (0, exports.OptionsApiFp)(this.configuration).getOptionStrategy(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns the option chain for the specified symbol in the specified account.
		     * @summary Get the options chain for a symbol
		     * @param {OptionsApiGetOptionsChainRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof OptionsApiGenerated
		     */
		    getOptionsChain(requestParameters, options) {
		        return (0, exports.OptionsApiFp)(this.configuration).getOptionsChain(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a Strategy Quotes object which has latest market data of the specified option strategy.
		     * @summary Get options strategy quotes
		     * @param {OptionsApiGetOptionsStrategyQuoteRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof OptionsApiGenerated
		     */
		    getOptionsStrategyQuote(requestParameters, options) {
		        return (0, exports.OptionsApiFp)(this.configuration).getOptionsStrategyQuote(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of option positions in the specified account. For stock/ETF/crypto/mutual fund positions, please use the [positions endpoint](/reference/Account%20Information/AccountInformation_getUserAccountPositions).  The data returned here is cached. How long the data is cached for varies by brokerage. Check the [brokerage integrations doc](https://snaptrade.notion.site/66793431ad0b416489eaabaf248d0afb?v=d16c4c97b8d5438bbb2d8581ac53b11e) and look for \"Cache Expiry Time\" to see the exact value for a specific brokerage. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		     * @summary List account option positions
		     * @param {OptionsApiListOptionHoldingsRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof OptionsApiGenerated
		     */
		    listOptionHoldings(requestParameters, options) {
		        return (0, exports.OptionsApiFp)(this.configuration).listOptionHoldings(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Places the option strategy order and returns the order record received from the brokerage.
		     * @summary Place an option strategy order
		     * @param {OptionsApiPlaceOptionStrategyRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof OptionsApiGenerated
		     */
		    placeOptionStrategy(requestParameters, options) {
		        return (0, exports.OptionsApiFp)(this.configuration).placeOptionStrategy(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		}
		exports.OptionsApiGenerated = OptionsApiGenerated; 
	} (optionsApiGenerated));
	return optionsApiGenerated;
}

var hasRequiredOptionsApi;

function requireOptionsApi () {
	if (hasRequiredOptionsApi) return optionsApi;
	hasRequiredOptionsApi = 1;
	(function (exports) {
		var __createBinding = (optionsApi.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (optionsApi.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.OptionsApi = void 0;
		const options_api_generated_1 = requireOptionsApiGenerated();
		__exportStar(requireOptionsApiGenerated(), exports);
		class OptionsApi extends options_api_generated_1.OptionsApiGenerated {
		}
		exports.OptionsApi = OptionsApi; 
	} (optionsApi));
	return optionsApi;
}

var referenceDataApi = {};

var referenceDataApiGenerated = {};

var hasRequiredReferenceDataApiGenerated;

function requireReferenceDataApiGenerated () {
	if (hasRequiredReferenceDataApiGenerated) return referenceDataApiGenerated;
	hasRequiredReferenceDataApiGenerated = 1;
	(function (exports) {
		/* tslint:disable */
		/* eslint-disable */
		/*
		SnapTrade

		Connect brokerage accounts to your app for live positions and trading

		The version of the OpenAPI document: 1.0.0
		Contact: api@snaptrade.com

		NOTE: This file is auto generated by Konfig (https://konfigthis.com).
		*/
		var __awaiter = (referenceDataApiGenerated.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ReferenceDataApiGenerated = exports.ReferenceDataApiFactory = exports.ReferenceDataApiFp = exports.ReferenceDataApiAxiosParamCreator = void 0;
		const axios_1 = /*@__PURE__*/ requireAxios();
		// Some imports not used depending on template conditions
		// @ts-ignore
		const common_1 = requireCommon();
		// @ts-ignore
		const base_1 = requireBase();
		const requestBeforeHook_1 = requireRequestBeforeHook();
		/**
		 * ReferenceDataApi - axios parameter creator
		 * @export
		 */
		const ReferenceDataApiAxiosParamCreator = function (configuration) {
		    return {
		        /**
		         * Returns an Exchange Rate Pair object for the specified Currency Pair.
		         * @summary Get exchange rate of a currency pair
		         * @param {string} currencyPair A currency pair based on currency code for example, {CAD-USD}
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getCurrencyExchangeRatePair: (currencyPair, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'currencyPair' is not null or undefined
		            (0, common_1.assertParamExists)('getCurrencyExchangeRatePair', 'currencyPair', currencyPair);
		            const localVarPath = `/currencies/rates/{currencyPair}`
		                .replace(`{${"currencyPair"}}`, encodeURIComponent(String(currencyPair !== undefined ? currencyPair : `-currencyPair-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/currencies/rates/{currencyPair}',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns configurations for your SnapTrade Client ID, including allowed brokerages and data access.
		         * @summary Get Client Info
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getPartnerInfo: (options = {}) => __awaiter(this, void 0, void 0, function* () {
		            const localVarPath = `/snapTrade/partners`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/snapTrade/partners',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Return all available security types supported by SnapTrade.
		         * @summary List security types
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getSecurityTypes: (options = {}) => __awaiter(this, void 0, void 0, function* () {
		            const localVarPath = `/securityTypes`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/securityTypes',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of all supported Exchanges.
		         * @summary Get exchanges
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getStockExchanges: (options = {}) => __awaiter(this, void 0, void 0, function* () {
		            const localVarPath = `/exchanges`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/exchanges',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of Universal Symbol objects that match the given query. The matching takes into consideration both the ticker and the name of the symbol. Only the first 20 results are returned.
		         * @summary Search symbols
		         * @param {SymbolQuery} [symbolQuery]
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getSymbols: (symbolQuery, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            const localVarPath = `/symbols`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            localVarHeaderParameter['Content-Type'] = 'application/json';
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                requestBody: symbolQuery,
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/symbols',
		                httpMethod: 'POST'
		            });
		            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(symbolQuery, localVarRequestOptions, configuration);
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns the Universal Symbol object specified by the ticker or the Universal Symbol ID. When a ticker is specified, the first matching result is returned. We largely follow the [Yahoo Finance ticker format](https://help.yahoo.com/kb/SLN2310.html)(click on \"Yahoo Finance Market Coverage and Data Delays\"). For example, for securities traded on the Toronto Stock Exchange, the symbol has a \'.TO\' suffix. For securities traded on NASDAQ or NYSE, the symbol does not have a suffix. Please use the ticker with the proper suffix for the best results.
		         * @summary Get symbol detail
		         * @param {string} query The ticker or Universal Symbol ID to look up the symbol with.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getSymbolsByTicker: (query, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'query' is not null or undefined
		            (0, common_1.assertParamExists)('getSymbolsByTicker', 'query', query);
		            const localVarPath = `/symbols/{query}`
		                .replace(`{${"query"}}`, encodeURIComponent(String(query !== undefined ? query : `-query-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/symbols/{query}',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of all defined Brokerage authorization Type objects.
		         * @summary Get all brokerage authorization types
		         * @param {string} [brokerage] Comma separated value of brokerage slugs
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listAllBrokerageAuthorizationType: (brokerage, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            const localVarPath = `/brokerageAuthorizationTypes`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (brokerage !== undefined) {
		                localVarQueryParameter['brokerage'] = brokerage;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/brokerageAuthorizationTypes',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of all defined Brokerage objects.
		         * @summary Get brokerages
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listAllBrokerages: (options = {}) => __awaiter(this, void 0, void 0, function* () {
		            const localVarPath = `/brokerages`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/brokerages',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of all defined Currency objects.
		         * @summary Get currencies
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listAllCurrencies: (options = {}) => __awaiter(this, void 0, void 0, function* () {
		            const localVarPath = `/currencies`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/currencies',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of all Exchange Rate Pairs for all supported Currencies.
		         * @summary Get currency exchange rates
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listAllCurrenciesRates: (options = {}) => __awaiter(this, void 0, void 0, function* () {
		            const localVarPath = `/currencies/rates`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/currencies/rates',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns a list of Universal Symbol objects that match the given query. The matching takes into consideration both the ticker and the name of the symbol. Only the first 20 results are returned.  The search results are further limited to the symbols supported by the brokerage for which the account is under.
		         * @summary Search account symbols
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId
		         * @param {SymbolQuery} [symbolQuery]
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        symbolSearchUserAccount: (userId, userSecret, accountId, symbolQuery, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('symbolSearchUserAccount', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('symbolSearchUserAccount', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('symbolSearchUserAccount', 'accountId', accountId);
		            const localVarPath = `/accounts/{accountId}/symbols`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            localVarHeaderParameter['Content-Type'] = 'application/json';
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                requestBody: symbolQuery,
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/symbols',
		                httpMethod: 'POST'
		            });
		            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(symbolQuery, localVarRequestOptions, configuration);
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		    };
		};
		exports.ReferenceDataApiAxiosParamCreator = ReferenceDataApiAxiosParamCreator;
		/**
		 * ReferenceDataApi - functional programming interface
		 * @export
		 */
		const ReferenceDataApiFp = function (configuration) {
		    const localVarAxiosParamCreator = (0, exports.ReferenceDataApiAxiosParamCreator)(configuration);
		    return {
		        /**
		         * Returns an Exchange Rate Pair object for the specified Currency Pair.
		         * @summary Get exchange rate of a currency pair
		         * @param {ReferenceDataApiGetCurrencyExchangeRatePairRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getCurrencyExchangeRatePair(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getCurrencyExchangeRatePair(requestParameters.currencyPair, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns configurations for your SnapTrade Client ID, including allowed brokerages and data access.
		         * @summary Get Client Info
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getPartnerInfo(options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getPartnerInfo(options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Return all available security types supported by SnapTrade.
		         * @summary List security types
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getSecurityTypes(options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getSecurityTypes(options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of all supported Exchanges.
		         * @summary Get exchanges
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getStockExchanges(options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getStockExchanges(options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of Universal Symbol objects that match the given query. The matching takes into consideration both the ticker and the name of the symbol. Only the first 20 results are returned.
		         * @summary Search symbols
		         * @param {ReferenceDataApiGetSymbolsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getSymbols(requestParameters = {}, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const symbolQuery = {
		                    substring: requestParameters.substring
		                };
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getSymbols(symbolQuery, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns the Universal Symbol object specified by the ticker or the Universal Symbol ID. When a ticker is specified, the first matching result is returned. We largely follow the [Yahoo Finance ticker format](https://help.yahoo.com/kb/SLN2310.html)(click on \"Yahoo Finance Market Coverage and Data Delays\"). For example, for securities traded on the Toronto Stock Exchange, the symbol has a \'.TO\' suffix. For securities traded on NASDAQ or NYSE, the symbol does not have a suffix. Please use the ticker with the proper suffix for the best results.
		         * @summary Get symbol detail
		         * @param {ReferenceDataApiGetSymbolsByTickerRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getSymbolsByTicker(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getSymbolsByTicker(requestParameters.query, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of all defined Brokerage authorization Type objects.
		         * @summary Get all brokerage authorization types
		         * @param {ReferenceDataApiListAllBrokerageAuthorizationTypeRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listAllBrokerageAuthorizationType(requestParameters = {}, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.listAllBrokerageAuthorizationType(requestParameters.brokerage, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of all defined Brokerage objects.
		         * @summary Get brokerages
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listAllBrokerages(options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.listAllBrokerages(options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of all defined Currency objects.
		         * @summary Get currencies
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listAllCurrencies(options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.listAllCurrencies(options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of all Exchange Rate Pairs for all supported Currencies.
		         * @summary Get currency exchange rates
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listAllCurrenciesRates(options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.listAllCurrenciesRates(options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns a list of Universal Symbol objects that match the given query. The matching takes into consideration both the ticker and the name of the symbol. Only the first 20 results are returned.  The search results are further limited to the symbols supported by the brokerage for which the account is under.
		         * @summary Search account symbols
		         * @param {ReferenceDataApiSymbolSearchUserAccountRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        symbolSearchUserAccount(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const symbolQuery = {
		                    substring: requestParameters.substring
		                };
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.symbolSearchUserAccount(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, symbolQuery, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		    };
		};
		exports.ReferenceDataApiFp = ReferenceDataApiFp;
		/**
		 * ReferenceDataApi - factory interface
		 * @export
		 */
		const ReferenceDataApiFactory = function (configuration, basePath, axios) {
		    const localVarFp = (0, exports.ReferenceDataApiFp)(configuration);
		    return {
		        /**
		         * Returns an Exchange Rate Pair object for the specified Currency Pair.
		         * @summary Get exchange rate of a currency pair
		         * @param {ReferenceDataApiGetCurrencyExchangeRatePairRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getCurrencyExchangeRatePair(requestParameters, options) {
		            return localVarFp.getCurrencyExchangeRatePair(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns configurations for your SnapTrade Client ID, including allowed brokerages and data access.
		         * @summary Get Client Info
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getPartnerInfo(options) {
		            return localVarFp.getPartnerInfo(options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Return all available security types supported by SnapTrade.
		         * @summary List security types
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getSecurityTypes(options) {
		            return localVarFp.getSecurityTypes(options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of all supported Exchanges.
		         * @summary Get exchanges
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getStockExchanges(options) {
		            return localVarFp.getStockExchanges(options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of Universal Symbol objects that match the given query. The matching takes into consideration both the ticker and the name of the symbol. Only the first 20 results are returned.
		         * @summary Search symbols
		         * @param {ReferenceDataApiGetSymbolsRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getSymbols(requestParameters = {}, options) {
		            return localVarFp.getSymbols(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns the Universal Symbol object specified by the ticker or the Universal Symbol ID. When a ticker is specified, the first matching result is returned. We largely follow the [Yahoo Finance ticker format](https://help.yahoo.com/kb/SLN2310.html)(click on \"Yahoo Finance Market Coverage and Data Delays\"). For example, for securities traded on the Toronto Stock Exchange, the symbol has a \'.TO\' suffix. For securities traded on NASDAQ or NYSE, the symbol does not have a suffix. Please use the ticker with the proper suffix for the best results.
		         * @summary Get symbol detail
		         * @param {ReferenceDataApiGetSymbolsByTickerRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getSymbolsByTicker(requestParameters, options) {
		            return localVarFp.getSymbolsByTicker(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of all defined Brokerage authorization Type objects.
		         * @summary Get all brokerage authorization types
		         * @param {ReferenceDataApiListAllBrokerageAuthorizationTypeRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listAllBrokerageAuthorizationType(requestParameters = {}, options) {
		            return localVarFp.listAllBrokerageAuthorizationType(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of all defined Brokerage objects.
		         * @summary Get brokerages
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listAllBrokerages(options) {
		            return localVarFp.listAllBrokerages(options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of all defined Currency objects.
		         * @summary Get currencies
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listAllCurrencies(options) {
		            return localVarFp.listAllCurrencies(options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of all Exchange Rate Pairs for all supported Currencies.
		         * @summary Get currency exchange rates
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        listAllCurrenciesRates(options) {
		            return localVarFp.listAllCurrenciesRates(options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns a list of Universal Symbol objects that match the given query. The matching takes into consideration both the ticker and the name of the symbol. Only the first 20 results are returned.  The search results are further limited to the symbols supported by the brokerage for which the account is under.
		         * @summary Search account symbols
		         * @param {ReferenceDataApiSymbolSearchUserAccountRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        symbolSearchUserAccount(requestParameters, options) {
		            return localVarFp.symbolSearchUserAccount(requestParameters, options).then((request) => request(axios, basePath));
		        },
		    };
		};
		exports.ReferenceDataApiFactory = ReferenceDataApiFactory;
		/**
		 * ReferenceDataApiGenerated - object-oriented interface
		 * @export
		 * @class ReferenceDataApiGenerated
		 * @extends {BaseAPI}
		 */
		class ReferenceDataApiGenerated extends base_1.BaseAPI {
		    /**
		     * Returns an Exchange Rate Pair object for the specified Currency Pair.
		     * @summary Get exchange rate of a currency pair
		     * @param {ReferenceDataApiGetCurrencyExchangeRatePairRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ReferenceDataApiGenerated
		     */
		    getCurrencyExchangeRatePair(requestParameters, options) {
		        return (0, exports.ReferenceDataApiFp)(this.configuration).getCurrencyExchangeRatePair(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns configurations for your SnapTrade Client ID, including allowed brokerages and data access.
		     * @summary Get Client Info
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ReferenceDataApiGenerated
		     */
		    getPartnerInfo(options) {
		        return (0, exports.ReferenceDataApiFp)(this.configuration).getPartnerInfo(options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Return all available security types supported by SnapTrade.
		     * @summary List security types
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ReferenceDataApiGenerated
		     */
		    getSecurityTypes(options) {
		        return (0, exports.ReferenceDataApiFp)(this.configuration).getSecurityTypes(options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of all supported Exchanges.
		     * @summary Get exchanges
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ReferenceDataApiGenerated
		     */
		    getStockExchanges(options) {
		        return (0, exports.ReferenceDataApiFp)(this.configuration).getStockExchanges(options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of Universal Symbol objects that match the given query. The matching takes into consideration both the ticker and the name of the symbol. Only the first 20 results are returned.
		     * @summary Search symbols
		     * @param {ReferenceDataApiGetSymbolsRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ReferenceDataApiGenerated
		     */
		    getSymbols(requestParameters = {}, options) {
		        return (0, exports.ReferenceDataApiFp)(this.configuration).getSymbols(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns the Universal Symbol object specified by the ticker or the Universal Symbol ID. When a ticker is specified, the first matching result is returned. We largely follow the [Yahoo Finance ticker format](https://help.yahoo.com/kb/SLN2310.html)(click on \"Yahoo Finance Market Coverage and Data Delays\"). For example, for securities traded on the Toronto Stock Exchange, the symbol has a \'.TO\' suffix. For securities traded on NASDAQ or NYSE, the symbol does not have a suffix. Please use the ticker with the proper suffix for the best results.
		     * @summary Get symbol detail
		     * @param {ReferenceDataApiGetSymbolsByTickerRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ReferenceDataApiGenerated
		     */
		    getSymbolsByTicker(requestParameters, options) {
		        return (0, exports.ReferenceDataApiFp)(this.configuration).getSymbolsByTicker(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of all defined Brokerage authorization Type objects.
		     * @summary Get all brokerage authorization types
		     * @param {ReferenceDataApiListAllBrokerageAuthorizationTypeRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ReferenceDataApiGenerated
		     */
		    listAllBrokerageAuthorizationType(requestParameters = {}, options) {
		        return (0, exports.ReferenceDataApiFp)(this.configuration).listAllBrokerageAuthorizationType(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of all defined Brokerage objects.
		     * @summary Get brokerages
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ReferenceDataApiGenerated
		     */
		    listAllBrokerages(options) {
		        return (0, exports.ReferenceDataApiFp)(this.configuration).listAllBrokerages(options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of all defined Currency objects.
		     * @summary Get currencies
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ReferenceDataApiGenerated
		     */
		    listAllCurrencies(options) {
		        return (0, exports.ReferenceDataApiFp)(this.configuration).listAllCurrencies(options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of all Exchange Rate Pairs for all supported Currencies.
		     * @summary Get currency exchange rates
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ReferenceDataApiGenerated
		     */
		    listAllCurrenciesRates(options) {
		        return (0, exports.ReferenceDataApiFp)(this.configuration).listAllCurrenciesRates(options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns a list of Universal Symbol objects that match the given query. The matching takes into consideration both the ticker and the name of the symbol. Only the first 20 results are returned.  The search results are further limited to the symbols supported by the brokerage for which the account is under.
		     * @summary Search account symbols
		     * @param {ReferenceDataApiSymbolSearchUserAccountRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof ReferenceDataApiGenerated
		     */
		    symbolSearchUserAccount(requestParameters, options) {
		        return (0, exports.ReferenceDataApiFp)(this.configuration).symbolSearchUserAccount(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		}
		exports.ReferenceDataApiGenerated = ReferenceDataApiGenerated; 
	} (referenceDataApiGenerated));
	return referenceDataApiGenerated;
}

var hasRequiredReferenceDataApi;

function requireReferenceDataApi () {
	if (hasRequiredReferenceDataApi) return referenceDataApi;
	hasRequiredReferenceDataApi = 1;
	(function (exports) {
		var __createBinding = (referenceDataApi.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (referenceDataApi.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ReferenceDataApi = void 0;
		const reference_data_api_generated_1 = requireReferenceDataApiGenerated();
		__exportStar(requireReferenceDataApiGenerated(), exports);
		class ReferenceDataApi extends reference_data_api_generated_1.ReferenceDataApiGenerated {
		}
		exports.ReferenceDataApi = ReferenceDataApi; 
	} (referenceDataApi));
	return referenceDataApi;
}

var tradingApi = {};

var tradingApiGenerated = {};

var hasRequiredTradingApiGenerated;

function requireTradingApiGenerated () {
	if (hasRequiredTradingApiGenerated) return tradingApiGenerated;
	hasRequiredTradingApiGenerated = 1;
	(function (exports) {
		/* tslint:disable */
		/* eslint-disable */
		/*
		SnapTrade

		Connect brokerage accounts to your app for live positions and trading

		The version of the OpenAPI document: 1.0.0
		Contact: api@snaptrade.com

		NOTE: This file is auto generated by Konfig (https://konfigthis.com).
		*/
		var __awaiter = (tradingApiGenerated.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.TradingApiGenerated = exports.TradingApiFactory = exports.TradingApiFp = exports.TradingApiAxiosParamCreator = void 0;
		const axios_1 = /*@__PURE__*/ requireAxios();
		// Some imports not used depending on template conditions
		// @ts-ignore
		const common_1 = requireCommon();
		// @ts-ignore
		const base_1 = requireBase();
		const requestBeforeHook_1 = requireRequestBeforeHook();
		/**
		 * TradingApi - axios parameter creator
		 * @export
		 */
		const TradingApiAxiosParamCreator = function (configuration) {
		    return {
		        /**
		         * Attempts to cancel an open order with the brokerage. If the order is no longer cancellable, the request will be rejected.
		         * @summary Cancel order
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} accountId
		         * @param {TradingCancelUserAccountOrderRequest} tradingCancelUserAccountOrderRequest
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        cancelUserAccountOrder: (userId, userSecret, accountId, tradingCancelUserAccountOrderRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('cancelUserAccountOrder', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('cancelUserAccountOrder', 'userSecret', userSecret);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('cancelUserAccountOrder', 'accountId', accountId);
		            // verify required parameter 'tradingCancelUserAccountOrderRequest' is not null or undefined
		            (0, common_1.assertParamExists)('cancelUserAccountOrder', 'tradingCancelUserAccountOrderRequest', tradingCancelUserAccountOrderRequest);
		            const localVarPath = `/accounts/{accountId}/orders/cancel`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            localVarHeaderParameter['Content-Type'] = 'application/json';
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                requestBody: tradingCancelUserAccountOrderRequest,
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/orders/cancel',
		                httpMethod: 'POST'
		            });
		            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(tradingCancelUserAccountOrderRequest, localVarRequestOptions, configuration);
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Simulates an order and its impact on the account. This endpoint does not place the order with the brokerage. If successful, it returns a `Trade` object and the ID of the object can be used to place the order with the brokerage using the [place checked order endpoint](/reference/Trading/Trading_placeOrder). Please note that the `Trade` object returned expires after 5 minutes. Any order placed using an expired `Trade` will be rejected.
		         * @summary Check order impact
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {ManualTradeForm} manualTradeForm
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getOrderImpact: (userId, userSecret, manualTradeForm, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getOrderImpact', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getOrderImpact', 'userSecret', userSecret);
		            // verify required parameter 'manualTradeForm' is not null or undefined
		            (0, common_1.assertParamExists)('getOrderImpact', 'manualTradeForm', manualTradeForm);
		            const localVarPath = `/trade/impact`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            localVarHeaderParameter['Content-Type'] = 'application/json';
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                requestBody: manualTradeForm,
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/trade/impact',
		                httpMethod: 'POST'
		            });
		            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(manualTradeForm, localVarRequestOptions, configuration);
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns quotes from the brokerage for the specified symbols and account. The quotes returned can be delayed depending on the brokerage the account belongs to. It is highly recommended that you use your own market data provider for real-time quotes instead of relying on this endpoint. This endpoint does not work for options quotes.
		         * @summary Get symbol quotes
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} symbols List of Universal Symbol IDs or tickers to get quotes for. When providing multiple values, use a comma as separator
		         * @param {string} accountId
		         * @param {boolean} [useTicker] Should be set to &#x60;True&#x60; if &#x60;symbols&#x60; are comprised of tickers. Defaults to &#x60;False&#x60; if not provided.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountQuotes: (userId, userSecret, symbols, accountId, useTicker, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountQuotes', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountQuotes', 'userSecret', userSecret);
		            // verify required parameter 'symbols' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountQuotes', 'symbols', symbols);
		            // verify required parameter 'accountId' is not null or undefined
		            (0, common_1.assertParamExists)('getUserAccountQuotes', 'accountId', accountId);
		            const localVarPath = `/accounts/{accountId}/quotes`
		                .replace(`{${"accountId"}}`, encodeURIComponent(String(accountId !== undefined ? accountId : `-accountId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            if (symbols !== undefined) {
		                localVarQueryParameter['symbols'] = symbols;
		            }
		            if (useTicker !== undefined) {
		                localVarQueryParameter['use_ticker'] = useTicker;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/accounts/{accountId}/quotes',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Places a brokerage order in the specified account. The order could be rejected by the brokerage if it is invalid or if the account does not have sufficient funds.  This endpoint does not compute the impact to the account balance from the order and any potential commissions before submitting the order to the brokerage. If that is desired, you can use the [check order impact endpoint](/reference/Trading/Trading_getOrderImpact).  It\'s recommended to trigger a manual refresh of the account after placing an order to ensure the account is up to date. You can use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint for this.
		         * @summary Place order
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {ManualTradeFormWithOptions} manualTradeFormWithOptions
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        placeForceOrder: (userId, userSecret, manualTradeFormWithOptions, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('placeForceOrder', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('placeForceOrder', 'userSecret', userSecret);
		            // verify required parameter 'manualTradeFormWithOptions' is not null or undefined
		            (0, common_1.assertParamExists)('placeForceOrder', 'manualTradeFormWithOptions', manualTradeFormWithOptions);
		            const localVarPath = `/trade/place`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            localVarHeaderParameter['Content-Type'] = 'application/json';
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                requestBody: manualTradeFormWithOptions,
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/trade/place',
		                httpMethod: 'POST'
		            });
		            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(manualTradeFormWithOptions, localVarRequestOptions, configuration);
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Places the previously checked order with the brokerage. The `tradeId` is obtained from the [check order impact endpoint](/reference/Trading/Trading_getOrderImpact). If you prefer to place the order without checking for impact first, you can use the [place order endpoint](/reference/Trading/Trading_placeForceOrder).  It\'s recommended to trigger a manual refresh of the account after placing an order to ensure the account is up to date. You can use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint for this.
		         * @summary Place checked order
		         * @param {string} tradeId Obtained from calling the [check order impact endpoint](/reference/Trading/Trading_getOrderImpact)
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {ValidatedTradeBody} [validatedTradeBody]
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        placeOrder: (tradeId, userId, userSecret, validatedTradeBody, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'tradeId' is not null or undefined
		            (0, common_1.assertParamExists)('placeOrder', 'tradeId', tradeId);
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('placeOrder', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('placeOrder', 'userSecret', userSecret);
		            const localVarPath = `/trade/{tradeId}`
		                .replace(`{${"tradeId"}}`, encodeURIComponent(String(tradeId !== undefined ? tradeId : `-tradeId-`)));
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            localVarHeaderParameter['Content-Type'] = 'application/json';
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                requestBody: validatedTradeBody,
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/trade/{tradeId}',
		                httpMethod: 'POST'
		            });
		            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(validatedTradeBody, localVarRequestOptions, configuration);
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		    };
		};
		exports.TradingApiAxiosParamCreator = TradingApiAxiosParamCreator;
		/**
		 * TradingApi - functional programming interface
		 * @export
		 */
		const TradingApiFp = function (configuration) {
		    const localVarAxiosParamCreator = (0, exports.TradingApiAxiosParamCreator)(configuration);
		    return {
		        /**
		         * Attempts to cancel an open order with the brokerage. If the order is no longer cancellable, the request will be rejected.
		         * @summary Cancel order
		         * @param {TradingApiCancelUserAccountOrderRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        cancelUserAccountOrder(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const tradingCancelUserAccountOrderRequest = {
		                    brokerage_order_id: requestParameters.brokerage_order_id
		                };
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.cancelUserAccountOrder(requestParameters.userId, requestParameters.userSecret, requestParameters.accountId, tradingCancelUserAccountOrderRequest, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Simulates an order and its impact on the account. This endpoint does not place the order with the brokerage. If successful, it returns a `Trade` object and the ID of the object can be used to place the order with the brokerage using the [place checked order endpoint](/reference/Trading/Trading_placeOrder). Please note that the `Trade` object returned expires after 5 minutes. Any order placed using an expired `Trade` will be rejected.
		         * @summary Check order impact
		         * @param {TradingApiGetOrderImpactRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getOrderImpact(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const manualTradeForm = {
		                    account_id: requestParameters.account_id,
		                    action: requestParameters.action,
		                    universal_symbol_id: requestParameters.universal_symbol_id,
		                    order_type: requestParameters.order_type,
		                    time_in_force: requestParameters.time_in_force,
		                    price: requestParameters.price,
		                    stop: requestParameters.stop,
		                    units: requestParameters.units,
		                    notional_value: requestParameters.notional_value
		                };
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getOrderImpact(requestParameters.userId, requestParameters.userSecret, manualTradeForm, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns quotes from the brokerage for the specified symbols and account. The quotes returned can be delayed depending on the brokerage the account belongs to. It is highly recommended that you use your own market data provider for real-time quotes instead of relying on this endpoint. This endpoint does not work for options quotes.
		         * @summary Get symbol quotes
		         * @param {TradingApiGetUserAccountQuotesRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountQuotes(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getUserAccountQuotes(requestParameters.userId, requestParameters.userSecret, requestParameters.symbols, requestParameters.accountId, requestParameters.useTicker, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Places a brokerage order in the specified account. The order could be rejected by the brokerage if it is invalid or if the account does not have sufficient funds.  This endpoint does not compute the impact to the account balance from the order and any potential commissions before submitting the order to the brokerage. If that is desired, you can use the [check order impact endpoint](/reference/Trading/Trading_getOrderImpact).  It\'s recommended to trigger a manual refresh of the account after placing an order to ensure the account is up to date. You can use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint for this.
		         * @summary Place order
		         * @param {TradingApiPlaceForceOrderRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        placeForceOrder(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const manualTradeFormWithOptions = {
		                    account_id: requestParameters.account_id,
		                    action: requestParameters.action,
		                    universal_symbol_id: requestParameters.universal_symbol_id,
		                    symbol: requestParameters.symbol,
		                    order_type: requestParameters.order_type,
		                    time_in_force: requestParameters.time_in_force,
		                    price: requestParameters.price,
		                    stop: requestParameters.stop,
		                    units: requestParameters.units,
		                    notional_value: requestParameters.notional_value
		                };
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.placeForceOrder(requestParameters.userId, requestParameters.userSecret, manualTradeFormWithOptions, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Places the previously checked order with the brokerage. The `tradeId` is obtained from the [check order impact endpoint](/reference/Trading/Trading_getOrderImpact). If you prefer to place the order without checking for impact first, you can use the [place order endpoint](/reference/Trading/Trading_placeForceOrder).  It\'s recommended to trigger a manual refresh of the account after placing an order to ensure the account is up to date. You can use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint for this.
		         * @summary Place checked order
		         * @param {TradingApiPlaceOrderRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        placeOrder(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const validatedTradeBody = {
		                    wait_to_confirm: requestParameters.wait_to_confirm
		                };
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.placeOrder(requestParameters.tradeId, requestParameters.userId, requestParameters.userSecret, validatedTradeBody, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		    };
		};
		exports.TradingApiFp = TradingApiFp;
		/**
		 * TradingApi - factory interface
		 * @export
		 */
		const TradingApiFactory = function (configuration, basePath, axios) {
		    const localVarFp = (0, exports.TradingApiFp)(configuration);
		    return {
		        /**
		         * Attempts to cancel an open order with the brokerage. If the order is no longer cancellable, the request will be rejected.
		         * @summary Cancel order
		         * @param {TradingApiCancelUserAccountOrderRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        cancelUserAccountOrder(requestParameters, options) {
		            return localVarFp.cancelUserAccountOrder(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Simulates an order and its impact on the account. This endpoint does not place the order with the brokerage. If successful, it returns a `Trade` object and the ID of the object can be used to place the order with the brokerage using the [place checked order endpoint](/reference/Trading/Trading_placeOrder). Please note that the `Trade` object returned expires after 5 minutes. Any order placed using an expired `Trade` will be rejected.
		         * @summary Check order impact
		         * @param {TradingApiGetOrderImpactRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getOrderImpact(requestParameters, options) {
		            return localVarFp.getOrderImpact(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns quotes from the brokerage for the specified symbols and account. The quotes returned can be delayed depending on the brokerage the account belongs to. It is highly recommended that you use your own market data provider for real-time quotes instead of relying on this endpoint. This endpoint does not work for options quotes.
		         * @summary Get symbol quotes
		         * @param {TradingApiGetUserAccountQuotesRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getUserAccountQuotes(requestParameters, options) {
		            return localVarFp.getUserAccountQuotes(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Places a brokerage order in the specified account. The order could be rejected by the brokerage if it is invalid or if the account does not have sufficient funds.  This endpoint does not compute the impact to the account balance from the order and any potential commissions before submitting the order to the brokerage. If that is desired, you can use the [check order impact endpoint](/reference/Trading/Trading_getOrderImpact).  It\'s recommended to trigger a manual refresh of the account after placing an order to ensure the account is up to date. You can use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint for this.
		         * @summary Place order
		         * @param {TradingApiPlaceForceOrderRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        placeForceOrder(requestParameters, options) {
		            return localVarFp.placeForceOrder(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Places the previously checked order with the brokerage. The `tradeId` is obtained from the [check order impact endpoint](/reference/Trading/Trading_getOrderImpact). If you prefer to place the order without checking for impact first, you can use the [place order endpoint](/reference/Trading/Trading_placeForceOrder).  It\'s recommended to trigger a manual refresh of the account after placing an order to ensure the account is up to date. You can use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint for this.
		         * @summary Place checked order
		         * @param {TradingApiPlaceOrderRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        placeOrder(requestParameters, options) {
		            return localVarFp.placeOrder(requestParameters, options).then((request) => request(axios, basePath));
		        },
		    };
		};
		exports.TradingApiFactory = TradingApiFactory;
		/**
		 * TradingApiGenerated - object-oriented interface
		 * @export
		 * @class TradingApiGenerated
		 * @extends {BaseAPI}
		 */
		class TradingApiGenerated extends base_1.BaseAPI {
		    /**
		     * Attempts to cancel an open order with the brokerage. If the order is no longer cancellable, the request will be rejected.
		     * @summary Cancel order
		     * @param {TradingApiCancelUserAccountOrderRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof TradingApiGenerated
		     */
		    cancelUserAccountOrder(requestParameters, options) {
		        return (0, exports.TradingApiFp)(this.configuration).cancelUserAccountOrder(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Simulates an order and its impact on the account. This endpoint does not place the order with the brokerage. If successful, it returns a `Trade` object and the ID of the object can be used to place the order with the brokerage using the [place checked order endpoint](/reference/Trading/Trading_placeOrder). Please note that the `Trade` object returned expires after 5 minutes. Any order placed using an expired `Trade` will be rejected.
		     * @summary Check order impact
		     * @param {TradingApiGetOrderImpactRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof TradingApiGenerated
		     */
		    getOrderImpact(requestParameters, options) {
		        return (0, exports.TradingApiFp)(this.configuration).getOrderImpact(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns quotes from the brokerage for the specified symbols and account. The quotes returned can be delayed depending on the brokerage the account belongs to. It is highly recommended that you use your own market data provider for real-time quotes instead of relying on this endpoint. This endpoint does not work for options quotes.
		     * @summary Get symbol quotes
		     * @param {TradingApiGetUserAccountQuotesRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof TradingApiGenerated
		     */
		    getUserAccountQuotes(requestParameters, options) {
		        return (0, exports.TradingApiFp)(this.configuration).getUserAccountQuotes(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Places a brokerage order in the specified account. The order could be rejected by the brokerage if it is invalid or if the account does not have sufficient funds.  This endpoint does not compute the impact to the account balance from the order and any potential commissions before submitting the order to the brokerage. If that is desired, you can use the [check order impact endpoint](/reference/Trading/Trading_getOrderImpact).  It\'s recommended to trigger a manual refresh of the account after placing an order to ensure the account is up to date. You can use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint for this.
		     * @summary Place order
		     * @param {TradingApiPlaceForceOrderRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof TradingApiGenerated
		     */
		    placeForceOrder(requestParameters, options) {
		        return (0, exports.TradingApiFp)(this.configuration).placeForceOrder(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Places the previously checked order with the brokerage. The `tradeId` is obtained from the [check order impact endpoint](/reference/Trading/Trading_getOrderImpact). If you prefer to place the order without checking for impact first, you can use the [place order endpoint](/reference/Trading/Trading_placeForceOrder).  It\'s recommended to trigger a manual refresh of the account after placing an order to ensure the account is up to date. You can use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint for this.
		     * @summary Place checked order
		     * @param {TradingApiPlaceOrderRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof TradingApiGenerated
		     */
		    placeOrder(requestParameters, options) {
		        return (0, exports.TradingApiFp)(this.configuration).placeOrder(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		}
		exports.TradingApiGenerated = TradingApiGenerated; 
	} (tradingApiGenerated));
	return tradingApiGenerated;
}

var hasRequiredTradingApi;

function requireTradingApi () {
	if (hasRequiredTradingApi) return tradingApi;
	hasRequiredTradingApi = 1;
	(function (exports) {
		var __createBinding = (tradingApi.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (tradingApi.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.TradingApi = void 0;
		const trading_api_generated_1 = requireTradingApiGenerated();
		__exportStar(requireTradingApiGenerated(), exports);
		class TradingApi extends trading_api_generated_1.TradingApiGenerated {
		}
		exports.TradingApi = TradingApi; 
	} (tradingApi));
	return tradingApi;
}

var transactionsAndReportingApi = {};

var transactionsAndReportingApiGenerated = {};

var hasRequiredTransactionsAndReportingApiGenerated;

function requireTransactionsAndReportingApiGenerated () {
	if (hasRequiredTransactionsAndReportingApiGenerated) return transactionsAndReportingApiGenerated;
	hasRequiredTransactionsAndReportingApiGenerated = 1;
	(function (exports) {
		/* tslint:disable */
		/* eslint-disable */
		/*
		SnapTrade

		Connect brokerage accounts to your app for live positions and trading

		The version of the OpenAPI document: 1.0.0
		Contact: api@snaptrade.com

		NOTE: This file is auto generated by Konfig (https://konfigthis.com).
		*/
		var __awaiter = (transactionsAndReportingApiGenerated.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.TransactionsAndReportingApiGenerated = exports.TransactionsAndReportingApiFactory = exports.TransactionsAndReportingApiFp = exports.TransactionsAndReportingApiAxiosParamCreator = void 0;
		const axios_1 = /*@__PURE__*/ requireAxios();
		// Some imports not used depending on template conditions
		// @ts-ignore
		const common_1 = requireCommon();
		// @ts-ignore
		const base_1 = requireBase();
		const requestBeforeHook_1 = requireRequestBeforeHook();
		/**
		 * TransactionsAndReportingApi - axios parameter creator
		 * @export
		 */
		const TransactionsAndReportingApiAxiosParamCreator = function (configuration) {
		    return {
		        /**
		         * Returns all historical transactions for the specified user and filtering criteria. It\'s recommended to use `startDate` and `endDate` to paginate through the data, as the response may be very large for accounts with a long history and/or a lot of activity. There\'s a max number of 10000 transactions returned per request.  There is no guarantee to the ordering of the transactions returned. Please sort the transactions based on the `trade_date` field if you need them in a specific order.  The data returned here is always cached and refreshed once a day. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary Get transaction history for a user
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string | Date} [startDate] The start date (inclusive) of the transaction history to retrieve. If not provided, the default is the first transaction known to SnapTrade based on &#x60;trade_date&#x60;.
		         * @param {string | Date} [endDate] The end date (inclusive) of the transaction history to retrieve. If not provided, the default is the last transaction known to SnapTrade based on &#x60;trade_date&#x60;.
		         * @param {string} [accounts] Optional comma separated list of SnapTrade Account IDs used to filter the request to specific accounts. If not provided, the default is all known brokerage accounts for the user. The &#x60;brokerageAuthorizations&#x60; parameter takes precedence over this parameter.
		         * @param {string} [brokerageAuthorizations] Optional comma separated list of SnapTrade Connection (Brokerage Authorization) IDs used to filter the request to only accounts that belong to those connections. If not provided, the default is all connections for the user. This parameter takes precedence over the &#x60;accounts&#x60; parameter.
		         * @param {string} [type] Optional comma separated list of transaction types to filter by. SnapTrade does a best effort to categorize brokerage transaction types into a common set of values. Here are some of the most popular values:   - &#x60;BUY&#x60; - Asset bought.   - &#x60;SELL&#x60; - Asset sold.   - &#x60;DIVIDEND&#x60; - Dividend payout.   - &#x60;CONTRIBUTION&#x60; - Cash contribution.   - &#x60;WITHDRAWAL&#x60; - Cash withdrawal.   - &#x60;REI&#x60; - Dividend reinvestment.   - &#x60;INTEREST&#x60; - Interest deposited into the account.   - &#x60;FEE&#x60; - Fee withdrawn from the account.   - &#x60;OPTIONEXPIRATION&#x60; - Option expiration event.   - &#x60;OPTIONASSIGNMENT&#x60; - Option assignment event.   - &#x60;OPTIONEXERCISE&#x60; - Option exercise event.   - &#x60;TRANSFER&#x60; - Transfer of assets from one account to another
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getActivities: (userId, userSecret, startDate, endDate, accounts, brokerageAuthorizations, type, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getActivities', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getActivities', 'userSecret', userSecret);
		            const localVarPath = `/activities`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (startDate !== undefined) {
		                localVarQueryParameter['startDate'] = (startDate instanceof Date) ?
		                    startDate.toISOString().substr(0, 10) :
		                    startDate;
		            }
		            if (endDate !== undefined) {
		                localVarQueryParameter['endDate'] = (endDate instanceof Date) ?
		                    endDate.toISOString().substr(0, 10) :
		                    endDate;
		            }
		            if (accounts !== undefined) {
		                localVarQueryParameter['accounts'] = accounts;
		            }
		            if (brokerageAuthorizations !== undefined) {
		                localVarQueryParameter['brokerageAuthorizations'] = brokerageAuthorizations;
		            }
		            if (type !== undefined) {
		                localVarQueryParameter['type'] = type;
		            }
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/activities',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		        /**
		         * Returns performance information (contributions, dividends, rate of return, etc) for a specific timeframe. Please note that Total Equity Timeframe and Rate of Returns are experimental features. Please contact support@snaptrade.com if you notice any inconsistencies.
		         * @summary Get performance information for a specific timeframe
		         * @param {string | Date} startDate
		         * @param {string | Date} endDate
		         * @param {string} userId
		         * @param {string} userSecret
		         * @param {string} [accounts] Optional comma separated list of account IDs used to filter the request on specific accounts
		         * @param {boolean} [detailed] Optional, increases frequency of data points for the total value and contribution charts if set to true
		         * @param {string} [frequency] Optional frequency for the rate of return chart (defaults to monthly). Possible values are daily, weekly, monthly, quarterly, yearly.
		         * @param {*} [options] Override http request option.
		         * @deprecated
		         * @throws {RequiredError}
		         */
		        getReportingCustomRange: (startDate, endDate, userId, userSecret, accounts, detailed, frequency, options = {}) => __awaiter(this, void 0, void 0, function* () {
		            // verify required parameter 'startDate' is not null or undefined
		            (0, common_1.assertParamExists)('getReportingCustomRange', 'startDate', startDate);
		            // verify required parameter 'endDate' is not null or undefined
		            (0, common_1.assertParamExists)('getReportingCustomRange', 'endDate', endDate);
		            // verify required parameter 'userId' is not null or undefined
		            (0, common_1.assertParamExists)('getReportingCustomRange', 'userId', userId);
		            // verify required parameter 'userSecret' is not null or undefined
		            (0, common_1.assertParamExists)('getReportingCustomRange', 'userSecret', userSecret);
		            const localVarPath = `/performance/custom`;
		            // use dummy base URL string because the URL constructor only accepts absolute URLs.
		            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
		            let baseOptions;
		            if (configuration) {
		                baseOptions = configuration.baseOptions;
		            }
		            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
		            const localVarHeaderParameter = configuration && !(0, common_1.isBrowser)() ? { "User-Agent": configuration.userAgent } : {};
		            const localVarQueryParameter = {};
		            // authentication PartnerClientId required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "clientId", keyParamName: "clientId", configuration });
		            // authentication PartnerSignature required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarHeaderParameter, key: "Signature", keyParamName: "signature", configuration });
		            // authentication PartnerTimestamp required
		            yield (0, common_1.setApiKeyToObject)({ object: localVarQueryParameter, key: "timestamp", keyParamName: "timestamp", configuration });
		            if (startDate !== undefined) {
		                localVarQueryParameter['startDate'] = (startDate instanceof Date) ?
		                    startDate.toISOString().substr(0, 10) :
		                    startDate;
		            }
		            if (endDate !== undefined) {
		                localVarQueryParameter['endDate'] = (endDate instanceof Date) ?
		                    endDate.toISOString().substr(0, 10) :
		                    endDate;
		            }
		            if (accounts !== undefined) {
		                localVarQueryParameter['accounts'] = accounts;
		            }
		            if (detailed !== undefined) {
		                localVarQueryParameter['detailed'] = detailed;
		            }
		            if (frequency !== undefined) {
		                localVarQueryParameter['frequency'] = frequency;
		            }
		            if (userId !== undefined) {
		                localVarQueryParameter['userId'] = userId;
		            }
		            if (userSecret !== undefined) {
		                localVarQueryParameter['userSecret'] = userSecret;
		            }
		            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
		            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
		            (0, requestBeforeHook_1.requestBeforeHook)({
		                queryParameters: localVarQueryParameter,
		                requestConfig: localVarRequestOptions,
		                path: localVarPath,
		                configuration,
		                pathTemplate: '/performance/custom',
		                httpMethod: 'GET'
		            });
		            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
		            return {
		                url: (0, common_1.toPathString)(localVarUrlObj),
		                options: localVarRequestOptions,
		            };
		        }),
		    };
		};
		exports.TransactionsAndReportingApiAxiosParamCreator = TransactionsAndReportingApiAxiosParamCreator;
		/**
		 * TransactionsAndReportingApi - functional programming interface
		 * @export
		 */
		const TransactionsAndReportingApiFp = function (configuration) {
		    const localVarAxiosParamCreator = (0, exports.TransactionsAndReportingApiAxiosParamCreator)(configuration);
		    return {
		        /**
		         * Returns all historical transactions for the specified user and filtering criteria. It\'s recommended to use `startDate` and `endDate` to paginate through the data, as the response may be very large for accounts with a long history and/or a lot of activity. There\'s a max number of 10000 transactions returned per request.  There is no guarantee to the ordering of the transactions returned. Please sort the transactions based on the `trade_date` field if you need them in a specific order.  The data returned here is always cached and refreshed once a day. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary Get transaction history for a user
		         * @param {TransactionsAndReportingApiGetActivitiesRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getActivities(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getActivities(requestParameters.userId, requestParameters.userSecret, requestParameters.startDate, requestParameters.endDate, requestParameters.accounts, requestParameters.brokerageAuthorizations, requestParameters.type, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		        /**
		         * Returns performance information (contributions, dividends, rate of return, etc) for a specific timeframe. Please note that Total Equity Timeframe and Rate of Returns are experimental features. Please contact support@snaptrade.com if you notice any inconsistencies.
		         * @summary Get performance information for a specific timeframe
		         * @param {TransactionsAndReportingApiGetReportingCustomRangeRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @deprecated
		         * @throws {RequiredError}
		         */
		        getReportingCustomRange(requestParameters, options) {
		            return __awaiter(this, void 0, void 0, function* () {
		                const localVarAxiosArgs = yield localVarAxiosParamCreator.getReportingCustomRange(requestParameters.startDate, requestParameters.endDate, requestParameters.userId, requestParameters.userSecret, requestParameters.accounts, requestParameters.detailed, requestParameters.frequency, options);
		                return (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
		            });
		        },
		    };
		};
		exports.TransactionsAndReportingApiFp = TransactionsAndReportingApiFp;
		/**
		 * TransactionsAndReportingApi - factory interface
		 * @export
		 */
		const TransactionsAndReportingApiFactory = function (configuration, basePath, axios) {
		    const localVarFp = (0, exports.TransactionsAndReportingApiFp)(configuration);
		    return {
		        /**
		         * Returns all historical transactions for the specified user and filtering criteria. It\'s recommended to use `startDate` and `endDate` to paginate through the data, as the response may be very large for accounts with a long history and/or a lot of activity. There\'s a max number of 10000 transactions returned per request.  There is no guarantee to the ordering of the transactions returned. Please sort the transactions based on the `trade_date` field if you need them in a specific order.  The data returned here is always cached and refreshed once a day. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		         * @summary Get transaction history for a user
		         * @param {TransactionsAndReportingApiGetActivitiesRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @throws {RequiredError}
		         */
		        getActivities(requestParameters, options) {
		            return localVarFp.getActivities(requestParameters, options).then((request) => request(axios, basePath));
		        },
		        /**
		         * Returns performance information (contributions, dividends, rate of return, etc) for a specific timeframe. Please note that Total Equity Timeframe and Rate of Returns are experimental features. Please contact support@snaptrade.com if you notice any inconsistencies.
		         * @summary Get performance information for a specific timeframe
		         * @param {TransactionsAndReportingApiGetReportingCustomRangeRequest} requestParameters Request parameters.
		         * @param {*} [options] Override http request option.
		         * @deprecated
		         * @throws {RequiredError}
		         */
		        getReportingCustomRange(requestParameters, options) {
		            return localVarFp.getReportingCustomRange(requestParameters, options).then((request) => request(axios, basePath));
		        },
		    };
		};
		exports.TransactionsAndReportingApiFactory = TransactionsAndReportingApiFactory;
		/**
		 * TransactionsAndReportingApiGenerated - object-oriented interface
		 * @export
		 * @class TransactionsAndReportingApiGenerated
		 * @extends {BaseAPI}
		 */
		class TransactionsAndReportingApiGenerated extends base_1.BaseAPI {
		    /**
		     * Returns all historical transactions for the specified user and filtering criteria. It\'s recommended to use `startDate` and `endDate` to paginate through the data, as the response may be very large for accounts with a long history and/or a lot of activity. There\'s a max number of 10000 transactions returned per request.  There is no guarantee to the ordering of the transactions returned. Please sort the transactions based on the `trade_date` field if you need them in a specific order.  The data returned here is always cached and refreshed once a day. **If you need real-time data, please use the [manual refresh](/reference/Connections/Connections_refreshBrokerageAuthorization) endpoint**.
		     * @summary Get transaction history for a user
		     * @param {TransactionsAndReportingApiGetActivitiesRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @throws {RequiredError}
		     * @memberof TransactionsAndReportingApiGenerated
		     */
		    getActivities(requestParameters, options) {
		        return (0, exports.TransactionsAndReportingApiFp)(this.configuration).getActivities(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		    /**
		     * Returns performance information (contributions, dividends, rate of return, etc) for a specific timeframe. Please note that Total Equity Timeframe and Rate of Returns are experimental features. Please contact support@snaptrade.com if you notice any inconsistencies.
		     * @summary Get performance information for a specific timeframe
		     * @param {TransactionsAndReportingApiGetReportingCustomRangeRequest} requestParameters Request parameters.
		     * @param {*} [options] Override http request option.
		     * @deprecated
		     * @throws {RequiredError}
		     * @memberof TransactionsAndReportingApiGenerated
		     */
		    getReportingCustomRange(requestParameters, options) {
		        return (0, exports.TransactionsAndReportingApiFp)(this.configuration).getReportingCustomRange(requestParameters, options).then((request) => request(this.axios, this.basePath));
		    }
		}
		exports.TransactionsAndReportingApiGenerated = TransactionsAndReportingApiGenerated; 
	} (transactionsAndReportingApiGenerated));
	return transactionsAndReportingApiGenerated;
}

var hasRequiredTransactionsAndReportingApi;

function requireTransactionsAndReportingApi () {
	if (hasRequiredTransactionsAndReportingApi) return transactionsAndReportingApi;
	hasRequiredTransactionsAndReportingApi = 1;
	(function (exports) {
		var __createBinding = (transactionsAndReportingApi.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (transactionsAndReportingApi.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.TransactionsAndReportingApi = void 0;
		const transactions_and_reporting_api_generated_1 = requireTransactionsAndReportingApiGenerated();
		__exportStar(requireTransactionsAndReportingApiGenerated(), exports);
		class TransactionsAndReportingApi extends transactions_and_reporting_api_generated_1.TransactionsAndReportingApiGenerated {
		}
		exports.TransactionsAndReportingApi = TransactionsAndReportingApi; 
	} (transactionsAndReportingApi));
	return transactionsAndReportingApi;
}

var hasRequiredApi;

function requireApi () {
	if (hasRequiredApi) return api;
	hasRequiredApi = 1;
	(function (exports) {
		/* tslint:disable */
		/* eslint-disable */
		/*
		SnapTrade

		Connect brokerage accounts to your app for live positions and trading

		The version of the OpenAPI document: 1.0.0
		Contact: api@snaptrade.com

		NOTE: This file is auto generated by Konfig (https://konfigthis.com).
		*/
		var __createBinding = (api.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (api.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		__exportStar(requireAccountInformationApi(), exports);
		__exportStar(requireApiStatusApi(), exports);
		__exportStar(requireAuthenticationApi(), exports);
		__exportStar(requireConnectionsApi(), exports);
		__exportStar(requireOptionsApi(), exports);
		__exportStar(requireReferenceDataApi(), exports);
		__exportStar(requireTradingApi(), exports);
		__exportStar(requireTransactionsAndReportingApi(), exports); 
	} (api));
	return api;
}

var configuration = {};

var hasRequiredConfiguration;

function requireConfiguration () {
	if (hasRequiredConfiguration) return configuration;
	hasRequiredConfiguration = 1;
	/* tslint:disable */
	/* eslint-disable */
	/*
	SnapTrade

	Connect brokerage accounts to your app for live positions and trading

	The version of the OpenAPI document: 1.0.0
	Contact: api@snaptrade.com

	NOTE: This file is auto generated by Konfig (https://konfigthis.com).
	*/
	Object.defineProperty(configuration, "__esModule", { value: true });
	configuration.Configuration = void 0;
	class Configuration {
	    constructor(param = {}) {
	        var _a;
	        this.consumerKey = param.consumerKey;
	        this.apiKey = param.apiKey;
	        if (this.apiKey === undefined) {
	            this.apiKey = {};
	            if (param.clientId !== undefined)
	                this.apiKey["clientId"] = param.clientId;
	            if (param.signature !== undefined)
	                this.apiKey["signature"] = param.signature;
	            if (param.timestamp !== undefined)
	                this.apiKey["timestamp"] = param.timestamp;
	        }
	        this.username = param.username;
	        this.password = param.password;
	        this.accessToken = param.accessToken;
	        this.basePath = param.basePath;
	        this.baseOptions = (_a = param.baseOptions) !== null && _a !== void 0 ? _a : {};
	        this.userAgent = param.userAgent === undefined ? "Konfig/9.0.60/typescript" : param.userAgent;
	        this.formDataCtor = param.formDataCtor;
	    }
	    /**
	     * Check if the given MIME is a JSON MIME.
	     * JSON MIME examples:
	     *   application/json
	     *   application/json; charset=UTF8
	     *   APPLICATION/JSON
	     *   application/vnd.company+json
	     * @param mime - MIME (Multipurpose Internet Mail Extensions)
	     * @return True if the given MIME is JSON, false otherwise.
	     */
	    isJsonMime(mime) {
	        const jsonMime = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
	        return mime !== null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
	    }
	}
	configuration.Configuration = Configuration;
	return configuration;
}

var models = {};

var account = {};

var hasRequiredAccount;

function requireAccount () {
	if (hasRequiredAccount) return account;
	hasRequiredAccount = 1;
	Object.defineProperty(account, "__esModule", { value: true });
	return account;
}

var accountBalance = {};

var hasRequiredAccountBalance;

function requireAccountBalance () {
	if (hasRequiredAccountBalance) return accountBalance;
	hasRequiredAccountBalance = 1;
	Object.defineProperty(accountBalance, "__esModule", { value: true });
	return accountBalance;
}

var accountBalanceTotal = {};

var hasRequiredAccountBalanceTotal;

function requireAccountBalanceTotal () {
	if (hasRequiredAccountBalanceTotal) return accountBalanceTotal;
	hasRequiredAccountBalanceTotal = 1;
	Object.defineProperty(accountBalanceTotal, "__esModule", { value: true });
	return accountBalanceTotal;
}

var accountHoldings = {};

var hasRequiredAccountHoldings;

function requireAccountHoldings () {
	if (hasRequiredAccountHoldings) return accountHoldings;
	hasRequiredAccountHoldings = 1;
	Object.defineProperty(accountHoldings, "__esModule", { value: true });
	return accountHoldings;
}

var accountHoldingsAccount = {};

var hasRequiredAccountHoldingsAccount;

function requireAccountHoldingsAccount () {
	if (hasRequiredAccountHoldingsAccount) return accountHoldingsAccount;
	hasRequiredAccountHoldingsAccount = 1;
	Object.defineProperty(accountHoldingsAccount, "__esModule", { value: true });
	return accountHoldingsAccount;
}

var accountOrderRecord = {};

var hasRequiredAccountOrderRecord;

function requireAccountOrderRecord () {
	if (hasRequiredAccountOrderRecord) return accountOrderRecord;
	hasRequiredAccountOrderRecord = 1;
	Object.defineProperty(accountOrderRecord, "__esModule", { value: true });
	return accountOrderRecord;
}

var accountOrderRecordOptionSymbol = {};

var hasRequiredAccountOrderRecordOptionSymbol;

function requireAccountOrderRecordOptionSymbol () {
	if (hasRequiredAccountOrderRecordOptionSymbol) return accountOrderRecordOptionSymbol;
	hasRequiredAccountOrderRecordOptionSymbol = 1;
	Object.defineProperty(accountOrderRecordOptionSymbol, "__esModule", { value: true });
	return accountOrderRecordOptionSymbol;
}

var accountOrderRecordStatus = {};

var hasRequiredAccountOrderRecordStatus;

function requireAccountOrderRecordStatus () {
	if (hasRequiredAccountOrderRecordStatus) return accountOrderRecordStatus;
	hasRequiredAccountOrderRecordStatus = 1;
	Object.defineProperty(accountOrderRecordStatus, "__esModule", { value: true });
	return accountOrderRecordStatus;
}

var accountOrderRecordUniversalSymbol = {};

var hasRequiredAccountOrderRecordUniversalSymbol;

function requireAccountOrderRecordUniversalSymbol () {
	if (hasRequiredAccountOrderRecordUniversalSymbol) return accountOrderRecordUniversalSymbol;
	hasRequiredAccountOrderRecordUniversalSymbol = 1;
	Object.defineProperty(accountOrderRecordUniversalSymbol, "__esModule", { value: true });
	return accountOrderRecordUniversalSymbol;
}

var accountSimple = {};

var hasRequiredAccountSimple;

function requireAccountSimple () {
	if (hasRequiredAccountSimple) return accountSimple;
	hasRequiredAccountSimple = 1;
	Object.defineProperty(accountSimple, "__esModule", { value: true });
	return accountSimple;
}

var accountSyncStatus = {};

var hasRequiredAccountSyncStatus;

function requireAccountSyncStatus () {
	if (hasRequiredAccountSyncStatus) return accountSyncStatus;
	hasRequiredAccountSyncStatus = 1;
	Object.defineProperty(accountSyncStatus, "__esModule", { value: true });
	return accountSyncStatus;
}

var actionStrict = {};

var hasRequiredActionStrict;

function requireActionStrict () {
	if (hasRequiredActionStrict) return actionStrict;
	hasRequiredActionStrict = 1;
	Object.defineProperty(actionStrict, "__esModule", { value: true });
	return actionStrict;
}

var actionStrictWithOptions = {};

var hasRequiredActionStrictWithOptions;

function requireActionStrictWithOptions () {
	if (hasRequiredActionStrictWithOptions) return actionStrictWithOptions;
	hasRequiredActionStrictWithOptions = 1;
	Object.defineProperty(actionStrictWithOptions, "__esModule", { value: true });
	return actionStrictWithOptions;
}

var authenticationLoginSnapTradeUser200Response = {};

var hasRequiredAuthenticationLoginSnapTradeUser200Response;

function requireAuthenticationLoginSnapTradeUser200Response () {
	if (hasRequiredAuthenticationLoginSnapTradeUser200Response) return authenticationLoginSnapTradeUser200Response;
	hasRequiredAuthenticationLoginSnapTradeUser200Response = 1;
	Object.defineProperty(authenticationLoginSnapTradeUser200Response, "__esModule", { value: true });
	return authenticationLoginSnapTradeUser200Response;
}

var balance = {};

var hasRequiredBalance;

function requireBalance () {
	if (hasRequiredBalance) return balance;
	hasRequiredBalance = 1;
	Object.defineProperty(balance, "__esModule", { value: true });
	return balance;
}

var balanceCurrency = {};

var hasRequiredBalanceCurrency;

function requireBalanceCurrency () {
	if (hasRequiredBalanceCurrency) return balanceCurrency;
	hasRequiredBalanceCurrency = 1;
	Object.defineProperty(balanceCurrency, "__esModule", { value: true });
	return balanceCurrency;
}

var brokerage = {};

var hasRequiredBrokerage;

function requireBrokerage () {
	if (hasRequiredBrokerage) return brokerage;
	hasRequiredBrokerage = 1;
	Object.defineProperty(brokerage, "__esModule", { value: true });
	return brokerage;
}

var brokerageAuthorization = {};

var hasRequiredBrokerageAuthorization;

function requireBrokerageAuthorization () {
	if (hasRequiredBrokerageAuthorization) return brokerageAuthorization;
	hasRequiredBrokerageAuthorization = 1;
	Object.defineProperty(brokerageAuthorization, "__esModule", { value: true });
	return brokerageAuthorization;
}

var brokerageAuthorizationDisabledConfirmation = {};

var hasRequiredBrokerageAuthorizationDisabledConfirmation;

function requireBrokerageAuthorizationDisabledConfirmation () {
	if (hasRequiredBrokerageAuthorizationDisabledConfirmation) return brokerageAuthorizationDisabledConfirmation;
	hasRequiredBrokerageAuthorizationDisabledConfirmation = 1;
	Object.defineProperty(brokerageAuthorizationDisabledConfirmation, "__esModule", { value: true });
	return brokerageAuthorizationDisabledConfirmation;
}

var brokerageAuthorizationRefreshConfirmation = {};

var hasRequiredBrokerageAuthorizationRefreshConfirmation;

function requireBrokerageAuthorizationRefreshConfirmation () {
	if (hasRequiredBrokerageAuthorizationRefreshConfirmation) return brokerageAuthorizationRefreshConfirmation;
	hasRequiredBrokerageAuthorizationRefreshConfirmation = 1;
	Object.defineProperty(brokerageAuthorizationRefreshConfirmation, "__esModule", { value: true });
	return brokerageAuthorizationRefreshConfirmation;
}

var brokerageAuthorizationTypeReadOnly = {};

var hasRequiredBrokerageAuthorizationTypeReadOnly;

function requireBrokerageAuthorizationTypeReadOnly () {
	if (hasRequiredBrokerageAuthorizationTypeReadOnly) return brokerageAuthorizationTypeReadOnly;
	hasRequiredBrokerageAuthorizationTypeReadOnly = 1;
	Object.defineProperty(brokerageAuthorizationTypeReadOnly, "__esModule", { value: true });
	return brokerageAuthorizationTypeReadOnly;
}

var brokerageAuthorizationTypeReadOnlyBrokerage = {};

var hasRequiredBrokerageAuthorizationTypeReadOnlyBrokerage;

function requireBrokerageAuthorizationTypeReadOnlyBrokerage () {
	if (hasRequiredBrokerageAuthorizationTypeReadOnlyBrokerage) return brokerageAuthorizationTypeReadOnlyBrokerage;
	hasRequiredBrokerageAuthorizationTypeReadOnlyBrokerage = 1;
	Object.defineProperty(brokerageAuthorizationTypeReadOnlyBrokerage, "__esModule", { value: true });
	return brokerageAuthorizationTypeReadOnlyBrokerage;
}

var brokerageType = {};

var hasRequiredBrokerageType;

function requireBrokerageType () {
	if (hasRequiredBrokerageType) return brokerageType;
	hasRequiredBrokerageType = 1;
	Object.defineProperty(brokerageType, "__esModule", { value: true });
	return brokerageType;
}

var connectionsSessionEvents200ResponseInner = {};

var hasRequiredConnectionsSessionEvents200ResponseInner;

function requireConnectionsSessionEvents200ResponseInner () {
	if (hasRequiredConnectionsSessionEvents200ResponseInner) return connectionsSessionEvents200ResponseInner;
	hasRequiredConnectionsSessionEvents200ResponseInner = 1;
	Object.defineProperty(connectionsSessionEvents200ResponseInner, "__esModule", { value: true });
	return connectionsSessionEvents200ResponseInner;
}

var currency = {};

var hasRequiredCurrency;

function requireCurrency () {
	if (hasRequiredCurrency) return currency;
	hasRequiredCurrency = 1;
	Object.defineProperty(currency, "__esModule", { value: true });
	return currency;
}

var deleteUserResponse = {};

var hasRequiredDeleteUserResponse;

function requireDeleteUserResponse () {
	if (hasRequiredDeleteUserResponse) return deleteUserResponse;
	hasRequiredDeleteUserResponse = 1;
	Object.defineProperty(deleteUserResponse, "__esModule", { value: true });
	return deleteUserResponse;
}

var dividendAtDate = {};

var hasRequiredDividendAtDate;

function requireDividendAtDate () {
	if (hasRequiredDividendAtDate) return dividendAtDate;
	hasRequiredDividendAtDate = 1;
	Object.defineProperty(dividendAtDate, "__esModule", { value: true });
	return dividendAtDate;
}

var encryptedResponse = {};

var hasRequiredEncryptedResponse;

function requireEncryptedResponse () {
	if (hasRequiredEncryptedResponse) return encryptedResponse;
	hasRequiredEncryptedResponse = 1;
	Object.defineProperty(encryptedResponse, "__esModule", { value: true });
	return encryptedResponse;
}

var encryptedResponseEncryptedMessageData = {};

var hasRequiredEncryptedResponseEncryptedMessageData;

function requireEncryptedResponseEncryptedMessageData () {
	if (hasRequiredEncryptedResponseEncryptedMessageData) return encryptedResponseEncryptedMessageData;
	hasRequiredEncryptedResponseEncryptedMessageData = 1;
	Object.defineProperty(encryptedResponseEncryptedMessageData, "__esModule", { value: true });
	return encryptedResponseEncryptedMessageData;
}

var exchange = {};

var hasRequiredExchange;

function requireExchange () {
	if (hasRequiredExchange) return exchange;
	hasRequiredExchange = 1;
	Object.defineProperty(exchange, "__esModule", { value: true });
	return exchange;
}

var exchangeRatePairs = {};

var hasRequiredExchangeRatePairs;

function requireExchangeRatePairs () {
	if (hasRequiredExchangeRatePairs) return exchangeRatePairs;
	hasRequiredExchangeRatePairs = 1;
	Object.defineProperty(exchangeRatePairs, "__esModule", { value: true });
	return exchangeRatePairs;
}

var figiInstrument = {};

var hasRequiredFigiInstrument;

function requireFigiInstrument () {
	if (hasRequiredFigiInstrument) return figiInstrument;
	hasRequiredFigiInstrument = 1;
	Object.defineProperty(figiInstrument, "__esModule", { value: true });
	return figiInstrument;
}

var holdingsStatus = {};

var hasRequiredHoldingsStatus;

function requireHoldingsStatus () {
	if (hasRequiredHoldingsStatus) return holdingsStatus;
	hasRequiredHoldingsStatus = 1;
	Object.defineProperty(holdingsStatus, "__esModule", { value: true });
	return holdingsStatus;
}

var loginRedirectUri = {};

var hasRequiredLoginRedirectUri;

function requireLoginRedirectUri () {
	if (hasRequiredLoginRedirectUri) return loginRedirectUri;
	hasRequiredLoginRedirectUri = 1;
	Object.defineProperty(loginRedirectUri, "__esModule", { value: true });
	return loginRedirectUri;
}

var manualTrade = {};

var hasRequiredManualTrade;

function requireManualTrade () {
	if (hasRequiredManualTrade) return manualTrade;
	hasRequiredManualTrade = 1;
	Object.defineProperty(manualTrade, "__esModule", { value: true });
	return manualTrade;
}

var manualTradeAndImpact = {};

var hasRequiredManualTradeAndImpact;

function requireManualTradeAndImpact () {
	if (hasRequiredManualTradeAndImpact) return manualTradeAndImpact;
	hasRequiredManualTradeAndImpact = 1;
	Object.defineProperty(manualTradeAndImpact, "__esModule", { value: true });
	return manualTradeAndImpact;
}

var manualTradeBalance = {};

var hasRequiredManualTradeBalance;

function requireManualTradeBalance () {
	if (hasRequiredManualTradeBalance) return manualTradeBalance;
	hasRequiredManualTradeBalance = 1;
	Object.defineProperty(manualTradeBalance, "__esModule", { value: true });
	return manualTradeBalance;
}

var manualTradeForm = {};

var hasRequiredManualTradeForm;

function requireManualTradeForm () {
	if (hasRequiredManualTradeForm) return manualTradeForm;
	hasRequiredManualTradeForm = 1;
	Object.defineProperty(manualTradeForm, "__esModule", { value: true });
	return manualTradeForm;
}

var manualTradeFormNotionalValue = {};

var hasRequiredManualTradeFormNotionalValue;

function requireManualTradeFormNotionalValue () {
	if (hasRequiredManualTradeFormNotionalValue) return manualTradeFormNotionalValue;
	hasRequiredManualTradeFormNotionalValue = 1;
	Object.defineProperty(manualTradeFormNotionalValue, "__esModule", { value: true });
	return manualTradeFormNotionalValue;
}

var manualTradeFormWithOptions = {};

var hasRequiredManualTradeFormWithOptions;

function requireManualTradeFormWithOptions () {
	if (hasRequiredManualTradeFormWithOptions) return manualTradeFormWithOptions;
	hasRequiredManualTradeFormWithOptions = 1;
	Object.defineProperty(manualTradeFormWithOptions, "__esModule", { value: true });
	return manualTradeFormWithOptions;
}

var manualTradeImpact = {};

var hasRequiredManualTradeImpact;

function requireManualTradeImpact () {
	if (hasRequiredManualTradeImpact) return manualTradeImpact;
	hasRequiredManualTradeImpact = 1;
	Object.defineProperty(manualTradeImpact, "__esModule", { value: true });
	return manualTradeImpact;
}

var manualTradeSymbol = {};

var hasRequiredManualTradeSymbol;

function requireManualTradeSymbol () {
	if (hasRequiredManualTradeSymbol) return manualTradeSymbol;
	hasRequiredManualTradeSymbol = 1;
	Object.defineProperty(manualTradeSymbol, "__esModule", { value: true });
	return manualTradeSymbol;
}

var model400FailedRequestResponse = {};

var hasRequiredModel400FailedRequestResponse;

function requireModel400FailedRequestResponse () {
	if (hasRequiredModel400FailedRequestResponse) return model400FailedRequestResponse;
	hasRequiredModel400FailedRequestResponse = 1;
	Object.defineProperty(model400FailedRequestResponse, "__esModule", { value: true });
	return model400FailedRequestResponse;
}

var model401FailedRequestResponse = {};

var hasRequiredModel401FailedRequestResponse;

function requireModel401FailedRequestResponse () {
	if (hasRequiredModel401FailedRequestResponse) return model401FailedRequestResponse;
	hasRequiredModel401FailedRequestResponse = 1;
	Object.defineProperty(model401FailedRequestResponse, "__esModule", { value: true });
	return model401FailedRequestResponse;
}

var model402BrokerageAuthAlreadyDisabledException = {};

var hasRequiredModel402BrokerageAuthAlreadyDisabledException;

function requireModel402BrokerageAuthAlreadyDisabledException () {
	if (hasRequiredModel402BrokerageAuthAlreadyDisabledException) return model402BrokerageAuthAlreadyDisabledException;
	hasRequiredModel402BrokerageAuthAlreadyDisabledException = 1;
	Object.defineProperty(model402BrokerageAuthAlreadyDisabledException, "__esModule", { value: true });
	return model402BrokerageAuthAlreadyDisabledException;
}

var model402BrokerageAuthDisabledResponse = {};

var hasRequiredModel402BrokerageAuthDisabledResponse;

function requireModel402BrokerageAuthDisabledResponse () {
	if (hasRequiredModel402BrokerageAuthDisabledResponse) return model402BrokerageAuthDisabledResponse;
	hasRequiredModel402BrokerageAuthDisabledResponse = 1;
	Object.defineProperty(model402BrokerageAuthDisabledResponse, "__esModule", { value: true });
	return model402BrokerageAuthDisabledResponse;
}

var model403FailedRequestResponse = {};

var hasRequiredModel403FailedRequestResponse;

function requireModel403FailedRequestResponse () {
	if (hasRequiredModel403FailedRequestResponse) return model403FailedRequestResponse;
	hasRequiredModel403FailedRequestResponse = 1;
	Object.defineProperty(model403FailedRequestResponse, "__esModule", { value: true });
	return model403FailedRequestResponse;
}

var model403FeatureNotEnabledResponse = {};

var hasRequiredModel403FeatureNotEnabledResponse;

function requireModel403FeatureNotEnabledResponse () {
	if (hasRequiredModel403FeatureNotEnabledResponse) return model403FeatureNotEnabledResponse;
	hasRequiredModel403FeatureNotEnabledResponse = 1;
	Object.defineProperty(model403FeatureNotEnabledResponse, "__esModule", { value: true });
	return model403FeatureNotEnabledResponse;
}

var model404FailedRequestResponse = {};

var hasRequiredModel404FailedRequestResponse;

function requireModel404FailedRequestResponse () {
	if (hasRequiredModel404FailedRequestResponse) return model404FailedRequestResponse;
	hasRequiredModel404FailedRequestResponse = 1;
	Object.defineProperty(model404FailedRequestResponse, "__esModule", { value: true });
	return model404FailedRequestResponse;
}

var model425FailedRequestResponse = {};

var hasRequiredModel425FailedRequestResponse;

function requireModel425FailedRequestResponse () {
	if (hasRequiredModel425FailedRequestResponse) return model425FailedRequestResponse;
	hasRequiredModel425FailedRequestResponse = 1;
	Object.defineProperty(model425FailedRequestResponse, "__esModule", { value: true });
	return model425FailedRequestResponse;
}

var model500UnexpectedExceptionResponse = {};

var hasRequiredModel500UnexpectedExceptionResponse;

function requireModel500UnexpectedExceptionResponse () {
	if (hasRequiredModel500UnexpectedExceptionResponse) return model500UnexpectedExceptionResponse;
	hasRequiredModel500UnexpectedExceptionResponse = 1;
	Object.defineProperty(model500UnexpectedExceptionResponse, "__esModule", { value: true });
	return model500UnexpectedExceptionResponse;
}

var monthlyDividends = {};

var hasRequiredMonthlyDividends;

function requireMonthlyDividends () {
	if (hasRequiredMonthlyDividends) return monthlyDividends;
	hasRequiredMonthlyDividends = 1;
	Object.defineProperty(monthlyDividends, "__esModule", { value: true });
	return monthlyDividends;
}

var netContributions = {};

var hasRequiredNetContributions;

function requireNetContributions () {
	if (hasRequiredNetContributions) return netContributions;
	hasRequiredNetContributions = 1;
	Object.defineProperty(netContributions, "__esModule", { value: true });
	return netContributions;
}

var netDividend = {};

var hasRequiredNetDividend;

function requireNetDividend () {
	if (hasRequiredNetDividend) return netDividend;
	hasRequiredNetDividend = 1;
	Object.defineProperty(netDividend, "__esModule", { value: true });
	return netDividend;
}

var notionalValue = {};

var hasRequiredNotionalValue;

function requireNotionalValue () {
	if (hasRequiredNotionalValue) return notionalValue;
	hasRequiredNotionalValue = 1;
	Object.defineProperty(notionalValue, "__esModule", { value: true });
	return notionalValue;
}

var optionBrokerageSymbol = {};

var hasRequiredOptionBrokerageSymbol;

function requireOptionBrokerageSymbol () {
	if (hasRequiredOptionBrokerageSymbol) return optionBrokerageSymbol;
	hasRequiredOptionBrokerageSymbol = 1;
	Object.defineProperty(optionBrokerageSymbol, "__esModule", { value: true });
	return optionBrokerageSymbol;
}

var optionChainInner = {};

var hasRequiredOptionChainInner;

function requireOptionChainInner () {
	if (hasRequiredOptionChainInner) return optionChainInner;
	hasRequiredOptionChainInner = 1;
	Object.defineProperty(optionChainInner, "__esModule", { value: true });
	return optionChainInner;
}

var optionChainInnerChainPerRootInner = {};

var hasRequiredOptionChainInnerChainPerRootInner;

function requireOptionChainInnerChainPerRootInner () {
	if (hasRequiredOptionChainInnerChainPerRootInner) return optionChainInnerChainPerRootInner;
	hasRequiredOptionChainInnerChainPerRootInner = 1;
	Object.defineProperty(optionChainInnerChainPerRootInner, "__esModule", { value: true });
	return optionChainInnerChainPerRootInner;
}

var optionChainInnerChainPerRootInnerChainPerStrikePriceInner = {};

var hasRequiredOptionChainInnerChainPerRootInnerChainPerStrikePriceInner;

function requireOptionChainInnerChainPerRootInnerChainPerStrikePriceInner () {
	if (hasRequiredOptionChainInnerChainPerRootInnerChainPerStrikePriceInner) return optionChainInnerChainPerRootInnerChainPerStrikePriceInner;
	hasRequiredOptionChainInnerChainPerRootInnerChainPerStrikePriceInner = 1;
	Object.defineProperty(optionChainInnerChainPerRootInnerChainPerStrikePriceInner, "__esModule", { value: true });
	return optionChainInnerChainPerRootInnerChainPerStrikePriceInner;
}

var optionLeg = {};

var hasRequiredOptionLeg;

function requireOptionLeg () {
	if (hasRequiredOptionLeg) return optionLeg;
	hasRequiredOptionLeg = 1;
	Object.defineProperty(optionLeg, "__esModule", { value: true });
	return optionLeg;
}

var optionStrategy = {};

var hasRequiredOptionStrategy;

function requireOptionStrategy () {
	if (hasRequiredOptionStrategy) return optionStrategy;
	hasRequiredOptionStrategy = 1;
	Object.defineProperty(optionStrategy, "__esModule", { value: true });
	return optionStrategy;
}

var optionStrategyLegsInner = {};

var hasRequiredOptionStrategyLegsInner;

function requireOptionStrategyLegsInner () {
	if (hasRequiredOptionStrategyLegsInner) return optionStrategyLegsInner;
	hasRequiredOptionStrategyLegsInner = 1;
	Object.defineProperty(optionStrategyLegsInner, "__esModule", { value: true });
	return optionStrategyLegsInner;
}

var optionsGetOptionStrategyRequest = {};

var hasRequiredOptionsGetOptionStrategyRequest;

function requireOptionsGetOptionStrategyRequest () {
	if (hasRequiredOptionsGetOptionStrategyRequest) return optionsGetOptionStrategyRequest;
	hasRequiredOptionsGetOptionStrategyRequest = 1;
	Object.defineProperty(optionsGetOptionStrategyRequest, "__esModule", { value: true });
	return optionsGetOptionStrategyRequest;
}

var optionsPlaceOptionStrategyRequest = {};

var hasRequiredOptionsPlaceOptionStrategyRequest;

function requireOptionsPlaceOptionStrategyRequest () {
	if (hasRequiredOptionsPlaceOptionStrategyRequest) return optionsPlaceOptionStrategyRequest;
	hasRequiredOptionsPlaceOptionStrategyRequest = 1;
	Object.defineProperty(optionsPlaceOptionStrategyRequest, "__esModule", { value: true });
	return optionsPlaceOptionStrategyRequest;
}

var optionsPosition = {};

var hasRequiredOptionsPosition;

function requireOptionsPosition () {
	if (hasRequiredOptionsPosition) return optionsPosition;
	hasRequiredOptionsPosition = 1;
	Object.defineProperty(optionsPosition, "__esModule", { value: true });
	return optionsPosition;
}

var optionsPositionCurrency = {};

var hasRequiredOptionsPositionCurrency;

function requireOptionsPositionCurrency () {
	if (hasRequiredOptionsPositionCurrency) return optionsPositionCurrency;
	hasRequiredOptionsPositionCurrency = 1;
	Object.defineProperty(optionsPositionCurrency, "__esModule", { value: true });
	return optionsPositionCurrency;
}

var optionsSymbol = {};

var hasRequiredOptionsSymbol;

function requireOptionsSymbol () {
	if (hasRequiredOptionsSymbol) return optionsSymbol;
	hasRequiredOptionsSymbol = 1;
	Object.defineProperty(optionsSymbol, "__esModule", { value: true });
	return optionsSymbol;
}

var orderTypeStrict = {};

var hasRequiredOrderTypeStrict;

function requireOrderTypeStrict () {
	if (hasRequiredOrderTypeStrict) return orderTypeStrict;
	hasRequiredOrderTypeStrict = 1;
	Object.defineProperty(orderTypeStrict, "__esModule", { value: true });
	return orderTypeStrict;
}

var partnerData = {};

var hasRequiredPartnerData;

function requirePartnerData () {
	if (hasRequiredPartnerData) return partnerData;
	hasRequiredPartnerData = 1;
	Object.defineProperty(partnerData, "__esModule", { value: true });
	return partnerData;
}

var pastValue = {};

var hasRequiredPastValue;

function requirePastValue () {
	if (hasRequiredPastValue) return pastValue;
	hasRequiredPastValue = 1;
	Object.defineProperty(pastValue, "__esModule", { value: true });
	return pastValue;
}

var performanceCustom = {};

var hasRequiredPerformanceCustom;

function requirePerformanceCustom () {
	if (hasRequiredPerformanceCustom) return performanceCustom;
	hasRequiredPerformanceCustom = 1;
	Object.defineProperty(performanceCustom, "__esModule", { value: true });
	return performanceCustom;
}

var position = {};

var hasRequiredPosition;

function requirePosition () {
	if (hasRequiredPosition) return position;
	hasRequiredPosition = 1;
	Object.defineProperty(position, "__esModule", { value: true });
	return position;
}

var positionSymbol = {};

var hasRequiredPositionSymbol;

function requirePositionSymbol () {
	if (hasRequiredPositionSymbol) return positionSymbol;
	hasRequiredPositionSymbol = 1;
	Object.defineProperty(positionSymbol, "__esModule", { value: true });
	return positionSymbol;
}

var rateOfReturnObject = {};

var hasRequiredRateOfReturnObject;

function requireRateOfReturnObject () {
	if (hasRequiredRateOfReturnObject) return rateOfReturnObject;
	hasRequiredRateOfReturnObject = 1;
	Object.defineProperty(rateOfReturnObject, "__esModule", { value: true });
	return rateOfReturnObject;
}

var rateOfReturnResponse = {};

var hasRequiredRateOfReturnResponse;

function requireRateOfReturnResponse () {
	if (hasRequiredRateOfReturnResponse) return rateOfReturnResponse;
	hasRequiredRateOfReturnResponse = 1;
	Object.defineProperty(rateOfReturnResponse, "__esModule", { value: true });
	return rateOfReturnResponse;
}

var recentOrdersResponse = {};

var hasRequiredRecentOrdersResponse;

function requireRecentOrdersResponse () {
	if (hasRequiredRecentOrdersResponse) return recentOrdersResponse;
	hasRequiredRecentOrdersResponse = 1;
	Object.defineProperty(recentOrdersResponse, "__esModule", { value: true });
	return recentOrdersResponse;
}

var securityType = {};

var hasRequiredSecurityType;

function requireSecurityType () {
	if (hasRequiredSecurityType) return securityType;
	hasRequiredSecurityType = 1;
	Object.defineProperty(securityType, "__esModule", { value: true });
	return securityType;
}

var sessionEvent = {};

var hasRequiredSessionEvent;

function requireSessionEvent () {
	if (hasRequiredSessionEvent) return sessionEvent;
	hasRequiredSessionEvent = 1;
	Object.defineProperty(sessionEvent, "__esModule", { value: true });
	return sessionEvent;
}

var snapTradeHoldingsAccount = {};

var hasRequiredSnapTradeHoldingsAccount;

function requireSnapTradeHoldingsAccount () {
	if (hasRequiredSnapTradeHoldingsAccount) return snapTradeHoldingsAccount;
	hasRequiredSnapTradeHoldingsAccount = 1;
	Object.defineProperty(snapTradeHoldingsAccount, "__esModule", { value: true });
	return snapTradeHoldingsAccount;
}

var snapTradeHoldingsTotalValue = {};

var hasRequiredSnapTradeHoldingsTotalValue;

function requireSnapTradeHoldingsTotalValue () {
	if (hasRequiredSnapTradeHoldingsTotalValue) return snapTradeHoldingsTotalValue;
	hasRequiredSnapTradeHoldingsTotalValue = 1;
	Object.defineProperty(snapTradeHoldingsTotalValue, "__esModule", { value: true });
	return snapTradeHoldingsTotalValue;
}

var snapTradeLoginUserRequestBody = {};

var hasRequiredSnapTradeLoginUserRequestBody;

function requireSnapTradeLoginUserRequestBody () {
	if (hasRequiredSnapTradeLoginUserRequestBody) return snapTradeLoginUserRequestBody;
	hasRequiredSnapTradeLoginUserRequestBody = 1;
	Object.defineProperty(snapTradeLoginUserRequestBody, "__esModule", { value: true });
	return snapTradeLoginUserRequestBody;
}

var snapTradeRegisterUserRequestBody = {};

var hasRequiredSnapTradeRegisterUserRequestBody;

function requireSnapTradeRegisterUserRequestBody () {
	if (hasRequiredSnapTradeRegisterUserRequestBody) return snapTradeRegisterUserRequestBody;
	hasRequiredSnapTradeRegisterUserRequestBody = 1;
	Object.defineProperty(snapTradeRegisterUserRequestBody, "__esModule", { value: true });
	return snapTradeRegisterUserRequestBody;
}

var status = {};

var hasRequiredStatus;

function requireStatus () {
	if (hasRequiredStatus) return status;
	hasRequiredStatus = 1;
	Object.defineProperty(status, "__esModule", { value: true });
	return status;
}

var strategyOrderRecord = {};

var hasRequiredStrategyOrderRecord;

function requireStrategyOrderRecord () {
	if (hasRequiredStrategyOrderRecord) return strategyOrderRecord;
	hasRequiredStrategyOrderRecord = 1;
	Object.defineProperty(strategyOrderRecord, "__esModule", { value: true });
	return strategyOrderRecord;
}

var strategyQuotes = {};

var hasRequiredStrategyQuotes;

function requireStrategyQuotes () {
	if (hasRequiredStrategyQuotes) return strategyQuotes;
	hasRequiredStrategyQuotes = 1;
	Object.defineProperty(strategyQuotes, "__esModule", { value: true });
	return strategyQuotes;
}

var strategyQuotesGreek = {};

var hasRequiredStrategyQuotesGreek;

function requireStrategyQuotesGreek () {
	if (hasRequiredStrategyQuotesGreek) return strategyQuotesGreek;
	hasRequiredStrategyQuotesGreek = 1;
	Object.defineProperty(strategyQuotesGreek, "__esModule", { value: true });
	return strategyQuotesGreek;
}

var subPeriodReturnRate = {};

var hasRequiredSubPeriodReturnRate;

function requireSubPeriodReturnRate () {
	if (hasRequiredSubPeriodReturnRate) return subPeriodReturnRate;
	hasRequiredSubPeriodReturnRate = 1;
	Object.defineProperty(subPeriodReturnRate, "__esModule", { value: true });
	return subPeriodReturnRate;
}

var symbol = {};

var hasRequiredSymbol;

function requireSymbol () {
	if (hasRequiredSymbol) return symbol;
	hasRequiredSymbol = 1;
	Object.defineProperty(symbol, "__esModule", { value: true });
	return symbol;
}

var symbolCurrency = {};

var hasRequiredSymbolCurrency;

function requireSymbolCurrency () {
	if (hasRequiredSymbolCurrency) return symbolCurrency;
	hasRequiredSymbolCurrency = 1;
	Object.defineProperty(symbolCurrency, "__esModule", { value: true });
	return symbolCurrency;
}

var symbolExchange = {};

var hasRequiredSymbolExchange;

function requireSymbolExchange () {
	if (hasRequiredSymbolExchange) return symbolExchange;
	hasRequiredSymbolExchange = 1;
	Object.defineProperty(symbolExchange, "__esModule", { value: true });
	return symbolExchange;
}

var symbolFigiInstrument = {};

var hasRequiredSymbolFigiInstrument;

function requireSymbolFigiInstrument () {
	if (hasRequiredSymbolFigiInstrument) return symbolFigiInstrument;
	hasRequiredSymbolFigiInstrument = 1;
	Object.defineProperty(symbolFigiInstrument, "__esModule", { value: true });
	return symbolFigiInstrument;
}

var symbolQuery = {};

var hasRequiredSymbolQuery;

function requireSymbolQuery () {
	if (hasRequiredSymbolQuery) return symbolQuery;
	hasRequiredSymbolQuery = 1;
	Object.defineProperty(symbolQuery, "__esModule", { value: true });
	return symbolQuery;
}

var symbolsQuotesInner = {};

var hasRequiredSymbolsQuotesInner;

function requireSymbolsQuotesInner () {
	if (hasRequiredSymbolsQuotesInner) return symbolsQuotesInner;
	hasRequiredSymbolsQuotesInner = 1;
	Object.defineProperty(symbolsQuotesInner, "__esModule", { value: true });
	return symbolsQuotesInner;
}

var timeInForceStrict = {};

var hasRequiredTimeInForceStrict;

function requireTimeInForceStrict () {
	if (hasRequiredTimeInForceStrict) return timeInForceStrict;
	hasRequiredTimeInForceStrict = 1;
	Object.defineProperty(timeInForceStrict, "__esModule", { value: true });
	return timeInForceStrict;
}

var tradingCancelUserAccountOrderRequest = {};

var hasRequiredTradingCancelUserAccountOrderRequest;

function requireTradingCancelUserAccountOrderRequest () {
	if (hasRequiredTradingCancelUserAccountOrderRequest) return tradingCancelUserAccountOrderRequest;
	hasRequiredTradingCancelUserAccountOrderRequest = 1;
	Object.defineProperty(tradingCancelUserAccountOrderRequest, "__esModule", { value: true });
	return tradingCancelUserAccountOrderRequest;
}

var transactionsStatus = {};

var hasRequiredTransactionsStatus;

function requireTransactionsStatus () {
	if (hasRequiredTransactionsStatus) return transactionsStatus;
	hasRequiredTransactionsStatus = 1;
	Object.defineProperty(transactionsStatus, "__esModule", { value: true });
	return transactionsStatus;
}

var usexchange = {};

var hasRequiredUsexchange;

function requireUsexchange () {
	if (hasRequiredUsexchange) return usexchange;
	hasRequiredUsexchange = 1;
	Object.defineProperty(usexchange, "__esModule", { value: true });
	return usexchange;
}

var underlyingSymbol = {};

var hasRequiredUnderlyingSymbol;

function requireUnderlyingSymbol () {
	if (hasRequiredUnderlyingSymbol) return underlyingSymbol;
	hasRequiredUnderlyingSymbol = 1;
	Object.defineProperty(underlyingSymbol, "__esModule", { value: true });
	return underlyingSymbol;
}

var underlyingSymbolExchange = {};

var hasRequiredUnderlyingSymbolExchange;

function requireUnderlyingSymbolExchange () {
	if (hasRequiredUnderlyingSymbolExchange) return underlyingSymbolExchange;
	hasRequiredUnderlyingSymbolExchange = 1;
	Object.defineProperty(underlyingSymbolExchange, "__esModule", { value: true });
	return underlyingSymbolExchange;
}

var underlyingSymbolType = {};

var hasRequiredUnderlyingSymbolType;

function requireUnderlyingSymbolType () {
	if (hasRequiredUnderlyingSymbolType) return underlyingSymbolType;
	hasRequiredUnderlyingSymbolType = 1;
	Object.defineProperty(underlyingSymbolType, "__esModule", { value: true });
	return underlyingSymbolType;
}

var universalActivity = {};

var hasRequiredUniversalActivity;

function requireUniversalActivity () {
	if (hasRequiredUniversalActivity) return universalActivity;
	hasRequiredUniversalActivity = 1;
	Object.defineProperty(universalActivity, "__esModule", { value: true });
	return universalActivity;
}

var universalActivityCurrency = {};

var hasRequiredUniversalActivityCurrency;

function requireUniversalActivityCurrency () {
	if (hasRequiredUniversalActivityCurrency) return universalActivityCurrency;
	hasRequiredUniversalActivityCurrency = 1;
	Object.defineProperty(universalActivityCurrency, "__esModule", { value: true });
	return universalActivityCurrency;
}

var universalActivityOptionSymbol = {};

var hasRequiredUniversalActivityOptionSymbol;

function requireUniversalActivityOptionSymbol () {
	if (hasRequiredUniversalActivityOptionSymbol) return universalActivityOptionSymbol;
	hasRequiredUniversalActivityOptionSymbol = 1;
	Object.defineProperty(universalActivityOptionSymbol, "__esModule", { value: true });
	return universalActivityOptionSymbol;
}

var universalActivitySymbol = {};

var hasRequiredUniversalActivitySymbol;

function requireUniversalActivitySymbol () {
	if (hasRequiredUniversalActivitySymbol) return universalActivitySymbol;
	hasRequiredUniversalActivitySymbol = 1;
	Object.defineProperty(universalActivitySymbol, "__esModule", { value: true });
	return universalActivitySymbol;
}

var universalSymbol = {};

var hasRequiredUniversalSymbol;

function requireUniversalSymbol () {
	if (hasRequiredUniversalSymbol) return universalSymbol;
	hasRequiredUniversalSymbol = 1;
	Object.defineProperty(universalSymbol, "__esModule", { value: true });
	return universalSymbol;
}

var userIdandSecret = {};

var hasRequiredUserIdandSecret;

function requireUserIdandSecret () {
	if (hasRequiredUserIdandSecret) return userIdandSecret;
	hasRequiredUserIdandSecret = 1;
	Object.defineProperty(userIdandSecret, "__esModule", { value: true });
	return userIdandSecret;
}

var validatedTradeBody = {};

var hasRequiredValidatedTradeBody;

function requireValidatedTradeBody () {
	if (hasRequiredValidatedTradeBody) return validatedTradeBody;
	hasRequiredValidatedTradeBody = 1;
	Object.defineProperty(validatedTradeBody, "__esModule", { value: true });
	return validatedTradeBody;
}

var hasRequiredModels;

function requireModels () {
	if (hasRequiredModels) return models;
	hasRequiredModels = 1;
	(function (exports) {
		var __createBinding = (models.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (models.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		__exportStar(requireAccount(), exports);
		__exportStar(requireAccountBalance(), exports);
		__exportStar(requireAccountBalanceTotal(), exports);
		__exportStar(requireAccountHoldings(), exports);
		__exportStar(requireAccountHoldingsAccount(), exports);
		__exportStar(requireAccountOrderRecord(), exports);
		__exportStar(requireAccountOrderRecordOptionSymbol(), exports);
		__exportStar(requireAccountOrderRecordStatus(), exports);
		__exportStar(requireAccountOrderRecordUniversalSymbol(), exports);
		__exportStar(requireAccountSimple(), exports);
		__exportStar(requireAccountSyncStatus(), exports);
		__exportStar(requireActionStrict(), exports);
		__exportStar(requireActionStrictWithOptions(), exports);
		__exportStar(requireAuthenticationLoginSnapTradeUser200Response(), exports);
		__exportStar(requireBalance(), exports);
		__exportStar(requireBalanceCurrency(), exports);
		__exportStar(requireBrokerage(), exports);
		__exportStar(requireBrokerageAuthorization(), exports);
		__exportStar(requireBrokerageAuthorizationDisabledConfirmation(), exports);
		__exportStar(requireBrokerageAuthorizationRefreshConfirmation(), exports);
		__exportStar(requireBrokerageAuthorizationTypeReadOnly(), exports);
		__exportStar(requireBrokerageAuthorizationTypeReadOnlyBrokerage(), exports);
		__exportStar(requireBrokerageType(), exports);
		__exportStar(requireConnectionsSessionEvents200ResponseInner(), exports);
		__exportStar(requireCurrency(), exports);
		__exportStar(requireDeleteUserResponse(), exports);
		__exportStar(requireDividendAtDate(), exports);
		__exportStar(requireEncryptedResponse(), exports);
		__exportStar(requireEncryptedResponseEncryptedMessageData(), exports);
		__exportStar(requireExchange(), exports);
		__exportStar(requireExchangeRatePairs(), exports);
		__exportStar(requireFigiInstrument(), exports);
		__exportStar(requireHoldingsStatus(), exports);
		__exportStar(requireLoginRedirectUri(), exports);
		__exportStar(requireManualTrade(), exports);
		__exportStar(requireManualTradeAndImpact(), exports);
		__exportStar(requireManualTradeBalance(), exports);
		__exportStar(requireManualTradeForm(), exports);
		__exportStar(requireManualTradeFormNotionalValue(), exports);
		__exportStar(requireManualTradeFormWithOptions(), exports);
		__exportStar(requireManualTradeImpact(), exports);
		__exportStar(requireManualTradeSymbol(), exports);
		__exportStar(requireModel400FailedRequestResponse(), exports);
		__exportStar(requireModel401FailedRequestResponse(), exports);
		__exportStar(requireModel402BrokerageAuthAlreadyDisabledException(), exports);
		__exportStar(requireModel402BrokerageAuthDisabledResponse(), exports);
		__exportStar(requireModel403FailedRequestResponse(), exports);
		__exportStar(requireModel403FeatureNotEnabledResponse(), exports);
		__exportStar(requireModel404FailedRequestResponse(), exports);
		__exportStar(requireModel425FailedRequestResponse(), exports);
		__exportStar(requireModel500UnexpectedExceptionResponse(), exports);
		__exportStar(requireMonthlyDividends(), exports);
		__exportStar(requireNetContributions(), exports);
		__exportStar(requireNetDividend(), exports);
		__exportStar(requireNotionalValue(), exports);
		__exportStar(requireOptionBrokerageSymbol(), exports);
		__exportStar(requireOptionChainInner(), exports);
		__exportStar(requireOptionChainInnerChainPerRootInner(), exports);
		__exportStar(requireOptionChainInnerChainPerRootInnerChainPerStrikePriceInner(), exports);
		__exportStar(requireOptionLeg(), exports);
		__exportStar(requireOptionStrategy(), exports);
		__exportStar(requireOptionStrategyLegsInner(), exports);
		__exportStar(requireOptionsGetOptionStrategyRequest(), exports);
		__exportStar(requireOptionsPlaceOptionStrategyRequest(), exports);
		__exportStar(requireOptionsPosition(), exports);
		__exportStar(requireOptionsPositionCurrency(), exports);
		__exportStar(requireOptionsSymbol(), exports);
		__exportStar(requireOrderTypeStrict(), exports);
		__exportStar(requirePartnerData(), exports);
		__exportStar(requirePastValue(), exports);
		__exportStar(requirePerformanceCustom(), exports);
		__exportStar(requirePosition(), exports);
		__exportStar(requirePositionSymbol(), exports);
		__exportStar(requireRateOfReturnObject(), exports);
		__exportStar(requireRateOfReturnResponse(), exports);
		__exportStar(requireRecentOrdersResponse(), exports);
		__exportStar(requireSecurityType(), exports);
		__exportStar(requireSessionEvent(), exports);
		__exportStar(requireSnapTradeHoldingsAccount(), exports);
		__exportStar(requireSnapTradeHoldingsTotalValue(), exports);
		__exportStar(requireSnapTradeLoginUserRequestBody(), exports);
		__exportStar(requireSnapTradeRegisterUserRequestBody(), exports);
		__exportStar(requireStatus(), exports);
		__exportStar(requireStrategyOrderRecord(), exports);
		__exportStar(requireStrategyQuotes(), exports);
		__exportStar(requireStrategyQuotesGreek(), exports);
		__exportStar(requireSubPeriodReturnRate(), exports);
		__exportStar(requireSymbol(), exports);
		__exportStar(requireSymbolCurrency(), exports);
		__exportStar(requireSymbolExchange(), exports);
		__exportStar(requireSymbolFigiInstrument(), exports);
		__exportStar(requireSymbolQuery(), exports);
		__exportStar(requireSymbolsQuotesInner(), exports);
		__exportStar(requireTimeInForceStrict(), exports);
		__exportStar(requireTradingCancelUserAccountOrderRequest(), exports);
		__exportStar(requireTransactionsStatus(), exports);
		__exportStar(requireUsexchange(), exports);
		__exportStar(requireUnderlyingSymbol(), exports);
		__exportStar(requireUnderlyingSymbolExchange(), exports);
		__exportStar(requireUnderlyingSymbolType(), exports);
		__exportStar(requireUniversalActivity(), exports);
		__exportStar(requireUniversalActivityCurrency(), exports);
		__exportStar(requireUniversalActivityOptionSymbol(), exports);
		__exportStar(requireUniversalActivitySymbol(), exports);
		__exportStar(requireUniversalSymbol(), exports);
		__exportStar(requireUserIdandSecret(), exports);
		__exportStar(requireValidatedTradeBody(), exports); 
	} (models));
	return models;
}

var client = {};

var clientCustom = {};

var hasRequiredClientCustom;

function requireClientCustom () {
	if (hasRequiredClientCustom) return clientCustom;
	hasRequiredClientCustom = 1;
	Object.defineProperty(clientCustom, "__esModule", { value: true });
	clientCustom.SnaptradeCustom = void 0;
	class SnaptradeCustom {
	    constructor(configurationParameters) { }
	}
	clientCustom.SnaptradeCustom = SnaptradeCustom;
	return clientCustom;
}

var hasRequiredClient;

function requireClient () {
	if (hasRequiredClient) return client;
	hasRequiredClient = 1;
	/*
	SnapTrade

	Connect brokerage accounts to your app for live positions and trading

	The version of the OpenAPI document: 1.0.0
	Contact: api@snaptrade.com

	NOTE: This file is auto generated by Konfig (https://konfigthis.com).
	*/
	Object.defineProperty(client, "__esModule", { value: true });
	client.Snaptrade = void 0;
	const api_1 = requireApi();
	const configuration_1 = requireConfiguration();
	const client_custom_1 = requireClientCustom();
	class Snaptrade extends client_custom_1.SnaptradeCustom {
	    constructor(configurationParameters = {}) {
	        super(configurationParameters);
	        const configuration = new configuration_1.Configuration(configurationParameters);
	        this.accountInformation = new api_1.AccountInformationApi(configuration);
	        this.apiStatus = new api_1.ApiStatusApi(configuration);
	        this.authentication = new api_1.AuthenticationApi(configuration);
	        this.connections = new api_1.ConnectionsApi(configuration);
	        this.options = new api_1.OptionsApi(configuration);
	        this.referenceData = new api_1.ReferenceDataApi(configuration);
	        this.trading = new api_1.TradingApi(configuration);
	        this.transactionsAndReporting = new api_1.TransactionsAndReportingApi(configuration);
	    }
	}
	client.Snaptrade = Snaptrade;
	return client;
}

var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist;
	hasRequiredDist = 1;
	(function (exports) {
		/* tslint:disable */
		/* eslint-disable */
		/*
		SnapTrade

		Connect brokerage accounts to your app for live positions and trading

		The version of the OpenAPI document: 1.0.0
		Contact: api@snaptrade.com

		NOTE: This file is auto generated by Konfig (https://konfigthis.com).
		*/
		var __createBinding = (dist.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (dist.__exportStar) || function(m, exports) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		__exportStar(requireApi(), exports);
		__exportStar(requireConfiguration(), exports);
		__exportStar(requireModels(), exports);
		__exportStar(requireClient(), exports);
		__exportStar(requireError(), exports); 
	} (dist));
	return dist;
}

var distExports = requireDist();

var Snaptrade = distExports.Snaptrade;
export { Snaptrade };
//# sourceMappingURL=mod.js.map
