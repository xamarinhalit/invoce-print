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

export const RemoveTable = (table,state,succes)=>{
    
}
export const RemoveTableItem = (table,state,succes)=>{
    
}

const RemoveCloneItem=(cloneId,state,success) =>{
    const { Clone:_Clons }=state
  //  const CSTABLE = _Clons.SelectElement.TABLE
    //const CITABLE = _Clons.Index.Table
    let removeItem = null
    // eslint-disable-next-line no-unused-vars
    _Clons.Items.Clons = _Clons.Items.Clons.filter(function(value) {
        if (value != undefined && value != null) {
            if (value.index != cloneId) {
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
        })
    }else if(cloneId!=undefined || cloneId !=null){
        RemoveTables(state,cloneId)
    }
    success(null,state)
}
export default RemoveCloneItem