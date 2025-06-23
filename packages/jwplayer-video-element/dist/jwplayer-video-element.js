var _a, _b;
import { SuperVideoElement } from "super-media-element";
const templateLightDOM = (_a = globalThis.document) == null ? void 0 : _a.createElement("template");
if (templateLightDOM) {
  templateLightDOM.innerHTML = /*html*/
  `
  <style class="jw-style">
    .jw-no-controls [class*="jw-controls"],
    .jw-no-controls .jw-title {
      display: none !important;
    }
  </style>
  <div class="jwplayer"></div>
  `;
}
const templateShadowDOM = (_b = globalThis.document) == null ? void 0 : _b.createElement("template");
if (templateShadowDOM) {
  templateShadowDOM.innerHTML = /*html*/
  `
  <style>
    :host {
      display: inline-block;
      min-width: 300px;
      min-height: 150px;
      position: relative;
    }
    ::slotted(.jwplayer) {
      position: absolute !important;
      width: 100%;
      height: 100%;
    }
  </style>
  <slot></slot>
  `;
}
class JWPlayerVideoElement extends SuperVideoElement {
  static template = templateShadowDOM;
  static skipAttributes = ["src"];
  get nativeEl() {
    return this.querySelector(".jw-video");
  }
  async load() {
    var _a2, _b2;
    (_a2 = this.querySelector(".jw-style")) == null ? void 0 : _a2.remove();
    (_b2 = this.querySelector(".jwplayer")) == null ? void 0 : _b2.remove();
    if (!this.src) {
      return;
    }
    this.loadComplete.then(() => {
      this.volume = 1;
    });
    const MATCH_SRC = /jwplayer\.com\/players\/(\w+)(?:-(\w+))?/i;
    const [, videoId, playerId] = this.src.match(MATCH_SRC);
    const mediaUrl = `https://cdn.jwplayer.com/v2/media/${videoId}`;
    const media = await (await fetch(mediaUrl)).json();
    const scriptUrl = `https://content.jwplatform.com/libraries/${playerId}.js`;
    const JW = await loadScript(scriptUrl, "jwplayer");
    this.append(templateLightDOM.content.cloneNode(true));
    this.api = JW(this.querySelector(".jwplayer")).setup({
      width: "100%",
      height: "100%",
      preload: this.getAttribute("preload") ?? "metadata",
      ...media
    });
    await promisify(this.api.on, this.api)("ready");
    this.api.getContainer().classList.toggle("jw-no-controls", !this.controls);
  }
  async attributeChangedCallback(attrName, oldValue, newValue) {
    if (["controls", "muted"].includes(attrName)) {
      await this.loadComplete;
      switch (attrName) {
        case "controls":
          this.api.getContainer().classList.toggle("jw-no-controls", !this.controls);
          break;
        case "muted":
          this.muted = this.hasAttribute("muted");
          break;
      }
      return;
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
  get paused() {
    var _a2;
    return ((_a2 = this.nativeEl) == null ? void 0 : _a2.paused) ?? true;
  }
}
const loadScriptCache = {};
async function loadScript(src, globalName) {
  if (!globalName) return import(
    /* webpackIgnore: true */
    src
  );
  if (loadScriptCache[src]) return loadScriptCache[src];
  if (self[globalName]) return self[globalName];
  return loadScriptCache[src] = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.defer = true;
    script.src = src;
    script.onload = () => resolve(self[globalName]);
    script.onerror = reject;
    document.head.append(script);
  });
}
function promisify(fn) {
  return (...args) => new Promise((resolve) => {
    fn(...args, (...res) => {
      if (res.length > 1) resolve(res);
      else resolve(res[0]);
    });
  });
}
if (globalThis.customElements && !globalThis.customElements.get("jwplayer-video")) {
  globalThis.customElements.define("jwplayer-video", JWPlayerVideoElement);
}
var jwplayer_video_element_default = JWPlayerVideoElement;
export {
  jwplayer_video_element_default as default,
  promisify
};
