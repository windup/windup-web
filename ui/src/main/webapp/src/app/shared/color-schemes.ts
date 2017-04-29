let colorSchemeCache = [];

export function calculateColorScheme(len:number) {
    if (!len || len == 0)
        len = 10;

    if (colorSchemeCache[len])
        return colorSchemeCache[len];

    let result = [];
    for (let index = 0; index < len; index++) {
        let clrHSL = {
            h: ((index*0.95*360/len) + 90/len) % 360,
            s: 0.95 * 100,
            l: (((index%4 == 3 ? 1:0)/-4)+0.55) * 100
        };
        let clrRGB = hslToRGB(clrHSL);
        let hex = rgbToHex(clrRGB);
        result.push(hex);
    }
    colorSchemeCache[len] = {
        domain: result
    };
    return colorSchemeCache[len];
}

/*
 *  Inspired from functions here: https://github.com/ckelsey/aCKolor
 *
 *  License: https://github.com/ckelsey/aCKolor/blob/fda257b81fc42cebcd5d1b965862f6caf67ba44d/LICENSE.txt
 */
function hslToRGB (hsl){
    let h = hsl.h;
    let s = hsl.s;
    let l = hsl.l;
    let r, g, b, m, c, x;

    if (!isFinite(h)) h = 0;
    if (!isFinite(s)) s = 0;
    if (!isFinite(l)) l = 0;

    h /= 60;
    if (h < 0) h = 6 - (-h % 6);
    h %= 6;

    s = Math.max(0, Math.min(1, s / 100));
    l = Math.max(0, Math.min(1, l / 100));

    c = (1 - Math.abs((2 * l) - 1)) * s;
    x = c * (1 - Math.abs((h % 2) - 1));

    if (h < 1) {
        r = c;
        g = x;
        b = 0;
    }
    else if (h < 2) {
        r = x;
        g = c;
        b = 0;
    }
    else if (h < 3) {
        r = 0;
        g = c;
        b = x;
    }
    else if (h < 4) {
        r = 0;
        g = x;
        b = c;
    }
    else if (h < 5) {
        r = x;
        g = 0;
        b = c;
    }
    else {
        r = c;
        g = 0;
        b = x;
    }

    m = l - c / 2;
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r: r, g: g, b: b };
}

function intToHex(i) {
    let hex = parseInt(i).toString(16);
    return (hex.length < 2) ? "0" + hex : hex;
}

function rgbToHex (rgb){
    return '#' + intToHex(rgb.r) + intToHex(rgb.g) + intToHex(rgb.b);
}
