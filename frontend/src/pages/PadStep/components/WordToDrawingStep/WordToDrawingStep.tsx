import React, { useCallback } from 'react';
import Spacer from 'atoms/Spacer';
import CanvasDraw from 'components/Canvas/CanvasDraw';
import Timer from 'pages/PadStep/components/Timer';
import { FormattedMessage } from 'react-intl';
import { selectGame } from 'redux/Story/selectors';
import { PadStep } from 'redux/Story/types';
import { useSelector } from 'redux/useSelector';
import RemainingPlayers from 'components/RemainingPlayers';
import { useBoolean } from 'services/utils';
import { Gutter, LeftAndRightSide, LeftSide, RightSide, Sentence } from './WordToDrawingStep.style';

interface Props {
  padStep: PadStep;
  saveStep: (drawing: string) => void;
  loading: boolean;
}

const WordToDrawingStep: React.FC<Props> = ({ padStep, saveStep, loading }) => {
  const game = useSelector(selectGame);
  const [finished, setFinished] = useBoolean(false);

  const doSaveStep = useCallback(
    async (drawing: string) => {
      await saveStep(drawing);
      setFinished();
    },
    [setFinished, saveStep],
  );

  if (!game) return null;

  return (
    <LeftAndRightSide>
      <LeftSide>
        <CanvasDraw
          canvasWidth={608}
          canvasHeight={608}
          saveStep={doSaveStep}
          finished={loading || finished}
          roundDuration={game.round_duration}
        />
      </LeftSide>
      <Gutter />
      <RightSide>
        <Sentence>
          {padStep.sentence || <FormattedMessage id="wordToDrawing.noSentence" />}
        </Sentence>
        <Spacer />
        {loading || finished ? (
          <RemainingPlayers />
        ) : (
          <>
            <p>
              <FormattedMessage
                id="wordToDrawing.duration"
                values={{ duration: game.round_duration }}
              />
            </p>
            <Timer duration={game.round_duration} />
          </>
        )}
      </RightSide>
    </LeftAndRightSide>
  );
};

export default WordToDrawingStep;
