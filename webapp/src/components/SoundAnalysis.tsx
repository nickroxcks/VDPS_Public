import { useContext } from 'react';
import { Icon } from 'semantic-ui-react';
import { SessionStorageKeys } from '../constants';
import { AppContext, Waveform } from './';

export const SoundAnalysis = () => {
  const { s3DataOfRecordInAnalysis } = useContext(AppContext);
  const {
    s3SubDirName,
    audioFileURL,
    audioDirectionFileURL,
    selectedAudioFilter,
  } = s3DataOfRecordInAnalysis;

  const seshStoredAudioUrlData = JSON.parse(
    sessionStorage.getItem(SessionStorageKeys.AUDIO_ANALYSIS_URL_DATA) || '{}'
  );
  const {
    s3SubDirName: seshStoredS3SubDirName,
    audioFileURL: seshStoredFileURL,
    audioDirectionFileURL: seshStoredAudioDirectionFileURL,
    selectedAudioFilter: seshStoredSelectedAudioFilter,
  } = seshStoredAudioUrlData;

  return (
    <>
      <br />
      {(() => {
        if (s3SubDirName) {
          sessionStorage.setItem(
            SessionStorageKeys.AUDIO_ANALYSIS_URL_DATA,
            JSON.stringify(s3DataOfRecordInAnalysis)
          );
          return (
            <Waveform
              audioFileURL={audioFileURL}
              audioDirectionFileURL={audioDirectionFileURL}
              s3SubDirName={s3SubDirName}
              selectedAudioFilter={selectedAudioFilter}
            />
          );
        } else if (seshStoredS3SubDirName) {
          return (
            <Waveform
              audioFileURL={seshStoredFileURL}
              audioDirectionFileURL={seshStoredAudioDirectionFileURL}
              s3SubDirName={seshStoredS3SubDirName}
              selectedAudioFilter={seshStoredSelectedAudioFilter}
            />
          );
        } else {
          return (
            <h4>
              <Icon name='info circle' /> No recording chosen from "Cloud
              Recordings"
              <br />
              <br />
              Cached authenticated access to a previous opened recording might
              have expired or an error has occurred
            </h4>
          );
        }
      })()}
    </>
  );
};
