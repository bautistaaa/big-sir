import { useEffect, useState } from 'react';
import ColorThief from 'colorthief';

const colorThief = new ColorThief();
const convertToRgb = (rgb: number[]) =>
  `rgb(${rgb?.[0]},${rgb?.[1]}, ${rgb?.[2]} )`;

const useImageColors = (imageSource: string) => {
  const [colors, setColors] = useState<[primary: string, random: string]>([
    'rgb(0,0,0)',
    'rgb(0,0,0)',
  ]);

  useEffect(() => {
    const downloadedImg = new Image();
    let primary = [0, 0, 0];

    const imageReceived = () => {
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

      setColors([convertToRgb(primary), convertToRgb(randomHeroColor)]);
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
