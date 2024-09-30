"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.PerfSightController = void 0);
const cpp_1 = require("cpp"),
  UE = require("ue"),
  Info_1 = require("../../Core/Common/Info"),
  Log_1 = require("../../Core/Common/Log"),
  Stats_1 = require("../../Core/Common/Stats"),
  CommonDefine_1 = require("../../Core/Define/CommonDefine"),
  EntitySystem_1 = require("../../Core/Entity/EntitySystem"),
  ControllerBase_1 = require("../../Core/Framework/ControllerBase"),
  PerfSight_1 = require("../../Core/PerfSight/PerfSight"),
  TimerSystem_1 = require("../../Core/Timer/TimerSystem"),
  EventDefine_1 = require("../Common/Event/EventDefine"),
  EventSystem_1 = require("../Common/Event/EventSystem"),
  LocalStorage_1 = require("../Common/LocalStorage"),
  LocalStorageDefine_1 = require("../Common/LocalStorageDefine"),
  Global_1 = require("../Global"),
  ControllerHolder_1 = require("../Manager/ControllerHolder"),
  ModelManager_1 = require("../Manager/ModelManager"),
  BOSS_TYPE = 2;
class PerfSightController extends ControllerBase_1.ControllerBase {
  static OnInit() {
    if (PerfSight_1.PerfSight.IsEnable) {
      var e = UE.KuroLauncherLibrary.GetAppVersion(),
        e =
          e +
          "_" +
          LocalStorage_1.LocalStorage.GetGlobal(
            LocalStorageDefine_1.ELocalStorageGlobalKey.PatchVersion,
            e,
          );
      if (
        (Log_1.Log.CheckInfo() &&
          Log_1.Log.Info("Performance", 55, "当前母包_热更版本号", [
            "version",
            e,
          ]),
        Info_1.Info.IsPcOrGamepadPlatform())
      )
        PerfSight_1.PerfSight.SetPcAppVersion(e);
      else {
        if (!Info_1.Info.IsMobilePlatform()) return !0;
        PerfSight_1.PerfSight.SetVersionIden(e);
      }
    //   cpp_1.FKuroPerfSightHelper.EnableTimedReport(),
    //     PerfSight_1.PerfSight.MarkLevelLoad("BeforeLogin"),
    //     Log_1.Log.CheckInfo() &&
    //       Log_1.Log.Info("Performance", 55, "MarkLevelLoad BeforeLogin"),
    //     PerfSightController.sCe();
    }
    return !0;
  }
  static OnClear() {
    return (
      PerfSight_1.PerfSight.IsEnable &&
        (PerfSight_1.PerfSight.MarkLevelFin(),
        PerfSightController.aCe(),
        PerfSightController.zua(),
        PerfSightController.swa()),
      super.OnClear()
    );
  }
  static swa() {
    if (0 < this.oWe.size) {
      for (const e of this.oWe) this.awa(e, !1);
      this.oWe.clear();
    }
  }
  static Zua() {
    PerfSightController.zua(),
      PerfSightController.eca
        ? Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Performance",
            55,
            "PerfSightController.PositionTimer,请检查",
          )
        : (PerfSightController.eca = TimerSystem_1.RealTimeTimerSystem.Forever(
            PerfSightController.tca,
            CommonDefine_1.MILLIONSECOND_PER_SECOND,
          ));
  }
  static zua() {
    PerfSightController.eca &&
      (TimerSystem_1.RealTimeTimerSystem.Remove(PerfSightController.eca),
      (PerfSightController.eca = void 0));
  }
  static sCe() {
    // EventSystem_1.EventSystem.Add(
    //   EventDefine_1.EEventName.OnGetPlayerBasicInfo,
    //   PerfSightController.Wvi,
    // ),
    //   EventSystem_1.EventSystem.Add(
    //     EventDefine_1.EEventName.OnBattleStateChanged,
    //     PerfSightController.Zpe,
    //   ),
    //   EventSystem_1.EventSystem.Add(
    //     EventDefine_1.EEventName.OnAggroAdd,
    //     this.lWe,
    //   ),
    //   EventSystem_1.EventSystem.Add(
    //     EventDefine_1.EEventName.OnAggroRemoved,
    //     this.cWe,
    //   );
  }
  static aCe() {
    EventSystem_1.EventSystem.Remove(
      EventDefine_1.EEventName.OnGetPlayerBasicInfo,
      PerfSightController.Wvi,
    ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.OnBattleStateChanged,
        PerfSightController.Zpe,
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.OnAggroAdd,
        this.lWe,
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.OnAggroRemoved,
        this.cWe,
      );
  }
  static StartPersistentOrDungeon() {
    var e;
    PerfSight_1.PerfSight.MarkLevelFin(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info("Performance", 55, "MarkLevelFin"),
      ControllerHolder_1.ControllerHolder.GameModeController.IsInInstance()
        ? ((e =
            "Dungeon_" +
            ModelManager_1.ModelManager.CreatureModel.GetInstanceId()),
          Log_1.Log.CheckInfo() &&
            Log_1.Log.Info("Performance", 55, "开始录制MarkLevelLoad", [
              "tagName",
              e,
            ]),
          PerfSight_1.PerfSight.MarkLevelLoad(e))
        : (Log_1.Log.CheckInfo() &&
            Log_1.Log.Info(
              "Performance",
              55,
              "开始录制MarkLevelLoad Persistent",
            ),
          PerfSight_1.PerfSight.MarkLevelLoad("Persistent"));
  }
  static MarkLevelLoadCompleted() {
    Log_1.Log.CheckInfo() &&
      Log_1.Log.Info("Performance", 55, "MarkLevelLoadCompleted"),
      PerfSight_1.PerfSight.MarkLevelLoadCompleted();
  }
  static awa(e, r) {
    var t,
      o = EntitySystem_1.EntitySystem.Get(e);
    o &&
      (o = o.GetComponent(3)?.CreatureData) &&
      (t = o.GetBaseInfo()) &&
      t.Category.MonsterMatchType >= BOSS_TYPE &&
      (r
        ? (cpp_1.FKuroPerfSightHelper.BeginExtTag(
            `Battle_${o.GetModelConfig().描述}_` + o.GetPbDataId(),
          ),
          this.oWe.add(e))
        : (cpp_1.FKuroPerfSightHelper.EndExtTag(
            `Battle_${o.GetModelConfig().描述}_` + o.GetPbDataId(),
          ),
          this.oWe.delete(e)));
  }
  static OnTick(e) {
    // PerfSight_1.PerfSight.IsEnable &&
    //   (PerfSightController.MJ.Start(),
    //   cpp_1.FKuroPerfSightHelper.PostFrame(e),
    //   PerfSightController.MJ.Stop());
  }
}
(exports.PerfSightController = PerfSightController),
  ((_a = PerfSightController).IsTickEvenPausedInternal = !0),
  (PerfSightController.eca = void 0),
  (PerfSightController.IsEnable = !0),
  (PerfSightController.oWe = new Set()),
  (PerfSightController.MJ = void 0),
  (PerfSightController.tca = () => {
    // var e =
    //   Global_1.Global.BaseCharacter?.CharacterActorComponent
    //     ?.ActorLocationProxy;
    // e &&
    //   cpp_1.FKuroPerfSightHelper.PostValueFloat3(
    //     "PositionAnalysis",
    //     "position",
    //     e.X,
    //     e.Y,
    //     e.Z,
    //   );
  }),
  (PerfSightController.Wvi = () => {
    // var e = ModelManager_1.ModelManager.FunctionModel.PlayerId.toString();
    // PerfSight_1.PerfSight.SetUserId(e),
    //   Log_1.Log.CheckInfo() &&
    //     Log_1.Log.Info("Performance", 55, "SetUserId", ["playerId", e]),
    //   PerfSightController.Zua();
  }),
  (PerfSightController.Zpe = (e) => {
    e
      ? cpp_1.FKuroPerfSightHelper.BeginExtTag("Battle")
      : (cpp_1.FKuroPerfSightHelper.EndExtTag("Battle"), _a.swa());
  }),
  (PerfSightController.lWe = (e) => {
    for (const r of e) _a.awa(r, !0);
  }),
  (PerfSightController.cWe = (e) => {
    for (const r of e) _a.awa(r, !1);
  });
//# sourceMappingURL=PerfSightController.js.map
