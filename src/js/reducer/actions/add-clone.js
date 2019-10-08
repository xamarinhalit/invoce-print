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
                subscribe(actionTypes.CLONE.ADD_CLONEITEM,(_state, cloneItem) => {
                    if (cloneItem != undefined) {
                        // var left = (ui.offset.left - $('.m-Template-Page-Area').offset().left);
                        // var top = (ui.offset.top - $('.m-Template-Page-Area').offset().top);
                        const { left: uleft, top: utop } = ui.offset
                        const { left: mleft, top: mtop } = _state.UI.$CONTENT.offset()
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
                        .disableSelection()
                        $(cloneItem.element)
                            .find('i')
                            .click(function (e) {
                                const { cloneId } = cloneItem.element.dataset
                                dispatch({
                                    type: actionTypes.CLONE.REMOVE_CLONEITEM,
                                    payload: cloneId
                                })
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

        if (table.hasClass('ui-resizable')) {
            table
                .find('.ui-resizable-s')
                .remove()
            table
                .find('.ui-resizable-e')
                .remove()
            table
                .find('.ui-resizable-se')
                .remove()
        }
        _table={
            Index:Index.Index,
            key:tablekey,
            element:table,
            children:[],
            childIndex:[],
            value:{},
            ColumIndex:-1,
            RowIndex:-1
        }
        table
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
         

        table[0].querySelector('button.close').onclick=_e=> {
            dispatch({type:actionTypes.CLONE.REMOVE_TABLE,payload:{table:_table}})
        }
     
        Items.Tables.push(_table)
    }
    return _table
}
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
        UICreateTable(state,menuitem.value.TableKey).then((_table)=>{
            const TYPE_TABLE = state.Clone.Type.TABLE
            const _Clone_Index = state.Clone.Index
            let _tr = null
            _table.ColumIndex++
            _Clone_Index.Index++
            if(_table.RowIndex==-1){
                _table.RowIndex++   
                _tr= document.createElement('tr')
                _tr.dataset.Sort=_table.RowIndex
                _table.element[0].querySelector('table>tbody').appendChild(_tr)
            }else{
                _tr= _table.element[0].querySelector('tr[data--sort=\''+_table.RowIndex+'\']')
            }
          
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
            _table.children.push(elements)
            _table.childIndex.push(elements.Index)
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
    let { Index} = e.currentTarget.dataset
    $item.toggleClass('active')
    const $input = $($item[0].querySelector('input'))
    if ($item.hasClass('active')) {
        // eslint-disable-next-line no-unused-vars
        addReducer.subscribe(actionTypes.CLONE.ADD_CLONEITEM,(__state,_cloneitem)=>{$input.prop('checked',true)})
        dispatch({type:actionTypes.CLONE.ADD_CLONEITEM,payload:{Index}})
    } else {
        // eslint-disable-next-line no-unused-vars
        addReducer.subscribe(actionTypes.CLONE.REMOVE_TABLEITEM,(_state,_xdata)=>{ $input.prop('checked',false)})
        dispatch({type:actionTypes.CLONE.REMOVE_TABLEITEM,payload:{table:{Index}}})
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