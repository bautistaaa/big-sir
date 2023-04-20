import { FC } from 'react';

const Arrow: FC<{ fill: string; transform?: string }> = ({
  fill,
  transform,
}) => {
  return (
    <svg
      viewBox="2 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      transform={transform}
    >
      <g strokeWidth="0"></g>
      <g strokeLinecap="round" strokeLinejoin="round"></g>
      <g>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g fill={fill} fillRule="nonzero">
            <path d="M12.2196699,6.03033009 C11.9267767,5.73743687 11.9267767,5.26256313 12.2196699,4.96966991 C12.5125631,4.6767767 12.9874369,4.6767767 13.2803301,4.96966991 L17.7803301,9.46966991 C18.0732233,9.76256313 18.0732233,10.2374369 17.7803301,10.5303301 L13.2803301,15.0303301 C12.9874369,15.3232233 12.5125631,15.3232233 12.2196699,15.0303301 C11.9267767,14.7374369 11.9267767,14.2625631 12.2196699,13.9696699 L16.1893398,10 L12.2196699,6.03033009 Z"></path>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Arrow;
