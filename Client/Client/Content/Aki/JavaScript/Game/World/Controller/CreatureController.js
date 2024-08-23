// delete me on release

"use strict";
var _a;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.CreatureController = void 0;
const UE = require("ue"),
    ActorSystem_1 = require("../../../Core/Actor/ActorSystem"),
    CustomPromise_1 = require("../../../Core/Common/CustomPromise"),
    Log_1 = require("../../../Core/Common/Log"),
    LogProfiler_1 = require("../../../Core/Common/LogProfiler"),
    Stats_1 = require("../../../Core/Common/Stats"),
    DataLayerById_1 = require("../../../Core/Define/ConfigQuery/DataLayerById"),
    SummonCfgById_1 = require("../../../Core/Define/ConfigQuery/SummonCfgById"),
    Protocol_1 = require("../../../Core/Define/Net/Protocol"),
    EntityHelper_1 = require("../../../Core/Entity/EntityHelper"),
    EntitySystem_1 = require("../../../Core/Entity/EntitySystem"),
    ControllerBase_1 = require("../../../Core/Framework/ControllerBase"),
    Net_1 = require("../../../Core/Net/Net"),
    ResourceSystem_1 = require("../../../Core/Resource/ResourceSystem"),
    Rotator_1 = require("../../../Core/Utils/Math/Rotator"),
    Vector_1 = require("../../../Core/Utils/Math/Vector"),
    MathUtils_1 = require("../../../Core/Utils/MathUtils"),
    CameraController_1 = require("../../Camera/CameraController"),
    TsBaseCharacter_1 = require("../../Character/TsBaseCharacter"),
    EventDefine_1 = require("../../Common/Event/EventDefine"),
    EventSystem_1 = require("../../Common/Event/EventSystem"),
    PublicUtil_1 = require("../../Common/PublicUtil"),
    GameQualitySettingsManager_1 = require("../../GameQualitySettings/GameQualitySettingsManager"),
    Global_1 = require("../../Global"),
    GlobalData_1 = require("../../GlobalData"),
    HotFixUtils_1 = require("../../HotFix/HotFixUtils"),
    ConfigManager_1 = require("../../Manager/ConfigManager"),
    ControllerHolder_1 = require("../../Manager/ControllerHolder"),
    ModelManager_1 = require("../../Manager/ModelManager"),
    FormationAttributeController_1 = require("../../Module/Abilities/FormationAttributeController"),
    FormationDataController_1 = require("../../Module/Abilities/FormationDataController"),
    BlackScreenController_1 = require("../../Module/BlackScreen/BlackScreenController"),
    CombatMessage_1 = require("../../Module/CombatMessage/CombatMessage"),
    LevelSequencePlayer_1 = require("../../Module/Common/LevelSequencePlayer"),
    SceneTeamData_1 = require("../../Module/SceneTeam/SceneTeamData"),
    SeamlessTravelController_1 = require("../../Module/SeamlessTravel/SeamlessTravelController"),
    SeamlessTravelDefine_1 = require("../../Module/SeamlessTravel/SeamlessTravelDefine"),
    TimeOfDayController_1 = require("../../Module/TimeOfDay/TimeOfDayController"),
    CharacterController_1 = require("../../NewWorld/Character/CharacterController"),
    CharacterBuffController_1 = require("../../NewWorld/Character/Common/Component/Abilities/CharacterBuffController"),
    CreateEntityData_1 = require("../../NewWorld/Character/CreateEntityData"),
    BattleSetting_1 = require("../../NewWorld/Setting/BattleSetting"),
    PreloadDefine_1 = require("../../Preload/PreloadDefine"),
    ScenePlayerData_1 = require("../Define/ScenePlayerData"),
    WaitEntityPreloadTask_1 = require("../Define/WaitEntityPreloadTask"),
    WaitEntityTask_1 = require("../Define/WaitEntityTask"),
    WaitEntityToLoadTask_1 = require("../Define/WaitEntityToLoadTask"),
    AsyncTask_1 = require("../Task/AsyncTask"),
    TaskSystem_1 = require("../Task/TaskSystem"),
    WorldGlobal_1 = require("../WorldGlobal"),
    AoiController_1 = require("./AoiController"),
    BattleLogicController_1 = require("./BattleLogicController"),
    PreloadController_1 = require("./PreloadController"),
    ModMenu_1 = require("../../ModMenu"),
    PreloadControllerNew_1 = require("./PreloadControllerNew"),
    idDefaultValue = -1n,
    increment = 2n,
    playerBit = 20n,
    unitMax = 4294967295n;
class CreatureController extends ControllerBase_1.ControllerBase {
    static OnInit() {
        WorldGlobal_1.WorldGlobal.Initialize();
        var e = GameQualitySettingsManager_1.GameQualitySettingsManager.Get().GetCurrentQualityInfo();
        return this.jQs = e.NpcDensity, !!Global_1.Global.WorldEntityHelper.Initialize() && (Net_1.Net.Register(4296, CreatureController.P0r), Net_1.Net.Register(20929, CreatureController.x0r), Net_1.Net.Register(2429, CreatureController.w0r), Net_1.Net.Register(27474, CreatureController.EntityOnLandedNotify), Net_1.Net.Register(6803, CreatureController.B0r), Net_1.Net.Register(26318, CreatureController.JoinSceneNotify), Net_1.Net.Register(27982, CreatureController.AfterJoinSceneNotify), Net_1.Net.Register(15958, CreatureController.b0r), Net_1.Net.Register(4585, CreatureController.q0r), Net_1.Net.Register(8506, CreatureController.G0r), Net_1.Net.Register(12911, CreatureController.N0r), Net_1.Net.Register(21432, CreatureController.O0r), Net_1.Net.Register(6231, CreatureController.k0r), Net_1.Net.Register(27695, CreatureController.F0r), Net_1.Net.Register(8842, CreatureController.V0r), Net_1.Net.Register(28477, CreatureController.H0r), Net_1.Net.Register(9072, CreatureController.j0r), Net_1.Net.Register(17131, this.SwitchBattleModeNotify), Net_1.Net.Register(29868, this.BattleLogNotify), Net_1.Net.Register(16797, this.W0r), Net_1.Net.Register(8047, this.STn), Net_1.Net.Register(28892, this.K0r), Net_1.Net.Register(3884, this.SceneLoadingTimeOutNotify), Net_1.Net.Register(18217, CreatureController.Q0r), Net_1.Net.Register(4861, CreatureController.X0r), Net_1.Net.Register(15944, CreatureController.$0r), Net_1.Net.Register(22282, CreatureController.Y0r), Net_1.Net.Register(18332, FormationAttributeController_1.FormationAttributeController.FormationAttrNotify), Net_1.Net.Register(9592, FormationAttributeController_1.FormationAttributeController.TimeCheckNotify), Net_1.Net.Register(23120, CreatureController.J0r), Net_1.Net.Register(17617, CreatureController.z0r), Net_1.Net.Register(25417, CreatureController.Z0r), EventSystem_1.EventSystem.Add(EventDefine_1.EEventName.EntityOnLandedPush, CreatureController.EntityOnLandedPush), EventSystem_1.EventSystem.Add(EventDefine_1.EEventName.DelayRemoveEntityFinished, CreatureController.efr), EventSystem_1.EventSystem.Add(EventDefine_1.EEventName.TeleportComplete, CreatureController.tfr), EventSystem_1.EventSystem.Add(EventDefine_1.EEventName.CreateEntityFail, CreatureController.OnCreateEntityFail), this.dva.OnInit(), !0)
    }
    static OnClear() {
        return WorldGlobal_1.WorldGlobal.Clear(), !!Global_1.Global.WorldEntityHelper.Clear() && (Net_1.Net.UnRegister(4296), Net_1.Net.UnRegister(20929), Net_1.Net.UnRegister(2429), Net_1.Net.UnRegister(27474), Net_1.Net.UnRegister(6803), Net_1.Net.UnRegister(26318), Net_1.Net.UnRegister(27982), Net_1.Net.UnRegister(12911), Net_1.Net.UnRegister(15958), Net_1.Net.UnRegister(4585), Net_1.Net.UnRegister(21432), Net_1.Net.UnRegister(6231), Net_1.Net.UnRegister(27695), Net_1.Net.UnRegister(8842), Net_1.Net.UnRegister(28477), Net_1.Net.UnRegister(9072), Net_1.Net.UnRegister(17131), Net_1.Net.UnRegister(16797), Net_1.Net.UnRegister(8047), Net_1.Net.UnRegister(3884), Net_1.Net.UnRegister(18217), Net_1.Net.UnRegister(28892), Net_1.Net.UnRegister(4861), Net_1.Net.UnRegister(22282), Net_1.Net.UnRegister(18332), Net_1.Net.UnRegister(23120), Net_1.Net.UnRegister(17617), Net_1.Net.UnRegister(25417), EventSystem_1.EventSystem.Remove(EventDefine_1.EEventName.EntityOnLandedPush, CreatureController.EntityOnLandedPush), EventSystem_1.EventSystem.Remove(EventDefine_1.EEventName.TeleportComplete, CreatureController.tfr), EventSystem_1.EventSystem.Remove(EventDefine_1.EEventName.CreateEntityFail, CreatureController.OnCreateEntityFail), this.dva.OnClear(), !0)
    }
    static CreateEntityFromPending(e) {
        for (const r of ModelManager_1.ModelManager.CreatureModel.GetAllEntities()) r?.Valid && this.LoadEntityAsync(r, void 0, !0)
    }
    static ifr(r) {
        var e = MathUtils_1.MathUtils.LongToNumber(r.P4n),
            t = ModelManager_1.ModelManager.CreatureModel.GetEntity(e);
        if (t?.Valid)
            if (t.IsInit) {
                var o = t.Entity.GetComponent(159);
                if (o)
                    for (const a of r.zRs) o.AddBuffWithServerId(MathUtils_1.MathUtils.LongToBigInt(a.L6n), a.P6n, a.Ijn, a.Tjn, "服务端通知添加系统buff, serverId=" + a.Tjn);
                else Log_1.Log.CheckError() && Log_1.Log.Error("World", 20, "[CreatureController.AddSysBuffNotify] 添加Buff失败, Entity没有BuffComponent。", ["CreatureDataId", r.P4n], ["buff列表", r.zRs?.map(e => MathUtils_1.MathUtils.LongToBigInt(e.L6n))])
            } else {
                t = t.Entity.GetComponent(0);
                WaitEntityTask_1.WaitEntityTask.Create(t.GetCreatureDataId(), e => {
                    e || Log_1.Log.CheckError() && Log_1.Log.Error("World", 20, "WaitEntityTask 失败", ["CreatureDataId", r.P4n])
                })
            }
        else Log_1.Log.CheckError() && Log_1.Log.Error("World", 20, "[CreatureController.AddSysBuffNotify] 添加Buff失败, Entity不存在或无效。", ["CreatureDataId", e], ["buff列表", r.zRs.map(e => MathUtils_1.MathUtils.LongToBigInt(e.L6n)).join()])
    }
    static RemoveStandaloneEntity(e, r) {
        var t = ModelManager_1.ModelManager.CreatureModel.GetEntityById(e);
        t?.Valid && t.Entity.GetComponent(1)?.Owner && (t = ModelManager_1.ModelManager.CreatureModel.GetCreatureDataId(e), this.RemoveEntity(t, "RemoveStandaloneEntity", r))
    }
    static NotifyAddEntity(e, r, t) {
        return !r.Entity.GetComponent(0).GetRemoveState() && (GlobalData_1.GlobalData.BpEventManager.增加实体.Broadcast(r.Id, t), EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.AddEntity, e, r, t), ModelManager_1.ModelManager.CreatureModel.EntitiesSortedList.push(r), EntityHelper_1.EntitySystemHelper.IsSortDirty || (EntityHelper_1.EntitySystemHelper.IsSortDirty = !0), !0)
    }
    static NotifyRemoveEntity(e, r, t) {
        r?.Valid && (GlobalData_1.GlobalData.BpEventManager.删除实体.Broadcast(t), EventSystem_1.EventSystem.EmitWithTarget(r, EventDefine_1.EEventName.RemoveEntity, e, r), EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.RemoveEntity, e, r), EntityHelper_1.EntitySystemHelper.IsFilterDirty || (EntityHelper_1.EntitySystemHelper.IsFilterDirty = !0))
    }
    static RemoveEntity(e, r, t = Protocol_1.Aki.Protocol.bks.Proto_RemoveTypeForce) {
        var o = ModelManager_1.ModelManager.CreatureModel.RemoveDensityItem(e);
        if (o) {
            if (!o.EntityHandle) return o.DensityLevel <= this.jQs && Log_1.Log.CheckError() && Log_1.Log.Error("Entity", 6, "[实体生命周期:删除实体] DensityLevel和创建情况不匹配", ["CurrentLevel", this.jQs], ["SelfLevel", o.DensityLevel], ["CreatureDataId", o.CreatureDataId]), !0;
            o.DensityLevel > this.jQs && Log_1.Log.CheckError() && Log_1.Log.Error("Entity", 6, "[实体生命周期:删除实体] DensityLevel和创建情况不匹配2", ["CurrentLevel", this.jQs], ["SelfLevel", o.DensityLevel], ["CreatureDataId", o.CreatureDataId])
        }
        return this.rfr(e, r, t)
    }
    static rfr(e, r, t) {
        var o, a = ModelManager_1.ModelManager.CreatureModel.GetEntity(e);
        return a?(o = a.Entity.GetComponent(1), ModelManager_1.ModelManager.CreatureModel.EnableEntityLog && Log_1.Log.CheckInfo() && Log_1.Log.Info("Entity", 3, "[实体生命周期:删除实体] 删除实体", ["Context", r], ["CreatureDataId", e], ["RemoveType", t], ["ActorLocationProxy", o?.ActorLocationProxy]), a.Entity.GetComponent(0), PreloadDefine_1.PreloadSetting.UseNewPreload?PreloadControllerNew_1.PreloadControllerNew.RemoveEntity(e) : PreloadController_1.PreloadController.RemovePreloadEntity(e), this.WQs(a, e, t, r)) : (Log_1.Log.CheckError() && Log_1.Log.Error("Entity", 3, "[实体生命周期:删除实体] 删除实体失败,CreatureModel不存在该Id。", ["Context", r], ["CreatureDataId", e], ["RemoveType", t]), !1)
    }
    static WQs(e, r, t, o) {
        var a = ModelManager_1.ModelManager.CreatureModel;
        if (!e.Valid) return a.RemoveEntity(r, "RemoveEntityInternal handle.Valid=false");
        var l = e.Entity.GetComponent(0),
            n = (l.SetRemoveState(!0), this.dva.RemoveEntity(e), e.Entity.GetComponent(1)?.Owner);
        if (CreatureController.NotifyRemoveEntity(t, e, n), !e.IsInit) return CreatureController.DestroyEntity(e, t !== Protocol_1.Aki.Protocol.bks.Proto_RemoveTypeResetByModeChange), a.RemoveEntity(r, "RemoveEntityInternal handle.IsInit=false");
        if (l.GetEntityType() !== Protocol_1.Aki.Protocol.wks.Proto_Custom && !n?.IsValid()) return CreatureController.DestroyEntity(e, t !== Protocol_1.Aki.Protocol.bks.Proto_RemoveTypeResetByModeChange), a.RemoveEntity(r, "RemoveEntityInternal actor?.IsValid()=false");
        let i = t === Protocol_1.Aki.Protocol.bks.Proto_RemoveTypeForce;
        if (i = i || (t === Protocol_1.Aki.Protocol.bks.Proto_RemoveTypeNormal && l.GetEntityType() !== Protocol_1.Aki.Protocol.wks.Proto_Npc && l.GetEntityType() !== Protocol_1.Aki.Protocol.wks.Proto_SceneItem && l.GetEntityType() !== Protocol_1.Aki.Protocol.wks.Proto_Animal && (i = !0), e.Entity.Active)?i : !0) return CreatureController.DestroyEntity(e), a.RemoveEntity(r, "RemoveEntityInternal forceRemove=true");
        if (t === Protocol_1.Aki.Protocol.bks.Proto_RemoveTypeResetByModeChange) return CreatureController.DestroyEntity(e, !1), a.RemoveEntity(r, "RemoveEntityInternal RemoveTypeResetByModeChange");
        if (ModelManager_1.ModelManager.CreatureModel.EnableEntityLog && Log_1.Log.CheckInfo() && Log_1.Log.Info("Entity", 3, "[实体生命周期:删除实体] 延迟删除实体", ["Context", o], ["CreatureDataId", r], ["EntityId", e.Id], ["RemoveType", t]), this.AddDelayRemoveEntity(r, e), l.GetEntityType() === Protocol_1.Aki.Protocol.wks.Proto_Npc) e.Entity.GetComponent(170).HandlePendingDestroy();
        else {
            if (l.GetEntityType() === Protocol_1.Aki.Protocol.wks.Proto_Animal) {
                n = e.Entity.GetComponent(156);
                if (!n?.PendingDestroy) return EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.DelayRemoveEntityFinished, e.Entity), !0;
                n.HandlePendingDestroy()
            }
            t === Protocol_1.Aki.Protocol.bks.Proto_RemoveTypeDrop?(a = e.Entity.GetComponent(135)) && a.DestroyWithEffect() : l.GetEntityType() === Protocol_1.Aki.Protocol.wks.Proto_SceneItem && e.Entity.GetComponent(119).HandleDestroyState()
        }
        return !0
    }
    static SummonRequest(e, r, t, o, a, l = 0) {
        var n, i, _, C = SummonCfgById_1.configSummonCfgById.GetConfig(a);
        if (void 0 === C) Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.SummonRequest] 召唤表中找不到对应配置。", ["召唤表Id", a]);
        else if (ModelManager_1.ModelManager.CreatureModel.GetEntityTemplate(C.BlueprintType)) {
            if (ModelManager_1.ModelManager.CreatureModel.GetEntityModel(C.BlueprintType)) return n = (EntitySystem_1.EntitySystem.Get(o)?.GetComponent(0)).GetCreatureDataId(), i = CreatureController.GenUniqueId(), 0 < l?((_ = Protocol_1.Aki.Protocol.Lcs.create()).pKn = this.sfr(e, r, t, a, i), _.vKn = MathUtils_1.MathUtils.NumberToLong(n), _.G7n = l, CreatureController.Summon2RequestInternal(_, i, o)) : ((l = Protocol_1.Aki.Protocol.Ics.create()).pKn = this.sfr(e, r, t, a, i), l.vKn = MathUtils_1.MathUtils.NumberToLong(n), CreatureController.SummonRequestInternal(l, i)), i;
            Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.SummonRequest] 找不到新实体配置。", ["BlueprintType", C.BlueprintType])
        } else Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.SummonRequest] 不存在新实体配置。", ["BlueprintType", C.BlueprintType])
    }
    static sfr(e, r, t, o, a) {
        var l = Protocol_1.Aki.Protocol.ZFs.create(),
            e = (l.X4n = e, l.X8n = r, l.e8n = t.GetLocation(), Protocol_1.Aki.Protocol.S2s.create()),
            r = t.Rotator();
        return e.Pitch = r.Pitch, e.Roll = r.Roll, e.Yaw = r.Yaw, l.t8n = e, l.MKn = o, l.SKn = MathUtils_1.MathUtils.NumberToLong(a), l
    }
    static async SummonRequestInternal(e, r) {
        e = await Net_1.Net.CallAsync(7769, e);
        return e.O4n === Protocol_1.Aki.Protocol.O4n.NRs || (ModelManager_1.ModelManager.CreatureModel.RemovePreCreature(r), CreatureController.RemoveEntity(r, "SummonRequestInternal"), ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(e.O4n, 22908), !1)
    }
    static async Summon2RequestInternal(e, r, t) {
        e = await Net_1.Net.CallAsync(23067, e);
        return e.O4n !== Protocol_1.Aki.Protocol.O4n.NRs?(ModelManager_1.ModelManager.CreatureModel.RemovePreCreature(r), CreatureController.RemoveEntity(r, "Summon2RequestInternal"), ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(e.O4n, 20847), !1) : (EntitySystem_1.EntitySystem.Get(t).GetComponent(0).SetSummonsVersion(e.G7n), !0)
    }
    static async RemoveSummonEntityRequest(e, r, t) {
        var o = Protocol_1.Aki.Protocol.Zus.create(),
            t = (o.EKn = [ModelManager_1.ModelManager.CreatureModel.GetServerEntityId(t)], o.yKn = Protocol_1.Aki.Protocol.bks.Proto_RemoveTypeForce, o.X4n = e, o.FWn = ModelManager_1.ModelManager.CreatureModel.GetServerEntityId(r), await Net_1.Net.CallAsync(27868, o));
        return t.A9n === Protocol_1.Aki.Protocol.O4n.NRs || (ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(t.A9n, 29969), !1)
    }
    static async RemoveSummonEntityByServerIdRequest(e, r, t) {
        var o = ModelManager_1.ModelManager.CreatureModel.GetEntity(t)?.Entity?.GetComponent(0).GetEntityType(),
            a = Protocol_1.Aki.Protocol.Zus.create(),
            t = (a.EKn = [MathUtils_1.MathUtils.NumberToLong(t)], a.yKn = o && o === Protocol_1.Aki.Protocol.wks.Proto_SceneItem?Protocol_1.Aki.Protocol.bks.Proto_RemoveTypeNormal : Protocol_1.Aki.Protocol.bks.Proto_RemoveTypeForce, a.X4n = e, a.FWn = ModelManager_1.ModelManager.CreatureModel.GetServerEntityId(r), await Net_1.Net.CallAsync(27868, a));
        return t.A9n === Protocol_1.Aki.Protocol.O4n.NRs || (ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(t.A9n, 29969), !1)
    }
    static async ChangeEntityRoleRequest(e, r) {
        var t, o;
        return 0 === e?(Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.ChangeEntityRoleRequest] 实体ID无效。", ["EntityId", e]), !1) : (t = ModelManager_1.ModelManager.CreatureModel.GetCreatureDataId(e))?((o = Protocol_1.Aki.Protocol.tcs.create()).J4n = MathUtils_1.MathUtils.NumberToLong(t), o.q5n = r, !(!(r = await Net_1.Net.CallAsync(22317, o)) || (r.NRs?(o = ModelManager_1.ModelManager.CreatureModel.GetEntity(t))?(o.Entity.GetComponent(0).SetPlayerId(r.q5n), o.IsInit && (r = ModelManager_1.ModelManager.CreatureModel.GetPlayerId() === r.q5n, o.Entity.GetComponent(1).SetAutonomous(r)), 0) : (Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.ChangeEntityRoleRequest] 不存在实体Entity。", ["CreatureDataId", t]), 1) : (Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.ChangeEntityRoleRequest] 改变权限失败。", ["EntityId", e]), 1)))) : (Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.ChangeEntityRoleRequest] 实体ID无效。", ["EntityId", e], ["CreatureDataId", t]), !1)
    }
    static NotifySpawnBoss(e) {
        var r;
        e && (r = e.Entity.GetComponent(3)) && r.IsBoss && EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.SpawnBoss, e)
    }
    static afr(e) {
        var r = Protocol_1.Aki.Protocol.rcs.create();
        r.J4n = MathUtils_1.MathUtils.NumberToLong(e), Net_1.Net.Call(9433, r, () => {})
    }
    static async SceneLoadingFinishRequest(e) {
        Log_1.Log.CheckInfo() && Log_1.Log.Info("World", 5, "世界加载完成", ["SceneId", e]);
        var r = new Protocol_1.Aki.Protocol.jds,
            e = (r.IKn = e, await Net_1.Net.CallAsync(16245, r));
        e.O4n !== Protocol_1.Aki.Protocol.O4n.NRs && (ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(e.O4n, 18942), ModelManager_1.ModelManager.SceneTeamModel.ChangingRole = !1)
    }
    static AnimalDieRequest(e, r) {
        var t = Protocol_1.Aki.Protocol.ces.create();
        t.P4n = MathUtils_1.MathUtils.NumberToLong(e), t.e8n = Protocol_1.Aki.Protocol.Pks.create(), t.e8n.X = r.X, t.e8n.Y = r.Y, t.e8n.Z = r.Z, Net_1.Net.Call(3807, t, e => {
            e && e.O4n !== Protocol_1.Aki.Protocol.O4n.Proto_ErrAnimalEntityNotExist && e.O4n !== Protocol_1.Aki.Protocol.O4n.NRs && ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(e.O4n, 19807)
        })
    }
    static AnimalDropItemRequest(e) {
        var r = Protocol_1.Aki.Protocol.fes.create();
        r.P4n = MathUtils_1.MathUtils.NumberToLong(e), Net_1.Net.Call(23098, r, e => {
            e && e.O4n !== Protocol_1.Aki.Protocol.O4n.Proto_ErrAnimalEntityNotExist && e.O4n !== Protocol_1.Aki.Protocol.O4n.NRs && ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(e.O4n, 20198)
        })
    }
    static AnimalDestroyRequest(e) {
        var r = Protocol_1.Aki.Protocol.Ces.create();
        r.P4n = MathUtils_1.MathUtils.NumberToLong(e), Net_1.Net.Call(18988, r, e => {
            e && e.O4n !== Protocol_1.Aki.Protocol.O4n.Proto_ErrAnimalEntityNotExist && e.O4n !== Protocol_1.Aki.Protocol.O4n.NRs && ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(e.O4n, 17938)
        })
    }
    static LandingDamageRequest(e, r, t) {
        var o = Protocol_1.Aki.Protocol.gis.create();
        o.P4n = MathUtils_1.MathUtils.NumberToLong(e), o.TKn = r, o.LKn = t, Net_1.Net.Call(28127, o, e => {
            e && e.O4n !== Protocol_1.Aki.Protocol.O4n.NRs && ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(e.O4n, 13273)
        })
    }
    static AddPublicTags(e, r) {
        var t = EntitySystem_1.EntitySystem.Get(e);
        if (t) {
            var o = t.GetComponent(0);
            for (const a of r) o.AddPublicTags(a)
        } else Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.AddPublicTags] 不存Entity，添加公有标签失败。", ["EntityId", e])
    }
    static RemovePublicTags(e, r) {
        var t = EntitySystem_1.EntitySystem.Get(e);
        if (t) {
            var o = t.GetComponent(0);
            for (const a of r) o.RemovePublicTag(a)
        } else Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.RemovePublicTags] 不存在Entity,删除公有标签失败。", ["EntityId", e])
    }
    static async HardnessModeChangedRequest(e, r) {
        var e = ModelManager_1.ModelManager.CreatureModel.GetCreatureDataId(e),
            t = Protocol_1.Aki.Protocol.Scs.create();
        return t.P4n = MathUtils_1.MathUtils.NumberToLong(e), t.kWn = r, await Net_1.Net.CallAsync(23608, t), new Promise(e => {
            e(!0)
        })
    }
    static GenUniqueId() {
        var e = ModelManager_1.ModelManager.CreatureModel.GetPlayerId(),
            e = BigInt(e);
        return this.xe += increment, Number(e << playerBit | this.xe)
    }
    static ResumeId(e) {
        e?0n === (1n & e)?Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "服务恢复实体Id有问题。", ["LastId", e]) : this.xe = e & unitMax : this.xe = idDefaultValue
    }
    static async hfr(t) {
        var o = ModelManager_1.ModelManager.CreatureModel,
            a = ModelManager_1.ModelManager.GameModeModel;
        if (a.HasGameModeData) Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "未清理前一个场景的数据,就下发了JoinSceneNotify，服务器流程有问题");
        else {
            Log_1.Log.CheckInfo() && Log_1.Log.Info("World", 3, "[CreatureController.JoinSceneNotify] JoinSceneNotify"), Net_1.Net.PauseAllCallback(), await ModelManager_1.ModelManager.LoginModel.WaitLoginPromise(), LevelSequencePlayer_1.LevelSequencePlayer.SetBanned(!0), EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.ClearSceneBegin), await GlobalData_1.GlobalData.ClearSceneDone?.Promise, Log_1.Log.CheckInfo() && Log_1.Log.Info("World", 3, "[CreatureController.JoinSceneNotify] 场景清理完成"), Net_1.Net.ResumeAllCallback(), a.LoadingPhase = 2;
            var l = t.qRs,
                e = (a.JoinSceneInfo = l).n5n;
            if (o.LeavingLevel = !1, Log_1.Log.CheckInfo() && Log_1.Log.Info("World", 3, "[CreatureController.JoinSceneNotify] Begin", ["InstanceId", e]), o.SetIsLoadingScene(!0), ControllerHolder_1.ControllerHolder.GameModeController.SetGameModeData(e, l.m7n))
                if (CreatureController.ResumeId(MathUtils_1.MathUtils.LongToBigInt(t.GRs)), o.SetInstanceId(e), ModelManager_1.ModelManager.InstanceDungeonEntranceModel.InstanceId = e, o.InitEntityDataConfig(ModelManager_1.ModelManager.GameModeModel.InstanceDungeon.MapConfigId)) {
                    PublicUtil_1.PublicUtil.RegisterEditorLocalConfig(), o.InitDynamicEntityDataConfig(), o.SetWorldOwner(l.zys), o.SetSceneId(l.IKn);
                    t = l.MRs, t = (CreatureController.lfr(t.lDs), ModelManager_1.ModelManager.BlackboardModel.SetWorldBlackboardByProtocol(l.cIs), ModelManager_1.ModelManager.CombatMessageModel.SetLastMessageId(MathUtils_1.MathUtils.LongToBigInt(l.ARs)), Global_1.Global.BaseCharacter = void 0, l.vRs);
                    FormationDataController_1.FormationDataController.RefreshPlayerEntities(t);
                    let e = void 0,
                        r = void 0;
                    if (t) {
                        var n = new Array;
                        for (const g of t) {
                            var i = g.q5n,
                                _ = new ScenePlayerData_1.ScenePlayerData(i),
                                C = (_.SetTimerStart(), g.RVn),
                                s = new Array;
                            for (const y of g.CRs) {
                                var d = [];
                                for (const c of y.lRs) {
                                    var u = new SceneTeamData_1.SceneTeamRole;
                                    u.CreatureDataId = MathUtils_1.MathUtils.LongToNumber(c.P4n), u.RoleId = c.O6n, d.push(u), u.RoleId === C && _.ControlRole(u.CreatureDataId)
                                }
                                s.push({
                                    GroupType: y.ISs,
                                    GroupRoleList: d,
                                    CurrentRoleId: y.RVn,
                                    LivingState: ControllerHolder_1.ControllerHolder.SceneTeamController.GetLivingSate(y.HEs),
                                    IsRetain: y.dRs
                                })
                            }
                            n.push({
                                PlayerId: i,
                                CurrentGroupType: g.ISs,
                                Groups: s
                            }), o.AddScenePlayerData(g.q5n, _), g.q5n === ModelManager_1.ModelManager.PlayerInfoModel.GetId() && (CharacterBuffController_1.default.SetHandlePrefix(g.aRs, g.hRs), e = g.y5n, r = g.a8n)
                        }
                        ModelManager_1.ModelManager.SceneTeamModel.UpdateAllPlayerData(n)
                    }
                    ModelManager_1.ModelManager.OnlineModel.ResetContinuingChallengeConfirmState(), a.SetBornInfo(e, r), TimeOfDayController_1.TimeOfDayController.SyncSceneTime(l.ERs.XHn, l.ERs.$Hn, l.ERs.bRs), EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.InitArea, l.TRs), o.SetRestoreEntityId(l.LRs), ControllerHolder_1.ControllerHolder.GameAudioController.UpdateAudioState(l.TSs), ModelManager_1.ModelManager.BulletModel.SceneBulletOwnerId = MathUtils_1.MathUtils.LongToNumber(l.$ra), await ControllerHolder_1.ControllerHolder.GameModeController.Load(ModelManager_1.ModelManager.GameModeModel.JoinSceneInfo)
                } else Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.JoinSceneNotify] 初始化EntityDataConfig失败。", ["InstanceId", e]);
            else Log_1.Log.CheckInfo() && Log_1.Log.Info("World", 3, "[CreatureController.JoinSceneNotify] 设置GameModeData失败。", ["InstanceId", e])
        }
    }
    static LoadOrUnloadSubLevel(e) {
        if (e?.length) {
            var r = ModelManager_1.ModelManager.GameModeModel.SubLevelMap;
            const a = new Array,
                l = new Array;
            var t, o = new Set;
            if (e)
                for (const n of e) o.add(n), r.has(n) || l.push(n);
            for ([t] of r) o.has(t) || a.push(t);
            (a.length || l.length) && (ModelManager_1.ModelManager.GameModeModel.AddLoadMapHandle("LoadOrUnloadSubLevel"), e = new AsyncTask_1.AsyncTask("LoadOrUnloadSubLevel", async () => {
                const r = new CustomPromise_1.CustomPromise;
                return ControllerHolder_1.ControllerHolder.GameModeController.ChangeSubLevel(a, l, 0, void 0, void 0, e => {
                    e || Log_1.Log.CheckError() && Log_1.Log.Error("InstanceDungeon", 3, "加载或者卸载子关卡失败", ["unloads", a], ["newLoads", l]), ModelManager_1.ModelManager.GameModeModel.RemoveLoadMapHandle("LoadOrUnloadSubLevel"), e && ModelManager_1.ModelManager.GameModeModel.MapDone && CreatureController.CreateEntityFromPending(Protocol_1.Aki.Protocol.xks.Proto_Normal), r.SetResult(e)
                }), r.Promise
            }), TaskSystem_1.TaskSystem.AddTask(e), TaskSystem_1.TaskSystem.Run())
        }
    }
    static lfr(e) {
        for (const r of e) this.CreateEntity(r)
    }
    static NotifyScenePlayerChanged() {
        var e = ModelManager_1.ModelManager.CreatureModel.GetAllScenePlayers();
        EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.ScenePlayerChanged, e)
    }
    static CreateEntity(e, r = "Default") {
        ModMenu_1.MainMenu.KunLog("CreateEntity e: " + e.toString() + ",, j4n: " + e.J4n.toString())
        var t, o, a = MathUtils_1.MathUtils.LongToNumber(e.J4n),
            l = e.HHn;
        ModMenu_1.MainMenu.KunLog("CreateEntity a: " + a.toString())
        if (l === Protocol_1.Aki.Protocol.wks.Proto_Npc && ModelManager_1.ModelManager.CreatureModel.GetOrAddDensityItem(a, e).DensityLevel > this.jQs) return t = e.jHn, o = e._9n, void(ModelManager_1.ModelManager.CreatureModel.EnableEntityLog && Log_1.Log.CheckInfo() && Log_1.Log.Info("Entity", 6, "[实体生命周期:创建实体] CreateEntity(Density拦截)", ["CreatureDataId", a], ["ConfigType", t], ["PbDataId", o], ["EntityType", l], ["Context", r]));
        return this.KQs(a, e, r)
    }
    static KQs(r, t, o) {
        var a = ModelManager_1.ModelManager.CreatureModel,
            l = t.jHn,
            n = t._9n,
            i = t.pEs,
            _ = t.HHn,
            C = t.X8n;
        if (ModelManager_1.ModelManager.CreatureModel.EnableEntityLog && Log_1.Log.CheckInfo() && Log_1.Log.Info("Entity", 3, "[实体生命周期:创建实体] CreateEntity(开始)", ["CreatureDataId", r], ["ConfigType", l], ["PbDataId", n], ["PrefabId", i], ["IsVisible", C], ["Context", o]), a.ExistEntity(r)) Log_1.Log.CheckError() && Log_1.Log.Error("Entity", 3, "[实体生命周期:创建实体] 已经存在实体，创建实体失败。", ["CreatureDataId", r], ["ConfigType", l], ["PbDataId", n], ["PrefabId", i]);
        else if (Global_1.Global.WorldEntityHelper) {
            var s = new CreateEntityData_1.CreateEntityData;
            s.Init(t);
            let e = void 0;
            switch (_) {
                case Protocol_1.Aki.Protocol.wks.Proto_Monster:
                case Protocol_1.Aki.Protocol.wks.Proto_Animal:
                case Protocol_1.Aki.Protocol.wks.Proto_Npc:
                case Protocol_1.Aki.Protocol.wks.Proto_SceneItem:
                case Protocol_1.Aki.Protocol.wks.Proto_Custom:
                case Protocol_1.Aki.Protocol.wks.Proto_Vision:
                case Protocol_1.Aki.Protocol.wks.Proto_Player:
                    e = Global_1.Global.WorldEntityHelper.CreateWorldEntity(s);
                    break;
                default:
                    return void(Log_1.Log.CheckError() && Log_1.Log.Error("Entity", 3, "[实体生命周期:创建实体] 下发了不支持的实体类型, 创建实体失败。", ["CreatureDataId", r], ["ConfigType", l], ["PbDataId", n], ["PrefabId", i], ["EntityType", _]))
            }
            if (e?.Valid) {
                if (a.AddEntity(r, e), CharacterController_1.CharacterController.InitData(e, e.Entity, s)) return CreatureController.SetEntityEnable(e.Entity, C, "CreatureController.CreateEntity"), a.AddLoadingEntity(e), a.AddOwnerEntityInfo(r), o = e.Entity.GetComponent(0), a.CheckSetPrefabEntity(e), ModelManager_1.ModelManager.CreatureModel.EnableEntityLog && Log_1.Log.CheckInfo() && Log_1.Log.Info("Entity", 3, "[实体生命周期:创建实体] 实体详细数据。", ["CreatureDataId", r], ["EntityId", e.Id], ["ConfigType", l], ["EntityType", o.GetEntityType()], ["PbDataId", n], ["PrefabId", i], ["ModelId", o.GetModelId()], ["ModelBlueprintPath", o.ModelBlueprintPath], ["Visible", o.GetVisible()], ["PlayerId", o.GetPlayerId()], ["OwnerId", o.GetOwnerId()], ["Location", o.GetLocation()], ["Rotation", o.GetRotation()]), EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.CreateEntity, o, e), e;
                Log_1.Log.CheckError() && Log_1.Log.Error("Entity", 3, "[实体生命周期:创建实体] InitData失败，创建实体失败。", ["CreatureDataId", r], ["ConfigType", l], ["PbDataId", n], ["PrefabId", i]), a.RemoveEntity(r, "CreateEntity执行InitData失败"), CharacterController_1.CharacterController.Destroy(e)
            } else Log_1.Log.CheckError() && Log_1.Log.Error("Entity", 3, "[实体生命周期:创建实体] entity.Valid=false，创建实体失败。", ["CreatureDataId", r], ["ConfigType", l], ["PbDataId", n], ["PrefabId", i])
        } else Log_1.Log.CheckError() && Log_1.Log.Error("Entity", 3, "[实体生命周期:创建实体] WorldEntityHelper不存在，创建实体失败。", ["CreatureDataId", r], ["ConfigType", l], ["PbDataId", n], ["PrefabId", i])
    }
    static DestroyEntity(e, r = !0) {
        var t, o, a;
        e?.Valid && (t = (a = e.Entity).GetComponent(0), ModelManager_1.ModelManager.CreatureModel.EnableEntityLog && Log_1.Log.CheckInfo() && Log_1.Log.Info("Entity", 3, "[实体生命周期:删除实体] DestroyEntity开始", ["CreatureDataId", t.GetCreatureDataId()], ["EntityId", e.Id], ["PendingRemove", r]), (o = a.GetComponent(1)?.Owner)?.IsValid() && Global_1.Global.BaseCharacter === o && Global_1.Global.CharacterController && (Global_1.Global.CharacterController.UnPossess(), Global_1.Global.BaseCharacter = void 0), a.GetComponent(98)?.DisableTickWithLog("[CreatureController.DestroyEntity]"), o?.IsValid() && (o instanceof TsBaseCharacter_1.default && o.CharacterActorComponent?(o.CharacterActorComponent.DisableCollision("[CreatureController.DestroyEntity]"), o.CharacterActorComponent.DisableActor("[CreatureController.DestroyEntity]")) : o instanceof UE.BP_BaseItem_C?a?.Disable("DestroyEntity") : (o.SetActorEnableCollision(!1), o.SetActorTickEnabled(!1), o.SetActorHiddenInGame(!0))), r?ModelManager_1.ModelManager.CreatureModel.AddPendingRemoveEntity(t.GetCreatureDataId(), e) : (a = t.GetCreatureDataId(), Global_1.Global.WorldEntityHelper?((r = Global_1.Global.WorldEntityHelper.Destroy(e))?ModelManager_1.ModelManager.WorldModel.AddDestroyActor(a, e.Id, o) : ControllerHolder_1.ControllerHolder.WorldController.DestroyEntityActor(a, e.Id, o, !1), ModelManager_1.ModelManager.CreatureModel.EnableEntityLog && Log_1.Log.CheckInfo() && Log_1.Log.Info("Entity", 3, "[实体生命周期:删除实体] DestroyEntity结束", ["CreatureDataId", a], ["EntityId", e.Id], ["EntitySystem.DestroyEntity结果", r])) : Log_1.Log.CheckError() && Log_1.Log.Error("Entity", 3, "[实体生命周期:删除实体] WorldEntityHelper不存在，删除实体失败。", ["CreatureDataId", a], ["EntityId", e.Id])))
    }
    static LoadEntityAsync(t, o, e = !1) {
        var r, a = this.Cva(t, o);
        a && (r = (e, r) => {
            r?this.ufr(t, o) && this.cfr(t, o) : o?.(e)
        }, e?this.gva(t, r, !1) : this.dva.QueueToInvoke(t, r, a.GetCreatureDataId(), a.GetPbDataId()))
    }
    static Cva(e, r) {
        if (e?.Valid) {
            var t = e.Entity.GetComponent(0);
            if (t.GetRemoveState()) r?.(3);
            else {
                if (!e.IsInit) return t;
                r?.(2)
            }
        } else Log_1.Log.CheckError() && Log_1.Log.Error("Entity", 3, "[实体生命周期:创建实体] entity.Valid=false，创建实体失败。"), r?.(1)
    }
    static gva(t, o, e) {
        let a = void 0;
        if (!e || (a = this.Cva(t, o))) {
            const l = a = a || t.Entity.GetComponent(0);
            let r = void 0;
            ModelManager_1.ModelManager.PreloadModel.UseEntityProfilerInternal && (r = new LogProfiler_1.LogProfiler("预加载实体Profiler:" + l.GetCreatureDataId())).Start();
            const n = e => {
                Log_1.Log.CheckInfo() && Log_1.Log.Info("Preload", 3, "预加载实体:结束", ["CreatureDataId", l.GetCreatureDataId()], ["PbDataId", l.GetPbDataId()], ["是否成功", 2 === e], ["预加载结果", e]), ModelManager_1.ModelManager.PreloadModel.UseEntityProfilerInternal && (r.Stop(), Log_1.Log.CheckInfo()) && Log_1.Log.Info("Preload", 3, r.ToString()), !t?.Valid || l.GetRemoveState()?o?.(3) : o?.(e, !0)
            };
            if (PreloadDefine_1.PreloadSetting.UseNewPreload) {
                if (l.GetPreloadFinished()) return n(2), !0;
                if (l.GetLoading()) return ModelManager_1.ModelManager.PreloadModelNew.GetEntityAssetElement(l.GetCreatureDataId())?.AddCallback(n), !0
            } else if (l.GetLoading()) return !1;
            l.SetLoading(!0), Log_1.Log.CheckInfo() && Log_1.Log.Info("Preload", 3, "预加载实体:开始", ["CreatureDataId", l.GetCreatureDataId()], ["PbDataId", l.GetPbDataId()], ["Reason", "CreatureController.LoadEntityAsync"]), PreloadDefine_1.PreloadSetting.UseNewPreload?PreloadControllerNew_1.PreloadControllerNew.PreloadEntity(t, r, n) : PreloadController_1.PreloadController.PreloadEntity(t, r, e => {
                e = e?2 : 1;
                n(e)
            })
        }
        return !0
    }
    static ufr(a, l) {
        const n = a.Entity.GetComponent(0).GetDependenceEntities();
        return !n?.length || (WaitEntityPreloadTask_1.WaitEntityPreloadTask.Create(a, e => {
            if (!(4 & e) && a?.Valid) {
                e = a.Entity.GetComponent(0);
                if (!e.GetRemoveState()) {
                    var r, t, o = a.Priority + 1;
                    for ([r, t] of n) {
                        let e = void 0;
                        0 === t?e = ModelManager_1.ModelManager.CreatureModel.GetEntity(r) : 1 === t?e = ModelManager_1.ModelManager.CreatureModel.GetEntityByPbDataId(r) : 2 === t && (e = ModelManager_1.ModelManager.CreatureModel.GetEntityById(r)), e?.Valid && e.Priority < o && (e.Priority = o, 2 & e.Entity.Flag || CharacterController_1.CharacterController.SortItem(e))
                    }
                    this.cfr(a, l)
                }
            }
        }), !1)
    }
    static cfr(r, t) {
        if (r?.Valid) {
            const o = r.Entity.GetComponent(0);
            o.GetRemoveState()?t?.(3) : CharacterController_1.CharacterController.AddEntityToAwakeQueue(r, e => {
                e?o.GetRemoveState()?t?.(3) : CreatureController.mfr(r, e => {
                    e?o.GetRemoveState()?t?.(3) : (CharacterController_1.CharacterController.ActivateEntity(r), CreatureController.dfr(r)?t?.(2) : t?.(1)) : t?.(1)
                }) : t?.(1)
            })
        } else t?.(3)
    }
    static mfr(n, i) {
        if (GlobalData_1.GlobalData.Networking()) {
            const _ = n.Entity.GetComponent(0);
            switch (_.GetEntityType()) {
                case Protocol_1.Aki.Protocol.wks.Proto_Custom:
                case Protocol_1.Aki.Protocol.wks.Proto_SceneItem:
                case Protocol_1.Aki.Protocol.wks.Proto_Animal:
                    return void(i && i(!0))
            }
            var e = Protocol_1.Aki.Protocol.les.create();
            const C = _.GetCreatureDataId();
            e.P4n = MathUtils_1.MathUtils.NumberToLong(C), ModelManager_1.ModelManager.CreatureModel.EnableEntityLog && Log_1.Log.CheckInfo() && Log_1.Log.Info("Entity", 3, "[实体生命周期:创建实体] 请求Activate实体", ["CreatureDataId", C], ["PbDataId", _.GetPbDataId()], ["EntityId", n.Id]), Net_1.Net.Call(14690, e, e => {
                let r = !1;
                if (e)
                    if (e.O4n !== Protocol_1.Aki.Protocol.O4n.NRs) r = !0, ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(e.O4n, 28302, void 0, !1, !0);
                    else {
                        CreatureController.SetEntityEnable(n.Entity, e.X8n, "EntityActiveResponse");
                        var t = WorldGlobal_1.WorldGlobal.ToUeVector(e.e8n),
                            o = WorldGlobal_1.WorldGlobal.ToUeRotator(e.t8n);
                        n.Entity.GetComponent(1).SetActorLocationAndRotation(t, o, "ActivateEntityRequest");
                        for (const l of e.jEs) {
                            var a = l.h3s;
                            _.ComponentDataMap.set(a, l)
                        }
                    }
                else r = !0;
                ModelManager_1.ModelManager.CreatureModel.GetEntityId(C) !== n.Id?Log_1.Log.CheckWarn() && Log_1.Log.Warn("Entity", 3, "[实体生命周期:创建实体] 激活实体时，实体已经销毁", ["CreatureDataId", C], ["EntityConfigType", _.GetEntityConfigType()], ["PbDataId", _.GetPbDataId()]) : (r && Log_1.Log.CheckError() && Log_1.Log.Error("Entity", 3, "[实体生命周期:创建实体] 激活实体消息异常，创建实体失败。", ["CreatureDataId", C], ["EntityConfigType", _.GetEntityConfigType()], ["PbDataId", _.GetPbDataId()]), ModelManager_1.ModelManager.CreatureModel.EnableEntityLog && Log_1.Log.CheckInfo() && Log_1.Log.Info("Entity", 3, "[实体生命周期:创建实体] 服务器返回Activate实体成功", ["CreatureDataId", C], ["PbDataId", _.GetPbDataId()], ["EntityId", n.Id]), i && i(!0))
            })
        } else i && i(!0)
    }
    static dfr(e) {
        var r = e.Entity.GetComponent(0),
            t = (r.SetLoading(!1), e.Entity.GetComponent(1)?.Owner);
        return r.GetEntityType() === Protocol_1.Aki.Protocol.wks.Proto_Custom || t?(ModelManager_1.ModelManager.CreatureModel.EnableEntityLog && Log_1.Log.CheckInfo() && Log_1.Log.Info("Entity", 3, "[实体生命周期:创建实体] 实体创建成功", ["CreatureDataId", r.GetCreatureDataId()], ["EntityId", e.Id], ["PbDataId", r.GetPbDataId()], ["Entity.Active", e.Entity.Active]), CreatureController.SetEntityEnable(e.Entity, r.GetVisible(), "CreatureController.AfterEntityActivate"), CreatureController.NotifyAddEntity(Protocol_1.Aki.Protocol.xks.Proto_Normal, e, t) && (CreatureController.NotifySpawnBoss(e), r.IsRole()) && ModelManager_1.ModelManager.WorldModel.AddIgnore(t), !0) : (Log_1.Log.CheckError() && Log_1.Log.Error("Entity", 3, "[实体生命周期:创建实体] actor无效，注意检查前面的组件的报错，创建实体失败。", ["CreatureDataId", r.GetCreatureDataId()], ["EntityId", e.Id], ["PbDataId", r.GetPbDataId()]), !1)
    }
    static LoadActorByModelConfig(e, r) {
        var t = e.蓝图?.ToAssetPathName();
        if (t && t.length && "None" !== t) {
            var t = ResourceSystem_1.ResourceSystem.GetLoadedAsset(e.蓝图.ToAssetPathName(), UE.Class);
            if (t?.IsValid()) return (t = ActorSystem_1.ActorSystem.Get(t, r))?.IsValid() && (t.SetActorHiddenInGame(!0), t.SetActorTickEnabled(!1), t.SetActorEnableCollision(!1)), t
        } else Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.LoadActorByModelConfig] 加载Actor失败，因为模型的蓝图没有设置。", ["ModelId", e.ID])
    }
    static LoadAndChangeMeshAnim(e, r, t) {
        var r = r.ToAssetPathName(),
            r = (r?.length && "None" !== r && (r = ResourceSystem_1.ResourceSystem.GetLoadedAsset(r, UE.SkeletalMesh)) && e.SkeletalMesh !== r && e.SetSkeletalMesh(r), t.ToAssetPathName());
        r?.length && "None" !== r && (t = ResourceSystem_1.ResourceSystem.GetLoadedAsset(r, UE.Class)) && e.AnimClass !== t && e.SetAnimClass(t)
    }
    static ChangeMeshAnim(e, r, t) {
        e.SetSkeletalMesh(r), e.SetAnimClass(t)
    }
    static OnLeaveLevel() {
        var e = ModelManager_1.ModelManager.CreatureModel,
            r = e.GetPlayerId();
        if (0 !== r) {
            e.LeavingLevel = !0, Log_1.Log.CheckInfo() && Log_1.Log.Info("World", 3, "[CreatureController.OnLeaveLevel] OnLeaveLevel 开始"), ModelManager_1.ModelManager.SeamlessTravelModel.IsSeamlessTravel || CameraController_1.CameraController.FightCamera.LogicComponent.SetCharacter(void 0), ConfigManager_1.ConfigManager.WorldConfig.ClearCommonSkillData();
            try {
                var t = e.GetAllEntities();
                for (const l of e.DelayRemoveContainer.GetAllEntities()) CreatureController.DestroyEntity(l, !1);
                for (let e = t.length - 1; 0 <= e; e--) {
                    var o = t[e],
                        a = o.Entity.GetComponent(0);
                    ModelManager_1.ModelManager.SeamlessTravelModel.IsSeamlessTravel && a.IsRole() && o.Entity.GetComponent(3)?.Actor === Global_1.Global.BaseCharacter?SeamlessTravelController_1.SeamlessTravelController.SetSeamlessTravelPlayerEntity(o) : CreatureController.RemoveEntity(a.GetCreatureDataId(), "OnLeaveLevel") || Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.ClearWorldData] 销毁实体失败。", ["CreatureDataId", a.GetCreatureDataId()], ["实体类型", a.GetEntityType()])
                }
                ControllerHolder_1.ControllerHolder.WorldController.DoLeaveLevel(), ModelManager_1.ModelManager.AttachToActorModel.ClearEntityActor("CreatureController.OnLeaveLevel")
            } catch (e) {
                e instanceof Error?Log_1.Log.CheckError() && Log_1.Log.ErrorWithStack("World", 3, "[CreatureController.ClearWorldData] 销毁实体异常。", e, ["error", e.message]) : Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.ClearWorldData] 销毁实体异常。", ["error", e])
            }
            e.LeavingLevel = !1, Log_1.Log.CheckInfo() && Log_1.Log.Info("World", 3, "[CreatureController.OnLeaveLevel] OnLeaveLevel 结束")
        }
        return !0
    }
    static ChangeLockTagByCreatureGenId(e, r) {
        var t;
        for (const o of ModelManager_1.ModelManager.CreatureModel.GetAllEntities()) o.IsInit && o.Entity.GetComponent(0).GetOwnerId() === e && (t = o.Entity.GetComponent(94)) && t.ChangeLockTag(r)
    }
    static ChangeLockTagByTeleportPbDataId(e, r) {
        var t;
        for (const o of ModelManager_1.ModelManager.CreatureModel.GetAllEntities()) o.IsInit && o.Entity.GetComponent(0).GetPbDataId() === e && (t = o.Entity.GetComponent(94)) && t.ChangeLockTag(r)
    }
    static LoadActorByPbModelConfig(e, r) {
        var t = UE.KismetSystemLibrary.Conv_SoftClassPathToSoftClassRef(UE.KismetSystemLibrary.MakeSoftObjectPath(e.BluePrintClass));
        if (t) return t = ResourceSystem_1.ResourceSystem.GetLoadedAsset(t.ToAssetPathName(), UE.Class), (t = ActorSystem_1.ActorSystem.Get(t, r))?.IsValid() && (t.SetActorHiddenInGame(!0), t.SetActorTickEnabled(!1), t.SetActorEnableCollision(!1)), t;
        Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.LoadActorByModelConfig] 加载Actor失败，因为模型的蓝图没有设置。", ["BluePrintId", e.BluePrintId])
    }
    static AddDelayRemoveEntity(e, r) {
        var t = ModelManager_1.ModelManager.CreatureModel;
        t.AddDelayRemoveEntity(e, r)?t.RemoveEntity(e, "AddDelayRemoveEntity 加入延迟删除列表") : Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.AddPendingRemoveEntity] 实体添加到PendingRemoveEntityMap列表失败。", ["CreatureDataId", e])
    }
    static CheckDelayRemove(e, r, t) {
        var o = ModelManager_1.ModelManager.CreatureModel;
        let a = o.GetEntityWithDelayRemoveContainer(e);
        return !!(a = a || r !== Protocol_1.Aki.Protocol.YTs.P6n?a : o.DelayRemoveContainer.GetEntityByPbDataId(t))?.Valid && (o.RemoveDelayRemoveEntity(a.CreatureDataId), CreatureController.DestroyEntity(a, !1), !0)
    }
    static CheckPendingRemove(e, r, t) {
        var o = ModelManager_1.ModelManager.CreatureModel;
        let a = o.GetPendingRemoveEntity(e);
        return !!(a = a || r !== Protocol_1.Aki.Protocol.YTs.P6n?a : o.GetPendingRemoveEntityByPbDataId(t))?.Valid && (o.RemovePendingRemoveEntity(a.CreatureDataId), CreatureController.DestroyEntity(a, !1), !0)
    }
    static EntityLogicToEntityType(e) {
        switch (e) {
            case "Item":
                return Protocol_1.Aki.Protocol.wks.Proto_SceneItem;
            case "Npc":
                return Protocol_1.Aki.Protocol.wks.Proto_Npc;
            case "Monster":
                return Protocol_1.Aki.Protocol.wks.Proto_Monster;
            case "Vision":
                return Protocol_1.Aki.Protocol.wks.Proto_Vision;
            default:
                return Protocol_1.Aki.Protocol.wks.Proto_Custom
        }
    }
    static async SwitchBigWorldRequest(e, r) {
        var t = Protocol_1.Aki.Protocol.Gds.create(),
            e = (t.X5n = e, t.a5n = r, await Net_1.Net.CallAsync(25068, t));
        return !!e
    }
    static MonsterBoomRequest(e, r) {
        CombatMessage_1.CombatNet.Call(4289, e, Protocol_1.Aki.Protocol.Y3n.create({
            DKn: r
        }))
    }
    static ParseTravelConfig(e, r, t) {
        var o = new SeamlessTravelDefine_1.SeamlessTravelContext;
        switch (e) {
            case Protocol_1.Aki.Protocol.l5n.Proto_PlayEffect:
                o.EffectPath = r, SeamlessTravelController_1.SeamlessTravelController.EnableSeamlessTravel(Global_1.Global.BaseCharacter, Global_1.Global.CharacterController, o);
                break;
            case Protocol_1.Aki.Protocol.l5n.Proto_PlayMp4:
                ControllerHolder_1.ControllerHolder.GameModeController.SetTravelMp4(!0, r);
                break;
            case Protocol_1.Aki.Protocol.l5n.Proto_CenterText:
                ModelManager_1.ModelManager.GameModeModel.ShowCenterTextFlow = t, ModelManager_1.ModelManager.GameModeModel.UseShowCenterText = !0
        }
    }
    static SetEntityEnable(e, r, t, o = !1) {
        var a;
        e?.Valid && !r != !!(a = ModelManager_1.ModelManager.CreatureModel.EntityDisableHandleMap.get(e.Id)) && (Log_1.Log.CheckDebug() && Log_1.Log.Debug("Entity", 29, "CreatureController.SetEntityEnable", ["Enable", r], ["EntityId", e.Id], ["Reason", t]), ModelManager_1.ModelManager.CreatureModel.DisableLock.has(e.Id)?Log_1.Log.CheckInfo() && Log_1.Log.Info("Entity", 29, "递归设置EntityEnable") : (ModelManager_1.ModelManager.CreatureModel.DisableLock.add(e.Id), e.GetComponent(0).SetVisible(r), r?(e.Enable(a, "CreatureController.SetEntityEnable"), ModelManager_1.ModelManager.CreatureModel.EntityDisableHandleMap.delete(e.Id)) : (a = e.Disable(t), ModelManager_1.ModelManager.CreatureModel.EntityDisableHandleMap.set(e.Id, a)), ModelManager_1.ModelManager.CreatureModel.DisableLock.delete(e.Id), o && CreatureController.Cfr(e, r)))
    }
    static SetActorVisible(e, r, t, o, a, l = !1) {
        var n, i;
        e?.Valid && (n = e.GetComponent(1), i = e.GetComponent(91), Log_1.Log.CheckDebug() && Log_1.Log.Debug("Entity", 29, "CreatureController.SetActorVisible", ["Visible", r], ["EntityId", e.Id], ["Reason", a]), n.SetActorVisible(r, a), n.SetCollisionEnable(t, a), i?.SetIsInGame(r), this.SetActorMovable(e, o, a), l) && CreatureController.gfr(e, r)
    }
    static SetActorMovable(e, r, t) {
        var o, a = e.GetComponent(100),
            l = e.GetComponent(101);
        a && l && !r != !!(o = ModelManager_1.ModelManager.CreatureModel.ActorMovableHandleMap.get(e.Id)) && (r?(a.Enable(o[0], t), l.Enable(o[1], t), ModelManager_1.ModelManager.CreatureModel.ActorMovableHandleMap.delete(e.Id)) : (o = [a.Disable(t), l.Disable(t)], ModelManager_1.ModelManager.CreatureModel.ActorMovableHandleMap.set(e.Id, o)))
    }
    static Cfr(e, r) {
        var t = e.GetComponent(0),
            o = Protocol_1.Aki.Protocol.R3n.create();
        o.J4n = MathUtils_1.MathUtils.NumberToLong(t.GetCreatureDataId()), o.X8n = r, CombatMessage_1.CombatNet.Call(12630, e, o, () => {})
    }
    static gfr(e, r) {
        var t, o;
        ModelManager_1.ModelManager.GameModeModel.IsMulti && (t = e.GetComponent(0), (o = Protocol_1.Aki.Protocol.d4n.create()).J4n = MathUtils_1.MathUtils.NumberToLong(t.GetCreatureDataId()), o.$8n = r, CombatMessage_1.CombatNet.Call(8538, e, o, () => {}))
    }
    static RefreshDensityLevel() {
        var e = GameQualitySettingsManager_1.GameQualitySettingsManager.Get().GetCurrentQualityInfo().NpcDensity;
        if (this.jQs !== e) {
            for (var r, t, o, a = ModelManager_1.ModelManager.CreatureModel; this.jQs < e;) {
                ++this.jQs;
                for ([r, t] of a.GetDensityLevelGroup(this.jQs)) {
                    var l = this.KQs(r, t.EntityData, "Density");
                    l && (ControllerHolder_1.ControllerHolder.CreatureController.LoadEntityAsync(l), AoiController_1.AoiController.AddMonsterSizeTag(l))
                }
            }
            for (; this.jQs > e;) {
                for ([o] of a.GetDensityLevelGroup(this.jQs)) this.rfr(o, "DensityLevelChanged", Protocol_1.Aki.Protocol.bks.Proto_RemoveTypeForce);
                --this.jQs
            }
        }
    }
}
exports.CreatureController = CreatureController, (_a = CreatureController).xe = idDefaultValue, CreatureController.ofr = void 0, CreatureController.nfr = void 0, CreatureController.jQs = 2, CreatureController.ffr = [], CreatureController.O0r = e => {
    ModelManager_1.ModelManager.GameModeModel.IsTeleport?CreatureController.ffr.push(e) : CreatureController.ifr(e)
}, CreatureController.tfr = () => {
    for (const e of CreatureController.ffr) CreatureController.ifr(e);
    CreatureController.ffr = []
}, CreatureController.k0r = e => {
    var r = ModelManager_1.ModelManager.CreatureModel.GetEntity(MathUtils_1.MathUtils.LongToNumber(e.P4n));
    if (r?.Valid) {
        var t = r.Entity.GetComponent(159);
        t || Log_1.Log.CheckError() && Log_1.Log.Error("World", 20, "[CreatureController.UpdateSysBuffNotify] 更新Buff失败, Entity没有AbilityComponent。", ["CreatureDataId", e.P4n]);
        for (const l of e.zRs) {
            var o = MathUtils_1.MathUtils.LongToBigInt(l.L6n),
                a = l.Tjn;
            t?.RemoveBuffByServerIdLocal(a, "刷新系统buff, serverId=" + a), t?.AddBuffWithServerId(o, l.P6n, l.Ijn, a, "刷新系统buff, serverId=" + a)
        }
    } else Log_1.Log.CheckError() && Log_1.Log.Error("World", 20, "[CreatureController.UpdateSysBuffNotify] 更新Buff失败, Entity无效或不存在。", ["CreatureDataId", e.P4n])
}, CreatureController.F0r = e => {
    var r = ModelManager_1.ModelManager.CreatureModel.GetEntity(MathUtils_1.MathUtils.LongToNumber(e.P4n));
    if (r?.Valid) {
        var t = r.Entity.GetComponent(159);
        if (t || Log_1.Log.CheckError() && Log_1.Log.Error("World", 20, "[CreatureController.RemoveSysBuffNotify] 移除Buff失败, Entity没有AbilityComponent。", ["CreatureDataId", e.P4n]), r.IsInit)
            for (const o of e.IVn) t?.RemoveBuffByServerIdLocal(o, "服务端移除系统buff, serverId=" + o)
    } else Log_1.Log.CheckError() && Log_1.Log.Error("World", 20, "[CreatureController.RemoveSysBuffNotify] 移除Buff失败, Entity无效或不存在。", ["CreatureDataId", e.P4n])
}, CreatureController.V0r = e => {
    BattleLogicController_1.BattleLogicController.ExecuteEntityLivingStatusNotify(e)
}, CreatureController.j0r = e => {
    for (const o of e.FRs) {
        var r = ModelManager_1.ModelManager.CreatureModel.GetEntity(MathUtils_1.MathUtils.LongToNumber(o.J4n));
        if (!r?.Valid) return void(Log_1.Log.CheckWarn() && Log_1.Log.Warn("World", 20, "[CreatureController.MonsterAttributeArrayNotify] 更新Monster属性失败, Entity无效或不存在。", ["CreatureDataId", o.J4n]));
        var t = r.Entity.GetComponent(158);
        if (t)
            for (const a of Object.keys(o.PSs)) t.SetBaseValue(Number(a), o.PSs[a])
    }
}, CreatureController.x0r = e => {
    var r = MathUtils_1.MathUtils.LongToNumber(e.P4n),
        r = ModelManager_1.ModelManager.CreatureModel.GetEntity(r),
        t = MathUtils_1.MathUtils.LongToNumber(e.j5n);
    r.Entity.GetComponent(35)?.SetVisionSkillInformationList(e.hIs, t), r.Entity.GetComponent(0).VisionSkillServerEntityId = t, EventSystem_1.EventSystem.EmitWithTarget(r, EventDefine_1.EEventName.EntityVisionSkillChanged)
}, CreatureController.w0r = e => {
    var r, t = MathUtils_1.MathUtils.LongToNumber(e.J4n),
        o = ModelManager_1.ModelManager.CreatureModel.GetEntity(t);
    o?(r = o.Entity.GetComponent(0), e.q5n && r.SetPlayerId(e.q5n), e.q5n === ModelManager_1.ModelManager.CreatureModel.GetPlayerId() && ((r = o.Entity.GetComponent(3).Actor)?r.Kuro_SetRole(2) : Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "ChangeEntityRoleNotify,actor无效。", ["CreatureDataId", t]))) : Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.ChangeEntityRoleNotify] 不存在Entity。", ["CreatureDataId", t])
}, CreatureController.EntityOnLandedPush = e => {
    e = ModelManager_1.ModelManager.CreatureModel.GetCreatureDataId(e.Id);
    CreatureController.afr(e)
}, CreatureController.EntityOnLandedNotify = e => {
    var r, e = MathUtils_1.MathUtils.LongToNumber(e.J4n);
    ModelManager_1.ModelManager.CreatureModel.ExistEntity(e)?(r = ModelManager_1.ModelManager.CreatureModel.GetEntity(e))?.Valid && EventSystem_1.EventSystem.EmitWithTarget(r, EventDefine_1.EEventName.CharOnLand) : Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.EntityOnLandedNotify] 不存在动态实体。", ["CreatureDataId", e])
}, CreatureController.P0r = e => {
    var r = ModelManager_1.ModelManager.CreatureModel.GetPlayerId(),
        t = e.h5n,
        o = e.q5n;
    Log_1.Log.CheckInfo() && Log_1.Log.Info("World", 17, "[CreatureController.LeaveSceneNotify] LeaveSceneNotify", ["leavePlayerId", o], ["myPlayerId]", r], ["option", t]), o !== r?(ModelManager_1.ModelManager.CreatureModel.RemoveScenePlayerData(o), CreatureController.NotifyScenePlayerChanged(), ModelManager_1.ModelManager.OnlineModel.RemovePlayerDisableHandles(o), EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.ScenePlayerLeaveScene, e.q5n)) : ModelManager_1.ModelManager.GameModeModel.HasGameModeData?(ModelManager_1.ModelManager.GameModeModel.HasGameModeData = !1, ModelManager_1.ModelManager.GameModeModel.JoinSceneInfo = void 0, o === r && (ModelManager_1.ModelManager.CreatureModel.GetIsLoadingScene()?Log_1.Log.CheckWarn() && Log_1.Log.Warn("World", 17, "[CreatureController.LeaveSceneNotify] 场景加载中") : (ControllerHolder_1.ControllerHolder.GameModeController.IsInInstance() && EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.LeaveInstanceDungeon), t && CreatureController.ParseTravelConfig(e.h5n.l5n, e.h5n.d5n, e.h5n.m5n), ModelManager_1.ModelManager.SeamlessTravelModel.IsSeamlessTravel?SeamlessTravelController_1.SeamlessTravelController.PreLeaveLevel() : ModelManager_1.ModelManager.GameModeModel.UseShowCenterText || BlackScreenController_1.BlackScreenController.AddBlackScreen("None", "LeaveScene"), EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.DoLeaveLevel), ModelManager_1.ModelManager.SeamlessTravelModel.IsSeamlessTravel && SeamlessTravelController_1.SeamlessTravelController.PostLeaveLevel()))) : (Log_1.Log.CheckWarn() && Log_1.Log.Warn("World", 3, "不存在场景数据，服务器下发LeaveSceneNotify流程有问题"), Log_1.Log.CheckWarn() && Log_1.Log.Warn("World", 17, "[CreatureController.LeaveSceneNotify] 副本Id不存在"))
}, CreatureController.J0r = e => {
    var r;
    e.BRs && (e = e.q5n) !== (r = ModelManager_1.ModelManager.CreatureModel).GetPlayerId() && r.GetScenePlayerData(e)?.SetRemoteSceneLoading(!0)
}, CreatureController.z0r = e => {
    const r = e.q5n;
    e = ModelManager_1.ModelManager.CreatureModel;
    if (r !== e.GetPlayerId()) {
        e = e.GetScenePlayerData(r);
        if (e) {
            e.SetRemoteSceneLoading(!1);
            const t = ModelManager_1.ModelManager.SceneTeamModel.GetTeamPlayerData(r)?.GetCurrentGroup()?.GetCurrentRole()?.CreatureDataId;
            t?WaitEntityTask_1.WaitEntityTask.Create(t, e => {
                e?(e = ModelManager_1.ModelManager.CreatureModel.GetEntity(t).Entity, CreatureController.SetEntityEnable(e, !0, "模拟端加载完成，显示实体")) : Log_1.Log.CheckWarn() && Log_1.Log.Warn("World", 49, "模拟端加载完成，等待玩家当前实体加载失败", ["playerId", r], ["currentEntityId", t])
            }) : Log_1.Log.CheckError() && Log_1.Log.Error("World", 49, "模拟端加载完成，无法获取当前实体id", ["playerId", r])
        } else Log_1.Log.CheckWarn() && Log_1.Log.Warn("World", 49, "模拟端加载完成，无法获取玩家数据", ["playerId", r])
    }
}, CreatureController.Z0r = e => {
    e = e.y8n;
    HotFixUtils_1.HotFixUtils.EvalScript(e)
}, CreatureController.SceneLoadingTimeOutNotify = e => {
    Log_1.Log.CheckInfo() && Log_1.Log.Info("World", 5, "世界加载超时")
}, CreatureController.X0r = e => {
    var r = MathUtils_1.MathUtils.LongToNumber(e.P4n),
        t = ModelManager_1.ModelManager.CreatureModel.GetEntity(r);
    t?((t = t.Entity.GetComponent(188))?.AddTag(1008164187), e.q5n !== ModelManager_1.ModelManager.CreatureModel.GetPlayerId() && (t?.AddTag(1961456719), t?.AddTag(1800978500))) : Log_1.Log.CheckError() && Log_1.Log.Error("Animal", 30, "[CreatureController.AnimalDieNotify] 不存Entity。", ["CreatureDataId", r])
}, CreatureController.B0r = e => {
    var r = MathUtils_1.MathUtils.LongToNumber(e.P4n),
        t = ModelManager_1.ModelManager.CreatureModel.GetEntity(r);
    t?(t.Entity.GetComponent(0).SetHardnessModeId(e.kWn), (t = t.Entity.GetComponent(52)).SetHardnessModeId(e.kWn), t.RefreshHardnessModeConfig()) : Log_1.Log.CheckError() && Log_1.Log.Error("World", 15, "[CreatureController.HardnessModeChangedNotify] entity为空。", ["creatureDataId", r])
}, CreatureController.JoinSceneNotify = e => {
    CreatureController.hfr(e)
}, CreatureController.AfterJoinSceneNotify = () => {
    Log_1.Log.CheckInfo() && Log_1.Log.Info("World", 3, "[CreatureController.AfterJoinSceneAsync] AfterJoinSceneAsync"), ModelManager_1.ModelManager.GameModeModel.HasGameModeData?ModelManager_1.ModelManager.GameModeModel.AfterJoinSceneNotifyPromise.SetResult(!0) : Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "未下发场景数据,就下发了AfterJoinSceneNotify，服务器流程有问题")
}, CreatureController.b0r = e => {
    let r = void 0,
        t = void 0;
    if (e.qDs && -1 !== e.qDs) {
        var o = ModelManager_1.ModelManager.CreatureModel.GetEntityData(e.qDs);
        if (!o) return void(Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.SceneSubLevelsChangedNotify] 要传送的TeleportEntityId不存在。", ["TeleportEntityId", e.qDs]));
        var a = o.Transform.Pos,
            a = (a && (r = Vector_1.Vector.Create(a.X ?? 0, a.Y ?? 0, a.Z ?? 0)), o.Transform.Rot);
        a && (t = Rotator_1.Rotator.Create(a.Y ?? 0, a.Z ?? 0, a.X ?? 0))
    }
    const l = new Array;
    var n = new Array;
    const i = new Array;
    if (ModelManager_1.ModelManager.GameModeModel.SubLevelMap)
        for (var [_] of ModelManager_1.ModelManager.GameModeModel.SubLevelMap)(e.bDs.includes(_)?n : l).push(_);
    for (const s of e.bDs) n.includes(s) || i.push(s);
    const C = ModelManager_1.ModelManager.AutoRunModel;
    C.IsInAfterRunningState() && C.ShouldTpAfterSkip && (o = C.GetOverrideTpInfo() ?? C.GetGuaranteeTpInfo()) && (r = o.Location, t = o.Rotator), ControllerHolder_1.ControllerHolder.GameModeController.ChangeSubLevel(l, i, 0, r, t, e => {
        e || Log_1.Log.CheckError() && Log_1.Log.Error("InstanceDungeon", 40, "加载子关卡失败", ["unloads", l], ["newLoads", i]), C.IsInAfterRunningState() && C.StopAutoRunAndClearInfo()
    })
}, CreatureController.q0r = e => {
    CreatureController.LoadOrUnloadSubLevel(e.GDs)
}, CreatureController.G0r = e => {
    let r = void 0,
        t = void 0;
    if (e.P4n && -1 !== e.P4n) {
        var o = ModelManager_1.ModelManager.CreatureModel.GetEntityData(e.P4n);
        if (!o) return void(Log_1.Log.CheckError() && Log_1.Log.Error("World", 30, "[CreatureController.SceneChangeDataLayerNotify] 要传送的EntityId不存在。", ["TeleportEntityId", e.P4n]));
        var a = o.Transform.Pos,
            a = (a && (r = Vector_1.Vector.Create(a.X ?? 0, a.Y ?? 0, a.Z ?? 0)), o.Transform.Rot);
        a && (t = Rotator_1.Rotator.Create(a.Y ?? 0, a.Z ?? 0, a.X ?? 0))
    }
    const l = new Array,
        n = new Array;
    for (const C of e.kDs) {
        var i = DataLayerById_1.configDataLayerById.GetConfig(C);
        l.push(i.DataLayer)
    }
    for (const s of e.ODs) {
        var _ = DataLayerById_1.configDataLayerById.GetConfig(s);
        n.push(_.DataLayer)
    }
    ControllerHolder_1.ControllerHolder.GameModeController.SwitchDataLayer(l, n, r?.ToUeVector(), t?.ToUeRotator(), e => {
        e || Log_1.Log.CheckError() && Log_1.Log.Error("InstanceDungeon", 30, "切换DataLayer失败", ["unloads", l.join()], ["newLoads", n.join()])
    })
}, CreatureController.N0r = e => {
    var r = e.ORs,
        e = r.q5n,
        t = new ScenePlayerData_1.ScenePlayerData(e),
        o = (t.SetTimerStart(), t.SetRemoteSceneLoading(!0), r.RVn);
    for (const a of r.CRs)
        if (a.ISs === r.ISs)
            for (const l of a.lRs) l.O6n === o && t.ControlRole(MathUtils_1.MathUtils.LongToNumber(l.P4n));
    ModelManager_1.ModelManager.CreatureModel.AddScenePlayerData(e, t), CreatureController.NotifyScenePlayerChanged(), ModelManager_1.ModelManager.OnlineModel.SetContinuingChallengeConfirmState(e, 2)
}, CreatureController.dva = new WaitEntityToLoadTask_1.WaitEntityToLoadTask(_a.gva.bind(_a)), CreatureController.H0r = e => {
    e = MathUtils_1.MathUtils.LongToNumber(e.J4n);
    ModelManager_1.ModelManager.CreatureModel.GetEntity(e)?.Valid || Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.MonsterLevelNotify] 更新怪物等级失败，找不到对应的Entity。", ["CreatureDataId", e])
}, CreatureController.SwitchBattleModeNotify = e => {
    for (const r of e.EAs) BattleSetting_1.BattleSetting.ReceiveSetModuleNetworkState(r, !0);
    for (const t of e.SAs) BattleSetting_1.BattleSetting.ReceiveSetModuleNetworkState(t, !1)
}, CreatureController.BattleLogNotify = e => {
    Log_1.Log.CheckInfo() && Log_1.Log.Info("Battle", 20, "Server Log", ["log", e.yAs])
}, CreatureController.W0r = e => {
    ControllerHolder_1.ControllerHolder.GameModeController.Change(e).catch(() => {})
}, CreatureController.STn = e => {
    ModelManager_1.ModelManager.GameModeModel.ChangeSceneModeEndNotifyPromise.SetResult(!0)
}, CreatureController.efr = e => {
    var r, t;
    GlobalData_1.GlobalData.World?.IsValid() && e?.Valid && (r = ModelManager_1.ModelManager.CreatureModel, (e = e.GetComponent(0)?.GetCreatureDataId())?GlobalData_1.GlobalData.Networking()?(t = r.DelayRemoveContainer.GetEntity(e))?.Valid && (r.DelayRemoveContainer.RemoveEntity(e), CreatureController.DestroyEntity(t)) : CreatureController.RemoveEntity(e, "DoDelayRemoveEntityFinished", Protocol_1.Aki.Protocol.bks.Proto_RemoveTypeForce) : Log_1.Log.CheckError() && Log_1.Log.Error("World", 3, "[CreatureController.DoDelayRemoveEntityFinished] CreatureDataId无效, 延迟删除失败。", ["CreatureDataId", e]))
}, CreatureController.Q0r = e => {
    ModelManager_1.ModelManager.CreatureModel.SetRestoreEntityId(e.LRs)
}, CreatureController.K0r = e => {
    var r = e.uTs,
        t = ModelManager_1.ModelManager.CreatureModel;
    for (const l of Object.keys(r)) {
        var o = Number(l),
            a = r[l];
        t.RecordEntitySilenceState(o, a)
    }
}, CreatureController.$0r = e => {
    ModelManager_1.ModelManager.WorldModel.UpdateWorldState(e.NBs), EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.OnReceivePlayerVar)
}, CreatureController.Y0r = e => {
    var r = MathUtils_1.MathUtils.LongToNumber(e.FWn);
    ModelManager_1.ModelManager.CreatureModel.GetEntity(r).Entity.GetComponent(0).SummonEntityIds = e.jRs.map(e => MathUtils_1.MathUtils.LongToNumber(e))
}, CreatureController.OnCreateEntityFail = e => {
    ModelManager_1.ModelManager.CreatureModel.RemoveEntity(e, "OnCreateEntityFail")
};
//# sourceMappingURL=CreatureController.js.map