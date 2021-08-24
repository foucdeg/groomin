import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { selectPlayerId } from 'redux/Player/selectors';
import { useSelector } from 'redux/useSelector';
import client from 'services/networking/client';
import { useAsyncFn } from 'react-use';
import { addVoteToStory, updateStory } from './slice';
import { Score, Story } from './types';

export const useFetchStory = () => {
  const dispatch = useDispatch();

  return useAsyncFn(
    async (gameId: string) => {
      const story: Story = await client.get(`/game/${gameId}`);

      dispatch(updateStory({ story }));
    },
    [dispatch],
  );
};

export const useStartStory = () => {
  const history = useHistory();

  return useCallback(
    async (roomId: string, name: string, link?: string | null) => {
      try {
        const { story_id: storyId } = await client.put(`/room/${roomId}/start`, {
          name,
          link,
        });
        history.push(`/room/${roomId}/story/${storyId}`);
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [history],
  );
};

export const useSaveVote = () => {
  const dispatch = useDispatch();
  const playerId = useSelector(selectPlayerId);

  return useCallback(
    async (storyId: string, score: Score) => {
      if (!playerId) return;

      dispatch(addVoteToStory({ storyId, playerId, score }));
      try {
        await client.post(`/story/${storyId}/vote`, {
          score: score ? score.toString() : null,
        });
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [dispatch, playerId],
  );
};
