import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from './types';

export type PlayerState = Readonly<{
  current: {
    player: Player | null | false;
  };
}>;

const initialState: PlayerState = {
  current: {
    player: null,
  },
} as PlayerState;

const playerSlice = createSlice({
  name: 'Player',
  initialState,
  reducers: {
    updatePlayer: (state, action: PayloadAction<Player | null | false>) => {
      state.current.player = action.payload;
    },
  },
});

export const { updatePlayer } = playerSlice.actions;
export default playerSlice.reducer;
