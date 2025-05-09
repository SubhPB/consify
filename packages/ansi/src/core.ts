//CMD npx ts-node --project tsconfigs/tsconfig.base.json ./src/index.ts
import { interfaces } from "mocha";
import { ANSI_COLORS, ANSI_STYLES, BG_OFFSET, BR_BG_OFFSET, BR_CL_OFFSET, CL_OFFSET, DEFAULT_ANSI_PARAMETERS, RESET_BG_CODE, RESET_FG_CODE, RESET_ST_CODES} from "./shared/constants.ts";
import type {COLOR, STYLE} from './shared/types.ts'

class BASE {
    protected props : Partial<typeof DEFAULT_ANSI_PARAMETERS>;
    constructor(props={}){
        this.props=props
    };
    inspectProps(){
        return {...this.props}
    }
};

/**Goal: To provide more features, customization over output string to the end user */
class BasePen extends BASE {
    constructor(props={},){
        super(props);
    };
    protected escapeCode(code:number){
        return `\x1b[${code}m`
    };
    protected resetCode(prop:Required<keyof typeof this.props>, code:number){
        //Generate appropriate resetCode for each prop
        let resetCode: undefined|number;
        if (prop in this.props){
            switch (prop) {
                case 'ST':
                    resetCode = RESET_ST_CODES[code];
                    break;
                case 'FG':
                    resetCode = RESET_FG_CODE;
                    break;
                case 'BG':
                    resetCode = RESET_BG_CODE;
                    break;
                default:
                    break;
            };
        };
        return resetCode;
    }
    get prefix(){
        let pf = '';
        for(let prop of ['ST','FG','BG']){
            if (
                prop in this.props && Number.isInteger(this.props[prop])
            ) pf += this.escapeCode(this.props[prop])
        };
        return pf;
    };
    get suffix(){
        let sf = '';
        for(let prop of ['ST','FG','BG']){
            if (
                prop in this.props && Number.isInteger(this.props[prop])
            ){
                const resetCode = this.resetCode(prop as (keyof typeof this.props),this.props[prop]);
                if (resetCode!==undefined&&Number.isInteger(resetCode)) sf += this.escapeCode(resetCode);
            };
        };
        return sf;
    };
    getCallbackParams(){
        const params = {
            prefix: this.prefix,
            suffix: this.suffix,
            date: new Date(),
        };
        return params;
    };
    compose(writableInp:string|number){
        return `${this.prefix}${writableInp}${this.suffix}`
    }
}

//Note: only a base/element or subClient can extend a Client
abstract class BaseClient extends BASE {
    constructor(props={}){
        super(props)
    };
    write(textOrCallback:(string | number | ((callbackArgs:ReturnType<BasePen['getCallbackParams']>)=>string))){
        const pen = new BasePen(this.props);
        if (typeof textOrCallback === 'function'){
            return textOrCallback(pen.getCallbackParams())
        };
        return pen.compose(textOrCallback)
    };
    log(...args:Parameters<typeof console.log>){
        const newArgs:typeof args = args.map(
            arg => {
                if (['string','number'].some(type => typeof arg === type)){
                    return this.write(arg)
                } else {
                    return arg
                }
            }
        )
        console.log(...newArgs);
    }
}

//Color-client, features offered by text-coloring
abstract class ClClient extends BaseClient {
    constructor(props={}){
        super(props)
    };
};
//Color-element e.g. red, blue etc which utilize Color-client
class ClElem extends ClClient {
    constructor(props={}){
        super(props)
    };
};
//An object holding all color entities e.g {red,blue,...}
abstract class AbstractCL extends BASE {
    protected abstract get offset():number;
    protected calcFG(ci:number){
        return this.offset+ci;
    }
    constructor(props={}){
        super(props);
        for(let ci=0; ci<ANSI_COLORS.length; ci++){
            const color = ANSI_COLORS[ci];
            Object.defineProperty(this, color,{
                value: new ClElem({
                    ...this.props,
                    FG: this.calcFG(ci)
                })
            });
        }
    }
};
interface AbstractCL extends Record<COLOR, ClElem> {};
//Containing all regular text colors
class CL extends AbstractCL {
    protected get offset(){return CL_OFFSET};
    constructor(props={}){
        super(props);
    }
};
//Containing all bright text colors
class BrCL extends AbstractCL {
    protected get offset(){return BR_CL_OFFSET};
    constructor(props={}){
        super(props);
    }
};


//Background-client, not only write() but supports the chaining for each ClElem
abstract class BgClient extends CL {
    protected _br: BrCL; //For chaining of bright text color
    get br(){return this._br};
    constructor(props={}){
        super(props);
        this._br = new BrCL(props)
    };
    write(textOrCallback:(string | number | ((callbackArgs:ReturnType<BasePen['getCallbackParams']>)=>string))){
        const pen = new BasePen(this.props);
        if (typeof textOrCallback === 'function'){
            return textOrCallback(pen.getCallbackParams())
        };
        return pen.compose(textOrCallback)
    };
    log(...args:Parameters<typeof console.log>){
        const newArgs:typeof args = args.map(
            arg => {
                if (['string','number'].some(type => typeof arg === type)){
                    return this.write(arg)
                } else {
                    return arg
                }
            }
        )
        console.log(...newArgs);
    }
};
//background-color entity e.g red, black, yellow etc
class BgElem extends BgClient {
    constructor(props={}){
        super(props)
    };
};
//An object holding all bg-color entities e.g {red,blue,...}
abstract class AbstractBG extends BASE {
    protected abstract get offset():number;
    protected calcBG(ci:number){
        return this.offset+ci;
    }
    constructor(props={}){
        super(props);
        for(let ci=0; ci<ANSI_COLORS.length; ci++){
            const color = ANSI_COLORS[ci];
            Object.defineProperty(this, color,{
                value: new BgElem({
                    ...this.props,
                    BG: this.calcBG(ci)
                })
            })
        }
    }
};
interface AbstractBG extends Record<COLOR, BgElem> {};
//Containing all regular bg colors
class BG extends AbstractBG {
    protected get offset(){return BG_OFFSET};
    constructor(props={}){
        super(props)
    };
};
//Containing all bright bg colors
class BrBG extends AbstractBG {
    protected get offset(){return BR_BG_OFFSET};
    constructor(props={}){
        super(props)
    };
};

/**
/*Provides most basic utilities to client such as to continue text-coloring(non-bright), plus write method
*    * <underline>.write(text)
     * <underline>.blue.write(text)
 */
abstract class StyleBaseClient extends CL {
    constructor(props={}){
        super(props);
    };
    write(textOrCallback:(string | number | ((callbackArgs:ReturnType<BasePen['getCallbackParams']>)=>string))){
        const pen = new BasePen(this.props);
        if (typeof textOrCallback === 'function'){
            return textOrCallback(pen.getCallbackParams())
        };
        return pen.compose(textOrCallback)
    };
    log(...args:Parameters<typeof console.log>){
        const newArgs:typeof args = args.map(
            arg => {
                if (['string','number'].some(type => typeof arg === type)){
                    return this.write(arg)
                } else {
                    return arg
                }
            }
        )
        console.log(...newArgs);
    }
};

/**
 * Allows to continue define br color or br bg after defining the style.
 * Can define bright text color or either bright background color
 * @example
 *   * underline.<br>.blue.write(text)
     * underline.<br>.bg.red.write(text)
     * underline.<br>.bg.red.blue.write(text)
     * underline.<br>.bg.red.br.blue.write(text)
 */
class StyleBr extends BrCL {
    protected _brBg: BrBG;
    get bg(){return this._brBg}
    constructor(props={}){
        super(props);
        this._brBg = new BrBG(props)
    }
};

/**
 * StyleClient Allows almost any deep chain to define after <style>
 *   * <underline>.write(text)
     * <underline>.blue.write(text)
     * <underline>.bg.red.write(text)
     * <underline>.bg.red.br.yellow(text)
     * <underline>.br.blue.write(text)
     * <underline>.br.bg.red.write(text) Or <underline>.brBg.red.write(text)
     * <underline>.br.bg.red.blue(text) Or <underline>.brBg.red.blue.write(text)
     * <underline>.br.bg.red.br.blue.write(text) Or <underline>.brBg.red.br.blue.write(text)
 */
abstract class StyleClient extends StyleBaseClient {
    protected styleBr: StyleBr;
    protected styleBg: BG; //Non brightOne
    protected styleBrBg: BrBG;
    get br(){return this.styleBr};
    get bg(){return this.styleBg};
    get brBg(){return this.styleBrBg}
    constructor(props={}){
        super(props);
        this.styleBr = new StyleBr(props);
        this.styleBg = new BG(props);
        this.styleBrBg = new BrBG(props);
    }
};
// style-elements are like e.g. <underline>, <reverse>, <hidden> and more...
class StyleElem extends StyleClient {
    constructor(props={}){
        super(props)
    };
};

class Style extends BASE {
    protected calcST(si:number){return si;}
    constructor(props={}){
        super(props);
        for(let si=0; si<ANSI_STYLES.length; si++){
            const style = ANSI_STYLES[si];
            Object.defineProperty(this, style, {
                value: new StyleElem({
                    ...this.props,
                    ST: this.calcST(si)
                })
            })
        }
    };
};
interface Style extends Record<STYLE, StyleElem> {};

/**
 * IceBurg: contains every single feature offered in this whole package,
 * Rather than injecting features directly from others, will inject by using additional IceBurg layers
 */
class IceBurgBASE extends StyleClient{
    //To inject features like: ANSI.red, ANSI.bg..., ANSI.br..., ANSI.br.bg... etc
    constructor(props={}){
        super(props);
    };
};

class IceBurgStyleElem extends StyleClient {
    //To inject style features like: ANSI.underline..., ANSI.bold.br... etc
    constructor(props={}){
        super(props)
    }
};

class IceBurg extends IceBurgBASE {
    protected calcST(si:number){return si;}
    constructor(props={}){
        super(props);
        for(let si=0; si<ANSI_STYLES.length; si++){
            const style = ANSI_STYLES[si];
            Object.defineProperty(this, style, {
                value: new IceBurgStyleElem({
                    ...this.props,
                    ST: this.calcST(si)
                })
            })
        }
    }
};
interface IceBurg extends Record<STYLE, IceBurgStyleElem>{};


export {BG, BrBG, BrCL, CL, Style, ClElem, BgElem, StyleElem, StyleBr, IceBurgStyleElem, IceBurg}
