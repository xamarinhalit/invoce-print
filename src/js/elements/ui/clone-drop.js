import {
    fn
  } from "./../tool/screen.js";
  import {
    GetStItems,
  } from './clone-module';
  import {
    RemoveCloneItem,AddCloneItem,
  } from './clone-crud';
  import {
    CloneType,
    CloneSelectElement,
    GroupItems
  } from './index';

  import { fetched } from "./../fetch";
  import {
    SetItems
  } from './clone-module';
  import {
    dispatch,addReducer
  } from '../../../reducer';
import { actionTypes } from "../../../reducer/const.js";
  const { DragSelect } = CloneSelectElement;
  const ORNEKJSON = {
      data: null
    };

    const INIT= function(_items, options) {
      //  require("./../tool/index");
      DragSelect.ELEMENT = options.dragclass ? options.dragclass: DragSelect.ELEMENT;
      UISELECT.ACCORDIONID = options.accordionid? options.accordionid: UISELECT.ACCORDIONID;
        SetItems(_items[0].Tools);
        addReducer.subscribe(actionTypes.INIT.FETCHED,(state,data)=>{
          console.log(actionTypes.INIT.FETCHED,state,"DATA",data);
        })
        addReducer.subscribe(actionTypes.CLONE.SETGROUPITEM,(state,data)=>{
          console.log(actionTypes.CLONE.SETGROUPITEM,state,"DATA",data);
        })
        dispatch({type:actionTypes.INIT.FETCHED});
        
        
     
     // SetGroupItem();
      // $(".m-Tool").PanelGroup({
      //   up: "fa-chevron-up",
      //   down: "fa-chevron-down",
      //   extclass: "h2",
      //   activeClass: "active"
      // });
    };
 //const UIDrop = {
  export const  UISELECT= {
      DRAGCLASS: "m-drag-ul",
      ACCORDIONID: "#accordion",
      DROPID: "",
      $CONTENT: null
    };
    export const    makeDraggable=function() {
      if (ORNEKJSON.data == null) {
        fetched(data => {
          ORNEKJSON.data = data;
          INIT(ORNEKJSON.data, {
            dragclass: UISELECT.DRAGCLASS
          });
        });
      } else {
        INIT(ORNEKJSON.data, {
          dragclass: UISELECT.DRAGCLASS
        });
      }
    };
    export const OnDropDraggable= function(event, ui) {
      const {EmtoPixel } = fn;
      let data = $(ui.helper).clone();
      const $this = $(this);
      //// MY UI DROP
      const { left: uleft, top: utop } = ui.offset;
      const { left: mleft, top: mtop } = $(".m-Template-Page-Area").offset();
      let left = uleft - mleft;
      let top = utop - mtop;
      if (top < 0) top = 0;
      if (left < 0) left = 0;
  
      // var left = (ui.offset.left - $('.m-Template-Page-Area').offset().left);
      // var top = (ui.offset.top - $('.m-Template-Page-Area').offset().top);
      let cloneitem = AddCloneItem(data[0].dataset.ItemKey);
      if (cloneitem != undefined) {
        let clel = cloneitem.element;
        let $clel = $(clel);
        $clel.css({ position: "absolute" });
        $this.append(clel);
        let text = cloneitem.value.ItemValue;
        let textlength = text ? text.length : 10;
        let width = EmtoPixel(10) + "px",
          height = "";
        let tg = textlength / 30;
        if (tg < 1) {
          height = EmtoPixel(3) + "px";
        } else {
          height = EmtoPixel((textlength / 30) * 3) + "px";
        }
  
        $clel
          .width(width)
          .height(height)
          .offset({ left: left, top: top })
          .draggable({
            containment: "parent",
            cursorAt: { top: clel.offsetY, left: clel.offsetX },
            cursor: "move",
            drag: function(el, ui) {
              cloneitem.value.Style = ui.helper[0].style.cssText;
            }
          })
          .css({ border: "none", left: left + "px", top: top + "px" })
          .find("i")
          .click(function(e) {
            const { cloneId } = clel.dataset;
            RemoveCloneItem(cloneId);
          })
          .disableSelection();
        if ($clel.hasClass("ui-resizable")) {
          $clel.find(".ui-resizable-e").remove();
          $clel.find(".ui-resizable-e").remove();
          $clel.find(".ui-resizable-se").remove();
        }
        $clel.resizable({
          minHeight: width,
          minWidth: height
        });
        cloneitem.value.Style = clel.style.cssText;
      }
      //// MY UI DROP
    };
    export const  Tools= {
      screen: {
        width: {
          big: 0,
          medium: 0.0,
          smal: 0,
          bigpercent: 0,
          smallpercent: 0
        },
        height: {
          big: 0,
          medium: 0.0,
          smal: 0,
          bigpercent: 0,
          smallpercent: 0
        }
      },
       GetInitCalc: function() {
        const { screen } = Tools;
        const { vwTOpx,vhTOpx}= fn;
        const { height, width } = screen;
        let {
          width: medwidth,
          height: medheight
        } = UISELECT.$CONTENT[0].getClientRects()[0];
        width.big = vwTOpx("98");
        width.medium = medwidth / 100;
        width.smal = vwTOpx("80");
        width.smallpercent = width.smal / 100;
        width.bigpercent = width.big / 100;
        height.big = vhTOpx("98");
        height.medium = medheight / 100;
        height.smal = vhTOpx("70");
        height.smallpercent = height.smal / 100;
        height.bigpercent = height.big / 100;
      }, CalcW80To100:function(left, width) {
        //   if(width=="")
        //     width="1";
        const { smallpercent, bigpercent, big } = Tools.screen.width;
        let value = parseInt(left.replace("px", ""));
        let _width = parseInt(width.replace("px", ""));
        if (value < 0) value = 0;
        let smalbody = value / smallpercent;
        let largprint = bigpercent * smalbody;
        let smalwidth = _width / smallpercent;
        let largwidth = smalwidth * bigpercent;
        if (smalwidth + smalbody >= 100) {
          return {
            left: 99 - smalwidth,
            width: smalwidth
          };
        }
        return {
          left: smalbody,
          width: smalwidth
        };
      },CalcH70To100:function(top, height) {
        // if(height=="")
        //     height="1";
        const { smallpercent, bigpercent, big } = Tools.screen.height;
        let value = parseInt(top.replace("px", ""));
        let _height = parseInt(height.replace("px", ""));
        let smalbody = value / smallpercent;
        let largprint = bigpercent * smalbody;
        let smalheight = _height / smallpercent;
        let largheight = smalheight * bigpercent;
        if (smalheight + smalbody >= 99) {
          return {
            top: 99 - smalheight,
            height: smalheight
          };
        }
        return {
          top: smalbody,
          height: smalheight
        };
      }
    };
    export const makeDraggables= function(target) {
      UISELECT.DROPID = target;
      UISELECT.$CONTENT = $(target);
      $(target)
        .droppable({
          accept: "." + UISELECT.DRAGCLASS + ">li",
          classes: {
            "ui-droppable-active": "ui-state-active",
            "ui-droppable-hover": "ui-state-hover"
          },
          drop: OnDropDraggable
        })
        .disableSelection()
        .css({ margin: "2px" });
    };
    const SetGroupItem=()=> {
        const { TEXT, TABLE } = CloneType;
        let AddedGroup = {};
    
        GetStItems().forEach(function(item, index) {
          if (item != undefined) {
            const { Sort, ToolValue, Items: ItemList } = item;
            if (ItemList != undefined) {
              for (let iindex = 0; iindex < ItemList.length; iindex++) {
                const element = ItemList[iindex];
                if (element != undefined) {
                  switch (element.ItemType) {
                    case TEXT.FIELD:
                      AddGroupTextFieldItem({
                        name: element[TEXT.ITEMKEY],
                        value: element[TEXT.ITEMTITLE],
                        item_sort: Sort,
                        ItemType: element.ItemType,
                        groupName: ToolValue,
                        icon: element.Icon
                      });
                      break;
                    case TABLE.FIELD:
                      AddedGroup[item.ItemType] = {
                        group: AddGroupTextFieldItem({
                          name: element[TEXT.ITEMKEY],
                          value: element[TEXT.ITEMTITLE],
                          item_sort: Sort,
                          ItemType: element.ItemType,
                          groupName: ToolValue,
                          icon: element.Icon
                        })
                      };
    
                      break;
                    default:
                      break;
                  }
                }
              }
            }
          }
        });
    
        $("ul.m-drag-ul").disableSelection();
        $("ul.m-drag-ul>li")
          .draggable({
            helper: "clone",
            revert: "invalid",
            cursor: "move",
            cancel: null,
            cursorAt: { top: 50, left: 50 }
          })
          .disableSelection();
        let keys = Object.keys(AddedGroup);
        for (let i = 0; i < keys.length; i++) {
          const element = AddedGroup[keys[i]];
          let $element = $("ul.m-drag-ul." + element.group + ">li");
          $element.draggable("option", "disabled", true);
          $element.TableCreate();
        }
      };
      const AddGroupTextFieldItem= function(options) {
        const { name, value, item_sort, ItemType, groupName, icon } = options;
        let groupNameId = "group-drop-text-" + item_sort;
        if (GroupItems[groupNameId] == undefined) {
          GroupItems[groupNameId] = item_sort;
          $(".m-Template-Tools").append(`
                    <div class="m-Tool">
                        <h2> ${groupName} <i class="fa fa-chevron-up"></i> </h2>
                        <ul class="m-drag-ul ${groupNameId}" style='display:block'>
                        </ul>
                    </div>`);
        }
        $("ul.m-drag-ul." + groupNameId)
          .append(`<li class="" data--item-key="${name}" >
                                <i class="${icon}"></i>${value}</li>`);
        return groupNameId;
      };