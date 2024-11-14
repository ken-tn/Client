"use strict";
var CharacterHitComponent_1,
  __decorate =
    (this && this.__decorate) ||
    function (t, i, e, s) {
      var h,
        r = arguments.length,
        o =
          r < 3
            ? i
            : null === s
            ? (s = Object.getOwnPropertyDescriptor(i, e))
            : s;
      if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        o = Reflect.decorate(t, i, e, s);
      else
        for (var a = t.length - 1; 0 <= a; a--)
          (h = t[a]) &&
            (o = (r < 3 ? h(o) : 3 < r ? h(i, e, o) : h(i, e)) || o);
      return 3 < r && o && Object.defineProperty(i, e, o), o;
    };
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.CharacterHitComponent =
    exports.MAX_HIT_EFFECT_COUNT =
    exports.OUTER_RADIUS =
      void 0);
const UE = require("ue"),
  Log_1 = require("../../../../../Core/Common/Log"),
  Stats_1 = require("../../../../../Core/Common/Stats"),
  Time_1 = require("../../../../../Core/Common/Time"),
  CommonDefine_1 = require("../../../../../Core/Define/CommonDefine"),
  HardnessModeById_1 = require("../../../../../Core/Define/ConfigQuery/HardnessModeById"),
  Long = require("../../../../../Core/Define/Net/long"),
  Protocol_1 = require("../../../../../Core/Define/Net/Protocol"),
  EntityComponent_1 = require("../../../../../Core/Entity/EntityComponent"),
  EntitySystem_1 = require("../../../../../Core/Entity/EntitySystem"),
  RegisterComponent_1 = require("../../../../../Core/Entity/RegisterComponent"),
  ResourceSystem_1 = require("../../../../../Core/Resource/ResourceSystem"),
  TimerSystem_1 = require("../../../../../Core/Timer/TimerSystem"),
  FNameUtil_1 = require("../../../../../Core/Utils/FNameUtil"),
  MathCommon_1 = require("../../../../../Core/Utils/Math/MathCommon"),
  Quat_1 = require("../../../../../Core/Utils/Math/Quat"),
  Rotator_1 = require("../../../../../Core/Utils/Math/Rotator"),
  Transform_1 = require("../../../../../Core/Utils/Math/Transform"),
  Vector_1 = require("../../../../../Core/Utils/Math/Vector"),
  MathUtils_1 = require("../../../../../Core/Utils/MathUtils"),
  StringUtils_1 = require("../../../../../Core/Utils/StringUtils"),
  IComponent_1 = require("../../../../../UniverseEditor/Interface/IComponent"),
  CameraController_1 = require("../../../../Camera/CameraController"),
  EventDefine_1 = require("../../../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../../../Common/Event/EventSystem"),
  EffectSystem_1 = require("../../../../Effect/EffectSystem"),
  Global_1 = require("../../../../Global"),
  GlobalData_1 = require("../../../../GlobalData"),
  ConfigManager_1 = require("../../../../Manager/ConfigManager"),
  ControllerHolder_1 = require("../../../../Manager/ControllerHolder"),
  ModelManager_1 = require("../../../../Manager/ModelManager"),
  EntityManager_1 = require("../../../../Manager/ModFuncs/EntityManager"),
  KillAura_1 = require("../../../../Manager/ModFuncs/KillAura"),
  ModManager_1 = require("../../../../Manager/ModManager"),
  BattleUiDefine_1 = require("../../../../Module/BattleUi/BattleUiDefine"),
  CombatMessage_1 = require("../../../../Module/CombatMessage/CombatMessage"),
  GamepadController_1 = require("../../../../Module/Gamepad/GamepadController"),
  SceneTeamController_1 = require("../../../../Module/SceneTeam/SceneTeamController"),
  ColorUtils_1 = require("../../../../Utils/ColorUtils"),
  WorldGlobal_1 = require("../../../../World/WorldGlobal"),
  BulletConstant_1 = require("../../../Bullet/BulletConstant"),
  BulletStaticFunction_1 = require("../../../Bullet/BulletStaticMethod/BulletStaticFunction"),
  BulletTypes_1 = require("../../../Bullet/BulletTypes"),
  BulletUtil_1 = require("../../../Bullet/BulletUtil"),
  FightLibrary_1 = require("../Blueprint/Utils/FightLibrary"),
  CharacterBuffIds_1 = require("./Abilities/CharacterBuffIds"),
  CharacterUnifiedStateTypes_1 = require("./Abilities/CharacterUnifiedStateTypes"),
  WhirlpoolPoint_1 = require("./Move/WhirlpoolPoint");
var EAttributeId = Protocol_1.Aki.Protocol.Vks;
const CustomPromise_1 = require("../../../../../Core/Common/CustomPromise"),
  SkillMessageController_1 = require("../../../../Module/CombatMessage/SkillMessageController"),
  CombatLog_1 = require("../../../../Utils/CombatLog"),
  BulletCollisionUtil_1 = require("../../../Bullet/BulletStaticMethod/BulletCollisionUtil"),
  RoleAudioController_1 = require("../../Role/RoleAudioController"),
  MASS_RATE = 100,
  DEFALUT_SLOT_NAME =
    ((exports.OUTER_RADIUS = 100),
    (exports.MAX_HIT_EFFECT_COUNT = 3),
    new UE.FName("DefaultSlot")),
  DEFAULT_DAMAGE = 1e4,
  DEBUG = !1,
  forbidHitTagIds = [
    1008164187, -1192672452, 1922078392, -648310348, 855966206,
  ],
  enterFkForbidHitTagIds = [-1192672452, 1922078392, -648310348, 855966206],
  lightHits = new Set([0, 1, 8, 9]);
class DoubleHitInAirEffect {
  constructor() {
    (this.GravityScaleUp = 0),
      (this.GravityScaleDown = 0),
      (this.GravityScaleTop = 0),
      (this.LandingBounce = Vector_1.Vector.Create()),
      (this.VelocityTop = 0),
      (this.Valid = !1),
      (this.Duration = 0);
  }
  FromUeHitEffect(t) {
    (this.GravityScaleUp = t.落地反弹上升重力标量),
      (this.GravityScaleDown = t.落地反弹下落重力标量),
      (this.GravityScaleTop = t.落地反弹弧顶重力标量),
      this.LandingBounce.FromUeVector(t.落地反弹),
      (this.VelocityTop = t.落地反弹速度阈值),
      (this.Valid = !0),
      (this.Duration = t.落地反弹时长);
  }
  Finish() {
    this.Valid = !1;
  }
}
class OnHitMaterialAction {
  constructor(t, i = void 0) {
    (this.Z$s = t),
      (this.vHr = i),
      (this.TDe = void 0),
      (this.vJ = 0),
      (this.mSa = 0),
      (this.eXs = void 0),
      (this.tXs = 0),
      (this.iXs = 0),
      (this.rXs = 0),
      (this.oXs = !1),
      (this.nXs = 0),
      (this.PHo = 0),
      (this.dSa = void 0),
      (this.CSa = void 0),
      (this.aXs = !1),
      (this.FFe = 0),
      (this.kC = (t) => {
        Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug(
            "Battle",
            20,
            "OnHitMaterialAction Loop",
            ["Delta", t],
            ["Path", this.eXs],
            ["ElapsedMs", this.tXs]
          ),
          (this.tXs += t * (this.vHr?.CurrentTimeScale ?? 1)),
          !this.oXs && this.IsDelayFinish()
            ? this.S9e(this.dSa, this.CSa)
            : this.oXs &&
              this.r$t() &&
              (this.Stop(),
              this.End(),
              TimerSystem_1.TimerSystem.Remove(this.TDe),
              (this.TDe = void 0));
      });
  }
  get IsPlaying() {
    return this.oXs;
  }
  get BulletId() {
    return this.nXs;
  }
  get AttackerId() {
    return this.PHo;
  }
  IsDelayFinish() {
    return this.tXs >= this.rXs;
  }
  r$t() {
    return this.tXs > this.iXs + this.rXs;
  }
  ComparePriority(t, i) {
    return this.aXs
      ? this.PHo === i
        ? (Log_1.Log.CheckDebug() &&
            Log_1.Log.Debug("Battle", 20, "同一个角色新的更优先"),
          !0)
        : ModelManager_1.ModelManager.SceneTeamModel.GetCurrentEntity.Id !==
            this.PHo ||
          (Log_1.Log.CheckDebug() &&
            Log_1.Log.Debug(
              "Battle",
              20,
              "不同角色，前台角色更优先，如果都不在前台，新的更优先"
            ),
          !1)
      : (Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug("Battle", 20, "当前没有播放就直接播放"),
        !0);
  }
  Start(t, i, e, s, h = void 0) {
    (this.aXs = !0),
      (this.eXs = t),
      (this.iXs = CommonDefine_1.MILLIONSECOND_PER_SECOND),
      (this.rXs = i),
      (this.nXs = e),
      (this.PHo = s),
      (this.oXs = !1),
      (this.dSa = void 0),
      (this.CSa = void 0),
      (this.tXs = 0),
      this.FFe++,
      Log_1.Log.CheckDebug() &&
        Log_1.Log.Debug("Battle", 20, "OnHitMaterialAction 行为开始"),
      this.gSa(this.FFe, t, h),
      TimerSystem_1.TimerSystem.Has(this.TDe) ||
        (this.TDe = TimerSystem_1.TimerSystem.Forever(
          this.kC,
          TimerSystem_1.MIN_TIME,
          1,
          void 0,
          "[OnHitMaterial.Loop]"
        ));
  }
  async gSa(t, i, e) {
    var s = new Array(2),
      h = [];
    h.push(this.fSa(i, s, 0)),
      e && h.push(this.fSa(e, s, 1)),
      await Promise.all(h),
      s[0]
        ? t !== this.FFe
          ? Log_1.Log.CheckDebug() &&
            Log_1.Log.Debug(
              "Battle",
              20,
              "有优先级更高的资源替代了正要播放的材质",
              ["oldPath", i],
              ["newPath", this.eXs]
            )
          : ((h = (e = s[0]).LoopTime),
            (this.iXs =
              BattleUiDefine_1.SECOND_TO_MILLISECOND *
                (h.Start + h.Loop + h.End) +
              this.tXs -
              this.rXs),
            (t = s[1]),
            this.IsDelayFinish()
              ? this.S9e(
                  e,
                  t,
                  "OnHitMaterialAction 加载完已经Delay完成, 直接播放"
                )
              : ((this.dSa = e), (this.CSa = t)))
        : ((this.oXs = !1),
          Log_1.Log.CheckError() &&
            Log_1.Log.Error("Battle", 20, "无法找到材质效果", [
              "materialDataPath",
              this.eXs,
            ]));
  }
  async fSa(t, e, s) {
    const h = new CustomPromise_1.CustomPromise();
    return (
      ResourceSystem_1.ResourceSystem.LoadAsync(
        t,
        UE.PD_CharacterControllerData_C,
        (t, i) => {
          (e[s] = t), h.SetResult();
        }
      ),
      h.Promise
    );
  }
  S9e(t, i, e = "OnHitMaterialAction 开始播放") {
    Log_1.Log.CheckDebug() &&
      Log_1.Log.Debug(
        "Battle",
        20,
        e,
        ["Path", this.eXs],
        ["Duration", this.iXs],
        ["Asset is null", void 0 === t],
        ["Asset Part is null", void 0 === i]
      ),
      (this.oXs = !0),
      t && (this.vJ = this.Z$s.AddMaterialControllerData(t)),
      i && (this.mSa = this.Z$s.AddMaterialControllerData(i));
  }
  Stop(t = !1) {
    this.vJ &&
      (Log_1.Log.CheckDebug() &&
        Log_1.Log.Debug(
          "Battle",
          20,
          "OnHitMaterialAction 停止播放",
          ["Path", this.eXs],
          ["Force", t],
          ["Elapsed", this.tXs]
        ),
      this.Z$s.RemoveMaterialControllerData(this.vJ)),
      this.mSa && this.Z$s.RemoveMaterialControllerData(this.mSa),
      (this.vJ = 0),
      (this.mSa = 0),
      (this.dSa = void 0),
      (this.CSa = void 0),
      (this.oXs = !1);
  }
  End() {
    Log_1.Log.CheckDebug() &&
      Log_1.Log.Debug(
        "Battle",
        20,
        "OnHitMaterialAction 行为结束",
        ["Path", this.eXs],
        ["Elapsed", this.tXs]
      ),
      (this.aXs = !1);
  }
}
let CharacterHitComponent =
  (CharacterHitComponent_1 = class CharacterHitComponent extends (
    EntityComponent_1.EntityComponent
  ) {
    constructor() {
      super(...arguments),
        (this.Hte = void 0),
        (this.cBe = void 0),
        (this.rJo = void 0),
        (this.tVr = void 0),
        (this.vHr = void 0),
        (this.iVr = void 0),
        (this.oVr = void 0),
        (this.rVr = void 0),
        (this.LastHitData = void 0),
        (this.nVr = !1),
        (this.sVr = !1),
        (this.aVr = !1),
        (this.hVr = []),
        (this.lVr = []),
        (this._Vr = []),
        (this.cVr = 0),
        (this.Leh = !1),
        (this.mVr = void 0),
        (this.dVr = void 0),
        (this.CVr = void 0),
        (this.gVr = 0),
        (this.RageModeId = 0),
        (this.HardnessModeId = 0),
        (this.BeHitBones = new Array()),
        (this.ToughDecreaseValue = 0),
        (this.BeHitIgnoreRotate = !1),
        (this.CounterAttackInfoInternal = void 0),
        (this.VisionCounterAttackInfoInternal = void 0),
        (this.WindupAttackInfoInternal = void 0),
        (this.BeHitTime = 0),
        (this.NeedCalculateFallInjure = !1),
        (this.BeHitAnim = 0),
        (this.AcceptedNewBeHit = !1),
        (this.EnterFk = !1),
        (this.vll = !1),
        (this.BeHitDirect = Vector_1.Vector.Create()),
        (this.BeHitLocation = Vector_1.Vector.Create()),
        (this.BeHitSocketName = void 0),
        (this.BeHitMapping = void 0),
        (this.fVr = !1),
        (this.pVr = 0),
        (this.vVr = 0),
        (this.MVr = void 0),
        (this.EVr = void 0),
        (this.$zo = void 0),
        (this.SVr = void 0),
        (this.yVr = 0),
        (this.IVr = !1),
        (this.TVr = void 0),
        (this.Gue = Rotator_1.Rotator.Create()),
        (this.az = Quat_1.Quat.Create()),
        (this.F1t = void 0),
        (this.HitEffectMap = new Map()),
        (this.hXs = void 0),
        (this.xoa = void 0),
        (this.Uha = void 0),
        (this.DVr = (t, i) => {
          i === CharacterUnifiedStateTypes_1.ECharPositionState.Ground
            ? t === CharacterUnifiedStateTypes_1.ECharPositionState.Air &&
              this.DoubleHitInAirEffect?.Valid
              ? TimerSystem_1.TimerSystem.Next(this.RVr, void 0, "落地击飞")
              : this.DeActiveStiff("落地")
            : t === CharacterUnifiedStateTypes_1.ECharPositionState.Air &&
              this.DoubleHitInAirEffect.Finish();
        }),
        (this.PVr = void 0),
        (this.UVr = !1),
        (this.AVr = 0),
        (this.BFa = -1),
        (this.xVr = Vector_1.Vector.Create()),
        (this.wVr = Vector_1.Vector.Create()),
        (this.oHo = Transform_1.Transform.Create()),
        (this.BVr = Vector_1.Vector.Create()),
        (this.bVr = Vector_1.Vector.Create()),
        (this.DoubleHitInAirEffect = void 0),
        (this.qVr = Vector_1.Vector.Create()),
        (this.RVr = () => {
          var t, i;
          this.DoubleHitInAirEffect.Valid &&
            ((i = (t = this.Entity.GetComponent(164)).GetLastUpdateVelocity()),
            this.BVr.Set(
              i.X * this.DoubleHitInAirEffect.LandingBounce.X,
              0,
              -1 * i.Z * this.DoubleHitInAirEffect.LandingBounce.Z
            ),
            this.BVr.MultiplyEqual(
              (MASS_RATE / this.EVr.GetCurrentValue(EAttributeId.Proto_Mass)) *
                (this.vHr?.CurrentTimeScale ?? 1)
            ),
            t.Valid &&
              (this.Hte.ActorQuatProxy.RotateVector(this.BVr, this.qVr),
              t.Active && t.SetForceSpeed(this.qVr),
              3 !== t.CharacterMovement.MovementMode &&
                t.CharacterMovement.SetMovementMode(3),
              t.SetGravityScale(
                this.DoubleHitInAirEffect.GravityScaleUp,
                this.DoubleHitInAirEffect.GravityScaleDown,
                this.DoubleHitInAirEffect.GravityScaleTop,
                this.DoubleHitInAirEffect.VelocityTop,
                this.DoubleHitInAirEffect.Duration
              )),
            this.DoubleHitInAirEffect.Finish(),
            (this.UVr = !0),
            (this.AVr = Time_1.Time.Frame));
        }),
        (this.Rbr = void 0);
    }
    GetHitData() {
      return this.rVr;
    }
    OnInitData() {
      return (this.DoubleHitInAirEffect = new DoubleHitInAirEffect()), !0;
    }
    OnInit() {
      return (
        CharacterHitComponent_1.GVr ||
          (CharacterHitComponent_1.GVr = new Set([4, 7])),
        (this.BeHitSocketName = FNameUtil_1.FNameUtil.EMPTY),
        !0
      );
    }
    OnStart() {
      return (
        (this.Hte = this.Entity.GetComponent(3)),
        (this.cBe = this.Entity.GetComponent(34)),
        (this.$zo = this.Entity.GetComponent(160)),
        (this.rJo = this.Entity.GetComponent(161)),
        (this.oVr = this.Entity.GetComponent(48)),
        (this.tVr = this.Entity.GetComponent(60)),
        (this.vHr = this.Entity.GetComponent(110)),
        (this.EVr = this.Entity.GetComponent(159)),
        (this.SVr = this.Entity.GetComponent(191)),
        EventSystem_1.EventSystem.AddWithTarget(
          this.Entity,
          EventDefine_1.EEventName.CharOnPositionStateChanged,
          this.DVr
        ),
        (this.MVr = []),
        (this.F1t = (t, i) => {
          this.MVr = this.MVr.filter((t) =>
            EffectSystem_1.EffectSystem.IsValid(t)
          );
          for (const e of this.MVr)
            EffectSystem_1.EffectSystem.SetTimeScale(e, t);
        }),
        (this.PVr = (t, i) => {
          t === CharacterUnifiedStateTypes_1.ECharPositionState.Air &&
            i === CharacterUnifiedStateTypes_1.ECharPositionState.Water &&
            this.DeActiveStiff("落水");
        }),
        this.lXs(),
        EventSystem_1.EventSystem.AddWithTarget(
          this.Entity,
          EventDefine_1.EEventName.CharBeHitTimeScale,
          this.F1t
        ),
        EventSystem_1.EventSystem.AddWithTarget(
          this.Entity,
          EventDefine_1.EEventName.CharOnPositionStateChanged,
          this.PVr
        ),
        this.NVr(),
        !0
      );
    }
    URe(t) {
      this.SVr?.AddTag(t);
    }
    ARe(t) {
      this.SVr?.RemoveTag(t);
    }
    OVr(t) {
      return this.SVr?.HasTag(t) ?? !1;
    }
    kVr(t) {
      for (const i of t) if (this.OVr(i)) return !0;
      return !1;
    }
    NVr() {
      var t,
        i,
        e = this.Entity.GetComponent(0);
      e.GetEntityType() !== Protocol_1.Aki.Protocol.kks.Proto_Player &&
        ((i = e?.GetPbEntityInitData()) &&
          ((t = (i = (0, IComponent_1.getComponent)(
            i.ComponentsData,
            "AttributeComponent"
          ))?.HardnessModeId) && (this.HardnessModeId = t),
          (t = i?.RageModeId)) &&
          (this.RageModeId = t),
        this.RefreshHardnessModeConfig(),
        this.RefreshRageModeConfig(),
        (i = e?.GetEntityPropertyConfig())) &&
        0 < i.受击映射索引ID &&
        (this.BeHitMapping = FightLibrary_1.FightLibrary.GetHitMapConfig(
          i.受击映射索引ID
        ));
    }
    OnEnd() {
      return (
        EventSystem_1.EventSystem.RemoveWithTarget(
          this.Entity,
          EventDefine_1.EEventName.CharOnPositionStateChanged,
          this.DVr
        ),
        EventSystem_1.EventSystem.RemoveWithTarget(
          this.Entity,
          EventDefine_1.EEventName.CharBeHitTimeScale,
          this.F1t
        ),
        EventSystem_1.EventSystem.RemoveWithTarget(
          this.Entity,
          EventDefine_1.EEventName.CharOnPositionStateChanged,
          this.PVr
        ),
        this.F1t && this.F1t(1, 0),
        !0
      );
    }
    OnClear() {
      return (
        this.TVr &&
          TimerSystem_1.TimerSystem.Has(this.TVr) &&
          (TimerSystem_1.TimerSystem.Remove(this.TVr), (this.TVr = void 0)),
        this.Abr(),
        !0
      );
    }
    GetAcceptedNewBeHitAndReset() {
      var t = this.AcceptedNewBeHit;
      return (
        this.AcceptedNewBeHit &&
          (this.FVr(!1),
          this.Entity.GetComponent(
            163
          ).MainAnimInstance.AddForceUpdateSlotNameWhenMontageBlend(
            DEFALUT_SLOT_NAME
          )),
        t
      );
    }
    FVr(t) {
      this.AcceptedNewBeHit !== t &&
        ((this.AcceptedNewBeHit = t),
        EventSystem_1.EventSystem.EmitWithTarget(
          this.Entity,
          EventDefine_1.EEventName.CharOnSetNewBeHit,
          this.AcceptedNewBeHit
        ));
    }
    GetEnterFk() {
      return this.EnterFk;
    }
    GetEnterFkAndReset() {
      var t = this.EnterFk;
      return (this.EnterFk = !1), t;
    }
    GetDoubleHitInAir() {
      return this.AVr !== Time_1.Time.Frame && (this.UVr = !1), this.UVr;
    }
    SetBeHitIgnoreRotate(t) {
      this.BeHitIgnoreRotate = t;
    }
    VVr() {
      return (
        !!this.IsTriggerCounterAttack ||
        (!!this.BeHitIgnoreRotate &&
          !CharacterHitComponent_1.GVr?.has(this.BeHitAnim) &&
          this.rJo?.PositionState ===
            CharacterUnifiedStateTypes_1.ECharPositionState.Ground)
      );
    }
    SetRageModeId(t) {
      this.RageModeId = t;
    }
    SetHardnessModeId(t) {
      (this.HardnessModeId = t),
        this.Entity.GetComponent(3).IsAutonomousProxy &&
          ControllerHolder_1.ControllerHolder.CreatureController.HardnessModeChangedRequest(
            this.Entity.Id,
            t
          );
    }
    SetCounterAttackInfo(t) {
      (this.CounterAttackInfoInternal = t),
        this.URe(1124064628),
        this.URe(-1793427578);
    }
    SetVisionCounterAttackInfo(t) {
      (this.VisionCounterAttackInfoInternal = t), this.URe(-1576849243);
    }
    SetWindupAttackInfo(t) {
      if (
        ((this.WindupAttackInfoInternal = t), this.URe(-1793427578), this.$zo)
      ) {
        var i = this.WindupAttackInfoInternal?.Buff,
          e = i?.Num() ?? 0;
        for (let t = 0; t < e; t++) {
          var s = i.Get(t);
          0 < s &&
            this.$zo.AddBuff(s, {
              InstigatorId: this.$zo.CreatureDataId,
              Reason: "开始前摇ANS添加buff",
            });
        }
      }
    }
    SetCounterAttackAnsInfo(t) {
      this.BFa = t;
    }
    GetRageMode() {
      return this.dVr;
    }
    RefreshRageModeConfig() {
      0 !== this.RageModeId
        ? ((this.dVr = HardnessModeById_1.configHardnessModeById.GetConfig(
            this.RageModeId
          )),
          this.dVr ||
            (Log_1.Log.CheckError() &&
              Log_1.Log.Error("Character", 14, "读取RageModeConfig失败", [
                "id",
                this.RageModeId,
              ])))
        : (this.dVr = void 0);
    }
    GetHardnessMode() {
      return this.CVr;
    }
    RefreshHardnessModeConfig() {
      0 !== this.HardnessModeId
        ? ((this.CVr = HardnessModeById_1.configHardnessModeById.GetConfig(
            this.HardnessModeId
          )),
          this.CVr ||
            (Log_1.Log.CheckError() &&
              Log_1.Log.Error("Character", 14, "读取白条表失败", [
                "id",
                this.HardnessModeId,
              ])))
        : (this.CVr = void 0);
    }
    ReceiveOnHit(i, t, e, s, h, r, o, a, n, _, l) {
      if (this.kVr(forbidHitTagIds))
        this.kVr(enterFkForbidHitTagIds) &&
          this.HVr(EntitySystem_1.EntitySystem.Get(i.BulletEntityId));
      else if (
        !this.cBe?.CurrentSkill?.Active ||
        !this.cBe.CurrentSkill.SkillInfo.OverrideHit
      )
        if (((this.rVr = i), this.WVr(), e)) {
          if (
            ((this.LastHitData = i),
            (this.iVr = t),
            (this.EnterFk = h),
            (this.sVr = r),
            (this.cVr = o ? 1 : a ? 2 : 0),
            (this.fVr = !1),
            (this.nVr = !0),
            (this.BeHitTime = UE.GameplayStatics.GetTimeSeconds(
              this.Hte.Actor
            )),
            this.BeHitLocation.DeepCopy(i.HitPosition),
            (this.NeedCalculateFallInjure = !0),
            0 < _ && !h)
          ) {
            if (this.OVr(1447214865) && !this.IsTriggerCounterAttack)
              return void this.jVr();
            if (
              (this.IsTriggerCounterAttack &&
                this.CounterAttackInfoInternal &&
                this.KVr(this.rVr),
              (this.gVr = this.oVr?.TrySwitchHitState(l, !1) ?? 0),
              !this.oVr || this.gVr)
            ) {
              this.BeHitAnim = l;
              e = i.ReBulletData.Base;
              let t = e.BeHitEffect;
              this.sVr && (t = e.HitEffectWeakness);
              r = ConfigManager_1.ConfigManager.BulletConfig.GetBulletHitData(
                this.iVr,
                t
              );
              r
                ? (CombatLog_1.CombatLog.Info("Hit", this.Entity, "远端受击"),
                  this.Hte.SetMoveControlled(!1, 2, "远端受击"),
                  s &&
                    this.Entity.GetComponent(3).SetActorRotation(
                      n,
                      "受击者旋转",
                      !1
                    ),
                  (this.BeHitAnim = l),
                  this.QVr(r))
                : this.HVr(EntitySystem_1.EntitySystem.Get(i.BulletEntityId));
            } else this.HVr(EntitySystem_1.EntitySystem.Get(i.BulletEntityId));
          }
          !this.EnterFk ||
            ((o = t.GetComponent(1))?.Valid &&
              (this.Hte.ActorLocationProxy.Subtraction(
                o.ActorLocationProxy,
                this.BeHitDirect
              ),
              this.BeHitDirect.Normalize())) ||
            this.Hte.ActorForwardProxy.Multiply(-1, this.BeHitDirect),
            this.jVr();
        } else this.rVr = void 0;
    }
    XVr(t) {
      this.Hte.CreatureData.GetEntityType() !==
        Protocol_1.Aki.Protocol.kks.Proto_Monster ||
        this.rJo.IsInFightState() ||
        (this.tVr.CollectSampleAndSend(!0),
        (i = this.Hte.CreatureData.GetPbDataId()),
        Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug("Character", 50, "怪物受击，主动同步位置", [
            "PbDataId",
            i,
          ]));
      var i = Protocol_1.Aki.Protocol.I4s.create(),
        e = this.iVr.GetComponent(0).GetCreatureDataId(),
        s = this.Entity.GetComponent(0).GetCreatureDataId(),
        e =
          ((i.s5n = MathUtils_1.MathUtils.NumberToLong(e)),
          (i.CVn = MathUtils_1.MathUtils.NumberToLong(s)),
          (i.Mjn = Long.fromNumber(this.rVr.BulletId)),
          this.rVr.HitPosition),
        s =
          ((i.cWn = { X: e.X, Y: e.Y, Z: e.Z }),
          (i.mWn = {
            Pitch: this.rVr.HitEffectRotation.Pitch,
            Yaw: this.rVr.HitEffectRotation.Yaw,
            Roll: this.rVr.HitEffectRotation.Roll,
          }),
          (i.dWn = { X: e.X, Y: e.Y, Z: e.Z }),
          (i.CWn = this.BeHitAnim),
          (i.gWn = this.EnterFk),
          (i.fWn = this.sVr),
          (i.pWn = 1 === this.cVr),
          (i.vWn = 2 === this.cVr),
          (i.MWn = this.mVr),
          (i.SWn = this.nVr),
          (i.EWn = this.rVr.HitPart?.toString() ?? ""),
          (i.yWn = !this.VVr() && this.nVr && !this.EnterFk),
          t.GetBulletInfo());
      (i.r5n = s.BulletInitParams.SkillId), (i.IWn = s.BulletInitParams.Source);
      const h = this.gVr;
      h && (i.mVn = this.oVr?.GetFightState() ?? 0);
      e = Protocol_1.Aki.Protocol.P3n.create();
      (e.TWn = i),
        this.lra(e),
        CombatMessage_1.CombatNet.Call(28203, this.Entity, e, (t) => {
          h && this.oVr?.ConfirmState(h);
        });
    }
    lra(t) {
      ModelManager_1.ModelManager.GameModeModel.IsMulti ||
        ((t.TWn.Y8n = 0),
        (t.TWn.CVn = 0),
        (t.TWn.SWn = !1),
        (t.TWn.cWn = void 0),
        (t.TWn.mWn = void 0),
        (t.TWn.zDs = !1),
        (t.TWn.gWn = !1),
        (t.TWn.fWn = !1),
        (t.TWn.MWn = void 0),
        (t.TWn.yWn = !1),
        (t.TWn.EWn = ""),
        (t.TWn.CWn = 0));
    }
    OnHitOne(t, i, e, s, h, r, o, a, n) {
      CharacterHitComponent_1.$Vr.Start(),
        (this.rVr = t),
        (this.LastHitData = t),
        (this.iVr = EntitySystem_1.EntitySystem.Get(t.Attacker.Id)),
        (this.nVr = i),
        (this.aVr = s),
        (this.hVr = r),
        (this.lVr = o),
        (this._Vr = a),
        (this.IVr = h),
        (this.fVr = !1),
        (this.vll = !1),
        CharacterHitComponent_1.YVr.Start(),
        this.JVr(),
        this.zVr(e),
        this.IsTriggerCounterAttack ? this.ZVr() : (this.Leh = this.Aeh(e)),
        CharacterHitComponent_1.YVr.Stop(),
        CharacterHitComponent_1.e6r.Start(),
        this.t6r(),
        CharacterHitComponent_1.e6r.Stop(),
        CharacterHitComponent_1.i6r.Start(),
        this.o6r(),
        CharacterHitComponent_1.i6r.Stop(),
        this.iwr(e),
        CharacterHitComponent_1.r6r.Start(),
        this.n6r(),
        CharacterHitComponent_1.r6r.Stop(),
        CharacterHitComponent_1.s6r.Start(),
        this.a6r(e),
        CharacterHitComponent_1.s6r.Stop(),
        GlobalData_1.GlobalData.Networking() && this.XVr(e),
        CharacterHitComponent_1.h6r.Start(),
        this.l6r(),
        CharacterHitComponent_1.h6r.Stop(),
        CharacterHitComponent_1.pSa.Start(),
        this.ProcessOnHitMaterial(),
        CharacterHitComponent_1.pSa.Stop(),
        CharacterHitComponent_1.$Vr.Stop(),
        this.jVr();
    }
    OnHit(t, i, e, s, h, r, o, a, n) {
      var l = Global_1.Global.BaseCharacter?.CharacterActorComponent.Entity,
        c = EntitySystem_1.EntitySystem.Get(t.Target.Id),
        m = EntitySystem_1.EntitySystem.Get(t.Attacker.Id);
      if (!0 !== ModManager_1.ModManager.Settings.GodMode || c != l)
        if (!0 !== ModManager_1.ModManager.Settings.HitMultiplier || m != l)
          this.OnHitOne(t, i, e, s, h, r, o, a, n);
        else
          for (let l = 0; l < ModManager_1.ModManager.Settings.Hitcount; l++)
            this.OnHitOne(t, i, e, s, h, r, o, a, n);
    }
    jVr() {
      (this.rVr = void 0),
        (this.iVr = void 0),
        (this.lVr = void 0),
        (this._Vr = void 0),
        (this.IVr = !1),
        (this.gVr = 0);
    }
    ActiveStiff(t) {
      var i;
      0 !== t &&
        (this.TVr &&
          TimerSystem_1.TimerSystem.Has(this.TVr) &&
          (TimerSystem_1.TimerSystem.Remove(this.TVr), (this.TVr = void 0)),
        this.URe(-2044964178),
        (i = () => {
          this.Entity.Valid && ((this.TVr = void 0), this.ARe(-2044964178));
        }),
        0 < t) &&
        (this.TVr = TimerSystem_1.TimerSystem.Delay(
          i,
          t * BattleUiDefine_1.SECOND_TO_MILLISECOND
        ));
    }
    DeActiveStiff(t = 0) {
      this.TVr &&
        TimerSystem_1.TimerSystem.Has(this.TVr) &&
        (TimerSystem_1.TimerSystem.Remove(this.TVr), (this.TVr = void 0)),
        this.ARe(-2044964178);
    }
    IsStiff() {
      return this.OVr(-2044964178);
    }
    JVr() {
      (this.BeHitBones.length = 0),
        this.rVr.HitPart &&
          !FNameUtil_1.FNameUtil.IsNothing(this.rVr.HitPart) &&
          this.BeHitBones.push(this.rVr.HitPart),
        this.BeHitBones && 0 < this.BeHitBones?.length
          ? (this.BeHitSocketName = this.BeHitBones[0])
          : (this.BeHitSocketName = FNameUtil_1.FNameUtil.EMPTY);
    }
    zVr(t) {
      this.c6r(t)
        ? (this.cVr = 2)
        : this.u6r(t)
        ? (this.cVr = 1)
        : (this.cVr = 0);
    }
    u6r(t) {
      var i = t.Data.Logic;
      if (!i.CanCounterAttack) return !1;
      if (!this.OVr(1124064628))
        return (
          Log_1.Log.CheckDebug() &&
            Log_1.Log.Debug("Character", 20, "CheckNormalCounterAttack无Tag"),
          !1
        );
      if (this.CounterAttackInfoInternal.QTE弹刀忽略角度距离检测) {
        (t = t.GetBulletInfo()),
          (t = this.iVr
            .GetComponent(34)
            .GetSkillInfo(t.BulletInitParams.SkillId));
        if (t && 4 === t.SkillGenre) return !0;
      }
      if (i.CounterAttackIgnoreAngle && i.CounterAttackIgnoreDist)
        return (
          BulletConstant_1.BulletConstant.OpenHitActorLog &&
            Log_1.Log.CheckDebug() &&
            Log_1.Log.Debug("Test", 20, "检查弹反 不需要检查角度和距离", [
              "Actor",
              this.Hte.Actor.GetName(),
            ]),
          !0
        );
      var e = this.rVr.HitPart,
        s = this.CounterAttackInfoInternal.弹反部位,
        h = s.Num();
      let r = !1;
      if (e.op_Equality(FNameUtil_1.FNameUtil.NONE) && 0 < h)
        return (
          Log_1.Log.CheckDebug() &&
            Log_1.Log.Debug("Character", 20, "检查弹反 击中部位"),
          !1
        );
      BulletConstant_1.BulletConstant.OpenHitActorLog &&
        Log_1.Log.CheckDebug() &&
        Log_1.Log.Debug("Test", 20, "检查弹反 击中部位", [
          "部位",
          e.toString(),
        ]);
      for (let t = 0; t < h; t++) {
        var o = s.Get(t);
        if (
          (BulletConstant_1.BulletConstant.OpenHitActorLog &&
            Log_1.Log.CheckDebug() &&
            Log_1.Log.Debug("Test", 20, "检查弹反 配置部位", [
              "部位",
              o.toString(),
            ]),
          o.op_Equality(e))
        ) {
          r = !0;
          break;
        }
      }
      if (!r && 0 < h) return !1;
      this.xVr.FromUeVector(this.iVr.GetComponent(3).ActorLocationProxy),
        r
          ? ((t = this.Hte.GetBoneLocation(e.toString())),
            this.wVr.FromUeVector(t),
            DEBUG &&
              UE.KismetSystemLibrary.DrawDebugSphere(
                GlobalData_1.GlobalData.GameInstance,
                t,
                10,
                void 0,
                ColorUtils_1.ColorUtils.LinearGreen,
                4
              ),
            this.xVr.SubtractionEqual(this.wVr))
          : this.xVr.SubtractionEqual(this.Hte.ActorLocationProxy);
      var i = this.xVr.Size(),
        t =
          (this.xVr.Normalize(MathCommon_1.MathCommon.KindaSmallNumber),
          Vector_1.Vector.DotProduct(this.Hte.ActorForwardProxy, this.xVr)),
        a = Math.cos(
          this.CounterAttackInfoInternal.最大触发夹角 *
            MathUtils_1.MathUtils.DegToRad
        ),
        n = this.CounterAttackInfoInternal.最大触发距离;
      return (
        BulletConstant_1.BulletConstant.OpenHitActorLog &&
          Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug(
            "Test",
            20,
            "检查弹反 最大距离和最大触发夹角",
            ["当前距离", i],
            ["最大触发距离", n],
            ["夹角cos值", t],
            ["最大触发夹角cos值", a]
          ),
        i < n && a < t
      );
    }
    c6r(t) {
      return !!t.Data.Logic.CanVisionCounterAttack && !!this.OVr(-1576849243);
    }
    Aeh(t) {
      return (
        !!this.Hte.CreatureData.IsMonster() &&
        !!t?.Data.Logic.CanBreakWindupAttack &&
        !!this.OVr(-1793427578)
      );
    }
    iwr(t) {
      var i = this.rVr.ReBulletData;
      const e = i.TimeScale;
      let s = this.sVr
        ? e.AttackerTimeScaleOnHitWeakPoint
        : e.TimeScaleOnAttack;
      if (
        (e.TimeScaleOnAttackIgnoreAttacker
          ? 0 < s.时间膨胀时长 &&
            BulletUtil_1.BulletUtil.SetTimeScale(
              t.GetBulletInfo(),
              s.优先级,
              s.时间膨胀值,
              s.时间膨胀变化曲线,
              s.时间膨胀时长,
              1
            )
          : 0 < s.时间膨胀时长 &&
            (2 === i.Logic.Type && (t = this.xoa?.顿帧) && (s = t),
            this.iVr
              .GetComponent(110)
              .SetTimeScale(
                s.优先级,
                s.时间膨胀值,
                s.时间膨胀变化曲线,
                s.时间膨胀时长,
                1
              ),
            (t = e.CharacterCustomKeyTimeScale),
            StringUtils_1.StringUtils.IsEmpty(t) ||
              ((h =
                ModelManager_1.ModelManager.BulletModel.GetEntityIdByCustomKey(
                  this.iVr.Id,
                  t,
                  this.rVr.BulletId.toString()
                )),
              (h = ModelManager_1.ModelManager.CharacterModel.GetHandle(h))
                ?.Valid
                ? h.Entity.GetComponent(110)?.SetTimeScale(
                    s.优先级,
                    s.时间膨胀值,
                    s.时间膨胀变化曲线,
                    s.时间膨胀时长,
                    1
                  )
                : Log_1.Log.CheckWarn() &&
                  Log_1.Log.Warn(
                    "Character",
                    20,
                    "",
                    ["自定义连携顿帧单位key", t],
                    ["子弹ID", this.rVr.BulletId]
                  ))),
        this.vHr && !i.Base.ContinuesCollision && !this.OVr(-648310348))
      ) {
        const e = this.rVr.ReBulletData.TimeScale;
        var h = this.sVr ? e.VictimTimeScaleOnHitWeakPoint : e.TimeScaleOnHit;
        BulletUtil_1.BulletUtil.SetVictimTimeScale(
          this.rVr.BulletEntityId,
          this.Entity.Id,
          this.vHr,
          h.优先级,
          h.时间膨胀值,
          h.时间膨胀变化曲线,
          h.时间膨胀时长,
          2,
          e.RemoveHitTimeScaleOnDestroy
        );
      }
    }
    iHo() {
      if (this.Hte && this.rVr) {
        var e = this.rVr.ReBulletData;
        if (e) {
          let t = !0,
            i = void 0;
          return (
            this.Hte.IsPartHit &&
              ((t = e.Base.EnablePartHitAudio),
              FNameUtil_1.FNameUtil.IsNothing(this.rVr.HitPart) ||
                (i = this.rVr.HitPart?.toString())),
            BulletCollisionUtil_1.BulletCollisionUtil.GetHitEffects(
              this.Hte,
              e.Render,
              this.sVr,
              i,
              0 < e.Base.DamageId,
              t,
              this,
              this.SVr
            )
          );
        }
      }
    }
    WVr() {
      var t = this.iHo();
      if (t && 0 < t.size) {
        var i = this.rVr.ReBulletData.Render,
          s = i.EffectOnHitConf.get(0),
          h = this.rVr.HitPosition,
          s = s ? s.Scale : Vector_1.Vector.OneVectorProxy,
          h =
            (this.oHo.Set(h, this.rVr.HitEffectRotation.Quaternion(), s),
            CharacterHitComponent_1.rHo.Start(),
            this.rVr.Attacker?.GetComponent(44));
        let e = !1;
        (0, RegisterComponent_1.isComponentInstance)(h, 175) &&
          (e = "p1" === h.Priority.State);
        var r = BulletStaticFunction_1.HitStaticFunction.CreateEffectContext(
          this.rVr.Attacker,
          !0,
          e
        );
        const _ = i.AudioOnHit;
        var o,
          a,
          n = (t, i) => {
            BulletStaticFunction_1.HitStaticFunction.PlayHitAudio(t, i, _, e);
          };
        for ([o, a] of t)
          EffectSystem_1.EffectSystem.SpawnEffect(
            GlobalData_1.GlobalData.World,
            this.oHo.ToUeTransform(),
            o,
            "[CharacterHitComponent.ProcessHitEffect]",
            r,
            void 0,
            void 0,
            a ? n : void 0
          );
        CharacterHitComponent_1.rHo.Stop();
      }
    }
    o6r() {
      this.d6r();
      var t = this.C6r(this.rVr);
      this.hVr && 0 < this.hVr.length
        ? this.g6r(this.hVr, t)
        : (this.f6r(this.lVr, t), this.IVr && this.p6r(this._Vr, t));
    }
    g6r(t, i) {
      let e = !1;
      for (const r of t) e ||= r.IsTransferDamage;
      for (const o of t) {
        var s = !(o.SeparateDamage && e),
          h = this.v6r(i, !1, s, o.Index);
        s || (this.ToughDecreaseValue = h.ToughResult);
      }
      e &&
        ((t = this.v6r(i, !1, !e, t[0].Index)),
        (this.ToughDecreaseValue = t.ToughResult));
    }
    f6r(t, i) {
      if (t) {
        this.sVr = !1;
        for (const s of t) {
          var e = s.IsWeaknessHit;
          (this.sVr ||= e), this.v6r(i, e, !1, s.Index);
        }
      }
    }
    p6r(t, i) {
      var e;
      t && 0 < t.length
        ? ((e = (t = t[0]).IsWeaknessHit),
          (this.sVr ||= e),
          (e = this.v6r(i, this.sVr, !1, t.Index)),
          (this.ToughDecreaseValue = e.ToughResult))
        : ((t = this.v6r(i, this.sVr, !1)),
          (this.ToughDecreaseValue = t.ToughResult));
    }
    v6r(t, e, i, r = -1, o = 1) {
      var a,
        n,
        s = t.ReBulletData.Base.DamageId,
        h = t.Target.GetComponent(18),
        n = t.Target.GetComponent(34);
      a = EntitySystem_1.EntitySystem.Get(t.BulletEntityId)?.GetBulletInfo()
        .ContextId;
      const dict = {
        DamageDataId: s,
        SkillLevel: t.SkillLevel,
        Attacker: t.Attacker,
        HitPosition: t.HitPosition.ToUeVector(),
        IsAddEnergy: this.aVr,
        IsCounterAttack: this.IsTriggerCounterAttack,
        ForceCritical: e,
        IsBlocked: i,
        PartId: r,
        ExtraRate: o,
        CounterSkillMessageId: this.IsTriggerCounterAttack
          ? n.CurrentSkill?.CombatMessageId
          : void 0,
        BulletId: t.BulletId,
        CounterSkillId: this.IsTriggerCounterAttack
          ? Number(n.CurrentSkill?.SkillId)
          : void 0,
      };

      if (ModManager_1.ModManager.Settings.HitAll) {
        let l =
            Global_1.Global.BaseCharacter?.CharacterActorComponent.Entity.Id,
          m = t.Attacker.Id;
        if (m == l) {
          ModelManager_1.ModelManager.CreatureModel.GetAllEntities().forEach(
            (entity) => {
              if (
                EntityManager_1.EntityManager.isMonster(entity) &&
                KillAura_1.KillAura.isIndistance(entity)
              ) {
                try {
                  TimerSystem_1.TimerSystem.Delay(() => {
                    const Entity = entity.Entity;
                    if (
                      Entity &&
                      EntitySystem_1.EntitySystem.Get(
                        t.BulletEntityId
                      )?.GetBulletInfo()
                    ) {
                      const entityPos =
                        Entity.GetComponent(3).ActorLocationProxy;
                      let CharacterPartComponent = Entity.GetComponent(61);
                      if (
                        Entity.GetComponent(18) &&
                        Entity.GetComponent(34) &&
                        CharacterPartComponent &&
                        entityPos
                      ) {
                        CharacterPartComponent.OnInitData();
                        CharacterPartComponent.OnInit();
                        CharacterPartComponent.OnActivate();
                        dict.HitPosition = entityPos.ToUeVector();
                        if (
                          ModManager_1.ModManager.Settings.killAuraState == 1
                        ) {
                          dict.DamageDataId = 1205401001n;
                          Entity.GetComponent(18)?.ExecuteBulletDamage(
                            t.BulletEntityId,
                            dict,
                            a
                          );
                          dict.DamageDataId = 1301400001n;
                          Entity.GetComponent(18)?.ExecuteBulletDamage(
                            t.BulletEntityId,
                            dict,
                            a
                          );
                        } else {
                          if (s >= 1) {
                            Entity.GetComponent(18)?.ExecuteBulletDamage(
                              t.BulletEntityId,
                              dict,
                              a
                            );
                          }
                        }
                      }
                    }
                  }, Math.floor(Math.random() * 100) + 20);
                } catch {}
              }
            }
          );
        }
      }

      return s < 1 || !h
        ? {
            DamageResult: 0,
            ToughResult: 0,
          }
        : h && n
        ? h?.ExecuteBulletDamage(t.BulletEntityId, dict, a)
        : {
            DamageResult: 1e4,
            ToughResult: 0,
          };
    }
    C6r(t) {
      var t = Object.assign(t),
        i = this.iVr.GetComponent(49)?.GetAttributeHolder();
      return (
        i && (t.Attacker = i),
        (t.Target =
          this.Entity.GetComponent(49)?.GetAttributeHolder(!0) ?? this.Entity),
        t
      );
    }
    n6r() {
      if (
        !CameraController_1.CameraController.Model.IsModeEnabled(2) &&
        !CameraController_1.CameraController.Model.IsModeEnabled(1) &&
        this.rVr.IsShaking
      ) {
        var i = this.rVr.ReBulletData.Render;
        let t = this.sVr
          ? i.AttackerCameraShakeOnHitWeakPoint
          : i.AttackerCameraShakeOnHit;
        var e,
          i = i.VictimCameraShakeOnHit;
        0 < t.length
          ? (this.xoa &&
              0 < (e = this.xoa.震屏.ToAssetPathName()).length &&
              (t = e),
            ResourceSystem_1.ResourceSystem.LoadAsync(t, UE.Class, (t) => {
              var i =
                Global_1.Global.CharacterCameraManager.GetCameraLocation();
              CameraController_1.CameraController.PlayWorldCameraShake(
                t,
                i,
                0,
                exports.OUTER_RADIUS,
                1,
                !1
              );
            }))
          : 0 < i.length &&
            ResourceSystem_1.ResourceSystem.LoadAsync(i, UE.Class, (t) => {
              var i =
                Global_1.Global.CharacterCameraManager.GetCameraLocation();
              CameraController_1.CameraController.PlayWorldCameraShake(
                t,
                i,
                0,
                exports.OUTER_RADIUS,
                1,
                !1
              );
            });
      }
    }
    HVr(t) {
      this.kVr([1940180710, -1388400236]) ||
        !t ||
        t.Data.Base.DamageId <= 0 ||
        ((this.EnterFk = !0),
        (t = t.GetBulletInfo()),
        BulletUtil_1.BulletUtil.GetHitRotator(t, this.Hte, this.Gue),
        this.Gue.Quaternion(this.az),
        this.az.RotateVector(
          Vector_1.Vector.ForwardVectorProxy,
          this.BeHitDirect
        ),
        this.BeHitDirect.MultiplyEqual(-1),
        this.M6r(0));
    }
    a6r(i) {
      if (
        (this.IsTriggerCounterAttack &&
          (CharacterHitComponent_1.E6r.Start(),
          this.KVr(this.rVr),
          CharacterHitComponent_1.E6r.Stop()),
        this.kVr(forbidHitTagIds))
      )
        (this.nVr = !1), this.kVr(enterFkForbidHitTagIds) && this.HVr(i);
      else if (this.nVr) {
        var e = this.rVr.ReBulletData.Base;
        let t = e.BeHitEffect;
        this.sVr && (t = e.HitEffectWeakness);
        e = ConfigManager_1.ConfigManager.BulletConfig.GetBulletHitData(
          this.iVr,
          t
        );
        if (e) {
          this.BeHitTime = UE.GameplayStatics.GetTimeSeconds(this.Hte.Actor);
          var s = this.EVr?.GetCurrentValue(EAttributeId.Proto_Tough) ?? 0;
          if (
            (this.BeHitLocation.DeepCopy(this.rVr.HitPosition),
            (this.NeedCalculateFallInjure = !0),
            !(0 < s || this.ToughDecreaseValue <= 0 || this.OVr(1447214865)) ||
              (this.IsTriggerCounterAttack && this.fVr))
          ) {
            CharacterHitComponent_1.S6r.Start();
            let t = 0;
            e && (t = this.Leh || this.fVr ? 7 : e.被击动作),
              (t = this.y6r(t)),
              (this.oVr &&
              ((this.gVr = this.oVr.TrySwitchHitState(t, !0)), !this.gVr)
                ? (this.HVr(i), CharacterHitComponent_1.S6r)
                : ((this.vll = !0),
                  RoleAudioController_1.RoleAudioController.OnPlayerIsHit(
                    this.Entity
                  ),
                  CombatLog_1.CombatLog.Info("Hit", this.Entity, "受击", [
                    "BeHitAnim",
                    t,
                  ]),
                  ModelManager_1.ModelManager.GameModeModel.IsMulti &&
                    this.Hte.SetMoveControlled(!0, 2, "受击"),
                  (this.BeHitAnim = t),
                  (this.EnterFk = !1),
                  (s = i.GetBulletInfo()),
                  this.VVr()
                    ? (BulletUtil_1.BulletUtil.GetHitRotator(
                        s,
                        this.Hte,
                        this.Gue
                      ),
                      (this.mVr = this.Gue.ToUeRotator()))
                    : (this.mVr = BulletUtil_1.BulletUtil.SetHitRotator(
                        s,
                        this.Hte,
                        this.rVr.HitEffect.受击朝向Z轴偏转
                      )),
                  this.I6r(),
                  CharacterHitComponent_1.S6r.Stop(),
                  CharacterHitComponent_1.T6r.Start(),
                  this.VVr() &&
                    (this.BeHitAnim =
                      BulletUtil_1.BulletUtil.GetOverrideHitAnimByAngle(
                        this.Hte,
                        this.BeHitAnim,
                        this.mVr.Yaw
                      )),
                  this.L6r(e),
                  this.M6r(lightHits.has(this.BeHitAnim) ? 1 : 2),
                  CharacterHitComponent_1.T6r)
              ).Stop();
          } else this.HVr(i);
        }
      }
    }
    t6r() {
      this.OVr(1124064628) &&
        this.$zo.RemoveBuffByTag(1124064628, "撞墙或受击逻辑触发移除");
    }
    l6r() {
      if (this.rVr) {
        let t = 0;
        2 !== this.cVr ||
          this.fVr ||
          ((t = this.VisionCounterAttackInfoInternal.对策事件ID),
          GlobalData_1.GlobalData.BpEventManager.当触发对策事件时.Broadcast(
            this.VisionCounterAttackInfoInternal.对策事件ID,
            this.rVr.ToUeHitInformation()
          ));
        var i,
          e = EntitySystem_1.EntitySystem.Get(
            this.rVr.BulletEntityId
          ).GetBulletInfo(),
          e = Number(e.BulletInitParams.SkillId),
          e = {
            Attacker: this.iVr,
            Target: this.Entity,
            BulletId: this.rVr.BulletId,
            HasBeHitAnim: this.vll,
            BeHitAnim: this.BeHitAnim,
            VisionCounterAttackId: t,
            CounterAttackType: this.cVr,
            SkillId: e,
            SkillGenre:
              this.iVr?.GetComponent(34)?.GetSkillInfo(e)?.SkillGenre ?? 0,
          };
        this.iVr &&
          (SceneTeamController_1.SceneTeamController.EmitEvent(
            this.iVr,
            EventDefine_1.EEventName.CharHitLocal,
            this.rVr,
            e
          ),
          (i = this.iVr.GetComponent(0))) &&
          (i = i.IsVision()
            ? this.iVr.GetComponent(49)?.GetAttributeHolder() ?? this.iVr
            : this.iVr) &&
          SceneTeamController_1.SceneTeamController.EmitEvent(
            i,
            EventDefine_1.EEventName.CharHitIncludingVision,
            this.rVr,
            e
          ),
          SceneTeamController_1.SceneTeamController.EmitEvent(
            this.Entity,
            EventDefine_1.EEventName.CharBeHitLocal,
            this.rVr,
            e
          ),
          GlobalData_1.GlobalData.BpEventManager.当有角色受击时.Broadcast(
            this.Hte.Actor,
            this.rVr.ToUeHitInformation()
          ),
          this.Entity.GetComponent(68)?.Tick(0);
      } else CombatLog_1.CombatLog.Error("Hit", this.Entity, "HitData为空");
    }
    L6r(t) {
      if (
        (this.OVr(504239013) &&
          (i = this.Entity.GetComponent(164)).Valid &&
          i.CharacterMovement.SetMovementMode(3),
        this.FVr(!0),
        this.Entity.GetComponent(161).ExitAimStatus(),
        EventSystem_1.EventSystem.EmitWithTarget(
          this.Entity,
          EventDefine_1.EEventName.CharBeHitAnim
        ),
        this.OVr(-1732582420))
      ) {
        var i = t.地面受击滞空,
          e = i.滞空时间 + i.到滞空点时间;
        this.R6r(e) ? this.U6r(i, e) : this.A6r(t);
      } else if (!this.OVr(-648310348))
        if (this.OVr(-1898186757)) {
          if (4 === this.BeHitAnim) {
            (i = t.地面受击滞空), (e = i.滞空时间 + i.到滞空点时间);
            if (this.R6r(e)) return void this.U6r(i, e);
            if (0 < t.地面受击速度.Z) return void this.P6r(t, !1);
          }
          this.A6r(t);
        } else {
          (i = t.空中受击滞空), (e = i.滞空时间 + i.到滞空点时间);
          this.R6r(e) ? this.U6r(i, e) : this.P6r(t, !0);
        }
    }
    U6r(t, i) {
      var e,
        s,
        h,
        r = this.Entity.GetComponent(164);
      r.Valid &&
        ((e = this.Hte),
        (s = WhirlpoolPoint_1.WhirlpoolPoint.GenId()),
        this.BVr.FromUeVector(t.滞空相对位置),
        MathUtils_1.MathUtils.TransformPosition(
          e.ActorLocationProxy,
          e.ActorRotationProxy,
          e.ActorScaleProxy,
          this.BVr,
          this.bVr
        ),
        (h = this.iVr.GetComponent(3).ActorLocationProxy.Z + t.滞空高度限制) <
          this.bVr.Z && (this.bVr.Z = h),
        r.BeginWhirlpool(
          s,
          t.到滞空点时间,
          this.bVr,
          e.ActorLocationProxy,
          i,
          t.到滞空点曲线
        ));
    }
    R6r(t) {
      return 0 < t;
    }
    QVr(t) {
      this.FVr(!0),
        this.Entity.GetComponent(161).ExitAimStatus(),
        EventSystem_1.EventSystem.EmitWithTarget(
          this.Entity,
          EventDefine_1.EEventName.CharBeHitAnim
        ),
        4 === this.BeHitAnim ? this.P6r(t, !1) : this.A6r(t);
    }
    ActivateHitStateByHitAnim() {
      switch (this.BeHitAnim) {
        case 0:
        case 1:
        case 8:
        case 9:
          this.Entity.GetComponent(161).SetMoveState(
            CharacterUnifiedStateTypes_1.ECharMoveState.SoftKnock
          );
          break;
        case 2:
        case 3:
        case 10:
        case 11:
        case 6:
          this.Entity.GetComponent(161).SetMoveState(
            CharacterUnifiedStateTypes_1.ECharMoveState.HeavyKnock
          );
          break;
        case 4:
          this.Entity.GetComponent(161).SetMoveState(
            CharacterUnifiedStateTypes_1.ECharMoveState.KnockUp
          );
          break;
        case 5:
          this.Entity.GetComponent(161).SetMoveState(
            CharacterUnifiedStateTypes_1.ECharMoveState.KnockDown
          );
          break;
        case 7:
          this.Entity.GetComponent(161).SetMoveState(
            CharacterUnifiedStateTypes_1.ECharMoveState.Parry
          );
      }
    }
    P6r(t, i) {
      this.ActiveStiff(-1);
      var e,
        s = this.Entity.GetComponent(164);
      s.Valid &&
        ((e = this.Hte),
        this.BVr.FromUeVector(i ? t.空中受击速度 : t.地面受击速度),
        (i = this.EVr?.GetCurrentValue(EAttributeId.Proto_Mass) ?? MASS_RATE),
        this.BVr.MultiplyEqual(MASS_RATE / i),
        s.GetWhirlpoolEnable() && s.EndWhirlpool(),
        3 !== s.CharacterMovement.MovementMode &&
          s.CharacterMovement.SetMovementMode(3),
        e.ActorQuatProxy.RotateVector(this.BVr, this.bVr),
        s.Active && s.SetForceFallingSpeed(this.bVr, 31862857),
        (e = 0 < (i = t.空中受击移动时间) ? i : t.地面受击移动时间),
        s.SetGravityScale(t.上升标量, t.下落标量, t.弧顶标量, t.速度阈值, e),
        0 < t.落地反弹.Z
          ? this.DoubleHitInAirEffect.FromUeHitEffect(t)
          : this.DoubleHitInAirEffect.Finish());
    }
    A6r(t) {
      var i,
        e = new UE.Vector(t.地面受击速度.X, t.地面受击速度.Y, 0),
        s = t.地面受击最小速度,
        h = t.地面受击最大速度,
        r = t.地面受击移动时间,
        o = t.命中硬直时间,
        t = t.地面受击移动曲线;
      0 < r &&
        ((i = this.EVr?.GetCurrentValue(EAttributeId.Proto_Mass) ?? MASS_RATE),
        (e = e.op_Multiply(MASS_RATE / i)),
        (i = this.Entity.GetComponent(164)).Valid) &&
        (i.GetWhirlpoolEnable() && i.EndWhirlpool(),
        (this.yVr = i.SetAddMove(e, r, void 0, this.yVr, t, s, h))),
        this.ActiveStiff(o);
    }
    y6r(t) {
      let i = void 0;
      return (i =
        !this.BeHitMapping || this.BeHitMapping.ID <= 0
          ? t
          : this.BeHitMapping.映射表.Get(t));
    }
    ZVr() {
      RoleAudioController_1.RoleAudioController.PlayRoleAudio(this.iVr, 2005);
      var t = this.iVr.CheckGetComponent(160);
      switch ((this.cBe?.SetCurSkillAnIndex(this.BFa), this.cVr)) {
        case 1:
          0 < this.CounterAttackInfoInternal.攻击者应用BuffID &&
            SkillMessageController_1.SkillMessageController
              .CloseMonsterServerLogic &&
            t.AddBuffFromAnimNotify(
              this.CounterAttackInfoInternal.攻击者应用BuffID,
              this.$zo,
              { InstigatorId: t.CreatureDataId, Reason: "拼刀攻击者应用Buff" }
            ),
            0 < this.CounterAttackInfoInternal.被弹反者应用BuffID &&
              SkillMessageController_1.SkillMessageController
                .CloseMonsterServerLogic &&
              this.$zo?.AddBuffFromAnimNotify(
                this.CounterAttackInfoInternal.被弹反者应用BuffID,
                void 0,
                {
                  InstigatorId: this.$zo?.CreatureDataId,
                  Reason: "拼刀受击者应用Buff",
                }
              );
          break;
        case 2:
          0 < this.VisionCounterAttackInfoInternal.攻击者应用BuffID &&
            SkillMessageController_1.SkillMessageController
              .CloseMonsterServerLogic &&
            t.AddBuffFromAnimNotify(
              this.VisionCounterAttackInfoInternal.攻击者应用BuffID,
              this.$zo,
              { InstigatorId: t.CreatureDataId, Reason: "对策攻击者应用Buff" }
            ),
            0 < this.VisionCounterAttackInfoInternal.被对策者应用BuffID &&
              SkillMessageController_1.SkillMessageController
                .CloseMonsterServerLogic &&
              this.$zo?.AddBuffFromAnimNotify(
                this.VisionCounterAttackInfoInternal.被对策者应用BuffID,
                void 0,
                {
                  InstigatorId: this.$zo?.CreatureDataId,
                  Reason: "对策受击者应用Buff",
                }
              );
      }
      t.AddBuffFromAnimNotify(
        CharacterBuffIds_1.buffId.CounterInvincibleCommon,
        this.$zo,
        { InstigatorId: t.CreatureDataId, Reason: "弹反攻击者无敌" }
      );
    }
    KVr(t) {
      switch (this.cVr) {
        case 1:
          this.x6r(t);
          break;
        case 2:
          this.w6r(t);
      }
    }
    x6r(t) {
      let i = this.CounterAttackInfoInternal.无弹反动作效果;
      (this.fVr = this.B6r()),
        this.fVr && (i = this.CounterAttackInfoInternal.有弹反动作效果),
        this.b6r(t, i),
        this.q6r(i),
        this.iVr.GetComponent(3).IsAutonomousProxy && this.G6r(i),
        this.N6r();
      t = this.CounterAttackInfoInternal?.结束事件Tag;
      t?.TagName !== StringUtils_1.NONE_STRING &&
        this.SVr?.AddTag(t?.TagId ?? 0);
    }
    w6r(t) {
      this.fVr = !this.VisionCounterAttackInfoInternal.广播对策事件;
      var i = this.VisionCounterAttackInfoInternal.对策动作效果;
      this.b6r(t, i),
        this.q6r(i),
        this.iVr.GetComponent(3).IsAutonomousProxy &&
          !this.OVr(1161958668) &&
          this.G6r(i),
        this.N6r();
    }
    d6r() {
      !this.$zo ||
        1 !== this.cVr ||
        (this.$zo.HasBuffAuthority() &&
          0 < this.CounterAttackInfoInternal.ANS期间被弹反者生效的BuffID &&
          SkillMessageController_1.SkillMessageController
            .CloseMonsterServerLogic &&
          (this.cBe?.SetCurSkillAnIndex(this.BFa),
          this.$zo.AddBuffFromAnimNotify(
            this.CounterAttackInfoInternal.ANS期间被弹反者生效的BuffID,
            void 0,
            {
              InstigatorId: this.$zo.CreatureDataId,
              Reason: "弹反ANS附加的buff",
            }
          )),
        this.CounterAttackInfoInternal.削韧倍率 <= 1) ||
        (this.pVr = this.$zo.AddAttributeRateModifierLocal(
          EAttributeId.Proto_ToughReduce,
          this.CounterAttackInfoInternal.削韧倍率,
          "弹反修改韧性倍率"
        ));
    }
    CounterAttackEnd() {
      this.pVr && this.$zo?.RemoveBuffByHandle(this.pVr),
        SkillMessageController_1.SkillMessageController
          .CloseMonsterServerLogic &&
          this.$zo?.RemoveBuff(
            this.CounterAttackInfoInternal.ANS期间被弹反者生效的BuffID,
            -1,
            "结束弹反ANS附加的buff"
          ),
        this.ARe(1124064628),
        this.ARe(-1793427578),
        Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug("Character", 20, "CounterAttackEnd", [
            "CounterAttackType",
            this.cVr,
          ]),
        (this.cVr = 0);
    }
    VisionCounterAttackEnd() {
      this.ARe(-1576849243);
    }
    WindupAttackEnd() {
      if ((this.ARe(-1793427578), (this.Leh = !1), this.$zo)) {
        var i = this.WindupAttackInfoInternal?.Buff,
          e = i?.Num() ?? 0;
        for (let t = 0; t < e; t++) {
          var s = i.Get(t);
          0 < s && this.$zo.RemoveBuff(s, -1, "结束前摇ANS的buff");
        }
      }
    }
    B6r() {
      if (!this.CounterAttackInfoInternal.受击动画忽略Buff检测 && this.$zo) {
        var i = this.CounterAttackInfoInternal.检测Buff列表;
        for (let t = 0; t < i.Num(); t++) {
          var e = i.Get(t),
            s = this.$zo.GetBuffTotalStackById(e.BuffID, !1);
          if (e.层数 > s) return !1;
        }
      }
      return !0;
    }
    SetCounterAttackEndTime(t) {
      var i = this.Entity.GetComponent(163).MainAnimInstance;
      i && (this.vVr = t + i.Montage_GetPosition(i.GetCurrentActiveMontage()));
    }
    OnHitByWall(t, i) {
      var e;
      (this.rVr = void 0),
        (this.BeHitBones.length = 0),
        (this.BeHitSocketName = FNameUtil_1.FNameUtil.EMPTY),
        (this.cVr = 0),
        (this.fVr = !1),
        this.t6r(),
        this.OVr(1008164187) ||
          ((this.BeHitTime = UE.GameplayStatics.GetTimeSeconds(this.Hte.Actor)),
          (this.EnterFk = !1),
          (e = Rotator_1.Rotator.Create()),
          MathUtils_1.MathUtils.LookRotationUpFirst(
            i,
            Vector_1.Vector.UpVectorProxy,
            e
          ),
          this.Hte.SetActorRotation(e.ToUeRotator(), "OnHitByWall", !1),
          this.L6r(t));
    }
    OnReboundSuccess(t, i, e) {
      var e = BulletStaticFunction_1.HitStaticFunction.CreateEffectContext(
          this.Entity,
          e
        ),
        i = EffectSystem_1.EffectSystem.SpawnEffect(
          GlobalData_1.GlobalData.World,
          i,
          t.ToAssetPathName(),
          "[CharacterHitComponent.OnReboundSuccess]",
          e
        );
      i &&
        EffectSystem_1.EffectSystem.IsValid(i) &&
        ((t = this.vHr) &&
          ((e = t.CurrentTimeScale),
          EffectSystem_1.EffectSystem.SetTimeScale(
            i,
            e * this.TimeDilation,
            !0
          )),
        this.MVr.push(i));
    }
    static HitEndRequest(t) {
      var i = Protocol_1.Aki.Protocol.B3n.create();
      CombatMessage_1.CombatNet.Call(22039, t, i, this.O6r);
    }
    static PreHitNotify(t, i) {
      return (
        i.TWn?.SWn &&
          !i.TWn.gWn &&
          (t = t.GetComponent(48)) &&
          !t.PreSwitchRemoteFightState(i.TWn.mVn) &&
          ((i.TWn.gWn = !0), (i.TWn.mVn = 0)),
        !0
      );
    }
    static HitNotify(t, i) {
      var e,
        s,
        h,
        r = MathUtils_1.MathUtils.LongToNumber(i.TWn.s5n),
        o = ModelManager_1.ModelManager.CreatureModel.GetEntity(r);
      o?.Valid
        ? ((e = i.TWn.Mjn
            ? MathUtils_1.MathUtils.LongToBigInt(i.TWn.Mjn).toString()
            : ""),
          (s = ConfigManager_1.ConfigManager.BulletConfig.GetBulletData(
            o.Entity,
            e
          ))
            ? ((s = new BulletTypes_1.HitInformation(
                o.Entity,
                t,
                void 0,
                0,
                void 0,
                i.TWn.zDs ?? !1,
                void 0,
                void 0,
                0,
                s,
                ""
              )),
              i.TWn.mWn &&
                s.HitEffectRotation.Set(
                  i.TWn.mWn.Pitch,
                  i.TWn.mWn.Yaw,
                  i.TWn.mWn.Roll
                ),
              i.TWn.dWn &&
                s.HitPosition.Set(i.TWn.dWn.X, i.TWn.dWn.Y, i.TWn.dWn.Z),
              i.TWn.EWn &&
                (s.HitPart = FNameUtil_1.FNameUtil.GetDynamicFName(i.TWn.EWn)),
              (h = WorldGlobal_1.WorldGlobal.ToUeRotator(i.TWn.MWn)),
              t
                ?.GetComponent(53)
                ?.ReceiveOnHit(
                  s,
                  o.Entity,
                  i.TWn.SWn ?? !1,
                  i.TWn.yWn ?? !1,
                  i.TWn.gWn ?? !1,
                  i.TWn.fWn ?? !1,
                  i.TWn.pWn ?? !1,
                  i.TWn.vWn ?? !1,
                  h,
                  i.TWn.mVn,
                  i.TWn.CWn
                ),
              t?.GetComponent(53)?.VUn(o.Entity, i.TWn))
            : Log_1.Log.CheckError() &&
              Log_1.Log.Error(
                "World",
                14,
                `[ControllerHolder.CreatureController.HitNotify] 子弹数据不存在;${e}。`
              ))
        : Log_1.Log.CheckWarn() &&
          Log_1.Log.Warn(
            "World",
            14,
            "[ControllerHolder.CreatureController.HitNotify] 攻击者为空，不存在动态实体:" +
              r
          );
    }
    VUn(t, i) {
      var e;
      t &&
        i &&
        t &&
        ((e = i.r5n),
        (i = {
          Attacker: t,
          Target: this.Entity,
          BulletId: MathUtils_1.MathUtils.LongToNumber(i.Mjn),
          HasBeHitAnim: !1,
          BeHitAnim: i.CWn ?? 0,
          VisionCounterAttackId: 0,
          CounterAttackType: i.vWn ? 2 : i.pWn ? 1 : 0,
          SkillId: e,
          SkillGenre: t?.GetComponent(34)?.GetSkillInfo(e)?.SkillGenre ?? 0,
        }),
        SceneTeamController_1.SceneTeamController.EmitEvent(
          t,
          EventDefine_1.EEventName.CharHitRemote,
          i
        ),
        SceneTeamController_1.SceneTeamController.EmitEvent(
          this.Entity,
          EventDefine_1.EEventName.CharBeHitRemote,
          i
        ));
    }
    b6r(t, i) {
      var e = i.特效DA;
      e.AssetPathName &&
        this.PlayCounterAttackEffect(
          t,
          e.AssetPathName?.toString(),
          i.特效Scale
        );
    }
    PlayCounterAttackEffect(t, i, e) {
      var s;
      i &&
        ((e = new UE.Transform(
          t.HitEffectRotation.ToUeRotator(),
          t.HitPosition.ToUeVector(),
          e
        )),
        (s = ModelManager_1.ModelManager.BulletModel.GetBulletEntityById(
          t.BulletEntityId
        )),
        (t = BulletStaticFunction_1.HitStaticFunction.CreateEffectContext(
          t.Attacker,
          s?.GetBulletInfo().EffectInfo.DisablePostProcess ?? !1
        )),
        (s = EffectSystem_1.EffectSystem.SpawnEffect(
          GlobalData_1.GlobalData.World,
          e,
          i,
          "[CharacterHitComponent.BeCounterattack]",
          t
        )),
        EffectSystem_1.EffectSystem.IsValid(s)) &&
        ((e = this.vHr) &&
          ((i = e.CurrentTimeScale),
          EffectSystem_1.EffectSystem.SetTimeScale(
            s,
            i * this.TimeDilation,
            !0
          )),
        this.MVr.push(s));
    }
    q6r(t) {
      var i = t.被击者顿帧;
      this.vHr?.SetTimeScale(
        i.优先级,
        i.时间膨胀值,
        i.时间膨胀变化曲线,
        i.时间膨胀时长,
        4
      ),
        (i = t.攻击者顿帧),
        this.iVr
          .GetComponent(110)
          .SetTimeScale(
            i.优先级,
            i.时间膨胀值,
            i.时间膨胀变化曲线,
            i.时间膨胀时长,
            3
          );
    }
    G6r(t) {
      var i;
      CameraController_1.CameraController.Model.IsModeEnabled(2) ||
        CameraController_1.CameraController.Model.IsModeEnabled(1) ||
        ((i =
          ModelManager_1.ModelManager.CameraModel.FightCamera.GetComponent(
            4
          ).CameraActor.K2_GetActorLocation()),
        CameraController_1.CameraController.PlayWorldCameraShake(
          t.震屏,
          i,
          0,
          exports.OUTER_RADIUS,
          1,
          !1
        )),
        CameraController_1.CameraController.FightCamera.LogicComponent.ApplyCameraModify(
          t.摄像机设置.Tag,
          t.摄像机设置.持续时间,
          t.摄像机设置.淡入时间,
          t.摄像机设置.淡出时间,
          t.摄像机设置.摄像机配置,
          void 0,
          t.摄像机设置.打断淡出时间,
          void 0,
          void 0,
          void 0,
          t.摄像机设置.CameraAttachSocket
        );
    }
    N6r() {
      var t;
      this.kVr(forbidHitTagIds) ||
        ((t = this.Entity.GetComponent(163)).Valid &&
          t.MontageSetPosition(this.vVr));
    }
    get IsTriggerCounterAttack() {
      return 0 !== this.cVr;
    }
    I6r() {
      var t;
      this.Entity.GetComponent(16) &&
        (t =
          this.rVr.ReBulletData.TimeScale.TimeScaleEffectImmune *
          CommonDefine_1.MILLIONSECOND_PER_SECOND) >= TimerSystem_1.MIN_TIME &&
        this.AddImmuneTimeScaleEffectTimer(t);
    }
    AddImmuneTimeScaleEffectTimer(t) {
      const i = (t) => {
        for (const e of this.$zo.BuffEffectManager.FilterById(17))
          t ? e.StartTimeScaleEffect() : e.StopTimeScaleEffect();
        var i = this.vHr;
        t ? i.ResumePauseLock() : i.ImmunePauseLock();
      };
      this.Abr() || i(!1),
        (this.Rbr = TimerSystem_1.TimerSystem.Delay(() => {
          (this.Rbr = void 0), i(!0);
        }, t));
    }
    Abr() {
      return !(
        !TimerSystem_1.TimerSystem.Has(this.Rbr) ||
        (TimerSystem_1.TimerSystem.Remove(this.Rbr), (this.Rbr = void 0))
      );
    }
    IsImmuneTimeScaleEffect() {
      return TimerSystem_1.TimerSystem.Has(this.Rbr);
    }
    M6r(t) {
      this.Entity === Global_1.Global.BaseCharacter?.GetEntityNoBlueprint() &&
        GamepadController_1.GamepadController.PlayForceFeedbackByHit(t);
    }
    GetAttackerEntity() {
      return this.iVr;
    }
    lXs() {
      this.Hte?.CreatureData.IsRealMonster() &&
        this.Hte.Actor.CharRenderingComponent &&
        (this.hXs = new OnHitMaterialAction(
          this.Hte.Actor.CharRenderingComponent,
          this.vHr
        ));
    }
    ProcessOnHitMaterial() {
      if (ModelManager_1.ModelManager.BulletModel.OpenHitMaterial && this.hXs) {
        var i = this.rVr.ReBulletData.Render.OnHitMaterialEffect;
        if (!StringUtils_1.StringUtils.IsNothing(i)) {
          var e = this.rVr.BulletEntityId,
            s = this.iVr.Id;
          if (this.hXs.ComparePriority(e, s)) {
            this.hXs.Stop(!0);
            let t = void 0;
            var h = this.rVr.HitPart;
            h &&
              !FNameUtil_1.FNameUtil.IsNothing(h) &&
              ((h = h.toString()),
              Log_1.Log.CheckDebug() &&
                Log_1.Log.Debug(
                  "Character",
                  20,
                  "OnHitMaterialAction 命中部位",
                  ["Part", h]
                ),
              (h = this.Hte.GetPartConf(h)?.MaterialEffect)) &&
              UE.KismetSystemLibrary.IsValidSoftObjectReference(h) &&
              (t = h.ToAssetPathName()),
              this.hXs.Start(
                i,
                ModelManager_1.ModelManager.BulletModel.OnHitMaterialMsDelay,
                e,
                s,
                t
              );
          }
        }
      }
    }
    ReplaceHitEffect(t) {
      this.xoa
        ? CombatLog_1.CombatLog.Error(
            "Hit",
            this.Entity,
            "已存在替换受击特效, 新的替换不会生效"
          )
        : ((this.xoa = t), (this.Uha = void 0));
    }
    RemoveHitEffectReplaced() {
      (this.xoa = void 0), (this.Uha = void 0);
    }
    GetHitEffectReplaced() {
      return this.xoa;
    }
    GetHitEffectReplacedIgnoreBones() {
      if (this.xoa) {
        if (!this.Uha) {
          this.Uha = new Set();
          var i = this.xoa.不替换的部位,
            e = i.Num();
          for (let t = 0; t < e; t++) {
            var s = i.Get(t);
            FNameUtil_1.FNameUtil.IsNothing(s) || this.Uha.add(s.toString());
          }
        }
        return this.Uha;
      }
    }
  });
(CharacterHitComponent.GVr = void 0),
  (CharacterHitComponent.$Vr = Stats_1.Stat.Create("OnHit")),
  (CharacterHitComponent.YVr = Stats_1.Stat.Create("OnHit0")),
  (CharacterHitComponent.e6r = Stats_1.Stat.Create("OnHit1")),
  (CharacterHitComponent.i6r = Stats_1.Stat.Create("OnHit2")),
  (CharacterHitComponent.r6r = Stats_1.Stat.Create("OnHit3")),
  (CharacterHitComponent.s6r = Stats_1.Stat.Create("OnHit4")),
  (CharacterHitComponent.h6r = Stats_1.Stat.Create("OnHit5")),
  (CharacterHitComponent.pSa = Stats_1.Stat.Create("OnHit6")),
  (CharacterHitComponent.rHo = Stats_1.Stat.Create("PlayHitEffect")),
  (CharacterHitComponent.E6r = Stats_1.Stat.Create("ProcessMain1")),
  (CharacterHitComponent.S6r = Stats_1.Stat.Create("ProcessMain2")),
  (CharacterHitComponent.T6r = Stats_1.Stat.Create("ProcessMain3")),
  (CharacterHitComponent.O6r = (t) => {}),
  __decorate(
    [CombatMessage_1.CombatNet.PreHandle("TFn")],
    CharacterHitComponent,
    "PreHitNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.SyncHandle("TFn")],
    CharacterHitComponent,
    "HitNotify",
    null
  ),
  (CharacterHitComponent = CharacterHitComponent_1 =
    __decorate(
      [(0, RegisterComponent_1.RegisterComponent)(53)],
      CharacterHitComponent
    )),
  (exports.CharacterHitComponent = CharacterHitComponent);
//# sourceMappingURL=CharacterHitComponent.js.map
