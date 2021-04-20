import { WindowPosition } from '../components/Window';
/**
 * Extract the x and y from the transform style of the base element using Regex
 * Why using this hacking method:
 * react-rnd uses transform and translate to shift window around instead of top
 * and left and it does not provide the access to x and y values from ref
 * @param transformStyle The transform style string. e.g. translate(1123.75px, 7px)
 * @returns The window position. e.g. { x: 1123.75, y: 7 }
 */
const extractPositionFromTransformStyle = (
  transformStyle: string
): WindowPosition => {
  const matched = transformStyle.matchAll(/[0-9.]+/g);
  try {
    return {
      x: Number(matched.next().value[0]),
      y: Number(matched.next().value[0]),
    };
  } catch {
    return { x: 0, y: 0 };
  }
};

export default extractPositionFromTransformStyle;
