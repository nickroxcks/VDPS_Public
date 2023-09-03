import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Storage } from 'aws-amplify';
import { Accordion, Button, Icon, Loader } from 'semantic-ui-react';
import { RecordingList } from './';
import { processStorageList } from '../utils';
import { S3FileSystemObjectKey } from '../constants';
import { Paginator } from './Paginator';
import { DeleteCloudRecording } from './DeleteCloudRecording';

export const RecordingSubdirectoriesList = ({ s3Dir }) => {
  const [s3DirFS, setS3DirFS] = useState<any>(undefined);
  const [subDirEmpty, setSubDirEmpty] = useState(true);

  let isMounted = true;
  useEffect(() => {
    fetchRecordingList();

    return () => {
      // eslint-disable-next-line
      isMounted = false; // fix for no-op unmount errors
    };
  }, [s3Dir]);

  const fetchRecordingList = async () => {
    try {
      const s3SubDirectoryKeys = _.orderBy(
        [
          ...(await Storage.list(s3Dir)).filter(
            ({ key }) => /\/.+/g.test(key) // filters out the empty dir S3 makes
          ),
        ],
        ['lastModified'],
        ['desc'] // most recent recordings on top
      );
      if (isMounted) {
        const dirFS = processStorageList(s3SubDirectoryKeys) as any;
        setS3DirFS(dirFS);
        if (Object.keys(dirFS).length > 0) {
          setSubDirEmpty(false);
        }
      }
    } catch (error) {
      console.error('Error on fetching recordings', error);
    }
  };

  const reloadRecordingSubdirList = () => {
    setS3DirFS(undefined);
    setSubDirEmpty(true);
    fetchRecordingList();
  };

  return (
    <>
      <Button
        circular
        icon='redo'
        size='mini'
        basic
        style={{ marginBottom: 0 }}
        onClick={() => reloadRecordingSubdirList()}
      />
      <Accordion.Accordion
        panels={(() => {
          const panels: any[] = [];
          if (s3DirFS) {
            const s3DirWithoutFwdSlash = s3Dir.slice(0, -1);
            const s3SubDir = s3DirFS[s3DirWithoutFwdSlash];
            if (s3SubDir) {
              for (const key of Object.keys(s3SubDir)) {
                if (key === S3FileSystemObjectKey) {
                  continue;
                }
                panels.push({
                  key,
                  title: {
                    icon: (
                      <Icon style={{ visibility: 'hidden' }} name='folder' />
                    ),
                    content: (
                      <>
                        {key}
                        <DeleteCloudRecording
                          // Note: the Storage sdk does not care if the path key has a fwd slash ending or not
                          s3RecFolderKeyPath={`${s3DirWithoutFwdSlash}/${key}`}
                          reloadRecordingSubdirList={reloadRecordingSubdirList}
                        />
                      </>
                    ),
                  },
                  content: {
                    content: (
                      <RecordingList
                        recordings={s3SubDir[key]}
                        s3SubDirName={s3Dir + key}
                      />
                    ),
                  },
                });
              }
            }
            return panels;
          } else {
            return [
              {
                key: -1,
                title: undefined,
                content: <Loader key={-1} active inline />,
              },
            ];
          }
        })()}
      />
      {subDirEmpty ? <></> : <Paginator disabled={true} />}
    </>
  );
};
