"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.BulletCollisionUtil = void 0);
const UE = require("ue"),
  Log_1 = require("../../../../Core/Common/Log"),
  Stats_1 = require("../../../../Core/Common/Stats"),
  Queue_1 = require("../../../../Core/Container/Queue"),
  RegisterComponent_1 = require("../../../../Core/Entity/RegisterComponent"),
  Transform_1 = require("../../../../Core/Utils/Math/Transform"),
  Vector_1 = require("../../../../Core/Utils/Math/Vector"),
  MathUtils_1 = require("../../../../Core/Utils/MathUtils"),
  EffectSystem_1 = require("../../../Effect/EffectSystem"),
  GlobalData_1 = require("../../../GlobalData"),
  ModelManager_1 = require("../../../Manager/ModelManager"),
  ColorUtils_1 = require("../../../Utils/ColorUtils"),
  CharacterHitComponent_1 = require("../../Character/Common/Component/CharacterHitComponent"),
  BulletConstant_1 = require("../BulletConstant"),
  BulletUtil_1 = require("../BulletUtil"),
  BulletPool_1 = require("../Model/BulletPool"),
  BulletStaticFunction_1 = require("./BulletStaticFunction");
class BulletCollisionUtil {
  static UpdateCollisionExtend(t, l, o, e, i) {
    switch (t) {
      case 0:
        l.SetBoxExtent(o.ToUeVector(), !0);
        break;
      case 1:
        l.SetSphereRadius(o.X, !0);
        break;
      case 2:
        var a = this.GetSectorExtent(o, e),
          s = l,
          r = BulletPool_1.BulletPool.CreateVector();
        i.Quaternion().RotateVector(BulletCollisionUtil.eHo, r),
          s.K2_SetRelativeLocation(r.ToUeVector(), !1, void 0, !0),
          BulletPool_1.BulletPool.RecycleVector(r),
          s.SetBoxExtent(a.ToUeVector(), !0);
        break;
      case 3:
        l.SetBoxExtent(new UE.Vector(o.X, o.X, o.Z), !0);
    }
  }
  static UpdateRegionExtend(t, l, o) {
    switch (t) {
      case 6:
        l.BoxExtent = o.ToUeVector();
        break;
      case 7:
        l.Radius = o.X;
        break;
      case 8:
        (l.Radius = o.X), (l.HalfHeight = o.Z), (l.Angle = o.Y);
        break;
      case 9:
        (l.Radius = o.X), (l.HalfHeight = o.Z);
    }
  }
  static GetSectorExtent(t, l) {
    BulletCollisionUtil.eHo.FromUeVector(l);
    var o,
      l = Vector_1.Vector.Create();
    return (
      t.Y < 180
        ? ((BulletCollisionUtil.eHo.X += 0.5 * t.X),
          l.Set(
            0.5 * t.X,
            Math.sin(0.5 * t.Y * MathUtils_1.MathUtils.DegToRad) * t.X,
            t.Z,
          ))
        : ((o = Math.cos(0.5 * t.Y * MathUtils_1.MathUtils.DegToRad)),
          (BulletCollisionUtil.eHo.X += t.X * (1 + o) * 0.5),
          l.Set(t.X * (1 - o) * 0.5, t.X, t.Z)),
      l
    );
  }
  static ShowBulletDeBugDraw(t) {
    var l, o, e, i, a, s, r;
    UE.KismetSystemLibrary.DrawDebugSphere(
      GlobalData_1.GlobalData.GameInstance,
      t.ActorComponent.ActorLocation,
      10,
      void 0,
      ColorUtils_1.ColorUtils.LinearRed,
    ),
      t.Size.IsZero() ||
        ((l = t.BulletDataMain.Base.Shape),
        (e = t.CollisionInfo.CollisionComponent),
        3 === l
          ? ((s = e.BoundsScale),
            BulletStaticFunction_1.BulletStaticFunction.DebugDrawRing(
              t.Size.Z * s,
              s * t.Size.Y,
              t.Size.X * s,
              t.CenterLocation,
            ),
            t.BulletDataMain?.Base.DebugShowProgress &&
              ((o = BulletPool_1.BulletPool.CreateVector()).FromUeVector(
                t.CenterLocation,
              ),
              (o.Z -= t.Size.Z * s),
              (r = t.LiveTime * MathUtils_1.MathUtils.MillisecondToSecond),
              (s = MathUtils_1.MathUtils.Lerp(
                s * t.Size.Y,
                t.Size.X * s,
                r / t.BulletDataMain.Base.Duration,
              )),
              UE.KismetSystemLibrary.DrawDebugCircle(
                GlobalData_1.GlobalData.GameInstance,
                o.ToUeVector(),
                s,
                36,
                ColorUtils_1.ColorUtils.LinearRed,
                t.BulletDataMain.Base.Duration - r,
                3,
                t.Actor?.GetActorRightVector(),
                t.Actor?.GetActorForwardVector(),
                !1,
              ),
              BulletPool_1.BulletPool.RecycleVector(o)))
          : 2 === l
            ? ((s = e.BoundsScale),
              (r = BulletPool_1.BulletPool.CreateRotator()).FromUeRotator(
                t.CollisionRotator,
              ),
              BulletStaticFunction_1.BulletStaticFunction.DebugDrawSector(
                t.Size.Z * s,
                t.Size.X * s,
                t.Size.Y,
                r.Quaternion(),
                t.CenterLocation,
              ),
              t.BulletDataMain?.Base.DebugShowProgress &&
                ((o = t.LiveTime * MathUtils_1.MathUtils.MillisecondToSecond),
                (a = MathUtils_1.MathUtils.Lerp(
                  0,
                  t.Size.Y,
                  o / t.BulletDataMain.Base.Duration,
                )),
                (i = BulletPool_1.BulletPool.CreateVector()).FromUeVector(
                  t.CenterLocation,
                ),
                (i.Z -= t.Size.Z * s),
                BulletStaticFunction_1.BulletStaticFunction.DebugDrawSector(
                  1,
                  t.Size.X * s,
                  a,
                  r.Quaternion(),
                  i,
                  ColorUtils_1.ColorUtils.LinearRed,
                  t.BulletDataMain.Base.Duration - o,
                ),
                BulletPool_1.BulletPool.RecycleVector(i)),
              BulletPool_1.BulletPool.RecycleRotator(r))
            : 0 === l
              ? ((s = e.BoundsScale),
                (a = BulletPool_1.BulletPool.CreateVector()).FromUeVector(
                  e.BoxExtent,
                ),
                a.MultiplyEqual(s),
                UE.KismetSystemLibrary.DrawDebugBox(
                  GlobalData_1.GlobalData.GameInstance,
                  e.K2_GetComponentLocation(),
                  a.ToUeVector(),
                  ColorUtils_1.ColorUtils.LinearYellow,
                  e.K2_GetComponentRotation(),
                  0,
                  1,
                ),
                t.BulletDataMain?.Base.DebugShowProgress &&
                  ((o = BulletPool_1.BulletPool.CreateVector()),
                  (i = t.LiveTime * MathUtils_1.MathUtils.MillisecondToSecond),
                  Vector_1.Vector.Lerp(
                    Vector_1.Vector.ZeroVectorProxy,
                    a,
                    i / t.BulletDataMain.Base.Duration,
                    o,
                  ),
                  (o.Z = 4),
                  (r = BulletPool_1.BulletPool.CreateVector()).FromUeVector(
                    e.K2_GetComponentLocation(),
                  ),
                  (r.Z -= a.Z + 2),
                  UE.KismetSystemLibrary.DrawDebugBox(
                    GlobalData_1.GlobalData.GameInstance,
                    r.ToUeVector(),
                    o.ToUeVector(),
                    ColorUtils_1.ColorUtils.LinearRed,
                    e.K2_GetComponentRotation(),
                    t.BulletDataMain.Base.Duration - i,
                    2,
                  ),
                  BulletPool_1.BulletPool.RecycleVector(o),
                  BulletPool_1.BulletPool.RecycleVector(r)),
                BulletPool_1.BulletPool.RecycleVector(a))
              : 1 === l
                ? ((s = e.GetScaledSphereRadius()),
                  (i = BulletPool_1.BulletPool.CreateVector()).FromUeVector(
                    e.K2_GetComponentLocation(),
                  ),
                  UE.KismetSystemLibrary.DrawDebugSphere(
                    GlobalData_1.GlobalData.GameInstance,
                    i.ToUeVector(),
                    s,
                    void 0,
                    ColorUtils_1.ColorUtils.LinearGreen,
                  ),
                  t.BulletDataMain?.Base.DebugShowProgress &&
                    ((o =
                      t.LiveTime * MathUtils_1.MathUtils.MillisecondToSecond),
                    (r = MathUtils_1.MathUtils.Lerp(
                      0,
                      s,
                      o / t.BulletDataMain.Base.Duration,
                    )),
                    UE.KismetSystemLibrary.DrawDebugCircle(
                      GlobalData_1.GlobalData.GameInstance,
                      i.ToUeVector(),
                      r,
                      36,
                      ColorUtils_1.ColorUtils.LinearRed,
                      t.BulletDataMain.Base.Duration - o,
                      3,
                      t.Actor?.GetActorRightVector(),
                      t.Actor?.GetActorForwardVector(),
                      !1,
                    )),
                  BulletPool_1.BulletPool.RecycleVector(i))
                : 6 === l
                  ? ((a = t.CollisionInfo.RegionComponent),
                    (e = BulletPool_1.BulletPool.CreateVector()).FromUeVector(
                      a.BoxExtent,
                    ),
                    UE.KismetSystemLibrary.DrawDebugBox(
                      GlobalData_1.GlobalData.GameInstance,
                      a.K2_GetComponentLocation(),
                      e.ToUeVector(),
                      ColorUtils_1.ColorUtils.LinearYellow,
                      a.K2_GetComponentRotation(),
                      0,
                      1,
                    ),
                    t.BulletDataMain?.Base.DebugShowProgress &&
                      ((s = BulletPool_1.BulletPool.CreateVector()),
                      (r =
                        t.LiveTime * MathUtils_1.MathUtils.MillisecondToSecond),
                      Vector_1.Vector.Lerp(
                        Vector_1.Vector.ZeroVectorProxy,
                        e,
                        r / t.BulletDataMain.Base.Duration,
                        s,
                      ),
                      (s.Z = 4),
                      (o = BulletPool_1.BulletPool.CreateVector()).FromUeVector(
                        a.K2_GetComponentLocation(),
                      ),
                      (o.Z -= e.Z + 2),
                      UE.KismetSystemLibrary.DrawDebugBox(
                        GlobalData_1.GlobalData.GameInstance,
                        o.ToUeVector(),
                        s.ToUeVector(),
                        ColorUtils_1.ColorUtils.LinearRed,
                        a.K2_GetComponentRotation(),
                        t.BulletDataMain.Base.Duration - r,
                        2,
                      ),
                      BulletPool_1.BulletPool.RecycleVector(s),
                      BulletPool_1.BulletPool.RecycleVector(o)),
                    BulletPool_1.BulletPool.RecycleVector(e))
                  : 7 === l
                    ? ((i = t.Size.X),
                      (a = t.ActorComponent.ActorLocation),
                      UE.KismetSystemLibrary.DrawDebugSphere(
                        GlobalData_1.GlobalData.GameInstance,
                        a,
                        i,
                        void 0,
                        ColorUtils_1.ColorUtils.LinearGreen,
                      ),
                      t.BulletDataMain?.Base.DebugShowProgress &&
                        ((r =
                          t.LiveTime *
                          MathUtils_1.MathUtils.MillisecondToSecond),
                        (s = MathUtils_1.MathUtils.Lerp(
                          0,
                          i,
                          r / t.BulletDataMain.Base.Duration,
                        )),
                        UE.KismetSystemLibrary.DrawDebugCircle(
                          GlobalData_1.GlobalData.GameInstance,
                          a,
                          s,
                          36,
                          ColorUtils_1.ColorUtils.LinearRed,
                          t.BulletDataMain.Base.Duration - r,
                          3,
                          t.Actor?.GetActorRightVector(),
                          t.Actor?.GetActorForwardVector(),
                          !1,
                        )))
                    : 8 === l
                      ? ((o = t.CollisionInfo.RegionComponent),
                        (e =
                          BulletPool_1.BulletPool.CreateRotator()).FromUeRotator(
                          t.CollisionRotator,
                        ),
                        BulletStaticFunction_1.BulletStaticFunction.DebugDrawSector(
                          o.HalfHeight,
                          o.Radius,
                          o.Angle,
                          e.Quaternion(),
                          t.CenterLocation,
                        ),
                        t.BulletDataMain?.Base.DebugShowProgress &&
                          ((i =
                            t.LiveTime *
                            MathUtils_1.MathUtils.MillisecondToSecond),
                          (a = MathUtils_1.MathUtils.Lerp(
                            0,
                            t.Size.Y,
                            i / t.BulletDataMain.Base.Duration,
                          )),
                          (s =
                            BulletPool_1.BulletPool.CreateVector()).FromUeVector(
                            t.CenterLocation,
                          ),
                          (s.Z -= o.HalfHeight),
                          BulletStaticFunction_1.BulletStaticFunction.DebugDrawSector(
                            1,
                            o.Radius,
                            a,
                            e.Quaternion(),
                            s,
                            ColorUtils_1.ColorUtils.LinearRed,
                            t.BulletDataMain.Base.Duration - i,
                          ),
                          BulletPool_1.BulletPool.RecycleVector(s)),
                        BulletPool_1.BulletPool.RecycleRotator(e))
                      : 9 === l &&
                        ((r = t.CollisionInfo.RegionComponent),
                        BulletStaticFunction_1.BulletStaticFunction.DebugDrawRingWithRotation(
                          r.HalfHeight,
                          0,
                          r.Radius,
                          t.CenterLocation,
                          t.ActorComponent.ActorQuat,
                        )));
  }
  static EntityLeave(t, l) {
    var o = l.EntityHandle;
    if (o?.Valid) {
      const a = o.Entity;
      if (1 === l.Type) {
        var e,
          o = t.CollisionInfo,
          i = o.CharacterEntityMap.get(a);
        void 0 === i ||
          ((e = a.GetComponent(3)) &&
            (this.tHo(t, a, e.IsRoleAndCtrlByMe), 0 < i) &&
            a.GetComponent(110)?.RemoveTimeScale(i),
          o.CharacterEntityMap.delete(a),
          t.BulletDataMain.Base.Interval <= 0 &&
            o.ObjectsHitCurrent.delete(a.Id),
          o.CharacterEntityMap.size) ||
          (o.HaveCharacterInBullet = !1);
      } else if (2 === l.Type) {
        const a = ModelManager_1.ModelManager.BulletModel.GetBulletEntityById(
          l.BulletEntityId,
        );
        a &&
          void 0 !== (i = (e = t.CollisionInfo).BulletEntityMap.get(a)) &&
          (0 < i && BulletUtil_1.BulletUtil.RemoveTimeScale(t, i),
          e.BulletEntityMap.delete(a));
      }
    }
  }
  static tHo(t, l, o) {
    (o = l.GetComponent(0)?.IsRole() && !o), (t = t.BulletDataMain);
    if (!o && t.Execution.GeIdApplyToVictim) {
      var e = l.GetComponent(160);
      if (e)
        for (const i of t.Execution.GeIdApplyToVictim)
          e.RemoveBuff(
            i,
            -1,
            "BulletCollisionUtil.CharacterLeaveBulletUseBuff",
          );
    }
  }
  static GetHitEffects(l, o, e, i, a, s, r, _) {
    if ((BulletCollisionUtil.dSa.clear(), a)) {
      if (!_?.HasTag(-1728163740)) {
        a = r?.GetHitEffectReplaced();
        let t = void 0;
        if (l.IsPartHit && i) {
          l = l.GetPartHitConf(i);
          if (l) {
            var u = l.ReplaceBulletHitEffect;
            t = l.Effect.ToAssetPathName();
            r = r?.GetHitEffectReplacedIgnoreBones()?.has(i) ?? !1;
            if (
              ((t = BulletCollisionUtil.Dha(
                t,
                a?.受击特效.ToAssetPathName(),
                r,
              )) && BulletCollisionUtil.dSa.set(t, !1),
              s &&
                ((t = l.Audio.ToAssetPathName()),
                (t = BulletCollisionUtil.Dha(
                  t,
                  a?.受击音效.ToAssetPathName(),
                  r,
                ))) &&
                BulletCollisionUtil.dSa.set(t, !1),
              u)
            )
              return BulletCollisionUtil.dSa;
          }
        }
        (t = BulletCollisionUtil.Iza(o, e, _)),
          (t = BulletCollisionUtil.Aha(t, a?.命中特效.ToAssetPathName())) &&
            BulletCollisionUtil.dSa.set(t, !0);
      }
    } else {
      const t = BulletCollisionUtil.Iza(o, e, _);
      t && 0 < t.length && "None" !== t && BulletCollisionUtil.dSa.set(t, !0);
    }
    return BulletCollisionUtil.dSa;
  }
  static Iza(t, l, o) {
    var e = t.EffectOnHit.get(9);
    return e && 0 < e.length && o?.HasTag(501201e3)
      ? e
      : t.EffectOnHit.get(l ? 7 : 4);
  }
  static Aha(t, l) {
    if (t && 0 < t.length && "None" !== t)
      return l && 0 < l.length && "None" !== l ? l : t;
  }
  static Dha(t, l, o) {
    return !o && l && 0 < l.length && "None" !== l
      ? l
      : t && 0 < t.length && "None" !== t
        ? t
        : void 0;
  }
  static PlayHitEffect(l, e, i, a, s, r, _) {
    return;
    var u = l.BulletDataMain,
      n = u.Render,
      u = 0 < u.Base.DamageId,
      t = e.Entity.GetComponent(190),
      e = BulletCollisionUtil.GetHitEffects(
        e,
        n,
        a,
        i,
        u,
        l.BulletDataMain.Base.EnablePartHitAudio,
        _,
        t,
      );
    if (0 < e.size) {
      a = n.EffectOnHitConf.get(0);
      let t = void 0;
      (t = a
        ? (a.EnableHighLimit &&
            ((i = l.GetActorLocation().Z),
            (u = a.HighLimit),
            (s.Z = MathUtils_1.MathUtils.Clamp(s.Z, i + u.X, i + u.Y))),
          a.Scale)
        : Vector_1.Vector.OneVectorProxy),
        BulletCollisionUtil.oHo.Set(s, r.Quaternion(), t),
        BulletCollisionUtil.rHo.Start();
      var c = l.Attacker?.GetComponent(53)?.HitEffectMap,
        B = l.Attacker?.GetComponent(3),
        _ = l.Attacker?.GetComponent(44);
      let o = !1;
      (0, RegisterComponent_1.isComponentInstance)(_, 174) &&
        (o = "p1" === _.Priority.State);
      var U = BulletStaticFunction_1.HitStaticFunction.CreateEffectContext(
        l.Attacker,
        o,
      );
      const E = n.AudioOnHit;
      var C,
        f,
        h = (t, l) => {
          BulletStaticFunction_1.HitStaticFunction.PlayHitAudio(t, l, E, o);
        };
      for ([C, f] of e) {
        let t = 0,
          l = B?.GetReplaceEffect(C);
        l = l || C;
        var P = c.get(l);
        P &&
        P.Size >= CharacterHitComponent_1.MAX_HIT_EFFECT_COUNT &&
        ((t = P.Pop()), EffectSystem_1.EffectSystem.IsValid(t))
          ? (EffectSystem_1.EffectSystem.ReplayEffect(
              t,
              "ReUseHitEffect",
              BulletCollisionUtil.oHo.ToUeTransform(),
            ),
            P.Push(t),
            f &&
              BulletStaticFunction_1.HitStaticFunction.PlayHitAudio(5, t, E, o))
          : ((t = EffectSystem_1.EffectSystem.SpawnEffect(
              GlobalData_1.GlobalData.World,
              BulletCollisionUtil.oHo.ToUeTransform(),
              l,
              "[BulletCollisionUtil.ProcessHitEffect]",
              U,
              void 0,
              void 0,
              f ? h : void 0,
            )),
            c.has(l) || c.set(l, new Queue_1.Queue()),
            c.get(l).Push(t));
      }
      BulletCollisionUtil.rHo.Stop();
    }
  }
  static PlaySceneItemHitEffect(t, l, o, e) {
    var i = t?.GetComponent(53)?.HitEffectMap;
    let a = 0;
    var s = i.get(l),
      r = t?.GetComponent(44);
    let _ = !1;
    (0, RegisterComponent_1.isComponentInstance)(r, 174) &&
      (_ = "p1" === r.Priority.State),
      s &&
      s.Size >= CharacterHitComponent_1.MAX_HIT_EFFECT_COUNT &&
      ((a = s.Pop()), EffectSystem_1.EffectSystem.IsValid(a))
        ? (EffectSystem_1.EffectSystem.ReplayEffect(a, "ReUseHitEffect", o),
          s.Push(a),
          BulletStaticFunction_1.HitStaticFunction.PlayHitAudio(5, a, e, _))
        : ((r = BulletStaticFunction_1.HitStaticFunction.CreateEffectContext(
            t,
            _,
          )),
          (a = EffectSystem_1.EffectSystem.SpawnEffect(
            GlobalData_1.GlobalData.World,
            o,
            l,
            "[BulletCollisionUtil.ProcessHitEffect]",
            r,
            void 0,
            void 0,
            (t, l) => {
              BulletStaticFunction_1.HitStaticFunction.PlayHitAudio(t, l, e, _);
            },
          )),
          i.has(l) || i.set(l, new Queue_1.Queue()),
          i.get(l).Push(a));
  }
  static CalcPartDistance(t, l) {
    var o = BulletPool_1.BulletPool.CreateVector(),
      t =
        (o.FromUeVector(t.K2_GetComponentLocation()),
        BulletPool_1.BulletPool.CreateVector()),
      l =
        (o.Subtraction(l.CenterLocation, t),
        t.Normalize(),
        Vector_1.Vector.DistSquared(o, l.GetActorLocation()));
    return (
      BulletPool_1.BulletPool.RecycleVector(o),
      BulletPool_1.BulletPool.RecycleVector(t),
      l
    );
  }
  static GetImpactPointCharacter(t, l, o) {
    var e, i, a, s;
    t instanceof UE.CapsuleComponent
      ? ((e = l.GetActorLocation()),
        o.FromUeVector(t.GetUpVector()),
        this.nHo.FromUeVector(t.K2_GetComponentLocation()),
        e.Subtraction(this.nHo, this.sHo),
        (s = Vector_1.Vector.DotProduct(this.sHo, o)),
        (i = Math.sign(s)),
        (a = Math.abs(s)),
        (s = Math.min(t.CapsuleHalfHeight, a) * i),
        o.MultiplyEqual(s),
        o.AdditionEqual(this.nHo),
        ModelManager_1.ModelManager.BulletModel.ShowBulletCollision(
          l.Attacker.Id,
        ) &&
          UE.KismetSystemLibrary.DrawDebugSphere(
            GlobalData_1.GlobalData.World,
            o.ToUeVector(),
            4,
            8,
            ColorUtils_1.ColorUtils.LinearBlue,
            2,
            3,
          ),
        e.Subtraction(o, this.aHo),
        this.aHo.Normalize(),
        this.aHo.MultiplyEqual(t.CapsuleRadius),
        o.AdditionEqual(this.aHo),
        ModelManager_1.ModelManager.BulletModel.ShowBulletCollision(
          l.Attacker.Id,
        ) &&
          UE.KismetSystemLibrary.DrawDebugSphere(
            GlobalData_1.GlobalData.World,
            o.ToUeVector(),
            4,
            8,
            ColorUtils_1.ColorUtils.LinearYellow,
            2,
            3,
          ),
        BulletConstant_1.BulletConstant.OpenHitActorLog &&
          Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug(
            "Bullet",
            21,
            "命中特效 碰撞点 角色",
            ["boneName", t.GetName()],
            ["bulletRowName", l.BulletRowName],
          ))
      : t instanceof UE.BoxComponent
        ? BulletCollisionUtil.GetHitPointBoxComp(t, l, o)
        : (Log_1.Log.CheckWarn() &&
            Log_1.Log.Warn(
              "Bullet",
              21,
              "击中了其它形状组件作为部位碰撞体",
              ["boneName", t?.GetName()],
              ["actorName", t?.GetOwner().GetName()],
            ),
          o.FromUeVector(l.GetActorLocation()));
  }
  static GetHitPointBoxComp(t, l, o, e) {
    this.hHo.Start(), this.lHo.FromUeTransform(t.K2_GetComponentToWorld());
    var e = e ?? l.GetActorLocation(),
      i =
        (this.lHo.InverseTransformPosition(e, this._Ho),
        this.uHo.FromUeVector(this._Ho),
        this.uHo.MultiplyEqual(-1),
        t.BoxExtent),
      a = i.X,
      s = i.Y,
      i = i.Z,
      a = this.cHo(this._Ho, this.uHo, [-a, -s, -i], [a, s, i], this.mHo);
    this.lHo.TransformPosition(this.mHo, o),
      1 !== a &&
        Log_1.Log.CheckWarn() &&
        Log_1.Log.Warn(
          "Bullet",
          21,
          "理论上必须有一个碰撞点才对",
          ["Bullet", l.BulletRowName],
          ["Part", t.GetName()],
          ["Victim", t.GetOwner()?.GetName()],
        ),
      BulletConstant_1.BulletConstant.OpenHitActorLog &&
        Log_1.Log.CheckDebug() &&
        Log_1.Log.Debug(
          "Bullet",
          21,
          "命中特效 碰撞点 角色 Box",
          ["boneName", t.GetName()],
          ["bulletRowName", l.BulletRowName],
          ["outPoint", o],
        ),
      ModelManager_1.ModelManager.BulletModel.ShowBulletCollision(
        l.Attacker.Id,
      ) &&
        (UE.KismetSystemLibrary.DrawDebugSphere(
          GlobalData_1.GlobalData.World,
          o.ToUeVector(),
          4,
          8,
          ColorUtils_1.ColorUtils.LinearYellow,
          2,
          3,
        ),
        UE.KismetSystemLibrary.DrawDebugLine(
          GlobalData_1.GlobalData.World,
          e.ToUeVector(),
          this.lHo.GetLocation().ToUeVector(),
          ColorUtils_1.ColorUtils.LinearBlue,
          2,
          3,
        )),
      this.hHo.Stop();
  }
  static cHo(e, i, a, s, t) {
    let r = 0,
      _ = Number.MAX_VALUE;
    for (let o = 0; o < 3; o++)
      if (Math.abs(i.Tuple[o]) < Number.EPSILON) {
        if (e.Tuple[o] < a[o] || e.Tuple[o] > s[o]) return 0;
      } else {
        var u = 1 / i.Tuple[o];
        let t = (a[o] - e.Tuple[o]) * u,
          l = (s[o] - e.Tuple[o]) * u;
        if (
          (t > l && ((u = t), (t = l), (l = u)),
          t > r && (r = t),
          l > _ && (_ = l),
          r > _)
        )
          return 0;
      }
    return i.Multiply(r, t), t.AdditionEqual(e), 1;
  }
  static GetImpactPointSceneItem(t, l, o) {
    var e = BulletPool_1.BulletPool.CreateVector(),
      i =
        (e.FromUeVector(t.K2_GetComponentLocation()),
        BulletPool_1.BulletPool.CreateVector());
    const a = t.Bounds.SphereRadius;
    if (
      (Math.abs(l.MoveInfo.BulletSpeed) < MathUtils_1.MathUtils.SmallNumber
        ? t.IsA(UE.BoxComponent.StaticClass())
          ? BulletCollisionUtil.GetHitPointBoxComp(
              t,
              l,
              o,
              l.AttackerActorComp.ActorLocationProxy,
            )
          : (l.AttackerActorComp.ActorLocationProxy.Subtraction(e, i),
            i.Normalize(),
            i.MultiplyEqual(a),
            i.Addition(e, o))
        : o.FromUeVector(l.CollisionInfo.LastFramePosition),
      BulletPool_1.BulletPool.RecycleVector(e),
      BulletPool_1.BulletPool.RecycleVector(i),
      BulletConstant_1.BulletConstant.OpenHitActorLog &&
        Log_1.Log.CheckDebug() &&
        Log_1.Log.Debug(
          "Bullet",
          21,
          "命中特效 碰撞点 场景物",
          ["boneName", t.GetName()],
          ["radius", a],
          ["bulletRowName", l.BulletRowName],
        ),
      ModelManager_1.ModelManager.BulletModel.ShowBulletTrace(l.Attacker.Id))
    ) {
      const a = 4;
      UE.KismetSystemLibrary.DrawDebugSphere(
        GlobalData_1.GlobalData.World,
        e.ToUeVector(),
        4,
        8,
        ColorUtils_1.ColorUtils.LinearBlue,
        2,
        3,
      ),
        UE.KismetSystemLibrary.DrawDebugSphere(
          GlobalData_1.GlobalData.World,
          o.ToUeVector(),
          4,
          8,
          ColorUtils_1.ColorUtils.LinearYellow,
          2,
          3,
        );
    }
  }
}
((exports.BulletCollisionUtil = BulletCollisionUtil).eHo =
  Vector_1.Vector.Create()),
  (BulletCollisionUtil.dSa = new Map()),
  (BulletCollisionUtil.rHo = Stats_1.Stat.Create("PlayHitEffect")),
  (BulletCollisionUtil.oHo = Transform_1.Transform.Create()),
  (BulletCollisionUtil.nHo = Vector_1.Vector.Create()),
  (BulletCollisionUtil.sHo = Vector_1.Vector.Create()),
  (BulletCollisionUtil.aHo = Vector_1.Vector.Create()),
  (BulletCollisionUtil.lHo = Transform_1.Transform.Create()),
  (BulletCollisionUtil._Ho = Vector_1.Vector.Create()),
  (BulletCollisionUtil.uHo = Vector_1.Vector.Create()),
  (BulletCollisionUtil.mHo = Vector_1.Vector.Create()),
  (BulletCollisionUtil.hHo = Stats_1.Stat.Create("GetHitPointBoxComp"));
//# sourceMappingURL=BulletCollisionUtil.js.map
