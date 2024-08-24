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
  DataTableUtil_1 = require("../../../Core/Utils/DataTableUtil"),
  BulletConfig_1 = require("../../NewWorld/Bullet/BulletConfig"),
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
    static SpawnBullet() {
        let PlayerActor = EntityManager_1.EntityManager.GetPlayerActor();
        if (!PlayerActor) {
            return null;
        }

        let firstValue = null;
        ModMenu_1.MainMenu.KunLog("pid: " + EntityManager_1.EntityManager.GetPlayerEntity().Id);
        BulletConfig_1.BulletConfig.N9o.forEach((value, key, map) => {
            ModMenu_1.MainMenu.KunLog(`BulletConfig m[${key}] = ${value}` + " pid: " + EntityManager_1.EntityManager.GetPlayerEntity().Id);
            if (key == EntityManager_1.EntityManager.GetPlayerEntity().Id) {
                firstValue = value;
            }
        });
        ModMenu_1.MainMenu.KunLog("Logged");

        let BulletDataMap = BulletConfig_1.BulletConfig.O9o.get(firstValue).BulletDataMap;
        BulletDataMap.forEach((value, key, map) => {
            ModMenu_1.MainMenu.KunLog(`BulletDataMap m[${key}] = ${value}`);
        });
        const [firstDmg] = BulletDataMap.keys()

        // let dtinfo = EntityManager_1.EntityManager.GetPlayerEntity().GetComponent(33).DtBulletInfo;
        // ModMenu_1.MainMenu.KunLog("dtinfo: " + dtinfo); 
        // let dmgKey = null;
        
        // function logMapElements(value, key, map) {
        //     // ModMenu_1.MainMenu.KunLog(`m[${key}] = ${value}`);
        //     dmgKey = key+"001"
        //     return;
        // }
        // EntityManager_1.EntityManager.GetPlayerEntity().GetComponent(33).GetSkillMap().forEach(logMapElements)

        // ModMenu_1.MainMenu.KunLog("got skillmap"); 
        // let dtinfo = EntityManager_1.EntityManager.GetPlayerEntity().GetComponent(33).DtBulletInfo;
        // ModMenu_1.MainMenu.KunLog("dtinfo: " + dtinfo); 
        let pos = EntityManager_1.EntityManager.GetPlayerPos();
        // ModelManager_1.ModelManager.BulletModel.CreateBullet(Owner, BulletRowName, InitialTransform, InitTargetLocation)
        // 1205005011 changli hit
        // 70119003001 prism hit
        return ModelManager_1.ModelManager.BulletModel.CreateBullet(EntityManager_1.EntityManager.GetPlayerEntity(), firstDmg.toString(),
        Transform_1.Transform.Create(PlayerActor.GetTransform()).ToUeTransform(),
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

    // hit all enemies here
    let timer = null;
    let its = 0;
    let itsLimit = 10;
    
    if (!Entity.GetComponent(3) && Entity.GetComponent(18) && Entity.GetComponent(33) && Entity.GetComponent(60)) {
        return;
    }
    const entityPos = Entity.GetComponent(3).ActorLocationProxy;
    const CharacterPartComponent = Entity.GetComponent(60);
    const CharacterDamageComponent = Entity.GetComponent(18);
    timer = setInterval(() => {
        if (!CharacterDamageComponent.Entity || its > itsLimit) {
            ModMenu_1.MainMenu.KunLog(its > itsLimit ? "Hits over limit" : "Dead, clearing timer"); 
            clearInterval(timer);
            return;
        }

        its++;
        // ModMenu_1.MainMenu.KunLog("Got pos"); 
        if (CharacterDamageComponent && Entity.GetComponent(33) && entityPos) {
            if (!CharacterPartComponent) {
                ModMenu_1.MainMenu.KunLog("Failed to find CharacterPartComponent"); 
                clearInterval(timer);
                return;
            }
            CharacterPartComponent.OnInitData();
            CharacterPartComponent.OnInit();
            CharacterPartComponent.OnActivate();

            // ModMenu_1.MainMenu.KunLog("Got components, setting hitpos"); 
            let bul = this.SpawnBullet();
            if (!bul) {
                ModMenu_1.MainMenu.KunLog("Failed to spawn bullet, clearing timer"); 
                clearInterval(timer);
                return;
            }
            let BulletInfo = bul.GetBulletInfo();
            let dict = {
                DamageDataId: 1205401001n,
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
            }

            // ModMenu_1.MainMenu.KunLog("Executing bullet damage attacker: " + BulletInfo.Attacker); 
            CharacterDamageComponent?.ExecuteBulletDamage(BulletInfo.BulletEntityId, dict, BulletInfo.ContextId);
            // ModMenu_1.MainMenu.KunLog("Executed bullet damage"); 

            bul = this.SpawnBullet();
            BulletInfo = bul.GetBulletInfo();
            dict.DamageDataId = 1301400001n;
            dict.BulletId = bul.BulletId;
            CharacterDamageComponent?.ExecuteBulletDamage(BulletInfo.BulletEntityId, dict, BulletInfo.ContextId);
        }
    }, 100);

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
