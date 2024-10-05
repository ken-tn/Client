"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
const UE = require("ue"),
  FNameUtil_1 = require("../../Core/Utils/FNameUtil"),
  TsBaseCharacter_1 = require("../Character/TsBaseCharacter"),
  BulletUtil_1 = require("../NewWorld/Bullet/BulletUtil");
class TsAnimNotifyStateCounterAttack extends UE.KuroAnimNotifyState {
  constructor() {
    super(...arguments),
      (this.弹反摄像机预设 = void 0),
      (this.弹反特效预设 = void 0),
      (this.弹反设置 = void 0),
      (this.生成子弹ID = void 0);
  }
  K2_NotifyBegin(t, i, s) {
    return;
    t = t.GetOwner();
    if (t instanceof TsBaseCharacter_1.default) {
      t = t.CharacterActorComponent?.Entity;
      if (!t?.Valid) return !1;
      var e = t.GetComponent(34),
        t = t.GetComponent(53);
      if (!e?.Valid || !t?.Valid) return !1;
      if (!this.弹反设置) return !1;
      if (
        (e?.SetCurAnInfo(this.exportIndex, i.GetName()),
        t.SetCounterAttackAnsInfo(this.exportIndex),
        this.弹反摄像机预设 || this.弹反特效预设)
      )
        return (
          (e = new UE.SCounterAttack(
            this.弹反设置?.弹反部位,
            this.弹反设置?.无弹反动作效果,
            this.弹反设置?.有弹反动作效果,
            this.弹反设置?.削韧倍率,
            this.弹反设置?.最大触发距离,
            this.弹反设置?.最大触发夹角,
            this.弹反设置?.被弹反者应用BuffID,
            this.弹反设置?.攻击者应用BuffID,
            this.弹反设置?.受击动画忽略Buff检测,
            this.弹反设置?.检测Buff列表,
            this.弹反设置?.ANS期间被弹反者生效的BuffID,
            this.弹反设置?.结束事件Tag,
            this.弹反设置?.QTE弹刀忽略角度距离检测,
          )),
          this.弹反摄像机预设 &&
            ((e.无弹反动作效果.摄像机设置 = this.弹反摄像机预设.CameraData),
            (e.无弹反动作效果.攻击者顿帧 =
              this.弹反摄像机预设.AttackerTimeScale),
            (e.无弹反动作效果.被击者顿帧 = this.弹反摄像机预设.VictimTimeScale),
            (e.无弹反动作效果.震屏 = this.弹反摄像机预设.CameraShake),
            (e.有弹反动作效果.摄像机设置 = this.弹反摄像机预设.CameraData),
            (e.有弹反动作效果.攻击者顿帧 =
              this.弹反摄像机预设.AttackerTimeScale),
            (e.有弹反动作效果.被击者顿帧 = this.弹反摄像机预设.VictimTimeScale),
            (e.有弹反动作效果.震屏 = this.弹反摄像机预设.CameraShake)),
          this.弹反特效预设 &&
            ((e.无弹反动作效果.特效DA = this.弹反特效预设.EffectDA),
            (e.无弹反动作效果.特效Offset = this.弹反特效预设.Offset),
            (e.无弹反动作效果.特效Scale = this.弹反特效预设.Scale),
            (e.有弹反动作效果.特效DA = this.弹反特效预设.EffectDA),
            (e.有弹反动作效果.特效Offset = this.弹反特效预设.Offset),
            (e.有弹反动作效果.特效Scale = this.弹反特效预设.Scale)),
          t.SetCounterAttackInfo(e),
          t.SetCounterAttackEndTime(s),
          !0
        );
      t.SetCounterAttackInfo(this.弹反设置), t.SetCounterAttackEndTime(s);
    }
    return !0;
  }
  K2_NotifyEnd(t, i) {
    return;
    var s = t.GetOwner();
    if (s instanceof TsBaseCharacter_1.default) {
      var e = s.CharacterActorComponent?.Entity;
      if (!e?.Valid) return !1;
      var r = e.GetComponent(34),
        e = e.GetComponent(53);
      if (!r?.Valid || !e?.Valid) return !1;
      var h = e.IsTriggerCounterAttack;
      if ((e.CounterAttackEnd(), !h)) {
        if (FNameUtil_1.FNameUtil.IsNothing(this.生成子弹ID)) return !1;
        r?.SetCurAnInfo(this.exportIndex, i.GetName()),
          BulletUtil_1.BulletUtil.CreateBulletFromAN(
            s,
            this.生成子弹ID.toString(),
            void 0,
            r.GetCurrentMontageCorrespondingSkillId().toString(),
            !1,
            void 0,
          );
      }
      return !0;
    }
    return (
      FNameUtil_1.FNameUtil.IsNothing(this.生成子弹ID) ||
        (2 !==
          (e = UE.KuroRenderingRuntimeBPPluginBPLibrary.GetWorldType(
            s.GetWorld(),
          )) &&
          4 !== e) ||
        ((h = UE.KismetSystemLibrary.GetOuterObject(this)),
        (i = UE.KismetSystemLibrary.GetPathName(h)),
        UE.BPL_BulletPreview_C.ShowBulletPreview(
          i,
          this.生成子弹ID,
          s,
          t,
          s.GetWorld(),
          void 0,
        )),
      !1
    );
  }
  GetNotifyName() {
    return "弹反配置";
  }
}
exports.default = TsAnimNotifyStateCounterAttack;
//# sourceMappingURL=TsAnimNotifyStateCounterAttack.js.map
