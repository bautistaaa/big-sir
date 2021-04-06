import { FC } from 'react';
import styled from 'styled-components';
import { Settings } from './ButtonItem';
import { Airdrop, Bluetooth, Moon, Wifi } from '../icons';

const CircleButton: FC<{
  icon: Settings;
  active: boolean;
  className?: string;
}> = ({ icon, className, active }) => {
  const svgMap: { [K in Settings]: JSX.Element } = {
    [Settings.airdrop]: <Airdrop />,
    [Settings.bluetooth]: <Bluetooth />,
    [Settings.dnd]: <Moon />,
    [Settings.wifi]: <Wifi />,
  };

  return (
    <Wrapper active={active} icon={icon} className={className}>
      {svgMap[icon]}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ active: boolean; icon: Settings }>`
  display: flex;
  height: 28px;
  width: 28px;
  border-radius: 100%;
  align-items: center;
  justify-content: center;

  background: ${({ active, icon }) =>
    active
      ? icon === Settings.dnd
        ? 'rgb(94, 92, 230)'
        : 'rgb(26, 109, 196)'
      : 'rgb(75, 72, 77)'};
`;

export default CircleButton;
