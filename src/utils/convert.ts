/**
 * Converts a given number, string, or bigint to a bigint with the specified number of decimals.
 *
 * @param {number | string | bigint} src - The source value to convert. It can be a number, string, or bigint.
 * @param {number} [decimals=9] - The number of decimal places to consider for the conversion. Defaults to 9.
 * @returns {bigint} - The converted value as a bigint.
 * @throws {Error} - Throws an error if the input number is not finite, if the input string is invalid, or if the input number does not have enough precision.
 */
export function toNano(src: number | string | bigint, decimals: number = 9): bigint {
    if (typeof src === 'bigint') {
        return src * 10n ** BigInt(decimals);
    } else {
        if (typeof src === 'number') {
            if (!Number.isFinite(src)) {
                throw Error('Invalid number');
            }

            if (Math.log10(src) <= 6) {
                src = src.toLocaleString('en', {
                    minimumFractionDigits: decimals,
                    useGrouping: false,
                });
            } else if (src - Math.trunc(src) === 0) {
                src = src.toLocaleString('en', { maximumFractionDigits: 0, useGrouping: false });
            } else {
                throw Error('Not enough precision for a number value. Use string value instead');
            }
        }
        // Check sign
        let neg = false;
        while (src.startsWith('-')) {
            neg = !neg;
            src = src.slice(1);
        }

        // Split string
        if (src === '.') {
            throw Error('Invalid number');
        }
        let parts = src.split('.');
        if (parts.length > 2) {
            throw Error('Invalid number');
        }

        // Prepare parts
        let whole = parts[0];
        let frac = parts[1];
        if (!whole) {
            whole = '0';
        }
        if (!frac) {
            frac = '0';
        }
        if (frac.length > decimals) {
            throw Error('Invalid number');
        }
        while (frac.length < decimals) {
            frac += '0';
        }

        // Convert
        let r = BigInt(whole) * 10n ** BigInt(decimals) + BigInt(frac);
        if (neg) {
            r = -r;
        }
        return r;
    }
}

/**
 * Converts a value from nano units to a string representation with the specified number of decimals.
 *
 * @param {bigint | number | string} src - The source value in nano units. It can be a bigint, number, or string.
 * @param {number} [decimals=9] - The number of decimal places to include in the output string. Defaults to 9.
 * @returns {string} The converted value as a string with the specified number of decimals.
 */
export function fromNano(src: bigint | number | string, decimals: number = 9) {
    let v = BigInt(src);
    let neg = false;
    if (v < 0) {
        neg = true;
        v = -v;
    }

    // Convert fraction
    let frac = v % 10n ** BigInt(decimals);
    let facStr = frac.toString();
    while (facStr.length < decimals) {
        facStr = '0' + facStr;
    }
    facStr = facStr.match(/^([0-9]*[1-9]|0)(0*)/)![1];

    // Convert whole
    let whole = v / 10n ** BigInt(decimals);
    let wholeStr = whole.toString();

    // Value
    let value = `${wholeStr}${facStr === '0' ? '' : `.${facStr}`}`;
    if (neg) {
        value = '-' + value;
    }

    return value;
}
