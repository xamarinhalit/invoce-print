/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import '../_plugin/css/bootstrap.min.css'
import '../_plugin/css/font-awesome.min.css'
import '../_plugin/css/jquery-ui.min.css'
import '../_plugin/css/efar.css'
import '../scss/mycss.scss'
import '../scss/print.scss'
// import 'webpack-jquery-ui' //ui.js
// import '../_plugin/js/used/printThis.js'
// import '../_plugin/js/used/bootstrap.min.js'

(function () {
    const { subscribe, dispatch , actionTypes, Init } =require('./module')
    const GetFormat =(element)=>{

        let deger =element.ItemValue
        switch (element.Format) {
        case '0,00':
            if(deger.indexOf(',')==-1)
            //deger =......      
                break
            break
        case 'Adet':
            if(deger.indexOf('adet')==-1)
                deger +=' adet'
            break
        case 'fa fa-money':
            if(deger.indexOf('<i class="fa fa-money"></i>')==-1)
                deger +=' <i class="fa fa-money"></i>'
            break
        case 'N2':
            //deger =......      
            break
        default:
          //deger =......      
          //tarih format
        }
        return deger
    }
    
    $(document).ready(function () {
        const fontSelects = [
            {selector:'font-style',readselector:'fontStyle',defaultvalue:'initial'},
            {selector:'font-weight',readselector:'fontWeight',defaultvalue:'initial'},
            {selector:'text-align',readselector:'textAlign',defaultvalue:'initial'},
            {selector:'text-decoration',readselector:'textDecoration',defaultvalue:'initial'}
        ]
        const PageName='Sayfa'
        const DefaultPrint = {
            PageCopy: 1,
            PageProduct: 1,
            PageSize: 'A4',
            PageType: 'Dikey',
            CopyDirection: 'Yanyana',
            PageWidth: '21,00',
            PageHeight: '29,70',
            ImageUrl: 'https://content.hesap365.com/content/891ebe11-0b0f-4609-84f6-15ba1143ed09/InvoiceTemplates/dbd01ae142e441d39826b47153f8c8c0.jpg'
        }
        const InitConfig ={ target:'.m-Template-Page-Area',
            dragclass:'m-drag-ul',
            accordion:'#accordion',
            tablerowclass:'p-row',
            tablecolumnclass:'p-column',
            tools:'http://localhost:3000/tools',
            PrintSetting:'http://localhost:3000/PrintSetting',
            PrintLoad:'http://localhost:3000/SaveLoad',
            PrintSave:'http://localhost:3000/SaveLoad?PageName',
        }
        const SetPrint = (_Print)=> {
            const forms =  document.forms.PanelPaperSetting
            for (let i = 0; i < forms.length; i++) {
                const element = forms[i]
                const {name,value,type} =element
                for (const key in _Print) {
                    if (_Print.hasOwnProperty(key)) {
                        const printvalue = _Print[key]
                        if(key==name)
                        {
                            element.value=printvalue
                        }
                    }
                }
            }
        }
        Init(InitConfig ,fontSelects)
        SetPrint(DefaultPrint)
        subscribe(actionTypes.CLONE.FORMAT_CHANGE,(state,changed)=>{
            const { element,value} =changed
            if(element!=undefined){
                value.ItemValue= GetFormat(value)
                element.innerHTML=value.ItemValue
            }
        })
        const $FONTSIZE= document.querySelector('input[name="fontsize"]')
        $FONTSIZE.addEventListener('keyup',(e)=>{
            const _target =e.currentTarget
            if(_target !=undefined && _target!=null && _target.value!=''){
                dispatch(
                    {type:actionTypes.CLONE.FONT_CHANGE,
                        payload:{ font:'font-size',style:null,defaultvalue:'10pt',input:_target.value}})
            }
        })
        subscribe(actionTypes.CLONE.FONT_ITEM_SELECT,(state,data)=>{
            const selectedelemet = data.element
            const fsize=selectedelemet.style.fontSize
            if(fsize!=''){
                if(fsize.indexOf('pt')>-1){
                    $FONTSIZE.value=fsize.replace('pt','')
                }
            }else{
                $FONTSIZE.value='' 
            }
            const $ffsize =$('.p-font-block')
            if(!$ffsize.hasClass('p-active')){
                $ffsize.addClass('p-active')
            }
            $( state.UI.SELECT.$font).trigger('change')
        })
        $('#loadJson').click(function(e){
            e.preventDefault()
            subscribe(actionTypes.HTTP.JSON_CONFIG_LOAD,(state,_data)=>{
                // eslint-disable-next-line no-empty-pattern
                console.log(_data.data)
                  SetPrint(_data.Print)
            })
       //     dispatch({type:actionTypes.CLONE.LOAD_JSON_CONTAINER})
            dispatch({type:actionTypes.HTTP.JSON_CONFIG_LOAD})
        })
        $('#JsonConfig').click(function(e) {
            e.preventDefault()
            subscribe(actionTypes.HTTP.JSON_CONFIG_SAVE,(state,_data)=>{
                // eslint-disable-next-line no-empty-pattern
              //  console.log(_data.data)
                  
            })
            dispatch({type:actionTypes.HTTP.JSON_CONFIG_SAVE,payload:{PageName}})
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
            $ps.trigger('change')
            const $pc =$('select[name="PageCopy"]')
            let v2 = $pc.val()
            $pc.val('1')
            $pc.val(v2)
            $pc.trigger('change')
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