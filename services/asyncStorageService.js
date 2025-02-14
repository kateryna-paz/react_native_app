import AsyncStorage from "@react-native-async-storage/async-storage";

export class AsyncStorageService {
  async getData(key) {
    try {
      const value = await AsyncStorage.getItem(key);

      if (value !== null) {
        return value;
      }
    } catch (e) {
      this.getErrorMessage(e);
    }
  }

  async setData(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      this.getErrorMessage(e);
    }
  }

  async removeData(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      this.getErrorMessage(e);
    }
  }

  async setStringifiedData(key, data) {
    try {
      const stringifiedData = JSON.stringify(data);
      await this.setData(key, stringifiedData);
    } catch (e) {
      this.getErrorMessage(e);
    }
  }

  async getParsedData(key) {
    try {
      const data = await this.getData(key);
      if (data) {
        const parsedData = JSON.parse(data);
        return parsedData;
      }
    } catch (e) {
      this.getErrorMessage(e);
    }
  }

  getErrorMessage(error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.error("Error: ", error);
  }
}

export const asyncStorage = new AsyncStorageService();
