import { FC, useState } from 'react';
import styled from 'styled-components';
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
      <CircleButton icon={type} active={active} />
      <TextWrapper>
        <MainText>{mainText}</MainText>
        <StatusText>{active ? activeText : inactiveText}</StatusText>
      </TextWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  cursor: default;
  display: flex;
  align-items: center;
`;
const MainText = styled.div`
  color: ${({ theme }) => theme.color};
  margin-bottom: 3px;
`;
const StatusText = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.commandPanelSubHeader};
`;
const TextWrapper = styled.div`
  margin-left: 7px;
`;

export default ButtonItem;
