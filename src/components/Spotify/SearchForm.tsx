import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BiSearch } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';

import { useStickyBarContext } from './StickyBarContext';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import BaseClearButton from '../ClearButton';
import { useService } from '@xstate/react';

const SearchForm: FC = () => {
  const service = useStickyBarContext();
  const [, send] = useService(service);
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebouncedValue(term);

  // TODO: move into search machine (ex: after)
  // https://xstate-catalogue.com/machines/debounce
  useEffect(() => {
    send({ type: 'TERM_CHANGED', term: debouncedTerm });
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
