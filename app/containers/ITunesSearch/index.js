import React, { useEffect, memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { OutlinedInput, InputAdornment, IconButton, CircularProgress, Paper } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import styled from '@emotion/styled';
import { injectReducer, injectSaga } from 'redux-injectors';
import { compose } from 'redux';
import debounce from 'lodash/debounce';
import { searchTracks, clearTracks } from './actions';
import { selectTracks, selectLoading, selectError } from './selectors';
import reducer from './reducer';
import saga from './saga';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 2rem;
`;

const SearchContainer = styled(Paper)`
  && {
    width: 100%;
    max-width: 600px;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const StyledOutlinedInput = styled(OutlinedInput)`
  && {
    margin: 1rem 0;
    border-radius: 25px;

    & .MuiOutlinedInput-notchedOutline {
      border-radius: 25px;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
  text-align: center;
`;

const LoaderContainer = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.palette.primary.main};
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
`;

/**
 * ITunesSearch Component
 * This component provides a search interface for iTunes tracks
 * with real-time search functionality and error handling
 *
 * @param {Object} props - Component props
 * @param {Function} props.dispatchSearchTracks - Function to dispatch search action
 * @param {Function} props.dispatchClearTracks - Function to clear search results
 * @param {Array} props.tracks - List of tracks from search results
 * @param {boolean} props.loading - Loading state indicator
 * @param {Object} props.error - Error object if search fails
 */
export function ITunesSearch({ dispatchSearchTracks, dispatchClearTracks, tracks, loading, error }) {
  const [inputValue, setInputValue] = useState('');

  // Create a debounced version of the search dispatch
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim()) {
        dispatchSearchTracks(searchQuery);
      } else {
        dispatchClearTracks();
      }
    }, 300),
    [dispatchSearchTracks, dispatchClearTracks]
  );

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      debouncedSearch.cancel();
      dispatchClearTracks();
    };
  }, [debouncedSearch]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue); // Update input state immediately
    debouncedSearch(newValue); // Debounce the search
  };

  const handleSearchClick = () => {
    debouncedSearch.cancel();
    if (inputValue.trim()) {
      dispatchSearchTracks(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue('');
    debouncedSearch.cancel();
    dispatchClearTracks();
  };

  return (
    <Container>
      <SearchContainer elevation={3}>
        <Title>iTunes Track Search</Title>
        <StyledOutlinedInput
          placeholder="Search for tracks..."
          onChange={handleInputChange}
          value={inputValue}
          fullWidth
          endAdornment={
            <InputAdornment position="end">
              {inputValue && (
                <IconButton edge="end" onClick={handleClear} size="small">
                  <ClearIcon />
                </IconButton>
              )}
              <IconButton edge="end" onClick={handleSearchClick} disabled={loading}>
                {loading ? (
                  <LoaderContainer>
                    <CircularProgress color="primary" size={20} />
                  </LoaderContainer>
                ) : (
                  <SearchIcon />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
        {error && <ErrorMessage>Error: {error.message}</ErrorMessage>}
        {/* Track list will be implemented in Part 2 */}
        <pre>{JSON.stringify(tracks, null, 2)}</pre>
      </SearchContainer>
    </Container>
  );
}

ITunesSearch.propTypes = {
  dispatchSearchTracks: PropTypes.func.isRequired,
  dispatchClearTracks: PropTypes.func.isRequired,
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      trackId: PropTypes.number,
      trackName: PropTypes.string,
      artistName: PropTypes.string,
      artworkUrl100: PropTypes.string
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string
  })
};

ITunesSearch.defaultProps = {
  tracks: [],
  loading: false,
  error: null
};

const mapStateToProps = createStructuredSelector({
  tracks: selectTracks,
  loading: selectLoading,
  error: selectError
});

/**
 * Maps dispatch functions to props
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Object} Object containing dispatch functions
 */
export function mapDispatchToProps(dispatch) {
  return {
    dispatchSearchTracks: (query) => dispatch(searchTracks(query)),
    dispatchClearTracks: () => dispatch(clearTracks())
  };
}

export default compose(
  injectReducer({ key: 'itunesSearch', reducer }),
  injectSaga({ key: 'itunesSearch', saga }),
  connect(mapStateToProps, mapDispatchToProps),
  memo
)(ITunesSearch);
