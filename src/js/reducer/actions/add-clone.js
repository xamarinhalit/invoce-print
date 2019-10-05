/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
import { dispatch, addReducer } from '..'
import { actionTypes } from '../const'

export const CreateTable= (state) =>{
    return new Promise((resolve)=>{
        const CTTABLE = state.Clone.Type.TABLE
        const CITABLE = state.Clone.Index.Table
        const CSTABLE = state.Clone.SelectElement.TABLE
        const { DROPID } = state.UI
///  $UI = $(DROPID + ' ' + CSTABLE)
        let ui2=document.querySelector(DROPID + ' ' + CSTABLE)
        if (ui2 == null) {
            AddCloneItem(CTTABLE.DEFAULT,state,(element)=>{
                let $UI = element.element
                // $(TABLE.ELEMENT).clone();
                $(DROPID).append($UI)
                $($UI)
                    .offset({ top: 500, left: 0 })
                    .draggable({
                        containment: DROPID,
                        cursor: 'move',
                        drag: function(el, ui) {
                            let item = null
                            if (CITABLE.CloneId) {
                                state.Clone.Items.Clons.forEach(function(element) {
                                    if (element != undefined) {
                                        if (element.index == CITABLE.CloneId) {
                                            item = element
                                        }
                                    }
                                })
                                if (item != undefined && item != null) {
                                    return item
                                }
                            }
                            item.value.Style = ui.helper[0].style.cssText
                        }
                    })
                    .find('.close')
                    // eslint-disable-next-line no-unused-vars
                    .click(function(_e) {
                        let cloneId = $UI.dataset.cloneId
                        dispatch({type:actionTypes.CLONE.REMOVE_CLONEITEM,payload:cloneId})
                    })
                if ($($UI).hasClass('ui-resizable')) {
                    $($UI)
                        .find('.ui-resizable-e')
                        .remove()
                    $($UI)
                        .find('.ui-resizable-e')
                        .remove()
                    $($UI)
                        .find('.ui-resizable-se')
                        .remove()
                }
                $($UI)
                    .resizable({
                        minHeight: 30,
                        minWidth: 75
                    })
                    // eslint-disable-next-line no-unused-vars
                    .on('resize', function(_e) {
                        let item = null
                        if (CITABLE.CloneId) {
                            state.Clone.Items.Clons.forEach(function(element) {
                                if (element != undefined) {
                                    if (element.index == CITABLE.CloneId) {
                                        item = element
                                    }
                                }
                            })
                            if (item != undefined && item != null) {
                                return item
                            }
                        }
                        item.value.Style = item.element.style.cssText
                    })
                resolve($UI)
            })
        }else{
            resolve($(DROPID + ' ' + CSTABLE))
        }
    })
}
const UIInstance=async (uitype, item,state)=> {
    const CTTABLE = state.Clone.Type.TABLE
    const CTTEXT = state.Clone.Type.TEXT
    const CSTEXT = state.Clone.SelectElement.TEXT
    const CSTABLE = state.Clone.SelectElement.TABLE
    const CITABLE = state.Clone.Index.Table
    const { RowGroup:CTRowGroup, $RowGroup:$CTRowGroup } = CITABLE
    switch (uitype) {
    case CTTEXT.FIELD:
        const text1= document.querySelector(CSTEXT)
        const textclone= text1.cloneNode(false)
        const textid=text1.getAttribute("id")
        textclone.removeAttribute("id")
        textclone.classList.add(textid)
        textclone.innerHTML= `${item[CTTEXT.VALUE]}<i class="fa fa-times Remove"></i>`;
        return textclone
    case CTTABLE.FIELD:
        const $table = await CreateTable(state)
        var $tr, item_sort
        let rindex = CTRowGroup[item[CTTABLE.ITEMCOLUM]]
        if (rindex == undefined) {
            rindex = -1
            $tr = document.createElement('tr')
            $table.find('tbody').append($tr)
            $CTRowGroup[item[CTTABLE.ITEMCOLUM]] = $tr
            $tr.dataset[CTTABLE.ITEMCOLUM] =
            item[CTTABLE.ITEMCOLUM]
        } else {
            $tr = $CTRowGroup[item[CTTABLE.ITEMCOLUM]]
        }
        item_sort = $($tr).children('td').length
        rindex++
        CTRowGroup[item[CTTABLE.ITEMCOLUM]] = rindex
        const $td = document.createElement('td')
        $td.classList.add(item[CTTABLE.ITEMKEY])
        $td.id = item[CTTABLE.ITEMKEY] + '_' + rindex
        $td.innerText = item[CTTABLE.VALUE]
        $td.dataset.Sort = item_sort
        $tr.appendChild($td)
        return $td
    case CTTABLE.DEFAULT:
        const $TableDiv1 = $(CSTABLE).clone()
        return $($TableDiv1[0])
    default:
        const $TableDiv = $(CSTABLE).clone()
        return $($TableDiv[0])
    }
}


const AddCloneItem= (ItemKey,state,success) =>{
    const _Items = state.Clone.Items.StaticItems
    const _Index = state.Clone.Index
    const CTTABLE = state.Clone.Type.TABLE
    const _xitem = {}
    for (var ii = 0; ii < _Items.length; ii++) {
        const value = _Items[ii]
        if (value != undefined) {
            const { Items: ItemList } = value
            for (var i = 0; i < ItemList.length; i++) {
                const element = ItemList[i]
                if (element.ItemKey == ItemKey) {
                    _xitem.item = element
                    break
                }
            }
        }
        if (_xitem.item != null && _xitem.item!=undefined) break
    }
    const { item } = _xitem
    if (item != null && item != undefined) { // İTEMTYPE = TABLEFIELD,FIELD
        _Index.Index++
        UIInstance(item.ItemType, item,state).then(
            _element=>{
                _element.dataset.cloneId = _Index.Index
                const elements = {
                    index: _Index.Index,
                    element: _element,
                    value: item
                }
                state.Clone.Items.Clons.push(elements)
                success(elements)
            })
      
    } else {// ITEMTYPE = "TABLE"
        _Index.Index++
        UIInstance(CTTABLE.DEFAULT, null,state).then(
            _element=>{
                _element[0].dataset.cloneId = _Index.Index
                _Index.Table.CloneId = _Index.Index
                const elements = {
                    index: _Index.Index,
                    element: _element[0],
                    value: {
                        ItemType: ItemKey
                    }
                }
                state.Clone.Items.Clons.push(elements)
                success(elements)
            }  
        )
     
    }

}
$.fn.extend({

    TableItemClick:function(cb){
        let $item = $(this)
        let itemdata = $item.data('-item-key')
        $item.toggleClass('active')
        addReducer.subscribe(actionTypes.CLONE.CREATE_TABLE,(state,$UIable)=>{
            if ($item.hasClass('active')) {
                cb(true)
                addReducer.subscribe(actionTypes.CLONE.ADD_CLONEITEM,(_state,cloneitem)=>{
                    $item.data('cloneId', cloneitem.index)
                })
                dispatch({type:actionTypes.CLONE.ADD_CLONEITEM,payload:itemdata})

            } else {
                let cloneId = $item.data('cloneId')
                cb(false)
                // eslint-disable-next-line no-unused-vars
                addReducer.subscribe(actionTypes.CLONE.REMOVE_CLONEITEM,(_state,_xdata)=>{
                    $UIable.find('tbody' + ' .' + itemdata).remove()
                })
                dispatch({type:actionTypes.CLONE.REMOVE_CLONEITEM,payload:cloneId})
            }
            /// SORTABLE TABLE
            /// SİLİNECEN
            // $($UIable[0])
            //     .find('tbody>tr')
            //     .sortable()
            //     .on('sortstop', function(event, ui) {
            //         const _items= state.Clone.Items.Clons
            //         $(ui.item[0]).parent('tr').find('td').each(function(iv,iy){
            //             if(iy!=undefined){
            //                 _items.forEach((newitem)=>{
            //                     if(newitem!=undefined && newitem !=null && newitem.value.Index==iy.dataset.cloneId) {
            //                         newitem.element.dataset.Sort=JSON.stringify(iv)
            //                         newitem.value.Sort=iv
            //                     }
            //                 })
                  
            //             }
            //         })
            //     })
        })
        dispatch({type:actionTypes.CLONE.CREATE_TABLE})
      
    },
    TableCreate: function() {
        let $this = $(this)
        for (let ii = 0; ii < $this.length; ii++) {
            const $el = $($this[ii])
            if ($el != undefined && $el.length>0) {
                let elinput = document.createElement('input')
                $(elinput).attr('type', 'checkbox')
                let $elinput = $(elinput)
                $el.prepend($elinput)
                $el.click( function(e) {
                    $(e.currentTarget).TableItemClick(cb=>{
                        $elinput.prop('checked', cb)
                    })
                })
            }
        }
    }
})
export default AddCloneItem


  
  