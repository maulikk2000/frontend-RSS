import { LocalStorage } from "./type";

const localStorageService = (function () {
  var _service;
  function _getService() {
    if (!_service) {
      return _service;
    }
    return _service;
  }
  function _setLocalStorageItem(localStorageObj: LocalStorage) {
    localStorage.setItem(localStorageObj.key, localStorageObj.value);
  }

  function _getLocalStorageItem(key: string) {
    return localStorage.getItem(key);
  }

  function _clearLocalStorageItem(key: string) {
    localStorage.removeItem(key);
  }

  function _clearAllLocalStorage() {
    localStorage.clear();
  }

  return {
    getService: _getService,
    setLocalStorageItem: _setLocalStorageItem,
    getLocalStorageItem: _getLocalStorageItem,
    clearLocalStorageItem: _clearLocalStorageItem,
    clearAll: _clearAllLocalStorage
  };
})();
export default localStorageService;
