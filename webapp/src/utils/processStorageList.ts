import { S3FileSystemObjectKey } from '../constants';

export const processStorageList = (results) => {
  const filesystem = {};
  // https://stackoverflow.com/questions/44759750/how-can-i-create-a-nested-object-representation-of-a-folder-structure
  const add = (source, target, item) => {
    const elements = source.split('/');
    const element = elements.shift();
    if (!element) return; // blank
    target[element] = target[element] || { [S3FileSystemObjectKey]: item }; // element;
    if (elements.length) {
      target[element] =
        typeof target[element] === 'object' ? target[element] : {};
      add(elements.join('/'), target[element], item);
    }
  };
  results.forEach((item) => add(item.key, filesystem, item));
  return filesystem;
};
