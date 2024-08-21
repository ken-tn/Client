"use strict";
var CharacterHitComponent_1, __decorate = this && this.__decorate || function (t, e, i, r) {
    var o, a = arguments.length,
        n = a < 3?e : null === r?r = Object.getOwnPropertyDescriptor(e, i) : r;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, i, r);
    else
        for (var s = t.length - 1; 0 <= s; s--)(o = t[s]) && (n = (a < 3?o(n) : 3 < a?o(e, i, n) : o(e, i)) || n);
    return 3 < a && n && Object.defineProperty(e, i, n), n
};
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.CharacterHitComponent = exports.MAX_HIT_EFFECT_COUNT = exports.OUTER_RADIUS = void 0;
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
    ObjectUtils_1 = require("../../../../../Core/Utils/ObjectUtils"),
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
    ModManager_1 = require("../../../../Manager/ModManager"),
    ModUtils_1 = require("../../../../Manager/ModFuncs/ModUtils"),
    ModMenu_1 = require("../../../../ModMenu"),
    BulletController_1 = require("../../../Bullet/BulletController"),
    FightLibrary_1 = require("../Blueprint/Utils/FightLibrary"),
    CharacterBuffIds_1 = require("./Abilities/CharacterBuffIds"),
    CharacterUnifiedStateTypes_1 = require("./Abilities/CharacterUnifiedStateTypes"),
    WhirlpoolPoint_1 = require("./Move/WhirlpoolPoint");
var EAttributeId = Protocol_1.Aki.Protocol.Bks;
const CustomPromise_1 = require("../../../../../Core/Common/CustomPromise"),
    CombatLog_1 = require("../../../../Utils/CombatLog"),
    RoleAudioController_1 = require("../../Role/RoleAudioController"),
    MASS_RATE = 100,
    DEFALUT_SLOT_NAME = (exports.OUTER_RADIUS = 100, exports.MAX_HIT_EFFECT_COUNT = 3, new UE.FName("DefaultSlot")),
    DEFAULT_DAMAGE = 1e4,
    DEBUG = !1,
    forbidHitTagIds = [1008164187, -1192672452, 1922078392, -648310348, 855966206],
    enterFkForbidHitTagIds = [-1192672452, 1922078392, -648310348, 855966206],
    lightHits = new Set([0, 1, 8, 9]);
class DoubleHitInAirEffect {
    constructor() {
        this.GravityScaleUp = 0, this.GravityScaleDown = 0, this.GravityScaleTop = 0, this.LandingBounce = Vector_1.Vector.Create(), this.VelocityTop = 0, this.Valid = !1, this.Duration = 0
    }
    FromUeHitEffect(t) {
        this.GravityScaleUp = t.落地反弹上升重力标量, this.GravityScaleDown = t.落地反弹下落重力标量, this.GravityScaleTop = t.落地反弹弧顶重力标量, this.LandingBounce.FromUeVector(t.落地反弹), this.VelocityTop = t.落地反弹速度阈值, this.Valid = !0, this.Duration = t.落地反弹时长
    }
    Finish() {
        this.Valid = !1
    }
}
class OnHitMaterialAction {
    constructor(t, e = void 0) {
        this.GKs = t, this.vHr = e, this.TDe = void 0, this.vJ = 0, this.rpa = 0, this.OKs = void 0, this.NKs = 0, this.kKs = 0, this.FKs = 0, this.VKs = !1, this.HKs = 0, this.PHo = 0, this.opa = void 0, this.npa = void 0, this.WKs = !1, this.FFe = 0, this.kC = t => {
            Log_1.Log.CheckDebug() && Log_1.Log.Debug("Battle", 21, "OnHitMaterialAction Loop", ["Delta", t], ["Path", this.OKs], ["ElapsedMs", this.NKs]), this.NKs += t * (this.vHr?.CurrentTimeScale ?? 1), !this.VKs && this.IsDelayFinish()?this.S9e(this.opa, this.npa) : this.VKs && this.r$t() && (this.Stop(), this.End(), TimerSystem_1.TimerSystem.Remove(this.TDe), this.TDe = void 0)
        }
    }
    get IsPlaying() {
        return this.VKs
    }
    get BulletId() {
        return this.HKs
    }
    get AttackerId() {
        return this.PHo
    }
    IsDelayFinish() {
        return this.NKs >= this.FKs
    }
    r$t() {
        return this.NKs > this.kKs + this.FKs
    }
    ComparePriority(t, e) {
        return this.WKs?this.PHo === e?(Log_1.Log.CheckDebug() && Log_1.Log.Debug("Battle", 21, "同一个角色新的更优先"), !0) : ModelManager_1.ModelManager.SceneTeamModel.GetCurrentEntity.Id !== this.PHo || (Log_1.Log.CheckDebug() && Log_1.Log.Debug("Battle", 21, "不同角色，前台角色更优先，如果都不在前台，新的更优先"), !1) : (Log_1.Log.CheckDebug() && Log_1.Log.Debug("Battle", 21, "当前没有播放就直接播放"), !0)
    }
    Start(t, e, i, r, o = void 0) {
        this.WKs = !0, this.OKs = t, this.kKs = CommonDefine_1.MILLIONSECOND_PER_SECOND, this.FKs = e, this.HKs = i, this.PHo = r, this.VKs = !1, this.opa = void 0, this.npa = void 0, this.NKs = 0, this.FFe++, Log_1.Log.CheckDebug() && Log_1.Log.Debug("Battle", 21, "OnHitMaterialAction 行为开始"), this.spa(this.FFe, t, o), TimerSystem_1.TimerSystem.Has(this.TDe) || (this.TDe = TimerSystem_1.TimerSystem.Forever(this.kC, TimerSystem_1.MIN_TIME, 1, void 0, "[OnHitMaterial.Loop]"))
    }
    async spa(t, e, i) {
        var r = new Array(2),
            o = [];
        o.push(this.apa(e, r, 0)), i && o.push(this.apa(i, r, 1)), await Promise.all(o), r[0]?t !== this.FFe?Log_1.Log.CheckDebug() && Log_1.Log.Debug("Battle", 21, "有优先级更高的资源替代了正要播放的材质", ["oldPath", e], ["newPath", this.OKs]) : (o = (i = r[0]).LoopTime, this.kKs = BattleUiDefine_1.SECOND_TO_MILLISECOND * (o.Start + o.Loop + o.End) + this.NKs - this.FKs, t = r[1], this.IsDelayFinish()?this.S9e(i, t, "OnHitMaterialAction 加载完已经Delay完成, 直接播放") : (this.opa = i, this.npa = t)) : (this.VKs = !1, Log_1.Log.CheckError() && Log_1.Log.Error("Battle", 21, "无法找到材质效果", ["materialDataPath", this.OKs]))
    }
    async apa(t, e, i) {
        const r = new CustomPromise_1.CustomPromise;
        return ResourceSystem_1.ResourceSystem.LoadAsync(t, UE.PD_CharacterControllerData_C, ((t, o) => {
            e[i] = t, r.SetResult()
        })), r.Promise
    }
    S9e(t, e, i = "OnHitMaterialAction 开始播放") {
        Log_1.Log.CheckDebug() && Log_1.Log.Debug("Battle", 21, i, ["Path", this.OKs], ["Duration", this.kKs], ["Asset is null", void 0 === t], ["Asset Part is null", void 0 === e]), this.VKs = !0, t && (this.vJ = this.GKs.AddMaterialControllerData(t)), e && (this.rpa = this.GKs.AddMaterialControllerData(e))
    }
    Stop(t = !1) {
        this.vJ && (Log_1.Log.CheckDebug() && Log_1.Log.Debug("Battle", 21, "OnHitMaterialAction 停止播放", ["Path", this.OKs], ["Force", t], ["Elapsed", this.NKs]), this.GKs.RemoveMaterialControllerData(this.vJ)), this.rpa && this.GKs.RemoveMaterialControllerData(this.rpa), this.vJ = 0, this.rpa = 0, this.opa = void 0, this.npa = void 0, this.VKs = !1
    }
    End() {
        Log_1.Log.CheckDebug() && Log_1.Log.Debug("Battle", 21, "OnHitMaterialAction 行为结束", ["Path", this.OKs], ["Elapsed", this.NKs]), this.WKs = !1
    }
}
let CharacterHitComponent = CharacterHitComponent_1 = class extends EntityComponent_1.EntityComponent {
    constructor() {
        super(...arguments), this.Hte = void 0, this.cBe = void 0, this.rJo = void 0, this.tVr = void 0, this.vHr = void 0, this.iVr = void 0, this.oVr = void 0, this.rVr = void 0, this.LastHitData = void 0, this.nVr = !1, this.sVr = !1, this.aVr = !1, this.hVr = [], this.lVr = [], this._Vr = [], this.uVr = [], this.cVr = 0, this.mVr = void 0, this.dVr = void 0, this.CVr = void 0, this.gVr = 0, this.RageModeId = 0, this.HardnessModeId = 0, this.BeHitBones = new Array, this.ToughDecreaseValue = 0, this.BeHitIgnoreRotate = !1, this.CounterAttackInfoInternal = void 0, this.VisionCounterAttackInfoInternal = void 0, this.BeHitTime = 0, this.NeedCalculateFallInjure = !1, this.BeHitAnim = 0, this.AcceptedNewBeHit = !1, this.EnterFk = !1, this.BeHitDirect = Vector_1.Vector.Create(), this.BeHitLocation = Vector_1.Vector.Create(), this.BeHitSocketName = void 0, this.BeHitMapping = void 0, this.fVr = !1, this.pVr = 0, this.vVr = 0, this.MVr = void 0, this.EVr = void 0, this.$zo = void 0, this.SVr = void 0, this.yVr = 0, this.IVr = !1, this.TVr = void 0, this.Gue = Rotator_1.Rotator.Create(), this.az = Quat_1.Quat.Create(), this.F1t = void 0, this.HitEffectMap = new Map, this.KKs = void 0, this.LVr = () => {
            this.DeActiveStiff("落地")
        }, this.DVr = (t, e) => {
            e === CharacterUnifiedStateTypes_1.ECharPositionState.Ground?t === CharacterUnifiedStateTypes_1.ECharPositionState.Air && this.DoubleHitInAirEffect?.Valid?TimerSystem_1.TimerSystem.Next(this.RVr, void 0, "落地击飞") : this.LVr() : t === CharacterUnifiedStateTypes_1.ECharPositionState.Air && this.DoubleHitInAirEffect.Finish()
        }, this.PVr = void 0, this.UVr = !1, this.AVr = 0, this.DDa = -1, this.xVr = Vector_1.Vector.Create(), this.wVr = Vector_1.Vector.Create(), this.oHo = Transform_1.Transform.Create(), this.BVr = Vector_1.Vector.Create(), this.bVr = Vector_1.Vector.Create(), this.DoubleHitInAirEffect = void 0, this.qVr = Vector_1.Vector.Create(), this.RVr = () => {
            var t, e;
            this.DoubleHitInAirEffect.Valid && (e = (t = this.Entity.GetComponent(163)).GetLastUpdateVelocity(), this.BVr.Set(e.X * this.DoubleHitInAirEffect.LandingBounce.X, 0, -1 * e.Z * this.DoubleHitInAirEffect.LandingBounce.Z), this.BVr.MultiplyEqual(100 / this.EVr.GetCurrentValue(EAttributeId.Proto_Mass) * (this.vHr?.CurrentTimeScale ?? 1)), this.Entity.GetComponent(160).SetMoveState(CharacterUnifiedStateTypes_1.ECharMoveState.KnockUp), t.Valid && (this.Hte.ActorQuatProxy.RotateVector(this.BVr, this.qVr), t.Active && t.SetForceSpeed(this.qVr), 3 !== t.CharacterMovement.MovementMode && t.CharacterMovement.SetMovementMode(3), t.SetGravityScale(this.DoubleHitInAirEffect.GravityScaleUp, this.DoubleHitInAirEffect.GravityScaleDown, this.DoubleHitInAirEffect.GravityScaleTop, this.DoubleHitInAirEffect.VelocityTop, this.DoubleHitInAirEffect.Duration)), this.DoubleHitInAirEffect.Finish(), this.UVr = !0, this.AVr = Time_1.Time.Frame)
        }, this.Rbr = void 0
    }
    GetHitData() {
        return this.rVr
    }
    OnInitData() {
        return this.DoubleHitInAirEffect = new DoubleHitInAirEffect, !0
    }
    OnInit() {
        return CharacterHitComponent_1.GVr || (CharacterHitComponent_1.GVr = new Set([4, 7])), this.BeHitSocketName = FNameUtil_1.FNameUtil.EMPTY, !0
    }
    OnStart() {
        return this.Hte = this.Entity.GetComponent(3), this.cBe = this.Entity.GetComponent(33), this.$zo = this.Entity.GetComponent(159), this.rJo = this.Entity.GetComponent(160), this.oVr = this.Entity.GetComponent(47), this.tVr = this.Entity.GetComponent(59), this.vHr = this.Entity.GetComponent(109), this.EVr = this.Entity.GetComponent(158), this.SVr = this.Entity.GetComponent(188), EventSystem_1.EventSystem.AddWithTarget(this.Entity, EventDefine_1.EEventName.CharOnPositionStateChanged, this.DVr), this.MVr = [], this.F1t = (t, e) => {
            this.MVr = this.MVr.filter((t => EffectSystem_1.EffectSystem.IsValid(t)));
            for (const e of this.MVr) EffectSystem_1.EffectSystem.SetTimeScale(e, t)
        }, this.PVr = (t, e) => {
            t === CharacterUnifiedStateTypes_1.ECharPositionState.Air && e === CharacterUnifiedStateTypes_1.ECharPositionState.Water && this.DeActiveStiff("落水")
        }, this.QKs(), EventSystem_1.EventSystem.AddWithTarget(this.Entity, EventDefine_1.EEventName.CharBeHitTimeScale, this.F1t), EventSystem_1.EventSystem.AddWithTarget(this.Entity, EventDefine_1.EEventName.CharOnPositionStateChanged, this.PVr), this.NVr(), !0
    }
    URe(t) {
        this.SVr?.AddTag(t)
    }
    ARe(t) {
        this.SVr?.RemoveTag(t)
    }
    OVr(t) {
        return this.SVr?.HasTag(t) ?? !1
    }
    kVr(t) {
        for (const e of t)
            if (this.OVr(e)) return !0;
        return !1
    }
    NVr() {
        var t, e, i = this.Entity.GetComponent(0);
        i.GetEntityType() !== Protocol_1.Aki.Protocol.wks.Proto_Player && ((e = i?.GetPbEntityInitData()) && ((t = (e = (0, IComponent_1.getComponent)(e.ComponentsData, "AttributeComponent"))?.HardnessModeId) && (this.HardnessModeId = t), t = e?.RageModeId) && (this.RageModeId = t), this.RefreshHardnessModeConfig(), this.RefreshRageModeConfig(), e = i?.GetEntityPropertyConfig()) && 0 < e.受击映射索引ID && (this.BeHitMapping = FightLibrary_1.FightLibrary.GetHitMapConfig(e.受击映射索引ID))
    }
    OnEnd() {
        return EventSystem_1.EventSystem.RemoveWithTarget(this.Entity, EventDefine_1.EEventName.CharOnPositionStateChanged, this.DVr), EventSystem_1.EventSystem.RemoveWithTarget(this.Entity, EventDefine_1.EEventName.CharBeHitTimeScale, this.F1t), EventSystem_1.EventSystem.RemoveWithTarget(this.Entity, EventDefine_1.EEventName.CharOnPositionStateChanged, this.PVr), this.F1t && this.F1t(1, 0), !0
    }
    OnClear() {
        return this.TVr && TimerSystem_1.TimerSystem.Has(this.TVr) && (TimerSystem_1.TimerSystem.Remove(this.TVr), this.TVr = void 0), this.Abr(), !0
    }
    GetAcceptedNewBeHitAndReset() {
        var t = this.AcceptedNewBeHit;
        return this.AcceptedNewBeHit && (this.FVr(!1), this.Entity.GetComponent(162).MainAnimInstance.AddForceUpdateSlotNameWhenMontageBlend(DEFALUT_SLOT_NAME)), t
    }
    FVr(t) {
        this.AcceptedNewBeHit !== t && (this.AcceptedNewBeHit = t, EventSystem_1.EventSystem.EmitWithTarget(this.Entity, EventDefine_1.EEventName.CharOnSetNewBeHit, this.AcceptedNewBeHit))
    }
    GetEnterFk() {
        return this.EnterFk
    }
    GetEnterFkAndReset() {
        var t = this.EnterFk;
        return this.EnterFk = !1, t
    }
    GetDoubleHitInAir() {
        return this.AVr !== Time_1.Time.Frame && (this.UVr = !1), this.UVr
    }
    SetBeHitIgnoreRotate(t) {
        this.BeHitIgnoreRotate = t
    }
    VVr() {
        return !!this.IsTriggerCounterAttack || !!this.BeHitIgnoreRotate && !CharacterHitComponent_1.GVr?.has(this.BeHitAnim) && this.rJo?.PositionState === CharacterUnifiedStateTypes_1.ECharPositionState.Ground
    }
    SetRageModeId(t) {
        this.RageModeId = t
    }
    SetHardnessModeId(t) {
        this.HardnessModeId = t, this.Entity.GetComponent(3).IsAutonomousProxy && ControllerHolder_1.ControllerHolder.CreatureController.HardnessModeChangedRequest(this.Entity.Id, t)
    }
    SetCounterAttackInfo(t) {
        this.CounterAttackInfoInternal = t, this.URe(1124064628)
    }
    SetVisionCounterAttackInfo(t) {
        this.VisionCounterAttackInfoInternal = t, this.URe(-1576849243)
    }
    SetCounterAttackAnsInfo(t) {
        this.DDa = t
    }
    GetRageMode() {
        return this.dVr
    }
    RefreshRageModeConfig() {
        0 !== this.RageModeId?(this.dVr = HardnessModeById_1.configHardnessModeById.GetConfig(this.RageModeId), this.dVr || Log_1.Log.CheckError() && Log_1.Log.Error("Character", 15, "读取RageModeConfig失败", ["id", this.RageModeId])) : this.dVr = void 0
    }
    GetHardnessMode() {
        return this.CVr
    }
    RefreshHardnessModeConfig() {
        0 !== this.HardnessModeId?(this.CVr = HardnessModeById_1.configHardnessModeById.GetConfig(this.HardnessModeId), this.CVr || Log_1.Log.CheckError() && Log_1.Log.Error("Character", 15, "读取白条表失败", ["id", this.HardnessModeId])) : this.CVr = void 0
    }
    ReceiveOnHit(t, e, i, r, o, a, n, s, h, l, c) {
        if (this.kVr(forbidHitTagIds)) this.kVr(enterFkForbidHitTagIds) && this.HVr(EntitySystem_1.EntitySystem.Get(t.BulletEntityId));
        else if ((!this.cBe?.CurrentSkill?.Active || !this.cBe.CurrentSkill.SkillInfo.OverrideHit) && i) {
            if (this.rVr = t, this.LastHitData = t, this.iVr = e, this.EnterFk = o, this.sVr = a, this.cVr = n?1 : s?2 : 0, this.fVr = !1, this.nVr = !0, this.BeHitTime = UE.GameplayStatics.GetTimeSeconds(this.Hte.Actor), this.BeHitLocation.DeepCopy(t.HitPosition), this.NeedCalculateFallInjure = !0, 0 < l && !o) {
                if (this.OVr(1447214865) && !this.IsTriggerCounterAttack) return void this.jVr();
                if (this.WVr(), this.IsTriggerCounterAttack && this.KVr(this.rVr), this.gVr = this.oVr?.TrySwitchHitState(c, !1) ?? 0, !this.oVr || this.gVr) {
                    this.BeHitAnim = c;
                    let e = (i = t.ReBulletData.Base).BeHitEffect;
                    this.sVr && (e = i.HitEffectWeakness), (a = ConfigManager_1.ConfigManager.BulletConfig.GetBulletHitData(this.iVr, e))?(CombatLog_1.CombatLog.Info("Hit", this.Entity, "远端受击"), this.Hte.SetMoveControlled(!1, 2, "远端受击"), r && this.Entity.GetComponent(3).SetActorRotation(h, "受击者旋转", !1), this.BeHitAnim = c, this.QVr(a)) : this.HVr(EntitySystem_1.EntitySystem.Get(t.BulletEntityId))
                } else this.HVr(EntitySystem_1.EntitySystem.Get(t.BulletEntityId))
            }!this.EnterFk || (n = e.GetComponent(1))?.Valid && (this.Hte.ActorLocationProxy.Subtraction(n.ActorLocationProxy, this.BeHitDirect), this.BeHitDirect.Normalize()) || this.Hte.ActorForwardProxy.Multiply(-1, this.BeHitDirect), this.jVr()
        }
    }
    XVr(t) {
        this.Hte.CreatureData.GetEntityType() !== Protocol_1.Aki.Protocol.wks.Proto_Monster || this.rJo.IsInFightState() || (this.tVr.CollectSampleAndSend(!0), e = this.Hte.CreatureData.GetPbDataId(), Log_1.Log.CheckDebug() && Log_1.Log.Debug("Character", 51, "怪物受击，主动同步位置", ["PbDataId", e]));
        var e = Protocol_1.Aki.Protocol.f4s.create(),
            i = this.iVr.GetComponent(0).GetCreatureDataId(),
            r = this.Entity.GetComponent(0).GetCreatureDataId();
        e.J4n = MathUtils_1.MathUtils.NumberToLong(i), e.sVn = MathUtils_1.MathUtils.NumberToLong(r), e.ujn = Long.fromNumber(this.rVr.BulletId), i = this.rVr.HitPosition, e.rWn = {
            X: i.X,
            Y: i.Y,
            Z: i.Z
        }, e.oWn = {
            Pitch: this.rVr.HitEffectRotation.Pitch,
            Yaw: this.rVr.HitEffectRotation.Yaw,
            Roll: this.rVr.HitEffectRotation.Roll
        }, e.nWn = {
            X: i.X,
            Y: i.Y,
            Z: i.Z
        }, e.sWn = this.BeHitAnim, e.aWn = this.EnterFk, e.hWn = this.sVr, e.lWn = 1 === this.cVr, e._Wn = 2 === this.cVr, e.uWn = this.mVr, e.cWn = this.nVr, e.mWn = this.rVr.HitPart?.toString() ?? "", e.dWn = !this.VVr() && this.nVr && !this.EnterFk, r = t.GetBulletInfo();
        e.X4n = r.BulletInitParams.SkillId, e.CWn = r.BulletInitParams.Source;
        const o = this.gVr;
        o && (e.oVn = this.oVr?.GetFightState() ?? 0), (i = Protocol_1.Aki.Protocol.y3n.create()).gWn = e, this.Yea(i), CombatMessage_1.CombatNet.Call(15363, this.Entity, i, (t => {
            o && this.oVr?.ConfirmState(o)
        }))
    }
    Yea(t) {
        ModelManager_1.ModelManager.GameModeModel.IsMulti || (t.gWn.F8n = 0, t.gWn.sVn = 0, t.gWn.cWn = !1, t.gWn.rWn = void 0, t.gWn.oWn = void 0, t.gWn.jDs = !1, t.gWn.aWn = !1, t.gWn.hWn = !1, t.gWn.uWn = void 0, t.gWn.dWn = !1, t.gWn.mWn = "", t.gWn.sWn = 0)
    }
    OnHitOne(t, e, i, r, o, a, n, s, h) {
        this.rVr = t,
        this.LastHitData = t,
        this.iVr = EntitySystem_1.EntitySystem.Get(t.Attacker.Id),
        this.nVr = e,
        this.aVr = r,
        this.hVr = a,
        this.lVr = n,
        this._Vr = s,
        this.uVr = h,
        this.IVr = o,
        this.fVr = !1,
        this.JVr(),
        this.zVr(i)
        this.IsTriggerCounterAttack && this.ZVr()
        this.t6r()
        this.o6r()
        this.iwr(i),
        this.n6r(),
        this.a6r(i)
        GlobalData_1.GlobalData.Networking() && this.XVr(i)
        this.l6r(), this.ProcessOnHitMaterial(), this.jVr()
    }

    OnHit(t, e, i, r, o, a, n, s, h) {
        var l = Global_1.Global.BaseCharacter?.CharacterActorComponent.Entity,
            c = EntitySystem_1.EntitySystem.Get(t.Target.Id),
            m = EntitySystem_1.EntitySystem.Get(t.Attacker.Id);
        if (!0 !== ModManager_1.ModManager.Settings.GodMode || c != l)
            if (!0 !== ModManager_1.ModManager.Settings.HitMultiplier || m != l) this.OnHitOne(t, e, i, r, o, a, n, s, h);
            else
                for (let l = 0; l < ModManager_1.ModManager.Settings.Hitcount; l++) this.OnHitOne(t, e, i, r, o, a, n, s, h)
    }
    jVr() {
        this.rVr = void 0, this.iVr = void 0, this.lVr = void 0, this._Vr = void 0, this.uVr = void 0, this.IVr = !1, this.gVr = 0
    }
    OnSharedHit(t, e, i, r) {
        this.rVr = t, this.LastHitData = t, this.iVr = EntitySystem_1.EntitySystem.Get(t.Attacker.Id), this.nVr = e, this.aVr = !1, this.IVr = !0, this.fVr = !1, this.JVr(), this.cVr = 0, this.t6r(), this._6r(r), this.WVr(), this.iwr(i), this.n6r(), this.a6r(i), this.l6r(), this.jVr()
    }
    ActiveStiff(t) {
        var e;
        0 !== t && (this.TVr && TimerSystem_1.TimerSystem.Has(this.TVr) && (TimerSystem_1.TimerSystem.Remove(this.TVr), this.TVr = void 0), this.URe(-2044964178), e = () => {
            this.Entity.Valid && (this.TVr = void 0, this.ARe(-2044964178))
        }, 0 < t) && (this.TVr = TimerSystem_1.TimerSystem.Delay(e, t * BattleUiDefine_1.SECOND_TO_MILLISECOND))
    }
    DeActiveStiff(t = 0) {
        this.TVr && TimerSystem_1.TimerSystem.Has(this.TVr) && (TimerSystem_1.TimerSystem.Remove(this.TVr), this.TVr = void 0), this.ARe(-2044964178)
    }
    IsStiff() {
        return this.OVr(-2044964178)
    }
    JVr() {
        this.BeHitBones.length = 0, this.rVr.HitPart && !FNameUtil_1.FNameUtil.IsNothing(this.rVr.HitPart) && this.BeHitBones.push(this.rVr.HitPart), this.BeHitBones && 0 < this.BeHitBones?.length?this.BeHitSocketName = this.BeHitBones[0] : this.BeHitSocketName = FNameUtil_1.FNameUtil.EMPTY
    }
    zVr(t) {
        this.c6r(t)?this.cVr = 2 : this.u6r(t)?this.cVr = 1 : this.cVr = 0
    }
    u6r(t) {
        if (!t.Data.Logic.CanCounterAttack) return !1;
        if (!this.OVr(1124064628)) return Log_1.Log.CheckDebug() && Log_1.Log.Debug("Character", 21, "CheckNormalCounterAttack无Tag"), !1;
        if (this.CounterAttackInfoInternal.QTE弹刀忽略角度距离检测 && (t = t.GetBulletInfo(), (t = this.iVr.GetComponent(33).GetSkillInfo(t.BulletInitParams.SkillId)) && 4 === t.SkillGenre)) return !0;
        var e = this.rVr.HitPart,
            i = this.CounterAttackInfoInternal.弹反部位,
            r = i.Num();
        let o = !1;
        if (e.op_Equality(FNameUtil_1.FNameUtil.NONE) && 0 < r) return Log_1.Log.CheckDebug() && Log_1.Log.Debug("Character", 21, "检查弹反 击中部位"), !1;
        BulletConstant_1.BulletConstant.OpenHitActorLog && Log_1.Log.CheckDebug() && Log_1.Log.Debug("Test", 21, "检查弹反 击中部位", ["部位", e.toString()]);
        for (let t = 0; t < r; t++) {
            var a = i.Get(t);
            if (BulletConstant_1.BulletConstant.OpenHitActorLog && Log_1.Log.CheckDebug() && Log_1.Log.Debug("Test", 21, "检查弹反 配置部位", ["部位", a.toString()]), a.op_Equality(e)) {
                o = !0;
                break
            }
        }
        if (!o && 0 < r) return !1;
        this.xVr.FromUeVector(this.iVr.GetComponent(3).ActorLocationProxy), o?(t = this.Hte.GetBoneLocation(e.toString()), this.wVr.FromUeVector(t), this.xVr.SubtractionEqual(this.wVr)) : this.xVr.SubtractionEqual(this.Hte.ActorLocationProxy);
        t = this.xVr.Size();
        var n = (this.xVr.Normalize(MathCommon_1.MathCommon.KindaSmallNumber), Vector_1.Vector.DotProduct(this.Hte.ActorForwardProxy, this.xVr)),
            s = Math.cos(this.CounterAttackInfoInternal.最大触发夹角 * MathUtils_1.MathUtils.DegToRad),
            h = this.CounterAttackInfoInternal.最大触发距离;
        return BulletConstant_1.BulletConstant.OpenHitActorLog && Log_1.Log.CheckDebug() && Log_1.Log.Debug("Test", 21, "检查弹反 最大距离和最大触发夹角", ["当前距离", t], ["最大触发距离", h], ["夹角cos值", n], ["最大触发夹角cos值", s]), t < h && s < n
    }
    c6r(t) {
        return !!t.Data.Logic.CanVisionCounterAttack && !!this.OVr(-1576849243)
    }
    iwr(t) {
        var e, i = this.sVr?this.rVr.ReBulletData.TimeScale.AttackerTimeScaleOnHitWeakPoint : this.rVr.ReBulletData.TimeScale.TimeScaleOnAttack;
        this.rVr.ReBulletData.TimeScale.TimeScaleOnAttackIgnoreAttacker?0 < i.时间膨胀时长 && BulletUtil_1.BulletUtil.SetTimeScale(t.GetBulletInfo(), i.优先级, i.时间膨胀值, i.时间膨胀变化曲线, i.时间膨胀时长, 1) : 0 < i.时间膨胀时长 && (this.iVr.GetComponent(109).SetTimeScale(i.优先级, i.时间膨胀值, i.时间膨胀变化曲线, i.时间膨胀时长, 1), t = this.rVr.ReBulletData.TimeScale.CharacterCustomKeyTimeScale, StringUtils_1.StringUtils.IsEmpty(t) || (e = ModelManager_1.ModelManager.BulletModel.GetEntityIdByCustomKey(this.iVr.Id, t, this.rVr.BulletId.toString()), (e = ModelManager_1.ModelManager.CharacterModel.GetHandle(e))?.Valid?e.Entity.GetComponent(109)?.SetTimeScale(i.优先级, i.时间膨胀值, i.时间膨胀变化曲线, i.时间膨胀时长, 1) : Log_1.Log.CheckWarn() && Log_1.Log.Warn("Character", 21, "", ["自定义连携顿帧单位key", t], ["子弹ID", this.rVr.BulletId]))), !this.vHr || this.rVr.ReBulletData.Base.ContinuesCollision || this.OVr(-648310348) || (e = this.rVr.ReBulletData.TimeScale, i = this.sVr?e.VictimTimeScaleOnHitWeakPoint : e.TimeScaleOnHit, BulletUtil_1.BulletUtil.SetVictimTimeScale(this.rVr.BulletEntityId, this.Entity.Id, this.vHr, i.优先级, i.时间膨胀值, i.时间膨胀变化曲线, i.时间膨胀时长, 2, e.RemoveHitTimeScaleOnDestroy))
    }
    m6r(t, e, i) {
        var r = e.Effect;
        ObjectUtils_1.ObjectUtils.SoftObjectReferenceValid(r) && t.set(r.ToAssetPathName(), !1), i && (r = e.Audio, ObjectUtils_1.ObjectUtils.SoftObjectReferenceValid(r)) && t.set(r.ToAssetPathName(), !1)
    }
    iHo() {
        var t = new Map,
            e = this.Entity.GetComponent(3);
        if (e.IsPartHit) {
            var i = this.rVr.ReBulletData.Base.EnablePartHitAudio;
            let a = !1;
            if (this.uVr && 0 < this.uVr.length)
                for (const o of this.uVr) {
                    var r = e.GetPartHitConf(o);
                    if (r) {
                        if (a = !0, r.ReplaceBulletHitEffect) return t.clear(), this.m6r(t, r, i), t;
                        this.m6r(t, r, i)
                    }
                }
            if (!a && this.rVr.HitPart && !FNameUtil_1.FNameUtil.IsNothing(this.rVr.HitPart))
                if (o = e.GetPartHitConf(this.rVr.HitPart.toString())) {
                    if (o.ReplaceBulletHitEffect) return t.clear(), this.m6r(t, o, i), t;
                    this.m6r(t, o, i)
                }
        }
        var o, a = (o = this.rVr.ReBulletData.Render.EffectOnHit).get(9);
        if (a && 0 < a.length && this.OVr(501201e3)) t.set(a, !0);
        else {
            let e = 4;
            this.sVr && (e = 7), (a = o.get(e)) && 0 !== a.length && t.set(a, !0)
        }
        return t
    }
    WVr() {
        if (!(this.rVr.ReBulletData.Base.DamageId <= 0)) {
            var t = this.iHo();
            if (0 < t.size) {
                var e = this.rVr.ReBulletData.Render,
                    i = e.EffectOnHitConf.get(0),
                    r = this.rVr.HitPosition;
                i = i?i.Scale : Vector_1.Vector.OneVectorProxy, r = (this.oHo.Set(r, this.rVr.HitEffectRotation.Quaternion(), i), this.rVr.Attacker?.GetComponent(43));
                let h = !1;
                (0, RegisterComponent_1.isComponentInstance)(r, 173) && (h = "p1" === r.Priority.State);
                var o = BulletStaticFunction_1.HitStaticFunction.CreateEffectContext(this.rVr.Attacker, h);
                const l = e.AudioOnHit;
                var a, n, s = (t, e) => {
                    BulletStaticFunction_1.HitStaticFunction.PlayHitAudio(t, e, l, h)
                };
                for ([a, n] of t) EffectSystem_1.EffectSystem.SpawnEffect(GlobalData_1.GlobalData.World, this.oHo.ToUeTransform(), a, "[CharacterHitComponent.ProcessHitEffect]", o, void 0, void 0, n?s : void 0)
            }
        }
    }
    o6r() {
        this.d6r();
        var t = this.C6r(this.rVr);
        this.hVr && 0 < this.hVr.length?this.g6r(this.hVr, t) : (this.f6r(this.lVr, t), this.IVr && this.p6r(this._Vr, t))
    }
    _6r(t) {
        var e;
        this.rVr.Attacker.CheckGetComponent(3).IsAutonomousProxy && (e = this.C6r(this.rVr), e = this.v6r(e, !1, !1, void 0, t), this.ToughDecreaseValue = e.ToughResult)
    }
    g6r(t, e) {
        let i = !1;
        for (const e of t) i ||= e.IsTransferDamage;
        for (const a of t) {
            var r = !(a.SeparateDamage && i),
                o = this.v6r(e, !1, r, a.Index);
            r || (this.ToughDecreaseValue = o.ToughResult)
        }
        i && (t = this.v6r(e, !1, !i, t[0].Index), this.ToughDecreaseValue = t.ToughResult)
    }
    f6r(t, e) {
        if (t) {
            this.sVr = !1;
            for (const r of t) {
                var i = r.IsWeaknessHit;
                this.sVr ||= i, this.v6r(e, i, !1, r.Index)
            }
        }
    }
    p6r(t, e) {
        var i;
        t && 0 < t.length?(i = (t = t[0]).IsWeaknessHit, this.sVr ||= i, i = this.v6r(e, this.sVr, !1, t.Index), this.ToughDecreaseValue = i.ToughResult) : (t = this.v6r(e, this.sVr, !1), this.ToughDecreaseValue = t.ToughResult)
    }
    v6r(t, e, i, r = -1, o = 1) {
        var a, n, s = t.ReBulletData.Base.DamageId,
        h = t.Target.GetComponent(18), n = t.Target.GetComponent(33)
        a = EntitySystem_1.EntitySystem.Get(t.BulletEntityId)?.GetBulletInfo().ContextId
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
            CounterSkillMessageId: this.IsTriggerCounterAttack?n.CurrentSkill?.CombatMessageId : void 0,
            BulletId: t.BulletId,
            CounterSkillId: this.IsTriggerCounterAttack?Number(n.CurrentSkill?.SkillId) : void 0
        }
        
        if (ModManager_1.ModManager.Settings.hitAll) {
            ModelManager_1.ModelManager.CreatureModel.GetAllEntities().forEach(entity => {
                if (EntityManager_1.EntityManager.isMonster(entity) && KillAura_1.KillAura.isIndistance(entity)) {
                    try {
                        TimerSystem_1.TimerSystem.Delay(() => {
                            const Entity = entity.Entity;
                            if (Entity && EntitySystem_1.EntitySystem.Get(t.BulletEntityId)?.GetBulletInfo()) {
                                const entityPos = Entity.GetComponent(3).ActorLocationProxy;
                                if (Entity.GetComponent(18) && Entity.GetComponent(33) && entityPos) {
                                    dict.HitPosition = entityPos.ToUeVector();
                                    if (ModManager_1.ModManager.Settings.killAuraState == 1) {
                                        dict.DamageDataId = 1205401001n
                                        Entity.GetComponent(18)?.ExecuteBulletDamage(t.BulletEntityId, dict, a)
                                        dict.DamageDataId = 1301400001n
                                        Entity.GetComponent(18)?.ExecuteBulletDamage(t.BulletEntityId, dict, a)
                                    } else {
                                        Entity.GetComponent(18)?.ExecuteBulletDamage(t.BulletEntityId, dict, a)
                                    }
                                }
                            }
                        }, Math.floor(Math.random() * 500) + 20)
                    } catch {
                        
                    }
                }
            })
        };
        
        return s < 1 || !h?{
            DamageResult: 0,
            ToughResult: 0
        } : (h && n?(h?.ExecuteBulletDamage(t.BulletEntityId, dict, a)) : {
            DamageResult: 1e4,
            ToughResult: 0
        });
    }
    C6r(t) {
        return (t = Object.assign(t)).Attacker = this.iVr.GetComponent(48).GetAttributeHolder(), t.Target = this.Entity.GetComponent(48)?.GetAttributeHolder() ?? this.Entity, t
    }
    n6r() {
        var t, e;
        CameraController_1.CameraController.Model.IsModeEnabled(2) || CameraController_1.CameraController.Model.IsModeEnabled(1) || !this.rVr.IsShaking || (e = this.rVr.ReBulletData.Render, t = this.sVr?e.AttackerCameraShakeOnHitWeakPoint : e.AttackerCameraShakeOnHit, e = e.VictimCameraShakeOnHit, 0 < t.length?ResourceSystem_1.ResourceSystem.LoadAsync(t, UE.Class, (t => {
            var e = Global_1.Global.CharacterCameraManager.GetCameraLocation();
            CameraController_1.CameraController.PlayWorldCameraShake(t, e, 0, exports.OUTER_RADIUS, 1, !1)
        })) : 0 < e.length && ResourceSystem_1.ResourceSystem.LoadAsync(e, UE.Class, (t => {
            var e = Global_1.Global.CharacterCameraManager.GetCameraLocation();
            CameraController_1.CameraController.PlayWorldCameraShake(t, e, 0, exports.OUTER_RADIUS, 1, !1)
        })))
    }
    HVr(t) {
        !t || t.Data.Base.DamageId <= 0 || (this.EnterFk = !0, t = t.GetBulletInfo(), BulletUtil_1.BulletUtil.GetHitRotator(t, this.Hte, this.Gue), this.Gue.Quaternion(this.az), this.az.RotateVector(Vector_1.Vector.ForwardVectorProxy, this.BeHitDirect), this.BeHitDirect.MultiplyEqual(-1), this.M6r(0))
    }
    a6r(t) {
        if (this.IsTriggerCounterAttack && this.KVr(this.rVr), this.kVr(forbidHitTagIds)) this.nVr = !1, this.kVr(enterFkForbidHitTagIds) && this.HVr(t);
        else if (this.nVr) {
            var e = this.rVr.ReBulletData.Base;
            let r = e.BeHitEffect;
            if (this.sVr && (r = e.HitEffectWeakness), e = ConfigManager_1.ConfigManager.BulletConfig.GetBulletHitData(this.iVr, r)) {
                this.BeHitTime = UE.GameplayStatics.GetTimeSeconds(this.Hte.Actor);
                var i = this.EVr?.GetCurrentValue(EAttributeId.Proto_Tough) ?? 0;
                if (this.BeHitLocation.DeepCopy(this.rVr.HitPosition), this.NeedCalculateFallInjure = !0, !(0 < i || this.ToughDecreaseValue <= 0 || this.OVr(1447214865)) || this.IsTriggerCounterAttack && this.fVr) {
                    let r = 0;
                    e && (r = this.fVr?7 : e.被击动作), r = this.y6r(r), this.oVr && (this.gVr = this.oVr.TrySwitchHitState(r, !0), !this.gVr)?this.HVr(t) : (RoleAudioController_1.RoleAudioController.OnPlayerIsHit(this.Entity), CombatLog_1.CombatLog.Info("Hit", this.Entity, "受击", ["BeHitAnim", r]), ModelManager_1.ModelManager.GameModeModel.IsMulti && this.Hte.SetMoveControlled(!0, 2, "受击"), this.BeHitAnim = r, this.EnterFk = !1, i = t.GetBulletInfo(), this.VVr()?(BulletUtil_1.BulletUtil.GetHitRotator(i, this.Hte, this.Gue), this.mVr = this.Gue.ToUeRotator()) : this.mVr = BulletUtil_1.BulletUtil.SetHitRotator(i, this.Hte, this.rVr.HitEffect.受击朝向Z轴偏转), this.I6r(), this.VVr() && (this.BeHitAnim = BulletUtil_1.BulletUtil.GetOverrideHitAnimByAngle(this.Hte, this.BeHitAnim, this.mVr.Yaw)), this.L6r(e), this.M6r(lightHits.has(this.BeHitAnim)?1 : 2))
                } else this.HVr(t)
            }
        }
    }
    t6r() {
        this.OVr(1124064628) && this.$zo.RemoveBuffByTag(1124064628, "撞墙或受击逻辑触发移除")
    }
    l6r() {
        if (this.rVr) {
            let i = 0;
            var t = this.nVr && !this.EnterFk;
            2 !== this.cVr || this.fVr || (i = this.VisionCounterAttackInfoInternal.对策事件ID, GlobalData_1.GlobalData.BpEventManager.当触发对策事件时.Broadcast(this.VisionCounterAttackInfoInternal.对策事件ID, this.rVr.ToUeHitInformation()));
            var e = EntitySystem_1.EntitySystem.Get(this.rVr.BulletEntityId).GetBulletInfo();
            e = Number(e.BulletInitParams.SkillId), t = {
                Attacker: this.iVr,
                Target: this.Entity,
                BulletId: this.rVr.BulletId,
                HasBeHitAnim: t,
                BeHitAnim: this.BeHitAnim,
                VisionCounterAttackId: i,
                CounterAttackType: this.cVr,
                SkillId: e,
                SkillGenre: this.iVr?.GetComponent(33)?.GetSkillInfo(e)?.SkillGenre ?? 0
            };
            this.iVr && (SceneTeamController_1.SceneTeamController.EmitEvent(this.iVr, EventDefine_1.EEventName.CharHitLocal, this.rVr, t), e = this.iVr.GetComponent(0)) && (e = e.IsVision()?this.iVr.GetComponent(48)?.GetAttributeHolder() : this.iVr) && SceneTeamController_1.SceneTeamController.EmitEvent(e, EventDefine_1.EEventName.CharHitIncludingVision, this.rVr, t), SceneTeamController_1.SceneTeamController.EmitEvent(this.Entity, EventDefine_1.EEventName.CharBeHitLocal, this.rVr, t), GlobalData_1.GlobalData.BpEventManager.当有角色受击时.Broadcast(this.Hte.Actor, this.rVr.ToUeHitInformation())
        } else CombatLog_1.CombatLog.Error("Hit", this.Entity, "HitData为空")
    }
    L6r(t) {
        if (this.OVr(504239013) && (e = this.Entity.GetComponent(163)).Valid && e.CharacterMovement.SetMovementMode(3), this.FVr(!0), this.Entity.GetComponent(160).ExitAimStatus(), EventSystem_1.EventSystem.EmitWithTarget(this.Entity, EventDefine_1.EEventName.CharBeHitAnim), (e = this.Entity.GetComponent(162)).Valid && e.MainAnimInstance && (e.MainAnimInstance.Montage_Stop(0), e.MainAnimInstance.ForceSetCurrentMontageBlendTime(0, void 0)), this.D6r(), this.OVr(-1732582420)) {
            var e, i = (e = t.地面受击滞空).滞空时间 + e.到滞空点时间;
            this.R6r(i)?this.U6r(e, i) : this.A6r(t)
        } else if (!this.OVr(-648310348))
            if (this.OVr(-1898186757)) {
                if (4 === this.BeHitAnim) {
                    if (i = (e = t.地面受击滞空).滞空时间 + e.到滞空点时间, this.R6r(i)) return void this.U6r(e, i);
                    if (0 < t.地面受击速度.Z) return void this.P6r(t, !1)
                }
                this.A6r(t)
            } else i = (e = t.空中受击滞空).滞空时间 + e.到滞空点时间, this.R6r(i)?this.U6r(e, i) : this.P6r(t, !0)
    }
    U6r(t, e) {
        var i, r, o, a = this.Entity.GetComponent(163);
        a.Valid && (i = this.Hte, r = WhirlpoolPoint_1.WhirlpoolPoint.GenId(), this.BVr.FromUeVector(t.滞空相对位置), MathUtils_1.MathUtils.TransformPosition(i.ActorLocationProxy, i.ActorRotationProxy, i.ActorScaleProxy, this.BVr, this.bVr), (o = this.iVr.GetComponent(3).ActorLocationProxy.Z + t.滞空高度限制) < this.bVr.Z && (this.bVr.Z = o), a.BeginWhirlpool(r, t.到滞空点时间, this.bVr, i.ActorLocationProxy, e, t.到滞空点曲线))
    }
    R6r(t) {
        return 0 < t
    }
    QVr(t) {
        this.FVr(!0), this.Entity.GetComponent(160).ExitAimStatus(), EventSystem_1.EventSystem.EmitWithTarget(this.Entity, EventDefine_1.EEventName.CharBeHitAnim);
        var e = this.Entity.GetComponent(162);
        e.Valid && e.MainAnimInstance && (e.MainAnimInstance.Montage_Stop(0), e.MainAnimInstance.ForceSetCurrentMontageBlendTime(0, void 0)), this.D6r(), 4 === this.BeHitAnim?this.P6r(t, !1) : this.A6r(t)
    }
    D6r() {
        switch (this.BeHitAnim) {
            case 0:
            case 1:
            case 8:
            case 9:
                this.Entity.GetComponent(160).SetMoveState(CharacterUnifiedStateTypes_1.ECharMoveState.SoftKnock);
                break;
            case 2:
            case 3:
            case 10:
            case 11:
            case 6:
                this.Entity.GetComponent(160).SetMoveState(CharacterUnifiedStateTypes_1.ECharMoveState.HeavyKnock);
                break;
            case 4:
                this.Entity.GetComponent(160).SetMoveState(CharacterUnifiedStateTypes_1.ECharMoveState.KnockUp);
                break;
            case 5:
                this.Entity.GetComponent(160).SetMoveState(CharacterUnifiedStateTypes_1.ECharMoveState.KnockDown);
                break;
            case 7:
                this.Entity.GetComponent(160).SetMoveState(CharacterUnifiedStateTypes_1.ECharMoveState.Parry)
        }
    }
    P6r(t, e) {
        this.ActiveStiff(-1);
        var i, r = this.Entity.GetComponent(163);
        r.Valid && (i = this.Hte, this.BVr.FromUeVector(e?t.空中受击速度 : t.地面受击速度), e = this.EVr?.GetCurrentValue(EAttributeId.Proto_Mass) ?? 100, this.BVr.MultiplyEqual(100 / e), this.Entity.GetComponent(160).SetMoveState(CharacterUnifiedStateTypes_1.ECharMoveState.KnockUp), r.GetWhirlpoolEnable() && r.EndWhirlpool(), 3 !== r.CharacterMovement.MovementMode && r.CharacterMovement.SetMovementMode(3), i.ActorQuatProxy.RotateVector(this.BVr, this.bVr), r.Active && r.SetForceFallingSpeed(this.bVr, 31862857), i = 0 < (e = t.空中受击移动时间)?e : t.地面受击移动时间, r.SetGravityScale(t.上升标量, t.下落标量, t.弧顶标量, t.速度阈值, i), 0 < t.落地反弹.Z?this.DoubleHitInAirEffect.FromUeHitEffect(t) : this.DoubleHitInAirEffect.Finish())
    }
    A6r(t) {
        var e, i = new UE.Vector(t.地面受击速度.X, t.地面受击速度.Y, 0),
            r = t.地面受击最小速度,
            o = t.地面受击最大速度,
            a = t.地面受击移动时间,
            n = t.命中硬直时间;
        t = t.地面受击移动曲线;
        0 < a && (e = this.EVr?.GetCurrentValue(EAttributeId.Proto_Mass) ?? 100, i = i.op_Multiply(100 / e), (e = this.Entity.GetComponent(163)).Valid) && (e.GetWhirlpoolEnable() && e.EndWhirlpool(), this.yVr = e.SetAddMove(i, a, void 0, this.yVr, t, r, o)), this.ActiveStiff(n)
    }
    y6r(t) {
        return !this.BeHitMapping || this.BeHitMapping.ID <= 0?t : this.BeHitMapping.映射表.Get(t)
    }
    ZVr() {
        RoleAudioController_1.RoleAudioController.PlayRoleAudio(this.iVr, 2005);
        var t = this.iVr.CheckGetComponent(159);
        switch (this.cBe?.SetCurSkillAnIndex(this.DDa), this.cVr) {
            case 1:
                0 < this.CounterAttackInfoInternal.攻击者应用BuffID && t.AddBuffFromAnimNotify(this.CounterAttackInfoInternal.攻击者应用BuffID, this.$zo, {
                    InstigatorId: t.CreatureDataId,
                    Reason: "拼刀攻击者应用Buff"
                }), 0 < this.CounterAttackInfoInternal.被弹反者应用BuffID && this.$zo?.AddBuffFromAnimNotify(this.CounterAttackInfoInternal.被弹反者应用BuffID, void 0, {
                    InstigatorId: this.$zo?.CreatureDataId,
                    Reason: "拼刀受击者应用Buff"
                });
                break;
            case 2:
                0 < this.VisionCounterAttackInfoInternal.攻击者应用BuffID && t.AddBuffFromAnimNotify(this.VisionCounterAttackInfoInternal.攻击者应用BuffID, this.$zo, {
                    InstigatorId: t.CreatureDataId,
                    Reason: "对策攻击者应用Buff"
                }), 0 < this.VisionCounterAttackInfoInternal.被对策者应用BuffID && this.$zo?.AddBuffFromAnimNotify(this.VisionCounterAttackInfoInternal.被对策者应用BuffID, void 0, {
                    InstigatorId: this.$zo?.CreatureDataId,
                    Reason: "对策受击者应用Buff"
                })
        }
        t.AddBuff(CharacterBuffIds_1.buffId.CounterInvincibleCommon, {
            InstigatorId: t.CreatureDataId,
            Reason: "弹反攻击者无敌"
        })
    }
    KVr(t) {
        switch (this.cVr) {
            case 1:
                this.x6r(t);
                break;
            case 2:
                this.w6r(t)
        }
    }
    x6r(t) {
        let e = this.CounterAttackInfoInternal.无弹反动作效果;
        this.fVr = this.B6r(), this.fVr && (e = this.CounterAttackInfoInternal.有弹反动作效果), this.b6r(t, e), this.q6r(e), this.iVr.GetComponent(3).IsAutonomousProxy && this.G6r(e), this.N6r(), t = this.CounterAttackInfoInternal?.结束事件Tag, t?.TagName !== StringUtils_1.NONE_STRING && this.SVr?.AddTag(t?.TagId ?? 0)
    }
    w6r(t) {
        this.fVr = !this.VisionCounterAttackInfoInternal.广播对策事件;
        var e = this.VisionCounterAttackInfoInternal.对策动作效果;
        this.b6r(t, e), this.q6r(e), this.iVr.GetComponent(3).IsAutonomousProxy && !this.OVr(1161958668) && this.G6r(e), this.N6r()
    }
    d6r() {
        !this.$zo || 1 !== this.cVr || (this.$zo.HasBuffAuthority() && 0 < this.CounterAttackInfoInternal.ANS期间被弹反者生效的BuffID && (this.cBe?.SetCurSkillAnIndex(this.DDa), this.$zo.AddBuffFromAnimNotify(this.CounterAttackInfoInternal.ANS期间被弹反者生效的BuffID, void 0, {
            InstigatorId: this.$zo.CreatureDataId,
            Reason: "弹反ANS附加的buff"
        })), this.CounterAttackInfoInternal.削韧倍率 <= 1) || (this.pVr = this.$zo.AddAttributeRateModifierLocal(EAttributeId.Proto_ToughReduce, this.CounterAttackInfoInternal.削韧倍率, "弹反修改韧性倍率"))
    }
    CounterAttackEnd() {
        this.pVr && this.$zo?.RemoveBuffByHandle(this.pVr), this.$zo?.RemoveBuff(this.CounterAttackInfoInternal.ANS期间被弹反者生效的BuffID, -1, "结束弹反ANS附加的buff"), this.ARe(1124064628), Log_1.Log.CheckDebug() && Log_1.Log.Debug("Character", 21, "CounterAttackEnd", ["CounterAttackType", this.cVr]), this.cVr = 0
    }
    VisionCounterAttackEnd() {
        this.ARe(-1576849243)
    }
    B6r() {
        if (!this.CounterAttackInfoInternal.受击动画忽略Buff检测 && this.$zo) {
            var t = this.CounterAttackInfoInternal.检测Buff列表;
            for (let r = 0; r < t.Num(); r++) {
                var e = t.Get(r),
                    i = this.$zo.GetBuffTotalStackById(e.BuffID, !1);
                if (e.层数 > i) return !1
            }
        }
        return !0
    }
    SetCounterAttackEndTime(t) {
        var e = this.Entity.GetComponent(162).MainAnimInstance;
        e && (this.vVr = t + e.Montage_GetPosition(e.GetCurrentActiveMontage()))
    }
    OnHitByWall(t, e) {
        var i;
        this.rVr = void 0, this.BeHitBones.length = 0, this.BeHitSocketName = FNameUtil_1.FNameUtil.EMPTY, this.cVr = 0, this.fVr = !1, this.t6r(), this.OVr(1008164187) || (this.BeHitTime = UE.GameplayStatics.GetTimeSeconds(this.Hte.Actor), this.EnterFk = !1, i = Rotator_1.Rotator.Create(), MathUtils_1.MathUtils.LookRotationUpFirst(e, Vector_1.Vector.UpVectorProxy, i), this.Hte.SetActorRotation(i.ToUeRotator(), "OnHitByWall", !1), this.L6r(t))
    }
    OnReboundSuccess(t, e) {
        var i = BulletStaticFunction_1.HitStaticFunction.CreateEffectContext(this.Entity);
        (e = EffectSystem_1.EffectSystem.SpawnEffect(GlobalData_1.GlobalData.World, e, t.ToAssetPathName(), "[CharacterHitComponent.OnReboundSuccess]", i)) && EffectSystem_1.EffectSystem.IsValid(e) && ((t = this.vHr) && (i = t.CurrentTimeScale, EffectSystem_1.EffectSystem.SetTimeScale(e, i * this.TimeDilation)), this.MVr.push(e))
    }
    static HitEndRequest(t) {
        var e = Protocol_1.Aki.Protocol.I3n.create();
        CombatMessage_1.CombatNet.Call(1680, t, e, this.O6r)
    }
    static PreHitNotify(t, e) {
        return e.gWn?.cWn && !e.gWn.aWn && (t = t.GetComponent(47)) && !t.PreSwitchRemoteFightState(e.gWn.oVn) && (e.gWn.aWn = !0, e.gWn.oVn = 0), !0
    }
    static HitNotify(t, e) {
        var i, r, o, a = MathUtils_1.MathUtils.LongToNumber(e.gWn.J4n),
            n = ModelManager_1.ModelManager.CreatureModel.GetEntity(a);
        n?.Valid?(i = e.gWn.ujn?MathUtils_1.MathUtils.LongToBigInt(e.gWn.ujn).toString() : "", (r = ConfigManager_1.ConfigManager.BulletConfig.GetBulletData(n.Entity, i))?(r = new BulletTypes_1.HitInformation(n.Entity, t, void 0, 0, void 0, e.gWn.jDs ?? !1, void 0, void 0, 0, r, ""), e.gWn.oWn && r.HitEffectRotation.Set(e.gWn.oWn.Pitch, e.gWn.oWn.Yaw, e.gWn.oWn.Roll), e.gWn.nWn && r.HitPosition.Set(e.gWn.nWn.X, e.gWn.nWn.Y, e.gWn.nWn.Z), e.gWn.mWn && (r.HitPart = FNameUtil_1.FNameUtil.GetDynamicFName(e.gWn.mWn)), o = WorldGlobal_1.WorldGlobal.ToUeRotator(e.gWn.uWn), t?.GetComponent(52)?.ReceiveOnHit(r, n.Entity, e.gWn.cWn ?? !1, e.gWn.dWn ?? !1, e.gWn.aWn ?? !1, e.gWn.hWn ?? !1, e.gWn.lWn ?? !1, e.gWn._Wn ?? !1, o, e.gWn.oVn, e.gWn.sWn), t?.GetComponent(52)?.VUn(n.Entity, e.gWn)) : Log_1.Log.CheckError() && Log_1.Log.Error("World", 15, `[ControllerHolder.CreatureController.HitNotify] 子弹数据不存在;${i}。`)) : Log_1.Log.CheckWarn() && Log_1.Log.Warn("World", 15, "[ControllerHolder.CreatureController.HitNotify] 攻击者为空，不存在动态实体:" + a)
    }
    VUn(t, e) {
        var i;
        t && e && t && (i = e.X4n, e = {
            Attacker: t,
            Target: this.Entity,
            BulletId: MathUtils_1.MathUtils.LongToNumber(e.ujn),
            HasBeHitAnim: !1,
            BeHitAnim: e.sWn ?? 0,
            VisionCounterAttackId: 0,
            CounterAttackType: e._Wn?2 : e.lWn?1 : 0,
            SkillId: i,
            SkillGenre: t?.GetComponent(33)?.GetSkillInfo(i)?.SkillGenre ?? 0
        }, SceneTeamController_1.SceneTeamController.EmitEvent(t, EventDefine_1.EEventName.CharHitRemote, e), SceneTeamController_1.SceneTeamController.EmitEvent(this.Entity, EventDefine_1.EEventName.CharBeHitRemote, e))
    }
    b6r(t, e) {
        var i = e.特效DA;
        i.AssetPathName && this.PlayCounterAttackEffect(t, i.AssetPathName?.toString(), e.特效Scale)
    }
    PlayCounterAttackEffect(t, e, i) {
        e && (i = new UE.Transform(t.HitEffectRotation.ToUeRotator(), t.HitPosition.ToUeVector(), i), t = BulletStaticFunction_1.HitStaticFunction.CreateEffectContext(t.Attacker), i = EffectSystem_1.EffectSystem.SpawnEffect(GlobalData_1.GlobalData.World, i, e, "[CharacterHitComponent.BeCounterattack]", t), EffectSystem_1.EffectSystem.IsValid(i)) && ((e = this.vHr) && (t = e.CurrentTimeScale, EffectSystem_1.EffectSystem.SetTimeScale(i, t * this.TimeDilation)), this.MVr.push(i))
    }
    q6r(t) {
        var e = t.被击者顿帧;
        this.vHr?.SetTimeScale(e.优先级, e.时间膨胀值, e.时间膨胀变化曲线, e.时间膨胀时长, 4), e = t.攻击者顿帧, this.iVr.GetComponent(109).SetTimeScale(e.优先级, e.时间膨胀值, e.时间膨胀变化曲线, e.时间膨胀时长, 3)
    }
    G6r(t) {
        var e;
        CameraController_1.CameraController.Model.IsModeEnabled(2) || CameraController_1.CameraController.Model.IsModeEnabled(1) || (e = ModelManager_1.ModelManager.CameraModel.FightCamera.GetComponent(4).CameraActor.K2_GetActorLocation(), CameraController_1.CameraController.PlayWorldCameraShake(t.震屏, e, 0, exports.OUTER_RADIUS, 1, !1)), CameraController_1.CameraController.FightCamera.LogicComponent.ApplyCameraModify(t.摄像机设置.Tag, t.摄像机设置.持续时间, t.摄像机设置.淡入时间, t.摄像机设置.淡出时间, t.摄像机设置.摄像机配置, void 0, t.摄像机设置.打断淡出时间, void 0, void 0, void 0, t.摄像机设置.CameraAttachSocket)
    }
    N6r() {
        var t;
        this.kVr(forbidHitTagIds) || (t = this.Entity.GetComponent(162)).Valid && t.MontageSetPosition(this.vVr)
    }
    get IsTriggerCounterAttack() {
        return 0 !== this.cVr
    }
    I6r() {
        var t;
        this.Entity.GetComponent(16) && (t = this.rVr.ReBulletData.TimeScale.TimeScaleEffectImmune * CommonDefine_1.MILLIONSECOND_PER_SECOND) >= TimerSystem_1.MIN_TIME && this.AddImmuneTimeScaleEffectTimer(t)
    }
    AddImmuneTimeScaleEffectTimer(t) {
        const e = t => {
            for (const e of this.$zo.BuffEffectManager.FilterById(17)) t?e.StartTimeScaleEffect() : e.StopTimeScaleEffect();
            var e = this.vHr;
            t?e.ResumePauseLock() : e.ImmunePauseLock()
        };
        this.Abr() || e(!1), this.Rbr = TimerSystem_1.TimerSystem.Delay((() => {
            this.Rbr = void 0, e(!0)
        }), t)
    }
    Abr() {
        return !(!TimerSystem_1.TimerSystem.Has(this.Rbr) || (TimerSystem_1.TimerSystem.Remove(this.Rbr), this.Rbr = void 0))
    }
    IsImmuneTimeScaleEffect() {
        return TimerSystem_1.TimerSystem.Has(this.Rbr)
    }
    M6r(t) {
        this.Entity === Global_1.Global.BaseCharacter?.GetEntityNoBlueprint() && GamepadController_1.GamepadController.PlayForceFeedbackByHit(t)
    }
    GetAttackerEntity() {
        return this.iVr
    }
    QKs() {
        this.Hte?.CreatureData.IsRealMonster() && this.Hte.Actor.CharRenderingComponent && (this.KKs = new OnHitMaterialAction(this.Hte.Actor.CharRenderingComponent, this.vHr))
    }
    ProcessOnHitMaterial() {
        if (ModelManager_1.ModelManager.BulletModel.OpenHitMaterial && this.KKs) {
            var t = this.rVr.ReBulletData.Render.OnHitMaterialEffect;
            if (!StringUtils_1.StringUtils.IsNothing(t)) {
                var e = this.rVr.BulletEntityId,
                    i = this.iVr.Id;
                if (this.KKs.ComparePriority(e, i)) {
                    let o;
                    this.KKs.Stop(!0);
                    var r = this.rVr.HitPart;
                    r && !FNameUtil_1.FNameUtil.IsNothing(r) && (r = r.toString(), Log_1.Log.CheckDebug() && Log_1.Log.Debug("Character", 21, "OnHitMaterialAction 命中部位", ["Part", r]), r = this.Hte.GetPartConf(r)?.MaterialEffect) && UE.KismetSystemLibrary.IsValidSoftObjectReference(r) && (o = r.ToAssetPathName()), this.KKs.Start(t, ModelManager_1.ModelManager.BulletModel.OnHitMaterialMsDelay, e, i, o)
                }
            }
        }
    }
};
CharacterHitComponent.GVr = void 0, CharacterHitComponent.$Vr = void 0, CharacterHitComponent.YVr = void 0, CharacterHitComponent.e6r = void 0, CharacterHitComponent.i6r = void 0, CharacterHitComponent.r6r = void 0, CharacterHitComponent.s6r = void 0, CharacterHitComponent.h6r = void 0, CharacterHitComponent.hpa = void 0, CharacterHitComponent.rHo = void 0, CharacterHitComponent.E6r = void 0, CharacterHitComponent.S6r = void 0, CharacterHitComponent.T6r = void 0, CharacterHitComponent.O6r = t => {}, __decorate([CombatMessage_1.CombatNet.PreHandle("gFn")], CharacterHitComponent, "PreHitNotify", null), __decorate([CombatMessage_1.CombatNet.SyncHandle("gFn")], CharacterHitComponent, "HitNotify", null), CharacterHitComponent = CharacterHitComponent_1 = __decorate([(0, RegisterComponent_1.RegisterComponent)(52)], CharacterHitComponent), exports.CharacterHitComponent = CharacterHitComponent;