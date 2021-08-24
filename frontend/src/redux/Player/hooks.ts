import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useAsyncFn } from 'react-use';
import { updatePlayer } from './slice';
import { Player } from './types';

export const useFetchMe = () => {
  const dispatch = useDispatch();

  return useAsyncFn(async () => {
    const player = await client.get('/player/me');
    dispatch(updatePlayer(player || false));
  }, [dispatch]);
};

export const useCreatePlayer = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (name: string) => {
      const player = await client.post(`/player`, { name });
      dispatch(updatePlayer(player));
    },
    [dispatch],
  );
};

export const useEditPlayer = () => {
  const [, doFetchMe] = useFetchMe();

  return useCallback(
    async (player: Partial<Player>) => {
      await client.patch(`/player/${player.uuid}`, { ...player });
      await doFetchMe();
    },
    [doFetchMe],
  );
};
