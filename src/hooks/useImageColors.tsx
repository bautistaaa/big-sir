import { useEffect, useState } from 'react';
import ColorThief from 'colorthief';

type ConvertedColors = [primary: string, random: string];

const colorThief = new ColorThief();
const performed = new Map<string, ConvertedColors>();

const convertToRgb = (rgb: number[]) =>
  `rgb(${rgb?.[0]},${rgb?.[1]}, ${rgb?.[2]} )`;
const useImageColors = (imageSource: string) => {
  const [colors, setColors] = useState<ConvertedColors>([
    'rgb(0,0,0)',
    'rgb(0,0,0)',
  ]);

  useEffect(() => {
    if (performed.has(imageSource)) {
      setColors(performed.get(imageSource)!);
      return;
    }
    const downloadedImg = new Image();
    let primary = [0, 0, 0];

    const imageReceived = () => {
      console.log('fuck');
      const validColors = colorThief
        .getPalette(downloadedImg)
        .filter(
          (color) => color?.[0] < 200 && color?.[1] < 200 && color?.[2] < 200
        );

      if (validColors.length) {
        primary = validColors[0];
      }

      const randomHeroColor =
        validColors[Math.floor(validColors.length * Math.random())];
      const convertedColors: ConvertedColors = [
        convertToRgb(primary),
        convertToRgb(randomHeroColor),
      ];
      performed.set(imageSource, convertedColors);
      setColors(convertedColors);
    };

    downloadedImg.crossOrigin = 'Anonymous';
    downloadedImg.src = imageSource;

    downloadedImg.addEventListener('load', imageReceived, false);
    return () => {
      downloadedImg.removeEventListener('load', imageReceived, false);
    };
  }, [imageSource, setColors]);

  return colors;
};

export default useImageColors;
