import os
import AWSIoTPythonSDK
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient


def getConnectedMQTTPubSubClient(clientId):
    print("MQTT IoThing Starting...")

    # Unique ID. If another connection using the same key is opened the previous one is auto closed by AWS IOT
    mqtt_client = AWSIoTMQTTClient(clientId)

    # Used to configure the host name and port number the underneath AWS IoT MQTT Client tries to connect to
    mqtt_client.configureEndpoint(
        os.getenv("AWS_ENDPOINT"),
        os.getenv("AWS_PORT", 8883)
    )
    mqtt_client.configureCredentials(
        "./creds/rootCA.pem",
        "./creds/private.pem.key",
        "./creds/certificate.pem.crt"
    )

    # Configure the offline queue for publish requests to be 20 in size and drop the oldest
    mqtt_client.configureOfflinePublishQueueing(-1)

    # Used to configure the draining speed to clear up the queued requests when the connection is back
    mqtt_client.configureDrainingFrequency(2)  # 2 Hz
    mqtt_client.configureConnectDisconnectTimeout(10)  # 10 seconds
    mqtt_client.configureMQTTOperationTimeout(5)  # 5 seconds

    # Connect to AWS IoT with default keepalive set to 600 seconds
    mqtt_client.connect()

    return mqtt_client
