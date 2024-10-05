"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
const UE = require("ue"),
  AudioSystem_1 = require("../../Core/Audio/AudioSystem"),
  Log_1 = require("../../Core/Common/Log"),
  DEFAULT_FADE_DURATION = 500;
class TsAnimNotifyStateAudioEvent extends UE.KuroAnimNotifyState {
  constructor() {
    super(...arguments),
      (this.AudioEvent = void 0),
      (this.SocketName = void 0),
      (this.Follow = !0),
      (this.KeepAlive = !1),
      (this.FadeDuration = DEFAULT_FADE_DURATION),
      (this.FadeCurve = 4),
      (this.TrailingAudioEvent = void 0),
      (this.NotifyDuration = 0),
      (this.HandleMap = new UE.TMap());
  }
  GetNotifyName() {
    return this.AudioEvent
      ? "AudioEvent: " + (0, AudioSystem_1.parseAudioEventPath)(this.AudioEvent)
      : "AudioEvent";
  }
  K2_NotifyBegin(t, i, e) {
    return;
    return (
      (this.NotifyDuration = e),
      this.AudioEvent
        ? ((e =
            this.AudioEvent &&
            (0, AudioSystem_1.parseAudioEventPath)(this.AudioEvent)) &&
            this.PostAudioEvent(e, t, i),
          !0)
        : (Log_1.Log.CheckWarn() &&
            Log_1.Log.Warn(
              "Audio",
              57,
              "[Game.AnimNotifyState] 无效的 AudioEvent",
              ["AnimNotify", this.GetName()],
              ["AnimSequence", UE.KismetSystemLibrary.GetPathName(i)],
            ),
          !1)
    );
  }
  K2_NotifyEnd(t, i) {
    var e, o;
    return !(
      (this.KeepAlive &&
        this.GetCurrentTriggerOffsetInThisNotifyTick() > this.NotifyDuration) ||
      ((e = (o = t.GetOwner()) && this.HandleMap.Get(o)) &&
        (AudioSystem_1.AudioSystem.ExecuteAction(e, 0, {
          TransitionDuration: this.FadeDuration,
          TransitionFadeCurve: this.FadeCurve,
        }),
        this.HandleMap.Remove(o),
        Log_1.Log.CheckDebug()) &&
        Log_1.Log.Debug(
          "Audio",
          57,
          "[Game.AnimNotifyState] StopEvent",
          ["Handle", e],
          ["AnimNotify", this.GetName()],
          ["AnimSequence", UE.KismetSystemLibrary.GetPathName(i)],
          ["Owner", t.GetOwner()?.GetName()],
        ),
      (o =
        this.TrailingAudioEvent &&
        (0, AudioSystem_1.parseAudioEventPath)(this.TrailingAudioEvent)) &&
        this.PostAudioEvent(o, t, i),
      0)
    );
  }
  PostAudioEvent(t, i, e) {
    var o,
      s = i.GetOwner();
    s?.IsValid() &&
      (this.Follow
        ? (o = this.GetAkComponent(s, this.SocketName))?.IsValid() &&
          ((o = AudioSystem_1.AudioSystem.PostEvent(t, o)),
          this.HandleMap.Set(s, o),
          Log_1.Log.CheckDebug()) &&
          Log_1.Log.Debug(
            "Audio",
            57,
            "[Game.AnimNotifyState] PostEvent",
            ["EventName", t],
            ["Handle", o],
            ["AnimNotify", this.GetName()],
            ["AnimSequence", UE.KismetSystemLibrary.GetPathName(e)],
            ["Owner", i.GetOwner()?.GetName()],
          )
        : ((o = i.GetSocketTransform(this.SocketName)),
          (o = AudioSystem_1.AudioSystem.PostEvent(t, o)),
          this.HandleMap.Set(s, o),
          Log_1.Log.CheckDebug() &&
            Log_1.Log.Debug(
              "Audio",
              57,
              "[Game.AnimNotifyState] PostEvent",
              ["EventName", t],
              ["Handle", o],
              ["AnimNotify", this.GetName()],
              ["AnimSequence", UE.KismetSystemLibrary.GetPathName(e)],
              ["Owner", i.GetOwner()?.GetName()],
            )));
  }
  GetAkComponent(t, i) {
    let e = void 0;
    if (t.IsA(UE.TsBaseCharacter_C.StaticClass())) {
      var o = t.CharacterActorComponent?.Entity?.GetComponent(44);
      if (!o?.Valid) return;
      e = o.GetAkComponent(i);
    } else
      t.IsA(UE.TsUiSceneRoleActor_C.StaticClass())
        ? (e = AudioSystem_1.AudioSystem.GetAkComponent(t, {
            SocketName: i,
            OnCreated: (t) => {
              AudioSystem_1.AudioSystem.SetSwitch(
                "actor_ui_switch",
                "sys_ui",
                t,
              );
            },
          }))
        : t.IsA(UE.Actor.StaticClass()) &&
          (e = AudioSystem_1.AudioSystem.GetAkComponent(t, {
            SocketName: i,
            OnCreated: (t) => {
              AudioSystem_1.AudioSystem.SetSwitch("char_p1orp3", "p1", t);
            },
          }));
    if (e?.IsValid()) return e;
    Log_1.Log.CheckError() &&
      Log_1.Log.Error(
        "Audio",
        57,
        "[Game.AnimNotifyState] GetAkComponent 失败",
        ["Owner", t.GetName()],
        ["Socket", i],
        ["Class", t.GetClass().GetName()],
      );
  }
}
exports.default = TsAnimNotifyStateAudioEvent;
//# sourceMappingURL=TsAnimNotifyStateAudioEvent.js.map
