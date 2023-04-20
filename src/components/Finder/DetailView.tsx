import { FC, useState } from 'react';
import styled from 'styled-components/macro';
import { FileIconMap } from '.';
import { File, Contents } from '../../shared/fileDirectory';
import { useAppContext } from '../../AppContext';

const DetailView: FC<{ files: Contents }> = ({ files }) => {
  const { send } = useAppContext();
  const [content, setContent] = useState<File | undefined>();
  const [active, setActive] = useState('');

  return (
    <Wrapper>
      <SideBar>
        {Object.keys(files).map((k) => {
          const file = typeof files !== 'string' ? files[k] : ({} as File);
          return (
            <Item
              key={k}
              active={active === k}
              onClick={() => {
                setActive(k);
                setContent(file);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
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
              <img src={FileIconMap[file.fileType]} alt="" />
              <ItemName>{k}</ItemName>
            </Item>
          );
        })}
      </SideBar>
      {content && (
        <DetailsWrapper>
          <Details>
            <Preview>
              <img src={content?.previewImageSrc} alt="" />
            </Preview>
            <Metadata>
              <FileName>{content?.display}</FileName>
              <FileSize>{`${content?.fileType} - ${content?.fileSize} KB`}</FileSize>
            </Metadata>
            <Information>Information</Information>
            <InformationItemWrapper>
              <Label>Created</Label>
              <Date>{content?.created ?? ''}</Date>
            </InformationItemWrapper>
            <InformationItemWrapper>
              <Label>Modified</Label>
              <Date>{content?.modified ?? ''}</Date>
            </InformationItemWrapper>
            <InformationItemWrapper spacingLarge>
              <Label>Last Opened</Label>
              <Date>{content?.lastOpened ?? ''}</Date>
            </InformationItemWrapper>
          </Details>
        </DetailsWrapper>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;
const SideBar = styled.aside<{ theme: any }>`
  height: 100%;
  width: 150px;
  border-right: 1px solid ${({ theme }) => theme.finderDetailsBorder};
  padding: 5px;
  flex-shrink: 0;
`;
const ItemName = styled.div`
  font-size: 12px;
  padding: 3px;
  transition: none;
`;
const Item = styled.div<{ active: boolean }>`
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 3px;
  transition: none;
  img {
    height: 15px;
    margin-right: 5px;
  }
  ${({ active }) =>
    active &&
    `
    background: rgb(26, 109, 196) !important;
    ${ItemName} {
      color: white;
    }
  `}
`;
const DetailsWrapper = styled.div`
  overflow: auto;
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;
const Details = styled.div``;
const Preview = styled.div`
  background: rgb(30, 30, 30);
  border: 1px solid ${({ theme }) => theme.finderDetailsBorder};
  border-radius: 10px;
  overflow: hidden;
  height: 250px;
  width: 300px;
  margin-bottom: 25px;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;
const Metadata = styled.div`
  color: rgb(222, 222, 222);
`;
const FileName = styled.div`
  margin-bottom: 8px;
`;
const FileSize = styled.div`
  font-size: 12px;
  color: rgb(137, 137, 137);
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(94, 94, 94);
  margin-bottom: 10px;
`;
const Information = styled.div`
  color: rgb(222, 222, 222);
  font-size: 14px;
  margin-bottom: 10px;
`;
const InformationItemWrapper = styled.div<{ spacingLarge?: boolean }>`
  color: rgb(222, 222, 222);
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  border-bottom: 1px solid rgb(61, 61, 61);
  ${({ spacingLarge }) =>
    spacingLarge
      ? `
  padding-bottom: 13px;
  `
      : `
  padding-bottom: 2px;
  `}
  &:last-child {
    border-bottom: none;
  }
`;
const Label = styled.label`
  color: rgb(137, 137, 137);
`;
const Date = styled.label``;

export default DetailView;
