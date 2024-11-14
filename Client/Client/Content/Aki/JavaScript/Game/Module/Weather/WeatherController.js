"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.WeatherController = void 0);
const Log_1 = require("../../../Core/Common/Log"),
  Protocol_1 = require("../../../Core/Define/Net/Protocol"),
  ControllerBase_1 = require("../../../Core/Framework/ControllerBase"),
  Net_1 = require("../../../Core/Net/Net"),
  TimerSystem_1 = require("../../../Core/Timer/TimerSystem"),
  EventDefine_1 = require("../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../Common/Event/EventSystem"),
  GlobalData_1 = require("../../GlobalData"),
  ControllerHolder_1 = require("../../Manager/ControllerHolder"),
  ModelManager_1 = require("../../Manager/ModelManager"),
  WeatherModel_1 = require("./WeatherModel"),
  ModManager_1 = require("../../Manager/ModManager"),
  CHANGE_WEATHER_SMOOTH_TIME = 10,
  CHANGE_WEATHER_SMOOTH_TIME_QUICK = 1,
  CHECKGAP = 300;
class WeatherController extends ControllerBase_1.ControllerBase {
  static OnInit() {
    return this.OnAddEvents(), this.OnRegisterNetEvent(), this.P3e(), !0;
  }
  static OnClear() {
    return (
      this.OnRemoveEvents(),
      this.OnUnRegisterNetEvent(),
      this.jko(),
      this.R6t(),
      !0
    );
  }
  static OnAddEvents() {
    EventSystem_1.EventSystem.Add(
      EventDefine_1.EEventName.EnterGameSuccess,
      WeatherController.nTo
    ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.BeforeLoadMap,
        WeatherController.SYi
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.WorldDone,
        WeatherController.nye
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.TeleportComplete,
        this.Ilt
      );
  }
  static OnRemoveEvents() {
    EventSystem_1.EventSystem.Remove(
      EventDefine_1.EEventName.EnterGameSuccess,
      WeatherController.nTo
    ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.BeforeLoadMap,
        WeatherController.SYi
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.WorldDone,
        WeatherController.nye
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.TeleportComplete,
        this.Ilt
      );
  }
  static P3e() {
    WeatherController.Wko = TimerSystem_1.TimerSystem.Forever(
      WeatherController.Kko,
      CHECKGAP
    );
  }
  static R6t() {
    void 0 !== WeatherController.Wko &&
      (TimerSystem_1.TimerSystem.Remove(WeatherController.Wko),
      (WeatherController.Wko = void 0));
  }
  static OnRegisterNetEvent() {
    Net_1.Net.Register(26088, WeatherController.Qko);
  }
  static OnUnRegisterNetEvent() {
    Net_1.Net.UnRegister(26088);
  }
  static jko() {
    WeatherModel_1.WeatherModel.GetWorldWeatherActor().Destroy();
  }
  static RequestChangeWeather(e) {
    var t = new Protocol_1.Aki.Protocol.Ods();
    if (ModManager_1.ModManager.Settings.WeatherChanger) {
      e = ModManager_1.ModManager.Settings.WeatherType + 1; //天气e//1.sunny 2.Cloudy 3.ThunderRain 4.Snow 5.rain
    }
    (t.pjn = e),
      Net_1.Net.Call(27581, t, (e) => {
        e.Q4n !== Protocol_1.Aki.Protocol.Q4n.KRs &&
          ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(
            e.Q4n,
            15992
          );
      });
  }
  static ChangeCurrentWeather(e, t) {
    if (ModManager_1.ModManager.Settings.WeatherChanger) {
      e = ModManager_1.ModManager.Settings.WeatherType + 1; //天气e//1.sunny 2.Cloudy 3.ThunderRain 4.Snow 5.rain
    }
    ModelManager_1.ModelManager.WeatherModel.CurrentWeatherId !== e &&
      (ModelManager_1.ModelManager.WeatherModel.SetCurrentWeatherId(e),
      WeatherModel_1.WeatherModel.GetWorldWeatherActor().ChangeWeather(e, t)),
      EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.WeatherChange);
  }
  static TestChangeWeather(e) {
    ModelManager_1.ModelManager.WeatherModel.SetCurrentWeatherId(e),
      WeatherModel_1.WeatherModel.GetWorldWeatherActor().ChangeWeather(
        e,
        CHANGE_WEATHER_SMOOTH_TIME
      );
  }
  static StopWeather() {
    WeatherModel_1.WeatherModel.GetWorldWeatherActor().Destroy();
  }
  static BanWeather() {
    WeatherModel_1.WeatherModel.GetWorldWeatherActor().BanWeather();
  }
}
(exports.WeatherController = WeatherController),
  ((_a = WeatherController).Wko = void 0),
  (WeatherController.Kko = () => {
    WeatherModel_1.WeatherModel.GetWorldWeatherActor().SetActorState(
      !GlobalData_1.GlobalData.IsUiSceneOpen
    );
  }),
  (WeatherController.nTo = () => {}),
  (WeatherController.SYi = () => {
    WeatherModel_1.WeatherModel.GetWorldWeatherActor().Destroy();
  }),
  (WeatherController.nye = () => {
    _a.Xko();
  }),
  (WeatherController.Ilt = () => {
    _a.Xko();
  }),
  (WeatherController.Xko = () => {
    ControllerHolder_1.ControllerHolder.GameModeController.IsInInstance() ||
      0 === ModelManager_1.ModelManager.WeatherModel.CurrentWeatherId ||
      WeatherModel_1.WeatherModel.GetWorldWeatherActor().ChangeWeather(
        ModelManager_1.ModelManager.WeatherModel.CurrentWeatherId,
        0
      );
  }),
  (WeatherController.Qko = (e) => {
    Log_1.Log.CheckInfo() &&
      Log_1.Log.Info("Weather", 27, "OnWeatherNotify", ["WeatherNotify", e]),
      e.kDs
        ? WeatherController.ChangeCurrentWeather(
            e.pjn,
            CHANGE_WEATHER_SMOOTH_TIME_QUICK
          )
        : WeatherController.ChangeCurrentWeather(
            e.pjn,
            CHANGE_WEATHER_SMOOTH_TIME
          );
  });
//# sourceMappingURL=WeatherController.js.map
