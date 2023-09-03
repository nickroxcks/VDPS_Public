import { createRef } from 'react';
import { PubSub } from 'aws-amplify';
import { Button, Input } from 'semantic-ui-react';
import { RecordingPubSubCommands, RecordingState } from '../constants';

export const DevicePubSubControl = ({
  deviceId,
  updateDeviceInDB,
  recordingState,
  setModalOpen,
}) => {
  const inputRef: React.LegacyRef<Input> | undefined = createRef();

  const notifyToStartRecording = () => {
    if (inputRef.current) {
      const durationInSeconds = Math.abs(
        inputRef.current['inputRef']['current']['valueAsNumber']
      );
      if (durationInSeconds && durationInSeconds > 0) {
        PubSub.publish(
          deviceId + RecordingPubSubCommands.START_RECORDING,
          durationInSeconds
        );
        updateDeviceInDB({
          id: deviceId,
          recordingState: RecordingState.SOUND_RECORDING,
        });
        setModalOpen(false);
      }
    }
  };

  const notifyToStopRecording = () => {
    PubSub.publish(deviceId + RecordingPubSubCommands.STOP_RECORDING, 1);
    setModalOpen(false);
  };

  return (
    <div>
      {recordingState === RecordingState.STOP ? (
        <Input
          action={{
            color: 'green',
            labelPosition: 'right',
            icon: 'microphone',
            content: 'Record From IoT',
            inverted: true,
            onClick: () => notifyToStartRecording(),
          }}
          actionPosition='left'
          placeholder='Duration (sec)'
          ref={inputRef}
          size='mini'
          type='number'
          min={0}
        />
      ) : (
        <Button
          content='Stop Recording'
          icon='stop'
          labelPosition='left'
          onClick={() => notifyToStopRecording()}
        />
      )}
    </div>
  );
};
