// import {
//     SetFilterCloneWithIndex,
//     SetFilterCloneWithItemKey,
//     pushCloneItem,
//     GetItem,
//     GetCloneItem,
//   } from './clone-module';
//   import {
//     CloneType,
//     CloneSelectElement,
//     CloneIndex
//   } from './index';
//   import {
//     UISELECT
//   } from './clone-drop';
// const { TEXT:CSTEXT, TABLE:CSTABLE } = CloneSelectElement;
// const { TEXT:CTTEXT, TABLE:CTTABLE } = CloneType;
// const { Table:CITABLE } = CloneIndex;
// const { RowGroup:CTRowGroup, $RowGroup:$CTRowGroup } = CITABLE;
// const UIInstance= (uitype, item)=> {
//   switch (uitype) {
//     case CTTEXT.FIELD:
//       let textfield = $(CSTEXT.ELEMENT).clone();
//       let removeid = $(textfield[0]).attr("id");
//       $(textfield[0])
//         .removeProp("id")
//         .removeAttr("id");
//       $(textfield[0])
//         .addClass(removeid)
//         .html(
//           `${item[CTTEXT.VALUE]}<i class="fa fa-times Remove"></i>`
//         );
//       return textfield[0];
//     case CTTABLE.FIELD:
//       let $table = CreateTable();
//       let $tr, item_sort;
//       let rindex = CTRowGroup[item[CTTABLE.ITEMCOLUM]];
//       if (rindex == undefined) {
//         rindex = -1;
//         $tr = document.createElement("tr");
//         $table.find("tbody").append($tr);
//         $CTRowGroup[item[CTTABLE.ITEMCOLUM]] = $tr;
//         $tr.dataset[CTTABLE.ITEMCOLUM] =
//           item[CTTABLE.ITEMCOLUM];
//       } else {
//         $tr = $CTRowGroup[item[CTTABLE.ITEMCOLUM]];
//       }
//       item_sort = $($tr).children("td").length;
//       rindex++;
//       CTRowGroup[item[CTTABLE.ITEMCOLUM]] = rindex;
//       let $td = document.createElement("td");
//       $td.classList.add(item[CTTABLE.ITEMKEY]);
//       $td.id = item[CTTABLE.ITEMKEY] + "_" + rindex;
//       $td.innerText = item[CTTABLE.VALUE];
//       $td.dataset.Sort = item_sort;
//       $tr.appendChild($td);
//       return $td;
//     case CTTABLE.DEFAULT:
//       let $TableDiv1 = $(CSTABLE.ELEMENT).clone();
//       return $($TableDiv1[0]);
//     default:
//       let $TableDiv = $(CSTABLE.ELEMENT).clone();
//       return $($TableDiv[0]);
//   }
// };

// const CreateTable= () =>{
//   let $UI = $(UISELECT.DROPID + " " + CSTABLE.ELEMENT);
//   let isDiv = $UI.is("div");
//   if (isDiv == false) {
//     let element = AddCloneItem(CTTABLE.DEFAULT);
//     $UI = element.element;
//     // $(TABLE.ELEMENT).clone();
//     $(UISELECT.DROPID).append($UI);
//     $($UI)
//       .offset({ top: 500, left: 0 })
//       .draggable({
//         containment: UISELECT.DROPID,
//         cursor: "move",
//         drag: function(el, ui) {
//           let _tableitem = GetCloneItem(CITABLE.CloneId);
//           _tableitem.value.Style = ui.helper[0].style.cssText;
//         }
//       })
//       .find(".close")
//       .click(function(e) {
//         let cloneId = $UI.dataset.cloneId;
//         RemoveCloneItem(cloneId);
//       });
//     if ($($UI).hasClass("ui-resizable")) {
//       $($UI)
//         .find(".ui-resizable-e")
//         .remove();
//       $($UI)
//         .find(".ui-resizable-e")
//         .remove();
//       $($UI)
//         .find(".ui-resizable-se")
//         .remove();
//     }
//     $($UI)
//       .resizable({
//         minHeight: 30,
//         minWidth: 75
//       })
//       .on("resize", function(e) {
//         let _tableitem = GetCloneItem(CITABLE.CloneId);
//         _tableitem.value.Style = _tableitem.element.style.cssText;
//       });
//   }
//   return $UI;
// };
// export const RemoveCloneItem=(cloneId)=> {
//     let removeItem = null;
//     removeItem=SetFilterCloneWithIndex(cloneId);
//     if (removeItem != null) {
//       let tablename = CSTABLE.ELEMENT.replace(
//         "#",
//         ""
//       );
//       if (removeItem.id == tablename) {
//         CloneIndex.Table.CloneId = -1;
//         let groupName = "#group-drop-text-" + tablename;
//         $(groupName)
//           .find(".active")
//           .each(function(ind, ele) {
//             if (ele != undefined) {
//               ele.classList.remove("active");
//               let ItemKey = ele.dataset.ItemKey;
//               let _removeItem = SetFilterCloneWithItemKey(ItemKey);
//               if (_removeItem != null) {
//                 $(_removeItem).fadeOut("slow", function() {
//                   $(this).remove();
//                 });
//               }
//             }
//           });
//       }
//       $(removeItem).fadeOut("slow", function() {
//         $(this).remove();
//       });
//     }
//   };
// export const  AddCloneItem= (ItemKey) =>{
//     const item = GetItem(ItemKey);
//     if (item != null && item != undefined) {
//       CloneIndex.Index++;
//       let _element = UIInstance(item.ItemType, item);
//       _element.dataset.cloneId = CloneIndex.Index;
//       let elements = {
//         index: CloneIndex.Index,
//         element: _element,
//         value: item
//       };
//       pushCloneItem(elements);
//       return elements;
//     } else {
//       CloneIndex.Index++;
//       let _element = UIInstance(CTTABLE.DEFAULT, null);
//       _element[0].dataset.cloneId = CloneIndex.Index;
//       CloneIndex.Table.CloneId = CloneIndex.Index;
//       let elements = {
//         index: CloneIndex.Index,
//         element: _element[0],
//         value: {
//           ItemType: ItemKey
//         }
//       };
//       pushCloneItem(elements);
//       return elements;
//     }
//   };


//   $.fn.extend({

//     TableItemClick:function(cb){
//       let $item = $(this);
//       let itemdata = $item.data("-item-key");
//       $item.toggleClass("active");
  
//       let $UIable = CreateTable();
//       let cloneitem ;
//       if ($item.hasClass("active")) {
//         cb(true);
//         cloneitem = AddCloneItem(itemdata);
//         $item.data("cloneId", cloneitem.index);
//       } else {
//         let cloneId = $item.data("cloneId");
//         RemoveCloneItem(cloneId);
//         cb(false);
//         $UIable.find("tbody" + " ." + itemdata).remove();
//       }
//       $($UIable[0])
//         .find("tbody>tr")
//         .sortable()
//         .on("sortstop", function(event, ui) {
//           $(ui.item[0]).parent("tr").find("td").each(function(iv,iy){
//             if(iy!=undefined){
//                 let newitem=GetCloneItem(iy.dataset.cloneId);
//                 newitem.element.dataset.Sort=JSON.stringify(iv);
//                 newitem.value.Sort=iv;
//             }
//           });
//         });
//     },
//     TableCreate: function() {
//       let $this = $(this);
//       for (let ii = 0; ii < $this.length; ii++) {
//         const $el = $($this[ii]);
//         if ($el != undefined && $el.length>0) {
//           let elinput = document.createElement("input");
//           $(elinput).attr("type", "checkbox");
//           let $elinput = $(elinput);
//           $el.prepend($elinput);
//           $el.click( function(e) {
//             $(e.currentTarget).TableItemClick(cb=>{
//               $elinput.prop("checked", cb);
//             });
//           });
//         }
//       }
//     }
// });