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
            CopyDirection: 'Altalta',
            PageWidth: 21.00,
            PageHeight: 29.70,
            ImageUrl:'http://localhost:8080/src/img/fatura.jpg',
            DefaultRow:true
        },
        LoadFromJson:true, /// for developer
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
        Elements:{
            $PageSize:$('select[name="PageSize"]'),
            $PageCopy:$('select[name="PageCopy"]'),
            $LeftCor:document.querySelector('[name="xfontLeft"]'),
            $TopCor:document.querySelector('[name="xfontTop"]'),
            $heightCor:document.querySelector('[name="xfontheight"]'),
            $FONTSIZE:document.querySelector('input[name="fontsize"]')
        },
        Event:{
            AddRemoveListener:(el,eventname,val,add)=>{
                if(el!=undefined){
                    el.removeEventListener(eventname,null)
                    if(el.classList.contains(App.InitConfig.tablecolumnclass)==true){
                        debugger
                        $(el).hide()
                    }else{
                        $(el).show()
                        el.value=(val==undefined || val==null || val=='')?0:parseInt(val)
                        el.addEventListener(eventname,add)
                        $(el).trigger(eventname)
                    }

                }
            },
            ChangeLeftCor:(e)=>{
                const value=e.currentTarget.value+'px'
                dispatch({type:actionTypes.CLONE.FONT_CHANGE,
                    payload:{ font:'left',style:null,defaultvalue:value,input:value}})
            },
            ChangeTopCor:(e)=>{
                const value=e.currentTarget.value+'px'
                dispatch({type:actionTypes.CLONE.FONT_CHANGE,
                    payload:{ font:'top',style:null,defaultvalue:value,input:value}})
            },
            ChangeHeightCor:(e,state)=>{
                const value=e.currentTarget.value+'px'
                dispatch({type:actionTypes.CLONE.FONT_CHANGE,
                    payload:{ font:'height',style:null,defaultvalue:value,input:value}})
                let isTable = state.UI.SELECT.$font.dataset.columnIndex
                if(isTable!=undefined)
                    dispatch({type:actionTypes.CLONE.CALCTABLE})
            },
            FontSize:()=>{
                App.Elements.$FONTSIZE.addEventListener('keyup',(e)=>{
                    const _target =e.currentTarget
                    if(_target !=undefined && _target!=null && _target.value!=''){
                        dispatch({type:actionTypes.CLONE.FONT_CHANGE,
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
                        App.Elements.$FONTSIZE.value=fsize.replace('pt','')
                    }
                }else{
                    App.Elements.$FONTSIZE.value=''
                }
                const fheight=selectedelemet.style.height
                if(fheight!=''){
                    if(fheight.indexOf('pt')>-1){
                        App.Elements.$heightCor.value=fheight.replace('pt','')
                    }
                }else{
                    App.Elements.$heightCor.value=''
                }
                const fleft=selectedelemet.style.left
                if(fleft!=''){
                    if(fleft.indexOf('pt')>-1){
                        App.Elements.$LeftCor.value=fleft.replace('pt','')
                    }
                }else{
                    App.Elements.$LeftCor.value=''
                }
                const ftop=selectedelemet.style.top
                if(ftop!=''){
                    if(ftop.indexOf('pt')>-1){
                        App.Elements.$TopCor.value=ftop.replace('pt','')
                    }
                }else{
                    App.Elements.$TopCor.value=''
                }
            },
            ItemSelect:()=>{
                subscribe(actionTypes.CLONE.FONT_ITEM_SELECT,(state,data)=>{
                    const selectedelemet = data.element
                    const { AddRemoveListener,DefaultFontTools,ChangeTopCor,ChangeLeftCor,ChangeHeightCor} =App.Event
                    const {$LeftCor,$TopCor,$heightCor} = App.Elements
                    DefaultFontTools(selectedelemet,state,data.value)
                    const $ffsize =$('.p-font-block')
                    if(!$ffsize.hasClass('p-active')){
                        $ffsize.addClass('p-active')
                    }
                    AddRemoveListener($LeftCor,'keyup',selectedelemet.style.left.replace('px',''),(e)=>ChangeLeftCor(e))
                    AddRemoveListener($TopCor,'keyup',selectedelemet.style.top.replace('px',''),(e)=>ChangeTopCor(e))
                    AddRemoveListener($heightCor,'keyup',selectedelemet.style.height.replace('px',''),(e)=>ChangeHeightCor(e,state))
                    $( state.UI.SELECT.$font).trigger('change')
                })
            },
            Modal:{
                LoadJson:()=>{
                    $('#loadJson').click(function(e){
                        e.preventDefault()
                        $('#loadFormSetting').modal({ backdrop: 'static', keyboard: false })
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
                                if(App.LoadFromJson==true){
                                    const config ={
                                        TABLE:{
                                            FIELD:'TableField',
                                            DEFAULT:'Table'
                                        },
                                        TEXT:{
                                            FIELD:'Field',
                                            ITEMKEY:'ItemKey',
                                            CUSTOMTEXT:'CustomText',
                                            CUSTOMIMAGE:'CustomImage'
                                        },
                                        UI:{
                                            TABLEROWCLASS:'p-row',
                                            TABLECOLUMNCLASS:'p-column',
                                            TABLEMAINCLASS:'p-main',
                                        }
                    
                                    }
                                    App.Event.JsonToHtmlPrint(undefined,config,{..._sonuc[0],data:_sonuc[0].Clons})
                                }else{
                                    dispatch({type:actionTypes.HTTP.JSON_CONFIG_LOAD,payload: {data:_sonuc}})
                                }
                            })
                            
                        }
                      
                    })
                },
                PrintSettings:()=>{
                    $('#PrintSettings').click((e)=>{
                        e.preventDefault()
                        let v1 = App.Elements.$PageSize.val()
                        App.Elements.$PageSize.val('A4').val(v1).trigger('change')
                        let v2 = App.Elements.$PageCopy.val()
                        App.Elements.$PageCopy.val('1').val(v2).trigger('change')
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
                            _data.data.PageName=_data.data.Print.PageType+' '+_data.data.Print.CopyDirection
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
            JsonToHtmlPrint:async (e,config=null,sonuc)=>{
                if(e!=undefined)
                    e.preventDefault()
                let _sonucx=null,_sonuc=null
                if(sonuc==null){
                    _sonucx =await App.Event.$HTTP({url:'http://localhost:3000/SaveLoad',type:'GET'})
                    _sonuc = _sonucx[0]
                }else{
                    _sonuc=sonuc
                }
                const {Print,Clons,data} = _sonuc
                subscribe(actionTypes.CLONE.JSON_HTMLTOPRINT,(_state,_data)=>{
                    const {pagestyle,hbodystyle,element } =_data
                    $(element.outerHTML).printThis({
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
                    // var vn = window.open('','',`resizable,scrollbars,
                    // titlebar=no,
                    //  left=200,
                    //  top=200,
                    //  width=768,
                    //  height=600`)
                    // vn.document.head.innerHTML=hbodystyle
                    // vn.document.body.innerHTML=element.innerHTML
                })
                dispatch({type:actionTypes.CLONE.JSON_HTMLTOPRINT,payload:{Print,Clons,config,data:[
                    {
                        'id': '100',
                        'value': {
                            'TableKey': 'InvoiceLine',
                            'ItemKey': 'LineStockCode',
                            'ItemValue': 'row-0-col-0',
                            'ItemType': 'TableField',
                            'ColumnIndex': 0,
                            'RowIndex': 0
                        }
                    },
                    {
                        'id': '101',
                        'value': {
                            'TableKey': 'InvoiceLine',
                            'ItemKey': 'LineProductName',
                            'ItemValue': 'row-0-col-1',
                            'ItemType': 'TableField',
                            'ColumnIndex': 1,
                            'RowIndex': 0
                        }
                    },
                    {
                        'id': '102',
                        'value': {
                            'TableKey': 'InvoiceLine',
                            'ItemKey': 'LineStockCode',
                            'ItemValue': 'row-1-col-0',
                            'ItemType': 'TableField',
                            'ColumnIndex': 0,
                            'RowIndex': 1
                        }
                    },
                    {
                        'id': '103',
                        'value': {
                            'TableKey': 'InvoiceLine',
                            'ItemKey': 'LineProductName',
                            'ItemValue': 'Row-1-col-1',
                            'ItemType': 'TableField',
                            'ColumnIndex': 1,
                            'RowIndex': 1
                        }
                    }
                ]}})
            }

        },
        PageInit:()=>{
            App.SetPrint(App.DefaultPrint)
            const {FormatChange,FontSize,ItemSelect,SaveConfig,LoadConfigHttp,Print:Prints} = App.Event
            const {LoadJson,LoadJsonBtn,PrintSettings,PrintSettingsClick}=App.Event.Modal
            FormatChange()
            FontSize()
            ItemSelect()
            LoadJson()
            LoadJsonBtn()
            SaveConfig()
            Prints()
            PrintSettings()
            PrintSettingsClick()
            LoadConfigHttp()
        }
    }

    $(document).ready(function () {
        
        subscribe(actionTypes.INIT.OVERRIDE_TYPE,(state,_data)=>{
            state.Clone.Type.TEXT.FIELD='Field'
            state.Clone.Type.TEXT.CUSTOMTEXT='CustomText'
            state.Clone.Type.TEXT.CUSTOMIMAGE='CustomImage'
            state.Clone.Type.TABLE.FIELD='TableField'
            state.Clone.Type.TABLE.DEFAULT='Table'
            App.Event.$HTTP({url:'http://localhost:3000/new',type:'GET'}).then((data)=>{
              
                App.InitConfig.data=data.TemplateItemValues
                Init(App.InitConfig)
                App.PageInit()
                
               
            })
            
        })
        dispatch({type:actionTypes.INIT.OVERRIDE_TYPE})

    })
})()