export const getVoiceDirectionFromPlaybackProgress = (
  voiceDirectionData: [[number, number]],
  progressPercent: number
): number => {
  return voiceDirectionData[
    Math.round((voiceDirectionData.length - 1) * progressPercent)
  ][0];
};
