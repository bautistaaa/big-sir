import styled from 'styled-components';
import { login } from './utils';

const LoginScreen = () => {
  return (
    <Wrapper>
      <DraggableBar className="action-bar" />
      <Header>
        Hi!&nbsp;
        <Blurb>
          Please login by clicking the button below. The app will refresh and
          you will need to reopen Spotify again.
        </Blurb>
        <div>
          <LoginButton onClick={() => login()}>Login</LoginButton>
        </div>
      </Header>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 100px;
`;
const DraggableBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
`;
const Header = styled.div`
  font-size: 40px;
  font-family: inherit;
`;
const Blurb = styled.span`
  font-size: 32px;
  font-family: inherit;
  font-weight: 300;
`;
const LoginButton = styled.button`
  cursor: pointer;
  margin-top: 20px;
  font-family: inherit;
  font-size: 30px;
  background-color: #1db954;
  color: white;
  border-radius: 500px;
  padding: 8px 48px;
  outline: none;
  border: none;
`;

export default LoginScreen;
