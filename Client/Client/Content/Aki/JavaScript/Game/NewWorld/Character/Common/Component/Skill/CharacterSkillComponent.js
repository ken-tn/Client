"use strict";
var CharacterSkillComponent_1,
  __decorate =
    (this && this.__decorate) ||
    function (t, e, i, r) {
      var o,
        l = arguments.length,
        n =
          l < 3
            ? e
            : null === r
            ? (r = Object.getOwnPropertyDescriptor(e, i))
            : r;
      if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        n = Reflect.decorate(t, e, i, r);
      else
        for (var a = t.length - 1; 0 <= a; a--)
          (o = t[a]) &&
            (n = (l < 3 ? o(n) : 3 < l ? o(e, i, n) : o(e, i)) || n);
      return 3 < l && n && Object.defineProperty(e, i, n), n;
    };
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.CharacterSkillComponent = exports.SKILL_GROUP_MAIN = void 0);
const puerts_1 = require("puerts"),
  UE = require("ue"),
  Log_1 = require("../../../../../../Core/Common/Log"),
  Stats_1 = require("../../../../../../Core/Common/Stats"),
  CommonParamById_1 = require("../../../../../../Core/Define/ConfigCommon/CommonParamById"),
  Protocol_1 = require("../../../../../../Core/Define/Net/Protocol"),
  Entity_1 = require("../../../../../../Core/Entity/Entity"),
  EntityComponent_1 = require("../../../../../../Core/Entity/EntityComponent"),
  EntitySystem_1 = require("../../../../../../Core/Entity/EntitySystem"),
  RegisterComponent_1 = require("../../../../../../Core/Entity/RegisterComponent"),
  ResourceSystem_1 = require("../../../../../../Core/Resource/ResourceSystem"),
  TimerSystem_1 = require("../../../../../../Core/Timer/TimerSystem"),
  DataTableUtil_1 = require("../../../../../../Core/Utils/DataTableUtil"),
  FNameUtil_1 = require("../../../../../../Core/Utils/FNameUtil"),
  Rotator_1 = require("../../../../../../Core/Utils/Math/Rotator"),
  Transform_1 = require("../../../../../../Core/Utils/Math/Transform"),
  Vector_1 = require("../../../../../../Core/Utils/Math/Vector"),
  MathUtils_1 = require("../../../../../../Core/Utils/MathUtils"),
  EventDefine_1 = require("../../../../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../../../../Common/Event/EventSystem"),
  EffectSystem_1 = require("../../../../../Effect/EffectSystem"),
  Global_1 = require("../../../../../Global"),
  GlobalData_1 = require("../../../../../GlobalData"),
  ConfigManager_1 = require("../../../../../Manager/ConfigManager"),
  ControllerHolder_1 = require("../../../../../Manager/ControllerHolder"),
  ModelManager_1 = require("../../../../../Manager/ModelManager"),
  FormationAttributeController_1 = require("../../../../../Module/Abilities/FormationAttributeController"),
  SkillMessageController_1 = require("../../../../../Module/CombatMessage/SkillMessageController"),
  SceneTeamController_1 = require("../../../../../Module/SceneTeam/SceneTeamController"),
  PreloadDefine_1 = require("../../../../../Preload/PreloadDefine"),
  ActorUtils_1 = require("../../../../../Utils/ActorUtils"),
  CombatLog_1 = require("../../../../../Utils/CombatLog"),
  BlackboardController_1 = require("../../../../../World/Controller/BlackboardController"),
  CharacterAbilityComponent_1 = require("../Abilities/CharacterAbilityComponent"),
  CharacterBuffIds_1 = require("../Abilities/CharacterBuffIds"),
  CharacterUnifiedStateTypes_1 = require("../Abilities/CharacterUnifiedStateTypes"),
  CustomMovementDefine_1 = require("../Move/CustomMovementDefine"),
  Skill_1 = require("./Skill"),
  ModManager_1 = require("../../../../../Manager/ModManager"),
  SkillBehaviorAction_1 = require("./SkillBehavior/SkillBehaviorAction"),
  SkillBehaviorCondition_1 = require("./SkillBehavior/SkillBehaviorCondition");
var EAttributeId = Protocol_1.Aki.Protocol.Bks;
const ROLLING_GROUNDED_RECOVER_TIME = 600,
  DEFAULT_CD_TIME = -1,
  HIT_CASE_SOCKET_NAME = "HitCase",
  SKILL_GROUP_INDEX = ((exports.SKILL_GROUP_MAIN = 1), 0),
  interruptTag = -242791826;
class AnimNotifyStateSkillRotateStyle {
  constructor() {
    (this.IsUseAnsRotateOffset = !1),
      (this.AnsRotateOffset = Rotator_1.Rotator.Create()),
      (this.PauseRotateThreshold = 0),
      (this.ResumeRotateThreshold = 0),
      (this.IsPaused = !1);
  }
  Reset() {
    (this.IsUseAnsRotateOffset = !1),
      this.AnsRotateOffset.Reset(),
      (this.PauseRotateThreshold = 0),
      (this.ResumeRotateThreshold = 0),
      (this.IsPaused = !1);
  }
}
class SkillRotateTarget {
  constructor() {
    (this.Target = void 0), (this.Type = 0);
  }
}
let CharacterSkillComponent = (CharacterSkillComponent_1 = class extends (
  EntityComponent_1.EntityComponent
) {
  constructor() {
    super(...arguments),
      (this.Ozr = void 0),
      (this.kzr = void 0),
      (this.Fzr = void 0),
      (this.Vzr = void 0),
      (this.Hzr = void 0),
      (this.jzr = void 0),
      (this.Zma = void 0),
      (this.Wzr = void 0),
      (this.Kzr = void 0),
      (this.Qzr = void 0),
      (this.Xzr = void 0),
      (this.$zr = void 0),
      (this.Yzr = void 0),
      (this.Jzr = void 0),
      (this.zzr = void 0),
      (this.Zzr = void 0),
      (this.eZr = void 0),
      (this.tZr = void 0),
      (this.iZr = void 0),
      (this.oZr = void 0),
      (this.rZr = void 0),
      (this.nZr = void 0),
      (this.sZr = !1),
      (this.LoadedSkills = new Map()),
      (this.LoadingSkills = new Map()),
      (this.aZr = new Map()),
      (this.hZr = new Set()),
      (this.lZr = void 0),
      (this._Zr = void 0),
      (this.DtSkillInfoExtra = void 0),
      (this.DtBulletInfo = void 0),
      (this.DtBulletInfoExtra = void 0),
      (this.DtHitEffect = void 0),
      (this.DtHitEffectExtra = void 0),
      (this.EIe = void 0),
      (this.Bzr = void 0),
      (this.Lie = void 0),
      (this.$zo = void 0),
      (this.AbilityComp = void 0),
      (this.Hte = void 0),
      (this.Gce = void 0),
      (this.uZr = void 0),
      (this.cZr = void 0),
      (this.mZr = void 0),
      (this.mBe = void 0),
      (this.bre = void 0),
      (this.vHr = void 0),
      (this.dZr = void 0),
      (this.FightStateComp = void 0),
      (this.StateMachineComp = void 0),
      (this.MontageComp = void 0),
      (this.oxr = Vector_1.Vector.Create()),
      (this.Lz = Vector_1.Vector.Create()),
      (this.Gue = Rotator_1.Rotator.Create()),
      (this.Z_e = Transform_1.Transform.Create()),
      (this.CZr = (t) => {
        this.SkillTarget?.Id === t.Id && (this.SkillTarget = void 0);
      }),
      (this.bpr = () => {
        (this.SkillTarget = void 0), (this.SkillTargetSocket = "");
      }),
      (this.Caa = () => {
        this.StopAllSkills("CharacterSkillComponent.OnTeleportStartEntity");
      }),
      (this.gZr = () => {
        this.StopGroup1Skill("受击打断技能");
      }),
      (this.OnSwitchControl = (t) => {
        for (var [e, i] of this.LoadedSkills)
          i.Active &&
            (CombatLog_1.CombatLog.Info(
              "Skill",
              this.Entity,
              "切换控制权，结束当前技能",
              ["技能Id", e]
            ),
            i.IsSimulated
              ? this.SimulateEndSkill(e)
              : this.EndSkill(e, "CharacterSkillComponent.OnSwitchControl"));
      }),
      (this.fZr = () => {
        var t = this.Entity.GetComponent(33);
        t.Valid &&
          !this.Lie.HasTag(-1371021686) &&
          (CombatLog_1.CombatLog.Info(
            "Skill",
            this.Entity,
            "疑难杂症debug日志，RollingGroundedDelay"
          ),
          (t.IsMainSkillReadyEnd = !0)),
          (this.pZr = void 0);
      }),
      (this.pZr = void 0),
      (this.vZr = !1),
      (this.IsMainSkillReadyEnd = !0),
      (this.SkillTarget = void 0),
      (this.SkillTargetSocket = ""),
      (this.MZr = (t) => {
        var e = this.CurrentSkill;
        e &&
          e.SkillInfo.SkillTarget.HateOrLockOnChanged &&
          ((this.SkillTarget =
            ModelManager_1.ModelManager.CharacterModel.GetHandle(t)),
          (this.SkillTargetSocket = ""));
      }),
      (this.ZXr = (t) => {
        this.SkillTarget?.Id === t && this.AUn();
      }),
      (this.zpe = (t, e) => {
        this.SkillTarget === e && this.AUn();
      }),
      (this.I3r = (t) => {
        (t = t.GetComponent(33)),
          (this.SkillTarget = t.SkillTarget),
          (this.SkillTargetSocket = t.SkillTargetSocket);
      }),
      (this.EZr = !1),
      (this.SZr = void 0),
      (this.yZr = 0),
      (this.IZr = void 0),
      (this.TZr = !1),
      (this.IgnoreSocketName = new Set()),
      (this.LZr = new Map()),
      (this.DZr = 0),
      (this.RZr = 0),
      (this.UZr = 0),
      (this.PendingAnIndex = -1),
      (this.PendingAnMontageName = ""),
      (this.cBn = new Map());
  }
  get CurrentSkill() {
    return this.aZr.get(exports.SKILL_GROUP_MAIN)?.[SKILL_GROUP_INDEX];
  }
  get DtSkillInfo() {
    return this._Zr;
  }
  set DtSkillInfo(t) {
    this._Zr = t;
  }
  GetSkillInfo(t) {
    if (this._Zr && 0 !== t) {
      if (!GlobalData_1.GlobalData.IsPlayInEditor)
        if ((e = this.LoadedSkills.get(t))) return e.SkillInfo;
      var e = t.toString();
      let r = DataTableUtil_1.DataTableUtil.GetDataTableRow(this._Zr, e);
      if (
        !(r =
          !r && this.DtSkillInfoExtra
            ? DataTableUtil_1.DataTableUtil.GetDataTableRow(
                this.DtSkillInfoExtra,
                e
              )
            : r)
      ) {
        let t;
        var i = this.EIe.GetEntityType();
        i === Protocol_1.Aki.Protocol.wks.Proto_Player
          ? (t =
              ConfigManager_1.ConfigManager.WorldConfig.GetRoleCommonSkillInfo())
          : i === Protocol_1.Aki.Protocol.wks.Proto_Monster
          ? (t =
              ConfigManager_1.ConfigManager.WorldConfig.GetMonsterCommonSkillInfo())
          : i === Protocol_1.Aki.Protocol.wks.Proto_Vision &&
            (t =
              ConfigManager_1.ConfigManager.WorldConfig.GetVisionCommonSkillInfo()),
          t && (r = DataTableUtil_1.DataTableUtil.GetDataTableRow(t, e));
      }
      return (
        r ||
          this.EIe.CustomServerEntityIds.forEach((e) => {
            (e = ModelManager_1.ModelManager.CreatureModel.GetEntity(e)) &&
              (r = e.Entity?.GetComponent(33)?.GetSkillInfo(t));
          }),
        r ||
          ((i = ModelManager_1.ModelManager.CreatureModel.GetEntity(
            this.EIe.VisionSkillServerEntityId
          )) &&
            (r = i.Entity?.GetComponent(33)?.GetSkillInfo(t))),
        r ||
          (this.EIe.VisionControlCreatureDataId &&
            (e = ModelManager_1.ModelManager.CreatureModel.GetEntity(
              this.EIe.VisionControlCreatureDataId
            )) &&
            (r = e.Entity?.GetComponent(33)?.GetSkillInfo(t))),
        r
      );
    }
  }
  GetSkill(t) {
    return this.LoadedSkills.get(t);
  }
  GetLoadingSkill(t) {
    return this.LoadingSkills.get(t);
  }
  GetSkillMap() {
    return this.LoadedSkills;
  }
  GetPriority(t) {
    if (this.CheckIsLoaded()) {
      var e = this.GetSkillInfo(t);
      if (e) return e.InterruptLevel;
      Log_1.Log.CheckWarn() &&
        Log_1.Log.Warn(
          "Character",
          23,
          "没有该技能的打断等级",
          ["玩家id:", this.Entity.Id],
          ["skillID：", t]
        );
    }
    return -1;
  }
  OnInitData() {
    return (
      (this.SZr = new AnimNotifyStateSkillRotateStyle()),
      (this.IZr = new SkillRotateTarget()),
      CharacterSkillComponent_1.AZr ||
        ((CharacterSkillComponent_1.PZr =
          CommonParamById_1.configCommonParamById.GetIntConfig(
            "jump_priority"
          )),
        (CharacterSkillComponent_1.xZr =
          CommonParamById_1.configCommonParamById.GetIntConfig("fly_priority")),
        (CharacterSkillComponent_1.AZr = !0)),
      (this.EIe = this.Entity.CheckGetComponent(0)),
      (this.Hte = this.Entity.CheckGetComponent(3)),
      !0
    );
  }
  OnStart() {
    return (
      this.wZr(),
      this.BZr(),
      (this.sZr = !0),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.CharOnEndPlay,
        this.CZr
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.CharOnRoleDead,
        this.ZXr
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.RemoveEntity,
        this.zpe
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.TeleportStart,
        this.bpr
      ),
      EventSystem_1.EventSystem.AddWithTarget(
        this.Entity,
        EventDefine_1.EEventName.TeleportStartEntity,
        this.Caa
      ),
      EventSystem_1.EventSystem.AddWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharBeHitAnim,
        this.gZr
      ),
      EventSystem_1.EventSystem.AddWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharSwitchControl,
        this.OnSwitchControl
      ),
      EventSystem_1.EventSystem.AddWithTarget(
        this.Entity,
        EventDefine_1.EEventName.AiHateTargetChanged,
        this.MZr
      ),
      EventSystem_1.EventSystem.AddWithTarget(
        this.Entity,
        EventDefine_1.EEventName.RoleOnStateInherit,
        this.I3r
      ),
      !0
    );
  }
  OnInit() {
    return (
      (this.Bzr = this.Entity.CheckGetComponent(158)),
      (this.$zo = this.Entity.CheckGetComponent(159)),
      (this.Lie = this.Entity.CheckGetComponent(188)),
      (this.AbilityComp = this.Entity.CheckGetComponent(17)),
      (this.mBe = this.Entity.CheckGetComponent(160)),
      (this.Gce = this.Entity.GetComponent(163)),
      (this.uZr = this.Entity.GetComponent(16)),
      (this.cZr = this.Entity.GetComponent(29)),
      (this.bre = this.Entity.GetComponent(39)),
      (this.mZr = this.Entity.GetComponent(85)),
      (this.vHr = this.Entity.GetComponent(109)),
      (this.dZr = this.Entity.GetComponent(190)),
      (this.FightStateComp = this.Entity.GetComponent(47)),
      (this.StateMachineComp = this.Entity.GetComponent(67)),
      (this.MontageComp = this.Entity.CheckGetComponent(22)),
      !0
    );
  }
  OnDisable(t) {
    this.Entity.IsInit && this.StopAllSkills(t);
  }
  CheckIsLoaded() {
    return (
      this.sZr ||
        CombatLog_1.CombatLog.Info(
          "Skill",
          this.Entity,
          "SkillComponent没有加载完成"
        ),
      this.sZr
    );
  }
  wZr() {
    var t;
    PreloadDefine_1.PreloadSetting.UseNewPreload
      ? (t = this.EIe.GetEntityType()) ===
        Protocol_1.Aki.Protocol.wks.Proto_Player
        ? this.bZr()
        : t === Protocol_1.Aki.Protocol.wks.Proto_Vision
        ? this.qZr()
        : t === Protocol_1.Aki.Protocol.wks.Proto_Monster && this.GZr()
      : this.NZr();
  }
  bZr() {
    const t = (0, puerts_1.$ref)(void 0),
      e =
        (UE.DataTableFunctionLibrary.GetDataTableRowNames(this._Zr, t),
        (0, puerts_1.$unref)(t));
    for (let t = 0; t < e.Num(); t++) {
      var i = Number(e.Get(t).toString()),
        r = this.GetSkillInfo(i);
      r && this.OZr(i, r);
    }
    for (const t of ConfigManager_1.ConfigManager.WorldConfig.GetRoleCommonSkillRowNames()) {
      var o = Number(t),
        l = this.GetSkillInfo(o);
      l && this.dZr?.InitSkillCdBySkillInfo(o, l);
    }
    if (this.DtSkillInfoExtra) {
      const t = (0, puerts_1.$ref)(void 0),
        e =
          (UE.DataTableFunctionLibrary.GetDataTableRowNames(
            this.DtSkillInfoExtra,
            t
          ),
          (0, puerts_1.$unref)(t));
      for (let t = 0; t < e.Num(); t++) {
        var n = Number(e.Get(t).toString()),
          a = this.GetSkillInfo(n);
        a && this.OZr(n, a);
      }
    }
  }
  NZr() {
    var t,
      e =
        ControllerHolder_1.ControllerHolder.PreloadController.GetCurCharacterLoadType(),
      i = UE.KismetSystemLibrary.Conv_ClassToSoftClassReference(
        this.Hte.Actor.GetClass()
      ),
      r =
        ((i = UE.KismetSystemLibrary.Conv_SoftClassReferenceToString(i)),
        ConfigManager_1.ConfigManager.WorldConfig.GetCharacterFightInfo(i));
    r ||
      CombatLog_1.CombatLog.Warn(
        "Skill",
        this.Entity,
        "SkillComponent中找不到FightInfo信息"
      );
    const o = r?.SkillDataTable?.ToAssetPathName(),
      l =
        (o &&
          0 < o.length &&
          "None" !== o &&
          ((t = ResourceSystem_1.ResourceSystem.GetLoadedAsset(
            o,
            UE.DataTable
          )) ||
            CombatLog_1.CombatLog.Warn(
              "Skill",
              this.Entity,
              "SkillComponent中找不到技能表",
              ["ActorPath", i],
              ["技能表Path", o]
            ),
          (this._Zr = t)),
        (0, puerts_1.$ref)(void 0)),
      n =
        (UE.DataTableFunctionLibrary.GetDataTableRowNames(this._Zr, l),
        (0, puerts_1.$unref)(l));
    for (let t = 0; t < n.Num(); t++) {
      var a = Number(n.Get(t).toString()),
        s = this.GetSkillInfo(a);
      s && this.OZr(a, s);
    }
    let h = [];
    switch (this.EIe.GetEntityType()) {
      case Protocol_1.Aki.Protocol.wks.Proto_Player:
        h =
          ConfigManager_1.ConfigManager.WorldConfig.GetRoleCommonSkillRowNames();
        break;
      case Protocol_1.Aki.Protocol.wks.Proto_Vision:
        h =
          ConfigManager_1.ConfigManager.WorldConfig.GetVisionCommonSkillRowNames();
        break;
      case Protocol_1.Aki.Protocol.wks.Proto_Monster:
        h =
          ConfigManager_1.ConfigManager.WorldConfig.GetMonsterCommonSkillRowNames();
    }
    for (const t of h) {
      var S = Number(t),
        d = this.GetSkillInfo(S);
      d && this.OZr(S, d);
    }
    const k = r?.BulletDataTable.ToAssetPathName(),
      m =
        (k &&
          0 < k.length &&
          "None" !== k &&
          ((i = ResourceSystem_1.ResourceSystem.GetLoadedAsset(
            k,
            UE.DataTable
          )),
          (this.DtBulletInfo = i)),
        r?.HitEffectTable.ToAssetPathName());
    if (
      (m && 0 < m.length && "None" !== m
        ? ((t = ResourceSystem_1.ResourceSystem.GetLoadedAsset(
            m,
            UE.DataTable
          )),
          (this.DtHitEffect = t))
        : (this.DtHitEffect = this.Hte.Actor.DtHitEffect),
      0 !== e)
    ) {
      const o = r?.SkillDataTableMap.Get(e)?.ToAssetPathName();
      o &&
        0 < o.length &&
        "None" !== o &&
        ((i = ResourceSystem_1.ResourceSystem.GetLoadedAsset(o, UE.DataTable)),
        (this.DtSkillInfoExtra = i));
      const l = (0, puerts_1.$ref)(void 0),
        n =
          (UE.DataTableFunctionLibrary.GetDataTableRowNames(
            this.DtSkillInfoExtra,
            l
          ),
          (0, puerts_1.$unref)(l));
      for (let t = 0; t < n.Num(); t++) {
        var C = Number(n.Get(t).toString()),
          g = this.GetSkillInfo(C);
        g && this.OZr(C, g);
      }
      const a = r?.BulletDataTableMap.Get(e)?.ToAssetPathName(),
        s =
          (a &&
            0 < a.length &&
            "None" !== a &&
            ((t = ResourceSystem_1.ResourceSystem.GetLoadedAsset(
              a,
              UE.DataTable
            )),
            (this.DtBulletInfoExtra = t)),
          r?.HitEffectTableMap.Get(e)?.ToAssetPathName());
      s &&
        0 < s.length &&
        "None" !== s &&
        ((i = ResourceSystem_1.ResourceSystem.GetLoadedAsset(s, UE.DataTable)),
        (this.DtHitEffectExtra = i));
    }
  }
  qZr() {
    var t = (0, puerts_1.$ref)(void 0),
      e =
        (UE.DataTableFunctionLibrary.GetDataTableRowNames(this._Zr, t),
        (0, puerts_1.$unref)(t));
    for (let t = 0; t < e.Num(); t++) {
      var i = Number(e.Get(t).toString()),
        r = this.GetSkillInfo(i);
      r && this.OZr(i, r);
    }
    for (const t of ConfigManager_1.ConfigManager.WorldConfig.GetVisionCommonSkillRowNames()) {
      var o = Number(t),
        l = this.GetSkillInfo(o);
      l && this.OZr(o, l);
    }
  }
  GZr() {}
  OZr(t, e, i = -1) {
    if (!this.LoadedSkills.has(t))
      try {
        var r = new Skill_1.Skill();
        (this.LoadingSkills.get(t) || this.LoadingSkills.set(t, r),
        r.Initialize(t, e, this),
        this.dZr && (r.GroupSkillCdInfo = this.dZr.InitSkillCd(r)),
        this.LoadedSkills.get(t)) ||
          (this.LoadedSkills.set(t, r),
          this.LZr.set(e.SkillName.toString(), r));
      } catch (i) {
        i instanceof Error
          ? CombatLog_1.CombatLog.ErrorWithStack(
              "Skill",
              this.Entity,
              "加载技能异常",
              i,
              ["skillId", t],
              ["skillId", e?.SkillName],
              ["error", i.message]
            )
          : CombatLog_1.CombatLog.Error(
              "Skill",
              this.Entity,
              "加载技能异常",
              ["skillId", t],
              ["skillId", e?.SkillName],
              ["error", i]
            );
      }
  }
  BZr() {
    ConfigManager_1.ConfigManager.BulletConfig.PreloadBulletData(this.Entity);
  }
  OnActivate() {
    var t,
      e,
      i = this.Entity.GetComponent(0).ComponentDataMap.get("Bys")?.Bys;
    if (!this.Hte.IsAutonomousProxy && i?.$Is)
      for (const r of i.$Is)
        r.nVn?.X4n &&
          ((e = MathUtils_1.MathUtils.LongToNumber(r.nVn.sVn)),
          (t = MathUtils_1.MathUtils.LongToBigInt(r.k8n)),
          this.SimulatedBeginSkill(
            r.nVn.X4n,
            e,
            r.nVn.aVn,
            0.001 * r.nVn.Y4n,
            t
          )) &&
          (SkillMessageController_1.SkillMessageController.AddSkillMessageId(t),
          0 <= r.eVn) &&
          ((e = MathUtils_1.MathUtils.LongToBigInt(r.Z8n)),
          this.SimulatePlayMontage(
            r.nVn.X4n,
            r.eVn,
            r._Vn,
            r.VIs,
            r.FIs / 1e3,
            e
          ));
    return !0;
  }
  OnChangeTimeDilation(t) {
    var e = this.vHr.CurrentTimeScale;
    for (const i of this.GetAllActivatedSkill()) i.SetTimeDilation(e, t);
  }
  OnEnd() {
    if (
      (EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.CharOnEndPlay,
        this.CZr
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.CharOnRoleDead,
        this.ZXr
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.RemoveEntity,
        this.zpe
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.TeleportStart,
        this.bpr
      ),
      EventSystem_1.EventSystem.RemoveWithTarget(
        this.Entity,
        EventDefine_1.EEventName.TeleportStartEntity,
        this.Caa
      ),
      EventSystem_1.EventSystem.RemoveWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharBeHitAnim,
        this.gZr
      ),
      EventSystem_1.EventSystem.RemoveWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharSwitchControl,
        this.OnSwitchControl
      ),
      EventSystem_1.EventSystem.RemoveWithTarget(
        this.Entity,
        EventDefine_1.EEventName.AiHateTargetChanged,
        this.MZr
      ),
      EventSystem_1.EventSystem.RemoveWithTarget(
        this.Entity,
        EventDefine_1.EEventName.RoleOnStateInherit,
        this.I3r
      ),
      this.IgnoreSocketName.clear(),
      this.SZr.Reset(),
      this.LoadedSkills)
    )
      for (const t of this.LoadedSkills.values()) t.Clear();
    return (
      this.LoadedSkills.clear(),
      this.LoadingSkills.clear(),
      (this.vZr = !1),
      (this.IsMainSkillReadyEnd = !0),
      (this.EZr = !1),
      (this.TZr = !1),
      (this.DZr = 0),
      (this.RZr = 0),
      (this.yZr = 0),
      (this.UZr = 0),
      (this.sZr = !1),
      void 0 !== this.pZr &&
        (TimerSystem_1.TimerSystem.Remove(this.pZr), (this.pZr = void 0)),
      !0
    );
  }
  OnClear() {
    return !0;
  }
  AttachEffectToSkill(t, e, i, r) {
    var o, l;
    this.CheckIsLoaded() &&
      (o = this.CurrentSkill) &&
      ((l = this.vHr.CurrentTimeScale),
      EffectSystem_1.EffectSystem.SetTimeScale(t, l * this.TimeDilation),
      o.AttachEffect(t, e, i, r));
  }
  kZr(t) {
    let e = 1;
    return (
      0 === (t = t.SkillInfo).SkillGenre
        ? (e =
            1e-4 * this.Bzr.GetCurrentValue(EAttributeId.Proto_AutoAttackSpeed))
        : 1 === t.SkillGenre &&
          (e =
            1e-4 *
            this.Bzr.GetCurrentValue(EAttributeId.Proto_CastAttackSpeed)),
      e <= 0 ? 1 : e
    );
  }
  PlaySkillMontage(t, e, i, r, o) {
    var l = this.CurrentSkill;
    return l
      ? l.IsSimulated
        ? (CombatLog_1.CombatLog.Error(
            "Skill",
            this.Entity,
            "播放技能蒙太奇时，当前技能是模拟技能",
            ["montageIndex", e]
          ),
          !1)
        : (!t || !this.Lie.HasTag(-1503953470)) &&
          (this.mBe.ExitHitState("播放技能蒙太奇"),
          (t = this.kZr(l)),
          (o = l.PlayMontage(e, t, i, r, o)) &&
            SkillMessageController_1.SkillMessageController.MontageRequest(
              this.Entity,
              1,
              l.SkillId?.toString(),
              this.SkillTarget?.Id ?? 0,
              e,
              t,
              i,
              r,
              l.CombatMessageId,
              l.MontageContextId
            ),
          o)
      : (CombatLog_1.CombatLog.Error(
          "Skill",
          this.Entity,
          "播放技能蒙太奇时，当前技能不存在",
          ["montageIndex", e]
        ),
        !1);
  }
  EndOwnerAndFollowSkills() {
    this.StopAllSkills("CharacterSkillComponent.EndOwnerAndFollowSkills");
    var t = this.Entity.GetComponent(48)?.FollowIds;
    if (t)
      for (const i of t) {
        var e = EntitySystem_1.EntitySystem.Get(i)?.GetComponent(33);
        e && e.StopAllSkills("CharacterSkillComponent.EndOwnerAndFollowSkills");
      }
  }
  StopAllSkills(t) {
    if (this.CheckIsLoaded())
      for (const e of this.GetAllActivatedSkill()) this.FZr(e, t);
  }
  StopGroup1Skill(t) {
    var e;
    this.CheckIsLoaded() && (e = this.CurrentSkill) && this.FZr(e, t);
  }
  EndSkill(t, e) {
    this.CheckIsLoaded() &&
      (t = this.LoadedSkills.get(t))?.Active &&
      this.VZr(t, e);
  }
  HZr(t, e, i) {
    var r = t.SkillInfo.GroupId,
      o = t.SkillInfo.InterruptLevel;
    return this.jZr(r, o, e, i, t);
  }
  CheckJumpCanInterrupt() {
    return this.jZr(exports.SKILL_GROUP_MAIN, CharacterSkillComponent_1.PZr);
  }
  CheckGlideCanInterrupt() {
    return this.jZr(exports.SKILL_GROUP_MAIN, CharacterSkillComponent_1.xZr);
  }
  jZr(t, e, i = [], r = [], o) {
    let l = !0;
    if (t === exports.SKILL_GROUP_MAIN) {
      var n,
        a,
        s,
        h = this.CurrentSkill;
      h &&
        ((S = (n = h.SkillInfo).InterruptLevel < e),
        (a = n.InterruptLevel === e && this.vZr),
        (s = this.IsMainSkillReadyEnd),
        S || a || s
          ? i.push(h)
          : ((l = !1),
            r.push(n.InterruptLevel.toString()),
            r.push(e.toString()),
            r.push(this.vZr.toString()),
            r.push(this.IsMainSkillReadyEnd.toString())));
    } else {
      var S = this.aZr.get(t);
      if (S)
        for (const t of S) {
          if (this.IsSkillInCd(t.SkillId)) {
            (l = !1), r.push(`技能${t.SkillId}处于CD中`);
            break;
          }
          t === o && i.push(t);
        }
    }
    return l || (i.length = 0), l;
  }
  FZr(t, e) {
    t?.Active &&
      (t.IsSimulated
        ? this.SimulateEndSkill(t.SkillId)
        : (EventSystem_1.EventSystem.Emit(
            EventDefine_1.EEventName.CharInterruptSkill,
            this.Entity.Id,
            t.SkillId
          ),
          this.VZr(t, e)));
  }
  VZr(t, e) {
    CombatLog_1.CombatLog.Info(
      "Skill",
      this.Entity,
      "CharacterSkillComponent.RequestEndSkill",
      ["结束技能ID", t.SkillId],
      ["结束技能名称", t.SkillName],
      ["Reason", e],
      ["CanInterrupt", this.vZr],
      ["ReadyEnd", this.IsMainSkillReadyEnd],
      ["InterruptLevel", t.SkillInfo.InterruptLevel]
    ),
      this.dZr?.ResetMultiSkills(t.SkillId),
      this.dZr?.ResetCdDelayTime(t.SkillId),
      1 === (e = t.SkillInfo.SkillMode)
        ? t.ActiveAbility?.IsValid()
          ? t.ActiveAbility.K2_EndAbility()
          : CombatLog_1.CombatLog.Error(
              "Skill",
              this.Entity,
              "[CharacterSkillComponent.RequestEndSkill]技能结束失败，找不到GA（判断一下是否被动GA，如果是，不能主动执行）",
              ["技能ID", t.SkillId],
              ["技能名称", t.SkillName]
            )
        : 0 === e && t.RequestStopMontage();
  }
  IsSkillGenreForbidden(t) {
    switch (t.SkillGenre) {
      case 0:
        return this.Lie.HasTag(866007727);
      case 1:
        return this.Lie.HasTag(443489183);
      case 2:
        return this.Lie.HasTag(495657548);
      case 3:
        return this.Lie.HasTag(-592555498);
      case 4:
      case 5:
      case 8:
        break;
      case 6:
        return this.Lie.HasTag(-1390464883);
      case 7:
        return this.Lie.HasTag(1072084846);
      case 9:
        return this.Lie.HasTag(1195493782);
      case 10:
        return this.Lie.HasTag(283451623);
      case 11:
        return this.Lie.HasTag(-1936884442);
    }
    return !1;
  }
  WZr(t, e) {
    var i,
      r = t.SkillInfo;
    return this.Hte.IsAutonomousProxy || r.AutonomouslyBySimulate
      ? this.Lie.HasTag(-1388400236)
        ? "角色处于不可控制状态"
        : this.Lie.HasTag(1008164187)
        ? "角色处于死亡状态"
        : this.uZr?.IsFrozen()
        ? "角色处于冰冻状态"
        : this.IsSkillGenreForbidden(r)
        ? "该类别技能被临时禁止"
        : 8 === r.SkillGenre
        ? "不能主动调用被动技能"
        : t.AbilityClass &&
          t.AbilityClass.IsChildOf(UE.Ga_Passive_C.StaticClass())
        ? "策划可能误把被动GA放在普攻0技能组里"
        : this.IsSkillInCd(t.SkillId)
        ? "技能处于CD中"
        : 0 !== r.StrengthCost &&
          FormationAttributeController_1.FormationAttributeController.GetValue(
            1
          ) <= 1
        ? "体力不足"
        : this.dZr?.IsMultiSkill(t.SkillInfo) && !this.dZr.CanStartMultiSkill(t)
        ? "多段技能启动失败"
        : ((r = this.EIe.GetEntityType()),
          (i = this.bre?.AiController?.IsWaitingSwitchControl()),
          r === Protocol_1.Aki.Protocol.wks.Proto_Monster &&
          !t.SkillInfo.AutonomouslyBySimulate &&
          i
            ? "在等待切换控制权期间，不允许释放普通技能"
            : this.HZr(t, e, (r = []))
            ? ""
            : "技能打断失败[" + r.join(",") + "]")
      : "非主控无权限释放技能";
  }
  KZr(t) {
    if (
      !this.LoadedSkills.has(t) &&
      PreloadDefine_1.PreloadSetting.UseNewPreload
    ) {
      var e;
      if (
        !(e =
          ((e = this.Entity.GetComponent(199)).LoadSkillAsync(t),
          e.FlushSkill(t),
          this.GetSkillInfo(t)))
      )
        return;
      this.OZr(t, e),
        CombatLog_1.CombatLog.Info(
          "Skill",
          this.Entity,
          "CharacterSkillComponent.赋予技能",
          ["技能Id", t]
        );
    }
    return this.LoadedSkills.get(t);
  }
  BeginSkill(t, e = {}) {
    if (!ModManager_1.ModManager.Settings.NoCD && !this.CheckIsLoaded())
      return !1;
    const i = this.KZr(t);
    if (!i)
      return (
        CombatLog_1.CombatLog.Error(
          "Skill",
          this.Entity,
          "BeginSkill使用了不存在的技能",
          ["技能Id", t]
        ),
        !1
      );
    CombatLog_1.CombatLog.Info(
      "Skill",
      this.Entity,
      "CharacterSkillComponent.BeginSkill",
      ["技能Id", t],
      ["技能名", i.SkillName],
      ["上下文", e.Context]
    );
    var r = [];
    if ((o = this.WZr(i, r)))
      return (
        CombatLog_1.CombatLog.Info(
          "Skill",
          this.Entity,
          "CharacterSkillComponent.CheckSkillCanBegin条件不满足",
          ["技能Id", t],
          ["技能名", i.SkillName],
          ["当前技能", this.CurrentSkill?.SkillId],
          ["当前技能名", this.CurrentSkill?.SkillName],
          ["原因", o]
        ),
        !1
      );
    r.forEach((t) => {
      this.FZr(t, "开始新技能");
    });
    var o = this.GetSkillInfo(t),
      l =
        ((r = this.Hte?.IsAutonomousProxy ?? !1),
        this.StateMachineComp?.StateMachineGroup?.IsCurrentTaskSkill(t));
    if (this.FightStateComp && o.GroupId === exports.SKILL_GROUP_MAIN && !l) {
      if (!(l = this.FightStateComp.TrySwitchSkillState(i.SkillInfo, !0)))
        return (
          CombatLog_1.CombatLog.Info(
            "Skill",
            this.Entity,
            "技能释放失败，状态不满足",
            ["技能Id", t],
            ["技能名", i.SkillName]
          ),
          !1
        );
      i.FightStateHandle = l;
    } else i.FightStateHandle = 0;
    if (
      (this.QZr(e.Target, e.SocketName, o.SkillTarget),
      (i.PreContextId = e.ContextId),
      EventSystem_1.EventSystem.EmitWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharBeforeSkillWithTarget,
        t,
        r
      ),
      1 === (l = o.SkillMode))
    ) {
      if (
        ((this.lZr = i),
        !this.AbilityComp.TryActivateAbilityByClass(i.AbilityClass, !0))
      )
        return (
          CombatLog_1.CombatLog.Error(
            "Skill",
            this.Entity,
            "执行GA失败!:",
            ["技能Id:", i.SkillId],
            ["技能名", i.SkillName],
            ["GaClass:", i.AbilityClass?.GetName()]
          ),
          (this.lZr = void 0),
          (this.SkillTarget = void 0),
          (this.SkillTargetSocket = ""),
          !1
        );
    } else
      0 === l &&
        (this.XZr(i),
        i.HasMontages
          ? this.PlaySkillMontage(!1, 0, "", 0, () => {
              this.DoSkillEnd(i);
            })
          : (CombatLog_1.CombatLog.Info(
              "Skill",
              this.Entity,
              "SimpleSkill No Montage",
              ["技能Id", i.SkillId],
              ["技能名", i.SkillName]
            ),
            this.DoSkillEnd(i)));
    return (
      o.AutonomouslyBySimulate &&
        this.Hte.SetMoveControlled(!0, o.MoveControllerTime, "特殊技能"),
      (e = this.Entity.Id),
      EventSystem_1.EventSystem.Emit(
        EventDefine_1.EEventName.CharUseSkill,
        e,
        i.SkillId,
        r
      ),
      SceneTeamController_1.SceneTeamController.EmitEvent(
        this.Entity,
        EventDefine_1.EEventName.CharUseSkill,
        e,
        i.SkillId,
        r
      ),
      EventSystem_1.EventSystem.EmitWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharRecordOperate,
        this.SkillTarget,
        i.SkillId,
        o.SkillGenre
      ),
      this.$zo?.TriggerEvents(2, this.$zo, {
        SkillId: Number(i.SkillId),
        SkillGenre: o.SkillGenre,
      }),
      !0
    );
  }
  $Zr(t, e) {
    return (
      !this.Bzr.IsDeathInternal ||
      (Log_1.Log.CheckWarn() &&
        Log_1.Log.Warn(
          "Battle",
          20,
          "[CBT2临时处理]角色处于死亡中，暂不接受远端通知释放技能。",
          ["skillId", t.SkillId],
          ["entity", this.Entity.toString()]
        ),
      !1)
    );
  }
  SimulatedBeginSkill(t, e, i = !1, r = 0, o = BigInt(0)) {
    var l = this.KZr(t);
    if (!l)
      return (
        CombatLog_1.CombatLog.Error(
          "Skill",
          this.Entity,
          "远端释放不存在的技能",
          ["技能Id", t]
        ),
        !1
      );
    if (
      l.AbilityClass &&
      l.AbilityClass.IsChildOf(UE.Ga_Passive_C.StaticClass())
    )
      return (
        CombatLog_1.CombatLog.Warn("Skill", this.Entity, "被动技能不模拟", [
          "技能Id",
          t,
        ]),
        !1
      );
    if (
      (l.Active &&
        l.IsSimulated &&
        CombatLog_1.CombatLog.Warn("Skill", this.Entity, "重复释放远端技能", [
          "技能Id",
          t,
        ]),
      !this.$Zr(l, i))
    )
      return !1;
    var n = l.SkillInfo,
      a = this.StateMachineComp?.StateMachineGroup?.IsCurrentTaskSkill(t);
    if (
      this.FightStateComp &&
      l.SkillInfo.GroupId === exports.SKILL_GROUP_MAIN &&
      !a
    ) {
      if (!(a = this.FightStateComp.TrySwitchSkillState(l.SkillInfo, !1)))
        return !1;
      l.FightStateHandle = a;
    } else l.FightStateHandle = 0;
    return (
      CombatLog_1.CombatLog.Info(
        "Skill",
        this.Entity,
        "执行远端技能",
        ["技能Id", t],
        ["技能名", l.SkillName],
        ["特殊技能", i],
        ["打断等级", n.InterruptLevel]
      ),
      i &&
        (this.CurrentSkill && this.FZr(this.CurrentSkill, "远端特殊技能"),
        this.Hte.SetMoveControlled(!1, r, "远端特殊技能")),
      this.Entity.GetComponent(160).ExitHitState("远端释放技能"),
      SceneTeamController_1.SceneTeamController.EmitEvent(
        this.Entity,
        EventDefine_1.EEventName.CharUseSkillRemote,
        this.Entity.Id,
        l.SkillId
      ),
      this.YZr(n.GroupId, l),
      l.SimulatedBeginSkill(o),
      (this.IsMainSkillReadyEnd = !1),
      (this.SkillTarget =
        ModelManager_1.ModelManager.CreatureModel.GetEntity(e)),
      !0
    );
  }
  SimulateEndSkill(t) {
    var e = this.LoadedSkills.get(t);
    e
      ? e.Active && e.IsSimulated
        ? (CombatLog_1.CombatLog.Info(
            "Skill",
            this.Entity,
            "结束远端技能",
            ["技能Id", t],
            ["技能名", e.SkillName]
          ),
          this.JZr(e.SkillInfo.GroupId, e),
          e.EndSkill(),
          (this.IsMainSkillReadyEnd = !1),
          e.SkillInfo.AutonomouslyBySimulate &&
            this.Hte.ResetMoveControlled("模拟端结束特殊技能"),
          SceneTeamController_1.SceneTeamController.EmitEvent(
            this.Entity,
            EventDefine_1.EEventName.OnSkillEnd,
            this.Entity.Id,
            e.SkillId
          ),
          EventSystem_1.EventSystem.Emit(
            EventDefine_1.EEventName.OnSkillEnd,
            this.Entity.Id,
            t
          ))
        : CombatLog_1.CombatLog.Warn(
            "Skill",
            this.Entity,
            "结束远端技能失败，技能未激活或非模拟执行",
            ["技能Id", t],
            ["技能名", e.SkillName]
          )
      : CombatLog_1.CombatLog.Error(
          "Skill",
          this.Entity,
          "远端结束不存在的技能",
          ["技能Id", t]
        );
  }
  OnActivateAbility(t, e) {
    if (t.IsA(UE.Ga_Passive_C.StaticClass())) {
      const e = this.cBn.get(t.GetClass());
      return (
        e
          ? (((r = t).当前技能数据名 = e.toString()),
            (r.SkillId = e),
            (r = this.KZr(e))
              ? SkillMessageController_1.SkillMessageController.UseSkillRequest(
                  this.Entity,
                  r,
                  0
                )
              : Log_1.Log.CheckWarn() &&
                Log_1.Log.Warn("Battle", 36, "被动GA没找到skill", [
                  "skillId",
                  e,
                ]))
          : Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "Battle",
              36,
              "被动GA没找到skillId",
              ["skillId", e],
              ["ga", t.GetName()]
            ),
        -1
      );
    }
    if (!this.lZr)
      return (
        CombatLog_1.CombatLog.Error(
          "Skill",
          this.Entity,
          "GA已启动，但没有找到对应技能",
          ["GA", t.GetName()]
        ),
        -1
      );
    this.lZr.ActiveAbility = t;
    const i = this.lZr.SkillId;
    var r;
    return (
      t.IsA(UE.GA_Base_C.StaticClass()) &&
        (((r = t).当前技能数据 = this.lZr.SkillInfo),
        (r.当前技能数据名 = this.lZr.SkillId.toString()),
        (r.SkillId = i)),
      this.XZr(this.lZr),
      (this.lZr = void 0),
      i
    );
  }
  OnEndAbility(t, e) {
    for (const e of this.GetAllActivatedSkill())
      if (e.ActiveAbility === t) return void this.DoSkillEnd(e);
    CombatLog_1.CombatLog.Warn(
      "Skill",
      this.Entity,
      "[CharacterSkillComponent.OnEndAbility]GA已结束，但没有找到对应技能",
      ["GA", t.GetName()]
    );
  }
  QZr(t, e, i) {
    t
      ? ((this.SkillTarget =
          t instanceof Entity_1.Entity
            ? ModelManager_1.ModelManager.CharacterModel.GetHandleByEntity(t)
            : ActorUtils_1.ActorUtils.GetEntityByActor(t)),
        (this.SkillTargetSocket = e ?? ""))
      : this.cZr?.Valid
      ? this.SelectTargetAndSetShow(i)
      : (this.bre?.Valid
          ? (this.SkillTarget =
              this.bre.AiController.AiHateList.GetCurrentTarget())
          : (this.SkillTarget = void 0),
        (this.SkillTargetSocket = ""));
  }
  SelectTargetAndSetShow(t) {
    var e;
    this.cZr?.Valid &&
      (t.GlobalTarget
        ? ((e =
            ModelManager_1.ModelManager.SceneTeamModel?.GetCurrentEntity?.Entity?.GetComponent(
              29
            )),
          (this.SkillTarget = e?.GetCurrentTarget()),
          (this.SkillTargetSocket = e?.GetCurrentTargetSocketName() ?? ""))
        : (this.cZr.DetectSoftLockTarget(
            t.LockOnConfigId,
            t.SkillTargetDirection,
            t.SkillTargetPriority,
            t.ShowTarget
          ),
          (this.SkillTarget = this.cZr.GetCurrentTarget()),
          (this.SkillTargetSocket = this.cZr.GetCurrentTargetSocketName())));
  }
  XZr(t) {
    if (!this.hZr.has(t.SkillId)) {
      this.hZr.add(t.SkillId);
      var e = this.GetSkillInfo(t.SkillId),
        i =
          (t.BeginSkill(),
          this.YZr(e.GroupId, t),
          SkillMessageController_1.SkillMessageController.UseSkillRequest(
            this.Entity,
            t,
            this.SkillTarget?.Id ?? 0
          ),
          this.zZr(t),
          this.dZr?.IsMultiSkill(t.SkillInfo) &&
            this.dZr.StartMultiSkill(t, !1),
          ModManager_1.ModManager.Settings.NoCD ||
            this.dZr?.StartCd(t.SkillId, t.SkillInfo.SkillGenre),
          0 < Math.abs(e.StrengthCost) &&
            FormationAttributeController_1.FormationAttributeController.AddValue(
              1,
              ModManager_1.ModManager.Settings.InfiniteStamina
                ? 0
                : e.StrengthCost
            ),
          this.GetSkillLevelBySkillInfoId(t.SkillId));
      if (
        (e.GroupId === exports.SKILL_GROUP_MAIN &&
          (this.IsMainSkillReadyEnd = !1),
        t.BeginSkillBuffAndTag(i),
        this.mBe.ExitHitState("释放技能"),
        t.HasAnimTag || this.mBe.ExitAimStatus(),
        this.SetSkillTargetDirection(
          e.SkillTarget.SkillTargetDirection,
          e.SkillTarget.SkillTargetPriority
        ),
        e.WalkOffLedge && this.Gce.SetWalkOffLedgeRecord(!1),
        e.SkillStepUp && this.Gce.SetStepUpParamsRecord(!1),
        exports.SKILL_GROUP_MAIN === e.GroupId)
      )
        switch (
          (this.Gce &&
            6 === this.Gce.CharacterMovement.MovementMode &&
            ((i = this.Gce.CharacterMovement.CustomMovementMode) ===
            CustomMovementDefine_1.CUSTOM_MOVEMENTMODE_GLIDE
              ? (e = this.Entity.GetComponent(51)).Valid && e.ExitGlideState()
              : i === CustomMovementDefine_1.CUSTOM_MOVEMENTMODE_SOAR &&
                (e = this.Entity.GetComponent(51)).Valid &&
                e.ExitSoarState()),
          (i = this.mBe.MoveState))
        ) {
          case CharacterUnifiedStateTypes_1.ECharMoveState.Sprint:
            this.Lie.HasTag(-1800191060) ||
              (this.Lie.RemoveTag(388142570),
              this.$zo.RemoveBuffByTag(388142570, `技能${t.SkillId}结束移动`),
              this.mBe.SetMoveState(
                CharacterUnifiedStateTypes_1.ECharMoveState.Run
              ));
            break;
          case CharacterUnifiedStateTypes_1.ECharMoveState.WalkStop:
          case CharacterUnifiedStateTypes_1.ECharMoveState.RunStop:
          case CharacterUnifiedStateTypes_1.ECharMoveState.SprintStop:
            this.mBe.SetMoveState(
              CharacterUnifiedStateTypes_1.ECharMoveState.Stand
            );
        }
      (this.Gce.CharacterMovement.OverrideTerminalVelocity = 99999),
        this.Gce.SetFallingHorizontalMaxSpeed(99999),
        this.hZr.delete(t.SkillId);
    }
  }
  DoSkillEnd(t) {
    var e;
    this.hZr.has(t.SkillId) ||
      (this.hZr.add(t.SkillId),
      CombatLog_1.CombatLog.Info(
        "Skill",
        this.Entity,
        "CharacterSkillComponent.DoSkillEnd",
        ["技能Id", t.SkillId],
        ["技能名", t.SkillName]
      ),
      (e = t.SkillInfo),
      this.ien(t),
      e.GroupId === exports.SKILL_GROUP_MAIN &&
        ((this.vZr = !1), (this.IsMainSkillReadyEnd = !0), (this.UZr = 0)),
      e.WalkOffLedge && this.Gce.SetWalkOffLedgeRecord(!0),
      e.SkillStepUp && this.Gce.SetStepUpParamsRecord(!0),
      (this.Gce.CharacterMovement.OverrideTerminalVelocity = 0),
      this.Gce.ClearFallingHorizontalMaxSpeed(),
      this.JZr(e.GroupId, t),
      t.EndSkill(),
      this.$zo.HasBuffAuthority() &&
        this.$zo.RemoveBuff(CharacterBuffIds_1.buffId.GoDown, -1, "技能结束"),
      this.Lie.HasTag(-242791826) && this.Lie.RemoveTag(-242791826),
      SkillMessageController_1.SkillMessageController.EndSkillRequest(
        this.Entity,
        t.SkillId
      ),
      SceneTeamController_1.SceneTeamController.EmitEvent(
        this.Entity,
        EventDefine_1.EEventName.OnSkillEnd,
        this.Entity.Id,
        t.SkillId
      ),
      EventSystem_1.EventSystem.Emit(
        EventDefine_1.EEventName.OnSkillEnd,
        this.Entity.Id,
        t.SkillId
      ),
      this.$zo?.TriggerEvents(3, this.$zo, {
        SkillId: Number(t.SkillId),
        SkillGenre: e.SkillGenre,
      }),
      this.hZr.delete(t.SkillId));
  }
  PlaySkillMontage2Server(t, e, i, r, o) {
    var l = this.LoadedSkills.get(t);
    l &&
      ((l.MontageContextId =
        ModelManager_1.ModelManager.CombatMessageModel.GenMessageId()),
      SkillMessageController_1.SkillMessageController.MontageRequest(
        this.Entity,
        1,
        l.SkillId?.toString(),
        this.SkillTarget?.Id ?? 0,
        e,
        i,
        r,
        o,
        l.CombatMessageId,
        l.MontageContextId
      ),
      (i = l.GetMontageByIndex(e)),
      this.MontageComp?.PushMontageInfo(
        { MontageName: [], SkillId: t, MontageIndex: e },
        i
      ));
  }
  EndSkillMontage(t, e) {}
  SimulatePlayMontage(t, e = 0, i = 1, r = "", o = 0, l = BigInt(0)) {
    (t = this.LoadedSkills.get(t)) && t.PlayMontage(e, i, r, o, void 0, l);
  }
  RollingGrounded() {
    var t = this.Entity.GetComponent(33);
    t.Valid &&
      ((t.IsMainSkillReadyEnd = !1),
      (this.pZr = TimerSystem_1.TimerSystem.Delay(this.fZr, 600))),
      this.mBe.PositionState ===
        CharacterUnifiedStateTypes_1.ECharPositionState.Ground &&
        this.mBe.SetMoveState(
          CharacterUnifiedStateTypes_1.ECharMoveState.LandRoll
        );
  }
  IsSkillInCd(t) {
    return (
      !ModManager_1.ModManager.Settings.NoCD &&
      !!this.dZr &&
      this.dZr.IsSkillInCd(t)
    );
  }
  GetCurrentMontageCorrespondingSkillId() {
    var t,
      e,
      i = this.AbilityComp?.GetCurrentWaitAndPlayedMontageCorrespondingGa();
    for ([t, e] of this.LoadedSkills)
      if (e.Active && e.ActiveAbility === i) return t;
    return (
      Log_1.Log.CheckWarn() &&
        Log_1.Log.Warn("Character", 23, "不存在该GA的技能", [
          "玩家id",
          this.Entity.Id,
        ]),
      0
    );
  }
  get SkillAcceptInput() {
    return this.vZr;
  }
  SetSkillAcceptInput(t) {
    (this.vZr = t),
      EventSystem_1.EventSystem.Emit(
        EventDefine_1.EEventName.SkillAcceptChanged,
        this.CurrentSkill?.SkillId ?? 0,
        this.vZr
      );
  }
  AUn() {
    var t = this.CurrentSkill;
    t &&
      (t.SkillInfo.SkillTarget.TargetDied
        ? (this.cZr?.Valid &&
            this.SelectTargetAndSetShow(t.SkillInfo.SkillTarget),
          this.bre?.Valid &&
            (t = this.bre.AiController.AiHateList.GetCurrentTarget()) &&
            t.Id !== this.SkillTarget?.Id &&
            (this.SkillTarget =
              ModelManager_1.ModelManager.CharacterModel.GetHandleByEntity(
                t.Entity
              )))
        : ((this.SkillTarget = void 0), (this.SkillTargetSocket = "")),
      EventSystem_1.EventSystem.EmitWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharSkillTargetChanged,
        this.SkillTarget,
        this.SkillTargetSocket
      ));
  }
  GetTargetTransform() {
    if (
      (t = this.SkillTarget.Entity.GetComponent(0).GetEntityType()) !==
        Protocol_1.Aki.Protocol.wks.Proto_Player &&
      t !== Protocol_1.Aki.Protocol.wks.Proto_Npc &&
      t !== Protocol_1.Aki.Protocol.wks.Proto_Monster &&
      t !== Protocol_1.Aki.Protocol.wks.Proto_Vision
    )
      return this.SkillTarget.Entity.GetComponent(1).ActorTransform;
    {
      let r = this.SkillTargetSocket;
      r = r || "HitCase";
      var t,
        e = (t = this.SkillTarget.Entity.GetComponent(3)).Actor.Mesh,
        i = FNameUtil_1.FNameUtil.GetDynamicFName(r);
      return e?.DoesSocketExist(i)
        ? e.GetSocketTransform(i, 0)
        : t.ActorTransform;
    }
  }
  GetTargetDistance() {
    var t;
    return this.SkillTarget && (t = this.GetTargetTransform())
      ? (this.Lz.FromUeVector(t.GetLocation()),
        Vector_1.Vector.Dist(this.Hte.ActorLocationProxy, this.Lz))
      : -1;
  }
  SetSkillCanRotate(t) {
    (this.EZr = t) || this.SZr.Reset();
  }
  SetSkillRotateSpeed(t) {
    this.yZr = t;
  }
  SetRotateTarget(t, e) {
    (this.IZr.Target = t), (this.IZr.Type = e);
  }
  SetSkillRotateToTarget(t, e, i, r = 0, o = 0) {
    (this.TZr = t),
      (this.SZr.IsUseAnsRotateOffset = e),
      (this.SZr.AnsRotateOffset.Yaw = -MathUtils_1.MathUtils.Clamp(
        i,
        -MathUtils_1.PI_DEG,
        MathUtils_1.PI_DEG
      )),
      (this.SZr.PauseRotateThreshold = r),
      (this.SZr.ResumeRotateThreshold = o);
  }
  SetIgnoreSocketName(t) {
    this.IgnoreSocketName.add(t.toString());
  }
  DeleteIgnoreSocketName(t) {
    this.IgnoreSocketName.delete(t.toString());
  }
  SetSkillTargetDirection(t, e = 0) {
    if (this.cZr?.Valid)
      switch (t) {
        case 0:
          this.SkillTarget?.Valid
            ? this.ZZr()
            : 6 === e
            ? this.ten()
            : this.een();
          break;
        case 1:
          this.een();
          break;
        case 3:
          this.ten();
      }
  }
  een() {
    this.Hte.IsAutonomousProxy &&
      this.IsHasInputDir() &&
      (this.Gue.FromUeRotator(this.oen()),
      this.Z_e.Set(
        this.Hte.ActorLocationProxy,
        this.Gue.Quaternion(),
        this.Hte.ActorScaleProxy
      ),
      this.Hte.SetActorTransform(
        this.Z_e.ToUeTransform(),
        "释放技能.转向输入方向",
        !1,
        1
      ));
  }
  IsHasInputDir() {
    var t;
    return (
      !!this.CheckIsLoaded() &&
      ((t = this.Hte.InputDirectProxy), 0 < Math.abs(t.X) || 0 < Math.abs(t.Y))
    );
  }
  ten() {
    this.Gue.FromUeRotator(
      Global_1.Global.CharacterCameraManager.GetCameraRotation()
    ),
      this.Gue.Vector(this.Lz),
      MathUtils_1.MathUtils.LookRotationUpFirst(
        this.Lz,
        Vector_1.Vector.UpVectorProxy,
        this.Gue
      ),
      this.Z_e.Set(
        this.Hte.ActorLocationProxy,
        this.Gue.Quaternion(),
        this.Hte.ActorScaleProxy
      ),
      this.Hte.SetActorTransform(
        this.Z_e.ToUeTransform(),
        "释放技能.转向摄像机方向",
        !1,
        1
      );
  }
  ZZr() {
    this.SkillTarget &&
      (this.Lz.FromUeVector(this.GetTargetTransform().GetLocation()),
      this.Lz.SubtractionEqual(this.Hte.ActorLocationProxy),
      MathUtils_1.MathUtils.LookRotationUpFirst(
        this.Lz,
        Vector_1.Vector.UpVectorProxy,
        this.Gue
      ),
      this.Hte.SetActorRotation(
        this.Gue.ToUeRotator(),
        "释放技能.转向技能目标",
        !1
      ));
  }
  oen() {
    return this.Hte.InputRotatorProxy;
  }
  UpdateAllSkillRotator(t) {
    if (!this.CheckIsLoaded() || !this.Gce) return !1;
    if (this.Lie.HasTag(504239013)) return !1;
    if (!this.EZr) return !1;
    if (!this.Hte.IsMoveAutonomousProxy) return !1;
    var e = Math.abs(this.yZr);
    if (this.TZr) {
      var i = this.ren();
      if (!i) return !1;
      MathUtils_1.MathUtils.LookRotationUpFirst(
        i,
        Vector_1.Vector.UpVectorProxy,
        this.Gue
      ),
        this.Gce.SmoothCharacterRotation(
          this.Gue,
          e,
          t,
          !1,
          "Skill.UpdateAllSkillRotator"
        );
    } else
      this.Gce.SmoothCharacterRotation(
        this.oen(),
        e,
        t,
        !1,
        "Skill.UpdateAllSkillRotator"
      );
    return !0;
  }
  GetSkillRotateDirect() {
    return this.ren();
  }
  ren() {
    var t = this.Hte.ActorLocationProxy;
    switch (this.IZr.Type) {
      case 0:
        return this.SkillTarget
          ? ((e = this.SkillTarget.Entity.CheckGetComponent(1)), this.nen(e, t))
          : void 0;
      case 1:
        var e = this.IZr.Target;
        return this.oxr.DeepCopy(e), this.oxr.SubtractionEqual(t), this.oxr;
      case 2:
        e = this.IZr.Target;
        return this.oxr.DeepCopy(e), this.oxr;
      case 3:
      case 6: {
        let i;
        return (i =
          3 === this.IZr.Type
            ? BlackboardController_1.BlackboardController.GetEntityIdByEntity(
                this.Entity.Id,
                this.IZr.Target
              )
            : BlackboardController_1.BlackboardController.GetIntValueByEntity(
                this.Entity.Id,
                this.IZr.Target
              ))
          ? ((e = EntitySystem_1.EntitySystem.Get(i).CheckGetComponent(1)),
            this.oxr.DeepCopy(e.ActorLocationProxy),
            this.oxr.SubtractionEqual(t),
            this.oxr)
          : void 0;
      }
      case 4:
        return (e =
          BlackboardController_1.BlackboardController.GetVectorValueByEntity(
            this.Entity.Id,
            this.IZr.Target
          ))
          ? (this.oxr.DeepCopy(e), this.oxr.SubtractionEqual(t), this.oxr)
          : void 0;
      case 5:
        return (e =
          BlackboardController_1.BlackboardController.GetVectorValueByEntity(
            this.Entity.Id,
            this.IZr.Target
          ))
          ? (this.oxr.DeepCopy(e), this.oxr)
          : void 0;
      default:
        return;
    }
  }
  nen(t, e) {
    var i = this.CurrentSkill;
    let r;
    return (
      (r = i ? this.GetTargetTransform() : r)
        ? this.oxr.FromUeVector(r.GetLocation())
        : this.oxr.DeepCopy(t.ActorLocationProxy),
      this.oxr.SubtractionEqual(e),
      this.oxr.Normalize(),
      this.SZr.IsUseAnsRotateOffset &&
        0 !== this.SZr.AnsRotateOffset.Yaw &&
        ((this.oxr.Z = 0),
        this.SZr.AnsRotateOffset.Quaternion().RotateVector(this.oxr, this.oxr)),
      (i = this.Hte.ActorForwardProxy),
      (t = Math.abs(MathUtils_1.MathUtils.GetAngleByVectorDot(this.oxr, i))),
      this.SZr.IsPaused
        ? 0 < this.SZr.ResumeRotateThreshold &&
          (t < this.SZr.ResumeRotateThreshold
            ? this.oxr.DeepCopy(i)
            : (this.SZr.IsPaused = !1))
        : 0 < this.SZr.PauseRotateThreshold &&
          t < this.SZr.PauseRotateThreshold &&
          ((this.SZr.IsPaused = !0), this.oxr.DeepCopy(i)),
      this.oxr
    );
  }
  GetPointTransform(t) {
    var e;
    return this.CheckIsLoaded() && (e = this.Hte.Actor.Mesh)?.DoesSocketExist(t)
      ? e.GetSocketTransform(t, 0)
      : void 0;
  }
  GetSkillByName(t) {
    return this.LZr.get(t);
  }
  get SkillElevationAngle() {
    return this.DZr;
  }
  SetSkillElevationAngle(t) {
    this.DZr = t;
  }
  get LastActivateSkillTime() {
    return this.RZr;
  }
  SetLastActivateSkillTime(t) {
    this.RZr = t;
  }
  get CurrentPriority() {
    return this.UZr;
  }
  SetCurrentPriority(t) {
    this.UZr = t;
  }
  HasAbility(t) {
    return !!this.CheckIsLoaded() && this.LoadedSkills.has(t);
  }
  SetSkillPriority(t, e) {
    this.CheckIsLoaded() &&
      (t = this.LoadedSkills.get(t))?.Active &&
      t.SetSkillPriority(e);
  }
  CallAnimBreakPoint() {
    this.CheckIsLoaded() &&
      (this.Lie.HasTag(-242791826) || this.Lie.AddTag(-242791826),
      EventSystem_1.EventSystem.Emit(
        EventDefine_1.EEventName.CharAnimBreakPoint,
        this.Entity.Id
      ));
  }
  GetActivePriority(t) {
    return this.CheckIsLoaded() && (t = this.LoadedSkills.get(t))?.Active
      ? t.SkillInfo.InterruptLevel
      : -1;
  }
  GetSkillMontageInstance(t, e) {
    if (this.CheckIsLoaded() && (t = this.LoadedSkills.get(t)))
      return t.GetMontageByIndex(e);
  }
  IsCanUseSkill(t) {
    return (
      !!ModManager_1.ModManager.Settings.NoCD ||
      (!!this.CheckIsLoaded() &&
        !(
          !(e = this.GetSkillInfo(t)) ||
          this.IsSkillInCd(t) ||
          !this.jZr(e.GroupId, e.InterruptLevel) ||
          this.IsSkillGenreForbidden(e)
        ))
    );
    var e;
  }
  ResetRoleGrowComponent(t) {
    this.mZr || (this.mZr = t);
  }
  GetSkillLevelBySkillInfoId(t) {
    return this.mZr
      ? this.mZr.GetSkillLevelBySkillInfoId(t)
      : CharacterAbilityComponent_1.DEFAULT_SOURCE_SKILL_LEVEL;
  }
  GetSkillIdWithGroupId(t) {
    return this.aZr.get(t)?.[SKILL_GROUP_INDEX]?.SkillId ?? 0;
  }
  zZr(t) {
    var e = { Entity: this.Entity, SkillComponent: this, Skill: t },
      i = this.GetSkillInfo(t.SkillId);
    for (let t = 0; t < i.SkillBehaviorGroup.Num(); t++) {
      var r = i.SkillBehaviorGroup.Get(t);
      if (
        SkillBehaviorCondition_1.SkillBehaviorCondition.Satisfy(
          r.SkillBehaviorConditionGroup,
          r.SkillBehaviorConditionFormula,
          e
        ) &&
        (SkillBehaviorAction_1.SkillBehaviorAction.Begin(
          r.SkillBehaviorActionGroup,
          e
        ),
        !r.SkillBehaviorContinue)
      )
        break;
    }
  }
  ien(t) {
    SkillBehaviorAction_1.SkillBehaviorAction.End(t);
  }
  YZr(t, e) {
    let i = this.aZr.get(t);
    i || ((i = []), this.aZr.set(t, i)), i.includes(e) || i.push(e);
  }
  JZr(t, e) {
    (t = this.aZr.get(t)) && -1 !== (e = t.indexOf(e)) && t.splice(e, 1);
  }
  *GetAllActivatedSkill() {
    for (const t of this.aZr.values()) for (const e of t.values()) yield e;
  }
  SetCurAnInfo(t, e) {
    (this.PendingAnIndex = t), (this.PendingAnMontageName = e);
  }
  SetCurSkillAnIndex(t) {
    this.PendingAnIndex = t;
  }
  SetGaPassiveClassToSkillMap(t, e) {
    this.cBn.get(t)
      ? Log_1.Log.CheckError() &&
        Log_1.Log.Error(
          "Character",
          36,
          "GaPassiveClass重复，多个Skill使用了同一个GA"
        )
      : this.cBn.set(t, e);
  }
  GiveSkillDebug(t, e) {
    var i;
    this.LoadedSkills.has(t) ||
      (PreloadDefine_1.PreloadSetting.UseNewPreload &&
        ((i = this.Entity.GetComponent(199)).LoadSkillAsync(t),
        i.FlushSkill(t)),
      this.OZr(t, e));
  }
});
(CharacterSkillComponent.AZr = !1),
  (CharacterSkillComponent.PZr = 0),
  (CharacterSkillComponent.xZr = 0),
  (CharacterSkillComponent = CharacterSkillComponent_1 =
    __decorate(
      [(0, RegisterComponent_1.RegisterComponent)(33)],
      CharacterSkillComponent
    )),
  (exports.CharacterSkillComponent = CharacterSkillComponent);
