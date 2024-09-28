"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: !0 }),
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
  REPORTDATA2TIME = 6e4,
  MINSPEEDINIT = 999999;
class AceAntiCheatController extends ControllerBase_1.ControllerBase {
  static OnInit() {
    return (
      Net_1.Net.Register(20404, AceAntiCheatController.ATa),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.WorldDone,
        this.nye,
      ),
      !0
    );
  }
  static OnClear() {
    return (
      Net_1.Net.UnRegister(20404),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.WorldDone,
        this.nye,
      ),
      !0
    );
  }
  static OnTick(t) {}
  static YNr() {}
  static qTa(t) {}
  static VTa(t) {}
  static QTa(t) {
    (this.RTa = t),
      (this.xTa = 0),
      (this.UTa = 0),
      (this.nun = 0),
      (this.PTa = MINSPEEDINIT);
  }
  static XTa(t) {}
  static tLa(t) {}
  static oLa(t) {}
  static rLa() {}
  static nLa(t, e) {}
  static dLa(t) {}
  static gLa(t) {}
  static fLa(t, e) {}
  static MLa(t) {}
  static SLa(t) {}
  static yLa(t) {}
}
(exports.AceAntiCheatController = AceAntiCheatController),
  ((_a = AceAntiCheatController).GTa = -1n),
  (AceAntiCheatController.iLa = -1n),
  (AceAntiCheatController.CLa = -1n),
  (AceAntiCheatController.pLa = -1n),
  (AceAntiCheatController.ELa = -1n),
  (AceAntiCheatController.ATa = (t) => {}),
  (AceAntiCheatController.OTa = 0),
  (AceAntiCheatController.UTa = 0),
  (AceAntiCheatController.PTa = 0),
  (AceAntiCheatController.nun = 0),
  (AceAntiCheatController.xTa = 0),
  (AceAntiCheatController.RTa = !1),
  (AceAntiCheatController.wTa = !1),
  (AceAntiCheatController.bTa = 0),
  (AceAntiCheatController.sLa = void 0),
  (AceAntiCheatController.BTa = void 0),
  (AceAntiCheatController.lLa = 0),
  (AceAntiCheatController._La = void 0),
  (AceAntiCheatController.qbr = (t, e, o) => {}),
  (AceAntiCheatController.Uie = (t, e, o, i, r) => {}),
  (AceAntiCheatController.LZo = (t, e) => {
    if (_a._La && _a.BTa) {
      var o = _a.BTa.get(_a._La);
      if (o)
        switch (t) {
          case InputEnums_1.EInputAction.攻击:
            o.PLa += 1;
            break;
          case InputEnums_1.EInputAction.闪避:
            o.wLa += 1;
            break;
          case InputEnums_1.EInputAction.跳跃:
            o.BLa += 1;
            break;
          case InputEnums_1.EInputAction.大招:
            o.bLa += 1;
            break;
          case InputEnums_1.EInputAction.幻象2:
            o.qLa += 1;
            break;
          case InputEnums_1.EInputAction.技能1:
            o.GLa += 1;
        }
    }
  }),
  (AceAntiCheatController.xie = (t, e) => {}),
  (AceAntiCheatController.vLa = void 0),
  (AceAntiCheatController.OLa = void 0),
  (AceAntiCheatController.ReportDataRequest = () => {}),
  (AceAntiCheatController.nye = () => {
    _a.OLa ||
      (_a.OLa = TimerSystem_1.TimerSystem.Forever(
        _a.ReportDataRequest,
        REPORTDATA2TIME,
      ));
  });
//# sourceMappingURL=AceAntiCheatController.js.map
