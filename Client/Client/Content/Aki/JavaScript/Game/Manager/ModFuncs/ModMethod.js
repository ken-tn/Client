"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.ModMethod = void 0);
const puerts_1 = require("puerts"),
  UE = require("ue"),
  Info_1 = require("../../../Core/Common/Info"),
  Transform_1 = require("../../../Core/Utils/Math/Transform"),
  Log_1 = require("../../../Core/Common/Log"),
  Net_1 = require("../../../Core/Net/Net"),
  MathUtils_1 = require("../../../Core/Utils/MathUtils"),
  NetDefine_1 = require("../../../Core/Define/Net/NetDefine"),
  Protocol_1 = require("../../../Core/Define/Net/Protocol"),
  ModManager_1 = require("../ModManager"),
  ModelManager_1 = require("../ModelManager"),
  TimerSystem_1 = require("../../../Core/Timer/TimerSystem"),
  BulletConfig_1 = require("../../NewWorld/Bullet/BulletConfig"),
  ConfigManager_1 = require("../../Manager/ConfigManager"),
  DamageById_1 = require("../../../Core/Define/ConfigQuery/DamageById"),
  AudioSystem_1 = require("../../../Core/Audio/AudioSystem"),
  Global_1 = require("../../Global"),
  GlobalData_1 = require("../../GlobalData"),
  ModMenu_1 = require("../../ModMenu"),
  CombatMessage_1 = require("../../Module/CombatMessage/CombatMessage"),
  CharacterDamageCalculations_1 = require("../../NewWorld/Character/Common/Component/Abilities/CharacterDamageCalculations"),
  LevelGamePlayController_1 = require("../../LevelGamePlay/LevelGamePlayController"),
  ControllerHolder_1 = require("../../Manager/ControllerHolder"),
  WeatherController_1 = require("../../Module/Weather/WeatherController"),
  TimeOfDayController_1 = require("../../Module/TimeOfDay/TimeOfDayController"),
  EntityManager_1 = require("./EntityManager"),
  CreateController_1 = require("../../World/Controller/CreatureController"),
  BaseBuffComponent_1 = require("../../NewWorld/Character/Common/Component/Abilities/BaseBuffComponent"),
  ActiveBuffConfigs_1 = require("../../NewWorld/Character/Common/Component/Abilities/Buff/ActiveBuffConfigs"),
  ModDebuger_1 = require("./ModDebuger");

let SprintTimer;
let CurrentCharacter;
let VisitedCharacters = [];
class ModMethod {
  static getSl(lv) {
    if (lv < 21) {
      return 1; // level 20 until 1
    } else if (lv < 31) {
      return 3; // 3 until level 30
    } else if (lv < 41) {
      return 4; // 4 until level 40
    } else if (lv < 51) {
      return 6; // 6 until level 50
    } else if (lv < 61) {
      return 8; // 8 until level 60
    } else if (lv >= 61) {
      return 10; // 10
    }
    return 1;
  }

  static FireDamage(CharacterDamageComponent, t) {
    if (!CharacterDamageComponent || !t) {
      return;
    }
    let lv = ModelManager_1.ModelManager.FunctionModel.GetPlayerLevel();

    // see CharacterDamageComponent.GetServerDamage
    let dmgProto = 21253;
    let s = Protocol_1.Aki.Protocol.U3n.create({
      Fjn: MathUtils_1.MathUtils.BigIntToLong(1205401001n),
      Wjn: this.getSl(lv),
      kjn: MathUtils_1.MathUtils.NumberToLong(
        t.Entity.GetComponent(0).GetCreatureDataId()
      ),
      TVn: MathUtils_1.MathUtils.NumberToLong(
        CharacterDamageComponent.Entity.GetComponent(0).GetCreatureDataId()
      ),
      Kjn: 1,
      Qjn: 0,
      Xjn: 1,
      $jn: 0,
      jjn: -1,
      Yjn: 0,
      Njn: {
        Vjn: Protocol_1.Aki.Protocol.XAs.Proto_FromBullet,
        Mjn: MathUtils_1.MathUtils.BigIntToLong(1205401001n), // changli liberation
        Hjn: [],
        r5n: 1205401,
      },
      lHn: ModelManager_1.ModelManager.PlayerInfoModel.AdvanceRandomSeed(0),
    });
    CombatMessage_1.CombatNet.Call(
      dmgProto,
      CharacterDamageComponent.Entity,
      s,
      async (e) => {
        // e.nAs = damage
        if (e.nAs === 0) {
          await TimerSystem_1.TimerSystem.Wait(
            Math.floor(Math.random() * 100) + 100
          ); // wait 100-200ms
          s.Fjn = MathUtils_1.MathUtils.BigIntToLong(1305061001n); // xiangli liberation
          s.Njn.Mjn = MathUtils_1.MathUtils.BigIntToLong(1305061001n);
          s.Njn.r5n = 1305061;
          s.lHn =
            ModelManager_1.ModelManager.PlayerInfoModel.AdvanceRandomSeed(0);
          CombatMessage_1.CombatNet.Call(
            dmgProto,
            CharacterDamageComponent.Entity,
            s
          );
        }
      }
    );
  }

  static AddBuffRequest(BuffId) {
    // OrderAddBuffS2cNotify
    let t = Global_1.Global.BaseCharacter?.GetEntityNoBlueprint();
    let e = {
      s5n: MathUtils_1.MathUtils.BigIntToLong(BuffId),
      F6n: 1, // Level
      Rjn: MathUtils_1.MathUtils.NumberToLong(
        34 // ActiveBuffConfigs_1.NULL_INSTIGATOR_ID
      ), // Creator ID
      xjn: 0, // ApplyType
      wjn: ActiveBuffConfigs_1.DEFAULT_GE_SERVER_ID, // ServerId
      Bjn: 1, // r, r && 0 < r ? r : f.DefaultStackCount;
      Pjn: true, // IsIterable
      x9n: 19, // reason
      // n5n: 1800.0001220703125 // duration?
    };
    // let f = {
    //   X8n: MathUtils_1.MathUtils.NumberToLong(0), // PreMessageId
    //   $8n: MathUtils_1.MathUtils.NumberToLong(4), // MessageId
    //   Y8n: MathUtils_1.MathUtils.NumberToLong(0),
    //   J8n: 0,
    //   F4n: MathUtils_1.MathUtils.NumberToLong(32), // entity id
    //   z8n: true,
    // };

    BaseBuffComponent_1.BaseBuffComponent.OrderAddBuffS2cNotify(t, e, void 0);
  }

  //怪物淹死
  static async MonsterKillRequest(Entity, retries = 0) {
    //v1.20
    if (retries > 10) {
      return false;
    }
    let CharacterDamageComponent = Entity.GetComponent(18);
    if (!CharacterDamageComponent) {
      setTimeout(() => {
        this.MonsterKillRequest(Entity, retries + 1);
      }, 30);
    }

    let timer = null;
    let its = 0;
    let itsLimit = 6;

    await TimerSystem_1.TimerSystem.Wait(Math.floor(Math.random() * 50) + 20); // wait 20-50ms
    timer = TimerSystem_1.TimerSystem.Forever(() => {
      if (!CharacterDamageComponent.Entity || its > itsLimit) {
        TimerSystem_1.TimerSystem.Remove(timer);
        return;
      }

      its++;
      this.FireDamage(
        CharacterDamageComponent,
        Global_1.Global.BaseCharacter?.CharacterActorComponent
      );
    }, Math.floor(Math.random() * 100) + 100); // 100ms at least, 200ms at most
  }

  static async MonsterKillRequest2(Entity, retries) {
    //v1.20
    if (retries > 10) {
      return false;
    }
    if (
      !Entity.GetComponent(3) &&
      Entity.GetComponent(18) &&
      Entity.GetComponent(34) &&
      Entity.GetComponent(61)
    ) {
      setTimeout(() => {
        this.MonsterKillRequest2(Entity, retries + 1);
      }, 30);
    }

    // hit all enemies here
    let timer = null;
    let its = 0;
    let itsLimit = 10;

    let entityPos = Entity.GetComponent(3).ActorLocationProxy;
    let CharacterPartComponent = Entity.GetComponent(61);
    let CharacterDamageComponent = Entity.GetComponent(18);
    let PID = EntityManager_1.EntityManager.GetPlayerEntity().Id;
    timer = TimerSystem_1.TimerSystem.Forever(() => {
      if (!CharacterDamageComponent.Entity || its > itsLimit) {
        ModMenu_1.MainMenu.KunLog(
          its > itsLimit ? "Hits over limit" : "Dead, clearing timer"
        );
        TimerSystem_1.TimerSystem.Remove(timer);
        return;
      }

      its++;
      // ModMenu_1.MainMenu.KunLog("Got pos");
      if (CharacterDamageComponent && Entity.GetComponent(34) && entityPos) {
        if (!CharacterPartComponent) {
          ModMenu_1.MainMenu.KunLog("Failed to find CharacterPartComponent");
          TimerSystem_1.TimerSystem.Remove(timer);
          return;
        }
        CharacterPartComponent.OnInitData();
        CharacterPartComponent.OnInit();
        CharacterPartComponent.OnActivate();

        // ModMenu_1.MainMenu.KunLog("Got components, setting hitpos");
        let bul = this.SpawnBullet(); // ModManager_1.ModManager.Settings.HideDmgUi ? null : Entity.GetComponent(3).Actor.GetTransform()
        bul.GetBulletInfo().Lo.Render.f9o = "";
        if (!bul) {
          ModMenu_1.MainMenu.KunLog("Failed to spawn bullet, clearing timer");
          TimerSystem_1.TimerSystem.Remove(timer);
          return;
        }
        let BulletInfo = bul.GetBulletInfo();
        let dict = {
          DamageDataId: bul.Data.Base.DamageId,
          SkillLevel: bul.SkillLevel,
          Attacker: BulletInfo.Attacker,
          HitPosition: entityPos.ToUeVector(),
          IsAddEnergy: 1,
          IsCounterAttack: !1,
          ForceCritical: ModManager_1.ModManager.Settings.AlwaysCrit,
          IsBlocked: !1,
          IsReaction: !1,
          PartId: -1,
          ExtraRate: 1,
          CounterSkillMessageId: void 0, // this.IsTriggerCounterAttack?n.CurrentSkill?.CombatMessageId : void 0,
          BulletId: bul.BulletId,
          CounterSkillId: void 0, //this.IsTriggerCounterAttack?Number(n.CurrentSkill?.SkillId) : void 0
        };
        if (ModManager_1.ModManager.Settings.killAuraState == 1) {
          // ModMenu_1.MainMenu.KunLog("Executing bullet damage attacker: " + BulletInfo.Attacker);
          dict.DamageDataId = 1202011001n;
          CharacterDamageComponent?.ExecuteBulletDamage(
            BulletInfo.BulletEntityId,
            dict,
            BulletInfo.ContextId
          );
          // ModMenu_1.MainMenu.KunLog("Executed bullet damage");

          bul = this.SpawnBullet();
          BulletInfo = bul.GetBulletInfo();
          dict.DamageDataId = 1305061001n;
          dict.BulletId = bul.BulletId;
          CharacterDamageComponent?.ExecuteBulletDamage(
            BulletInfo.BulletEntityId,
            dict,
            BulletInfo.ContextId
          );
        } else {
          dict.DamageDataId = this.best[PID][1].BaseDamageId;
          CharacterDamageComponent?.ExecuteBulletDamage(
            BulletInfo.BulletEntityId,
            dict,
            BulletInfo.ContextId
          );
        }
      }
    }, 100);
  }

  static async OnIllusiveSprintAdded(t, HasTag) {
    if (!ModManager_1.ModManager.Settings.IllusiveSprint || !HasTag) {
      return;
    }
    if (SprintTimer) {
      clearTimeout(SprintTimer); // limit to 1 recursion
    }
    // sprinting
    let BaseTagComponent = Global_1.Global.BaseCharacter?.GetEntityNoBlueprint()
      ?.GetComponent(195)
      .GetExactEntity()
      ?.GetComponent(191);
    SprintTimer = setTimeout(
      () => {
        // this (self) is changed, use ModMethod instead
        ModMethod.AddBuffRequest(640003017n);
        ModMethod.OnIllusiveSprintAdded(t, BaseTagComponent.HasTag(917667812));
      },
      ModManager_1.ModManager.Settings.PlayerSpeed
        ? 3500 / ModManager_1.ModManager.Settings.playerSpeedValue
        : 3500
    );
  }

  static async ApplyBuffs() {
    // setup listeners
    let t = Global_1.Global.BaseCharacter?.GetEntityNoBlueprint();
    if (!t) {
      return;
    }

    // BaseTagComponent
    let BaseTagComponent = Global_1.Global.BaseCharacter?.GetEntityNoBlueprint()
      ?.GetComponent(195)
      .GetExactEntity()
      ?.GetComponent(191);
    if (CurrentCharacter !== t && !VisitedCharacters.includes(t)) {
      CurrentCharacter = t;
      VisitedCharacters.push(t);
      BaseTagComponent.ListenForTagAddOrRemove(
        917667812,
        this.OnIllusiveSprintAdded
      );
    }

    if (
      ModManager_1.ModManager.Settings.IllusiveSprint &&
      !BaseTagComponent.HasTag(917667812) && // not sprinting ["关卡.子弹跑.生效中", 917667812],
      !BaseTagComponent.HasTag(-1935387692) // doesn't have buff already ["关卡.子弹跑.可使用", -1935387692],
    ) {
      this.AddBuffRequest(640003017n);
    }
  }

  static ThrowDamageChangeRequest(Entity, count, DamageId) {
    //1.1work
    for (let i = 0; i < count; i++) {
      LevelGamePlayController_1.LevelGamePlayController.ThrowDamageChangeRequest(
        Entity.Id,
        DamageId
      ); //  1604001001n 为女主的第一次平A的 DamageId   MaingirlAttack1
    }
  }

  static AnimalDieRequest(entity) {
    //v1.1work
    ControllerHolder_1.ControllerHolder.CreatureController.AnimalDieRequest(
      entity.GetComponent(0).GetCreatureDataId(),
      entity.GetComponent(1).ActorLocationProxy
    );
    entity
      .CheckGetComponent(0)
      .SetLivingStatus(Protocol_1.Aki.Protocol.JEs.Proto_Dead);
  }
  static AnimalDropRequest(entity) {
    let id = entity.Id;
    ControllerHolder_1.ControllerHolder.CreatureController.AnimalDropItemRequest(
      id
    );
  }

  static LandingDamageRequest(Entity) {
    let Protocol = Protocol_1.Aki.Protocol.gis.create();
    // ModMenu_1.MainMenu.KunLog(Entity.GetComponent(0).GetCreatureDataId());
    Protocol.P4n = MathUtils_1.MathUtils.NumberToLong(
      Entity.GetComponent(0).GetCreatureDataId()
    );
    Protocol.TKn = 2037;
    Protocol.LKn = 300000;
    Net_1.Net.Call(28127, Protocol);
  }

  static SetWorldTimeDilation(t) {
    UE.GameplayStatics.SetGlobalTimeDilation(
      GlobalData_1.GlobalData.GameInstance,
      t
    );
  }

  static ChangWeather(weatherID) {
    //1.sunny 2.Cloudy 3.Thunder 4.Snow 5.Rain
    WeatherController_1.WeatherController.TestChangeWeather(weatherID);
  }
  static FPSUnlocker(unlock = false) {
    let setfps;
    if (unlock) {
      setfps = "t.MaxFPS 300";
    } else {
      setfps = "t.MaxFPS 60";
    }
    ModDebuger_1.ModDebuger.ConsoleCommand(setfps);
  }
  // static FreeCamera(){
  //     ModDebuger_1.ModDebuger.ConsoleCommand("ToggleDebugCamera");
  // }
  static ShowFPS() {
    let ShowFPS = "stat fps";
    ModDebuger_1.ModDebuger.ConsoleCommand(ShowFPS);
  }
  static ShowUnit() {
    let ShowUnit = "stat Unit";
    ModDebuger_1.ModDebuger.ConsoleCommand(ShowUnit);
  }
  static SetFOV(value) {
    let fov = value.toString();
    ModDebuger_1.ModDebuger.ConsoleCommand("fov " + fov);
  }
  static SetTime(hour, minute) {
    let a = hour * 60 * 60 + minute * 60;
    TimeOfDayController_1.TimeOfDayController.pIo(a);
  }
}
//puerts.logger.info(debug)
exports.ModMethod = ModMethod;
