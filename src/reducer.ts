export const ENERGY_CHANGED = 'energyChanged';
export const KEY_CHANGED = 'keyChanged';
export const TEMPO_CHANGED = 'tempoChanged';
export const VALENCE_CHANGED = 'valenceChanged';
export const TYPE_CHANGED = 'typeChanged';

export type Action =
  | { type: typeof ENERGY_CHANGED; payload: number }
  | { type: typeof KEY_CHANGED; payload: number }
  | { type: typeof TEMPO_CHANGED; payload: number }
  | { type: typeof TYPE_CHANGED; payload: number }
  | { type: typeof VALENCE_CHANGED; payload: number };

export function reducer(state: AudioFeature, action: Action) {
  switch (action.type) {
    case ENERGY_CHANGED:
      return {
        ...state,
        energy: action.payload,
      };
    case KEY_CHANGED:
      return {
        ...state,
        key: action.payload,
      };
    case TEMPO_CHANGED:
      return {
        ...state,
        tempo: action.payload,
      };
    case VALENCE_CHANGED:
      return {
        ...state,
        valence: action.payload,
      };
    case TYPE_CHANGED:
      return {
        ...state,
        type: action.payload,
      };
    default:
      throw new Error();
  }
}
