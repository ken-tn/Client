"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.MapModel = void 0);
const Json_1 = require("../../../Core/Common/Json"),
  Log_1 = require("../../../Core/Common/Log"),
  TeleporterById_1 = require("../../../Core/Define/ConfigQuery/TeleporterById"),
  Protocol_1 = require("../../../Core/Define/Net/Protocol"),
  ModelBase_1 = require("../../../Core/Framework/ModelBase"),
  Vector_1 = require("../../../Core/Utils/Math/Vector"),
  MathUtils_1 = require("../../../Core/Utils/MathUtils"),
  StringUtils_1 = require("../../../Core/Utils/StringUtils"),
  EventDefine_1 = require("../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../Common/Event/EventSystem"),
  UnopenedAreaController_1 = require("../../LevelGamePlay/UnopenedArea/UnopenedAreaController"),
  ConfigManager_1 = require("../../Manager/ConfigManager"),
  ControllerHolder_1 = require("../../Manager/ControllerHolder"),
  ModelManager_1 = require("../../Manager/ModelManager"),
  MapDefine_1 = require("./MapDefine"),
  MapUtil_1 = require("./MapUtil");
class MapModel extends ModelBase_1.ModelBase {
  constructor() {
    super(...arguments),
      (this.MDi = 0),
      (this.EDi = void 0),
      (this.SDi = void 0),
      (this.yDi = void 0),
      (this.IDi = void 0),
      (this.TDi = void 0),
      (this.LDi = void 0),
      (this.Yll = void 0),
      (this.DDi = void 0),
      (this.RDi = void 0),
      (this.UDi = void 0),
      (this.ADi = void 0),
      (this.PDi = void 0),
      (this.UnlockMultiMapIds = void 0),
      (this.UnlockMapBlockIds = void 0),
      (this.LastSafeLocation = Vector_1.Vector.Create()),
      (this.CacheEnrichmentAreaWorldMapCircle = void 0),
      (this.CacheEnrichmentAreaEntityId = 0),
      (this.Aul = void 0),
      (this.xul = void 0),
      (this.MapLifeEventListenerTriggerMap = void 0);
  }
  OnInit() {
    return (
      (this.EDi = new Map()),
      (this.LDi = new Map()),
      (this.Yll = new Map()),
      (this.DDi = new Map()),
      (this.ADi = new Map()),
      (this.RDi = void 0),
      (this.UDi = new Map()),
      (this.TDi = new Map()),
      (this.SDi = new Map()),
      (this.yDi = new Map()),
      (this.IDi = new Map()),
      (this.PDi = new Map()),
      (this.MapLifeEventListenerTriggerMap = new Map()),
      (this.Aul = new Map()),
      (this.xul = new Map()),
      (this.UnlockMapBlockIds = []),
      (this.UnlockMultiMapIds = []),
      !0
    );
  }
  OnChangeMode() {
    return (
      ModelManager_1.ModelManager.TrackModel.ClearTrackData(),
      ModelManager_1.ModelManager.MapModel.SetCurTrackMark(void 0),
      !0
    );
  }
  OnClear() {
    return (
      this.EDi.clear(),
      this.LDi.clear(),
      this.Yll.clear(),
      this.DDi.clear(),
      this.ADi.clear(),
      this.SDi.clear(),
      this.yDi.clear(),
      this.IDi.clear(),
      this.PDi.clear(),
      this.Aul.clear(),
      this.xul.clear(),
      (this.EDi = void 0),
      (this.LDi = void 0),
      (this.Yll = void 0),
      (this.DDi = void 0),
      (this.ADi = void 0),
      (this.RDi = void 0),
      (this.UnlockMapBlockIds = void 0),
      (this.UnlockMultiMapIds = void 0),
      (this.CacheEnrichmentAreaWorldMapCircle = void 0),
      !(this.CacheEnrichmentAreaEntityId = 0)
    );
  }
  GetUnlockedTeleportMap() {
    return this.LDi;
  }
  GetDynamicMark(e) {
    return this.TDi?.get(e);
  }
  GetMark(e, t) {
    return this.EDi.get(e)?.get(t);
  }
  GetMarkByType(e) {
    return this.EDi.get(e);
  }
  GetMarkCountByType(e) {
    return this.EDi.get(e)?.size ?? 0;
  }
  GetAllDynamicMarks() {
    return this.EDi;
  }
  GetDynamicMarkInfoById(t) {
    let i = void 0;
    return (
      this.EDi.forEach((e) => {
        e.has(t) && (i = e.get(t));
      }),
      i
    );
  }
  SetCurTrackMark(e) {
    this.RDi = e;
  }
  GetCurTrackMark() {
    return this.RDi;
  }
  CreateServerSaveMark(e) {
    this.xDi(e);
  }
  CreateMapMark(e) {
    return (e.MarkId = this.SpawnDynamicMarkId()), this.xDi(e), e.MarkId;
  }
  wDi(e) {
    return !(
      12 === e.MarkType ||
      15 === e.MarkType ||
      17 === e.MarkType ||
      9 === e.MarkType
    );
  }
  ResetDynamicMarkData() {
    var e = this.EDi.get(12),
      t = this.EDi.get(7);
    this.EDi?.clear(), this.TDi?.clear(), this.ohh(12, e), this.ohh(7, t);
  }
  ohh(e, t) {
    t &&
      (this.EDi?.set(e, t),
      t.forEach((e) => {
        this.TDi?.set(e.MarkId, e);
      }));
  }
  xDi(i) {
    if (this.EDi) {
      let e = this.EDi.get(i.MarkType),
        t = (e || ((e = new Map()), this.EDi.set(i.MarkType, e)), void 0);
      e.forEach((e) => {
        this.wDi(i) &&
          e.TrackTarget instanceof Vector_1.Vector &&
          i.TrackTarget instanceof Vector_1.Vector &&
          e.TrackTarget.Equality(i.TrackTarget) &&
          (t = e),
          e.MarkId === i.MarkId && (t = e);
      }),
        t && this.RemoveMapMark(t.MarkType, t.MarkId),
        e.set(i.MarkId, i),
        this.TDi?.set(i.MarkId, i),
        EventSystem_1.EventSystem.Emit(
          EventDefine_1.EEventName.CreateMapMark,
          i,
        );
    }
  }
  SetTrackMark(e, t, i) {
    EventSystem_1.EventSystem.Emit(
      EventDefine_1.EEventName.TrackMapMark,
      e,
      t,
      i,
    ),
      i ||
        (this.EDi &&
          (i = this.EDi.get(e)) &&
          i.get(t)?.DestroyOnUnTrack &&
          this.RemoveMapMark(e, t));
  }
  IsMarkIdExist(e, t) {
    if (this.EDi && e && t) {
      var i = this.EDi.get(e);
      if (i) return i.has(t);
      i = MapUtil_1.MapUtil.GetMarkBelongMapId(t, e);
      for (const r of ConfigManager_1.ConfigManager.MapConfig.GetConfigMarks(i))
        if (r.MarkId === t && r.ObjectType === e) return !0;
    }
    return !1;
  }
  GetSoundBoxDetectMark() {
    var e = this.GetMarkByType(16);
    return (e && 0 < e.size) || ((e = this.GetMarkByType(21)) && 0 < e.size)
      ? [(e = e.values().next().value).MarkId, e.MarkType]
      : void 0;
  }
  IsConfigMarkIdUnlock(e) {
    var t = ConfigManager_1.ConfigManager.MapConfig.GetConfigMark(e);
    return (
      !!t &&
      !!ModelManager_1.ModelManager.MapModel.IsMarkIdExist(t.ObjectType, e) &&
      ((e = this.BDi(t)), (t = this.bDi(t)), e) &&
      t
    );
  }
  BDi(e) {
    return 1 === e.FogShow || this.CheckFogUnlocked(e.FogHide);
  }
  bDi(e) {
    var t = e.ShowCondition,
      e = e.MarkId;
    return t < 0
      ? this.GetMarkExtraShowState(e).IsShow
      : 0 === t || this.IsMarkUnlockedByServer(e);
  }
  RemoveMapMark(e, t) {
    var i;
    this.EDi &&
      void 0 !== e &&
      void 0 !== t &&
      (i = this.EDi.get(e)) &&
      ((i = i.delete(t)), this.TDi?.delete(t), i) &&
      EventSystem_1.EventSystem.Emit(
        EventDefine_1.EEventName.RemoveMapMark,
        e,
        t,
      );
  }
  RemoveMapMarksByConfigId(e, t) {
    if (this.EDi && void 0 !== e && void 0 !== t) {
      t = this.EDi.get(e);
      if (t) {
        var i,
          r,
          o = [];
        for ([i, r] of t) r.MarkType === e && o.push(i);
        for (const n of o) this.RemoveMapMark(e, n);
      }
    }
  }
  RemoveDynamicMapMark(e) {
    var t = this.TDi?.get(e);
    t
      ? this.RemoveMapMark(t?.MarkType, t?.MarkId)
      : Log_1.Log.CheckError() &&
        Log_1.Log.Error("Map", 49, "找不到mark id:", ["markId", e]);
  }
  UpdateCustomMarkInfo(e, t) {
    var i;
    this.EDi &&
      ((i = this.EDi.get(9))
        ? (i.get(e).TrackTarget = t)
        : Log_1.Log.CheckError() && Log_1.Log.Error("Map", 49, "找不到markId"));
  }
  ReplaceCustomMarkIcon(e, t) {
    var i;
    this.EDi &&
      (i = this.EDi.get(9)) &&
      (i = i.get(e)) &&
      ((i.MarkConfigId = t),
      EventSystem_1.EventSystem.Emit(
        EventDefine_1.EEventName.MapReplaceMarkResponse,
        9,
        e,
        t,
      ));
  }
  SpawnDynamicMarkId() {
    return --this.MDi;
  }
  UnlockTeleports(e, t = !1) {
    if ((t && this.LDi.clear(), !(e.length <= 0))) {
      var i = new Array();
      for (const o of e) {
        var r = TeleporterById_1.configTeleporterById.GetConfig(o);
        r && i.push(r);
      }
      for (const n of i)
        n.TeleportEntityConfigId &&
          ControllerHolder_1.ControllerHolder.CreatureController.ChangeLockTagByTeleportPbDataId(
            n.TeleportEntityConfigId,
            1196894179,
          ),
          this.LDi.set(n.Id, !0),
          EventSystem_1.EventSystem.Emit(
            EventDefine_1.EEventName.UnlockTeleport,
            n.Id,
          );
    }
  }
  UnlockTeleport(e) {
    this.LDi.set(e, !0);
    var t = ConfigManager_1.ConfigManager.MapConfig.GetTeleportConfigById(e);
    t &&
      t.TeleportEntityConfigId &&
      ControllerHolder_1.ControllerHolder.CreatureController.ChangeLockTagByTeleportPbDataId(
        t.TeleportEntityConfigId,
        1196894179,
      ),
      EventSystem_1.EventSystem.Emit(
        EventDefine_1.EEventName.UnlockTeleport,
        e,
      );
  }
  CheckTeleportUnlocked(e) {
    return this.LDi.get(e);
  }
  GetAllUnlockedFogs() {
    return this.Yll;
  }
  GetAllUnlockedAreas() {
    return this.DDi;
  }
  AddUnlockedFogs(e) {
    this.Yll.set(e, !0),
      this.zll(e),
      EventSystem_1.EventSystem.Emit(
        EventDefine_1.EEventName.MapOpenFogChange,
        e,
      );
  }
  FullUpdateUnlockedFogs(e) {
    this.Yll.clear(), this.DDi.clear();
    for (const t of e) this.Yll.set(t, !0), this.zll(t);
    EventSystem_1.EventSystem.Emit(
      EventDefine_1.EEventName.MapOpenFogFullUpdate,
      this.Yll,
    );
  }
  zll(e) {
    e = ConfigManager_1.ConfigManager.WorldMapConfig.GetMapFogConfig(e);
    e && this.DDi.set(e.AreaId, !0);
  }
  CheckAreasUnlocked(e, t = !0) {
    return !(0 !== e || !t) || (this.DDi.get(e) ?? !1);
  }
  CheckFogUnlocked(e) {
    return 0 === e || (this.Yll.get(e) ?? !1);
  }
  SetUnlockMultiMapIds(e) {
    this.UnlockMultiMapIds = e;
  }
  SetUnlockMapBlockIds(e) {
    this.UnlockMapBlockIds = e;
  }
  CheckUnlockMultiMapIds(e) {
    return this.UnlockMultiMapIds.includes(e);
  }
  CheckUnlockMapBlockIds(e) {
    let t = 0;
    for (const r of this.UnlockMapBlockIds ?? []) {
      var i =
        ConfigManager_1.ConfigManager.MapConfig.GetUnlockMapTileConfigById(r);
      if (i?.Block === e) {
        t = i.Id;
        break;
      }
    }
    return t;
  }
  CheckIsInMultiMapWithAreaId(e) {
    let t = 0;
    for (const i of ConfigManager_1.ConfigManager.MapConfig?.GetAllSubMapConfig())
      if (i.Area.includes(e)) {
        t = i.Id;
        break;
      }
    return t;
  }
  AddEntityIdToPendingList(e, t) {
    this.ADi.set(e, t);
  }
  RemoveEntityIdToPendingList(e) {
    this.ADi.delete(e);
  }
  GetEntityPendingList() {
    return this.ADi;
  }
  IsInMapPolygon(e) {
    var t = ModelManager_1.ModelManager.GameModeModel.InstanceDungeon.Id;
    if (!MapUtil_1.MapUtil.IsInBigWorld(t)) return !0;
    this.LastSafeLocation.IsNearlyZero() && this.LastSafeLocation.DeepCopy(e);
    (t = ModelManager_1.ModelManager.GameModeModel.InstanceDungeon.MapConfigId),
      (t = UnopenedAreaController_1.UnopenedAreaController.OnCheckUnopenedArea(
        e,
        t,
      ));
    return t && this.LastSafeLocation.DeepCopy(e), t;
  }
  GetLastSafeLocation() {
    return this.LastSafeLocation;
  }
  IsInUnopenedAreaPullback() {
    // here
  }
  SetMarkExtraShowState(e, t, i, r) {
    return (
      this.UDi.set(e, { Id: e, IsShow: t, NeedFocus: i, ShowFlag: r }),
      EventSystem_1.EventSystem.Emit(
        EventDefine_1.EEventName.OnMarkItemShowStateChange,
        e,
      ),
      i
    );
  }
  GetMarkExtraShowState(e) {
    return (
      this.UDi.get(e) ?? {
        Id: e,
        IsShow: !1,
        NeedFocus: !1,
        ShowFlag: Protocol_1.Aki.Protocol.U5s.Proto_ShowNormal,
      }
    );
  }
  GetCurMapBorderId(e) {
    let t = MapDefine_1.DEFAULT_MAP_BORDER_ID;
    for (const r of ConfigManager_1.ConfigManager.MapConfig.GetMapBorderConfigList()) {
      var i = r.ConditionId;
      if (r.MapId === e) {
        let e = !1;
        if (
          !(e =
            0 === i ||
            ControllerHolder_1.ControllerHolder.LevelGeneralController.CheckCondition(
              i.toString(),
              void 0,
              !1,
            ))
        )
          break;
        t = r.BorderId;
      }
    }
    return t;
  }
  ForceSetMarkVisible(e, t, i) {
    let r = this.SDi.get(e);
    void 0 === r && ((r = new Map()), this.SDi.set(e, r)), r.set(t, i);
  }
  GetMarkForceVisible(e, t) {
    let i = !0;
    e = this.SDi.get(e);
    return (i = e && e.has(t) ? (e.get(t) ?? !1) : i);
  }
  AddOccupationInfo(e) {
    var t = ConfigManager_1.ConfigManager.QuestNewConfig.GetNewOccupationConfig(
      e.qEs,
    );
    if (
      t &&
      t.OccupationData &&
      !StringUtils_1.StringUtils.IsEmpty(t.OccupationData) &&
      "Empty" !== t.OccupationData
    ) {
      t = Json_1.Json.Parse(t.OccupationData);
      if (t) {
        t = t.LevelPlayIds;
        for (const i of t)
          this.yDi.set(i, MathUtils_1.MathUtils.LongToBigInt(e.w5n));
        this.IDi.set(e.qEs, t);
      }
    }
  }
  RemoveOccupationInfo(e) {
    if (this.IDi.has(e)) {
      var t = this.IDi.get(e);
      this.IDi.delete(e);
      for (const i of t) this.yDi.delete(i);
    }
  }
  IsLevelPlayOccupied(e) {
    e = this.yDi.get(e);
    return { IsOccupied: !!e, QuestId: e };
  }
  IsMarkUnlockedByServer(e) {
    return this.PDi.get(e) ?? !1;
  }
  SetMarkServerOpenState(e, t) {
    this.PDi.set(e, t);
  }
  GetMarkAreaText(e, t) {
    var e =
        ConfigManager_1.ConfigManager.MapConfig.GetEntityConfigByMapIdAndEntityId(
          e,
          t,
        )?.AreaId ?? 0,
      t = ConfigManager_1.ConfigManager.AreaConfig.GetParentAreaId(e),
      e = ConfigManager_1.ConfigManager.AreaConfig.GetAreaInfo(e),
      i = e
        ? ConfigManager_1.ConfigManager.AreaConfig.GetAreaLocalName(e.Title)
        : "",
      t = ConfigManager_1.ConfigManager.AreaConfig.GetAreaInfo(t),
      r = t
        ? ConfigManager_1.ConfigManager.AreaConfig.GetAreaLocalName(t.Title)
        : "",
      e = e
        ? ConfigManager_1.ConfigManager.InfluenceConfig.GetCountryTitle(
            e.CountryId,
          )
        : "";
    return 0 === t?.Father ? e + "-" + i : e + `-${r}-` + i;
  }
  UpdateBoxSlotInfo(e) {
    this.Aul.set(e.T7n, e);
  }
  RemoveBoxSlotInfo(e) {
    for (var [, t] of this.Aul)
      if (t.b7n === e) {
        this.Aul.delete(t.T7n);
        break;
      }
  }
  FullUpdateBoxSlotInfo(e) {
    this.Aul.clear();
    for (const t of e) this.UpdateBoxSlotInfo(t);
  }
  GetBoxSlotInfoByMarkId(e) {
    for (var [, t] of this.Aul) if (t.T7n === e) return t;
  }
  UpdateTemporaryTeleportInfo(e) {
    this.xul.set(e.T7n, e);
    var t = this.GetDynamicMark(e.T7n);
    t && (t.TeleportId = MathUtils_1.MathUtils.LongToNumber(e.R7n));
  }
  RemoveTemporaryTeleportInfo(e) {
    for (var [, t] of this.xul)
      if (t.R7n === e) {
        this.xul.delete(t.T7n);
        break;
      }
  }
  FullUpdateTemporaryTeleportInfo(e) {
    this.xul.clear();
    for (const t of e) this.UpdateTemporaryTeleportInfo(t);
  }
}
exports.MapModel = MapModel;
//# sourceMappingURL=MapModel.js.map
