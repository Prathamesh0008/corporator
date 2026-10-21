/* Execute the real component's effects without network, tiles, or a live DOM. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { transformSync } = require("next/dist/build/swc");
let container, effects;
const maps = [], observers = [];
const leaflet = {
  map(node, options) {
    assert.ok(!node.map, "container must be released before reinitialization");
    const map = {
      options, layers: [], removed: false, invalidations: 0,
      setView(center, zoom) { this.center = center; this.zoom = zoom; return this; },
      invalidateSize() { assert.equal(this.removed, false); this.invalidations++; },
      remove() { assert.equal(this.removed, false); this.removed = true; node.map = null; },
    };
    node.map = map;
    maps.push(map);
    return map;
  },
  icon: (options) => options,
};
for (const type of ["tileLayer", "polygon", "marker"]) {
  leaflet[type] = (value, options) => ({
    type, value, options,
    on(events) { this.events = events; return this; },
    bindPopup(popup) { this.popup = popup; return this; },
    setStyle(style) { this.style = style; },
    addTo(map) {
      assert.equal(map.removed, false, "layers must never attach to a removed map");
      map.layers.push(this);
      return this;
    },
  });
}
const context = vm.createContext({
  document: { createElement: () => ({ textContent: "" }) },
  ResizeObserver: class {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(node) { this.node = node; }
    disconnect() { this.disconnected = true; }
  },
});
(async () => {
  const { code } = transformSync(fs.readFileSync("components/LeafletMap.jsx", "utf8"), {
    filename: "components/LeafletMap.jsx",
    jsc: { parser: { syntax: "ecmascript", jsx: true }, transform: { react: { runtime: "automatic" } } },
    module: { type: "es6" },
  });
  const component = new vm.SourceTextModule(code, { context });
  await component.link((name) => {
    const exports = name === "react" ? {
      useRef: () => ({ current: container }), useEffect: (setup) => effects.push(setup),
    } : name === "leaflet" ? { default: leaflet }
      : name.endsWith(".png") ? { default: { src: "/" + name.split("/").at(-1) } }
        : require(name);
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
  });
  await component.evaluate();
  const props = { center: [19.0285, 73.012], zoom: 13, title: "<Ward 24>", boundary: [[1, 2], [3, 4], [5, 6]] };
  function render(values) {
    container = {};
    effects = [];
    component.namespace.default(values);
    assert.equal(effects.length, 1);
    return effects[0];
  }
  const setup = render(props);
  const firstCleanup = setup();
  assert.equal(maps[0].layers.length, 3);
  assert.equal(maps[0].layers.find((layer) => layer.type === "marker").popup.textContent, "<Ward 24>");
  firstCleanup();
  const restoredCleanup = setup(); // Strict Mode / Activity cleanup and restoration.
  assert.notEqual(maps[0], maps[1]);
  assert.equal(maps[1].removed, false);
  observers[0].callback(); // An already queued resize callback after cleanup is harmless.
  observers[1].callback();
  assert.equal(maps[1].invalidations, 1);
  const polygon = maps[1].layers.find((layer) => layer.type === "polygon");
  polygon.events.mouseover({ target: polygon });
  assert.equal(polygon.style.color, "#ff0000");
  polygon.events.mouseout({ target: polygon });
  assert.equal(polygon.style.color, "#1e3a8a");
  const modalCleanup = render({ ...props, zoom: 14 })();
  const contactCleanup = render({ center: [19.0347, 73.0111], zoom: 15, title: "Office" })();
  assert.equal(maps[3].layers.length, 2);
  modalCleanup();
  assert.equal(maps[1].removed, false, "closing modal must preserve the inline map");
  assert.equal(maps[3].removed, false, "map instances clean up independently");
  restoredCleanup();
  contactCleanup();
  assert.ok(maps.every((map) => map.removed));
  assert.ok(observers.every((observer) => observer.disconnected));
  console.log("PASS fresh maps after effect replay, independent inline/modal/contact maps, layers, popup escaping, boundary hover and resize cleanup");
})().catch((error) => { console.error(error); process.exitCode = 1; });
