"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.MobVacuum = void 0);
const puerts_1 = require("puerts"),
  UE = require("ue"),
  Info_1 = require("../../../Core/Common/Info"),
  Log_1 = require("../../../Core/Common/Log"),
  EventDefine_1 = require("../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../Common/Event/EventSystem"),
  TimerSystem_1 = require("../../../Core/Timer/TimerSystem"),
  ModManager_1 = require("../ModManager"),
  ModUtils_1 = require("./ModUtils"),
  ModMenu_1 = require("../../ModMenu"),
  NetDefine_1 = require("../../../Core/Define/Net/NetDefine"),
  Protocol_1 = require("../../../Core/Define/Net/Protocol"),
  Net_1 = require("../../../Core/Net/Net"),
  EntityManager_1 = require("./EntityManager"),
  ModelManager_1 = require("../../Manager/ModelManager"),
  Global_1 = require("../../Global"),
  GlobalData_1 = require("../../GlobalData"),
  EntityFilter_1 = require("./EntityFilter"),
  MobVacuum_1 = require("./MobVacuum"),
  AutoDestroy_1 = require("./AutoDestroy"),
  AutoPuzzle_1 = require("./AutoPuzzle"),
  KillAura_1 = require("./KillAura"),
  UiManager_1 = require("../../../Ui/UiManager");

class EventListener {
  constructor() {
    (this.Started = false),
      (this.OnAddEntity = (entityComp0, entity) => {
        puerts_1.logger.info("OnAddEntity" + entity);
        MobVacuum_1.MobVacuum.MobVacuum(entity);
        AutoDestroy_1.AutoDestroy.AutoDestroy(entity);
        MobVacuum_1.MobVacuum.VacuumCollect(entity);
        AutoPuzzle_1.AutoPuzzle.AutoPuzzle(entity);
        KillAura_1.KillAura.killAura(entity);
        KillAura_1.KillAura.KillAnimal(entity);
      });
    this.OnCreateEntity = (entityComp0, entity) => {
      puerts_1.logger.info("OnCreateEntity" + entity);
      MobVacuum_1.MobVacuum.MobVacuum(entity);
      AutoDestroy_1.AutoDestroy.AutoDestroy(entity);
      MobVacuum_1.MobVacuum.VacuumCollect(entity);
      AutoPuzzle_1.AutoPuzzle.AutoPuzzle(entity);
      KillAura_1.KillAura.killAura(entity);
      KillAura_1.KillAura.KillAnimal(entity);
    };
  }

  Setup() {
    if (this.Started === true) {
      return;
    }
    puerts_1.logger.info("Started event listener");
    this.Started = true;

    EventSystem_1.EventSystem.Has(
      EventDefine_1.EEventName.AddEntity,
      this.OnAddEntity
    ) ||
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.AddEntity,
        this.OnAddEntity
      );
    EventSystem_1.EventSystem.Has(
      EventDefine_1.EEventName.CreateEntity,
      this.OnCreateEntity
    ) ||
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.CreateEntity,
        this.OnCreateEntity
      );
  }
}
//puerts.logger.info(debug)
exports.EventListener = EventListener;
