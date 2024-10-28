"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.Game = void 0);
const puerts_1 = require("puerts"),
  UE = require("ue"),
  ActorSystem_1 = require("../Core/Actor/ActorSystem"),
  Application_1 = require("../Core/Application/Application"),
  AudioController_1 = require("../Core/Audio/AudioController"),
  AudioSystem_1 = require("../Core/Audio/AudioSystem"),
  CustomPromise_1 = require("../Core/Common/CustomPromise"),
  Info_1 = require("../Core/Common/Info"),
  Log_1 = require("../Core/Common/Log"),
  LogAnalyzer_1 = require("../Core/Common/LogAnalyzer"),
  Stats_1 = require("../Core/Common/Stats"),
  Http_1 = require("../Core/Http/Http"),
  ResourceSystem_1 = require("../Core/Resource/ResourceSystem"),
  TickProcessSystem_1 = require("../Core/Tick/TickProcessSystem"),
  TickSystem_1 = require("../Core/Tick/TickSystem"),
  MathUtils_1 = require("../Core/Utils/MathUtils"),
  UiTextTranslationUtils_1 = require("../Core/Utils/UiTextTranslationUtils"),
  TestModuleBridge_1 = require("./Bridge/TestModuleBridge"),
  EventDefine_1 = require("./Common/Event/EventDefine"),
  EventSystem_1 = require("./Common/Event/EventSystem"),
  LocalStorage_1 = require("./Common/LocalStorage"),
  StatDefine_1 = require("./Common/StatDefine"),
  TimeUtil_1 = require("./Common/TimeUtil"),
  EffectSystem_1 = require("./Effect/EffectSystem"),
  GameSettingsDeviceRender_1 = require("./GameSettings/GameSettingsDeviceRender"),
  GameSettingsManager_1 = require("./GameSettings/GameSettingsManager"),
  GameUtils_1 = require("./GameUtils"),
  Global_1 = require("./Global"),
  GlobalData_1 = require("./GlobalData"),
  InputController_1 = require("./Input/InputController"),
  InputSettings_1 = require("./InputSettings/InputSettings"),
  InputSettingsManager_1 = require("./InputSettings/InputSettingsManager"),
  CloudGameManager_1 = require("./Manager/CloudGameManager"),
  ConfigManager_1 = require("./Manager/ConfigManager"),
  ConfigManagerCreator_1 = require("./Manager/ConfigManagerCreator"),
  ControllerManager_1 = require("./Manager/ControllerManager"),
  ControllerRegisterManager_1 = require("./Manager/ControllerRegisterManager"),
  ModelManager_1 = require("./Manager/ModelManager"),
  ModelManagerCreator_1 = require("./Manager/ModelManagerCreator"),
  PakManager_1 = require("./Manager/PakManager"),
  SwitcherManager_1 = require("./Manager/SwitcherManager"),
  ThirdPartySdkManager_1 = require("./Manager/ThirdPartySdkManager"),
  UiPopFrameViewRegisterCenter_1 = require("./Manager/UiPopFrameViewRegisterCenter"),
  UiTabViewManager_1 = require("./Manager/UiTabViewManager"),
  UiViewManager_1 = require("./Manager/UiViewManager"),
  CombatMessageController_1 = require("./Module/CombatMessage/CombatMessageController"),
  HudUnitController_1 = require("./Module/HudUnit/HudUnitController"),
  HudUnitHandleManager_1 = require("./Module/HudUnit/HudUnitHandleManager"),
  Heartbeat_1 = require("./Module/Login/Heartbeat"),
  ThinkingAnalyticsReporter_1 = require("./Module/LogReport/ThinkingAnalyticsReporter"),
  LogUpload_1 = require("./Module/LogUpload/LogUpload"),
  UiCameraAnimationManager_1 = require("./Module/UiCameraAnimation/UiCameraAnimationManager"),
  UiSceneManager_1 = require("./Module/UiComponent/UiSceneManager"),
  BulletController_1 = require("./NewWorld/Bullet/BulletController"),
  FightLibrary_1 = require("./NewWorld/Character/Common/Blueprint/Utils/FightLibrary"),
  UeSkeletalTickManageComponent_1 = require("./NewWorld/Common/Component/UeSkeletalTickManageComponent"),
  RedDotSystem_1 = require("./RedDot/RedDotSystem"),
  TickScoreController_1 = require("./TickScore/TickScoreController"),
  UiTimeDilation_1 = require("./Ui/Base/UiTimeDilation"),
  InputManager_1 = require("./Ui/Input/InputManager"),
  TouchFingerManager_1 = require("./Ui/TouchFinger/TouchFingerManager"),
  UiManager_1 = require("./Ui/UiManager"),
  RichTextUtils_1 = require("./Utils/RichTextUtils"),
  ComponentForceTickController_1 = require("./World/Controller/ComponentForceTickController"),
  GameBudgetAllocatorConfigCreator_1 = require("./World/Define/GameBudgetAllocatorConfigCreator"),
  EnvironmentalPerceptionController_1 = require("./World/Enviroment/EnvironmentalPerceptionController"),
  TaskSystem_1 = require("./World/Task/TaskSystem");
class Game {
  static *Start(e) {
    Log_1.Log.CheckInfo() && Log_1.Log.Info("Game", 1, "启动 Game"),
      GlobalData_1.GlobalData.Init(e),
      TimeUtil_1.TimeUtil.SetServerTimeStamp(Date.parse(new Date().toString())),
      EnvironmentalPerceptionController_1.EnvironmentalPerceptionController.InitializeEnvironment(),
      InputController_1.InputController.InitializeEnvironment(),
      Http_1.Http.SetHttpThreadActiveMinimumSleepTimeInSeconds(0.005),
      Http_1.Http.SetHttpThreadIdleMinimumSleepTimeInSeconds(0.033),
      ThinkingAnalyticsReporter_1.ThinkingAnalyticsReporter.Init(),
      LocalStorage_1.LocalStorage.Initialize(),
      yield GameUtils_1.GameUtils.WaitFrame(),
      ConfigManagerCreator_1.ConfigManagerCreator.Init(),
      yield GameUtils_1.GameUtils.WaitFrame(),
      InputSettings_1.InputSettings.Initialize(),
      InputSettingsManager_1.InputSettingsManager.Initialize(),
      InputManager_1.InputManager.Init(),
      UiSceneManager_1.UiSceneManager.Initialize(),
      Global_1.Global.InitEvent(),
      UiTextTranslationUtils_1.UiTextTranslationUtils.Initialize(),
      RichTextUtils_1.RichTextUtils.Initialize(),
      SwitcherManager_1.SwitcherManager.Initialize(),
      TouchFingerManager_1.TouchFingerManager.Initialize(),
      EffectSystem_1.EffectSystem.Initialize(),
      TaskSystem_1.TaskSystem.Initialize(),
      GameSettingsManager_1.GameSettingsManager.Initialize(),
      GameSettingsDeviceRender_1.GameSettingsDeviceRender.Initialize(),
      TickScoreController_1.TickScoreController.Init(),
      TimeUtil_1.TimeUtil.Init(ConfigManager_1.ConfigManager.TextConfig),
      TickSystem_1.TickSystem.Add(this.r6, "Game", 0, !0),
      TickSystem_1.TickSystem.Add(this.AfterTick, "Game", 4, !0),
      TickSystem_1.TickSystem.Add(this.AfterCameraTick, "Game", 5, !0),
      Heartbeat_1.Heartbeat.RegisterTick(),
      Info_1.Info.IsBuildShipping ||
        (this.rve(),
        GlobalData_1.GlobalData.IsPlayInEditor && this.nve(),
        (this.sve = (0, puerts_1.toManualReleaseDelegate)(this.ave)),
        UE.KuroStaticLibrary.RegisterCustomCommandProcessor("aki", this.sve)),
      yield GameUtils_1.GameUtils.WaitFrame(),
      UE.GASBPLibrary.EnsureGameplayTagDataTableLoaded(),
      GameBudgetAllocatorConfigCreator_1.GameBudgetAllocatorConfigCreator.CreateConfigs(),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.DoLeaveLevel,
        Game.hve,
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.ClearSceneBegin,
        Game.ora,
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.ReconnectClearData,
        Game.lve,
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.BeforeTravelMap,
        Game.uve,
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.EndTravelMap,
        Game.cve,
      ),
      Application_1.Application.AddEditorPreEndPIEHandler(Game._ve),
      Game.Aih && (0, StatDefine_1.InitStatConsoleCommand)();
  }
  static *ModuleStart() {
    CloudGameManager_1.CloudGameManager.Init(),
      ThirdPartySdkManager_1.ThirdPartySdkManager.Init(),
      yield GameUtils_1.GameUtils.WaitFrame(),
      ModelManagerCreator_1.ModelManagerCreator.Init(),
      yield GameUtils_1.GameUtils.WaitFrame(),
      ControllerRegisterManager_1.ControllerRegisterManager.Init(),
      ControllerManager_1.ControllerManager.Init(),
      UiViewManager_1.UiViewManager.Init(),
      UiPopFrameViewRegisterCenter_1.UiPopFrameViewRegisterCenter.Init(),
      UiTabViewManager_1.UiTabViewManager.Init(),
      HudUnitHandleManager_1.HudUnitHandleManager.Init(),
      FightLibrary_1.FightLibrary.Init(),
      PakManager_1.PakManager.Init(),
      UiTimeDilation_1.UiTimeDilation.Init(),
      LogUpload_1.LogUpload.Init();
  }
  static Shutdown() {
    Log_1.Log.CheckInfo() && Log_1.Log.Info("Game", 25, "Game.Shutdown Start"),
      Http_1.Http.SetHttpThreadActiveMinimumSleepTimeInSeconds(0),
      Http_1.Http.SetHttpThreadIdleMinimumSleepTimeInSeconds(0),
      LogAnalyzer_1.LogAnalyzer.Clear(),
      TickProcessSystem_1.TickProcessSystem.Clear(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "Game",
          25,
          "Game.Shutdown PerformanceManager.Destroy Finished",
        ),
      TickSystem_1.TickSystem.Destroy(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info("Game", 25, "Game.Shutdown TickSystem.Destroy Finished"),
      UiTimeDilation_1.UiTimeDilation.Destroy(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "Game",
          25,
          "Game.Shutdown UiTimeDilation.Destroy Finished",
        ),
      ControllerManager_1.ControllerManager.Clear(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "Game",
          25,
          "Game.Shutdown ControllerManager.Clear Finished",
        ),
      ModelManagerCreator_1.ModelManagerCreator.Clear(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "Game",
          25,
          "Game.Shutdown ModelManagerCreator.Clear Finished",
        ),
      GameSettingsDeviceRender_1.GameSettingsDeviceRender.Clear(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "Game",
          25,
          "Game.Shutdown GameSettingsRenderManager.Clear Finished",
        ),
      TaskSystem_1.TaskSystem.Clear(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info("Game", 25, "Game.Shutdown TaskSystem.Clear Finished"),
      EffectSystem_1.EffectSystem.Clear(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info("Game", 25, "Game.Shutdown EffectSystem.Clear Finished"),
      UiTextTranslationUtils_1.UiTextTranslationUtils.Destroy(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "Game",
          25,
          "Game.Shutdown UiTextTranslationUtils.Destroy Finished",
        ),
      RichTextUtils_1.RichTextUtils.Destroy(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "Game",
          25,
          "Game.Shutdown RichTextUtils.Destroy Finished",
        ),
      InputSettingsManager_1.InputSettingsManager.Clear(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "Game",
          64,
          "Game.Shutdown InputSettingsManager.Clear Finished",
        ),
      Application_1.Application.RemoveEditorPreEndPIEHandler(Game._ve),
      Application_1.Application.Destroy(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "Game",
          25,
          "Game.Shutdown Application.Destroy Finished",
        ),
      GameSettingsManager_1.GameSettingsManager.Clear(),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "Game",
          25,
          "Game.Shutdown GameSettingsManager.Clear Finished",
        );
  }
  static LockLoad() {
    Log_1.Log.CheckInfo() &&
      Log_1.Log.Info(
        "Game",
        17,
        "[Game.EndTravelMap] SetActorPermanentExtraStatic true",
      );
  }
  static UnlockLoad() {
    Log_1.Log.CheckInfo() &&
      Log_1.Log.Info(
        "Game",
        17,
        "[Game.EndTravelMap] SetActorPermanentExtraStatic false",
      );
  }
  static mve() {
    var e = ModelManager_1.ModelManager.GameModeModel;
    if (e && 0 < e.MapId) {
      try {
        ControllerManager_1.ControllerManager.LeaveLevel();
      } catch (e) {
        e instanceof Error
          ? Log_1.Log.CheckError() &&
            Log_1.Log.ErrorWithStack(
              "Game",
              3,
              "[Game.LeaveLevel] 调用ControllerManager.LeaveLevel异常。",
              e,
              ["error", e.message],
            )
          : Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "Game",
              3,
              "[Game.LeaveLevel] 调用ControllerManager.LeaveLevel异常。",
              ["error", e],
            );
      }
      try {
        ModelManager_1.ModelManager.LeaveLevel();
      } catch (e) {
        e instanceof Error
          ? Log_1.Log.CheckError() &&
            Log_1.Log.ErrorWithStack(
              "Game",
              3,
              "[Game.LeaveLevel] 调用ModelManager.LeaveLevel异常。",
              e,
              ["error", e.message],
            )
          : Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "Game",
              3,
              "[Game.LeaveLevel] 调用ModelManager.LeaveLevel异常。",
              ["error", e],
            );
      }
    }
  }
  static dve() {
    Log_1.Log.CheckInfo() &&
      Log_1.Log.Info("World", 3, "[Game.LeaveLevel] LeaveLevel");
    try {
      EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.ClearWorld);
    } catch (e) {
      e instanceof Error
        ? Log_1.Log.CheckError() &&
          Log_1.Log.ErrorWithStack(
            "Game",
            3,
            "[Game.LeaveLevel] 调用EventSystem.Emit(EEventName.ClearWorld)异常。",
            e,
            ["error", e.message],
          )
        : Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Game",
            3,
            "[Game.LeaveLevel] 调用EventSystem.Emit(EEventName.ClearWorld)异常。",
            ["error", e],
          );
    }
  }
  static Cve(a, ...e) {
    try {
      a.Tick(...e);
    } catch (e) {
      e instanceof Error
        ? Log_1.Log.CheckError() &&
          Log_1.Log.ErrorWithStack(
            "Game",
            20,
            "Error when execute",
            e,
            ["this type", a.constructor.name],
            ["error", e.message],
          )
        : Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Game",
            20,
            "Error when execute",
            ["this type", a.constructor.name],
            ["error", e],
          );
    }
  }
  static async rve() {
    var e = await TestModuleBridge_1.TestModuleBridge.TryGetTestModuleExports();
    e && e.TsTestEntrance.Init();
  }
  static async nve() {
    var e = await TestModuleBridge_1.TestModuleBridge.TryGetTestModuleExports();
    e && e.EditorMetrics.Init();
  }
}
(exports.Game = Game),
  ((_a = Game).gve = Stats_1.Stat.Create("UI")),
  (Game.fve = Stats_1.Stat.Create("Effect")),
  (Game.pve = Stats_1.Stat.Create("Other")),
  (Game.vve = Stats_1.Stat.Create("TickScore")),
  (Game.sve = void 0),
  (Game.Aih = !0),
  (Game.hve = () => {
    Game.dve();
  }),
  (Game.lve = () => {
    Game.Shutdown();
  }),
  (Game._ve = () => {
    EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.OnPreEndPIE),
      Game.Shutdown();
  }),
  (Game.uve = () => {}),
  (Game.cve = () => {
    Game.UnlockLoad();
  }),
  (Game.ora = async () => {
    if (GlobalData_1.GlobalData.IsSceneClearing)
      return (
        Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Game",
            17,
            "[Game.ClearSceneAsync]: Duplicate ClearSceneAsync",
          ),
        !1
      );
    GlobalData_1.GlobalData.ClearSceneDone =
      new CustomPromise_1.CustomPromise();
    var e = ModelManager_1.ModelManager.SeamlessTravelModel.IsSeamlessTravel;
    Log_1.Log.CheckInfo() &&
      Log_1.Log.Info("Game", 17, "[Game.ClearSceneAsync] 场景清理操作开始", [
        "无缝加载",
        e,
      ]),
      await UiManager_1.UiManager.ClearAsync(e).catch((e) => {
        e instanceof Error
          ? Log_1.Log.CheckError() &&
            Log_1.Log.ErrorWithStack(
              "Game",
              17,
              "[Game.LeaveLevel] 调用 UiManager.ClearAsync 异常。",
              e,
              ["error", e.message],
            )
          : Log_1.Log.CheckError() &&
            Log_1.Log.Error(
              "Game",
              17,
              "[Game.LeaveLevel] 调用 UiManager.ClearAsync 异常。",
              ["error", e],
            );
      }),
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info(
          "Game",
          17,
          "[Game.ClearSceneAsync] UiManager.ClearAsync清理操作完成",
        );
    try {
      AudioController_1.AudioController.Clear();
    } catch (e) {
      e instanceof Error
        ? Log_1.Log.CheckError() &&
          Log_1.Log.ErrorWithStack(
            "Game",
            22,
            "[Game.LeaveLevel] 调用AudioController.Clear异常。",
            e,
            ["error", e.message],
          )
        : Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Game",
            22,
            "[Game.LeaveLevel] 调用AudioController.Clear异常。",
            ["error", e],
          );
    }
    Log_1.Log.CheckInfo() &&
      Log_1.Log.Info(
        "Game",
        17,
        "[Game.ClearSceneAsync] AudioController.Clear清理操作完成",
      );
    try {
      Game.mve();
    } catch (e) {
      e instanceof Error
        ? Log_1.Log.CheckError() &&
          Log_1.Log.ErrorWithStack(
            "Game",
            3,
            "[Game.LeaveLevel] 调用Game.ClearControllerAndModel异常。",
            e,
            ["error", e.message],
          )
        : Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Game",
            3,
            "[Game.LeaveLevel] 调用Game.ClearControllerAndModel异常。",
            ["error", e],
          );
    }
    Log_1.Log.CheckInfo() &&
      Log_1.Log.Info(
        "Game",
        17,
        "[Game.ClearSceneAsync] Game.ClearControllerAndModel清理操作完成",
      );
    try {
      EffectSystem_1.EffectSystem.ClearPool(),
        ActorSystem_1.ActorSystem.Clear(),
        (ActorSystem_1.ActorSystem.State = 0);
    } catch (e) {
      e instanceof Error
        ? Log_1.Log.CheckError() &&
          Log_1.Log.ErrorWithStack(
            "Game",
            22,
            "[Game.LeaveLevel] 调用ActorSystem.Clear异常。",
            e,
            ["error", e.message],
          )
        : Log_1.Log.CheckError() &&
          Log_1.Log.Error(
            "Game",
            22,
            "[Game.LeaveLevel] 调用ActorSystem.Clear异常。",
            ["error", e],
          );
    }
    return (
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info("Game", 17, "[Game.ClearSceneAsync] 场景清理操作完成", [
          "无缝加载",
          e,
        ]),
      Game.LockLoad(),
      GlobalData_1.GlobalData.ClearSceneDone.SetResult(),
      !(GlobalData_1.GlobalData.ClearSceneDone = void 0)
    );
  }),
  (Game.r6 = (e) => {
    CombatMessageController_1.CombatMessageController.PreTick(e),
      TickSystem_1.TickSystem.IsPaused ||
        UeSkeletalTickManageComponent_1.UeSkeletalTickController.TickManagers(
          e * MathUtils_1.MathUtils.MillisecondToSecond,
        ),
      Game.gve.Start(),
      Game.Cve(UiManager_1.UiManager, e),
      Game.Cve(UiSceneManager_1.UiSceneManager),
      Game.Cve(UiCameraAnimationManager_1.UiCameraAnimationManager, e),
      Game.Cve(RedDotSystem_1.RedDotSystem, e),
      Game.gve.Stop(),
      ControllerManager_1.ControllerManager.Tick(e),
      Game.fve.Start(),
      Game.Cve(EffectSystem_1.EffectSystem, e),
      Game.fve.Stop(),
      Game.pve.Start(),
      Game.Cve(TimeUtil_1.TimeUtil, e),
      Game.pve.Stop(),
      Game.pve.Start(),
      Game.Cve(AudioController_1.AudioController, e),
      Game.pve.Stop(),
      Game.pve.Start(),
      Game.Cve(AudioSystem_1.AudioSystem, e),
      Game.pve.Stop(),
      TickSystem_1.TickSystem.IsPaused ||
        (Game.vve.Start(),
        Game.Cve(TickScoreController_1.TickScoreController, e),
        Game.vve.Stop()),
      ResourceSystem_1.ResourceSystem.UpdateDelayCallback();
  }),
  (Game.AfterTick = (e) => {
    TickSystem_1.TickSystem.IsPaused ||
      (UeSkeletalTickManageComponent_1.UeSkeletalTickController.AfterTickManagers(
        e * MathUtils_1.MathUtils.MillisecondToSecond,
      ),
      BulletController_1.BulletController.AfterTick(e),
      ComponentForceTickController_1.ComponentForceTickController.AfterTick(e)),
      EffectSystem_1.EffectSystem.AfterTick(e);
  }),
  (Game.AfterCameraTick = (e) => {
    CombatMessageController_1.CombatMessageController.AfterTick(e),
      UiManager_1.UiManager.AfterTick(e),
      TickSystem_1.TickSystem.IsPaused ||
        HudUnitController_1.HudUnitController.AfterTick(e);
  }),
  (Game.ave = (e) => {
    EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.RunGm, e);
  });
//# sourceMappingURL=Game.js.map
