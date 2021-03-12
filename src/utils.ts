import qs from 'qs';

export const intoUrlParams = (obj: any) => qs.stringify(obj, { arrayFormat: 'comma' });
