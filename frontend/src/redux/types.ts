import { RoomState } from './Room';
import { StoryState } from './Story';
import { PlayerState } from './Player';

export type RootState = Readonly<{
  room: RoomState;
  story: StoryState;
  player: PlayerState;
}>;
