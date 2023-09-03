import { Storage } from 'aws-amplify';

export const deleteS3Folder = async (rootFolder: string) => {
  // Recursively deletes internal subfolders as well as other objects
  const subDirs = await Storage.list(rootFolder);
  for (const subDir of subDirs) {
    await Storage.remove(subDir['key']);
  }
  await Storage.remove(rootFolder);
};
