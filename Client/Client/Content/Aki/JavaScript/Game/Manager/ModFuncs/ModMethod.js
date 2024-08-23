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
    static dictInfo = null;

    static SpawnBullet() {
        let pos = EntityManager_1.EntityManager.GetPlayerPos();
        return ModelManager_1.ModelManager.BulletModel.CreateBullet(EntityManager_1.EntityManager.GetPlayerEntity(), "1205005011",
        Transform_1.Transform.Create(EntityManager_1.EntityManager.GetPlayerActor().GetTransform()).ToUeTransform(),
        new UE.Vector(pos.X + 30, pos.Y + 30, pos.Z + 30));
        // ModMenu_1.MainMenu.KunLog("KunBullet: " + bul.toString())
    }
  //怪物淹死
  static MonsterDrownRequest(Entity) {
    //v1.20
    // update here
    // let prot = Protocol_1.Aki.Protocol.v4n.create()
    // prot.e8n = entity.GetComponent(3).ActorLocationProxy

    // CombatMessage_1.CombatNet.Call(
    //     18989 /*NetDefine_1.ERequestMessageId.MonsterDrownRequest*/,
    //     entity,
    //     prot
    // );

    if (!(this.dictInfo)) {
        ModMenu_1.MainMenu.KunLog("Not enough info for aurakill"); 
        return;
    }
    // ModMenu_1.MainMenu.KunLog("Got info"); 

    // hit all enemies here
    for (let i = 0; i < ModManager_1.ModManager.Settings.Hitcount; i++)
        if (Entity) {
            const entityPos = Entity.GetComponent(3).ActorLocationProxy;
            // ModMenu_1.MainMenu.KunLog("Got pos"); 
            if (Entity.GetComponent(18) && Entity.GetComponent(33) && entityPos) {
                // ModMenu_1.MainMenu.KunLog("Got components, setting hitpos"); 
                this.dictInfo.HitPosition = entityPos.ToUeVector();
                this.dictInfo.DamageDataId = 1205401001n;
                this.dictInfo.BulletId = bul.BulletId;
                // ModMenu_1.MainMenu.KunLog("Executing bullet damage"); 
                let bul = this.SpawnBullet();
                let BulletInfo = bul.GetBulletInfo();
                Entity.GetComponent(18)?.ExecuteBulletDamage(BulletInfo.BulletEntityId, this.dictInfo, BulletInfo.ContextId)
                this.dictInfo.DamageDataId = 1301400001n;
                bul = this.SpawnBullet();
                BulletInfo = bul.GetBulletInfo();
                Entity.GetComponent(18)?.ExecuteBulletDamage(BulletInfo.BulletEntityId, this.dictInfo, BulletInfo.ContextId)
            }
        }
    }

    // SpawnEntity_1.EntitySpawner.SpawnEntity(983041, 6);

    // let dat = {
    //     J4n: 983041,
    //     HHn: Protocol_1.Aki.Protocol.wks.Proto_Custom,
    //     jHn: null,
    //     _9n: null,
    //     pEs: null,
    //     X8n: null,
    // }
    // CreateController_1.CreatureController.CreateEntity(dat);

    // entity.GetComponent(3).Entity.GetComponent(52).OnHit(ConfigManager_1.ConfigManager.BulletConfig.GetBulletHitData(_.Attacker, e.Base.BeHitEffect), true, ??.GetBulletInfo().Entity, this.Bjo.AllowedEnergy, true, r, s, a, n),
    // ModMenu_1.MainMenu.KunLog("Calling 1");
    // this.ThrowDamageChangeRequest(entity, 5, "1604001001n");
    // this.LandingDamageRequest(EntityManager_1.EntityManager.GetPlayerEntity());

    // entity.GetComponent(188).RemoveTag(1918148596);
    // entity.GetComponent(188).RemoveTag(560942831);
    // ModMenu_1.MainMenu.KunLog("Called 2")

    // var t = Protocol_1.Aki.Protocol.g4n.create();
    // t.P4n = entity.GetComponent(0).GetCreatureDataId()
    // t.$4n = 1
    // CombatMessage_1.CombatNet.Call(16858, this.Entity, t, () => {})
    // ModMenu_1.MainMenu.KunLog("Called 3")

    // this.LandingDamageRequest(entity);
    // ModMenu_1.MainMenu.KunLog("Called 4")
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
      .SetLivingStatus(Protocol_1.Aki.Protocol.HEs.Proto_Dead);
  }
  static AnimalDropRequest(entity) {
    let id = entity.Entity.Id;
    ControllerHolder_1.ControllerHolder.CreatureController.AnimalDropItemRequest(
      id
    );
  }

  static LandingDamageRequest(Entity) {
    // update here (they're immune to fall damage🗿)
    let Protocol = Protocol_1.Aki.Protocol.gis.create();
    // ModMenu_1.MainMenu.KunLog(Entity.GetComponent(0).GetCreatureDataId());
    Protocol.P4n = MathUtils_1.MathUtils.NumberToLong(Entity.GetComponent(0).GetCreatureDataId())
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
  static SetTime(hour,minute){
    let a =hour*60*60+minute*60;
    TimeOfDayController_1.TimeOfDayController.pIo(a);
  }
}
//puerts.logger.info(debug)
exports.ModMethod = ModMethod;
