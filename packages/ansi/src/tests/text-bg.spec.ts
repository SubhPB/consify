import { ClElem, BrCL, BgElem, BG, BrBG } from "../core.js";
import { expect } from "chai";
import { ANSI_COLORS, BG_OFFSET, BR_BG_OFFSET, CL_OFFSET, BR_CL_OFFSET, DEFAULT_ANSI_PARAMETERS} from "../shared/constants.js";
import type { COLOR } from "../shared/types.js";

const bgElem = new BgElem(), bg = new BG(), brBg = new BrBG();

describe("Testing 'BgElem'...", ()=>{
    it('bgElem should have write method', ()=>{
        expect(bgElem.write('text')).to.be.a.string;
    });
    it(`bgElem should have 'br' attribute, as an instance of 'BrCL'`, ()=>{
        expect(bgElem.br).to.be.an.instanceof(BrCL);
    })
    /**Do not deeply test the br and its all sub methods,
     * because that is already been tested by tests defined in `text-colors`
     */
    it(`bgElem[color], each sub-method should exist and an instance of 'ClElem'`,()=>{
        ANSI_COLORS.forEach(color=>{
            expect(bgElem[color]).to.be.an.instanceof(ClElem)
        });
    })
});


describe("Testing 'BG' and 'BrBG'...", ()=>{

    it("bg and brBg should not have 'write' method", ()=>{
        expect(bg).has.not.have.own.property('write');
        expect(brBg).has.not.have.own.property('write');
    })

    const foundBG = (bgColor:COLOR, isBright:boolean) => (isBright ? brBg[bgColor] : bg[bgColor]).inspectProps().BG;
    const expectedBG = (colIndex:number, isBright:boolean) => (isBright ? BR_BG_OFFSET : BG_OFFSET) + colIndex;


    ANSI_COLORS.forEach((bgColor,bgColIndex)=>{
        it(`Testing whether bg[${bgColor}] working as expected`, ()=> {
            expect(bg[bgColor]).to.be.instanceof(BgElem);
            expect(brBg[bgColor]).to.be.instanceof(BgElem);
            
            expect(foundBG(bgColor,false)).to.equal(expectedBG(bgColIndex,false));
            expect(foundBG(bgColor,true)).to.equal(expectedBG(bgColIndex,true));
    
            expect(bg[bgColor].write('text')).to.be.a.string;
            expect(brBg[bgColor].write('text')).to.be.a.string;
            console.log(`✅ bg.${bgColor}.write('text') produces ${bg[bgColor].write(`This is a string with ${bgColor} background`)}`);
            console.log(`✅ brBg.${bgColor}.write('text') produces ${brBg[bgColor].write(`This is a string with bright ${bgColor} background`)}`);
    
            expect(bg[bgColor].br).to.be.an.instanceof(BrCL);
            expect(brBg[bgColor].br).to.be.an.instanceof(BrCL);
            expect(bg[bgColor].br).has.not.have.own.property('write');
            expect(brBg[bgColor].br).has.not.have.own.property('write');
        })

        ANSI_COLORS.forEach((textColor, textColIndex) => {
            it(`Testing whether bg[${bgColor}][${textColor}] and brBg[${bgColor}][${textColor}] working as expected`, ()=>{
                expect(bg[bgColor][textColor]).to.be.an.instanceof(ClElem);
                expect(brBg[bgColor][textColor]).to.be.an.instanceof(ClElem);
    
                expect(bg[bgColor][textColor].write('text')).to.be.a.string;
                expect(brBg[bgColor][textColor].write('text')).to.be.a.string;
                console.log(`✅ bg.${bgColor}.${textColor}.write('text') produces ${bg[bgColor][textColor].write(`This is a string in ${textColor} with ${bgColor} background`)}`);
                console.log(`✅ brBg.${bgColor}.${textColor}.write('text') produces ${brBg[bgColor][textColor].write(`This is a string in ${textColor} with bright ${bgColor} background`)}`);
    
                /**Testing whether it producing right ANSI code arguments
                 * Regular background with regular text color
                 */
                const bgWithTextColorProps = bg[bgColor][textColor].inspectProps();
                expect(bgWithTextColorProps.BG).is.equal(BG_OFFSET+bgColIndex);
                expect(bgWithTextColorProps.FG).is.equal(CL_OFFSET+textColIndex);
                expect(bgWithTextColorProps.ST).equal(undefined);
                
                /**bright background but regular text color */
                const brBgWithTextColorProps = brBg[bgColor][textColor].inspectProps();
                expect(brBgWithTextColorProps.BG).is.equal(BR_BG_OFFSET+bgColIndex);
                expect(brBgWithTextColorProps.FG).is.equal(CL_OFFSET+textColIndex);
                expect(bgWithTextColorProps.ST).equal(undefined);
    
                /**
                 * Testing whether both BG classes working as expected for brightColors
                 */
    
                expect(bg[bgColor].br[textColor]).to.be.an.instanceof(ClElem);
                expect(brBg[bgColor].br[textColor]).to.be.an.instanceof(ClElem)
    
                /**Regular background with bright text-color */
                const bgWithBrightTextColorProps = bg[bgColor].br[textColor].inspectProps();
                expect(bgWithBrightTextColorProps.BG).is.equal(BG_OFFSET+bgColIndex);
                expect(bgWithBrightTextColorProps.FG).is.equal(BR_CL_OFFSET+textColIndex);
                expect(bgWithBrightTextColorProps.ST).is.equal(undefined)
    
                /**Bright background and bright text-color */
                const brBgWithBrightTextColorProps = brBg[bgColor].br[textColor].inspectProps();
                expect(brBgWithBrightTextColorProps.BG).is.equal(BR_BG_OFFSET+bgColIndex);
                expect(brBgWithBrightTextColorProps.FG).to.equal(BR_CL_OFFSET+textColIndex);
    
                expect(bg[bgColor].br[textColor].write('text')).to.be.a.string;
                expect(brBg[bgColor].br[textColor].write('text')).to.be.a.string;
                console.log(`✅ bg.${bgColor}.br.${textColor}.write('text') produces ${bg[bgColor].br[textColor].write(`This is a string in bright ${textColor} with bright ${bgColor} background`)}`);
                console.log(`✅ brBg.${bgColor}.br.${textColor}.write('text') produces ${brBg[bgColor].br[textColor].write(`This is a string in bright ${textColor} with bright ${bgColor} background`)}`);
            })
        })
    })
})