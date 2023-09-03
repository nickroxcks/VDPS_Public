import './App.css';
import { useMemo, useState } from 'react';
import { Container, Header } from 'semantic-ui-react';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { withAuthenticator } from '@aws-amplify/ui-react';
import {
  AppContext,
  MainMenu,
  DeviceManagement,
  CloudRecordings,
  SoundAnalysis,
} from './components';
import { MenuItems } from './constants';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: process.env.REACT_APP_DEV_AWS_REGION,
    aws_pubsub_endpoint: process.env.REACT_APP_DEV_AWS_IoT_ENDPOINT,
  })
);

const App = () => {
  const [activeMenu, setActiveMenu] = useState<MenuItems>(MenuItems.DM);
  const [s3DataOfRecordInAnalysis, setS3DataOfRecordInAnalysis] = useState({});

  const contextValue = useMemo<any>(
    () => ({
      activeMenu,
      setActiveMenu,
      s3DataOfRecordInAnalysis,
      setS3DataOfRecordInAnalysis,
    }),
    [
      activeMenu,
      setActiveMenu,
      s3DataOfRecordInAnalysis,
      setS3DataOfRecordInAnalysis,
    ]
  );

  return (
    <div className='App'>
      <Container style={{ marginTop: '1.5em' }}>
        <Header as='h2' dividing>
          VDPS Dashboard
        </Header>

        <AppContext.Provider value={contextValue}>
          <MainMenu />
          {(() => {
            switch (activeMenu) {
              case MenuItems.DM:
                return <DeviceManagement />;
              case MenuItems.CR:
                return <CloudRecordings />;
              case MenuItems.An:
                return <SoundAnalysis />;
              default:
                break;
            }
          })()}
        </AppContext.Provider>
      </Container>
    </div>
  );
};

export default withAuthenticator(App);
