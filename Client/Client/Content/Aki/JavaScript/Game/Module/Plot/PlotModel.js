"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.PlotModel=exports.PlotConfig=exports.INTERLUDE_FADE_OUT=exports.INTERLUDE_FADE_IN=void 0;const puerts_1=require("puerts"),UE=require("ue"),AudioDefine_1=require("../../../Core/Audio/AudioDefine"),AudioSystem_1=require("../../../Core/Audio/AudioSystem"),Log_1=require("../../../Core/Common/Log"),EntitySystem_1=require("../../../Core/Entity/EntitySystem"),ModelBase_1=require("../../../Core/Framework/ModelBase"),GameBudgetInterfaceController_1=require("../../../Core/GameBudgetAllocator/GameBudgetInterfaceController"),IGlobal_1=require("../../../UniverseEditor/Interface/IGlobal"),CameraController_1=require("../../Camera/CameraController"),EventDefine_1=require("../../Common/Event/EventDefine"),EventSystem_1=require("../../Common/Event/EventSystem"),PublicUtil_1=require("../../Common/PublicUtil"),GameQualitySettingsManager_1=require("../../GameQualitySettings/GameQualitySettingsManager"),Global_1=require("../../Global"),GlobalData_1=require("../../GlobalData"),ConfigManager_1=require("../../Manager/ConfigManager"),ControllerHolder_1=require("../../Manager/ControllerHolder"),ModelManager_1=require("../../Manager/ModelManager"),InputDistributeController_1=require("../../Ui/InputDistribute/InputDistributeController"),UiManager_1=require("../../Ui/UiManager"),ModManager_1=require("../../Manager/ModManager"),LevelLoadingController_1=require("../LevelLoading/LevelLoadingController"),PlotCleanRange_1=require("./PlotCleanRange"),PlotController_1=require("./PlotController"),PlotData_1=require("./PlotData"),PlotGlobalConfig_1=require("./PlotGlobalConfig"),PlotMontage_1=require("./PlotMontage"),PlotTemplate_1=require("./PlotTemplate"),PlotTextReplacer_1=require("./PlotTextReplacer"),PlotTimeOfDay_1=require("./PlotTimeOfDay"),PlotWeather_1=require("./PlotWeather"),AUDIO_STATE_PLOT_LEVEL_GROUP=(exports.INTERLUDE_FADE_IN=1,exports.INTERLUDE_FADE_OUT=1,"plot_perform_level"),AUDIO_STATE_NOT_PLOT="not_plot",PLOT_END_AUDIO_EVENT="plot_controller_end_plot",CAN_SKIP=!0,audioStatePlotLevel={LevelA:"level_a",LevelB:"level_b",LevelC:"level_c",LevelD:"level_d",Prompt:"level_d"};class PlotConfig{constructor(){this.DisableInput=!1,this.CanSkip=!1,this.CanSkipDebug=!1,this.CanInteractive=!1,this.CanPause=!1,this.CameraMode=void 0,this.IsAutoPlay=!1,this.IsAutoPlayCache=!1,this.PlotLevel=void 0,this.ShouldSwitchMainRole=!1,this.PauseTime=!1,this.SkipTalkWhenFighting=!1,this.SkipHiddenBlackScreenAtEnd=!1,this.IsGmPlayPlotOnce=!1,this.IsPreStreaming=!1,this.IsSkipConfirmBoxShow=!0}SetMode(e,t=!1){switch(this.SkipHiddenBlackScreenAtEnd=e.DisableAutoFadeOut,this.IsGmPlayPlotOnce&&(this.IsGmPlayPlotOnce=!1,this.SkipHiddenBlackScreenAtEnd=!1),e.Mode){case"LevelA":this.CameraMode=0,this.CanInteractive=!1,this.CanSkip=!e.NoSkip||this.CanSkipDebug,this.DisableInput=!0,this.CanPause=!1,this.PlotLevel="LevelA",this.IsAutoPlay=!0,this.ShouldSwitchMainRole=!1,this.PauseTime=!0,this.SkipTalkWhenFighting=!1,PlotController_1.PlotController.TogglePlotProtect(!0);break;case"LevelB":this.CameraMode=0,this.CanInteractive=!0,this.CanSkip=!e.NoSkip||this.CanSkipDebug,this.DisableInput=!0,this.CanPause=!0,this.IsAutoPlay=this.IsAutoPlayCache,this.PlotLevel="LevelB",this.ShouldSwitchMainRole=!1,this.PauseTime=!0,this.SkipTalkWhenFighting=!1,PlotController_1.PlotController.TogglePlotProtect(!0);break;case"LevelC":void 0===e.UseFlowCamera?this.CameraMode=2:this.CameraMode=e.UseFlowCamera?2:1,this.CanInteractive=!0,this.CanSkip=!e.NoSkip||this.CanSkipDebug,this.DisableInput=!0,this.CanPause=!t,this.IsAutoPlay=this.IsAutoPlayCache,this.PlotLevel="LevelC",this.ShouldSwitchMainRole=e.IsSwitchMainRole,this.PauseTime=!t,this.SkipTalkWhenFighting=!1,PlotController_1.PlotController.TogglePlotProtect(!0);break;case"LevelD":this.CameraMode=1,this.CanInteractive=!1,this.CanSkip=!1,this.DisableInput=!1,this.CanPause=!1,this.IsAutoPlay=!0,this.ShouldSwitchMainRole=!1,this.PlotLevel="LevelD",this.PauseTime=!1,this.SkipTalkWhenFighting=e.Interruptible,this.SkipHiddenBlackScreenAtEnd=!0;break;case"Prompt":this.CameraMode=1,this.CanInteractive=!1,this.CanSkip=!1,this.DisableInput=!1,this.CanPause=!1,this.IsAutoPlay=this.IsAutoPlayCache,this.PlotLevel="Prompt",this.PauseTime=!1,this.SkipTalkWhenFighting=e.Interruptible,this.SkipHiddenBlackScreenAtEnd=!0}}}exports.PlotConfig=PlotConfig;class PlotModel extends ModelBase_1.ModelBase{constructor(){super(...arguments),this.IsInPlot=!1,this.IsInInteraction=!1,this.IsBackInteractionAfterFlow=!1,this.CurrentInteractEntity=void 0,this.PlotStartFrame=0,this.FlowListName="",this.IsServerNotify=!1,this.IsAsync=!1,this.PlotConfig=new PlotConfig,this.PlotResult=new PlotData_1.PlotResultInfo,this.TmpPlotResult=new PlotData_1.PlotResultInfo,this.qYi=void 0,this.PlotPendingList=new Array,this.GrayOptionMap=new Map,this.CurContext=void 0,this.GYi=!1,this.NYi=void 0,this.jZ=void 0,this.WZ=void 0,this.OYi=void 0,this.PlotTemplate=new PlotTemplate_1.PlotTemplate,this.KeepBgAudio=!1,this.kYi=!1,this.CenterText=new PlotData_1.PlotCenterText,this.FYi=!1,this.PlotGlobalConfig=new PlotGlobalConfig_1.PlotGlobalConfig,this.PlotTextReplacer=new PlotTextReplacer_1.PlotTextReplacer,this.PlotWeather=new PlotWeather_1.PlotWeather,this.PlotTimeOfDay=new PlotTimeOfDay_1.PlotTimeOfDay,this.PlotCleanRange=new PlotCleanRange_1.PlotCleanRange,this.InteractController=void 0,this.IsGmCanSkip=!1,this.IsMuteAllPlot=!1,this.IsChangeLevelCToLevelB=!1,this.IsFadeIn=!1,this.BlackScreenType=void 0,this.IsShowingHeadIcon=!1,this.PlayFlow=void 0,this.HangViewHud=!1,this.HasSetRender=!1,this.HasSetGameBudget=!1,this.CurTalkItem=void 0,this.CurShowTalk=void 0,this.GoBattleMaterial=void 0,this.InSeamlessFormation=!1,this.IsTipsViewShowed=!1,this.OptionEnable=!0,this.OnShowCenterTextFinished=()=>{this.PlayFlow=void 0,ModelManager_1.ModelManager.TeleportModel.CgTeleportCompleted&&(ModelManager_1.ModelManager.TeleportModel.CgTeleportCompleted.SetResult(!0),Log_1.Log.CheckInfo())&&Log_1.Log.Info("Teleport",46,"ModelManager.TeleportModel!.CgTeleportCompleted!.SetResult(true)")}}OnInit(){return this.PlotConfig.IsAutoPlay=!0,this.IsInPlot=!1,this.IsInInteraction=!1,this.IsBackInteractionAfterFlow=!1,this.kYi=!1,this.PlotGlobalConfig.Init(),this.PlotWeather.Init(),ModManager_1.ModManager.Settings.PlotSkip&&(this.CanSkip=1,this.CanSkipDebug=1,this.SkipTalkWhenFighting=1,this.IsAutoPlay=1),!0}OnClear(){return this.PlotTextReplacer.Clear(),this.PlotWeather.Clear(),!0}CheckCanPlayNow(e){if(e.StateActions){if(!this.IsInPlot)return!0;this.PendingPlot(e),("LevelD"===this.PlotConfig.PlotLevel||"Prompt"===this.PlotConfig.PlotLevel&&"LevelD"!==e.PlotLevel&&"Prompt"!==e.PlotLevel)&&(Log_1.Log.CheckInfo()&&Log_1.Log.Info("Plot",27,"打断当前DE级剧情",["Level",this.PlotConfig.PlotLevel],["FlowIncId",this.PlotResult.FlowIncId],["FlowListName",this.PlotResult.FlowListName],["FlowId",this.PlotResult.FlowId],["PlotState",this.PlotResult.StateId]),this.IsServerNotify?ControllerHolder_1.ControllerHolder.FlowController.BackgroundFlow("被别的剧情打断当前的D级剧情",!1):ControllerHolder_1.ControllerHolder.FlowController.FinishFlow("客户端剧情被新的剧情中断"))}else Log_1.Log.CheckWarn()&&Log_1.Log.Warn("Plot",7,"[PlotModel.PlotSetupHandle] 无法找到对应剧情状态",["PlotStateId",e.StateId]);return!1}IsInHighLevelPlot(){return this.IsInPlot&&"LevelD"!==this.PlotConfig.PlotLevel&&"Prompt"!==this.PlotConfig.PlotLevel}IsInSequencePlot(){return this.IsInPlot&&("LevelA"===this.PlotConfig.PlotLevel||"LevelB"===this.PlotConfig.PlotLevel)}PendingPlot(e){for(let o=this.PlotPendingList.length-1;0<=o;o--){var t=this.PlotPendingList[o];if("LevelD"===t.PlotLevel)Log_1.Log.CheckInfo()&&Log_1.Log.Info("Plot",27,"缓存队列中的D级剧情被中断/后台播放",["FlowIncId",t.FlowIncId],["FlowListName",t.FlowListName],["FlowId",t.FlowId],["PlotState",t.StateId],["IsServer",t.IsServerNotify]);else{if("Prompt"!==t.PlotLevel||"LevelA"!==e.PlotLevel&&"LevelB"!==e.PlotLevel&&"LevelC"!==e.PlotLevel)break;Log_1.Log.CheckInfo()&&Log_1.Log.Info("Plot",27,"缓存队列中的E级剧情被中断/后台播放",["FlowIncId",t.FlowIncId],["FlowListName",t.FlowListName],["FlowId",t.FlowId],["PlotState",t.StateId],["IsServer",t.IsServerNotify])}t.IsServerNotify?t.IsBackground=!0:this.PlotPendingList.pop()}this.PlotPendingList.push(e),Log_1.Log.CheckInfo()&&Log_1.Log.Info("Plot",27,"剧情被缓存",["FlowIncId",e.FlowIncId],["FlowListName",e.FlowListName],["FlowId",e.FlowId],["PlotState",e.StateId])}SetPendingPlotState(e,t,o,i){for(const l of this.PlotPendingList)if(l.FlowIncId===e)return l.IsBackground=o,l.IsBreakdown=t,l.IsServerEnd=i,!0;return!1}CenterTextTransition(e,t){this.FYi===e?t&&t():(this.FYi=e)?LevelLoadingController_1.LevelLoadingController.OpenLoading(11,3,(()=>{PlotController_1.PlotController.ClearUi(),UiManager_1.UiManager.OpenView("PlotTransitionView",void 0,t)}),.5):UiManager_1.UiManager.CloseView("PlotTransitionView",(()=>{LevelLoadingController_1.LevelLoadingController.CloseLoading(11,t,.5)}))}ShowTalkCenterText(e,t){e?(this.CenterText.Text=PublicUtil_1.PublicUtil.GetFlowConfigLocalText(e.TidTalk),this.CenterText.AudioId=e.PlayVoice?e.TidTalk:"",this.CenterText.Config=e.CenterTextConfig,this.CenterText.AutoClose=!0,this.CenterText.TalkAkEvent=e.TalkAkEvent,this.CenterText.UniversalTone=e.UniversalTone,this.CenterText.Callback=t,EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.UpdatePlotCenterText)):t()}ShowCenterText(e,t){e&&(this.CenterText.Text=PublicUtil_1.PublicUtil.GetFlowConfigLocalText(e.TidCenterText),this.CenterText.AudioId="",this.CenterText.Config=e,this.CenterText.AutoClose=!0,this.CenterText.Callback=t,PlotController_1.PlotController.HandleShowCenterText(!1))}ShowCenterTextForTeleport(){var e;this.PlayFlow&&(e=PlotController_1.PlotController.GetTalkItemsOfCenterTextForTeleport())&&e.TidCenterText&&(this.CenterText.Text=PublicUtil_1.PublicUtil.GetFlowConfigLocalText(e.TidCenterText),this.CenterText.Config=e,this.CenterText.Callback=this.OnShowCenterTextFinished,PlotController_1.PlotController.HandleShowCenterText(!1))}ApplyPlotConfig(e=!1){this.HYi(),this.jYi(),this.WYi(e),this.KYi(),this.QYi(),EventSystem_1.EventSystem.Emit(EventDefine_1.EEventName.PlotConfigChanged)}SetRender(e){this.HasSetRender!==e&&((this.HasSetRender=e)?GameQualitySettingsManager_1.GameQualitySettingsManager.Get().GetCurrentQualityInfo().SetSequenceFrameRateLimit():GameQualitySettingsManager_1.GameQualitySettingsManager.Get().GetCurrentQualityInfo().CancleSequenceFrameRateLimit())}SetInPlotGameBudget(e){this.HasSetGameBudget!==e&&(this.HasSetGameBudget=e,GameBudgetInterfaceController_1.GameBudgetInterfaceController.SetPlotMode(e))}jYi(){this.PlotTimeOfDay.OnPlotStart(this.PlotConfig.PauseTime)}IsInTemplate(){return this.PlotTemplate.IsInTemplate}FinishTemplate(){this.PlotTemplate.IsInTemplate&&(Log_1.Log.CheckError()&&Log_1.Log.Error("Plot",27,"没有配置关闭模板，已做保底处理，请策划修改",["FlowListName",this.PlotResult.FlowListName],["FlowId",this.PlotResult.FlowId],["PlotState",this.PlotResult.StateId]),this.PlotTemplate.EndTemplateNew())}SetTemplatePlayerTransform(e){this.PlotTemplate.IsInTemplate&&this.PlotTemplate.SetTemplatePlayerTransform(e)}StartPlotTemplate(e,t,o){this.PlotTemplate.StartTemplateNew(e,t,o)}SetPlotTemplate(e,t){this.PlotTemplate.SetTemplateNew(e).finally(t)}EndPlotTemplate(e,t){this.PlotTemplate.EndTemplateNew(e).finally(t)}SetActorName(e){this.PlotTemplate.IsInTemplate&&this.PlotTemplate.SetActorName(e)}PlayCameraAnim(e){this.PlotTemplate.IsInTemplate&&3===this.PlotConfig.CameraMode&&this.PlotTemplate.PlayCameraAnimCompatible(e)}HYi(){var e;"LevelD"!==this.PlotConfig.PlotLevel&&Global_1.Global.BaseCharacter&&(e=Global_1.Global.BaseCharacter.CharacterActorComponent?.Entity.GetComponent(33))?.Valid&&e.StopAllSkills("PlotModel.StopMainCharacterSkill")}KYi(){InputDistributeController_1.InputDistributeController.RefreshInputTag()}SwitchCameraMode(e){this.PlotConfig.CameraMode=e,this.WYi()}WYi(e=!1){if(GlobalData_1.GlobalData.World)switch(this.PlotConfig.CameraMode){case 0:var t=CameraController_1.CameraController.SequenceCamera.GetComponent(10);t?.GetIsInCinematic()&&t.StopSequence(),t?.ResetCameraRatioSetting();break;case 1:CameraController_1.CameraController.ExitDialogMode(),CameraController_1.CameraController.ExitCameraMode(1,0,0,0);break;case 2:CameraController_1.CameraController.EnterDialogueMode(ControllerHolder_1.ControllerHolder.FlowController.GetInteractPoint(),e),CameraController_1.CameraController.ExitCameraMode(1,0,0,0);break;case 3:CameraController_1.CameraController.ExitDialogMode(),CameraController_1.CameraController.EnterCameraMode(1,0,0,0)}}QYi(){"LevelD"===this.PlotConfig.PlotLevel||"Prompt"===this.PlotConfig.PlotLevel?this.ResetAudioState():(this.kYi=!0,AudioSystem_1.AudioSystem.SetState(AudioDefine_1.STATEGROUP,AudioDefine_1.STATEINCUTSCENE)),this.PlotConfig.PlotLevel&&AudioSystem_1.AudioSystem.SetState(AUDIO_STATE_PLOT_LEVEL_GROUP,audioStatePlotLevel[this.PlotConfig.PlotLevel])}ResetAudioState(){this.kYi&&(this.kYi=!1,AudioSystem_1.AudioSystem.SetState(AudioDefine_1.STATEGROUP,AudioDefine_1.STATENORMAL)),AudioSystem_1.AudioSystem.SetState(AUDIO_STATE_PLOT_LEVEL_GROUP,"not_plot"),AudioSystem_1.AudioSystem.PostEvent(PLOT_END_AUDIO_EVENT)}MarkGrayOption(e,t){this.GrayOptionMap.has(e)||this.GrayOptionMap.set(e,new Set),(e=this.GrayOptionMap.get(e)).has(t)||e.add(t)}IsOptionGray(e,t){return!!this.GrayOptionMap.has(e)&&!!this.GrayOptionMap.get(e).has(t)}CheckOptionCondition(e,t){if(!e.PreCondition)return!0;let o=!1;return"PreOption"===e.PreCondition.Type?this.YYi(e,t):o}YYi(e,t){let o=!0;for(const l of e.PreCondition.PreOptions){var i=this.GrayOptionMap.get(t.Id);o=o&&!!i&&i.has(l)}return o}GetOptionIndex(e,t){return this.CurShowTalk?.TalkItems.find((e=>e.Id===t))?.Options?.indexOf(e)??-1}SaveCharacterLockOn(){var e;this.JYi()&&(e=Global_1.Global.BaseCharacter.GetEntityIdNoBlueprint(),EntitySystem_1.EntitySystem.Get(e)?.GetComponent(188)?.HasTag(-1150819426))&&(this.GYi=!0)}RevertCharacterLockOn(){this.GYi&&(this.GYi=!1,this.JYi()?.EnterLockDirection())}JYi(){var e=Global_1.Global.BaseCharacter?.GetEntityIdNoBlueprint();if(e&&(e=EntitySystem_1.EntitySystem.Get(e)?.GetComponent(29),e?.Valid))return e}ClearContext(){this.CurContext?.Release(),this.CurContext=void 0}HandlePlayMontage(e){this.qYi||(this.qYi=new PlotMontage_1.PlotMontage),this.qYi.StopAllMontage(!1),this.qYi.StartPlayMontage(e)}FinishMontage(){this.qYi&&this.qYi.StopAllMontage()}InitPlotTemplate(){this.NYi=new Map;let e=(0,PublicUtil_1.getConfigPath)(IGlobal_1.globalConfig.FlowTemplateCameraConfigPath);PublicUtil_1.PublicUtil.IsUseTempData()||(e=(0,PublicUtil_1.getConfigPath)(IGlobal_1.globalConfigTemp.FlowTemplateCameraConfigPath));var t=(0,puerts_1.$ref)("");if(UE.KuroStaticLibrary.LoadFileToString(t,e),t=(0,puerts_1.$unref)(t))for(const e of JSON.parse(t).List)this.NYi.set(e.Id,e)}InitMontageConfig(){this.jZ=new Map;let e=(0,PublicUtil_1.getConfigPath)(IGlobal_1.globalConfig.MontageConfigPath);PublicUtil_1.PublicUtil.IsUseTempData()||(e=(0,PublicUtil_1.getConfigPath)(IGlobal_1.globalConfigTemp.MontageConfigPath));var t=(0,puerts_1.$ref)("");if(UE.KuroStaticLibrary.LoadFileToString(t,e),t=(0,puerts_1.$unref)(t))for(const e of JSON.parse(t).Montages)this.jZ.set(e.Id,e)}GetMontageConfig(e){if(PublicUtil_1.PublicUtil.UseDbConfig()){if(this.jZ||(this.jZ=new Map),!this.jZ.get(e)){var t=ConfigManager_1.ConfigManager.PlotMontageConfig.GetPlotMontageConfig(e);if(!t)return;t={Id:t.Id,ActionMontage:t.ActionMontage,ExpressionMontage:t.ExpressionMontage,MouthSequence:t.MouthSequence},this.jZ.set(e,t)}}else this.jZ||this.InitMontageConfig();return this.jZ.get(e)}QZ(){this.WZ=new Map;let e=(0,PublicUtil_1.getConfigPath)(IGlobal_1.globalConfig.AbpMontageConfigPath);PublicUtil_1.PublicUtil.IsUseTempData()||(e=(0,PublicUtil_1.getConfigPath)(IGlobal_1.globalConfigTemp.AbpMontageConfigPath));var t=(0,puerts_1.$ref)("");if(UE.KuroStaticLibrary.LoadFileToString(t,e),t=(0,puerts_1.$unref)(t))for(const e of JSON.parse(t).Montages)this.WZ.set(e.Id,e)}GetAbpMontageConfig(e){if(PublicUtil_1.PublicUtil.UseDbConfig()){if(this.WZ||(this.WZ=new Map),!this.WZ.get(e)){var t=ConfigManager_1.ConfigManager.PlotMontageConfig.GetPlotAbpMontageConfig(e);if(!t)return;t={Id:t.Id,ActionMontage:t.Montage,ExpressionMontage:"",MouthSequence:""},this.WZ.set(e,t)}}else this.WZ||this.QZ();return this.WZ.get(e)}zYi(){this.OYi=new Map;let e=(0,PublicUtil_1.getConfigPath)(IGlobal_1.globalConfig.AbpOverlayMontageConfigPath);PublicUtil_1.PublicUtil.IsUseTempData()||(e=(0,PublicUtil_1.getConfigPath)(IGlobal_1.globalConfigTemp.AbpOverlayMontageConfigPath));var t=(0,puerts_1.$ref)("");if(UE.KuroStaticLibrary.LoadFileToString(t,e),t=(0,puerts_1.$unref)(t))for(const e of JSON.parse(t).Montages)this.OYi.set(e.Id,e)}GetOverlayAbpMontageConfig(e){if(PublicUtil_1.PublicUtil.UseDbConfig()){if(this.OYi||(this.OYi=new Map),!this.OYi.get(e)){var t=ConfigManager_1.ConfigManager.PlotMontageConfig.GetOverlayAbpMontageConfig(e);if(!t)return;t={Id:t.Id,ActionMontage:t.Montage,ExpressionMontage:"",MouthSequence:""},this.OYi.set(e,t)}}else this.OYi||this.zYi();return this.OYi.get(e)}GetPlotTemplateConfig(e){if(PublicUtil_1.PublicUtil.UseDbConfig()){if(this.NYi||(this.NYi=new Map),!this.NYi.get(e)){var t=ConfigManager_1.ConfigManager.CameraTemplateConfig.GetCameraTemplateConfig(e);if(!t)return;t={Id:t.Id,Name:t.Name,Amount:t.Amount,Enable:t.Enable,Template:t.Template,CameraType:t.CameraType,ActorDataArray:JSON.parse(t.ActorDataArray),CameraData:JSON.parse(t.CameraData)},this.NYi.set(e,t)}}else this.NYi||this.InitPlotTemplate();return this.NYi.get(e)}}exports.PlotModel=PlotModel;