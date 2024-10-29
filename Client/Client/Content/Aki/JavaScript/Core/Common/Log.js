"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.Log = exports.levelName = void 0);
const cpp_1 = require("cpp"),
  puerts_1 = require("puerts"),
  UE = require("ue"),
  LogDefine_1 = require("../Define/LogDefine"),
  Info_1 = require("./Info"),
  LogCaptureController_1 = require("./LogCaptureController"),
  Time_1 = require("./Time"),
  levelTrace =
    (cpp_1.FKuroUtilityForPuerts.IsBuildShipping() &&
      (cpp_1.KuroLoggingLibrary.RegisterTerminateDelegate(),
      cpp_1.KuroLoggingLibrary.PromoteGlobalLogVerbosity(4)),
    { [0]: !0, 1: !1, 2: !1, 3: !1 }),
  logProxy =
    ((exports.levelName = { [0]: "E", 1: "W", 2: "I", 3: "D" }),
    {
      [0]: puerts_1.logger.error,
      1: puerts_1.logger.warn,
      2: puerts_1.logger.info,
      3: puerts_1.logger.log,
    }),
  DEFAULT_SKIP_INDEX = 2;
class Log {
  static SetJsDebugId(t) {
    t && 0 < t.length && ((Log.U8 = `(${t})`), global.setDebugId(t));
  }
  static Initialize() {}
  static InitStat(t) {
    (this.A8 = t.Create("Log.Print")),
      (this.P8 = t.Create("Log.GetStack")),
      (this.x8 = t.Create("Log.GetTSStack")),
      (this.w8 = t.Create("Log.GetBpStack"));
  }
  static SetLevel(t) {
    Log.B8 = t;
  }
  static CheckError() {
    return 0 <= Log.B8;
  }
  static CheckWarn() {
    return 1 <= Log.B8;
  }
  static CheckInfo() {
    return 2 <= Log.B8;
  }
  static CheckDebug() {
    return 3 <= Log.B8;
  }
  static Error(t, r, e, ...o) {
    Log.b8(0, t, r, e, o, levelTrace[0]);
  }
  static ErrorWithStack(t, r, e, o, ...i) {
    Log.b8(0, t, r, e, i, levelTrace[0], o);
  }
  static Warn(t, r, e, ...o) {
    Log.b8(1, t, r, e, o, levelTrace[1]);
  }
  static Info(t, r, e, ...o) {
    Log.b8(2, t, r, e, o, levelTrace[2]);
  }
  static Debug(t, r, e, ...o) {
    Log.b8(3, t, r, e, o, levelTrace[3]);
  }
  static b8(e, o, i, g, n, a, L) {
  }
  static ke() {
    var t = new Date();
    return (
      `${t.getHours()}.${t.getMinutes()}.${t.getSeconds()}:` +
      t.getMilliseconds()
    );
  }
  static O8(t) {
    try {
      return Log.BVa(t);
    } catch (t) {
      t instanceof Error
        ? Log.CheckError() &&
          Log.ErrorWithStack("Log", 1, "Log 序列化异常", t, [
            "error",
            t.message,
          ])
        : Log.CheckError() &&
          Log.Error("Log", 1, "Log 序列化异常", ["error", t]);
    }
  }
  static BVa(t) {
    return JSON.stringify(t, Log.bVa).replace(/"/g, "");
  }
  static G8(t) {
    return void 0 === t
      ? "undefined"
      : null === t
        ? "null"
        : "string" == typeof t
          ? t
          : Log.k8 && "object" == typeof t
            ? (Log.O8(t) ?? "")
            : t.toString();
  }
  static N8(o, i) {
  }
  static H8(t, r, e) {
    var o;
    return t && 0 !== t.length
      ? 0 < (o = t.indexOf(r))
        ? t.substring(o + r.length + e)
        : t
      : "unknown";
  }
  static GenLogId() {
    return ++Log.o6;
  }
}
((exports.Log = Log).B8 = 3),
  (Log.k8 = !0),
  (Log.q8 = !1),
  (Log.o6 = 0),
  (Log.Delegate = void 0),
  (Log.A8 = void 0),
  (Log.P8 = void 0),
  (Log.x8 = void 0),
  (Log.w8 = void 0),
  (Log.U8 = ""),
  (Log.bVa = (t, e) => {
    if (void 0 === e) return "undefined";
    switch (typeof e) {
      case "bigint":
        return e.toString() + "n";
      case "function":
        return e.toString();
      case "object":
        if (null === e) return "null";
        var r = e;
        if ("function" == typeof r.ToString) return r.ToString();
        r = e.__proto__;
        if (!(e instanceof Array && r.toString === Array.prototype.toString)) {
          if (r.toString !== Object.prototype.toString) return e.toString();
          if (e instanceof Set) {
            let t = "Set(";
            for (const i of e) 0 < t.length && (t += ","), (t += Log.BVa(i));
            return (t += ")");
          }
          if (e instanceof Map) {
            let t = "Map(";
            for (const g of e)
              0 < t.length && (t += ","),
                (t += `[${Log.BVa(g[0])}, ${Log.BVa(g[1])}]`);
            return (t += ")");
          }
          if (e instanceof UE.TMap) {
            let r = "";
            for (let t = 0; t < e.Num(); t++) {
              0 === r.length ? (r += "TMap(") : (r += ",");
              var o = e.GetKey(t);
              r += `[${Log.BVa(o)}, ${Log.BVa(e.Get(o))}]`;
            }
            return (r += ")");
          }
          if (e instanceof UE.TArray) {
            let r = "";
            for (let t = 0; t < e.Num(); t++)
              0 === r.length ? (r += "TArray(") : (r += ","),
                (r += `[${Log.BVa(e.Get(t))}]`);
            return (r += ")");
          }
          if (e instanceof UE.TSet) {
            let r = "";
            for (let t = 0; t < e.Num(); t++)
              0 === r.length ? (r += "TSet(") : (r += ","),
                (r += `[${Log.BVa(e.Get(t))}]`);
            return (r += ")");
          }
        }
        return e;
      default:
        return e;
    }
  }),
  (Log.F8 = (t, r) => r),
  (Log.V8 = { stack: void 0 });
//# sourceMappingURL=Log.js.map
