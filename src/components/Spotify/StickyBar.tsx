import { useSelector } from '@xstate/react';
import { FC } from 'react';
import styled from 'styled-components/macro';
import { useService } from '@xstate/react';
import { AiFillCaretDown } from 'react-icons/ai';

import { Context, SelectorState, SpotifyEvent } from './spotify.machine';
import { useSpotifyContext } from './SpotifyContext';
import SearchInput from './SearchInput';

const selectHeaderState = (state: SelectorState) => state.context.headerState;
const selectUserProfile = (state: SelectorState) => state.context.userProfile;

const StickyBar: FC = () => {
  const service = useSpotifyContext();
  const [state] = useService<Context, SpotifyEvent>(service);
  const headerState = useSelector(service, selectHeaderState);
  const userProfile = useSelector(service, selectUserProfile);
  return (
    <Wrapper className="action-bar">
      <Background
        background={headerState.backgroundColor}
        opacity={headerState.opacity}
      />
      <ContentWrapper>
        <DynamicContent>
          {state.matches('loggedIn.success.success.search') && (
            <SearchFormWrapper>
              <SearchInput />
            </SearchFormWrapper>
          )}
          {(state.matches('loggedIn.success.success.details.detailsView') ||
            state.matches('loggedIn.success.success.liked')) && (
            <Text opacity={headerState.opacity}>{headerState.text}</Text>
          )}
        </DynamicContent>
        <AccountButton>
          <AccountImage>
            <img src={userProfile?.images?.[0]?.url} alt="" />
          </AccountImage>
          <AccountName>{userProfile?.display_name}</AccountName>
          <AiFillCaretDown style={{ marginLeft: '8px', marginRight: '6px' }} />
        </AccountButton>
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  grid-area: main;
  height: 60px;
  padding: 16px 32px;
  z-index: 100;
  border-top-right-radius: 10px;
`;
const Background = styled.div<{ background: string; opacity: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: -1;
  ${({ background, opacity }) =>
    `
      background: ${background};
      opacity: ${opacity};
    `}
`;
const Text = styled.div<{ opacity: number }>`
  color: #fff;
  font-size: 24px;
  font-weight: 400;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  letter-spacing: 0.5px;
  opacity: 0;
  ${({ opacity }) =>
    `
      opacity: ${opacity};
    `}
`;
const DynamicContent = styled.div``;
const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SearchFormWrapper = styled.div`
  flex: 0 1 364px;
  position: relative;
`;
const AccountButton = styled.button`
  background-color: rgba(0, 0, 0, 0.7);
  border: 0;
  border-radius: 23px;
  color: #fff;
  cursor: pointer;
  height: 32px;
  margin-left: 16px;
  padding: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const AccountImage = styled.figure`
  display: inline-block;
  overflow: hidden;
  position: relative;
  width: 28px;
  height: 28px;
  img {
    border-radius: 50%;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }
`;
const AccountName = styled.div`
  display: inline-block;
  line-height: 28px;
  margin-left: 8px;
  max-width: 110px;
  overflow: hidden;
  pointer-events: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
  text-transform: none;
`;

export default StickyBar;
