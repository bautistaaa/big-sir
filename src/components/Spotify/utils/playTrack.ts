import { getToken } from '../utils';

const playTrack = async ({
  method,
  deviceId,
  body,
}: {
  method: string;
  deviceId: string;
  body: unknown;
}) => {
  try {
    const token = getToken();
    const resp = await fetch(
      `https://api.spotify.com/v1/me/player/${method}?device_id=${deviceId}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!resp.ok) {
      throw new Error('shit!');
    }
  } catch (e) {
    console.error(e);
  }
};

export default playTrack;
