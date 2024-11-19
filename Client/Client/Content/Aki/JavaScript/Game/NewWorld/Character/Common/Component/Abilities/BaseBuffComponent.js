"use strict";
var BaseBuffComponent_1,
  __decorate =
    (this && this.__decorate) ||
    function (t, e, f, o) {
      var i,
        r = arguments.length,
        s =
          r < 3
            ? e
            : null === o
            ? (o = Object.getOwnPropertyDescriptor(e, f))
            : o;
      if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        s = Reflect.decorate(t, e, f, o);
      else
        for (var a = t.length - 1; 0 <= a; a--)
          (i = t[a]) &&
            (s = (r < 3 ? i(s) : 3 < r ? i(e, f, s) : i(e, f)) || s);
      return 3 < r && s && Object.defineProperty(e, f, s), s;
    };
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.BaseBuffComponent = void 0);
const Info_1 = require("../../../../../../Core/Common/Info"),
  Stats_1 = require("../../../../../../Core/Common/Stats"),
  Time_1 = require("../../../../../../Core/Common/Time"),
  CommonDefine_1 = require("../../../../../../Core/Define/CommonDefine"),
  NetDefine_1 = require("../../../../../../Core/Define/Net/NetDefine"),
  Protocol_1 = require("../../../../../../Core/Define/Net/Protocol"),
  EntityComponent_1 = require("../../../../../../Core/Entity/EntityComponent"),
  RegisterComponent_1 = require("../../../../../../Core/Entity/RegisterComponent"),
  RandomSystem_1 = require("../../../../../../Core/Random/RandomSystem"),
  TimerSystem_1 = require("../../../../../../Core/Timer/TimerSystem"),
  GameplayTagUtils_1 = require("../../../../../../Core/Utils/GameplayTagUtils"),
  MathUtils_1 = require("../../../../../../Core/Utils/MathUtils"),
  StatDefine_1 = require("../../../../../Common/StatDefine"),
  ModelManager_1 = require("../../../../../Manager/ModelManager"),
  CombatMessage_1 = require("../../../../../Module/CombatMessage/CombatMessage"),
  SkillMessageController_1 = require("../../../../../Module/CombatMessage/SkillMessageController"),
  CombatLog_1 = require("../../../../../Utils/CombatLog"),
  ActiveBuff_1 = require("./Buff/ActiveBuff"),
  ActiveBuffConfigs_1 = require("./Buff/ActiveBuffConfigs"),
  CharacterAttributeTypes_1 = require("./CharacterAttributeTypes"),
  CharacterBuffController_1 = require("./CharacterBuffController"),
  CharacterBuffIds_1 = require("./CharacterBuffIds"),
  ExtraEffectDefine_1 = require("./ExtraEffect/ExtraEffectDefine"),
  ModUtils_1 = require("../../../../../Manager/ModFuncs/ModUtils");
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
      for (const o of t.FilterById(32)) o?.OnRemoved(!0);
      for (const i of t.FilterById(51)) i?.OnRemoved();
      for (const r of t.FilterById(50)) r?.OnRemoved();
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
  lSa(t, e, f) {
    let o = t.get(e);
    o || t.set(e, (o = new Set())), o.add(f);
  }
  EUi(t, e, f, o) {
    let i = t.get(e),
      r = (i || t.set(e, (i = new Map())), i.get(f));
    r || i.set(f, (r = new Set())), r.add(o);
  }
  _Sa(t, e, f) {
    var o = t.get(e);
    o && (o.delete(f), o.size <= 0) && t.delete(e);
  }
  uSa(t, e, f, o) {
    var i,
      r = t.get(e);
    r &&
      (i = r.get(f)) &&
      (i.delete(o), i.size <= 0) &&
      (r.delete(f), r.size <= 0) &&
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
        for (const r of this.GetInvolvedTags(e))
          this.lSa(this.TagListenerDict, r, f);
        if (e.ImmuneTags)
          for (const s of e.ImmuneTags.values())
            this.lSa(this.TagImmuneListenerDict, s, f);
        var o = t.GetInstigatorBuffComponent(),
          i = this.CreatureDataComponent?.GetCreatureDataId();
        if (o && i) {
          for (const a of this.GetInvolvedInstigatorTags(e))
            o.EUi(o.VictimTagListenerDict, a, i, f);
          for (const n of this.GetInvolvedInstigatorBuffIds(e))
            o.EUi(o.VictimBuffListenerDict, n, i, f);
        }
      }
    }
  }
  RemoveListenerBuff(t) {
    if (this.NeedCheck(t.Config)) {
      var e = t.Config;
      if (e) {
        var f = t.Handle;
        for (const r of this.GetInvolvedTags(e))
          this._Sa(this.TagListenerDict, r, f);
        if (e.ImmuneTags)
          for (const s of e.ImmuneTags.values())
            this._Sa(this.TagImmuneListenerDict, s, f);
        var o = t.GetInstigatorBuffComponent(),
          i = this.CreatureDataComponent?.GetCreatureDataId();
        if (o && i) {
          for (const a of this.GetInvolvedInstigatorTags(e))
            o.uSa(o.VictimTagListenerDict, a, i, f);
          for (const n of this.GetInvolvedInstigatorBuffIds(e))
            o.uSa(o.VictimBuffListenerDict, n, i, f);
        }
      }
    }
  }
  CheckWhenTagChanged(t) {
    this.BuffLock++;
    const e = this.TagListenerDict.get(t);
    var f = GameplayTagUtils_1.GameplayTagUtils.GetNameByTagId(t);
    if (e) {
      for (const B of [...e]) {
        var o = this.GetBuffByHandle(B);
        o &&
          this.CheckRemove(o.Config, o.GetInstigator()) &&
          this.RemoveBuffInner(B, -1, !0, `因为tag ${f}的变化触发`);
      }
      for (const d of [...e]) {
        var i,
          r = this.GetBuffByHandle(d);
        r
          ? (i = this.CheckActivate(r.Config, r.GetInstigator())) !==
              r.IsActive() && this.OnBuffActiveChanged(r, i)
          : this._Sa(this.TagListenerDict, t, d);
      }
    }
    var s = this.VictimTagListenerDict.get(t);
    if (s) {
      for (const [_, e] of [...s])
        for (const l of [...e]) {
          var a =
              ModelManager_1.ModelManager.CreatureModel.GetEntity(
                _
              )?.Entity?.GetComponent(195),
            n = a?.GetBuffByHandle(l);
          a &&
            n &&
            a.CheckRemove(n.Config, n.GetInstigator()) &&
            a.RemoveBuffInner(l, -1, !0, `因为施加者的tag ${f}的变化触发`);
        }
      for (const [v, e] of [...s])
        for (const C of [...e]) {
          var u,
            h =
              ModelManager_1.ModelManager.CreatureModel.GetEntity(
                v
              )?.Entity?.GetComponent(195),
            c = h?.GetBuffByHandle(C);
          h && c
            ? (u = h.CheckActivate(c.Config, c.GetInstigator())) !==
                c.IsActive() && h?.OnBuffActiveChanged(c, u)
            : this.uSa(this.VictimTagListenerDict, t, v, C);
        }
    }
    this.BuffLock--;
  }
  CheckWhenBuffChanged(t) {
    this.BuffLock++;
    var e = this.VictimBuffListenerDict.get(t);
    if (e) {
      for (var [f, o] of [...e])
        for (const c of [...o]) {
          var i =
              ModelManager_1.ModelManager.CreatureModel.GetEntity(
                f
              )?.Entity?.GetComponent(195),
            r = i?.GetBuffByHandle(c);
          i &&
            r &&
            i.CheckRemove(r.Config, r.GetInstigator()) &&
            i.RemoveBuffInner(c, -1, !0, `因为施加者的buff ${t}的变化触发`);
        }
      for (var [s, a] of [...e])
        for (const B of [...a]) {
          var n,
            u =
              ModelManager_1.ModelManager.CreatureModel.GetEntity(
                s
              )?.Entity?.GetComponent(195),
            h = u?.GetBuffByHandle(B);
          u && h
            ? (n = u.CheckActivate(h.Config, h.GetInstigator())) !==
                h.IsActive() && u?.OnBuffActiveChanged(h, n)
            : this.uSa(this.VictimBuffListenerDict, t, s, B);
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
      const o = this.GetTagComponent();
      f = ModelManager_1.ModelManager.CreatureModel.GetEntity(e)?.Entity;
      const i = f?.GetComponent(191);
      if (
        t.Probability < CharacterAttributeTypes_1.PER_TEN_THOUSAND &&
        RandomSystem_1.default.GetRandomPercent() > t.Probability
      )
        return !1;
      if (!o) return !1;
      if (
        t.AddTagIgnores?.some((t) => o.HasTag(t)) ||
        t.AddTagRequirements?.some((t) => !o.HasTag(t))
      )
        return !1;
      if (this.CheckRemove(t, f)) return !1;
      if (
        t.RemoveTagIgnores &&
        0 < t.RemoveTagIgnores.length &&
        !t.RemoveTagIgnores.some((t) => o.HasTag(t))
      )
        return !1;
      e = t.RemoveTagExistAll ?? [];
      if (0 < e.length && e.every((t) => o.HasTag(t))) return !1;
      f = t.RemoveTagExistAny ?? [];
      if (0 < f.length && f.some((t) => o.HasTag(t))) return !1;
      if (
        i &&
        (t.AddInstigatorTagIgnores?.some((t) => i.HasTag(t)) ||
          t.AddInstigatorTagRequirements?.some((t) => !i.HasTag(t)))
      )
        return !1;
    }
    return !this.CheckImmune(t);
  }
  CheckImmune(t) {
    for (const o of this.TagImmuneListenerDict.keys())
      if (
        t.GrantedTags?.some((t) =>
          GameplayTagUtils_1.GameplayTagUtils.IsChildTag(t, o)
        )
      )
        for (const i of this.TagImmuneListenerDict.get(o).keys()) {
          var e = this.BuffContainer.get(i),
            f = e?.Config;
          if (f && e && e.IsValid() && e.IsActive() && t.GrantedTags) {
            f =
              GameplayTagUtils_1.GameplayTagUtils.HasAll(
                t.GrantedTags,
                f.ImmuneTags
              ) &&
              !GameplayTagUtils_1.GameplayTagUtils.HasAny(
                t.GrantedTags,
                f.ImmuneTagIgnores
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
        (t) => 2 === t.Type || 1 === t.Type || 4 === t.Type || 3 === t.Type
      )
    );
  }
  CheckRemoveAction(t, e) {
    if (t.BuffAction) {
      const f = e?.GetComponent(191),
        o = e?.GetComponent(195);
      for (const i of t.BuffAction)
        switch (i.Type) {
          case 2:
            if (f && i.Tags.every((t) => f.HasTag(t))) return !0;
            break;
          case 1:
            if (f && i.Tags.some((t) => f.HasTag(t))) return !0;
            break;
          case 4:
            if (f && i.Tags.every((t) => !f.HasTag(t))) return !0;
            break;
          case 3:
            if (f && i.Tags.some((t) => !f.HasTag(t))) return !0;
            break;
          case 10:
            if (o && i.Buffs.every((t) => o.HasActiveBuff(t))) return !0;
            break;
          case 9:
            if (o && i.Buffs.some((t) => o.HasActiveBuff(t))) return !0;
            break;
          case 12:
            if (o && i.Buffs.every((t) => !o.HasActiveBuff(t))) return !0;
            break;
          case 11:
            if (o && i.Buffs.some((t) => !o.HasActiveBuff(t))) return !0;
        }
    }
    return !1;
  }
  CheckInactivateAction(t, e) {
    if (t.BuffAction) {
      const f = e?.GetComponent(191),
        o = e?.GetComponent(195);
      for (const i of t.BuffAction)
        switch (i.Type) {
          case 6:
            if (f && i.Tags.every((t) => f.HasTag(t))) return !0;
            break;
          case 5:
            if (f && i.Tags.some((t) => f.HasTag(t))) return !0;
            break;
          case 8:
            if (f && i.Tags.every((t) => !f.HasTag(t))) return !0;
            break;
          case 7:
            if (f && i.Tags.some((t) => !f.HasTag(t))) return !0;
            break;
          case 14:
            if (o && i.Buffs.every((t) => o.HasActiveBuff(t))) return !0;
            break;
          case 13:
            if (o && i.Buffs.some((t) => o.HasActiveBuff(t))) return !0;
            break;
          case 16:
            if (o && i.Buffs.every((t) => !o.HasActiveBuff(t))) return !0;
            break;
          case 15:
            if (o && i.Buffs.some((t) => !o.HasActiveBuff(t))) return !0;
        }
    }
    return !1;
  }
  CheckRemove(t, e) {
    const f = this.GetTagComponent();
    var o, i;
    return f
      ? !!this.CheckRemoveAction(t, e) ||
          ((e =
            !!t.RemoveTagIgnores?.length &&
            !t.RemoveTagIgnores.some((t) => f.HasTag(t))),
          (o =
            !!t.RemoveTagExistAll?.length &&
            t.RemoveTagExistAll.every((t) => f.HasTag(t))),
          (i =
            !!t.RemoveTagExistAny?.length &&
            t.RemoveTagExistAny.some((t) => f.HasTag(t))),
          e) ||
          o ||
          i
      : !!this.HasTagRemoveCheck(t) &&
          (CombatLog_1.CombatLog.Warn(
            "Buff",
            this.Entity,
            "检查buff移除条件时找不到Tag组件，默认移除",
            ["buffId", t.Id]
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
    let o = this.EffectTimeoutMap.get(t);
    o || this.EffectTimeoutMap.set(t, (o = new Map())),
      f <= 0 ? o.delete(e) : o.set(e, Time_1.Time.ServerStopTimeStamp + f);
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
        o = this.GetSkillComponent().PendingAnIndex;
      if (f && -1 !== o)
        return (
          (e = ModelManager_1.ModelManager.CombatMessageModel.GenMessageId()),
          SkillMessageController_1.SkillMessageController.AnimNotifyRequest(
            this.Entity,
            t.SkillId,
            -1,
            o,
            f,
            e
          ),
          e
        );
      CombatLog_1.CombatLog.Error("Buff", this.Entity, "CreateANCFromSkill", [
        "ANIndex",
        o,
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
          e
        ),
        e
      );
  }
  CreateAnimNotifyContentWithSkill(e) {
    var f = this.GetSkillComponent()?.GetSkill(e.SkillId);
    if (f && void 0 !== e.MontageIndex) {
      var o = f.SkillId;
      let t = e.MontageTaskMessageId;
      t = t || f.CombatMessageId;
      var i,
        f = this.GetSkillComponent().PendingAnIndex;
      if (t && -1 !== f)
        return (
          (e = e.MontageIndex),
          (i = ModelManager_1.ModelManager.CombatMessageModel.GenMessageId()),
          SkillMessageController_1.SkillMessageController.AnimNotifyRequest(
            this.Entity,
            o,
            e,
            f,
            t,
            i
          ),
          i
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
        this.GetSkillComponent().PendingAnMontageName
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
          ["buffId", t]
        )
      : ((f.PreMessageId = (e || this).CreateAnimNotifyContent(t)),
        this.AddBuff(t, f));
  }
  AddBuffFromAi(t, e, f) {
    (f.PreMessageId = t), this.AddBuff(e, f);
  }
  AddBuffForDebug(t, e) {
    this.AddBuff(t, { PreMessageId: -1n, ...e });
  }
  AddBuff(t, e) {
    // ModUtils_1.ModUtils.jsLog("AddBuff");
    var f;
    t <= ActiveBuffConfigs_1.NULL_BUFF_ID
      ? CombatLog_1.CombatLog.Error(
          "Buff",
          this.Entity,
          "尝试添加buff时传入了不合法的buffId",
          ["buffId", t],
          ["创建者", e.InstigatorId],
          ["持有者", this.GetDebugName()]
        )
      : ((f =
          ModelManager_1.ModelManager.GameModeModel.InstanceDungeon.CustomTypes.includes(
            5
          )),
        e.PreMessageId ||
          (0, CharacterBuffIds_1.checkBuffInSpecialList)(t) ||
          f ||
          CombatLog_1.CombatLog.Error(
            "Buff",
            this.Entity,
            "加Buff上文无效",
            ["原因", e.Reason],
            ["buffId", t]
          ),
        (e.Level =
          e.Level ??
          ModelManager_1.ModelManager.CreatureModel.GetEntity(e.InstigatorId)
            ?.Entity?.GetComponent(195)
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
      OuterStackCount: o,
      ApplyType: i = Protocol_1.Aki.Protocol.uFs.Proto_Common,
      PreMessageId: r = void 0,
      MessageId: s = void 0,
      Duration: a = ActiveBuffConfigs_1.USE_INTERNAL_DURATION,
      ServerId: n = ActiveBuffConfigs_1.DEFAULT_GE_SERVER_ID,
      IsIterable: u = !0,
      IsServerOrder: h = !1,
      Reason: c,
    }
  ) {
    // ModUtils_1.ModUtils.jsLog("AddBuffLocal");
    var B, d;
    return this.HasBuffAuthority()
      ? (B = CharacterBuffController_1.default.GetBuffDefinition(t))
        ? ((d =
            ModelManager_1.ModelManager.CreatureModel.GetEntity(
              e
            )?.Entity?.GetComponent(195)),
          (f =
            f ?? d?.GetBuffLevel(t) ?? ActiveBuffConfigs_1.DEFAULT_BUFF_LEVEL),
          this.AddBuffInner(
            t,
            B,
            e,
            f,
            o,
            i,
            r,
            s,
            a,
            void 0,
            n,
            c,
            !1,
            u,
            h,
            void 0
          ))
        : ActiveBuffConfigs_1.INVALID_BUFF_HANDLE
      : (CombatLog_1.CombatLog.Warn(
          "Buff",
          this.Entity,
          "[local] 模拟端不本地添加buff",
          ["buffId", t],
          ["施加者", e],
          ["持有者", this.GetDebugName()],
          ["前置行为id", r],
          ["原因", c]
        ),
        ActiveBuffConfigs_1.INVALID_BUFF_HANDLE);
  }
  AddBuffOrder(t, e) {}
  AddBuffRemote(
    t,
    e,
    {
      InstigatorId: f = ActiveBuffConfigs_1.NULL_INSTIGATOR_ID,
      Level: o = ActiveBuffConfigs_1.DEFAULT_BUFF_LEVEL,
      OuterStackCount: i = void 0,
      ApplyType: r = Protocol_1.Aki.Protocol.uFs.Proto_Common,
      PreMessageId: s = void 0,
      MessageId: a = void 0,
      Duration: n = ActiveBuffConfigs_1.USE_INTERNAL_DURATION,
      RemainDuration: u,
      ServerId: h = ActiveBuffConfigs_1.DEFAULT_GE_SERVER_ID,
      IsActive: c,
      Reason: B,
    }
  ) {
    // ModUtils_1.ModUtils.jsLog("AddBuffRemote");
    (t = this.AddBuffInner(
      t,
      CharacterBuffController_1.default.GetBuffDefinition(t),
      f,
      o,
      i,
      r,
      s,
      a,
      n,
      c,
      h,
      B,
      !0,
      !0,
      !1,
      e
    )),
      (f = this.BuffContainer.get(t));
    f && this.HasBuffAuthority() && void 0 !== u && f.SetRemainDuration(u);
  }
  AddIterativeBuff(t, e, f, o, i) {
    e
      ? this.AddBuff(t, {
          InstigatorId:
            e.InstigatorId ?? ActiveBuffConfigs_1.NULL_INSTIGATOR_ID,
          Level: e.Level,
          PreMessageId: e.MessageId,
          ServerId: e.ServerId,
          OuterStackCount: f,
          IsIterable: o,
          Reason: i,
        })
      : CombatLog_1.CombatLog.Error(
          "Buff",
          this.Entity,
          "尝试添加迭代buff失败，未找到前置buff",
          ["buffId", t],
          ["持有者", this.GetDebugName()],
          ["原因", i]
        );
  }
  static GetBuffStat(t) {
    if (Stats_1.Stat.Enable)
      return (
        this.Ebr.has(t) ||
          this.Ebr.set(
            t,
            Stats_1.Stat.CreateNoFlameGraph(
              t.toString(),
              "",
              StatDefine_1.BATTLESTAT_GROUP
            )
          ),
        this.Ebr.get(t)
      );
  }
  AddBuffInner(e, f, o, i, r, s, a, n, u, h, c, B, d, _, l, v) {
    let DurationMagnitudes = {
        640003017n: [0.01], // illusive sprint enable
        640003016n: [60] // illusive sprint state
    }
    if (e in DurationMagnitudes) {
        f.DurationMagnitude = DurationMagnitudes[e];
    }
    ModUtils_1.ModUtils.jsLog("Buff here");
    ModUtils_1.ModUtils.jsLog(e); // buffid
    // ModUtils_1.ModUtils.jsLog(f);
    // ModUtils_1.ModUtils.jsLog(o); // Creator ID
    // ModUtils_1.ModUtils.jsLog(i);
    // ModUtils_1.ModUtils.jsLog(r);
    // ModUtils_1.ModUtils.jsLog(s);
    // ModUtils_1.ModUtils.jsLog(a);
    // ModUtils_1.ModUtils.jsLog(n);
    // ModUtils_1.ModUtils.jsLog(u);
    // ModUtils_1.ModUtils.jsLog(h); // Initial activation
    // ModUtils_1.ModUtils.jsLog(c);
    // ModUtils_1.ModUtils.jsLog(B); // reason
    // ModUtils_1.ModUtils.jsLog(d);
    // ModUtils_1.ModUtils.jsLog(_);
    // ModUtils_1.ModUtils.jsLog(l);
    // ModUtils_1.ModUtils.jsLog(v);
    var C = BaseBuffComponent_1.GetBuffStat(e),
      m =
        (C?.Start(),
        this.BuffLock++,
        [
          ["buffId", e],
          ["创建者id", o],
          ["持有者", this.GetDebugName()],
          ["初始激活", h],
          ["原因", B],
        ]);
    if (!f)
      return (
        CombatLog_1.CombatLog.Error(
          "Buff",
          this.Entity,
          "[local] 添加buff时找不到配置",
          ...m
        ),
        this.BuffLock--,
        C?.Stop(),
        ActiveBuffConfigs_1.INVALID_BUFF_HANDLE
      );
    if (
      ((s = s ?? Protocol_1.Aki.Protocol.uFs.Proto_Common) !==
        Protocol_1.Aki.Protocol.uFs.Proto_Common ||
        this.NeedCheck(f) ||
        (u = -1),
      !this.CheckAdd(f, o ?? ActiveBuffConfigs_1.NULL_INSTIGATOR_ID, d))
    )
      return (
        this.BuffLock--, C?.Stop(), ActiveBuffConfigs_1.INVALID_BUFF_HANDLE
      );
    var t = this.GetStackableBuff(
      o ?? ActiveBuffConfigs_1.NULL_INSTIGATOR_ID,
      e,
      f.StackingType
    );
    let g = r && 0 < r ? r : f.DefaultStackCount;
    if (!t) {
      let t = void 0;
      0 === f.DurationPolicy
        ? ((v = ActiveBuffConfigs_1.SUCCESS_INSTANT_BUFF_HANDLE),
          (u = ActiveBuffConfigs_1.INFINITY_DURATION),
          (g = 1))
        : (v = v ?? CharacterBuffController_1.default.GenerateHandle());
      try {
        t = ActiveBuff_1.ActiveBuffInternal.AllocBuff(
          f,
          v,
          o,
          this,
          c,
          a,
          n,
          i,
          g,
          u
        );
      } catch (t) {
        CombatLog_1.CombatLog.ErrorWithStack(
          "Buff",
          this.Entity,
          "Buff初始过程中发生异常",
          t,
          ...m
        );
      }
      if (!t)
        return (
          this.BuffLock--, C?.Stop(), ActiveBuffConfigs_1.INVALID_BUFF_HANDLE
        );
      BaseBuffComponent_1.NoLogBuffSet.has(e) ||
        CombatLog_1.CombatLog.Info(
          "Buff",
          this.Entity,
          "本地添加buff",
          ...m,
          ["handle", v],
          ["前置行为id", a],
          ["说明", f.Desc],
          ["是否迭代", _]
        );
      try {
        this.OnBuffAdded(t, r, s, a, u, h, c, d, _, l, B);
      } catch (t) {
        CombatLog_1.CombatLog.ErrorWithStack(
          "Buff",
          this.Entity,
          "Buff添加中发生异常",
          t,
          ...m
        );
      }
      return (
        0 === f.DurationPolicy &&
          ActiveBuff_1.ActiveBuffInternal.ReleaseBuff(t),
        this.BuffLock--,
        C?.Stop(),
        v
      );
    }
    if (
      t.Config &&
      (t.Config.StackLimitCount <= 0 ||
        !t.Config.DenyOverflowAdd ||
        t.StackCount < t.Config.StackLimitCount)
    ) {
      0 < f.StackAppendCount && (g = f.StackAppendCount);
      (n = 0 < f.StackLimitCount ? f.StackLimitCount : 1 / 0),
        (e = t.StackCount),
        (h = Math.min(e + g, n));
      try {
        this.OnBuffStackIncreased(
          t,
          e,
          h,
          o ?? ActiveBuffConfigs_1.NULL_INSTIGATOR_ID,
          i,
          r,
          s,
          a,
          u,
          c,
          _,
          l,
          B
        ),
          this.BuffEffectManager.ApplyInitBuffExecution(t, _);
      } catch (t) {
        CombatLog_1.CombatLog.ErrorWithStack(
          "Buff",
          this.Entity,
          "Buff层数改变中发生异常",
          t,
          ...m
        );
      }
    }
    return this.BuffLock--, C?.Stop(), t.Handle;
  }
  RemoveBuff(t, e, f, o, i) {
    this.HasBuffAuthority()
      ? this.RemoveBuffLocal(t, e, f, o, i)
      : this.RemoveBuffOrder(t, e, f);
  }
  RemoveBuffOrder(t, e, f) {}
  RemoveBuffLocal(t, e, f, o, i) {
    var r;
    return t <= ActiveBuffConfigs_1.NULL_BUFF_ID
      ? (CombatLog_1.CombatLog.Error(
          "Buff",
          this.Entity,
          "尝试本地移除buff时传入了不合法的buffId",
          ["buffId", t],
          ["持有者", this.GetDebugName()],
          ["原因", f]
        ),
        0)
      : this.HasBuffAuthority()
      ? (r = this.GetBuffById(t))
        ? this.RemoveBuffInner(r.Handle, e, !0, f, o, i)
        : 0
      : (CombatLog_1.CombatLog.Error(
          "Buff",
          this.Entity,
          "无法直接移除非本端控制实体持有的buff，请换用RemoveBuff接口",
          ["buffId", t],
          ["持有者", this.GetDebugName()],
          ["原因", f]
        ),
        0);
  }
  RemoveBuffByTagLocal(e, t) {
    if (this.HasBuffAuthority()) {
      var f = GameplayTagUtils_1.GameplayTagUtils.GetNameByTagId(e);
      for (const o of this.BuffContainer.values())
        o.Config.GrantedTags?.some((t) =>
          GameplayTagUtils_1.GameplayTagUtils.IsChildTag(t, e)
        ) && this.RemoveBuffInner(o.Handle, -1, !0, t ?? "移除tag " + f);
    } else
      CombatLog_1.CombatLog.Warn(
        "Buff",
        this.Entity,
        "尝试根据tag移除非本地控制的实体的buff，移除操作将不被执行",
        ["tagId", e],
        ["tagName", GameplayTagUtils_1.GameplayTagUtils.GetNameByTagId(e)],
        ["持有者", this.GetDebugName()],
        ["原因", t]
      );
  }
  RemoveBuffByEffectType(t, e) {
    var f = new Set(),
      o = (0, ExtraEffectDefine_1.getBuffEffectClass)(t);
    if (o) {
      for (const i of this.BuffEffectManager.GetAllEffects())
        i instanceof o && f.add(i.BuffId);
      for (const r of f.values()) this.RemoveBuff(r, -1, e);
    }
  }
  RemoveBuffByHandle(t, e = -1, f, o, i) {
    var r;
    return (
      this.HasBuffAuthority() ||
        ((r = this.GetBuffByHandle(t)) &&
          0 < r.Id &&
          CombatLog_1.CombatLog.Warn(
            "Buff",
            this.Entity,
            "尝试直接通过handle移除非本端控制buff，后续需要新增协议",
            ["buffId", r?.Id],
            ["handle", t],
            ["持有者", this.GetDebugName()],
            ["说明", r?.Config?.Desc],
            ["原因", f]
          )),
      this.RemoveBuffByHandleLocal(t, e, f, o, i)
    );
  }
  RemoveBuffByHandleLocal(t, e = -1, f, o, i) {
    return this.RemoveBuffInner(t, e, !0, f, o, i);
  }
  RemoveBuffWhenTimeout(t) {
    var e = t.Config.StackExpirationRemoveNumber;
    this.RemoveBuffInner(t.Handle, e, !1, "时间结束自然移除"),
      0 < e && t.IsValid() && t.SetDuration();
  }
  RemoveBuffInner(t, e, f, o, i, r) {
    t = this.GetBuffByHandle(t);
    if (!t) return 0;
    this.BuffLock++;
    var s = [
        ["buffId", t.Id],
        ["持有者", this.GetDebugName()],
        ["handle", t?.Handle],
        ["说明", t?.Config.Desc],
        ["原因", o],
      ],
      a =
        (BaseBuffComponent_1.NoLogBuffSet.has(t.Id) ||
          CombatLog_1.CombatLog.Info("Buff", this.Entity, "本地移除buff", ...s),
        t.StackCount),
      e = e <= 0 ? 0 : Math.max(0, a - e);
    if (e <= 0)
      try {
        this.OnBuffRemoved(t, f, o, r, i);
      } catch (t) {
        CombatLog_1.CombatLog.ErrorWithStack(
          "Buff",
          this.Entity,
          "Buff移除时发生异常",
          t,
          ...s
        );
      }
    else
      try {
        this.OnBuffStackDecreased(t, a, e, f, o);
      } catch (t) {
        CombatLog_1.CombatLog.ErrorWithStack(
          "Buff",
          this.Entity,
          "Buff层数降低时发生异常",
          t,
          ...s
        );
      }
    return this.BuffLock--, a - e;
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
        for (const o of this.BuffContainer.values())
          if (o.Id === e && !this.BuffGarbageSet.has(o.Handle)) return o;
        return;
      case 1:
        for (const i of this.BuffContainer.values())
          if (
            i.Id === e &&
            !this.BuffGarbageSet.has(i.Handle) &&
            i.InstigatorId === t
          )
            return i;
        return;
      default:
        return;
    }
  }
  GetBuffTotalStackById(t, e = !1) {
    let f = 0;
    for (const o of this.BuffContainer.values())
      o.Id !== t ||
        this.BuffGarbageSet.has(o.Handle) ||
        (e && !o.IsActive()) ||
        (f += o.StackCount);
    return f;
  }
  OnBuffAdded(t, e, f, o, i, r, s, a, n, u, h) {
    if (t) {
      var c = t.Config;
      if (t.IsInstantBuff()) {
        this.ApplyPeriodExecution(t);
        var B = this.GetExactEntity()?.GetComponent(191);
        if (B) {
          for (const _ of c.GrantedTags ?? []) B?.AddTag(_);
          for (const l of c.GrantedTags ?? []) B?.RemoveTag(l);
        }
      } else {
        var d = t.Handle;
        this.BuffContainer.set(d, t),
          this.MarkListenerBuff(t),
          this.BuffEffectManager.OnBuffAdded(t);
      }
      this.NeedCheck(t.Config)
        ? this.OnBuffActiveChanged(
            t,
            r ?? this.CheckActivate(t.Config, t.GetInstigator())
          )
        : void 0 === r
        ? CombatLog_1.CombatLog.Error(
            "Buff",
            this.Entity,
            "buff激活状态未知",
            ["buffId", t.Id],
            ["handle", t.Handle]
          )
        : this.OnBuffActiveChanged(t, r),
        t.IsActive() &&
          c &&
          0 < c.Period &&
          c.ExecutePeriodicOnAdd &&
          t.ResetPeriodTimer(
            TimerSystem_1.MIN_TIME * CommonDefine_1.SECOND_PER_MILLIONSECOND
          ),
        Info_1.Info.IsBuildDevelopmentOrDebug &&
          (this.Entity.GetComponent(24)?.OnBuffAdded(t),
          this.Entity.GetComponent(20)?.OnBuffAdded(t)),
        this.CheckWhenBuffChanged(t.Id),
        this.BuffEffectManager.ApplyInitBuffExecution(t, n),
        t.OnTimeScaleChanged(this.GetTimeScale(), this.IsPaused());
    }
  }
  ApplyPeriodExecution(t) {
    var e = t.Config,
      f = t.GetInstigatorAttributeSet();
    if (e.Modifiers && 0 < e.Modifiers.length) {
      var o = this.GetAttributeComponent();
      if (o) {
        var i,
          r,
          s = this.GetTimeScale();
        for ([i, r] of t.StateModifiers)
          this.HasBuffAuthority() &&
            ActiveBuff_1.ActiveBuffInternal.ModifyStateAttribute(
              f,
              o,
              i,
              t.Level,
              s,
              r
            );
      } else
        CombatLog_1.CombatLog.Warn(
          "Buff",
          this.Entity,
          "周期buff尝试修改属性，但owner不存在",
          ["buffId", t.Id],
          ["handle", t.Handle],
          ["持有者", t.GetOwnerBuffComponent()?.GetDebugName()],
          ["施加者", t.InstigatorId]
        );
    }
    this.BuffEffectManager?.ApplyPeriodBuffExecution(t);
    for (const a of this.BuffEffectManager?.GetEffectsByHandle(t.Handle) ?? [])
      a.OnPeriodCallback();
  }
  OnBuffRemoved(t, e, f, o, i) {
    if (t) {
      var r = t.Handle,
        r =
          (this.RemoveListenerBuff(t),
          this.BuffGarbageSet.add(r),
          t.Destroy(),
          this.CheckWhenBuffChanged(t.Id),
          this.BuffEffectManager.OnBuffRemoved(t, e),
          t.GetInstigatorBuffComponent());
      if ((void 0 === r || r.Valid) && this.HasBuffAuthority()) {
        r = e
          ? t.Config?.PrematureExpirationEffects
          : t.Config?.RoutineExpirationEffects;
        if (r)
          for (const s of r)
            this.AddIterativeBuff(
              s,
              t,
              void 0,
              !0,
              `因为Buff${t.Id}移除导致的添加`
            );
      }
    }
  }
  OnBuffStackDecreased(t, e, f, o, i) {
    t &&
      (t.SetStackCount(f),
      this.CheckWhenBuffChanged(t.Id),
      this.BuffEffectManager.OnStackDecreased(t, f, e, o));
  }
  OnBuffStackIncreased(t, e, f, o, i, r, s, a, n, u, h, c, B) {
    if (t) {
      t.SetStackCount(f),
        0 !== t.Config.StackDurationRefreshPolicy ||
          (!this.NeedCheck(t.Config) &&
            s === Protocol_1.Aki.Protocol.uFs.Proto_Common) ||
          t.SetDuration(n);
      var s = t.Config,
        d = t.Handle;
      if (
        s &&
        (t.Id,
        this.BuffEffectManager.OnStackIncreased(t, f, e, o),
        this.HasBuffAuthority())
      ) {
        n = 0 < s.StackLimitCount ? s.StackLimitCount : 1 / 0;
        if (n <= e && n <= f) {
          o = s.OverflowEffects;
          if (o && 0 < o.length)
            for (const _ of o)
              this.AddIterativeBuff(
                _,
                t,
                void 0,
                !0,
                `Buff层数溢出时迭代添加新buff（前置buff Id=${t.Id}, handle=${d}）`
              );
          t.Config.ClearStackOnOverflow &&
            this.RemoveBuffByHandle(d, -1, "Buff层数溢出时清除");
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
    let o = this.TriggerMap.get(e);
    o || this.TriggerMap.set(e, (o = [])), o.push(f);
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
    if (t && e) for (const o of [...t]) o.TryExecute(f, e);
  }
  HasBuffTrigger(t) {
    return this.TriggerMap.has(t);
  }
  AddGameplayCue(t, e, f) {
    if (!t || t.length <= 0) return ActiveBuffConfigs_1.INVALID_BUFF_HANDLE;
    BaseBuffComponent_1.Sbr.Start();
    var o = CharacterBuffController_1.default.CreateDynamicBuffRef(),
      t =
        ((o.GameplayCueIds = t),
        (o.Desc = f),
        (o.DurationPolicy = 0 === e ? 0 : e < 0 ? 1 : 2),
        0 < e &&
          ((o.DurationCalculationPolicy = [0]), (o.DurationMagnitude = [e])),
        // ModUtils_1.ModUtils.jsLog("AddGameplayCue"),
        this.AddBuffInner(
          ActiveBuffConfigs_1.DYNAMIC_BUFF_ID,
          o,
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
          void 0
        ));
    return BaseBuffComponent_1.Sbr.Stop(), t;
  }
  static BroadcastAddBuffNotify(t, e, f) {
    BaseBuffComponent_1.Wbr.Start();
    var o = e.uVn,
      i = MathUtils_1.MathUtils.LongToBigInt(e.s5n),
      r = MathUtils_1.MathUtils.LongToNumber(e.Rjn),
      t = t?.GetComponent(195),
      s = MathUtils_1.MathUtils.LongToBigInt(f?.X8n ?? -1),
      f = MathUtils_1.MathUtils.LongToBigInt(f?.$8n ?? -1);
    if (t?.Valid) {
      var a = CharacterBuffController_1.default.GetBuffDefinition(i);
      if (t && a && o !== ActiveBuffConfigs_1.INVALID_BUFF_HANDLE) {
        const n = t.GetTagComponent();
        n &&
          a.RemoveBuffWithTags?.forEach((t) => {
            n.RemoveTag(t);
          }),
          t.AddBuffRemote(i, o, {
            IsActive: e.WHn,
            InstigatorId: r,
            Level: e.F6n,
            ApplyType: e.xjn,
            PreMessageId: s,
            MessageId: f,
            ServerId: e.wjn,
            Duration: e.n5n,
            Reason: "远端通知添加buff",
          });
      }
    }
    BaseBuffComponent_1.Wbr.Stop();
  }
  static BroadcastBuffStackChangedNotify(t, e) {
    var f = e.cVn,
      e = e.Gjn,
      t = t?.GetComponent(195),
      f = t?.GetBuffByHandle(f);
    t &&
      f &&
      (f.StackCount > e
        ? t.OnBuffStackDecreased(f, f.StackCount, e, !0, "远端Buff层数变化通知")
        : f.StackCount <= e &&
          t.OnBuffStackIncreased(
            f,
            f.StackCount,
            e,
            f.InstigatorId ?? ActiveBuffConfigs_1.NULL_INSTIGATOR_ID,
            f.Level,
            void 0,
            Protocol_1.Aki.Protocol.uFs.Proto_Common,
            void 0,
            void 0,
            f.ServerId,
            !1,
            !1,
            "远端Buff层数变化通知"
          ));
  }
  static BroadcastRemoveBuffNotify(t, e) {
    var f = e.uVn,
      o = t?.GetComponent(195);
    o?.Valid
      ? o?.RemoveBuffInner(f, -1, !0, "远端通知移除buff")
      : CombatLog_1.CombatLog.Warn(
          "Buff",
          t,
          "Invalid entity when processing RemoveGameplayEffectNotify",
          ["entity id", e.F4n],
          ["handle", e.uVn]
        );
  }
  static OrderAddBuffS2cNotify(t, e, f) {
    // ModUtils_1.ModUtils.jsLog("OrderAddBuffS2cNotify");
    // ModUtils_1.ModUtils.jsLog(e);
    // ModUtils_1.ModUtils.jsLog(f);
    var o = t?.GetComponent(195),
      i = MathUtils_1.MathUtils.LongToBigInt(e.s5n), // buff id
      r = MathUtils_1.MathUtils.LongToNumber(e.Rjn), //
      f = MathUtils_1.MathUtils.LongToBigInt(f?.$8n ?? -1), // -1
      s = CharacterBuffController_1.default.GetBuffDefinition(i),
      a = new Protocol_1.Aki.Protocol.G4n();
    if (t && o?.Valid && s) {
      const n = o.GetTagComponent();
      n &&
        s.RemoveBuffWithTags?.forEach((t) => {
          n.RemoveTag(t);
        }),
        (s = o.AddBuffInner(
          i,
          CharacterBuffController_1.default.GetBuffDefinition(i),
          r,
          e.F6n,
          e.Bjn,
          e.xjn,
          f,
          void 0,
          e.n5n,
          void 0,
          e.wjn,
          "远端请求添加玩家Buff(s2c)",
          !1,
          e.Pjn,
          !0,
          void 0
        )),
        (i = o.BuffContainer.get(s)),
        (a.uVn = s),
        (a.WHn = !!i?.IsActive()),
        (a.Q4n = Protocol_1.Aki.Protocol.Q4n.KRs);
    } else a.Q4n = Protocol_1.Aki.Protocol.Q4n.Proto_UnKnownError;
    CombatMessage_1.CombatNet.Send(
      NetDefine_1.ECombatPushDataMessage.G4n,
      t,
      a,
      f,
      void 0,
      !0
    );
  }
  static OrderRemoveBuffS2cNotify(t, e, f) {
    var o = t?.GetComponent(195),
      f = MathUtils_1.MathUtils.LongToBigInt(f?.$8n ?? -1),
      o =
        (o?.RemoveBuffByHandle(e.uVn, e.Bjn, "远端请求移除buff(s2c)", f, !0),
        new Protocol_1.Aki.Protocol.O4n());
    (o.Q4n = Protocol_1.Aki.Protocol.Q4n.KRs),
      CombatMessage_1.CombatNet.Send(
        NetDefine_1.ECombatPushDataMessage.O4n,
        t,
        o,
        f,
        void 0,
        !0
      );
  }
  static OrderRemoveBuffByIdS2cNotify(t, e, f) {
    var o = t?.GetComponent(195),
      i = MathUtils_1.MathUtils.LongToBigInt(e.b6n),
      f = MathUtils_1.MathUtils.LongToBigInt(f?.$8n ?? -1),
      r = new Protocol_1.Aki.Protocol.N4n();
    o?.Valid
      ? (o.RemoveBuff(i, e.Bjn, "远端移除buff(s2c) reason=" + e.x9n, f, !0),
        (r.Q4n = Protocol_1.Aki.Protocol.Q4n.KRs))
      : (CombatLog_1.CombatLog.Warn(
          "Buff",
          t,
          "Invalid entity when processing RemoveBuffByIdS2cRequestNotify",
          ["entity id", t?.Id],
          ["buffId", i]
        ),
        (r.Q4n = Protocol_1.Aki.Protocol.Q4n.Proto_UnKnownError)),
      CombatMessage_1.CombatNet.Send(
        NetDefine_1.ECombatPushDataMessage.N4n,
        t,
        r,
        f,
        void 0,
        !0
      );
  }
  static OrderAddBuffNotify(t, e, f) {
    var o,
      i = t?.CheckGetComponent(195);
    i
      ? i &&
        ((o = MathUtils_1.MathUtils.LongToBigInt(e.s5n)),
        i.AddBuffLocal(o, {
          InstigatorId: MathUtils_1.MathUtils.LongToNumber(e.Rjn),
          Level: e.F6n,
          ApplyType: e.xjn,
          PreMessageId: f?.$8n
            ? MathUtils_1.MathUtils.LongToBigInt(f.$8n)
            : void 0,
          Duration: e.n5n,
          IsIterable: e.Pjn,
          OuterStackCount: e.Bjn,
          ServerId: e.wjn,
          IsServerOrder: !0,
          Reason: "服务端或其它客户端请求添加Buff",
        }))
      : CombatLog_1.CombatLog.Error(
          "Buff",
          t,
          "收到服务端请求添加buff，但找不到对应的entity",
          ["entity", t],
          ["buffId", e.s5n],
          ["InstigatorId", e.Rjn]
        );
  }
  static OrderRemoveBuffNotify(t, e) {
    var f = t?.GetComponent(195),
      o = MathUtils_1.MathUtils.LongToBigInt(e.s5n);
    f
      ? f.RemoveBuffLocal(o, e.Bjn, "服务端或其它客户端请求本端移除buff")
      : ((f = CharacterBuffController_1.default.GetBuffDefinition(o)),
        CombatLog_1.CombatLog.Error(
          "Buff",
          t,
          "[order] 移除Buff请求找不到对应实体",
          ["buffId", o],
          ["持有者", t?.Id],
          ["说明", f?.Desc]
        ));
  }
  static OrderRemoveBuffByTagsNotify(t, e) {
    var f = t?.GetComponent(195);
    if (f)
      for (const i of e.bjn) {
        var o = GameplayTagUtils_1.GameplayTagUtils.GetNameByTagId(i);
        f.RemoveBuffByTagLocal(i, `远端请求根据tag ${o} 移除buff`);
      }
    else
      CombatLog_1.CombatLog.Error(
        "Buff",
        t,
        "[order] 根据tag移除Buff请求找不到对应实体",
        [
          "tagId",
          e?.bjn.map((t) =>
            GameplayTagUtils_1.GameplayTagUtils.GetNameByTagId(t)
          ),
        ]
      );
  }
  static BroadcastActivateBuffNotify(t, e) {
    var f = t?.GetComponent(195),
      o = e.uVn,
      i = e.qjn,
      r = f?.GetBuffByHandle(o);
    !f || f.HasBuffAuthority()
      ? CombatLog_1.CombatLog.Warn(
          "Buff",
          t,
          "主端收到了非主控端发来的buff激活状态变更请求，或找不到Buff持有者，将不做处理",
          ["handle", o],
          ["buffId", r?.Id],
          ["本地激活状态", i],
          ["远端激活状态", e.qjn]
        )
      : f.OnBuffActiveChanged(r, i);
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
  (BaseBuffComponent.Wbr = Stats_1.Stat.Create("AddBuff_BroadcastNotify")),
  __decorate(
    [CombatMessage_1.CombatNet.Listen("yFn", !1)],
    BaseBuffComponent,
    "BroadcastAddBuffNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.Listen("i3n", !1)],
    BaseBuffComponent,
    "BroadcastBuffStackChangedNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.Listen("IFn", !1)],
    BaseBuffComponent,
    "BroadcastRemoveBuffNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.Listen("d3n", !1)],
    BaseBuffComponent,
    "OrderAddBuffS2cNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.Listen("C3n", !1)],
    BaseBuffComponent,
    "OrderRemoveBuffS2cNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.Listen("M3n", !1)],
    BaseBuffComponent,
    "OrderRemoveBuffByIdS2cNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.Handle("HFn")],
    BaseBuffComponent,
    "OrderAddBuffNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.Listen("jFn", !1)],
    BaseBuffComponent,
    "OrderRemoveBuffNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.Listen("KFn", !1)],
    BaseBuffComponent,
    "OrderRemoveBuffByTagsNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.Listen("WFn", !1)],
    BaseBuffComponent,
    "BroadcastActivateBuffNotify",
    null
  ),
  (BaseBuffComponent = BaseBuffComponent_1 =
    __decorate(
      [(0, RegisterComponent_1.RegisterComponent)(195)],
      BaseBuffComponent
    )),
  (exports.BaseBuffComponent = BaseBuffComponent);
//# sourceMappingURL=BaseBuffComponent.js.map
