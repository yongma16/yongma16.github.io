import _createClass from "@babel/runtime/helpers/esm/createClass";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _isNativeReflectConstruct from "@babel/runtime/helpers/esm/isNativeReflectConstruct";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _wrapNativeSuper from "@babel/runtime/helpers/esm/wrapNativeSuper";

function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }

export var QiankunError = /*#__PURE__*/function (_Error) {
  function QiankunError(message) {
    _classCallCheck(this, QiankunError);

    return _callSuper(this, QiankunError, ["[qiankun]: ".concat(message)]);
  }

  _inherits(QiankunError, _Error);

  return _createClass(QiankunError);
}( /*#__PURE__*/_wrapNativeSuper(Error));