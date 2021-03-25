import { FC } from 'react';
import styled from 'styled-components/macro';
import { File, FileIconMap } from '.';

const DetailView: FC<{ files: File[] }> = ({ files }) => {
  return (
    <Wrapper>
      <SideBar>
        {files.map((file) => {
          return (
            <Item>
              <img src={FileIconMap[file.type]} alt="" />
              <ItemName>{file.name}</ItemName>
            </Item>
          );
        })}
      </SideBar>
      <DetailsWrapper>
        <Details>
          <Preview></Preview>
          <Metadata>
            <FileName>Resume.js</FileName>
            <FileSize>JavaScript script - 6 KB</FileSize>
          </Metadata>
          <Information>Information</Information>
          <InformationItemWrapper>
            <Label>Created</Label>
            <Date>Wednesday, August 26, 2020 at 10:01 AM</Date>
          </InformationItemWrapper>
          <InformationItemWrapper>
            <Label>Modified</Label>
            <Date>Wednesday, August 26, 2020 at 10:01 AM</Date>
          </InformationItemWrapper>
          <InformationItemWrapper spacingLarge>
            <Label>Last Opened</Label>
            <Date>Wednesday, August 26, 2020 at 10:01 AM</Date>
          </InformationItemWrapper>
        </Details>
      </DetailsWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;
const SideBar = styled.aside`
  height: 100%;
  width: 150px;
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
  padding: 3px;
  height: 250px;
  width: 300px;
  margin-bottom: 25px;
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
