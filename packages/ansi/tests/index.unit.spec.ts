import { ANSI_COLORS, ANSI_STYLES } from "../src/shared/constants.ts";
import { expect } from "chai";
import { describe } from "mocha";
import { CL, BrCL, BG, BrBG, ST} from "../src/index.ts";

describe(`Testing 'CL'/'BrCL' fn`, ()=>{
    ANSI_COLORS.forEach(cl => {
        it(`Testing CL("${cl}")`, ()=>{
            expect(CL(cl)('text')).to.be.string;
            expect(CL(cl)(()=>'text')).to.be.string;
            console.log(`✅ CL("${cl}")("text") produces: ${CL(cl)(`This is in ${cl} color`)}`);
            console.log(`✅ CL("${cl}")(()=>"text") produces: ${CL(cl)(({prefix,suffix})=>prefix+`Injecting ${cl} color by callbackFn`+suffix)}`)
        })
    });
    ANSI_COLORS.forEach(brCl => {
        it(`Testing BrCL("${brCl}")`, ()=>{
            expect(BrCL(brCl)('text')).to.be.string;
            expect(BrCL(brCl)(()=>'text')).to.be.string;
            console.log(`✅ BrCL("${brCl}")("text") produces: ${BrCL(brCl)(`This is in bright-${brCl} color`)}`);
            console.log(`✅ BrCL("${brCl}")(()=>"text") produces: ${BrCL(brCl)(({prefix,suffix})=>prefix+`Injecting bright-${brCl} color by callbackFn`+suffix)}`)
        })
    })
});

describe(`Testing 'BG'/'BrBG' fn`, ()=>{
    ANSI_COLORS.forEach(bg => {
        it(`Testing BG("${bg}")`, ()=>{
            expect(BG(bg)('text')).to.be.string;
            expect(BG(bg)(()=>'text')).to.be.string;
            console.log(`✅ BG("${bg}")("text") produces: ${BG(bg)(`This is in ${bg} background color`)}`);
            console.log(`✅ BG("${bg}")(()=>"text") produces: ${BG(bg)(({prefix,suffix})=>prefix+`Injecting ${bg} background color by callbackFn`+suffix)}`)
        })
    });
    ANSI_COLORS.forEach(brBg => {
        it(`Testing BrBG("${brBg}")`, ()=>{
            expect(BrBG(brBg)('text')).to.be.string;
            expect(BrBG(brBg)(()=>'text')).to.be.string;
            console.log(`✅ BrBG("${brBg}")("text") produces: ${BrBG(brBg)(`This is in bright-${brBg} background color`)}`);
            console.log(`✅ BrBG("${brBg}")(()=>"text") produces: ${BrBG(brBg)(({prefix,suffix})=>prefix+`Injecting bright-${brBg} background color by callbackFn`+suffix)}`)
        })
    })
});

describe(`Testing 'ST' fn`, ()=>{
    ANSI_STYLES.forEach(st =>{
        it(`Testing ST("${st}")`, ()=>{
            expect(ST(st)('text')).to.be.string;
            expect(ST(st)(()=>'text')).to.be.string;
            console.log(`✅ ST("${st}")("text") produces: ${ST(st)(`This uses ${st} style`)}`);
            console.log(`✅ ST("${st}")(() => "text") produces: ${ST(st)(({prefix,suffix})=>prefix+`Injecting ${st} style by callbackFn`+suffix)}`)
            const str = ST('italic')(CL('red')(`Hello! ${ST('underline')('This is mixed case (Blink+underline)')}`))
            console.log(`✅ ${str}`)
        })
    })
})