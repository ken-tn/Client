"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.AnimController = void 0);
const cpp_1 = require("cpp"),
  Log_1 = require("../../../Core/Common/Log"),
  EntitySystem_1 = require("../../../Core/Entity/EntitySystem"),
  ControllerBase_1 = require("../../../Core/Framework/ControllerBase"),
  GlobalData_1 = require("../../GlobalData"),
  ModelManager_1 = require("../../Manager/ModelManager"),
  BlackboardController_1 = require("../../World/Controller/BlackboardController"),
  UiCameraAnimationManager_1 = require("../UiCameraAnimation/UiCameraAnimationManager");
class AnimController extends ControllerBase_1.ControllerBase {
  static OnInit() {
    return (
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info("Controller", 25, "AnimController.OnInit"),
      cpp_1.UKuroAnimJsSubsystem.RegisterUpdateAnimInfoFunction(
        GlobalData_1.GlobalData.GameInstance,
        AnimController.UpdateAnimInfo,
      ),
      cpp_1.UKuroAnimJsSubsystem.RegisterUpdateMonsterInfoFunction(
        GlobalData_1.GlobalData.GameInstance,
        AnimController.UpdateMonsterAnimInfo,
      ),
      !0
    );
  }
  static OnClear() {
    return (
      Log_1.Log.CheckInfo() &&
        Log_1.Log.Info("Controller", 25, "AnimController.OnClear"),
      cpp_1.UKuroAnimJsSubsystem.UnregisterUpdateAnimInfoFunction(
        GlobalData_1.GlobalData.GameInstance,
      ),
      !0
    );
  }
  static RegisterUpdateAnimInfoEntity(t) {
    cpp_1.UKuroAnimJsSubsystem.RegisterEntity(
      GlobalData_1.GlobalData.GameInstance,
      t,
    );
  }
  static UnregisterUpdateAnimInfoEntity(t) {
    cpp_1.UKuroAnimJsSubsystem.UnregisterEntity(
      GlobalData_1.GlobalData.GameInstance,
      t,
    );
  }
  static UpdateAnimInfoMove(t) {
    var e,
      n,
      r,
      a = EntitySystem_1.EntitySystem.GetComponent(t, 163);
    a?.Valid &&
      ((e = a.MainAnimInstance.LogicParams),
      (a = a.AnimLogicParamsSetter),
      (n = EntitySystem_1.EntitySystem.GetComponent(t, 3))?.Valid &&
        ((r = n.InputDirectProxy),
        a.InputDirect.Equals(r) ||
          (a.InputDirect.DeepCopy(r), (e.InputDirectRef = r.ToUeVector())),
        (r = n.InputRotatorProxy),
        a.InputRotator.Equals(r) ||
          (a.InputRotator.DeepCopy(r), (e.InputRotatorRef = r.ToUeRotator()))),
      (n = EntitySystem_1.EntitySystem.GetComponent(t, 38))?.Valid &&
        ((r = n.Acceleration),
        a.Acceleration.Equals(r) ||
          (a.Acceleration.DeepCopy(r), (e.AccelerationRef = r.ToUeVector())),
        (r = n.IsMoving),
        a.IsMoving !== r && ((a.IsMoving = r), (e.IsMovingRef = r)),
        (r = n.HasMoveInput),
        a.HasMoveInput !== r && ((a.HasMoveInput = r), (e.HasMoveInputRef = r)),
        (r = n.Speed),
        a.Speed !== r && ((a.Speed = r), (e.SpeedRef = r)),
        (r = n.IsJump),
        a.IsJump !== r && ((a.IsJump = r), (e.IsJumpRef = r)),
        (r = n.GroundedTimeUe),
        a.GroundedTime !== r && ((a.GroundedTime = r), (e.GroundedTimeRef = r)),
        (r = n.IsFallingIntoWater),
        a.IsFallingIntoWater !== r &&
          ((a.IsFallingIntoWater = r), (e.IsFallingIntoWaterRef = r)),
        (r = n.JumpUpRate),
        a.JumpUpRate !== r && ((a.JumpUpRate = r), (e.JumpUpRateRef = r)),
        (r = n.ForceExitStateStop),
        a.ForceExitStateStop !== r) &&
        ((a.ForceExitStateStop = r), (e.ForceExitStateStopRef = r)),
      (n = EntitySystem_1.EntitySystem.GetComponent(t, 31))?.Valid &&
        ((r = n.GetTsClimbInfo()),
        a.ClimbInfo.Equals(r) ||
          (a.ClimbInfo.DeepCopy(r), (e.ClimbInfoRef = n.GetClimbInfoNew())),
        (r = n.GetTsClimbState()),
        a.ClimbState.Equals(r) ||
          (a.ClimbState.DeepCopy(r), (e.ClimbStateRef = n.GetClimbStateNew())),
        (r = n.GetOnWallAngle()),
        a.ClimbOnWallAngle !== r) &&
        ((a.ClimbOnWallAngle = r), (e.ClimbOnWallAngleRef = r)),
      (n = EntitySystem_1.EntitySystem.GetComponent(t, 69))?.Valid &&
        ((r = n.SprintSwimOffset),
        a.SprintSwimOffset !== r &&
          ((a.SprintSwimOffset = r), (e.SprintSwimOffsetRef = r)),
        (r = n.SprintSwimOffsetLerpSpeed),
        a.SprintSwimOffsetLerpSpeed !== r) &&
        ((a.SprintSwimOffsetLerpSpeed = r),
        (e.SprintSwimOffsetLerpSpeedRef = r)),
      (n = EntitySystem_1.EntitySystem.GetComponent(t, 32))?.Valid &&
        ((r = n.SlideForward),
        a.SlideForward.Equals(r) ||
          (a.SlideForward.DeepCopy(r), (e.SlideForwardRef = r.ToUeVector())),
        (r = n.SlideSwitchThisFrame),
        a.SlideSwitchThisFrame !== r &&
          ((a.SlideSwitchThisFrame = r), (e.SlideSwitchThisFrameRef = r)),
        (r = n.StandMode),
        a.SlideStandMode !== r) &&
        ((a.SlideStandMode = r), (e.SlideStandModeRef = r)),
      (n = EntitySystem_1.EntitySystem.GetComponent(t, 98))?.Valid) &&
      ((r = n.Active), a.IsInSplineMove !== r) &&
      ((a.IsInSplineMove = r), (e.bIsInSplineMove = r));
  }
  static UpdateAnimInfoMeshAnim(t) {
    var e,
      n,
      r,
      a = EntitySystem_1.EntitySystem.GetComponent(t, 163);
    a?.Valid &&
      ((e = a.MainAnimInstance.LogicParams),
      (n = a.AnimLogicParamsSetter),
      (r = a.BattleIdleEndTime),
      n.BattleIdleTime !== r &&
        ((n.BattleIdleTime = r), (e.BattleIdleTimeRef = r)),
      (r = a.DegMovementSlope),
      n.DegMovementSlope !== r &&
        ((n.DegMovementSlope = r), (e.DegMovementSlopeRef = r)),
      (r = a.GetTsSightDirect()),
      n.SightDirect.Equals(r) ||
        (n.SightDirect.DeepCopy(r), (e.SightDirectRef = r.ToUeVector())),
      (a = EntitySystem_1.EntitySystem.GetComponent(t, 64))) &&
      ((r = a.GetRagRollQuitState()), n.RagQuitState !== r) &&
      ((n.RagQuitState = r), (e.RagQuitStateRef = r));
  }
  static UpdateAnimInfoHit(e) {
    var n = EntitySystem_1.EntitySystem.GetComponent(e, 163);
    if (n?.Valid) {
      e = EntitySystem_1.EntitySystem.GetComponent(e, 53);
      if (e) {
        var r = n.MainAnimInstance.LogicParams,
          n = n.AnimLogicParamsSetter,
          a = e.GetAcceptedNewBeHitAndReset(),
          o =
            (n.AcceptedNewBeHit !== a &&
              ((n.AcceptedNewBeHit = a), (r.AcceptedNewBeHitRef = a)),
            e.BeHitAnim);
        n.BeHitAnim !== o && ((n.BeHitAnim = o), (r.BeHitAnimRef = o)),
          (a = e.GetEnterFkAndReset()),
          n.EnterFk !== a && ((n.EnterFk = a), (r.EnterFkRef = a)),
          (a = e.GetDoubleHitInAir()),
          n.DoubleHitInAir !== a &&
            ((n.DoubleHitInAir = a), (r.DoubleHitInAirRef = a));
        let t = e.BeHitDirect;
        n.BeHitDirect.Equals(t) ||
          (n.BeHitDirect.DeepCopy(t), (r.BeHitDirectRef = t.ToUeVector())),
          (t = e.BeHitLocation),
          n.BeHitLocation.Equals(t) ||
            (n.BeHitLocation.DeepCopy(t),
            (r.BeHitLocationRef = t.ToUeVector()));
        o = e.BeHitSocketName;
        n.BeHitSocketName.op_Equality(o) ||
          ((n.BeHitSocketName = o), (r.BeHitSocketNameRef = o));
      }
    }
  }
  static UpdateAnimInfoUnifiedState(t) {
    var e,
      n,
      r,
      a = EntitySystem_1.EntitySystem.GetComponent(t, 163);
    a?.Valid &&
      (n = EntitySystem_1.EntitySystem.GetComponent(t, 161)) &&
      ((e = a.MainAnimInstance.LogicParams),
      (a = a.AnimLogicParamsSetter),
      (r = n.MoveState),
      a.CharMoveState !== r &&
        ((a.CharMoveState = r), (e.CharMoveStateRef = r)),
      (r = n.PositionState),
      a.CharPositionState !== r &&
        ((a.CharPositionState = r), (e.CharPositionStateRef = r)),
      (r = n.DirectionState),
      a.CharCameraState !== r &&
        ((a.CharCameraState = r), (e.CharCameraStateRef = r)),
      (n = EntitySystem_1.EntitySystem.GetComponent(t, 34)) &&
        a.SkillTarget !== (n.SkillTarget?.Id ?? 0) &&
        ((a.SkillTarget = n.SkillTarget?.Id ?? 0),
        (e.SkillTarget = n.SkillTarget?.Entity?.GetComponent(1)?.Owner)),
      (r = n.LastActivateSkillTime),
      a.LastActiveSkillTime !== r &&
        ((a.LastActiveSkillTime = r), (e.LastActiveSkillTime = r)),
      (t =
        ModelManager_1.ModelManager.PlotModel.IsInInteraction ||
        (ModelManager_1.ModelManager.PlotModel.IsInPlot &&
          "LevelD" !==
            ModelManager_1.ModelManager.PlotModel.PlotConfig.PlotLevel)),
      a.IsInPerformingPlot !== t &&
        ((a.IsInPerformingPlot = t), (e.bIsInPerformingPlot = t)),
      (n =
        ModelManager_1.ModelManager.PlotModel.IsInPlot &&
        ("LevelA" ===
          ModelManager_1.ModelManager.PlotModel.PlotConfig.PlotLevel ||
          "LevelB" ===
            ModelManager_1.ModelManager.PlotModel.PlotConfig.PlotLevel)),
      a.IsInSequence !== n && ((a.IsInSequence = n), (e.bIsInSequence = n)),
      (r =
        UiCameraAnimationManager_1.UiCameraAnimationManager.IsDisablePlayer()),
      a.IsInUiCamera !== r) &&
      ((a.IsInUiCamera = r), (e.bIsInUiCamera = r));
  }
  static UpdateAnimInfoSceneInteract(t) {
    var e,
      n,
      r = EntitySystem_1.EntitySystem.GetComponent(t, 163);
    r?.Valid &&
      (t = EntitySystem_1.EntitySystem.GetComponent(t, 26)) &&
      ((e = r.MainAnimInstance.LogicParams),
      (r = r.AnimLogicParamsSetter),
      (n = t.GetSitDownState()),
      r.SitDown !== n && ((r.SitDown = n), (e.bSitDown = n)),
      (n = t.EnterSitDownIndex),
      r.SitDownDirect !== n && ((r.SitDownDirect = n), (e.SitDownDirect = n)),
      (n = t.LeaveSitDownIndex),
      r.StandUpDirect !== n) &&
      ((r.StandUpDirect = n), (e.StandUpDirect = n));
  }
  static UpdateMonsterAnimInfoMove(t) {
    var e,
      n = EntitySystem_1.EntitySystem.GetComponent(t, 163);
    n?.Valid &&
      ((e = n.MainAnimInstance.LogicParams),
      (n = n.AnimLogicParamsSetter),
      (t = EntitySystem_1.EntitySystem.GetComponent(t, 3))?.Valid) &&
      ((t = t.InputDirectProxy),
      n.InputDirect.Equals(t) ||
        (n.InputDirect.DeepCopy(t), (e.InputDirectRef = t.ToUeVector())));
  }
  static UpdateMonsterAnimInfoSkill(t) {
    var e,
      n = EntitySystem_1.EntitySystem.GetComponent(t, 163);
    n?.Valid &&
      ((e = n.MainAnimInstance.LogicParams),
      (n = n.AnimLogicParamsSetter),
      (t = EntitySystem_1.EntitySystem.GetComponent(t, 34))) &&
      n.SkillTarget !== (t.SkillTarget?.Id ?? 0) &&
      ((n.SkillTarget = t.SkillTarget?.Id ?? 0),
      (e.SkillTarget = t.SkillTarget?.Entity?.GetComponent(1)?.Owner));
  }
  static UpdateMonsterAnimInfoHit(t) {
    var e,
      n,
      r,
      a,
      o = EntitySystem_1.EntitySystem.GetComponent(t, 163);
    o?.Valid &&
      (e = EntitySystem_1.EntitySystem.GetComponent(t, 53)) &&
      ((n = o.MainAnimInstance.LogicParams),
      (o = o.AnimLogicParamsSetter),
      (a = e.GetAcceptedNewBeHitAndReset()),
      o.AcceptedNewBeHit !== a &&
        ((o.AcceptedNewBeHit = a), (n.AcceptedNewBeHitRef = a)),
      (r = e.BeHitAnim),
      o.BeHitAnim !== r && ((o.BeHitAnim = r), (n.BeHitAnimRef = r)),
      (a = e.GetEnterFkAndReset()),
      o.EnterFk !== a && ((o.EnterFk = a), (n.EnterFkRef = a)),
      e?.BeHitBones &&
        0 < e?.BeHitBones?.length &&
        o.BeHitBone !== e.BeHitBones[0] &&
        ((o.BeHitBone = e.BeHitBones[0]), (n.BeHitBoneRef = e.BeHitBones[0])),
      (r = BlackboardController_1.BlackboardController.GetEntityIdByEntity(
        t,
        "HateTarget",
      ))) &&
      ((a = EntitySystem_1.EntitySystem.GetComponent(r, 1)),
      o.HateTarget !== r) &&
      ((o.HateTarget = r), (n.HateTarget = a?.Owner));
  }
  static UpdateMonsterAnimInfoUnifiedState(t) {
    var e,
      n,
      r = EntitySystem_1.EntitySystem.GetComponent(t, 163);
    r?.Valid &&
      (t = EntitySystem_1.EntitySystem.GetComponent(t, 92)) &&
      ((e = r.MainAnimInstance.LogicParams),
      (r = r.AnimLogicParamsSetter),
      (n = t.MoveState),
      r.CharMoveState !== n &&
        ((r.CharMoveState = n), (e.CharMoveStateRef = n)),
      (n = t.PositionState),
      r.CharPositionState !== n &&
        ((r.CharPositionState = n), (e.CharPositionStateRef = n)),
      (n = t.DirectionState),
      r.CharCameraState !== n) &&
      ((r.CharCameraState = n), (e.CharCameraStateRef = n));
  }
}
((exports.AnimController = AnimController).UpdateAnimInfo = (t) => {
  AnimController.UpdateAnimInfoMove(t),
    AnimController.UpdateAnimInfoMeshAnim(t),
    AnimController.UpdateAnimInfoHit(t),
    AnimController.UpdateAnimInfoUnifiedState(t),
    AnimController.UpdateAnimInfoSceneInteract(t);
}),
  (AnimController.UpdateMonsterAnimInfo = (t) => {
    AnimController.UpdateMonsterAnimInfoHit(t),
      AnimController.UpdateMonsterAnimInfoMove(t),
      AnimController.UpdateMonsterAnimInfoSkill(t),
      AnimController.UpdateMonsterAnimInfoUnifiedState(t);
  });
//# sourceMappingURL=AnimController.js.map
