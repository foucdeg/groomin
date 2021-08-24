import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from 'redux/Player/types';
import { findRemainingPlayers } from 'services/game.service';
import { Score, Story } from './types';

export type StoryState = Readonly<{
  story: Story | null;
  remainingPlayers: Player[];
}>;

const initialState: StoryState = {
  story: null,
  remainingPlayers: [],
};

const gameSlice = createSlice({
  name: 'Game',
  initialState,
  reducers: {
    updateStory: (state, action: PayloadAction<{ story: Story }>) => {
      state.story = action.payload.story;

      if (!state.story) return;

      state.remainingPlayers = findRemainingPlayers(state.story);
    },
    markPlayerFinished: (state, action: PayloadAction<Player>) => {
      state.remainingPlayers = state.remainingPlayers.filter(
        (remPlayer) => remPlayer.uuid !== action.payload.uuid,
      );
    },
    markPlayerNotFinished: (state, action: PayloadAction<Player>) => {
      if (!state.remainingPlayers.some((remPlayer) => remPlayer.uuid === action.payload.uuid)) {
        state.remainingPlayers.push(action.payload);
      }
    },
    removeStory: (state) => {
      state.story = null;
      state.remainingPlayers = [];
    },
    addVoteToStory: (
      state,
      action: PayloadAction<{ storyId: string; playerId: string; score: Score }>,
    ) => {
      if (!state.story) return;
      if (state.story.uuid !== action.payload.storyId) return;

      state.story.votes = [
        ...state.story.votes.filter((vote) => vote.player_id !== action.payload.playerId),
        { player_id: action.payload.playerId, score: action.payload.score },
      ];
    },
  },
});

export const {
  updateStory,
  markPlayerFinished,
  markPlayerNotFinished,
  addVoteToStory,
  removeStory,
} = gameSlice.actions;
export default gameSlice.reducer;
