"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
const UE = require("ue"),
  AudioSystem_1 = require("../../Core/Audio/AudioSystem"),
  Log_1 = require("../../Core/Common/Log");
class TsAnimNotifyAudioEvent extends UE.KuroAnimNotify {
  constructor() {
    super(...arguments),
      (this.AudioEvent = void 0),
      (this.SocketName = void 0),
      (this.Follow = !0);
  }
  GetNotifyName() {
    return this.AudioEvent
      ? "AudioEvent: " + (0, AudioSystem_1.parseAudioEventPath)(this.AudioEvent)
      : "AudioEvent";
  }
  K2_Notify(e, t) {
    var i;
    return;
    return this.AudioEvent
      ? ((i = (0, AudioSystem_1.parseAudioEventPath)(this.AudioEvent)) &&
          this.PostAudioEvent(i, e, t),
        !0)
      : (Log_1.Log.CheckWarn() &&
          Log_1.Log.Warn(
            "Audio",
            57,
            "[Game.AnimNotify] 无效的 AudioEvent",
            ["AnimNotify", this.GetName()],
            ["AnimSequence", UE.KismetSystemLibrary.GetPathName(t)],
          ),
        !1);
  }
  PostAudioEvent(e, t, i) {
    var o = t.GetOwner();
    o?.IsValid() &&
      (this.Follow
        ? (o = this.GetAkComponent(o, this.SocketName))?.IsValid() &&
          ((o = AudioSystem_1.AudioSystem.PostEvent(e, o)),
          Log_1.Log.CheckDebug()) &&
          Log_1.Log.Debug(
            "Audio",
            57,
            "[Game.AnimNotify] PostEvent",
            ["EventName", e],
            ["Handle", o],
            ["AnimNotify", this.GetName()],
            ["AnimSequence", UE.KismetSystemLibrary.GetPathName(i)],
          )
        : ((o = t.GetSocketTransform(this.SocketName)),
          (t = AudioSystem_1.AudioSystem.PostEvent(e, o)),
          Log_1.Log.CheckDebug() &&
            Log_1.Log.Debug(
              "Audio",
              57,
              "[Game.AnimNotify] PostEvent",
              ["EventName", e],
              ["Handle", t],
              ["AnimNotify", this.GetName()],
              ["AnimSequence", UE.KismetSystemLibrary.GetPathName(i)],
            )));
  }
  GetAkComponent(e, t) {
    let i = void 0;
    if (e.IsA(UE.TsBaseCharacter_C.StaticClass())) {
      var o = e.CharacterActorComponent?.Entity?.GetComponent(44);
      if (!o?.Valid) return;
      i = o.GetAkComponent(t);
    } else
      e.IsA(UE.TsUiSceneRoleActor_C.StaticClass())
        ? (i = AudioSystem_1.AudioSystem.GetAkComponent(e, {
            SocketName: t,
            OnCreated: (e) => {
              AudioSystem_1.AudioSystem.SetSwitch(
                "actor_ui_switch",
                "sys_ui",
                e,
              );
            },
          }))
        : e.IsA(UE.Actor.StaticClass()) &&
          (i = AudioSystem_1.AudioSystem.GetAkComponent(e, {
            SocketName: t,
            OnCreated: (e) => {
              AudioSystem_1.AudioSystem.SetSwitch("char_p1orp3", "p1", e);
            },
          }));
    if (i?.IsValid()) return i;
    Log_1.Log.CheckError() &&
      Log_1.Log.Error(
        "Audio",
        57,
        "[Game.AnimNotify] GetAkComponent 失败",
        ["Owner", e.GetName()],
        ["Socket", t],
        ["Class", e.GetClass().GetName()],
      );
  }
}
exports.default = TsAnimNotifyAudioEvent;
//# sourceMappingURL=TsAnimNotifyAudioEvent.js.map
