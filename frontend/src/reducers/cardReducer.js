import {
  CARD_ADD_FAIL,
  CARD_ADD_REQUEST,
  CARD_ADD_RESET,
  CARD_ADD_SUCCESS,
  CARD_LIST_FAIL,
  CARD_LIST_REQUEST,
  CARD_LIST_SUCCESS,
} from '../constants/cardConstants';

export const cardAddReducer = (state = {}, action) => {
  switch (action.type) {
    case CARD_ADD_REQUEST:
      return { loading: true };
    case CARD_ADD_SUCCESS:
      return { loading: false, card: action.payload };
    case CARD_ADD_FAIL:
      return { loading: false, error: action.payload };
    case CARD_ADD_RESET:
      return {};
    default:
      return state;
  }
};

export const cardListReducer = (state = { cards: [] }, action) => {
  switch (action.type) {
    case CARD_LIST_REQUEST:
      return { ...state, loading: true };
    case CARD_LIST_SUCCESS:
      return { loading: false, cards: action.payload };
    case CARD_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};