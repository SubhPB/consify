//CMD npx ts-node --project tsconfigs/tsconfig.base.json ./src/index.ts
import { ANSI_COLORS, ANSI_STYLES, BG_OFFSET, BR_BG_OFFSET, BR_CL_OFFSET, CL_OFFSET, DEFAULT_ANSI_PARAMETERS } from "./shared/constants.ts";
import type {COLOR, STYLE} from './shared/types.ts'

class BASE {
    protected props : typeof DEFAULT_ANSI_PARAMETERS;
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        this.props=props
    };
    inspectProps(){
        return {...this.props}
    }
};

//Note: only a entity/element or subClient can extend a Client
abstract class BaseClient extends BASE {
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props)
    };
    write(writableInp:any){
        const {ST,FG,BG} = this.props;
        return `\x1b[${ST};${FG};${BG}m${writableInp}\x1b[0m`
    } 
}

//Color-client, features offered by text-coloring
abstract class ClClient extends BaseClient {
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props)
    };
};
//Color-element e.g. red, blue etc which utilize Color-client
class ClElem extends ClClient {
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props)
    };
};
//An object holding all color entities e.g {red,blue,...}
abstract class AbstractCL extends BASE {
    protected abstract get offset():number;
    protected calcFG(ci:number){
        return this.offset+ci;
    }
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props);
        for(let ci=0; ci<ANSI_COLORS.length; ci++){
            const color = ANSI_COLORS[ci];
            Object.defineProperty(this, color,{
                value: new ClElem({
                    ...this.props,
                    FG: this.calcFG(ci)
                })
            })
        }
    }
};
interface AbstractCL extends Record<COLOR, ClElem> {};
//Containing all regular text colors
class CL extends AbstractCL {
    protected get offset(){return CL_OFFSET};
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props);
    }
};
//Containing all bright text colors
class BrCL extends AbstractCL {
    protected get offset(){return BR_CL_OFFSET};
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props);
    }
};


//Background-client, not only write() but supports the chaining for each ClElem
abstract class BgClient extends CL {
    protected _br: BrCL; //For chaining of bright text color
    get br(){return this._br};
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props);
        this._br = new BrCL(props)
    };
    write(writableInp:any){
        const {ST,FG,BG} = this.props;
        return `\x1b[${ST};${FG};${BG}m${writableInp}\x1b[0m`
    };
};
//background-color entity e.g red, black, yellow etc
class BgElem extends BgClient {
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props)
    };
};
//An object holding all bg-color entities e.g {red,blue,...}
abstract class AbstractBG extends BASE {
    protected abstract get offset():number;
    protected calcBG(ci:number){
        return this.offset+ci;
    }
    constructor(props=DEFAULT_ANSI_PARAMETERS){
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
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props)
    };
};
//Containing all bright bg colors
class BrBG extends AbstractBG {
    protected get offset(){return BR_BG_OFFSET};
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props)
    };
};

/**
/*Provides most basic utilities to client such as to continue text-coloring(non-bright), plus write method
*    * <underline>.write(text)
     * <underline>.blue.write(text)
 */
abstract class StyleBaseClient extends CL {
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props);
    };
    write(writableInp:any){
        const {ST,FG,BG} = this.props;
        return `\x1b[${ST};${FG};${BG}m${writableInp}\x1b[0m`
    };
};

/**
 * Allows to continue define br color or br bg after defining the style.
 * Can define bright text color or either bright background color
 *   * underline.<br>.blue.write(text)
     * underline.<br>.bg.red.write(text)
     * underline.<br>.bg.red.blue.write(text)
     * underline.<br>.bg.red.br.blue.write(text)
 */
class StyleBr extends BrCL {
    protected _brBg: BrBG;
    get bg(){return this._brBg}
    constructor(props=DEFAULT_ANSI_PARAMETERS){
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
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props);
        this.styleBr = new StyleBr(props);
        this.styleBg = new BG(props);
        this.styleBrBg = new BrBG(props);
    }
};
// style-elements are like e.g. <underline>, <reverse>, <hidden> and more...
class StyleElem extends StyleClient {
    constructor(props=DEFAULT_ANSI_PARAMETERS){
        super(props)
    };
};

class Style extends BASE {
    protected calcST(si:number){return si;}
    constructor(props=DEFAULT_ANSI_PARAMETERS){
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


export {BG,BrBG,BrCL,CL,Style,ClElem,BgElem,StyleElem, StyleBr}
