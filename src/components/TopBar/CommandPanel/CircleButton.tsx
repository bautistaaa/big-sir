import { FC } from 'react';
import styled from 'styled-components';
import { Settings } from './ButtonItem';
import { Airdrop, Bluetooth, Moon, Wifi } from '../icons';

const CircleButton: FC<{ icon: Settings; className?: string }> = ({
  icon,
  className,
}) => {
  const svgMap: { [K in Settings]: JSX.Element } = {
    [Settings.airdrop]: <Airdrop />,
    [Settings.bluetooth]: <Bluetooth />,
    [Settings.dnd]: <Moon />,
    [Settings.wifi]: <Wifi />,
  };

  return <Wrapper className={className}>{svgMap[icon]}</Wrapper>;
};

const Wrapper = styled.div`
  display: flex;
  height: 28px;
  width: 28px;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  background: rgb(26, 109, 196);
`;

export default CircleButton;
