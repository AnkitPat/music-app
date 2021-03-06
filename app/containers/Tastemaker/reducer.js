/*
 *
 * Tastemaker reducer
 *
 */
import produce from 'immer';
import {
  GET_TASTEMAKERS_REQUEST_SUCCESS,
  REMOVE_INFLUENCER,
  SELECT_INFLUENCER,
  RESET_SELECTED_INFLUENCER
} from './constants';

export const initialState = {
  influencers: [],
  selectedInfluencers: []
};

/* eslint-disable default-case, no-param-reassign */
const tastemakerReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_TASTEMAKERS_REQUEST_SUCCESS:
        draft.influencers = action.data.data;
        break;
      case SELECT_INFLUENCER:
        if (draft.selectedInfluencers === undefined)
          draft.selectedInfluencers = [];
        draft.selectedInfluencers = draft.selectedInfluencers.concat(action.data);
        break;
      case REMOVE_INFLUENCER:
        draft.selectedInfluencers = draft.selectedInfluencers.filter(item => item.id !== action.data.id)
        break;
      case RESET_SELECTED_INFLUENCER:
        draft.selectedInfluencers = []
        break;
    }
  });

export default tastemakerReducer;
