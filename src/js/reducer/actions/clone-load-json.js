import { AddCloneItem, PrintSetting } from './index'

const AddCloneItemTo = (Clons,state,i,success)=>{
    if(i<Clons.length){
        const clonetext = Clons[i]
        const { menuindex}= clonetext
        const {left,top } =clonetext.value.Style
        AddCloneItem({
            Index:menuindex,
            left:left.replace('px',''),
            top:top.replace('px',''),
            Style:clonetext.value.Style
        },state,()=>{
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
    if(value!=undefined)
        // eslint-disable-next-line no-unused-vars
        PrintSetting(state,value.Print,(_data)=>{
            const Clons =value.Clons
            const Tables = value.Tables
            state.Clone.Items.Clons=[]
            state.Clone.Items.Tables=[]
            state.Clone.Index.Index=0
            let i =0
            AddCloneItemTo(Clons,state,i,()=>{
                let j=0
                AddTablesTo(Tables,j,state,()=>{
                    success(value)
                })
            })
        })
}
export {LoadJson}