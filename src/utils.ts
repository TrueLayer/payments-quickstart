import qs from 'qs';

export const intoUrlParams = (obj: any) => qs.stringify(obj, { arrayFormat: 'comma' });

// Check object via `typeof` this won't work for complex objects & nulls.
export const isTypeOf = (obj: any, types: string[]) => types.includes(typeof obj);
