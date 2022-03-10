import { FC, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { IoLogoTwitch } from 'react-icons/io';
import { ImGithub } from 'react-icons/im';
import { GrTwitter } from 'react-icons/gr';

const AboutThisDeveloper: FC = () => {
  const themeContext = useContext(ThemeContext);
  return (
    <Wrapper>
      <TopBar className="action-bar" />
      <Content>
        <Circle>
          <img src="me.png" alt="about" />
        </Circle>
        <Text>
          <Name>
            <Strong>Chris</Strong> Bautista
          </Name>
          <Version>Software Engineer</Version>
          <P>Los Angeles, CA</P>
          <Socials>
            <Link href="https://www.twitch.tv/trash_dev" target="_blank">
              <IoLogoTwitch fill={themeContext.color} size={20} />
            </Link>
            <Link href="https://www.github.com/bautistaaa" target="_blank">
              <ImGithub fill={themeContext.color} size={20} />
            </Link>
            <Link href="https://twitter.com/chrisbautistaaa" target="_blank">
              <GrTwitter fill={themeContext.color} size={20} />
            </Link>
          </Socials>
        </Text>
      </Content>
    </Wrapper>
  );
};

const Socials = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
`;
const Link = styled.a`
  text-decoration: none;
  margin-right: 10px;
`;
const TopBar = styled.div`
  background: ${({ theme }) => theme.topBarBackground};
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
  color: ${({ theme }) => theme.color};
  background: ${({ theme }) => theme.aboutBackground};
  backdrop-filter: blur(72px);
  height: calc(100% - 40px);
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;
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

export default AboutThisDeveloper;
