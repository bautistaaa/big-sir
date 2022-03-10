import { FC } from 'react';
import styled from 'styled-components';

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
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 12px 0px 12px 8px;
    border-color: transparent transparent transparent rgb(242, 157, 180);
    right: -8px;
  }
`;

export default ModeLine;
