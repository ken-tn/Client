// delete me on release

"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.BulletConfig = exports.BulletDataCacheInfo = exports.PreloadBulletConfig = void 0;
const puerts_1 = require("puerts"),
    UE = require("ue"),
    Log_1 = require("../../../Core/Common/Log"),
    Stats_1 = require("../../../Core/Common/Stats"),
    ConfigBase_1 = require("../../../Core/Framework/ConfigBase"),
    ResourceSystem_1 = require("../../../Core/Resource/ResourceSystem"),
    DataTableUtil_1 = require("../../../Core/Utils/DataTableUtil"),
    FNameUtil_1 = require("../../../Core/Utils/FNameUtil"),
    GlobalData_1 = require("../../GlobalData"),
    ConfigManager_1 = require("../../Manager/ConfigManager"),
    ModelManager_1 = require("../../Manager/ModelManager"),
    ModMenu_1 = require("../../ModMenu"),
    CombatLog_1 = require("../../Utils/CombatLog"),
    BulletDataMain_1 = require("./BulletConf/BulletDataMain"),
    bulletDtPath = [void 0, void 0, "/Game/Aki/Data/Fight/DT_CommonBulletDataMain_Rogue.DT_CommonBulletDataMain_Rogue"];
class PreloadBulletConfig {
    constructor() {
        this.ModelId = 0, this.DataTable = void 0, this.RowNames = void 0, this.CurIndex = 0
    }
}
exports.PreloadBulletConfig = PreloadBulletConfig;
const preloadCommonBulletRowNames = ["100121", "100122"];
class BulletDataCacheInfo {
    constructor() {
        this.BulletDataMap = new Map, this.DataTable = void 0, this.DataTableExtra = void 0, this.EntityCount = 0
    }
}
exports.BulletDataCacheInfo = BulletDataCacheInfo;
class BulletConfig extends ConfigBase_1.ConfigBase {
    constructor() {
        super(...arguments), this.q9o = [], this.G9o = void 0
    }
    static RemoveCacheBulletDataByEntityId(t) {
        var e, l = BulletConfig.N9o.get(t);
        l && (BulletConfig.N9o.delete(t), (e = BulletConfig.O9o.get(l))?(e.EntityCount--, 0 === e.EntityCount && BulletConfig.O9o.delete(l)) : Log_1.Log.CheckError() && Log_1.Log.Error("Bullet", 18, "删除实体时，子弹缓存里没有对应的数据", ["entityId", t], ["modelId", l]))
    }
    static ClearBulletDataCache() {
        BulletConfig.O9o.clear(), BulletConfig.k9o.clear(), BulletConfig.N9o.clear()
    }
    GetBulletData(t, e, l = !0, a = -1) {
        ModMenu_1.MainMenu.KunLog("GetBulletData e: " + e + ",, t: " + t.toString())
        var o = t.CheckGetComponent(33),
            i = t.Id;
        let r = BulletConfig.N9o.get(i),
            n = !0,
            u = (r || (r = t.CheckGetComponent(0).GetModelId(), n = !1), BulletConfig.O9o.get(r));
        if (u) {
            var s = u.BulletDataMap.get(e);
            if (s) return n || (BulletConfig.N9o.set(i, r), u.EntityCount++), s
        }
        let C = this.F9o(a, e);
        if (C) return C;
        let f = void 0,
            g = void 0,
            B = (g = u?(f = u.DataTable, u.DataTableExtra) : (f = o.DtBulletInfo, o.DtBulletInfoExtra), DataTableUtil_1.DataTableUtil.GetDataTableRow(f, e));
        if (B = B || DataTableUtil_1.DataTableUtil.GetDataTableRow(g, e)) {
            const C = new BulletDataMain_1.BulletDataMain(B, e);
            return C.CheckValid()?(GlobalData_1.GlobalData.IsPlayInEditor || (u || ((u = new BulletDataCacheInfo).DataTable = f, u.DataTableExtra = g, u.EntityCount = 0, BulletConfig.O9o.set(r, u)), u.BulletDataMap.set(e, C), n) || (BulletConfig.N9o.set(i, r), u.EntityCount++), C) : void CombatLog_1.CombatLog.Error("Bullet", void 0, "子弹配置非法", ["", e])
        }
        if (C = this.V9o(a, e)) return C;
        l && (s = t.CheckGetComponent(3).Actor, Log_1.Log.CheckError()) && Log_1.Log.Error("Bullet", 18, "子弹数据未找到!", ["角色:", s.GetName()], ["子弹名称:", e], ["dtType", a])
    }
    F9o(t, e) {
        if (-1 === t)
            for (const o of BulletConfig.k9o.values()) {
                var l = o.BulletDataMap.get(e);
                if (l) return l
            } else if (0 !== t) {
                const o = BulletConfig.k9o.get(t);
                if (o) {
                    var a = o.BulletDataMap.get(e);
                    if (a) return a
                } else Log_1.Log.CheckError() && Log_1.Log.Error("Bullet", 18, "该子弹的DT表没有加载，请检查触发子弹的玩法是否正确", ["bulletDataName", e], ["dtType", t])
            }
    }
    V9o(t, e) {
        if (-1 === t)
            for (const a of BulletConfig.k9o.values()) {
                const o = DataTableUtil_1.DataTableUtil.GetDataTableRow(a.DataTable, e);
                var l;
                if (o) return (l = new BulletDataMain_1.BulletDataMain(o, e)).CheckValid()?(GlobalData_1.GlobalData.IsPlayInEditor || a.BulletDataMap.set(e, l), l) : void CombatLog_1.CombatLog.Error("Bullet", void 0, "子弹配置非法", ["", e])
            } else {
                const a = BulletConfig.k9o.get(t);
                if (a) {
                    const o = DataTableUtil_1.DataTableUtil.GetDataTableRow(a.DataTable, e);
                    return o?(t = new BulletDataMain_1.BulletDataMain(o, e)).CheckValid()?(GlobalData_1.GlobalData.IsPlayInEditor || a.BulletDataMap.set(e, t), t) : void CombatLog_1.CombatLog.Error("Bullet", void 0, "子弹配置非法", ["", e]) : void 0
                }
            }
    }
    GetBulletHitData(e, l) {
        if (l !== FNameUtil_1.FNameUtil.EMPTY && l !== FNameUtil_1.FNameUtil.NONE) {
            e = e.CheckGetComponent(33), l = l.toString();
            let t = DataTableUtil_1.DataTableUtil.GetDataTableRow(e.DtHitEffect, l);
            return t = (t = !t && e.DtHitEffectExtra?DataTableUtil_1.DataTableUtil.GetDataTableRow(e.DtHitEffectExtra, l) : t) || DataTableUtil_1.DataTableUtil.GetDataTableRow(ConfigManager_1.ConfigManager.WorldConfig.GetCommonHitEffectData(), l)
        }
    }
    PreloadCommonBulletData() {
        this.H9o(1), ModelManager_1.ModelManager.RoguelikeModel.CheckInRoguelike() && this.H9o(2);
        var t = ConfigManager_1.ConfigManager.WorldConfig.GetCommonBulletData();
        return this.W9o(t, void 0, 0, 0, preloadCommonBulletRowNames), !0
    }
    H9o(e) {
        var l, a = BulletConfig.k9o.get(e);
        if (!a) {
            let t = void 0;
            1 === e?t = ConfigManager_1.ConfigManager.WorldConfig.GetCommonBulletData() : (l = bulletDtPath[e]) && (t = ResourceSystem_1.ResourceSystem.Load(l, UE.DataTable)), t && ((a = new BulletDataCacheInfo).DataTable = t, BulletConfig.k9o.set(e, a), Log_1.Log.CheckInfo()) && Log_1.Log.Info("Bullet", 18, "预加载通用子弹DT", ["dtType", e])
        }
    }
    PreloadBulletData(t) {
        var e, l;
        t?.GetComponent(0)?.IsRole() && (e = t.CheckGetComponent(33), l = t.CheckGetComponent(0).GetModelId(), this.W9o(e.DtBulletInfo, e.DtBulletInfoExtra, l, t.Id))
    }
    W9o(t, l, a, o, i = void 0) {
        if (!GlobalData_1.GlobalData.IsPlayInEditor && t && void 0 !== a && !BulletConfig.O9o.has(a)) {
            let e = i;
            if (!e) {
                e = [];
                var i = (0, puerts_1.$ref)(void 0),
                    r = (UE.DataTableFunctionLibrary.GetDataTableRowNames(t, i), (0, puerts_1.$unref)(i));
                if (!r) return;
                var n = r.Num();
                if (n <= 0) return;
                for (let t = 0; t < n; t++) {
                    var u = r.Get(t).toString();
                    e.push(u)
                }
            }
            i = new BulletDataCacheInfo, l = (i.DataTable = t, i.DataTableExtra = l, ModelManager_1.ModelManager.CharacterModel.IsValid(o) && (i.EntityCount = 1, BulletConfig.N9o.set(o, a)), BulletConfig.O9o.set(a, i), new PreloadBulletConfig);
            l.ModelId = a, l.DataTable = t, l.CurIndex = 0, l.RowNames = e, this.G9o?this.q9o.push(l) : this.G9o = l
        }
    }
    TickPreload() {
        if (this.G9o) {
            if (this.G9o.RowNames.length <= this.G9o.CurIndex) {
                if (0 === this.q9o.length) return void(this.G9o = void 0);
                if (this.G9o = this.q9o.pop(), this.G9o.RowNames.length <= this.G9o.CurIndex) return
            }
            var t, e, l = BulletConfig.O9o.get(this.G9o.ModelId);
            l?(t = this.G9o.RowNames[this.G9o.CurIndex], (e = DataTableUtil_1.DataTableUtil.GetDataTableRow(this.G9o.DataTable, t))?(e = new BulletDataMain_1.BulletDataMain(e, t)).CheckValid()?(e.Preload(), l.BulletDataMap.set(t, e)) : CombatLog_1.CombatLog.Error("Bullet", void 0, "子弹配置非法", ["", t]) : Log_1.Log.CheckError() && Log_1.Log.Error("Bullet", 18, "子弹配置为空", ["rowName", t], ["modelId", this.G9o?.ModelId], ["index", this.G9o?.CurIndex]), this.G9o.CurIndex++) : this.G9o.CurIndex = this.G9o.RowNames.length
        }
    }
    ClearPreload() {
        this.G9o = void 0, this.q9o.length = 0
    }
}(exports.BulletConfig = BulletConfig).j9o = void 0, BulletConfig.K9o = void 0, BulletConfig.O9o = new Map, BulletConfig.k9o = new Map, BulletConfig.N9o = new Map;
//# sourceMappingURL=BulletConfig.js.map