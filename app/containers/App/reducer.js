/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import {GET_INFLUENCER_PROFILE_SUCCESS} from '../Influencer/constants';
import {
  SET_PLAYLIST,
  SET_ROLE,
  GET_GENRES_SUCCESS,
  SET_SONGS,
  SET_LOADER,
  GET_USER_DETAILS_SUCCESS,
  GET_USER_DETAILS,
  GET_USER_DETAILS_ERROR,
  UPDATE_SONG_PLAY_DURATION,
  SUCCESS_HANDLE_SONG_PLAYING,
  SUCCESS_HANDLE_SINGLE_SONG,
} from './constants';

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
  userDetails: null,
  influencerDetails: {},
  featuredAlbum: [],
  latestPosts: [],
  weeklyTop: [],
  newReleases: [],
  recommended: [],
  albumInfo: {},
  currentPlaylist: [],
  currentSong: {
    songData: {
      id: '',
      src: '',
      title: '',
      artist: '',
      artwork: ''
    },
    playing: false
  },
  songPlayDuration: 0,
  role: '',
  genres: [],
  loader: false,
  influencerProfile: {},
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_PLAYLIST:
      case SET_SONGS:
        draft.currentPlaylist = action.songs;
        draft.currentSong.playing = false;
        break;
      case SUCCESS_HANDLE_SONG_PLAYING:
        draft.loading = false;
        draft.currentSong.playing = action.playing;
        break;
      case UPDATE_SONG_PLAY_DURATION:
        draft.songPlayDuration = draft.songPlayDuration + 1;
        break;
      case SUCCESS_HANDLE_SINGLE_SONG:
        draft.loading = false;
        draft.currentSong.playing = action.status;
        draft.songPlayDuration = 0;
        const song = state.currentPlaylist.find(item => item.song.id === action.songId)
        if (song) {
          const albumImage = song.album ? song.album.artwork : song.song.albumSongs[0].album.artwork
          const albumId = song.album ? song.album.id : song.song.albumSongs[0].album.id
          draft.currentSong.songData = {
            id: song.song.id,
            src: song.song.url,
            title: song.song.title,
            artist: song.song.user.name,
            artistId: song.song.user.id,
            artwork: albumImage,
            albumId: albumId
          }
        }
        break;
      case SET_ROLE:
        draft.role = action.role;
        break;
      case GET_GENRES_SUCCESS:
        draft.genres = action.genres;
        break;
      case GET_USER_DETAILS:
        draft.loading = true;
        break;
      case GET_USER_DETAILS_SUCCESS:
        draft.userDetails = action.userInformation;
        draft.loading = false;
        break;
      case GET_USER_DETAILS_ERROR:
        draft.loading = false;
        break;
      case SET_LOADER:
        draft.loader = action.status;
        break;
      case GET_INFLUENCER_PROFILE_SUCCESS:
        draft.influencerProfile = action.profile;
        break;
    }
  });

export default appReducer;
