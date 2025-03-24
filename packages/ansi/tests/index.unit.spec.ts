import { cl,CL, brCl,BrCL, st,ST, green  } from "../src/index.ts";
import * as Core from '../src/core.ts'
import { describe, it } from "mocha";
import { expect } from "chai";
import { ANSI_COLORS } from "../src/shared/constants.ts";

// describe("Testing `cl` and `CL` functionalities!", ()=>{

//     it("Instance type checking of 'cl'/'CL' and 'brCl'/'BrCL' and 'st'/'ST'.", ()=>{
//         expect(cl).to.be.instanceof(Core.CL); // CL is explicitly been deeply tested in other test files.
//         expect(brCl).to.be.instanceof(Core.BrCL); // So, not need to test object chaining in this file.
//         expect(st).to.be.instanceof(Core.Style)

//         expect(CL).to.be.a('function');
//         expect(BrCL).to.be.a('function');
//         expect(ST).to.be.a('function');

//         expect(CL.length).to.equal(1);
//         expect(BrCL.length).to.equal(1);
//         expect(ST.length).to.equal(1);
//     });

    
//     ANSI_COLORS.forEach(color => {
//         it(`Testing CL("${color}"), BrCL("${color}")`, ()=>{
//             expect(CL(color)).to.be.a('function');
//             expect(BrCL(color)).to.be.a('function');
//             expect(CL(color).length).to.equal(1);
//             expect(BrCL(color).length).to.equal(1);
//         });
//         it(`Testing the return type behavior of CL("${color}")("text"), BrCL("${color}")("text") when passed with 'string' argument.`, ()=>{
//             expect(CL(color)('text')).to.be.a.string;
//             // expect(BrCL(color)('text')).to.be.a.string;

//             expect(CL(color)(()=>'text')).to.be.equal('text');
//             // expect(BrCL(color)(()=>'text')).to.be.equal('text');

//             console.log(`✅ CL(${color})("text") produces: ${CL(color)(`This text is in ${color} color.`)}`);
//             console.log(`✅ BrCL(${color})("text") produces: ${BrCL(color)(`This text is in bright ${color} color.`)}`);
//         });
//         it(`Testing behavior of CL("${color}")(${st.bold.red.write("CallbackFn")})`, ()=>{
            
//         })
//     })
// })

describe(`Testing 'green' fn `, ()=>{
    it("Checking the output of 'green' fn", ()=>{
        // const otpt = cl.green.write('This is a green text');
        // const g = cl.green.write;
        const otpt = CL('green')('This is a green text')
        expect(otpt).to.be.a.string;
        console.log(`# ${otpt}`)
    });

})