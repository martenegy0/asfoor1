var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "../node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                null != _ioInfo && (_ioInfo.end = performance.now());
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now());
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            ioInfo.value = thenable;
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = fnName;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = deprecatedAPIs;
      exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++)
          validateChildKeys(arguments[i]);
        i = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          key,
          i,
          getOwner(),
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports.version = "19.2.7";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// ../node_modules/react/index.js
var require_react = __commonJS({
  "../node_modules/react/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_development();
    }
  }
});

// ../node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "../node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
    "use strict";
    (function() {
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children)
          if (isStaticChildren)
            if (isArrayImpl(children)) {
              for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
                validateChildKeys(children[isStaticChildren]);
              Object.freeze && Object.freeze(children);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
          children = getComponentNameFromType(type);
          var keys = Object.keys(config).filter(function(k) {
            return "key" !== k;
          });
          isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
          didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
            'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
            isStaticChildren,
            children,
            keys,
            children
          ), didWarnAboutKeySpread[children + isStaticChildren] = true);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(
          maybeKey,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        return ReactElement(
          type,
          children,
          maybeKey,
          getOwner(),
          debugStack,
          debugTask
        );
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      var React2 = require_react(), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      React2 = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = React2.react_stack_bottom_frame.bind(
        React2,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutKeySpread = {};
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          false,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.jsxs = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          true,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
    })();
  }
});

// ../node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "../node_modules/react/jsx-runtime.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_jsx_runtime_development();
    }
  }
});

// src/components/Ledger.tsx
var import_react3 = __toESM(require_react(), 1);

// ../node_modules/lucide-react/dist/esm/createLucideIcon.js
var import_react2 = __toESM(require_react());

// ../node_modules/lucide-react/dist/esm/shared/src/utils.js
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
var toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
var toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
var hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};

// ../node_modules/lucide-react/dist/esm/Icon.js
var import_react = __toESM(require_react());

// ../node_modules/lucide-react/dist/esm/defaultAttributes.js
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

// ../node_modules/lucide-react/dist/esm/Icon.js
var Icon = (0, import_react.forwardRef)(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => (0, import_react.createElement)(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);

// ../node_modules/lucide-react/dist/esm/createLucideIcon.js
var createLucideIcon = (iconName, iconNode) => {
  const Component = (0, import_react2.forwardRef)(
    ({ className, ...props }, ref) => (0, import_react2.createElement)(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};

// ../node_modules/lucide-react/dist/esm/icons/arrow-down-right.js
var __iconNode = [
  ["path", { d: "m7 7 10 10", key: "1fmybs" }],
  ["path", { d: "M17 7v10H7", key: "6fjiku" }]
];
var ArrowDownRight = createLucideIcon("arrow-down-right", __iconNode);

// ../node_modules/lucide-react/dist/esm/icons/arrow-left.js
var __iconNode2 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
var ArrowLeft = createLucideIcon("arrow-left", __iconNode2);

// ../node_modules/lucide-react/dist/esm/icons/arrow-up-right.js
var __iconNode3 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
var ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode3);

// ../node_modules/lucide-react/dist/esm/icons/calendar.js
var __iconNode4 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
var Calendar = createLucideIcon("calendar", __iconNode4);

// ../node_modules/lucide-react/dist/esm/icons/check.js
var __iconNode5 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
var Check = createLucideIcon("check", __iconNode5);

// ../node_modules/lucide-react/dist/esm/icons/chevron-down.js
var __iconNode6 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
var ChevronDown = createLucideIcon("chevron-down", __iconNode6);

// ../node_modules/lucide-react/dist/esm/icons/chevron-up.js
var __iconNode7 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
var ChevronUp = createLucideIcon("chevron-up", __iconNode7);

// ../node_modules/lucide-react/dist/esm/icons/circle-check.js
var __iconNode8 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
var CircleCheck = createLucideIcon("circle-check", __iconNode8);

// ../node_modules/lucide-react/dist/esm/icons/eye.js
var __iconNode9 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
var Eye = createLucideIcon("eye", __iconNode9);

// ../node_modules/lucide-react/dist/esm/icons/file-text.js
var __iconNode10 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
var FileText = createLucideIcon("file-text", __iconNode10);

// ../node_modules/lucide-react/dist/esm/icons/funnel.js
var __iconNode11 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
var Funnel = createLucideIcon("funnel", __iconNode11);

// ../node_modules/lucide-react/dist/esm/icons/loader-circle.js
var __iconNode12 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
var LoaderCircle = createLucideIcon("loader-circle", __iconNode12);

// ../node_modules/lucide-react/dist/esm/icons/lock.js
var __iconNode13 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
var Lock = createLucideIcon("lock", __iconNode13);

// ../node_modules/lucide-react/dist/esm/icons/search.js
var __iconNode14 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
var Search = createLucideIcon("search", __iconNode14);

// ../node_modules/lucide-react/dist/esm/icons/shield-alert.js
var __iconNode15 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
var ShieldAlert = createLucideIcon("shield-alert", __iconNode15);

// ../node_modules/lucide-react/dist/esm/icons/shield.js
var __iconNode16 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
var Shield = createLucideIcon("shield", __iconNode16);

// ../node_modules/lucide-react/dist/esm/icons/wallet.js
var __iconNode17 = [
  [
    "path",
    {
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      key: "18etb6"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
];
var Wallet = createLucideIcon("wallet", __iconNode17);

// src/utils.ts
async function apiCall(action, token, extraParams = {}, retries = 3) {
  const payload = { action, token, ...extraParams };
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12e4);
      let response;
      try {
        response = await fetch("/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
      } catch (fetchErr) {
        throw fetchErr;
      } finally {
        clearTimeout(timeoutId);
      }
      let responseText = "";
      try {
        responseText = await response.text();
      } catch (textErr) {
        throw new Error(`Failed to parse response stream: ${textErr?.message}`);
      }
      let resData;
      try {
        resData = JSON.parse(responseText);
      } catch (parseErr) {
        console.warn(`Non-JSON response for ${action}:`, responseText);
        if (response.status === 504) {
          return {
            ok: false,
            error: "\u0627\u0646\u062A\u0647\u062A \u0645\u0647\u0644\u0629 \u062E\u0627\u062F\u0645 \u0641\u064A\u0631\u0633\u064A\u0644 (504 Gateway Timeout). \u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0633\u0631\u0639\u0629 \u0627\u0633\u062A\u062C\u0627\u0628\u0629 \u0633\u0643\u0631\u064A\u0628\u062A \u062C\u0648\u062C\u0644 \u0634\u064A\u062A."
          };
        }
        if (response.status === 502 || response.status === 500) {
          return {
            ok: false,
            error: `\u0641\u0634\u0644 \u062E\u0627\u062F\u0645 \u0641\u064A\u0631\u0633\u064A\u0644 (\u0643\u0648\u062F ${response.status}). \u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u0623\u0643\u062F \u0645\u0646 \u0643\u062A\u0627\u0628\u0629 \u0645\u062A\u063A\u064A\u0631 GOOGLE_SCRIPT_URL \u0628\u0634\u0643\u0644 \u0635\u062D\u064A\u062D \u0648\u0625\u062C\u0631\u0627\u0621 Redeploy \u0644\u0644\u0645\u0648\u0642\u0639.`
          };
        }
        return {
          ok: false,
          error: `\u062E\u0637\u0623 \u0627\u062A\u0635\u0627\u0644 \u0645\u0646 \u0641\u064A\u0631\u0633\u064A\u0644 (${response.status}): \u064A\u0631\u062C\u0649 \u062A\u0641\u0639\u064A\u0644 \u0648\u0625\u062F\u062E\u0627\u0644 \u0645\u062A\u063A\u064A\u0631 GOOGLE_SCRIPT_URL \u0641\u064A \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0641\u064A\u0631\u0633\u064A\u0644`
        };
      }
      return resData;
    } catch (error) {
      if (i === retries) {
        console.error(`API Call failed after ${retries} retries for action ${action}:`, error);
        const isTimeout = error?.name === "AbortError";
        return {
          ok: false,
          error: isTimeout ? "\u0627\u0646\u062A\u0647\u062A \u0645\u0647\u0644\u0629 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u062E\u0627\u062F\u0645 (20 \u062B\u0627\u0646\u064A\u0629) \u062F\u0648\u0646 \u0631\u062F \u0645\u0646 \u062C\u0648\u062C\u0644 \u0634\u064A\u062A. \u064A\u0631\u062C\u0649 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629." : `\u062A\u0639\u0630\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u062E\u0627\u062F\u0645 \u0627\u0644\u0631\u0626\u064A\u0633\u064A: ${error?.message || "\u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A"}`
        };
      }
      await new Promise((res) => setTimeout(res, 3e3));
    }
  }
}

// src/components/Ledger.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function Ledger({ token, role, user, activeLedgerMode }) {
  const isSupplier = (role || "").toString().trim() === "\u0645\u0648\u0631\u062F" || (role || "").toString().trim().includes("\u0645\u0648\u0631\u062F");
  const isCourier = (role || "").toString().trim() === "\u0645\u0646\u062F\u0648\u0628" || (role || "").toString().trim().includes("\u0645\u0646\u062F\u0648\u0628");
  const isFinancial = (role || "").toString().trim() === "\u0645\u062F\u064A\u0631" || (role || "").toString().trim() === "\u0645\u062D\u0627\u0633\u0628" || (role || "").toString().trim().includes("\u0645\u062F\u064A\u0631") || (role || "").toString().trim().includes("\u0645\u062D\u0627\u0633\u0628");
  const [activeLedger, setActiveLedger] = (0, import_react3.useState)(
    activeLedgerMode || (isSupplier ? "supplier" : "courier")
  );
  (0, import_react3.useEffect)(() => {
    if (activeLedgerMode) {
      setActiveLedger(activeLedgerMode);
    }
  }, [activeLedgerMode]);
  const [subscribes, setSubscribes] = (0, import_react3.useState)([]);
  const [liveBalance, setLiveBalance] = (0, import_react3.useState)(0);
  const [supplierStats, setSupplierStats] = (0, import_react3.useState)(null);
  const [selectedSupplier, setSelectedSupplier] = (0, import_react3.useState)(isSupplier ? user : "");
  const [allSuppliers, setAllSuppliers] = (0, import_react3.useState)([]);
  const [suppliersDetails, setSuppliersDetails] = (0, import_react3.useState)([]);
  const [payAmount, setPayAmount] = (0, import_react3.useState)("");
  const [payDesc, setPayDesc] = (0, import_react3.useState)("");
  const [supplierTransType, setSupplierTransType] = (0, import_react3.useState)("payout");
  const [submittingLedger, setSubmittingLedger] = (0, import_react3.useState)(false);
  const [ledgerCache, setLedgerCache] = (0, import_react3.useState)({});
  const [dailyLedgers, setDailyLedger] = (0, import_react3.useState)(null);
  const [daySearchQuery, setDaySearchQuery] = (0, import_react3.useState)("");
  const [selectedDayOrdersDetail, setSelectedDayOrdersDetail] = (0, import_react3.useState)(null);
  const [selectedDayDate, setSelectedDayDate] = (0, import_react3.useState)("");
  const [selectedDayStatus, setSelectedDayStatus] = (0, import_react3.useState)("");
  const [settleDayProgress, setSettleDayProgress] = (0, import_react3.useState)("");
  const [modalSearchFilter, setModalSearchFilter] = (0, import_react3.useState)("");
  const [expandedDays, setExpandedDays] = (0, import_react3.useState)({});
  const [expandedCourierDays, setExpandedCourierDays] = (0, import_react3.useState)({});
  const toggleDay = (dateStr) => {
    setExpandedDays((prev) => ({ ...prev, [dateStr]: !prev[dateStr] }));
  };
  const toggleCourierDay = (dateStr) => {
    setExpandedCourierDays((prev) => ({ ...prev, [dateStr]: !prev[dateStr] }));
  };
  const [courierSummary, setCourierSummary] = (0, import_react3.useState)(null);
  const [courierTrs, setCourierTrs] = (0, import_react3.useState)([]);
  const [selectedCourier, setSelectedCourier] = (0, import_react3.useState)(() => {
    if (isCourier) return user;
    const pre = localStorage.getItem("preselected_courier");
    if (pre) {
      localStorage.removeItem("preselected_courier");
      return pre;
    }
    return "";
  });
  const [allCouriers, setAllCouriers] = (0, import_react3.useState)([]);
  const [periodFilter, setPeriodFilter] = (0, import_react3.useState)("month");
  const [adjustmentType, setAdjustmentType] = (0, import_react3.useState)("\u0645\u0643\u0627\u0641\u0623\u0629");
  const [adjAmount, setAdjAmount] = (0, import_react3.useState)("");
  const [adjDesc, setAdjDesc] = (0, import_react3.useState)("");
  const [handoverAmount, setHandoverAmount] = (0, import_react3.useState)("");
  const [handoverRef, setHandoverRef] = (0, import_react3.useState)("");
  const [handoverDesc, setHandoverDesc] = (0, import_react3.useState)("");
  const [loading, setLoading] = (0, import_react3.useState)(false);
  const [feedback, setFeedback] = (0, import_react3.useState)("");
  async function fetchResourceLists() {
    try {
      const promises = [apiCall("getSuppliers", token)];
      const financialCheck = isFinancial || role === "\u0645\u0634\u0631\u0641";
      if (financialCheck) {
        promises.push(apiCall("supplierAccounts", token));
        promises.push(apiCall("getCouriers", token));
      }
      const results = await Promise.all(promises);
      const resDetails = results[0];
      if (resDetails && resDetails.ok && resDetails.suppliers) {
        setSuppliersDetails(resDetails.suppliers);
      }
      if (financialCheck) {
        const resSuppliers = results[1];
        if (resSuppliers && resSuppliers.ok && resSuppliers.accounts && resSuppliers.accounts.length > 0) {
          setAllSuppliers(resSuppliers.accounts);
          if (!selectedSupplier) setSelectedSupplier(resSuppliers.accounts[0].name);
        }
        const resCouriers = results[2];
        if (resCouriers && resCouriers.ok && resCouriers.couriers && resCouriers.couriers.length > 0) {
          setAllCouriers(resCouriers.couriers);
          if (!selectedCourier) setSelectedCourier(resCouriers.couriers[0].name);
        }
      }
    } catch (err) {
      console.error("Failed to load resource lists in parallel", err);
    }
  }
  async function loadSupplierLedger() {
    const targetSup = isSupplier ? user : selectedSupplier;
    if (!targetSup) return;
    setFeedback("");
    if (ledgerCache[targetSup]) {
      const cached = ledgerCache[targetSup];
      setSubscribes(cached.subscribes);
      setLiveBalance(cached.liveBalance);
      setSupplierStats(cached.stats);
      setDailyLedger(cached.dailyLedger || null);
      setLoading(false);
    } else {
      setSubscribes([]);
      setLiveBalance(0);
      setSupplierStats(null);
      setDailyLedger(null);
      setLoading(true);
    }
    try {
      const res = await apiCall("getSupplierLedger", token, {
        supplier: targetSup
      });
      if (res.ok) {
        const finalEntries = res.entries || [];
        const actualBalance = res.balance !== void 0 ? res.balance : 0;
        const stats = res.stats || {
          totalOrdersCount: 0,
          totalGoodsUploaded: 0,
          deliveredOrdersCount: 0,
          deliveredOrdersValue: 0,
          returnsDeliveredCount: 0,
          returnsDeliveredValue: 0,
          paymentsValue: 0,
          reverseAdjustmentsValue: 0,
          outstanding: 0,
          rate: 0
        };
        setLedgerCache((prev) => ({
          ...prev,
          [targetSup]: {
            subscribes: finalEntries,
            liveBalance: actualBalance,
            stats,
            dailyLedger: res.dailyLedger || null
          }
        }));
        setSubscribes(finalEntries);
        setLiveBalance(actualBalance);
        setSupplierStats(stats);
        setDailyLedger(res.dailyLedger || null);
      } else {
        setFeedback(res.error || "\u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062A\u062D\u0645\u064A\u0644 \u0643\u0634\u0641 \u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0648\u0631\u062F");
      }
    } catch (err) {
      setFeedback("\u062D\u062F\u062B \u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u0634\u0628\u0643\u0629 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u062E\u0627\u062F\u0645");
    } finally {
      setLoading(false);
    }
  }
  async function handleSettleDay(dateStr) {
    const targetSup = isSupplier ? user : selectedSupplier;
    if (!targetSup) return;
    if (!confirm(`\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062A\u0635\u0641\u064A\u0629 \u0648\u0625\u0642\u0641\u0627\u0644 \u0643\u0627\u0634 \u062A\u0627\u0631\u064A\u062E ${dateStr} \u0644\u0644\u0645\u0648\u0631\u062F (${targetSup}) \u0648\u062A\u0633\u0644\u064A\u0645\u0647 \u0643\u0627\u0645\u0644 \u0645\u0633\u062A\u062D\u0642\u0627\u062A \u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0648\u062A\u0633\u062C\u064A\u0644 \u0642\u0641\u0644 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0629\u061F`)) {
      return;
    }
    setSettleDayProgress(dateStr);
    try {
      const res = await apiCall("settleSupplierDay", token, {
        supplier: targetSup,
        dateStr
      });
      if (res.ok) {
        await loadSupplierLedger();
      } else {
        alert(res.error || "\u0641\u0634\u0644 \u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u064A\u0648\u0645");
      }
    } catch (err) {
      alert("\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u062E\u0627\u062F\u0645 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u0635\u0641\u064A\u0629");
    } finally {
      setSettleDayProgress("");
    }
  }
  async function loadCourierLedger() {
    if (!selectedCourier && !isCourier) return;
    setLoading(true);
    setFeedback("");
    try {
      const res = await apiCall("getCourierLedger", token, {
        courier: isCourier ? user : selectedCourier,
        period: periodFilter
      });
      if (res.ok) {
        setCourierSummary(res.ledgerInfo);
        setCourierTrs(res.transactions || []);
      } else {
        setFeedback(res.error || "\u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062A\u062D\u0645\u064A\u0644 \u0643\u0634\u0641 \u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0627\u0644\u0645\u0627\u0644\u064A\u0629");
      }
    } catch (err) {
      setFeedback("\u0641\u0634\u0644 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0645\u0627\u0644\u064A \u0644\u0644\u0645\u0646\u0627\u062F\u064A\u0628");
    } finally {
      setLoading(false);
    }
  }
  (0, import_react3.useEffect)(() => {
    fetchResourceLists();
  }, [token]);
  (0, import_react3.useEffect)(() => {
    if (isSupplier && user) {
      setSelectedSupplier(user);
    }
  }, [isSupplier, user]);
  (0, import_react3.useEffect)(() => {
    if (activeLedger === "supplier") {
      loadSupplierLedger();
    } else {
      loadCourierLedger();
    }
  }, [activeLedger, selectedSupplier, selectedCourier, periodFilter, user]);
  async function handleSupplierPayout(e) {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) {
      alert("\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0645\u0628\u0644\u063A \u0635\u062D\u064A\u062D");
      return;
    }
    setSubmittingLedger(true);
    try {
      const isWithdrawal = supplierTransType === "withdrawal";
      const res = await apiCall("addSupplierPayment", token, {
        supplier: selectedSupplier,
        amount: Number(payAmount),
        desc: payDesc.trim() || (isWithdrawal ? `\u0633\u062D\u0628 \u0645\u0627\u0644\u064A / \u062A\u0633\u0648\u064A\u0629 \u0639\u0643\u0633\u064A\u0629 \u0645\u0646 \u0627\u0644\u0645\u0648\u0631\u062F: ${selectedSupplier}` : `\u0635\u0631\u0641 \u062F\u0641\u0639\u0629 \u0644\u0644\u0645\u0648\u0631\u062F: ${selectedSupplier}`),
        transactionType: supplierTransType
      });
      if (res.ok) {
        setPayAmount("");
        setPayDesc("");
        setSupplierTransType("payout");
        loadSupplierLedger();
        alert(isWithdrawal ? "\u2705 \u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0633\u062D\u0628 \u0648\u062A\u0633\u0648\u064A\u062A\u0647 \u0628\u0627\u0644\u062E\u0632\u0646\u0629 \u0628\u0646\u062C\u0627\u062D" : "\u2705 \u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0633\u062F\u0627\u062F \u0627\u0644\u0645\u0627\u0644\u064A \u0648\u0635\u0631\u0641\u0647 \u0645\u0646 \u0627\u0644\u062E\u0632\u064A\u0646\u0629 \u0628\u0646\u062C\u0627\u062D");
      } else {
        alert("\u26A0\uFE0F " + res.error);
      }
    } catch (err) {
      alert("\u0639\u0637\u0644 \u0641\u064A \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0639\u0645\u0644\u064A\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629");
    } finally {
      setSubmittingLedger(false);
    }
  }
  async function handleCourierAdjustment(e) {
    e.preventDefault();
    if (!adjAmount || Number(adjAmount) <= 0) {
      alert("\u064A\u0631\u062C\u0649 \u0625\u0631\u0633\u0627\u0621 \u0642\u064A\u0645\u0629 \u062A\u0639\u062F\u064A\u0644 \u0635\u062D\u064A\u062D\u0629");
      return;
    }
    const val = Number(adjAmount);
    const type = adjustmentType;
    const desc = adjDesc.trim() || `${adjustmentType} \u0644\u0644\u0645\u0646\u062F\u0648\u0628 ${selectedCourier}`;
    const courier = selectedCourier;
    setAdjAmount("");
    setAdjDesc("");
    if (courierSummary) {
      const isBonus = type === "\u0645\u0643\u0627\u0641\u0623\u0629";
      const nextBonusesSum = courierSummary.bonusesSum + (isBonus ? val : 0);
      const nextPenaltiesSum = courierSummary.penaltiesSum + (!isBonus ? val : 0);
      const nextNetSalary = courierSummary.netSalary + (isBonus ? val : -val);
      const nextTodayBonuses = (courierSummary.todayBonuses || 0) + (isBonus ? val : 0);
      const nextTodayPenalties = (courierSummary.todayPenalties || 0) + (!isBonus ? val : 0);
      const nextRequiredHandoverToday = (courierSummary.requiredHandoverToday || 0) + (isBonus ? val : -val);
      setCourierSummary({
        ...courierSummary,
        bonusesSum: nextBonusesSum,
        penaltiesSum: nextPenaltiesSum,
        netSalary: nextNetSalary,
        todayBonuses: nextTodayBonuses,
        todayPenalties: nextTodayPenalties,
        requiredHandoverToday: nextRequiredHandoverToday
      });
    }
    const mockTx = {
      courier,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      type,
      tracking: "ADJUST",
      amount: val,
      desc
    };
    setCourierTrs((prev) => [mockTx, ...prev]);
    alert(`\u2705 \u062A\u0645 \u062D\u0641\u0638 \u062A\u0633\u0648\u064A\u0629 \u0627\u0644\u0640 ${type} \u0628\u0646\u062C\u0627\u062D \u0648\u0628\u062F\u0621 \u064A\u0648\u0645 \u062C\u062F\u064A\u062F (\u0645\u0632\u0627\u0645\u0646\u0629 \u062E\u0644\u0641\u064A\u0629 \u062C\u0627\u0647\u0632\u0629)`);
    window.dispatchEvent(new CustomEvent("bg-sync-start"));
    apiCall("addCourierAdjustment", token, {
      courier,
      type,
      amount: val,
      desc
    }).then((res) => {
      if (res && res.ok) {
        console.log("Asynchronous courier adjustment saved successfully");
        loadCourierLedger();
      } else {
        console.error("Asynchronous courier adjustment sync error:", res?.error);
      }
    }).catch((err) => {
      console.error("Asynchronous courier adjustment call failed:", err);
    }).finally(() => {
      window.dispatchEvent(new CustomEvent("bg-sync-end"));
    });
  }
  async function handleSettleCourierOrders() {
    if (!selectedCourier) return;
    if (!confirm(`\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u0633\u062D\u0628 \u062C\u0645\u064A\u0639 \u0627\u0644\u0634\u062D\u0646\u0627\u062A \u0648\u062C\u0631\u062F \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629 \u0644\u0640 (${selectedCourier})\u061F 

\u0633\u064A\u062A\u0645 \u0633\u062D\u0628 \u0643\u0627\u0641\u0629 \u0627\u0644\u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0627\u0644\u0645\u0639\u0644\u0642\u0629 \u0648\u062A\u0628\u0631\u0626\u0629 \u0639\u0647\u062F\u0629 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0641\u0648\u0631\u0627\u064B \u0645\u0646 \u0627\u0644\u0634\u0627\u0634\u0629.`)) {
      return;
    }
    setSubmittingLedger(true);
    window.dispatchEvent(new CustomEvent("bg-sync-start"));
    apiCall("settleCourierOrders", token, {
      courier: selectedCourier
    }).then((res) => {
      if (res && res.ok) {
        alert(`\u2705 ${res.msg || "\u062A\u0645 \u0633\u062D\u0628 \u0648\u062A\u0635\u0641\u064A\u0629 \u0639\u0647\u062F\u0629 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 \u0648\u062A\u0628\u0631\u0626\u062A\u0647 \u0628\u0646\u062C\u0627\u062D!"}`);
        loadCourierLedger();
      } else {
        alert(`\u26A0\uFE0F \u0639\u0637\u0644: ${res?.error || "\u0641\u0634\u0644 \u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0639\u0647\u062F\u0629 \u0648\u0627\u0644\u0641\u0631\u0632"}`);
      }
    }).catch((err) => {
      console.error("Settle courier orders error:", err);
      alert("\u26A0\uFE0F \u0639\u0637\u0644 \u0639\u0627\u0628\u0631 \u0641\u064A \u062A\u0635\u0641\u064A\u0629 \u0639\u0647\u062F\u0629 \u0627\u0644\u0645\u0646\u062F\u0648\u0628");
    }).finally(() => {
      setSubmittingLedger(false);
      window.dispatchEvent(new CustomEvent("bg-sync-end"));
    });
  }
  async function handleCloseCourierMonth() {
    if (!selectedCourier) return;
    if (!confirm(`\u26A0\uFE0F \u062A\u062D\u0630\u064A\u0631 \u062A\u0642\u0641\u064A\u0644 \u0634\u0647\u0631\u064A \u0647\u0627\u0645: \u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062A\u0642\u0641\u064A\u0644 \u0643\u0634\u0641 \u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 (${selectedCourier}) \u0644\u0634\u0647\u0631 \u062C\u062F\u064A\u062F\u061F

- \u0633\u064A\u062A\u0645 \u062A\u062C\u0645\u064A\u062F \u0648\u062A\u0631\u062D\u064A\u0644 \u0643\u0627\u0641\u0629 \u0645\u0628\u0627\u0644\u063A \u0627\u0644\u0634\u062D\u0646 \u0648\u0627\u0644\u062A\u062D\u0635\u064A\u0644 \u0648\u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0639\u0647\u062F\u0629 \u0627\u0644\u0646\u0642\u062F\u064A\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0644\u062A\u0628\u062F\u0623 \u0645\u0646 0 \u062C.\u0645.
- \u0633\u064A\u062A\u0645 \u0623\u0631\u0634\u0641\u0629 \u0627\u0644\u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0643\u0640 Settled \u062A\u0645\u0627\u0645\u0627\u064B.
- \u0644\u0646 \u062A\u062A\u0623\u062B\u0631 \u0627\u0644\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u062A\u0627\u0631\u064A\u062E\u064A\u0629 \u0644\u0625\u0646\u062A\u0627\u062C\u064A\u0629 \u0627\u0644\u0645\u0646\u062F\u0648\u0628.`)) {
      return;
    }
    setSubmittingLedger(true);
    window.dispatchEvent(new CustomEvent("bg-sync-start"));
    apiCall("closeCourierMonth", token, {
      courier: selectedCourier
    }).then((res) => {
      if (res && res.ok) {
        alert(`\u2705 ${res.msg || "\u062A\u0645 \u062A\u0642\u0641\u064A\u0644 \u0648\u062A\u0635\u0641\u064A\u0631 \u0643\u0634\u0641 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0634\u0647\u0631\u064A \u0644\u0644\u0645\u0646\u062F\u0648\u0628 \u0648\u0628\u062F\u0621 \u062F\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629 \u0628\u0646\u062C\u0627\u062D!"}`);
        loadCourierLedger();
      } else {
        alert(`\u26A0\uFE0F \u0639\u0637\u0644: ${res?.error || "\u0641\u0634\u0644 \u062A\u0642\u0641\u064A\u0644 \u0643\u0634\u0641 \u0627\u0644\u062D\u0633\u0627\u0628"}`);
      }
    }).catch((err) => {
      console.error("Close courier month error:", err);
      alert("\u26A0\uFE0F \u0639\u0637\u0644 \u0639\u0627\u0628\u0631 \u0641\u064A \u062A\u0642\u0641\u064A\u0644 \u0627\u0644\u062D\u0633\u0627\u0628");
    }).finally(() => {
      setSubmittingLedger(false);
      window.dispatchEvent(new CustomEvent("bg-sync-end"));
    });
  }
  async function handleCourierHandover(e) {
    e.preventDefault();
    if (!handoverAmount || Number(handoverAmount) <= 0) {
      alert("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0645\u0628\u0644\u063A \u0635\u062D\u064A\u062D \u0644\u0644\u0627\u0633\u062A\u0644\u0627\u0645");
      return;
    }
    const val = Number(handoverAmount);
    const ref = handoverRef;
    const desc = handoverDesc.trim() || `\u0627\u0633\u062A\u0644\u0627\u0645 \u062F\u0641\u0639\u0629 \u0639\u0647\u062F\u0629 \u0646\u0642\u062F\u064A\u0629 \u0645\u0646 \u0627\u0644\u0645\u0646\u062F\u0648\u0628: ${selectedCourier} \u0628\u0645\u0648\u062C\u0628 \u0648\u0635\u0644: ${handoverRef || "\u2014"}`;
    const courier = selectedCourier;
    setHandoverAmount("");
    setHandoverRef("");
    setHandoverDesc("");
    if (courierSummary) {
      const nextPaid = (courierSummary.totalPaidToCompany || 0) + val;
      const nextDeficit = (courierSummary.totalCollected || 0) - nextPaid;
      setCourierSummary({
        ...courierSummary,
        totalPaidToCompany: nextPaid,
        deficit: nextDeficit
      });
    }
    alert(`\u2705 \u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u062F\u0641\u0639\u0629 \u0639\u0647\u062F\u0629 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0628\u0646\u062C\u0627\u062D \u0648\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0639\u062C\u0632 \u0648\u062C\u0627\u0631\u064A \u062A\u0631\u062D\u064A\u0644 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0644\u0644\u062E\u0644\u0641\u064A\u0629...`);
    window.dispatchEvent(new CustomEvent("bg-sync-start"));
    apiCall("addCashbox", token, {
      type: "\u0627\u0633\u062A\u0644\u0627\u0645 \u0639\u0647\u062F\u0629 \u0645\u0646\u062F\u0648\u0628",
      ref: courier,
      amount: val,
      desc
    }).then((res) => {
      if (res && res.ok) {
        console.log("Asynchronous cashbox handover synchronization complete");
        loadCourierLedger();
      } else {
        console.error("Asynchronous cashbox handover saved, error during refresh:", res?.error);
      }
    }).catch((err) => {
      console.error("Asynchronous cashbox handover background call failed:", err);
    }).finally(() => {
      window.dispatchEvent(new CustomEvent("bg-sync-end"));
    });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 space-y-6 select-none font-sans text-right", children: [
    isFinancial && !activeLedgerMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex bg-slate-950 border border-white/6 rounded-xl p-1 max-w-[400px] mx-auto", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          onClick: () => setActiveLedger("courier"),
          className: `flex-1 text-center py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${activeLedger === "courier" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"}`,
          children: "\u{1F6F5} \u0643\u0634\u0641 \u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0646\u0627\u062F\u064A\u0628"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          onClick: () => setActiveLedger("supplier"),
          className: `flex-1 text-center py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${activeLedger === "supplier" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"}`,
          children: "\u{1F4E6} \u0643\u0634\u0641 \u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646"
        }
      )
    ] }),
    activeLedger === "supplier" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
      isFinancial && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between gap-4 bg-slate-900 border border-white/6 p-4 rounded-xl shadow-inner", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs font-extrabold text-slate-400 whitespace-nowrap", children: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0648\u0631\u062F \u0627\u0644\u0645\u0631\u0627\u062F \u0639\u0631\u0636 \u062D\u0633\u0627\u0628\u0647 \u0628\u0627\u0644\u0623\u064A\u0627\u0645:" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "select",
          {
            value: selectedSupplier,
            onChange: (e) => setSelectedSupplier(e.target.value),
            className: "bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none",
            children: allSuppliers.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: s.name, children: s.name }, idx))
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-gradient-to-l from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/20 rounded-2xl p-6 text-center space-y-4 relative overflow-hidden shadow-xl", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-3 left-3 text-emerald-500/10", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 64 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "px-3.5 py-1.5 bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 text-[10.5px] font-black rounded-full uppercase tracking-wider inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F3C6} \u0643\u0634\u0641 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A \u0648\u062A\u0635\u0641\u064A\u0629 \u0643\u0627\u0634 \u0627\u0644\u0645\u0648\u0631\u062F" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-4xl font-mono font-black text-emerald-400 tracking-tight", children: [
          Number(liveBalance || 0).toLocaleString("ar"),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-sm font-medium", children: "\u062C\u0646\u064A\u0647\u0627\u064B \u0645\u0635\u0631\u064A\u0627\u064B" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-[11px] text-slate-400 leading-relaxed font-bold max-w-2xl mx-auto", children: [
          "\u0647\u0630\u0647 \u0627\u0644\u0642\u064A\u0645\u0629 \u062A\u0645\u062B\u0644 \u0645\u062C\u0645\u0648\u0639 \u0645\u0633\u062A\u062D\u0642\u0627\u062A ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-emerald-400", children: "\u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u064A\u0627\u0645 \u0627\u0644\u0645\u0639\u0644\u0642\u0629" }),
          " (\u0635\u0627\u0641\u064A \u0645\u0633\u062A\u062D\u0642\u0627\u062A \u0627\u0644\u0623\u064A\u0627\u0645 \u0627\u0644\u062A\u064A \u0644\u0645 \u062A\u0635\u0641\u0649 \u0628\u0639\u062F)\u060C \u0648\u0647\u064A \u062A\u062A\u0623\u062B\u0631 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0628\u0645\u062C\u0631\u062F \u0646\u0642\u0631 \u0627\u0644\u0645\u062F\u064A\u0631 \u0639\u0644\u0649 \u0632\u0631 \u0627\u0644\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u064A\u0648\u0645\u064A\u0629."
        ] }),
        dailyLedgers && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto pt-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950/80 border border-white/4 p-3 rounded-xl text-center shadow-md", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[10px] font-black text-slate-400", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0628\u0636\u0627\u0639\u0629 \u0627\u0644\u0645\u0631\u0641\u0648\u0639\u0629" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm font-mono font-bold text-slate-200 mt-1", children: [
              Number(dailyLedgers.totalGoodsUploaded || 0).toLocaleString("ar"),
              " \u062C.\u0645"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950/80 border border-white/4 p-3 rounded-xl text-center shadow-md", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[10px] font-black text-slate-405", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062F\u0641\u0639\u0627\u062A \u0627\u0644\u0645\u0633\u062F\u062F\u0629" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm font-mono font-bold text-indigo-400 mt-1", children: [
              Number(dailyLedgers.globalPayments || 0).toLocaleString("ar"),
              " \u062C.m"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950/80 border border-white/4 p-3 rounded-xl text-center shadow-md", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[10px] font-black text-slate-400", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm font-mono font-bold text-red-400 mt-1", children: [
              Number(dailyLedgers.returnsDeliveredValue || 0).toLocaleString("ar"),
              " \u062C.\u0645"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950/85 border border-emerald-500/20 p-3 rounded-xl text-center shadow-md", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[10px] font-black text-emerald-400", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0635\u0627\u0641\u064A \u0627\u0644\u0645\u0633\u062A\u062D\u0642 \u0644\u0644\u0645\u0648\u0631\u062F" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm font-mono font-bold text-emerald-300 mt-1", children: [
              Number(dailyLedgers.outstandingBalance || 0).toLocaleString("ar"),
              " \u062C.\u0645"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950/80 border border-white/4 p-3 rounded-xl text-center col-span-2 md:col-span-1 shadow-md", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[10px] font-black text-slate-400", children: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0623\u064A\u0627\u0645" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[10px] font-bold text-slate-300 mt-1 flex justify-around border-t border-white/5 pt-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-red-350 font-bold", children: [
                "\u{1F534} ",
                dailyLedgers.days.filter((d) => !d.isSettled).length,
                " \u0645\u0639\u0644\u0642"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-emerald-400 font-bold", children: [
                "\u{1F7E2} ",
                dailyLedgers.days.filter((d) => d.isSettled).length,
                " \u0645\u0635\u0641\u0649"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-white/6 p-4 rounded-2xl shadow-sm", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "text-amber-500", size: 18 }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xs font-black text-slate-300", children: "\u0633\u062C\u0644 \u0643\u0634\u0648\u0641 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u064A\u0648\u0645\u064A\u0629 \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A\u0629 \u0644\u0644\u0623\u064A\u0627\u0645 \u0648\u0627\u0644\u062F\u0641\u0639\u0627\u062A" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative w-full sm:w-[280px]", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-y-0 right-3 flex items-center pr-1 text-slate-550", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 14 }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                type: "text",
                placeholder: "\u0627\u0628\u062D\u062B \u0628\u0627\u0644\u062A\u0627\u0631\u064A\u062E (\u0645\u062B\u0627\u0644: 2026-06)...",
                value: daySearchQuery,
                onChange: (e) => setDaySearchQuery(e.target.value),
                className: "w-full bg-slate-950 border border-white/8 rounded-lg pr-9 pl-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              }
            )
          ] })
        ] }),
        loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center py-16 space-y-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { size: 36, className: "text-amber-500 animate-spin mx-auto" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-xs text-slate-400 animate-pulse font-bold", children: "\u062C\u0627\u0631\u064A \u062D\u0633\u0627\u0628 \u0648\u062A\u062C\u0645\u064A\u0639 \u0643\u0634\u0641 \u0627\u0644\u0623\u064A\u0627\u0645 \u0644\u0644\u0645\u0648\u0631\u062F \u062F\u064A\u0646\u0627\u0645\u064A\u0643\u064A\u0627\u064B..." })
        ] }) : !dailyLedgers || dailyLedgers.days.length === 0 && (!dailyLedgers.paymentEntries || dailyLedgers.paymentEntries.length === 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-slate-900/50 border border-white/4 rounded-2xl py-12 text-center text-xs text-slate-405 font-bold", children: "\u{1FAD9} \u0644\u0627 \u064A\u0648\u062C\u062F \u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0623\u0648 \u0645\u0639\u0627\u0645\u0644\u0627\u062A \u0645\u0633\u062C\u0644\u0629 \u0643\u062D\u0633\u0627\u0628 \u064A\u0648\u0645\u064A \u062A\u062D\u062A \u0627\u0633\u0645 \u0647\u0630\u0627 \u0627\u0644\u0645\u0648\u0631\u062F \u062D\u0627\u0644\u064A\u0627\u064B" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: (() => {
          const daysFiltered = dailyLedgers.days.map((d) => ({ ...d, timelineType: "day" }));
          const paymentsFiltered = (dailyLedgers.paymentEntries || []).map((p) => ({ ...p, timelineType: "payment" }));
          const mergedTimeline = [...daysFiltered, ...paymentsFiltered];
          mergedTimeline.sort((a, b) => {
            const dateA = a.date ? a.date.split("T")[0] : "";
            const dateB = b.date ? b.date.split("T")[0] : "";
            return dateB.localeCompare(dateA);
          });
          const finalFiltered = mergedTimeline.filter((item) => {
            if (!daySearchQuery) return true;
            return item.date && item.date.includes(daySearchQuery);
          });
          if (finalFiltered.length === 0) {
            return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "col-span-2 bg-slate-900/50 border border-white/4 rounded-2xl py-12 text-center text-xs text-slate-405 font-bold", children: "\u{1F50D} \u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0623\u0648 \u062D\u0631\u0643\u0627\u062A \u0633\u062F\u0627\u062F \u0645\u0637\u0627\u0628\u0642\u0629 \u0644\u0644\u0628\u062D\u062B \u062D\u0627\u0644\u064A\u0627\u064B" });
          }
          return finalFiltered.map((item, idx) => {
            if (item.timelineType === "payment") {
              const typeStr = (item.type || "").toString().trim();
              const descStr = (item.desc || "").toString().trim();
              const isInflow = typeStr.includes("\u0627\u0633\u062A\u0644\u0627\u0645") || typeStr.includes("\u0645\u0633\u062A\u0631\u062F") || descStr.includes("\u0627\u0633\u062A\u0644\u0627\u0645") || descStr.includes("\u0645\u0633\u062A\u0631\u062F") || typeStr.includes("\u0648\u0627\u0631\u062F") || descStr.includes("\u0648\u0627\u0631\u062F");
              const isAddition = typeStr.includes("\u062A\u0633\u0648\u064A\u0629 \u0625\u0636\u0627\u0641\u0629") || typeStr.includes("\u0625\u0636\u0627\u0641\u0629") || typeStr.includes("\u0627\u0636\u0627\u0641\u0629") || typeStr.includes("\u062A\u0639\u062F\u064A\u0644 \u0631\u0635\u064A\u062F \u0625\u0636\u0627\u0641\u0629");
              const isDeduction = typeStr.includes("\u062A\u0633\u0648\u064A\u0629 \u062E\u0635\u0645") || typeStr.includes("\u062E\u0635\u0645") || typeStr.includes("\u0637\u0631\u062D") || typeStr.includes("\u0633\u062D\u0628") || typeStr.includes("\u0645\u0633\u062D\u0648\u0628\u0627\u062A");
              let cardBg = "from-slate-900 to-indigo-950/20 border-indigo-500/10 hover:border-indigo-500/25";
              let glowBg = "bg-indigo-500/5";
              let textCol = "text-indigo-300";
              let amountCol = "text-indigo-350";
              let iconCol = "text-indigo-400";
              let badgeBg = "bg-indigo-950/50 border-indigo-900/50 text-indigo-300";
              let badgeText = "\u{1F4B3} \u062F\u0641\u0639\u0629 \u0646\u0642\u062F\u064A\u0629 \u0645\u0633\u062F\u062F\u0629";
              let labelText = "\u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0629 \u0644\u0644\u0645\u0648\u0631\u062F";
              let sign = "-";
              if (isInflow) {
                cardBg = "from-slate-900 to-emerald-950/20 border-emerald-500/10 hover:border-emerald-500/25";
                glowBg = "bg-emerald-500/5";
                textCol = "text-emerald-300";
                amountCol = "text-emerald-400 font-bold";
                iconCol = "text-emerald-400";
                badgeBg = "bg-emerald-950/50 border-emerald-900/50 text-emerald-300";
                badgeText = "\u{1F4E5} \u0627\u0633\u062A\u0644\u0627\u0645 \u0646\u0642\u062F\u064A\u0629 (\u0625\u064A\u0631\u0627\u062F)";
                labelText = "\u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629 \u0645\u0646 \u0627\u0644\u0645\u0648\u0631\u062F";
                sign = "-";
              } else if (isAddition) {
                cardBg = "from-slate-900 to-teal-950/20 border-teal-500/10 hover:border-teal-500/25";
                glowBg = "bg-teal-500/5";
                textCol = "text-teal-300";
                amountCol = "text-teal-400";
                iconCol = "text-teal-400";
                badgeBg = "bg-teal-950/50 border-teal-900/50 text-teal-300";
                badgeText = "\u2795 \u062A\u0633\u0648\u064A\u0629 (\u0625\u0636\u0627\u0641\u0629 \u0631\u0635\u064A\u062F)";
                labelText = "\u0642\u064A\u0645\u0629 \u0627\u0644\u062A\u0633\u0648\u064A\u0629 \u0627\u0644\u0625\u064A\u062C\u0627\u0628\u064A\u0629 \u0644\u0644\u0645\u0648\u0631\u062F";
                sign = "+";
              } else if (isDeduction) {
                cardBg = "from-slate-900 to-rose-950/20 border-rose-500/10 hover:border-rose-500/25";
                glowBg = "bg-rose-500/5";
                textCol = "text-rose-300";
                amountCol = "text-rose-450";
                iconCol = "text-rose-400";
                badgeBg = "bg-rose-950/50 border-rose-900/50 text-rose-300";
                badgeText = "\u2796 \u062A\u0633\u0648\u064A\u0629 (\u062E\u0635\u0645 \u0631\u0635\u064A\u062F)";
                labelText = "\u0642\u064A\u0645\u0629 \u0627\u0644\u062A\u0633\u0648\u064A\u0629 \u0627\u0644\u0633\u0644\u0628\u064A\u0629 \u0644\u0644\u0645\u0648\u0631\u062F";
                sign = "-";
              }
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "div",
                {
                  className: `bg-gradient-to-br ${cardBg} rounded-2xl p-5 space-y-4 shadow-md transition-all hover:translate-y-[-2px] relative overflow-hidden text-right`,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute top-0 right-0 w-24 h-24 ${glowBg} rounded-full blur-2xl` }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between border-b border-white/6 pb-2.5", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `text-xs font-black ${textCol} flex items-center gap-1.5`, children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 14, className: iconCol }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                          "\u064A\u0648\u0645: ",
                          item.date
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `px-3 py-1 text-[10px] font-black rounded-lg border ${badgeBg} flex items-center gap-1`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: badgeText }) })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950/80 border border-white/5 p-3 rounded-xl flex justify-between items-center", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-slate-400 font-bold block", children: labelText }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `text-sm font-mono font-black ${amountCol}`, children: [
                          sign,
                          Number(item.amount || 0).toLocaleString("ar"),
                          " \u062C.\u0645"
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950/60 border border-white/4 p-2.5 rounded-xl", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9.5px] text-slate-400 block font-bold", children: "\u0627\u0644\u0628\u064A\u0627\u0646 / \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0629" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs text-slate-300 font-medium block mt-1 leading-relaxed", children: item.desc || "\u062D\u0631\u0643\u0629 \u0645\u0627\u0644\u064A\u0629 \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628" })
                      ] }),
                      item.tracking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[10px] text-slate-500 font-mono text-left pt-1", children: [
                        "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0645\u0631\u062C\u0639\u064A: ",
                        item.tracking
                      ] })
                    ] })
                  ]
                },
                `p-${idx}`
              );
            }
            const isPending = !item.isSettled;
            const dateStr = item.date || "";
            const isOpen = !!expandedDays[dateStr];
            return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: `bg-slate-900 border rounded-2xl shadow-md transition-all text-right overflow-hidden ${isPending ? "border-amber-500/15 hover:border-amber-500/25" : "border-emerald-500/15 hover:border-emerald-500/25"}`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "div",
                    {
                      onClick: () => toggleDay(dateStr),
                      className: "p-4 flex items-center justify-between cursor-pointer select-none bg-slate-950/40 hover:bg-slate-950/80 transition-all gap-3",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-right", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs font-black text-slate-100 flex items-center gap-1.5", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-amber-500 animate-pulse" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                              "\u064A\u0648\u0645: ",
                              dateStr
                            ] })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[11px] text-slate-400 font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-white/4", children: [
                            "\u0627\u0644\u0645\u0648\u0631\u062F: ",
                            selectedSupplier || "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F"
                          ] })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-right", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] text-slate-450 block font-bold leading-none", children: "\u0627\u0644\u0635\u0627\u0641\u064A \u0627\u0644\u0645\u0627\u0644\u064A:" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs font-mono font-black text-emerald-400 mt-0.5 block", children: [
                              Number(item.netDues || 0).toLocaleString("ar"),
                              " \u062C.\u0645"
                            ] })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              "span",
                              {
                                className: `px-2.5 py-0.5 text-[9px] font-black rounded ${isPending ? "bg-amber-950/40 border border-amber-900/40 text-amber-500" : "bg-emerald-950/40 border border-emerald-900/40 text-emerald-500"}`,
                                children: isPending ? "\u{1F534} \u0645\u0639\u0644\u0642" : "\u{1F7E2} \u0645\u0635\u0641\u0649"
                              }
                            ),
                            isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { size: 16, className: "text-slate-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 16, className: "text-slate-400" })
                          ] })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "div",
                    {
                      className: `transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1200px] border-t border-white/6 p-5 opacity-100" : "max-h-0 overflow-hidden opacity-0 pointer-events-none"}`,
                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950/80 border border-white/4 p-3 rounded-xl text-center", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-slate-400 block font-black mb-1", children: "\u3010\u062D\u0633\u0627\u0628 \u0627\u0644\u0628\u0636\u0627\u0639\u0629 \u0627\u0644\u0645\u0631\u0641\u0648\u0639\u0629 \u0627\u0644\u064A\u0648\u0645\u064A\u0629\u3011" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-sm font-mono font-black text-slate-200", children: [
                              Number(item.totalWorkValue || 0).toLocaleString("ar"),
                              " \u062C.\u0645"
                            ] })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950/80 border border-white/4 p-3 rounded-xl text-center", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-slate-400 block font-black mb-1", children: "\u3010\u062D\u0633\u0627\u0628 \u0627\u0644\u0646\u0642\u062F\u064A (\u0627\u0644\u0645\u062F\u0641\u0648\u0639 \u0643\u0627\u0634 \u0627\u0644\u064A\u0648\u0645)\u3011" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-sm font-mono font-black text-indigo-450", children: [
                              Number(item.cashPaid || 0).toLocaleString("ar"),
                              " \u062C.\u0645"
                            ] })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950/80 border border-white/4 p-3 rounded-xl text-center", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-slate-400 block font-black mb-1", children: "\u3010\u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629 \u0627\u0644\u064A\u0648\u0645\u3011" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-sm font-mono font-black text-red-400", children: [
                              Number(item.returnedValueRefunded || 0).toLocaleString("ar"),
                              " \u062C.\u0645"
                            ] })
                          ] })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-gradient-to-r from-emerald-950/30 to-slate-950 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between shadow-inner", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs text-emerald-450 block font-black", children: "\u3010\u0627\u0644\u0635\u0627\u0641\u064A \u0627\u0644\u0645\u0633\u062A\u062D\u0642 \u0644\u0644\u0645\u0648\u0631\u062F \u0627\u0644\u064A\u0648\u0645\u3011" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-slate-500 font-bold block mt-1", children: "\u0627\u0644\u0645\u0639\u0627\u062F\u0644\u0629 \u0627\u0644\u062D\u0633\u0627\u0628\u064A\u0629 \u0627\u0644\u0635\u0627\u0631\u0645\u0629: (\u0627\u0644\u0628\u0636\u0627\u0639\u0629 \u0627\u0644\u0645\u0631\u0641\u0648\u0639\u0629 \u0627\u0644\u064A\u0648\u0645\u064A\u0629) - (\u0627\u0644\u0645\u062F\u0641\u0648\u0639 \u0643\u0627\u0634 \u0627\u0644\u064A\u0648\u0645) - (\u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0627\u0644\u0645\u0639\u062A\u0645\u062F \u0627\u0644\u064A\u0648\u0645)" })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-base font-mono font-black text-emerald-400 text-left", children: [
                            Number(item.netDues || 0).toLocaleString("ar"),
                            " \u062C.\u0645"
                          ] })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          "button",
                          {
                            type: "button",
                            onClick: () => {
                              const targetSup = isSupplier ? user : selectedSupplier;
                              const matched = suppliersDetails.find((s) => s && s.name && s.name.toString().trim().toLowerCase() === targetSup.toString().trim().toLowerCase());
                              let phoneNum = "";
                              if (matched && matched.phone && matched.phone !== "\u2014" && matched.phone.trim() !== "") {
                                phoneNum = matched.phone.toString().trim();
                              }
                              if (!phoneNum) {
                                const userInput = window.prompt("\u26A0\uFE0F \u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0645\u0633\u062C\u0644 \u0644\u0647\u0630\u0627 \u0627\u0644\u0645\u0648\u0631\u062F. \u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0627\u0644\u0645\u0648\u0631\u062F \u0644\u0628\u062F\u0621 \u0645\u062D\u0627\u062F\u062B\u0629 \u0648\u0627\u062A\u0633\u0627\u0628 (\u0645\u062B\u0627\u0644: 01012345678):");
                                if (!userInput) return;
                                phoneNum = userInput.trim();
                              }
                              let cleanedPhone = phoneNum.replace(/[+\s\-]/g, "");
                              if (cleanedPhone.startsWith("0") && cleanedPhone.length === 11) {
                                cleanedPhone = "2" + cleanedPhone;
                              }
                              const msg = `\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064A\u0643\u0645 \u064A\u0627 \u0641\u0646\u062F\u0645\u060C \u062A\u0641\u0627\u0635\u064A\u0644 \u0643\u0634\u0641 \u062D\u0633\u0627\u0628\u0643\u0645 \u0644\u064A\u0648\u0645 ${item.date} \u0637\u0631\u0641 \u0634\u0631\u0643\u0629 \u0627\u0644\u0634\u062D\u0646:
- \u{1F4E6} \u3010\u062D\u0633\u0627\u0628 \u0627\u0644\u0628\u0636\u0627\u0639\u0629 \u0627\u0644\u0645\u0631\u0641\u0648\u0639\u0629 \u0627\u0644\u064A\u0648\u0645\u064A\u0629\u3011: ${(item.totalWorkValue || 0).toLocaleString("ar")} \u062C.\u0645
- \u{1F4B5} \u3010\u062D\u0633\u0627\u0628 \u0627\u0644\u0646\u0642\u062F\u064A (\u0627\u0644\u0645\u062F\u0641\u0648\u0639 \u0643\u0627\u0634 \u0627\u0644\u064A\u0648\u0645)\u3011: ${(item.cashPaid || 0).toLocaleString("ar")} \u062C.\u0645
- \u{1F504} \u3010\u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629 \u0627\u0644\u064A\u0648\u0645\u3011: ${(item.returnedValueRefunded || 0).toLocaleString("ar")} \u062C.\u0645
- \u{1F534} \u3010\u0627\u0644\u0635\u0627\u0641\u064A \u0627\u0644\u0645\u0633\u062A\u062D\u0642 \u0644\u0644\u0645\u0648\u0631\u062F \u0627\u0644\u064A\u0648\u0645\u3011: ${(item.netDues || 0).toLocaleString("ar")} \u062C.\u0645

\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0639\u0627\u0645\u0644\u0643\u0645 \u0645\u0639\u0646\u0627 \u0645\u062A\u0627\u062D \u0644\u0644\u0645\u0631\u0627\u062C\u0639\u0629.`;
                              const encodedText = encodeURIComponent(msg);
                              const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${encodedText}`;
                              window.open(whatsappUrl, "_blank");
                            },
                            className: "w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-emerald-400/20 active:scale-98 shadow-md hover:shadow-lg hover:-translate-y-0.5",
                            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F4E6} \u0625\u0631\u0633\u0627\u0644 \u0643\u0634\u0641 \u0627\u0644\u062D\u0633\u0627\u0628 \u0628\u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628" })
                          }
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 gap-2 pt-1", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                            "button",
                            {
                              type: "button",
                              onClick: () => {
                                setSelectedDayDate(item.date);
                                setSelectedDayStatus(isPending ? "\u{1F534} \u0645\u0639\u0644\u0642 \u0644\u0645 \u064A\u0635\u0641\u0649" : "\u{1F7E2} \u062A\u0645 \u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0643\u0627\u0634 \u0648\u0627\u0644\u0645\u0631\u062A\u062C\u0639");
                                setSelectedDayOrdersDetail(item.orders);
                              },
                              className: "bg-slate-950 hover:bg-slate-950/80 border border-white/8 text-slate-200 py-2.5 px-3 rounded-lg text-2xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors",
                              children: [
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 13, className: "text-amber-500" }),
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0627\u0644\u064A\u0648\u0645" })
                              ]
                            }
                          ),
                          isFinancial && isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                            "button",
                            {
                              type: "button",
                              disabled: settleDayProgress === item.date,
                              onClick: () => handleSettleDay(item.date),
                              className: "bg-emerald-600 hover:bg-emerald-700 text-slate-950 py-2.5 px-3 rounded-lg text-2xs font-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors",
                              children: [
                                settleDayProgress === item.date ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { size: 13, className: "animate-spin text-slate-950" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 13, className: "text-slate-950" }),
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u062A\u0642\u0641\u064A\u0644 \u0648\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0643\u0627\u0634 \u0627\u0644\u0645\u0627\u0644\u064A" })
                              ]
                            }
                          ) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 py-2.5 px-3 rounded-lg text-2xs font-bold flex items-center justify-center gap-1", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 12 }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u062D\u0633\u0627\u0628 \u0645\u0642\u0641\u0644 \u0648\u0645\u0635\u0641\u0649 \u062A\u0645\u0627\u0645\u0627\u064B" })
                          ] })
                        ] })
                      ] })
                    }
                  )
                ]
              },
              `d-${idx}`
            );
          });
        })() })
      ] })
    ] }),
    activeLedger === "courier" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
      isFinancial && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between gap-4 bg-slate-900 border border-white/6 p-4 rounded-xl", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs font-extrabold text-slate-400", children: "\u062A\u0627\u0628\u0639 \u0645\u0648\u0627\u0632\u0646\u0629 \u0627\u0644\u0645\u0646\u062F\u0648\u0628:" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "select",
          {
            value: selectedCourier,
            onChange: (e) => setSelectedCourier(e.target.value),
            className: "bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none",
            children: allCouriers.map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: c.name, children: c.name }, idx))
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 bg-slate-900 border border-white/6 p-3 rounded-xl justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs font-bold text-slate-450 flex items-center gap-1.5", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { size: 14 }),
          "\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0648\u0627\u0644\u0639\u0645\u0648\u0644\u0627\u062A:"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-white/4", children: ["day", "week", "month"].map((p) => {
          const labels = { day: "\u0627\u0644\u064A\u0648\u0645", week: "\u0627\u0644\u0623\u0633\u0628\u0648\u0639", month: "\u0627\u0644\u0634\u0647\u0631" };
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              onClick: () => setPeriodFilter(p),
              className: `px-3 py-1 text-[10px] font-black rounded-md cursor-pointer transition-all ${periodFilter === p ? "bg-amber-600 text-slate-950" : "text-slate-400"}`,
              children: labels[p]
            },
            p
          );
        }) })
      ] }),
      courierSummary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xs font-black text-amber-500 border-b border-white/6 pb-2", children: "\u{1F4CA} \u062C\u062F\u0648\u0644 \u0627\u0644\u0645\u0637\u0627\u0628\u0642\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0644\u0644\u0645\u0646\u062F\u0648\u0628 (\u0645\u0633\u062A\u0631\u062C\u0639 \u0644\u062D\u0638\u064A\u0627\u064B \u0645\u0646 Google Sheets)" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { className: "w-full text-right text-xs border-collapse", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "border-b border-white/10 text-slate-400 font-extrabold", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2 px-3 text-right", children: "\u0643\u0634\u0641 \u0627\u0644\u062D\u0633\u0627\u0628" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2 px-3 text-center", children: "\u0627\u0644\u0628\u064A\u0627\u0646 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2 px-3 text-left", children: "\u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629" })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "border-b border-white/4 hover:bg-slate-950/40", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "py-3 px-3 font-semibold text-slate-200", children: "\u0627\u0644\u0631\u0627\u062A\u0628 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0644\u0644\u0634\u0647\u0631" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "py-3 px-3 text-slate-450 text-center font-bold", children: "\u062A\u0639\u064A\u064A\u0646 \u062A\u0639\u0627\u0642\u062F\u064A \u062B\u0627\u0628\u062A" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-3 px-3 text-left font-mono font-black text-slate-200", children: [
                  (courierSummary.basicSalary || 0).toLocaleString("ar"),
                  " \u062C.\u0645"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "border-b border-white/4 hover:bg-slate-950/40", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "py-3 px-3 font-semibold text-slate-200", children: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u062A\u064A \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647\u0627 \u0627\u0644\u064A\u0648\u0645" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-3 px-3 text-emerald-400 text-center font-bold", children: [
                  courierSummary.todayDeliveredCount || 0,
                  " \u0634\u062D\u0646\u0629 \u0627\u0644\u064A\u0648\u0645"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-3 px-3 text-left font-mono font-black text-emerald-400", children: [
                  "+",
                  (courierSummary.todayDelivCommission || 0).toLocaleString("ar"),
                  " \u062C.\u0645 (\u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u064A\u0648\u0645)"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "border-b border-white/4 hover:bg-slate-950/40 font-bold", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "py-3 px-3 text-slate-300", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0639\u0645\u0648\u0644\u0627\u062A \u0627\u0644\u062A\u0648\u0635\u064A\u0644 (\u062C\u0645\u064A\u0639 \u0627\u0644\u0641\u062A\u0631\u0627\u062A)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-3 px-3 text-slate-400 text-center", children: [
                  courierSummary.deliveredCount || 0,
                  " \u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u0644\u0651\u0645 \u0643\u0644\u064A\u0627\u064B"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-3 px-3 text-left font-mono font-black text-emerald-500", children: [
                  "+",
                  (courierSummary.delivCommission || 0).toLocaleString("ar"),
                  " \u062C.\u0645"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "hover:bg-slate-950/40 font-black text-sm text-amber-500 bg-amber-950/10", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "py-3 px-3", children: "\u0627\u0644\u0631\u0627\u062A\u0628 \u0627\u0644\u0635\u0627\u0641\u064A \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0633\u062A\u062D\u0642" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "py-3 px-3 text-center text-xs", children: "\u0634\u0627\u0645\u0644 \u0627\u0644\u0639\u0645\u0648\u0644\u0627\u062A \u0648\u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A \u0648\u0627\u0644\u062E\u0635\u0648\u0645\u0627\u062A" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-3 px-3 text-left font-mono", children: [
                  (courierSummary.netSalary || 0).toLocaleString("ar"),
                  " \u062C.\u0645"
                ] })
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between border-b border-white/6 pb-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-xs font-black text-amber-500 flex items-center gap-1.5 font-sans", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { size: 14 }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F4C5} \u062F\u0641\u062A\u0631 \u064A\u0648\u0645\u064A\u0629 \u0627\u0644\u0623\u0631\u0628\u0627\u062D \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A\u0629 (Cumulative Daily Ledger)" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[9px] font-bold bg-amber-950/20 text-amber-500 border border-amber-900/40 px-2 py-0.5 rounded font-mono", children: [
              "\u0645\u062D\u062F\u062B \u0644\u0640 ",
              (/* @__PURE__ */ new Date()).getFullYear(),
              "/",
              String((/* @__PURE__ */ new Date()).getMonth() + 1).padStart(2, "0")
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-[10px] text-slate-500 pb-1", children: [
            "\u0631\u0635\u062F \u064A\u0648\u0645\u064A \u0645\u0633\u062A\u0645\u0631 \u0644\u0644\u0645\u0639\u0627\u062F\u0644\u0629 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629: \u0627\u0644\u0631\u0627\u062A\u0628 \u0627\u0644\u064A\u0648\u0645\u064A \u0627\u0644\u062B\u0627\u0628\u062A (\u0627\u0644\u0631\u0627\u062A\u0628 \u0627\u0644\u0623\u0633\u0627\u0633\u064A / \u0623\u064A\u0627\u0645 \u0627\u0644\u0634\u0647\u0631) + (\u0639\u062F\u062F \u0627\u0644\u062A\u0633\u0644\u064A\u0645\u0627\u062A \xD7 ",
            courierSummary.commission_success || 25,
            ") + (\u0639\u062F\u062F \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \xD7 ",
            courierSummary.commission_return || 10,
            ")."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
            ["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(role) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap justify-start items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  type: "button",
                  onClick: handleSettleCourierOrders,
                  disabled: submittingLedger,
                  className: "bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-black py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-emerald-400/20 active:scale-98 shadow-md",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 15 }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F7E2} \u062A\u0635\u0641\u064A\u0629 \u0648\u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 (Settle & Zero)" })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  type: "button",
                  onClick: handleCloseCourierMonth,
                  disabled: submittingLedger,
                  className: "bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-amber-900/40 active:scale-98 shadow-md",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 15 }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F512} \u062A\u0642\u0641\u064A\u0644 \u0643\u0634\u0641 \u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0627\u0644\u0634\u0647\u0631\u064A (Close Month)" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden md:block overflow-x-auto max-h-[450px] overflow-y-auto border border-white/6 rounded-xl", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { className: "w-full text-right text-xs border-collapse", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { className: "sticky top-0 bg-slate-900 z-10", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "border-b border-white/10 text-slate-400 font-extrabold text-[10px]", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2.5 px-3 text-right", children: "\u0627\u0644\u064A\u0648\u0645 \u0648\u0627\u0644\u062A\u0627\u0631\u064A\u062E" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2.5 px-3 text-center", children: "\u0627\u0644\u062A\u0633\u0644\u064A\u0645\u0627\u062A" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2.5 px-3 text-center", children: "\u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2.5 px-3 text-center", children: "\u062D\u0635\u0629 \u0627\u0644\u0631\u0627\u062A\u0628 \u0627\u0644\u064A\u0648\u0645\u064A" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2.5 px-3 text-center", children: "\u0627\u0644\u0639\u0645\u0648\u0644\u0627\u062A \u0627\u0644\u0645\u0643\u062A\u0633\u0628\u0629" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2.5 px-3 text-center", children: "\u0627\u0644\u0643\u0627\u0634 \u0627\u0644\u0645\u0633\u062A\u062D\u0642 \u0628\u0630\u0645\u062A\u0647" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2.5 px-3 text-left", children: "\u0635\u0627\u0641\u064A \u0627\u0644\u064A\u0648\u0645" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2.5 px-3 text-left", children: "\u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A \u0627\u0644\u0645\u062A\u0631\u0627\u0643\u0645" })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: !courierSummary.dailyEarnings || courierSummary.dailyEarnings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { colSpan: 8, className: "py-6 text-center text-slate-500 text-xs", children: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0633\u062C\u0644 \u062D\u0631\u0643\u0627\u062A \u0648\u0631\u062F\u064A\u0627\u062A \u064A\u0648\u0645\u064A\u0629 \u0644\u0644\u0645\u0646\u062F\u0648\u0628 \u062D\u0627\u0644\u064A\u0627\u064B" }) }) : courierSummary.dailyEarnings.map((dItem, idx) => {
                const dailyCommissions = dItem.delivered * (courierSummary.commission_success || 25) + dItem.returned * (courierSummary.commission_return || 10);
                const isToday = idx === 0;
                const isSettled = dItem.isSettled !== void 0 ? dItem.isSettled : true;
                return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "border-b border-white/5 hover:bg-white/2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-2.5 px-3 font-semibold text-slate-300 text-right", children: [
                    dItem.date,
                    " ",
                    isToday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] bg-amber-500/15 text-amber-500 px-1 py-0.25 rounded mr-1", children: "\u0627\u0644\u064A\u0648\u0645" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "py-2.5 px-3 text-center font-bold text-emerald-400", children: dItem.delivered }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "py-2.5 px-3 text-center font-bold text-amber-500", children: dItem.returned }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-2.5 px-3 text-center font-mono text-slate-400", children: [
                    (dItem.baseEarning || 0).toFixed(2),
                    " \u062C.\u0645"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-2.5 px-3 text-center font-mono text-emerald-400", children: [
                    "+",
                    dailyCommissions.toLocaleString("ar"),
                    " \u062C.\u0645"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-2.5 px-3 text-center font-mono font-bold text-emerald-400", children: [
                    (dItem.cashCollected || 0).toLocaleString("ar"),
                    " \u062C.\u0645"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-2.5 px-3 text-left font-mono font-bold text-slate-100", children: [
                    (dItem.total || 0).toLocaleString("ar"),
                    " \u062C.\u0645"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "py-2.5 px-3 text-left font-mono font-bold text-emerald-300", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-end gap-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                      (dItem.cumulative || 0).toLocaleString("ar"),
                      " \u062C.\u0645"
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `text-[9px] px-1.5 py-0.25 rounded font-black ${isSettled ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30" : "bg-amber-950/60 text-amber-500 border border-amber-900/40"}`, children: isSettled ? "\u{1F7E2} \u0645\u0635\u0641\u0649" : "\u{1F534} \u0645\u0639\u0644\u0642" })
                  ] }) })
                ] }, `c-day-row-${idx}`);
              }) })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block md:hidden space-y-3", children: !courierSummary.dailyEarnings || courierSummary.dailyEarnings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "py-8 bg-slate-950/40 border border-white/4 rounded-xl text-center text-slate-500 text-xs font-bold", children: "\u{1F4F1} \u0644\u0627 \u064A\u0648\u062C\u062F \u0633\u062C\u0644 \u0648\u0631\u062F\u064A\u0627\u062A \u064A\u0648\u0645\u064A\u0629 \u0644\u0644\u0645\u0646\u062F\u0648\u0628 \u062D\u0627\u0644\u064A\u0627\u064B" }) : courierSummary.dailyEarnings.map((dItem, idx) => {
              const dailyCommissions = dItem.delivered * (courierSummary.commission_success || 25) + dItem.returned * (courierSummary.commission_return || 10);
              const courierDateStr = dItem.date || "";
              const isCourierOpen = !!expandedCourierDays[courierDateStr];
              const isToday = idx === 0;
              const isSettled = dItem.isSettled !== void 0 ? dItem.isSettled : true;
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "div",
                {
                  className: `border rounded-xl shadow-sm transition-all text-right overflow-hidden ${isToday ? "bg-amber-950/15 border-amber-500/30" : "bg-slate-950/60 border-white/6 hover:border-white/12"}`,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "div",
                      {
                        onClick: () => toggleCourierDay(courierDateStr),
                        className: "p-3.5 flex items-center justify-between cursor-pointer select-none gap-3 hover:bg-slate-950 transition-colors",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col text-right space-y-1", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs font-black text-slate-200 flex items-center gap-1.5", children: [
                              isToday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                                courierDateStr,
                                " ",
                                isToday ? "(\u0627\u0644\u064A\u0648\u0645)" : ""
                              ] })
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block px-2 py-0.5 text-[9px] font-black rounded-md w-fit ${isSettled ? "bg-emerald-950/50 border border-emerald-900/40 text-emerald-400" : "bg-amber-950/50 border border-amber-900/40 text-amber-500"}`, children: isSettled ? "\u{1F7E2} \u062A\u0645 \u0627\u0644\u062A\u0635\u0641\u064A\u0629 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639" : "\u{1F534} \u0639\u0647\u062F\u0629 \u0646\u0642\u062F\u064A\u0629 \u0645\u0639\u0644\u0642\u0629" })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2.5", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-right", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] text-slate-450 block font-bold leading-none", children: "\u0627\u0644\u0643\u0627\u0634 \u0627\u0644\u0641\u0639\u0644\u064A \u0628\u0630\u0645\u062A\u0647:" }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs font-mono font-black text-emerald-400 mt-1 block", children: [
                                (dItem.cashCollected || 0).toLocaleString("ar"),
                                " \u062C.\u0645"
                              ] })
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-slate-900 border border-white/5 p-1 rounded-md text-slate-450", children: isCourierOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 14 }) })
                          ] })
                        ]
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "div",
                      {
                        className: `transition-all duration-300 ease-in-out ${isCourierOpen ? "max-h-[600px] border-t border-white/6 p-4 bg-slate-950/90 opacity-100 space-y-3" : "max-h-0 overflow-hidden opacity-0 pointer-events-none"}`,
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-900 border border-white/4 p-2.5 rounded-lg text-right", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9.5px] text-slate-400 block font-bold", children: "\u0627\u0644\u062A\u0633\u0644\u064A\u0645\u0627\u062A \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A\u0629:" }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs font-black text-emerald-400 mt-0.5 block", children: [
                                dItem.delivered,
                                " \u0634\u062D\u0646\u0629"
                              ] })
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-900 border border-white/4 p-2.5 rounded-lg text-right", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9.5px] text-slate-400 block font-bold", children: "\u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0627\u0644\u0645\u0643\u062A\u0645\u0644\u0629:" }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs font-black text-amber-505 mt-0.5 block", children: [
                                dItem.returned,
                                " \u0634\u062D\u0646\u0629"
                              ] })
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-900 border border-white/4 p-2.5 rounded-lg text-right", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9.5px] text-slate-400 block font-bold", children: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0639\u0627\u0634 \u0627\u0644\u064A\u0648\u0645\u064A:" }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs font-mono font-bold text-slate-300 mt-0.5 block", children: [
                                (dItem.baseEarning || 0).toFixed(2),
                                " \u062C.\u0645"
                              ] })
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-900 border border-white/4 p-2.5 rounded-lg text-right", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9.5px] text-slate-400 block font-bold", children: "\u0635\u0627\u0641\u064A \u0639\u0645\u0648\u0644\u0627\u062A \u0627\u0644\u064A\u0648\u0645:" }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs font-mono font-black text-emerald-400 mt-0.5 block", children: [
                                "+",
                                dailyCommissions.toLocaleString("ar"),
                                " \u062C.\u0645"
                              ] })
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-905 border border-emerald-500/10 p-2.5 rounded-lg col-span-2 flex justify-between items-center text-right", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-slate-350 font-bold", children: "\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A \u0627\u0644\u0645\u062A\u0628\u0642\u064A \u0644\u0644\u0631\u0627\u062A\u0628:" }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-sm font-mono font-black text-emerald-300", children: [
                                Number(dItem.cumulative || 0).toLocaleString("ar"),
                                " \u062C.\u0645"
                              ] })
                            ] })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            "button",
                            {
                              type: "button",
                              onClick: () => {
                                const matched = allCouriers.find((c) => c && c.name && c.name.toString().trim().toLowerCase() === selectedCourier.toString().trim().toLowerCase());
                                let phoneNum = "";
                                if (matched && matched.phone && matched.phone !== "\u2014" && matched.phone.trim() !== "") {
                                  phoneNum = matched.phone.toString().trim();
                                }
                                if (!phoneNum) {
                                  const userInput = window.prompt("\u26A0\uFE0F \u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0645\u0633\u062C\u0644 \u0644\u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062F\u0648\u0628. \u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0631\u0642\u0645 \u0644\u0628\u062F\u0621 \u0645\u062D\u0627\u062F\u062B\u0629 \u0648\u0627\u062A\u0633\u0627\u0628 (\u0645\u062B\u0627\u0644: 01012345678):");
                                  if (!userInput) return;
                                  phoneNum = userInput.trim();
                                }
                                let cleanedPhone = phoneNum.replace(/[+\s\-]/g, "");
                                if (cleanedPhone.startsWith("0") && cleanedPhone.length === 11) {
                                  cleanedPhone = "2" + cleanedPhone;
                                }
                                const text = `\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064A\u0643\u0645 \u064A\u0627 \u0641\u0646\u062F\u0645\u060C \u062A\u0641\u0627\u0635\u064A\u0644 \u062A\u0642\u0631\u064A\u0631 \u0648\u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u0648\u0631\u062F\u064A\u0629 \u0644\u064A\u0648\u0645 ${courierDateStr} \u0644\u0644\u0645\u0646\u062F\u0648\u0628 (${selectedCourier}):
- \u{1F6F5} \u0634\u062D\u0646\u0627\u062A \u0645\u0633\u0644\u0651\u064E\u0645\u0629 \u0627\u0644\u064A\u0648\u0645: ${dItem.delivered} \u0634\u062D\u0646\u0629
- \u{1F504} \u0634\u062D\u0646\u0627\u062A \u0645\u0631\u062A\u062C\u0639\u0629 \u0627\u0644\u064A\u0648\u0645: ${dItem.returned} \u0634\u062D\u0646\u0629
- \u{1F4B5} \u0627\u0644\u0643\u0627\u0634 \u0627\u0644\u0645\u0633\u062A\u062D\u0642 \u0628\u0630\u0645\u062A\u0643\u0645 \u0644\u0644\u0634\u0631\u0643\u0629: ${(dItem.cashCollected || 0).toLocaleString("ar")} \u062C.\u0645
- \u{1F4B0} \u0623\u0631\u0628\u0627\u062D \u0648\u0645\u0633\u062A\u062D\u0642\u0627\u062A \u0627\u0644\u064A\u0648\u0645: ${dItem.total.toLocaleString("ar")} \u062C.\u0645
- \u{1F512} \u062D\u0627\u0644\u0629 \u0627\u0644\u0648\u0631\u062F\u064A\u0629 \u0648\u0627\u0644\u0645\u0637\u0627\u0628\u0642\u0629: ${isSettled ? "\u0645\u0635\u0641\u0627\u0629 \u062A\u0645\u0627\u0645\u0627\u064B \u2713" : "\u0645\u0639\u0644\u0642\u0629 \u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0648\u0627\u0644\u0645\u0637\u0627\u0628\u0642\u0629 \u26A0\uFE0F"}

\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0639\u0627\u0645\u0644\u0643\u0645 \u0648\u062A\u0645\u0646\u064A\u0627\u062A\u0646\u0627 \u0628\u0627\u0644\u062A\u0648\u0641\u064A\u0642 \u0644\u0643.`;
                                const encodedText = encodeURIComponent(text);
                                const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${encodedText}`;
                                window.open(whatsappUrl, "_blank");
                              },
                              className: "w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2 px-4 rounded-xl text-[11px] flex items-center justify-center gap-2 cursor-pointer transition-all border border-emerald-400/20 active:scale-98 shadow-md",
                              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F4E6} \u0625\u0631\u0633\u0627\u0644 \u0643\u0634\u0641 \u0627\u0644\u064A\u0648\u0645\u064A\u0629 \u0628\u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628" })
                            }
                          )
                        ]
                      }
                    )
                  ]
                },
                `c-day-mobile-${idx}`
              );
            }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center bg-slate-950/80 border border-white/4 py-5 rounded-xl space-y-1 relative", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[10px] font-extrabold tracking-widest text-slate-450 uppercase", children: [
              "\u0635\u0627\u0641\u064A \u0645\u0633\u062A\u062D\u0642\u0627\u062A \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0644\u0644\u062A\u0642\u0641\u064A\u0644 (",
              periodFilter === "day" ? "\u0627\u0644\u064A\u0648\u0645\u064A" : periodFilter === "week" ? "\u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A" : "\u0627\u0644\u0634\u0647\u0631\u064A",
              ")"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-3xl font-black text-amber-500", children: [
              courierSummary.netSalary.toLocaleString("ar"),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs", children: "\u062C.\u0645" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[9px] text-slate-500", children: "\u0627\u0644\u0631\u0627\u062A\u0628 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0645\u0641\u0644\u062A\u0631 + \u0639\u0645\u0648\u0644\u0627\u062A \u0627\u0644\u062A\u0633\u0644\u064A\u0645 + \u0639\u0645\u0648\u0644\u0627\u062A \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0645\u062F\u0641\u0648\u0639\u0629 \u0627\u0644\u0634\u062D\u0646 + \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A - \u0627\u0644\u062C\u0632\u0627\u0621\u0627\u062A" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 p-3 rounded-xl text-center border border-white/4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[18px] text-amber-400 font-black font-mono", children: [
                courierSummary.basicSalary.toLocaleString("ar"),
                " \u062C"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[9px] text-slate-500 font-bold mt-1", children: "\u0627\u0644\u0631\u0627\u062A\u0628 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0627\u0644\u0645\u0641\u062A\u0631\u0636" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 p-3 rounded-xl text-center border border-white/4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[18px] text-emerald-400 font-black font-mono", children: [
                courierSummary.delivCommission.toLocaleString("ar"),
                " \u062C"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[9px] text-slate-500 font-bold mt-1", children: [
                "\u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (",
                courierSummary.deliveredCount,
                " \u0623\u0648\u0631\u062F\u0631)"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 p-3 rounded-xl text-center border border-white/4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[18px] text-emerald-400 font-black font-mono", children: [
                courierSummary.returnShippingCommission.toLocaleString("ar"),
                " \u062C"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[9px] text-slate-500 font-bold mt-1", children: [
                "\u0645\u0631\u062A\u062C\u0639 \u062F\u0641\u0639 \u0634\u062D\u0646 (",
                courierSummary.returnedPaidCount,
                " \u0623\u0648\u0631\u062F\u0631)"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 p-3 rounded-xl text-center border border-white/4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[18px] font-black font-mono text-cyan-400", children: [
                courierSummary.bonusesSum.toLocaleString("ar"),
                " \u062C"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[9px] text-slate-505 font-bold mt-1", children: "\u0645\u0643\u0627\u0641\u0622\u062A \u0648\u062A\u0643\u0631\u064A\u0645\u0627\u062A \u0645\u0636\u0627\u0641\u0629" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "col-span-2 md:col-span-4 bg-red-950/15 border border-red-950/40 p-3.5 rounded-xl text-center flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[9px] text-red-400/80 font-bold uppercase flex items-center gap-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 14 }),
                "\u062E\u0635\u0648\u0645\u0627\u062A \u0648\u062C\u0632\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u0646\u062F\u0648\u0628 (\u0645\u0624\u062B\u0631\u0629 \u0633\u0644\u0628\u0627\u064B \u0639\u0644\u0649 \u0627\u0644\u0631\u0627\u062A\u0628):"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-sm font-black text-red-400 font-mono", children: [
                "-",
                courierSummary.penaltiesSum.toLocaleString("ar"),
                " \u062C.\u0645"
              ] })
            ] })
          ] })
        ] })
      ] }),
      courierSummary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-white/6 rounded-2xl p-5 space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "border-b border-white/6 pb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-xs font-black text-rose-400 flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F6A8} \u062C\u0647\u0627\u0632 \u062A\u0639\u0642\u0628 \u0639\u0647\u062F\u0629 \u0627\u0644\u0640 COD \u0648\u0645\u0646\u0639 \u0627\u0644\u0639\u062C\u0632 (\u0627\u0644\u0645\u0637\u0627\u0628\u0642\u0629 \u0627\u0644\u0644\u062D\u0638\u064A\u0629)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] font-bold bg-rose-950/20 text-rose-500 border border-rose-900/40 px-2 py-0.5 rounded", children: "\u0646\u0638\u0627\u0645 \u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u062D\u0635\u064A\u0644\u0629 100%" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[10px] text-slate-500 mt-1", children: "\u0645\u0637\u0627\u0628\u0642\u0629 \u0627\u0644\u0646\u0642\u062F\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629 \u0641\u064A \u0627\u0644\u062E\u0632\u0646\u0629 \u0645\u0639 \u0627\u0644\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0645\u0633\u062A\u0644\u0645 \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628\u064A\u0646 \u0648\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0641\u0631\u0648\u0642\u0627\u062A." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 p-4 border border-white/4 rounded-xl space-y-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[10px] font-bold text-slate-400", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0646\u0642\u062F\u064A\u0629 \u0627\u0644\u0645\u062D\u0635\u0644\u0629 (COD)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-xl font-black text-slate-200 font-mono", children: [
              Number(courierSummary.totalCollected || 0).toLocaleString("ar"),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs font-medium", children: "\u062C.\u0645" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[9px] text-slate-500", children: "\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u0644\u0651\u0645\u0629 \u0628\u0646\u062C\u0627\u062D" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 p-4 border border-white/4 rounded-xl space-y-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[10px] font-bold text-slate-400", children: "\u0645\u0627 \u062A\u0645 \u0625\u064A\u062F\u0627\u0639\u0647 \u0628\u0627\u0644\u0634\u0631\u0643\u0629 \u0641\u0639\u0644\u064A\u0627\u064B" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-xl font-black text-emerald-400 font-mono", children: [
              Number(courierSummary.totalPaidToCompany || 0).toLocaleString("ar"),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs font-medium", children: "\u062C.\u0645" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[9px] text-emerald-500", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062A\u0648\u0631\u064A\u062F\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629 \u0628\u0627\u0644\u062E\u0632\u0646\u0629" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `p-4 rounded-xl space-y-1 border ${(courierSummary.deficit || 0) > 0 ? "bg-rose-950/15 border-rose-900/40" : "bg-emerald-950/10 border-emerald-900/30"}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[10px] font-bold text-slate-200", children: "\u0627\u0644\u0639\u0647\u062F\u0629 \u0627\u0644\u0645\u0639\u0644\u0642\u0629 \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 (Courier Custody)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `text-xl font-black font-mono ${(courierSummary.deficit || 0) > 0 ? "text-rose-450" : "text-emerald-400"}`, children: [
              Number(courierSummary.deficit || 0).toLocaleString("ar"),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs font-medium", children: "\u062C.\u0645" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[9px] text-slate-400 leading-none", children: (courierSummary.deficit || 0) > 0 ? "\u26A0\uFE0F \u062A\u0648\u062C\u062F \u0639\u0647\u062F\u0629 \u0645\u0627\u0644\u064A\u0629 \u0641\u064A \u0627\u0644\u0634\u0627\u0631\u0639 \u0644\u0645 \u062A\u064F\u0633\u0644\u0645 \u0628\u0639\u062F \u0644\u0644\u0634\u0631\u0643\u0629" : "\u2705 \u0630\u0645\u0629 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u062E\u0627\u0644\u064A\u0629 \u062A\u0645\u0627\u0645\u0627\u064B \u0645\u0646 \u0627\u0644\u0639\u0647\u062F\u0629" })
          ] })
        ] }),
        isFinancial && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 p-4 rounded-xl border border-white/4 space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", { className: "text-[11px] font-black text-emerald-400 flex items-center gap-1.5 border-b border-white/6 pb-2", children: [
            "\u{1F91D} \u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u062A\u0633\u0648\u064A\u0629 \u0648\u0627\u0644\u0645\u0637\u0627\u0628\u0642\u0629 \u0648\u062C\u0647\u0627\u064B \u0644\u0648\u062C\u0647 \u0644\u0640 ",
            selectedCourier
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-indigo-950/25 border border-indigo-500/25 p-3.5 rounded-xl space-y-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", { className: "text-[10px] font-black text-indigo-400 flex items-center gap-1.5 justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F512} \u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629 \u0627\u0644\u0645\u0648\u062D\u062F\u0629 (Rider Settlement)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-indigo-950 text-[9px] text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-950/50", children: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u062D\u0627\u0644\u064A \u0627\u0644\u0645\u0641\u0644\u062A\u0631" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2.5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 p-2.5 rounded-lg border border-white/4 text-right", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] text-slate-400 block font-bold", children: "1. \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062A\u062D\u0635\u064A\u0644 \u0627\u0644\u0641\u0639\u0644\u064A \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A (\u0643\u0627\u0634 \u0627\u0644\u0634\u0627\u0631\u0639)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm font-extrabold text-emerald-400 mt-0.5 font-mono", children: [
                  (courierSummary.todayDeliveredCash || 0).toLocaleString("ar"),
                  " \u062C.\u0645"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[8px] text-slate-500 block", children: '\u0644\u0644\u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0627\u0644\u0646\u0627\u062C\u062D\u0629 \u0635\u0631\u0627\u062D\u0629 "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645"' })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 p-2.5 rounded-lg border border-white/4 text-right", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] text-slate-400 block font-bold", children: "2. \u0625\u062C\u0645\u0627\u0644\u064A \u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0627\u0644\u064A\u0648\u0645\u064A\u0629" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm font-extrabold text-rose-400 mt-0.5 font-mono", children: [
                  "-",
                  (courierSummary.todayTotalCommission || 0).toLocaleString("ar"),
                  " \u062C.m"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[8px] text-slate-500 block", children: [
                  "(",
                  courierSummary.todayDelivered || 0,
                  " \u0646\u0627\u062C\u062D \xD7 \u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644) + (",
                  courierSummary.todayReturned || 0,
                  " \u0645\u0631\u062A\u062C\u0639 \xD7 \u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u0645\u0631\u062A\u062C\u0639)"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-500/10 text-right flex flex-col justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] text-indigo-300 block font-bold", children: "3. \u0627\u0644\u0635\u0627\u0641\u064A \u0627\u0644\u0646\u0647\u0627\u0626\u064A \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0645\u0646 \u0627\u0644\u0645\u0646\u062F\u0648\u0628" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-base font-black text-indigo-400 mt-0.5 font-mono", children: [
                    ((courierSummary.todayDeliveredCash || 0) - (courierSummary.todayTotalCommission || 0)).toLocaleString("ar"),
                    " \u062C.\u0645"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[8px] text-indigo-450 block font-bold", children: "\u0627\u0644\u062A\u062D\u0635\u064A\u0644 \u0627\u0644\u0641\u0639\u0644\u064A - \u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u064A\u0648\u0645" })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-slate-950 border border-white/4 p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-right", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[9px] font-bold text-indigo-400", children: "\u0627\u0644\u0635\u0627\u0641\u064A \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u062A\u0648\u0631\u064A\u062F\u0647 \u0631\u0633\u0645\u064A\u0627\u064B \u0644\u0644\u062E\u0632\u0646\u0629 \u0644\u0644\u064A\u0648\u0645 (\u0627\u0644\u0639\u0647\u062F\u0629 \u0627\u0644\u0646\u0642\u062F\u064A\u0629):" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[8.5px] text-slate-400 font-sans leading-relaxed", children: "\u0627\u0644\u0645\u0639\u0627\u062F\u0644\u0629 \u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0629 \u0627\u0644\u0648\u062D\u064A\u062F\u0629 \u0648\u0627\u0644\u0635\u0627\u0631\u0645\u0629: [\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062A\u062D\u0635\u064A\u0644 \u0627\u0644\u0641\u0639\u0644\u064A \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A (\u0643\u0627\u0634 \u0627\u0644\u0634\u0627\u0631\u0639)] - [\u0625\u062C\u0645\u0627\u0644\u064A \u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0627\u0644\u064A\u0648\u0645\u064A\u0629] = [\u0627\u0644\u0635\u0627\u0641\u064A \u0627\u0644\u0646\u0647\u0627\u0626\u064A \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0645\u0646 \u0627\u0644\u0645\u0646\u062F\u0648\u0628]. \u064A\u064F\u0645\u0646\u0639 \u0645\u0646\u0639\u0627\u064B \u0628\u0627\u062A\u0627\u064B \u0625\u0636\u0627\u0641\u0629 \u062B\u0645\u0646 \u0628\u0636\u0627\u0639\u0629 \u0627\u0644\u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0629 \u0623\u0648 \u062E\u0644\u0637\u0647\u0627 \u0645\u0639 \u0627\u0644\u0639\u0647\u062F\u0629 \u0627\u0644\u0646\u0642\u062F\u064A\u0629." })
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: handleCourierHandover, className: "grid grid-cols-1 md:grid-cols-4 gap-3 items-end", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "block text-[9px] text-slate-400 font-bold", children: "\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u0644\u0645 \u0628\u0627\u0644\u062C\u0646\u064A\u0647*" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "input",
                {
                  type: "number",
                  required: true,
                  value: handoverAmount,
                  onChange: (e) => setHandoverAmount(e.target.value),
                  placeholder: "3500",
                  className: "w-full bg-slate-900 text-slate-200 border border-white/8 rounded-lg px-2.5 py-2 text-xs font-mono text-right"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "block text-[9px] text-slate-400 font-bold", children: "\u0631\u0642\u0645 \u0625\u064A\u0635\u0627\u0644 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 (REF)*" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "input",
                {
                  type: "text",
                  required: true,
                  value: handoverRef,
                  onChange: (e) => setHandoverRef(e.target.value),
                  placeholder: "REC-5502...",
                  className: "w-full bg-slate-900 text-slate-200 border border-white/8 rounded-lg px-2.5 py-2 text-xs text-right"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "block text-[9px] text-slate-400 font-bold", children: "\u0628\u064A\u0627\u0646 \u0625\u0636\u0627\u0641\u064A (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "input",
                {
                  type: "text",
                  value: handoverDesc,
                  onChange: (e) => setHandoverDesc(e.target.value),
                  placeholder: "\u062A\u0648\u0631\u064A\u062F \u0627\u0644\u0648\u0631\u062F\u064A\u0629 \u0627\u0644\u0645\u0633\u0627\u0626\u064A\u0629...",
                  className: "w-full bg-slate-900 text-slate-200 border border-white/8 rounded-lg px-2.5 py-2 text-xs text-right"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "submit",
                  disabled: submittingLedger,
                  className: "w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50",
                  children: "\u{1F91D} \u062A\u0633\u0648\u064A\u0629 \u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0627\u0644\u0645\u0627\u0644\u064A \u0648\u0625\u064A\u062F\u0627\u0639 \u0627\u0644\u062E\u0632\u0646\u0629"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: handleSettleCourierOrders,
                  disabled: submittingLedger,
                  className: "w-full bg-indigo-600 hover:bg-indigo-700 text-slate-950 font-black text-xs py-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50",
                  children: "\u{1F504} \u0633\u062D\u0628 \u0627\u0644\u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0644\u0644\u0645\u0633\u062A\u0648\u062F\u0639 \u0648\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0639\u0647\u062F\u0629 \u0627\u0644\u0644\u0648\u062C\u0633\u062A\u064A\u0629"
                }
              )
            ] })
          ] })
        ] })
      ] }),
      isFinancial && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xs font-black text-slate-400", children: "\u2795 \u0625\u0636\u0627\u0641\u0629 \u062A\u0633\u0648\u064A\u0629 \u0645\u0627\u0644\u064A\u0629 \u0644\u0644\u0645\u0646\u062F\u0648\u0628 (\u0645\u0643\u0627\u0641\u0623\u0629 \u0623\u0648 \u062C\u0632\u0627\u0621)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: handleCourierAdjustment, className: "grid grid-cols-1 md:grid-cols-4 gap-4 items-end", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "block text-[10px] text-slate-400 font-bold", children: "\u0646\u0648\u0639 \u0627\u0644\u062A\u0633\u0648\u064A\u0629" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "select",
              {
                value: adjustmentType,
                onChange: (e) => setAdjustmentType(e.target.value),
                className: "w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs focus:outline-none",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "\u0645\u0643\u0627\u0641\u0623\u0629", children: "\u0645\u0643\u0627\u0641\u0623\u0629 \u0645\u0636\u0627\u0641\u0629 (+)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "\u062C\u0632\u0627\u0621", children: "\u062C\u0632\u0627\u0621 \u0645\u062E\u0635\u0648\u0645 (-)" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "block text-[10px] text-slate-400 font-bold", children: "\u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 (\u062C.\u0645)*" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                type: "number",
                required: true,
                value: adjAmount,
                onChange: (e) => setAdjAmount(e.target.value),
                placeholder: "100",
                className: "w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "block text-[10px] text-slate-400 font-bold", children: "\u0627\u0644\u0628\u064A\u0627\u0646 / \u0627\u0644\u0633\u0628\u0628" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                type: "text",
                value: adjDesc,
                onChange: (e) => setAdjDesc(e.target.value),
                placeholder: "\u0645\u0643\u0627\u0641\u0623\u0629 \u062A\u0645\u064A\u0632 / \u062A\u0623\u062E\u0631 \u0639\u0646 \u0627\u0644\u062A\u0633\u0644\u064A\u0645...",
                className: "w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "submit",
              disabled: submittingLedger,
              className: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3.5 px-4 rounded-lg cursor-pointer transition-colors disabled:opacity-50",
              children: "\u062D\u0641\u0638 \u0627\u0644\u062A\u0633\u0648\u064A\u0629 \u0648\u0645\u0632\u0627\u0645\u0646\u0629 \u0627\u0644\u062E\u0632\u0646\u0629"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-xs font-black text-slate-400 flex items-center justify-between border-b border-white/6 pb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F4CA} \u062D\u0631\u0643\u0627\u062A \u0648\u062A\u0633\u0648\u064A\u0627\u062A \u0639\u0645\u0648\u0644\u0627\u062A \u0627\u0644\u0645\u0646\u062F\u0648\u0628" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 16, className: "text-slate-500" })
        ] }),
        loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-center py-6 text-xs text-slate-500 animate-pulse", children: "\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u062D\u0631\u0643\u0627\u062A \u0627\u0644\u0645\u0646\u062F\u0648\u0628..." }) : courierTrs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-center py-8 text-xs text-slate-500", children: "\u0644\u0627 \u064A\u0648\u062C\u062F \u062D\u0631\u0643\u0627\u062A \u0645\u0633\u062C\u0644\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u062D\u0627\u0644\u064A\u0627\u064B" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-3", children: courierTrs.map((e, idx) => {
          const isPositive = e.type !== "\u062C\u0632\u0627\u0621";
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              className: "bg-slate-950 border border-white/4 p-4 rounded-xl flex items-center justify-between hover:bg-slate-950/70",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `p-2 rounded-lg text-xs ${isPositive ? "text-emerald-400 bg-emerald-950/20" : "text-red-400 bg-red-950/20"}`, children: isPositive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { size: 16 }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-xs font-bold text-slate-200", children: e.desc || e.type }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[10px] text-slate-500 mt-1 font-semibold", children: [
                      e.date,
                      " ",
                      e.tracking !== "ADJUST" ? `\xB7 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 ${e.tracking}` : ""
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `text-xs font-black font-mono ${isPositive ? "text-emerald-400" : "text-red-400"}`, children: [
                  isPositive ? "+" : "-",
                  e.amount.toLocaleString("ar"),
                  " \u062C"
                ] })
              ]
            },
            idx
          );
        }) })
      ] })
    ] }),
    selectedDayOrdersDetail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl text-right animate-fadeIn", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 border-b border-white/8 flex items-center justify-between bg-slate-900", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-sm font-black text-slate-100 flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { size: 16, className: "text-amber-500" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              "\u{1F50D} \u0643\u0634\u0641 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A \u0644\u0644\u0637\u0644\u0628\u0627\u062A - \u0644\u064A\u0648\u0645 ",
              selectedDayDate
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-[10px] text-slate-400 font-bold", children: [
            "\u062D\u0627\u0644\u0629 \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u062D\u0627\u0644\u064A\u0629: ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: selectedDayStatus === "pending" ? "text-amber-450" : "text-emerald-400", children: selectedDayStatus === "pending" ? "\u{1F534} \u0645\u0639\u0644\u0642 \u0644\u0645 \u064A\u0635\u0641\u0649" : "\u{1F7E2} \u062A\u0645 \u062A\u0635\u0641\u064A\u062A\u0647 \u0648\u0642\u0641\u0644 \u062D\u0633\u0627\u0628\u0647" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            onClick: () => {
              setSelectedDayOrdersDetail(null);
              setSelectedDayDate("");
              setModalSearchFilter("");
            },
            className: "p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 bg-slate-950 border-b border-white/4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-y-0 right-3 flex items-center pr-1 text-slate-550", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 14 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            type: "text",
            placeholder: "\u0627\u0628\u062D\u062B \u0628\u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u064A\u0644\u060C \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641\u060C \u0643\u0648\u062F \u0627\u0644\u062A\u062A\u0628\u0639\u060C \u0623\u0648 \u062D\u0627\u0644\u0629 \u0627\u0644\u0623\u0648\u0631\u062F\u0631...",
            value: modalSearchFilter,
            onChange: (e) => setModalSearchFilter(e.target.value),
            className: "w-full bg-slate-900 border border-white/8 rounded-lg pr-9 pl-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500"
          }
        )
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 overflow-y-auto p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "overflow-x-auto border border-white/6 rounded-xl", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { className: "w-full text-right border-collapse text-2xs font-semibold", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "bg-slate-900 text-slate-400 border-b border-white/6 font-bold", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3", children: "\u0631\u0642\u0645 \u0627\u0644\u062A\u062A\u0628\u0639" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3", children: "\u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u064A\u0644" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3", children: "\u0627\u0644\u0647\u0627\u062A\u0641" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3", children: "\u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0629" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3", children: "\u0627\u0644\u062D\u0627\u0644\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3 text-left", children: "\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0627\u0644\u0635\u0627\u0641\u064A" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3 text-left", children: "\u0645\u0635\u0627\u0631\u064A\u0641 \u0627\u0644\u0634\u062D\u0646" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3 text-left", children: "COD \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0627\u0644\u0643\u0644\u064A" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3 text-left", children: "\u0627\u0644\u0643\u0627\u0634 \u0627\u0644\u0645\u062D\u0635\u0644" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { className: "divide-y divide-white/4", children: selectedDayOrdersDetail.filter((o) => {
          const term = modalSearchFilter.toLowerCase().trim();
          if (!term) return true;
          return (o.trackingId || "").toLowerCase().includes(term) || (o.custName || "").toLowerCase().includes(term) || (o.custPhone || "").toLowerCase().includes(term) || (o.status || "").toLowerCase().includes(term);
        }).map((o, oIdx) => {
          const isDelivered = ["\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645", "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A"].includes(o.status);
          const isReturned = (o.status || "").includes("\u0645\u0631\u062A\u062C\u0639") || ["\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u062A\u062C\u0639"].includes(o.status);
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "hover:bg-slate-900/40", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "p-3 font-mono text-slate-300 select-all", children: o.trackingId }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "p-3 text-slate-100 font-bold", children: o.custName }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "p-3 font-mono text-slate-300", children: o.custPhone }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "p-3 text-slate-400", children: o.custProvince || "\u2014" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "p-3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "span",
              {
                className: `px-2 py-0.5 rounded text-[10px] font-bold ${isDelivered ? "bg-emerald-950/50 text-emerald-400" : isReturned ? "bg-red-950/50 text-red-400" : "bg-slate-800 text-slate-200"}`,
                children: o.status
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "p-3 text-left font-mono text-slate-300", children: [
              (o.prodPrice || 0).toLocaleString("ar"),
              " \u062C.\u0645"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "p-3 text-left font-mono text-slate-300", children: [
              (o.shipPrice || 0).toLocaleString("ar"),
              " \u062C.\u0645"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "p-3 text-left font-mono text-amber-400", children: [
              (o.cod || 0).toLocaleString("ar"),
              " \u062C.\u0645"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "p-3 text-left font-mono font-bold text-emerald-400", children: [
              (o.collectedAmount || 0).toLocaleString("ar"),
              " \u062C.\u0645"
            ] })
          ] }, oIdx);
        }) })
      ] }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-slate-900 border-t border-white/8 grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 border border-white/4 p-2.5 rounded-xl", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-slate-400 block font-bold", children: "\u0639\u062F\u062F \u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u0645\u0635\u0646\u0641\u0629" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-sm font-mono font-black text-slate-100", children: [
            selectedDayOrdersDetail.length,
            " \u0623\u0648\u0631\u062F\u0631\u0627\u062A"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 border border-white/4 p-2.5 rounded-xl", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-slate-400 block font-bold", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0643\u0648\u062F \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0643\u0644\u064A\u0627\u064B" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-sm font-mono font-black text-amber-400", children: [
            selectedDayOrdersDetail.reduce((acc, cur) => acc + (cur.cod || 0), 0).toLocaleString("ar"),
            " \u062C.\u0645"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 border border-white/4 p-2.5 rounded-xl", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-slate-400 block font-bold", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0643\u0627\u0634 \u0627\u0644\u0645\u062D\u0635\u0644 \u0627\u0644\u0641\u0639\u0644\u064A" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-sm font-mono font-black text-emerald-400", children: [
            selectedDayOrdersDetail.reduce((acc, cur) => acc + (cur.collectedAmount || 0), 0).toLocaleString("ar"),
            " \u062C.\u0645"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-950 border border-white/4 p-2.5 rounded-xl", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] text-slate-400 block font-bold", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0634\u062D\u0646 \u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0627\u0644\u064A\u0648\u0645" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-sm font-mono font-black text-slate-300", children: [
            selectedDayOrdersDetail.reduce((acc, cur) => acc + (cur.shipPrice || 0), 0).toLocaleString("ar"),
            " \u062C.\u0645"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-slate-950 border-t border-white/4 text-left", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          onClick: () => {
            setSelectedDayOrdersDetail(null);
            setSelectedDayDate("");
            setModalSearchFilter("");
          },
          className: "bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-5 rounded-lg text-xs font-black cursor-pointer transition-colors",
          children: "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0643\u0634\u0641 \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A"
        }
      ) })
    ] }) })
  ] });
}
export {
  Ledger as default
};
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils.js:
lucide-react/dist/esm/defaultAttributes.js:
lucide-react/dist/esm/Icon.js:
lucide-react/dist/esm/createLucideIcon.js:
lucide-react/dist/esm/icons/arrow-down-right.js:
lucide-react/dist/esm/icons/arrow-left.js:
lucide-react/dist/esm/icons/arrow-up-right.js:
lucide-react/dist/esm/icons/calendar.js:
lucide-react/dist/esm/icons/check.js:
lucide-react/dist/esm/icons/chevron-down.js:
lucide-react/dist/esm/icons/chevron-up.js:
lucide-react/dist/esm/icons/circle-check.js:
lucide-react/dist/esm/icons/eye.js:
lucide-react/dist/esm/icons/file-text.js:
lucide-react/dist/esm/icons/funnel.js:
lucide-react/dist/esm/icons/loader-circle.js:
lucide-react/dist/esm/icons/lock.js:
lucide-react/dist/esm/icons/search.js:
lucide-react/dist/esm/icons/shield-alert.js:
lucide-react/dist/esm/icons/shield.js:
lucide-react/dist/esm/icons/wallet.js:
lucide-react/dist/esm/lucide-react.js:
  (**
   * @license lucide-react v0.546.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
