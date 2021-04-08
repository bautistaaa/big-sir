import { FC } from 'react';

const Icons: FC<{ width?: number; height?: number }> = ({
  width = 15,
  height = 15,
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 22 22">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-500.000000, -547.000000)" fill="#D8D8D8">
          <g id="Group" transform="translate(500.000000, 547.000000)">
            <path
              fill="white"
              d="M10,0 L10,10 L0,10 L0,0 L10,0 Z M9,1 L1,1 L1,9 L9,9 L9,1 Z"
              id="Combined-Shape"
            ></path>
            <path
              fill="white"
              d="M22,0 L22,10 L12,10 L12,0 L22,0 Z M21,1 L13,1 L13,9 L21,9 L21,1 Z"
              id="Combined-Shape-Copy"
            ></path>
            <path
              fill="white"
              d="M22,12 L22,22 L12,22 L12,12 L22,12 Z M21,13 L13,13 L13,21 L21,21 L21,13 Z"
              id="Combined-Shape-Copy-2"
            ></path>
            <path
              fill="white"
              d="M10,12 L10,22 L0,22 L0,12 L10,12 Z M9,13 L1,13 L1,21 L9,21 L9,13 Z"
              id="Combined-Shape-Copy-3"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Icons;
