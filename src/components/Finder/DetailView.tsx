import { FC, useState } from 'react';
import styled from 'styled-components/macro';
import { FileIconMap } from '.';
import { File, Contents } from '../../shared/fileDirectory';
import { useAppContext } from '../../AppContext';

const DetailView: FC<{ files: Contents }> = ({ files }) => {
  const { send } = useAppContext();
  const [content, setContent] = useState<File | undefined>();
  return (
    <Wrapper>
      <SideBar>
        {Object.keys(files).map((k) => {
          const file = typeof files !== 'string' ? files[k] : ({} as File);
          return (
            <Item
              onClick={() => {
                setContent(file);
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
const SideBar = styled.aside`
  height: 100%;
  width: 200px;
  border-right: 1px solid black;
  padding: 5px;
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  margin-bottom: 3px;
  img {
    height: 15px;
    margin-right: 5px;
  }
`;
const ItemName = styled.div`
  color: #ffffff;
  font-size: 12px;
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
  border: 1px solid rgb(75, 75, 75);
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
`;
const Label = styled.label`
  color: rgb(137, 137, 137);
`;
const Date = styled.label``;

export default DetailView;
