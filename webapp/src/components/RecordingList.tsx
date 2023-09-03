import { useContext, useState } from 'react';
import { Button, Dropdown, Icon, List, Loader } from 'semantic-ui-react';
import ReactAudioPlayer from 'react-audio-player';
import {
  audioFileName,
  BiquadFilterWebAudioTypes,
  directionFileName,
  MenuItems,
  S3FileSystemObjectKey,
} from '../constants';
import { downloadFromURL, getS3FileAccessURL } from '../utils';
import { AppContext } from '.';

export const RecordingList = ({ recordings, s3SubDirName }) => {
  const [recordingPlaying, setRecordingPlaying] = useState('');
  const [audioFileURL, setAudioFileURL] = useState<Object | string | undefined>(
    undefined
  );
  const [audioDirectionFileURL, setAudioDirectionFileURL] = useState<
    Object | string | undefined
  >(undefined);
  const [selectedAudioFilter, setSelectedAudioFilter] = useState<
    BiquadFilterWebAudioTypes
  >(BiquadFilterWebAudioTypes.allpass);

  const { setActiveMenu, setS3DataOfRecordInAnalysis } = useContext(AppContext);

  const toggleRecordingPreview = async (record) => {
    if (recordingPlaying === record) {
      setRecordingPlaying('');
      return;
    }
    try {
      setRecordingPlaying(record);
      setAudioFileURL(
        await getS3FileAccessURL(
          recordings[audioFileName][S3FileSystemObjectKey].key
        )
      );
      setAudioDirectionFileURL(
        await getS3FileAccessURL(
          recordings[directionFileName][S3FileSystemObjectKey].key
        )
      );
      return;
    } catch (error) {
      console.error('Error accessing the file from S3', error);
      setAudioFileURL('');
      setRecordingPlaying('');
    }
  };

  const audioFilterMenuOptions = Object.keys(BiquadFilterWebAudioTypes)
    .filter((v) => !Number(v) && Number(v) !== 0)
    .map((filter) => ({
      key: filter,
      text: filter,
      value: filter,
    }));

  const audioFileListItem = (idx, record, listItemDesc, key) => (
    <List.Item key={idx} onClick={() => toggleRecordingPreview(record)}>
      <List.Content>
        <List.Header as='a'>
          <List.Icon name='file audio outline' />
          {record}
        </List.Header>
        {listItemDesc}
        {record === recordingPlaying && audioFileURL && (
          <>
            <ReactAudioPlayer
              src={audioFileURL as string}
              controls
              style={{ height: '40px', width: '99.2%' }}
            />
            <Button
              onClick={() => {
                setActiveMenu(MenuItems.An);
                setS3DataOfRecordInAnalysis({
                  s3SubDirName,
                  audioFileURL,
                  audioDirectionFileURL,
                  selectedAudioFilter,
                });
              }}
              basic
              circular
              style={{ float: 'right' }}
            >
              <Icon name='chart bar outline' />
              <Icon name='arrow right' />
            </Button>
            <Dropdown
              onChange={(e, { value }) => {
                setSelectedAudioFilter(value as BiquadFilterWebAudioTypes);
              }}
              value={selectedAudioFilter}
              text={selectedAudioFilter}
              options={audioFilterMenuOptions}
              closeOnBlur
              closeOnEscape
              style={{ float: 'right' }}
              button
              className='icon'
              floating
              labeled
              icon='assistive listening systems'
              scrolling
              basic
              header={
                <Dropdown.Header
                  icon='question circle outline'
                  content={
                    <a
                      href='https://webaudio.github.io/web-audio-api/#enumdef-biquadfiltertype'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Filter Information
                    </a>
                  }
                />
              }
            />
          </>
        )}
      </List.Content>
    </List.Item>
  );

  const directionFileListItem = (idx, record, listItemDesc, key) => (
    <List.Item
      key={idx}
      onClick={async () => downloadFromURL(await getS3FileAccessURL(key), key)}
    >
      <List.Content>
        <List.Header as='a'>
          <List.Icon name='compass outline' />
          {record}
        </List.Header>
        {listItemDesc}
      </List.Content>
    </List.Item>
  );

  return (
    <List divided>
      {recordings ? (
        Object.keys(recordings)
          .filter((record) => record !== S3FileSystemObjectKey)
          .map((record, idx) => {
            const { key, lastModified, size } = recordings[record][
              S3FileSystemObjectKey
            ];

            const listItemDesc = (
              <List.Description as='a'>
                {`${lastModified} | ${Math.round((size / 1024) * 10) / 10} KB`}
              </List.Description>
            );

            return record === audioFileName
              ? audioFileListItem(idx, record, listItemDesc, key)
              : directionFileListItem(idx, record, listItemDesc, key);
          })
      ) : (
        <List.Item>
          <Loader active inline />
        </List.Item>
      )}
    </List>
  );
};
