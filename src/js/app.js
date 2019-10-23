/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import '../_plugin/css/bootstrap.min.css'
import '../_plugin/css/font-awesome.min.css'
import '../_plugin/css/jquery-ui.min.css'
// import '../_plugin/css/efar.css'
// import '../scss/mycss.scss'
// import '../scss/print.scss'
import '../scss/index.scss'
// import 'webpack-jquery-ui' //ui.js
// import '../_plugin/js/used/printThis.js'
// import '../_plugin/js/used/bootstrap.min.js'

(function () {
    const { subscribe, dispatch , actionTypes, Init,JsonToHtml } =require('./module')
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
    const App= {
        PageName:'Sayfa',
        InitConfig :{ 
            target:'.m-Template-Page-Area',
            dragclass:'m-drag-ul',
            accordion:'#accordion',
            tablerowclass:'p-row',
            tablecolumnclass:'p-column',
            tablemainclass:'p-main',
            fieldclass:'p-field',
            FontSelects:[
                {selector:'font-style',readselector:'fontStyle',defaultvalue:'initial'},
                {selector:'font-weight',readselector:'fontWeight',defaultvalue:'initial'},
                {selector:'text-align',readselector:'textAlign',defaultvalue:'initial'},
                {selector:'text-decoration',readselector:'textDecoration',defaultvalue:'initial'}
            ]
        },
        DefaultPrint :{
            PageCopy: 1,
            PageProduct: 1,
            PageSize: 'A4',
            PageType: 'Dikey',
            CopyDirection: 'Yanyana',
            PageWidth: 21.00,
            PageHeight: 29.70,
            ImageUrl: 'https://content.hesap365.com/content/891ebe11-0b0f-4609-84f6-15ba1143ed09/InvoiceTemplates/dbd01ae142e441d39826b47153f8c8c0.jpg',
            DefaultRow:true
        },
        SetPrint : (_Print)=> {
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
        },
        $FONTSIZE:document.querySelector('input[name="fontsize"]'),
        Event:{
            FontSize:()=>{
                App.$FONTSIZE.addEventListener('keyup',(e)=>{
                    const _target =e.currentTarget
                    if(_target !=undefined && _target!=null && _target.value!=''){
                        dispatch(
                            {type:actionTypes.CLONE.FONT_CHANGE,
                                payload:{ font:'font-size',style:null,defaultvalue:'10pt',input:_target.value+'pt'}})
                    }
                })
            },
            FormatChange:()=>{
                subscribe(actionTypes.CLONE.FORMAT_CHANGE,(state,changed)=>{
                    const { element,value} =changed
                    if(element!=undefined){
                        value.ItemValue= GetFormat(value)
                        element.innerHTML=value.ItemValue
                    }
                })
            },
            DefaultFontTools:(selectedelemet,state,value)=>{
                const fsize=selectedelemet.style.fontSize
                if(fsize!=''){
                    if(fsize.indexOf('pt')>-1){
                        App.$FONTSIZE.value=fsize.replace('pt','')
                    }
                }else{
                    App.$FONTSIZE.value='' 
                }

            },
            ItemSelect:()=>{
                subscribe(actionTypes.CLONE.FONT_ITEM_SELECT,(state,data)=>{
                    const selectedelemet = data.element
                    App.Event.DefaultFontTools(selectedelemet,state,data.value)
                    const $ffsize =$('.p-font-block')
                    if(!$ffsize.hasClass('p-active')){
                        $ffsize.addClass('p-active')
                    }
                    $( state.UI.SELECT.$font).trigger('change')
                })
            },
            Modal:{
                LoadJson:()=>{
                    $('#loadJson').click(function(e){
                        e.preventDefault()
    
                        // $('#loadFormSetting').modal({ backdrop: 'static', keyboard: false })
                    })
                },
                LoadJsonBtn:()=>{
                    $('[name=loadFormSettingBtn]').click((e)=>{
                        e.preventDefault()
                        subscribe(actionTypes.HTTP.JSON_CONFIG_LOAD,(_state,_data)=>{
                            // eslint-disable-next-line no-empty-pattern
                            App.SetPrint(_data.Print)
                        })
                        const forms =  document.forms.loadFormSetting
                        let message = ''
                        let formEl ={}
                        for (let i = 0; i < forms.length; i++) {
                            const element = forms[i]
                            const {name,value,type} =element
                            if(name != '' && type!='button')
                                formEl[name]=value
                            if (!element.checkValidity()) {
                                message+=element.validationMessage + ' , '
                            }
                        }
                        if(message!=''){
                            alert(message)
                        }else{
                            App.Event.$HTTP({url:'http://localhost:3000/SaveLoad?id='+formEl.loadname,type:'GET'}).then((_sonuc)=>{
                                dispatch({type:actionTypes.HTTP.JSON_CONFIG_LOAD,payload: {data:_sonuc}})
                            })
                            
                        }
                      
                    })
                },
                PrintSettings:()=>{
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
                },
                PrintSettingsClick:()=>{
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
                }
            },
            SaveConfig:()=>{
                $('#JsonConfig').click(function(e) {
                    e.preventDefault()
                    subscribe(actionTypes.HTTP.JSON_CONFIG_SAVE,(_state,_data)=>{
                        if(_data!=undefined && _data.data!=undefined){
                            App.Event.$HTTP({url:'http://localhost:3000/SaveLoad',data:_data.data}).then((_sonuc)=>{
                            })
                        }
                    })
                    dispatch({type:actionTypes.HTTP.JSON_CONFIG_SAVE,payload:{data:{PageName:App.PageName}}})
                }) 
            },
            Print:()=>{
                $('#newPrint').click(function(e){
                    e.preventDefault()
                    subscribe(actionTypes.UI.UI_PRINT,(_state,_tools)=>{
                    
                    })
                    dispatch({type: actionTypes.UI.UI_PRINT})
                
                })
            },
            LoadConfigHttp:()=>{
                App.Event.$HTTP({url:'http://localhost:3000/SaveLoad',type:'GET'}).then((data)=>{
                    if(data!=undefined && data.length>0){
                        const selectload=document.forms.loadFormSetting.elements.loadname
                        selectload.innerHTML=''
                        for (let i = 0; i < data.length; i++) {
                            const item = data[i]
                            const opti = document.createElement('option')
                            opti.text=item.PageName +' - ' +item.id
                            opti.value=item.id
                            selectload.appendChild(opti)
                        }
                    }
                })
            },
            $HTTP:async ({url = '', data = {},type='POST'})=> {
                //  data = JSON.stringify(data, getCircularReplacer())
                if(type=='POST'){
                    const response = await fetch(url, {
                        method:type, // *GET, POST, PUT, DELETE, etc.
                        mode: 'cors', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: 'same-origin', // include, *same-origin, omit
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        redirect: 'follow', // manual, *follow, error
                        referrer: 'no-referrer', // no-referrer, *client
                        body:JSON.stringify(data) // body data type must match "Content-Type" header
                    })
                    return await response.json() // parses JSON response into native JavaScript objects
                }
                else{
                        
                    const response = await fetch(url, {
                        method:type, // *GET, POST, PUT, DELETE, etc.
                        mode: 'cors', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: 'same-origin', // include, *same-origin, omit
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        redirect: 'follow', // manual, *follow, error
                        referrer: 'no-referrer', // no-referrer, *client
                    })
                    return await response.json() // parses JSON response into native JavaScript objects
                }
                
            },
            JsonToHtmlPrint:(e)=>{
                if(e!=undefined)
                    e.preventDefault()

                App.Event.$HTTP({url:'http://localhost:3000/SaveLoad',type:'GET'}).then((_sonuc)=>{
                    const {Print,Clons} = _sonuc[1]
                    const config ={
                        TABLE:{
                            FIELD:2,
                            DEFAULT:1
                        },
                        TEXT:{
                            FIELD:0,
                            ITEMKEY:'ItemKey'
                        },
                        UI:{
                            TABLEROWCLASS:'p-row',
                            TABLECOLUMNCLASS:'p-column',
                            TABLEMAINCLASS:'p-main',
                        }

                    }
                    subscribe(actionTypes.CLONE.JSON_HTMLTOPRINT,(_state,_data)=>{
                        const {pagestyle,hbodystyle,element } =_data
                        // var vn = window.open('','')
                        // vn.document.head.innerHTML=hbodystyle
                        // vn.document.body.innerHTML=element.innerHTML
                        // vn.focus()
                        document.head.innerHTML=hbodystyle
                        document.body.innerHTML=element.innerHTML
                        $(element).printThis({
                            debug: false, // show the iframe for debugging
                            importCSS: true, // import parent page css
                            importStyle: true, // import style tags
                            printContainer: true, // print outer container/$.selector
                            pageTitle: '', // add title to print page
                            removeInline: false, // remove inline styles from print elements
                            removeInlineSelector: '*', // custom selectors to filter inline styles. removeInline must be true
                            printDelay: 0, // variable print delay
                            header:pagestyle, // prefix to html
                            footer: null, // postfix to html
                            base: false, // preserve the BASE tag or accept a string for the URL
                            formValues: true, // preserve input/form values
                            canvas: false, // copy canvas content
                            removeScripts: false, // remove script tags from print content
                            copyTagClasses: true, // copy classes from the html & body tag
                            beforePrintEvent: null, // function for printEvent in iframe
                            beforePrint: null, // function called before iframe is filled
                            afterPrint: null // function called before iframe is removed
                        })
                    })
                    dispatch({type:actionTypes.CLONE.JSON_HTMLTOPRINT,payload:{Print,Clons,config}})
                })
            }

        },
        PageInit:()=>{
            App.SetPrint(App.DefaultPrint)
            App.Event.FormatChange()
            App.Event.FontSize()
            App.Event.ItemSelect()
            App.Event.Modal.LoadJson()
            App.Event.Modal.LoadJsonBtn()
            App.Event.SaveConfig()
            App.Event.Print()
            App.Event.Modal.PrintSettings()
            App.Event.Modal.PrintSettingsClick()
            App.Event.LoadConfigHttp()
        },
        OnlyLoadJson:(state)=>{
            App.Event.$HTTP({url:'http://localhost:3000/SaveLoad',type:'GET'}).then((data)=>{
                if(data!=undefined && data.length>0){
                    JsonToHtml(state,data[1],(_data)=>{
                        const {element,hstyle,hbstyle} = _data
                        
                        $(element).printThis({
                            debug: false, // show the iframe for debugging
                            importCSS: true, // import parent page css
                            importStyle: true, // import style tags
                            printContainer: true, // print outer container/$.selector
                            pageTitle: '', // add title to print page
                            removeInline: false, // remove inline styles from print elements
                            removeInlineSelector: '*', // custom selectors to filter inline styles. removeInline must be true
                            printDelay: 0, // variable print delay
                            header:hstyle, // prefix to html
                            footer: null, // postfix to html
                            base: false, // preserve the BASE tag or accept a string for the URL
                            formValues: true, // preserve input/form values
                            canvas: false, // copy canvas content
                            removeScripts: false, // remove script tags from print content
                            copyTagClasses: true, // copy classes from the html & body tag
                            beforePrintEvent: null, // function for printEvent in iframe
                            beforePrint: null, // function called before iframe is filled
                            afterPrint: null // function called before iframe is removed
                        })
                        // const myWindow = window.open("", "MsgWindow","")
                        // const head = document.createElement('style')
                        // head.innerHTML=hbstyle
                        // myWindow.document.head.appendChild(head)
                        // myWindow.document.write(element.innerHTML)
                    })

                }
            })

        }
    }

    $(document).ready(function () {
        App.Event.JsonToHtmlPrint()
        // subscribe(actionTypes.INIT.OVERRIDE_TYPE,(state,_data)=>{
        //     state.Clone.Type.TEXT.FIELD=0
        //     state.Clone.Type.TABLE.FIELD=2
        //     state.Clone.Type.TABLE.DEFAULT=1
        //     App.Event.$HTTP({url:'http://localhost:3000/menu',type:'GET'}).then((data)=>{
        //         App.InitConfig.data=data.Menu
        //         Init(App.InitConfig)
        //         App.PageInit()
        //         //App.OnlyLoadJson(state)
        //     })
        // })
        // dispatch({type:actionTypes.INIT.OVERRIDE_TYPE})
    })
})()