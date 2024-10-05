"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.LogAnalyzer = void 0);
const cpp_1 = require("cpp"),
  puerts_1 = require("puerts"),
  UE = require("ue"),
  LogDefine_1 = require("../Define/LogDefine"),
  TimerSystem_1 = require("../Timer/TimerSystem"),
  Json_1 = require("./Json"),
  Log_1 = require("./Log"),
  Stats_1 = require("./Stats"),
  SHIPPING = cpp_1.FKuroUtilityForPuerts.IsBuildShipping() ? 1 : 0,
  IS_WITH_EDITOR = cpp_1.FKuroUtilityForPuerts.IsWithEditor() ? 1 : void 0,
  STATISTICS_INTERVAL = 6e5,
  STATISTICS_MESSAGE_ERRO_THRESHOLD = 0.01,
  STATISTICS_THRESHOLD = 10,
  STATISTICS_MODULE_TOP_NUM = 10,
  STATISTICS_ENGINE_CATEGORY_TOP_NUM = 10,
  STATISTICS_AUTHOR_TOP_NUM = 10,
  STATISTICS_MESSAGE_TOP_NUM = 10,
  REPORT_INTERVAL = 6e4,
  REPORT_LEVEL = 0,
  REPORT_NUM = 10,
  SIMPLIFY_REPORT_NUM = 100,
  SIMPLIFY_REPORT_MESSAGE_MAX_LENGTH = 100,
  REPLACE_BRANCH_WORD = "branch_";
class LogRecord extends Json_1.JsonObjBase {
  constructor(e, o, r, a, L, n, g, A, l, t, _) {
    if (
      (super(),
      (this.P4V = e),
      (this.Br = o),
      (this.PlayerId = r),
      (this.Id = a),
      (this.Level = L),
      (this.Module = n),
      (this.Category = g),
      (this.Author = A),
      (this.Msg = l),
      (this.Stack = _),
      (this.Sp = SHIPPING),
      (this.Ed = IS_WITH_EDITOR),
      (this.Context = {}),
      t)
    ) {
      let e = 0;
      for (const y in t) this.Context[e++] = { Key: y, Value: t[y] };
    }
  }
}
class LogReportRecord extends Json_1.JsonObjBase {
  constructor(e, o, r, a, L) {
    super(),
      (this.PlayerId = e),
      (this.Num = o),
      (this.Detail = r),
      (this.P4V = a),
      (this.Br = L),
      (this.Sp = SHIPPING),
      (this.Ed = IS_WITH_EDITOR);
  }
}
class LogAnalyzer {
  static SetPlayerId(e) {
    LogAnalyzer.j8 = 0;
  }
  static SetP4Version(e) {
    (LogAnalyzer.W8 = e),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info("Log", 3, "P4Version信息", [
          "P4Version",
          LogAnalyzer.W8,
        ]);
  }
  static GetP4Version(e) {
    return LogAnalyzer.W8;
  }
  static SetBranch(e) {
    let o = e;
    o?.startsWith(REPLACE_BRANCH_WORD) &&
      (o = o.substring(REPLACE_BRANCH_WORD.length)),
      (LogAnalyzer.$i = o),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info("Log", 3, "Branch信息", ["Branch", LogAnalyzer.$i]);
  }
  static GetBranch() {
    return LogAnalyzer.$i;
  }
  static Initialize(e, o) {
  }
  static Clear() {
    var e = UE.KuroLogAnalyzerLibrary.Clear();
    Log_1.Log.CheckInfo() &&
      Log_1.Log.Info("Log", 3, "LogAnalyzer.Clear", ["结果", e]);
  }
  static K8() {
  }
  static Q8() {
  }
  static A5(r, a, L, n, g, A, l, t, _, y) {
  }
  static e9(e, o) {
  }
}
(exports.LogAnalyzer = LogAnalyzer),
  ((_a = LogAnalyzer).Y8 = new Array()),
  (LogAnalyzer.t9 = new Map()),
  (LogAnalyzer.i9 = new Map()),
  (LogAnalyzer.J8 = new Array()),
  (LogAnalyzer.o9 = new Map()),
  (LogAnalyzer.z8 = void 0),
  (LogAnalyzer.r9 = void 0),
  (LogAnalyzer.Zm = 0),
  (LogAnalyzer.s9 = new Map()),
  (LogAnalyzer.j8 = 0),
  (LogAnalyzer.W8 = void 0),
  (LogAnalyzer.$i = void 0),
  (LogAnalyzer.Z8 = Stats_1.Stat.Create("LogAnalyzer.Statistics")),
  (LogAnalyzer.n9 = Stats_1.Stat.Create("LogAnalyzer.Report")),
  (LogAnalyzer.a9 = Stats_1.Stat.Create("LogAnalyzer.Count")),
  (LogAnalyzer.h9 = Stats_1.Stat.Create("LogAnalyzer.Track")),
  (LogAnalyzer.t6 = (e, o, r, a, L, n, g) => {
    _a.A5(!0, e, o, r, a, void 0, L, n, g);
  }),
  (LogAnalyzer.X8 = (e, o, r, a) => {
    let L = 2;
    switch (o) {
      case 1:
      case 2:
        L = 0;
        break;
      case 3:
        L = 1;
        break;
      default:
        return;
    }
    LogAnalyzer.A5(
      !1,
      Log_1.Log.GenLogId(),
      L,
      "Engine",
      0,
      r,
      a,
      void 0,
      void 0,
      e,
    );
  });
//# sourceMappingURL=LogAnalyzer.js.map
