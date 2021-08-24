import { useMachine } from '@xstate/react';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BiSearch } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';

import searchMachine from './Search/search.machine';
import spotifyConfig from '../../shared/config';
import { request } from './utils';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import BaseClearButton from '../ClearButton';

const SearchForm: FC = () => {
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebouncedValue(term);

  const [state, send] = useMachine(searchMachine, {
    devTools: true,
    actions: {
      fetchResults: async () => {
        try {
          const queryParam = new URLSearchParams({
            query: term,
          });
          const SEARCH_URL = `${spotifyConfig.apiUrl}/search?${queryParam}&offset=0&limit=20&type=album,track,artist`;
          const data: SpotifyApi.SearchResponse = await request(SEARCH_URL);

          send({ type: 'RESOLVE', results: data });
        } catch (e) {
          send({ type: 'REJECT', message: e?.message });
        }
      },
    },
  });
  console.log({ context: state.context });

  useEffect(() => {
    // could just be a guard?
    if (debouncedTerm) {
      send({ type: 'FETCH' });
    }
  }, [debouncedTerm, send]);

  return (
    <SearchFormWrapper onMouseDown={(e) => e.stopPropagation()}>
      <form>
        <Input
          placeholder="Artists or songs"
          type="text"
          value={term}
          onChange={(e) => {
            e.preventDefault();
            setTerm(e.target.value);
          }}
        />
      </form>
      <Overlay>
        <SvgWrapper>
          <BiSearch size={24} />
        </SvgWrapper>
        {term && (
          <ClearButton onClick={() => setTerm('')}>
            <IoMdClose size={24} />
          </ClearButton>
        )}
      </Overlay>
    </SearchFormWrapper>
  );
};

const ClearButton = styled(BaseClearButton)`
  cursor: default;
  pointer-events: auto;
`;
const SearchFormWrapper = styled.div`
  flex: 0 1 364px;
  position: relative;
`;
const Input = styled.input`
  border: 0;
  border-radius: 500px;
  color: #000;
  height: 40px;
  padding: 6px 48px;
  text-overflow: ellipsis;
  width: 100%;
  font-size: 14px;
  outline: none;
`;
const Overlay = styled.div`
  display: flex;
  align-items: center;
  pointer-events: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 12px;
  right: 12px;
`;
const SvgWrapper = styled.span`
  color: #121212;
  flex: 1;
`;

export default SearchForm;
