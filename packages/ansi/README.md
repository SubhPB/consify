## @consify/ansi: ``Let your console speak clearly``

***_`@consify/ansi`_*** helps you style text in the terminal using colors, backgrounds, and text effects — with no extra dependencies. It's built for developers who want an easy and readable way to add custom output to CLI tools or scripts.
- 📦 Zero dependencies — install-and-go (***`npm install @consify/ansi`***)
- 🎨 Full ANSI styling — colors, styles, bright & background
- 🔗 Chainable, readable API — self-explanatory APIS

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## ✨ Features
- 🎨 Style text with bold, italic, underline, and more
- 🌈 Apply colors — including bright foreground variants
- 🖍️ Set backgrounds — with bright background support
- 🔗 Chain styles, colors, and backgrounds seamlessly in single self-explanatory line
- 🧠 Use intuitive functions for simple cases or compose complex styles fluently

## 📘 API Reference & Usage
_`@consify/ansi`_ provides a multiple set of APIs designed to control the foreground color, background color, and text style in terminal output. These APIs are organized into three intuitive categories to suit different levels of usage:
- **Single-Step Style APIs** — instantly apply a specific style like bold, underline, red, etc.
- **Curried Style APIs** — user-driven functions that generate customized text stylers at runtime, allowing flexible styling based on input.
- **Chainable Styling Interface** — the full-power API for combining multiple styles, colors, and backgrounds fluently.

|| Single-Step Style APIs | Curried Style APIs | Chainable Styling Interface | e.g.
|------------------------|------------------------|--------------------|-----------------------------|-----------------------------|
|  ***Foreground***            |`black`,`red`,`green`,`yellow`,<br>`blue`,`magenta`,`cyan`,`white`<br><br>`blackBr`,`redBr`,`greenBr`,`yellowBr`,<br>`blueBr`,`magentaBr`,`cyanBr`,`whiteBr`                        |`CL`,`BrCL`                    |`cl`,`brCl`                             |`red("This text is red.")`,<br>`redBr("This text is bright red.")`,<br><br>`CL("red")("This text is red.")`,<br>`BrCL("red")("Bright red text")`,<br><br>`cl.yellow.write("Yellow text")`,<br>`brCl.yellow.write("Bright yellow text")`|
|  ***Background***            |`blackBG`,`redBG`,`greenBG`,`yellowBG`,<br>`blueBG`,`magentaBG`,`cyanBG`,`whiteBG`<br><br>`blackBrBG`,`redBrBG`,`greenBrBG`,`yellowBrBG`,<br>`blueBrBG`,`magentaBrBG`,`cyanBrBG`,`whiteBrBG`                        |`BG`,`BrBG`                    |`bg`,`brBg`                             |`yellowBG("This text has a yellow background.")`<br>`cyanBrBG("Text has bright cyan background.")`<br><br>`BG("red")("Text with red background")`<br>`BrBG("magenta")("Text with bright magenta background")`<br><br>`bg.red.blue.write("Blue text on red background")`<br>`brBg.red.write("Bright red background")`|
|  ***Style***                 |`reset`,`bold`,`dim`,`italic`,<br>`underline`,`blink`,`flashBlink`,`reverse`,<br>`hidden`,`strikethrough`                        |`ST`                    |`st`                             |`underline("This text will be underlined.")`<br><br>`ST("italic")("This will be italicized")`<br><br>`st.bold.write("Bold text")`<br>`st.bold.bg.red.write("Bold+red background")`|

#### `⚠️ BE ADVISED!` Some text styles `(like blink or hidden etc)` and certain color combinations might not display correctly in all terminal programs. `This behavior depends on the terminal you use`, not on the package itself. Your terminal-type could be a reason, If you see any feature not working as expected.

Need more powerful feature? This is where things get powerful. ***`clx`*** gives you full styling control in just three letters.

#### ⚡Everything this package can do, distilled into one tiny API: ***`clx`***.

***`clx`*** is the core of the package — a tiny, 3-letter API that gives you full ANSI styling power in one place. Easily combine colors, backgrounds, and text styles in a single, chainable call. No nesting, no complexity — just clean, readable styling.
- ✅ One entrypoint, unlimited combinations — `clx.underline.br.bg.yellow.cyan.write("Underlined + bright yellow background + cyan text color")`
- 🧠 Simple, flexible, lets you express any style in a clear flow

```js
import clx from "@consify/ansi" //Most deep chainable API

clx.red.write("This text is red.");
clx.bg.green.write("This text has a green background.");
clx.brBg.green.write("This text has a bright green background.");
clx.bold.red.write("This text is bold and red.");
clx.bold.bg.red.br.yellow.write("This text is bold, has red background and bright yellow color.");
clx.bold.bg.yellow.blue.write("Bold text with yellow background and blue foreground.");
clx.bold.br.bg.yellow.br.blue.write("Bold text with bright yellow background and bright blue foreground.");

// Use 'log' instead 'console.log' at the end if need.
clx.bg.green.log("This text has a green background.");
```

#### `⚠️ CORE RULE!`  Every chainable API is built on the order `Style` → `Background` → `Foreground` — respect this to keep your styles consistent.

         
Like any system, knowing the shorthand makes you faster. This table explains the key abbreviations behind `@consify/ansi`’s API.

| Shorthand | Meaning |  |  Shorthand | Meaning |
|--------|--------|--------|--------|--------|
|***`br`*** |`bright` |         |***`st`*** |`style`|
|***`bg`*** |`background` |         |***`cl`*** |`color` |
|***`br.bg`*** / ***`brBg`*** |`bright background` |         |***`brCl`*** |`bright color` |

## 🙌 Contributors & Resources
![a](https://img.shields.io/badge/author_%3A-white?style=for-the-badge) [![info](https://img.shields.io/badge/byimaan_%2F_subhpb-%237D44E9?style=for-the-badge&logo=git&logoColor=white)](https://github.com/SubhPB?question=can_you_hear_the_music)

![b](https://img.shields.io/badge/code_source_%3A-white?style=for-the-badge) [![info](https://img.shields.io/badge/git_repository-%237D44E9?style=for-the-badge&logo=git&logoColor=white)](https://github.com/SubhPB/consify/tree/main/packages/ansi)

## 💖 Appreciate You Being Here
If you’ve made it this far — thank you!
If you’ve tried `@consify/ansi` and found it useful, we’d truly appreciate your support. ['⭐'](https://github.com/SubhPB/consify) A GitHub star means a lot for us.


