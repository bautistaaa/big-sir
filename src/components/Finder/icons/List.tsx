import { FC } from 'react';

const List: FC<{ stroke: string }> = ({ stroke = '#848484' }) => {
  return (
    <svg
      width="17"
      height="10"
      viewBox="0 0 17 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line y1="0.5" x2="17" y2="0.5" stroke={stroke} />
      <line y1="9.5" x2="17" y2="9.5" stroke={stroke} />
      <line y1="6.5" x2="17" y2="6.5" stroke={stroke} />
      <line y1="3.5" x2="17" y2="3.5" stroke={stroke} />
    </svg>
  );
};

export default List;
