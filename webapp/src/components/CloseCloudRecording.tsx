import { Button } from 'semantic-ui-react';
import { LocalStorageKeys } from '../constants';
import { LocalStorageSetUtil } from '../utils';

export const CloseCloudRecording = ({
  deviceRecordInfo,
  setDeviceRecordings,
}) => {
  return (
    <Button
      onClick={() => {
        setDeviceRecordings(
          LocalStorageSetUtil.delete(
            LocalStorageKeys.DEVICE_CLOUD_RECS,
            deviceRecordInfo
          )
        );
      }}
      style={{ float: 'right' }}
      basic
      compact
      size='mini'
      icon='close'
    />
  );
};
