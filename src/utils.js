/* Utility functions mostly related to accessing LocalStorage objects */

export function removeFromArray(array, value) {
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

export function getFavouritesList() {
  const favourites = window.localStorage.getItem('favourites') || '[]';
  return JSON.parse(favourites);
}

export function saveFavouritesList(anArray) {
  let asString = JSON.stringify(anArray);
  window.localStorage.setItem('favourites', asString);
}
