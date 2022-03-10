import { useState } from 'react';
import styled from 'styled-components';
import PopularTrack from './PopularTrack';

interface PopularTracksProps {
  tracks: SpotifyApi.TrackObjectFull[];
}
const PopularTracks = ({ tracks }: PopularTracksProps) => {
  const [activeTrack, setActiveTrack] = useState<string>('');
  const uris = tracks.map((track) => track.uri);

  const handleTrackClick = (trackId: string) => {
    setActiveTrack(trackId);
  };

  return (
    <section style={{ marginBottom: '40px' }}>
      <Header>Popular</Header>
      <Wrapper>
        {tracks.slice(0, 5).map((track, i) => {
          return (
            <PopularTrack
              key={track.id}
              track={track}
              index={i}
              uris={uris}
              onClick={handleTrackClick}
              isActive={track.id === activeTrack}
            />
          );
        })}
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div``;
const Header = styled.h2`
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 28px;
  margin: 0 0 20px;
`;

export default PopularTracks;
