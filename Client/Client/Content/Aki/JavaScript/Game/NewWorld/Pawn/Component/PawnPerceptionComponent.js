"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (t, e, i, n) {
    var s,
      h = arguments.length,
      o =
        h < 3
          ? e
          : null === n
            ? (n = Object.getOwnPropertyDescriptor(e, i))
            : n;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
      o = Reflect.decorate(t, e, i, n);
    else
      for (var r = t.length - 1; 0 <= r; r--)
        (s = t[r]) && (o = (h < 3 ? s(o) : 3 < h ? s(e, i, o) : s(e, i)) || o);
    return 3 < h && o && Object.defineProperty(e, i, o), o;
  };
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.PawnPerceptionComponent = void 0);
const cpp_1 = require("cpp"),
  UE = require("ue"),
  Log_1 = require("../../../../Core/Common/Log"),
  EntityComponent_1 = require("../../../../Core/Entity/EntityComponent"),
  RegisterComponent_1 = require("../../../../Core/Entity/RegisterComponent"),
  EventDefine_1 = require("../../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../../Common/Event/EventSystem"),
  ModManager_1 = require("../../../Manager/ModManager"),
  DISTANCE_OFFSET = 100,
  INTERACT_LOGIC_OFFSET = 100;
let PawnPerceptionComponent = class PawnPerceptionComponent extends EntityComponent_1.EntityComponent {
  constructor() {
    super(...arguments),
      (this.Can = void 0),
      (this.vhn = !1),
      (this.Mhn = !1),
      (this.Ehn = !1),
      (this.NearbyEnable = !1),
      (this.Shn = !1),
      (this.yhn = void 0),
      (this.rzr = void 0),
      (this.ConfigId = -0),
      (this.Ihn = void 0),
      (this.Thn = void 0),
      (this.Lhn = void 0),
      (this.vzr = () => {
        this.Shn &&
          ((this.Shn = !1),
          EventSystem_1.EventSystem.Emit(
            EventDefine_1.EEventName.OnLeaveNearbyTrackRange,
            this.Entity,
          ));
      }),
      (this.Rhn = (t) => {
        (this.NearbyEnable = t), (this.Shn = !1);
      });
  }
  get IsInInteractRange() {
    return ModManager_1.ModManager.Settings.PerceptionRange || this.vhn;
  }
  get IsInAdsorbRange() {
    return ModManager_1.ModManager.Settings.PerceptionRange || this.Mhn;
  }
  get IsInSightRange() {
    return ModManager_1.ModManager.Settings.PerceptionRange || this.Ehn;
  }
  SetInteractRange(t, e = 0, i = void 0) {
    this.rzr.SetLogicRange(Math.max(t + INTERACT_LOGIC_OFFSET, e)),
      this.Ihn
        ? this.Ihn.UpdateDistance(t, 0 === e ? t : e)
        : (this.Ihn = this.rzr.CreatePerceptionEvent(
            t,
            this.Entity?.GameBudgetManagedToken,
            () => {
              Log_1.Log.CheckDebug() &&
                Log_1.Log.Debug("Interaction", 37, "进入交互范围", [
                  "EntityId",
                  this.Entity.Id,
                ]),
                (this.vhn = !0);
            },
            () => {
              Log_1.Log.CheckDebug() &&
                Log_1.Log.Debug("Interaction", 37, "离开交互范围", [
                  "EntityId",
                  this.Entity.Id,
                ]),
                (this.vhn = !1);
            },
            void 0,
            void 0,
            e,
            i,
          ));
  }
  SetSightRange(t) {
    this.rzr.SetLogicRange(t),
      this.Thn
        ? this.Thn.UpdateDistance(t)
        : (this.Thn = this.rzr.CreatePerceptionEvent(
            t,
            this.Entity?.GameBudgetManagedToken,
            () => {
              this.Ehn = !0;
            },
            () => {
              this.Ehn = !1;
            },
          ));
  }
  SetGuideRange(t) {
    this.rzr.SetLogicRange(t),
      this.Lhn
        ? this.Lhn.UpdateDistance(t)
        : (this.Lhn = this.rzr.CreatePerceptionEvent(
            t,
            this.Entity?.GameBudgetManagedToken,
            () => {
              EventSystem_1.EventSystem.Emit(
                EventDefine_1.EEventName.OnGuideRangeEnter,
                this.Entity.Id,
              );
            },
          ));
  }
  OnInitData() {
    return (
      (this.yhn = UE.NewMap(UE.BuiltinInt, UE.BuiltinInt)),
      (this.ConfigId = this.Entity.GetComponent(0).GetPbDataId()),
      !0
    );
  }
  OnInit() {
    return (this.rzr = this.Entity.GetComponent(109)), !0;
  }
  OnStart() {
    var t = this.Entity.GetComponent(0),
      e = ((this.Can = this.Entity.GetComponent(1)), this.Can.Owner);
    return UE.KismetSystemLibrary.IsValid(e)
      ? (EventSystem_1.EventSystem.AddWithTarget(
          this.Entity,
          EventDefine_1.EEventName.LeaveLogicRange,
          this.vzr,
        ),
        EventSystem_1.EventSystem.AddWithTarget(
          this.Entity,
          EventDefine_1.EEventName.OnUpdateNearbyEnable,
          this.Rhn,
        ),
        !0)
      : (Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Pawn",
            7,
            "[PawnPerceptionComponent.OnStart] 非法Actor",
            ["PbDataId", t.GetPbDataId()],
          ),
        !1);
  }
  OnActivate() {
    var t,
      e,
      i = this.Entity.GetComponent(147);
    return (
      i &&
        ((t = i.ShowRange),
        (e = i.HideRange),
        (this.NearbyEnable = i.EnableTracking),
        (this.Shn = !1),
        this.rzr.CreatePerceptionEvent(
          t,
          this.Entity?.GameBudgetManagedToken,
          () => {
            (this.Shn = !0),
              EventSystem_1.EventSystem.Emit(
                EventDefine_1.EEventName.OnEnterNearbyTrackRange,
                this.Entity,
              );
          },
          () => {
            (this.Shn = !1),
              EventSystem_1.EventSystem.Emit(
                EventDefine_1.EEventName.OnLeaveNearbyTrackRange,
                this.Entity,
              );
          },
          void 0,
          () => this.NearbyEnable,
          e,
        ),
        this.rzr.SetLogicRange(t),
        this.rzr.SetLogicRange(e + DISTANCE_OFFSET)),
      !0
    );
  }
  OnEnd() {
    return (
      this.Shn &&
        EventSystem_1.EventSystem.Emit(
          EventDefine_1.EEventName.RemoveNearbyTrack,
          this.Entity,
        ),
      EventSystem_1.EventSystem.RemoveWithTarget(
        this.Entity,
        EventDefine_1.EEventName.LeaveLogicRange,
        this.vzr,
      ),
      EventSystem_1.EventSystem.RemoveWithTarget(
        this.Entity,
        EventDefine_1.EEventName.OnUpdateNearbyEnable,
        this.Rhn,
      ),
      (this.Ihn = void 0),
      (this.Thn = void 0),
      (this.Lhn = void 0),
      this.yhn.Empty(),
      !0
    );
  }
  GetDebugString() {
    let t = "";
    return (
      (t += `InteractRangeToken: ${this.Ihn?.EventToken ?? "undefined"}; IsInRangeInternal: ${this.vhn}
InteractRangeInfo:
`),
      this.Ihn &&
        (t += cpp_1.FKuroPerceptionInterface.GetPlayerPerceptionDebugString(
          this.Ihn.EventToken,
        )),
      t
    );
  }
};
(PawnPerceptionComponent = __decorate(
  [(0, RegisterComponent_1.RegisterComponent)(107)],
  PawnPerceptionComponent,
)),
  (exports.PawnPerceptionComponent = PawnPerceptionComponent);
//# sourceMappingURL=PawnPerceptionComponent.js.map
