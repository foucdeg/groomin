import { RootState } from 'redux/types';

export const selectStory = (state: RootState) => state.story.story;

export const selectRemainingPlayers = (state: RootState) => state.story.remainingPlayers;
