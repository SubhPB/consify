import { ANSI_COLORS, ANSI_STYLES } from "./constants.js";

type COLORS = typeof ANSI_COLORS;
type STYLES = typeof ANSI_STYLES;
type COLOR = COLORS[number];
type STYLE = STYLES[number];
export type {COLORS, COLOR, STYLES, STYLE} 