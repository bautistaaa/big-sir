import { FC } from 'react';
import styled from 'styled-components/macro';
import { File, FileIconMap } from '.';

const ListView: FC<{ files: File[] }> = ({ files }) => {
  return (
    <Wrapper>
      <List>
        {files.map((file: File) => {
          return (
            <ListItem key={file.name}>
              <img src={FileIconMap[file.type]} alt="" />
              <ItemName>{file.name}</ItemName>
            </ListItem>
          );
        })}
      </List>
    </Wrapper>
  );
};
const Wrapper = styled.div``;
const List = styled.ul``;
const ListItem = styled.li`
  padding-left: 15px;
  display: flex;
  align-items: center;
  height: 20px;
  &:nth-child(odd) {
    background: rgb(51, 51, 51);
  }
  &:nth-child(even) {
    background: rgb(41, 41, 41);
  }
  img {
    width: 15px;
    margin-right: 4px;
  }
`;
const ItemName = styled.div`
  display: inline-block;
  color: white;
  font-size: 12px;
`;
export default ListView;
