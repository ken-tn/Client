"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (t, e, i, r) {
    var o,
      s = arguments.length,
      n =
        s < 3
          ? e
          : null === r
            ? (r = Object.getOwnPropertyDescriptor(e, i))
            : r;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
      n = Reflect.decorate(t, e, i, r);
    else
      for (var l = t.length - 1; 0 <= l; l--)
        (o = t[l]) && (n = (s < 3 ? o(n) : 3 < s ? o(e, i, n) : o(e, i)) || n);
    return 3 < s && n && Object.defineProperty(e, i, n), n;
  };
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.CharacterSkillCdComponent = void 0);
const Log_1 = require("../../../../../../Core/Common/Log"),
  Protocol_1 = require("../../../../../../Core/Define/Net/Protocol"),
  RegisterComponent_1 = require("../../../../../../Core/Entity/RegisterComponent"),
  EventDefine_1 = require("../../../../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../../../../Common/Event/EventSystem"),
  GlobalData_1 = require("../../../../../GlobalData"),
  ControllerHolder_1 = require("../../../../../Manager/ControllerHolder"),
  ModelManager_1 = require("../../../../../Manager/ModelManager"),
  CombatMessage_1 = require("../../../../../Module/CombatMessage/CombatMessage"),
  CombatLog_1 = require("../../../../../Utils/CombatLog"),
  ModManager_1 = require("../../../../../Manager/ModManager"),
  BaseSkillCdComponent_1 = require("./BaseSkillCdComponent");
let CharacterSkillCdComponent = class CharacterSkillCdComponent extends BaseSkillCdComponent_1.BaseSkillCdComponent {
  constructor() {
    super(...arguments),
      (this.Bzr = void 0),
      (this.fZo = void 0),
      (this.qzr = void 0),
      (this.TGn = void 0),
      (this.EZo = void 0),
      (this.Arn = (t) => {
        this.EZo.ResetOnChangeRole();
      });
  }
  OnInit() {
    return (
      super.OnInit(),
      (this.Bzr = this.Entity.CheckGetComponent(159)),
      (this.fZo =
        ModelManager_1.ModelManager.SkillCdModel.GetCurWorldSkillCdData()),
      (this.qzr = new Map()),
      (this.TGn = new Map()),
      (this.EZo = this.fZo.InitMultiSkill(this.Entity.Id)),
      this.EZo.Init(this.Entity.Id),
      !0
    );
  }
  OnStart() {
    if (GlobalData_1.GlobalData.IsPlayInEditor)
      for (const t of this.qzr.values()) t.CheckConfigValid();
    return (
      EventSystem_1.EventSystem.AddWithTarget(
        this.Entity,
        EventDefine_1.EEventName.OnChangeRoleCoolDownChanged,
        this.Arn,
      ),
      !0
    );
  }
  OnEnd() {
    super.OnEnd();
    for (const t of this.qzr.values()) t.ClearCdTags(this.Entity.Id);
    return (
      this.fZo && (this.fZo.RemoveEntity(this.Entity), (this.fZo = void 0)),
      EventSystem_1.EventSystem.RemoveWithTarget(
        this.Entity,
        EventDefine_1.EEventName.OnChangeRoleCoolDownChanged,
        this.Arn,
      ),
      !0
    );
  }
  GetMultiSkillInfo(t) {
    return this.EZo.GetMultiSkillInfo(t);
  }
  GetNextMultiSkillId(t) {
    if (GlobalData_1.GlobalData.IsPlayInEditor)
      for (var [e, i] of this.TGn)
        if (e === t) {
          this.IsMultiSkill(i) ||
            (Log_1.Log.CheckError() &&
              Log_1.Log.Error(
                "Battle",
                17,
                "获取多段技能下一段技能Id时，传入的技能Id不是多段技能",
                ["skillId", t],
              ));
          break;
        }
    return this.EZo.GetNextMultiSkillId(t);
  }
  IsMultiSkill(t) {
    return this.EZo.IsMultiSkill(t);
  }
  CanStartMultiSkill(t) {
    return (
      !!ModelManager_1.ModelManager.SkillCdModel?.SkillDebugMode ||
      this.EZo.CanStartMultiSkill(t)
    );
  }
  StartMultiSkill(t, e = !0) {
    return (
      !!ModelManager_1.ModelManager.SkillCdModel?.SkillDebugMode ||
      this.EZo.StartMultiSkill(t, e)
    );
  }
  ResetMultiSkills(t) {
    this.EZo.ResetMultiSkills(t);
  }
  InitSkillCd(t) {
    var e,
      i = t.SkillId,
      r = this.qzr.get(i);
    return (
      r ||
      (1 < (e = t.SkillInfo.CooldownConfig).SectionCount - e.SectionRemaining
        ? void 0
        : ((r = this.fZo.InitSkillCd(this.Entity, t.SkillId, t.SkillInfo)),
          this.qzr.set(i, r),
          this.TGn.set(i, t.SkillInfo),
          r))
    );
  }
  InitSkillCdBySkillInfo(e, i) {
    var t = this.qzr.get(e);
    if (t) return t;
    try {
      var r = i.CooldownConfig;
      return 1 < r.SectionCount - r.SectionRemaining
        ? void 0
        : ((t = this.fZo.InitSkillCd(this.Entity, e, i)),
          this.qzr.set(e, t),
          this.TGn.set(e, i),
          t);
    } catch (t) {
      t instanceof Error
        ? CombatLog_1.CombatLog.ErrorWithStack(
            "Skill",
            this.Entity,
            "初始化技能CD异常",
            t,
            ["skillId", e],
            ["skillId", i?.SkillName],
            ["error", t.message],
          )
        : CombatLog_1.CombatLog.Error(
            "Skill",
            this.Entity,
            "初始化技能CD异常",
            ["skillId", e],
            ["skillId", i?.SkillName],
            ["error", t],
          );
    }
  }
  InitSkillCdTags() {
    var t = ModelManager_1.ModelManager.CharacterModel.GetHandleByEntity(
      this.Entity,
    );
    for (const e of this.qzr.values()) e.InitCdTags(t);
  }
  GetGroupSkillCdInfo(t) {
    return this.qzr.get(t);
  }
  IsSkillInCd(t, e = !0) {
    t = this.qzr.get(t);
    return ModManager_1.ModManager.Settings.NoCD ? 0 : !!t && (e ? !t.HasRemainingCount() : t.IsInCd());
  }
  ModifyCdInfo(t, e) {
    var i;
    return this.qzr
      ? !!(i = this.qzr.get(t)) && ((i.SkillCdInfoMap.get(t).SkillCd = e), !0)
      : (Log_1.Log.CheckWarn() &&
          Log_1.Log.Warn(
            "Battle",
            17,
            "角色技能组件还没有初始化，不允许修改技能CD",
          ),
        !1);
  }
  ModifyCdTime(t, e, i) {
    var r;
    if (t && 0 !== t.length)
      if (1 === t.length)
        (r = this.qzr.get(Number(t[0]))) && r.ModifyRemainingCd(e, i);
      else {
        var o = new Set();
        for (const n of t) {
          var s = this.qzr.get(Number(n));
          s && o.add(s);
        }
        for (const l of o) l.ModifyRemainingCd(e, i);
      }
  }
  ModifyCdTimeBySkillGenres(t, e, i) {
    var r = new Array();
    for (const a of t) r.push(Number(a));
    var o,
      s,
      n,
      l = new Set();
    for ([o, s] of this.TGn)
      r.includes(s.SkillGenre) && (n = this.qzr.get(o)) && l.add(n);
    for (const h of l) h.ModifyRemainingCd(e, i);
  }
  StartCd(t, e) {
    var i = this.qzr.get(t);
    return (
      !!i &&
      (i.StartCd(
        t,
        this.Bzr,
        ModelManager_1.ModelManager.CharacterModel.GetHandleByEntity(
          this.Entity,
        ),
        this,
        e,
      ),
      !0)
    );
  }
  CalcExtraEffectCd(t, e, i) {
    let r = 0,
      o = 1;
    if (this.HasModifyCdEffect)
      for (const n of this.BuffComp.BuffEffectManager.FilterById(49))
        this.Hoa(n, e, i) &&
          (0 === n.ModifyType
            ? (r += n.ModifyValue)
            : 1 === n.ModifyType && (o *= n.ModifyValue));
    var s =
      ControllerHolder_1.ControllerHolder.FormationDataController.GetPlayerEntity(
        ModelManager_1.ModelManager.CreatureModel.GetPlayerId(),
      );
    if (s?.GetComponent(192)?.HasModifyCdEffect) {
      s = s?.GetComponent(195);
      if (s)
        for (const l of s.BuffEffectManager.FilterById(49))
          this.Hoa(l, e, i) &&
            (0 === l.ModifyType
              ? (r += l.ModifyValue)
              : 1 === l.ModifyType && (o *= l.ModifyValue));
    }
    return (t + r) * o;
  }
  Hoa(t, e, i) {
    return 0 === t.SkillType
      ? t.SkillIdOrGenres.has(e)
      : 1 === t.SkillType && t.SkillIdOrGenres.has(i);
  }
  SetLimitCount(t, e) {
    var i = this.qzr.get(t);
    return i
      ? (i.SetLimitCount(e), !0)
      : (Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Battle",
            17,
            "SetLimitCount 不存在该技能:",
            ["EntityId", this.Entity.Id],
            ["limitCount", e],
            ["skillID", t],
          ),
        !1);
  }
  ResetCdDelayTime(t) {
    var e = this.qzr.get(t);
    return e
      ? (e.ResetDelayCd() &&
          (((e = Protocol_1.Aki.Protocol.f4n.create()).r5n = t),
          CombatMessage_1.CombatNet.Call(27214, this.Entity, e, () => {}),
          this.EZo?.ResetMultiSkills(t, !0)),
        !0)
      : (Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug(
            "Battle",
            17,
            "修改CD不生效，该技能不记录CD",
            ["EntityId", this.Entity.Id],
            ["skillID", t],
          ),
        !1);
  }
};
(CharacterSkillCdComponent = __decorate(
  [(0, RegisterComponent_1.RegisterComponent)(193)],
  CharacterSkillCdComponent,
)),
  (exports.CharacterSkillCdComponent = CharacterSkillCdComponent);
//# sourceMappingURL=CharacterSkillCdComponent.js.map
