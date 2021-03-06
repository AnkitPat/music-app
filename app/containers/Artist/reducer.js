/*
 *
 * Artist reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, ERROR_ARTIST, FETCH_ARTIST, SAVE_ARTIST, FETCH_SUPPORTED_ARTIST, SAVE_SUPORTED_ARTIST } from './constants';

export const initialState = {
  artist: {},
  fetching: false,
  supportedArtist: []
};

/* eslint-disable default-case, no-param-reassign */
const artistReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case FETCH_ARTIST:
        draft.fetching = true;
        break;
      case SAVE_ARTIST:
        draft.artist = action.artist;
        draft.fetching = false;
        break

      case ERROR_ARTIST:
        draft.fetching = false;
        draft.artist = {};
        break;

      case FETCH_SUPPORTED_ARTIST:
        draft.fetching = true;
        break;
      case SAVE_SUPORTED_ARTIST:
        draft.supportedArtist = action.supportedArtist;
        draft.fetching = false;
        break;
    }
  });

export default artistReducer;
