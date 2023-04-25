import { FC } from 'react';
import styled from 'styled-components';

const CommandLine: FC<{ command: string }> = ({ command }) => {
  return <Wrapper>{command}</Wrapper>;
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 25px;
  width: 100%;
`;

export default CommandLine;
