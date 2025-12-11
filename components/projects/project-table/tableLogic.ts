function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}
export function colorValueProgress(val: number) {
  const v = Math.min(Math.max(val, 0), 100);
  const hue = (v * 80) / 50;
  return hslToHex(hue, 100, 45);
}

export function stringPriority(value: string) {
  switch (value.toLowerCase()) {
    case "urgente":
      return "#B00707";
    case "media":
      return "#FF9900";
    case "baja":
      return "#005075";
    default:
      return "#9e9e9e";
  }
}

export function stringStatus(value: string) {
  switch (value.toLowerCase()) {
    case "mora":
      return "#B00707";
    case "pendiente":
      return "#005075";
    case "activo":
      return "#0BA300";
  }
}
