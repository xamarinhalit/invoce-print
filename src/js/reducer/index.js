/* eslint-disable no-undef */
import InitialState from './state'
import { actionTypes } from './const'
import { SetGroupItem, fetchData, AddCloneItem, RemoveCloneItem,RemoveTableItem, GetPrintInit,RemoveTable ,SetConfig, postData, PrintSetting, SetJsonData,ChangeFontEvent,StyleParamClick, LoadJson } from './actions'
const SetInit = (state,payload)=>{
    const {tools,PrintSetting,PrintLoad,PrintSave,target,dragclass,accordion,tablerowclass,tablecolumnclass} = payload
    state.Cache.Http.Tools=tools
    state.Cache.Http.PrintSetting =PrintSetting
    state.Cache.Http.PrintLoad =PrintLoad
    state.Cache.Http.PrintSave =PrintSave
    state.UI.DROPID=target
    state.UI.DRAGCLASS=dragclass
    state.UI.ACCORDIONID=accordion
    state.UI.TABLEROWCLASS=tablerowclass
    state.UI.TABLECOLUMNCLASS=tablecolumnclass
}
const observers= []

const dispatch = (action,state=InitialState)=>{

    switch (action.type) {
    case actionTypes.CLONE.LOAD_JSON_CONTAINER:
        state.UI.$CONTENT.html('')
        fetchData(state.Cache.Http.PrintSetting,_print=>{
            if(_print!=undefined && _print!=null){
                PrintSetting(state,_print[0].Print,(_print)=>{
                })
            }
        })
        break
    case actionTypes.INIT.PRINT:
        PrintSetting(state,action.payload,(_data)=>{
            
            sendReducer(action.type,_data,state)
        })
        break
    case actionTypes.INIT.FETCHED:
        SetInit(state,action.payload)
        fetchData(state.Cache.Http.Tools,data=>{
            state.Clone.Items.StaticItems=data[0].Tools
            state.UI.$CONTENT = $(action.payload.target)
            SetGroupItem(state)
            SetConfig(state)
            sendReducer(action.type,data[0].Tools,state)
        })
        
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
    case actionTypes.HTTP.POST:
        postData({data:{
            Tables:state.Clone.Items.Tables,
            Clons:state.Clone.Items.Clons,
            Menu:state.UI.PANEL.Menu
        }}).then((_data)=>{
            // sendReducer(action.type,null,state)
        })
        break
    case actionTypes.HTTP.JSON_CONFIG_SAVE:
        SetJsonData(state,action.payload,(_data)=>{
            sendReducer(action.type,{data:_data},state)
            postData({url:state.Cache.Http.PrintSave,data:_data}).then((_sonuc)=>{
                // sendReducer(action.type,null,state)
            })
        })
        break
    case actionTypes.HTTP.JSON_CONFIG_LOAD:
        postData({url:state.Cache.Http.PrintLoad,data:action.payload,type:'GET'}).then((_sonuc)=>{
            LoadJson(state,_sonuc,(_data)=>{
                sendReducer(action.type,{data:_sonuc},state)
            })
        })
       
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