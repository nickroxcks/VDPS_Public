import { useContext } from 'react';
import { Button, Icon, Menu, Popup } from 'semantic-ui-react';
import { apiCredsFileName, MenuItems } from '../constants';
import { Auth } from 'aws-amplify';
import { AppContext } from './';
import { downloadFromURL, getS3FileAccessURL } from '../utils';

const MainMenu = () => {
  const { activeMenu, setActiveMenu } = useContext(AppContext);

  return (
    <div>
      <Menu pointing secondary>
        <Menu.Item
          name={MenuItems.DM}
          active={activeMenu === MenuItems.DM}
          onClick={() => setActiveMenu(MenuItems.DM)}
        >
          <Icon name='microchip' />
          {MenuItems.DM}
        </Menu.Item>
        <Menu.Item
          name={MenuItems.CR}
          active={activeMenu === MenuItems.CR}
          onClick={() => setActiveMenu(MenuItems.CR)}
        >
          <Icon name='soundcloud' />
          {MenuItems.CR}
        </Menu.Item>
        <Menu.Item
          name={MenuItems.An}
          active={activeMenu === MenuItems.An}
          onClick={() => setActiveMenu(MenuItems.An)}
        >
          <Icon name='chart bar outline' />
          {MenuItems.An}
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            <Popup
              trigger={
                <Button
                  style={{ marginRight: 3 }}
                  basic
                  icon
                  labelPosition='right'
                  onClick={async () =>
                    downloadFromURL(
                      await getS3FileAccessURL(apiCredsFileName),
                      apiCredsFileName
                    )
                  }
                >
                  API Credentials
                  <Icon name='download' />
                </Button>
              }
              content={
                <>
                  Contains AWS IAM users and IoT fleet registration credentials
                  with minimal access to VDPS resources via programmatic or
                  console control.
                  <br />
                  <br />
                  Use this to{' '}
                  <a
                    href='https://aws.amazon.com/s3/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    access recordings
                  </a>{' '}
                  or to integrate your new device(s) to our{' '}
                  <a
                    href='https://aws.amazon.com/iot/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    IoT cloud network
                  </a>
                  .
                </>
              }
              position='bottom center'
              mouseEnterDelay={300}
              mouseLeaveDelay={300}
              on='hover'
              hoverable
            />
            <Button style={{ marginRight: 3 }} icon basic>
              <Icon name='settings' />
            </Button>
            <Button
              basic
              onClick={() => {
                Auth.signOut();
                window.location.reload();
              }}
            >
              <Icon name='sign-out' />
              Logout
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </div>
  );
};

export default MainMenu;
