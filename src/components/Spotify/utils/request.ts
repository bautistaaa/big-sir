import getToken from '../utils/getToken';
import getAuthHeader from '../utils/getAuthHeader';

const request = async <TResponse>(
  url: string,
  options: RequestInit = {}
): Promise<TResponse> => {
  try {
    const token = getToken();
    const headers: HeadersInit = {
      ...(token ? getAuthHeader(token) : {}),
    };
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();

    return data as TResponse;
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};

export default request;
