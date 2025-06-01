import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { PlayArrow, Pause, MoreVert } from '@mui/icons-material';
import styled from '@emotion/styled';

const SPOTIFY_GREEN = '#1db954';
const SPOTIFY_GREEN_HOVER = '#1ed760';
const SEMI_TRANSPARENT_WHITE = 'rgba(255, 255, 255, 0.7)';

const StyledCard = styled(Card)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StyledCardMedia = styled(CardMedia)`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  flex: 0 0 auto;
`;

const StyledCardContent = styled(CardContent)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px !important;
  position: relative;
  min-height: 0;
  overflow: hidden;
  color: #ffffff;
`;

const ContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 40px;
  overflow: hidden;
`;

const ButtonsContainer = styled(Box)`
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: flex;
  gap: 4px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  ${StyledCard}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled(IconButton)`
  background-color: ${SPOTIFY_GREEN};
  padding: 6px;

  &:hover {
    background-color: ${SPOTIFY_GREEN_HOVER};
  }

  svg {
    width: 18px;
    height: 18px;
    color: #000000;
  }
`;

const TrackTitle = styled(Typography)`
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
`;

const ArtistText = styled(Typography)`
  color: ${SEMI_TRANSPARENT_WHITE};
  font-size: 0.875rem;

  &:hover {
    color: #ffffff;
  }
`;

const GenreText = styled(Typography)`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
`;

/**
 * SongCard component displays a track's information in a card format
 * with play/pause functionality and detailed view
 * @param {Object} props - Component props
 * @param {Object} props.track - Track information object
 * @param {string} props.track.trackName - Name of the track
 * @param {string} props.track.artistName - Name of the artist
 * @param {string} props.track.artworkUrl100 - URL of the track artwork
 * @param {string} props.track.previewUrl - URL of the track preview
 * @param {string} props.track.primaryGenreName - Genre of the track
 * @param {string} [props.track.collectionName] - Name of the album
 * @param {string} [props.track.releaseDate] - Release date of the track
 * @returns {JSX.Element} SongCard component
 */
function SongCard({ track }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const audioRef = useRef(null);

  const handlePlayPause = useCallback(
    (e) => {
      e.stopPropagation();
      if (!audioRef.current) {
        const audio = new Audio(track.previewUrl);
        audio.addEventListener('ended', () => setIsPlaying(false));
        audioRef.current = audio;
      }

      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    },
    [isPlaying, track.previewUrl]
  );

  const handleDetailsClick = useCallback((e) => {
    e.stopPropagation();
    setDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('ended', () => setIsPlaying(false));
      }
    };
  }, []);

  const dialogPaperProps = {
    style: {
      background: '#282828',
      color: '#ffffff',
      borderRadius: '12px'
    }
  };

  return (
    <>
      <StyledCard>
        <StyledCardMedia
          component="img"
          image={track.artworkUrl100.replace('100x100bb', '400x400bb')}
          alt={track.trackName}
        />
        <StyledCardContent>
          <ContentWrapper>
            <TrackTitle noWrap title={track.trackName}>
              {track.trackName}
            </TrackTitle>
            <ArtistText noWrap title={track.artistName}>
              {track.artistName}
            </ArtistText>
            <GenreText noWrap>{track.primaryGenreName}</GenreText>
          </ContentWrapper>
          <ButtonsContainer>
            <ActionButton aria-label={isPlaying ? 'pause' : 'play'} onClick={handlePlayPause} size="small">
              {isPlaying ? <Pause /> : <PlayArrow />}
            </ActionButton>
            <ActionButton aria-label="more details" onClick={handleDetailsClick} size="small">
              <MoreVert />
            </ActionButton>
          </ButtonsContainer>
        </StyledCardContent>
      </StyledCard>

      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth PaperProps={dialogPaperProps}>
        <DialogTitle sx={{ color: '#ffffff' }}>{track.trackName}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: SEMI_TRANSPARENT_WHITE }}>
                Artist
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                {track.artistName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: SEMI_TRANSPARENT_WHITE }}>
                Album
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                {track.collectionName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: SEMI_TRANSPARENT_WHITE }}>
                Genre
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                {track.primaryGenreName}
              </Typography>
            </Box>
            {track.releaseDate && (
              <Box>
                <Typography variant="subtitle2" sx={{ color: SEMI_TRANSPARENT_WHITE }}>
                  Release Date
                </Typography>
                <Typography variant="body1" sx={{ color: '#ffffff' }}>
                  {new Date(track.releaseDate).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} sx={{ color: SPOTIFY_GREEN }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

SongCard.propTypes = {
  track: PropTypes.shape({
    trackName: PropTypes.string.isRequired,
    artistName: PropTypes.string.isRequired,
    artworkUrl100: PropTypes.string.isRequired,
    previewUrl: PropTypes.string.isRequired,
    primaryGenreName: PropTypes.string.isRequired,
    collectionName: PropTypes.string,
    releaseDate: PropTypes.string
  }).isRequired
};

export default SongCard;
