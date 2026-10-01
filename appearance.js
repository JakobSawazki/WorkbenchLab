(() => {
  "use strict";
  const defaults = {
    dark: { text: "#f5f7fa", background: "#090b0e", accent: "#8adccb" },
    light: { text: "#17212b", background: "#f2f4f7", accent: "#15635b" }
  };
  const choices = {
    dark: {
      text: ["#f5f7fa", "#e3edf9", "#fff1d8"],
      background: ["#090b0e", "#11151c", "#131817"],
      accent: ["#8adccb", "#9fc8ff", "#f1c785", "#deb9ec"]
    },
    light: {
      text: ["#17212b", "#243b53", "#35283d"],
      background: ["#f2f4f7", "#ffffff", "#edf3f1"],
      accent: ["#15635b", "#245b9a", "#8c4c14", "#73468b"]
    }
  };
  const validHex = (value) => typeof value === "string" && /^#[\da-f]{6}$/i.test(value);
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  function mix(a, b, fraction) {
    const right = rgb(b);
    return "#" + rgb(a).map((v, i) => Math.round(v + (right[i] - v) * fraction).toString(16).padStart(2, "0")).join("");
  }
  function luminance(hex) {
    return rgb(hex).map((v) => v / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  }
  function contrast(a, b) {
    const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (values[0] + 0.05) / (values[1] + 0.05);
  }
  function tokens(palette, theme) {
    const dark = theme === "dark";
    const panel = mix(palette.background, "#ffffff", dark ? 0.055 : 0.8);
    const strong = mix(palette.background, "#ffffff", dark ? 0.09 : 0.25);
    const metalTop = mix(strong, palette.text, 0.12);
    const surfaces = [palette.background, panel, strong, metalTop];
    const minimum = Math.min(...surfaces.map((surface) => contrast(palette.text, surface)));
    let muted = mix(palette.text, strong, 0.23);
    for (let i = 0; i < 20 && Math.min(...surfaces.map((surface) => contrast(muted, surface))) < 4.5; i++) {
      muted = mix(muted, palette.text, 0.3);
    }
    let accent = palette.accent;
    for (let i = 0; i < 20 && Math.min(contrast(accent, panel), contrast(accent, strong)) < 4.5; i++) {
      accent = mix(accent, palette.text, 0.15);
    }
    const primary = mix(palette.accent, "#000000", dark ? 0.68 : 0.12);
    return {
      minimum,
      properties: {
        "--bg": palette.background, "--panel": panel, "--panel-strong": strong,
        "--text": palette.text, "--muted": muted,
        "--line": mix(strong, palette.text, 0.27), "--brand": accent, "--brand-2": accent,
        "--metal-top": metalTop, "--metal-mid": strong,
        "--metal-bottom": panel, "--metal-rim": mix(strong, palette.text, 0.42),
        "--metal-primary-top": mix(primary, "#ffffff", 0.035),
        "--metal-primary-mid": primary, "--metal-primary-bottom": mix(primary, "#000000", 0.12),
        "--on-accent": contrast("#ffffff", mix(primary, "#ffffff", 0.035)) >= 4.5 ? "#ffffff" : "#101214"
      }
    };
  }
  function normalize(value) {
    const result = { fontSize: [16, 18, 20].includes(value?.fontSize) ? value.fontSize : 16, palettes: {} };
    for (const theme of ["dark", "light"]) {
      const palette = {};
      for (const field of ["text", "background", "accent"]) {
        const raw = value?.palettes?.[theme]?.[field];
        palette[field] = validHex(raw) ? raw.toLowerCase() : defaults[theme][field];
      }
      result.palettes[theme] = tokens(palette, theme).minimum >= 4.5 ? palette : { ...defaults[theme] };
    }
    return result;
  }
  window.WORKBENCH_APPEARANCE = { defaults, choices, validHex, contrast, tokens, normalize };
})();
