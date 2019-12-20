import { styleToObject, NullCheck, CalC_Table } from './convert'
/* eslint-disable no-undef */
const RemoveReset = (state)=>{
    state.UI.SELECT.$font =null
    setTimeout(()=>{
        $('.p-font-block').removeClass('p-active')
    },300)
}
const RemoveInputChecked = ({rowIndex,columnIndex},state)=>{
    for (let i = 0; i < state.UI.PANEL.Menu.length; i++) {
        const item = state.UI.PANEL.Menu[i]
        if(item!=undefined && item.value.ColumnIndex==columnIndex && item.value.RowIndex==rowIndex){
            if(item.element.classList.contains('active'))
                item.element.classList.remove('active')
            item.element.querySelector('input').checked=false
        }
        
    }

}
const RemoveTableTo = ($child,i,state,success)=>{
    if($child.length>i){
        const $el = $child[i]
        let { cloneId,rowIndex,columnIndex} = $el.dataset
        RemoveTableItem({table:{cloneId:cloneId}},state,()=>{
            i++
            RemoveInputChecked({rowIndex,columnIndex},state)
            RemoveTableTo($child,i,state,success)
        })
    }else{
        success()
    }
}
export const RemoveTable = (table,state,success)=>{
    const { Clone:_Clons }=state
    let removedTable=null
    const _Remove = (item)=>{
        if (NullCheck(item)) {
            const tableitem=item.item
            const $trow= $(tableitem.element).find('.'+state.UI.TABLEROWCLASS).first().find('.'+state.UI.TABLECOLUMNCLASS)
            if($trow.length>0){
                RemoveTableTo($trow,0,state,()=>{
                    const removeindex=state.Clone.Items.Clons.indexOf(tableitem)
                    state.Clone.Items.Clons.splice(removeindex,1)
                    const reelement =tableitem.element.cloneNode(true)
                    const style = styleToObject(tableitem.element)
                    removedTable={element:reelement,style}
                    RemoveReset(state)
                    success(removedTable,state)
                })
            }else{
                const removeindex=state.Clone.Items.Clons.indexOf(tableitem)
                state.Clone.Items.Clons.splice(removeindex,1)
                const reelement =tableitem.element.cloneNode(true)
                const style = styleToObject(tableitem.element)
                removedTable={element:reelement,style}
                tableitem.element.parentNode.removeChild(tableitem.element)
                RemoveReset(state)
                success(removedTable,state)
            }
           
        }   
    }
    // eslint-disable-next-line no-unused-vars
    const _removedTable = {

    }
    for (let i = 0; i < _Clons.Items.Clons.length; i++) {
        const value = _Clons.Items.Clons[i];
        if (value != undefined && value != null) {
            if (value.Index ==table.table.Index) {
                _removedTable.item=value
                _removedTable.index=i
                break
            }
        }
    }
    _Remove(_removedTable)
   
}
const GetTable = (state,tableKey,succes)=>{
    for (let i = 0; i < state.Clone.Items.Clons.length; i++) {
        const item = state.Clone.Items.Clons[i]
        if(item.value.ItemType==state.Clone.Type.TABLE.DEFAULT && item.value.TableKey==tableKey){
            succes(item)
            break
        }
    }
}

export const RemoveTableItem = (table,state,success)=>{
    const { Clone:_Clons }=state
    const _Remove = (item)=>{
        return new Promise((resolve)=>{
            const element = item.item
            if(NullCheck(element)){
                const reelement =element.element.cloneNode(true)
                const restyle = styleToObject(element.element)
                GetTable(state,element.value.TableKey,(_table)=>{
                    
                    $(element.element).remove()
                    state.Clone.Items.Clons.splice(item.index,1)
                    const tStyle = styleToObject(_table.element)
                    const $trow= $(_table.element).find('.'+state.UI.TABLEROWCLASS).first()
                    if($trow.length>0 && $trow[0].children.length==0){
                        const removeindex=state.Clone.Items.Clons.indexOf(_table)
                        $(_table.element).remove()
                        state.Clone.Items.Clons.splice(removeindex,1)
                    }else{
                        CalC_Table($(_table.element),state)
                    }
                    resolve({element:reelement,style:restyle,Table:{Style:tStyle}})
                })
            }else{
                resolve()
            }
        })
    }
    // eslint-disable-next-line no-unused-vars
    const _removeitem= {}
    for (let i = 0; i <  _Clons.Items.Clons.length; i++) {
        const item =  _Clons.Items.Clons[i]
        if(NullCheck(item) && item.value.ItemType==state.Clone.Type.TABLE.FIELD){
            if(parseInt(table.table.Index)==parseInt(item.id) || parseInt(table.table.cloneId) == item.Index ){
                _removeitem.item=item
                _removeitem.index=i
                break
            }
        }
    }
    if(NullCheck(_removeitem.item)){
        _Remove(_removeitem).then((reitem)=>{
            RemoveReset(state)
            success(reitem,state)
        })
    }else{
        RemoveReset(state)
        success(null,state)
    }
}
export const RemoveCloneItem=(cloneId,state,success) =>{
    const { Clone:_Clons }=state
    const TEXT  =state.Clone.Type.TEXT
    let removeItem = null
    let removedItem=null
    // eslint-disable-next-line no-unused-vars
    _Clons.Items.Clons = _Clons.Items.Clons.filter(function(value) {
        if (value != undefined && value != null) {
            if (value.Index != cloneId) {
                return true
            } else {
                if(value.value[TEXT.ITEMTYPE]==TEXT.CUSTOMTEXT){
                    value.element.removeEventListener('input',null)
                }
                const reelement=value.element.cloneNode(true)
                const style = styleToObject(value.element)
                removeItem = value.element
                removedItem={
                    element:reelement,
                    style
                }
                return false
            }
        }
    })
   
    if (removeItem != null) {
        removeItem.parentNode.removeChild(removeItem)
    }
    RemoveReset(state)
    success(removedItem,state)
}