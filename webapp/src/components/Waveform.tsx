import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Container, Icon, Progress } from 'semantic-ui-react';
import WaveSurfer from 'wavesurfer.js';
import colormap from 'colormap';
import SpectogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  downloadFromURL,
  getVoiceDirectionFromPlaybackProgress,
} from '../utils';
import { AppContext } from './AppContext';
import {
  audioFileName,
  directionFileName,
  SessionStorageKeys,
} from '../constants';
import { readRemoteFile } from 'react-papaparse';

const spectogramPlugin = SpectogramPlugin.create({
  wavesurfer: WaveSurfer,
  container: '#waveform',
  labels: true,
  colorMap: colormap({
    colormap: 'blackbody',
    nshades: 256,
    format: 'float',
    alpha: 0.85,
  }),
  height: 512,
});

const cursorPlugin = CursorPlugin.create({
  container: '#waveform',
  showTime: true,
  opacity: 1,
  customShowTimeStyle: {
    position: 'relative',
    color: '#fff',
    padding: '2px',
    'background-color': '#000',
    'font-size': '10px',
    'margin-top': '150%',
  },
});

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: '#eee',
  progressColor: 'Black',
  cursorColor: 'Black',
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 150,
  normalize: true, // If true, normalize by the maximum peak instead of 1.0.
  partialRender: true, // Use the PeakCache to improve rendering speed of large waveforms.
  audioContext: new AudioContext({
    sampleRate: 16000 * 4,
  }),
  plugins: [spectogramPlugin, cursorPlugin],
});

export const Waveform = ({
  audioFileURL,
  audioDirectionFileURL,
  s3SubDirName,
  selectedAudioFilter,
}) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    '🧭 Parsing Voice Direction Information'
  );
  const [voiceDirectionData, setVoiceDirectionData] = useState<
    [[number, number]]
  >([[-1, -1]]);
  const [currentVoiceDirection, setCurrentVoiceDirection] = useState(0);

  const { setS3DataOfRecordInAnalysis } = useContext(AppContext);

  const waveformRef = useRef(null);
  const wavesurfer: any = useRef(null);

  useEffect(() => {
    setPlaying(false);

    // Mount cursors on the div so progress bar is centered on mountreact set state of array of arrays
    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    readRemoteFile(audioDirectionFileURL, {
      fastMode: true,
      dynamicTyping: true,
      delimiter: ' ',
      skipEmptyLines: true,
      transform: (row) => row.split(' '),
      complete: (results) => {
        setVoiceDirectionData(results['data']);
        setLoadProgress(50); //  halfway there
      },
    });

    return () => wavesurfer.current.destroy();
    // eslint-disable-next-line
  }, [audioDirectionFileURL]);

  useEffect(() => {
    // so wavesurfer loads only once at "50%" load progress
    if (loadProgress === 50) {
      loadVoiceDataOnWavesurfer();
    }
    // eslint-disable-next-line
  }, [voiceDirectionData, loadProgress, currentVoiceDirection]);

  const loadVoiceDataOnWavesurfer = () => {
    setLoadingMessage('📏📐 Preparing Waveforms');

    const biquadFilter = wavesurfer.current.backend.ac.createBiquadFilter();
    biquadFilter.type = selectedAudioFilter;
    wavesurfer.current.backend.setFilter(biquadFilter);

    wavesurfer.current.load(audioFileURL);

    wavesurfer.current.on('loading', (loadProgress: number) => {
      loadProgress = loadProgress / 2 + 50;
      if (loadProgress < 100) {
        setLoadProgress(loadProgress);
      }
    });

    wavesurfer.current.on('ready', () => {
      setLoadProgress(100); // only set to 100 when waveform is ready

      // https://wavesurfer-js.org/docs/methods.html
      // make sure object is still available when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);

        const { spectrogram } = wavesurfer.current;
        if (spectrogram && spectrogram.wrapper) {
          const { wrapper } = spectrogram;
          wrapper.children[0].style.opacity = 0.5;
          wrapper.children[1].style.position = 'relative';
        }
      }
    });

    wavesurfer.current.on('audioprocess', (currTime: number) => {
      setCurrentVoiceDirection(
        getVoiceDirectionFromPlaybackProgress(
          voiceDirectionData,
          currTime / wavesurfer.current.getDuration()
        )
      );
    });

    wavesurfer.current.on('seek', (progress: number) => {
      setCurrentVoiceDirection(
        getVoiceDirectionFromPlaybackProgress(voiceDirectionData, progress)
      );
    });

    wavesurfer.current.on('finish', () => {
      if (wavesurfer.current) {
        setPlaying(false);
      }
    });

    wavesurfer.current.on('error', (err) => {
      console.error(err);
      sessionStorage.removeItem(SessionStorageKeys.AUDIO_ANALYSIS_URL_DATA);
      setS3DataOfRecordInAnalysis({});
    });
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = (e) => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
  };

  const soundAnalysisDataLoading = loadProgress < 100;

  const title = `${s3SubDirName}_${audioFileName} | ${selectedAudioFilter} filtered`;

  return (
    <>
      {soundAnalysisDataLoading ? '' : title}

      <div
        id='waveform'
        style={{
          position: 'relative',
          visibility: soundAnalysisDataLoading ? 'hidden' : 'visible',
          marginBottom: 7,
        }}
        ref={waveformRef}
      />

      {soundAnalysisDataLoading ? (
        <Progress
          percent={loadProgress}
          size='small'
          color='red'
          active
          indicating
          autoSuccess
          progress
        >
          {loadingMessage}
        </Progress>
      ) : (
        <Container
          textAlign='center'
          style={{ marginTop: 0, width: 180, height: 180 }}
        >
          <CircularProgressbarWithChildren
            strokeWidth={5}
            value={1}
            styles={buildStyles({
              rotation: currentVoiceDirection / 365,
              pathTransitionDuration: 0.1,
            })}
          >
            <br />
            <Button.Group>
              <Button
                primary
                icon
                circular
                compact
                size='medium'
                onClick={handlePlayPause}
              >
                <Icon
                  name={
                    playing ? 'pause circle outline' : 'play circle outline'
                  }
                />
              </Button>
              <Button
                icon
                circular
                compact
                size='medium'
                onClick={() => {
                  downloadFromURL(
                    audioFileURL,
                    s3SubDirName + '/' + audioFileName
                  );
                }}
              >
                <Icon name='download' />
                <Icon name='file audio outline' />
              </Button>
              <Button
                icon
                circular
                compact
                size='medium'
                onClick={() => {
                  downloadFromURL(
                    audioDirectionFileURL,
                    s3SubDirName + '/' + directionFileName
                  );
                }}
              >
                <Icon name='download' />
                <Icon name='compass outline' />
              </Button>
            </Button.Group>
            <br />
            <input
              style={{ height: '12px', marginRight: '3px' }}
              type='range'
              id='volume'
              name='volume'
              min='0.001' // waveSurfer sees min of 0 equal to value 1
              step='0.001'
              max='1'
              onChange={onVolumeChange}
              defaultValue={volume}
            />
            <br />
            {currentVoiceDirection}°
          </CircularProgressbarWithChildren>
        </Container>
      )}
    </>
  );
};
