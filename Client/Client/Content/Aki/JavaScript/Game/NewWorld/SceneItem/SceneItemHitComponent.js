"use strict";
var SceneItemHitComponent_1,
  __decorate =
    (this && this.__decorate) ||
    function (t, e, i, n) {
      var s,
        r = arguments.length,
        o =
          r < 3
            ? e
            : null === n
            ? (n = Object.getOwnPropertyDescriptor(e, i))
            : n;
      if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        o = Reflect.decorate(t, e, i, n);
      else
        for (var h = t.length - 1; 0 <= h; h--)
          (s = t[h]) &&
            (o = (r < 3 ? s(o) : 3 < r ? s(e, i, o) : s(e, i)) || o);
      return 3 < r && o && Object.defineProperty(e, i, o), o;
    };
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.SceneItemHitComponent = void 0);
const UE = require("ue"),
  EntityComponent_1 = require("../../../Core/Entity/EntityComponent"),
  EntitySystem_1 = require("../../../Core/Entity/EntitySystem"),
  RegisterComponent_1 = require("../../../Core/Entity/RegisterComponent"),
  Rotator_1 = require("../../../Core/Utils/Math/Rotator"),
  Vector_1 = require("../../../Core/Utils/Math/Vector"),
  StringUtils_1 = require("../../../Core/Utils/StringUtils"),
  IComponent_1 = require("../../../UniverseEditor/Interface/IComponent"),
  EventDefine_1 = require("../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../Common/Event/EventSystem"),
  LevelGamePlayController_1 = require("../../LevelGamePlay/LevelGamePlayController"),
  ConfigManager_1 = require("../../Manager/ConfigManager"),
  ModelManager_1 = require("../../Manager/ModelManager"),
  SceneInteractionManager_1 = require("../../Render/Scene/Interaction/SceneInteractionManager"),
  BulletCollisionUtil_1 = require("../Bullet/BulletStaticMethod/BulletCollisionUtil"),
  BulletUtil_1 = require("../Bullet/BulletUtil"),
  AimPartUtils_1 = require("../Common/AimPartUtils"),
  ModManager_1 = require("../../Manager/ModManager"),
  SceneItemHitUtils_1 = require("./Util/SceneItemHitUtils");
class ComponentHitReg {
  constructor() {
    (this.ComponentHitConditionCheck = []),
      (this.ComponentHitBaseConfig = void 0);
  }
}
let SceneItemHitComponent =
  (SceneItemHitComponent_1 = class SceneItemHitComponent extends (
    EntityComponent_1.EntityComponent
  ) {
    constructor() {
      super(...arguments),
        (this.inn = void 0),
        (this.Hte = void 0),
        (this.Ifn = void 0),
        (this.Tfn = new Array()),
        (this.Lfn = new Map()),
        (this.Dfn = void 0),
        (this.Rfn = void 0),
        (this.Ufn = void 0),
        (this.Afn = Rotator_1.Rotator.Create()),
        (this.w0n = 0),
        (this.AimParts = new Array()),
        (this.Pla = void 0),
        (this.kSa = void 0),
        (this.wla = (t) =>
          SceneItemHitUtils_1.SceneItemHitUtils.CheckHitDataMatchPlayerAttack(
            t
          )),
        (this.Bla = (t) =>
          SceneItemHitUtils_1.SceneItemHitUtils.CheckHitDataMatchFixedBulletId(
            this.Pla,
            t
          ));
    }
    OnStart() {
      (this.inn = this.Entity.GetComponent(182)),
        (this.Ifn = this.Entity.GetComponent(118)),
        (this.Hte = this.Entity.GetComponent(188)),
        (this.w0n = this.Entity.GetComponent(0).GetEntityOnlineInteractType());
      var t = ModelManager_1.ModelManager.CreatureModel.GetCompleteEntityData(
        this.Hte?.CreatureData.GetPbDataId()
      );
      return (
        t &&
          (t = (0, IComponent_1.getComponent)(
            t.ComponentsData,
            "HitComponent"
          )) &&
          (this.kSa = t),
        !0
      );
    }
    OnActivate() {
      if (this.kSa) {
        switch (this.kSa.HitBullet?.Type) {
          case IComponent_1.EHitBulletType.PlayerAttack:
            this.AddHitCondition(this.wla);
            break;
          case IComponent_1.EHitBulletType.FixedBulletId:
            (this.Pla = this.kSa.HitBullet), this.AddHitCondition(this.Bla);
        }
        if (this.kSa.AimParts && this.Hte)
          for (const e of this.kSa.AimParts) {
            var t = new AimPartUtils_1.AimPart(this.Hte);
            t.InitSceneItem(e), this.AimParts.push(t);
          }
        this.kSa?.AttackerHitTimeScaleRatio &&
          (this.Dfn = this.kSa.AttackerHitTimeScaleRatio),
          this.kSa?.VictimHitTimeScaleRatio &&
            (this.Rfn = this.kSa.VictimHitTimeScaleRatio);
      }
    }
    Pfn(t) {
      if (this.inn.HasTag(-1431780499)) return !1;
      if (this.Ifn?.IsLocked) return !1;
      if (this.Entity.GetComponent(0)?.IsConcealed) return !1;
      let e = !0;
      if (0 < this.Tfn.length)
        for (const i of this.Tfn) if (!(e &&= i(t))) break;
      return e;
    }
    xfn(t, e) {
      t = this.Lfn.get(t)?.ComponentHitConditionCheck;
      if (void 0 === t) return !0;
      let i = !0;
      if (0 < t.length) for (const n of t) if (!(i &&= n(e))) break;
      return i;
    }
    wfn(t, e) {
      t = this.Lfn.get(t)?.ComponentHitBaseConfig?.HitBullet;
      return (
        !t ||
        SceneItemHitUtils_1.SceneItemHitUtils.CheckHitDataMatchBulletType(
          t,
          e,
          this.Entity
        )
      );
    }
    OnSceneItemHitOne(t, e) {
      if (
        (EventSystem_1.EventSystem.EmitWithTarget(
          this.Entity,
          EventDefine_1.EEventName.OnSceneItemEntityHitAlways,
          t
        ),
        !LevelGamePlayController_1.LevelGamePlayController.MultiplayerLimitTypeCheck(
          this.w0n,
          !1
        ))
      )
        return !1;
      var i = EntitySystem_1.EntitySystem.Get(
        t.BulletEntityId
      )?.GetBulletInfo();
      if (i) {
        if (this.Entity.GetComponent(149)?.ReboundBullet(t, i)) return !1;
        if (0 !== t.CalculateType)
          return t.ReBulletData.TimeScale.TimeScaleOnHit && this.Ofn(t), !1;
        if (this.Pfn(t)) {
          this.WVr(t, i.EffectInfo.DisablePostProcess),
            this.Bfn(t, e),
            this.bfn(t),
            this.iwr(t);
          for (var [n] of this.Lfn)
            this.wfn(n, t) && this.xfn(n, t) && this.qfn(n, t);
          EventSystem_1.EventSystem.EmitWithTarget(
            this.Entity,
            EventDefine_1.EEventName.OnSceneItemEntityHit
          ),
            EventSystem_1.EventSystem.Emit(
              EventDefine_1.EEventName.OnAnySceneItemEntityHit,
              this.Entity
            );
        } else this.WVr(t, i.EffectInfo.DisablePostProcess);
      } else this.WVr(t, !1);
      return !0;
    }
    OnSceneItemHit(t, e) {
      if (ModManager_1.ModManager.Settings.HitMultiplier) {
        for (let i = 0; i < ModManager_1.ModManager.Settings.Hitcount; i++) {
          this.OnSceneItemHitOne(t, e);
        }
      } else {
        this.OnSceneItemHitOne(t, e);
      }
    }
    GetPenetrationType() {
      return this.Entity.GetComponent(0).GetBaseInfo().Category
        .BulletPenetrationType;
    }
    WVr(t, e) {
      var i,
        n = t.ReBulletData.Render.EffectOnHit.get(4);
      n &&
        0 !== n.length &&
        ((i = new UE.Transform(
          t.HitEffectRotation.ToUeRotator(),
          t.HitPosition.ToUeVector(),
          Vector_1.Vector.OneVector
        )),
        BulletCollisionUtil_1.BulletCollisionUtil.PlaySceneItemHitEffect(
          t.Attacker,
          n,
          i,
          t.ReBulletData.Render.AudioOnHit,
          e
        ));
    }
    Bfn(e, i) {
      var n = this.Entity.GetComponent(182);
      if (n) {
        var s =
          SceneInteractionManager_1.SceneInteractionManager.Get().GetPartCollisionActorsNum(
            this.Hte.GetSceneInteractionLevelHandleId()
          );
        let t = void 0;
        s && 0 < s
          ? 1 === i.ValidProcessIndex &&
            (t =
              SceneInteractionManager_1.SceneInteractionManager.Get().GetPartCollisionActorTag(
                this.Hte.GetSceneInteractionLevelHandleId(),
                i.Actor
              )?.TagId)
          : ((i = (s = EntitySystem_1.EntitySystem.Get(
              e.BulletEntityId
            ).GetBulletInfo()).BulletDataMain.Base.BeHitEffect),
            (e = ConfigManager_1.ConfigManager.BulletConfig.GetBulletHitData(
              s.Attacker,
              i
            )),
            BulletUtil_1.BulletUtil.GetHitRotator(s, this.Hte, this.Afn),
            (i = BulletUtil_1.BulletUtil.GetOverrideHitAnimByAngle(
              this.Hte,
              e?.被击动作,
              this.Afn.Yaw
            )),
            (t = this.Gfn(i))),
          void 0 !== this.Ufn && (n.RemoveTag(this.Ufn), (this.Ufn = void 0)),
          void 0 !== t && (n.AddTag(t), (this.Ufn = t));
      }
    }
    bfn(t) {
      var e = t.ReBulletData.Base.BeHitEffect,
        e = ConfigManager_1.ConfigManager.BulletConfig.GetBulletHitData(
          t.Attacker,
          e
        );
      e && this.Hte.UpdateHitInfo(t.HitPosition, e.地面受击速度);
    }
    qfn(t, e) {
      t?.Valid &&
        (EventSystem_1.EventSystem.EmitWithTarget(
          t,
          EventDefine_1.EEventName.OnSceneItemHit
        ),
        EventSystem_1.EventSystem.EmitWithTarget(
          t,
          EventDefine_1.EEventName.OnSceneItemHitByHitData,
          e
        ));
    }
    iwr(t) {
      this.Nfn(t), this.Ofn(t);
    }
    Nfn(t) {
      var e,
        i = t.ReBulletData.TimeScale,
        n = i.TimeScaleOnAttack,
        s = this.Dfn?.ValueRatio ?? 1,
        r = this.Dfn?.TimeRatio ?? 1,
        o = this.Dfn?.MaxExtraTime ?? 0;
      i.TimeScaleOnAttackIgnoreAttacker
        ? 0 < n.时间膨胀时长 &&
          ((e = EntitySystem_1.EntitySystem.Get(
            t.BulletEntityId
          ).GetBulletInfo()),
          BulletUtil_1.BulletUtil.SetTimeScale(
            e,
            n.优先级,
            n.时间膨胀值 * s,
            n.时间膨胀变化曲线,
            Math.min(n.时间膨胀时长 * r, n.时间膨胀时长 + o),
            1
          ))
        : 0 < n.时间膨胀时长 &&
          (t.Attacker.GetComponent(110)?.SetTimeScale(
            n.优先级 - 1,
            n.时间膨胀值 * s,
            n.时间膨胀变化曲线,
            Math.min(n.时间膨胀时长 * r, n.时间膨胀时长 + o),
            1
          ),
          (e = i.CharacterCustomKeyTimeScale),
          StringUtils_1.StringUtils.IsEmpty(e) ||
            ((i =
              ModelManager_1.ModelManager.BulletModel.GetEntityIdByCustomKey(
                t.Attacker.Id,
                e,
                t.BulletId.toString()
              )) &&
              EntitySystem_1.EntitySystem.Get(i)
                ?.GetComponent(110)
                ?.SetTimeScale(
                  n.优先级,
                  n.时间膨胀值 * s,
                  n.时间膨胀变化曲线,
                  Math.min(n.时间膨胀时长 * r, n.时间膨胀时长 + o),
                  1
                )));
    }
    Ofn(t) {
      var e, i, n, s, r, o;
      t.ReBulletData.Base.ContinuesCollision ||
        ((e = this.Entity.GetComponent(110)) &&
          ((n = (i = t.ReBulletData.TimeScale).TimeScaleOnHit),
          (s = this.Rfn?.ValueRatio ?? 1),
          (r = this.Rfn?.TimeRatio ?? 1),
          (o = this.Rfn?.MaxExtraTime ?? 0),
          0 < n.时间膨胀时长) &&
          BulletUtil_1.BulletUtil.SetVictimTimeScale(
            t.BulletEntityId,
            this.Entity.Id,
            e,
            n.优先级,
            n.时间膨胀值 * s,
            n.时间膨胀变化曲线,
            Math.min(n.时间膨胀时长 * r, n.时间膨胀时长 + o),
            2,
            i.RemoveHitTimeScaleOnDestroy,
            this.qCl(t)
          ));
    }
    qCl(t) {
      var e;
      return !(
        !this.kSa?.HitBullet ||
        this.kSa.HitBullet.Type !== IComponent_1.EHitBulletType.FixedBulletId ||
        (e = this.kSa.HitBullet.BulletId).length <= 0 ||
        !e.includes(t.BulletId)
      );
    }
    AddHitCondition(t) {
      this.Tfn.push(t);
    }
    RemoveHitCondition(t) {
      t = this.Tfn.indexOf(t);
      -1 !== t && this.Tfn.splice(t, 1);
    }
    RegisterComponent(t, e) {
      var i;
      this.Lfn.has(t) ||
        (((i = new ComponentHitReg()).ComponentHitBaseConfig = e),
        this.Lfn.set(t, i),
        e && (this.kSa = e));
    }
    AddComponentHitCondition(t, e) {
      var i;
      this.Lfn.has(t) || ((i = new ComponentHitReg()), this.Lfn.set(t, i)),
        this.Lfn.get(t).ComponentHitConditionCheck.push(e);
    }
    RemoveComponentHitCondition(t, e) {
      t = this.Lfn.get(t)?.ComponentHitConditionCheck;
      void 0 !== t && -1 !== (e = t.indexOf(e)) && t.splice(e, 1);
    }
    Gfn(t) {
      return SceneItemHitComponent_1.kfn.get(t);
    }
  });
(SceneItemHitComponent.kfn = new Map([
  [8, 631236362],
  [1, -40693742],
  [9, 1688432695],
  [0, 178446985],
  [10, -1474770640],
  [3, -1876401816],
  [11, -350051159],
  [2, -2061161961],
])),
  (SceneItemHitComponent = SceneItemHitComponent_1 =
    __decorate(
      [(0, RegisterComponent_1.RegisterComponent)(141)],
      SceneItemHitComponent
    )),
  (exports.SceneItemHitComponent = SceneItemHitComponent);
//# sourceMappingURL=SceneItemHitComponent.js.map
