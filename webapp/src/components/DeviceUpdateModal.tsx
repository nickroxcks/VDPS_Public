import { useContext, useState } from 'react';
import { Button, Header, Icon, Modal, Popup, Segment } from 'semantic-ui-react';
import { LocalStorageSetUtil, nameS3DirectoryFromDevice } from '../utils';
import { LocalStorageKeys, MenuItems } from '../constants';
import { AppContext, DeviceFormModalContent, DevicePubSubControl } from './';

export const DeviceUpdateModal = ({
  trigger,
  device,
  updateDeviceInDB,
  deleteDeviceFromDB,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteWarningModalOpen, setDeleteWarningModalOpen] = useState(false);

  const { setActiveMenu } = useContext(AppContext);

  const { id, name, macAddress, recordingState } = device;

  const handleSubmit = ({ name, macAddress, description }) => {
    setModalOpen(false);
    updateDeviceInDB({
      id,
      name,
      macAddress,
      description,
    });
  };

  const transitionDeviceToCloudRecordings = () => {
    setModalOpen(false);
    setActiveMenu(MenuItems.CR);

    const s3Dir = nameS3DirectoryFromDevice(id);
    const storedInfo = JSON.stringify({
      name,
      macAddress,
      s3Dir,
    });
    LocalStorageSetUtil.add(LocalStorageKeys.DEVICE_CLOUD_RECS, storedInfo);
  };

  const extraFormContent = (
    <Segment>
      <DevicePubSubControl
        deviceId={id}
        updateDeviceInDB={updateDeviceInDB}
        recordingState={recordingState}
        setModalOpen={setModalOpen}
      />
      <br />
      <Popup
        position='right center'
        content='Copied!'
        on='click'
        pinned
        trigger={
          <Button
            icon
            secondary
            inverted
            labelPosition='right'
            onClick={() => navigator.clipboard.writeText(id)}
          >
            S3 Dir | IoT UUID
            <Icon name='clipboard outline' />
          </Button>
        }
      />
    </Segment>
  );

  const bottomButtons = (
    <>
      <Button
        animated
        secondary
        onClick={() => {
          transitionDeviceToCloudRecordings();
        }}
      >
        <Button.Content visible>Browse Recordings</Button.Content>
        <Button.Content hidden>
          <Icon name='soundcloud' />
          <Icon name='arrow right' />
        </Button.Content>
      </Button>
      <Button primary negative onClick={() => setDeleteWarningModalOpen(true)}>
        Delete
      </Button>
    </>
  );

  return (
    <Modal
      closeIcon
      onClose={() => setModalOpen(false)}
      onOpen={() => setModalOpen(true)}
      open={modalOpen}
      trigger={trigger}
      size='tiny'
    >
      <Modal.Header>Device Control and Configuration</Modal.Header>

      <DeviceFormModalContent
        submitCallBack={handleSubmit}
        // || conditional since value prop for text area form field can't be null
        initialForm={{ ...device, description: device.description || '' }}
        extraFormContent={extraFormContent}
        extraActions={bottomButtons}
      />

      <Modal
        basic
        onClose={() => setDeleteWarningModalOpen(false)}
        open={deleteWarningModalOpen}
        size='small'
      >
        <Header icon>
          <Icon name='trash alternate outline' />
          Please confirm the deletion of this device and ALL its recordings?
        </Header>
        <Modal.Actions>
          <Button
            basic
            color='red'
            inverted
            onClick={() => setDeleteWarningModalOpen(false)}
          >
            <Icon name='remove' /> Fat-fingered it
          </Button>
          <Button
            color='green'
            inverted
            onClick={() => {
              setDeleteWarningModalOpen(false);
              deleteDeviceFromDB({ id });
            }}
          >
            <Icon name='checkmark' /> Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    </Modal>
  );
};
