import { useState } from 'react';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { deleteS3Folder } from '../utils';

export const DeleteCloudRecording = ({
  s3RecFolderKeyPath,
  reloadRecordingSubdirList,
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(false);

  return (
    <Popup
      trigger={
        <Button
          style={{ float: 'right' }}
          basic
          compact
          size='mini'
          color='red'
          circular
          icon='trash alternate outline'
          onClick={
            (e) => e.stopPropagation() // Prevents parent accordion from folding in & out on
          }
        />
      }
      open={popupOpen}
      onOpen={() => setPopupOpen(true)}
      onClose={() => setPopupOpen(false)}
      position='top center'
      on='click'
    >
      <div style={{ marginBottom: 5, textAlign: 'center' }}>
        <strong>Delete Recording?</strong>
        <br />
        All files and folders in this recording subdirectory will be recursively
        deleted!
      </div>
      <Button
        floated='right'
        basic
        compact
        size='mini'
        color='green'
        loading={deletingRecord}
        onClick={async (e) => {
          e.stopPropagation(); // Prevents parent accordion from folding in & out on
          setDeletingRecord(true);
          await deleteS3Folder(s3RecFolderKeyPath);
          setDeletingRecord(false);
          await reloadRecordingSubdirList();
        }}
      >
        <Icon name='check' /> Yes
      </Button>
      <Button
        floated='right'
        basic
        compact
        size='mini'
        color='red'
        onClick={(e) => {
          e.stopPropagation();
          setPopupOpen(false);
        }}
      >
        <Icon name='close' /> No
      </Button>
    </Popup>
  );
};
