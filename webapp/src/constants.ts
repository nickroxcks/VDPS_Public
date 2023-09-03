export enum MenuItems {
  DM = 'Device Management',
  CR = 'Cloud Recordings',
  An = 'Sound Analysis',
}

export enum RecordingState {
  STOP = 'STOP',
  SOUND_RECORDING = 'SOUND_RECORDING',
}

export enum RecordingPubSubCommands {
  START_RECORDING = '/START_RECORDING',
  STOP_RECORDING = '/STOP_RECORDING',
}

export enum RecordingPubSubChannels {
  RECORDING_ENDED = '/RECORDING_ENDED',
}

export const RecordingStateSemanticIcon = {
  STOP: 'microphone slash',
  SOUND_RECORDING: 'microphone',
};

export enum LocalStorageKeys {
  DEVICE_CLOUD_RECS = 'DEV_CLOUD_RECS',
}

export enum SessionStorageKeys {
  AUDIO_ANALYSIS_URL_DATA = 'AUDIO_ANALYSIS_URL_DATA',
}

// https://webaudio.github.io/web-audio-api/#idl-def-BiquadFilterType
export enum BiquadFilterWebAudioTypes {
  allpass = 'allpass',
  lowpass = 'lowpass',
  bandpass = 'bandpass',
  highpass = 'highpass',
  lowshelf = 'lowshelf',
  highshelf = 'highshelf',
  peaking = 'peaking',
  notch = 'notch',
}

export const S3FileSystemObjectKey = '__data';
export const audioFileName = 'audio.wav';
export const directionFileName = 'direction.txt';
export const apiCredsFileName = 'API_Credentials.zip';
