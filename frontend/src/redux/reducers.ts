/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.ts, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';

import { reducer as room } from './Room';
import { reducer as story } from './Story';
import { reducer as player } from './Player';

import { RootState } from './types';

const rootReducer = combineReducers<RootState>({
  room,
  story,
  player,
});

export default rootReducer;
