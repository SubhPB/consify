import * as Core from './core.ts';
import { ANSI_COLORS, ANSI_STYLES } from './shared/constants.ts';
import type { COLOR, STYLE } from './shared/types.ts';


/**
 * Define standard (non-bright) text color using a chainable interface.
 *
 * @remarks 
 * ✅ Supports chaining: `cl.<color>.write("text")`  
 * 🎨 Applies only **regular foreground (text) colors** — no background or style support.  
 * 🔁 Avoid breaking the chain — use `.bind()` only if necessary to retain context.
 *
 * @example
 * cl.red.write("Red text");
 * cl.yellow.write("Yellow text");
 * cl.<color>.write("Colored text");
 *
 * @example
 * // ⛔ Incorrect (context lost)
 * const write = cl.red.write;
 * write("Will throw an error!");
 *
 * // ✅ Correct (if needed)
 * const write = cl.red.write.bind(cl.red);
 * write("This works");
 */
export const cl = new Core.CL();


/**
 * Dynamically apply a standard text color by name — returns a write function with the color applied.
 *
 * @param {COLOR} color The name of the color to use as the text foreground (e.g. `"red"`, `"blue"`). Case-insensitive and trimmed.
 *
 * @returns {function(string): string} A bound `write()` function with the specified color applied.
 *
 * @remarks
 * ✅ Applies only standard (non-bright) foreground colors.  
 * ❓ If an invalid or unsupported color is provided, the function defaults to unstyled output.  
 * 💡 For chaining-based control, consider using `cl.red.write("...")` instead.
 *
 * @example
 * CL("red")("This text will appear in red");
 * CL(" Blue ")("This text will appear in blue"); // spaces and case handled
 * CL("invalidColor")("This text has no styling"); // fallback
 */
export function CL(color:COLOR): Core.ClElem['write'] { 
    const ansiColor = color?.toLowerCase()?.trim() as COLOR;
    const clElem = (
        ansiColor&&ANSI_COLORS.includes(ansiColor)
    ) ? cl[ansiColor] : new Core.ClElem();
    return clElem.write.bind(clElem);
};

const colors = Object.fromEntries(
    ANSI_COLORS.map(color => [color, cl[color].write.bind(cl[color])])
) as {[key in COLOR]: Core.ClElem['write']};

/**
 * Applies black text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * black("This text is black.")
 */
export const black = colors.black;

/**
 * Applies red text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * red("This text is red.")
 */
export const red = colors.red;

/**
 * Applies green text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * green("This text is green.")
 */
export const green = colors.green;

/**
 * Applies yellow text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * yellow("This text is yellow.")
 */
export const yellow = colors.yellow;

/**
 * Applies blue text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * blue("This text is blue.")
 */
export const blue = colors.blue;

/**
 * Applies magenta text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * magenta("This text is magenta.")
 */
export const magenta = colors.magenta;

/**
 * Applies cyan text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * cyan("This text is cyan.")
 */
export const cyan = colors.cyan;

/**
 * Applies white text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * white("This text is white.")
 */
export const white = colors.white;







/**
 * Define bright text color using a clean, chainable API.
 *
 * @remarks 
 * ✅ Supports chaining: `brCl.<color>.write("text")`  
 * 🎨 Applies only **bright foreground (text) colors** — does not support background or styles.  
 * 🔁 Avoid breaking the chain — use `.bind()` only if necessary to retain context.
 *
 * @example
 * brCl.red.write("Bright red text");
 * brCl.yellow.write("Bright yellow text");
 * brCl.<color>.write("Bright colored text");
 *
 * @example
 * // ⛔ Incorrect (context lost)
 * const write = brCl.red.write;
 * write("Will throw an error!");
 *
 * // ✅ Correct (if needed)
 * const write = brCl.red.write.bind(brCl.red);
 * write("This works");
 */
export const brCl = new Core.BrCL();

/**
 * Dynamically apply a bright text color by name — returns a write function with the color applied.
 *
 * @param {COLOR} color The name of the bright color to use as the text foreground (e.g. `"red"`, `"cyan"`). Case-insensitive and trimmed.
 *
 * @returns {function(string): string} A bound `write()` function with the specified bright color applied.
 *
 * @remarks
 * ✅ Applies only **bright foreground (text) colors**.  
 * ❓ If the input color is invalid or unsupported, the function falls back to unstyled output.  
 * 💡 For full chaining control, consider using `brCl.red.write("...")` instead.
 *
 * @example
 * BrCL("red")("Bright red text");
 * BrCL(" Cyan ")("Bright cyan text"); // spaces and case handled
 * BrCL("invalidColor")("This will have no styling"); // fallback
 */
export function BrCL(color:COLOR):Core.ClElem['write']{
    const ansiColor = color?.toLowerCase()?.trim() as COLOR;
    const clElem = (
        ansiColor&&ANSI_COLORS.includes(ansiColor)
    ) ?  brCl[ansiColor] : new Core.ClElem();
    return clElem.write.bind(clElem);
};


const brightColors = Object.fromEntries(
    ANSI_COLORS.map(color=>[`${color}Br`, brCl[color].write.bind(brCl)])
) as {[key in `${COLOR}Br`]: Core.ClElem['write']};

/**
 * Applies bright black (gray) text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * blackBr("This text is bright black (gray).")
 */
export const blackBr = brightColors.blackBr;

/**
 * Applies bright red text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * redBr("This text is bright red.")
 */
export const redBr = brightColors.redBr;

/**
 * Applies bright green text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * greenBr("This text is bright green.")
 */
export const greenBr = brightColors.greenBr;

/**
 * Applies bright yellow text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * yellowBr("This text is bright yellow.")
 */
export const yellowBr = brightColors.yellowBr;

/**
 * Applies bright blue text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * blueBr("This text is bright blue.")
 */
export const blueBr = brightColors.blueBr;

/**
 * Applies bright magenta text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * magentaBr("This text is bright magenta.")
 */
export const magentaBr = brightColors.magentaBr;

/**
 * Applies bright cyan text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * cyanBr("This text is bright cyan.")
 */
export const cyanBr = brightColors.cyanBr;

/**
 * Applies bright white text color.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * whiteBr("This text is bright white.")
 */
export const whiteBr = brightColors.whiteBr;















/**
 * Define background and text color in a single chain — supports bright text, but not bright backgrounds.
 *
 * @remarks 
 * ✅ Supports chaining: `bg.<color>[.color|.br.color].write("text")`  
 * ⚠️ For **regular backgrounds** only — for bright backgrounds, use `brBg`.  
 * 🔁 Avoid breaking the chain — use `.bind()` only if necessary to retain context.  
 * 🚫 You can't chain styles (like `bold`) before `bg`, or switch to bright backgrounds mid-chain — use `st` for full styling flexibility.
 *
 * @example
 * bg.red.write("Red background");
 * bg.red.blue.write("Blue text on red background");
 * bg.red.br.blue.write("Bright blue text on red background");
 *
 * @example
 * // ⛔ Incorrect (context lost)
 * const write = bg.red.write;
 * write("Will throw an error!");
 *
 * // ✅ Correct (if needed)
 * const write = bg.red.write.bind(bg.red);
 * write("This works");
 */
export const bg = new Core.BG();


/**
 * Dynamically apply a background color by name — returns a write function with the background applied.
 *
 * @param {COLOR} bgColor The name of the background color to apply (e.g. `"red"`, `"green"`). Case-insensitive and trimmed.
 *
 * @returns {function(string): string} A bound `write()` function with the specified background color.
 *
 * @remarks
 * ✅ Applies only **regular (non-bright) background colors**.  
 * ❓ Invalid or unsupported color names will result in unstyled output.  
 * 💡 For full chaining support, use `bg.red.write("...")` instead.
 *
 * @example
 * BG("red")("Text with red background");
 * BG(" Green ")("Text with green background"); // case + spacing normalized
 * BG("invalidColor")("No styling applied");    // fallback
 */
export function BG(bgColor:COLOR):Core.BgElem['write']{
    const ansiBgColor = bgColor?.toLowerCase()?.trim() as COLOR;
    const bgElem = (
        ansiBgColor&&ANSI_COLORS.includes(ansiBgColor)
    ) ? bg[ansiBgColor] : new Core.BgElem();
    return bgElem.write.bind(bgElem);
};


const bgColors = Object.fromEntries(
    ANSI_COLORS.map(bgColor => [`${bgColor}BG`, bg[bgColor].write.bind(bg)])
) as {[key in `${COLOR}BG`]: Core.BgElem['write']};
// export const {blackBG, redBG, greenBG, yellowBG, blueBG, magentaBG, cyanBG, whiteBG} = bgColors;

/**
 * Applies a black background to your text.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * blackBG("This text has a black background.")
 */
export const blackBG = bgColors.blackBG;

/**
 * Applies a red background to your text.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * redBG("This text has a red background.")
 */
export const redBG = bgColors.redBG;

/**
 * Applies a green background to your text.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * greenBG("This text has a green background.")
 */
export const greenBG = bgColors.greenBG;

/**
 * Applies a yellow background to your text.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * yellowBG("This text has a yellow background.")
 */
export const yellowBG = bgColors.yellowBG;

/**
 * Applies a blue background to your text.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * blueBG("This text has a blue background.")
 */
export const blueBG = bgColors.blueBG;

/**
 * Applies a magenta background to your text.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * magentaBG("This text has a magenta background.")
 */
export const magentaBG = bgColors.magentaBG;

/**
 * Applies a cyan background to your text.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * cyanBG("This text has a cyan background.")
 */
export const cyanBG = bgColors.cyanBG;

/**
 * Applies a white background to your text.
 * @param {string} string
 * @param {function} [callbackFn] Optional callback function that returns a string to control how escape codes get conjugated with your text.
 * @example
 * whiteBG("This text has a white background.")
 */
export const whiteBG = bgColors.whiteBG;







/**
 * Define bright background and text color in a single chain — optimized for bright backgrounds.
 *
 * @remarks 
 * ✅ Supports chaining: `brBg.<color>[.color|.br.color].write("text")`  
 * ⚠️ Primarily intended for **bright backgrounds**, allow chaining to implement foregrounds(Both bright/non-bright text-colors) too.  
 * 🔁 Avoid breaking the chain — use `.bind()` only if necessary to retain context.
 *
 * @example
 * brBg.red.write("Bright red background");
 * brBg.red.blue.write("Blue text on bright red background");
 * brBg.red.br.blue.write("Bright blue text on bright red background");
 *
 * @example
 * // ⛔ Incorrect (context lost)
 * const write = brBg.red.write;
 * write("Will throw an error!");
 *
 * // ✅ Correct (if needed)
 * const write = brBg.red.write.bind(brBg.red);
 * write("This works");
 */
export const brBg = new Core.BrBG();

/**
 * Dynamically apply a bright background color by name — returns a write function with the background applied.
 *
 * @param {COLOR} bgColor The name of the bright background color to apply (e.g. `"red"`, `"magenta"`). Case-insensitive and trimmed.
 *
 * @returns {function(string): string} A bound `write()` function with the specified bright background color.
 *
 * @remarks
 * ✅ Applies only **bright background colors**.  
 * ❓ If the color is invalid or unsupported, the function falls back to unstyled output.  
 * 💡 For chaining flexibility or combined styling, consider using `brBg.red.write("...")`.
 *
 * @example
 * BrBG("red")("Text with bright red background");
 * BrBG(" Magenta ")("Text with bright magenta background"); // handles spacing & casing
 * BrBG("invalidColor")("No background styling applied");    // fallback
 */
export function BrBG(bgColor:COLOR):Core.BgElem['write']{
    const ansiBgColor = bgColor?.toLowerCase()?.trim() as COLOR;
    const bgElem = (
        ansiBgColor&&ANSI_COLORS.includes(ansiBgColor)
    ) ? brBg[ansiBgColor] : new Core.BgElem();
    return bgElem.write.bind(bgElem);
};

const brightBgColors = Object.fromEntries(
    ANSI_COLORS.map(bgColor=> [`${bgColor}BrBG`, brBg[bgColor].write.bind(brBg)])
) as {[key in `${COLOR}BrBG`]: Core.BgElem['write']};

/**
 * Applies a bright black background to your text.
 * @param string
 * @param {function} callbackFn You can either use a callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * blackBrBG("This text has a bright black background.")
 */
export const blackBrBG = brightBgColors.blackBrBG;

/**
 * Applies a bright red background to your text.
 * @param string
 * @param {function} callbackFn You can either use a callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * redBrBG("This text has a bright red background.")
 */
export const redBrBG = brightBgColors.redBrBG;

/**
 * Applies a bright green background to your text.
 * @param string
 * @param {function} callbackFn You can either use a callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * greenBrBG("This text has a bright green background.")
 */
export const greenBrBG = brightBgColors.greenBrBG;

/**
 * Applies a bright yellow background to your text.
 * @param string
 * @param {function} callbackFn You can either use a callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * yellowBrBG("This text has a bright yellow background.")
 */
export const yellowBrBG = brightBgColors.yellowBrBG;

/**
 * Applies a bright blue background to your text.
 * @param string
 * @param {function} callbackFn You can either use a callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * blueBrBG("This text has a bright blue background.")
 */
export const blueBrBG = brightBgColors.blueBrBG;

/**
 * Applies a bright magenta background to your text.
 * @param string
 * @param {function} callbackFn You can either use a callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * magentaBrBG("This text has a bright magenta background.")
 */
export const magentaBrBG = brightBgColors.magentaBrBG;

/**
 * Applies a bright cyan background to your text.
 * @param string
 * @param {function} callbackFn You can either use a callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * cyanBrBG("This text has a bright cyan background.")
 */
export const cyanBrBG = brightBgColors.cyanBrBG;

/**
 * Applies a bright white background to your text.
 * @param string
 * @param {function} callbackFn You can either use a callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * whiteBrBG("This text has a bright white background.")
 */
export const whiteBrBG = brightBgColors.whiteBrBG;
















/**
 * Define text styles, background, and color in a single chainable interface — including bright variants.
 *
 * @remarks 
 * ✅ Chaining Order: style → (bg/brBg) → (color/brColor) → `write("text")`  
 * ⚠️ Use `.bind(st)` if extracting a method — though direct chaining is recommended for consistency.
 *
 * @example
 * st.underline.write("Underlined text");               // Style only
 * st.bold.write("Bold text");                          // Style only
 * st.bold.red.write("Bold + red text");                // Style + color
 * st.bold.bg.red.write("Bold + red background");       // Style + background
 * st.bold.brBg.red.write("Bold + bright red bg");      // Style + bright background
 * st.bold.bg.red.blue.write("Bold + red bg + blue");   // Style + bg + color
 * st.bold.bg.red.br.blue.write("Bold + red bg + bright blue"); // Style + bg + bright color
 *
 * @example
 * // ⛔ Wrong (loses context)
 * const italicWrite = st.italic.write;
 * italicWrite("text"); // Error
 *
 * // ✅ Correct (bind to maintain context)
 * const italicWrite = st.italic.write.bind(st.italic);
 * italicWrite("text");
 */
export const st = new Core.Style();


/**
 * Dynamically apply a text style by name — returns a write function with the style applied.
 *
 * @param {STYLE} style The name of the style to apply (e.g. `"italic"`, `"bold"`, `"underline"`). Case-insensitive and trimmed.
 *
 * @returns {function(string): string} A bound `write()` function with the specified style applied.
 *
 * @remarks
 * ✅ Applies text styles such as bold, dim, italic, underline, etc.  
 * ❓ If the input is invalid or unsupported, the function returns an unstyled output.  
 * ⚠️ Some styles (like `blink` or `hidden`) may not be supported by all terminals — test before relying on them.  
 * 💡 For chaining control, you can use `st.italic.write("...")` or combine styles and colors.
 *
 * @example
 * ST("italic")("This will be italicized");
 * ST(" BOLD ")("This will be bold"); // handles casing and spacing
 * ST("unknown")("This has no styling"); // fallback
 */
export function ST(style:STYLE):Core.StyleElem['write']{ 
    const ansiStyle = style?.toLowerCase()?.trim() as STYLE;
    const styleElem = (
        ansiStyle&&ANSI_STYLES.includes(ansiStyle)
    ) ? st[ansiStyle] : new Core.StyleElem();
    return styleElem.write.bind(styleElem);
};

const styles = Object.fromEntries(
    ANSI_STYLES.map(style => [style, st[style].write.bind(st)])
) as {[key in STYLE]: Core.StyleElem['write']};

/**
 * @param string
 * @param {function} callbackFn You can either use callback function that returns a string to control how 'Escape codes' getting conjugate with your text.
 * @example
 * reset("A simple text, having none of the styles, colors or backgrounds") 
*/
export const reset = styles.reset;
/**
 * @param string 
 * @param {function} callbackFn You can either use callback function that returns a string to control how 'Escape codes' getting conjugate with your text.
 * @example
 * bold("Makes your text bold!")
 */

export const bold = styles.bold;
/**
 * @param string 
 * @param {function} callbackFn You can either use callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * dim("This text is dimmed.")
 */
export const dim = styles.dim;

/**
 * @param string 
 * @param {function} callbackFn You can either use callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * italic("This text appears in italic if supported.")
 */
export const italic = styles.italic;

/**
 * @param string 
 * @param {function} callbackFn You can either use callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * underline("This text will be underlined.")
 */
export const underline = styles.underline;

/**
 * ⚠️ Note: Some ANSI escape codes (e.g. blinking) may not work as expected across all terminals due to differences in emulator support,
 * OS-level rendering, and user settings — test features before relying on them.
 * @param string 
 * @param {function} callbackFn You can either use callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * blink("This text should blink if supported!")
 */
export const blink = styles.blink;

/**
 * ⚠️ Note: Fast blink is rarely supported in modern terminals and may not display as expected. Test before using in production.
 * @param string 
 * @param {function} callbackFn You can either use callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * flashBlink("This text tries fast blinking!")
 */
export const flashBlink = styles.flashBlink;

/**
 * @param string 
 * @param {function} callbackFn You can either use callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * reverse("This inverts foreground and background colors.")
 */
export const reverse = styles.reverse;

/**
 * @param string 
 * @param {function} callbackFn You can either use callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * hidden("This text will be invisible (but still copyable).")
 */
export const hidden = styles.hidden;

/**
 * @param string 
 * @param {function} callbackFn You can either use callback function that returns a string to control how 'Escape codes' get conjugated with your text.
 * @example
 * strikethrough("This text has a line through it.")
 */
export const strikethrough = styles.strikethrough;


/************ Offers all functionalities in one-line chain ************/
const clx = new Core.IceBurg();
export default clx;
