"use strict";

var _a;
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.EffectSystem =
    exports.EFFECT_LIFETIME_FLOAT_TO_INT =
    exports.EFFECT_REASON_LENGTH_LIMIT =
      void 0);
const UE = require("ue"),
puerts_1 = require("puerts"),
  ActorSystem_1 = require("../../Core/Actor/ActorSystem"),
  Info_1 = require("../../Core/Common/Info"),
  Log_1 = require("../../Core/Common/Log"),
  Stats_1 = require("../../Core/Common/Stats"),
  Time_1 = require("../../Core/Common/Time"),
  Lru_1 = require("../../Core/Container/Lru"),
  Queue_1 = require("../../Core/Container/Queue"),
  EffectSpecDataById_1 = require("../../Core/Define/ConfigQuery/EffectSpecDataById"),
  EffectSpecDataGetAll_1 = require("../../Core/Define/ConfigQuery/EffectSpecDataGetAll"),
  Protocol_1 = require("../../Core/Define/Net/Protocol"),
  EffectEnvironment_1 = require("../../Core/Effect/EffectEnvironment"),
  GameBudgetInterfaceController_1 = require("../../Core/GameBudgetAllocator/GameBudgetInterfaceController"),
  PerformanceDecorators_1 = require("../../Core/Performance/PerformanceDecorators"),
  StatSeconds_1 = require("../../Core/Performance/StatSeconds"),
  Macro_1 = require("../../Core/Preprocessor/Macro"),
  ResourceSystem_1 = require("../../Core/Resource/ResourceSystem"),
  EventDefine_1 = require("../Common/Event/EventDefine"),
  EventSystem_1 = require("../Common/Event/EventSystem"),
  PublicUtil_1 = require("../Common/PublicUtil"),
  TimeUtil_1 = require("../Common/TimeUtil"),
  GameSettingsManager_1 = require("../GameSettings/GameSettingsManager"),
  GlobalData_1 = require("../GlobalData"),
  ModelManager_1 = require("../Manager/ModelManager"),
  EffectModelGroup_1 = require("../Render/Effect/Data/EffectModelGroup"),
  EffectModelNiagara_1 = require("../Render/Effect/Data/EffectModelNiagara"),
  CustomMap_1 = require("../World/Define/CustomMap"),
  GameBudgetAllocatorConfigCreator_1 = require("../World/Define/GameBudgetAllocatorConfigCreator"),
  EEffectCreateFromType_1 = require("./EEffectCreateFromType"),
  EffectDefine_1 = require("./EffectDefine"),
  EffectHandle_1 = require("./EffectHandle"),
  EffectProfiler_1 = require("./EffectProfiler/EffectProfiler"),
  EffectModelTrailSpec_1 = require("./EffectSpec/EffectModelTrailSpec"),
  PlayerEffectContainer_1 = require("./PlayerEffectContainer"),
  EFFECT_SPEC_DATA_PATH =
    ((exports.EFFECT_REASON_LENGTH_LIMIT = 4),
    (exports.EFFECT_LIFETIME_FLOAT_TO_INT = 1e4),
    "../Config/Client/EffectData/"),
  EFFECT_LRU_CAPACITY = 100,
  PERCENT = 100,
  lruFolderPath = new UE.FName("LruActorPool"),
  CHECK_EFFECT_OWNER_INTERVAL = 6e4,
  MIN_NIAGARA_SIMULATION_TICK_TIME = 0.033,
  MOBILE_EFFECT_BLACK_LIST = new Set([
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Sc2_FarCloud/DA_Fx_Sc2_FarCloud01.DA_Fx_Sc2_FarCloud01",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Sc2_FarCloud/DA_Fx_Sc2_FarCloud02.DA_Fx_Sc2_FarCloud02",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Sc2_FarCloud/DA_Fx_Sc2_FarCloud03.DA_Fx_Sc2_FarCloud03",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Sc2_FarCloud/DA_Fx_Sc2_FarCloud04.DA_Fx_Sc2_FarCloud04",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Sc2_FarCloud/DA_Fx_Sc2_FarCloud05.DA_Fx_Sc2_FarCloud05",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Sc2_FarCloud/DA_Fx_Sc2_FarCloud06.DA_Fx_Sc2_FarCloud06",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Sc2_FarCloud/DA_Fx_Sc2_FarCloud07.DA_Fx_Sc2_FarCloud07",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Sc2_FarCloud/DA_Fx_Sc2_FarCloud08.DA_Fx_Sc2_FarCloud08",
    "/Game/Aki/Scene/EffectDataAsset/DA_Base/DA_Fx_Luoye_03.DA_Fx_Luoye_03",
    "/Game/Aki/Scene/EffectDataAsset/DA_Base/DA_Fx_Sc3_luoye06.DA_Fx_Sc3_luoye06",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Luoye/DA_Fx_Luoye_06/DA_Fx_Sc3_luoye06_01.DA_Fx_Sc3_luoye06_01",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Fog/DA_Fx_Fog_001.DA_Fx_Fog_001",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Fog/DA_Fx_Fog_001_01.DA_Fx_Fog_001_01",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Fog/DA_Fx_Fog_001_02.DA_Fx_Fog_001_02",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Fog/DA_Fx_Fog_001_03.DA_Fx_Fog_001_03",
    "/Game/Aki/Scene/EffectDataAsset/DA_Base/DA_Fx_Sc2_MiddleFog.DA_Fx_Sc2_MiddleFog",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Fog/DA_Fx_Sc2_MiddleFog_01.DA_Fx_Sc2_MiddleFog_01",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Fog/DA_Fx_Sc2_MiddleFog_02.DA_Fx_Sc2_MiddleFog_02",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Fog/DA_Fx_Sc2_MiddleFog_03.DA_Fx_Sc2_MiddleFog_03",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Fog/DA_Fx_Sc2_MiddleFog_04.DA_Fx_Sc2_MiddleFog_04",
    "/Game/Aki/Effect/DataAsset/Niagara/Scene/Comnon/Smoke/DA_Fx_SC3_SmokFlow01.DA_Fx_SC3_SmokFlow01",
    "/Game/Aki/Scene/EffectDataAsset/DA_Base/DA_Fx_Luoye_01.DA_Fx_Luoye_01",
    "/Game/Aki/Scene/EffectDataAsset/DA_Base/DA_Fx_Luoye_01_bai.DA_Fx_Luoye_01_bai",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Luoye/DA_Fx_Luoye_01/DA_Fx_Luoye_01_01.DA_Fx_Luoye_01_01",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Luoye/DA_Fx_Luoye_01/DA_Fx_Luoye_01_02.DA_Fx_Luoye_01_02",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Luoye/DA_Fx_Luoye_01/DA_Fx_Luoye_01_03.DA_Fx_Luoye_01_03",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Luoye/DA_Fx_Luoye_01/DA_Fx_Luoye_01_bai_01.DA_Fx_Luoye_01_bai_01",
    "/Game/Aki/Scene/EffectDataAsset/DA_Base/DA_Fx_Luoye_02.DA_Fx_Luoye_02",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Luoye/DA_Fx_Luoye_02/DA_Fx_Luoye_02_1.DA_Fx_Luoye_02_1",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Luoye/DA_Fx_Luoye_02/DA_Fx_Luoye_02_2.DA_Fx_Luoye_02_2",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Luoye/DA_Fx_Luoye_02/DA_Fx_Luoye_02_3.DA_Fx_Luoye_02_3",
    "/Game/Aki/Scene/EffectDataAsset/DA_New/DA_Fx_Luoye/DA_Fx_Luoye_02/DA_Fx_Luoye_02_4.DA_Fx_Luoye_02_4",
    "/Game/Aki/Scene/EffectDataAsset/DA_Base/DA_Fx_Sc3_luoye05_zise.DA_Fx_Sc3_luoye05_zise",
    "/Game/Aki/Scene/EffectDataAsset/DA_Base/DA_Fx_Sc3_Chuiyan.DA_Fx_Sc3_Chuiyan",
    "/Game/Aki/Effect/DataAsset/Niagara/Scene/CXS/DA_Fx_SC2_CXS_BambooLeaf.DA_Fx_SC2_CXS_BambooLeaf",
    "/Game/Aki/Effect/DataAsset/Niagara/Scene/Cluster/Wind/DA_Fx_SC3_Cluster_WindSmoke.DA_Fx_SC3_Cluster_WindSmoke",
    "/Game/Aki/Effect/DataAsset/Niagara/Scene/CXS/DA_Fx_SC2_CXS_Steam.DA_Fx_SC2_CXS_Steam",
    "/Game/Aki/Effect/DataAsset/Niagara/Scene/Comnon/Leaf/DA_Fx_Sc2_Leaf01.DA_Fx_Sc2_Leaf01",
    "/Game/Aki/Effect/DataAsset/Niagara/Scene/Comnon/Leaf/DA_Fx_Sc2_Leaf01_1.DA_Fx_Sc2_Leaf01_1",
    "/Game/Aki/Effect/DataAsset/Niagara/Scene/Comnon/Leaf/DA_Fx_Sc2_Leaf02.DA_Fx_Sc2_Leaf02",
    "/Game/Aki/Effect/DataAsset/Niagara/Scene/Comnon/Leaf/DA_Fx_Sc2_Leaf03.DA_Fx_Sc2_Leaf03",
    "/Game/Aki/Effect/DataAsset/Niagara/Scene/Comnon/Leaf/DA_Fx_SC2_Leaf05_1.DA_Fx_SC2_Leaf05_1",
  ]);
class EffectSystem {
  static Initialize() {
    return (
      (this.Mfe = UE.NewObject(
        UE.HoldPreloadObject.StaticClass(),
        GlobalData_1.GlobalData.GameInstance,
      )),
      (this.AZa = !UE.KuroStaticLibrary.IsLowMemoryDevice()),
      this.Efe(),
      this.hja(),
      EffectProfiler_1.EffectProfiler.SetEnable(
        Info_1.Info.IsPlayInEditor && this.Sfe,
      ),
      (this.yfe = new PlayerEffectContainer_1.PlayerEffectContainer()),
      this.yfe.Initialize(),
      (this.Ife = !0),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.TriggerUiTimeDilation,
        EffectSystem.Tfe,
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.SetNiagaraQuality,
        EffectSystem.mna,
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.AfterGameQualitySettingsManagerInitialize,
        EffectSystem.mna,
      ),
      !0
    );
  }
  static Clear() {
    return (
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.AfterGameQualitySettingsManagerInitialize,
        EffectSystem.mna,
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.SetNiagaraQuality,
        EffectSystem.mna,
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.TriggerUiTimeDilation,
        EffectSystem.Tfe,
      ),
      this.ClearPool(),
      (this.Lfe = !1),
      (EffectEnvironment_1.EffectEnvironment.GameTimeInSeconds = 0),
      this.Mfe?.Clear(),
      (this.Mfe = void 0),
      this.yfe.Clear(),
      (this.Ife = !1),
      (this.Dfe = !0)
    );
  }
  static InitializeWithPreview(t) {
    Info_1.Info.IsGameRunning() ||
      (!t && this.Lfe) ||
      ((this.Lfe = !0), this.Rfe());
  }
  static dna() {
    Log_1.Log.CheckInfo() &&
      Log_1.Log.Info("RenderEffect", 37, "Open Niagara Down Sampling"),
      UE.KismetSystemLibrary.ExecuteConsoleCommand(
        GlobalData_1.GlobalData.World,
        "Kuro.Niagara.SystemSimulation.TickDeltaTime " +
          MIN_NIAGARA_SIMULATION_TICK_TIME,
      ),
      UE.KismetSystemLibrary.ExecuteConsoleCommand(
        GlobalData_1.GlobalData.World,
        "Kuro.Niagara.SystemSimulation.SpawnAlignment 0",
      );
  }
  static Cna() {
    Log_1.Log.CheckInfo() &&
      Log_1.Log.Info("RenderEffect", 37, "Close Niagara Down Sampling"),
      UE.KismetSystemLibrary.ExecuteConsoleCommand(
        GlobalData_1.GlobalData.World,
        "Kuro.Niagara.SystemSimulation.TickDeltaTime -1",
      ),
      UE.KismetSystemLibrary.ExecuteConsoleCommand(
        GlobalData_1.GlobalData.World,
        "Kuro.Niagara.SystemSimulation.SpawnAlignment 0",
      );
  }
  static Ufe(a, f, s, r, o = !0, t, _, c, n) {
    const E = a.Id;
    var e;
    a.IsRoot() &&
      (this.Afe.Set(E, a),
      Info_1.Info.IsGameRunning() &&
        UE.KuroStaticLibrary.IsImplementInterface(
          f.GetClass(),
          UE.BPI_EffectInterface_C.StaticClass(),
        ) &&
        (e = f)?.IsValid() &&
        e.SetHandle(E),
      f.IsA(UE.TsEffectActor_C.StaticClass())
        ? f.SetEffectHandle(a)
        : f.IsA(UE.BP_EffectPreview_C.StaticClass()) && (f.EffectView = E)),
      t?.(E),
      EventSystem_1.EventSystem.Emit(
        EventDefine_1.EEventName.CreateEffectHandle,
        E,
      ),
      a.SetIsInitializing(!0),
      this.Pfe(a, (t, e) => {
        let i = void 0;
        Stats_1.Stat.Enable &&
          (i = StatSeconds_1.StatSecondsAccumulator.Create(
            "[EffectSystem.LoadEffectData] Path:" + s,
          )).Start(),
          t
            ? (this.Mfe?.AddEntityAsset(a.HoldObjectId, e),
              f?.IsValid()
                ? f.GetWorld()?.IsValid()
                  ? this.xfe(a, o, e, c).then((t) => {
                      switch (
                        (EffectEnvironment_1.EffectEnvironment.UseLog &&
                          Log_1.Log.CheckInfo() &&
                          Log_1.Log.Info(
                            "RenderEffect",
                            3,
                            "特效框架:InitHandle回调",
                            ["句柄Id", a.Id],
                            ["父句柄Id", a.GetRoot()?.Id],
                            ["Path", a.Path],
                            ["Result", t],
                            ["Reason", r],
                          ),
                        t)
                      ) {
                        case 2:
                        case 1:
                          return (
                            this.wfe(_, 2, E),
                            this.Bfe(
                              a,
                              "[SpawnEffectWithActor.LoadEffectData.InitHandle] InitHandle有特效有可能被销毁了或者取消了",
                              !0,
                            ),
                            void i?.Stop()
                          );
                        case 0:
                          return (
                            EffectEnvironment_1.EffectEnvironment.UseLog &&
                              Log_1.Log.CheckInfo() &&
                              Log_1.Log.Info(
                                "RenderEffect",
                                3,
                                "特效框架:InitHandle失败，删除句柄",
                                ["句柄Id", a.Id],
                                ["父句柄Id", a.GetRoot()?.Id],
                                ["Path", a.Path],
                                ["Result", t],
                                ["Reason", r],
                              ),
                            this.wfe(_, 0, E),
                            this.Bfe(
                              a,
                              "[SpawnEffectWithActor.LoadEffectData.InitHandle] InitHandle失败",
                              !0,
                            ),
                            void i?.Stop()
                          );
                        case 3:
                          return (
                            this.wfe(_, 3, E),
                            this.StopEffect(a, a.StopReason, !0),
                            void i?.Stop()
                          );
                        case 4:
                          return (
                            EffectEnvironment_1.EffectEnvironment.UseLog &&
                              Log_1.Log.CheckInfo() &&
                              Log_1.Log.Info(
                                "RenderEffect",
                                37,
                                "特效框架:InitHandle失败，EffectActor已经失效",
                                ["句柄Id", a.Id],
                                ["Path", a.Path],
                                ["Reason", r],
                              ),
                            this.wfe(_, 0, E),
                            this.Bfe(a, "[InitHandle] EffectActor已经失效", !0),
                            void i?.Stop()
                          );
                      }
                      i?.Stop(), this.wfe(_, t, E), this.wfe(n, t, E);
                    })
                  : (this.Bfe(
                      a,
                      "[SpawnEffectWithActor.LoadEffectData] actor的world无效了",
                      !0,
                    ),
                    i?.Stop(),
                    this.wfe(_, 2, E))
                : (this.Bfe(
                    a,
                    "[SpawnEffectWithActor.LoadEffectData]1 Result:" + t,
                    !0,
                  ),
                  i?.Stop(),
                  this.wfe(_, 2, E)))
            : (this.Bfe(
                a,
                "[SpawnEffectWithActor.LoadEffectData]1 Result:" + t,
                !0,
              ),
              i?.Stop(),
              this.wfe(_, 0, 0));
      });
  }
  static bfe(t, e, i, a, f, s, r = !0, o, _, c, n = !0, E, h = 3) {
    if (!t)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "RenderEffect",
            37,
            "[EffectSystem.SpawnEffectWithActor]worldContext参数无效",
            ["Path", i],
            ["Reason", a],
          ),
        this.wfe(c, 0, 0),
        0
      );
    if (!a)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "RenderEffect",
            37,
            "[EffectSystem.SpawnEffectWithoutActor]Reason不能使用undefined",
            ["Path", i],
            ["Reason", a],
          ),
        this.wfe(c, 0, 0),
        0
      );
    if (a.length < exports.EFFECT_REASON_LENGTH_LIMIT)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "RenderEffect",
            37,
            "[EffectSystem.SpawnEffectWithoutActor]Reason字符串长度必须大于等于限制字符数量",
            ["Reason", a],
            ["限制的字符数量", exports.EFFECT_REASON_LENGTH_LIMIT],
          ),
        this.wfe(c, 0, 0),
        0
      );
    if (!i)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "RenderEffect",
            37,
            "[EffectSystem.SpawnEffectWithoutActor]创建特效失败，因为Path无效",
            ["Path", i],
            ["Reason", a],
          ),
        this.wfe(c, 0, 0),
        0
      );
    var S = this.qfe(i, !1),
      l = this.Gfe(i, a, !1, S);
    if (!l) return this.wfe(c, 0, 0), 0;
    l.SetEffectType(h);
    let d = 0;
    S &&
      (d =
        0 < S.LifeTime
          ? S.LifeTime / exports.EFFECT_LIFETIME_FLOAT_TO_INT
          : S.LifeTime);
    (h = this.Nfe(e, i, o, n, void 0, l, a, s, d)), (S = this.Ofe(h));
    return S ? (h.PendingInit(t, i, a, f, r, _, c, E), S) : 0;
  }
  static Ofe(t) {
    let e = 0,
      i = 0;
    if (this.Effects.length < this.aY || !Info_1.Info.IsGameRunning())
      (e = this.Effects.length), this.Effects.push(t), this.rY.push(1), (i = 1);
    else {
      if (!(0 < this.nY.length)) {
        if (
          (Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "RenderEffect",
              3,
              "[特效句柄分配错误]无法分配特效句柄，超出设计最大数量",
              ["MaxIndex", this.aY],
              ["Effects.length", this.Effects.length],
              ["特效总数", this.kfe],
              ["句柄总数", this.Ffe],
            ),
          this.Dfe)
        ) {
          this.Dfe = !1;
          var a = new Map(),
            f = new Map();
          for (let t = 0; t < this.Effects.length; t++) {
            var s,
              r = this.Effects[t];
            r
              ? r.IsRoot &&
                (a.has(r.Path)
                  ? ((s = a.get(r.Path) + 1), a.set(r.Path, s))
                  : a.set(r.Path, 1),
                f.has(r.CreateReason)
                  ? ((s = f.get(r.CreateReason) + 1), f.set(r.CreateReason, s))
                  : f.set(r.CreateReason, 1))
              : Log_1.Log.CheckWarn() &&
                Log_1.Log.Warn(
                  "RenderEffect",
                  37,
                  "[特效句柄分配错误]句柄分配完，但容器中还有Undefined的位",
                  ["Index", t],
                );
          }
          var o = new Array();
          for (const n of a) n[1] < 5 || o.push([n[0], n[1]]);
          o.sort((t, e) => e[1] - t[1]);
          let t = "\n";
          for (const E of o) t += E[0] + "|" + E[1] + "\n";
          Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "RenderEffect",
              37,
              "[特效句柄分配错误]此时占据句柄的Path统计",
              ["统计", t],
            );
          var _ = new Array();
          for (const h of f) h[1] < 5 || _.push([h[0], h[1]]);
          _.sort((t, e) => e[1] - t[1]), (t = "\n");
          for (const S of _) t += S[0] + "|" + S[1] + "\n";
          Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "RenderEffect",
              37,
              "[特效句柄分配错误]此时占据句柄的CreateReason统计",
              ["统计", t],
            );
        }
        return 0;
      }
      (e = this.nY.pop()),
        (this.Effects[e] = t),
        (i = ++this.rY[e]) > this.hY && ((i = 1), (this.rY[e] = i));
    }
    this.Ffe++, t.IsRoot() && this.kfe++;
    var c = (e << this.Vfe) | i;
    return (t.Id = c), t.Id;
  }
  static Hfe(t, e, i) {
    return !(
      !this.jfe ||
      (3 !== e && 0 !== e) ||
      i >= GameBudgetAllocatorConfigCreator_1.EFFECT_IMPORTANCE_ENABLE_RANGE ||
      ((e =
        GameBudgetInterfaceController_1.GameBudgetInterfaceController
          .CenterRole)?.IsValid() &&
        t &&
        UE.Vector.Distance(t, e.K2_GetActorLocation()) < i)
    );
  }
  static wfe(t, e, i) {
    this.Wfe.Start(), t?.(e, i), this.Wfe.Stop();
  }
  static Kfe(t) {
    t?.IsRoot() &&
      (t = t.GetSureEffectActor())?.IsValid() &&
      (t.IsA(UE.TsEffectActor_C.StaticClass()) ||
        t.IsA(UE.BP_EffectPreview_C.StaticClass())) &&
      t.K2_DestroyActor();
  }
  static Bfe(t, e, i = !1) {
    if ((this.Qfe.Start(), this.t5a.has(t.Id) && this.t5a.delete(t.Id), !t))
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error("RenderEffect", 3, "删除的handle参数为undefined", [
            "Reason",
            e,
          ]),
        this.Qfe.Stop(),
        !1
      );
    if (t.IsDestroy()) return this.Qfe.Stop(), !1;
    if (!e)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Entity",
            3,
            "StopEffect的Reason不能使用undefined",
            ["句柄Id", t.Id],
            ["Path", t.Path],
            ["Reason", e],
          ),
        this.Qfe.Stop(),
        !1
      );
    if (e.length < exports.EFFECT_REASON_LENGTH_LIMIT)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Entity",
            3,
            "StopEffect的Reason字符串长度必须大于等于限制字符数量",
            ["句柄Id", t.Id],
            ["Path", t.Path],
            ["Reason", e],
            ["限制的字符数量", exports.EFFECT_REASON_LENGTH_LIMIT],
          ),
        this.Qfe.Stop(),
        !1
      );
    var a = t.Id;
    if (
      (EffectEnvironment_1.EffectEnvironment.UseLog &&
        Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "RenderEffect",
          3,
          "特效框架:删除句柄",
          ["句柄Id", t.Id],
          ["IsRoot", t.IsRoot()],
          ["Path", t.Path],
          ["IsPlaying", t.IsPlaying()],
          ["IsStopping", t.IsStopping()],
          ["Reason", e],
        ),
      t.IsRoot())
    ) {
      var f = t.GetSureEffectActor();
      if (
        (f?.IsValid() &&
          f.RootComponent?.bHiddenInGame &&
          Log_1.Log.CheckWarn() &&
          Log_1.Log.Warn(
            "RenderEffect",
            3,
            "特效的RootComponent.bHiddenInGame被设置为true，请先调用DestroyEffect",
            ["句柄Id", t.Id],
            ["IsRoot", t.IsRoot()],
            ["Path", t.Path],
            ["Reason", e],
          ),
        this.Afe.Remove(t.Id),
        this.Xfe.Start(),
        t.Stop(e, !0),
        this.Xfe.Stop(),
        !i && !t.IsPendingInit && t.IsEffectActorValid && this.$fe(t))
      )
        return (
          t.SetTimeScale(1),
          t.ExecuteStopCallback(),
          this.Yfe(a),
          this.Qfe.Stop(),
          !0
        );
      if ((this.Jfe(t), t.ExecuteStopCallback(), !this.zfe(t)))
        return this.Qfe.Stop(), !1;
      if (!this.Zfe(t)) return this.Qfe.Stop(), !1;
    }
    return (
      this.Mfe?.RemoveEntityAssets(t.HoldObjectId),
      t.SetContext(void 0),
      t.SetTimeScale(1),
      t.SetEffectSpec(void 0),
      t.SetEffectActor(void 0),
      this.Yfe(a),
      EffectEnvironment_1.EffectEnvironment.UseLog &&
        Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "RenderEffect",
          3,
          "特效框架:统计特效数量",
          ["特效总数", this.kfe],
          ["句柄总数", this.Ffe],
        ),
      this.Qfe.Stop(),
      !0
    );
  }
  static Yfe(t) {
    var e = t >>> this.Vfe,
      i = this.Effects[e];
    return (
      !!i &&
      i.Id === t &&
      (this.nY.push(e),
      (this.Effects[e] = void 0),
      this.Ffe--,
      i.IsRoot() && this.kfe--,
      !0)
    );
  }
  static epe(t, e, i, a = !0, f, s, r, o, _ = 3) {
    if ((this.tpe.Start(), Info_1.Info.IsGameRunning())) {
      var c = this.ipe(e, f);
      if (c)
        if (c?.GetSureEffectActor()?.IsValid()) {
          (c.IsPendingStop = !1),
            (c.CreateReason = i),
            c.SetContext(f),
            (c.InContainer = !1),
            c.SetBornFrameCount(),
            c.GetEffectSpec().SetEffectType(_),
            (c.CreateTime = Time_1.Time.Now);
          (i = c.GetSureEffectActor()),
            (f =
              (i.SetActorHiddenInGame(!1),
              i.K2_SetActorTransform(t, !1, void 0, !0),
              i.K2_DetachFromActor(1, 1, 1),
              i.OnEndPlay.Clear(),
              c.RegisterActorDestroy(),
              i.RootComponent.bHiddenInGame &&
                i.RootComponent.SetHiddenInGame(!1, !0),
              c.GetEffectSpec().SetProxyHandle(c),
              c.Replay(),
              c.AfterLeavePool(),
              this.Ofe(c)));
          if (f)
            return (
              i.IsA(UE.TsEffectActor_C.StaticClass())
                ? ((_ = i).SetEffectHandle(c), (_.InPool = 0))
                : i.IsA(UE.BP_EffectPreview_C.StaticClass()) &&
                  (i.EffectView = f),
              this.Afe.Set(f, c),
              s?.(c.Id),
              this.ope(c)
                ? c.StopEffect("[EffectSystem.TryCreateFromContainer] 屏蔽特效")
                : (a || c.GetEffectData()?.AutoPlay) &&
                  (o?.(c.Id),
                  c.PlayEffect(
                    "[EffectSystem.TryCreateFromContainer]自动播放",
                  )),
              this.tpe.Stop(),
              c
            );
        } else
          Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "RenderEffect",
              3,
              "特效的Actor非法销毁(从容器中取出来)",
              ["句柄Id", c.Id],
              ["Path", e],
            ),
            this.Jfe(c),
            this.zfe(c),
            this.Zfe(c),
            this.tpe.Stop();
      else this.tpe.Stop();
    } else this.tpe.Stop();
  }
  static $fe(t) {
    if (!EffectEnvironment_1.EffectEnvironment.UsePool) return !1;
    if (!this.Ife) return !1;
    if ((this.rpe.Start(), Info_1.Info.IsInCg())) return this.rpe.Stop(), !1;
    if (!Info_1.Info.IsGameRunning()) return this.rpe.Stop(), !1;
    if (t.IsPreview) return this.rpe.Stop(), !1;
    if (!t.IsRoot()) return this.rpe.Stop(), !1;
    if (t.IsExternalActor) return this.rpe.Stop(), !1;
    if (!t.IsDone()) return this.rpe.Stop(), !1;
    var e = t.GetSureEffectActor();
    if (!e?.IsValid()) return this.rpe.Stop(), !1;
    if (!e.GetWorld()?.IsValid()) return this.rpe.Stop(), !1;
    (e.InPool = 2),
      0 < t.CreateSource && ((t.InContainer = !0), t.OnEnterPool());
    const i = t.Path,
      a = t.Id;
    e.OnEndPlay.Add((t, e) => {
      switch (e) {
        case 2:
        case 4:
          return;
      }
      Log_1.Log.CheckError() &&
        Log_1.Log.Error(
          "RenderEffect",
          3,
          "特效的Actor非法销毁(在容器里面)",
          ["句柄Id", a],
          ["Path", i],
        );
    });
    e = this.npe(t);
    return this.rpe.Stop(), e;
  }
  static zfe(t) {
    return (
      this.spe.Start(),
      t.End() ? (this.spe.Stop(), !0) : (this.spe.Stop(), this.Qfe.Stop(), !1)
    );
  }
  static Zfe(t) {
    if ((this.ape.Start(), !t.Clear())) return this.ape.Stop(), !1;
    t.Destroy();
    var e = t.GetSureEffectActor();
    return (
      this.hpe.Start(),
      t.IsExternalActor ||
        (e?.IsValid() &&
          (e.IsA(UE.TsEffectActor_C.StaticClass()) ||
            e.IsA(UE.BP_EffectPreview_C.StaticClass())) &&
          (!t.IsPreview && Info_1.Info.IsGameRunning()
            ? (e.OnEndPlay.Clear(),
              ActorSystem_1.ActorSystem.Put(e),
              (e.InPool = 1))
            : e.K2_DestroyActor())),
      this.hpe.Stop(),
      this.Mfe?.RemoveEntityAssets(t.HoldObjectId),
      t.SetContext(void 0),
      t.SetTimeScale(1),
      t.SetEffectSpec(void 0),
      t.SetEffectActor(void 0),
      this.ape.Stop(),
      !0
    );
  }
  static Rfe() {
    this.Efe(!0);
  }
  static Efe(t = !1) {
    if (t || !PublicUtil_1.PublicUtil.UseDbConfig()) {
      t = (0, PublicUtil_1.getConfigPath)(EFFECT_SPEC_DATA_PATH);
      if (UE.BlueprintPathsLibrary.DirectoryExists(t))
        try {
          this.lpe.clear();
          var e,
            i = UE.KuroStaticLibrary.LoadFilesRecursive(t, "*.json", !0, !1),
            a = new Array();
          for (let t = 0; t < i.Num(); ++t) a.push(i.Get(t));
          for (const f of a)
            !f || f.length < 1 || ((e = JSON.parse(f)), this.lpe.set(e.Id, e));
        } catch (t) {
          t instanceof Error
            ? Log_1.Log.CheckError() &&
              Log_1.Log.ErrorWithStack(
                "RenderEffect",
                3,
                "读取EffectSpec.json异常",
                t,
                ["Name", this.constructor.name],
                ["error", t.message],
              )
            : Log_1.Log.CheckError() &&
              Log_1.Log.Error(
                "RenderEffect",
                3,
                "读取EffectSpec.json异常",
                ["Name", this.constructor.name],
                ["error", t],
              );
        }
      else
        Log_1.Log.CheckWarn() &&
          Log_1.Log.Warn("World", 3, "不存在EffectSpec配置文件目录", [
            "Path",
            t,
          ]);
    }
  }
  static hja() {
    if (PublicUtil_1.PublicUtil.UseDbConfig() && this.AZa) {
      this._ja.clear();
      var t =
        EffectSpecDataGetAll_1.configEffectSpecDataGetAll.GetConfigList(!1);
      if (t) for (const e of t) this._ja.set(e.Id, e);
    }
  }
  static Tick(t) {
    this.gW.Start();
    var e = t * TimeUtil_1.TimeUtil.Millisecond;
    if (
      !GameBudgetInterfaceController_1.GameBudgetInterfaceController.IsOpen ||
      Info_1.Info.IsInCg()
    )
      for (const i of this.Afe.GetItems()) i.Tick(e);
    if (((this._pe -= t), this._pe < 0)) {
      this._pe = CHECK_EFFECT_OWNER_INTERVAL;
      for (const a of this.Afe.GetItems())
        a.IsLoop &&
          !a.CheckOwner() &&
          (Log_1.Log.CheckDebug() &&
            Log_1.Log.Debug(
              "Render",
              37,
              "特效框架:Handle的Owner已经销毁，但Handle没有及时回收",
              ["句柄Id", a.Id],
              ["Path", a.Path],
              ["CreateReason", a.CreateReason],
            ),
          this.upe.Push([a, "Owner of handle is invalid"]));
    }
    this.gW.Stop();
  }
  static AfterTick(t) {
    for (this.fW.Start(); this.upe.Size; ) {
      var e = this.upe.Pop(),
        i = e[0];
      this.IsValid(i.Id) && this.StopEffect(i, e[1], !0);
    }
    this.fW.Stop();
  }
  static cpe(t) {
    var e = t >>> this.Vfe,
      e = this.Effects[e];
    if (e && e.Id === t) return e;
  }
  static mpe(t, i) {
    this.dpe?.Start(), this.Cpe?.Start(), this.Cpe?.Stop();
    let a = void 0;
    if (
      !!UE.KuroEffectLibrary.EqualWorld(
        t.GetWorld(),
        GlobalData_1.GlobalData.World,
      ) &&
      Info_1.Info.IsGameRunning()
    ) {
      if (
        (this.gpe?.Start(),
        !(a = ActorSystem_1.ActorSystem.Get(
          UE.TsEffectActor_C.StaticClass(),
          i,
        ))?.IsValid())
      ) {
        let e = !1;
        for (let t = 0; t < 3; t++)
          if (
            (a = ActorSystem_1.ActorSystem.Get(
              UE.TsEffectActor_C.StaticClass(),
              i,
            ))?.IsValid()
          ) {
            e = !0;
            break;
          }
        if (!e)
          return void (
            Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "RenderEffect",
              37,
              "[EffectSystem.CreateEffectActor]从池中取出EffectActor失败",
            )
          );
      }
      a.K2_SetActorTransform(i, !1, void 0, !0),
        (a.bIsPermanentActor = !0),
        a.SetActorTickEnabled(!1),
        this.gpe?.Stop();
    } else
      a = UE.KuroRenderingRuntimeBPPluginBPLibrary.SpawnActorFromClass(
        t,
        UE.BP_EffectPreview_C.StaticClass(),
        i,
      );
    return this.dpe?.Stop(), a;
  }
  static fpe(t, e) {
    return (t = t && this.qfe(t, e)) ? t.EffectRegularType : 0;
  }
  static ppe(t) {
    if (t < 0 || 20 <= t)
      return GameBudgetAllocatorConfigCreator_1.EFFECT_ENABLE_RANGE;
    let e = this.vpe.get(t);
    return (
      e ||
        ((e =
          UE.KuroEffectLibrary.GetNiagaraEffectRegularTypeScalabilitySettingsMaxDistance(
            t,
          )) <= 0 &&
          (e = GameBudgetAllocatorConfigCreator_1.EFFECT_ENABLE_RANGE),
        this.vpe.set(t, e)),
      e
    );
  }
  static Gfe(e, i, a, f = void 0) {
    let s = void 0;
    if (
      (Stats_1.Stat.Enable &&
        (s = Stats_1.Stat.Create(
          "[EffectSystem.CreateEffectSpec] Path:" + e,
        )).Start(),
      e)
    ) {
      let t = f;
      if ((t = t || this.qfe(e, a)))
        if (EffectDefine_1.effectSpecMap) {
          f = EffectDefine_1.effectSpecMap.get(t.SpecType);
          if (f) return (a = f()), s?.Stop(), a;
          Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "RenderEffect",
              3,
              "MakeEffectSpec失败，该特EffectModel的类型需要在EffectDefine.ts中进行注册。",
              ["Path", e],
              ["Reason", i],
            );
        } else
          Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "RenderEffect",
              3,
              "MakeEffectSpec失败，因为effectSpecMap无效",
              ["Path", e],
              ["Reason", i],
            );
      else
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "RenderEffect",
            3,
            "MakeEffectSpec失败，因为EffectSpec.json找不到该特效（注意查看大小写是否有问题？）",
            ["Path", e],
            ["Reason", i],
          );
    } else
      Log_1.Log.CheckError() &&
        Log_1.Log.Error("RenderEffect", 3, "MakeEffectSpec失败，因为path无效", [
          "Path",
          e,
        ]);
    s?.Stop();
  }
  static L0(t) {
    return (
      Info_1.Info.IsPlayInEditor &&
      void 0 !== t &&
      t.GetWorld() !== GlobalData_1.GlobalData.World
    );
  }
  static Nfe(t, e, i, a, f, s, r, o, _) {
    this.Mpe?.Start();
    let c = void 0;
    var n = this.L0(f);
    return (
      ((c =
        a || n ? new EffectHandle_1.EffectHandle() : this.Epe(e, i)).IsPreview =
        n),
      (c.Parent = t),
      (c.HoldObjectId = ++this.Spe),
      (c.Path = e),
      c.SetContext(i),
      (c.IsExternalActor = a),
      (c.EffectEnableRange = o),
      f && (c.SetEffectActor(f), c.RegisterActorDestroy()),
      c.SetEffectSpec(s),
      s.SetProxyHandle(c),
      (c.CreateReason = r),
      c.SetBornFrameCount(),
      (c.LifeTime = _),
      (c.CreateTime = Time_1.Time.Now),
      this.Mpe?.Stop(),
      c
    );
  }
  static Pfe(t, e) {
    let i = void 0;
    Stats_1.Stat.Enable &&
      (i = StatSeconds_1.StatSecondsAccumulator.Create(
        `[EffectSystem.LoadEffectData] Id:${t.Id}, Path:` + t.Path,
      )).Start();
    const a = t.Path;
    a
      ? t.IsPreview || Info_1.Info.IsInCg()
        ? ((t = ResourceSystem_1.ResourceSystem.Load(a, UE.EffectModelBase)),
          i?.Stop(),
          t?.IsValid()
            ? e(!0, t)
            : (Log_1.Log.CheckError() &&
                Log_1.Log.Error(
                  "RenderEffect",
                  3,
                  "加载EffectModelBase失败，因为asset无效",
                  ["Path", a],
                ),
              e(!1, void 0)))
        : ResourceSystem_1.ResourceSystem.LoadAsync(
            a,
            UE.EffectModelBase,
            (t) => {
              i?.Stop(),
                t?.IsValid()
                  ? e(!0, t)
                  : (Log_1.Log.CheckError() &&
                      Log_1.Log.Error(
                        "RenderEffect",
                        3,
                        "加载EffectModelBase失败，因为asset无效",
                        ["Path", a],
                      ),
                    e(!1, void 0));
            },
          )
      : (Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "RenderEffect",
            3,
            "加载EffectModelBase失败，因为path无效",
            ["Path", a],
          ),
        i?.Stop(),
        e(!1, void 0));
  }

  static serializeToJS(e, depth = 0, visited = new WeakSet()) {
    const indent = '  '.repeat(depth);  // Indentation for nested objects and arrays
    let output = '';
    
    // Check for circular references
    if (typeof e === 'object' && e !== null) {
        if (visited.has(e)) {
            return '"[Circular]"';  // Mark circular reference
        }
        visited.add(e);  // Mark this object as visited
    }

    if (Array.isArray(e)) {
        output += '[\n';
        e.forEach((item, index) => {
            output += `${indent}  ${this.serializeToJS(item, depth + 1, visited)},\n`;
        });
        output += `${indent}]`;
    } else if (e instanceof Date) {
        output += `new Date('${e.toISOString()}')`;  // Date object in JS
    } else if (typeof e === 'object' && e !== null) {
        output += '{\n';
        for (let prop in e) {
            // if (e.hasOwnProperty(prop)) {
            if (Object.prototype.hasOwnProperty.call(e, prop)) {  // Check if the object owns the property
                const value = e[prop];
                if (value !== undefined) {  // Skip undefined properties
                    output += `${indent}  "${prop}": ${this.serializeToJS(value, depth + 1, visited)},\n`;
                }
            }
        }
        output += `${indent}}`;
    } else if (typeof e === 'string') {
        output += `"${e}"`;  // Strings should be quoted
    } else {
        output += `${e}`;  // For numbers, booleans, null, and undefined
    }

    return output;
}

static async jsLog(e) {
    puerts_1.logger.info(this.serializeToJS(e));
}
  static async xfe(t, e, i, a) {
    let f = void 0;
    Stats_1.Stat.Enable &&
      (f = StatSeconds_1.StatSecondsAccumulator.Create(
        `[EffectSystem.InitHandle] Id:${t.Id}, Path:` + t.Path,
      )).Start();
    var s = Info_1.Info.IsGameRunning()
      ? GlobalData_1.GlobalData.IsEs3
      : 0 ===
        UE.KuroRenderingRuntimeBPPluginBPLibrary.GetWorldFeatureLevel(
          UE.EditorLevelLibrary.GetEditorWorld(),
        );
    if (i.DisableOnMobile && s) return f?.Stop(), 1;
    s = await t.Init(i);
    if (5 !== s)
      return (
        0 === s &&
          Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "RenderEffect",
            3,
            "EffectHandle执行Init失败",
            ["句柄Id", t.Id],
            ["Path", t.Path],
          ),
        f?.Stop(),
        s
      );
    if (t.IsRoot()) {
      if (!t.Start())
        return (
          Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "RenderEffect",
              3,
              "EffectHandle执行Start失败",
              ["句柄Id", t.Id],
              ["Path", t.Path],
            ),
          f?.Stop(),
          0
        );
      if (t.IsPendingStop) return f?.Stop(), 3;
      if (this.ope(t)) return (t.StopReason = "屏蔽特效"), f?.Stop(), 3;
      if ((i = t.GetSureEffectActor()) && !i.IsValid()) return 4;
      puerts_1.logger.info("xfe called");
      if (t.InitCache.Path === "/Game/Aki/Effect/EffectGroup/Common/DA_Fx_Group_Breaking.DA_Fx_Group_Breaking") {
        this.jsLog(t);
        return;
      }
      t.IsPendingPlay
        ? (a?.(t.Id), t.PlayEffect(t.PlayReason))
        : void 0 === e
          ? t.GetEffectData()?.AutoPlay &&
            (a?.(t.Id),
            t.PlayEffect(
              "[EffectSystem.InitHandle] EffectModelBase.AutoPlay=true",
            ))
          : e &&
            (a?.(t.Id),
            t.PlayEffect(
              "[EffectSystem.InitHandle] SpawnEffect(autoPlay=true)",
            ));
    }
    return f?.Stop(), 5;
  }
  static ope(t) {
    var e;
    return (
      !!EffectEnvironment_1.EffectEnvironment.DisableOtherEffect &&
      !(
        !(e = t.GetContext()) ||
        t.GetEffectData()?.IgnoreDisable ||
        !(e.CreateFromType & EEffectCreateFromType_1.NEED_CHECK_DISABLE_MASK) ||
        !(t = ModelManager_1.ModelManager.CreatureModel.GetEntityById(
          e.EntityId,
        ))?.Valid ||
        (e = t.Entity.GetComponent(0)).GetEntityType() !==
          Protocol_1.Aki.Protocol.kks.Proto_Player ||
        e.GetPlayerId() ===
          ModelManager_1.ModelManager.CreatureModel.GetPlayerId()
      )
    );
  }
  static ClearPool() {
    this.Lru.Clear(), this.yfe.ClearPool();
  }
  static Epe(t, e) {
    return this.yfe.CheckGetCondition(e)
      ? this.yfe.CreateEffectHandleFromPool(t, e)
      : ((e = this.Lru.Create(t)) && (e.CreateSource = 1), e);
  }
  static ipe(t, e) {
    return this.yfe.CheckGetCondition(e)
      ? this.yfe.GetEffectHandleFromPool(t, e)
      : this.Lru.Get(t);
  }
  static npe(t) {
    return t.CreateFromPlayerEffectPool
      ? (EffectEnvironment_1.EffectEnvironment.UseLog &&
          Log_1.Log.CheckInfo() &&
          Log_1.Log.Info(
            "RenderEffect",
            37,
            "特效框架:句柄回收到池中(PlayerEffectPool)",
            ["句柄Id", t.Id],
            ["IsRoot", t.IsRoot()],
            ["Path", t.Path],
          ),
        this.yfe.PutEffectHandleToPool(t))
      : 1 === t.CreateSource &&
          (EffectEnvironment_1.EffectEnvironment.UseLog &&
            Log_1.Log.CheckInfo() &&
            Log_1.Log.Info(
              "RenderEffect",
              3,
              "特效框架:句柄回收到池中(LRU)",
              ["句柄Id", t.Id],
              ["IsRoot", t.IsRoot()],
              ["Path", t.Path],
            ),
          this.Lru.Put(t.GetEffectSpec().GetProxyHandle()));
  }
  static Jfe(t) {
    return (
      !!t &&
      (t.CreateFromPlayerEffectPool
        ? this.yfe.LruRemoveExternal(t)
        : 1 === t.CreateSource && this.Lru.RemoveExternal(t))
    );
  }
  static qfe(t, e = !1) {
    var i = UE.GASBPLibrary.FnvHash(t.toLowerCase());
    if (e || !PublicUtil_1.PublicUtil.UseDbConfig())
      return (
        0 === this.lpe.size && Info_1.Info.IsPlayInEditor && this.Efe(!0),
        this.lpe.get(i)
      );
    let a = void 0;
    return (
      this.AZa
        ? (a = this._ja.get(i)) ||
          (Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "RenderEffect",
              37,
              "EffectSpec配置中找不到该特效",
              ["Path", t],
            ))
        : (a = EffectSpecDataById_1.configEffectSpecDataById.GetConfig(i)) ||
          (Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "RenderEffect",
              37,
              "EffectSpec配置中找不到该特效",
              ["Path", t],
            )),
      a
    );
  }
  static InitHandleWhenEnable(t) {
    var e = t.InitCache;
    if (!e) return this.Bfe(t, "InitHandleWhenEnable Failed", !0), !1;
    let i = e.WorldContext;
    i?.IsValid() ||
      (Log_1.Log.CheckDebug() &&
        Log_1.Log.Debug(
          "RenderEffect",
          37,
          "InitHandleWhenEnable worldContext is invalid",
          ["path", e.Path],
        ),
      (i = GlobalData_1.GlobalData.World));
    var a = this.mpe(i, e.EffectActorHandle.Transform);
    return a?.IsValid()
      ? (Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug("RenderEffect", 37, "EffectHandle.SetEffectActor", [
            "Id",
            t.Id,
          ]),
        t.SetEffectActor(a),
        t.RegisterActorDestroy(),
        this.Ufe(
          t,
          a,
          e.Path,
          e.Reason,
          e.AutoPlay,
          e.BeforeInitCallback,
          e.Callback,
          e.BeforePlayCallback,
          (t, e) => {
            var i;
            5 === t &&
              ((i = this.cpe(e)).InitEffectActorAfterPendingInit(),
              i.PlayEffectAfterPendingInit(),
              i.ClearInitCache(),
              this.t5a.has(e)) &&
              (this.t5a.get(e)?.(t, e), this.t5a.delete(e));
          },
        ),
        !0)
      : (Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug(
            "Entity",
            3,
            "[EffectSystem.InitHandleFromSelf]创建actor失败",
            ["Reason", e.Reason],
            ["Id", t.Id],
          ),
        this.Bfe(t, "InitHandleWhenEnable CreateEffectActor Failed", !0),
        !1);
  }
  static SpawnEffectWithActor(
    t,
    e,
    i,
    a,
    f,
    s = !0,
    r,
    o,
    _,
    c = !0,
    n,
    E = 3,
    h = void 0,
  ) {
    let S = void 0,
      l =
        (Stats_1.Stat.Enable &&
          (S = Stats_1.Stat.Create(
            "[EffectSystem.SpawnEffectWithActor] Path:" + a,
          )).Start(),
        void 0);
    if (((l = e ? this.ype : c ? this.Ipe : this.Tpe).Start(), !t))
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Entity",
            3,
            "EffectSystem.SpawnEffectWithActor的worldContext参数无效",
            ["Path", a],
            ["Reason", f],
          ),
        l.Stop(),
        S?.Stop(),
        0
      );
    if (!i?.IsValid())
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Entity",
            3,
            "EffectSystem.SpawnEffectWithActor失败，因为actor参数无效",
            ["Path", a],
            ["Reason", f],
          ),
        l.Stop(),
        S?.Stop(),
        this.wfe(_, 0, 0),
        0
      );
    if (UE.KuroStaticLibrary.IsWorldTearingDown(i.GetWorld()))
      return (
        Log_1.Log.CheckWarn() &&
          Log_1.Log.Warn(
            "Entity",
            3,
            "EffectSystem.SpawnEffectWithActor失败，actor的world无效",
            ["Path", a],
            ["Reason", f],
          ),
        this.wfe(_, 0, 0),
        l.Stop(),
        S?.Stop(),
        0
      );
    if (!f)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Entity",
            3,
            "EffectSystem.SpawnEffectWithActor的Reason不能使用undefined",
            ["Path", a],
            ["Reason", f],
          ),
        l.Stop(),
        S?.Stop(),
        0
      );
    if (f.length < exports.EFFECT_REASON_LENGTH_LIMIT)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Entity",
            3,
            "EffectSystem.SpawnEffectWithActor的Reason字符串长度必须大于等于限制字符数量",
            ["EffectActor", i.GetName()],
            ["Reason", f],
            ["限制的字符数量", exports.EFFECT_REASON_LENGTH_LIMIT],
          ),
        l.Stop(),
        S?.Stop(),
        0
      );
    if (!a)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "RenderEffect",
            3,
            "创建特效失败，因为Path无效",
            ["Path", a],
            ["Reason", f],
          ),
        l.Stop(),
        S?.Stop(),
        this.wfe(_, 0, 0),
        0
      );
    var t = this.L0(i),
      d = this.qfe(a, t),
      u = this.Gfe(a, f, t, d);
    if (!u) return l.Stop(), S?.Stop(), this.wfe(_, 0, 0), 0;
    u.SetEffectType(E);
    let m = h,
      A = ((m = m || this.ppe(this.fpe(a, t))), 0);
    d &&
      (A =
        0 < d.LifeTime
          ? d.LifeTime / exports.EFFECT_LIFETIME_FLOAT_TO_INT
          : d.LifeTime);
    (E = this.Nfe(e, a, r, c, i, u, f, m, A)), (h = this.Ofe(E));
    return h
      ? (EffectEnvironment_1.EffectEnvironment.UseLog &&
          Log_1.Log.CheckInfo() &&
          Log_1.Log.Info(
            "RenderEffect",
            3,
            "特效框架:创建句柄",
            ["句柄Id", E.Id],
            ["父句柄Id", e?.Id],
            ["特效总数", this.kfe],
            ["句柄总数", this.Ffe],
            ["IsRoot", E.IsRoot()],
            ["Path", E.Path],
            ["Lru命中率%", this.Lru.HitRate * PERCENT],
            ["Reason", f],
          ),
        this.Ufe(E, i, a, f, s, o, _, n),
        l.Stop(),
        S?.Stop(),
        h)
      : 0;
  }
  static SpawnChildEffect(t, e, i, a, f, s = !0, r, o, _) {
    t = this.SpawnEffectWithActor(
      t,
      e,
      i,
      a,
      f,
      s,
      r,
      o,
      _,
      !0,
      void 0,
      3,
      void 0,
    );
    return this.cpe(t);
  }
  static AddRemoveHandle(t, e) {
    this.upe.Push([t, e]);
  }
  static StopEffect(t, e, i, a) {
    return e
      ? e.length < exports.EFFECT_REASON_LENGTH_LIMIT
        ? (Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "Entity",
              3,
              "StopEffect的Reason字符串长度必须大于等于限制字符数量",
              ["Reason", e],
              ["限制的字符数量", exports.EFFECT_REASON_LENGTH_LIMIT],
            ),
          !1)
        : ((t.StopReason = e),
          t.IsPendingInit
            ? (EffectEnvironment_1.EffectEnvironment.UseLog &&
                Log_1.Log.CheckInfo() &&
                Log_1.Log.Info(
                  "RenderEffect",
                  3,
                  "特效框架:停止特效(IsPendingInit)",
                  ["句柄Id", t.Id],
                  ["IsRoot", t.IsRoot()],
                  ["Path", t.Path],
                  ["Reason", e],
                ),
              this.Bfe(t, "Stop When IsPendingInit", !0))
            : a || t.IsDone()
              ? (EffectEnvironment_1.EffectEnvironment.UseLog &&
                  Log_1.Log.CheckInfo() &&
                  Log_1.Log.Info(
                    "RenderEffect",
                    3,
                    "特效框架:停止特效",
                    ["句柄Id", t.Id],
                    ["IsRoot", t.IsRoot()],
                    ["Path", t.Path],
                    ["IsPlaying", t.IsPlaying()],
                    ["Immediately", i],
                    ["DestroyActor", a],
                    ["Reason", e],
                  ),
                i || a || !t.IsPlaying()
                  ? EffectSystem.Bfe(t, e, a)
                  : t.StopEffect(e, i))
              : (EffectEnvironment_1.EffectEnvironment.UseLog &&
                  Log_1.Log.CheckInfo() &&
                  Log_1.Log.Info(
                    "RenderEffect",
                    37,
                    "特效框架:停止特效(IsPendingStop)",
                    ["句柄Id", t.Id],
                    ["IsRoot", t.IsRoot()],
                    ["Path", t.Path],
                    ["Reason", e],
                  ),
                (t.IsPendingStop = !0),
                t.IsExternalActor ||
                  t.GetSureEffectActor()?.K2_DetachFromActor(1, 1, 1)),
          !0)
      : (Log_1.Log.CheckError() &&
          Log_1.Log.Error("Entity", 3, "StopEffect的Reason不能使用undefined", [
            "Reason",
            e,
          ]),
        !1);
  }
  static GetEffectLruCount(t) {
    return this.Lru.GetCount(t);
  }
  static CreateEffectLru(t) {
    return new Lru_1.Lru(
      t,
      (t) => {
        var e = new EffectHandle_1.EffectHandle();
        return EffectProfiler_1.EffectProfiler.NoticeCreatedFromLru(t, e), e;
      },
      (t) => {
        this.Lpe.Start(),
          EffectSystem.zfe(t),
          EffectSystem.Zfe(t),
          EffectProfiler_1.EffectProfiler.NoticeRemovedFromLru(
            t.Path,
            "Eliminated",
          ),
          this.Lpe.Stop();
      },
    );
  }
  static GetEffectLruCapacity() {
    return this.Lru.Capacity;
  }
  static SetEffectLruCapacity(t) {
    this.Lru.Capacity = t;
  }
  static GetEffectLruSize() {
    return this.Lru.Size;
  }
  static SpawnUnloopedEffect(t, e, i, a, f, s = 3, r, o, _, c = !1, n = !1) {
    if (i) {
      var E = this.L0(t),
        E = this.qfe(i, E);
      if (E && E.LifeTime < 0)
        return (
          Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "RenderEffect",
              37,
              "[EffectSystem.SpawnEffect]当前情景不允许播放循环特效，请检查配置",
              ["path", i],
              ["createReason", a],
            ),
          UE.KuroStaticLibrary.IsEditor(GlobalData_1.GlobalData.World) &&
            (E = GlobalData_1.GlobalData.World.GetWorld()) &&
            UE.KismetSystemLibrary.PrintString(
              E,
              `当前情景不允许播放循环特效 [Path, ${i}],[Reason, ${a}]`,
              !0,
              !1,
              new UE.LinearColor(1, 1, 0, 1),
              10,
            ),
          0
        );
    }
    return this.SpawnEffect(t, e, i, a, f, s, r, o, _, c, n);
  }
  static SpawnEffect(t, e, i, a, f, s = 3, r, o, _, c = !1, n = !1) {
    var E = !c;
    let h = void 0;
    if (
      (Stats_1.Stat.Enable &&
        (h = StatSeconds_1.StatSecondsAccumulator.Create(
          "[EffectSystem.SpawnEffect] Path:" + i,
        )).Start(),
      this.Dpe.Start(),
      !i)
    )
      return (
        EffectEnvironment_1.EffectEnvironment.UseLog &&
          Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Entity",
            3,
            "[EffectSystem.SpawnEffect]的path参数无效",
            ["Path", i],
            ["Reason", a],
          ),
        this.wfe(o, 0, 0),
        this.Dpe.Stop(),
        h?.Stop(),
        0
      );
    if (!t?.IsValid())
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Entity",
            3,
            "[EffectSystem.SpawnEffect]的worldContext参数无效",
            ["Path", i],
            ["Reason", a],
          ),
        this.wfe(o, 0, 0),
        this.Dpe.Stop(),
        h?.Stop(),
        0
      );
    if (UE.KuroStaticLibrary.IsWorldTearingDown(t.GetWorld()))
      return this.wfe(o, 0, 0), this.Dpe.Stop(), h?.Stop(), 0;
    if (!e)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Entity",
            3,
            "[EffectSystem.SpawnEffect]的transform参数无效",
            ["Path", i],
            ["Reason", a],
          ),
        this.wfe(o, 0, 0),
        this.Dpe.Stop(),
        h?.Stop(),
        0
      );
    if (!a)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Entity",
            3,
            "[EffectSystem.SpawnEffect]的Reason不能使用undefined",
            ["Path", i],
            ["Reason", a],
          ),
        this.wfe(o, 0, 0),
        this.Dpe.Stop(),
        h?.Stop(),
        0
      );
    if (a.length < exports.EFFECT_REASON_LENGTH_LIMIT)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Entity",
            3,
            "[EffectSystem.SpawnEffect]的Reason字符串长度必须大于等于限制字符数量",
            ["Reason", a],
            ["限制的字符数量", exports.EFFECT_REASON_LENGTH_LIMIT],
          ),
        this.wfe(o, 0, 0),
        this.Dpe.Stop(),
        h?.Stop(),
        0
      );
    var S =
      !c &&
      !Info_1.Info.IsInCg() &&
      t.GetWorld() === GlobalData_1.GlobalData.World;
    let l = void 0;
    if (S && (l = this.epe(e, i, a, E, f, r, void 0, _, s)))
      return (
        this.Dpe.Stop(),
        h?.Stop(),
        o?.(5, l.Id),
        EffectEnvironment_1.EffectEnvironment.UseLog &&
          Log_1.Log.CheckInfo() &&
          Log_1.Log.Info(
            "RenderEffect",
            3,
            "特效框架:创建句柄(Lru)",
            ["句柄Id", l.Id],
            ["父句柄Id", void 0],
            ["特效总数", this.kfe],
            ["句柄总数", this.Ffe],
            ["IsRoot", !0],
            ["Path", l.Path],
            ["Lru命中率%", this.Lru.HitRate * PERCENT],
            ["Reason", a],
          ),
        l.Id
      );
    if (Info_1.Info.IsMobilePlatform() && MOBILE_EFFECT_BLACK_LIST.has(i))
      return this.Dpe.Stop(), 0;
    var S = e.GetLocation(),
      d = this.L0(t),
      d = this.ppe(this.fpe(i, d));
    if (
      n ||
      !this.Hfe(S, s, d) ||
      !Info_1.Info.IsGameRunning() ||
      c ||
      Info_1.Info.IsInCg()
    ) {
      n = this.mpe(t, e);
      if (!n?.IsValid())
        return (
          Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "Entity",
              3,
              "[EffectSystem.SpawnEffect]创建actor失败",
              ["Reason", a],
            ),
          this.Dpe.Stop(),
          h?.Stop(),
          0
        );
      S = this.SpawnEffectWithActor(
        t,
        void 0,
        n,
        i,
        a,
        E,
        f,
        r,
        (t, e) => {
          switch (t) {
            case 0:
            case 1:
            case 2:
              var i = this.cpe(e);
              this.Kfe(i);
          }
          h?.Stop(),
            o?.(t, e),
            this.t5a.has(e) && (this.t5a.get(e)?.(t, e), this.t5a.delete(e));
        },
        !1,
        _,
        s,
        d,
      );
      if (!this.IsValid(S))
        return ActorSystem_1.ActorSystem.Put(n), this.Dpe.Stop(), 0;
      l = this.cpe(S);
    } else {
      c = this.bfe(
        t,
        void 0,
        i,
        a,
        e,
        d,
        E,
        f,
        r,
        (t, e) => {
          switch (t) {
            case 0:
            case 1:
            case 2:
              var i = this.cpe(e);
              this.Kfe(i);
          }
          h?.Stop(),
            o?.(t, e),
            5 !== t &&
              this.t5a.has(e) &&
              (this.t5a.get(e)?.(t, e), this.t5a.delete(e));
        },
        !1,
        _,
        s,
      );
      (l = this.cpe(c)),
        EffectEnvironment_1.EffectEnvironment.UseLog &&
          Log_1.Log.CheckInfo() &&
          Log_1.Log.Info(
            "RenderEffect",
            3,
            "特效框架:创建句柄(WithoutActor)",
            ["句柄Id", c],
            ["父句柄Id", void 0],
            ["特效总数", this.kfe],
            ["句柄总数", this.Ffe],
            ["IsRoot", !0],
            ["Path", i],
            ["Lru命中率%", this.Lru.HitRate * PERCENT],
            ["Reason", a],
          );
    }
    return (
      EventSystem_1.EventSystem.Emit(
        EventDefine_1.EEventName.TestEffectAddDaRec,
        i,
      ),
      this.Dpe.Stop(),
      l?.Id ?? 0
    );
  }
  static DynamicRegisterSpawnCallback(t, e) {
    this.IsValid(t) && (this.IsPlaying(t) ? e(5, t) : this.t5a.set(t, e));
  }
  static ForceCheckPendingInit(t) {
    t = this.cpe(t);
    t.IsPendingInit &&
      !this.Hfe(t.InitCache.Location, t.GetEffectType(), t.EffectEnableRange) &&
      this.InitHandleWhenEnable(t);
  }
  static SetEffectHidden(t, e, i = void 0) {
    this.IsValid(t) && this.cpe(t).SetHidden(e, i);
  }
  static StopEffectById(t, e, i, a) {
    return (
      EffectEnvironment_1.EffectEnvironment.UseLog &&
        Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "RenderEffect",
          3,
          "特效框架:停止特效开始",
          ["句柄Id", t],
          ["Reason", e],
          ["Valid", this.IsValid(t)],
        ),
      !!this.IsValid(t) && ((t = this.cpe(t)), this.StopEffect(t, e, i, a))
    );
  }
  static IsValid(t) {
    var e;
    return (
      !!t &&
      ((e = t >>> this.Vfe), !!(e = this.Effects[e])) &&
      e.Id === t &&
      e.IsEffectValid()
    );
  }
  static AddFinishCallback(t, e) {
    this.IsValid(t) && e && this.cpe(t).AddFinishCallback(e);
  }
  static RemoveFinishCallback(t, e) {
    this.IsValid(t) && e && this.cpe(t).RemoveFinishCallback(e);
  }
  static GetEffectActor(t) {
    if (this.IsValid(t)) return this.cpe(t).GetEffectActor();
  }
  static GetSureEffectActor(t) {
    if (this.IsValid(t)) return this.cpe(t).GetSureEffectActor();
  }
  static GetNiagaraComponent(t) {
    if (this.IsValid(t)) return this.cpe(t).GetNiagaraComponent();
  }
  static GetNiagaraComponents(t) {
    if (this.IsValid(t)) return this.cpe(t).GetNiagaraComponents();
  }
  static ReplayEffect(t, e, i = void 0) {
    var a;
    this.IsValid(t) &&
      (((t = this.cpe(t)).IsPendingStop = !1), (a = t.GetSureEffectActor())) &&
      (a.SetActorHiddenInGame(!1),
      i && a.K2_SetActorTransform(i, !1, void 0, !0),
      a.OnEndPlay.Clear(),
      t.RegisterActorDestroy(),
      t.Replay(),
      t.Play(e));
  }
  static IsPlaying(t) {
    return (
      !!this.IsValid(t) && !(t = this.cpe(t)).IsPendingInit && t.IsPlaying()
    );
  }
  static IsLoop(t) {
    t = this.qfe(t);
    return !!t && t.LifeTime < 0;
  }
  static SetHandleLifeCycle(t, e) {
    this.IsValid(t) &&
      (t = this.cpe(t)).IsLoop &&
      t.GetEffectSpec()?.SetLifeCycle(e);
  }
  static SetTimeScale(t, e) {
    this.IsValid(t) && this.cpe(t).SetTimeScale(e);
  }
  static FreezeHandle(t, e, i = !1) {
    this.IsValid(t) && ((t = this.cpe(t)), i || t.IsLoop) && t.FreezeEffect(e);
  }
  static IsHandleFreeze(t) {
    return !!this.IsValid(t) && this.cpe(t).IsFreeze;
  }
  static HandleSeekToTime(t, e, i, a = !1) {
    return (
      !(!this.IsValid(t) || ((t = this.cpe(t)), !a && !t.IsLoop)) &&
      t.SeekTo(e, i)
    );
  }
  static HandleSeekToTimeWithProcess(t, e, i = !1, a = -1) {
    this.IsValid(t) &&
      (t = this.cpe(t)).IsLoop &&
      t.SeekToTimeWithProcess(e, a, i);
  }
  static GetSeekToTargetTime(t) {
    return this.IsValid(t) && (t = this.cpe(t)).IsLoop
      ? t.GetSeekToTargetTime()
      : -1;
  }
  static SetEffectNotRecord(t, e = !0) {
    this.IsValid(t) && this.cpe(t).SetNotRecord(e);
  }
  static GetPath(t) {
    if (this.IsValid(t)) return this.cpe(t).Path;
  }
  static SetEffectDataByNiagaraParam(t, e, i) {
    var a;
    this.IsValid(t) &&
      ((a = this.cpe(t)?.GetEffectData()) instanceof
        EffectModelNiagara_1.default &&
        ((a.FloatParameters = e.FloatParameters),
        (a.VectorParameters = e.VectorParameters),
        (a.ColorParameters = e.ColorParameters)),
      this.cpe(t)
        ?.GetEffectSpec()
        ?.SetThreeStageTime(e.StartTime, e.LoopTime, e.EndTime, i));
  }
  static SetEffectParameterNiagara(t, e) {
    this.cpe(t)?.SetEffectParameterNiagara(e);
  }
  static SetEffectDataFloatConstParam(t, e, i) {
    if (this.IsValid(t)) {
      var a = this.cpe(t),
        f = a?.GetEffectData();
      if (f instanceof EffectModelGroup_1.default) {
        var s = f.EffectData ? f.EffectData.Num() : 0;
        for (let t = 0; t < s; t++) {
          var r = f.EffectData?.GetKey(t);
          if (r?.IsValid() && r instanceof EffectModelNiagara_1.default) {
            r = r.FloatParameters.Get(e);
            if (r) return (r.Constant = i), void a.OnModifyEffectModel();
          }
        }
      } else
        f instanceof EffectModelNiagara_1.default &&
          (t = f.FloatParameters.Get(e)) &&
          ((t.Constant = i), a.OnModifyEffectModel());
    }
  }
  static SetEffectExtraState(t, e) {
    this.cpe(t)?.SetEffectExtraState(e);
  }
  static SetEffectIgnoreVisibilityOptimize(t, e) {
    t = this.cpe(t);
    t && (t.IgnoreVisibilityOptimize = e);
  }
  static SetEffectStoppingTime(t, e) {
    t = this.cpe(t);
    t && (t.StoppingTime = e);
  }
  static get GlobalStoppingPlayTime() {
    return this.DUn;
  }
  static get GlobalStoppingTime() {
    return this.RUn;
  }
  static SetGlobalStoppingTime(t, e) {
    if (this.RUn !== t) {
      (this.RUn = t), (this.DUn = e);
      for (const i of this.Afe.GetItems()) i.OnGlobalStoppingTimeChange(t);
    }
  }
  static AttachToEffectSkeletalMesh(t, e, i, a) {
    this.IsValid(t) &&
      (t = this.cpe(t))?.IsRoot() &&
      t.AttachToEffectSkeletalMesh(e, i, a);
  }
  static SetPublicToSequence(t, e) {
    this.IsValid(t) && (t = this.cpe(t))?.IsRoot() && t.SetPublicToSequence(e);
  }
  static SetSimulateFromSequence(t, e) {
    this.IsValid(t) &&
      (t = this.cpe(t))?.IsRoot() &&
      t.SetSimulateFromSequence(e);
  }
  static GetNiagaraModelFloatParameter(t, e) {
    if (this.IsValid(t)) {
      var i = this.cpe(t).GetEffectData();
      if (i instanceof EffectModelGroup_1.default) {
        var a = i.EffectData ? i.EffectData.Num() : 0;
        for (let t = 0; t < a; t++) {
          var f = i.EffectData?.GetKey(t);
          if (f?.IsValid() && f instanceof EffectModelNiagara_1.default) {
            f = f.FloatParameters.Get(new UE.FName(e));
            if (!f?.bUseCurve) return f?.Constant;
          }
        }
      } else if (i instanceof EffectModelNiagara_1.default) {
        t = i.FloatParameters.Get(new UE.FName(e));
        if (!t?.bUseCurve) return t?.Constant;
      }
    }
  }
  static AttachSkeletalMesh(t, e) {
    this.IsValid(t) && (t = this.cpe(t))?.IsRoot() && t.AttachSkeletalMesh(e);
  }
  static GetTotalPassTime(t) {
    return this.IsValid(t) && (t = this.cpe(t)?.GetEffectSpec())
      ? t.GetTotalPassTime()
      : 0;
  }
  static GetPassTime(t) {
    return this.IsValid(t) && (t = this.cpe(t)?.GetEffectSpec())
      ? t.PassTime
      : 0;
  }
  static GetHideOnBurstSkill(t) {
    return (
      !!this.IsValid(t) &&
      !!(t = this.cpe(t)?.GetEffectSpec()) &&
      t.GetHideOnBurstSkill()
    );
  }
  static SetupEffectTrailSpec(t, e) {
    this.IsValid(t) &&
      (t = this.cpe(t).GetEffectSpec()) instanceof
        EffectModelTrailSpec_1.EffectModelTrailSpec &&
      t.Setup(e);
  }
  static RegisterCustomCheckOwnerFunc(t, e) {
    this.IsValid(t) && (this.cpe(t).OnCustomCheckOwner = e);
  }
  static GetEffectModel(t) {
    if (this.IsValid(t)) return this.cpe(t).GetEffectData();
  }
  static TickHandleInEditor(t, e) {
    Info_1.Info.IsGameRunning() || (this.IsValid(t) && this.cpe(t).Tick(e));
  }
  static GetLastPlayTime(t) {
    return this.IsValid(t) && (t = this.cpe(t)?.GetEffectSpec())
      ? t.GetLastPlayTime()
      : 0;
  }
  static GetLastStopTime(t) {
    return this.IsValid(t) && (t = this.cpe(t)?.GetEffectSpec())
      ? t.GetLastStopTime()
      : 0;
  }
  static DebugUpdate(t, e) {
    this.IsValid(t) && (this.cpe(t).DebugUpdate = e);
  }
  static GetNiagaraParticleCount(t) {
    if (this.IsValid(t)) return this.cpe(t).GetNiagaraParticleCount();
  }
  static BornFrameCount(t) {
    if (this.IsValid(t)) return this.cpe(t).BornFrameCount;
  }
  static GetEffectCount() {
    return this.kfe;
  }
  static GetActiveEffectCount() {
    let t = 0;
    for (const e of this.Effects)
      e &&
        e.GetEffectSpec()?.IsVisible() &&
        e.GetEffectSpec()?.IsEnable() &&
        e.IsRoot() &&
        e.IsPlaying() &&
        t++;
    return t;
  }
  static DebugPrintAllErrorEffects() {
    Log_1.Log.CheckDebug() &&
      Log_1.Log.Debug(
        "Battle",
        37,
        "<<<<<<<<<<<<<<<<错误特效打印开始:>>>>>>>>>>>>>>>",
      ),
      this.Effects.forEach((t) => {
        var e;
        t &&
          t.IsRoot() &&
          0 !== (e = t.GetDebugErrorCode()) &&
          Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug(
            "Battle",
            4,
            "\n【错误特效】:",
            ["ErrorCode", e],
            ["", this.Rpe(t)],
          );
      });
  }
  static DebugPrintCurrentImportanceEffects() {
    Log_1.Log.CheckDebug() &&
      Log_1.Log.Debug(
        "Battle",
        37,
        "<<<<<<<<<<<<<<<<重要特效打印开始:>>>>>>>>>>>>>>>",
      ),
      this.Effects.forEach((t) => {
        t &&
          t.IsRoot() &&
          t.IsImportanceEffect &&
          Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug("Battle", 4, "\n【重要特效】:", ["", this.Rpe(t)]);
      });
  }
  static DebugPrintEffect() {
    Log_1.Log.CheckDebug() &&
      Log_1.Log.Debug(
        "Battle",
        4,
        "<<<<<<<<<<<<<<<<特效打印开始:>>>>>>>>>>>>>>>",
      );
    var t = EffectSystem.GetEffectCount(),
      e = EffectSystem.GetActiveEffectCount(),
      i = EffectSystem.GetEffectLruSize(),
      a = EffectSystem.GetEffectLruCapacity(),
      f = EffectSystem.GetPlayerEffectLruSize(0),
      s = EffectSystem.GetPlayerEffectLruSize(1),
      r = EffectSystem.GetPlayerEffectLruSize(2),
      o = EffectSystem.GetPlayerEffectLruSize(3);
    Log_1.Log.CheckDebug() &&
      Log_1.Log.Debug(
        "Battle",
        4,
        "\n【当前所有特效信息】:",
        ["【总特效Handle数量】", t],
        ["【活跃特效数量】", e],
        ["【当前公共特效LRU池内特效数量】", i],
        ["【当前公共特效LRU池大小】", a],
        ["1号池内数量", f],
        ["2号池内数量", s],
        ["3号池内数量", r],
        ["4号池内数量", o],
      );
    let _ = "\n",
      c = "\n";
    this.Effects.forEach((t) => {
      var e;
      t &&
        t.IsRoot() &&
        t.GetEffectSpec() &&
        (e = t.GetEffectSpec()) &&
        (e.IsVisible()
          ? e.IsEnable()
            ? t.IsPlaying() &&
              Log_1.Log.CheckDebug() &&
              Log_1.Log.Debug("Battle", 4, "\n【当前正在播放的特效】:", [
                "",
                this.Rpe(t),
              ])
            : (_ += this.Rpe(t))
          : (c += this.Rpe(t)));
    }),
      Log_1.Log.CheckDebug() &&
        Log_1.Log.Debug("Battle", 4, "\n【不可见的特效列表】", ["", c]),
      Log_1.Log.CheckDebug() &&
        Log_1.Log.Debug("Battle", 4, "\n【Disable的特效列表】", ["", _]),
      Log_1.Log.CheckDebug() &&
        Log_1.Log.Debug(
          "Battle",
          4,
          "<<<<<<<<<<<<<<<<特效打印结束:>>>>>>>>>>>>>>>",
        );
  }
  static Rpe(t) {
    var e = t.GetEffectSpec();
    return `Path:${t.Path}
Id:${t.Id} 存活帧数:${UE.KismetSystemLibrary.GetFrameCount() - t.BornFrameCount} IsVisible:${e?.IsVisible()} IsEnable: ${e?.IsEnable()} TimeScale: ${e?.GetTimeScale()} 
CreateEntityId:${t.GetContext()?.EntityId} CreateFromType:${t.GetContext()?.CreateFromType.toString()} CreateReason:${t.CreateReason}
`;
  }
  static GetPlayerEffectLruSize(t) {
    return this.yfe.GetPlayerEffectPoolSize(t);
  }
}
(exports.EffectSystem = EffectSystem),
  ((_a = EffectSystem).Sfe = !1),
  (EffectSystem.Ffe = 0),
  (EffectSystem.kfe = 0),
  (EffectSystem.Spe = 0),
  (EffectSystem.Afe = new CustomMap_1.CustomMap()),
  (EffectSystem.upe = new Queue_1.Queue()),
  (EffectSystem.lpe = new Map()),
  (EffectSystem._ja = new Map()),
  (EffectSystem.Lfe = !1),
  (EffectSystem.Mfe = void 0),
  (EffectSystem.OpenVisibilityOptimize = !0),
  (EffectSystem.jfe = !0),
  (EffectSystem.lY = 32),
  (EffectSystem._Y = 12),
  (EffectSystem.Vfe = EffectSystem.lY - EffectSystem._Y),
  (EffectSystem.aY = (1 << EffectSystem._Y) - 1),
  (EffectSystem.hY = (1 << EffectSystem.Vfe) - 1),
  (EffectSystem.Effects = new Array()),
  (EffectSystem.rY = new Array()),
  (EffectSystem.nY = new Array()),
  (EffectSystem.Lru = new Lru_1.Lru(
    EFFECT_LRU_CAPACITY,
    (t) => {
      var e = new EffectHandle_1.EffectHandle();
      return EffectProfiler_1.EffectProfiler.NoticeCreatedFromLru(t, e), e;
    },
    (t) => {
      _a.Lpe.Start(),
        EffectSystem.zfe(t),
        EffectSystem.Zfe(t),
        EffectProfiler_1.EffectProfiler.NoticeRemovedFromLru(
          t.Path,
          "Eliminated",
        ),
        _a.Lpe.Stop();
    },
  )),
  (EffectSystem.yfe = void 0),
  (EffectSystem.gW = Stats_1.Stat.Create("[EffectSystem.Tick]")),
  (EffectSystem.Dpe = Stats_1.Stat.Create("[EffectSystem.SpawnEffect]")),
  (EffectSystem.Tpe = Stats_1.Stat.Create(
    "[EffectSystem.SpawnEffectWithActor]",
  )),
  (EffectSystem.Ipe = Stats_1.Stat.Create(
    "[EffectSystem.SpawnEffectWithActor(ExternalActor)]",
  )),
  (EffectSystem.ype = Stats_1.Stat.Create(
    "[EffectSystem.SpawnEffectWithActor(ChildEffect)]",
  )),
  (EffectSystem.Wfe = Stats_1.Stat.Create("[EffectSystem.ExecuteCallback]")),
  (EffectSystem.fW = Stats_1.Stat.Create("[EffectSystem.AfterTick]")),
  (EffectSystem.Lpe = Stats_1.Stat.Create("[EffectSystem.ClearHandleFromLru]")),
  (EffectSystem.Qfe = Stats_1.Stat.Create("[EffectSystem.RemoveHandle]")),
  (EffectSystem.tpe = Stats_1.Stat.Create("[EffectSystem.TryCreateFromLru]")),
  (EffectSystem.rpe = Stats_1.Stat.Create("[EffectSystem.TryRecycleToLru]")),
  (EffectSystem.Xfe = Stats_1.Stat.Create(
    "[EffectSystem.RemoveHandle.StopHandle]",
  )),
  (EffectSystem.spe = Stats_1.Stat.Create(
    "[EffectSystem.RemoveHandle.EndHandle]",
  )),
  (EffectSystem.ape = Stats_1.Stat.Create(
    "[EffectSystem.RemoveHandle.ClearHandle]",
  )),
  (EffectSystem.hpe = Stats_1.Stat.Create(
    "[EffectSystem.RemoveHandle.DestroyActor]",
  )),
  (EffectSystem.dpe = Stats_1.Stat.Enable
    ? Stats_1.Stat.Create("EffectSystem.CreateEffectActor")
    : void 0),
  (EffectSystem.Cpe = Stats_1.Stat.Enable
    ? Stats_1.Stat.Create("EffectSystem.CreateEffectActor.GetWorldType")
    : void 0),
  (EffectSystem.gpe = Stats_1.Stat.Enable
    ? Stats_1.Stat.Create("EffectSystem.CreateEffectActor.SpawnEffectActor")
    : void 0),
  (EffectSystem.Mpe = Stats_1.Stat.Enable
    ? Stats_1.Stat.Create("EffectSystem.CreateEffectHandle")
    : void 0),
  (EffectSystem.Ife = !1),
  (EffectSystem.AZa = !0),
  (EffectSystem.Tfe = () => {
    for (const t of _a.Afe.GetItems()) t.OnGlobalTimeScaleChange();
  }),
  (EffectSystem.mna = () => {
    var t = GameSettingsManager_1.GameSettingsManager.GetCurrentValue(55);
    Info_1.Info.IsPcOrGamepadPlatform()
      ? t < 1
        ? _a.dna()
        : _a.Cna()
      : t < 2
        ? _a.dna()
        : _a.Cna();
  }),
  (EffectSystem.Dfe = !0),
  (EffectSystem._pe = CHECK_EFFECT_OWNER_INTERVAL),
  (EffectSystem.vpe = new Map()),
  (EffectSystem.t5a = new Map()),
  (EffectSystem.RUn = !1),
  (EffectSystem.DUn = 0);
//# sourceMappingURL=EffectSystem.js.map
