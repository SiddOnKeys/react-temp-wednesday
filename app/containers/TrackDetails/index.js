import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Paper, Typography, Box, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { searchTracks } from '@containers/ITunesSearch/actions';
import { makeSelectTrackById, selectLoading, selectError } from '@containers/ITunesSearch/selectors';
import styles from './styles.css';

export function TrackDetails({ dispatchSearchTracks, track, loading, error }) {
  const { trackId } = useParams();
  const history = useHistory();

  useEffect(() => {
    // If we don't have the track details, search for it using the iTunes API
    if (trackId && !track && !loading) {
      dispatchSearchTracks(trackId);
    }
  }, [trackId, track, dispatchSearchTracks, loading]);

  const handleBackClick = () => {
    history.push('/itunes');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh" gap={2}>
        <Typography color="error">Error: {error.message}</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          variant="contained"
          color="primary"
        >
          Back to Search
        </Button>
      </Box>
    );
  }

  if (!track) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh" gap={2}>
        <Typography>Track not found</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          variant="contained"
          color="primary"
        >
          Back to Search
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box mb={3} className={styles.backButtonContainer}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          variant="contained"
          color="primary"
          size="large"
          className={styles.backButton}
        >
          Back to Search
        </Button>
      </Box>
      <Paper elevation={3} className={styles.paper}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          <Box className={styles.imageContainer}>
            <img
              src={track.artworkUrl100?.replace('100x100', '400x400')}
              alt={track.trackName}
              className={styles.artwork}
            />
          </Box>
          <Box className={styles.detailsContainer}>
            <Typography variant="h4" component="h1" gutterBottom>
              {track.trackName}
            </Typography>
            <Typography variant="h5" component="h2" color="textSecondary" gutterBottom>
              {track.artistName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Album: {track.collectionName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Genre: {track.primaryGenreName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Release Date: {new Date(track.releaseDate).toLocaleDateString()}
            </Typography>
            {track.previewUrl && (
              <Box mt={2}>
                <audio controls src={track.previewUrl}>
                  Your browser does not support the audio element.
                </audio>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

TrackDetails.propTypes = {
  dispatchSearchTracks: PropTypes.func.isRequired,
  track: PropTypes.shape({
    trackId: PropTypes.number,
    trackName: PropTypes.string,
    artistName: PropTypes.string,
    collectionName: PropTypes.string,
    artworkUrl100: PropTypes.string,
    previewUrl: PropTypes.string,
    primaryGenreName: PropTypes.string,
    releaseDate: PropTypes.string
  }),
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string
  })
};

const mapStateToProps = (state) => {
  const selectTrackById = makeSelectTrackById();
  return {
    track: selectTrackById(state, window.location.pathname.split('/').pop()),
    loading: selectLoading(state),
    error: selectError(state)
  };
};

export function mapDispatchToProps(dispatch) {
  return {
    dispatchSearchTracks: (trackId) => dispatch(searchTracks(trackId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackDetails);
