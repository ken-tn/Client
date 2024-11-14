"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.ModUtils = void 0);
const puerts_1 = require("puerts"),
  UE = require("ue"),
  Info_1 = require("../../../Core/Common/Info"),
  Log_1 = require("../../../Core/Common/Log"),
  ModManager_1 = require("../ModManager"),
  ModelManager_1 = require("../ModelManager"),
  TimerSystem_1 = require("../../../Core/Timer/TimerSystem"),
  AudioSystem_1 = require("../../../Core/Audio/AudioSystem"),
  Global_1 = require("../../Global"),
  GlobalData_1 = require("../../GlobalData"),
  LoginDefine_1 = require("../../Module/Login/Data/LoginDefine"),
  EntityManager_1 = require("./EntityManager"),
  WorldFunctionLibrary_1 = require("../../World/Bridge/WorldFunctionLibrary"),
  UiManager_1 = require("../../../Ui/UiManager");

class ModUtils {
  static isInGame() {
    let state = null;
    try {
      state = ModelManager_1.ModelManager.LoginModel.IsLoginStatus(
        LoginDefine_1.ELoginStatus.EnterGameRet
      );
    } catch {}

    return state;
  }
  //Kuro SingleInputBox  库洛单输入框
  static KuroSingleInputBox(options) {
    UiManager_1.UiManager.OpenView("CommonSingleInputView", {
      Title: options.title,
      CustomFunc: options.customFunc,
      InputText: options.inputText,
      DefaultText: options.defaultText,
      IsCheckNone: options.isCheckNone,
      NeedFunctionButton: options.needFunctionButton,
    });
  }
  //字符串转整数
  static StringToInt(str) {
    var num = parseInt(str);
    if (isNaN(num)) {
      ModManager_1.ModManager.ShowTip("str is not int");

      return "error";
    } else {
      return num;
    }
  }
  static IsTping() {
    return ModelManager_1.ModelManager.TeleportModel.IsTeleport;
  }
  static async Sleep(time) {
    await TimerSystem_1.TimerSystem.Wait(time);
  }

  static PlayAudio(string) {
    AudioSystem_1.AudioSystem.PostEvent(string);
    //"play_ui_fx_com_count_start"
  }

  static KunLog(string) {
    var info = string.toString();
    // puerts_1.logger.info("[KUNMOD:]" + info);
  }

  static StackTrace() {
    var err = new Error();
    return err.stack;
  }

  static async getProps(e, par = "", visited = new Set(), depth = 0) {
    const indent = "  ".repeat(depth); // Indentation for nested properties
    for (let prop in e) {
      if (e.hasOwnProperty(prop)) {
        const fullPropName = par ? `${par}.${prop}` : prop;
        const value = e[prop];

        // Handle circular references
        if (typeof value === "object" && value !== null) {
          if (visited.has(value)) {
            puerts_1.logger.info(
              `${indent}${fullPropName}: [Circular Reference]`
            );
            continue;
          }
          visited.add(value);
        }

        // Format the output based on the value type
        if (typeof value === "object" && value !== null) {
          if (Array.isArray(value)) {
            puerts_1.logger.info(`${indent}${fullPropName}: [Array]`);
            value.forEach((item, index) => {
              if (typeof item === "object") {
                puerts_1.logger.info(`${indent}  ${fullPropName}[${index}]: {`);
                this.getProps(
                  item,
                  `${fullPropName}[${index}]`,
                  visited,
                  depth + 2
                );
                puerts_1.logger.info(`${indent}  }`);
              } else {
                puerts_1.logger.info(
                  `${indent}  ${fullPropName}[${index}]: ${item}`
                );
              }
            });
          } else if (value instanceof Date) {
            puerts_1.logger.info(
              `${indent}${fullPropName}: [Date: ${value.toISOString()}]`
            );
          } else {
            puerts_1.logger.info(`${indent}${fullPropName}: {`);
            this.getProps(value, fullPropName, visited, depth + 1);
            puerts_1.logger.info(`${indent}}`);
          }
        } else {
          puerts_1.logger.info(`${indent}${fullPropName}: ${value}`);
        }
      }
    }
  }

  static serializeToJS(e, depth = 0, visited = new WeakSet()) {
    const indent = "  ".repeat(depth); // Indentation for nested objects and arrays
    let output = "";

    // Check for circular references
    if (typeof e === "object" && e !== null) {
      if (visited.has(e)) {
        return '"[Circular]"'; // Mark circular reference
      }
      visited.add(e); // Mark this object as visited
    }

    if (Array.isArray(e)) {
      output += "[\n";
      e.forEach((item, index) => {
        output += `${indent}  ${this.serializeToJS(
          item,
          depth + 1,
          visited
        )},\n`;
      });
      output += `${indent}]`;
    } else if (e instanceof Date) {
      output += `new Date('${e.toISOString()}')`; // Date object in JS
    } else if (typeof e === "object" && e !== null) {
      output += "{\n";
      for (let prop in e) {
        // if (e.hasOwnProperty(prop)) {
        if (Object.prototype.hasOwnProperty.call(e, prop)) {
          // Check if the object owns the property
          const value = e[prop];
          if (value !== undefined) {
            // Skip undefined properties
            output += `${indent}  "${prop}": ${this.serializeToJS(
              value,
              depth + 1,
              visited
            )},\n`;
          }
        }
      }
      output += `${indent}}`;
    } else if (typeof e === "string") {
      output += `"${e}"`; // Strings should be quoted
    } else {
      output += `${e}`; // For numbers, booleans, null, and undefined
    }

    return output;
  }

  static async jsLog(e) {
    puerts_1.logger.info(this.serializeToJS(e));
  }

  static DrawDebugBox(
    Center,
    Extent,
    LineColor,
    Rotation,
    Duration,
    Thickness
  ) {
    UE.KismetSystemLibrary.DrawDebugBox(
      GlobalData_1.GlobalData.World,
      Center,
      Extent,
      LineColor,
      Rotation,
      Duration,
      Thickness
    );
  }

  static Getdistance(pos1, pos2) {
    let dis = UE.KismetMathLibrary.Vector_Distance(pos1, pos2);
    return dis;
  }
  static Getdistance2Player(pos1) {
    let pos2 = EntityManager_1.EntityManager.GetPlayerPos();
    let dis = UE.KismetMathLibrary.Vector_Distance(pos1, pos2);
    return dis;
  }
  static IsOpenWorld() {
    return WorldFunctionLibrary_1.WorldFunctionLibrary.IsOpenWorld();
  }
  static IsInMapView() {
    return UiManager_1.UiManager.IsViewShow("WorldMapView");
  }
}
//puerts.logger.info(debug)
exports.ModUtils = ModUtils;
//exports.PaintContext = PaintContext;
