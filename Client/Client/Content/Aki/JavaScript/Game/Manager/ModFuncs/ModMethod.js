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

class ModMethod {
  static getSl(lv) {
    if (lv < 21) {
        return 1;
    } else if (lv < 31) {
        return 3;
    } else if (lv < 41) {
        return 4;
    } else if (lv < 51) {
        return 6;
    } else if (lv < 61) {
        return 8;
    } else if (lv >= 61) {
        return 10;
    }
    return 1;
  }

  static FireDamage(cdc, t) {
    if ((!cdc) || (!t)) {
        return;
    }
    let lv = ModelManager_1.ModelManager.FunctionModel.GetPlayerLevel();
    
    let s = Protocol_1.Aki.Protocol.U3n.create({
      Fjn: MathUtils_1.MathUtils.BigIntToLong(1205401001n),
      Wjn: this.getSl(lv),
      kjn: MathUtils_1.MathUtils.NumberToLong(
        t.Entity.GetComponent(0).GetCreatureDataId()
      ),
      TVn: MathUtils_1.MathUtils.NumberToLong(
        cdc.Entity.GetComponent(0).GetCreatureDataId()
      ),
      Kjn: 1,
      Qjn: 0,
      Xjn: 1,
      $jn: 0,
      jjn: -1,
      Yjn: 0,
      Njn: {
        Vjn: Protocol_1.Aki.Protocol.XAs.Proto_FromBullet,
        Mjn: MathUtils_1.MathUtils.BigIntToLong(1205401001n),
        Hjn: [],
        r5n: 1205401,
      },
      lHn: ModelManager_1.ModelManager.PlayerInfoModel.AdvanceRandomSeed(0),
    });
    CombatMessage_1.CombatNet.Call(
      22663,
      cdc.Entity,
      s,
      (e) => {
        if (e.nAs === 0) {
          s.Fjn = MathUtils_1.MathUtils.BigIntToLong(1305061001n);
          s.Njn.Mjn = MathUtils_1.MathUtils.BigIntToLong(1305061001n);
          s.Njn.r5n = 1305061;
          s.lHn = ModelManager_1.ModelManager.PlayerInfoModel.AdvanceRandomSeed(0);
          CombatMessage_1.CombatNet.Call(
            22663,
            cdc.Entity,
            s
          );
        }
      }
    );
  }

  //怪物淹死
  static async MonsterKillRequest(Entity, retries = 0) {
    //v1.20
    if (retries > 10) {
      return false;
    }
    let cdc = Entity.GetComponent(18);
    if (!cdc) {
      setTimeout(() => {
        this.MonsterKillRequest(Entity, retries + 1);
      }, 30);
    }

    let timer = null;
    let its = 0;
    let itsLimit = 6;

    await TimerSystem_1.TimerSystem.Wait(Math.floor(Math.random() * 100)) // wait 0-100ms
    timer = TimerSystem_1.TimerSystem.Forever(() => {
      if (!cdc.Entity || its > itsLimit) {
        TimerSystem_1.TimerSystem.Remove(timer);
        return;
      }

      its++;
      this.FireDamage(
        cdc,
        Global_1.Global.BaseCharacter?.CharacterActorComponent
      );
    }, Math.floor(Math.random() * 100) + 100); // 100ms at least, 200ms at most
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
