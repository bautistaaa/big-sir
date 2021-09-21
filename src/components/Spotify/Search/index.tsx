import { FC, useEffect } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components/macro';
import { useService } from '@xstate/react';
import spotifyConfig from '../../../shared/config';
import { request } from '../utils';
import { useStickyBarContext } from '../StickyBarContext';

const CARD_COLORS = [
  'rgb(39, 133, 106)',
  'rgb(30, 50, 100)',
  'rgb(141, 103, 171)',
  'rgb(232, 17, 91)',
  'rgb(186, 93, 7)',
  'rgb(225, 51, 0)',
  'rgb(220, 20, 140)',
  'rgb(119, 119, 119)',
  'rgb(80, 55, 80)',
  'rgb(13, 115, 236)',
  'rgb(255, 200, 100)',
  'rgb(140, 25, 50)',
];
const fetchGenericResults = (): Promise<SpotifyApi.MultipleCategoriesResponse> => {
  const SEARCH_URL = `${spotifyConfig.apiUrl}/browse/categories?limit=50`;
  return request(SEARCH_URL);
};
const fetchSearchResults = (
  searchTerm: string
): Promise<SpotifyApi.SearchResponse> => {
  const queryParam = new URLSearchParams({
    query: searchTerm,
  });
  const SEARCH_URL = `${spotifyConfig.apiUrl}/search?${queryParam}&offset=0&limit=20&type=album,track,artist`;
  return request(SEARCH_URL);
};

const Search: FC = () => {
  const service = useStickyBarContext();
  const [state, send] = useService(service);
  const { genericResults, results, term } = state.context;
  const { data } = useQuery(['search', term], () => fetchSearchResults(term), {
    enabled: !!term,
  });
  // have to add term to trigger the useEffect
  // so we can send an event to the machine
  // which pretty much defeats the purpose of using this... but it works for now
  const { data: genericData } = useQuery(
    ['searchGeneric', term],
    fetchGenericResults,
    {
      enabled: !term,
    }
  );

  useEffect(() => {
    if (data) {
      send({ type: 'SEARCH_SUCCESS', data });
    }
  }, [data, send]);

  useEffect(() => {
    if (genericData) {
      send({ type: 'GENERIC_SUCCESS', data: genericData });
    }
  }, [genericData, genericResults, send]);

  if (!term) {
    return (
      <Wrapper>
        <CategoryHeaderWrapper>
          <h2>Browse All</h2>
        </CategoryHeaderWrapper>
        <CategoriesGrid>
          {genericResults?.categories.items?.map((category) => {
            const { href, name, icons } = category;
            return (
              <CategoryCard
                background={
                  CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)]
                }
              >
                <h3>{name}</h3>
                <img src={icons?.[0]?.url} alt={name} />
              </CategoryCard>
            );
          })}
        </CategoriesGrid>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div>
        <div>{state.value}</div>
        {!term && <span>Generic</span>}
        {!!term && <span>Searching</span>}
      </div>
      {!term && <span>{JSON.stringify(genericResults, null, 2)}</span>}
      {!!term && <span>{JSON.stringify(results, null, 2)}</span>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 32px;
`;
const FullGridRow = styled.div`
  grid-column: 1/-1;
`;
const CategoryHeaderWrapper = styled.div`
  margin-bottom: 16px;
  h2 {
    color: #fff;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 28px;
    text-transform: none;
  }
`;
const CategoriesGrid = styled.div`
  grid-gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-auto-rows: auto;
  grid-template-rows: 1fr;
  overflow-y: hidden;
`;
const CategoryCard = styled.a<{ background: string }>`
  transition: none;
  border: none;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  width: 100%;
  background-color: ${({ background }) => background};
  h3 {
    font-size: 24px;
    letter-spacing: -0.04em;
    line-height: 1.3em;
    max-width: 100%;
    overflow-wrap: break-word;
    padding: 16px;
    position: absolute;
  }
  img {
    bottom: 0;
    right: 0;
    transform: rotate(25deg) translate(18%, -2%);
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
    height: 100px;
    position: absolute;
    width: 100px;
    object-fit: cover;
    object-position: center center;
  }
  ::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`;

export default Search;
