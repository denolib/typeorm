import { Sha256 } from "../../vendor/https/deno.land/std/hash/sha256.ts";

/**
 * Converts string into camelCase.
 *
 * @see http://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 */
export function camelCase(str: string, firstCapital: boolean = false): string {
    return str.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
        if (firstCapital === true && offset === 0) return p1;
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
}

/**
 * Converts string into snake-case.
 *
 * @see https://regex101.com/r/QeSm2I/1
 */
export function snakeCase(str: string) {
    return str.replace(/(?:([a-z])([A-Z]))|(?:((?!^)[A-Z])([a-z]))/g, "$1_$3$2$4").toLowerCase();
}

/**
 * Converts string into title-case.
 *
 * @see http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 */
export function titleCase(str: string): string {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

/**
 * Builds abbreviated string from given string;
 */
export function abbreviate(str: string, abbrLettersCount: number = 1): string {
    const words = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, "$1 $2").split(" ");
    return words.reduce((res, word) => {
        res += word.substr(0, abbrLettersCount);
        return res;
    }, "");
}

export interface IShortenOptions {
    /** String used to split "segments" of the alias/column name */
    separator?: string;
    /** Maximum length of any "segment" */
    segmentLength?: number;
    /** Length of any "term" in a "segment"; "OrderItem" is a segment, "Order" and "Items" are terms */
    termLength?: number;
  }

  /**
   * Shorten a given `input`. Useful for RDBMS imposing a limit on the
   * maximum length of aliases and column names in SQL queries.
   *
   * @param input String to be shortened.
   * @param options Default to `4` for segments length, `2` for terms length, `'__'` as a separator.
   *
   * @return Shortened `input`.
   *
   * @example
   * // returns: "UsShCa__orde__mark__dire"
   * shorten('UserShoppingCart__order__market__director')
   *
   * // returns: "cat_wit_ver_lon_nam_pos_wit_ver_lon_nam_pos_wit_ver_lon_nam"
   * shorten(
   *   'category_with_very_long_name_posts_with_very_long_name_post_with_very_long_name',
   *   { separator: '_', segmentLength: 3 }
   * )
   *
   * // equals: UsShCa__orde__mark_market_id
   * `${shorten('UserShoppingCart__order__market')}_market_id`
   */
  export function shorten(input: string, options: IShortenOptions = {}): string {
    const { segmentLength = 4, separator = "__", termLength = 2 } = options;

    const segments = input.split(separator);
    const shortSegments = segments.reduce((acc: string[], val: string) => {
        // split the given segment into many terms based on an eventual camel cased name
        const segmentTerms = val.replace(/([a-z\xE0-\xFF])([A-Z\xC0-\xDF])/g, "$1 $2").split(" ");
        // "OrderItemList" becomes "OrItLi", while "company" becomes "comp"
        const length = segmentTerms.length > 1 ? termLength : segmentLength;
        const shortSegment = segmentTerms.map(term => term.substr(0, length)).join("");

        acc.push(shortSegment);
        return acc;
    }, []);

    return shortSegments.join(separator);
  }

interface IHashOptions {
    length?: number;
}

/**
 * Returns a hashed input.
 *
 * @param input String to be hashed.
 * @param options.length Optionally, shorten the output to desired length.
 */
export function hash(input: string, options: IHashOptions = {}): string {
    const sha256 = new Sha256();
    sha256.update(input);
    const hashedInput = sha256.hex();

    if (options.length) {
        return hashedInput.slice(0, options.length);
    }

    return hashedInput;
  }
