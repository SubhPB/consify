import * as Core from './core.ts';
import { ANSI_COLORS, ANSI_STYLES } from './shared/constants.ts';
import type { COLOR, STYLE } from './shared/types.ts';


/**
 * Use to define text color in a chain manner.
 * @example
 * cl.red.write("This text will be in red color")
 * cl.yellow.write("This text will be in yellow color") 
 * cl.<color>.write("This text will be colored")
 * @throws {Error} If you try to break the chain somewhere, 'this' will lost its original context. e.g.
 * @example
 * const write = cl.red.write;❌ //Broke chain
 * write("This will throw an error!")
 * const write = cl.red.write.bind(cl) ✅ //This is how you can fix it, But not recommended!
 */
export const cl = new Core.CL();
/**
 * 
 * @param color provide 'color' you want to use as text color
 * @example
 * CL("red")("This text will be in red color")
 */
export function CL(color:COLOR): Core.ClElem['write'] { 
    const ansiColor = color?.toLowerCase()?.trim() as COLOR;
    const clElem = (
        ansiColor&&ANSI_COLORS.includes(ansiColor)
    ) ? cl[ansiColor] : new Core.ClElem();
    return clElem.write.bind(clElem);
};
const colors = Object.fromEntries(
    ANSI_COLORS.map(color => [color, cl[color].write.bind(cl)])
) as {[key in COLOR]: Core.ClElem['write']};
export const {
    black,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    white
} = colors;

/**
 * Use to define text bright-color in a chain manner.
 * @example
 * brCl.red.write("This text will be in bright red color")
 * brCl.yellow.write("This text will be in bright yellow color") 
 * brCl.<color>.write("This text will be bright colored")
 * @throws {Error} If you try to break the chain somewhere, 'this' will lost its original context. e.g.
 * @example 
 * const write = brCl.red.write; ❌ //Broke chain
 * write("This will throw an error!")
 * const write = brCl.red.write.bind(brCl) ✅ //This is how you can fix it, But not recommended!
 */
export const brCl = new Core.BrCL();
/**
 * 
 * @param color provide 'color' you want to use as bright color of text
 * @example
 * BrCL("red")("This text will be in red color")
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
export const {blackBr, redBr, greenBr, yellowBr, blueBr, magentaBr, cyanBr, whiteBr} = brightColors;

/**
 * Use to define text background and color in single line of code.
 * Also supports bright text colors, but not bright background.
 * @example 
 * bg.red.write("This text will have red background");
 * bg.red.blue.write("This text will be in blue color having red background");
 * bg.red.br.blue.write("This text will be bright blue having red background");
 * @throws {Error} If you try to break the chain somewhere, 'this' will lost its original context. e.g.
 * @example 
 * const write = bg.red.write; ❌ //Broke chain
 * write("This will throw an error!")
 * const write = bg.red.write.bind(bg) ✅ //This is how you can fix it, But not recommended!
 */
export const bg = new Core.BG(); //Object `bg` if user wants to use bg-chaining for more control and readability
/**
 * 
 * @param bgColor provide 'color' you want to use as background
 * @example
 * BG("red")("This text will have red background")
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
export const {blackBG, redBG, greenBG, yellowBG, blueBG, magentaBG, cyanBG, whiteBG} = bgColors;

/**
 * Use to define bright text background and color in single line of code.
 * Also supports bright text colors, but use only when want bright backgrounds.
 * @example 
 * brBg.red.write("This text will have bright red background");
 * brBg.red.blue.write("This text will be in blue color having bright red background");
 * brBg.red.br.blue.write("This text will be bright blue having bright red background");
 * @throws {Error} If you try to break the chain somewhere, 'this' will lost its original context. e.g.
 * @example 
 * const write = brBg.red.write; ❌ //Broke chain
 * write("This will throw an error!");
 * const write = brBg.red.write.bind(brBg) ✅ //This is how you can fix it, But not recommended!
 */
export const brBg = new Core.BrBG();
/**
 * 
 * @param bgColor provide 'color' you want to use as bright background
 * @example
 * BrBG("red")("This text will have bright red background")
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
export const {blackBrBG, redBrBG, greenBrBG, yellowBrBG, blueBrBG, magentaBrBG, cyanBrBG, whiteBrBG} = brightBgColors;

/**
 * Use to define text style, background and color in single line of code, even the bright ones. 
 * @remarks Worth to know mechanism of chaining, Style -> (BG/BrBG) -> (CL/BrCL) -> write("The final product")
 * @example 
 * st.underline.write("This text will be underlined"); // only style
 * st.bold.write("This will make this text bold"); // only style
 * st.bold.red.write("This text will be bold and red in color") // style + cl
 * st.bold.bg.red.write("This text will be bold and have a red background"); // style + bg
 * st.bold.brBg.red.write("This text will be bold and have a bright red background") // style + brBg
 * st.bold.br.bg.red.write("This text will also be bold and have a bright red background") // Same as above
 * st.bold.bg.red.blue.write("This text will be bold, in red background and have blue text-color") // style + bg + text-color
 * st.bold.bg.red.br.blue.write("This text will be bold, in red background and have a bright blue text-color") // style + bg + brCl
 * ... more
 * @remarks Be advised to use 'bind' if need to break chaining somewhere, although not recommended to maintain consistency.
 * @example
 * const italicWrite = st.italic.write ❌ //Broke chain without binding context will cause error
 * const italicWrite = st.italic.write.bind(st) ✅ //This is how you can fix it, But not recommended!
 */
export const st = new Core.Style(); 
/**
 * 
 * @param style provide 'style' you want to see in your text.
 * @example
 * ST("italic")("This text will use italic style")
 */
export function ST(style:STYLE):Core.StyleElem['write']{ //Fn `ST` just in case if to be used as ST('underline')("This is a underlined text")
    const ansiStyle = style?.toLowerCase()?.trim() as STYLE;
    const styleElem = (
        ansiStyle&&ANSI_STYLES.includes(ansiStyle)
    ) ? st[ansiStyle] : new Core.StyleElem();
    return styleElem.write.bind(styleElem);
};
const styles = Object.fromEntries(
    ANSI_STYLES.map(style => [style, st[style].write.bind(st)])
) as {[key in STYLE]: Core.StyleElem['write']};
export const {reset, bold, dim, italic, underline, blink, flashBlink, reverse, hidden, strikethrough} = styles;

/************ Offers all functionalities in one-line chain ************/
const clx = new Core.IceBurg();
export default clx;
