"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.Stat = void 0);
const cpp_1 = require("cpp"),
  CycleCounter_1 = require("../Performance/CycleCounter"),
  Macro_1 = require("../Preprocessor/Macro"),
  Log_1 = require("./Log"),
  MAX_CALL_DEPTH = 8;
class Stat {
  constructor(t, a = -1, e = !1) {
    (this.ac = 0),
      (this.w7a = ""),
      (this.S9 = -1),
      (this.beh = !1),
      (this.w7a = t),
      (this.S9 = a),
      (this.beh = e);
  }
  static get Enable() {
    return CycleCounter_1.CycleCounter.IsEnabled;
  }
  static Create(t, a = "", e = "") {
    return Stat.qeh(t, !0, a, e);
  }
  static CreateNoFlameGraph(t, a = "", e = "") {
    return Stat.Enable ? Stat.qeh(t, !1, a, e) : Stat.Oeh;
  }
  static qeh(t, a, e = 0, r) {
    return new Stat();
    // if (!t || 0 === t.length)
    //   return (
    //     Log_1.Log.CheckError() &&
    //       Log_1.Log.Error("Stat", 1, "统计创建失败，名字为空"),
    //     Stat.Oeh
    //   );
    // Stat.m6?.Start();
    // let S = t;
    // S.length > CycleCounter_1.STAT_MAX_NAME_LENGTH &&
    //   (Log_1.Log.CheckWarn() &&
    //     Log_1.Log.Warn("Stat", 30, "Stat名字过长", ["name", t]),
    //   (S = t.substring(0, CycleCounter_1.STAT_MAX_NAME_LENGTH)));
    // (t = Stat.Enable ? cpp_1.FKuroCycleCounter.CreateCycleCounter(S) : -1),
    //   (t = new Stat(S, t, a));
    // return Stat.Enable && (t.ac = 2), Stat.m6?.Stop(), t;
  }
  Start() {
  }
  Stop() {
  }
}
((exports.Stat = Stat).EnableCreateWithStack = !0),
  (Stat.T9 = 5),
  (Stat.B7a = 0),
  (Stat.Oeh = new Stat("")),
  (Stat.m6 = Stat.CreateNoFlameGraph("Stat.Create")),
  (Stat.L9 = Stat.Create("Stat.CreateWithStack")),
  (Stat.P8 = Stat.Create("Stat.GetStack")),
  (Stat.Trh = !0),
  (Stat.F8 = (t, a) => a),
  (Stat.V8 = { stack: void 0 }),
  Log_1.Log.InitStat(Stat);
//# sourceMappingURL=Stats.js.map
