"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (e, t, i, r) {
    var a,
      s = arguments.length,
      n =
        s < 3
          ? t
          : null === r
            ? (r = Object.getOwnPropertyDescriptor(t, i))
            : r;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
      n = Reflect.decorate(e, t, i, r);
    else
      for (var o = e.length - 1; 0 <= o; o--)
        (a = e[o]) && (n = (s < 3 ? a(n) : 3 < s ? a(t, i, n) : a(t, i)) || n);
    return 3 < s && n && Object.defineProperty(t, i, n), n;
  };
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.CharacterGameplayCueComponent = void 0);
const RegisterComponent_1 = require("../../../../../../Core/Entity/RegisterComponent"),
  EffectSystem_1 = require("../../../../../Effect/EffectSystem"),
  ModelManager_1 = require("../../../../../Manager/ModelManager"),
  FormationDataController_1 = require("../../../../../Module/Abilities/FormationDataController"),
  PlayerGameplayCueComponent_1 = require("../../../../Player/Component/PlayerGameplayCueComponent"),
  BaseGameplayCueComponent_1 = require("./BaseGameplayCueComponent"),
  GameplayCueController_1 = require("./GameplayCueSFX/Controller/GameplayCueController");
let CharacterGameplayCueComponent = class CharacterGameplayCueComponent extends BaseGameplayCueComponent_1.BaseGameplayCueComponent {
  constructor() {
    super(...arguments),
      (this.u1t = void 0),
      (this.n$t = void 0),
      (this.ybr = void 0),
      (this.wqr = new Set()),
      (this.Mha = new Map()),
      (this.Sha = new Map()),
      (this.Eha = new Map()),
      (this.yha = new Map());
  }
  OnStart() {
    return (
      (this.u1t = this.Entity.CheckGetComponent(0)),
      (this.n$t = this.Entity.CheckGetComponent(3)),
      (this.ybr = this.Entity.CheckGetComponent(110)),
      !0
    );
  }
  OnEnable() {
    this.SetHidden(!1);
  }
  OnDisable() {
    this.SetHidden(!0);
  }
  OnChangeTimeDilation(t) {
    this.wqr.forEach((e) => {
      EffectSystem_1.EffectSystem.IsValid(e)
        ? EffectSystem_1.EffectSystem.SetTimeScale(
            e,
            this.ybr.CurrentTimeScale * t,
          )
        : this.wqr.delete(e);
    });
  }
  GetEntityHandle() {
    return ModelManager_1.ModelManager.CharacterModel.GetHandleByEntity(
      this.Entity,
    );
  }
  AddEffectToSet(e) {
    this.wqr.add(e),
      EffectSystem_1.EffectSystem.AddFinishCallback(e, (e) => {
        this.wqr.delete(e);
      }),
      EffectSystem_1.EffectSystem.SetTimeScale(
        e,
        this.ybr.CurrentTimeScale * this.Entity.TimeDilation,
      ),
      this.Active || EffectSystem_1.EffectSystem.SetEffectHidden(e, !0);
  }
  AddToOtherCueMap(e, t, i) {
    0 !== i.CueConfig.CueType && super.AddToOtherCueMap(e, t, i);
  }
  CreateGameplayCueByBuff(a) {
    return;
    const s = a.Handle;
    this.Eha.has(s) ||
      this.OtherCueMap.has(s) ||
      a.Config.GameplayCueIds?.forEach((t) => {
        var i = GameplayCueController_1.GameplayCueController.GetConfigById(t);
        if (i) {
          var r = a.IsInstantBuff();
          if (this._Ra(a, i.CueType))
            this.pQa() &&
              this.uRa()?.CreatePlayerGameplayCue(t, { Buff: a, Instant: r });
          else {
            let e = this.Mha.get(t);
            (e =
              !e && this.yYs(i, a)
                ? this.CreateGameplayCueInner(t, { Buff: a, Instant: r })
                : e) &&
              !r &&
              (this.Iha(s, t, e), this.AddToOtherCueMap(s, t, e));
          }
        }
      });
  }
  DestroyGameplayCueByBuff(i) {
    const r = i.Handle;
    this.Eha.delete(r),
      i.Config.GameplayCueIds?.forEach((e) => {
        var t = GameplayCueController_1.GameplayCueController.GetConfigById(e);
        t &&
          (this._Ra(i, t.CueType)
            ? this.pQa() && this.uRa()?.DestroyPlayerGameplayCue(r, e)
            : (this.Lha(r, e), this.RemoveFromOtherCueMap(r, e)));
      });
  }
  OnAnyBuffInhibitionChanged(e, t) {
    this.OtherCueMap.get(e)?.forEach((e) => {
      t ? e.Destroy() : e.Create();
    }),
      this.Eha.get(e)?.forEach((e) => {
        var t = this.Sha.get(e),
          t = Array.from(t),
          i = t.every((e) => {
            return this.Skn(e)?.IsActive();
          }),
          t = t.every((e) => {
            return !this.Skn(e)?.IsActive();
          }),
          e = this.Mha.get(e);
        i && !e?.IsActive ? e?.Create() : t && e?.IsActive && e?.Destroy();
      });
  }
  SetHidden(t) {
    for (const e of this.GetAllCurrentCueRef())
      t ? e.OnDisable() : e.OnEnable();
    this.wqr.forEach((e) => {
      EffectSystem_1.EffectSystem.IsValid(e)
        ? EffectSystem_1.EffectSystem.SetEffectHidden(e, t)
        : this.wqr.delete(e);
    });
  }
  Iha(t, i, e) {
    if (0 === e.CueConfig.CueType) {
      this.Mha.set(i, e);
      {
        let e = this.Sha.get(i);
        e || ((e = new Set()), this.Sha.set(i, e)), e.add(t);
      }
      {
        let e = this.Eha.get(t);
        e || ((e = new Set()), this.Eha.set(t, e)), e.add(i);
      }
      0 < e.CueConfig.Group &&
        ((t = this.yha.get(e.CueConfig.Group))
          ? t.CueConfig.Priority <= e.CueConfig.Priority &&
            t !== e &&
            (this.Lha(t.ActiveHandleId, t.CueConfig.Id),
            this.yha.set(e.CueConfig.Group, e))
          : this.yha.set(e.CueConfig.Group, e));
    }
  }
  Lha(e, t) {
    var i,
      r = this.Mha.get(t);
    r &&
      (i = this.Sha.get(t)) &&
      (i.delete(e), i.size <= 0) &&
      (this.Sha.delete(t),
      this.Mha.delete(t),
      0 < r.CueConfig.Group && this.yha.delete(r.CueConfig.Group),
      r.Destroy());
  }
  yYs(e, t) {
    return (
      !!t.IsInstantBuff() ||
      0 !== e.CueType ||
      e.Group <= 0 ||
      !(t = this.yha.get(e.Group)) ||
      t.CueConfig.Priority <= e.Priority
    );
  }
  _Ra(e, t) {
    return (
      5 === e.Config.FormationPolicy &&
      this.n$t.IsAutonomousProxy &&
      PlayerGameplayCueComponent_1.PlayerGameplayCueComponent.IsSupportedCueType(
        t,
      )
    );
  }
  pQa() {
    var e = ModelManager_1.ModelManager.CreatureModel.GetPlayerId();
    return (
      ModelManager_1.ModelManager.SceneTeamModel.GetTeamPlayerData(e)
        ?.GetCurrentGroup()
        ?.GetCurrentRole()?.CreatureDataId === this.u1t?.GetCreatureDataId()
    );
  }
  uRa() {
    return FormationDataController_1.FormationDataController.GetPlayerEntity(
      ModelManager_1.ModelManager.CreatureModel.GetPlayerId(),
    )?.GetComponent(208);
  }
  Skn(e) {
    var t;
    let i = this.GetEntityHandle()
      ?.Entity?.GetComponent(160)
      ?.GetBuffByHandle(e);
    return (
      i ||
        ((t = this.GetEntityHandle()?.Entity?.GetComponent(175)),
        (i = t?.GetFormationBuffComp()?.GetBuffByHandle(e))),
      i
    );
  }
};
(CharacterGameplayCueComponent = __decorate(
  [(0, RegisterComponent_1.RegisterComponent)(19)],
  CharacterGameplayCueComponent,
)),
  (exports.CharacterGameplayCueComponent = CharacterGameplayCueComponent);
//# sourceMappingURL=CharacterGameplayCueComponent.js.map
