var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var shaka_video_element_exports = {};
__export(shaka_video_element_exports, {
  default: () => shaka_video_element_default
});
module.exports = __toCommonJS(shaka_video_element_exports);
var import_custom_media_element = require("custom-media-element");
var import_server_safe_globals = require("./server-safe-globals.js");
var import_shaka_player = __toESM(require("shaka-player"), 1);
function onErrorEvent(event) {
  onError(event.detail);
}
function onError(error) {
  console.error("Error code", error.code, "object", error);
}
class ShakaVideoElement extends import_custom_media_element.CustomVideoElement {
  static shadowRootOptions = { ...import_custom_media_element.CustomVideoElement.shadowRootOptions };
  static getTemplateHTML = (attrs) => {
    const { src, ...rest } = attrs;
    return import_custom_media_element.CustomVideoElement.getTemplateHTML(rest);
  };
  constructor() {
    super();
    if (import_shaka_player.default.Player.isBrowserSupported()) {
      this.api = new import_shaka_player.default.Player();
      this.api.addEventListener("error", onErrorEvent);
    } else {
      console.error("Browser does not support Shaka Player");
    }
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName !== "src") {
      super.attributeChangedCallback(attrName, oldValue, newValue);
    }
    if (attrName === "src" && oldValue != newValue) {
      this.load();
    }
  }
  get src() {
    return this.getAttribute("src");
  }
  set src(val) {
    if (val !== this.src) {
      this.setAttribute("src", val);
    }
  }
  async load() {
    if (!this.api) return;
    await Promise.resolve();
    await this.api.attach(this.nativeEl);
    if (!this.src) {
      this.api.unload();
    } else {
      try {
        await this.api.load(this.src);
      } catch (e) {
        onError(e);
      }
    }
  }
}
if (globalThis.customElements && !globalThis.customElements.get("shaka-video")) {
  globalThis.customElements.define("shaka-video", ShakaVideoElement);
}
var shaka_video_element_default = ShakaVideoElement;
