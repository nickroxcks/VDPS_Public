import _ from 'lodash';
import { useEffect, useState } from 'react';
import { API, PubSub, Storage, graphqlOperation } from 'aws-amplify';
import { listIoThings } from '../graphql/queries';
import {
  createIoThing,
  deleteIoThing,
  updateIoThing,
} from '../graphql/mutations';
import { Icon, Loader, Table, TableHeaderCellProps } from 'semantic-ui-react';
import { DeviceCreateModal, DeviceUpdateModal } from './';
import { nameS3DirectoryFromDevice, deleteS3Folder } from '../utils';
import {
  RecordingStateSemanticIcon,
  RecordingPubSubChannels,
  RecordingState,
} from '../constants';
import { Paginator } from './Paginator';

export const DeviceManagement = () => {
  const [deviceManage, setDeviceManage] = useState({
    devices: [],
    sortedByKey: 'updatedAt',
  });
  const [deviceSortDirection, setDeviceSortDirection] = useState('descending');
  const [tableLoading, setTableLoading] = useState(true);

  let isMounted = true;
  useEffect(() => {
    // eslint-disable-next-line
    isMounted = true; // ok to disable linter warning for adding a ref for this variable
    fetchDevices();
    const interval = setInterval(() => fetchDevices(), 3000); // 3 sec(s) refresh rate

    return () => {
      isMounted = false; // fix for no-op unmount errors
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [deviceSortDirection]); // ok to disable linter warning for having just these deps

  const fetchDevices = async () => {
    try {
      let deviceData: any = await API.graphql(graphqlOperation(listIoThings));
      for (const device of deviceData.data.listIoThings.items) {
        if (device['id']) {
          setRecordingStateToStopViaPubSub(device['id']);
        }
      }
      if (isMounted) {
        setDeviceManage({
          ...deviceManage,
          devices: _.orderBy(
            [...deviceData.data.listIoThings.items],
            [deviceManage.sortedByKey],
            [deviceSortDirection === 'ascending' ? 'asc' : 'desc']
          ),
        });
        setTableLoading(false);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const setRecordingStateToStopViaPubSub = (deviceId: string) => {
    PubSub.subscribe(
      deviceId + RecordingPubSubChannels.RECORDING_ENDED
    ).subscribe({
      next: async (_) => {
        await updateDeviceInDB({
          id: deviceId,
          recordingState: RecordingState.STOP,
        });
      },
      error: (error) => console.error(error),
    });
  };

  const addDeviceToDB = async (newDevice) => {
    try {
      let deviceData: any = await API.graphql(
        graphqlOperation(createIoThing, { input: newDevice })
      );

      const { id } = deviceData.data.createIoThing;
      await Storage.put(nameS3DirectoryFromDevice(id), {});

      setDeviceManage({
        ...deviceManage,
        devices: _.orderBy(
          [...deviceManage.devices, deviceData.data.createIoThing] as any,
          [deviceManage.sortedByKey],
          [deviceSortDirection === 'ascending' ? 'asc' : 'desc']
        ),
      });
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  const updateDeviceInDB = async (updatedDevice) => {
    try {
      await API.graphql(
        graphqlOperation(updateIoThing, { input: updatedDevice })
      );
      await fetchDevices();
    } catch (error) {
      console.error('Error updating device:', error);
    }
  };

  const deleteDeviceFromDB = async (iDObject) => {
    try {
      await API.graphql(graphqlOperation(deleteIoThing, { input: iDObject }));
      await deleteS3Folder(nameS3DirectoryFromDevice(iDObject.id));
      await fetchDevices();
    } catch (error) {
      console.error('Error updating device:', error.errors[0].message);
    }
  };

  const { devices, sortedByKey } = deviceManage;

  if (tableLoading) {
    return (
      <>
        <br />
        <Loader active inline />
      </>
    );
  }

  return (
    <Table sortable celled compact definition selectable textAlign='center'>
      <Table.Header fullWidth>
        <Table.Row>
          <Table.HeaderCell>Device Name</Table.HeaderCell>
          <Table.HeaderCell>Recording State</Table.HeaderCell>
          <Table.HeaderCell>MAC Address</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell
            sorted={
              sortedByKey === 'updatedAt'
                ? (deviceSortDirection as TableHeaderCellProps['sorted'])
                : undefined
            }
            onClick={() =>
              tableSorter(
                'updatedAt',
                deviceManage,
                setDeviceManage,
                deviceSortDirection,
                setDeviceSortDirection
              )
            }
          >
            Updated At
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {devices &&
          devices.map((device) => {
            const {
              id,
              name,
              macAddress,
              recordingState,
              description,
              updatedAt,
            } = device;
            return (
              <DeviceUpdateModal
                key={id}
                trigger={
                  <Table.Row>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell>
                      <Icon name={RecordingStateSemanticIcon[recordingState]} />
                    </Table.Cell>
                    <Table.Cell>{macAddress}</Table.Cell>
                    <Table.Cell>{description}</Table.Cell>
                    <Table.Cell>{updatedAt}</Table.Cell>
                  </Table.Row>
                }
                device={device}
                updateDeviceInDB={updateDeviceInDB}
                deleteDeviceFromDB={deleteDeviceFromDB}
              />
            );
          })}
      </Table.Body>

      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell colSpan='6'>
            <DeviceCreateModal addDeviceToDB={addDeviceToDB} />
            <Paginator disabled={true} />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

const tableSorter = (
  column,
  deviceManage,
  setDeviceManage,
  deviceSortDirection,
  setDeviceSortDirection
) => {
  if (!deviceManage.devices) return;
  setDeviceManage({
    ...deviceManage,
    sortedByKey: column,
    devices: _.orderBy(
      [...deviceManage.devices],
      [deviceManage.sortedByKey],
      [deviceManage.sortDirection === 'ascending' ? 'desc' : 'asc']
    ),
  });

  setDeviceSortDirection(
    deviceSortDirection === 'ascending' ? 'descending' : 'ascending'
  );
};
