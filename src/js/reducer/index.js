/* eslint-disable no-undef */
import InitialState from './state'
import { actionTypes } from './const'
import { SetGroupItem, AddCloneItem, RemoveCloneItem,RemoveTableItem, GetPrintInit,RemoveTable ,SetConfig, postData, PrintSetting, SetJsonData,ChangeFontEvent,StyleParamClick, LoadJson } from './actions'
const SetInit = (state,payload)=>{
    const {fieldclass,target,dragclass,accordion,
        tablerowclass,tablecolumnclass,tablemainclass ,data} = payload
    let _value
    if(data && typeof data === 'object' && data.constructor === Array){
        _value=data
    }else if(data && typeof data === 'object' && data.constructor === Object){
        _value=data
    }
    state.Clone.Items.StaticItems=_value
    state.UI.$CONTENT = $(target)
    SetGroupItem(state)
    SetConfig(state)
    state.UI.DROPID=target
    state.UI.DRAGCLASS=dragclass
    state.UI.ACCORDIONID=accordion
    state.UI.TABLEROWCLASS=tablerowclass
    state.UI.TABLECOLUMNCLASS=tablecolumnclass
    state.UI.TABLEMAINCLASS=tablemainclass
    state.UI.FIELDCLASS=fieldclass
}
const observers= []

const dispatch = (action,state=InitialState)=>{

    switch (action.type) {
    case actionTypes.INIT.PRINT:
        PrintSetting(state,action.payload,(_data)=>{
            sendReducer(action.type,_data,state)
        })
        break
    case actionTypes.INIT.FETCHED:
        SetInit(state,action.payload)
        sendReducer(action.type,action.payload.data,state)
        break
    case actionTypes.CLONE.ADD_CLONEITEM:
        AddCloneItem(action.payload,state,data=>{
            sendReducer(action.type,data,state)
        })
        break
    case actionTypes.CLONE.REMOVE_CLONEITEM:
        RemoveCloneItem(action.payload,state,data=>{
            sendReducer(action.type,data,state)
        })
        break
    case actionTypes.CLONE.REMOVE_TABLE:
        RemoveTable(action.payload,state,_data =>{
            sendReducer(action.type,_data,state)
        })
        break
    case actionTypes.CLONE.REMOVE_TABLEITEM:
        RemoveTableItem(action.payload,state,_data =>{
            sendReducer(action.type,_data,state)
        })
        break
    case actionTypes.UI.UI_PRINT:
        GetPrintInit(state).then(()=>{
            sendReducer(action.type,{Tools:{}},state)
        })
        break
    case actionTypes.CLONE.DRAG_START:
        sendReducers(action.type,{status:action.payload},state)
        break
    case actionTypes.CLONE.DRAG_STOP:
        sendReducers(action.type,{status:action.payload},state)
        break
    case actionTypes.CLONE.FONT_CHANGE:
        ChangeFontEvent(state,action.payload)
        break
    case actionTypes.CLONE.FORMAT_CHANGE:
        sendReducers(action.type,action.payload,state)
        break
    case actionTypes.CLONE.FONT_ITEM_SELECT:
        sendReducers(action.type,action.payload,state)
        break
    case actionTypes.HTTP.JSON_CONFIG_SAVE:
        SetJsonData(state,action.payload,(_data)=>{
            sendReducer(action.type,{data:_data},state)
        })
        break
    case actionTypes.HTTP.JSON_CONFIG_LOAD:
        if(action.payload.data!=undefined){
            // eslint-disable-next-line no-unused-vars
            LoadJson(state,action.payload.data,(_data)=>{
                sendReducer(action.type,{data:action.payload.data},state)
            })
        }
        break
    default:
        break
    }


}
const sendReducer= (type,data,state)=> {// {type:actionTypes, payload:{}}
    for (let i = observers.length - 1; i >= 0; i--) {
        if(type==undefined || type==null){
            observers[i].fn()
            //addReducer.unSubscribe(observers[i])
        }else{
            const item=observers[i]
            if(item.type==type){
                if(item.fn!=undefined)
                    item.fn(state,data)
                addReducer.unSubscribe(item)
            }
        }
        
    }
}
const sendReducers= (type,data,state)=> {// {type:actionTypes, payload:{}}
    for (let i = observers.length - 1; i >= 0; i--) {
        if(type==undefined || type==null){
            observers[i].fn()
            //addReducer.unSubscribe(observers[i])
        }else{
            const item=observers[i]
            if(item.type==type){
                if(item.fn!=undefined)
                    item.fn(state,data)
                //addReducer.unSubscribe(item)
            }
        }
        
    }
}

const addReducer ={
    subscribe: function(type,fn) {
        observers.push({type,fn})
    }
    ,
    unSubscribe: function(observer) {
        let index = observers.indexOf(observer)
        if (~index) {
            observers.splice(index, 1)
        }
    }
}
const reducer_ListFn={
    index:-1,
    objects:{}
}
const reducer_pipe=(c,...ops)=>{
    const _ob={ arg:ops,obj:c}
    reducer_ListFn.index++
    reducer_ListFn.objects[reducer_ListFn.index]= _ob
    _ob.arg.forEach((v)=>{
        if(v!=undefined){
            v(_ob.obj)
        }
    })
    delete reducer_ListFn.objects[reducer_ListFn.index]
}
export { addReducer,dispatch,reducer_pipe ,sendReducers,StyleParamClick}