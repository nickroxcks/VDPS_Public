import { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { LocalStorageKeys } from '../constants';
import { LocalStorageSetUtil } from '../utils';
import { RecordingSubdirectoriesList } from './';
import { CloseCloudRecording } from './CloseCloudRecording';

export const CloudRecordings = () => {
  // Locally tie this component to the top-level localStorage
  const [deviceRecordings, setDeviceRecordings] = useState(
    Array.from(LocalStorageSetUtil.getSet(LocalStorageKeys.DEVICE_CLOUD_RECS))
  );

  return (
    <>
      <br />
      {!deviceRecordings || !deviceRecordings.length ? (
        <h4>
          <Icon name='info circle' /> No device(s) chosen from "Device
          Management"
        </h4>
      ) : (
        <Accordion
          fluid
          styled
          defaultActiveIndex={0}
          panels={deviceRecordings.map((deviceRecordInfo) => {
            const { name, macAddress, s3Dir } = JSON.parse(deviceRecordInfo);
            return {
              key: s3Dir,
              title: {
                icon: <Icon style={{ float: 'left' }} name='folder' />,
                content: (
                  <>
                    {name} | {macAddress} | {s3Dir}
                    <CloseCloudRecording
                      deviceRecordInfo={deviceRecordInfo}
                      setDeviceRecordings={setDeviceRecordings}
                    />
                  </>
                ),
              },
              content: {
                content: <RecordingSubdirectoriesList s3Dir={s3Dir} />,
              },
            };
          })}
        />
      )}
    </>
  );
};
