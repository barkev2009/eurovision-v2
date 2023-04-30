import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { editPlaceAPI, editQualifierAPI, editRatingAPI, getRatingsByContestAPI, searchAPI } from './ratingAPI';

const initialState = {
  ratings: []
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

export const ratingSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {

  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(
        getRatingsByContest.fulfilled, (state, action) => {
          // console.table(action.payload);
          state.ratings = action.payload.map(
            item => ({
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
              search: false
            })
          );
        }
      )
      .addCase(
        editRating.fulfilled, (state, action) => {
          if (action.payload.result[0] === 1) {
            const rating = state.ratings.filter(item => item.id === action.payload.rating.id)[0];
            rating.purity = action.payload.rating.purity;
            rating.show = action.payload.rating.show;
            rating.difficulty = action.payload.rating.difficulty;
            rating.originality = action.payload.rating.originality;
            rating.sympathy = action.payload.rating.sympathy;
            rating.score = action.payload.rating.score;
          }
        }
      )
      .addCase(
        editQualifier.fulfilled, (state, action) => {
          if (action.payload.result[0] === 1) {

            const rating = state.ratings.filter(item => item.contestantId === action.payload.contestant.id)[0];
            rating.qualifier = action.payload.contestant.qualifier;
          }
        }
      )
      .addCase(
        editPlace.fulfilled, (state, action) => {
          if (action.payload.result[0] === 1) {

            const rating = state.ratings.filter(item => item.contestantId === action.payload.contestant.id)[0];
            rating.placeInFinal = action.payload.contestant.place_in_final;
          }
        }
      )
      .addCase(
        search.fulfilled, (state, action) => {
          // console.log(action.payload)
          state.ratings = action.payload.map(
            item => ({
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
              search: true
            })
          )
        }
      )
  }
});

// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default ratingSlice.reducer;
