import { FC } from 'react';
import styled from 'styled-components/macro';

const ModeLine: FC<{ mode: string }> = ({ mode }) => {
  return (
    <Wrapper>
      <Mode mode={mode}>{mode}</Mode>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 25px;
  width: 100%;
  background: rgb(68, 68, 68);
`;
const Mode = styled.div<{ mode: string }>`
  color: black;
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 5px;
  text-transform: uppercase;
  background: rgb(242, 157, 180);
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 13px 0 13px 13px;
    border-color: transparent transparent transparent rgb(242, 157, 180);
    right: -12px;
  }
`;

export default ModeLine;
