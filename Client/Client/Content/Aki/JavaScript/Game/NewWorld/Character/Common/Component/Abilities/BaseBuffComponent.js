"use strict";
var BaseBuffComponent_1,
  __decorate =
    (this && this.__decorate) ||
    function (t, e, f, i) {
      var r,
        o = arguments.length,
        s =
          o < 3
            ? e
            : null === i
              ? (i = Object.getOwnPropertyDescriptor(e, f))
              : i;
      if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        s = Reflect.decorate(t, e, f, i);
      else
        for (var n = t.length - 1; 0 <= n; n--)
          (r = t[n]) &&
            (s = (o < 3 ? r(s) : 3 < o ? r(e, f, s) : r(e, f)) || s);
      return 3 < o && s && Object.defineProperty(e, f, s), s;
    };
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.BaseBuffComponent = void 0);
const Info_1 = require("../../../../../../Core/Common/Info"),
  Stats_1 = require("../../../../../../Core/Common/Stats"),
  Time_1 = require("../../../../../../Core/Common/Time"),
  CommonDefine_1 = require("../../../../../../Core/Define/CommonDefine"),
  Protocol_1 = require("../../../../../../Core/Define/Net/Protocol"),
  EntityComponent_1 = require("../../../../../../Core/Entity/EntityComponent"),
  RegisterComponent_1 = require("../../../../../../Core/Entity/RegisterComponent"),
  Net_1 = require("../../../../../../Core/Net/Net"),
  RandomSystem_1 = require("../../../../../../Core/Random/RandomSystem"),
  TimerSystem_1 = require("../../../../../../Core/Timer/TimerSystem"),
  GameplayTagUtils_1 = require("../../../../../../Core/Utils/GameplayTagUtils"),
  StatDefine_1 = require("../../../../../Common/StatDefine"),
  ModelManager_1 = require("../../../../../Manager/ModelManager"),
  SkillMessageController_1 = require("../../../../../Module/CombatMessage/SkillMessageController"),
  CombatLog_1 = require("../../../../../Utils/CombatLog"),
  ActiveBuff_1 = require("./Buff/ActiveBuff"),
  ActiveBuffConfigs_1 = require("./Buff/ActiveBuffConfigs"),
  CharacterAttributeTypes_1 = require("./CharacterAttributeTypes"),
  CharacterBuffController_1 = require("./CharacterBuffController"),
  CharacterBuffIds_1 = require("./CharacterBuffIds"),
  ExtraEffectDefine_1 = require("./ExtraEffect/ExtraEffectDefine");
const { ModUtils } = require("../../../../../Manager/ModFuncs/ModUtils");
let BaseBuffComponent = (BaseBuffComponent_1 = class BaseBuffComponent extends (
  EntityComponent_1.EntityComponent
) {
  constructor() {
    super(...arguments),
      (this.CreatureDataComponent = void 0),
      (this.DeathComponent = void 0),
      (this.BuffContainer = new Map()),
      (this.BuffGarbageSet = new Set()),
      (this.BuffEffectManager = void 0),
      (this.TagListenerDict = new Map()),
      (this.TagImmuneListenerDict = new Map()),
      (this.VictimTagListenerDict = new Map()),
      (this.VictimBuffListenerDict = new Map()),
      (this.EffectTimeoutMap = new Map()),
      (this.Mbr = 0),
      (this.TriggerMap = new Map());
  }
  GetDebugName() {
    return "";
  }
  OnInit() {
    return (
      super.OnInit(),
      (this.CreatureDataComponent = this.Entity.GetComponent(0)),
      (this.DeathComponent = this.Entity.GetComponent(15)),
      !0
    );
  }
  OnClear() {
    var t = this.BuffEffectManager;
    if (t) {
      for (const e of t.FilterById(31)) e?.OnRemoved(!0);
      for (const f of t.FilterById(33)) f?.OnRemoved(!0);
      for (const i of t.FilterById(32)) i?.OnRemoved(!0);
      for (const r of t.FilterById(51)) r?.OnRemoved();
      for (const o of t.FilterById(50)) o?.OnRemoved();
      for (const s of t.FilterById(21)) s?.OnRemoved(!0);
      t.Clear();
    }
    return (
      this.BuffContainer.clear(),
      this.BuffGarbageSet.clear(),
      this.EffectTimeoutMap.clear(),
      !0
    );
  }
  OnTick(t) {
    return !(this.BuffLock = 0);
  }
  NeedBroadcastBuff(t, e = !1) {
    return !e && this.HasBuffAuthority();
  }
  HasBuffAuthority() {
    return !1;
  }
  GetEntity() {}
  GetExactEntity() {
    return this.Entity;
  }
  GetAttributeComponent() {}
  GetTagComponent() {}
  GetSkillComponent() {}
  GetPassiveSkillComponent() {
    return this.GetEntity()?.GetComponent(23);
  }
  GetActorComponent() {}
  GetCueComponent() {}
  GetTimeScale() {
    return 0;
  }
  pSa(t, e, f) {
    let i = t.get(e);
    i || t.set(e, (i = new Set())), i.add(f);
  }
  EUi(t, e, f, i) {
    let r = t.get(e),
      o = (r || t.set(e, (r = new Map())), r.get(f));
    o || r.set(f, (o = new Set())), o.add(i);
  }
  vSa(t, e, f) {
    var i = t.get(e);
    i && (i.delete(f), i.size <= 0) && t.delete(e);
  }
  MSa(t, e, f, i) {
    var r,
      o = t.get(e);
    o &&
      (r = o.get(f)) &&
      (r.delete(i), r.size <= 0) &&
      (o.delete(f), o.size <= 0) &&
      t.delete(e);
  }
  GetInvolvedTags(t) {
    var e = [];
    return (
      t.ActivateTagRequirements && e.push(...t.ActivateTagRequirements),
      t.ActivateTagIgnores && e.push(...t.ActivateTagIgnores),
      t.RemoveTagExistAll && e.push(...t.RemoveTagExistAll),
      t.RemoveTagExistAny && e.push(...t.RemoveTagExistAny),
      t.RemoveTagIgnores && e.push(...t.RemoveTagIgnores),
      e
    );
  }
  GetInvolvedInstigatorTags(t) {
    var e = [];
    if (t.BuffAction)
      for (const f of t.BuffAction)
        switch (f.Type) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
            e.push(...f.Tags);
        }
    return e;
  }
  GetInvolvedInstigatorBuffIds(t) {
    var e = [];
    if (t.BuffAction)
      for (const f of t.BuffAction)
        switch (f.Type) {
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 14:
          case 15:
          case 16:
            e.push(...f.Buffs);
        }
    return e;
  }
  MarkListenerBuff(t) {
    if (this.NeedCheck(t.Config)) {
      var e = t.Config;
      if (e) {
        var f = t.Handle;
        for (const o of this.GetInvolvedTags(e))
          this.pSa(this.TagListenerDict, o, f);
        if (e.ImmuneTags)
          for (const s of e.ImmuneTags.values())
            this.pSa(this.TagImmuneListenerDict, s, f);
        var i = t.GetInstigatorBuffComponent(),
          r = this.CreatureDataComponent?.GetCreatureDataId();
        if (i && r) {
          for (const n of this.GetInvolvedInstigatorTags(e))
            i.EUi(i.VictimTagListenerDict, n, r, f);
          for (const a of this.GetInvolvedInstigatorBuffIds(e))
            i.EUi(i.VictimBuffListenerDict, a, r, f);
        }
      }
    }
  }
  RemoveListenerBuff(t) {
    if (this.NeedCheck(t.Config)) {
      var e = t.Config;
      if (e) {
        var f = t.Handle;
        for (const o of this.GetInvolvedTags(e))
          this.vSa(this.TagListenerDict, o, f);
        if (e.ImmuneTags)
          for (const s of e.ImmuneTags.values())
            this.vSa(this.TagImmuneListenerDict, s, f);
        var i = t.GetInstigatorBuffComponent(),
          r = this.CreatureDataComponent?.GetCreatureDataId();
        if (i && r) {
          for (const n of this.GetInvolvedInstigatorTags(e))
            i.MSa(i.VictimTagListenerDict, n, r, f);
          for (const a of this.GetInvolvedInstigatorBuffIds(e))
            i.MSa(i.VictimBuffListenerDict, a, r, f);
        }
      }
    }
  }
  CheckWhenTagChanged(t) {
    this.BuffLock++;
    const e = this.TagListenerDict.get(t);
    var f = GameplayTagUtils_1.GameplayTagUtils.GetNameByTagId(t);
    if (e) {
      for (const v of [...e]) {
        var i = this.GetBuffByHandle(v);
        i &&
          this.CheckRemove(i.Config, i.GetInstigator()) &&
          this.RemoveBuffInner(v, -1, !0, `因为tag ${f}的变化触发`);
      }
      for (const B of [...e]) {
        var r,
          o = this.GetBuffByHandle(B);
        o
          ? (r = this.CheckActivate(o.Config, o.GetInstigator())) !==
              o.IsActive() && this.OnBuffActiveChanged(o, r)
          : this.vSa(this.TagListenerDict, t, B);
      }
    }
    var s = this.VictimTagListenerDict.get(t);
    if (s) {
      for (const [d, e] of [...s])
        for (const C of [...e]) {
          var n =
              ModelManager_1.ModelManager.CreatureModel.GetEntity(
                d,
              )?.Entity?.GetComponent(194),
            a = n?.GetBuffByHandle(C);
          n &&
            a &&
            n.CheckRemove(a.Config, a.GetInstigator()) &&
            n.RemoveBuffInner(C, -1, !0, `因为施加者的tag ${f}的变化触发`);
        }
      for (const [l, e] of [...s])
        for (const _ of [...e]) {
          var u,
            h =
              ModelManager_1.ModelManager.CreatureModel.GetEntity(
                l,
              )?.Entity?.GetComponent(194),
            c = h?.GetBuffByHandle(_);
          h && c
            ? (u = h.CheckActivate(c.Config, c.GetInstigator())) !==
                c.IsActive() && h?.OnBuffActiveChanged(c, u)
            : this.MSa(this.VictimTagListenerDict, t, l, _);
        }
    }
    this.BuffLock--;
  }
  CheckWhenBuffChanged(t) {
    this.BuffLock++;
    var e = this.VictimBuffListenerDict.get(t);
    if (e) {
      for (var [f, i] of [...e])
        for (const c of [...i]) {
          var r =
              ModelManager_1.ModelManager.CreatureModel.GetEntity(
                f,
              )?.Entity?.GetComponent(194),
            o = r?.GetBuffByHandle(c);
          r &&
            o &&
            r.CheckRemove(o.Config, o.GetInstigator()) &&
            r.RemoveBuffInner(c, -1, !0, `因为施加者的buff ${t}的变化触发`);
        }
      for (var [s, n] of [...e])
        for (const v of [...n]) {
          var a,
            u =
              ModelManager_1.ModelManager.CreatureModel.GetEntity(
                s,
              )?.Entity?.GetComponent(194),
            h = u?.GetBuffByHandle(v);
          u && h
            ? (a = u.CheckActivate(h.Config, h.GetInstigator())) !==
                h.IsActive() && u?.OnBuffActiveChanged(h, a)
            : this.MSa(this.VictimBuffListenerDict, t, s, v);
        }
    }
    this.BuffLock--;
  }
  IsPaused() {
    return !1;
  }
  RefreshTimeScale() {
    var t = this.GetTimeScale(),
      e = this.IsPaused();
    for (const f of this.BuffContainer.values()) f.OnTimeScaleChanged(t, e);
  }
  OnChangeTimeDilation() {
    return this.RefreshTimeScale(), !0;
  }
  NeedCheck(t) {
    return (
      !!t &&
      (t.Id === ActiveBuffConfigs_1.DYNAMIC_BUFF_ID || this.HasBuffAuthority())
    );
  }
  CheckAdd(t, e, f) {
    if (f) return !0;
    if (!t) return !1;
    if (!f && this.NeedCheck(t)) {
      if (
        this.DeathComponent?.IsDead() &&
        t.EffectInfos?.some((t) => 36 === t.ExtraEffectId)
      )
        return !1;
      const i = this.GetTagComponent();
      f = ModelManager_1.ModelManager.CreatureModel.GetEntity(e)?.Entity;
      const r = f?.GetComponent(190);
      if (
        t.Probability < CharacterAttributeTypes_1.PER_TEN_THOUSAND &&
        RandomSystem_1.default.GetRandomPercent() > t.Probability
      )
        return !1;
      if (!i) return !1;
      if (
        t.AddTagIgnores?.some((t) => i.HasTag(t)) ||
        t.AddTagRequirements?.some((t) => !i.HasTag(t))
      )
        return !1;
      if (this.CheckRemove(t, f)) return !1;
      if (
        t.RemoveTagIgnores &&
        0 < t.RemoveTagIgnores.length &&
        !t.RemoveTagIgnores.some((t) => i.HasTag(t))
      )
        return !1;
      e = t.RemoveTagExistAll ?? [];
      if (0 < e.length && e.every((t) => i.HasTag(t))) return !1;
      f = t.RemoveTagExistAny ?? [];
      if (0 < f.length && f.some((t) => i.HasTag(t))) return !1;
      if (
        r &&
        (t.AddInstigatorTagIgnores?.some((t) => r.HasTag(t)) ||
          t.AddInstigatorTagRequirements?.some((t) => !r.HasTag(t)))
      )
        return !1;
    }
    return !this.CheckImmune(t);
  }
  CheckImmune(t) {
    for (const i of this.TagImmuneListenerDict.keys())
      if (
        t.GrantedTags?.some((t) =>
          GameplayTagUtils_1.GameplayTagUtils.IsChildTag(t, i),
        )
      )
        for (const r of this.TagImmuneListenerDict.get(i).keys()) {
          var e = this.BuffContainer.get(r),
            f = e?.Config;
          if (f && e && e.IsValid() && e.IsActive() && t.GrantedTags) {
            f =
              GameplayTagUtils_1.GameplayTagUtils.HasAll(
                t.GrantedTags,
                f.ImmuneTags,
              ) &&
              !GameplayTagUtils_1.GameplayTagUtils.HasAny(
                t.GrantedTags,
                f.ImmuneTagIgnores,
              );
            if (e?.IsActive() && f) return !0;
          }
        }
    return !1;
  }
  HasTagRemoveCheck(t) {
    return (
      !!(
        t.RemoveTagIgnores?.length ||
        t.RemoveTagExistAll?.length ||
        t.RemoveTagExistAny?.length
      ) ||
      !!t.BuffAction?.some(
        (t) => 2 === t.Type || 1 === t.Type || 4 === t.Type || 3 === t.Type,
      )
    );
  }
  CheckRemoveAction(t, e) {
    if (t.BuffAction) {
      const f = e?.GetComponent(190),
        i = e?.GetComponent(194);
      for (const r of t.BuffAction)
        switch (r.Type) {
          case 2:
            if (f && r.Tags.every((t) => f.HasTag(t))) return !0;
            break;
          case 1:
            if (f && r.Tags.some((t) => f.HasTag(t))) return !0;
            break;
          case 4:
            if (f && r.Tags.every((t) => !f.HasTag(t))) return !0;
            break;
          case 3:
            if (f && r.Tags.some((t) => !f.HasTag(t))) return !0;
            break;
          case 10:
            if (i && r.Buffs.every((t) => i.HasActiveBuff(t))) return !0;
            break;
          case 9:
            if (i && r.Buffs.some((t) => i.HasActiveBuff(t))) return !0;
            break;
          case 12:
            if (i && r.Buffs.every((t) => !i.HasActiveBuff(t))) return !0;
            break;
          case 11:
            if (i && r.Buffs.some((t) => !i.HasActiveBuff(t))) return !0;
        }
    }
    return !1;
  }
  CheckInactivateAction(t, e) {
    if (t.BuffAction) {
      const f = e?.GetComponent(190),
        i = e?.GetComponent(194);
      for (const r of t.BuffAction)
        switch (r.Type) {
          case 6:
            if (f && r.Tags.every((t) => f.HasTag(t))) return !0;
            break;
          case 5:
            if (f && r.Tags.some((t) => f.HasTag(t))) return !0;
            break;
          case 8:
            if (f && r.Tags.every((t) => !f.HasTag(t))) return !0;
            break;
          case 7:
            if (f && r.Tags.some((t) => !f.HasTag(t))) return !0;
            break;
          case 14:
            if (i && r.Buffs.every((t) => i.HasActiveBuff(t))) return !0;
            break;
          case 13:
            if (i && r.Buffs.some((t) => i.HasActiveBuff(t))) return !0;
            break;
          case 16:
            if (i && r.Buffs.every((t) => !i.HasActiveBuff(t))) return !0;
            break;
          case 15:
            if (i && r.Buffs.some((t) => !i.HasActiveBuff(t))) return !0;
        }
    }
    return !1;
  }
  CheckRemove(t, e) {
    const f = this.GetTagComponent();
    var i, r;
    return f
      ? !!this.CheckRemoveAction(t, e) ||
          ((e =
            !!t.RemoveTagIgnores?.length &&
            !t.RemoveTagIgnores.some((t) => f.HasTag(t))),
          (i =
            !!t.RemoveTagExistAll?.length &&
            t.RemoveTagExistAll.every((t) => f.HasTag(t))),
          (r =
            !!t.RemoveTagExistAny?.length &&
            t.RemoveTagExistAny.some((t) => f.HasTag(t))),
          e) ||
          i ||
          r
      : !!this.HasTagRemoveCheck(t) &&
          (CombatLog_1.CombatLog.Warn(
            "Buff",
            this.Entity,
            "检查buff移除条件时找不到Tag组件，默认移除",
            ["buffId", t.Id],
          ),
          !0);
  }
  CheckActivate(t, e) {
    const f = this.GetTagComponent();
    return !(
      !f ||
      t.ActivateTagIgnores?.some((t) => f.HasTag(t)) ||
      t.ActivateTagRequirements?.some((t) => !f.HasTag(t)) ||
      this.CheckInactivateAction(t, e)
    );
  }
  SetBuffEffectCd(t, e, f) {
    let i = this.EffectTimeoutMap.get(t);
    i || this.EffectTimeoutMap.set(t, (i = new Map())),
      f <= 0 ? i.delete(e) : i.set(e, Time_1.Time.ServerStopTimeStamp + f);
  }
  GetBuffEffectCd(t, e) {
    t = this.EffectTimeoutMap.get(t)?.get(e);
    return void 0 === t || t <= Time_1.Time.ServerStopTimeStamp
      ? 0
      : t - Time_1.Time.ServerStopTimeStamp;
  }
  CreateAnimNotifyContentWithAnimBp() {
    var t = this.GetSkillComponent()?.CurrentSkill;
    if (t) {
      var e,
        f = t.CombatMessageId,
        i = this.GetSkillComponent().PendingAnIndex;
      if (f && -1 !== i)
        return (
          (e = ModelManager_1.ModelManager.CombatMessageModel.GenMessageId()),
          SkillMessageController_1.SkillMessageController.AnimNotifyRequest(
            this.Entity,
            t.SkillId,
            -1,
            i,
            f,
            e,
          ),
          e
        );
      CombatLog_1.CombatLog.Error("Buff", this.Entity, "CreateANCFromSkill", [
        "ANIndex",
        i,
      ]);
    }
  }
  CreateAnimNotifyContentWithoutSkill(t) {
    var e;
    if (t)
      return (
        (e = ModelManager_1.ModelManager.CombatMessageModel.GenMessageId()),
        SkillMessageController_1.SkillMessageController.AnimNotifyRequest(
          this.Entity,
          -1,
          -1,
          this.GetSkillComponent()?.PendingAnIndex ?? -1,
          t,
          e,
        ),
        e
      );
  }
  CreateAnimNotifyContentWithSkill(e) {
    var f = this.GetSkillComponent()?.GetSkill(e.SkillId);
    if (f && void 0 !== e.MontageIndex) {
      var i = f.SkillId;
      let t = e.MontageTaskMessageId;
      t = t || f.CombatMessageId;
      var r,
        f = this.GetSkillComponent().PendingAnIndex;
      if (t && -1 !== f)
        return (
          (e = e.MontageIndex),
          (r = ModelManager_1.ModelManager.CombatMessageModel.GenMessageId()),
          SkillMessageController_1.SkillMessageController.AnimNotifyRequest(
            this.Entity,
            i,
            e,
            f,
            t,
            r,
          ),
          r
        );
      CombatLog_1.CombatLog.Error("Buff", this.Entity, "CreateANCFromSkill", [
        "ANIndex",
        f,
      ]);
    }
  }
  CreateAnimNotifyContent(t, e) {
    if (
      (!t || !CharacterBuffIds_1.specialIgnoreBuff.includes(t)) &&
      (!e || !CharacterBuffIds_1.specialIgnoreBullet.includes(e))
    )
      return (t = this.Entity.GetComponent(22)?.GetMontageInfo(
        this.GetSkillComponent().PendingAnMontageName,
      ))
        ? this.GetSkillComponent()?.GetSkill(t.SkillId ?? 0)
          ? this.CreateAnimNotifyContentWithSkill(t)
          : this.CreateAnimNotifyContentWithoutSkill(t.MontageTaskMessageId)
        : this.CreateAnimNotifyContentWithAnimBp();
  }
  AddBuffFromAnimNotify(t, e, f) {
    t <= ActiveBuffConfigs_1.NULL_BUFF_ID
      ? CombatLog_1.CombatLog.Error(
          "Buff",
          this.Entity,
          "AddBuffFromAnimNotify不合法的buffId",
          ["buffId", t],
        )
      : ((f.PreMessageId = (e || this).CreateAnimNotifyContent(t)),
        this.AddBuff(t, f));
  }
  AddBuffFromAi(t, e, f) {
    (f.PreMessageId = t), this.AddBuff(e, f);
  }
  AddBuffForDebug(t, e) {
    e.Level =
      e.Level ??
      ModelManager_1.ModelManager.CreatureModel.GetEntity(e.InstigatorId)
        ?.Entity?.GetComponent(194)
        .GetBuffLevel(t);
    var f = ModelManager_1.ModelManager.CreatureModel.GetCreatureDataId(
        this.Entity.Id,
      ),
      i = new Protocol_1.Aki.Protocol.Gzn();
    (i.VVn = 0),
      (i.P8n =
        `@gmapplybuff ${f} ${t} ${e.InstigatorId} ` +
        (e.Level ?? ActiveBuffConfigs_1.DEFAULT_BUFF_LEVEL)),
      Net_1.Net.Call(29319, Protocol_1.Aki.Protocol.Gzn.create(i), () => {});
  }
  AddBuff(t, e) {
    var f;
    t <= ActiveBuffConfigs_1.NULL_BUFF_ID
      ? CombatLog_1.CombatLog.Error(
          "Buff",
          this.Entity,
          "尝试添加buff时传入了不合法的buffId",
          ["buffId", t],
          ["创建者", e.InstigatorId],
          ["持有者", this.GetDebugName()],
        )
      : ((f =
          ModelManager_1.ModelManager.GameModeModel.InstanceDungeon.CustomTypes.includes(
            5,
          )),
        e.PreMessageId ||
          (0, CharacterBuffIds_1.checkBuffInSpecialList)(t) ||
          f ||
          CombatLog_1.CombatLog.Error(
            "Buff",
            this.Entity,
            "加Buff上文无效",
            ["原因", e.Reason],
            ["buffId", t],
          ),
        (e.Level =
          e.Level ??
          ModelManager_1.ModelManager.CreatureModel.GetEntity(e.InstigatorId)
            ?.Entity?.GetComponent(194)
            .GetBuffLevel(t)),
        this.HasBuffAuthority()
          ? this.AddBuffLocal(t, e)
          : this.AddBuffOrder(t, e));
  }
  AddBuffLocal(
    t,
    {
      InstigatorId: e = ActiveBuffConfigs_1.NULL_INSTIGATOR_ID,
      Level: f,
      OuterStackCount: i,
      ApplyType: r = Protocol_1.Aki.Protocol.uFs.Proto_Common,
      PreMessageId: o = void 0,
      MessageId: s = void 0,
      Duration: n = ActiveBuffConfigs_1.USE_INTERNAL_DURATION,
      ServerId: a = ActiveBuffConfigs_1.DEFAULT_GE_SERVER_ID,
      IsIterable: u = !0,
      IsServerOrder: h = !1,
      Reason: c,
    },
  ) {
    var v, B;
    return this.HasBuffAuthority()
      ? (v = CharacterBuffController_1.default.GetBuffDefinition(t))
        ? ((B =
            ModelManager_1.ModelManager.CreatureModel.GetEntity(
              e,
            )?.Entity?.GetComponent(194)),
          (f =
            f ?? B?.GetBuffLevel(t) ?? ActiveBuffConfigs_1.DEFAULT_BUFF_LEVEL),
          this.AddBuffInner(
            t,
            v,
            e,
            f,
            i,
            r,
            o,
            s,
            n,
            void 0,
            a,
            c,
            !1,
            u,
            h,
            void 0,
          ))
        : ActiveBuffConfigs_1.INVALID_BUFF_HANDLE
      : (CombatLog_1.CombatLog.Warn(
          "Buff",
          this.Entity,
          "[local] 模拟端不本地添加buff",
          ["buffId", t],
          ["施加者", e],
          ["持有者", this.GetDebugName()],
          ["前置行为id", o],
          ["原因", c],
        ),
        ActiveBuffConfigs_1.INVALID_BUFF_HANDLE);
  }
  AddBuffOrder(t, e) {}
  AddBuffRemote(
    t,
    e,
    {
      InstigatorId: f = ActiveBuffConfigs_1.NULL_INSTIGATOR_ID,
      Level: i = ActiveBuffConfigs_1.DEFAULT_BUFF_LEVEL,
      OuterStackCount: r = void 0,
      ApplyType: o = Protocol_1.Aki.Protocol.uFs.Proto_Common,
      PreMessageId: s = void 0,
      MessageId: n = void 0,
      Duration: a = ActiveBuffConfigs_1.USE_INTERNAL_DURATION,
      RemainDuration: u,
      ServerId: h = ActiveBuffConfigs_1.DEFAULT_GE_SERVER_ID,
      IsActive: c,
      Reason: v,
    },
  ) {
    (t = this.AddBuffInner(
      t,
      CharacterBuffController_1.default.GetBuffDefinition(t),
      f,
      i,
      r,
      o,
      s,
      n,
      a,
      c,
      h,
      v,
      !0,
      !0,
      !1,
      e,
    )),
      (f = this.BuffContainer.get(t));
    f && this.HasBuffAuthority() && void 0 !== u && f.SetRemainDuration(u);
  }
  AddIterativeBuff(t, e, f, i, r) {
    e
      ? this.AddBuff(t, {
          InstigatorId:
            e.InstigatorId ?? ActiveBuffConfigs_1.NULL_INSTIGATOR_ID,
          Level: e.Level,
          PreMessageId: e.MessageId,
          ServerId: e.ServerId,
          OuterStackCount: f,
          IsIterable: i,
          Reason: r,
        })
      : CombatLog_1.CombatLog.Error(
          "Buff",
          this.Entity,
          "尝试添加迭代buff失败，未找到前置buff",
          ["buffId", t],
          ["持有者", this.GetDebugName()],
          ["原因", r],
        );
  }
  static GetBuffStat(t) {
    if (Stats_1.Stat.Enable)
      return (
        this.Ebr.has(t) ||
          this.Ebr.set(
            t,
            Stats_1.Stat.Create(
              t.toString(),
              "",
              StatDefine_1.BATTLESTAT_GROUP,
            ),
          ),
        this.Ebr.get(t)
      );
  }
  AddBuffInner(e, f, i, r, o, s, n, a, u, h, c, v, B, d, C, l) {
    // ModUtils.KunLog("eAddBuffInner");
    // if (e == 70000045 || e == 1001002005 || e == 70052) {
    //     return;
    // }
    // ModUtils.jsLog(e);
    // ModUtils.jsLog(f);
    // ModUtils.jsLog(i);
    // ModUtils.jsLog(r);
    // ModUtils.jsLog(o);
    // ModUtils.jsLog(s);
    // ModUtils.jsLog(n);
    // return;
    var _ = BaseBuffComponent_1.GetBuffStat(e),
      m =
        (_?.Start(),
        this.BuffLock++,
        [
          ["buffId", e],
          ["创建者id", i],
          ["持有者", this.GetDebugName()],
          ["初始激活", h],
          ["原因", v],
        ]);
    if (!f)
      return (
        CombatLog_1.CombatLog.Error(
          "Buff",
          this.Entity,
          "[local] 添加buff时找不到配置",
          ...m,
        ),
        this.BuffLock--,
        _?.Stop(),
        ActiveBuffConfigs_1.INVALID_BUFF_HANDLE
      );
    if (
      ((s = s ?? Protocol_1.Aki.Protocol.uFs.Proto_Common) !==
        Protocol_1.Aki.Protocol.uFs.Proto_Common ||
        this.NeedCheck(f) ||
        (u = -1),
      !this.CheckAdd(f, i ?? ActiveBuffConfigs_1.NULL_INSTIGATOR_ID, B))
    )
      return (
        this.BuffLock--, _?.Stop(), ActiveBuffConfigs_1.INVALID_BUFF_HANDLE
      );
    var t = this.GetStackableBuff(
      i ?? ActiveBuffConfigs_1.NULL_INSTIGATOR_ID,
      e,
      f.StackingType,
    );
    let g = o && 0 < o ? o : f.DefaultStackCount;
    if (!t) {
      let t = void 0;
      0 === f.DurationPolicy
        ? ((l = ActiveBuffConfigs_1.SUCCESS_INSTANT_BUFF_HANDLE),
          (u = ActiveBuffConfigs_1.INFINITY_DURATION),
          (g = 1))
        : (l = l ?? CharacterBuffController_1.default.GenerateHandle());
      try {
        t = ActiveBuff_1.ActiveBuffInternal.AllocBuff(
          f,
          l,
          i,
          this,
          c,
          n,
          a,
          r,
          g,
          u,
        );
      } catch (t) {
        CombatLog_1.CombatLog.ErrorWithStack(
          "Buff",
          this.Entity,
          "Buff初始过程中发生异常",
          t,
          ...m,
        );
      }
      if (!t)
        return (
          this.BuffLock--, _?.Stop(), ActiveBuffConfigs_1.INVALID_BUFF_HANDLE
        );
      BaseBuffComponent_1.NoLogBuffSet.has(e) ||
        CombatLog_1.CombatLog.Info(
          "Buff",
          this.Entity,
          "本地添加buff",
          ...m,
          ["handle", l],
          ["前置行为id", n],
          ["说明", f.Desc],
          ["是否迭代", d],
        );
      try {
        this.OnBuffAdded(t, o, s, n, u, h, c, B, d, C, v);
      } catch (t) {
        CombatLog_1.CombatLog.ErrorWithStack(
          "Buff",
          this.Entity,
          "Buff添加中发生异常",
          t,
          ...m,
        );
      }
      return (
        0 === f.DurationPolicy &&
          ActiveBuff_1.ActiveBuffInternal.ReleaseBuff(t),
        this.BuffLock--,
        _?.Stop(),
        l
      );
    }
    if (
      t.Config &&
      (t.Config.StackLimitCount <= 0 ||
        !t.Config.DenyOverflowAdd ||
        t.StackCount < t.Config.StackLimitCount)
    ) {
      0 < f.StackAppendCount && (g = f.StackAppendCount);
      (a = 0 < f.StackLimitCount ? f.StackLimitCount : 1 / 0),
        (e = t.StackCount),
        (h = Math.min(e + g, a));
      try {
        this.OnBuffStackIncreased(
          t,
          e,
          h,
          i ?? ActiveBuffConfigs_1.NULL_INSTIGATOR_ID,
          r,
          o,
          s,
          n,
          u,
          c,
          d,
          C,
          v,
        ),
          this.BuffEffectManager.ApplyInitBuffExecution(t, d);
      } catch (t) {
        CombatLog_1.CombatLog.ErrorWithStack(
          "Buff",
          this.Entity,
          "Buff层数改变中发生异常",
          t,
          ...m,
        );
      }
    }
    return this.BuffLock--, _?.Stop(), t.Handle;
  }
  RemoveBuff(t, e, f, i, r) {
    this.HasBuffAuthority()
      ? this.RemoveBuffLocal(t, e, f, i, r)
      : this.RemoveBuffOrder(t, e, f);
  }
  RemoveBuffOrder(t, e, f) {}
  RemoveBuffLocal(t, e, f, i, r) {
    var o;
    return t <= ActiveBuffConfigs_1.NULL_BUFF_ID
      ? (CombatLog_1.CombatLog.Error(
          "Buff",
          this.Entity,
          "尝试本地移除buff时传入了不合法的buffId",
          ["buffId", t],
          ["持有者", this.GetDebugName()],
          ["原因", f],
        ),
        0)
      : this.HasBuffAuthority()
        ? (o = this.GetBuffById(t))
          ? this.RemoveBuffInner(o.Handle, e, !0, f, i, r)
          : 0
        : (CombatLog_1.CombatLog.Error(
            "Buff",
            this.Entity,
            "无法直接移除非本端控制实体持有的buff，请换用RemoveBuff接口",
            ["buffId", t],
            ["持有者", this.GetDebugName()],
            ["原因", f],
          ),
          0);
  }
  RemoveBuffByTagLocal(e, t) {
    if (this.HasBuffAuthority()) {
      var f = GameplayTagUtils_1.GameplayTagUtils.GetNameByTagId(e);
      for (const i of this.BuffContainer.values())
        i.Config.GrantedTags?.some((t) =>
          GameplayTagUtils_1.GameplayTagUtils.IsChildTag(t, e),
        ) && this.RemoveBuffInner(i.Handle, -1, !0, t ?? "移除tag " + f);
    } else
      CombatLog_1.CombatLog.Warn(
        "Buff",
        this.Entity,
        "尝试根据tag移除非本地控制的实体的buff，移除操作将不被执行",
        ["tagId", e],
        ["tagName", GameplayTagUtils_1.GameplayTagUtils.GetNameByTagId(e)],
        ["持有者", this.GetDebugName()],
        ["原因", t],
      );
  }
  RemoveBuffByEffectType(t, e) {
    var f = new Set(),
      i = (0, ExtraEffectDefine_1.getBuffEffectClass)(t);
    if (i) {
      for (const r of this.BuffEffectManager.GetAllEffects())
        r instanceof i && f.add(r.BuffId);
      for (const o of f.values()) this.RemoveBuff(o, -1, e);
    }
  }
  RemoveBuffByHandle(t, e = -1, f, i, r) {
    var o;
    return (
      this.HasBuffAuthority() ||
        ((o = this.GetBuffByHandle(t)) &&
          0 < o.Id &&
          CombatLog_1.CombatLog.Warn(
            "Buff",
            this.Entity,
            "尝试直接通过handle移除非本端控制buff，后续需要新增协议",
            ["buffId", o?.Id],
            ["handle", t],
            ["持有者", this.GetDebugName()],
            ["说明", o?.Config?.Desc],
            ["原因", f],
          )),
      this.RemoveBuffByHandleLocal(t, e, f, i, r)
    );
  }
  RemoveBuffByHandleLocal(t, e = -1, f, i, r) {
    return this.RemoveBuffInner(t, e, !0, f, i, r);
  }
  RemoveBuffWhenTimeout(t) {
    var e = t.Config.StackExpirationRemoveNumber;
    this.RemoveBuffInner(t.Handle, e, !1, "时间结束自然移除"),
      0 < e && t.IsValid() && t.SetDuration();
  }
  RemoveBuffInner(t, e, f, i, r, o) {
    t = this.GetBuffByHandle(t);
    if (!t) return 0;
    this.BuffLock++;
    var s = [
        ["buffId", t.Id],
        ["持有者", this.GetDebugName()],
        ["handle", t?.Handle],
        ["说明", t?.Config.Desc],
        ["原因", i],
      ],
      n =
        (BaseBuffComponent_1.NoLogBuffSet.has(t.Id) ||
          CombatLog_1.CombatLog.Info("Buff", this.Entity, "本地移除buff", ...s),
        t.StackCount),
      e = e <= 0 ? 0 : Math.max(0, n - e);
    if (e <= 0)
      try {
        this.OnBuffRemoved(t, f, i, o, r);
      } catch (t) {
        CombatLog_1.CombatLog.ErrorWithStack(
          "Buff",
          this.Entity,
          "Buff移除时发生异常",
          t,
          ...s,
        );
      }
    else
      try {
        this.OnBuffStackDecreased(t, n, e, f, i);
      } catch (t) {
        CombatLog_1.CombatLog.ErrorWithStack(
          "Buff",
          this.Entity,
          "Buff层数降低时发生异常",
          t,
          ...s,
        );
      }
    return this.BuffLock--, n - e;
  }
  GetAllBuffs() {
    var t = [];
    for (const e of this.BuffContainer.values())
      this.BuffGarbageSet.has(e.Handle) || t.push(e);
    return t;
  }
  GetBuffByHandle(t) {
    if (!this.BuffGarbageSet.has(t)) return this.BuffContainer.get(t);
  }
  HasActiveBuff(t) {
    return void 0 !== this.GetActiveBuffById(t);
  }
  HasBuff(t) {
    return void 0 !== this.GetBuffById(t);
  }
  GetActiveBuffById(t) {
    for (const e of this.BuffContainer.values())
      if (e.Id === t && e.IsActive() && !this.BuffGarbageSet.has(e.Handle))
        return e;
  }
  GetBuffById(t) {
    for (const e of this.BuffContainer.values())
      if (e.Id === t && !this.BuffGarbageSet.has(e.Handle)) return e;
  }
  GetBuffLevel(t) {}
  GetStackableBuff(t, e, f) {
    switch (f) {
      case 2:
        for (const i of this.BuffContainer.values())
          if (i.Id === e && !this.BuffGarbageSet.has(i.Handle)) return i;
        return;
      case 1:
        for (const r of this.BuffContainer.values())
          if (
            r.Id === e &&
            !this.BuffGarbageSet.has(r.Handle) &&
            r.InstigatorId === t
          )
            return r;
        return;
      default:
        return;
    }
  }
  GetBuffTotalStackById(t, e = !1) {
    let f = 0;
    for (const i of this.BuffContainer.values())
      i.Id !== t ||
        this.BuffGarbageSet.has(i.Handle) ||
        (e && !i.IsActive()) ||
        (f += i.StackCount);
    return f;
  }
  OnBuffAdded(t, e, f, i, r, o, s, n, a, u, h) {
    if (t) {
      var c = t.Config;
      if (t.IsInstantBuff()) {
        this.ApplyPeriodExecution(t);
        var v = this.GetExactEntity()?.GetComponent(190);
        if (v) {
          for (const d of c.GrantedTags ?? []) v?.AddTag(d);
          for (const C of c.GrantedTags ?? []) v?.RemoveTag(C);
        }
      } else {
        var B = t.Handle;
        this.BuffContainer.set(B, t),
          this.MarkListenerBuff(t),
          this.BuffEffectManager.OnBuffAdded(t);
      }
      this.NeedCheck(t.Config)
        ? this.OnBuffActiveChanged(
            t,
            o ?? this.CheckActivate(t.Config, t.GetInstigator()),
          )
        : void 0 === o
          ? CombatLog_1.CombatLog.Error(
              "Buff",
              this.Entity,
              "buff激活状态未知",
              ["buffId", t.Id],
              ["handle", t.Handle],
            )
          : this.OnBuffActiveChanged(t, o),
        t.IsActive() &&
          c &&
          0 < c.Period &&
          c.ExecutePeriodicOnAdd &&
          t.ResetPeriodTimer(
            TimerSystem_1.MIN_TIME * CommonDefine_1.SECOND_PER_MILLIONSECOND,
          ),
        Info_1.Info.IsBuildDevelopmentOrDebug &&
          (this.Entity.GetComponent(24)?.OnBuffAdded(t),
          this.Entity.GetComponent(20)?.OnBuffAdded(t)),
        this.CheckWhenBuffChanged(t.Id),
        this.BuffEffectManager.ApplyInitBuffExecution(t, a),
        t.OnTimeScaleChanged(this.GetTimeScale(), this.IsPaused());
    }
  }
  ApplyPeriodExecution(t) {
    var e = t.Config,
      f = t.GetInstigatorAttributeSet();
    if (e.Modifiers && 0 < e.Modifiers.length) {
      var i = this.GetAttributeComponent();
      if (i) {
        var r,
          o,
          s = this.GetTimeScale();
        for ([r, o] of t.StateModifiers)
          this.HasBuffAuthority() &&
            ActiveBuff_1.ActiveBuffInternal.ModifyStateAttribute(
              f,
              i,
              r,
              t.Level,
              s,
              o,
            );
      } else
        CombatLog_1.CombatLog.Warn(
          "Buff",
          this.Entity,
          "周期buff尝试修改属性，但owner不存在",
          ["buffId", t.Id],
          ["handle", t.Handle],
          ["持有者", t.GetOwnerBuffComponent()?.GetDebugName()],
          ["施加者", t.InstigatorId],
        );
    }
    this.BuffEffectManager?.ApplyPeriodBuffExecution(t);
    for (const n of this.BuffEffectManager?.GetEffectsByHandle(t.Handle) ?? [])
      n.OnPeriodCallback();
  }
  OnBuffRemoved(t, e, f, i, r) {
    if (t) {
      var o = t.Handle,
        o =
          (this.RemoveListenerBuff(t),
          this.BuffGarbageSet.add(o),
          t.Destroy(),
          this.CheckWhenBuffChanged(t.Id),
          this.BuffEffectManager.OnBuffRemoved(t, e),
          t.GetInstigatorBuffComponent());
      if ((void 0 === o || o.Valid) && this.HasBuffAuthority()) {
        o = e
          ? t.Config?.PrematureExpirationEffects
          : t.Config?.RoutineExpirationEffects;
        if (o)
          for (const s of o)
            this.AddIterativeBuff(
              s,
              t,
              void 0,
              !0,
              `因为Buff${t.Id}移除导致的添加`,
            );
      }
    }
  }
  OnBuffStackDecreased(t, e, f, i, r) {
    t &&
      (t.SetStackCount(f),
      this.CheckWhenBuffChanged(t.Id),
      this.BuffEffectManager.OnStackDecreased(t, f, e, i));
  }
  OnBuffStackIncreased(t, e, f, i, r, o, s, n, a, u, h, c, v) {
    if (t) {
      t.SetStackCount(f),
        0 !== t.Config.StackDurationRefreshPolicy ||
          (!this.NeedCheck(t.Config) &&
            s === Protocol_1.Aki.Protocol.uFs.Proto_Common) ||
          t.SetDuration(a);
      var s = t.Config,
        B = t.Handle;
      if (
        s &&
        (t.Id,
        this.BuffEffectManager.OnStackIncreased(t, f, e, i),
        this.HasBuffAuthority())
      ) {
        a = 0 < s.StackLimitCount ? s.StackLimitCount : 1 / 0;
        if (a <= e && a <= f) {
          i = s.OverflowEffects;
          if (i && 0 < i.length)
            for (const d of i)
              this.AddIterativeBuff(
                d,
                t,
                void 0,
                !0,
                `Buff层数溢出时迭代添加新buff（前置buff Id=${t.Id}, handle=${B}）`,
              );
          t.Config.ClearStackOnOverflow &&
            this.RemoveBuffByHandle(B, -1, "Buff层数溢出时清除");
        }
      }
    }
  }
  OnBuffActiveChanged(t, e) {
    t &&
      (t.SetActivate(e),
      this.CheckWhenBuffChanged(t.Id),
      this.BuffEffectManager.OnBuffInhibitedChanged(t, !e));
  }
  OnTagChanged(t) {
    this.CheckWhenTagChanged(t);
  }
  get BuffLock() {
    return this.Mbr;
  }
  set BuffLock(t) {
    if ((this.Mbr = t) <= 0 && 0 < this.BuffGarbageSet.size) {
      for (const f of this.BuffGarbageSet) {
        var e = this.BuffContainer.get(f);
        this.BuffContainer.delete(f),
          ActiveBuff_1.ActiveBuffInternal.ReleaseBuff(e);
      }
      this.BuffGarbageSet.clear();
    }
  }
  AddTrigger(t, e, f) {
    let i = this.TriggerMap.get(e);
    i || this.TriggerMap.set(e, (i = [])), i.push(f);
  }
  RemoveTrigger(e, t) {
    var f,
      t = this.TriggerMap.get(t);
    t &&
      -1 !== (f = t.findIndex((t) => t.ActiveHandleId === e)) &&
      t.splice(f, 1);
  }
  TriggerEvents(t, e, f) {
    t = this.TriggerMap.get(t);
    if (t && e) for (const i of [...t]) i.TryExecute(f, e);
  }
  HasBuffTrigger(t) {
    return this.TriggerMap.has(t);
  }
  AddGameplayCue(t, e, f) {
    if (!t || t.length <= 0) return ActiveBuffConfigs_1.INVALID_BUFF_HANDLE;
    BaseBuffComponent_1.Sbr.Start();
    var i = CharacterBuffController_1.default.CreateDynamicBuffRef(),
      t =
        ((i.GameplayCueIds = t),
        (i.Desc = f),
        (i.DurationPolicy = 0 === e ? 0 : e < 0 ? 1 : 2),
        0 < e &&
          ((i.DurationCalculationPolicy = [0]), (i.DurationMagnitude = [e])),
        this.AddBuffInner(
          ActiveBuffConfigs_1.DYNAMIC_BUFF_ID,
          i,
          void 0,
          1,
          void 0,
          Protocol_1.Aki.Protocol.uFs.Proto_Common,
          void 0,
          void 0,
          e,
          void 0,
          ActiveBuffConfigs_1.DEFAULT_GE_SERVER_ID,
          f,
          !1,
          !0,
          !1,
          void 0,
        ));
    return BaseBuffComponent_1.Sbr.Stop(), t;
  }
});
(BaseBuffComponent.NoLogBuffSet = new Set([
  ActiveBuffConfigs_1.DYNAMIC_BUFF_ID,
  1101003012n,
  800080191n,
  800100003081n,
  1302121034n,
  1304700001n,
  640007016n,
  1202803014n,
  1202002003n,
])),
  (BaseBuffComponent.Ebr = new Map()),
  (BaseBuffComponent.Sbr = Stats_1.Stat.Create("AddBuff_Cue")),
  (BaseBuffComponent = BaseBuffComponent_1 =
    __decorate(
      [(0, RegisterComponent_1.RegisterComponent)(194)],
      BaseBuffComponent,
    )),
  (exports.BaseBuffComponent = BaseBuffComponent);
//# sourceMappingURL=BaseBuffComponent.js.map
