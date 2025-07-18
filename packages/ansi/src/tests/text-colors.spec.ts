import { ClElem, CL, BrCL } from "../core.js";
import { ANSI_COLORS, CL_OFFSET, BR_CL_OFFSET } from "../shared/constants.js";
import { expect } from "chai";
import type { COLOR } from "../shared/types.js";

const cl = new CL(), brCl = new BrCL();

describe("Testing CL and BrCL!...", () => {
    it(`cl/brCl are not expected to have '.write()' method`, () => {
        //@ts-ignore
        expect(cl?.write?.('text').to.be.undefined); expect(brCl?.write?.('text').to.be.undefined)
    });
});

describe("Testing whether cl.<color> and brCl.<color> are working properly", () => {

    const foundClFG = (col: COLOR, isBright: boolean) => (isBright ? brCl[col] : cl[col]).inspectProps().FG;
    const expectedClFG = (index: number, isBright: boolean) => (isBright ? BR_CL_OFFSET : CL_OFFSET) + index;

    ANSI_COLORS.forEach((color, i) => {
        it(`cl.${color} and brCl.${color} should be an instance of 'ClElem'`, () => {
            expect(cl[color]).to.be.an.instanceof(ClElem);
            expect(brCl[color]).to.be.an.instanceof(ClElem)
        });

        it(`Does cl.${color} and brCl.${color} producing the correct ansi escape codes`, () => {


            expect(foundClFG(color, false)).to.equal(expectedClFG(i, false));
            expect(foundClFG(color, true)).to.equal(expectedClFG(i, true));

            expect(cl[color].write('text')).to.be.a.string;
            expect(brCl[color].write('text')).to.be.a.string;
            console.log(`✅ cl.${color}.write('text') produces ${cl[color].write(`This is a string in ${color} color`)}`);
            console.log(`✅ brCl.${color}.write('text') produces ${cl[color].write(`This is a string in bright ${color} color`)}`)
        })
    })
})