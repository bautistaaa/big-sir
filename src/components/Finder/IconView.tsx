import { FC } from 'react';
import styled from 'styled-components/macro';
import { FileIconMap } from '.';
import { useAppContext } from '../../AppContext';
import { Contents, File } from '../../shared/fileDirectory';

const IconView: FC<{ files: Contents }> = ({ files }) => {
  const { send } = useAppContext();
  return (
    <Wrapper>
      {Object.keys(files).map((k) => {
        const file = typeof files !== 'string' ? files[k] : ({} as File);
        return (
          <Item
            key={file.display}
            onDoubleClick={() => {
              if (file.fileType === 'html') {
                send({
                  type: 'FOCUS_WINDOW',
                  payload: {
                    name: 'chrome',
                    defaultUrl: file.contents as string,
                  },
                });
              }
            }}
          >
            <img src={FileIconMap['text']} alt="" />
            <ItemName>{file.display}</ItemName>
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
