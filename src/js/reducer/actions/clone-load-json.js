import { AddCloneItem, PrintSetting } from './index'
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
const AddCloneItemTo = (Clons,state,i,success)=>{
    if(i<Clons.length){
        const clonetext = Clons[i]
        const { id,value}= clonetext
        const {left,top } =value.Style
        console.log(clonetext.value)
        let clLeft={}
        if(left!=undefined){
            clLeft={
                Index:id,
                left:left.replace('px',''),
                top:top.replace('px',''),
                Style:value.Style,
                MenuValue:clonetext,
                load:true
            }
        }else{
            clLeft={
                Index:id,
                Column:{Style:value.Style},
                MenuValue:clonetext,
                load:true
            }
        }
        AddCloneItem(clLeft,state,()=>{
            i++
            
            if(i<Clons.length){
                AddCloneItemTo(Clons,state,i,success)
            }else{
                success()
            }
        })
    }else{
        success()
    }
   
}
const SetMenuItem = (Menu,menuindex,ColumnIndex,tablekey)=>{
    for (let i = 0; i < Menu.length; i++) {
        const item = Menu[i]
        if(item!=undefined &&item.value.ColumnIndex!=undefined && item.value.TableKey!=undefined){
            if(parseInt(item.value.ColumnIndex)==parseInt(ColumnIndex) &&  item.value.TableKey==tablekey){
                if(menuindex!=item.Index){
                    let oldindex =Menu[menuindex].element.dataset.columnIndex
                    item.element.dataset.columnIndex=oldindex
                    item.value.ColumnIndex=oldindex
                    Menu[menuindex].element.dataset.columnIndex=ColumnIndex
                    Menu[menuindex].value.ColumnIndex=ColumnIndex
                    $(item.element).detach().insertBefore(Menu[menuindex].element)
                }
            }
        }
        
    }
}
const AddChildItemTo = (children,style,i,state,success)=>{
    if(i<children.length){
        const clonetext = children[i]
        const { menuindex,value}= clonetext
        AddCloneItem(
            {
                Table:{
                    Style:style
                },
                Column:{
                    Style:value.Style
                },
                Index:menuindex,
                MenuValue:value,
                load:true
            },state,()=>{
                const menuitem = state.UI.PANEL.Menu[menuindex]
                const $menuitem = $(menuitem.element)
                if(!$menuitem.hasClass('active')){
                    $menuitem.addClass('active')
                    const $input  = $menuitem.find('input')
                    $input.prop('checked',true)
                }
                i++
                AddChildItemTo (children,style,i,state,success)
            }
        )
    }else{
        success()
    }
}
const AddTablesTo = (Tables,i,state,success)=>{
    if(i<Tables.length){
        const table = Tables[i]
        const {Style}= table
        let j =0

        AddChildItemTo(table.children,Style,j,state,()=>{
            i++
            AddTablesTo(Tables,i,state,success)
        })
    }else{
        success()
    }
}

const LoadJson = (state,payload,success)=>{
    let value
    if(payload && typeof payload === 'object' && payload.constructor === Array){
        value=payload[0]
    }else if(payload && typeof payload === 'object' && payload.constructor === Object){
        value=payload
    }
    if(value!=undefined){
        // for (let i = 0; i < value.Tables.length; i++) {
        //     const table = value.Tables[i]
        //     for (let j = 0; j < table.children.length; j++) {
        //         const clonetext = table.children[j]
        //         SetMenuItem(state.UI.PANEL.Menu,clonetext.menuindex,clonetext.value.ColumnIndex,clonetext.value.TableKey)
        //     }
        // }
    
        // eslint-disable-next-line no-unused-vars
        PrintSetting(state,value.Print,(_data)=>{
            const Clons =value.Clons
            state.Clone.Items.Clons=[]
            state.Clone.Index.Index=0
            let i =0
            AddCloneItemTo(Clons,state,i,()=>{
                   success(value)
            })
        })
    }
}
export {LoadJson}