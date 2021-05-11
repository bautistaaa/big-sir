import { FC } from 'react';

const List: FC<{ fill: string }> = ({ fill }) => {
  return (
    <svg width="15px" height="15px" viewBox="0 0 22 22">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-528.000000, -547.000000)" fill={fill}>
          <g id="Group-2" transform="translate(528.000000, 547.000000)">
            <rect
              id="Rectangle"
              fill={fill}
              x="0"
              y="0"
              width="4"
              height="4"
            ></rect>
            <rect
              id="Rectangle-Copy"
              fill={fill}
              x="6"
              y="0"
              width="16"
              height="4"
            ></rect>
            <rect
              id="Rectangle-Copy-8"
              fill={fill}
              x="6"
              y="6"
              width="16"
              height="4"
            ></rect>
            <rect
              id="Rectangle-Copy-9"
              fill={fill}
              x="6"
              y="12"
              width="16"
              height="4"
            ></rect>
            <rect
              id="Rectangle-Copy-10"
              fill={fill}
              x="6"
              y="18"
              width="16"
              height="4"
            ></rect>
            <rect
              fill={fill}
              id="Rectangle-Copy-4"
              x="0"
              y="6"
              width="4"
              height="4"
            ></rect>
            <rect
              id="Rectangle-Copy-5"
              x="0"
              y="12"
              fill={fill}
              width="4"
              height="4"
            ></rect>
            <rect
              id="Rectangle-Copy-6"
              x="0"
              y="18"
              fill={fill}
              width="4"
              height="4"
            ></rect>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default List;
