'use strict';

var makeOrdinal = require('./makeOrdinal');
var isFinite = require('./isFinite');
var isSafeNumber = require('./isSafeNumber');

enum constant {
    TEN = 10,
    ONE_HUNDRED = 100,
    ONE_THOUSAND= 1000,
    ONE_MILLION = 1000000,
    ONE_BILLION = 1000000000,
    ONE_TRILLION = 1000000000000,
    ONE_QUADRILLION = 1000000000000000,
    MAX = 9007199254740992,
}

const LESS_THAN_TWENTY = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
] as const;

const TENTHS_LESS_THAN_HUNDRED = [
    'zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
] as const;

/**
 * Converts an integer into words.
 * If number is decimal, the decimals will be removed.
 * @example toWords(12) => 'twelve'
 * @param {number|string} number
 * @param {boolean} [asOrdinal] - Deprecated, use toWordsOrdinal() instead!
 * @returns {string}
 */
function toWords(number: number | string, asOrdinal: boolean): string {
    let words:string | undefined;
    let num: number;

    if (typeof number === "string") {
        num = parseInt(number, 10);
    } else {
        num = number
    }

    if (!isFinite(num)) {
        throw new TypeError(
            'Not a finite number: ' + number + ' (' + typeof number + ')'
        );
    }
    if (!isSafeNumber(num)) {
        throw new RangeError(
            'Input is not a safe number, it’s either too large or too small.'
        );
    }
    words = generateWords(num);
    return asOrdinal ? makeOrdinal(words) : words;
}

/**
 * Converts an integer into words.
 * If number is decimal, the decimals will be removed.
 * @example toWords(12) => 'twelve'
 * @param {number} number
 * @param words Массив слов, накопленных в рекурсивных вызовах
 * @returns {string}
 */
function generateWords(number: number, words: string[] = []): string | undefined {
    let remainder, word: string

    let floorNumber: number = Math.floor(number)

    // We’re done
    if (floorNumber === 0) {
        return !words ? 'zero' : words.join(' ').replace(/,$/, '');
    }
    // First run
    if (!words) {
        words = [];
    }
    // If negative, prepend “minus”
    if (floorNumber < 0) {
        words.push('minus');
        floorNumber = Math.abs(floorNumber);
    }

    if (floorNumber < 20) {
        remainder = 0;
        word = LESS_THAN_TWENTY[floorNumber];

    } else if (floorNumber < constant.ONE_HUNDRED) {
        remainder = floorNumber % constant.TEN;
        word = TENTHS_LESS_THAN_HUNDRED[Math.floor(floorNumber / constant.TEN)];
        // In case of remainder, we need to handle it here to be able to add the “-”
        if (remainder) {
            word += '-' + LESS_THAN_TWENTY[remainder];
            remainder = 0;
        }

    } else if (floorNumber < constant.ONE_THOUSAND) {
        remainder = floorNumber % constant.ONE_HUNDRED;
        word = generateWords(Math.floor(floorNumber / constant.ONE_HUNDRED)) + ' hundred';

    } else if (floorNumber < constant.ONE_MILLION) {
        remainder = floorNumber % constant.ONE_THOUSAND;
        word = generateWords(Math.floor(floorNumber / constant.ONE_THOUSAND)) + ' thousand,';

    } else if (floorNumber < constant.ONE_BILLION) {
        remainder = floorNumber % constant.ONE_MILLION;
        word = generateWords(Math.floor(floorNumber / constant.ONE_MILLION)) + ' million,';

    } else if (floorNumber < constant.ONE_TRILLION) {
        remainder = floorNumber % constant.ONE_BILLION;
        word = generateWords(Math.floor(floorNumber / constant.ONE_BILLION)) + ' billion,';

    } else if (floorNumber < constant.ONE_QUADRILLION) {
        remainder = floorNumber % constant.ONE_TRILLION;
        word = generateWords(Math.floor(floorNumber / constant.ONE_TRILLION)) + ' trillion,';

    } else if (floorNumber <= constant.MAX) {
        remainder = floorNumber % constant.ONE_QUADRILLION;
        word = generateWords(Math.floor(floorNumber / constant.ONE_QUADRILLION)) +
            ' quadrillion,';
    }
    else {
        throw new Error(`Number ${number} is too large to convert.`);
    }

    if (!word || !remainder) {
        return void null
    }

    words.push(word);
    return generateWords(remainder, words);
}

module.exports = toWords;
