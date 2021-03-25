import { FC } from 'react';
import styled from 'styled-components/macro';
import { File, FileIconMap } from '.';

const IconView: FC<{ files: File[] }> = ({ files }) => {
  return (
    <Wrapper>
      {files.map((file: File) => {
        return (
          <Item key={file.name}>
            <img src={FileIconMap[file.type]} alt="" />
            <ItemName>{file.name}</ItemName>
          </Item>
        );
      })}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, 70px);
  padding: 15px;
`;
const Item = styled.div`
  width: 60px;
  text-align: center;
  img {
    width: 100%;
  }
`;
const ItemName = styled.div`
  color: white;
  font-size: 12px;
`;

export default IconView;
