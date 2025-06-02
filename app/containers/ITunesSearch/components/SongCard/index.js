import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import styles from './styles.css';

function SongCard({ track }) {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/tracks/${track.trackId}`);
  };

  return (
    <Card
      className={styles.card}
      onClick={handleClick}
      sx={{ cursor: 'pointer' }}
    >
      <CardMedia
        component="img"
        height="200"
        image={track.artworkUrl100?.replace('100x100', '200x200')}
        alt={track.trackName}
        className={styles.media}
      />
      <CardContent>
        <Typography variant="h6" component="div" noWrap title={track.trackName}>
          {track.trackName}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap title={track.artistName}>
          {track.artistName}
        </Typography>
        {track.previewUrl && (
          <Box mt={1}>
            <audio controls src={track.previewUrl} onClick={(e) => e.stopPropagation()}>
              Your browser does not support the audio element.
            </audio>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

SongCard.propTypes = {
  track: PropTypes.shape({
    trackId: PropTypes.number.isRequired,
    trackName: PropTypes.string.isRequired,
    artistName: PropTypes.string.isRequired,
    artworkUrl100: PropTypes.string,
    previewUrl: PropTypes.string
  }).isRequired
};

export default SongCard;
