import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the itunesSearch state domain
 * @param {Object} state - Global Redux state
 * @returns {Object} The iTunes search state
 */
const selectITunesSearchDomain = (state) => state.itunesSearch || initialState;

/**
 * Select the tracks from state
 * @returns {Array} List of track objects
 */
export const selectTracks = createSelector(selectITunesSearchDomain, (substate) => substate.tracks);

/**
 * Select the loading status
 * @returns {boolean} True if a search is in progress
 */
export const selectLoading = createSelector(selectITunesSearchDomain, (substate) => substate.loading);

/**
 * Select the error state
 * @returns {Object|null} Error object if present, null otherwise
 */
export const selectError = createSelector(selectITunesSearchDomain, (substate) => substate.error);

/**
 * Select the current search query
 * @returns {string} Current search term
 */
export const selectQuery = createSelector(selectITunesSearchDomain, (substate) => substate.query);
