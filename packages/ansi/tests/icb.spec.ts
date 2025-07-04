import { ClElem, IceBurg, IceBurgStyleElem, StyleBr, BG, BrBG, BgElem, BrCL } from "../src/core.ts";
import { expect } from "chai";
import { describe, it } from "mocha";
import { ANSI_STYLES, ANSI_COLORS, DEFAULT_ANSI_PARAMETERS, BG_OFFSET, BR_BG_OFFSET, BR_CL_OFFSET, CL_OFFSET } from "../src/shared/constants.ts";

const icb = new IceBurg();
const expectedProps = (
    {ST,BG,FG}: ReturnType<typeof icb.inspectProps>,
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

describe("Checking that 'icb' has methods which it supposed to have", ()=>{
    it("Testing instance and props of 'icb' ", ()=>{
        expect(icb).to.be.an.instanceof(IceBurg);
        const params = icb.inspectProps();
        
        (Object.keys(DEFAULT_ANSI_PARAMETERS) as Array<keyof typeof params>).forEach(param => {
            expect(params[param]).to.equal(undefined)
        });
    });
    it("Testing cl/brCl properties of 'icb'", ()=>{
        expect(icb.br).to.be.instanceof(StyleBr);
        ANSI_COLORS.forEach(cl => {
            expect(icb[cl]).to.be.instanceof(ClElem);
            expect(expectedProps(icb[cl].inspectProps(), {cl})).to.be.true;
            console.log(`✅ icb.${cl}.write("text") produces: ${icb[cl].write(`This is in ${cl} color`)}`)
        });
        ANSI_COLORS.forEach(brCl => {
            expect(icb.br[brCl]).to.be.instanceof(ClElem);
            expect(expectedProps(icb.br[brCl].inspectProps(), {brCl})).to.be.true;
            console.log(`✅ icb.br.${brCl}.write("text") produces: ${icb.br[brCl].write(`This is in bright-${brCl} color`)}`)
        });
    });
    it("Testing bg/brBg properties of 'icb'", ()=>{
        expect(icb.bg).to.be.instanceof(BG);
        expect(icb.br.bg).to.be.instanceof(BrBG);
        expect(icb.brBg).to.be.instanceOf(BrBG);
        ANSI_COLORS.forEach(bg =>{
            const brBg = bg;
            expect(icb.bg).to.be.instanceof(BG);
            expect(expectedProps(icb.bg[bg].inspectProps(), {bg})).to.be.true;
            expect(icb.bg[bg].write(({prefix,suffix}) => prefix+"text"+suffix)).to.be.string;

            expect(icb.br).to.be.instanceof(StyleBr);
            expect(icb.br.bg).to.be.instanceof(BrBG);
            expect(icb.brBg).to.be.instanceof(BrBG);
            expect(expectedProps(icb.brBg[brBg].inspectProps(), {brBg})).to.be.true;

            ANSI_COLORS.forEach(cl => {
                const brCl = cl;
                expect(icb.bg[bg][cl]).to.be.instanceof(ClElem);
                expect(expectedProps(icb.bg[bg][cl].inspectProps(), {bg,cl})).to.be.true;
                expect(expectedProps(icb.bg[bg].br[brCl].inspectProps(), {bg,brCl})).to.be.true;

                expect(expectedProps(icb.brBg[brBg][cl].inspectProps(), {brBg,cl})).to.be.true;
                expect(expectedProps(icb.br.bg[brBg][cl].inspectProps(), {brBg,cl})).to.be.true;
                expect(expectedProps(icb.brBg[brBg].br[brCl].inspectProps(), {brBg,brCl})).to.be.true;
                expect(expectedProps(icb.br.bg[brBg].br[brCl].inspectProps(), {brBg,brCl})).to.be.true;
            })
        })
    })
    it("Testing style properties of 'icb'", ()=>{
        ANSI_STYLES.forEach(st => {
            expect(icb[st]).to.be.instanceof(IceBurgStyleElem);
            expect(expectedProps(icb[st].inspectProps(), {st})).to.be.true;
            console.log(`✅ icb.${st}.write("text") produces: ${icb[st].write(`This uses ${st} style`)}`);
            console.log(`✅ icb.${st}.write( ()=>"text" ) produces: ${icb[st].write(({prefix,suffix,date}) => prefix + `Injecting ${st} style using callback fn` + suffix)}`)
        })
    });
    ANSI_STYLES.forEach(st => {
        it(`Testing deep chaining functionality of 'icb.${st}'`, ()=>{
            expect(icb[st].bg).to.be.instanceof(BG);
            expect(icb[st].br).to.be.instanceof(StyleBr);
            expect(icb[st].br.bg).to.be.instanceof(BrBG);
            expect(icb[st].brBg).to.be.instanceof(BrBG);

            ANSI_COLORS.forEach(bg => {
                const brBg = bg;
                expect(icb[st].bg[bg]).to.be.instanceof(BgElem);
                expect(icb[st].bg[bg].br).to.be.an.instanceof(BrCL);
                expect(expectedProps(icb[st].bg[bg].inspectProps(), {st,bg})).to.be.true;

                expect(icb[st].brBg[brBg]).to.be.instanceof(BgElem);
                expect(expectedProps(icb[st].brBg[brBg].inspectProps(), {st,brBg})).to.be.true;
                expect(icb[st].br.bg[brBg]).to.be.instanceof(BgElem);
                expect(expectedProps(icb[st].br.bg[brBg].inspectProps(), {st,brBg})).to.be.true;

                expect(icb[st].br.bg[brBg].br).to.be.an.instanceof(BrCL);
                
                ANSI_COLORS.forEach(cl => {
                    const brCl = cl;
                    expect(icb[st].bg[bg][cl]).to.be.instanceof(ClElem);
                    expect(expectedProps(icb[st].bg[bg][cl].inspectProps(), {st,bg,cl})).to.be.true;
                    expect(expectedProps(icb[st].bg[bg].br[brCl].inspectProps(), {st,bg,brCl})).to.be.true;

                    expect(expectedProps(icb[st].brBg[brBg][cl].inspectProps(), {st,brBg,cl})).to.be.true;
                    expect(expectedProps(icb[st].br.bg[brBg][cl].inspectProps(), {st,brBg,cl})).to.be.true;
                    expect(expectedProps(icb[st].brBg[brBg].br[brCl].inspectProps(), {st,brBg,brCl})).to.be.true;
                    expect(expectedProps(icb[st].br.bg[brBg].br[brCl].inspectProps(), {st,brBg,brCl})).to.be.true;
                })

            });
        })
    })
})


