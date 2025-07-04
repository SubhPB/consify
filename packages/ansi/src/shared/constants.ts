const ANSI_COLORS = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'] as const;

const ANSI_STYLES = ['reset', 'bold', 'dim', 'italic', 'underline', 'blink', 'flashBlink', 'reverse', 'hidden', 'strikethrough'] as const;
const DEFAULT_ANSI_PARAMETERS = {
    ST: 0, FG: 39, BG: 49
};

const PARAM_KEYS = ['ST', 'FG', 'BG'] as const;

const RESET_ST_CODES = [0, 22, 22, 23, 24, 25, 25, 27, 28, 29] as const;
const RESET_FG_CODE = 39;
const RESET_BG_CODE = 49;


/**Offsets */
const CL_OFFSET = 30;
const BR_CL_OFFSET = 90;
const BG_OFFSET = 40;
const BR_BG_OFFSET = 100;


export {
    ANSI_COLORS,
    ANSI_STYLES,
    DEFAULT_ANSI_PARAMETERS,
    PARAM_KEYS,

    RESET_ST_CODES,
    RESET_FG_CODE,
    RESET_BG_CODE,

    CL_OFFSET,
    BR_CL_OFFSET,
    BG_OFFSET,
    BR_BG_OFFSET
};