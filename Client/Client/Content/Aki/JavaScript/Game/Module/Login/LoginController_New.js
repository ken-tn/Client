"use strict";
var _a;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.LoginController = void 0;
const cpp_1 = require("cpp"),
    UE = require("ue"),
    AudioSystem_1 = require("../../../Core/Audio/AudioSystem"),
    Info_1 = require("../../../Core/Common/Info"),
    Json_1 = require("../../../Core/Common/Json"),
    LanguageSystem_1 = require("../../../Core/Common/LanguageSystem"),
    Log_1 = require("../../../Core/Common/Log"),
    LogAnalyzer_1 = require("../../../Core/Common/LogAnalyzer"),
    MultiTextLang_1 = require("../../../Core/Define/ConfigQuery/MultiTextLang"),
    NetDefine_1 = require("../../../Core/Define/Net/NetDefine"),
    Protocol_1 = require("../../../Core/Define/Net/Protocol"),
    Http_1 = require("../../../Core/Http/Http"),
    Net_1 = require("../../../Core/Net/Net"),
    TimerSystem_1 = require("../../../Core/Timer/TimerSystem"),
    MathUtils_1 = require("../../../Core/Utils/MathUtils"),
    StringUtils_1 = require("../../../Core/Utils/StringUtils"),
    BaseConfigController_1 = require("../../../Launcher/BaseConfig/BaseConfigController"),
    HotPatchLogReport_1 = require("../../../Launcher/HotPatchLogReport"),
    PlatformSdkManagerNew_1 = require("../../../Launcher/Platform/PlatformSdk/PlatformSdkManagerNew"),
    PlatformSdkServer_1 = require("../../../Launcher/Platform/PlatformSdk/PlatformSdkServer"),
    HotFixSceneManager_1 = require("../../../Launcher/Ui/HotFix/HotFixSceneManager"),
    LanguageUpdateManager_1 = require("../../../Launcher/Update/LanguageUpdateManager"),
    LauncherStorageLib_1 = require("../../../Launcher/Util/LauncherStorageLib"),
    CameraController_1 = require("../../Camera/CameraController"),
    EventDefine_1 = require("../../Common/Event/EventDefine"),
    EventSystem_1 = require("../../Common/Event/EventSystem"),
    LocalStorage_1 = require("../../Common/LocalStorage"),
    LocalStorageDefine_1 = require("../../Common/LocalStorageDefine"),
    PackageConfigUtil_1 = require("../../Common/PackageConfigUtil"),
    PublicUtil_1 = require("../../Common/PublicUtil"),
    TimeUtil_1 = require("../../Common/TimeUtil"),
    CrashCollectionController_1 = require("../../CrashCollection/CrashCollectionController"),
    GameUtils_1 = require("../../GameUtils"),
    GlobalData_1 = require("../../GlobalData"),
    KuroPushController_1 = require("../../KuroPushSdk/KuroPushController"),
    KuroSdkReport_1 = require("../../KuroSdk/KuroSdkReport"),
    CloudGameManager_1 = require("../../Manager/CloudGameManager"),
    ConfigManager_1 = require("../../Manager/ConfigManager"),
    ControllerHolder_1 = require("../../Manager/ControllerHolder"),
    ModelManager_1 = require("../../Manager/ModelManager"),
    // ModManager_1 = require("../../Manager/ModManager"), 
    ThirdPartySdkManager_1 = require("../../Manager/ThirdPartySdkManager"),
    UiControllerBase_1 = require("../../Ui/Base/UiControllerBase"),
    UiManager_1 = require("../../Ui/UiManager"),
    BlackScreenController_1 = require("../BlackScreen/BlackScreenController"),
    UiBlueprintFunctionLibrary_1 = require("../BpBridge/UiBlueprintFunctionLibrary"),
    ConfirmBoxDefine_1 = require("../ConfirmBox/ConfirmBoxDefine"),
    CursorController_1 = require("../Cursor/CursorController"),
    LogReportController_1 = require("../LogReport/LogReportController"),
    LogReportDefine_1 = require("../LogReport/LogReportDefine"),
    PlatformController_1 = require("../Platform/PlatformController"),
    ReconnectDefine_1 = require("../ReConnect/ReconnectDefine"),
    ScrollingTipsController_1 = require("../ScrollingTips/ScrollingTipsController"),
    UiLoginSceneManager_1 = require("../UiComponent/UiLoginSceneManager"),
    LoginDefine_1 = require("./Data/LoginDefine"),
    Heartbeat_1 = require("./Heartbeat"),
    HeartbeatDefine_1 = require("./HeartbeatDefine"),
    LoginModel_1 = require("./LoginModel"),
    VERIFY_CONFIG_VERSION_INTERVAL = 9e4,
    TRY_BACK_TO_GAME_INTERVAL = 3e3,
    FOREVERTIME = 86313600;
class HttpResult extends Json_1.JsonObjBase {
    constructor() {
        super(...arguments), this.code = 0, this.token = "", this.host = "", this.port = 0, this.userData = 0, this.errMessage = "", this.sex = 0, this.banTimeStamp = 0, this.banReason = 0
    }
}
class LoginController extends UiControllerBase_1.UiControllerBase {
    static OnInit() {
        CloudGameManager_1.CloudGameManager.IsCloudGame && (CloudGameManager_1.CloudGameManager.BindFunction("OnCloudGameLogin", e => {
            Log_1.Log.CheckInfo() && Log_1.Log.Info("CloudGame", 17, "云游戏登录回调 Json", ["loginInfoJson", e]);
            e = Json_1.Json.Decode(e);
            Log_1.Log.CheckInfo() && Log_1.Log.Info("CloudGame", 17, "云游戏登录回调", ["loginInfo", e]), LoginController.OnSdkLogin(e)
        }), CloudGameManager_1.CloudGameManager.SendData("RequestLogin"), Log_1.Log.CheckInfo()) && Log_1.Log.Info("CloudGame", 17, "请求下发缓存的SDK登录信息"), Net_1.Net.InitNotPauseMessage(24749), Net_1.Net.InitNotPauseMessage(21059), Net_1.Net.InitNotPauseMessage(16420);
        var e = new Array;
        return e.push(111), e.push(103), e.push(24749), e.push(101), e.push(105), e.push(107), Net_1.Net.InitCanTimerOutMessage(e), AudioSystem_1.AudioSystem.SetRtpcValue("time_local", (new Date).getHours()), this.vMi(), LogAnalyzer_1.LogAnalyzer.SetP4Version(LauncherStorageLib_1.LauncherStorageLib.GetGlobal(LauncherStorageLib_1.ELauncherStorageGlobalKey.PatchP4Version)), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 3, "ConfigVersion", ["PublicJsonVersion", ModelManager_1.ModelManager.LoginModel.PublicJsonVersion], ["PublicMiscVersion", ModelManager_1.ModelManager.LoginModel.PublicMiscVersion], ["PublicUniverseEditorVersion", ModelManager_1.ModelManager.LoginModel.PublicUniverseEditorVersion]), !0
    }
    static OnAddEvents() {
        EventSystem_1.EventSystem.Add(EventDefine_1.EEventName.UiManagerInit, LoginController.MMi), EventSystem_1.EventSystem.Add(EventDefine_1.EEventName.ExitGamePush, LoginController.EMi), EventSystem_1.EventSystem.Add(EventDefine_1.EEventName.OnGetPlayerBasicInfo, LoginController.Wvi), EventSystem_1.EventSystem.Add(EventDefine_1.EEventName.ActiveBattleView, LoginController.JDe)
    }
    static OnRemoveEvents() {
        EventSystem_1.EventSystem.Remove(EventDefine_1.EEventName.UiManagerInit, LoginController.MMi), EventSystem_1.EventSystem.Remove(EventDefine_1.EEventName.ExitGamePush, LoginController.EMi), EventSystem_1.EventSystem.Remove(EventDefine_1.EEventName.OnGetPlayerBasicInfo, LoginController.Wvi), EventSystem_1.EventSystem.Remove(EventDefine_1.EEventName.ActiveBattleView, LoginController.JDe), this.Kta()
    }
    static OnRegisterNetEvent() {
        Net_1.Net.Register(110, LoginController.SMi), Net_1.Net.Register(115, LoginController.Tsa)
    }
    static OnUnRegisterNetEvent() {
        Net_1.Net.UnRegister(110), Net_1.Net.UnRegister(115)
    }
    static yMi(o) {
        if (Heartbeat_1.Heartbeat.StopHeartBeat(HeartbeatDefine_1.EStopHeartbeat.LogoutNotify), Net_1.Net.Disconnect(0), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init), o.hvs === Protocol_1.Aki.Protocol.O4n.Proto_HadBan || o.hvs === Protocol_1.Aki.Protocol.O4n.Proto_ErrLoginDeviceBan || o.hvs === Protocol_1.Aki.Protocol.O4n.Proto_ErrLoginIpBan) {
            var r = o.hvs,
                n = o.qxs.E9n,
                i = o.qxs.LSs,
                i = MathUtils_1.MathUtils.LongToNumber(i) - TimeUtil_1.TimeUtil.GetServerTime(),
                t = i >= FOREVERTIME;
            let e = 161;
            r === Protocol_1.Aki.Protocol.O4n.Proto_ErrLoginDeviceBan?e = 193 : r === Protocol_1.Aki.Protocol.O4n.Proto_ErrLoginIpBan && (e = 192), t && (e = 194);
            t = ConfigManager_1.ConfigManager.ReportConfig?.GetBanInfoByTypeAndReason(2, n), n = TimeUtil_1.TimeUtil.GetCountDownDataFormat2(i), i = new ConfirmBoxDefine_1.ConfirmBoxDataNew(e);
            r === Protocol_1.Aki.Protocol.O4n.Proto_ErrLoginIpBan?i.SetTextArgs(n.CountDownText ?? "") : (r = MultiTextLang_1.configMultiTextLang.GetLocalTextNew(t.BanDescribe), i.SetTextArgs(r, n.CountDownText ?? "")), i.FunctionMap.set(1, () => {
                ControllerHolder_1.ControllerHolder.ReConnectController.Logout(ReconnectDefine_1.ELogoutReason.LogoutNotify)
            }), i.FunctionMap.set(2, () => {
                ControllerHolder_1.ControllerHolder.KuroSdkController.OpenCustomerService(0)
            }), ControllerHolder_1.ControllerHolder.ConfirmBoxController.ShowConfirmBoxNew(i)
        } else {
            t = ConfigManager_1.ConfigManager.ErrorCodeConfig.GetTextByErrorId(o.hvs);
            let e = 10;
            o.hvs === Protocol_1.Aki.Protocol.O4n.Proto_ErrCheckClientVersionNeedUpdate && (e = 185);
            r = new ConfirmBoxDefine_1.ConfirmBoxDataNew(e);
            r.SetTextArgs(t);
            r.FunctionMap.set(1, () => {
                ControllerHolder_1.ControllerHolder.ReConnectController.Logout(ReconnectDefine_1.ELogoutReason.LogoutNotify)
            }), ControllerHolder_1.ControllerHolder.ConfirmBoxController.ShowNetWorkConfirmBoxView(r)
        }
        ModelManager_1.ModelManager.LoginModel.LogoutNotify = void 0
    }
    static OpenLoginView() {
        ModelManager_1.ModelManager.KuroSdkModel.ReportedInitState || (KuroSdkReport_1.KuroSdkReport.Report(new KuroSdkReport_1.SdkReportGameInitFinish(void 0)), ModelManager_1.ModelManager.KuroSdkModel.ReportedInitState = !0), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-OpenLoginView-更换PlayerController，初始化登录场景"), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init);
        var e = UE.GameplayStatics.GetPlayerController(GlobalData_1.GlobalData.World, 0).GetViewTarget(),
            o = e.K2_GetActorLocation(),
            r = e.K2_GetActorRotation(),
            n = e.CameraComponent.FieldOfView;
        void 0 !== e && void 0 !== n && void 0 !== (e = CameraController_1.CameraController.WidgetCamera.DisplayComponent.CineCamera) && (e.CameraComponent.SetFieldOfView(n), e.K2_SetActorLocationAndRotation(o, r, !1, void 0, !0), e.GetCineCameraComponent().SetFilmbackPresetByName("16:9 DSLR")), UE.GameplayStatics.GetGameMode(GlobalData_1.GlobalData.World).ChangePlayerController(UE.BP_StartupPlayerController_C.StaticClass()), CursorController_1.CursorController.InitMouseByMousePos(), HotFixSceneManager_1.HotFixSceneManager.SetViewTarget(GlobalData_1.GlobalData.World), UiLoginSceneManager_1.UiLoginSceneManager.InitCinematicTick(), UiLoginSceneManager_1.UiLoginSceneManager.InitRoleObservers(), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-OpenLoginView-加载进入登录的镜头"), UiLoginSceneManager_1.UiLoginSceneManager.LoadSequenceAsync("LevelSequence_Back", () => {
            Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-OpenLoginView-播放镜头结束，显示登录UI"), LoginController.IMi(), UiLoginSceneManager_1.UiLoginSceneManager.PlayLoginLoopSequence()
        }, !1, () => {
            CameraController_1.CameraController.EnterCameraMode(2, .1), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-OpenLoginView-播放进入登录的镜头(拉远)")
        })
    }
    static CreateCharacterViewToLoginView() {
        UiManager_1.UiManager.IsViewOpen("CreateCharacterView") && UiManager_1.UiManager.CloseView("CreateCharacterView"), BlackScreenController_1.BlackScreenController.AddBlackScreenAsync("Start", "CreateCharacterViewToLoginView").then(() => {
            Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "CreateCharacterViewToLoginView - 播放镜头结束，显示登录UI"), LoginController.IMi(), UiLoginSceneManager_1.UiLoginSceneManager.PlayLoginLoopSequence(), BlackScreenController_1.BlackScreenController.RemoveBlackScreen("Close", "CreateCharacterViewToLoginView")
        })
    }
    static TMi() {
        if (ControllerHolder_1.ControllerHolder.KuroSdkController.CanUseSdk() && ControllerHolder_1.ControllerHolder.KuroSdkController.GetIfGlobalSdk()) return this.DMi();
        var o = ModelManager_1.ModelManager.LoginModel.TryGetRealServerPort(),
            r = ModelManager_1.ModelManager.LoginModel.SetRpcHttp(LoginController.LMi, 13e3);
        if (ControllerHolder_1.ControllerHolder.KuroSdkController.CanUseSdk() || CloudGameManager_1.CloudGameManager.IsCloudGame) {
            var n = BaseConfigController_1.BaseConfigController.GetLoginServers();
            if (!n || 0 === n.length) return n = PackageConfigUtil_1.PackageConfigUtil.GetPackageConfigOrDefault(LoginModel_1.STREAM), Log_1.Log.CheckError() && Log_1.Log.Error("Login", 11, "LoginServers获取失败, 检查CDN是否正常", ["stream", n]), "";
            n = ModelManager_1.ModelManager.LoginServerModel.GetCurrentSelectServerIp();
            if (StringUtils_1.StringUtils.IsEmpty(n)) return i = PackageConfigUtil_1.PackageConfigUtil.GetPackageConfigOrDefault(LoginModel_1.STREAM), Log_1.Log.CheckError() && Log_1.Log.Error("Login", 11, "sdkIp获取失败, 检查CDN是否正常", ["stream", i]), "";
            ModelManager_1.ModelManager.LoginModel.SetServerName(ModelManager_1.ModelManager.LoginServerModel.GetCurrentSelectServerName()), ModelManager_1.ModelManager.LoginModel.SetServerId(ModelManager_1.ModelManager.LoginServerModel.GetCurrentLoginServerId() ?? "0");
            var i = ModelManager_1.ModelManager.LoginModel.GetLoginUid(),
                t = ModelManager_1.ModelManager.LoginModel.GetLoginUserNameWithUriEncode(),
                a = ModelManager_1.ModelManager.LoginModel.GetLoginToken();
            let e = "0";
            ControllerHolder_1.ControllerHolder.KuroSdkController.CanUseSdk() && (e = UE.KuroSDKManager.GetBasicInfo()?.DeviceId);
            const g = n.startsWith("http")?n : `http://${n}:` + o;
            n = UE.KuroStaticLibrary.HashStringWithSHA1(a);
            return Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-Http-SDK环境", ["uId", i], ["userName", t], ["token", n], ["userData", r], ["deviceId", e]), `${g}/api/login?loginType=1&userId=${i}&userName=${t}&token=${a}&userData=${r}&deviceId=${e}&loginTraceId=` + ModelManager_1.ModelManager.LoginModel.LoginTraceId
        }
        n = ModelManager_1.ModelManager.LoginModel.GetAccount(), i = ModelManager_1.ModelManager.LoginModel.GetServerIp(), t = encodeURIComponent(n);
        if (Log_1.Log.CheckDebug() && Log_1.Log.Debug("Login", 11, "尝试登陆目标IP", ["IP", i], ["Port", o]), !ControllerHolder_1.ControllerHolder.KuroSdkController.CanUseSdk()) {
            if (Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-Http-非SDK环境"), ModelManager_1.ModelManager.LoginModel.IsCopyAccount) {
                a = ModelManager_1.ModelManager.LoginModel.GetSourcePlayerAccount() ?? "";
                const g = i.startsWith("http")?i : `http://${i}:` + o;
                return Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-Http-非SDK环境-IsCopyAccount"), `${g}/api/CopyUserLogin?loginType=0&userId=${t}&userName=${t}&token=1&userData=${r}&loginTraceId=${ModelManager_1.ModelManager.LoginModel.LoginTraceId}&sourceAccount=` + a
            }
            const g = i.startsWith("http")?i : `http://${i}:` + o;
            return g + `/api/login?loginType=0&userId=${t}&userName=${t}&token=1&userData=${r}&loginTraceId=` + ModelManager_1.ModelManager.LoginModel.LoginTraceId
        }
        const g = i.startsWith("http")?i : `http://${i}:` + o;
        return Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-Http-非SDK环境-非正式环境", ["serverIp", i], ["serverPort", o], ["userData", r]), g + `/api/login?loginType=0&userId=${t}&userName=${t}&token=1&userData=${r}&loginTraceId=` + ModelManager_1.ModelManager.LoginModel.LoginTraceId
    }
    static DMi() {
        var e = ModelManager_1.ModelManager.LoginServerModel.GetCurrentSelectServerIp(),
            o = ModelManager_1.ModelManager.LoginModel.SetRpcHttp(LoginController.LMi, 13e3),
            r = ModelManager_1.ModelManager.LoginModel.GetLoginUid(),
            n = ModelManager_1.ModelManager.LoginModel.GetLoginUserNameWithUriEncode(),
            i = ModelManager_1.ModelManager.LoginModel.GetLoginToken(),
            t = UE.KuroStaticLibrary.HashStringWithSHA1(i),
            a = UE.KuroSDKManager.GetBasicInfo()?.DeviceId ?? "0",
            e = e.startsWith("http")?e : `http://${e}:5500`;
        return Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-Http-GlobalSDK环境", ["uId", r], ["userName", n], ["token", t], ["userData", o], ["deviceId", a]), e + `/api/login?loginType=1&userId=${r}&userName=${n}&token=${i}&userData=${o}&deviceId=${a}&loginTraceId=` + ModelManager_1.ModelManager.LoginModel.LoginTraceId
    }
    static Lsa(e) {
        ModelManager_1.ModelManager.LoginModel.HasBackToGameData() && !e && (ModelManager_1.ModelManager.LoginModel.CheckBackToGameFailCount()?TimerSystem_1.TimerSystem.Delay(() => {
            this.IMi()
        }, TRY_BACK_TO_GAME_INTERVAL) : (ModelManager_1.ModelManager.LoginModel.GetBackToGameData().LoadingWidget.RemoveFromParent(), ModelManager_1.ModelManager.LoginModel.RemoveBackToGameData(), this.IMi()))
    }
    static ConnectServer(e, o, r) {
        var n, i = Json_1.Json.Parse(o);
        void 0 === i?(Log_1.Log.CheckError() && Log_1.Log.Error("Login", 9, "服务器返回http结果反序列化失败!", ["result", o], ["httpCode", e]), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.LoginHttpRet, Protocol_1.Aki.Protocol.O4n.Proto_HttpResultUndefine), this.Lsa(!1)) : (GameUtils_1.GameUtils.CreateStat("Login-CleanRpcHttp"), o = ModelManager_1.ModelManager.LoginModel.CleanRpcHttp(i.userData), n = UE.KuroStaticLibrary.HashStringWithSHA1(i.token), o?(Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-Http-登录http请求返回", ["Token", n], ["Host", i.host], ["Port", i.port], ["Code", i.code], ["rpcId", i.userData], ["errMessage", i.errMessage], ["hasRpc", o], ["httpCode", e]), LoginController.RMi(i)?(void 0 !== i.sex && ModelManager_1.ModelManager.LoginModel.SetPlayerSex(i.sex), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.LoginHttpRet), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.LoginHttpRet), LoginController.UMi(i.token, i.host, i.port, r).then(e => {
            this.Lsa(e), LoginController.DisConnect(e), e && LoginController.$ta()
        }, LoginController.AMi)) : (Log_1.Log.CheckError() && Log_1.Log.Error("Login", 17, "http请求返回状态错误", ["Token", n], ["Host", i.host], ["Port", i.port], ["Code", i.code], ["rpcId", i.userData], ["errMessage", i.errMessage], ["hasRpc", o], ["httpCode", e]), Log_1.Log.CheckError() && Log_1.Log.Error("Login", 17, "http请求返回状态错误", ["Token", n], ["Host", i.host], ["Port", i.port], ["Code", i.code], ["rpcId", i.userData], ["errMessage", i.errMessage], ["hasRpc", o], ["httpCode", e]), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.LoginHttpRet, i.code), this.Lsa(!1))) : (Log_1.Log.CheckError() && Log_1.Log.Error("Login", 9, "http请求返回超时", ["Token", n], ["Host", i.host], ["Port", i.port], ["Code", i.code], ["rpcId", i.userData], ["errMessage", i.errMessage], ["httpCode", e]), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.LoginHttpRet, Protocol_1.Aki.Protocol.O4n.Proto_HttpTimeout), this.Lsa(!1)))
    }
    static RMi(e) {
        var o = e.code;
        return o === Protocol_1.Aki.Protocol.O4n.NRs || (o === Protocol_1.Aki.Protocol.O4n.Proto_ErrLoginDeviceBan || o === Protocol_1.Aki.Protocol.O4n.Proto_ErrLoginIpBan || o === Protocol_1.Aki.Protocol.O4n.Proto_HadBan?this.CZs(e.code, e.banTimeStamp, e.banReason) : (ModelManager_1.ModelManager.LoginModel.AddLoginFailCount(), o === Protocol_1.Aki.Protocol.O4n.Proto_ServerMaintenance || o === Protocol_1.Aki.Protocol.O4n.Proto_ServerNotOpen || o === Protocol_1.Aki.Protocol.O4n.Proto_NotInUserIdWhiteList?this.GetAndShowStopServerNotice() : ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenLoginStatusCodeTipView(o)), !1)
    }
    static CZs(e, o, r) {
        o = MathUtils_1.MathUtils.LongToNumber(o) - TimeUtil_1.TimeUtil.GetServerTime(), r = ConfigManager_1.ConfigManager.ReportConfig?.GetBanInfoByTypeAndReason(2, r);
        let n = 161;
        e === Protocol_1.Aki.Protocol.O4n.Proto_ErrLoginDeviceBan?n = 193 : e === Protocol_1.Aki.Protocol.O4n.Proto_ErrLoginIpBan && (n = 192);
        o >= FOREVERTIME && (n = 194);
        var o = TimeUtil_1.TimeUtil.GetCountDownDataFormat2(o),
            i = new ConfirmBoxDefine_1.ConfirmBoxDataNew(n);
        e === Protocol_1.Aki.Protocol.O4n.Proto_ErrLoginIpBan?i.SetTextArgs(o.CountDownText ?? "") : (e = MultiTextLang_1.configMultiTextLang.GetLocalTextNew(r.BanDescribe), i.SetTextArgs(e, o.CountDownText ?? "")), ControllerHolder_1.ControllerHolder.ConfirmBoxController.ShowConfirmBoxNew(i)
    }
    static async UMi(e, o, r, n) {
        GameUtils_1.GameUtils.CreateStat("Login-ConnectGateWay"), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-连接网关", ["token", e], ["host", o], ["port", r], ["isSmokeTest", n]);
        let i = await LoginController.PMi(e, o, r);
        if (!i) return i;
        if (GameUtils_1.GameUtils.CreateStat("Login-AskProtoKey"), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-请求密钥"), !(i = await LoginController.xMi())) return i;
        if (GameUtils_1.GameUtils.CreateStat("Login-LoginRequest"), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-LoginRequest"), !(i = await LoginController.wMi(e))) return i;
        if (ModelManager_1.ModelManager.LoginModel.GetHasCharacter()) {
            if (Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-已有角色, 跳过创角"), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.EnterGameReq), !(i = await LoginController.HandleLoginGame(n, !0))) return i
        } else if (GameUtils_1.GameUtils.CreateStat("Login-CreateCharacterRequest"), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-请求创角"), n) {
            o = await LoginController.CreateCharacterRequest();
            if (!(i = await LoginController.HandleLoginGame(n, o === Protocol_1.Aki.Protocol.O4n.NRs))) return i
        } else LoginController.IsLoginViewOpen() && LoginController.ExitLoginView(), UiManager_1.UiManager.OpenView("CreateCharacterView");
        return !0
    }
    static DisConnect(e) {
        e?HotPatchLogReport_1.HotPatchLogReport.ReportLogin(HotPatchLogReport_1.LoginLogEventDefine.EnterGame, "enter_game_success") : (Net_1.Net.Disconnect(2), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init), HotPatchLogReport_1.HotPatchLogReport.ReportLogin(HotPatchLogReport_1.LoginLogEventDefine.EnterGame, "enter_game_failed"))
    }
    static async HandleLoginGame(e, o) {
        var r = await LoginController.EnterGameAsync();
        return e?(Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 11, "冒烟测试登录流程", ["登录结果", o], ["EnterGame结果", r]), r || LoginController.IsLoginViewOpen() || LoginController.IMi()) : (Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 11, "正常登录流程", ["登录结果", o], ["EnterGame结果", r]), EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.LoginRequestResult, r)), r
    }
    static async PMi(e, o, r) {
        ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.ConvGate), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.ConvGate), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 9, "登录网关", ["host", o], ["port", r]);
        var n = await Net_1.Net.ConnectAsync(o, r, 3e3, 3);
        return 0 !== n?(ModelManager_1.ModelManager.LoginModel.AddLoginFailCount(), ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenConfirmBoxByTextId("ConnectGateWayFail"), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 31, "登录网关失败！", ["result", n]), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.ConvRet, Protocol_1.Aki.Protocol.O4n.Proto_ConvGateTimeout), !1) : (ModelManager_1.ModelManager.LoginModel.SetReconnectInfo(e, o, r), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.ConvRet), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.ConvRet), !0)
    }
    static BMi() {
        var e;
        return UE.KuroStaticLibrary.IsModuleLoaded("KuroTDM")?"CN" !== BaseConfigController_1.BaseConfigController.GetPublicValue("SdkArea")?(Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 28, "海外sdk不使用tdm"), "") : (e = UE.TDMStaticLibrary.GetDeviceInfo()).includes("Error")?(Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 28, "TDMStaticLibrary获取设备信息失败", ["tdm", e]), "") : e : (Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 28, "TDMStaticLibrary模块未加载"), "")
    }
    static async wMi(e) {
        ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.LoginReq);
        var o = new Protocol_1.Aki.Protocol._ss,
            r = (o.N9n = ModelManager_1.ModelManager.LoginModel.GetLoginUid(), o.k9n = e, this.vMi(), o.F9n = UE.KuroLauncherLibrary.GetAppVersion(), o.V9n = ModelManager_1.ModelManager.LoginModel.LauncherVersion, o.H9n = ModelManager_1.ModelManager.LoginModel.ResourceVersion, o.j9n = PlatformController_1.PlatformController.PackageClientBasicInfo(), o.W9n = new Protocol_1.Aki.Protocol.W9n, o.W9n.K9n = NetDefine_1.CONFIG_MD5_VALUE, o.W9n.Q9n = NetDefine_1.CONFIG_VERSION, o.W9n.X9n = NetDefine_1.PROTO_MD5_VALUE, o.W9n.$9n = NetDefine_1.PROTO_SEED_MD5_VALUE, o.W9n.Y9n = NetDefine_1.PROTO_VERSION, BaseConfigController_1.BaseConfigController.GetPackageConfigOrDefault("Stream"));
        o.W9n.J9n = r, o.e$s = await KuroPushController_1.KuroPushController.GetPushNotiPermissionEnableState(), o.dzs = KuroPushController_1.KuroPushController.GetClientId(), o.z9n = ModelManager_1.ModelManager.LoginModel.LoginTraceId ?? "", o.Z9n = new Protocol_1.Aki.Protocol.Z9n;
        let n = !1,
            i = !1;
        2 === Info_1.Info.PlatformType?(n = UE.KuroStaticAndroidLibrary.GetDeviceIsRooted(), i = UE.KuroStaticAndroidLibrary.GetDeviceIsEmulator()) : 1 === Info_1.Info.PlatformType && (n = UE.KuroStaticiOSLibrary.GetDeviceJailbroken()), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 28, "获取ACE信息", ["ifRoot", n], ["ifSimulator", i]), o.Z9n.e7n = n, o.Z9n.t7n = i;
        r = this.BMi(), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 28, "设备信息", ["tdm", r]), o.Z9n.i7n = r, LoginController.bMi() && (this.vMi(), o.r7n = Protocol_1.Aki.Protocol.r7n.create(), o.r7n.o7n = ModelManager_1.ModelManager.LoginModel.PublicJsonVersion, o.r7n.n7n = ModelManager_1.ModelManager.LoginModel.PublicMiscVersion, o.r7n.s7n = ModelManager_1.ModelManager.LoginModel.PublicUniverseEditorVersion), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-LoginRequest-请求登录", ["account", o.N9n], ["token", o.k9n], ["AppVersion", o.F9n], ["LauncherVersion", o.V9n], ["ResourceVersion", o.H9n], ["ClientBasicInfo", o.j9n], ["ConfigMd5", NetDefine_1.CONFIG_MD5_VALUE], ["ConfigVersion", NetDefine_1.CONFIG_VERSION], ["ProtoMd5", NetDefine_1.PROTO_MD5_VALUE], ["ProtoSeedMd5", NetDefine_1.PROTO_SEED_MD5_VALUE], ["ProtoVersion", NetDefine_1.PROTO_VERSION]), r = await LoginController.qMi(o);
        return r?.hvs === Protocol_1.Aki.Protocol.O4n.Proto_ServerFullLoadGate?(Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-LoginRequest-ServerFullLoadGate"), await LoginController.GMi(r.G9n, r.O9n, r.Uxs)?LoginController.wMi(e) : (ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init), !1)) : ModelManager_1.ModelManager.LoginModel.IsLoginStatus(LoginDefine_1.ELoginStatus.LoginRet)?(UiManager_1.UiManager.IsViewOpen("LoginQueueTipsView") && await UiManager_1.UiManager.CloseViewAsync("LoginQueueTipsView"), EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.LoginSuccess, o.N9n), Heartbeat_1.Heartbeat.BeginHeartBeat(HeartbeatDefine_1.EBeginHeartbeat.GetLoginResponse), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-LoginRequest-登录成功"), !0) : (Log_1.Log.CheckWarn() && Log_1.Log.Warn("Login", 9, "请求登录失败", ["account", o.N9n], ["token", o.k9n]), !1)
    }
    static async xMi() {
        ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.ProtoKeyReq), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.ProtoKeyReq);
        var e = new Protocol_1.Aki.Protocol.vss,
            e = (e.TVn = !0, e.a7n = ModelManager_1.ModelManager.LoginModel.LoginTraceId ?? "", Net_1.Net.ChangeState1(), await Net_1.Net.CallAsync(111, e, 3e3));
        return e?(Net_1.Net.SetDynamicProtoKey(e.Z4n, e.j4n), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.ProtoKeyRet), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.ProtoKeyRet), !0) : (LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.ProtoKeyRet, Protocol_1.Aki.Protocol.O4n.Proto_ProtoKeyTimeout), !1)
    }
    static async qMi(e, o = 0) {
        var r = ModelManager_1.ModelManager.LoginModel.GetLoginStatus();
        if (r !== LoginDefine_1.ELoginStatus.Init && r !== LoginDefine_1.ELoginStatus.LoginRet) {
            LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.LoginReq);
            r = await Net_1.Net.CallAsync(103, e, 13e3);
            if (r) return Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-LoginRequest-Response", ["Code", r.hvs]), ModelManager_1.ModelManager.LoginModel.Platform = r.h7n, Log_1.Log.CheckWarn() && Log_1.Log.Warn("Login", 10, "当前登录的游戏服务器节点：", ["response.Platform", r.h7n]), r.hvs === Protocol_1.Aki.Protocol.O4n.Proto_LoginRetry?(LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.LoginRet, r.hvs), 5 <= o?r : await LoginController.qMi(e, o + 1)) : (r.hvs === Protocol_1.Aki.Protocol.O4n.Proto_AppVersionNotMatch || r.hvs === Protocol_1.Aki.Protocol.O4n.Proto_LauncherVersionIsTooLow || r.hvs === Protocol_1.Aki.Protocol.O4n.Proto_ResourceVersionIsTooLow?(ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init), (e = new ConfirmBoxDefine_1.ConfirmBoxDataNew(54)).FunctionMap.set(1, LoginController.NMi), ControllerHolder_1.ControllerHolder.ConfirmBoxController.ShowConfirmBoxNew(e), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.LoginRet, r.hvs)) : (o = r.hvs === Protocol_1.Aki.Protocol.O4n.Proto_HaveNoCharacter, ModelManager_1.ModelManager.LoginModel.SetHasCharacter(!o), o || r.hvs === Protocol_1.Aki.Protocol.O4n.NRs?(TimeUtil_1.TimeUtil.SetServerTimeStamp(r.Mws), e = Number(MathUtils_1.MathUtils.LongToBigInt(r.Mws)), cpp_1.FuncOpenLibrary.SetFirstTimestamp(e / 1e3), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.LoginRet), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.LoginRet), ModelManager_1.ModelManager.LoginModel.SetReconnectToken(r.l7n)) : (LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.LoginRet, r.hvs), r.hvs !== Protocol_1.Aki.Protocol.O4n.Proto_ServerFullLoadGate && (ModelManager_1.ModelManager.LoginModel.AddLoginFailCount(), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init), ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(r.hvs, 104)))), r);
            LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.LoginRet, Protocol_1.Aki.Protocol.O4n.Proto_LoginReqTimeout)
        }
    }
    static async CreateCharacterRequest() {
        ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.CreateReq);
        var e = ModelManager_1.ModelManager.LoginModel.GetPlayerSex(),
            o = ModelManager_1.ModelManager.LoginModel.GetPlayerName(),
            r = new Protocol_1.Aki.Protocol.hss,
            e = (r._7n = e, r.w8n = o, Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 9, "请求创角", ["Sex", r._7n], ["Name", r.w8n]), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.CreateReq), await Net_1.Net.CallAsync(101, r, 13e3));
        return e?((o = e?.hvs) === Protocol_1.Aki.Protocol.O4n.Proto_ContainsDirtyWord || o === Protocol_1.Aki.Protocol.O4n.Proto_ErrRoleInvalidNameLength?LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.CreateRet, o) : o !== Protocol_1.Aki.Protocol.O4n.NRs?(ModelManager_1.ModelManager.LoginModel.AddLoginFailCount(), ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(e.hvs, 102), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 9, "请求创角失败", ["Sex", r._7n], ["Name", r.w8n]), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.CreateRet, o)) : (ModelManager_1.ModelManager.LoginModel.SetCreatePlayerTime(e.ews), ModelManager_1.ModelManager.LoginModel.SetCreatePlayerId(e.q5n), ControllerHolder_1.ControllerHolder.KuroSdkController.PostKuroSdkEvent(3), (r = new Map).set("101104", ""), KuroSdkReport_1.KuroSdkReport.Report(new KuroSdkReport_1.SdkReportCreateRole(r)), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.CreateRet), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.CreateRet), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.EnterGameReq)), o) : (e = Protocol_1.Aki.Protocol.O4n.Proto_CreateCharacterReqTimeout, ModelManager_1.ModelManager.LoginModel?.IsLoginStatus(LoginDefine_1.ELoginStatus.Init) || (ControllerHolder_1.ControllerHolder.GenericPromptController.ShowPromptByCode("CreateCharacterTimeoutTip"), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.CreateRet, e), LoginController.DisConnect(!1), LoginController.OMi()), e)
    }
    static SetIfFirstTimeLogin() {
        ModelManager_1.ModelManager.LoginModel.SetTodayFirstTimeLogin(LoginController.kMi()), ModelManager_1.ModelManager.LoginModel.SetLastLoginTime(TimeUtil_1.TimeUtil.GetServerTime())
    }
    static kMi() {
        var e, o, r = ModelManager_1.ModelManager.LoginModel.GetLastLoginTime();
        return TimeUtil_1.TimeUtil.GetServerTime() - r >= TimeUtil_1.TimeUtil.OneDaySeconds || !r || (e = TimeUtil_1.TimeUtil.GetServerTime(), o = (new Date).setHours(4, 0, 0, 0) / 1e3, Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 28, "当前时间", ["time", e]), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 28, "之前时间", ["time", r]), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 28, "当天4点时间戳", ["time", o]), o <= e && r < o)
    }
    static async FMi() {
        (ControllerHolder_1.ControllerHolder.KuroSdkController.CanUseSdk() || CloudGameManager_1.CloudGameManager.IsCloudGame) && ((o = ConfigManager_1.ConfigManager.LoginConfig.GetDefaultSingleMapId()) && ModelManager_1.ModelManager.LoginModel.SetSingleMapId(o), o = ConfigManager_1.ConfigManager.LoginConfig.GetDefaultMultiMapId()) && ModelManager_1.ModelManager.LoginModel.SetMultiMapId(o);
        var e, o = new Protocol_1.Aki.Protocol.css,
            o = (o.u7n = ModelManager_1.ModelManager.LoginModel.GetSingleMapId(), o.c7n = ModelManager_1.ModelManager.LoginModel.GetMultiMapId(), o.m7n = ModelManager_1.ModelManager.LoginModel.BornMode, o.e8n = ModelManager_1.ModelManager.LoginModel.BornLocation, ModelManager_1.ModelManager.LoadingModel.SetIsLoginToWorld(!0), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.EnterGameReq), Net_1.Net.ChangeStateEnterGame(), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-EnterGame-Call", ["enterGameRequest", o]), await Net_1.Net.CallAsync(105, o, 13e3));
        return o?o.hvs === Protocol_1.Aki.Protocol.O4n.NRs?(Net_1.Net.ChangeStateFinishLogin(), !0) : (LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.EnterGameRet, o.hvs), o.hvs !== Protocol_1.Aki.Protocol.O4n.Proto_ServerFullLoadGame?(ModelManager_1.ModelManager.LoginModel.AddLoginFailCount(), ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenErrorCodeTipView(o.hvs, 106), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 9, "请求进入游戏失败"), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init), !1) : await LoginController.GMi(o.G9n, o.O9n, o.Uxs)?LoginController.FMi() : (ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init), !1)) : (Log_1.Log.CheckWarn() && Log_1.Log.Warn("Login", 9, "请求进入游戏失败, 超时"), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.EnterGameRet, Protocol_1.Aki.Protocol.O4n.Proto_EnterGameTimeout), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init), o = new ConfirmBoxDefine_1.ConfirmBoxDataNew(33), e = ConfigManager_1.ConfigManager.ErrorCodeConfig.GetTextByErrorId(Protocol_1.Aki.Protocol.O4n.Proto_LoginTimeout), o.SetTextArgs(e), ControllerHolder_1.ControllerHolder.ConfirmBoxController.ShowConfirmBoxNew(o), UiManager_1.UiManager.CloseView("NetWorkMaskView"), !1)
    }
    static async GMi(e, o, r) {
        UiManager_1.UiManager.IsViewOpen("LoginQueueTipsView") || ((n = new LoginDefine_1.LoginQueueConfig).G9n = e, n.O9n = o, await UiManager_1.UiManager.OpenViewAsync("LoginQueueTipsView", n)), ModelManager_1.ModelManager.LoginModel.CreateAutoLoginPromise(), ModelManager_1.ModelManager.LoginModel.AutoLoginTimerId = TimerSystem_1.TimerSystem.Delay(() => {
            ModelManager_1.ModelManager.LoginModel.FinishAutoLoginPromise(!0), ModelManager_1.ModelManager.LoginModel.AutoLoginTimerId = void 0
        }, Math.max(r, TimeUtil_1.TimeUtil.InverseMillisecond));
        var n, e = await ModelManager_1.ModelManager.LoginModel.WaitAutoLoginPromise();
        return e || Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 9, "玩家取消了登录排队, 不再排队"), ModelManager_1.ModelManager.LoginModel.ClearAutoLoginTimerId(), ModelManager_1.ModelManager.LoginModel.ClearAutoLoginPromise(), e
    }
    static async EnterGameAsync() {
        return Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-EnterGame-进入游戏"), !!ModelManager_1.ModelManager.LoginModel.IsLoginStatus(LoginDefine_1.ELoginStatus.EnterGameReq) && (GameUtils_1.GameUtils.CreateStat("Login-EnterGameAsync"), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-EnterGame-请求进入游戏"), await this.FMi()?(UiManager_1.UiManager.IsViewOpen("LoginQueueTipsView") && await UiManager_1.UiManager.CloseViewAsync("LoginQueueTipsView"), ModelManager_1.ModelManager.LoginModel.CleanLoginFailCount(LoginDefine_1.ECleanFailCountWay.LoginSuccess), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.EnterGameRet), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.EnterGameRet), ModelManager_1.ModelManager.LoginModel.LoginTraceId = void 0, EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.EnterGameSuccess), GameUtils_1.GameUtils.CreateStat("Login-EnterGameSuccess"), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-EnterGame-进入游戏成功"), ModelManager_1.ModelManager.CreatureModel.SetGameplayTagHash(UE.GASBPLibrary.GetNetworkGameplayTagNodeIndexHash()), !0) : (Log_1.Log.CheckWarn() && Log_1.Log.Warn("Login", 17, "LoginProcedure-EnterGame-进入游戏失败"), !1))
    }
    static CheckCanReConnect() {
        return LoginController.IsLoginViewOpen()?(Log_1.Log.CheckError() && Log_1.Log.Error("Login", 31, "不能重连 LoginViewOpen"), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init), !1) : !LoginController.OMi() || (Log_1.Log.CheckError() && Log_1.Log.Error("Login", 31, "不能重连 CreateCharacterViewOpen"), ScrollingTipsController_1.ScrollingTipsController.ShowTipsById("ConnectGateWayFail"), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init), !1)
    }
    static OMi() {
        return !!UiManager_1.UiManager.IsViewShow("CreateCharacterView") && (UiManager_1.UiManager.CloseView("NetWorkMaskView"), LoginController.CreateCharacterViewToLoginView(), !0)
    }
    static SdkLoginNew() {
        PlatformSdkManagerNew_1.PlatformSdkManagerNew.GetPlatformSdk().Login(e => {
            var o;
            e?(o = {
                LoginCode: 1,
                Uid: e.cuid,
                UserName: e.username,
                Token: e.autoToken
            }, this.$ya(e.code), ModelManager_1.ModelManager.LoginModel.SetSdkLoginState(0), this.OnSdkLogin(o)) : (e = new ConfirmBoxDefine_1.ConfirmBoxDataNew(39), ControllerHolder_1.ControllerHolder.ConfirmBoxController.ShowNetWorkConfirmBoxView(e))
        })
    }
    static $ya(e) {
        PlatformSdkServer_1.PlatformSdkServer.GetAccessToken(e, e => {
            ModelManager_1.ModelManager.LoginModel.SdkAccessToken = e.access_token, this.Xya()
        })
    }
    static Xya() {
        void 0 === ModelManager_1.ModelManager.LoginModel.SdkAccessTokenTimer && (ModelManager_1.ModelManager.LoginModel.SdkAccessTokenTimer = TimerSystem_1.RealTimeTimerSystem.Forever(this.Yya, 6e5, 0, void 0, "RenewSdkAccessToken", !1))
    }
    static OpenSdkLoginView() {
        LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.SdkViewOpen), ControllerHolder_1.ControllerHolder.KuroSdkController.PostKuroSdkEvent(0)
    }
    static ReOpenSdkLoginView() {
        ControllerHolder_1.ControllerHolder.KuroSdkController.PostKuroSdkEvent(7)
    }
    static GetAndShowStopServerNotice() {
        Log_1.Log.CheckInfo() && Log_1.Log.Info("KuroSdk", 28, "获得公告");
        var o = BaseConfigController_1.BaseConfigController.GetLoginServers();
        if (o && 0 !== o.length) {
            let e = o[0].id;
            ModelManager_1.ModelManager.LoginServerModel.CurrentSelectServerData && (e = ModelManager_1.ModelManager.LoginServerModel.CurrentSelectServerData.id);
            o = PublicUtil_1.PublicUtil.GetLoginNoticeUrl2(PublicUtil_1.PublicUtil.GetGameId(), LanguageSystem_1.LanguageSystem.PackageLanguage, e) ?? "";
            Log_1.Log.CheckDebug() && Log_1.Log.Debug("Login", 9, "获取登录公告", ["http", o]), Http_1.Http.Get(o, void 0, this.HMi)
        } else Log_1.Log.CheckInfo() && Log_1.Log.Info("KuroSdk", 28, "没有登录服务器信息")
    }
    static jMi() {
        var e = new LoginModel_1.LoginNotice;
        e.Title = MultiTextLang_1.configMultiTextLang.GetLocalTextNew("DefaultLoginTitle") ?? "", e.content = MultiTextLang_1.configMultiTextLang.GetLocalTextNew("DefaultLoginNotice") ?? "", this.WMi(e)
    }
    static WMi(e) {
        e && (ModelManager_1.ModelManager.LoginModel.LoginNotice = e, (e = new ConfirmBoxDefine_1.ConfirmBoxDataNew(42)).SetTitle(ModelManager_1.ModelManager.LoginModel.LoginNotice.Title), e.SetTextArgs(ModelManager_1.ModelManager.LoginModel.LoginNotice.content), ControllerHolder_1.ControllerHolder.ConfirmBoxController.ShowConfirmBoxNew(e))
    }
    static IMi() {
        Log_1.Log.CheckDebug() && Log_1.Log.Debug("Login", 28, "进入登录界面");
        var e = ControllerHolder_1.ControllerHolder.KuroSdkController.CanUseSdk() || PlatformSdkManagerNew_1.PlatformSdkManagerNew.IsSdkOn || CloudGameManager_1.CloudGameManager.IsCloudGame;
        ModelManager_1.ModelManager.LoginModel.HasBackToGameData()?(ControllerHolder_1.ControllerHolder.KuroSdkController.CanUseSdk() && this.oAa(), this.rAa()) : this.IsLoginViewOpen() || (e?UiManager_1.UiManager.OpenView("LoginView") : this.KMi() || UiManager_1.UiManager.OpenView("LoginDebugView"))
    }
    static rAa() {
        var e = ControllerHolder_1.ControllerHolder.KuroSdkController.CanUseSdk() || CloudGameManager_1.CloudGameManager.IsCloudGame,
            o = ModelManager_1.ModelManager.LoginModel.GetBackToGameData();
        void 0 === o || void 0 === o.BackToGameLoginData?Log_1.Log.CheckError() && Log_1.Log.Error("Login", 28, "LoginToCacheServer", ["cacheSaveData", o]) : (ModelManager_1.ModelManager.LoginServerModel.SelectCurrentSelectServerByServerId(o.BackToGameLoginData.SelectServerIp, o.BackToGameLoginData.SelectServerId), LoginController.GetHttp(!e))
    }
    static oAa() {
        var e = ModelManager_1.ModelManager.LoginModel.GetBackToGameData(),
            o = e?.BackToGameLoginData;
        void 0 === e || void 0 === o?Log_1.Log.CheckError() && Log_1.Log.Error("Login", 28, "RecoverSdkLoginData", ["cacheSaveData", e]) : (ModelManager_1.ModelManager.LoginModel.SetSdkLoginConfig(o.Uid, o.UserName, o.Token), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 28, "RecoverSdkLoginData", ["loginData", o]))
    }
    static KMi() {
        var e, o, r;
        return !!GlobalData_1.GlobalData.IsPlayInEditor && !!(e = PublicUtil_1.PublicUtil.TestLoadEditorConfigData())?.EditorStartConfig?.IsReLoadArchive && (o = e.EditorStartConfig.ArchiveAccount, r = e.EditorStartConfig.DungeonId, e.EditorStartConfig.IsReLoadArchive = !1, PublicUtil_1.PublicUtil.TestSaveEditorConfigData(e), Log_1.Log.CheckDebug() && Log_1.Log.Debug("Login", 43, "GM读取存档快速登录", ["账号:", o], ["副本ID:", r]), ModelManager_1.ModelManager.LoginModel.SetSingleMapId(r), ModelManager_1.ModelManager.LoginModel.SetAccount(o), LoginController.GetHttp(!0), !0)
    }
    static IsLoginViewOpen() {
        return UiManager_1.UiManager.IsViewShow("LoginView") || UiManager_1.UiManager.IsViewShow("LoginDebugView")
    }
    static ExitLoginView() {
        UiManager_1.UiManager.IsViewShow("LoginDebugView") && UiManager_1.UiManager.CloseView("LoginDebugView"), UiManager_1.UiManager.IsViewShow("LoginView") && UiManager_1.UiManager.CloseView("LoginView")
    }
    static LogLoginProcessLink(e, o = Protocol_1.Aki.Protocol.O4n.NRs) {
        var r = ModelManager_1.ModelManager.LoginModel.GetSdkLoginConfig(),
            n = new LogReportDefine_1.LoginProcessLink;
        n.s_trace_id = ModelManager_1.ModelManager.LoginModel.LoginTraceId ?? "", n.s_user_id = r?.Uid ?? "", n.s_user_name = r?.UserName ?? ModelManager_1.ModelManager.LoginModel.GetAccount(), n.s_login_step = LoginDefine_1.ELoginStatus[e], n.s_app_version = UE.KuroLauncherLibrary.GetAppVersion(), n.s_launcher_version = LocalStorage_1.LocalStorage.GetGlobal(LocalStorageDefine_1.ELocalStorageGlobalKey.LauncherPatchVersion, n.s_app_version), n.s_resource_version = LocalStorage_1.LocalStorage.GetGlobal(LocalStorageDefine_1.ELocalStorageGlobalKey.PatchVersion, n.s_app_version), n.s_client_version = BaseConfigController_1.BaseConfigController.GetVersionString(), n.i_error_code = o, n.s_cpu_info = ModelManager_1.ModelManager.LoginModel.CpuInfo(), n.s_device_info = ModelManager_1.ModelManager.LoginModel.DeviceInfo(), LogReportController_1.LogReportController.LogReport(n), Log_1.Log.CheckDebug() && Log_1.Log.Debug("Login", 9, "上报登录埋点", ["loginStep", LoginDefine_1.ELoginStatus[e]], ["code", o])
    }
    static DevLoginWithEditorConfig() {
        PublicUtil_1.PublicUtil.SetIsSilentLogin(!0), UiBlueprintFunctionLibrary_1.default.SetTempLocation(UiBlueprintFunctionLibrary_1.default.TestSceneLoadBornLocation()), UiBlueprintFunctionLibrary_1.default.TestSceneLogin("AkiWorld_WP")
    }
    static vMi() {
        var e = ModelManager_1.ModelManager.LoginModel,
            o = (e.PublicJsonVersion = Number(BaseConfigController_1.BaseConfigController.GetPackageConfigOrDefault("ChangelistConfigServerDataPublicjson", "0")), e.PublicMiscVersion = Number(BaseConfigController_1.BaseConfigController.GetPackageConfigOrDefault("ChangelistConfigServerMisc", "0")), e.PublicUniverseEditorVersion = Number(BaseConfigController_1.BaseConfigController.GetPackageConfigOrDefault("ChangelistConfigServerUniverseEditorConfig", "0")), UE.KuroLauncherLibrary.GetAppVersion());
        e.LauncherVersion = LocalStorage_1.LocalStorage.GetGlobal(LocalStorageDefine_1.ELocalStorageGlobalKey.LauncherPatchVersion, o), e.LauncherVersion = e.LauncherVersion?.length?e.LauncherVersion : o, e.ResourceVersion = LocalStorage_1.LocalStorage.GetGlobal(LocalStorageDefine_1.ELocalStorageGlobalKey.PatchVersion, o), e.ResourceVersion = e.ResourceVersion?.length?e.ResourceVersion : o
    }
    static bMi() {
        return !GlobalData_1.GlobalData.IsPlayInEditor
    }
    static $ta() {
        var e;
        this.bMi() && ((e = ModelManager_1.ModelManager.LoginModel).VerifyConfigVersionHandle && (TimerSystem_1.TimerSystem.Remove(e.VerifyConfigVersionHandle), e.VerifyConfigVersionHandle = void 0), e.VerifyConfigVersionHandle = TimerSystem_1.TimerSystem.Forever(LoginController.Xta, VERIFY_CONFIG_VERSION_INTERVAL))
    }
    static Kta() {
        var e;
        this.bMi() && (e = ModelManager_1.ModelManager.LoginModel).VerifyConfigVersionHandle && (TimerSystem_1.TimerSystem.Remove(e.VerifyConfigVersionHandle), e.VerifyConfigVersionHandle = void 0)
    }
    static NCa() {
        var e;
        ModelManager_1.ModelManager.LoginModel.SdkAccountChangeNeedExitFlag && ModelManager_1.ModelManager.GameModeModel.WorldDoneAndLoadingClosed && ((e = new ConfirmBoxDefine_1.ConfirmBoxDataNew(38)).SetCloseFunction(() => {
            ControllerHolder_1.ControllerHolder.ReConnectController.Logout(ReconnectDefine_1.ELogoutReason.SdkLogoutAccount)
        }), ControllerHolder_1.ControllerHolder.ConfirmBoxController.ShowNetWorkConfirmBoxView(e))
    }
}
exports.LoginController = LoginController, (_a = LoginController).SMi = e => {
    cpp_1.FuncOpenLibrary.SetFirstTimestamp(0), e.hvs === Protocol_1.Aki.Protocol.O4n.NRs?Log_1.Log.CheckError() && Log_1.Log.Error("Login", 9, "收到登出通知, 但没有登出原因!") : UiManager_1.UiManager.IsInited?LoginController.yMi(e) : ModelManager_1.ModelManager.LoginModel.LogoutNotify = e
}, LoginController.Tsa = e => {
    ControllerHolder_1.ControllerHolder.ReConnectController.CreateBackToGameData(2), ControllerHolder_1.ControllerHolder.ReConnectController.TryBackToGame()
}, LoginController.Wvi = () => {
    ControllerHolder_1.ControllerHolder.KuroSdkController.PostKuroSdkEvent(2)
}, LoginController.MMi = () => {
    ModelManager_1.ModelManager.LoginModel.GetAutoOpenLoginView() && (ModelManager_1.ModelManager.LoginModel.SetAutoOpenLoginView(!1), LoginController.OpenLoginView()), ModelManager_1.ModelManager.LoginModel.LogoutNotify && LoginController.yMi(ModelManager_1.ModelManager.LoginModel.LogoutNotify), ModelManager_1.ModelManager.ReConnectModel.DisconnectedFunction && (ModelManager_1.ModelManager.ReConnectModel.DisconnectedFunction(), ModelManager_1.ModelManager.ReConnectModel.DisconnectedFunction = void 0)
}, LoginController.EMi = () => {
    Net_1.Net.Send(114, Protocol_1.Aki.Protocol.Sss.create()), LanguageUpdateManager_1.LanguageUpdateManager.StopAllDownload()
}, LoginController.GetHttp = (n = !1, e = !0) => {
    ModelManager_1.ModelManager.LoginModel.FixLoginFailInfo(), ModelManager_1.ModelManager.LoginModel.IsThisTimeCanLogin()?ModelManager_1.ModelManager.LoginModel.IsLoginStatus(LoginDefine_1.ELoginStatus.Init)?(Heartbeat_1.Heartbeat.StopHeartBeat(HeartbeatDefine_1.EStopHeartbeat.BeforeGetToken), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.LoginHttp), e && (ModelManager_1.ModelManager.LoginModel.LoginTraceId = UE.KismetGuidLibrary.NewGuid().ToString()), GameUtils_1.GameUtils.CreateStat("Login-BuildHttp"), e = LoginController.TMi(), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.LoginHttp), CrashCollectionController_1.CrashCollectionController.RecordHttpInfo(e), Log_1.Log.CheckDebug() && Log_1.Log.Debug("Login", 17, "LoginProcedure-Http-登录Http请求 Debug", ["http", e]), Log_1.Log.CheckInfo() && Log_1.Log.Info("Login", 17, "LoginProcedure-Http-登录Http请求"), Http_1.Http.Get(e, void 0, (e, o, r) => {
        LoginController.ConnectServer(o, r, n)
    })) : Log_1.Log.CheckWarn() && Log_1.Log.Warn("Login", 9, "正在登录中, 请勿重复操作！") : ScrollingTipsController_1.ScrollingTipsController.ShowTipsById("LoginFailTooManyTimes")
}, LoginController.LMi = () => {
    ControllerHolder_1.ControllerHolder.ErrorCodeController.OpenConfirmBoxByTextId("HttpTimeout"), ModelManager_1.ModelManager.LoginModel.AddLoginFailCount(), ModelManager_1.ModelManager.LoginModel.SetLoginStatus(LoginDefine_1.ELoginStatus.Init), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.LoginHttpRet, Protocol_1.Aki.Protocol.O4n.Proto_HttpTimeout)
}, LoginController.AMi = e => {
    e instanceof Error?Log_1.Log.CheckError() && Log_1.Log.ErrorWithStack("Login", 9, "登录异常发生异常", e, ["error", e.message]) : Log_1.Log.CheckError() && Log_1.Log.Error("Login", 9, "登录异常发生异常", ["error", e ?? void 0])
}, LoginController.OnSdkLogin = e => {
    1 === e.LoginCode?(ModelManager_1.ModelManager.LoginModel.SetSdkLoginState(1), HotPatchLogReport_1.HotPatchLogReport.ReportLogin(HotPatchLogReport_1.LoginLogEventDefine.SdkLogin, "sdk_login_success"), ModelManager_1.ModelManager.LoginModel.SetSdkLoginConfig(e.Uid, e.UserName, e.Token), ThirdPartySdkManager_1.ThirdPartySdkManager.SetUserInfo(e.Uid), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.SdkLoginSuccecc), ModelManager_1.ModelManager.LoginModel.SdkAccountChangeNeedExitFlag && LoginController.NCa()) : (ModelManager_1.ModelManager.LoginModel.SetSdkLoginState(0), HotPatchLogReport_1.HotPatchLogReport.ReportLogin(HotPatchLogReport_1.LoginLogEventDefine.SdkLogin, "sdk_login_failed"), LoginController.LogLoginProcessLink(LoginDefine_1.ELoginStatus.SdkLoginFail), Log_1.Log.CheckWarn() && Log_1.Log.Warn("Login", 28, "Sdk登录失败!!!")), EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.SdkLoginResult)
}, LoginController.Yya = () => {
    var e = ModelManager_1.ModelManager.LoginModel.SdkAccessToken;
    "" !== e && PlatformSdkServer_1.PlatformSdkServer.RenewAccessToken(e, e => {
        e || (TimerSystem_1.RealTimeTimerSystem.Remove(ModelManager_1.ModelManager.LoginModel.SdkAccessTokenTimer), ModelManager_1.ModelManager.LoginModel.SdkAccessTokenTimer = void 0, (e = new ConfirmBoxDefine_1.ConfirmBoxDataNew(10)).FunctionMap.set(1, () => {
            ControllerHolder_1.ControllerHolder.ReConnectController.Logout(ReconnectDefine_1.ELogoutReason.SdkRenewAccessTokenFailed)
        }), ControllerHolder_1.ControllerHolder.ConfirmBoxController.ShowNetWorkConfirmBoxView(e))
    })
}, LoginController.OnLogoutAccount = () => {
    var e = ModelManager_1.ModelManager.LoginModel.GetSdkLoginState();
    ModelManager_1.ModelManager.LoginModel.SetSdkLoginState(0), ModelManager_1.ModelManager.LoginModel.GetLoginStatus() >= LoginDefine_1.ELoginStatus.EnterGameRet && 0 !== e?ControllerHolder_1.ControllerHolder.ReConnectController.Logout(ReconnectDefine_1.ELogoutReason.SdkLogoutAccount) : (EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.SdkLoginResult), HotPatchLogReport_1.HotPatchLogReport.ReportLogin(HotPatchLogReport_1.LoginLogEventDefine.SdkLogin, "sdk_login_logout"))
}, LoginController.NMi = () => {
    ControllerHolder_1.ControllerHolder.KuroSdkController.PostKuroSdkEvent(5)
}, LoginController.HMi = (e, o, r) => {
    Log_1.Log.CheckDebug() && Log_1.Log.Debug("Login", 9, "获取登录公告返回", ["data", r]), 200 === o && (o = Json_1.Json.Parse(r))?((r = new LoginModel_1.LoginNotice).Phrase(o), !PublicUtil_1.PublicUtil.IsInIpWhiteList(r.WhiteLists) || (o = (new Date).getTime() * TimeUtil_1.TimeUtil.Millisecond) < r.BeginTime || o > r.EndTime || LoginController.WMi(r)) : _a.jMi()
}, LoginController.Xta = () => {
    var e = ModelManager_1.ModelManager.LoginModel,
        o = Protocol_1.Aki.Protocol.ria.create();
    o.F9n = UE.KuroLauncherLibrary.GetAppVersion(), o.V9n = e.LauncherVersion, o.H9n = e.ResourceVersion, Net_1.Net.Send(116, o)
}, LoginController.JDe = () => {
    LoginController.NCa()
};
//# sourceMappingURL=LoginController.js.map