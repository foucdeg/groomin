import { RootState } from 'redux/types';

export const selectRoom = (state: RootState) => state.room.room;

export const selectPlayerIsAdmin = (state: RootState) =>
  !!(
    state.player.current.player &&
    state.room.room &&
    state.player.current.player.uuid === state.room.room.admin.uuid
  );

export const selectAdmin = (state: RootState) => state.room.room?.admin;
