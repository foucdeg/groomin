import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from 'redux/Player/types';
import { Room } from './types';

export type RoomState = Readonly<{
  room: Room | null;
}>;

const initialState: RoomState = { room: null };

const roomSlice = createSlice({
  name: 'Room',
  initialState: initialState,
  reducers: {
    updateRoom: (state, action: PayloadAction<Room | null>) => {
      state.room = action.payload;
    },
    joinRoom: (state, action: PayloadAction<Player>) => {
      if (!state.room) return;
      if (!state.room.players.some((roomPlayer) => roomPlayer.uuid === action.payload.uuid)) {
        state.room.players.push(action.payload);
      }
    },
    addPlayerToRoom: (state, action: PayloadAction<Player>) => {
      if (!state.room) return;
      if (!state.room.players.find((player) => player.uuid === action.payload.uuid)) {
        state.room.players.push(action.payload);
      }
    },
    removeRoom: (state) => {
      state.room = null;
    },
    removePlayerFromRoom: (state, action: PayloadAction<Player>) => {
      if (!state.room) return;

      state.room.players = state.room.players.filter(
        (roomPlayer) => roomPlayer.uuid !== action.payload.uuid,
      );
    },
    nameNewAdmin: (state, action: PayloadAction<Player>) => {
      if (!state.room) return;

      state.room.admin = action.payload;
    },
  },
});

export const {
  updateRoom,
  joinRoom,
  addPlayerToRoom,
  removePlayerFromRoom,
  nameNewAdmin,
  removeRoom,
} = roomSlice.actions;
export default roomSlice.reducer;
