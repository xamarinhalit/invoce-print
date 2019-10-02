const CreateTable= (state) =>{
    const CTTABLE = state.Clone.Type.TABLE;
    const CITABLE = state.Clone.Index.Table;
    const CSTABLE = state.Clone.SelectElement.TABLE;
    const { DROPID } = state.UI;
    let $UI = $(DROPID + " " + CSTABLE);
    let isDiv = $UI.is("div");
    if (isDiv == false) {
      let element = AddCloneItem(CTTABLE.DEFAULT);
      $UI = element.element;
      // $(TABLE.ELEMENT).clone();
      $(DROPID).append($UI);
      $($UI)
        .offset({ top: 500, left: 0 })
        .draggable({
          containment: DROPID,
          cursor: "move",
          drag: function(el, ui) {
              let item = null;
            if (CITABLE.CloneId) {
                state.Clone.Items.Clons.forEach(function(element, i) {
                  if (element != undefined) {
                    if (element.index == CITABLE.CloneId) {
                      item = element;
                    }
                  }
                });
                if (item != undefined && item != null) {
                  return item;
                }
              }
            item.value.Style = ui.helper[0].style.cssText;
          }
        })
        .find(".close")
        .click(function(e) {
          let cloneId = $UI.dataset.cloneId;
          RemoveCloneItem(cloneId);
        });
      if ($($UI).hasClass("ui-resizable")) {
        $($UI)
          .find(".ui-resizable-e")
          .remove();
        $($UI)
          .find(".ui-resizable-e")
          .remove();
        $($UI)
          .find(".ui-resizable-se")
          .remove();
      }
      $($UI)
        .resizable({
          minHeight: 30,
          minWidth: 75
        })
        .on("resize", function(e) {
            let item = null;
            if (CITABLE.CloneId) {
                state.Clone.Items.Clons.forEach(function(element, i) {
                  if (element != undefined) {
                    if (element.index == CITABLE.CloneId) {
                      item = element;
                    }
                  }
                });
                if (item != undefined && item != null) {
                  return item;
                }
              }
              item.value.Style = item.element.style.cssText;
        });
    }
    return $UI;
};
const UIInstance= (uitype, item,state)=> {
    const CTTABLE = state.Clone.Type.TABLE;
    const CTTEXT = state.Clone.Type.TEXT;
    const CSTEXT = state.Clone.SelectElement.TEXT;
    const CSTABLE = state.Clone.SelectElement.TABLE;
    const CITABLE = state.Clone.Index.Table;
    const { RowGroup:CTRowGroup, $RowGroup:$CTRowGroup } = CITABLE;
    switch (uitype) {
      case CTTEXT.FIELD:
        const textfield = $(CSTEXT).clone();
        const removeid = $(textfield[0]).attr("id");
        $(textfield[0])
          .removeProp("id")
          .removeAttr("id");
        $(textfield[0])
          .addClass(removeid)
          .html(
            `${item[CTTEXT.VALUE]}<i class="fa fa-times Remove"></i>`
          );
        return textfield[0];
      case CTTABLE.FIELD:
        const $table = CreateTable(state);
        var $tr, item_sort;
        const rindex = CTRowGroup[item[CTTABLE.ITEMCOLUM]];
        if (rindex == undefined) {
          rindex = -1;
          $tr = document.createElement("tr");
          $table.find("tbody").append($tr);
          $CTRowGroup[item[CTTABLE.ITEMCOLUM]] = $tr;
          $tr.dataset[CTTABLE.ITEMCOLUM] =
            item[CTTABLE.ITEMCOLUM];
        } else {
          $tr = $CTRowGroup[item[CTTABLE.ITEMCOLUM]];
        }
        item_sort = $($tr).children("td").length;
        rindex++;
        CTRowGroup[item[CTTABLE.ITEMCOLUM]] = rindex;
        const $td = document.createElement("td");
        $td.classList.add(item[CTTABLE.ITEMKEY]);
        $td.id = item[CTTABLE.ITEMKEY] + "_" + rindex;
        $td.innerText = item[CTTABLE.VALUE];
        $td.dataset.Sort = item_sort;
        $tr.appendChild($td);
        return $td;
      case CTTABLE.DEFAULT:
        const $TableDiv1 = $(CSTABLE).clone();
        return $($TableDiv1[0]);
      default:
        const $TableDiv = $(CSTABLE).clone();
        return $($TableDiv[0]);
    }
  };


const AddCloneItem= (ItemKey,state,success) =>{
    const _Items = state.Clone.Items.StaticItems;
    const _Index = state.Clone.Index;
    const CTTABLE = state.Clone.Type.TABLE;
    const _xitem = {
    };
    for (var ii = 0; ii < _Items.length; ii++) {
      const value = _Items[ii];
      if (value != undefined) {
        const { Items: ItemList } = value;
        for (var i = 0; i < ItemList.length; i++) {
          const element = ItemList[i];
          if (element.ItemKey == ItemKey) {
            _xitem.item = element;
            break;
          }
        }
      }
      if (_xitem.item != null && _xitem.item!=undefined) break;
    }
    const { item } = _xitem;
    if (item != null && item != undefined) {
      _Index.Index++;
      const _element = UIInstance(item.ItemType, item,state);
      _element.dataset.cloneId = _Index.Index;
      const elements = {
        index: _Index.Index,
        element: _element,
        value: item
      };
      state.Clone.Items.Clons.push(elements);
      success(elements);
    } else {
      _Index.Index++;
      const _element = UIInstance(CTTABLE.DEFAULT, null,state);
      _element[0].dataset.cloneId = _Index.Index;
      _Index.Table.CloneId = _Index.Index;
       const elements = {
        index: _Index.Index,
        element: _element[0],
        value: {
          ItemType: ItemKey
        }
      };
      state.Clone.Items.Clons.push(elements);
      success(elements);
    }

  };
  export default AddCloneItem;