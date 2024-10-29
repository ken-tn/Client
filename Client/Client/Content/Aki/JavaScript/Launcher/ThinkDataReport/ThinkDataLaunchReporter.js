"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.ThinkDataLaunchReporter =
    exports.CALIBRATE_STOP_TIMER =
    exports.CALIBRATE_INTERVAL =
    exports.SEND_HTTP_TIMEOUT =
    exports.MAX_PENDING_LOG =
    exports.EXIT_WAIT_TIME =
    exports.ENABLE_THINKING_ANALYTICS =
      void 0);
const cpp_1 = require("cpp"),
  puerts_1 = require("puerts"),
  UE = require("ue"),
  BaseConfigController_1 = require("../BaseConfig/BaseConfigController"),
  BaseConfigModel_1 = require("../BaseConfig/BaseConfigModel"),
  LauncherLog_1 = require("../Util/LauncherLog");
(exports.ENABLE_THINKING_ANALYTICS = !0),
  (exports.EXIT_WAIT_TIME = 1),
  (exports.MAX_PENDING_LOG = 1e3),
  (exports.SEND_HTTP_TIMEOUT = 1e4),
  (exports.CALIBRATE_INTERVAL = 10),
  (exports.CALIBRATE_STOP_TIMER = !0);
class ThinkDataLaunchReporter {
  static InitializeInstance() {
    var e;
    exports.ENABLE_THINKING_ANALYTICS &&
      ((e = BaseConfigModel_1.BaseConfigModel.EntryJson?.TDCfg)
        ? (ThinkDataLaunchReporter.lyr(e?.URL, e?.AppID),
          ThinkDataLaunchReporter.CalibrateInstanceTime())
        : LauncherLog_1.LauncherLog.Error(
            "CDN下发数据未配置数数上报相关配置，创建上报实例失败！",
          ));
  }
  static lyr(r, t) {
    if (UE.ThinkingAnalytics.HasInstanceInitialized(0)) {
      let e = !1;
      r && UE.ThinkingAnalytics.GetServerUrl(0) !== r && (e = !0),
        (e = t && UE.ThinkingAnalytics.GetAppId(0) !== t ? !0 : e) &&
          UE.ThinkingAnalytics.DestroyInstance(0, !1);
    }
    r && t
      ? UE.ThinkingAnalytics.InitializeDefaultInsWithURL_Appid(
          r,
          t,
          exports.EXIT_WAIT_TIME,
          exports.MAX_PENDING_LOG,
          exports.SEND_HTTP_TIMEOUT,
          !0,
          exports.CALIBRATE_INTERVAL,
          exports.CALIBRATE_STOP_TIMER,
        )
      : UE.ThinkingAnalytics.Initialize(),
      (this.ClientVersion =
        BaseConfigController_1.BaseConfigController.GetVersionString()),
      UE.ThinkingAnalytics.Logout();
  }
  static CalibrateInstanceTime() {
    UE.ThinkingAnalytics.CalibrateTime(
      (0, puerts_1.toManualReleaseDelegate)(ThinkDataLaunchReporter.uyr),
    );
  }
  static Report(e, r) {
    // cpp_1.FThinkingAnalyticsForPuerts.Track(e, r);
  }
}
((exports.ThinkDataLaunchReporter = ThinkDataLaunchReporter).ClientVersion =
  ""),
  (ThinkDataLaunchReporter.uyr = (e) => {
    UE.ThinkingAnalytics.HasInstanceTimeCalibrated(e) ||
      LauncherLog_1.LauncherLog.Info(
        "数数上报时间校准失败，可以因为以下问题导致：1.CDN数数上报配置错误；2.网络原因连接不上。",
      );
  });
//# sourceMappingURL=ThinkDataLaunchReporter.js.map
