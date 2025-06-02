import React from 'react';
import PropTypes from 'prop-types';
import { Grid, CircularProgress, Box } from '@mui/material';
import SongCard from '../SongCard';
import styles from './styles.css';

function TrackGrid({ tracks, loading }) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3} className={styles.gridContainer}>
      {tracks.map((track) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={track.trackId}>
          <SongCard track={track} />
        </Grid>
      ))}
    </Grid>
  );
}

TrackGrid.propTypes = {
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      trackId: PropTypes.number.isRequired,
      trackName: PropTypes.string.isRequired,
      artistName: PropTypes.string.isRequired,
      artworkUrl100: PropTypes.string,
      previewUrl: PropTypes.string
    })
  ).isRequired,
  loading: PropTypes.bool
};

TrackGrid.defaultProps = {
  loading: false
};

export default TrackGrid;
