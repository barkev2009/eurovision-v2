import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { editPlaceAPI, editQualifierAPI, editRatingAPI, getRatingsByContestAPI, searchAPI, transferAPI } from './ratingAPI';

// Допустимые ключи сортировки — сериализуемые строки,
// чтобы не передавать функции в Redux action (нарушение best practices)
export const SORT_BY_ORDER = 'order';
export const SORT_BY_SCORE = 'score';
export const SORT_BY_PLACE = 'place';
export const SORT_BY_QUALIFIED = 'qualified';

const sortComparators = {
  [SORT_BY_ORDER]:     (a, b) => a.entryOrder - b.entryOrder,
  [SORT_BY_SCORE]:     (a, b) => b.score - a.score,
  [SORT_BY_PLACE]:     (a, b) => a.placeInFinal - b.placeInFinal,
  [SORT_BY_QUALIFIED]: (a, b) => b.qualifier - a.qualifier,
};

// Нормализатор ответа сервера для getRatingsByContest
const normalizeRatingFromContest = (item) => ({
  id: item.id,
  userId: item.userId,
  contestantId: item.entry.contestant.id,
  purity: item.purity,
  difficulty: item.difficulty,
  show: item.show,
  originality: item.originality,
  sympathy: item.sympathy,
  score: item.score,
  countryName: item.entry.contestant.country.name,
  iconPath: process.env.REACT_APP_API_URL + '/' + item.entry.contestant.country.icon,
  artistName: item.entry.contestant.artist_name,
  songName: item.entry.contestant.song_name,
  entryOrder: item.entry.entry_order,
  contestStep: item.entry.contest_step,
  qualifier: item.entry.contestant.qualifier,
  placeInFinal: item.entry.contestant.place_in_final,
  search: false,
  year: item.entry.year ?? null,
});

// Нормализатор ответа сервера для search (snake_case поля)
const normalizeRatingFromSearch = (item) => ({
  id: item.id,
  userId: item.userid,
  contestantId: item.contestantid,
  purity: item.purity,
  difficulty: item.difficulty,
  show: item.show,
  originality: item.originality,
  sympathy: item.sympathy,
  score: item.score,
  countryName: item.name,
  iconPath: process.env.REACT_APP_API_URL + '/' + item.icon,
  artistName: item.artist_name,
  songName: item.song_name,
  entryOrder: item.entry_order,
  contestStep: item.contest_step,
  qualifier: item.qualifier,
  placeInFinal: item.place_in_final,
  year: item.year,
  search: true,
});

const initialState = {
  ratings: [],
  sortKey: SORT_BY_ORDER,
};

export const getRatingsByContest = createAsyncThunk(
  'ratings/getRatingsByContest',
  getRatingsByContestAPI
)

export const search = createAsyncThunk(
  'ratings/search',
  searchAPI
)

export const editRating = createAsyncThunk(
  'ratings/editRating',
  editRatingAPI
)

export const editQualifier = createAsyncThunk(
  'ratings/editQualifier',
  editQualifierAPI
)

export const editPlace = createAsyncThunk(
  'ratings/editPlace',
  editPlaceAPI
)

export const transfer = createAsyncThunk(
  'ratings/transfer',
  transferAPI
)

export const ratingSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    editQualifierLocal: (state, action) => {
      const rating = state.ratings.find(item => item.contestantId === action.payload.id);
      if (rating) rating.qualifier = action.payload.qualifier;
    },
    editPlaceLocal: (state, action) => {
      const rating = state.ratings.find(item => item.contestantId === action.payload.id);
      if (rating) rating.placeInFinal = action.payload.place_in_final;
    },
    // Принимает строковый ключ сортировки (SORT_BY_*), а не функцию —
    // функции не сериализуются и ломают Redux DevTools / time-travel
    sortRatings: (state, action) => {
      const comparator = sortComparators[action.payload];
      if (comparator) {
        state.sortKey = action.payload;
        state.ratings = [...state.ratings].sort(comparator);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getRatingsByContest.fulfilled, (state, action) => {
          state.ratings = action.payload.map(normalizeRatingFromContest);
        }
      )
      .addCase(
        editRating.fulfilled, (state, action) => {
          if (action.payload.result[0] === 1) {
            const rating = state.ratings.find(item => item.id === action.payload.rating.id);
            if (rating) {
              rating.purity = action.payload.rating.purity;
              rating.show = action.payload.rating.show;
              rating.difficulty = action.payload.rating.difficulty;
              rating.originality = action.payload.rating.originality;
              rating.sympathy = action.payload.rating.sympathy;
              rating.score = action.payload.rating.score;
            }
          }
        }
      )
      .addCase(
        editQualifier.fulfilled, (state, action) => {
          if (action.payload.result[0] === 1) {
            const rating = state.ratings.find(item => item.contestantId === action.payload.contestant.id);
            if (rating) rating.qualifier = action.payload.contestant.qualifier;
          }
        }
      )
      .addCase(
        editPlace.fulfilled, (state, action) => {
          if (action.payload.result[0] === 1) {
            const rating = state.ratings.find(item => item.contestantId === action.payload.contestant.id);
            if (rating) rating.placeInFinal = action.payload.contestant.place_in_final;
          }
        }
      )
      .addCase(
        search.fulfilled, (state, action) => {
          state.ratings = action.payload.map(normalizeRatingFromSearch);
        }
      )
      .addCase(
        transfer.fulfilled, (state, action) => {
          if (action.payload.result[0] === 1) {
            const rating = state.ratings.find(item => item.id === action.payload.rating.id);
            if (rating) {
              rating.purity = action.payload.rating.purity;
              rating.show = action.payload.rating.show;
              rating.difficulty = action.payload.rating.difficulty;
              rating.originality = action.payload.rating.originality;
              rating.sympathy = action.payload.rating.sympathy;
              rating.score = action.payload.rating.score;
            }
          }
        }
      )
  }
});

export const { editQualifierLocal, editPlaceLocal, sortRatings } = ratingSlice.actions;

export default ratingSlice.reducer;