import os
import boto3
from botocore.exceptions import ClientError
from datetime import datetime


def uploadToS3():
    '''
    Uploads contents of /tmp folder to S3 Bucket
    '''
    iothingId = os.getenv("IoThing_VDPS_UUID")
    BUCKET = os.getenv("S3_VDPS_RECORDING_BUCKET")
    REC_NAME = "rec_{}".format(datetime.now().strftime("%d:%m:%Y_%H:%M:%S"))

    FILE1 = "./tmp/direction.txt"
    FILE2 = "./tmp/audio.wav"

    PATH1 = "public/{}/{}/{}".format(iothingId, REC_NAME, "direction.txt")
    PATH2 = "public/{}/{}/{}".format(iothingId, REC_NAME, "audio.wav")

    session = boto3.session.Session(profile_name="vdps-reporter")
    s3 = session.client("s3")
    with open(FILE1, "rb") as f:
        s3.upload_fileobj(f, BUCKET, PATH1)

    with open(FILE2, "rb") as f:
        s3.upload_fileobj(f, BUCKET, PATH2)
