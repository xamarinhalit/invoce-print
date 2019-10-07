/* eslint-disable no-undef */
import InitialState from './state'
import { actionTypes } from './const'
import { SetGroupItem, fetchData, AddCloneItem, RemoveCloneItem,RemoveTableItem, GetPrintInit,RemoveTable ,SetConfig,GetInitCalc,CalcW80To100,CalcH70To100 } from './actions'

const observers= []

const dispatch = (action,state=InitialState)=>{

    switch (action.type) {
    case actionTypes.INIT.FETCHED:
        fetchData(data=>{
            state.Clone.Items.StaticItems=data
            state.UI.DROPID=action.payload
            state.UI.$CONTENT = $(action.payload)
            SetGroupItem(state)
            SetConfig(state)
            sendReducer(action.type,data,state)
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
    case actionTypes.UI.UI_GETINITCALC:
        GetInitCalc(state).then(()=>{
            sendReducer(action.type,{Tools:{ CalcW80To100,CalcH70To100}},state)
        })
        break
    case actionTypes.UI.UI_GETNEWCLAC:
        GetPrintInit(state).then(()=>{
            sendReducer(action.type,{Tools:{}},state)
        })
        break
    default:
        break
    }


}
const sendReducer= (type,data,state)=> {// {type:actionTypes, payload:{}}
    for (let i = observers.length - 1; i >= 0; i--) {
        if(!type){
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
export { addReducer,dispatch,reducer_pipe}