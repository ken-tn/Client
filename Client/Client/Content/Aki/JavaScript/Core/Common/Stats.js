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
  }
  Start() {
  }
  Stop() {
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
