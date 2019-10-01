import { CloneItems } from "./index";
export const GetItem=(ItemKey) =>{
    let item = null;
    for (let ii = 0; ii < CloneItems.StItems.length; ii++) {
      const value = CloneItems.StItems[ii];
      if (value != undefined) {
        const { Items: ItemList } = value;
        for (let i = 0; i < ItemList.length; i++) {
          const element = ItemList[i];
          if (element.ItemKey == ItemKey) {
            item = element;
            break;
          }
        }
      }
      if (item != null) break;
    }
    return item;
};
export const getCloneItems = () => {
  return CloneItems.Clons;
};
export const pushCloneItem = elements => {
  CloneItems.Clons.push(elements);
};
export const UpdateCloneItem = (index, value) => {
  if (value != undefined && value != null) {
    CloneItems.Clons.forEach(function(element, i) {
      if (element != undefined) {
        if (element.index == index) {
          element.value = value;
        }
      }
    });
  }
};

export const GetCloneItem = index => {
  if (index) {
    let item = null;
    CloneItems.Clons.forEach(function(element, i) {
      if (element != undefined) {
        if (element.index == index) {
          item = element;
        }
      }
    });
    if (item != undefined && item != null) {
      return item;
    }
  }
  return null;
};
export const SetFilterCloneWithIndex = cloneId => {
  let _removeItem = null;
  CloneItems.Clons = CloneItems.Clons.filter(function(value, index) {
    if (value != undefined && value != null) {
      if (value.index != cloneId) {
        return true;
      } else {
        _removeItem = value.element;
        return false;
      }
    }
  });
  return _removeItem;
};
export const SetFilterCloneWithItemKey = ItemKey => {
  let _removeItem = null;
  CloneItems.Clons = CloneItems.Clons.filter(function(value, index) {
    if (value != undefined && value != null) {
      if (value.value.ItemKey != ItemKey) {
        return true;
      } else {
        _removeItem = value.element;
        return false;
      }
    }
  });
  return _removeItem;
};
export const GetStItems = () => {
  return CloneItems.StItems;
};
export const SetItems = _items => {
  if (_items != undefined) {
    CloneItems.StItems = _items;
  }
};
