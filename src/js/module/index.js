import 'webpack-jquery-ui' //ui.js
import '../../_plugin/js/used/printThis.js'
import '../../_plugin/js/used/bootstrap.min.js'

import { dispatch,addReducer } from '../reducer'
import { actionTypes } from '../reducer/const'

const { subscribe }  = addReducer
const Init = function (payload) {
   
    dispatch({ type: actionTypes.INIT.FETCHED, payload })
}
window.$_FATURA ={ Init ,actionTypes,dispatch,subscribe}
export { Init ,actionTypes,dispatch,subscribe}