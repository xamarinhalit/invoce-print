/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */

import { dispatch, addReducer } from '..'
import { actionTypes } from '../const'
import { EmtoPixel } from './screen-tool'
export const SetConfig = (state, _data) => {
    const { subscribe } =addReducer
    state.UI.$CONTENT
        .droppable({
            accept: '.' + state.UI.DRAGCLASS + '>li',
            classes: {
                'ui-droppable-active': 'ui-state-active',
                'ui-droppable-hover': 'ui-state-hover'
            },
            drop: (event, ui) => {
                // var left = (ui.offset.left - $('.m-Template-Page-Area').offset().left);
                // var top = (ui.offset.top - $('.m-Template-Page-Area').offset().top);
                subscribe(actionTypes.CLONE.ADD_CLONEITEM,(_state, cloneItem) => {
                    if (cloneItem != undefined) {
                        //// MY UI DROP
                        const { left: uleft, top: utop } = ui.offset
                        const { left: mleft, top: mtop } = _state.UI.$CONTENT.offset()
                        //let { left: mleft, top: mtop } = _state.UI.$CONTENT.offset();
                        let left = uleft - mleft
                        let top = utop - mtop
                        if (top < 0) top = 0
                        if (left < 0) left = 0
                        _state.UI.$CONTENT.append($(cloneItem.element))
                        $(cloneItem.element).css({ position: 'absolute' })
                        const textlength = cloneItem.value.ItemValue
                            ? cloneItem.value.ItemValue.length
                            : 10
                        let width = EmtoPixel(10) + 'px',
                            height = ''
                        const tg = textlength / 30
                        if (tg <= 0) {
                            height = EmtoPixel(3) + 'px'
                        } else {
                            height = EmtoPixel((textlength / 30) * 3) + 'px'
                        }
                        $(cloneItem.element)
                            .width(width)
                            .height(height)
                            .offset({ left: left, top: top })
                            .draggable({
                                containment: _state.UI.DROPID,
                                cursorAt: {
                                    top: cloneItem.element.offsetY,
                                    left: cloneItem.element.offsetX
                                },
                                cursor: 'move',
                                drag: function (el, ui2) {
                                    cloneItem.value.Style = ui2.helper[0].style.cssText
                                }
                            })
                            .css({ border: 'none', left: left + 'px', top: top + 'px' })
                        // .disableSelection()
                        $(cloneItem.element)
                            .find('i')
                            .click(function (e) {
                                const { cloneId } = cloneItem.element.dataset
                                dispatch({
                                    type: actionTypes.CLONE.REMOVE_CLONEITEM,
                                    payload: cloneId
                                })
                                // RemoveCloneItem(cloneId);
                            })
                        if ($(cloneItem.element).hasClass('ui-resizable')) {
                            $(cloneItem.element)
                                .find('.ui-resizable-s')
                                .remove()
                            $(cloneItem.element)
                                .find('.ui-resizable-e')
                                .remove()
                            $(cloneItem.element)
                                .find('.ui-resizable-se')
                                .remove()
                        }
                        $(cloneItem.element)
                            .resizable({
                                minHeight: width,
                                minWidth: height
                            })
                            
                        cloneItem.value.Style = cloneItem.element.style.cssText
                    }
                }
                )
                dispatch({
                    type: actionTypes.CLONE.ADD_CLONEITEM,
                    payload:{
                        ItemKey:ui.helper[0].dataset.ItemKey,
                        TableKey:ui.helper[0].dataset.TableKey,
                        Index:ui.helper[0].dataset.Index,

                    }
                })
            }
        })
        .disableSelection()
        .css({ margin: '2px' })
}



const AddTables = (state,tablekey)=>{
    const Items = state.Clone.Items
    const { DROPID } = state.UI
    const { Index } = state.Clone
    const CSTABLE = state.Clone.SelectElement.TABLE
    let _table = null
    for (let i = 0; i < Items.Tables.length; i++) {
        const el = Items.Tables[i]
        if(el.key==tablekey){
            _table=el
        }
    }
    if(_table==null){
        Index.Index++
        const table=  $(CSTABLE).clone()
        table.prop('id','table-'+tablekey)
        table.data('cloneId',Index.Index)
        table.offset({ top: 500, left: 0 })
        // table[0].classList.remove('table-style')
        $(DROPID).append(table)
        _table={
            Index:Index.Index,
            key:tablekey,
            element:table,
            children:[],
            value:{},
            ColumIndex:-1,
            RowIndex:-1
        }
        if (_table.element.hasClass('ui-resizable')) {
            _table.element
                .find('.ui-resizable-s')
                .remove()
            _table.element
                .find('.ui-resizable-e')
                .remove()
            _table.element
                .find('.ui-resizable-se')
                .remove()
        }
        _table.element
            .resizable({
                minHeight: 30,
                minWidth: 75
            })
            .on('resize', function(_e) {
                _table.value.Style=_table.element[0].style.cssText
            })
            .draggable({
                containment: DROPID,
                cursor: 'move',
                drag: function(el, ui) {
                    _table.value.Style=_table.element[0].style.cssText
                }
            })
         

        $(_table.element,'.close')
            .click(function(_e) {
                dispatch({type:actionTypes.CLONE.REMOVE_TABLE,payload:{table:_table}})
            })
        Items.Tables.push(_table)
    }
    return _table
}


// const CreateTable=  (state,payload) =>{
//     return new Promise((resolve)=>{
//         const {TableKey} = payload
//         const { DROPID } = state.UI
     
//         ///  $UI = $(DROPID + ' ' + CSTABLE)
//         const $e = AddTables(state,TableKey)
//         resolve($e.element)
//     })
// }
// const UIInstance=async (uitype, item,state)=> {
//     return new Promise((resolve)=>{
//         const CTTABLE = state.Clone.Type.TABLE
//         const {ItemKey,TableKey}=item
//         const CTTEXT = state.Clone.Type.TEXT
//         const CSTEXT = state.Clone.SelectElement.TEXT
//         const CSTABLE = state.Clone.SelectElement.TABLE
//         const CITABLE = state.Clone.Index.Table
//         const { RowGroup:CTRowGroup, $RowGroup:$CTRowGroup } = CITABLE
//         switch (uitype) {
//         case CTTEXT.FIELD:
//             const text1= document.querySelector(CSTEXT)
//             const textclone= text1.cloneNode(false)
//             const textid=text1.getAttribute('id')
//             textclone.removeAttribute('id')
//             textclone.classList.add(textid)
//             textclone.innerHTML= `${item[CTTEXT.VALUE]}<i class="fa fa-times Remove"></i>`
//             resolve(textclone)
//             break
//         case CTTABLE.FIELD:
//             CreateTable(state,item).then( ($table)=>{
//                 var $tr, item_sort
//                 let rindex = CTRowGroup[item[CTTABLE.ITEMCOLUM]]
//                 if (rindex == undefined) {
//                     rindex = -1
//                     $tr = document.createElement('tr')
//                     $table.find('tbody').append($tr)
//                     $CTRowGroup[item[CTTABLE.ITEMCOLUM]] = $tr
//                     $tr.dataset[CTTABLE.ITEMCOLUM] =
//                     item[CTTABLE.ITEMCOLUM]
//                 } else {
//                     $tr = $CTRowGroup[item[CTTABLE.ITEMCOLUM]]
//                 }
//                 item_sort = $($tr).children('td').length
//                 rindex++
//                 CTRowGroup[item[CTTABLE.ITEMCOLUM]] = rindex
//                 const $td = document.createElement('td')
//                 $td.classList.add(item[CTTABLE.ITEMKEY])
//                 $td.id = item[CTTABLE.ITEMKEY] + '_' + rindex
//                 $td.innerText = item[CTTABLE.VALUE]
//                 $td.dataset.Sort = item_sort
//                 $tr.appendChild($td)
//                 resolve($td)
//             })
           
//             break
//         case CTTABLE.DEFAULT:
//             const $TableDiv1 = $(CSTABLE).clone()
//             $TableDiv1.prop('id','table-'+TableKey)
//             resolve($($TableDiv1[0]))
//             break
//         default:
//             const $TableDiv = $(CSTABLE).clone()
//             $TableDiv1.prop('id','table-'+TableKey)
//             resolve($($TableDiv[0]))
//             break
//         }
//     })
// }

const UICloneText = (state,menuitem)=>{
    return new Promise((resolve,reject)=>{
        const {value,element,ToolValue,Index,Sort } =menuitem
        const SELECT_TEXT = state.Clone.SelectElement.TEXT
        const TYPE_TEXT = state.Clone.Type.TEXT
        const _Clone_Index = state.Clone.Index
        _Clone_Index.Index++
        const text= document.querySelector(SELECT_TEXT)
        const textclone= text.cloneNode(false)
        const textid=text.getAttribute('id')
        textclone.removeAttribute('id')
        textclone.classList.add(textid)
        textclone.innerHTML= `${value[TYPE_TEXT.VALUE]}<i class="fa fa-times Remove"></i>`
        textclone.dataset.cloneId = _Clone_Index.Index
  
        const elements = {
            Index: _Clone_Index.Index,
            element: textclone,
            value,
            Sort,
            ToolValue,
            menuindex:Index,
            menuelement:element
        }
        state.Clone.Items.Clons.push(elements)
        resolve(elements)
    })
}

const UICreateTable= (state,tablekey)=>{
    return new Promise((resolve)=>{
        const $e = AddTables(state, tablekey)
        resolve($e)
    })
}


const UICloneTable = (state,menuitem)=>{
    return new Promise((resolve,_reject)=>{
        const {value,element,ToolValue,Index,Sort } =menuitem
        UICreateTable(state,value.TableKey).then((_table)=>{
            const TYPE_TABLE = state.Clone.Type.TABLE
            const _Clone_Index = state.Clone.Index
            let _tr = null
            if(_table.RowIndex==-1){
                _table.RowIndex++   
                _tr= document.createElement('tr')
                _tr.dataset.Sort=_table.RowIndex
                _table.element[0].querySelector('table>tbody').appendChild(_tr)
            }else{
                _tr= _table.element[0].querySelector('tr[data--sort=\''+_table.RowIndex+'\']')
            }
            _table.ColumIndex++
            _Clone_Index.Index++
            const _column = _table.ColumIndex
            const _td = document.createElement('td')
            _td.classList.add(value[TYPE_TABLE.ITEMKEY])
            _td.dataset.Sort = _column
            _td.dataset.cloneId=_Clone_Index.Index
            _td.innerHTML=value[TYPE_TABLE.VALUE]
            _tr.appendChild(_td)
            const elements = {
                Index: _Clone_Index.Index,
                element: _td,
                value,
                Sort,
                ToolValue,
                menuindex:Index,
                menuelement:element
            }
            state.Clone.Items.Clons.push(elements)
            resolve(elements)
        })
    })
}

const AddCloneItem= (payload,state,success) =>{
    const _xitem = {}
    for (let ii = 0; ii < state.UI.PANEL.Menu.length; ii++) {
        const element = state.UI.PANEL.Menu[ii]
        if(element.Index==parseInt(payload.Index)){
            _xitem.item = element
            break
        }
    }
    const { item } = _xitem
    if (item && payload.Index) {
        switch (item.value.ItemType) {
        case state.Clone.Type.TEXT.FIELD:
            UICloneText(state,item).then((_data)=>{
                success(_data)
            })
            break
        case state.Clone.Type.TABLE.FIELD:
            UICloneTable(state,item).then((_data)=>{
                success(_data)
            })
            break
        default:
            break
        }
       
    }
}
const TableItemClick=(e)=>{
    const $item = $(e.currentTarget)
    let { ItemKey,TableKey, Index} = e.currentTarget.dataset
    $item.toggleClass('active')
    if ($item.hasClass('active')) {
        $($item[0].querySelector('input')).prop('checked',true)
        // eslint-disable-next-line no-unused-vars
        addReducer.subscribe(actionTypes.CLONE.ADD_CLONEITEM,(__state,_cloneitem)=>{
        })
        dispatch({type:actionTypes.CLONE.ADD_CLONEITEM,payload:{ItemKey,TableKey,Index}})
    } else {
        let cloneId = $item.data('cloneId')
        // eslint-disable-next-line no-unused-vars
        addReducer.subscribe(actionTypes.CLONE.REMOVE_TABLEITEM,(_state,_xdata)=>{
            $($item[0].querySelector('input')).prop('checked',false)
        })
        dispatch({type:actionTypes.CLONE.REMOVE_TABLEITEM,payload:cloneId})
    }
}
$.fn.extend({
    TableCreate: function() {
        let $el =$(this)
        if ($el != undefined && $el.length>0) {
            let elinput = document.createElement('input')
            elinput.setAttribute('type','checkbox')
            $el[0].prepend(elinput)
            $el.click(TableItemClick)
        }
    }
})
export default AddCloneItem