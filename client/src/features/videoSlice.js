import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  video: null,
  allVideos: [],
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideo: (state, action) => {
      state.video = action.payload?.video || state.video;
      state.allVideos = action.payload?.allVideos || state.allVideos;
    },
  },
});

export const { setVideo } = videoSlice.actions;
export default videoSlice.reducer;
