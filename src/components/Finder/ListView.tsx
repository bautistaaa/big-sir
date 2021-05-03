import { FC } from 'react';
import styled from 'styled-components/macro';
import { FileIconMap } from '.';
import { useAppContext } from '../../AppContext';
import { File, Contents } from '../../shared/fileDirectory';
import { formatDate } from '../../utils';

const ListView: FC<{ files: Contents }> = ({ files }) => {
  const { send } = useAppContext();
  return (
    <Wrapper>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Kind</th>
            <th>Date Last Opened</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(files).map((k) => {
            const file = typeof files !== 'string' ? files[k] : ({} as File);
            return (
              <tr
                key={k}
                onClick={() => {
                  send({
                    type: 'FOCUS_WINDOW',
                    payload: {
                      name: 'chrome',
                      defaultUrl: file.contents as string,
                    },
                  });
                }}
              >
                <td>
                  <ListItem>
                    <img src={FileIconMap[file.fileType]} alt="" />
                    <ItemName>{k}</ItemName>
                  </ListItem>
                </td>
                <td>{file.fileType}</td>
                <td>{formatDate(new Date())}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <List></List>
    </Wrapper>
  );
};
const Table = styled.table`
  color: white;
  th {
    text-align: left;
    text-transform: capitalize;
    font-size: 10px;
    padding: 7px;
    color: rgb(177, 177, 177);
    border-collapse: collapse;
    border-bottom: 1px solid rgb(177, 177, 177);
    width: 10%;
    &:nth-child(1) {
      padding-left: 35px;
      width: 30%;
    }
    &:not(:last-child) {
      border-right: 1px solid rgb(177, 177, 177);
    }
  }

  tr > td {
    color: rgb(177, 177, 177);
    font-size: 12px;
    vertical-align: middle;
  }

  tbody > tr {
    &:nth-child(odd) {
      background: rgb(51, 51, 51);
    }
    &:nth-child(even) {
      background: rgb(41, 35, 38);
    }
  }
`;
const Wrapper = styled.div`
  height: 100%;
  background: repeating-linear-gradient(
      rgb(41, 35, 38),
      rgb(41, 35, 38) 19px,
      rgb(51, 51, 51) 0,
      rgb(51, 51, 51) 38px
    )
    left 0 top 132px no-repeat fixed;
`;
const List = styled.ul``;
const ListItem = styled.li`
  padding-left: 15px;
  display: flex;
  align-items: center;
  height: 20px;
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
