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
const LoadJson = (state,payload,success)=>{
    let _parsed =payload[0]
    const Clons =_parsed.Clons
    const Tables = _parsed.Tables
    state.Clone.Items.Clons=[]
    state.Clone.Items.Tables=[]
    state.Clone.Index.Index=0
    let i =0
    AddCloneItemTo(Clons,state,i,()=>{
        success()
    })
    let j=0
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