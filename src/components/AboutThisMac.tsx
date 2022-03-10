import { FC } from 'react';
import styled from 'styled-components/macro';

const AboutThisMac: FC = () => {
  return (
    <Wrapper>
      <TopBar className="action-bar" />
      <Content>
        <Circle>
          <img src="about.jpg" alt="about" />
        </Circle>
        <Text>
          <Name>
            <Strong>macOS</Strong> Big Sir
          </Name>
          <Version>Version 1337</Version>
          <P>MacBooks Are Awful (32-inch, 2087)</P>
          <P>Processor: A very good one</P>
          <P>Memory: A good amount of it</P>
        </Text>
      </Content>
    </Wrapper>
  );
};

const TopBar = styled.div`
  background: ${({theme}) => theme.topBarBackground};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 40px;
`;
const Strong = styled.span`
  font-weight: 500;
`;
const Name = styled.div`
  font-size: 28px;
  line-height: 32px;
  font-weight: 200;
`;
const Version = styled.div`
  font-size: 12px;
  margin-bottom: 20px;
`;
const P = styled.div`
  font-size: 12px;
  margin-bottom: 7px;
`;
const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({theme}) => theme.color};
  background: ${({theme}) => theme.aboutBackground};
  backdrop-filter: blur(72px);
  height: calc(100% - 40px);
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`
const Circle = styled.div`
  height: 150px;
  width: 150px;
  border-radius: 50%;
  border: 7px solid white;
  margin-right: 60px;
  overflow: hidden;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;
const Text = styled.div`
  height: 100%;
  padding-top: 46px;
`;
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export default AboutThisMac;
