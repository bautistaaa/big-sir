import { FC, useState } from 'react';
import styled from 'styled-components/macro';
import { FileIconMap } from '.';
import { useAppContext } from '../../AppContext';
import { File, Contents } from '../../shared/fileDirectory';
import { formatDate } from '../../utils';

const ListView: FC<{ files: Contents }> = ({ files }) => {
  const { send } = useAppContext();
  const [active, setActive] = useState('');

  return (
    <Wrapper count={Object.keys(files).length}>
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
              <TR
                key={k}
                active={active === file.display}
                onClick={() => setActive(k)}
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
                <td>
                  <ListItem>
                    <img src={FileIconMap[file.fileType]} alt="" />
                    <ItemName>{k}</ItemName>
                  </ListItem>
                </td>
                <td>{file.fileType}</td>
                <td>{formatDate(new Date())}</td>
              </TR>
            );
          })}
        </tbody>
      </Table>
      <List></List>
    </Wrapper>
  );
};
const TR = styled.tr<{ active: boolean }>`
  ${({ active }) =>
    active &&
    `
    background: rgb(26, 109, 196) !important;
  `}
`;
const Table = styled.table`
  color: white;
  th {
    text-align: left;
    text-transform: capitalize;
    font-size: 10px;
    padding: 7px;
    color: rgb(177, 177, 177);
    border-collapse: collapse;
    border-bottom: 1px solid rgb(100, 100, 100);
    width: 10%;
    &:nth-child(1) {
      padding-left: 35px;
      width: 30%;
    }
    &:not(:last-child) {
      border-right: 1px solid rgb(100, 100, 100);
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
const Wrapper = styled.div<{ count: number }>`
  height: 100%;
  ${({ count }) => `
    background: repeating-linear-gradient(
      rgb(41, 35, 38),
      rgb(41, 35, 38) 20px,
      rgb(51, 51, 51) 0,
      rgb(51, 51, 51) 40px
    )
    left 0 top ${76 + count * 20 + 25}px no-repeat fixed;
    `}
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
