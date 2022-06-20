import { useActor } from '@xstate/react';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { FileIconMap } from '.';
import { useAppContext } from '../../AppContext';
import { Contents, File } from '../../shared/fileDirectory';

const IconView: FC<{ files: Contents }> = ({ files }) => {
  const service = useAppContext();
  const [, send] = useActor(service);
  const [active, setActive] = useState('');
  return (
    <Wrapper>
      {Object.keys(files).map((k) => {
        const file = typeof files !== 'string' ? files[k] : ({} as File);
        const isActive = active === k;
        return (
          <Item
            key={file.display}
            onClick={() => {
              setActive(k);
            }}
            onDoubleClick={() => {
              if (file.fileType === 'html') {
                send({
                  type: 'FOCUS_WINDOW',
                  payload: {
                    name: 'chrome',
                    defaultUrl: file.contents as string,
                  },
                });
              } else {
                send({
                  type: 'FOCUS_WINDOW',
                  payload: {
                    name: 'terminal',
                  },
                });
              }
            }}
          >
            <ImageWrapper active={isActive}>
              <img src={FileIconMap['text']} alt="" />
            </ImageWrapper>
            <ItemName active={isActive}>{file.display}</ItemName>
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
const ItemName = styled.span<{ active: boolean }>`
  transition: none;
  color: ${({theme}) => theme.color};
  font-size: 12px;
  word-break: break-all;
  cursor: default;
  ${({ active }) =>
    active &&
    `
    color: white;
    background: rgb(26, 109, 196) !important;
    border-radius: 4px;
    padding: 1px;
    -webkit-box-decoration-break: clone;
    box-shadow: rgb(26, 108, 196) 5px 0px 0px, rgb(26, 109, 196) -5px 0px 0px;
  `}
}
`;
const Item = styled.div`
  transition: none;
  width: 60px;
  text-align: center;
  img {
    width: 100%;
  }
`;
const ImageWrapper = styled.div<{ active: boolean }>`
  transition: none;
  padding: 3px 7px;
  ${({ active }) =>
    active &&
    `
    background: rgba(255,255,255, 0.1);
  `}
`;

export default IconView;
