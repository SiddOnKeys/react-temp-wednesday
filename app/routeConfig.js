/**
 * Route configuration
 */

import HomeContainer from '@containers/HomeContainer/loadable';
import NotFound from '@containers/NotFoundPage/loadable';
import ITunesSearch from '@containers/ITunesSearch/loadable';
import TrackDetails from '@containers/TrackDetails/loadable';

export const routeConfig = {
  home: {
    component: HomeContainer,
    route: '/',
    exact: true
  },
  itunes: {
    component: ITunesSearch,
    route: '/itunes',
    exact: true
  },
  trackDetails: {
    component: TrackDetails,
    route: '/tracks/:trackId',
    exact: true
  },
  notFoundPage: {
    component: NotFound,
    route: ''
  }
};
