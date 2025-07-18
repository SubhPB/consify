
import { it, describe } from 'mocha';
import { expect } from 'chai';
import * as Index from '../index.js';
import type { COLOR, STYLE } from '../shared/types.js';
import { ANSI_COLORS, ANSI_STYLES } from '../shared/constants.js';

/**
 * Testing behavior of APIs when used together
 * e.g. reverse(italic(red("What will be the output?")))
 */

const NestedColorsFG = () => {
    /**
     * Inject one color API into another color API, where most nested color API will consider the color of the text
     */
    const mixFGwithFG = (color:string, isBright=false) => {
        if (isBright) color = `${color}Br`
        ANSI_COLORS.forEach(
            (c2:string) => {
                if (isBright) c2 = `${c2}Br`
                if (c2!==color){
                    const inp = `This should be in <${c2}> (nested) color not in <${color}> (parent) color`
                    const opt = Index[color](
                        Index[c2](inp)
                    );
                    const callFnOpt = Index[color as any](
                        ({prefix:parentPrefix, suffix:parentSuffix})=>{
                            return parentPrefix + Index[c2](
                                ({prefix:childPrefix, suffix:childSuffix}) => {
                                    return childPrefix + inp + childSuffix
                                }
                            ) + parentSuffix
                        }
                    );
                    
                    const stx1 = `${color}(${c2}("text"))`;
                    const stx2 = `${color}( ({p,f}) => p + ${c2}( ({p1,f2}) => p1 + "text" + f2 ) + f )`
                    it(`Checking whether nested colors produce same result upon argument<string, function> type`, ()=>{
                        [opt, callFnOpt].forEach(ot => {
                            expect(ot).to.be.string;
                        })
                        expect(opt).to.eql(callFnOpt);
                        console.log(`✅ ${stx1} produces: ${opt}`);
                        console.log(`✅ ${stx2} produces: ${callFnOpt}`);
                    });
                };
            }
        )
    };
    const describeFGwithFG = (color:COLOR) => {
        describe(`Testing nested FG APIs when parent-color is ${color}`, ()=>{
            mixFGwithFG(color);
        });
        describe(`Testing nested brightFG APIs when parent-color is ${color}`, () => {
            const isBright = true
            mixFGwithFG(color, isBright)
        })
    };

    ANSI_COLORS.forEach(
        color => {
            describeFGwithFG(color)
        }
    )
};

/**
 * Testing behavior of BG APIs when used together
 */
const NestedColorsBG = () => {
    
    const getBgColor = (c:string, isBright:boolean) => isBright ? `${c}BrBG` : `${c}BG`;
    const mixBGwithBG = (color:string, isBright=false) => {
        const bgColor = getBgColor(color,isBright)
        ANSI_COLORS.forEach(
            (bgCol2:string) => {
                const bg2 = getBgColor(bgCol2, isBright);

                if (bgColor !== bg2){
                    const inp = `This should has <${bg2}>(nested) BG, but not <${bgColor}>(parent) BG.`;
                    const opt = Index[bgColor](
                        Index[bg2](inp)
                    );

                    const callFnOpt = Index[bgColor](
                        ({prefix: pf, suffix: ps}) => {
                            return pf + (
                                Index[bg2](
                                    ({prefix:cf, suffix:cs}) => cf + (
                                        inp
                                    ) + cs
                                )
                            ) + ps
                        }
                    );

                    const stx1 = `${bgColor}(${bg2}("text"))`;
                    const stx2 = `${bgColor}(
                        ({pf,ps}) => pf + ${bg2}(
                            ({cf,cs}) => cf + "text" + cs
                        ) + ps
                    )`;

                    it(`Checking whether nested colors produce same and expected result upon argument<function, string>`, ()=>{
                        [opt, callFnOpt].forEach(ot => {
                            expect(ot).to.be.string;
                        });

                        expect(opt).to.eql(callFnOpt);
                        console.log(`✅ ${stx1} produces: ${opt}`);
                        console.log(`✅ ${stx2} produces: ${callFnOpt}`);
                    });
                };
            }
        )
    };

    const describeBGwithBG = (color:COLOR) => {
        describe(`Testing nested BG APIs when parent BG is ${getBgColor(color, false)}`, ()=>{
            mixBGwithBG(color);
        });
        describe(`Testing nested brightBG APIs when parent BG is ${getBgColor(color, true)}`, ()=>{
            const isBright = true;
            mixBGwithBG(color, isBright);
        })
    };

    /**Running space */
    ANSI_COLORS.forEach(
        color => {
            describeBGwithBG(color)
        }
    );
};

/**
 * Testing how BG/FG behave when used together, expect them not to overwrite each other.
 */
const NestedFG_BG = () => {

    const getColor = (c:string, isBright:boolean) => isBright ? `${c}Br` : c;
    const getBgColor = (c:string, isBright:boolean) => isBright ? `${c}BrBG` : `${c}BG`

    const mixFG_BG = (color:string, p: 'FG' | 'BG' , isBright=false) => {
        /**
         * First will treat as FG -> BG and then as BG -> FG
         */
        const parent = p === 'FG' ? getColor(color, isBright) : getBgColor(color, isBright);

        ANSI_COLORS.forEach(
            c2 => {
                const child = p==='FG' ? getBgColor(c2, isBright) : getColor(c2, isBright);

                const inp = `This text is <${parent}>(parent) and <${child}>(child)`;
                const opt = Index[parent](
                    Index[child](inp)
                );
                const callFnOpt = Index[parent](
                    ({prefix:pf,suffix:ps}) => (
                        pf + Index[child](
                            ({prefix:cf,suffix:cs}) => cf + inp + cs
                        ) + ps
                    )
                );

                const stx1 = `${parent}(${child}("text"))`;
                const stx2 = `
                    ${parent}(
                        ({pf,ps}) => pf + (
                            ${child}(
                                ({cf,cs}) => cf + "text" + cs
                            )
                        ) + ps
                    )
                `;

                it(`Checking whether nested APIs produces same result upon argument<string,function> type`, ()=>{
                    [opt, callFnOpt].forEach(
                        ot => {
                            expect(ot).to.be.string
                        }
                    );
                    console.log(`✅ ${stx1} produces: ${opt}`);
                    console.log(`✅ ${stx2} produces: ${callFnOpt}`);
                });

                const stx3 = `${parent}("<parent>" + ${child}("<${child}>") + " <${parent}>")`;
                it(`Checking behavior when one API is injected into the middle,
                    `, ()=> {
                    const otp = Index[parent](
                        `<${parent}-zone> `.repeat(2) 
                        + Index[child](`<${child}-zone>`.repeat(2))
                        + ` <${parent}-zone> `.repeat(2) 
                    );
                    expect(otp).to.be.string;
                    console.log(`✅ ${stx3} produces: ${otp}`)
                    
                })
            }
        )
    };

    const describeFGwithBG = (color:COLOR) => {
        describe(`Testing nested FG APIs combined with BG APIs`, ()=>{
            mixFG_BG(color, 'FG', false)
        });
        describe(`Testing nested bright-FG APIs combined with bright-BG APIs`, ()=>{
            mixFG_BG(color, 'FG', true)
        });
    };

    const describeBGwithFG = (color:COLOR) => {
        describe(`Testing nested BG APIs combined with FG APIs`, ()=>{
            mixFG_BG(color, 'BG', false)
        });
        describe(`Testing nested bright-BG APIs combined with bright-FG APIs`, ()=>{
            mixFG_BG(color, 'BG', true)
        });
    };

    ANSI_COLORS.forEach(
        color => {
            describeFGwithBG(color);
            describeBGwithFG(color)
        }
    )
};

/**
 * How mixed style behave?
 */
const NestedST = () => {

    const mixSTwithST = (style:STYLE) => {

        ANSI_STYLES.forEach(
            style2 => {
                if (style!==style2){
                    const inp = `Expecting both <${style2.toUpperCase()}> and <${style.toUpperCase()}>`;
                    const opt = Index[style](
                        Index[style2](inp)
                    );
                    const callFnOpt = Index[style](
                        ({prefix:parentPrefix, suffix:parentSuffix}) => parentPrefix + (
                            Index[style2](
                                ({prefix:childPrefix, suffix:childSuffix}) => childPrefix + inp + childSuffix
                            )
                        ) + parentSuffix
                    );
                    const stx1 = `${style}(${style2}("text"))`;
                    const stx2 = `${style}(
                        ({p,f}) => p + (
                            ${style2}(
                                ({cp,cf}) => cp + "text" + cf
                            )
                        ) + f
                    )`;

                    it(`Checking whether nested styles produced expected results`, ()=>{
                        [opt, callFnOpt].forEach(ot => {
                            expect(ot).to.be.string;
                        });
                        expect(opt).to.eql(callFnOpt);
                        console.log(`✅ ${stx1} produces: ${opt}`);
                        console.log(`✅ ${stx2} produces: ${callFnOpt}`);
                    });

                    //Now injecting other style in between of another style
                    const stx3 = `${style}("<${style.toUpperCase()}> " + ${style2}("<${style2.toUpperCase()}>") + "<${style.toUpperCase()}> ")`;
                    const opt3 = Index[style](
                        `<${style.toUpperCase()}> ${Index[style2](`<${style2.toUpperCase()}>`)} <${style.toUpperCase()}> ` 
                    );

                    it(`Checking how style APIS behave when used in the middle`, ()=>{
                        expect(opt3).to.be.string;
                        console.log(`✅ ${stx3} produces: ${opt3}`)
                    })
                }
            }
        )
    };

    const describeSTwithST = (style:STYLE) => {
        describe(`Testing how nested styles when root is <style:${style}>`, ()=>{
            mixSTwithST(style)
        })
    };
    ANSI_STYLES.forEach(
        style => describeSTwithST(style)
    )
};

/**
 * Test a style with either BG or FG
 */
const NestedSTwithFBG = () =>{

    const mixSTwithFGorBG = (style:STYLE, isBright=false) => {
        
        const IT = (FBG:string) => {
            const inp1 = `Should use both <${style.toUpperCase()}> and in <${FBG}>`;
            const stx1 = `${style}(${FBG}("text"))`;
            const opt1 = Index[style](
                Index[FBG](inp1)
            );

            const stx2 = `${FBG}(${style}("text"))`;
            const opt2 = Index[FBG](
                Index[style](inp1)
            );

            it(`Checking ${stx1} and ${stx2}`, ()=>{
                [opt1,opt2].forEach(ot => expect(ot).to.be.string);
                console.log(`✅ ${stx1} produces: ${opt1}`);
                console.log(`✅ ${stx2} produces: ${opt2}`)
            })

            /**Injecting in middle */
            const stx3 = `${style}("<${style.toUpperCase()}> " + ${FBG}("<${FBG}>") + " <${style.toUpperCase()}>")`
            const opt3 = Index[style](
                `<${style.toUpperCase()}> ` + Index[FBG](`<${FBG}>`) + `<${style.toUpperCase()}> `
            );

            const stx4 = `${FBG}("<${FBG}> " + ${style}("<${style.toUpperCase()}>") + " <${FBG}>")`
            const opt4 = Index[FBG](
                `<${FBG}> ` + Index[style](`<${style.toUpperCase()}>`) + `<${FBG}> `
            );

            it(`Checking ${stx3} and ${stx4}`, ()=>{
                expect(opt3).to.be.string;
                expect(opt4).to.be.string;
                console.log(`✅ ${stx3} produces: ${opt3}`);
                console.log(`✅ ${stx4} produces: ${opt4}`)
            });

        };
        
        ANSI_COLORS.forEach(
            color => {
                const FG:string = isBright ? `${color}Br` : color;
                const BG:string = isBright ? `${color}BrBG` : `${color}BG`;
                ([FG,BG]).forEach(
                    FBG => IT(FBG)
                )
            }
        );
    };

    const describeSTwithFBG = (style:STYLE) => {
        describe(`Testing ${style} back-forth with FG or BG`, ()=>{
            mixSTwithFGorBG(style, false)
        });

        //For bright colors
        describe(`Testing ${style} back-forth with Bright-FG or Bright-BG`, ()=>{
            mixSTwithFGorBG(style, true)
        });
    };

    ANSI_STYLES.forEach(
        style => describeSTwithFBG(style)
    )
};

/**
 * Test and use APIs of Style, FG, BG together in a single line
 */
const NestedST_FG_BG = () => {
    
    const IT = (style:STYLE, FG:string, BG:string) => {
        const inp1 = `Should use all ${style}, ${FG}, ${BG}`;
        const stx1 = `${FG}(${BG}(${style})("text"))`;
        const stx2 = `${BG}(${FG}(${style}("text")))`;
        const stx3 = `${style}(${FG}(${BG}("text")))`;
        
        const opt1 = Index[FG](
            Index[BG](
                Index[style](inp1)
            )
        );
        const opt2 = Index[BG](
            Index[FG](
                Index[style](inp1)
            )
        );
        const opt3 = Index[style](
            Index[FG](
                Index[BG](inp1)
            )
        );
        [
            [stx1,opt1],
            [stx2,opt2],
            [stx3,opt3]
        ].forEach(
            ([stx, otp]) => {
                it(`Checking output of ${stx}`, ()=>{
                    expect(otp).to.be.string;
                    console.log(`✅ ${stx} produces: ${otp}`)
                })
            }
        );

        /**
         * Injecting APIs in between of each other
         */
        const stx4 = `${FG}( "<${FG}> " + ${BG}(" <${BG}> ") + ${style}("<${style.toUpperCase()}>") )`
        const opt4 = Index[FG](
            `<${FG}-FG-COLOR>`
            + Index[BG](` <${BG}-BG-COLOR + ${FG}-FG-COLOR> `)
            + Index[style](`<${style.toUpperCase()}-ST + ${FG}-FG-COLOR>`));

        const stx5 = `${BG}( "<${BG}>" + ${FG}(" <${FG}> ") + ${style}("<${style.toUpperCase()}>") )`
        const otp5 = Index[BG](
            `<${BG}-BG-COLOR>` 
            + Index[FG](` <${FG}-FG-COLOR> + <${BG}-BG-COLOR> `) 
            + Index[style](`<${style.toUpperCase()}-ST + ${BG}-BG-COLOR>`)
        );

        const stx6 = `${style}("<${style.toUpperCase()}>" + ${FG}("<${FG}>") + ${BG}("<${BG}>"))`;
        const otp6 = Index[style](
            `<${style.toUpperCase()}-ST>`
            + Index[FG](` <${FG}-FG-COLOR> + <${style.toUpperCase()}-ST> `)
            + Index[BG](`<${BG}-BG-COLOR> + <${style.toUpperCase()}-ST>`)
        );

        [
            [stx4,opt4],
            [stx5,otp5],
            [stx6, otp6]
        ].forEach(
            ([stx, otp]) => {
                it(`Checking ${stx}`, ()=>{
                    expect(otp).to.be.string;
                    console.log(`✅ ${stx} produces: ${otp}`)
                })
            }
        )
    };

    const describeST_FG_BG = (style:STYLE, isBright=false) => {
        describe(`Testing ${style} with all APIS of FG and BG`, ()=>{
            ['black', 'red', 'green', 'yellow'].forEach(
                color1 => {
                    ['blue', 'magenta', 'cyan', 'white'].forEach(
                        color2 => {
                            const BG1 = isBright ? `${color1}BrBG` : `${color1}BG`;
                            const FG1 = isBright ? `${color2}Br` : color2;
                            IT(style, FG1, BG1);

                            const BG2 = isBright ? `${color2}BrBG` : `${color2}BG`;
                            const FG2 = isBright ? `${color1}Br` : color1
                            IT(style, FG2, BG2)
                        }
                    )
                }
            );
        })
    }

    ANSI_STYLES.forEach(
        style => {
            describeST_FG_BG(style)
        }
    )
}

const QuickTests = () => {

    // describe(`How BG behave when another BG is used in the middle of it`, ()=>{
    //     const {redBG, yellowBG, redBrBG} = Index;
    //     it(`Injecting yellowBG in the middle of redBG `, ()=>{
    //         console.log(`[?] `, redBG(
    //             `<RED> `.repeat(2)
    //             + yellowBG(`<YELLOW> `.repeat(2))
    //             + redBrBG(`<RED?> `.repeat(2))
    //         ));
    //     })
    // });

    describe(`Checking how <reverse> works in different cases:`, ()=>{
        const {reverse, red, yellowBG} = Index;

        const stx1 = `reverse( red( "text" ) )`;
        const stx2 = `reverse( yellowBG( "text" ) )`
        it(`Checking ${stx1} `, ()=> {
            const opt1 = reverse(red("Reversed + red FG color"));
            const opt2 = reverse(yellowBG("Reversed + yellow BG"))
            expect(opt1).to.be.string;
            console.log(`✅ ${stx1} produces: ${opt1}`);
            console.log(`✅ ${stx2} produces: ${opt2}`);
        });

        const inp3 = `Expecting to have yellow text-color and red background`
        const stx3 = `reverse( red( yellowBG("text") ) )`;
        const stx4 = `reverse( yellowBG( red("text") ) )`
        it(`Checking ${stx3}`, ()=>{
            const opt3 = reverse( red(yellowBG(inp3)) );
            const opt4 = reverse( yellowBG(red(inp3)) );
            console.log(`✅ ${stx3} produces: ${opt3}`);
            console.log(`✅ ${stx4} produces: ${opt4}`)
        })


    })
};

(
    ()=>{
        const MixinsTests: Function[] = [
            NestedColorsFG, //✅

            NestedColorsBG, //✅

            NestedFG_BG, //✅

            NestedST, //✅

            NestedSTwithFBG, //✅

            NestedST_FG_BG, //✅

            QuickTests

        ];
        MixinsTests.forEach(
            runMixinTest => {
                runMixinTest()
            }
        )
    }
)()

