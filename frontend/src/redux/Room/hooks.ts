import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { selectPlayer } from 'redux/Player/selectors';
import { Player } from 'redux/Player/types';
import { useSelector } from 'redux/useSelector';
import client from 'services/networking/client';
import { useIntl } from 'react-intl';
import { removeStory } from 'redux/Story';
import { joinRoom, removeRoom, updateRoom } from './slice';
import { Room } from './types';
import { selectRoom } from './selectors';

export const useFetchRoom = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (roomId: string) => {
      dispatch(updateRoom(null));
      const room = await client.get(`/room/${roomId}`);
      dispatch(updateRoom(room));
    },
    [dispatch],
  );
};

export const useCreateRoom = () => {
  const history = useHistory();

  return useCallback(async () => {
    const room = await client.post('/room', {});

    history.push(`/room/${room.uuid}`);
  }, [history]);
};

export const useJoinRoom = () => {
  const dispatch = useDispatch();
  const player = useSelector(selectPlayer);

  return useCallback(
    async (roomId: string) => {
      if (!player) return;

      await client.put(`/room/${roomId}/join`, {});
      dispatch(joinRoom(player));
    },
    [dispatch, player],
  );
};

export const useLeaveRoom = () => {
  const dispatch = useDispatch();
  const room = useSelector(selectRoom);
  const intl = useIntl();
  const history = useHistory();

  return useCallback(async () => {
    if (!room) return;

    if (window.confirm(intl.formatMessage({ id: 'menu.confirmLeave' }))) {
      await client.put(`/room/${room.uuid}/leave`, {});
      dispatch(removeStory());
      dispatch(removeRoom());
      history.push('/');
    }
  }, [dispatch, history, intl, room]);
};

export const useRemovePlayer = () => {
  return useCallback(async (room: Room, player: Player) => {
    await client.put(`/room/${room.uuid}/kick`, { playerId: player.uuid });
  }, []);
};
