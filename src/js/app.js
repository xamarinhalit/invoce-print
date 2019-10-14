/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import '../_plugin/css/bootstrap.min.css'
import '../_plugin/css/font-awesome.min.css'
import '../_plugin/css/jquery-ui.min.css'
import '../_plugin/css/efar.css'
import '../scss/mycss.scss'
import '../scss/print.scss'
import 'webpack-jquery-ui' //ui.js
import '../_plugin/js/used/printThis.js'
import '../_plugin/js/used/bootstrap.min.js'

(function () {
    const { subscribe, dispatch , actionTypes, Init } =require('./module')
    $(document).ready(function () {
        const fontSelects = [
            {selector:'font-style',readselector:'fontStyle',defaultvalue:'initial'},
            {selector:'font-weight',readselector:'fontWeight',defaultvalue:'initial'},
            {selector:'text-align',readselector:'textAlign',defaultvalue:'initial'},
            {selector:'text-decoration',readselector:'textDecoration',defaultvalue:'initial'}
        ]
        const InitConfig ={ target:'.m-Template-Page-Area',
            dragclass:'m-drag-ul',
            accordion:'#accordion',
            tablerowclass:'p-row',
            tablecolumnclass:'p-column',
            tools:'http://localhost:3000/tools',
            PrintSetting:'http://localhost:3000/PrintSetting',
            PrintLoad:'http://localhost:3000/SaveLoad',
            PrintSave:'http://localhost:3000/SaveLoad',
        }
        Init(InitConfig ,fontSelects)
        $('#JsonConfig').click(function(e) {
            e.preventDefault()
            subscribe(actionTypes.UI.JSON_CONFIG_SAVE,(state,_data)=>{
                // eslint-disable-next-line no-empty-pattern
                console.log(_data.data)
                  
            })
            dispatch({type:actionTypes.HTTP.JSON_CONFIG_SAVE})
        }) 
        $('#newPrint').click(function(e){
            e.preventDefault()
            subscribe(actionTypes.UI.UI_PRINT,(state,_tools)=>{
                // eslint-disable-next-line no-empty-pattern
                const { } = _tools.Tools
                  
            })
            dispatch({type: actionTypes.UI.UI_PRINT})
        
        })
        $('#PrintSettings').click((e)=>{
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
        })

        $('[name="BtnSettingSave"]').click(function(e){
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
        })
       
    })
})()