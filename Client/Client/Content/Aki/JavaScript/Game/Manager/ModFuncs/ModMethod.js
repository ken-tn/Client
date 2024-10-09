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
  ModDebuger_1 = require("./ModDebuger");
const { ModUtils } = require("./ModUtils");

class ModMethod {
  static best = {};

  static GenerateBest() {
    const damageBlacklist = [
      "110360200", // baizhi :middle_finger:
      "110360210",
      "110360310",
    ];
    BulletConfig_1.BulletConfig.N9o.forEach((firstValue, PID, map) => {
      // ModMenu_1.MainMenu.KunLog(`BulletConfig m[${key}] = ${value}` + " pid: " + EntityManager_1.EntityManager.GetPlayerEntity().Id);
      if (!this.best[PID]) {
        ModMenu_1.MainMenu.KunLog("Scanning for: " + PID);
        let bestDmg = null;
        let quietDmg = null;
        let highest = 0;
        let BulletDataMap =
          BulletConfig_1.BulletConfig.O9o.get(firstValue).BulletDataMap;
        BulletDataMap.forEach((value, key, map) => {
          try {
            // ModMenu_1.MainMenu.KunLog(`BulletDataMap m[${key}] = ${value}` + " constructor: " + value.constructor.name + " damage: " + dam + "damage constructor: " + dam.constructor.name);
            // ModMenu_1.MainMenu.KunLog(`BulletDataMap m[${key}] = ${value} constructor: ${value.constructor.name} data: ${value.Data} dataconstructor: ` + value.Data.constructor.name);
            // intermediary bullets
            if (value.Base.DamageId > 1) {
              let dam =
                ConfigManager_1.ConfigManager.RoleConfig.GetDamageConfig(
                  value.Base.DamageId
                );

              // for (let propertyName in value.Data) {
              //     ModMenu_1.MainMenu.KunLog(propertyName);
              //     ModMenu_1.MainMenu.KunLog(value.Data[propertyName]);
              // }
              ModMenu_1.MainMenu.KunLog(
                `${value.BulletName}: ${key} | BulletRowName: ${value.BulletRowName} BaseDamageId: ${value.Base.DamageId}`
              );

              if (!value.Base.EnablePartHitAudio) {
                // ModMenu_1.MainMenu.KunLog(`Quiet Damage key: ${key}`);
                quietDmg = {
                  key: key,
                  BaseDamageId: BigInt(value.Base.DamageId),
                };
              }

              let rateLv = dam.RateLv;
              if (rateLv) {
                let maxRate = rateLv[rateLv.length - 1];
                if (maxRate > highest && !damageBlacklist.includes(key)) {
                  highest = maxRate;
                  bestDmg = {
                    key: key,
                    BaseDamageId: BigInt(value.Base.DamageId),
                  };
                  // fallback
                  if (!quietDmg) {
                    quietDmg = {
                      key: key,
                      BaseDamageId: BigInt(value.Base.DamageId),
                    };
                  }
                  //ModMenu_1.MainMenu.KunLog(`new maxrate: ${highest} key: ${key}`);
                }
              }
            }
          } catch {}
        });
        if (bestDmg && quietDmg) {
          ModMenu_1.MainMenu.KunLog(
            `Scan finished for ${PID} bestDmg: ${bestDmg.key} quietDmg: ${quietDmg.key}`
          );
          this.best[PID] = [quietDmg, bestDmg];
        } else {
          ModMenu_1.MainMenu.KunLog("Failed scan for: " + PID);
        }
      }
    });
  }

  static SpawnBullet(InitialTransform) {
    InitialTransform =
      InitialTransform || Transform_1.Transform.Create().ToUeTransform();
    let PlayerActor = EntityManager_1.EntityManager.GetPlayerActor();
    if (!PlayerActor) {
      return null;
    }
    const PID = EntityManager_1.EntityManager.GetPlayerEntity().Id;
    if (!this.best[PID]) {
      this.GenerateBest();
      return;
    }

    let transformLoc = InitialTransform.GetLocation();
    let bul = ModelManager_1.ModelManager.BulletModel.CreateBullet(
      EntityManager_1.EntityManager.GetPlayerEntity(),
      this.best[PID][0].key.toString(),
      InitialTransform,
      transformLoc
    );
    if (!bul) {
      ModMenu_1.MainMenu.KunLog(
        `Bullet failed for id ${this.best[PID][0].key.toString()}`
      );
      return;
    }
    bul.GetBulletInfo().ActorComponent.SetActorLocation(transformLoc);
    // ModUtils.jsLog(bul);
    return bul;
  }

  static FireDamage(CharacterDamageComponent, t) {
    let s = Protocol_1.Aki.Protocol.U3n.create({
      Fjn: MathUtils_1.MathUtils.BigIntToLong(1205401001n),
      Wjn: 10, // skillLevel
      kjn: MathUtils_1.MathUtils.NumberToLong(
        t.Entity.GetComponent(0).GetCreatureDataId()
      ),
      TVn: MathUtils_1.MathUtils.NumberToLong(
        CharacterDamageComponent.Entity.GetComponent(0).GetCreatureDataId()
      ),
      Kjn: 1, // IsAddEnergy
      Qjn: 0, // counterattack
      Xjn: 1, // crit
      $jn: 0, // isblocked
      jjn: -1, // PartId
      Yjn: 0, // CounterSkillMessageId
      Njn: {
        Vjn: Protocol_1.Aki.Protocol.XAs.Proto_FromBullet,
        Mjn: MathUtils_1.MathUtils.BigIntToLong(1205401001n),
        Hjn: [],
        r5n: 0,
      },
      lHn: ModelManager_1.ModelManager.PlayerInfoModel.AdvanceRandomSeed(0),
    });
    // ModUtils.jsLog(s);
    CombatMessage_1.CombatNet.Call(
      22663,
      CharacterDamageComponent.Entity,
      s,
      (e) => {
        // e.nAs = damage
        if (e.nAs === 0) {
          s.Fjn = MathUtils_1.MathUtils.BigIntToLong(1305061001n);
          s.Njn.Mjn = MathUtils_1.MathUtils.BigIntToLong(1305061001n);
          CombatMessage_1.CombatNet.Call(
            22663,
            CharacterDamageComponent.Entity,
            s
          );
        }
      }
    );
  }

  //怪物淹死
  static async MonsterKillRequest(Entity, retries) {
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
    let itsLimit = 10;

    timer = TimerSystem_1.TimerSystem.Forever(() => {
      if (!CharacterDamageComponent.Entity || its > itsLimit) {
        ModMenu_1.MainMenu.KunLog(
          its > itsLimit ? "Hits over limit" : "Dead, clearing timer"
        );
        TimerSystem_1.TimerSystem.Remove(timer);
        return;
      }

      its++;
      this.FireDamage(
        CharacterDamageComponent,
        Global_1.Global.BaseCharacter?.CharacterActorComponent
      );
    }, 50);
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
    // update here
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
    // update here (they're immune to fall damage🗿)
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
