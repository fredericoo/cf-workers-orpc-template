import * as v from 'valibot';

/** Strings that can be converted to numbers */
export const vNumeric = v.union([v.number(), v.pipe(v.string(), v.minLength(1), v.transform(Number), v.number())]);

const TRUTHY_STRINGS = ['on', 'true', '1'];
const TRUTHY_NUMBERS = [1];

/** Accepts loose boolean values like "on", "true", "1", 1, true, etc. */
export const vBooleanish = v.union([
	v.boolean(),
	v.pipe(
		v.string(),
		v.transform((val) => TRUTHY_STRINGS.includes(val)),
	),
	v.pipe(
		v.number(),
		v.transform((val) => TRUTHY_NUMBERS.includes(val)),
	),
]);

export const vDateString = v.pipe(
	v.string(),
	v.check(
		(s) => !Number.isNaN(new Date(s).getTime()),
		'Invalid date format. Expected ISO 8601 string. Example: 2025-01-01T00:00:00.000Z',
	),
);
