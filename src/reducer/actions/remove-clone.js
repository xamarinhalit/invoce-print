/* eslint-disable no-undef */
const RemoveCloneItem=(cloneId,state,success) =>{
    const { Clone:_Clons }=state
    const CSTABLE = _Clons.SelectElement.TABLE
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
        let tablename = CSTABLE.replace( '#' , '' )
        if (removeItem.id == tablename) {
            _Clons.Index.Table={
                RowGroup: {},
                $RowGroup: {},
                CloneId: -1
            }
            $(removeItem,'table>tbody>tr>td').each((_ind, ele)=> {
                if (ele != undefined) {
                    const { cloneId} = ele.dataset
                    _Clons.Items.Clons = _Clons.Items.Clons.filter(function(value) {
                        if (value != undefined && value != null) {
                            if (value.Index != cloneId) {
                                $('.m-Tool>ul>li.active').each((_ind,_ele)=>{
                                    if(_ele!=undefined){
                                        const { ItemKey} =_ele.dataset
                                        if(ItemKey==value.value.ItemKey)
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
            })
        
        // let groupName = "#group-drop-text-" + tablename;
        // $(groupName)
        //   .find(".active")
        //   .each(function(ind, ele) {
        //     if (ele != undefined) {
        //       ele.classList.remove("active");
        //       let ItemKey = ele.dataset.ItemKey;
        //       let _removeItem = null;
        //       _Clons.Items.Clons = _Clons.Items.Clons.filter(function(value, index) {
        //         if (value != undefined && value != null) {
        //           if (value.value.ItemKey != ItemKey) {
        //             return true;
        //           } else {
        //             _removeItem = value.element;
        //             return false;
        //           }
        //         }
        //       });
        //       if (_removeItem != null) {
        //         $(_removeItem).fadeOut("slow", function() {
        //           $(this).remove();
        //         });
        //       }
        //     }
        //   });
        }
        var $r =$(removeItem)
        $r.fadeOut('slow', function() {
            $r.remove()
        })
    }
    success(null,state)
}
export default RemoveCloneItem