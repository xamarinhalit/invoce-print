/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import '../_plugin/css/bootstrap.min.css'
import '../_plugin/css/font-awesome.min.css'
import '../_plugin/css/jquery-ui.min.css'
import '../_plugin/css/efar.css'
//import '../scss/mydrop.scss'
import '../scss/mycss.scss'
import '../scss/print.scss'
// import '../_plugin/css/jq-ui.css'



(function () {
    require('../_plugin/js/used/printThis.js')
    require('../_plugin/js/used/bootstrap.min.js')

    require('webpack-jquery-ui')
    const { subscribe, dispatch , actionTypes, Init } =require('./module')
    //require('webpack-jquery-ui/css');
    $(document).ready(function () {
        Init(
            { target:'.m-Template-Page-Area',
                dragclass:'m-drag-ul',
                accordion:'#accordion',
                tablerowclass:'p-row',
                tablecolumnclass:'p-column',
                tools:'http://localhost:3000/tools',
                PrintSetting:'http://localhost:3000/PrintSetting',
                PrintLoad:'http://localhost:3000/SaveLoad',
                PrintSave:'http://localhost:3000/SaveLoad',
            },
            {selector:'#JsonConfig',fn:'JsonConfig'},
            {selector:'#newPrint',fn:'newPrint'},
            {selector:'#PrintSettings',fn:'PrintSettings'},
            {selector:'[name="BtnSettingSave"]',fn:'btnSettingSave'}
        )
    })
    $.fn.extend({
        btnSettingSave:function(e){
            e.preventDefault()
            const forms =  document.forms.PanelPaperSetting
            let message = ''
            let Print ={}
            for (let i = 0; i < forms.length; i++) {
                const element = forms[i]
                const {name,value,type} =element
                if(name != '' && type!='button')
                    Print[name]=value
                if (!element.checkValidity()) {
                    message+=element.validationMessage + ' , '
                }
            }
            if(message!=''){
                alert(message)
            }else{
                dispatch({type:actionTypes.INIT.PRINT,payload:Print})
            }
        },
        JsonConfig: function(e) {
            e.preventDefault()
            subscribe(actionTypes.UI.JSON_CONFIG_SAVE,(state,_data)=>{
                // eslint-disable-next-line no-empty-pattern
                console.log(_data.data)
              
            })
            dispatch({type:actionTypes.HTTP.JSON_CONFIG_SAVE})
        },
        newPrint: function(e){
            e.preventDefault();
            subscribe(actionTypes.UI.UI_PRINT,(state,_tools)=>{
                // eslint-disable-next-line no-empty-pattern
                const { } = _tools.Tools
              
            })
            dispatch({type: actionTypes.UI.UI_PRINT})
    
        },
        PrintSettings:(e)=>{
            e.preventDefault()
            const $ps =$('select[name="PageSize"]')
            let v1 = $ps.val()
            $ps.val('A4')
            $ps.val(v1)
            const $pc =$('select[name="PageCopy"]')
            let v2 = $pc.val()
            $pc.val('1')
            $pc.val(v2)
            $('#PopupSettings').modal({ backdrop: 'static', keyboard: false })
        }
    })
})()