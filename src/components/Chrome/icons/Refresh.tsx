import { FC } from 'react';

const Refresh: FC<{className?: string}> = ({ className = '' }) => {
  return (
    <svg
      className={`${className}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="white"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5"></path>
    </svg>
  );
};

export default Refresh;
