import qs from 'qs';

export const intoUrlParams = (obj: any) => qs.stringify(obj, { arrayFormat: 'comma' });

interface KeyPair {
  [propName: string]: any;
}

// Build a new object from another only including matched `include` key values.
export const include = <T = KeyPair>(obj: KeyPair, include: string[]): T =>
  include.reduce((collection: KeyPair, key: string) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      collection[key] = obj[key];
    }

    return collection;
  }, {}) as T;

// Check object via `typeof` this won't work for complex objects & nulls.
export const isTypeOf = (obj: any, types: string[]) => types.includes(typeof obj);
