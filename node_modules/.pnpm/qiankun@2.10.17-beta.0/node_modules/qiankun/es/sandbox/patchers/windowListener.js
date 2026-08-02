import _noop from "lodash/noop";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _typeof from "@babel/runtime/helpers/esm/typeof";
/* eslint-disable no-param-reassign */

/**
 * @author Kuitos
 * @since 2019-04-11
 */

var rawAddEventListener = window.addEventListener;
var rawRemoveEventListener = window.removeEventListener;
var DEFAULT_OPTIONS = {
  capture: false,
  once: false,
  passive: false
}; // 移除cacheListener

var removeCacheListener = function removeCacheListener(listenerMap, type, rawListener, rawOptions) {
  var _options;

  // 处理 options，确保它是一个对象
  var options = _typeof(rawOptions) === 'object' ? rawOptions : {
    capture: !!rawOptions
  }; // 如果 options 为 null，使用默认值

  options = (_options = options) !== null && _options !== void 0 ? _options : DEFAULT_OPTIONS;
  var cachedTypeListeners = listenerMap.get(type) || []; // listener和capture/useCapture都相同，认为是同一个监听
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener

  var findIndex = cachedTypeListeners.findIndex(function (item) {
    return item.rawListener === rawListener && item.options.capture == options.capture;
  });

  if (findIndex > -1) {
    var cacheListener = cachedTypeListeners[findIndex];
    cachedTypeListeners.splice(findIndex, 1);
    return cacheListener;
  } // 返回原始listener和options


  return {
    listener: rawListener,
    rawListener: rawListener,
    options: options
  };
}; // 添加监听构造一个cacheListener对象，考虑到多次添加同一个监听和once的情况


var addCacheListener = function addCacheListener(listenerMap, type, rawListener, rawOptions) {
  var _options2;

  // 处理 options，确保它是一个对象
  var options = _typeof(rawOptions) === 'object' ? rawOptions : {
    capture: !!rawOptions
  }; // 如果 options 为 null，使用默认值

  options = (_options2 = options) !== null && _options2 !== void 0 ? _options2 : DEFAULT_OPTIONS;
  var cachedTypeListeners = listenerMap.get(type) || []; // listener和capture/useCapture都相同，认为是同一个监听
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

  var findIndex = cachedTypeListeners.findIndex(function (item) {
    return item.rawListener === rawListener && item.options.capture == options.capture;
  }); // 如果事件已经添加到了target的event listeners 列表中，直接返回不需要添加第二次

  if (findIndex > -1) return;
  var listener = rawListener;
  if (options.once) listener = function listener(event) {
    rawListener(event);
    removeCacheListener(listenerMap, type, rawListener, options);
  };
  var cacheListener = {
    listener: listener,
    options: options,
    rawListener: rawListener
  };
  listenerMap.set(type, [].concat(_toConsumableArray(cachedTypeListeners), [cacheListener]));
  return cacheListener;
};

export default function patch(global) {
  var listenerMap = new Map();

  global.addEventListener = function (type, rawListener, rawOptions) {
    var addListener = addCacheListener(listenerMap, type, rawListener, rawOptions); // 如果返回空，则代表事件已经添加过了，不需要重复添加

    if (!addListener) return;
    var listener = addListener.listener,
        options = addListener.options;
    return rawAddEventListener.call(window, type, listener, options);
  };

  global.removeEventListener = function (type, rawListener, rawOptions) {
    var _removeCacheListener = removeCacheListener(listenerMap, type, rawListener, rawOptions),
        listener = _removeCacheListener.listener,
        options = _removeCacheListener.options;

    return rawRemoveEventListener.call(window, type, listener, options);
  };

  return function free() {
    listenerMap.forEach(function (listeners, type) {
      return _toConsumableArray(listeners).forEach(function (_ref) {
        var rawListener = _ref.rawListener,
            options = _ref.options;
        return global.removeEventListener(type, rawListener, options);
      });
    }); // 清空listenerMap，避免listenerMap中还存有listener导致内存泄漏

    listenerMap.clear();
    global.addEventListener = rawAddEventListener;
    global.removeEventListener = rawRemoveEventListener;
    return _noop;
  };
}