import localStorageService from "./localStorageService";
import { LocalStorgeKey } from "./type";

export const addToLocalStorageArry = (key: LocalStorgeKey, value: string) => {
  const storedItems = localStorageService.getLocalStorageItem(key);

  if (storedItems) {
    let newPs = JSON.parse(storedItems);
    newPs.push(value);
    localStorageService.setLocalStorageItem({
      key: key,
      value: JSON.stringify(newPs)
    });
  } else {
    let arr = [value];
    localStorageService.setLocalStorageItem({
      key: key,
      value: JSON.stringify(arr)
    });
  }
};

export const removeFromLocalStorageArry = (key: LocalStorgeKey, value: string) => {
  const storedItems = localStorageService.getLocalStorageItem(key);
  if (storedItems) {
    let items = JSON.parse(storedItems);
    if (items.includes(value)) {
      const i = items.findIndex((p) => p === value);
      items.splice(i, 1);
      localStorageService.setLocalStorageItem({
        key: key,
        value: JSON.stringify(items)
      });
    }
  }
};
