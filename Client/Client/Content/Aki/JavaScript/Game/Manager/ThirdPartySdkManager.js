"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.ThirdPartySdkManager = void 0);
const cpp_1 = require("cpp"),
  UE = require("ue"),
  ue_1 = require("ue"),
  Log_1 = require("../../Core/Common/Log"),
  Protocol_1 = require("../../Core/Define/Net/Protocol"),
  Net_1 = require("../../Core/Net/Net"),
  TimerSystem_1 = require("../../Core/Timer/TimerSystem"),
  BaseConfigController_1 = require("../../Launcher/BaseConfig/BaseConfigController"),
  Platform_1 = require("../../Launcher/Platform/Platform"),
  ACE_DATA_TRANSFER_INTERVAL_PC = 100,
  ACE_DATA_TRANSFER_INTERVAL_MOBILE = 4e3;
class ThirdPartySdkManager {
  static Init() {
    var r =
        BaseConfigController_1.BaseConfigController.GetPackageConfigOrDefault(
          "Stream",
        ),
      e = BaseConfigController_1.BaseConfigController.GetPackageConfigOrDefault(
        "Changelist",
        "",
      ),
      r =
        (cpp_1.FCrashSightProxy.SetBranchInfo(r, e),
        true)// UE.KuroStaticLibrary.IsModuleLoaded("TpSafe"));
    r &&
      (void 0 !== ThirdPartySdkManager.BBe &&
        (TimerSystem_1.TimerSystem.Remove(ThirdPartySdkManager.BBe),
        (ThirdPartySdkManager.BBe = void 0)),
      ThirdPartySdkManager.InitDataTransferTimerForTpSafe(),
      Net_1.Net.Register(22729, ThirdPartySdkManager.bBe)),
      Platform_1.Platform.IsAndroidPlatform() &&
        ((e = UE.KuroAudioStatics.IsAndroidApiUsingOpenSL()),
        cpp_1.FCrashSightProxy.SetCustomData(
          "AudioAPI",
          e ? "OpenSL" : "AAudio",
        )),
      this.rPn();
  }
  static rPn() {
    // var r = UE.BlueprintPathsLibrary.ProjectSavedDir() + "crashes/trigger";
    // UE.BlueprintPathsLibrary.FileExists(r) &&
    //   (Log_1.Log.CheckError() && Log_1.Log.Error("Login", 22, "崩溃测试！"),
    //   cpp_1.FCrashSightProxy.Test());
  }
  static SetUserInfo(r) {
    "" !== r && ThirdPartySdkManager.qBe(r);
  }
  static qBe(r) {
    // cpp_1.FCrashSightProxy.SetUserId(0);
  }
  static SetUserInfoForTpSafe(r, e) {
    var a;
    // cpp_1.FCrashSightProxy.SetCustomData("PlayerId", "0"),
    //   UE.KuroStaticLibrary.IsModuleLoaded("TpSafe") &&
    //     ((a = ThirdPartySdkManager.GBe()),
    //     ue_1.TpSafeProxy.SetUserInfo(a, 0, r, e));
  }
  static InitDataTransferTimerForTpSafe() {
  }
  static NBe() {}
  static GBe() {
    return Platform_1.Platform.IsWindowsPlatform() ? 601 : 99;
  }
  static Logout() {
    ue_1.TpSafeProxy.Logout();
  }
}
((exports.ThirdPartySdkManager = ThirdPartySdkManager).BBe = void 0),
  (ThirdPartySdkManager.bBe = (r) => {
    // ue_1.TpSafeProxy.RecvAntiData(r.v6n);
  });
//# sourceMappingURL=ThirdPartySdkManager.js.map
