import time
import threading
import wave
from mic_array import MicArray
from datetime import datetime


def record(run_time=20, mic_channels=4):
    '''
    Runs the localization. 
    Will accept a integer representing a number of seconds to run 
    and will record / process sound from the mic until timer is done. 
    Will create two files, one a .wav of the actual recorded audio 
    and another text file of the sound direction and time delta.
    Ex Format.
    [Degree] [HR:MM:SS]
    '''
    TEXT_FILE = "./tmp/direction.txt"
    WAVE_FILE = "./tmp/audio.wav"
    RESPEAKER_RATE = 16000
    RESPEAKER_WIDTH = 2

    with MicArray(RESPEAKER_RATE, 4, RESPEAKER_RATE / 4) as mic:
        # WAV file set up
        wf = wave.open(WAVE_FILE, 'wb')
        wf.setnchannels(mic_channels)
        wf.setsampwidth(
            mic.pyaudio_instance.get_sample_size(
                mic.pyaudio_instance.get_format_from_width(RESPEAKER_WIDTH)
            )
        )
        wf.setframerate(RESPEAKER_RATE)

        f = open(TEXT_FILE, "w")
        start_time = time.time()

        for chunk in mic.read_chunks():
            direction = mic.get_direction(chunk)
            print(int(direction))

            # Write direction to text file
            f.write("{a} {b}\n".format(
                a=int(direction), b=time.time() - start_time))

            elasped = time.time() - start_time
            print("--- %s seconds ---" % (elasped))
            if elasped >= run_time:
                break

        f.close()

        # Write audio date to WAV file
        wf.writeframes(b''.join(mic.recorded_data))
        wf.close()
