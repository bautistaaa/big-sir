import { FC } from 'react';
import styled from 'styled-components';

const SearchInput: FC = () => {
  return (
    <form>
      <Input type="text" />
    </form>
  );
};

const Input = styled.input`
  border: 0;
  border-radius: 500px;
  color: #000;
  height: 40px;
  padding: 6px 48px;
  text-overflow: ellipsis;
  width: 100%;
`;
export default SearchInput;
