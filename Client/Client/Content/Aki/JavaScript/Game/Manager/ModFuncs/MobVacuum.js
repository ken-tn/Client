"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.MobVacuum = void 0);
const puerts_1 = require("puerts"),
  UE = require("ue"),
  Info_1 = require("../../../Core/Common/Info"),
  Log_1 = require("../../../Core/Common/Log"),
  ModManager_1 = require("../ModManager"),
  ModUtils_1 = require("./ModUtils"),
  ModMenu_1 = require("../../ModMenu"),
  NetDefine_1 = require("../../../Core/Define/Net/NetDefine"),
  Protocol_1 = require("../../../Core/Define/Net/Protocol"),
  Net_1 = require("../../../Core/Net/Net"),
  EntityManager_1 = require("./EntityManager"),
  Global_1 = require("../../Global"),
  GlobalData_1 = require("../../GlobalData"),
  EntityFilter_1 = require("./EntityFilter"),
  UiManager_1 = require("../../../Ui/UiManager");

class MobVacuum extends EntityManager_1.EntityManager {
  static isIndistance(entity) {
    let monsterPos = this.GetPosition(entity.Entity);
    let distance = ModUtils_1.ModUtils.Getdistance2Player(monsterPos);
    if (distance < ModManager_1.ModManager.Settings.VacuumRadius * 100) {
      return true;
    } else return false;
  }

  static origPositions = {}

  static MobVacuum(entity) {
    if (!ModManager_1.ModManager.Settings.MobVacuum) return;
    
    if (this.isMonster(entity) && this.isIndistance(entity)) {
        const entityId = entity.Entity.Id;
        if (!(entityId in this.origPositions)) {
            ModMenu_1.MainMenu.KunLog("New entity vacuum " + entityId)
            this.origPositions[entityId] = this.GetPosition(entity.Entity);
        } else {
            const distToSpawn = ModUtils_1.ModUtils.Getdistance(this.origPositions[entityId], this.GetPosition(entity.Entity))
            ModMenu_1.MainMenu.KunLog("exist entity vacuum " + entityId + " " + distToSpawn.toString())
            if (distToSpawn > ModManager_1.ModManager.Settings.VacuumRadius * 100) {
                return;
            }
        }
        // confirm TP
        let timer = null
        timer = setInterval(() => {
            let monsterPos = null
            try {
                monsterPos = this.GetPosition(entity.Entity);
            } catch {
                clearInterval(timer);
                return;
            }
            const distToPlayer = ModUtils_1.ModUtils.Getdistance2Player(monsterPos);
            const distToSpawn = ModUtils_1.ModUtils.Getdistance(this.origPositions[entityId], this.GetPosition(entity.Entity))
            if (distToPlayer < 300 || distToSpawn > ModManager_1.ModManager.Settings.VacuumRadius * 100) {
                clearInterval(timer);
                return;
            }
            let playerpos = this.GetPlayerPos();
            playerpos.Z += 150;
            let fv = this.GetPlayerForwardVector();
            playerpos.X = playerpos.X - (fv.X * 200);
            playerpos.Y = playerpos.Y - (fv.Y * 200);
            let ActorComp = entity.Entity.GetComponent(1);
            ActorComp.ActorInternal.K2_SetActorLocation(playerpos);
            // ActorComp.ActorInternal.SetActorEnableCollision(0); no hit detection ;-;
            this.SyncMonster(entity, playerpos);
        }, 400);
    }
  }

  static VacuumCollect(entity) {
    if (!ModManager_1.ModManager.Settings.VacuumCollect) return;
    if (
      EntityFilter_1.EntityFilter.isneedLoot(
        this.GetBlueprintType2(entity)
      ) &&
      this.isIndistance(entity)
    ) {
      let playerpos = this.GetPlayerPos();
      let ActorComp = entity.Entity.GetComponent(1);
      ActorComp.ActorInternal.K2_SetActorLocation(playerpos);
    }
  }

  static SyncMonster(entity, pos) {
    // update here CombatMessageController.js AfterTick
    var t = entity.Entity.GetComponent(58);
    if (!t) {
        return;
    }
    var i = t.GetCurrentMoveSample();
    i.Location = pos;
    t.PendingMoveInfos.push(i);
    var s = Protocol_1.Aki.Protocol.$us.create();
    s.kRs.push(t.CollectPendingMoveInfos());
    Net_1.Net.Send(28674 /*NetDefine_1.EPushMessageId.MovePackagePush*/, s);
  }
}
//puerts.logger.info(debug)
exports.MobVacuum = MobVacuum;
