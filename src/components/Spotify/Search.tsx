import { FC } from 'react';
import styled from 'styled-components/macro';

import StickyBar from './StickyBar';
import useTransitionHeader from './hooks/useTransitionHeader';

const Search: FC = () => {
  const intersectRef = useTransitionHeader({
    backgroundColor: 'rgb(0,0,0)',
    text: '',
  });
  return (
    <Wrapper>
      <StickyBar />
    </Wrapper>
  );
};

const Wrapper = styled.div``;

export default Search;
