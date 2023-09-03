import { Storage } from 'aws-amplify';

export const getS3FileAccessURL = async (
  key: string,
  ttl: number = 10
): Promise<string> => {
  return (await Storage.get(key, {
    expires: ttl * 60, // ttl min. url  for some security
  })) as string;
};
