import qs from 'query-string';

export const parseAccessToken = (hash: string): string => {
  const parsed = qs.parse(hash);

  return parsed.access_token as string;
};

export default parseAccessToken;
