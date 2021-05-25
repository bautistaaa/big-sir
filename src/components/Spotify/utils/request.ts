import getToken from '../utils/getToken';
import getAuthHeader from '../utils/getAuthHeader';

const request = async <T extends unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const token = getToken();
    const headers: HeadersInit = {
      ...(token ? getAuthHeader(token) : {}),
    };
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();

    return data;
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};

export default request;

