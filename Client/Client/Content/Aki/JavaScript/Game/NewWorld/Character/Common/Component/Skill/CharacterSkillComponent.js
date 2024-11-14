"use strict";
var CharacterSkillComponent_1,
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
        for (var l = t.length - 1; 0 <= l; l--)
          (h = t[l]) &&
            (o = (r < 3 ? h(o) : 3 < r ? h(i, e, o) : h(i, e)) || o);
      return 3 < r && o && Object.defineProperty(i, e, o), o;
    };
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.CharacterSkillComponent = exports.SKILL_GROUP_MAIN = void 0);
const UE = require("ue"),
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
  AiLibrary_1 = require("../../../../../AI/Common/AiLibrary"),
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
  RolePreloadComponent_1 = require("../RolePreloadComponent"),
  Skill_1 = require("./Skill"),
  ModManager_1 = require("../../../../../Manager/ModManager"),
  SkillBehaviorAction_1 = require("./SkillBehavior/SkillBehaviorAction"),
  SkillBehaviorCondition_1 = require("./SkillBehavior/SkillBehaviorCondition");
var EAttributeId = Protocol_1.Aki.Protocol.Vks;
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
let CharacterSkillComponent =
  (CharacterSkillComponent_1 = class CharacterSkillComponent extends (
    EntityComponent_1.EntityComponent
  ) {
    constructor() {
      super(...arguments),
        (this.Ozr = Stats_1.Stat.Create("BeginSkill")),
        (this.kzr = Stats_1.Stat.Create("BeginSkill1 CheckSkillCanUse")),
        (this.Fzr = Stats_1.Stat.Create("BeginSkill2 InterruptSkill")),
        (this.Vzr = Stats_1.Stat.Create("BeginSkill3 StateMachine")),
        (this.Hzr = Stats_1.Stat.Create("BeginSkill4 SelectTarget")),
        (this.jzr = Stats_1.Stat.Create("BeginSkill5 ActiveSkill")),
        (this.nva = Stats_1.Stat.Create("BeginSkill6 EmitSkillBegin")),
        (this.Wzr = Stats_1.Stat.Create("DoSkillBegin")),
        (this.Kzr = Stats_1.Stat.Create("DoSkillBegin1 NetSend")),
        (this.Qzr = Stats_1.Stat.Create("DoSkillBegin2 SkillBehaviorStart")),
        (this.Xzr = Stats_1.Stat.Create("DoSkillBegin3 CD&Cost")),
        (this.$zr = Stats_1.Stat.Create("DoSkillBegin4 Buff&Tag")),
        (this.Yzr = Stats_1.Stat.Create("DoSkillBegin5 SetAnimState")),
        (this.Jzr = Stats_1.Stat.Create("DoSkillBegin6 Target&Rotation")),
        (this.zzr = Stats_1.Stat.Create("DoSkillBegin7 SetMoveState")),
        (this.Zzr = Stats_1.Stat.Create("RequestEndSkill")),
        (this.eZr = Stats_1.Stat.Create("DoSkillEnd")),
        (this.tZr = Stats_1.Stat.Create("DoSkillEnd1 SkillBehaviorEnd")),
        (this.iZr = Stats_1.Stat.Create("DoSkillEnd2 RestoreSkillInfoStaff")),
        (this.oZr = Stats_1.Stat.Create("DoSkillEnd3 RestoreMoveState")),
        (this.rZr = Stats_1.Stat.Create("DoSkillEnd4 NetSend")),
        (this.nZr = Stats_1.Stat.Create("DoSkillEnd5 EmitSkillEnd")),
        (this.sZr = !1),
        (this.LoadedSkills = new Map()),
        (this.LoadingSkills = new Map()),
        (this.aZr = new Map()),
        (this.hZr = new Set()),
        (this.StartOnGivenList = []),
        (this.lZr = void 0),
        (this._Zr = void 0),
        (this.w6a = new Map()),
        (this.DtSkillInfoExtra = void 0),
        (this.DtSkillInfoMapForDebug = new Map()),
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
        (this.bpr = (t) => {
          (this.SkillTarget = void 0),
            (this.SkillTargetSocket = ""),
            this.EIe?.IsRole() &&
              this.Hte.IsAutonomousProxy &&
              ((t &&
                !ModelManager_1.ModelManager.LevelLoadingModel?.IsLoading) ||
                this.StopAllSkills("CharacterSkillComponent.OnTeleportStart"));
        }),
        (this.v_l = () => {
          this.EIe?.IsRole() &&
            this.Hte.IsAutonomousProxy &&
            this.StopAllSkills(
              "CharacterSkillComponent.OnTeleportOpenLoadingEnd"
            );
        }),
        (this.gZr = () => {
          this.StopGroup1Skill("受击打断技能");
        }),
        (this.OnSwitchControl = (t) => {
          for (var [i, e] of this.LoadedSkills)
            e.Active &&
              (CombatLog_1.CombatLog.Info(
                "Skill",
                this.Entity,
                "切换控制权，结束当前技能",
                ["技能Id", i]
              ),
              e.IsSimulated
                ? this.SimulateEndSkill(i)
                : this.EndSkill(i, "CharacterSkillComponent.OnSwitchControl"));
        }),
        (this.fZr = () => {
          this.Lie.HasTag(-1371021686) ||
            (CombatLog_1.CombatLog.Info(
              "Skill",
              this.Entity,
              "疑难杂症debug日志，RollingGroundedDelay"
            ),
            (this.IsMainSkillReadyEnd = !0)),
            (this.pZr = void 0);
        }),
        (this.pZr = void 0),
        (this.vZr = !1),
        (this.IsMainSkillReadyEnd = !0),
        (this.SkillTarget = void 0),
        (this.SkillTargetSocket = ""),
        (this.MZr = (t) => {
          var i = this.CurrentSkill;
          i &&
            i.SkillInfo.SkillTarget.HateOrLockOnChanged &&
            ((this.SkillTarget =
              ModelManager_1.ModelManager.CharacterModel.GetHandle(t)),
            (this.SkillTargetSocket = ""));
        }),
        (this.ZXr = (t) => {
          this.SkillTarget?.Id === t && this.AUn();
        }),
        (this.zpe = (t, i) => {
          this.SkillTarget === i && this.AUn();
        }),
        (this.I3r = (t) => {
          t = t.GetComponent(34);
          (this.SkillTarget = t.SkillTarget),
            (this.SkillTargetSocket = t.SkillTargetSocket);
        }),
        (this.EZr = !1),
        (this.SZr = void 0),
        (this.yZr = 0),
        (this.IZr = void 0),
        (this.TZr = !1),
        (this.IgnoreSocketName = new Set()),
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
    GetSkillIdByName(t) {
      return this.w6a.get(t);
    }
    GetSkillInfo(e) {
      if (this._Zr && 0 !== e) {
        if (!GlobalData_1.GlobalData.IsPlayInEditor) {
          var s = this.LoadedSkills.get(e);
          if (s) return s.SkillInfo;
        }
        var s = e.toString();
        let i = DataTableUtil_1.DataTableUtil.GetDataTableRow(this._Zr, s);
        if (
          !(i =
            !i && this.DtSkillInfoExtra
              ? DataTableUtil_1.DataTableUtil.GetDataTableRow(
                  this.DtSkillInfoExtra,
                  s
                )
              : i)
        ) {
          let t = void 0;
          var h = this.EIe.GetEntityType();
          h === Protocol_1.Aki.Protocol.kks.Proto_Player
            ? (t =
                ConfigManager_1.ConfigManager.WorldConfig.GetRoleCommonSkillInfo())
            : h === Protocol_1.Aki.Protocol.kks.Proto_Vision &&
              (t =
                ConfigManager_1.ConfigManager.WorldConfig.GetVisionCommonSkillInfo()),
            t && (i = DataTableUtil_1.DataTableUtil.GetDataTableRow(t, s));
        }
        return (
          i ||
            this.EIe.CustomServerEntityIds.forEach((t) => {
              t = ModelManager_1.ModelManager.CreatureModel.GetEntity(t);
              t && (i = t.Entity?.GetComponent(34)?.GetSkillInfo(e));
            }),
          i ||
            ((h = ModelManager_1.ModelManager.CreatureModel.GetEntity(
              this.EIe.VisionSkillServerEntityId
            )) &&
              (i = h.Entity?.GetComponent(34)?.GetSkillInfo(e))),
          i ||
            (this.EIe.VisionControlCreatureDataId &&
              (s = ModelManager_1.ModelManager.CreatureModel.GetEntity(
                this.EIe.VisionControlCreatureDataId
              )) &&
              (i = s.Entity?.GetComponent(34)?.GetSkillInfo(e))),
          i
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
        var i = this.GetSkill(t);
        if (i) return i.InterruptLevel;
        i = this.GetSkillInfo(t);
        if (i) return i.InterruptLevel;
        Log_1.Log.CheckWarn() &&
          Log_1.Log.Warn(
            "Character",
            22,
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
            CommonParamById_1.configCommonParamById.GetIntConfig(
              "fly_priority"
            )),
          (CharacterSkillComponent_1.AZr = !0)),
        (this.EIe = this.Entity.CheckGetComponent(0)),
        (this.Hte = this.Entity.CheckGetComponent(3)),
        !0
      );
    }
    OnStart() {
      return (
        this.wZr(),
        this.Bgl(),
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
        EventSystem_1.EventSystem.Add(
          EventDefine_1.EEventName.TeleportOpenLoadingEnd,
          this.v_l
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
        (this.Bzr = this.Entity.CheckGetComponent(159)),
        (this.$zo = this.Entity.CheckGetComponent(160)),
        (this.Lie = this.Entity.CheckGetComponent(191)),
        (this.AbilityComp = this.Entity.CheckGetComponent(17)),
        (this.mBe = this.Entity.CheckGetComponent(161)),
        (this.Gce = this.Entity.GetComponent(164)),
        (this.uZr = this.Entity.GetComponent(16)),
        (this.cZr = this.Entity.GetComponent(29)),
        (this.bre = this.Entity.GetComponent(40)),
        (this.mZr = this.Entity.GetComponent(86)),
        (this.vHr = this.Entity.GetComponent(110)),
        (this.dZr = this.Entity.GetComponent(193)),
        (this.FightStateComp = this.Entity.GetComponent(48)),
        (this.StateMachineComp = this.Entity.GetComponent(68)),
        (this.MontageComp = this.Entity.CheckGetComponent(22)),
        !0
      );
    }
    OnDisable(t) {
      this.StopAllSkills(t);
    }
    CheckIsLoaded() {
      return (
        this.sZr ||
          CombatLog_1.CombatLog.Info(
            "Skill",
            this.Entity,
            "SkillComponent没有Activate或已经End"
          ),
        this.sZr
      );
    }
    wZr() {
      var t;
      PreloadDefine_1.PreloadSetting.UseNewPreload
        ? (t = this.EIe.GetEntityType()) ===
          Protocol_1.Aki.Protocol.kks.Proto_Player
          ? this.bZr()
          : t === Protocol_1.Aki.Protocol.kks.Proto_Vision
          ? this.qZr()
          : this.EIe?.SummonType !==
            Protocol_1.Aki.Protocol.Summon.x3s.Proto_ESummonTypeDefault
          ? this.gll()
          : t === Protocol_1.Aki.Protocol.kks.Proto_Monster && this.GZr()
        : this.NZr();
    }
    bZr() {
      this.gll();
      for (const r of ConfigManager_1.ConfigManager.WorldConfig.GetRoleCommonSkillRowNames()) {
        var t = Number(r),
          i = this.GetSkillInfo(t);
        i &&
          (this.dZr?.InitSkillCdBySkillInfo(t, i),
          RolePreloadComponent_1.characterCommonSkillSet.has(t)) &&
          !this.LoadedSkills.has(t) &&
          this.OZr(t, i);
      }
      if (this.DtSkillInfoExtra) {
        var e = new Array();
        DataTableUtil_1.DataTableUtil.GetDataTableAllRowNamesFromTable(
          this.DtSkillInfoExtra,
          e
        );
        for (const o of e) {
          var s = Number(o),
            h = this.GetSkillInfo(s);
          h && this.OZr(s, h);
        }
      }
    }
    NZr() {
      var t =
          ControllerHolder_1.ControllerHolder.PreloadController.GetCurCharacterLoadType(),
        i = UE.KismetSystemLibrary.Conv_ClassToSoftClassReference(
          this.Hte.Actor.GetClass()
        ),
        i = UE.KismetSystemLibrary.Conv_SoftClassReferenceToString(i),
        e = ConfigManager_1.ConfigManager.WorldConfig.GetCharacterFightInfo(i);
      e ||
        CombatLog_1.CombatLog.Warn(
          "Skill",
          this.Entity,
          "SkillComponent中找不到FightInfo信息"
        );
      const s = e?.SkillDataTable?.ToAssetPathName();
      s &&
        0 < s.length &&
        "None" !== s &&
        ((a = ResourceSystem_1.ResourceSystem.GetLoadedAsset(
          s,
          UE.DataTable
        )) ||
          CombatLog_1.CombatLog.Warn(
            "Skill",
            this.Entity,
            "SkillComponent中找不到技能表",
            ["ActorPath", i],
            ["技能表Path", s]
          ),
        (this._Zr = a)),
        this.gll();
      let h = [];
      switch (this.EIe.GetEntityType()) {
        case Protocol_1.Aki.Protocol.kks.Proto_Player:
          h =
            ConfigManager_1.ConfigManager.WorldConfig.GetRoleCommonSkillRowNames();
          break;
        case Protocol_1.Aki.Protocol.kks.Proto_Vision:
          h =
            ConfigManager_1.ConfigManager.WorldConfig.GetVisionCommonSkillRowNames();
      }
      for (const v of h) {
        var r = Number(v),
          o = this.GetSkillInfo(r);
        o && this.OZr(r, o);
      }
      const l = e?.BulletDataTable.ToAssetPathName(),
        n =
          (l &&
            0 < l.length &&
            "None" !== l &&
            ((i = ResourceSystem_1.ResourceSystem.GetLoadedAsset(
              l,
              UE.DataTable
            )),
            (this.DtBulletInfo = i)),
          e?.HitEffectTable.ToAssetPathName());
      if (
        (n && 0 < n.length && "None" !== n
          ? ((a = ResourceSystem_1.ResourceSystem.GetLoadedAsset(
              n,
              UE.DataTable
            )),
            (this.DtHitEffect = a))
          : (this.DtHitEffect = this.Hte.Actor.DtHitEffect),
        0 !== t)
      ) {
        const s = e?.SkillDataTableMap.Get(t)?.ToAssetPathName();
        if (
          (s &&
            0 < s.length &&
            "None" !== s &&
            ((i = ResourceSystem_1.ResourceSystem.GetLoadedAsset(
              s,
              UE.DataTable
            )),
            (this.DtSkillInfoExtra = i)),
          this.DtSkillInfoExtra)
        ) {
          var a = new Array();
          DataTableUtil_1.DataTableUtil.GetDataTableAllRowNamesFromTable(
            this.DtSkillInfoExtra,
            a
          );
          for (const k of a) {
            var _ = Number(k),
              S = this.GetSkillInfo(_);
            S && this.OZr(_, S);
          }
        }
        const l = e?.BulletDataTableMap.Get(t)?.ToAssetPathName(),
          n =
            (l &&
              0 < l.length &&
              "None" !== l &&
              ((i = ResourceSystem_1.ResourceSystem.GetLoadedAsset(
                l,
                UE.DataTable
              )),
              (this.DtBulletInfoExtra = i)),
            e?.HitEffectTableMap.Get(t)?.ToAssetPathName());
        n &&
          0 < n.length &&
          "None" !== n &&
          ((a = ResourceSystem_1.ResourceSystem.GetLoadedAsset(
            n,
            UE.DataTable
          )),
          (this.DtHitEffectExtra = a));
      }
    }
    qZr() {
      this.gll();
      for (const e of ConfigManager_1.ConfigManager.WorldConfig.GetVisionCommonSkillRowNames()) {
        var t = Number(e),
          i = this.GetSkillInfo(t);
        i && this.OZr(t, i);
      }
    }
    gll() {
      if (this._Zr) {
        var t = new Array();
        DataTableUtil_1.DataTableUtil.GetDataTableAllRowNamesFromTable(
          this._Zr,
          t
        );
        for (const s of t) {
          var i = Number(s),
            e = this.GetSkillInfo(i);
          e && this.OZr(i, e);
        }
      }
    }
    GZr() {
      if (this._Zr) {
        var t = new Array();
        DataTableUtil_1.DataTableUtil.GetDataTableAllRowNamesFromTable(
          this._Zr,
          t
        );
        for (const s of t) {
          var i = Number(s),
            e = this.GetSkillInfo(i);
          e &&
            (this.w6a.set(e.SkillName.toString(), i), 8 === e.SkillGenre) &&
            this.OZr(i, e);
        }
      }
    }
    OZr(i, e, t = DEFAULT_CD_TIME) {
      if (!this.LoadedSkills.has(i))
        try {
          var s = new Skill_1.Skill(),
            h =
              (this.LoadingSkills.get(i) || this.LoadingSkills.set(i, s),
              this.LoadedSkills.get(i));
          h || this.LoadedSkills.set(i, s),
            s.Initialize(i, e, this),
            this.dZr && (s.GroupSkillCdInfo = this.dZr.InitSkillCd(s));
        } catch (t) {
          t instanceof Error
            ? CombatLog_1.CombatLog.ErrorWithStack(
                "Skill",
                this.Entity,
                "加载技能异常",
                t,
                ["skillId", i],
                ["skillId", e?.SkillName],
                ["error", t.message]
              )
            : CombatLog_1.CombatLog.Error(
                "Skill",
                this.Entity,
                "加载技能异常",
                ["skillId", i],
                ["skillId", e?.SkillName],
                ["error", t]
              );
        }
    }
    Bgl() {
      this.dZr?.InitSkillCdTags();
    }
    BZr() {
      ConfigManager_1.ConfigManager.BulletConfig.PreloadBulletData(this.Entity);
    }
    OnActivate() {
      var t,
        i,
        e = this.EIe.ComponentDataMap.get("Vys")?.Vys;
      if (!this.Hte.IsAutonomousProxy && e?.YIs)
        for (const s of e.YIs)
          s.dVn?.r5n &&
            ((i = MathUtils_1.MathUtils.LongToNumber(s.dVn.CVn)),
            (t = MathUtils_1.MathUtils.LongToBigInt(s.$8n)),
            this.SimulatedBeginSkill(
              s.dVn.r5n,
              i,
              s.dVn.gVn,
              0.001 * s.dVn.n5n,
              t
            )) &&
            (SkillMessageController_1.SkillMessageController.AddSkillMessageId(
              t
            ),
            0 <= s.lVn) &&
            ((i = MathUtils_1.MathUtils.LongToBigInt(s.hVn)),
            this.SimulatePlayMontage(
              s.dVn.r5n,
              s.lVn,
              s.vVn,
              s.XIs,
              s.QIs / 1e3,
              i
            ));
      for (const h of this.StartOnGivenList)
        this.AbilityComp.TryActivateAbilityByClass(h, !1);
      return !(this.StartOnGivenList.length = 0);
    }
    OnChangeTimeDilation(t) {
      var i = this.vHr.CurrentTimeScale;
      for (const e of this.GetAllActivatedSkill()) e.SetTimeDilation(i, t);
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
        EventSystem_1.EventSystem.Remove(
          EventDefine_1.EEventName.TeleportOpenLoadingEnd,
          this.v_l
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
    AttachEffectToSkill(t, i, e, s) {
      var h, r;
      this.CheckIsLoaded() &&
        (h = this.CurrentSkill) &&
        ((r = this.vHr.CurrentTimeScale),
        EffectSystem_1.EffectSystem.SetTimeScale(t, r * this.TimeDilation, !0),
        h.AttachEffect(t, i, e, s));
    }
    kZr(t) {
      let i = 1;
      t = t.SkillInfo;
      return (
        0 === t.SkillGenre
          ? (i =
              1e-4 *
              this.Bzr.GetCurrentValue(EAttributeId.Proto_AutoAttackSpeed))
          : 1 === t.SkillGenre &&
            (i =
              1e-4 *
              this.Bzr.GetCurrentValue(EAttributeId.Proto_CastAttackSpeed)),
        (i = i <= 0 ? 1 : i)
      );
    }
    PlaySkillMontage(t, i, e, s, h) {
      var r = this.CurrentSkill;
      if (!r)
        return (
          CombatLog_1.CombatLog.Error(
            "Skill",
            this.Entity,
            "播放技能蒙太奇时，当前技能不存在",
            ["montageIndex", i]
          ),
          !1
        );
      if (r.IsSimulated)
        return (
          CombatLog_1.CombatLog.Error(
            "Skill",
            this.Entity,
            "播放技能蒙太奇时，当前技能是模拟技能",
            ["montageIndex", i]
          ),
          !1
        );
      if (t && this.Lie.HasTag(-1503953470)) return !1;
      this.mBe.ExitHitState("播放技能蒙太奇");
      (t = this.kZr(r)), (h = r.PlayMontage(i, t, e, s, h));
      return (
        h &&
          SkillMessageController_1.SkillMessageController.MontageRequest(
            this.Entity,
            1,
            r.SkillId?.toString(),
            this.SkillTarget?.Id ?? 0,
            i,
            t,
            e,
            s,
            r.CombatMessageId,
            r.MontageContextId
          ),
        h
      );
    }
    EndOwnerAndFollowSkills() {
      this.StopAllSkills("CharacterSkillComponent.EndOwnerAndFollowSkills");
      var t = this.Entity.GetComponent(49)?.FollowIds;
      if (t)
        for (const e of t) {
          var i = EntitySystem_1.EntitySystem.Get(e)?.GetComponent(34);
          i &&
            i.StopAllSkills("CharacterSkillComponent.EndOwnerAndFollowSkills");
        }
    }
    StopAllSkills(t) {
      if (this.CheckIsLoaded())
        for (const i of this.GetAllActivatedSkill()) this.FZr(i, t);
    }
    StopGroup1Skill(t) {
      var i;
      this.CheckIsLoaded() && (i = this.CurrentSkill) && this.FZr(i, t);
    }
    EndSkill(t, i) {
      this.CheckIsLoaded() &&
        (t = this.LoadedSkills.get(t))?.Active &&
        this.VZr(t, i);
    }
    HZr(t, i, e) {
      var s = t.SkillInfo.GroupId,
        h = t.InterruptLevel;
      return this.jZr(s, h, i, e, t);
    }
    CheckJumpCanInterrupt() {
      return this.jZr(exports.SKILL_GROUP_MAIN, CharacterSkillComponent_1.PZr);
    }
    CheckGlideCanInterrupt() {
      return this.jZr(exports.SKILL_GROUP_MAIN, CharacterSkillComponent_1.xZr);
    }
    jZr(t, i, e = [], s = [], h) {
      let r = !0;
      if (t === exports.SKILL_GROUP_MAIN) {
        var o,
          l,
          n,
          a = this.CurrentSkill;
        a &&
          ((_ = a.InterruptLevel < i),
          (o = a.InterruptLevel === i && this.vZr),
          (l = this.IsMainSkillReadyEnd),
          (n = ModelManager_1.ModelManager.SkillCdModel?.SkillDebugMode ?? !1),
          _ || o || l || n
            ? e.push(a)
            : ((r = !1),
              s.push(a.InterruptLevel.toString()),
              s.push(i.toString()),
              s.push(this.vZr.toString()),
              s.push(this.IsMainSkillReadyEnd.toString())));
      } else {
        var _ = this.aZr.get(t);
        if (_)
          for (const S of _) {
            if (this.IsSkillInCd(S.SkillId)) {
              (r = !1), s.push(`技能${S.SkillId}处于CD中`);
              break;
            }
            S === h && e.push(S);
          }
      }
      return r || (e.length = 0), r;
    }
    FZr(t, i) {
      t?.Active &&
        (t.IsSimulated
          ? this.SimulateEndSkill(t.SkillId)
          : (EventSystem_1.EventSystem.Emit(
              EventDefine_1.EEventName.CharInterruptSkill,
              this.Entity.Id,
              t.SkillId
            ),
            this.VZr(t, i)));
    }
    VZr(t, i) {
      this.Zzr.Start(),
        CombatLog_1.CombatLog.Info(
          "Skill",
          this.Entity,
          "CharacterSkillComponent.RequestEndSkill",
          ["结束技能ID", t.SkillId],
          ["结束技能名称", t.SkillName],
          ["Reason", i],
          ["CanInterrupt", this.vZr],
          ["ReadyEnd", this.IsMainSkillReadyEnd],
          ["InterruptLevel", t.InterruptLevel]
        ),
        this.dZr?.ResetMultiSkills(t.SkillId),
        this.dZr?.ResetCdDelayTime(t.SkillId);
      i = t.SkillInfo.SkillMode;
      1 === i
        ? t.ActiveAbility?.IsValid()
          ? t.ActiveAbility.K2_EndAbility()
          : CombatLog_1.CombatLog.Error(
              "Skill",
              this.Entity,
              "[CharacterSkillComponent.RequestEndSkill]技能结束失败，找不到GA（判断一下是否被动GA，如果是，不能主动执行）",
              ["技能ID", t.SkillId],
              ["技能名称", t.SkillName]
            )
        : 0 === i && t.RequestStopMontage(!0),
        this.Zzr.Stop();
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
          break;
        case 6:
          return this.Lie.HasTag(-1390464883);
        case 7:
          return this.Lie.HasTag(1072084846);
        case 8:
          break;
        case 9:
          return this.Lie.HasTag(1195493782);
        case 10:
          return this.Lie.HasTag(283451623);
        case 11:
          return this.Lie.HasTag(-1936884442);
      }
      return !1;
    }
    WZr(t, i) {
      var e,
        s = t.SkillInfo;
      return this.Hte.IsAutonomousProxy || s.AutonomouslyBySimulate
        ? this.Lie.HasTag(-1388400236)
          ? "角色处于不可控制状态"
          : this.Lie.HasTag(1008164187)
          ? "角色处于死亡状态"
          : this.uZr?.IsFrozen()
          ? "角色处于冰冻状态"
          : this.IsSkillGenreForbidden(s)
          ? "该类别技能被临时禁止"
          : 8 === s.SkillGenre
          ? "不能主动调用被动技能"
          : t.AbilityClass &&
            t.AbilityClass.IsChildOf(UE.Ga_Passive_C.StaticClass()) &&
            !ModelManager_1.ModelManager.SkillCdModel?.SkillDebugMode
          ? "策划可能误把被动GA放在普攻0技能组里"
          : this.IsSkillInCd(t.SkillId)
          ? "技能处于CD中"
          : 0 !== s.StrengthCost &&
            FormationAttributeController_1.FormationAttributeController.GetValue(
              1
            ) <= 1
          ? "体力不足"
          : this.dZr?.IsMultiSkill(t.SkillInfo) &&
            !this.dZr.CanStartMultiSkill(t)
          ? "多段技能启动失败"
          : ((s = this.EIe.GetEntityType()),
            (e = this.bre?.AiController?.IsWaitingSwitchControl()),
            s === Protocol_1.Aki.Protocol.kks.Proto_Monster &&
            !t.SkillInfo.AutonomouslyBySimulate &&
            e
              ? "在等待切换控制权期间，不允许释放普通技能"
              : this.HZr(t, i, (s = []))
              ? ""
              : "技能打断失败[" + s.join(",") + "]")
        : "非主控无权限释放技能";
    }
    KZr(t) {
      if (
        !this.LoadedSkills.has(t) &&
        PreloadDefine_1.PreloadSetting.UseNewPreload
      ) {
        var i = this.Entity.GetComponent(203),
          i = (i.LoadSkillAsync(t), i.FlushSkill(t), this.GetSkillInfo(t));
        if (!i) return;
        this.OZr(t, i),
          CombatLog_1.CombatLog.Info(
            "Skill",
            this.Entity,
            "CharacterSkillComponent.赋予技能",
            ["技能Id", t]
          );
      }
      return this.LoadedSkills.get(t);
    }
    BeginSkill(t, i = {}) {
      if (!ModManager_1.ModManager.Settings.NoCD && !this.CheckIsLoaded())
        return !1;
      const e = this.KZr(t);
      if (!e)
        return (
          CombatLog_1.CombatLog.Error(
            "Skill",
            this.Entity,
            "BeginSkill使用了不存在的技能",
            ["技能Id", t]
          ),
          this.kzr.Stop(),
          this.Ozr.Stop(),
          !1
        );
      CombatLog_1.CombatLog.Info(
        "Skill",
        this.Entity,
        "CharacterSkillComponent.BeginSkill",
        ["技能Id", t],
        ["技能名", e.SkillName],
        ["上下文", i.Context]
      );
      var s = [],
        h = this.WZr(e, s);
      if (h)
        return (
          CombatLog_1.CombatLog.Info(
            "Skill",
            this.Entity,
            "CharacterSkillComponent.CheckSkillCanBegin条件不满足",
            ["技能Id", t],
            ["技能名", e.SkillName],
            ["当前技能", this.CurrentSkill?.SkillId],
            ["当前技能名", this.CurrentSkill?.SkillName],
            ["原因", h]
          ),
          this.kzr.Stop(),
          this.Ozr.Stop(),
          !1
        );
      this.kzr.Stop(),
        this.Fzr.Start(),
        s.forEach((t) => {
          this.FZr(t, "开始新技能");
        }),
        this.Fzr.Stop(),
        this.Vzr.Start();
      var h = this.GetSkillInfo(t),
        s = this.Hte?.IsAutonomousProxy ?? !1,
        r = this.StateMachineComp?.StateMachineGroup?.IsCurrentTaskSkill(t);
      if (this.FightStateComp && h.GroupId === exports.SKILL_GROUP_MAIN && !r) {
        r = this.FightStateComp.TrySwitchSkillState(
          e.InterruptLevel,
          e.SkillInfo,
          !0
        );
        if (!r)
          return (
            CombatLog_1.CombatLog.Info(
              "Skill",
              this.Entity,
              "技能释放失败，状态不满足",
              ["技能Id", t],
              ["技能名", e.SkillName]
            ),
            this.Vzr.Stop(),
            this.Ozr.Stop(),
            !1
          );
        e.FightStateHandle = r;
      } else e.FightStateHandle = 0;
      this.Vzr.Stop(),
        this.Hzr.Start(),
        this.QZr(i.Target, i.SocketName, h.SkillTarget),
        (e.PreContextId = i.ContextId),
        EventSystem_1.EventSystem.EmitWithTarget(
          this.Entity,
          EventDefine_1.EEventName.CharBeforeSkillWithTarget,
          t,
          s
        ),
        this.Hzr.Stop(),
        this.jzr.Start();
      r = h.SkillMode;
      if (1 === r) {
        if (
          ((this.lZr = e),
          !this.AbilityComp.TryActivateAbilityByClass(e.AbilityClass, !0))
        )
          return (
            CombatLog_1.CombatLog.Error(
              "Skill",
              this.Entity,
              "执行GA失败!",
              ["技能Id:", e.SkillId],
              ["技能名", e.SkillName],
              ["GaClass:", e.AbilityClass?.GetName()]
            ),
            (this.lZr = void 0),
            (this.SkillTarget = void 0),
            (this.SkillTargetSocket = ""),
            this.FightStateComp?.ExitState(e.FightStateHandle),
            this.jzr.Stop(),
            this.Ozr.Stop(),
            !1
          );
      } else
        0 === r &&
          (this.XZr(e),
          e.HasMontages
            ? this.PlaySkillMontage(!1, 0, "", 0, () => {
                this.DoSkillEnd(e);
              })
            : (CombatLog_1.CombatLog.Info(
                "Skill",
                this.Entity,
                "SimpleSkill No Montage",
                ["技能Id", e.SkillId],
                ["技能名", e.SkillName]
              ),
              this.DoSkillEnd(e)));
      h.AutonomouslyBySimulate &&
        this.Hte.SetMoveControlled(!0, h.MoveControllerTime, "特殊技能"),
        this.jzr.Stop(),
        this.nva.Start();
      i = this.Entity.Id;
      return (
        EventSystem_1.EventSystem.Emit(
          EventDefine_1.EEventName.CharUseSkill,
          i,
          e.SkillId,
          s
        ),
        SceneTeamController_1.SceneTeamController.EmitEvent(
          this.Entity,
          EventDefine_1.EEventName.CharUseSkill,
          i,
          e.SkillId,
          s
        ),
        EventSystem_1.EventSystem.EmitWithTarget(
          this.Entity,
          EventDefine_1.EEventName.CharRecordOperate,
          this.SkillTarget,
          e.SkillId,
          h.SkillGenre
        ),
        this.$zo?.TriggerEvents(2, this.$zo, {
          SkillId: Number(e.SkillId),
          SkillGenre: h.SkillGenre,
        }),
        this.nva.Stop(),
        this.Ozr.Stop(),
        !0
      );
    }
    $Zr(t, i) {
      return (
        !this.Bzr.IsDeathInternal ||
        (Log_1.Log.CheckWarn() &&
          Log_1.Log.Warn(
            "Battle",
            19,
            "[CBT2临时处理]角色处于死亡中，暂不接受远端通知释放技能。",
            ["skillId", t.SkillId],
            ["entity", this.Entity.toString()]
          ),
        !1)
      );
    }
    SimulatedBeginSkill(t, i, e = !1, s = 0, h = BigInt(0)) {
      var r = this.KZr(t);
      if (!r)
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
        r.AbilityClass &&
        r.AbilityClass.IsChildOf(UE.Ga_Passive_C.StaticClass())
      )
        return (
          CombatLog_1.CombatLog.Warn("Skill", this.Entity, "被动技能不模拟", [
            "技能Id",
            t,
          ]),
          !1
        );
      if (
        (r.Active &&
          r.IsSimulated &&
          CombatLog_1.CombatLog.Warn("Skill", this.Entity, "重复释放远端技能", [
            "技能Id",
            t,
          ]),
        !this.$Zr(r, e))
      )
        return !1;
      var o = r.SkillInfo,
        l = this.StateMachineComp?.StateMachineGroup?.IsCurrentTaskSkill(t);
      if (
        this.FightStateComp &&
        r.SkillInfo.GroupId === exports.SKILL_GROUP_MAIN &&
        !l
      ) {
        l = this.FightStateComp.TrySwitchSkillState(
          r.InterruptLevel,
          r.SkillInfo,
          !1
        );
        if (!l) return !1;
        r.FightStateHandle = l;
      } else r.FightStateHandle = 0;
      return (
        CombatLog_1.CombatLog.Info(
          "Skill",
          this.Entity,
          "执行远端技能",
          ["技能Id", t],
          ["技能名", r.SkillName],
          ["特殊技能", e],
          ["打断等级", r.InterruptLevel]
        ),
        e &&
          (this.CurrentSkill && this.FZr(this.CurrentSkill, "远端特殊技能"),
          this.Hte.SetMoveControlled(!1, s, "远端特殊技能")),
        this.Entity.GetComponent(161).ExitHitState("远端释放技能"),
        SceneTeamController_1.SceneTeamController.EmitEvent(
          this.Entity,
          EventDefine_1.EEventName.CharUseSkillRemote,
          this.Entity.Id,
          r.SkillId
        ),
        this.YZr(o.GroupId, r),
        r.SimulatedBeginSkill(h),
        (this.IsMainSkillReadyEnd = !1),
        (this.SkillTarget =
          ModelManager_1.ModelManager.CreatureModel.GetEntity(i)),
        !0
      );
    }
    SimulateEndSkill(t) {
      var i = this.LoadedSkills.get(t);
      i
        ? i.Active && i.IsSimulated
          ? (CombatLog_1.CombatLog.Info(
              "Skill",
              this.Entity,
              "结束远端技能",
              ["技能Id", t],
              ["技能名", i.SkillName]
            ),
            this.JZr(i.SkillInfo.GroupId, i),
            i.EndSkill(),
            (this.IsMainSkillReadyEnd = !1),
            i.SkillInfo.AutonomouslyBySimulate &&
              this.Hte.ResetMoveControlled("模拟端结束特殊技能"),
            SceneTeamController_1.SceneTeamController.EmitEvent(
              this.Entity,
              EventDefine_1.EEventName.OnSkillEnd,
              this.Entity.Id,
              i.SkillId
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
              ["技能名", i.SkillName]
            )
        : CombatLog_1.CombatLog.Error(
            "Skill",
            this.Entity,
            "远端结束不存在的技能",
            ["技能Id", t]
          );
    }
    OnActivateAbility(t, i) {
      if (t.IsA(UE.Ga_Passive_C.StaticClass())) {
        const e = this.cBn.get(t.GetClass());
        return (
          e
            ? (((s = t).当前技能数据名 = e.toString()),
              (s.SkillId = e),
              (s = this.KZr(e))
                ? SkillMessageController_1.SkillMessageController.UseSkillRequest(
                    this.Entity,
                    s,
                    0
                  )
                : Log_1.Log.CheckWarn() &&
                  Log_1.Log.Warn("Battle", 35, "被动GA没找到skill", [
                    "skillId",
                    e,
                  ]))
            : Log_1.Log.CheckError() &&
              Log_1.Log.Error(
                "Battle",
                35,
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
      const e = this.lZr.SkillId;
      var s;
      return (
        t.IsA(UE.GA_Base_C.StaticClass()) &&
          (((s = t).当前技能数据 = this.lZr.SkillInfo),
          (s.当前技能数据名 = this.lZr.SkillId.toString()),
          (s.SkillId = e)),
        this.XZr(this.lZr),
        (this.lZr = void 0),
        e
      );
    }
    OnEndAbility(t, i) {
      for (const e of this.GetAllActivatedSkill())
        if (e.ActiveAbility === t) return void this.DoSkillEnd(e);
      CombatLog_1.CombatLog.Warn(
        "Skill",
        this.Entity,
        "[CharacterSkillComponent.OnEndAbility]GA已结束，但没有找到对应技能",
        ["GA", t.GetName()]
      );
    }
    QZr(t, i, e) {
      t
        ? ((this.SkillTarget =
            t instanceof Entity_1.Entity
              ? ModelManager_1.ModelManager.CharacterModel.GetHandleByEntity(t)
              : ActorUtils_1.ActorUtils.GetEntityByActor(t)),
          (this.SkillTargetSocket = i ?? ""))
        : this.cZr?.Valid
        ? this.SelectTargetAndSetShow(e)
        : (this.bre?.Valid
            ? (this.SkillTarget =
                this.bre.AiController.AiHateList.GetCurrentTarget())
            : (this.SkillTarget = void 0),
          (this.SkillTargetSocket = ""));
    }
    SelectTargetAndSetShow(t) {
      this.cZr?.Valid &&
        (this.cZr.DetectSoftLockTarget(t),
        (this.SkillTarget = this.cZr.GetCurrentTarget()),
        (this.SkillTargetSocket = this.cZr.GetCurrentTargetSocketName()));
    }
    XZr(t) {
      if ((this.Wzr.Start(), !this.hZr.has(t.SkillId))) {
        this.hZr.add(t.SkillId);
        var i = this.GetSkillInfo(t.SkillId),
          e =
            (t.BeginSkill(),
            this.YZr(i.GroupId, t),
            this.Kzr.Start(),
            SkillMessageController_1.SkillMessageController.UseSkillRequest(
              this.Entity,
              t,
              this.SkillTarget?.Id ?? 0
            ),
            this.Kzr.Stop(),
            this.Qzr.Start(),
            this.zZr(t),
            this.Qzr.Stop(),
            this.Xzr.Start(),
            this.dZr?.IsMultiSkill(t.SkillInfo) &&
              this.dZr.StartMultiSkill(t, !1),
            ModManager_1.ModManager.Settings.NoCD ||
              this.dZr?.StartCd(t.SkillId, t.SkillInfo.SkillGenre),
            0 < Math.abs(i.StrengthCost) &&
              !this.EIe.IsAutoRole() &&
              FormationAttributeController_1.FormationAttributeController.AddValue(
                1,
                ModManager_1.ModManager.Settings.InfiniteStamina
                  ? 0
                  : i.StrengthCost
              ),
            this.Xzr.Stop(),
            this.GetSkillLevelBySkillInfoId(t.SkillId));
        if (
          (i.GroupId === exports.SKILL_GROUP_MAIN &&
            (this.IsMainSkillReadyEnd = !1),
          this.$zr.Start(),
          t.BeginSkillBuffAndTag(e),
          this.$zr.Stop(),
          this.Yzr.Start(),
          this.mBe.ExitHitState("释放技能"),
          t.HasAnimTag || this.mBe.ExitAimStatus(),
          this.Yzr.Stop(),
          this.Jzr.Start(),
          this.SetSkillTargetDirection(
            i.SkillTarget.SkillTargetDirection,
            i.SkillTarget.SkillTargetPriority
          ),
          this.Jzr.Stop(),
          this.zzr.Start(),
          i.WalkOffLedge && this.Gce.SetWalkOffLedgeRecord(!1),
          i.SkillStepUp && this.Gce.SetStepUpParamsRecord(!1),
          exports.SKILL_GROUP_MAIN === i.GroupId)
        ) {
          this.Gce &&
            6 === this.Gce.CharacterMovement.MovementMode &&
            ((e = this.Gce.CharacterMovement.CustomMovementMode) ===
            CustomMovementDefine_1.CUSTOM_MOVEMENTMODE_GLIDE
              ? (i = this.Entity.GetComponent(52)).Valid && i.ExitGlideState()
              : e === CustomMovementDefine_1.CUSTOM_MOVEMENTMODE_SOAR &&
                (i = this.Entity.GetComponent(52)).Valid &&
                i.ExitSoarState());
          var s,
            e = this.mBe.MoveState;
          switch (e) {
            case CharacterUnifiedStateTypes_1.ECharMoveState.Sprint:
              this.Lie.HasTag(-1800191060) ||
                (this.Lie.RemoveTag((s = 388142570)),
                this.$zo.RemoveBuffByTag(s, `技能${t.SkillId}结束移动`),
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
        }
        (this.Gce.CharacterMovement.OverrideTerminalVelocity = 99999),
          this.Gce.SetFallingHorizontalMaxSpeed(99999),
          this.zzr.Stop(),
          this.hZr.delete(t.SkillId),
          this.Wzr.Stop();
      }
    }
    DoSkillEnd(t) {
      var i;
      this.hZr.has(t.SkillId) ||
        (this.hZr.add(t.SkillId),
        this.eZr.Start(),
        CombatLog_1.CombatLog.Info(
          "Skill",
          this.Entity,
          "CharacterSkillComponent.DoSkillEnd",
          ["技能Id", t.SkillId],
          ["技能名", t.SkillName]
        ),
        (i = t.SkillInfo),
        this.tZr.Start(),
        this.ien(t),
        this.tZr.Stop(),
        this.iZr.Start(),
        i.GroupId === exports.SKILL_GROUP_MAIN &&
          ((this.vZr = !1), (this.IsMainSkillReadyEnd = !0), (this.UZr = 0)),
        i.WalkOffLedge && this.Gce.SetWalkOffLedgeRecord(!0),
        i.SkillStepUp && this.Gce.SetStepUpParamsRecord(!0),
        (this.Gce.CharacterMovement.OverrideTerminalVelocity = 0),
        this.Gce.ClearFallingHorizontalMaxSpeed(),
        this.JZr(i.GroupId, t),
        t.EndSkill(),
        this.iZr.Stop(),
        this.oZr.Start(),
        this.$zo.HasBuffAuthority() &&
          this.$zo.RemoveBuff(CharacterBuffIds_1.buffId.GoDown, -1, "技能结束"),
        this.Lie.HasTag(interruptTag) && this.Lie.RemoveTag(interruptTag),
        this.oZr.Stop(),
        this.rZr.Start(),
        SkillMessageController_1.SkillMessageController.EndSkillRequest(
          this.Entity,
          t.SkillId
        ),
        this.rZr.Stop(),
        this.nZr.Start(),
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
          SkillGenre: i.SkillGenre,
        }),
        this.nZr.Stop(),
        this.hZr.delete(t.SkillId),
        this.eZr.Stop());
    }
    PlaySkillMontage2Server(t, i, e, s, h) {
      var r = this.LoadedSkills.get(t);
      r &&
        ((r.MontageContextId =
          ModelManager_1.ModelManager.CombatMessageModel.GenMessageId()),
        SkillMessageController_1.SkillMessageController.MontageRequest(
          this.Entity,
          1,
          r.SkillId?.toString(),
          this.SkillTarget?.Id ?? 0,
          i,
          e,
          s,
          h,
          r.CombatMessageId,
          r.MontageContextId
        ),
        (e = r.GetMontageByIndex(i)),
        this.MontageComp?.PushMontageInfo(
          {
            MontageName: [],
            SkillId: t,
            MontageIndex: i,
            MontageTaskMessageId: r.MontageContextId,
          },
          e
        ));
    }
    EndSkillMontage(t, i) {}
    SimulatePlayMontage(t, i = 0, e = 1, s = "", h = 0, r = BigInt(0)) {
      t = this.LoadedSkills.get(t);
      t && t.Active && t.PlayMontage(i, e, s, h, void 0, r);
    }
    RollingGrounded() {
      (this.IsMainSkillReadyEnd = !1),
        (this.pZr = TimerSystem_1.TimerSystem.Delay(
          this.fZr,
          ROLLING_GROUNDED_RECOVER_TIME
        )),
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
        i,
        e = this.AbilityComp?.GetCurrentWaitAndPlayedMontageCorrespondingGa();
      for ([t, i] of this.LoadedSkills)
        if (i.Active && i.ActiveAbility === e) return t;
      return (
        Log_1.Log.CheckWarn() &&
          Log_1.Log.Warn("Character", 22, "不存在该GA的技能", [
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
    GetSkillTargetForAns() {
      var t;
      return !this.EIe.IsRole() ||
        ((t = this.CurrentSkill) &&
          0 === t.SkillInfo.SkillTarget.SkillTargetDirection)
        ? this.SkillTarget
        : void 0;
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
      var i = this.SkillTarget.Entity.GetComponent(0).GetEntityType();
      if (
        i !== Protocol_1.Aki.Protocol.kks.Proto_Player &&
        i !== Protocol_1.Aki.Protocol.kks.Proto_Npc &&
        i !== Protocol_1.Aki.Protocol.kks.Proto_Monster &&
        i !== Protocol_1.Aki.Protocol.kks.Proto_Vision
      )
        return this.SkillTarget.Entity.GetComponent(1).ActorTransform;
      {
        let t = this.SkillTargetSocket;
        t = t || HIT_CASE_SOCKET_NAME;
        var i = this.SkillTarget.Entity.GetComponent(3),
          e = i.Actor.Mesh,
          s = FNameUtil_1.FNameUtil.GetDynamicFName(t);
        return e?.DoesSocketExist(s)
          ? e.GetSocketTransform(s, 0)
          : i.ActorTransform;
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
    SetRotateTarget(t, i) {
      (this.IZr.Target = t), (this.IZr.Type = i);
    }
    SetSkillRotateToTarget(t, i, e, s = 0, h = 0) {
      (this.TZr = t),
        (this.SZr.IsUseAnsRotateOffset = i),
        (this.SZr.AnsRotateOffset.Yaw = -MathUtils_1.MathUtils.Clamp(
          e,
          -MathUtils_1.PI_DEG,
          MathUtils_1.PI_DEG
        )),
        (this.SZr.PauseRotateThreshold = s),
        (this.SZr.ResumeRotateThreshold = h);
    }
    SetIgnoreSocketName(t) {
      this.IgnoreSocketName.add(t.toString());
    }
    DeleteIgnoreSocketName(t) {
      this.IgnoreSocketName.delete(t.toString());
    }
    SetSkillTargetDirection(t, i = 0) {
      if (this.cZr?.Valid)
        switch (t) {
          case 0:
            this.SkillTarget?.Valid
              ? this.ZZr()
              : 6 === i
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
        ((t = this.Hte.InputDirectProxy),
        0 < Math.abs(t.X) || 0 < Math.abs(t.Y))
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
      var i = Math.abs(this.yZr);
      if (this.TZr) {
        var e = this.ren();
        if (!e) return !1;
        MathUtils_1.MathUtils.LookRotationUpFirst(
          e,
          Vector_1.Vector.UpVectorProxy,
          this.Gue
        ),
          this.Gce.SmoothCharacterRotation(
            this.Gue,
            i,
            t,
            !1,
            "Skill.UpdateAllSkillRotator"
          );
      } else
        this.Gce.SmoothCharacterRotation(
          this.oen(),
          i,
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
      var i = this.Hte.ActorLocationProxy;
      switch (this.IZr.Type) {
        case 0:
          return this.SkillTarget
            ? ((e = this.SkillTarget.Entity.CheckGetComponent(1)),
              this.nen(e, i))
            : void 0;
        case 1:
          var e = this.IZr.Target;
          return this.oxr.DeepCopy(e), this.oxr.SubtractionEqual(i), this.oxr;
        case 2:
          var e = this.IZr.Target;
          return this.oxr.DeepCopy(e), this.oxr;
        case 3:
        case 6: {
          let t = void 0;
          return (t =
            3 === this.IZr.Type
              ? BlackboardController_1.BlackboardController.GetEntityIdByEntity(
                  this.Entity.Id,
                  this.IZr.Target
                )
              : BlackboardController_1.BlackboardController.GetIntValueByEntity(
                  this.Entity.Id,
                  this.IZr.Target
                ))
            ? ((e = EntitySystem_1.EntitySystem.Get(t).CheckGetComponent(1)),
              this.oxr.DeepCopy(e.ActorLocationProxy),
              this.oxr.SubtractionEqual(i),
              this.oxr)
            : void 0;
        }
        case 4:
          e =
            BlackboardController_1.BlackboardController.GetVectorValueByEntity(
              this.Entity.Id,
              this.IZr.Target
            );
          return e
            ? (this.oxr.DeepCopy(e), this.oxr.SubtractionEqual(i), this.oxr)
            : void 0;
        case 5:
          e =
            BlackboardController_1.BlackboardController.GetVectorValueByEntity(
              this.Entity.Id,
              this.IZr.Target
            );
          return e ? (this.oxr.DeepCopy(e), this.oxr) : void 0;
        default:
          return;
      }
    }
    nen(t, i) {
      var e = this.CurrentSkill;
      let s = void 0;
      (s = e ? this.GetTargetTransform() : s)
        ? this.oxr.FromUeVector(s.GetLocation())
        : this.oxr.DeepCopy(t.ActorLocationProxy),
        this.oxr.SubtractionEqual(i),
        this.oxr.Normalize(),
        this.SZr.IsUseAnsRotateOffset &&
          0 !== this.SZr.AnsRotateOffset.Yaw &&
          ((this.oxr.Z = 0),
          this.SZr.AnsRotateOffset.Quaternion().RotateVector(
            this.oxr,
            this.oxr
          ));
      (e = this.Hte.ActorForwardProxy),
        (t = Math.abs(MathUtils_1.MathUtils.GetAngleByVectorDot(this.oxr, e)));
      return (
        this.SZr.IsPaused
          ? 0 < this.SZr.ResumeRotateThreshold &&
            (t < this.SZr.ResumeRotateThreshold
              ? this.oxr.DeepCopy(e)
              : (this.SZr.IsPaused = !1))
          : 0 < this.SZr.PauseRotateThreshold &&
            t < this.SZr.PauseRotateThreshold &&
            ((this.SZr.IsPaused = !0), this.oxr.DeepCopy(e)),
        this.oxr
      );
    }
    GetPointTransform(t) {
      var i;
      return this.CheckIsLoaded() &&
        (i = this.Hte.Actor.Mesh)?.DoesSocketExist(t)
        ? i.GetSocketTransform(t, 0)
        : void 0;
    }
    SelectSkillWithTarget(t, i, e, s, h = !1) {
      var r = t.CharActorComp,
        o = r.Entity.GetComponent(191),
        l = Vector_1.Vector.Create(),
        n =
          (MathUtils_1.MathUtils.InverseTransformPositionNoScale(
            e.FloorLocation,
            e.ActorRotationProxy,
            r.FloorLocation,
            l
          ),
          Vector_1.Vector.GetAngleByVector2D(l)),
        a =
          (MathUtils_1.MathUtils.InverseTransformPositionNoScale(
            r.FloorLocation,
            r.ActorRotationProxy,
            e.FloorLocation,
            l
          ),
          l.Z),
        _ = Math.max(
          l.Size2D() - r.ScaledRadius - e.ScaledRadius,
          MathUtils_1.MathUtils.SmallNumber
        ),
        S = Vector_1.Vector.GetAngleByVector2D(l);
      let v = 0,
        k = 0,
        C = 0;
      h &&
        Log_1.Log.CheckInfo() &&
        Log_1.Log.Info("AI", 6, "SelectSkillWithTarget", [
          "Owner",
          t.CharActorComp.Actor.GetName(),
        ]);
      for (const d of t.AiSkill.ActiveSkillGroup)
        for (const m of t.AiSkill.BaseSkill.RandomSkills[d].ArrayInt) {
          var c,
            u = t.AiSkill.SkillInfos.get(m);
          u
            ? u.SkillWeight <= 0 ||
              (AiLibrary_1.AiLibrary.IsSkillAvailable(
                t,
                m,
                i,
                o,
                s,
                n,
                a,
                _,
                S,
                !0,
                h
              ) &&
                ((c = u.SkillWeight),
                (v += c),
                MathUtils_1.MathUtils.GetRandomRange(0, v) < c) &&
                ((k = m), (C = Number(u.SkillId))))
            : Log_1.Log.CheckError() &&
              Log_1.Log.Error("BehaviorTree", 6, "没有配置技能库", ["Id", m]);
        }
      return (
        h &&
          Log_1.Log.CheckInfo() &&
          Log_1.Log.Info("AI", 6, "SelectSkillWithTarget Success", [
            "SkillId",
            C,
          ]),
        !!C &&
          (BlackboardController_1.BlackboardController.SetStringValueByEntity(
            r.Entity.Id,
            "SkillId",
            C.toString()
          ),
          BlackboardController_1.BlackboardController.SetIntValueByEntity(
            r.Entity.Id,
            "SkillInfoId",
            k
          ),
          !0)
      );
    }
    SelectSkillWithoutTarget(o, l, n) {
      var t = o.CharActorComp;
      const a = t.Entity.GetComponent(191);
      let _ = 0,
        S = 0,
        v = 0;
      return (
        o.AiSkill.ActiveSkillGroup.forEach((t, i, e) => {
          o.AiSkill.BaseSkill.RandomSkills[t].ArrayInt.forEach((t, i, e) => {
            var s,
              h,
              r = o.AiSkill.SkillInfos.get(t);
            r
              ? (h = o.AiSkill.SkillPreconditionMap.get(r.SkillPreconditionId))
                ? h.NeedTarget ||
                  (0 <= n && r.SkillType !== n) ||
                  (l.IsCanUseSkill(Number(r.SkillId)) &&
                    o.AiSkill.CanActivate(t) &&
                    ((s = o.AiSkill.PreconditionTagMap.get(
                      r.SkillPreconditionId
                    )?.TagId),
                    !h.NeedTag || !s || (a.Valid && a.HasTag(s))) &&
                    ((h = r.SkillWeight),
                    (_ += h),
                    MathUtils_1.MathUtils.GetRandomRange(0, _) < h) &&
                    ((S = t), (v = Number(r.SkillId))))
                : Log_1.Log.CheckError() &&
                  Log_1.Log.Error("BehaviorTree", 6, "没有配置技能前置条件", [
                    "Id",
                    r.SkillPreconditionId,
                  ])
              : Log_1.Log.CheckError() &&
                Log_1.Log.Error("BehaviorTree", 6, "没有配置技能库", ["Id", t]);
          });
        }),
        !!v &&
          (BlackboardController_1.BlackboardController.SetStringValueByEntity(
            t.Entity.Id,
            "SkillId",
            v.toString()
          ),
          BlackboardController_1.BlackboardController.SetIntValueByEntity(
            t.Entity.Id,
            "SkillInfoId",
            S
          ),
          !0)
      );
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
    SetSkillPriority(t, i) {
      this.CheckIsLoaded() &&
        (t = this.LoadedSkills.get(t))?.Active &&
        (t.InterruptLevel = i);
    }
    CallAnimBreakPoint() {
      this.CheckIsLoaded() &&
        (this.Lie.HasTag(interruptTag) || this.Lie.AddTag(interruptTag),
        EventSystem_1.EventSystem.Emit(
          EventDefine_1.EEventName.CharAnimBreakPoint,
          this.Entity.Id
        ));
    }
    GetActivePriority(t) {
      return this.CheckIsLoaded() && (t = this.LoadedSkills.get(t))?.Active
        ? t.InterruptLevel
        : -1;
    }
    GetSkillMontageInstance(t, i) {
      if (this.CheckIsLoaded()) {
        t = this.LoadedSkills.get(t);
        if (t) return t.GetMontageByIndex(i);
      }
    }
    IsCanUseSkill(t) {
      var i;
      return ModManager_1.ModManager.Settings.NoCD
        ? true
        : !!this.CheckIsLoaded() &&
            !(
              !(i = this.GetSkillInfo(t)) ||
              this.IsSkillInCd(t) ||
              !this.jZr(i.GroupId, this.GetPriority(t)) ||
              this.IsSkillGenreForbidden(i)
            );
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
      var i = { Entity: this.Entity, SkillComponent: this, Skill: t },
        e = this.GetSkillInfo(t.SkillId);
      for (let t = 0; t < e.SkillBehaviorGroup.Num(); t++) {
        var s = e.SkillBehaviorGroup.Get(t);
        if (
          SkillBehaviorCondition_1.SkillBehaviorCondition.SatisfyGroup(
            s.SkillBehaviorConditionGroup,
            s.SkillBehaviorConditionFormula,
            i
          ) &&
          (SkillBehaviorAction_1.SkillBehaviorAction.BeginGroup(
            s.SkillBehaviorActionGroup,
            i
          ),
          !s.SkillBehaviorContinue)
        )
          break;
      }
    }
    ien(t) {
      SkillBehaviorAction_1.SkillBehaviorAction.End(t);
    }
    YZr(t, i) {
      let e = this.aZr.get(t);
      e || ((e = []), this.aZr.set(t, e)), e.includes(i) || e.push(i);
    }
    JZr(t, i) {
      t = this.aZr.get(t);
      t && -1 !== (i = t.indexOf(i)) && t.splice(i, 1);
    }
    *GetAllActivatedSkill() {
      for (const t of this.aZr.values()) for (const i of t.values()) yield i;
    }
    SetCurAnInfo(t, i) {
      (this.PendingAnIndex = t), (this.PendingAnMontageName = i);
    }
    SetCurSkillAnIndex(t) {
      this.PendingAnIndex = t;
    }
    SetGaPassiveClassToSkillMap(t, i) {
      this.cBn.get(t)
        ? Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Character",
            35,
            "GaPassiveClass重复,多个Skill用了一个GA",
            ["existedSkillId", this.cBn.get(t)],
            ["curSkillId", i]
          )
        : this.cBn.set(t, i);
    }
    GiveSkillDebug(t, i) {
      var e;
      this.LoadedSkills.has(t) ||
        (PreloadDefine_1.PreloadSetting.UseNewPreload &&
          ((e = this.Entity.GetComponent(203)).LoadSkillAsync(t),
          e.FlushSkill(t)),
        this.OZr(t, i));
    }
  });
(CharacterSkillComponent.AZr = !1),
  (CharacterSkillComponent.PZr = 0),
  (CharacterSkillComponent.xZr = 0),
  (CharacterSkillComponent = CharacterSkillComponent_1 =
    __decorate(
      [(0, RegisterComponent_1.RegisterComponent)(34)],
      CharacterSkillComponent
    )),
  (exports.CharacterSkillComponent = CharacterSkillComponent);
//# sourceMappingURL=CharacterSkillComponent.js.map
