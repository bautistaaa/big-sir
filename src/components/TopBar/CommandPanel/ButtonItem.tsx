import { FC, useState } from 'react';
import styled from 'styled-components/macro';
import CircleButton from './CircleButton';

export enum Settings {
  'airdrop',
  'bluetooth',
  'dnd',
  'wifi',
}
export interface ButtonItemProps {
  type: Settings;
  mainText: string;
  activeText: string;
  inactiveText: string;
}

const ButtonItem: FC<ButtonItemProps> = ({
  type,
  mainText,
  activeText,
  inactiveText,
}) => {
  const [active, setActive] = useState(true);
  return (
    <Wrapper onClick={() => setActive(!active)}>
      <CircleButton icon={type} />
      <TextWrapper>
        <MainText>{mainText}</MainText>
        <StatusText>{active ? activeText : inactiveText}</StatusText>
      </TextWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;
const MainText = styled.div`
  margin-bottom: 3px;
`;
const StatusText = styled.div`
  font-size: 10px;
  color: rgb(173, 172, 172);
`;
const TextWrapper = styled.div`
  margin-left: 7px;
`;

export default ButtonItem;
