"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (t, e, i, r) {
    var s,
      o = arguments.length,
      l =
        o < 3
          ? e
          : null === r
            ? (r = Object.getOwnPropertyDescriptor(e, i))
            : r;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
      l = Reflect.decorate(t, e, i, r);
    else
      for (var n = t.length - 1; 0 <= n; n--)
        (s = t[n]) && (l = (o < 3 ? s(l) : 3 < o ? s(e, i, l) : s(e, i)) || l);
    return 3 < o && l && Object.defineProperty(e, i, l), l;
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
      (this.bzr = void 0),
      (this.qzr = void 0),
      (this.Gzr = void 0),
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
      (this.bzr =
        ModelManager_1.ModelManager.SkillCdModel.GetCurWorldPassiveSkillCdData()),
      (this.qzr = new Map()),
      (this.Gzr = new Map()),
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
    return (
      this.fZo && (this.fZo.RemoveEntity(this.Entity), (this.fZo = void 0)),
      this.bzr && (this.bzr.RemoveEntity(this.Entity), (this.bzr = void 0)),
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
                18,
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
    return this.EZo.CanStartMultiSkill(t);
  }
  StartMultiSkill(t, e = !0) {
    return this.EZo.StartMultiSkill(t, e);
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
    if (t)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error("Battle", 18, "技能重复初始化", ["skillId", e]),
        t
      );
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
            18,
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
        var s = new Set();
        for (const l of t) {
          var o = this.qzr.get(Number(l));
          o && s.add(o);
        }
        for (const n of s) n.ModifyRemainingCd(e, i);
      }
  }
  ModifyCdTimeBySkillGenres(t, e, i) {
    var r = new Array();
    for (const a of t) r.push(Number(a));
    var s,
      o,
      l,
      n = new Set();
    for ([s, o] of this.TGn)
      r.includes(o.SkillGenre) && (l = this.qzr.get(s)) && n.add(l);
    for (const h of n) h.ModifyRemainingCd(e, i);
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
      s = 1;
    if (this.HasModifyCdEffect)
      for (const l of this.BuffComp.BuffEffectManager.FilterById(49))
        this.Hoa(l, e, i) &&
          (0 === l.ModifyType
            ? (r += l.ModifyValue)
            : 1 === l.ModifyType && (s *= l.ModifyValue));
    var o =
      ControllerHolder_1.ControllerHolder.FormationDataController.GetPlayerEntity(
        ModelManager_1.ModelManager.CreatureModel.GetPlayerId(),
      );
    if (o?.GetComponent(191)?.HasModifyCdEffect) {
      o = o?.GetComponent(194);
      if (o)
        for (const n of o.BuffEffectManager.FilterById(49))
          this.Hoa(n, e, i) &&
            (0 === n.ModifyType
              ? (r += n.ModifyValue)
              : 1 === n.ModifyType && (s *= n.ModifyValue));
    }
    return (t + r) * s;
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
            18,
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
          CombatMessage_1.CombatNet.Call(20002, this.Entity, e, () => {}),
          this.EZo?.ResetMultiSkills(t, !0)),
        !0)
      : (Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug(
            "Battle",
            18,
            "修改CD不生效，该技能不记录CD",
            ["EntityId", this.Entity.Id],
            ["skillID", t],
          ),
        !1);
  }
  InitPassiveSkill(t) {
    var e = t.Id,
      i = this.Gzr.get(e);
    return (
      i ||
        ((i = this.bzr.InitPassiveSkillCd(this.Entity, t)), this.Gzr.set(e, i)),
      i
    );
  }
  IsPassiveSkillInCd(t) {
    t = this.Gzr.get(t);
    return !!t && t.IsInCd();
  }
  StartPassiveCd(t, e = -1) {
    var i = this.Gzr.get(t);
    return !!i && (i.StartCd(t, e), !0);
  }
  GetPassiveSkillCdInfo(t) {
    return this.Gzr.get(t);
  }
};
(CharacterSkillCdComponent = __decorate(
  [(0, RegisterComponent_1.RegisterComponent)(192)],
  CharacterSkillCdComponent,
)),
  (exports.CharacterSkillCdComponent = CharacterSkillCdComponent);
//# sourceMappingURL=CharacterSkillCdComponent.js.map
