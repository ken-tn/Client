"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.Stat = void 0);
const cpp_1 = require("cpp"),
  UE = require("ue"),
  CycleCounter_1 = require("../Performance/CycleCounter"),
  Macro_1 = require("../Preprocessor/Macro"),
  Log_1 = require("./Log"),
  MAX_CALL_DEPTH = 10;
class Stat {
  constructor(t, e = -1, a = !1) {
    (this.ac = 0),
      (this.Y7a = ""),
      (this.S9 = -1),
      (this.eza = !1),
      (this.Y7a = t),
      (this.S9 = e),
      (this.eza = a);
  }
  static get Enable() {
    return CycleCounter_1.CycleCounter.IsEnabled;
  }
  static Create(t, e = "", a = "") {
    return Stat.tza(t, !0, e, a);
  }
  static tza(t, e, a = "", r = "") {
    return new Stat();
    // if (!t || 0 === t.length)
    //   return (
    //     Log_1.Log.CheckError() &&
    //       Log_1.Log.Error("Stat", 1, "统计创建失败，名字为空"),
    //     Stat.iza
    //   );
    // Stat.m6?.Start();
    // let S = t;
    // S.length > CycleCounter_1.STAT_MAX_NAME_LENGTH &&
    //   (Log_1.Log.CheckWarn() &&
    //     Log_1.Log.Warn("Stat", 31, "Stat名字过长", ["name", t]),
    //   (S = t.substring(0, CycleCounter_1.STAT_MAX_NAME_LENGTH)));
    // (t = Stat.Enable ? UE.KuroJsStatsLibrary.CreateCycleCounter(S, a, r) : -1),
    //   (a = new Stat(S, t, e));
    // return Stat.Enable && (a.ac = 2), Stat.m6?.Stop(), a;
  }
  Start() {
    // Stat.lJa &&
    //   this.eza &&
    //   Stat.J7a < MAX_CALL_DEPTH &&
    //   cpp_1.FKuroPerfSightHelper.SafePushCall(this.Y7a),
    //   Stat.J7a++,
    //   0 !== this.ac &&
    //     ((this.ac = 1),
    //     UE.KuroJsStatsLibrary.StartCycleCounterByIndex(this.S9),
    //     CycleCounter_1.CycleCounter.CheckStart(this.Y7a));
  }
  Stop() {
    // Stat.J7a--,
    //   Stat.lJa &&
    //     this.eza &&
    //     Stat.J7a < MAX_CALL_DEPTH &&
    //     cpp_1.FKuroPerfSightHelper.SafePopCall(this.Y7a),
    //   0 !== this.ac &&
    //     ((this.ac = 2),
    //     CycleCounter_1.CycleCounter.IsPassedStackCheck(this.Y7a)) &&
    //     UE.KuroJsStatsLibrary.StopCycleCounter();
  }
}
((exports.Stat = Stat).EnableCreateWithStack = !0),
  (Stat.T9 = 5),
  (Stat.J7a = 0),
  (Stat.iza = new Stat("")),
  (Stat.m6 = void 0),
  (Stat.L9 = Stat.Create("Stat.CreateWithStack")),
  (Stat.P8 = Stat.Create("Stat.GetStack")),
  (Stat.lJa = !0),
  (Stat.F8 = (t, e) => e),
  (Stat.V8 = { stack: void 0 }),
  Log_1.Log.InitStat(Stat);
//# sourceMappingURL=Stats.js.map
