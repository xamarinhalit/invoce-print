const RemoveCloneItem=(cloneId,state,success) =>{
    const { Clone:_Clons }=state;
    const CSTABLE = _Clons.SelectElement.TABLE;
    const CITABLE = _Clons.Index.Table;
    let removeItem = null;
    _Clons.Items.Clons = _Clons.Items.Clons.filter(function(value, index) {
        if (value != undefined && value != null) {
          if (value.index != cloneId) {
            return true;
          } else {
            removeItem = value.element;
            return false;
          }
        }
      });
   
    if (removeItem != null) {
      let tablename = CSTABLE.replace(
        "#",
        ""
      );
      if (removeItem.id == tablename) {
        CITABLE.CloneId = -1;
        let groupName = "#group-drop-text-" + tablename;
        $(groupName)
          .find(".active")
          .each(function(ind, ele) {
            if (ele != undefined) {
              ele.classList.remove("active");
              let ItemKey = ele.dataset.ItemKey;
              let _removeItem = null;
              _Clons.Items.Clons = _Clons.Items.Clons.filter(function(value, index) {
                if (value != undefined && value != null) {
                  if (value.value.ItemKey != ItemKey) {
                    return true;
                  } else {
                    _removeItem = value.element;
                    return false;
                  }
                }
              });
              if (_removeItem != null) {
                $(_removeItem).fadeOut("slow", function() {
                  $(this).remove();
                });
              }
            }
          });
      }
      $(removeItem).fadeOut("slow", function() {
        $(this).remove();
      });
    }
    success(null,state);
  };
  export default RemoveCloneItem;