class LocalStorageSetUtil {
  add(lsKey: string, stringInfo: string): string[] {
    let newSet: Set<string>;

    const storedSet = this.getSet(lsKey);
    if (!storedSet.size) {
      newSet = new Set<string>([stringInfo]);
    } else {
      newSet = storedSet.add(stringInfo);
    }
    return this.setSet(lsKey, newSet);
  }

  delete(lsKey: string, stringInfo: string): string[] {
    const newSet = this.getSet(lsKey);
    newSet.delete(stringInfo);

    return this.setSet(lsKey, newSet);
  }

  getSet(lsKey: string): Set<string> {
    return new Set<string>(JSON.parse(localStorage.getItem(lsKey) || '[]'));
  }

  setSet(lsKey: string, newSet: Set<string>): string[] {
    const newStoredArray = Array.from(newSet);
    localStorage.setItem(lsKey, JSON.stringify(newStoredArray));

    return newStoredArray;
  }
}

export default new LocalStorageSetUtil();
