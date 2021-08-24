import React from 'react';
import { FormattedMessage } from 'react-intl';

import Spacer from 'atoms/Spacer';

import HomeLayout from 'layout/HomeLayout';
import { LeftSideTitle, Subtitle, Actions, Row } from './Home.style';
import PlayerGameForm from './components/PlayerGameForm';

const Home: React.FunctionComponent = () => {
  return (
    <HomeLayout>
      <LeftSideTitle>
        <FormattedMessage id="home.title" />
      </LeftSideTitle>
      <Subtitle>
        <FormattedMessage id="home.tagline" />
      </Subtitle>
      <Spacer />
      <Actions>
        <Row>
          <PlayerGameForm />
        </Row>
      </Actions>
    </HomeLayout>
  );
};

export default Home;
