"use strict";

var _a,
  __decorate =
    (this && this.__decorate) ||
    function (e, o, t, a) {
      var r,
        s = arguments.length,
        l =
          s < 3
            ? o
            : null === a
            ? (a = Object.getOwnPropertyDescriptor(o, t))
            : a;
      if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        l = Reflect.decorate(e, o, t, a);
      else
        for (var n = e.length - 1; 0 <= n; n--)
          (r = e[n]) &&
            (l = (s < 3 ? r(l) : 3 < s ? r(o, t, l) : r(o, t)) || l);
      return 3 < s && l && Object.defineProperty(o, t, l), l;
    };
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.CombatMessageController = void 0);
const cpp_1 = require("cpp"),
  UE = require("ue"),
  Info_1 = require("../../../Core/Common/Info"),
  Log_1 = require("../../../Core/Common/Log"),
  LogAnalyzer_1 = require("../../../Core/Common/LogAnalyzer"),
  Stats_1 = require("../../../Core/Common/Stats"),
  Time_1 = require("../../../Core/Common/Time"),
  NetDefine_1 = require("../../../Core/Define/Net/NetDefine"),
  Protocol_1 = require("../../../Core/Define/Net/Protocol"),
  ControllerBase_1 = require("../../../Core/Framework/ControllerBase"),
  Net_1 = require("../../../Core/Net/Net"),
  ResourceSystem_1 = require("../../../Core/Resource/ResourceSystem"),
  Vector_1 = require("../../../Core/Utils/Math/Vector"),
  MathUtils_1 = require("../../../Core/Utils/MathUtils"),
  EventDefine_1 = require("../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../Common/Event/EventSystem"),
  StatDefine_1 = require("../../Common/StatDefine"),
  ControllerHolder_1 = require("../../Manager/ControllerHolder"),
  ModelManager_1 = require("../../Manager/ModelManager"),
  CharacterController_1 = require("../../NewWorld/Character/CharacterController"),
  CombatDebugController_1 = require("../../Utils/CombatDebugController"),
  CombatLog_1 = require("../../Utils/CombatLog"),
  BlackboardController_1 = require("../../World/Controller/BlackboardController"),
  WaitEntityTask_1 = require("../../World/Define/WaitEntityTask"),
  WorldGlobal_1 = require("../../World/WorldGlobal"),
  CombatMessage_1 = require("./CombatMessage"),
  notifyMessageCacheSet = new Set([
    NetDefine_1.ECombatNotifyDataMessage.DFn,
    NetDefine_1.ECombatNotifyDataMessage.LFn,
    NetDefine_1.ECombatNotifyDataMessage.AFn,
    NetDefine_1.ECombatNotifyDataMessage.wFn,
    NetDefine_1.ECombatNotifyDataMessage.PFn,
    NetDefine_1.ECombatNotifyDataMessage.BFn,
  ]),
  MAX_AI_INFO_COUNT = 100,
  IS_WITH_EDITOR = cpp_1.FKuroUtilityForPuerts.IsWithEditor() ? 1 : void 0;
const { ModUtils } = require("../../Manager/ModFuncs/ModUtils");
const { ModManager } = require("../../Manager/ModManager");
class CombatMessageController extends ControllerBase_1.ControllerBase {
  static get Model() {
    return ModelManager_1.ModelManager.CombatMessageModel;
  }
  static OnInit() {
    Net_1.Net.Register(18486, CombatMessageController.Zyt),
      Net_1.Net.Register(19482, CombatMessageController.eIt),
      Net_1.Net.Register(26301, CombatMessageController.tIt),
      Net_1.Net.Register(19122, CombatMessageController.fMa),
      Net_1.Net.Register(16891, CombatMessageController.oIt),
      Net_1.Net.Register(
        27077,
        CombatMessageController.PreAiControlSwitchNotify
      ),
      Net_1.Net.Register(15830, this.rIt);
    for (const e of CombatMessage_1.CombatNet.SyncNotifyMap.keys())
      this.Register(e, this.nIt(e, CombatMessage_1.CombatNet.SyncNotifyMap));
    return (
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.AddEntity,
        this.RegisterMonster
      ),
      !0
    );
  }
  static OnClear() {
    Net_1.Net.UnRegister(18486),
      Net_1.Net.UnRegister(19482),
      Net_1.Net.UnRegister(26301),
      Net_1.Net.UnRegister(19122),
      Net_1.Net.UnRegister(16891),
      Net_1.Net.UnRegister(27077),
      Net_1.Net.UnRegister(15830);
    for (const e of CombatMessage_1.CombatNet.SyncNotifyMap.keys())
      this.UnRegister(e);
    return (
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.AddEntity,
        this.RegisterMonster
      ),
      EventSystem_1.EventSystem.RemoveAllTargetUseKey(this),
      !0
    );
  }
  static nIt(t, a) {
    return (e, o) => {
      a.get(t)?.(e, o);
    };
  }
  static sIt(e) {
    let o = this.aIt.get(e);
    return (
      o ||
        ((o = Stats_1.Stat.Create(e, "", StatDefine_1.BATTLESTAT_GROUP)),
        this.aIt.set(e, o)),
      o
    );
  }
  static hIt(e, o) {
    const t = MathUtils_1.MathUtils.LongToNumber(e.F4n);
    var a = ModelManager_1.ModelManager.CreatureModel.GetEntity(t),
      r = NetDefine_1.ECombatNotifyDataMessage[o.kFs];
    if (!a || a.IsInit || notifyMessageCacheSet.has(r)) {
      CombatDebugController_1.CombatDebugController.CombatInfoMessage(
        "Notify",
        o.kFs,
        e
      );
      var s = a?.Entity;
      if (CombatMessage_1.CombatNet.SyncNotifyMap.has(r)) {
        const t = MathUtils_1.MathUtils.LongToNumber(e.Y8n);
        var l,
          n = CombatMessageController.Model?.GetMessageBuffer(t);
        n && ModelManager_1.ModelManager.GameModeModel.IsMulti
          ? ((l = CombatMessage_1.CombatNet.PreNotifyMap.get(r)) &&
              !l(s, o[o.kFs], e)) ||
            n.Push(r, s, o.K8n, o[o.kFs])
          : ModUtils.jsLog(o), CombatMessage_1.CombatNet.SyncNotifyMap.get(r)?.(s, o[o.kFs], e);
          if (o.kFs == "e3n") {
            // CharacterStateMachineNewComponent.ChangeStateNotify
            ((l = NetDefine_1.messageDefine[r].encode(o).finish()),
            (s = (n = a?.Entity?.GetComponent(0))?.GetPbDataId()),
            (a = n?.GetEntityType()),
            (n = n?.GetCreatureDataId())),
              ((n = {
                scene_id: ModelManager_1.ModelManager.CreatureModel.GetSceneId(),
                instance_id:
                  ModelManager_1.ModelManager.CreatureModel.GetInstanceId(),
                creature_id: n,
                pb_data_id: s,
                entity_type: a,
                msg_id: r,
                length: l.length,
                is_multi: ModelManager_1.ModelManager.GameModeModel.IsMulti,
                is_notify: !0,
                ed: IS_WITH_EDITOR,
                br: LogAnalyzer_1.LogAnalyzer.GetBranch(),
              }),
              (s = JSON.stringify(n)),
              ModUtils.jsLog(s));
          }
      } else
        CombatMessage_1.CombatNet.NotifyMap.has(r)
          ? CombatMessage_1.CombatNet.NotifyMap.get(r)?.(s, o[o.kFs], e)
          : Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "MultiplayerCombat",
              20,
              "Unexpected combat notify message type",
              ["MessageKey", o.kFs],
              ["MessageId", r]
            );
      Info_1.Info.IsBuildDevelopmentOrDebug &&
        ((l = NetDefine_1.messageDefine[r].encode(o).finish()),
        (s = (n = a?.Entity?.GetComponent(0))?.GetPbDataId()),
        (a = n?.GetEntityType()),
        (n = n?.GetCreatureDataId()),
        0 < l.length) &&
        ((n = {
          scene_id: ModelManager_1.ModelManager.CreatureModel.GetSceneId(),
          instance_id:
            ModelManager_1.ModelManager.CreatureModel.GetInstanceId(),
          creature_id: n,
          pb_data_id: s,
          entity_type: a,
          msg_id: r,
          length: l.length,
          is_multi: ModelManager_1.ModelManager.GameModeModel.IsMulti,
          is_notify: !0,
          ed: IS_WITH_EDITOR,
          br: LogAnalyzer_1.LogAnalyzer.GetBranch(),
        }),
        (s = JSON.stringify(n)),
        CombatDebugController_1.CombatDebugController.DataReport(
          "COMBAT_MESSAGE_INFO",
          s
        ));
    } else
      CombatLog_1.CombatLog.Warn(
        "Notify",
        t,
        "协议丢弃，实体未加载完成",
        ["Message", o.kFs],
        ["CombatCommon", e]
      );
  }
  static lIt(e, o) {
    var t = CombatMessage_1.CombatNet.RequestMap,
      a = o.W8n;
    if (t.has(a)) {
      var r = t.get(a),
        s = o[o.kFs];
      if ((t.delete(a), s))
        try {
          r?.(s);
        } catch (e) {
          e instanceof Error
            ? Log_1.Log.CheckError() &&
              Log_1.Log.ErrorWithStack(
                "CombatInfo",
                15,
                "战斗协议执行response异常",
                e,
                ["response", o.kFs],
                ["error", e.message]
              )
            : Log_1.Log.CheckError() &&
              Log_1.Log.Error(
                "CombatInfo",
                15,
                "战斗协议执行response异常",
                ["response", o.kFs],
                ["stack", e]
              );
        }
      else
        Log_1.Log.CheckWarn() &&
          Log_1.Log.Warn(
            "MultiplayerCombat",
            20,
            "unexpected null combat response",
            ["messageType", o.kFs]
          );
    } else
      Log_1.Log.CheckError() &&
        Log_1.Log.Error(
          "MultiplayerCombat",
          20,
          "unexpected response RPC id from server",
          ["messageType", o.kFs]
        );
  }
  static Register(r, s) {
    return (
      Net_1.Net.Register(r, (e) => {
        var o,
          t,
          a = e;
        a
          ? a.CombatCommon
            ? ((o = MathUtils_1.MathUtils.LongToNumber(a.CombatCommon.F4n)),
              (t =
                ModelManager_1.ModelManager.CreatureModel.GetEntity(o)?.Entity),
              ModelManager_1.ModelManager.GameModeModel.IsMulti
                ? (this.IsDebugMessageLog &&
                    Log_1.Log.CheckDebug() &&
                    Log_1.Log.Debug(
                      "MultiplayerCombat",
                      15,
                      "[CombatMessageController.ReceiveNotify]",
                      ["id", r],
                      ["MessageId", a.CombatCommon.$8n],
                      ["Originator", a.CombatCommon.Y8n],
                      ["TimeStamp", a.CombatCommon.J8n]
                    ),
                  CombatMessageController.Model.GetMessageBuffer(o)?.Push(
                    r,
                    t,
                    a.CombatCommon,
                    e
                  ))
                : s(t, e))
            : Log_1.Log.CheckError() &&
              Log_1.Log.Error(
                "MultiplayerCombat",
                15,
                "[CombatMessageController.ReceiveNotify]协议字段CombatCommon为空",
                ["id", r]
              )
          : Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "MultiplayerCombat",
              15,
              "[CombatMessageController.ReceiveNotify]战斗消息必须包含CombatCommon属性",
              ["id", r]
            );
      }),
      this.sX.has(r)
        ? (Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "MultiplayerCombat",
              15,
              "[CombatMessageController.Register]战斗网络消息重复注册",
              ["id", r]
            ),
          !1)
        : (this.sX.set(r, (e, o) => {
            s(e, o);
          }),
          !0)
    );
  }
  static UnRegister(e) {
    return (
      Net_1.Net.UnRegister(e),
      this.sX.delete(e) ||
        (Log_1.Log.CheckError() &&
          Log_1.Log.Error("MultiplayerCombat", 15, "战斗网络消息未注册", [
            "id",
            e,
          ])),
      !0
    );
  }
  static Process(e, o, t, a) {
    var r = CombatMessage_1.CombatNet.SyncNotifyMap.get(e);
    r ? r(o, t, a) : this.sX.get(e)?.(o, t);
  }
  static RegisterPreTick(e, o) {
    this.Y7.has(e)
      ? Log_1.Log.CheckWarn() &&
        Log_1.Log.Warn(
          "CombatInfo",
          15,
          "[CombatMessageController.RegisterPreTick] 当前Comp已经注册过PreTick",
          ["Comp", e.toString()]
        )
      : this.Y7.set(e, o);
  }
  static UnregisterPreTick(e) {
    this.Y7.has(e)
      ? this.Y7.delete(e)
      : Log_1.Log.CheckWarn() &&
        Log_1.Log.Warn(
          "CombatInfo",
          15,
          "[CombatMessageController.RegisterPreTick] 当前Comp未注册过PreTick",
          ["Comp", e.toString()]
        );
  }
  static RegisterAfterTick(e, o) {
    this._It.has(e)
      ? Log_1.Log.CheckWarn() &&
        Log_1.Log.Warn(
          "CombatInfo",
          15,
          "[CombatMessageController.RegisterAfterTick] 当前Comp已经注册过AfterTick",
          ["Comp", e.toString()]
        )
      : this._It.set(e, o);
  }
  static UnregisterAfterTick(e) {
    this._It.has(e)
      ? this._It.delete(e)
      : Log_1.Log.CheckWarn() &&
        Log_1.Log.Warn(
          "CombatInfo",
          15,
          "[CombatMessageController.UnregisterAfterTick] 当前Comp未注册过AfterTick",
          ["Comp", e.toString()]
        );
  }
  static PreTick(e) {
    if (
      Net_1.Net.IsServerConnected() &&
      ModelManager_1.ModelManager.GameModeModel.MapDone
    ) {
      var o,
        t,
        a = e * MathUtils_1.MathUtils.MillisecondToSecond;
      this.uIt.Start();
      for (const r of this.Model.CombatMessageBufferMap.values()) r.OnTick(a);
      this.uIt.Stop();
      for ([o, t] of this.Y7)
        try {
          o.Entity?.Valid && t(e);
        } catch (e) {
          e instanceof Error
            ? Log_1.Log.CheckError() &&
              Log_1.Log.ErrorWithStack(
                "CombatInfo",
                15,
                "处理方法执行异常",
                e,
                ["comp", o.toString()],
                ["error", e.message]
              )
            : Log_1.Log.CheckError() &&
              Log_1.Log.Error(
                "CombatInfo",
                15,
                "处理方法执行异常",
                ["comp", o.toString()],
                ["error", e]
              );
        }
    }
  }
  static AfterTick(e) {
    if (
      Net_1.Net.IsServerConnected() &&
      ModelManager_1.ModelManager.GameModeModel.MapDone
    ) {
      for (var [o, t] of this._It)
        try {
          o.Entity?.Valid &&
            ((o.Entity.Active || this.cIt.has(o.Entity)) &&
            (t(e), o.Entity.Active)
              ? this.cIt.add(o.Entity)
              : this.cIt.delete(o.Entity));
        } catch (e) {
          e instanceof Error
            ? Log_1.Log.CheckError() &&
              Log_1.Log.ErrorWithStack(
                "CombatInfo",
                15,
                "处理方法执行异常",
                e,
                ["comp", o.toString()],
                ["error", e.message]
              )
            : Log_1.Log.CheckError() &&
              Log_1.Log.Error(
                "CombatInfo",
                15,
                "处理方法执行异常",
                ["comp", o.toString()],
                ["error", e]
              );
        }
      if (
        Time_1.Time.NowSeconds > this.mIt + this.dIt ||
        this.Model.AnyHateChange
      ) {
        this.CIt.Start();
        let e = !1;
        for (const b of this.meh)
          if (b.IsInit) {
            e || ((l = b.Entity.GetComponent(161)), (e = l?.IsInFightState()));
            var a,
              r,
              s = Protocol_1.Aki.Protocol.Ai.o4n.create(),
              l =
                ModelManager_1.ModelManager.GameModeModel.IsMulti ||
                this.Model.AnyHateChange;
            if (l)
              for ([a, r] of b.Entity.GetComponent(
                40
              ).AiController.AiHateList.GetHatredMap()) {
                var n = Protocol_1.Aki.Protocol.Ai.eNs.create();
                (n.F4n = MathUtils_1.MathUtils.NumberToLong(
                  ModelManager_1.ModelManager.CreatureModel.GetCreatureDataId(a)
                )),
                  (n.Z8n = r.HatredValue),
                  s.ISs.push(n);
              }
            s.ISs.length > MAX_AI_INFO_COUNT &&
              Log_1.Log.CheckError() &&
              Log_1.Log.Error(
                "MultiplayerCombat",
                20,
                "仇恨数据过大",
                ["CreatureData", b.CreatureDataId],
                ["HateList", s.ISs.length]
              ),
              l &&
                CombatMessage_1.CombatNet.Call(
                  15659,
                  b.CreatureDataId,
                  s,
                  () => {}
                );
          }
        (this.mIt = Time_1.Time.NowSeconds), this.CIt.Stop();
      }
      if (
        ((this.Model.AnyHateChange = !1),
        ModelManager_1.ModelManager.GameModeModel.IsMulti &&
          0 <
            BlackboardController_1.BlackboardController.PendingBlackboardParams
              .size)
      ) {
        for (const c of this.meh) {
          var i, _;
          c.IsInit &&
            ((i = Protocol_1.Aki.Protocol.Ai.i4n.create()),
            (_ =
              BlackboardController_1.BlackboardController.PendingBlackboardParams.get(
                c.CreatureDataId
              )) &&
              ((i.eVn = [..._.values()]),
              CombatMessage_1.CombatNet.Call(
                26497,
                c.CreatureDataId,
                i,
                () => {}
              )),
            i.eVn.length > MAX_AI_INFO_COUNT) &&
            Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "MultiplayerCombat",
              20,
              "黑板数据过大",
              ["CreatureData", c.CreatureDataId],
              ["AiBlackboards", i.eVn.length]
            );
        }
        BlackboardController_1.BlackboardController.PendingBlackboardParams.clear();
      }
      if (
        (!ModelManager_1.ModelManager.CombatMessageModel.MoveSyncUdpMode ||
          !ModelManager_1.ModelManager.GameModeModel.IsMulti) &&
        ModelManager_1.ModelManager.CombatMessageModel.NeedPushMove
      ) {
        var C = Protocol_1.Aki.Protocol.Yus.create();
        C.FZa = ModelManager_1.ModelManager.GameModeModel.IsMulti
          ? ModelManager_1.ModelManager.OnlineModel.OwnerId
          : ModelManager_1.ModelManager.CreatureModel.GetPlayerId();
        for (const f of ModelManager_1.ModelManager.CombatMessageModel
          .MoveSyncSet) {
          var g = f.CollectPendingMoveInfos();
          g && C.WRs.push(g);
        }
        0 < C.WRs.length && Net_1.Net.Send(28450, C),
          Info_1.Info.IsBuildDevelopmentOrDebug &&
            ((m = {
              scene_id: ModelManager_1.ModelManager.CreatureModel.GetSceneId(),
              instance_id:
                ModelManager_1.ModelManager.CreatureModel.GetInstanceId(),
              msg_id: 28450,
              sub_count: C.WRs.length,
              is_multi: ModelManager_1.ModelManager.GameModeModel.IsMulti,
              ed: IS_WITH_EDITOR,
              br: LogAnalyzer_1.LogAnalyzer.GetBranch(),
            }),
            (m = JSON.stringify(m)),
            CombatDebugController_1.CombatDebugController.DataReport(
              "COMBAT_MESSAGE_COUNT",
              m
            )),
          (ModelManager_1.ModelManager.CombatMessageModel.NeedPushMove = !1);
      }
      var M = [],
        m = this.Model.MessagePack;
      if (0 < m.R5n.length)
        if (
          ModelManager_1.ModelManager.CombatMessageModel
            .CombatMessageSendPendingTime
        ) {
          if (
            Time_1.Time.NowSeconds >=
            ModelManager_1.ModelManager.CombatMessageModel
              .CombatMessageSendPendingTime +
              ModelManager_1.ModelManager.CombatMessageModel
                .CombatMessageSendInterval
          ) {
            for (const d of m.R5n)
              d.x5n &&
                (CombatDebugController_1.CombatDebugController.CombatContextInfoMessage(
                  "Request",
                  d.x5n.kFs,
                  d.x5n
                ),
                M.push(d.x5n.kFs));
            Net_1.Net.Call(15879, m, (e) => {
              e.XLs && this.rIt(e.XLs);
            }),
              Info_1.Info.IsBuildDevelopmentOrDebug &&
                ((m = {
                  scene_id:
                    ModelManager_1.ModelManager.CreatureModel.GetSceneId(),
                  instance_id:
                    ModelManager_1.ModelManager.CreatureModel.GetInstanceId(),
                  msg_id: 15879,
                  sub_count: m.R5n.length,
                  is_multi: ModelManager_1.ModelManager.GameModeModel.IsMulti,
                  sub_msg: M,
                  frame: Time_1.Time.Frame,
                  ed: IS_WITH_EDITOR,
                  br: LogAnalyzer_1.LogAnalyzer.GetBranch(),
                }),
                (m = JSON.stringify(m)),
                CombatDebugController_1.CombatDebugController.DataReport(
                  "COMBAT_MESSAGE_COUNT",
                  m
                )),
              (this.Model.MessagePack =
                Protocol_1.Aki.Protocol.CombatMessage.sZn.create()),
              (ModelManager_1.ModelManager.CombatMessageModel.CombatMessageSendPendingTime = 0);
          }
        } else
          ModelManager_1.ModelManager.CombatMessageModel.CombatMessageSendPendingTime =
            Time_1.Time.NowSeconds;
    }
  }
  static pga(e) {
    var o,
      t = MathUtils_1.MathUtils.LongToNumber(e.F4n),
      t = ModelManager_1.ModelManager.CreatureModel.GetEntity(t),
      a = Vector_1.Vector.Create(e.ADs),
      r = CharacterController_1.CharacterController.GetActorComponent(t),
      s = t.Entity.GetComponent(3);
    s
      ? s.FixBornLocation("ResetLocationForZRangeNotify", !0, a, !1, !0)
      : r.SetActorLocation(a.ToUeVector(), "ResetLocationForZRangeNotify", !1),
      e.PDs &&
        ((o = WorldGlobal_1.WorldGlobal.ToUeRotator(e.g8n)),
        r.SetActorRotation(o, "ResetLocationForZRangeNotify")),
      t.Entity.GetComponent(164)?.SetForceSpeed(
        Vector_1.Vector.ZeroVectorProxy
      ),
      t.Entity.GetComponent(59)?.ClearReplaySamples(),
      e.UDs &&
        (t.Entity.GetComponent(0).SetInitLocation(a), s?.SetInitLocation(a)),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "Entity",
          15,
          "ResetLocationForZRangeNotify 重置实体位置",
          ["CreatureDataId", t.CreatureDataId],
          ["PbDataId", t.PbDataId],
          ["EntityId", t.Entity.Id],
          ["ChangeInitPos", e.UDs],
          ["Location", a.ToString()]
        );
  }
  static gIt(e) {
    var o = MathUtils_1.MathUtils.LongToNumber(e.F4n),
      t = ModelManager_1.ModelManager.CreatureModel.GetEntity(o),
      a = MathUtils_1.MathUtils.LongToNumber(e.Y8n);
    if (
      (CombatMessageController.IsDebugMessageLog &&
        Log_1.Log.CheckDebug() &&
        Log_1.Log.Debug(
          "MultiplayerCombat",
          15,
          "[CombatMessageController.ReceiveNotify]",
          ["Originator", a]
        ),
      t)
    )
      if (e.iVn.length <= 0)
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "MultiplayerCombat",
            15,
            "[CombatMessageController.MoveInfosHandle], MoveInfos 是空的",
            ["Originator", a]
          );
      else {
        var r = e.iVn[0].J8n;
        if (t.Entity.Active) {
          var s,
            l = CombatMessageController.Model.GetMessageBuffer(a);
          l &&
            ((s = t.Entity.GetComponent(0)),
            CombatMessageController.Model.SetEntityMap(t.Id, a),
            l.RecordMessageTime(r, s.GetPbDataId(), !0));
          const n = t.Entity.GetComponent(59);
          n
            ? n.ReceiveMoveInfos(e.iVn, Number(a), r)
            : CombatLog_1.CombatLog.Warn(
                "Move",
                t.Entity,
                "entity不存在组件CharacterMovementSyncComponent",
                ["creatureDataId", o]
              );
        } else {
          if (!t.IsInit) return;
          const n = t.Entity.GetComponent(59);
          l = e.iVn[e.iVn.length - 1];
          CombatMessageController.fIt(l.P5n, CombatMessageController.pIt),
            CombatMessageController.vIt(l.g8n, CombatMessageController.MIt),
            t.Entity.GetComponent(3)?.SetActorLocationAndRotation(
              CombatMessageController.pIt,
              CombatMessageController.MIt,
              "MoveInfosHandle",
              !1
            ),
            void n?.ClearReplaySamples();
        }
      }
  }
  static EntityIsVisibleNotify(e, o) {
    e &&
      (e.IsInit
        ? (CombatLog_1.CombatLog.Info("Actor", e, "Entity通知设置显隐", [
            "v",
            o.rVn,
          ]),
          ControllerHolder_1.ControllerHolder.CreatureController.SetEntityEnable(
            e,
            o.rVn,
            "CombatMessageController.EntityIsVisibleNotify"
          ))
        : e.GetComponent(0)?.SetVisible(o.rVn));
  }
  static ActorIsVisibleNotify(e, o) {
    e &&
      (CombatLog_1.CombatLog.Info("Actor", e, "Actor通知设置显隐", [
        "v",
        o.oVn,
      ]),
      ControllerHolder_1.ControllerHolder.CreatureController.SetActorVisible(
        e,
        o.oVn,
        o.oVn,
        o.oVn,
        "ActorIsVisibleNotify"
      ));
  }
  static EIt(e) {
    var o = MathUtils_1.MathUtils.LongToNumber(e.F4n),
      t = ModelManager_1.ModelManager.CreatureModel.GetEntity(o);
    t
      ? (t = t.Entity.GetComponent(40))
        ? t.OnSyncAiInformation(e)
        : CombatLog_1.CombatLog.Warn(
            "Ai",
            o,
            "OnSyncAiInformation 不存在CharacterAiComponent"
          )
      : CombatLog_1.CombatLog.Warn("Ai", o, "OnSyncAiInformation 不存在实体");
  }
  static EntityLoadCompleteNotify(e, o) {
    var t = o.W5n;
    for (const r of o.PSs) {
      var a = MathUtils_1.MathUtils.LongToNumber(r),
        a = ModelManager_1.ModelManager.CreatureModel.GetEntity(a);
      a && a.Entity.GetComponent(40)?.SetLoadCompletePlayer(t);
    }
  }
  static PlayerRebackSceneNotify(e, o) {
    (o = MathUtils_1.MathUtils.LongToNumber(o.NDs)),
      (o = ModelManager_1.ModelManager.CreatureModel.GetEntity(o));
    o && o.Entity.GetComponent(60).ClearReplaySamples();
  }
  static MaterialNotify(e, o) {
    if (o.sVn.nVn.length <= 0 || "None" === o.sVn.nVn)
      CombatLog_1.CombatLog.Warn("Material", e, "材质同步失败，参数非法");
    else {
      const t = e?.GetComponent(2)?.Actor;
      t
        ? o.sVn.aVn
          ? ResourceSystem_1.ResourceSystem.LoadAsync(
              o.sVn.nVn,
              UE.PD_CharacterControllerDataGroup_C,
              (e) => {
                e
                  ? t.CharRenderingComponent.AddMaterialControllerDataGroup(e)
                  : Log_1.Log.CheckError() &&
                    Log_1.Log.Error("Battle", 4, "无法找到材质效果", [
                      "data.MaterialInfo.AssetName",
                      o.sVn.nVn,
                    ]);
              }
            )
          : ResourceSystem_1.ResourceSystem.LoadAsync(
              o.sVn.nVn,
              UE.PD_CharacterControllerData_C,
              (e) => {
                e
                  ? t.CharRenderingComponent.AddMaterialControllerData(e)
                  : Log_1.Log.CheckError() &&
                    Log_1.Log.Error("Battle", 4, "无法找到材质效果组", [
                      "data!.MaterialInfo.AssetName",
                      o.sVn.nVn,
                    ]);
              }
            )
        : CombatLog_1.CombatLog.Warn("Material", e, "材质同步失败，Actor为空");
    }
  }
  static fIt(e, o) {
    (o.X = e.X), (o.Y = e.Y), (o.Z = e.Z);
  }
  static vIt(e, o) {
    (o.Pitch = e.Pitch), (o.Roll = e.Roll), (o.Yaw = e.Yaw);
  }
}
((_a = CombatMessageController).IsTickEvenPausedInternal = !0),
  (CombatMessageController.IsDebugMessageLog = !1),
  (CombatMessageController.IsDebugMoveMessage = !1),
  (CombatMessageController.StartTime = 0),
  (CombatMessageController.MoveData = 0),
  (CombatMessageController.MoveDataCount = 0),
  (CombatMessageController.StateData = 0),
  (CombatMessageController.StateDataCount = 0),
  (CombatMessageController.sX = new Map()),
  (CombatMessageController.SIt = Stats_1.Stat.Create(
    "CombatPackNotify.CombatReceivePackNotifyStat",
    "",
    StatDefine_1.BATTLESTAT_GROUP
  )),
  (CombatMessageController.aIt = new Map()),
  (CombatMessageController.rIt = (e) => {
    _a.SIt.Start();
    for (const r of e.R5n) {
      var o,
        t,
        a = r.kFs,
        a = r[a];
      r.KLs
        ? ((o = r.KLs), (t = _a.sIt(o.kFs)).Start(), _a.hIt(a.K8n, o), t.Stop())
        : r.QLs &&
          ((o = r.QLs),
          (t = _a.sIt(o.kFs)).Start(),
          _a.lIt(a.K8n, o),
          t.Stop());
    }
    _a.SIt.Stop();
  }),
  (CombatMessageController.mIt = 0),
  (CombatMessageController.dIt = 1),
  (CombatMessageController.uIt = Stats_1.Stat.Create("CombatMessageBuffer")),
  (CombatMessageController.CIt = Stats_1.Stat.Create("CombatMessageHatred")),
  (CombatMessageController.Y7 = new Map()),
  (CombatMessageController._It = new Map()),
  (CombatMessageController.meh = new Set()),
  (CombatMessageController.RegisterMonster = (e, o, t) => {
    o.EntityType === Protocol_1.Aki.Protocol.kks.Proto_Monster &&
      (_a.meh.has(o)
        ? Log_1.Log.CheckWarn() &&
          Log_1.Log.Warn(
            "CombatInfo",
            15,
            "[CombatMessageController.RegisterMonster] 当前已经注册过Monster"
          )
        : (_a.meh.add(o),
          EventSystem_1.EventSystem.AddWithTargetUseHoldKey(
            _a,
            o,
            EventDefine_1.EEventName.RemoveEntity,
            _a.UnregisterMonster
          )));
  }),
  (CombatMessageController.UnregisterMonster = (e, o) => {
    o.EntityType === Protocol_1.Aki.Protocol.kks.Proto_Monster &&
      (_a.meh.delete(o)
        ? EventSystem_1.EventSystem.RemoveWithTargetUseKey(
            _a,
            o,
            EventDefine_1.EEventName.RemoveEntity,
            _a.UnregisterMonster
          )
        : Log_1.Log.CheckWarn() &&
          Log_1.Log.Warn(
            "CombatInfo",
            15,
            "[CombatMessageController.RegisterMonster] 当前Monster未被注册"
          ));
  }),
  (CombatMessageController.cIt = new Set()),
  (CombatMessageController.Zyt = (o) => {
    const t = MathUtils_1.MathUtils.LongToNumber(o.F4n);
    WaitEntityTask_1.WaitEntityTask.Create(
      t,
      (e) => {
        e
          ? CombatMessageController.pga(o)
          : Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "Level",
              32,
              "[ResetLocationForZRangeNotify] 等待之后还是找不到对应的Entity",
              ["id", t]
            );
      },
      -1
    );
  }),
  (CombatMessageController.eIt = (e) => {
    for (const o of e.WRs) _a.gIt(o);
  }),
  (CombatMessageController.tIt = (e) => {
    for (const o of e.WRs) _a.gIt(o);
  }),
  (CombatMessageController.fMa = (e) => {
    var o = MathUtils_1.MathUtils.LongToNumber(e.g0a.F4n),
      o = ModelManager_1.ModelManager.CreatureModel.GetEntity(o);
    o && (o = o.Entity.GetComponent(116)) && o.HandleMoveToTarget(e);
  }),
  (CombatMessageController.oIt = (e) => {
    for (const o of e.ASs) CombatMessageController.EIt(o);
  }),
  (CombatMessageController.PreAiControlSwitchNotify = (e) => {
    for (const a of e.PSs) {
      var o = MathUtils_1.MathUtils.LongToNumber(a),
        t = ModelManager_1.ModelManager.CreatureModel.GetEntity(o);
      t
        ? (t = t.Entity.GetComponent(40)) && t.AiController.PreSwitchControl()
        : CombatLog_1.CombatLog.Warn(
            "Ai",
            o,
            "PreAiControlSwitchNotify 不存在实体",
            ["id", o]
          );
    }
  }),
  (CombatMessageController.pIt = new UE.Vector()),
  (CombatMessageController.MIt = new UE.Rotator()),
  __decorate(
    [CombatMessage_1.CombatNet.SyncHandle("BFn")],
    CombatMessageController,
    "EntityIsVisibleNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.SyncHandle("p3n")],
    CombatMessageController,
    "ActorIsVisibleNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.Handle("UFn")],
    CombatMessageController,
    "EntityLoadCompleteNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.Handle("bFn")],
    CombatMessageController,
    "PlayerRebackSceneNotify",
    null
  ),
  __decorate(
    [CombatMessage_1.CombatNet.SyncHandle("PFn")],
    CombatMessageController,
    "MaterialNotify",
    null
  ),
  (exports.CombatMessageController = CombatMessageController);
//# sourceMappingURL=CombatMessageController.js.map
