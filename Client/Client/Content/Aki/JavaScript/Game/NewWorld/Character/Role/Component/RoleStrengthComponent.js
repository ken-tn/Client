"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (t, e, i, s) {
    var r,
      n = arguments.length,
      h =
        n < 3
          ? e
          : null === s
          ? (s = Object.getOwnPropertyDescriptor(e, i))
          : s;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
      h = Reflect.decorate(t, e, i, s);
    else
      for (var a = t.length - 1; 0 <= a; a--)
        (r = t[a]) && (h = (n < 3 ? r(h) : 3 < n ? r(e, i, h) : r(e, i)) || h);
    return 3 < n && h && Object.defineProperty(e, i, h), h;
  };
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.RoleStrengthComponent = exports.STRENGTH_TOLERANCE = void 0);
const EntityComponent_1 = require("../../../../../Core/Entity/EntityComponent"),
  RegisterComponent_1 = require("../../../../../Core/Entity/RegisterComponent"),
  EventDefine_1 = require("../../../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../../../Common/Event/EventSystem"),
  ModelManager_1 = require("../../../../Manager/ModelManager"),
  ModManager_1 = require("../../../../Manager/ModManager"),
  FormationAttributeController_1 = require("../../../../Module/Abilities/FormationAttributeController"),
  CharacterBuffIds_1 = require("../../Common/Component/Abilities/CharacterBuffIds"),
  CharacterUnifiedStateTypes_1 = require("../../Common/Component/Abilities/CharacterUnifiedStateTypes");
exports.STRENGTH_TOLERANCE = 0.01;
let RoleStrengthComponent = class RoleStrengthComponent extends EntityComponent_1.EntityComponent {
  constructor() {
    super(...arguments),
      (this.Hte = void 0),
      (this.$zo = void 0),
      (this.Xte = void 0),
      (this.HBr = void 0),
      (this.u1t = void 0),
      (this.drn = -0),
      (this.Crn = -0),
      (this.grn = (t, e) => {
        if (
          this.u1t?.GetPlayerId() ===
            ModelManager_1.ModelManager.CreatureModel.GetPlayerId() &&
          e
        )
          switch (this.HBr.PositionState) {
            case CharacterUnifiedStateTypes_1.ECharPositionState.Ground:
              return (
                this.HBr.MoveState ===
                  CharacterUnifiedStateTypes_1.ECharMoveState.Sprint &&
                  this.HBr.SetMoveState(
                    CharacterUnifiedStateTypes_1.ECharMoveState.Run
                  ),
                void this.EmptyStrengthPunish()
              );
            case CharacterUnifiedStateTypes_1.ECharPositionState.Climb:
              return void this.EmptyStrengthPunish();
            case CharacterUnifiedStateTypes_1.ECharPositionState.Air:
              var i;
              return (
                this.HBr.MoveState ===
                  CharacterUnifiedStateTypes_1.ECharMoveState.Glide &&
                  (i = this.Entity.GetComponent(52)).Valid &&
                  i.ExitGlideState(),
                void this.EmptyStrengthPunish()
              );
              case CharacterUnifiedStateTypes_1.ECharPositionState.Water:
                if (
                  (this.Xte.HasTag(400631093) ||
                    (ModelManager_1.ModelManager.SceneTeamModel?.GetCurrentEntity
                      ?.Id,
                    this.Entity.Id),
                  ModManager_1.ModManager.Settings.InfiniteStamina)
                )
                  return;
                this.Entity.CheckGetComponent(176)?.Drowning();
          }
      }),
      (this.Wqr = (t, e) => {
        this.HBr.PositionState !==
          CharacterUnifiedStateTypes_1.ECharPositionState.Water &&
          this.Hte.IsMoveAutonomousProxy &&
          this.NewMoveStateStrengthDecrease(e);
      }),
      (this.frn = (t) => {
        this.$zo.RemoveBuffByHandle(this.drn),
          t !== BigInt(0) && this.UpdateStrengthDecrease(t);
      }),
      (this.Kqr = (t, e) => {
        var i =
          FormationAttributeController_1.FormationAttributeController.GetValue(
            1
          );
        switch (
          (t === CharacterUnifiedStateTypes_1.ECharPositionState.Water &&
            this.$zo.RemoveBuffByHandle(this.drn),
          e === CharacterUnifiedStateTypes_1.ECharPositionState.Water &&
            i < exports.STRENGTH_TOLERANCE &&
            this.grn(1, !0),
          e)
        ) {
          case CharacterUnifiedStateTypes_1.ECharPositionState.Air:
            this.$zo?.HasBuffAuthority() &&
              this.$zo.AddBuff(
                CharacterBuffIds_1.buffId.AirStrengthDecreaseRetain,
                {
                  InstigatorId: this.$zo.CreatureDataId,
                  Reason: "进入空中状态",
                }
              ),
              this.ToggleStrengthForbiddenGe(
                CharacterBuffIds_1.buffId.AirStrengthRecoverForbidden
              );
            break;
          case CharacterUnifiedStateTypes_1.ECharPositionState.Water:
          case CharacterUnifiedStateTypes_1.ECharPositionState.Climb:
            this.ToggleStrengthForbiddenGe(
              CharacterBuffIds_1.buffId.WaterClimbStrengthForbidden
            );
            break;
          case CharacterUnifiedStateTypes_1.ECharPositionState.Ground:
            this.prn();
        }
      }),
      (this.Nkr = (t) => {});
  }
  OnStart() {
    return (
      (this.Hte = this.Entity.CheckGetComponent(3)),
      (this.$zo = this.Entity.CheckGetComponent(160)),
      (this.Xte = this.Entity.CheckGetComponent(190)),
      (this.HBr = this.Entity.CheckGetComponent(161)),
      (this.u1t = this.Entity.CheckGetComponent(0)),
      (this.Crn = -1),
      this.vrn(),
      EventSystem_1.EventSystem.AddWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharOnUnifiedMoveStateChanged,
        this.Wqr
      ),
      EventSystem_1.EventSystem.AddWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharOnPositionStateChanged,
        this.Kqr
      ),
      EventSystem_1.EventSystem.AddWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharSwimStrengthChanged,
        this.frn
      ),
      FormationAttributeController_1.FormationAttributeController.AddThresholdListener(
        1,
        this.grn,
        0,
        0,
        "Strength.RoleStrengthComponent"
      ),
      EventSystem_1.EventSystem.AddWithTarget(
        this.Entity,
        EventDefine_1.EEventName.RoleOnStateInherit,
        this.Nkr
      ),
      !0
    );
  }
  OnEnd() {
    return (
      EventSystem_1.EventSystem.RemoveWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharOnUnifiedMoveStateChanged,
        this.Wqr
      ),
      EventSystem_1.EventSystem.RemoveWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharOnPositionStateChanged,
        this.Kqr
      ),
      FormationAttributeController_1.FormationAttributeController.RemoveThresholdListener(
        1,
        this.grn
      ),
      EventSystem_1.EventSystem.RemoveWithTarget(
        this.Entity,
        EventDefine_1.EEventName.RoleOnStateInherit,
        this.Nkr
      ),
      EventSystem_1.EventSystem.RemoveWithTarget(
        this.Entity,
        EventDefine_1.EEventName.CharSwimStrengthChanged,
        this.frn
      ),
      !0
    );
  }
  vrn() {}
  EmptyStrengthPunish() {
    ModManager_1.ModManager.Settings.InfiniteStamina ||
    (this.$zo.HasBuffAuthority() &&
      this.$zo.GetBuffTotalStackById(
        CharacterBuffIds_1.buffId.EmptyStrengthPunish
      ) < 1 &&
      this.$zo.AddBuff(CharacterBuffIds_1.buffId.EmptyStrengthPunish, {
        InstigatorId: this.$zo.CreatureDataId,
        Reason: "体力耗尽",
      }),
      this.Xte.RemoveTag(388142570));
  }
  UpdateStrengthDecrease(t) {
    ModManager_1.ModManager.Settings.InfiniteStamina ||
    (this.drn = this.$zo.AddBuffLocal(t, {
      InstigatorId: this.$zo.CreatureDataId,
      Reason: "RoleStrengthComponent.UpdateStrengthDecrease",
    }));
  }
  ToggleStrengthForbiddenGe(t) {
    ModManager_1.ModManager.Settings.InfiniteStamina ||
    (this.$zo.RemoveBuffByHandle(this.Crn, -1),
      (this.Crn = this.$zo.AddBuffLocal(t, {
        InstigatorId: this.$zo.CreatureDataId,
        Reason: "RoleStrengthComponent.ToggleStrengthForbiddenGe",
      })));
  }
  prn() {
    this.$zo.RemoveBuffByHandle(this.Crn, -1);
  }
  NewMoveStateStrengthDecrease(t) {
    switch ((this.$zo.RemoveBuffByHandle(this.drn), t)) {
      case CharacterUnifiedStateTypes_1.ECharMoveState.Sprint:
        return void this.UpdateStrengthDecrease(
          CharacterBuffIds_1.buffId.SprintCost
        );
      case CharacterUnifiedStateTypes_1.ECharMoveState.FastClimb:
        this.UpdateStrengthDecrease(CharacterBuffIds_1.buffId.FastClimbCost);
        break;
      case CharacterUnifiedStateTypes_1.ECharMoveState.Glide:
        this.$zo.AddBuff(CharacterBuffIds_1.buffId.GlideCoolDown, {
          InstigatorId: this.$zo.CreatureDataId,
          Reason: "进入滑翔状态",
        }),
          this.UpdateStrengthDecrease(CharacterBuffIds_1.buffId.GlideCost);
    }
  }
};
(RoleStrengthComponent.ForbidStrengthRecoveryTimeExtra = 0.5),
  (RoleStrengthComponent = __decorate(
    [(0, RegisterComponent_1.RegisterComponent)(91)],
    RoleStrengthComponent
  )),
  (exports.RoleStrengthComponent = RoleStrengthComponent);
//# sourceMappingURL=RoleStrengthComponent.js.map
