import { actionTypes } from '../const'
import { dispatch } from '..'
import AddCloneItem from './add-clone'

export const LoadJsonData = (state,payload,success)=>{
    let _parsed =JSON.parse(payload[0])
    var n = window.open('','')
    const pre = document.createElement('pre')
    pre.innerText=_parsed
    n.document.body.appendChild(pre)
    success(_parsed)
}
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
    let _parsed =payload[0]
    const Clons =_parsed.Clons
    const Tables = _parsed.Tables
    state.Clone.Items.Clons=[]
    state.Clone.Items.Tables=[]
    state.Clone.Index.Index=0
    let i =0
    AddCloneItemTo(Clons,state,i,()=>{
        let j=0
        AddTablesTo(Tables,j,state,()=>{
            success()
        })
    })
    //    let Items =copyObject(payload[0],true)
      //  let JsonData = {}
       
       // let _data = JSON.stringify(Items)
    // var n = window.open('','')
    // const pre = document.createElement('pre')
    // pre.innerText=JSON.stringify(_parsed)
    // n.document.body.appendChild(pre)
    success(_parsed)
}
export {LoadJson}