import React from 'react';
import { PadStep } from 'redux/Story/types';

import PodiumStep from 'pages/VoteResults/components/PodiumStep';
import { Container } from './Podium.style';

interface Props {
  winners: PadStep[];
}

export const PODIUM_WIDTH = 536;

const Podium: React.FC<Props> = ({ winners }) => {
  return (
    <Container data-test="podium">
      <PodiumStep width={166} winner={winners[1]} ranking={2} />
      <PodiumStep width={197} winner={winners[0]} ranking={1} />
      <PodiumStep width={171} winner={winners[2]} ranking={3} />
    </Container>
  );
};

export default Podium;
