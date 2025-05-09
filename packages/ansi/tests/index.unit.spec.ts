import { ANSI_COLORS, ANSI_STYLES } from "../src/shared/constants.ts";
import { expect } from "chai";
import { describe } from "mocha";
import * as Index from '../src/index.ts';
import { BG, BgElem, BrBG, ClElem, IceBurg, IceBurgStyleElem, StyleElem } from "../src/core.ts";

/**
 * Tests:- cl, CL, red, black, green, ... white.
 */
const TestColorsFG = () => {
  describe(`Testing chaining of 'cl'.`, ()=>{
    const {cl} = Index;
    /** 'cl' is instance of Core.CL, which is deeply tested in other test-files, So just an overall test in here!*/
    ANSI_COLORS.forEach(
      color => {
        it(`Check cl.${color} and cl.${color}.write('text')`, ()=>{
          const input = `This text is in ${color} color`
          const output = cl[color].write(input);
          const callbackFnOutput = cl[color].write(({prefix, suffix})=>{
            return prefix + input + suffix
          });
          [output,callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
          console.log(`✅ cl.${color}.write("text") produces: ${output}`);
          console.log(`✅ cl.${color}.write(()=>"text") produces: ${callbackFnOutput}`);
        })
      }
    )
  });
  describe(`Testing CL(<color>)("text") functionality`, ()=>{
    const {CL} = Index;
    ANSI_COLORS.forEach(
      color => {
        it(`Check CL(${color}) / CL(${color})("text")`, ()=>{
          const input = `This text is in ${color} color`;
          const output = CL(color)(input);
          const callbackFnOutput = CL(color)(
            ({prefix,suffix}) => prefix+input+suffix
          );
          [output,callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
          console.log(`✅ CL(${color})("text") produces: ${output}`);
          console.log(`✅ CL(${color})(()=>"text") produces: ${callbackFnOutput}`);
        })
      }
    );
    it(`Check behavior upon invalid <color> param`, ()=>{
      const input = `This should not be in red color`;
      const outputOfInvalid = CL(" YI0" as any)(input), outputOfInvalid2 = CL(" YI0" as any)(({prefix,suffix})=>prefix+input+suffix)
      const correctOutput = CL('red')(input), correctOutput2 = CL("ReD   " as any)(input);
      expect(outputOfInvalid===outputOfInvalid2).to.be.true;
      expect(correctOutput===correctOutput2).to.be.true;
      console.log(`✅ CL("Invalid")("text") produces: ${outputOfInvalid}`);
      console.log(`✅ cl("Invalid)(()=>"text") produces: ${outputOfInvalid2}`);
    })
  });
  describe(`Testing functionality of e.g. black, red, green ...more`, ()=>{
    ANSI_COLORS.forEach(
      color => {
        it(`Check fn ${color}`, ()=>{
          const input = `This text is in ${color} color`
          const output = Index[color](input);
          const callbackFnOutput = Index[color](({prefix, suffix})=>{
            return prefix + input + suffix
          });
          [output,callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
          console.log(`✅ ${color}("text") produces: ${output}`);
          console.log(`✅ ${color}(()=>"text") produces: ${callbackFnOutput}`);
        })
      }
    )
  });
};

/**
 * Tests:- brCl, BrCL, blackBr, redBr, greenBr ...more
 */
const TestBrColorsFG = () => {

  describe(`Testing chaining of 'brCl'.`, ()=>{
    const {brCl} = Index;
    ANSI_COLORS.forEach(
      color => {
        it(`Check brCl.${color} and brCl.${color}.write('text')`, ()=>{
          const input = `This text is in bright ${color} color`
          const output = brCl[color].write(input);
          const callbackFnOutput = brCl[color].write(({prefix, suffix})=>{
            return prefix + input + suffix
          });
          [output,callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
          console.log(`✅ brCl.${color}.write("text") produces: ${output}`);
          console.log(`✅ brCl.${color}.write(()=>"text") produces: ${callbackFnOutput}`);
        })
      }
    );
  });
  describe(`Testing BrCL(<color>)("text") functionality`, ()=>{
    const {BrCL} = Index;
    ANSI_COLORS.forEach(
      color => {
        it(`Check BrCL(${color}) / BrCL(${color})("text")`, ()=>{
          const input = `This text is in bright ${color} color`;
          const output = BrCL(color)(input);
          const callbackFnOutput = BrCL(color)(
            ({prefix,suffix}) => prefix+input+suffix
          );
          [output,callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
          console.log(`✅ BrCL(${color})("text") produces: ${output}`);
          console.log(`✅ BrCL(${color})(()=>"text") produces: ${callbackFnOutput}`);
        })
      }
    );
    it(`Check behavior upon invalid <color> param`, ()=>{
      const input = `This should not be in red color`;
      const outputOfInvalid = BrCL(" YI0" as any)(input), outputOfInvalid2 = BrCL(" YI0" as any)(({prefix,suffix})=>prefix+input+suffix)
      const correctOutput = BrCL('red')(input), correctOutput2 = BrCL("ReD   " as any)(input);
      expect(outputOfInvalid===outputOfInvalid2).to.be.true;
      expect(correctOutput===correctOutput2).to.be.true;
      console.log(`✅ BrCL("Invalid")("text") produces: ${outputOfInvalid}`);
      console.log(`✅ BrCL("Invalid)(()=>"text") produces: ${outputOfInvalid2}`);
    })
  });
  describe(`Testing functionality of e.g. black, red, green ...more`, ()=>{
    
    ANSI_COLORS.forEach(
      color => {
        const colorBr = `${color}Br`
        it(`Check fn ${color}Br`, ()=>{
          const input = `This text is in bright ${color} color`
          const output = Index[colorBr](input);
          const callbackFnOutput = Index[colorBr](({prefix, suffix})=>{
            return prefix + input + suffix
          });
          [output,callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
          console.log(`✅ ${color}Br("text") produces: ${output}`);
          console.log(`✅ ${color}Br(()=>"text") produces: ${callbackFnOutput}`);
        })
      }
    )
  });
};

/**
 * Tests:- bg, BG, blackBG, redBG ...more
 */
const TestBgColorBG = () => {
  describe(`Testing chaining of 'bg'`, ()=>{
    const {bg} = Index;
    ANSI_COLORS.forEach(
      bgColor => {
        it(`Check bg.${bgColor} and bg.${bgColor}.write('text')`, ()=>{
          const input = `This text has ${bgColor} background color`;
          const output = bg[bgColor].write(input);
          const callbackFnOutput = bg[bgColor].write(({prefix, suffix}) => prefix+input+suffix);
          [output,callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
          console.log(`✅ bg.${bgColor}.write("text") produces: ${output}`);
          console.log(`✅ bg.${bgColor}.write(()=>"text") produces: ${callbackFnOutput}`);
        })
      }
    )
  });

  describe(`Testing BG(<color>)("text") functionality`, ()=>{
    const {BG} = Index;
    ANSI_COLORS.forEach(
      bgColor => {
        it(`Check BG(${bgColor}) / BG(${bgColor})("text")`, ()=>{
          const input = `This text has ${bgColor} background color`;
          const output = BG(bgColor)(input);
          const callbackFnOutput = BG(bgColor)(
            ({prefix,suffix}) => prefix+input+suffix
          );
          [output,callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
          console.log(`✅ BG(${bgColor})("text") produces: ${output}`);
          console.log(`✅ BG(${bgColor})(()=>"text") produces: ${callbackFnOutput}`);
        });
      }
    );

    it(`Check behavior upon invalid <color> param`, ()=>{
      const input = `This should not have red background`;
      const outputOfInvalid = BG(" YI0" as any)(input), outputOfInvalid2 = BG(" YI0" as any)(({prefix,suffix})=>prefix+input+suffix)
      const correctOutput = BG('red')(input), correctOutput2 = BG("ReD   " as any)(input);
      expect(outputOfInvalid===outputOfInvalid2).to.be.true;
      expect(correctOutput===correctOutput2).to.be.true;
      console.log(`✅ BG("Invalid")("text") produces: ${outputOfInvalid}`);
      console.log(`✅ BG("Invalid)(()=>"text") produces: ${outputOfInvalid2}`);
    })
  });

  describe(`Testing functionality of e.g blackBG, redBG, greenBG ...more`, ()=>{
    ANSI_COLORS.forEach(
      color => {
        const bgColor = `${color}BG`;
        it(`Check fn ${bgColor}`, ()=>{
          const input = `This text has ${bgColor} background color`
          const output = Index[bgColor](input);
          const callbackFnOutput = Index[bgColor](({prefix, suffix})=>{
            return prefix + input + suffix
          });
          [output,callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
          console.log(`✅ ${bgColor}("text") produces: ${output}`);
          console.log(`✅ ${bgColor}(()=>"text") produces: ${callbackFnOutput}`);
        })
      }
    )
  });
};

/**
 * Tests:- brBg, BrBG, blackBrBG, redBrBG, greenBrBG ...more
 */
const TestBrBgColorBG = () => {
  describe(`Testing chaining of brBg`, ()=>{
    const {brBg} =  Index;
    ANSI_COLORS.forEach(
      bgColor => {
        it(`Check brBg.${bgColor} and bg.${bgColor}.write("text")`, ()=>{
          const input = `This text has bright-${bgColor} background color`;
          const output = brBg[bgColor].write(input);
          const callbackFnOutput = brBg[bgColor].write(
            ({prefix, suffix}) => prefix+input+suffix
          );
          [output,callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
          console.log(`✅ brBg.${bgColor}.write("text") produces: ${output}`);
          console.log(`✅ brBg.${bgColor}.write(()=>"text") produces: ${callbackFnOutput}`);
        })
      }
    )
  });
  describe(`Testing BrBG(<color>)("text") functionality`, ()=>{
    const {BrBG} = Index;
    ANSI_COLORS.forEach(bgColor => {
      it(`Check BrBG(${bgColor})("text")`, ()=>{
        const input = `This text has bright-${bgColor} background color.`;
        const output = BrBG(bgColor)(input);
        const callbackFnOutput = BrBG(bgColor)(
          ({prefix,suffix}) => prefix+input+suffix
        );
      [output,callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
        console.log(`✅ BrBG(${bgColor})("text") produces: ${output}`);
        console.log(`✅ BrBG(${bgColor})(() => "text") produces: ${callbackFnOutput}`);
      })
    });
    it(`Check behavior upon invalid <color> param`, ()=>{
      const input = `This should not have bright-red background`;
      const outputOfInvalid = BrBG(" YI0" as any)(input), outputOfInvalid2 = BrBG(" YI0" as any)(({prefix,suffix})=>prefix+input+suffix)
      const correctOutput = BrBG('red')(input), correctOutput2 = BrBG("ReD   " as any)(input);
      expect(outputOfInvalid===outputOfInvalid2).to.be.true;
      expect(correctOutput===correctOutput2).to.be.true;
      console.log(`✅ BrBG("Invalid")("text") produces: ${outputOfInvalid}`);
      console.log(`✅ BrBG("Invalid)(()=>"text") produces: ${outputOfInvalid2}`);
    })
  });
  describe(`Testing functionality of e.g. blackBrBG, redBrBG, greenBrBG ...more`, ()=>{
    ANSI_COLORS.forEach(bgColor => {
      const brBgColor = `${bgColor}BrBG`;
      it(`Check fn ${brBgColor}`, ()=>{
        const input = `This text has bright-${bgColor} background color.`;
        const output = Index[brBgColor](input);
        const callbackFnOutput = Index[brBgColor](({prefix, suffix})=>{
          return prefix + input + suffix
        });
        [output,callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
        console.log(`✅ ${brBgColor}("text") produces: ${output}`);
        console.log(`✅ ${brBgColor}(()=>"text") produces: ${callbackFnOutput}`)
      })
    })
  })
};

/**
 * Tests:- st, ST, reset, underline, italic ...more
 */
const TestST = () => {
  describe(`Testing chaining of 'st'`, ()=>{
    const {st} = Index;
    ANSI_STYLES.forEach(
      style => {
        it(`Check st.${style}.write("text")`, ()=>{
          const input = `This text uses ${style} style`;
          const output = st[style].write(input);
          const callbackFnOutput = st[style].write(
            ({prefix, suffix})=> prefix+input+suffix
          );
          [output, callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
          console.log(`✅ st.${style}.write("text") produces: ${output}`);
          console.log(`✅ st.${style}.write(() => "text") produces: ${callbackFnOutput}`)
        })
      }
    )
  });
  describe(`Testing ST(<style>)("text") functionality`, ()=>{
    const {ST} = Index;
    ANSI_STYLES.forEach(
      style => {
        it(`Check ST(${style})("text")`, ()=>{
          const input = `This text uses ${style} style`;
          const output = ST(style)(input);
          const callbackFnOutput = ST(style)(
            ({prefix, suffix})=>prefix+input+suffix
          );
          [output, callbackFnOutput].forEach(otpt => expect(otpt).to.be.string);
          console.log(`✅ ST("${style}")("text") produces: ${output}`);
          console.log(`✅ ST("${style}")(()=>"text") produces: ${callbackFnOutput}`)
        })
      }
    );
    it(`Check behavior upon invalid <style> param`, ()=>{
      const input = `This text should not be in 'italic' style`;
      const outputOfInvalid = ST("I Tali s " as any)(input);
      const correctOutput = ST("ITALIC  " as any)(`This text should be in 'italic' style`);
      console.log(`✅ ST("Invalid")("text") produces: ${outputOfInvalid}`);
      console.log(`✅ ST(" ITALIC ")("text") {Valid but need to refine param} produces: ${correctOutput}`)
    });
  });
  describe(`Testing functionality of e.g. reset, bold, dim ... underline`, ()=>{
    ANSI_STYLES.forEach(
      style => {
        it(`Check fn ${style}`, ()=>{
          const input = `This text use '${style}' style`;
          const output = Index[style](input);
          const callbackFnOutput = Index[style](
            ({prefix,suffix})=>prefix+input+suffix
          );
          [output,callbackFnOutput].forEach(otpt=>expect(otpt).to.be.string);
    
          console.log(`✅ ${style}("text") produces: ${output}`);
          console.log(`✅ ${style}(() =>"text") produces: ${callbackFnOutput}`)
        })
      }
    )
  });
};

/**
 * Testing does "clx" root API supports every deep chaining.
 *  Enables to define any (st, fg, bg) in a single line of code.
 */
const TestCLX = () => {
  const clx = Index.default;

  describe('Testing types and basic properties of "clx"', () => {
    it(`Testing types of each object of "clx"`, ()=>{
      expect(clx).to.instanceof(IceBurg);

      expect(clx.bg).to.be.instanceOf(BG);
      expect(clx.brBg).to.be.instanceOf(BrBG);

      ANSI_COLORS.forEach(
        c1 => {
          [clx[c1], clx.br[c1]].forEach(
            ins => expect(ins).to.be.an.instanceof(ClElem)
          );
          [clx.bg[c1], clx.brBg[c1], clx.br.bg[c1]].forEach(
            ins => {
              expect(ins).to.be.instanceof(BgElem);
              ANSI_COLORS.forEach(
                c2 => {
                  expect(ins[c2]).to.be.instanceOf(ClElem)
                }
              )
            }
          );
        }
      )

      ANSI_STYLES.forEach(
        st => {
          expect(clx[st]).to.be.instanceof(IceBurgStyleElem);
          expect(clx[st]).to.be.not.instanceof(StyleElem);

          expect(clx[st].bg).to.be.instanceOf(BG);
          expect(clx[st].br.bg).to.be.instanceOf(BrBG);
          expect(clx[st].brBg).to.be.instanceOf(BrBG);

          ANSI_COLORS.forEach(
            c1 => {

              expect(clx[st][c1]).to.be.an.instanceof(ClElem);

              [clx[st].bg[c1], clx[st].brBg[c1], clx[st].br.bg[c1]].forEach(
                ins => {
                  expect(ins).to.be.instanceof(BgElem);
                  ANSI_COLORS.forEach(
                    c2 => {
                      expect(ins[c2]).to.be.instanceOf(ClElem)
                    }
                  )
                }
              );
            }
          )
        }
      );

    });
  });


  describe("Testing the output of every nested API object of 'clx'", ()=>{

    ANSI_STYLES.forEach(
      st => {
        const stx1 = `clx.${st}.write("text")`;
        const opt1 = clx[st].write(`This should use <${st}> style`);
        it(`Checking clx.${st}.write("text")`, ()=>{
          expect(opt1).to.be.string;
          console.log(`✅ ${stx1} produces: ${opt1}`);
        })
      }
    )
  });

  describe("Testing 'clx' with bg/brBg", ()=>{
    ANSI_COLORS.forEach(
      c1 => {
        const stx1 = `clx.bg.${c1}.write("text")`;
        const opt1 = clx.bg[c1].write(`This should have ${c1}-BG`);
        it(`Checking ${stx1}`, ()=>{
          expect(opt1).to.be.string;
          console.log(`✅ ${stx1} produces: ${opt1}`)
        });

        const stx2 = `clx.brBg.${c1}.write("text")`;
        const opt2 = clx.brBg[c1].write(`This should have bright ${c1}-BG`);
        it(`Checking ${stx2}`, ()=>{
          expect(opt2).to.be.string;
          console.log(`✅ ${stx2} produces: ${opt2}`);
        });

        ANSI_COLORS.forEach(
          c2 => {
            const stx3 = `clx.bg.${c1}.${c2}.write("text")`;
            const opt3 = clx.bg[c1][c2].write(`This should have ${c1}-BG and ${c2}-text-color`);

            const stx4 = `clx.bg.${c1}.br.${c2}.write("text")`;
            const opt4 = clx.bg[c1].br[c2].write(`This should have ${c1}-BG and bright ${c2}-text-color`);

            [
              [stx3, opt3], [stx4, opt4]
            ].forEach(
              ([stx,opt]) => {
                it(`Checking ${stx}`, ()=>{
                  expect(opt).to.be.string;
                  console.log(`✅ ${stx} produces: ${opt}`)
                });
              }
            );

            
            const stx5 = `clx.brBg.${c1}.${c2}.write("text")`;
            const opt5 = clx.brBg[c1][c2].write(`This should have bright ${c1}-BG and ${c2}-text-color`);

            const stx6 = `clx.brBg.${c1}.br.${c2}.write("text")`;
            const opt6 = clx.brBg[c1].br[c2].write(`This should have bright ${c1}-BG and bright ${c2}-text-color`);

            [
              [stx5, opt5], [stx6, opt6]
            ].forEach(
              ([stx,opt]) => {
                it(`Checking ${stx}`, ()=>{
                  expect(opt).to.be.string;
                  console.log(`✅ ${stx} produces: ${opt}`)
                });
              }
            );
          }
        )
      }
    )
  });

  describe(`Testing 'clx' with <CL>/br.<CL>`, ()=>{
    ANSI_COLORS.forEach(
      c1 => {
        const stx1 = `clx.${c1}.write("text")`;
        const opt1 = clx[c1].write(`This should be in ${c1}-color`);
        it(`Checking ${stx1}`, ()=>{
          expect(opt1).to.be.string;
          console.log(`✅ ${stx1} produces: ${opt1}`)
        });

        const stx2 = `clx.br.${c1}.write("text")`;
        const opt2 = clx.br[c1].write(`This should be in bright ${c1}-color`);
        it(`Checking ${stx2}`, ()=>{
          expect(opt2).to.be.string;
          console.log(`✅ ${stx2} produces: ${opt2}`)
        });

      }
    )
  })

};

const TestLog = () => {
  const clx = Index.default;
  const inps: (Parameters<typeof console.log>)[] = [
    // Simple primitives
    ["This is a string"],
    [123456],
    [true, false],
    [null],
    [undefined],

    // Multiple simple values
    ["Name:", "Alice", "Age:", 30],

    // Formatted string with placeholders
    ["My name is %s and I am %d years old", "Bob", 25],

    // Array and object
    [[1, 2, 3, 4]],
    [{ name: "Charlie", age: 28 }],

    // Mixed types
    ["Mixed types:", 42, true, null, { key: "value" }, [5, 6, 7]],

    // Function (as value)
    [() => "I'm a function!"],

    // Date object
    [new Date()],

    // Symbol and BigInt
    [Symbol('sym'), 1234567890123456789012345678901234567890n],

    // Error object
    [new Error("Something went wrong")],

    // Nested array and object
    [{ nested: { arr: [1, 2, 3], obj: { deep: true } } }],

    // Empty log (no arguments)
    [],

    // CSS styling in browser (won't affect Node.js but still good to test)
    ["%cThis text should be red", "color: red; font-weight: bold;"],

    // Very large numbers
    [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],

    // Complex: Array of functions
    [[() => "a", () => "b", () => "c"]],
  ];

  describe(`Testing how 'log' method over different input types`, ()=>{
    inps.forEach(
      (inp, i) => {
        it(`Testing inp[${i}]`, ()=>{
          console.log(`Actual result`);
          console.log(...inp);
          console.log(`Modified result`);
          const ins = clx.bg.red.yellow
          ins.log(...inp)
        })
      }
    )
  })
};

(
  ()=>{
    const TESTS: Function[] = [
      TestColorsFG,
      TestBrColorsFG,

      TestBgColorBG,
      TestBrBgColorBG,

      TestST,

      TestCLX,
      TestLog
    ];

    TESTS.forEach(
      runTest => {
        runTest()
      }
    )
  }
)()
