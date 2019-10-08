/* eslint-disable no-undef */

// let tablename = CSTABLE.replace( '#' , '' )
//         if (removeItem.id == tablename) {
//             _Clons.Index.Table={
//                 RowGroup: {},
//                 $RowGroup: {},
//                 CloneId: -1
//             }
//             $(removeItem,'table>tbody>tr>td').each((_ind, ele)=> {
//                 if (ele != undefined) {
//                     const { cloneId} = ele.dataset
//                     _Clons.Items.Clons = _Clons.Items.Clons.filter(function(value) {
//                         if (value != undefined && value != null) {
//                             if (value.Index != cloneId) {
//                                 $('.m-Tool>ul>li.active').each((_ind,_ele)=>{
//                                     if(_ele!=undefined){
//                                         const { ItemKey} =_ele.dataset
//                                         if(ItemKey==value.value.ItemKey)
//                                             _ele.classList.toggle('active')
//                                         $(_ele).find('input').first().prop('checked',false)
//                                     }
//                                 })
//                                 return true
//                             } else {
//                                 return false
//                             }
//                         }
//                     })
//                 }
//             })


const RemoveTables = (state,index)=>{
    const  _Clone = state.Clone
    var _table = null
    _Clone.Items.Tables=_Clone.Items.Tables.filter((el,i)=>{
        if(el!=undefined){
            if(el.Index==index){
                _table=el
            }
        }
    })
    if(_table!=null){
        for (let i = 0; i < _table.children.length; i++) {
            const el = _table.children[i];
            _Clone.Items.Clons = _Clone.Items.Clons.filter(function(value) {
                if (value != undefined && value != null) {
                    if (value.Index != el.Index) {
                        $('.m-Tool>ul>li.active').each((_ind,_ele)=>{
                            if(_ele!=undefined){
                                const { TableKey } =_ele.dataset
                                if(TableKey==value.value.TableKey)
                                    _ele.classList.toggle('active')
                                $(_ele).find('input').first().prop('checked',false)
                            }
                        })
                        return true
                    } else {
                        return false
                    }
                }
            })
        }
    }
    return _table
}

export const RemoveTable = (table,state,success)=>{
    const { Clone:_Clons }=state
    const _Remove = (item)=>{
        if (item != null) {
            for (let i = 0; i < item.children.length; i++) {
                const element = item.children[i];
                if(element!=undefined){
                    element.menuelement.children[0].checked=false
                }
            }
            var $rt =$(item.element)
            $rt.fadeOut('slow', function() {
                $rt.remove()
            })
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
    success(null,state)
}
export const RemoveTableItem = (table,state,success)=>{
    const { Clone:_Clons }=state
    const _Remove = (item)=>{
            return new Promise((resolve)=>{
            const element = item.child
            if(element!=undefined){
                element.menuelement.children[0].checked=false
                var $rt =$(element.element)
                $rt.fadeOut('slow', function() {
                    $rt.remove()
                    _Clons.Items.Tables[item.tindex].children.splice(item.index,1)
                    _Clons.Items.Tables[item.tindex].childIndex.splice(item.index,1)
                    if(_Clons.Items.Tables[item.tindex].children.length==0){
                        var $rt1 =_Clons.Items.Tables[item.tindex].element
                        $rt1.remove()
                        _Clons.Items.Tables.splice(item.tindex,1)
                    }
                    resolve()
                })
            }else{
                resolve()
            }
        })
    }
    // eslint-disable-next-line no-unused-vars
    const _removeitem= {}
    for (let i = 0; i <  _Clons.Items.Tables.length; i++) {
        const _t =  _Clons.Items.Tables[i];
        if(_t && _t.childIndex){
            for (let j = 0; j < _t.childIndex.length; j++) {
                const element = _t.childIndex[j];
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
            success(null,state)
        })
    }else{
        success(null,state)
    }
}

const RemoveCloneItem=(cloneId,state,success) =>{
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
        var $r =$(removeItem)
        $r.fadeOut('slow', function() {
            $r.remove()
            success(null,state)
        })
    }
}
export default RemoveCloneItem