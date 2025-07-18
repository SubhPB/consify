import { expect } from "chai";
import { Style, StyleElem, StyleBr, BG, ClElem, BrBG, BgElem } from "../core.js";
import { ANSI_STYLES, ANSI_COLORS, BG_OFFSET, BR_BG_OFFSET, BR_CL_OFFSET, CL_OFFSET } from "../shared/constants.js";

const stElem = new StyleElem();
const style = new Style();

describe("Testing 'StyleElem'...", ()=>{
    
    it('stElem should have write method', ()=>{
        expect(stElem.write('text')).to.be.a.string;
    });

    it(`stElem should have 'br' attribute, as an instance of 'BrCL'`, ()=>{
        expect(stElem.br).to.be.an.instanceof(StyleBr);
    });

    it(`stElem should have 'bg' attribute, as an instance of BG`, ()=>{
        //Don't need to further test `BrBG`/`BG` because it is already been tested in another file
        expect(stElem.bg).to.be.an.instanceof(BG)
    });

    it(`stElem should have 'brBg' attribute, as an instance of BrBG`, ()=>{
        expect(stElem.brBg).to.be.an.instanceof(BrBG);
        expect(stElem.br.bg).to.be.an.instanceOf(BrBG);
    });

    it(`stElem[color], each sub-method should exist and an instance of 'ClElem'`,()=>{
        ANSI_COLORS.forEach(color=>{
            expect(stElem[color]).to.be.an.instanceof(ClElem);
        }); 
    });
});

describe("Testing Style...",()=>{
    it('Checking methods that should not be there e.g. underline.write is not a valid chain', ()=>{
        expect(style).has.not.have.own.property('write')
    });

    const expectedProps = (
        {ST,BG,FG}: ReturnType<typeof style.inspectProps>,
        {st, bg, brBg, cl, brCl} : {st?:typeof ANSI_STYLES[number], bg?:typeof ANSI_COLORS[number], brBg?:typeof bg, cl?: typeof bg, brCl?:typeof cl}
    ) => {
        if (st){
            const expectedST = ANSI_STYLES.indexOf(st);
            if (expectedST!==ST) throw new Error(`Invalid ST value, expected ${expectedST} but found ${ST}`)
        }
        if (bg){
            const expectedBG = ANSI_COLORS.indexOf(bg) + BG_OFFSET;
            if (expectedBG!==BG) throw new Error(`Invalid BG value, expected ${expectedBG} but found ${BG}`)
        };
        if (brBg){
            const expectedBG = ANSI_COLORS.indexOf(brBg) + BR_BG_OFFSET;
            if (expectedBG!==BG) throw new Error(`Invalid BrBG value, expected ${expectedBG} but found ${BG}`)
        };
        if (cl){
            const expectedFG = ANSI_COLORS.indexOf(cl) + CL_OFFSET;
            if (expectedFG!==FG) throw new Error(`Invalid FG<color> value. expected ${expectedFG} but found ${FG}`)
        };
        if (brCl){
            const expectedFG = ANSI_COLORS.indexOf(brCl) + BR_CL_OFFSET;
            if (expectedFG!==FG) throw new Error(`Invalid FG<bright-color> value. expected ${expectedFG} but found ${FG}`)
        };
        return true
    };
    const inspectAnsiCodes = (props:ReturnType<typeof style.inspectProps>) => {
        return Object.keys(props).map((key) => key+'-'+props[key]).join(', ')
    }

    ANSI_STYLES.forEach((st,stIndex) => {
        it(`Testing style methods and their underlying ANSI codes`, ()=>{
            expect(style[st]).to.be.an.instanceof(StyleElem);
            expect(style[st].inspectProps().ST).is.equal(stIndex);
            expect(expectedProps(style[st].inspectProps(), {st})).to.be.true;
            console.log(`✅ ${st}.write('text') produces (${inspectAnsiCodes(style[st].inspectProps())}) ${style[st].write(`This is a string with ${st} style`)}`)
        });

        console.log('\n');
        ANSI_COLORS.forEach((color,_colorIndex) => {
            it(`Testing (${st},${color}) [style+background]/[style+bright-background] and [style+color]/[style+bright-color]`, ()=>{
                //Test `color` as text color
                expect(style[st][color]).to.be.an.instanceof(ClElem);
                expect(expectedProps(style[st][color].inspectProps(), {st,cl:color})).to.be.true;
                console.log(`✅ ${st}.${color}.write('text') produces: (${inspectAnsiCodes(style[st][color].inspectProps())}) ${style[st][color].write(`This is a string with ${st} style in ${color} color`)}`);
                //Now as `bright-color`
                expect(style[st].br[color]).to.be.an.instanceof(ClElem);
                expect(expectedProps(style[st].br[color].inspectProps(), {st,brCl:color})).to.be.true;
                console.log(`✅ ${st}.br.${color}.write('text') produces: (${inspectAnsiCodes(style[st].br[color].inspectProps())}) ${style[st].br[color].write(`This is a string with ${st} style  bright-${color} color`)}`)
    
                //Test `color` as background color
                expect(style[st].bg[color]).to.be.an.instanceof(BgElem);
                expect(expectedProps(style[st].bg[color].inspectProps(), {st,bg:color})).to.be.true;
                console.log(`✅ ${st}.bg.${color}.write('text) produces (${inspectAnsiCodes(style[st].bg[color].inspectProps())}) ${style[st].bg[color].write(`This is a string with ${st} style in ${color} background`)}`);
                //Now as bright color
                expect(style[st].brBg[color]).to.be.an.instanceof(BgElem);
                expect(style[st].br.bg[color]).to.be.an.instanceof(BgElem);
                expect(expectedProps(style[st].brBg[color].inspectProps(),{st,brBg:color})).to.be.true;
                expect(expectedProps(style[st].br.bg[color].inspectProps(),{st,brBg:color})).to.be.true;
                console.log(`✅ ${st}.brBg.${color}.write('text') produces (${inspectAnsiCodes(style[st].brBg[color].inspectProps())}) ${style[st].brBg[color].write(`This is a string with ${st} style in bright-${color} background`)}`)
            });

            //Now let's test when style, bg/brBg, cl/brCl are used together
            ANSI_COLORS.forEach((color2,_color2Index) => {
                it(`Testing (${st},${color},${color2}) [style+(background/bright-background)+(color/bright-color)]`, ()=>{
                    expect(style[st].bg[color][color2]).to.be.an.instanceof(ClElem);
                    expect(style[st].bg[color].br[color2]).to.be.an.instanceof(ClElem);
                    expect(expectedProps(style[st].bg[color][color2].inspectProps(), {st,bg:color,cl:color2})).to.be.true;
                    expect(expectedProps(style[st].bg[color].br[color2].inspectProps(), {st,bg:color,brCl:color2})).to.be.true; 
                    console.log(`✅ ${st}.bg.${color}.${color2}.write('text') produces (${inspectAnsiCodes(style[st].bg[color][color2].inspectProps())}) ${style[st].bg[color][color2].write(`This is a string with ${st} style in ${color} background and in ${color2} color`)}`);
                    console.log(`✅ ${st}.bg.${color}.br.${color2}.write('text') produces (${inspectAnsiCodes(style[st].bg[color].br[color2].inspectProps())}) ${style[st].bg[color].br[color2].write(`This is a string with ${st} style in ${color} background and in bright-${color2} color`)}`);

                    expect(style[st].brBg[color][color2]).to.be.an.instanceOf(ClElem);
                    expect(style[st].brBg[color].br[color2]).to.be.an.instanceOf(ClElem);
                    expect(expectedProps(style[st].brBg[color][color2].inspectProps(), {st,brBg:color, cl:color2})).to.be.true;
                    expect(expectedProps(style[st].br.bg[color][color2].inspectProps(), {st,brBg:color, cl:color2})).to.be.true;
                    expect(expectedProps(style[st].br.bg[color].br[color2].inspectProps(), {st,brBg:color,brCl:color2})).to.be.true;
                    console.log(`✅ ${st}.brBg.${color}.${color2}.write('text') produces (${inspectAnsiCodes(style[st].brBg[color][color2].inspectProps())}) ${style[st].brBg[color][color2].write(`This is a string with ${st} style in bright-${color} background and in ${color2} color`)}`);
                    console.log(`✅ ${st}.brBg.${color}.br.${color2}.write('text') produces( ${inspectAnsiCodes(style[st].brBg[color].br[color2].inspectProps())}) ${style[st].brBg[color].br[color2].write(`This is a string with ${st} style in bright-${color} background and in bright-${color2} color`)}`);
                    
                })
            })
        });
    })
});
