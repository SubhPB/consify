const ANSI_COLORS = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'] as const;
const ANSI_STYLES = ['reset', 'bold', 'dim', 'italic', 'underline', 'blink', 'flashBlink', 'reverse', 'hidden', 'strikethrough'] as const;
const DEFAULT_ANSI_PARAMETERS = {
    ST: 0, FG: 39, BG: 49
};

/**Offsets */

const CL_OFFSET = 30;
const BR_CL_OFFSET = 90;
const BG_OFFSET = 40;
const BR_BG_OFFSET = 100;


export {
    ANSI_COLORS,
    ANSI_STYLES,
    DEFAULT_ANSI_PARAMETERS,

    CL_OFFSET,
    BR_CL_OFFSET,
    BG_OFFSET,
    BR_BG_OFFSET
};