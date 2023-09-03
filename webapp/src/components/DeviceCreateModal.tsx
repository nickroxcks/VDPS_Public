import { useState } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { DeviceFormModalContent } from './';
import { RecordingState } from '../constants';

export const DeviceCreateModal = ({ addDeviceToDB }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = ({ name, macAddress, description }) => {
    setModalOpen(false);
    addDeviceToDB({
      name,
      recordingState: RecordingState.STOP,
      macAddress,
      description,
    });
  };

  return (
    <Modal
      closeIcon
      dimmer='blurring'
      onClose={() => setModalOpen(false)}
      onOpen={() => setModalOpen(true)}
      open={modalOpen}
      size='tiny'
      trigger={
        <Button
          floated='right'
          icon
          labelPosition='left'
          primary
          size='small'
          style={{ marginTop: 5, marginRight: '0.6em' }}
          onClick={() => setModalOpen(true)}
        >
          <Icon name='plus' /> Add Device
        </Button>
      }
    >
      <Modal.Header>Add New Device</Modal.Header>

      <DeviceFormModalContent submitCallBack={handleSubmit} />
    </Modal>
  );
};
