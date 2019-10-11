/* eslint-disable no-undef */
const RemoveReset = (state)=>{
    state.UI.SELECT.$font =null
    setTimeout(()=>{
        $('.p-font-block').removeClass('p-active')
    },300)
}

export const RemoveTable = (table,state,success)=>{
    const { Clone:_Clons }=state
    const _Remove = (item)=>{
        if (item != null) {
            for (let i = 0; i < item.children.length; i++) {
                const element = item.children[i]
                if(element!=undefined){
                    element.menuelement.children[0].checked=false
                }
            }
            item.element[0].parentNode.removeChild(item.element[0])
        }   
    }
    // eslint-disable-next-line no-unused-vars
    _Clons.Items.Tables = _Clons.Items.Tables.filter(function(value) {
        if (value != undefined && value != null) {
            if (value.Index !==table.table.Index) {
                return true
            } else {
                _Remove(value)
                return false
            }
        }
    })
    RemoveReset(state)
    success(null,state)
}
export const RemoveTableItem = (table,state,success)=>{
    const { Clone:_Clons }=state
    const _Remove = (item)=>{
        return new Promise((resolve)=>{
            const element = item.child
            if(element!=undefined){
                $(element.element).remove()
                _Clons.Items.Tables[item.tindex].children.splice(item.index,1)
                _Clons.Items.Tables[item.tindex].childIndex.splice(item.index,1)
                if(_Clons.Items.Tables[item.tindex].children.length==0){
                    _Clons.Items.Tables[item.tindex].element[0].parentNode.removeChild(_Clons.Items.Tables[item.tindex].element[0])
                    _Clons.Items.Tables.splice(item.tindex,1)
                }
                resolve()
            }else{
                resolve()
            }
        })
    }
    // eslint-disable-next-line no-unused-vars
    const _removeitem= {}
    for (let i = 0; i <  _Clons.Items.Tables.length; i++) {
        const _t =  _Clons.Items.Tables[i]
        if(_t && _t.childIndex){
            for (let j = 0; j < _t.childIndex.length; j++) {
                const element = _t.childIndex[j]
                if(element && table.table.Index){
                    _removeitem.table=_t
                    _removeitem.child=_t.children[j]
                    _removeitem.index=j
                    _removeitem.tindex=i
                }
            }
        }
        
    }
    if(_removeitem.table!=undefined){
        _Remove(_removeitem).then(()=>{
            RemoveReset(state)
            success(null,state)
        })
    }else{
        RemoveReset(state)
        success(null,state)
    }
}
export const RemoveCloneItem=(cloneId,state,success) =>{
    const { Clone:_Clons }=state
    let removeItem = null
    // eslint-disable-next-line no-unused-vars
    _Clons.Items.Clons = _Clons.Items.Clons.filter(function(value) {
        if (value != undefined && value != null) {
            if (value.Index != cloneId) {
                return true
            } else {
                removeItem = value.element
                return false
            }
        }
    })
   
    if (removeItem != null) {
        removeItem.parentNode.removeChild(removeItem)
    }
    RemoveReset(state)
    success(null,state)
}