import { useRef } from 'react';
import { BsArrowRightCircle } from 'react-icons/bs';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import styled, { css, keyframes } from 'styled-components';
import { FormEvent, useEffect, useState } from 'react';
import { useAppContext } from './AppContext';
import { useActor, useMachine } from '@xstate/react';
import ClearButton from './components/ClearButton';
import { loginMachine } from './login.machine';

export const LoggedOutView = () => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const service = useAppContext();
  const [, sendParent] = useActor(service);
  const [state, send] = useMachine(loginMachine);
  const password = state.context.password;
  const [active, setActive] = useState(false);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send({ type: 'SUBMIT' });
  };

  const handleBsArrowRightCircleSubmit = () => {
    if (submitButtonRef.current) {
      submitButtonRef.current.click();
    }
  };

  useEffect(() => {
    const clickHandler = () => {
      setActive(true);
    };

    window.addEventListener('click', clickHandler);

    return () => window.removeEventListener('click', clickHandler);
  }, []);

  // this is definitely NOT how to do this
  useEffect(() => {
    if (state.value === 'valid') {
      sendParent({ type: 'TOGGLE_AUTHENTICATION' });
    }
  }, [state.value, sendParent]);

  return (
    <Main>
      <InnerWrapper>
        <PasswordContainer>
          <Circle>
            <img src="about.jpg" alt="about" />
          </Circle>
          <Name>root/admin</Name>
          <FormWrapper>
            {active && (
              <form onSubmit={handleSubmit}>
                <InputWrapper>
                  <Input
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => {
                      send({
                        type: 'PASSWORD_UPDATE',
                        payload: { password: e.target.value },
                      });
                    }}
                    invalid={state.matches('invalid')}
                    autoFocus
                  />
                  {password && (
                    <>
                      <BsArrowRightCircle
                        fill="#fff"
                        size={20}
                        style={{
                          position: 'absolute',
                          top: '7px',
                          right: '10px',
                        }}
                        onClick={handleBsArrowRightCircleSubmit}
                      />
                      <HiddenSubmitButton type="submit" ref={submitButtonRef}>
                        Log In
                      </HiddenSubmitButton>
                    </>
                  )}
                </InputWrapper>
              </form>
            )}
          </FormWrapper>
          <EnterPassword>Enter Password</EnterPassword>
        </PasswordContainer>

        <ActionButtonContainer>
          <CancelCircle
            onClick={(e) => {
              e.stopPropagation();
              setActive(false);
            }}
          >
            <AiOutlineCloseCircle fill="rgba(255, 255, 255, 0.7)" size={20} />
          </CancelCircle>
          <Cancel>
            <span>Cancel</span>
          </Cancel>
        </ActionButtonContainer>
      </InnerWrapper>
    </Main>
  );
};

const HiddenSubmitButton = styled.button`
  display: none;
`;

const Name = styled.div`
  color: white;
  margin-bottom: 20px;
  text-shadow: 0px 2px 2px #000000;
`;
const EnterPassword = styled(Name)`
  font-size: 12px;
`;
const Cancel = styled.div`
  user-select: none;
  color: white;
  text-shadow: 0px 2px 2px #000000;
`;

const InputWrapper = styled.div`
  position: relative;
`;
const Input = styled.input<{ invalid: boolean }>`
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  backdrop-filter: blur(72px);
  height: 35px;
  outline: none;
  padding-left: 20px;
  color: white;
  &::placeholder {
    color: inherit;
  }
  animation: ${({ invalid }) =>
    invalid &&
    css`
      ${jiggle} .5s linear;
    `};
`;
const PasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
const ActionButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 50px 0;
`;
const Circle = styled.div`
  height: 150px;
  width: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;
const CancelCircle = styled(ClearButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(72px);
  margin-bottom: 5px;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.7);
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    font-weight: 100;
    span {
      position: relative;
      bottom: 1px;
    }
  }
`;
const jiggle = keyframes`
  8%, 41% {
    transform: translateX(-10px);
  }
  25%, 58% {
    transform: translateX(10px);
  }
  75% {
    transform: translateX(-5px);
  }
  92% {
    transform: translateX(5px);
  }
  0%, 100% {
    transform: translateX(0);
  }
`;
const Main = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;
const InnerWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
`;
const FormWrapper = styled.div`
  height: 40px;
  margin-bottom: 15px;
`;
