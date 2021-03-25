import { FC } from 'react';

const Icons: FC<{ fill: string; width?: number; height?: number }> = ({
  fill = '#848484',
  width = 30,
  height = 30,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 52 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="16" height="13" fill={fill} />
      <rect y="17" width="16" height="13" fill={fill} />
      <rect x="36" width="16" height="13" fill={fill} />
      <rect x="36" y="17" width="16" height="13" fill={fill} />
      <rect x="18" width="16" height="13" fill={fill} />
      <rect x="18" y="17" width="16" height="13" fill={fill} />
    </svg>
  );
};

export default Icons;
