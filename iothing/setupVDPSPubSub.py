import os
import sys
import time
from record import record
from uploadToS3 import uploadToS3


def setupVDPSPubSub(mqttClient):
    def runRecordingProcess(self, params, packet):
        print("----- Received New MQTT Payload -----")
        print("Topic: ", packet.topic)
        print("Message: ", packet.payload)

        durationInSeconds = float(packet.payload)
        record(durationInSeconds)
        uploadToS3()

        print("\nNotifying the front-end of end of entire recording process\n")
        mqttClient.publishAsync(
            os.getenv("IoThing_VDPS_UUID") + "/RECORDING_ENDED", durationInSeconds, QoS=1
        )

        print("-------------------------------------")

        # Hard restart program to refresh mic recognition (full path given for full permission)
        os.execv(sys.executable, ['python'] + [sys.argv[0]])

    mqttClient.subscribe(
        os.getenv("IoThing_VDPS_UUID") + "/START_RECORDING",
        # Quality of Service (QoS) Delivery Guarantee Agreement:
        # [at most        := 0 | at least   := 1 | exactly    := 2][once]
        # [not guaranteed := 0 | guaranteed := 1 | guaranteed := 2]
        1,
        runRecordingProcess
    )

    def hardStopProgram(self, params, packet):
        print("\nNotifying the front-end of hard stop of entire recording process\n")
        mqttClient.publishAsync(
            os.getenv("IoThing_VDPS_UUID") + "/RECORDING_ENDED", 0, QoS=1
        )
        # Hard restart program to refresh mic recognition (full path given for full permission)
        os.execv(sys.executable, ['python'] + [sys.argv[0]])

    mqttClient.subscribe(
        os.getenv("IoThing_VDPS_UUID") + "/STOP_RECORDING",
        # Quality of Service (QoS) Delivery Guarantee Agreement:
        # [at most        := 0 | at least   := 1 | exactly    := 2][once]
        # [not guaranteed := 0 | guaranteed := 1 | guaranteed := 2]
        1,
        hardStopProgram
    )
