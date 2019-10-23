/* eslint-disable no-undef */
import {  PrintSetting } from './index'
import { AddCloneItemAsync } from './add-clone'
const setResetInputChecked = (state)=>{
    for (let i = 0; i < state.UI.PANEL.Menu.length; i++) {
        const item = state.UI.PANEL.Menu[i]
        if(item!=undefined && item.value.ItemType==state.Clone.Type.TABLE.FIELD){
            if(item.element.classList.contains('active'))
                item.element.classList.remove('active')
            item.element.querySelector('input').checked=false
        }
    }
}
const setInputChecked = ({id,checked},state)=>{
    let _item
    
    for (let i = 0; i < state.UI.PANEL.Menu.length; i++) {
        const item = state.UI.PANEL.Menu[i]
        if(item!=undefined){
            if(item.id==id){
                if(checked==true){
                   // if(!item.element.classList.contains('active'))
                        item.element.classList.add('active')
                        item.element.querySelector('input').checked=true
                }else{
                    if(item.element.classList.contains('active'))
                        item.element.classList.remove('active')
                        item.element.querySelector('input').checked=false
                }
                _item=item
                break
            }
        }
    }
    return _item
}
const setChangeColumn = ({columnIndex,item},state)=>{
    return new Promise((resolve)=>{
        let _item
        for (let i = 0; i < state.UI.PANEL.Menu.length; i++) {
            const menuitem = state.UI.PANEL.Menu[i]
            if(menuitem!=undefined){
                if(menuitem.value.ColumnIndex==columnIndex && columnIndex!=undefined && menuitem.id!=item.id && menuitem.value.TableKey==item.value.TableKey){
                    let oldindex =menuitem.element.dataset.columnIndex
                    item.element.dataset.columnIndex=oldindex
                    item.value.ColumnIndex=oldindex
                    menuitem.element.dataset.columnIndex=columnIndex
                    menuitem.value.ColumnIndex=columnIndex
                    const citem = document.createElement('li')
                    $(item.element.parentNode).prepend(citem)
                    $(item.element).detach().insertBefore(menuitem.element)
                    $(menuitem.element).detach().insertBefore(citem)
                    citem.parentNode.removeChild(citem)
                    _item=item
                    break
                }
            }
        }
        resolve( _item)
    })
   
}
const AddCloneItemTo = (Clons,state,i)=>{
    return new Promise((resolve)=>{
        if(i.i<Clons.length){
            const clonetext = Clons[i.i]
            const { id,value}= clonetext
            const {left,top } =value.Style
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
            AddCloneItemAsync(clLeft,state).then((_data)=>{
                i.i++
                if(_data!=undefined && _data!=null && _data.value.ItemType==state.Clone.Type.TABLE.FIELD){
                    const {value,id }= _data
                    const { RowIndex,ColumnIndex } = value
                    const _menuitem =setInputChecked({id,checked:true },state)
                    setChangeColumn({ rowIndex:RowIndex,columnIndex:ColumnIndex,item:_menuitem},state).then(()=>{
                        if(i.i<Clons.length){
                            AddCloneItemTo(Clons,state,i).then(()=>{
                                resolve()
                            })
                        }
                    })
                }else if(i.i<Clons.length){
                    AddCloneItemTo(Clons,state,i).then(()=>{
                        resolve()
                    })
                }
            })
        }
    })
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
const LoadJson = (state,payload,success)=>{
    let value
    if(payload && typeof payload === 'object' && payload.constructor === Array){
        value=payload[0]
    }else if(payload && typeof payload === 'object' && payload.constructor === Object){
        value=payload
    }
    if(value!=undefined){
        const i ={
            i:0
        }
        // eslint-disable-next-line no-unused-vars
        PrintSetting(state,value.Print,(_data)=>{
            const Clons =value.Clons
            state.Clone.Items.Clons=[]
            state.Clone.Index.Index=0
            setResetInputChecked(state)
            AddCloneItemTo(Clons,state,i).then((value)=>{
                success(value)
            })
        })
    }
}
export {LoadJson}