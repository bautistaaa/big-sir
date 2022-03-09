import { useActor } from '@xstate/react';
import { FC, useState } from 'react';
import styled from 'styled-components/macro';
import { FileIconMap } from '.';
import { useAppContext } from '../../AppContext';
import { File, Contents } from '../../shared/fileDirectory';
import { formatDate } from '../../utils';

const ListView: FC<{ files: Contents }> = ({ files }) => {
  const service = useAppContext();
  const [current, send] = useActor(service);
  const [active, setActive] = useState('');

  return (
    <Wrapper
      count={Object.keys(files).length}
      isDark={current.context.mode === 'dark'}
    >
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
  th {
    text-align: left;
    text-transform: capitalize;
    font-size: 10px;
    padding: 7px;
    color: ${({ theme }) => theme.color};
    border-collapse: collapse;
    border-bottom: 1px solid ${({ theme }) => theme.finderBorder};
    width: 10%;
    &:nth-child(1) {
      padding-left: 35px;
      width: 30%;
    }
    &:not(:last-child) {
      border-right: 1px solid ${({ theme }) => theme.finderBorder};
    }
  }

  tr > td {
    color: rgb(177, 177, 177);
    font-size: 12px;
    vertical-align: middle;
  }

  tbody > tr {
    &:nth-child(odd) {
      background: ${({ theme }) => theme.finderOddItemListBackground};
    }
    &:nth-child(even) {
      background: ${({ theme }) => theme.finderEvenItemListBackground};
    }
  }
`;
const Wrapper = styled.div<{ count: number; isDark: boolean; theme: any }>`
  height: 100%;
  z-index: 1;
  position: relative;
  ${({ count }) => `
    background: repeating-linear-gradient(
      rgb(41, 35, 38),
      rgb(41, 35, 38) 20px,
      rgb(51, 51, 51) 0,
      rgb(51, 51, 51) 40px
    )
    left 0 top ${76 + count * 20 + 25}px no-repeat fixed;
  `}
  &::before {
    content: '';
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    z-index: -1;
    transition: opacity 150ms ease-in;
    opacity: ${({ isDark }) => (isDark ? 0 : 1)};
    ${({ count }) => `
    background: repeating-linear-gradient(
      white,
      white 20px,
      #f1f1f1 0,
      #f1f1f1 40px
    )
    left 0 top ${76 + count * 20 + 25}px no-repeat fixed;
  `}
  }
`;
const List = styled.ul``;
const ListItem = styled.li`
  cursor: default;
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
  color: ${({ theme }) => theme.color};
  font-size: 12px;
`;
export default ListView;
