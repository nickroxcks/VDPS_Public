import os
import sys
import time
from getConnectedMQTTPubSubClient import getConnectedMQTTPubSubClient
from setupVDPSPubSub import setupVDPSPubSub
from record import record
from uploadToS3 import uploadToS3


def main():
    print("(Re)starting Your VDPS IoThing...")
    try:
        mqttClient = getConnectedMQTTPubSubClient(
            os.getenv("IoThing_VDPS_UUID")
        )
        setupVDPSPubSub(mqttClient)
        print("IoT Device Now Subscribed To Front-End!")
        while True:
            time.sleep(5)
    except:
        print("Oops!", sys.exc_info()[0], "occurred.")


if __name__ == "__main__":
    main()
