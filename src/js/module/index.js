import { dispatch,addReducer } from '../reducer'
import { actionTypes } from '../reducer/const'
const { subscribe }  = addReducer
const Init = function (payload,...args) {
    for (let i = 0; i < args.length; i++) $(args[i].selector).click((e)=>$(this)[args[i].fn](e))
    dispatch({ type: actionTypes.INIT.FETCHED, payload })
}

export { Init ,actionTypes,dispatch,subscribe}