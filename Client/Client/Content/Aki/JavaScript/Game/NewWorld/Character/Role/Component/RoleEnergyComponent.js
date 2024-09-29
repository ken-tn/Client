"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (t, e, o, r) {
    var n,
      i = arguments.length,
      s =
        i < 3
          ? e
          : null === r
          ? (r = Object.getOwnPropertyDescriptor(e, o))
          : r;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
      s = Reflect.decorate(t, e, o, r);
    else
      for (var c = t.length - 1; 0 <= c; c--)
        (n = t[c]) && (s = (i < 3 ? n(s) : 3 < i ? n(e, o, s) : n(e, o)) || s);
    return 3 < i && s && Object.defineProperty(e, o, s), s;
  };
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.RoleEnergyComponent = void 0);
const Protocol_1 = require("../../../../../Core/Define/Net/Protocol"),
  ModManager_1 = require("../../../../Manager/ModManager"),
  EntityComponent_1 = require("../../../../../Core/Entity/EntityComponent");
var EAttributeId = Protocol_1.Aki.Protocol.Vks;
const RegisterComponent_1 = require("../../../../../Core/Entity/RegisterComponent"),
  energyAttrIds = [EAttributeId.Proto_Energy, EAttributeId.Proto_EnergyMax];
let RoleEnergyComponent = class RoleEnergyComponent extends EntityComponent_1.EntityComponent {
  constructor() {
    super(...arguments),
      (this.n$t = void 0),
      (this.$te = void 0),
      (this.Qin = (t, e, o) => {
        var r = this.$te.GetCurrentValue(EAttributeId.Proto_Energy),
          n = this.$te.GetCurrentValue(EAttributeId.Proto_EnergyMax);
        ModManager_1.ModManager.Settings.NoCD
          ? this.n$t.Actor?.CharRenderingComponent.SetStarScarEnergy(n)
          : this.n$t.Actor?.CharRenderingComponent.SetStarScarEnergy(r / n);
      });
  }
  OnStart() {
    (this.n$t = this.Entity.CheckGetComponent(3)),
      (this.$te = this.Entity.CheckGetComponent(159));
    let e = this.$te.GetCurrentValue.bind(this.$te);
    return (
      (this.$te.GetCurrentValue = (t) =>
        t === EAttributeId.Proto_Energy && ModManager_1.ModManager.Settings.NoCD
          ? e(EAttributeId.Proto_EnergyMax)
          : e(t)),
      this.$te.AddListeners(energyAttrIds, this.Qin, "RoleEnergyComponent"),
      this.Qin(),
      !0
    );
  }
  OnEnd() {
    return this.$te.RemoveListeners(energyAttrIds, this.Qin), !0;
  }
};
(RoleEnergyComponent = __decorate(
  [(0, RegisterComponent_1.RegisterComponent)(83)],
  RoleEnergyComponent
)),
  (exports.RoleEnergyComponent = RoleEnergyComponent);
//# sourceMappingURL=RoleEnergyComponent.js.map
