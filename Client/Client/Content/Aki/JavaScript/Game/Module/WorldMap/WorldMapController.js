"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.WorldMapController = void 0);
const Protocol_1 = require("../../../Core/Define/Net/Protocol"),
  puerts_1 = require("puerts"),
  Net_1 = require("../../../Core/Net/Net"),
  TimerSystem_1 = require("../../../Core/Timer/TimerSystem"),
  Vector2D_1 = require("../../../Core/Utils/Math/Vector2D"),
  EventDefine_1 = require("../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../Common/Event/EventSystem"),
  ConfigManager_1 = require("../../Manager/ConfigManager"),
  ControllerHolder_1 = require("../../Manager/ControllerHolder"),
  ModelManager_1 = require("../../Manager/ModelManager"),
  UiControllerBase_1 = require("../../Ui/Base/UiControllerBase"),
  InputManager_1 = require("../../Ui/Input/InputManager"),
  UiManager_1 = require("../../Ui/UiManager"),
  ConfirmBoxDefine_1 = require("../ConfirmBox/ConfirmBoxDefine"),
  QuestController_1 = require("../QuestNew/Controller/QuestController"),
  ScrollingTipsController_1 = require("../ScrollingTips/ScrollingTipsController"),
  TeleportController_1 = require("../Teleport/TeleportController"),
  WorldMapDefine_1 = require("./WorldMapDefine");
class WorldMapController extends UiControllerBase_1.UiControllerBase {
  static OnInit() {
    return (
      InputManager_1.InputManager.RegisterOpenViewFunc(
        "WorldMapView",
        WorldMapController._ki,
      ),
      !0
    );
  }
  static OnLeaveLevel() {
    return (
      void 0 !== this.l3o &&
        TimerSystem_1.TimerSystem.Has(this.l3o) &&
        TimerSystem_1.TimerSystem.Remove(this.l3o),
      !0
    );
  }
  static OnAddEvents() {
    EventSystem_1.EventSystem.Add(EventDefine_1.EEventName.OpenView, this._3o),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.CloseView,
        this.u3o,
      );
  }
  static OnRemoveEvents() {
    EventSystem_1.EventSystem.Remove(
      EventDefine_1.EEventName.OpenView,
      this._3o,
    ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.CloseView,
        this.u3o,
      );
  }
  static TryTeleport(e, r) {
    var o;
    puerts_1.logger.info("eTryTeleport" + e);
    for (let prop in e){
        puerts_1.logger.info(`${prop}: ${e[prop]}`);
    }
    e.MapId = 900;
    TeleportController_1.TeleportController.CheckCanTeleport()
      ? QuestController_1.QuestNewController.IsTrackItemOutFailRange(e)
        ? ((o = new ConfirmBoxDefine_1.ConfirmBoxDataNew(220)).FunctionMap.set(
            2,
            () => {
              TeleportController_1.TeleportController.SendTeleportTransferRequest(
                e,
              ),
                r?.();
            },
          ),
          ControllerHolder_1.ControllerHolder.ConfirmBoxController.ShowConfirmBoxNew(
            o,
          ))
        : (TeleportController_1.TeleportController.SendTeleportTransferRequest(
            e,
          ),
          r?.())
      : ControllerHolder_1.ControllerHolder.GenericPromptController.ShowPromptByCode(
          "TrialRoleTransmitLimit",
        );
  }
  static MapOpenPush(e) {
    var r = new Protocol_1.Aki.Protocol.fas();
    (r.vjn = e), Net_1.Net.Send(20514, r);
  }
  static OpenView(o, e, r, t) {
    ModelManager_1.ModelManager.WorldMapModel.IsBattleViewOpen = e;
    const n = () => {
      UiManager_1.UiManager.OpenView("WorldMapView", r, (e, r) => {
        e && WorldMapController.MapOpenPush(o),
          (ModelManager_1.ModelManager.WorldMapModel.IsBattleViewOpen = !1),
          t?.(e, r);
      });
    };
    UiManager_1.UiManager.IsViewOpen("WorldMapView") ||
    UiManager_1.UiManager.IsViewHide("WorldMapView")
      ? UiManager_1.UiManager.CloseViewAsync("WorldMapView").then(() => {
          n();
        })
      : n();
  }
  static FocalMarkItem(e, r) {
    var o = ModelManager_1.ModelManager.WorldMapModel,
      t = o.CurrentFocalMarkType,
      n = o.CurrentFocalMarkId;
    (t === e && n === r) ||
      (UiManager_1.UiManager.IsViewShow("ItemTipsView") &&
        UiManager_1.UiManager.CloseView("ItemTipsView")),
      (o.CurrentFocalMarkType = e),
      (o.CurrentFocalMarkId = r),
      UiManager_1.UiManager.IsViewShow("WorldMapView")
        ? EventSystem_1.EventSystem.Emit(
            EventDefine_1.EEventName.OnWorldMapTrackMarkItem,
            e,
            r,
          )
        : ((t = { MarkType: e, MarkId: r, OpenAreaId: 0 }),
          WorldMapController.OpenView(1, !1, t));
  }
  static ClearFocalMarkItem() {
    var e = ModelManager_1.ModelManager.WorldMapModel;
    (e.CurrentFocalMarkType = void 0), (e.CurrentFocalMarkId = void 0);
  }
  static CloseWorldMap() {
    UiManager_1.UiManager.IsViewShow("WorldMapView")
      ? (EventSystem_1.EventSystem.Emit(
          EventDefine_1.EEventName.DestroyAllUiCameraAnimationHandles,
        ),
        EventSystem_1.EventSystem.Emit(
          EventDefine_1.EEventName.ResetToBattleView,
        ))
      : UiManager_1.UiManager.IsViewShow("FunctionView") &&
        UiManager_1.UiManager.CloseView("FunctionView");
  }
  static OnClear() {
    return (
      void 0 !== this.l3o &&
        (TimerSystem_1.TimerSystem.Remove(this.l3o), (this.l3o = void 0)),
      this.iUi.ClearData(),
      !0
    );
  }
  static OnAddOpenViewCheckFunction() {
    UiManager_1.UiManager.AddOpenViewCheckFunction(
      "WorldMapView",
      WorldMapController.iVe,
      "WorldMapController.CanOpenView",
    );
  }
  static OnRemoveOpenViewCheckFunction() {
    UiManager_1.UiManager.RemoveOpenViewCheckFunction(
      "WorldMapView",
      WorldMapController.iVe,
    );
  }
}
(exports.WorldMapController = WorldMapController),
  ((_a = WorldMapController).l3o = void 0),
  (WorldMapController.m3o = void 0),
  (WorldMapController.iUi =
    new WorldMapDefine_1.MarkPriority2HierarchyIndexHelper()),
  (WorldMapController._ki = () => {
    WorldMapController.OpenView(0, !0);
  }),
  (WorldMapController._3o = (e, r) => {
    "FunctionOpenView" === e &&
      (_a.m3o =
        ModelManager_1.ModelManager.FunctionModel?.GetNewOpenFunctionIdList());
  }),
  (WorldMapController.u3o = (r, e) => {
    if ("FunctionOpenView" === r) {
      let e = void 0;
      for (const o of _a.m3o)
        if (
          (e =
            ConfigManager_1.ConfigManager.MapConfig.GetMapMarkFuncTypeConfigByFuncId(
              o,
            ))
        )
          break;
      void 0 !== e &&
        ((r = {
          MarkType: 0,
          MarkId: 0,
          StartWorldPosition: Vector2D_1.Vector2D.Create(
            e.Position.X,
            e.Position.Y,
          ),
          StartScale: e.Scale,
          OpenAreaId: 0,
        }),
        ModelManager_1.ModelManager.LoadingModel.IsLoading ||
          (_a.OpenView(2, !1, r),
          (r = { State: !0, Data: { RelativeType: 1, RelativeSubType: e.Id } }),
          ModelManager_1.ModelManager.MapModel.MapLifeEventListenerTriggerMap?.set(
            0,
            r,
          )));
    }
  }),
  (WorldMapController.iVe = (e) => {
    return ModelManager_1.ModelManager.WorldMapModel.LevelEventDisableFlag
      ? (ControllerHolder_1.ControllerHolder.GenericPromptController.ShowPromptByCode(
          "DisableMapView",
        ),
        !1)
      : ModelManager_1.ModelManager.FunctionModel.IsOpen(10015)
        ? !ModelManager_1.ModelManager.FunctionModel.IsLockByBehaviorTree(
            10015,
          ) ||
          (ScrollingTipsController_1.ScrollingTipsController.ShowTipsById(
            "UnableSystem",
          ),
          !1)
        : (ScrollingTipsController_1.ScrollingTipsController.ShowTipsById(
            "PhantomLock",
          ),
          !1);
  });
//# sourceMappingURL=WorldMapController.js.map
