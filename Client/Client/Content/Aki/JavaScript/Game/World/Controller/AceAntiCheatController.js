"use strict";
var _a;
Object.defineProperty(exports, "__esModule", {
  value: !0,
}),
  (exports.AceAntiCheatController = void 0);
const ue_1 = require("ue"),
  Log_1 = require("../../../Core/Common/Log"),
  Time_1 = require("../../../Core/Common/Time"),
  Protocol_1 = require("../../../Core/Define/Net/Protocol"),
  ControllerBase_1 = require("../../../Core/Framework/ControllerBase"),
  Net_1 = require("../../../Core/Net/Net"),
  TimerSystem_1 = require("../../../Core/Timer/TimerSystem"),
  MathUtils_1 = require("../../../Core/Utils/MathUtils"),
  EventDefine_1 = require("../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../Common/Event/EventSystem"),
  TimeUtil_1 = require("../../Common/TimeUtil"),
  Global_1 = require("../../Global"),
  InputEnums_1 = require("../../Input/InputEnums"),
  ModelManager_1 = require("../../Manager/ModelManager"),
  CharacterAttributeTypes_1 = require("../../NewWorld/Character/Common/Component/Abilities/CharacterAttributeTypes"),
  POSTICKTIME = 1e3,
  POSTICKCOUNT = 120,
  REPORTDATA2TIME = 6e4;
class AceAntiCheatController extends ControllerBase_1.ControllerBase {
  static OnInit() {
    return (
      Net_1.Net.Register(13760, AceAntiCheatController.iEa),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.WorldDone,
        this.nye
      ),
      !0
    );
  }
  static OnClear() {
    return (
      Net_1.Net.UnRegister(13760),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.WorldDone,
        this.nye
      ),
      !0
    );
  }
  static OnTick(t) {}
  static YNr() {}
  static _Ea(t) {}
  static gEa(t) {}
  static MEa(t) {
    (this.rEa = t),
      (this.nEa = 0),
      (this.oEa = 0),
      (this.nun = 0),
      (this.sEa = 999999);
  }
  static yEa(t) {}
  static REa(t) {}
  static PEa(t) {}
  static xEa() {}
  static wEa(t, e) {}
  static VEa(t) {}
  static jEa(t) {}
  static WEa(t, e) {}
  static $Ea(t) {}
  static XEa(t) {}
  static JEa(t) {}
}
(exports.AceAntiCheatController = AceAntiCheatController),
  ((_a = AceAntiCheatController).uEa = -1n),
  (AceAntiCheatController.UEa = -1n),
  (AceAntiCheatController.HEa = -1n),
  (AceAntiCheatController.QEa = -1n),
  (AceAntiCheatController.YEa = -1n),
  (AceAntiCheatController.iEa = (t) => {
    var e = MathUtils_1.MathUtils.LongToBigInt(t.mEa);
    switch (t.FEa) {
      case Protocol_1.Aki.Protocol.wwa.Proto_LogType_SecGetReportData2Flow:
        break;
      case Protocol_1.Aki.Protocol.wwa.Proto_LogType_SecFBRoundStartFlow:
        _a._Ea(e);
        break;
      case Protocol_1.Aki.Protocol.wwa.Proto_LogType_SecFBRoundEndFlow:
        _a.yEa(e);
        break;
      case Protocol_1.Aki.Protocol.wwa
        .Proto_LogType_SecRoleFightFlow_BigWorldStart:
        _a.REa(e);
        break;
      case Protocol_1.Aki.Protocol.wwa
        .Proto_LogType_SecRoleFightFlow_BigWorldEnd:
        _a.PEa(e);
        break;
      case Protocol_1.Aki.Protocol.wwa.Proto_LogType_SecRoleFightFlow_InstStart:
        _a.VEa(e);
        break;
      case Protocol_1.Aki.Protocol.wwa.Proto_LogType_SecRoleFightFlow_InstEnd:
        _a.jEa(e);
        break;
      case Protocol_1.Aki.Protocol.wwa.Proto_LogType_SecWorldInfoFlow_Start:
        _a.WEa(e, MathUtils_1.MathUtils.LongToNumber(t.URa));
        break;
      case Protocol_1.Aki.Protocol.wwa.Proto_LogType_SecWorldInfoFlow_End:
        _a.$Ea(e);
        break;
      case Protocol_1.Aki.Protocol.wwa.Proto_LogType_SecWorldStartFlow:
        _a.XEa(e);
        break;
      case Protocol_1.Aki.Protocol.wwa.Proto_LogType_SecWorldSEndFlow:
        _a.JEa(e);
        break;
      default:
        return;
    }
  }),
  (AceAntiCheatController.cEa = 0),
  (AceAntiCheatController.oEa = 0),
  (AceAntiCheatController.sEa = 0),
  (AceAntiCheatController.nun = 0),
  (AceAntiCheatController.nEa = 0),
  (AceAntiCheatController.rEa = !1),
  (AceAntiCheatController.aEa = !1),
  (AceAntiCheatController.lEa = 0),
  (AceAntiCheatController.BEa = void 0),
  (AceAntiCheatController.hEa = void 0),
  (AceAntiCheatController.GEa = 0),
  (AceAntiCheatController.OEa = void 0),
  (AceAntiCheatController.qbr = (t, e, o) => {}),
  (AceAntiCheatController.Uie = (t, e, o, i, r) => {}),
  (AceAntiCheatController.LZo = (t, e) => {
    if (_a.OEa && _a.hEa) {
      var o = _a.hEa.get(_a.OEa);
      if (o)
        switch (t) {
          case InputEnums_1.EInputAction.攻击:
            o.sya += 1;
            break;
          case InputEnums_1.EInputAction.闪避:
            o.aya += 1;
            break;
          case InputEnums_1.EInputAction.跳跃:
            o.hya += 1;
            break;
          case InputEnums_1.EInputAction.大招:
            o.lya += 1;
            break;
          case InputEnums_1.EInputAction.幻象2:
            o._ya += 1;
            break;
          case InputEnums_1.EInputAction.技能1:
            o.uya += 1;
        }
    }
  }),
  (AceAntiCheatController.xie = (t, e) => {
    var o;
    e &&
      _a.hEa &&
      ((e = e.Entity?.GetComponent(0).GetCreatureDataId()) &&
        _a.hEa.get(e) &&
        ((o = MathUtils_1.MathUtils.LongToNumber(_a.hEa.get(e).kEa)),
        (_a.hEa.get(e).kEa = Time_1.Time.WorldTime - _a.GEa + o)),
      (_a.GEa = Time_1.Time.WorldTime),
      (_a.OEa = t.Entity?.GetComponent(0).GetCreatureDataId()));
  }),
  (AceAntiCheatController.KEa = void 0),
  (AceAntiCheatController.cya = void 0),
  (AceAntiCheatController.ReportDataRequest = () => {}),
  (AceAntiCheatController.nye = () => {
    _a.cya ||
      (_a.cya = TimerSystem_1.TimerSystem.Forever(
        _a.ReportDataRequest,
        REPORTDATA2TIME
      ));
  });
//# sourceMappingURL=AceAntiCheatController.js.map
