import { cmToPixel, CalcWidthHeight } from '../convert'
/* eslint-disable no-undef */
export const JsonToHtmlPrint = (payload)=>{
    return new Promise((resolve)=>{
        AddCloneItemAsync(payload).then((data)=>{
            resolve(data)
        })

    })
}
export const AddCloneItemAsync = (payload) =>{
    return new Promise((resolve)=>{
        AddCloneItem (payload,(data)=>{
            resolve(data)
        })
    })
}
const SetPrintInit = ({Print,content,config})=> {
    return new Promise((resolve)=>{
        let hbodystyle= `<style>
        @page{
            size:${Print.PageSize.toLowerCase()} ${Print.PageType=='Dikey'?'portrait':'landscape'};
             padding:0cm;
             margin:0cm;
         }
        body {
            padding:0;
            margin:0;
        }
         .${config.UI.TABLEMAINCLASS} .${config.UI.TABLEROWCLASS} {
            display: -webkit-inline-box;
            display: -ms-inline-flexbox;
            display: inline-flex;
          }
         .${config.UI.TABLEMAINCLASS} .${config.UI.TABLEROWCLASS} .${config.UI.TABLECOLUMNCLASS} {
              border: none;
          }
        </style>`
        let hstyle= `<style>
            @page{
                size:${Print.PageSize.toLowerCase()} ${Print.PageType=='Dikey'?'portrait':'landscape'};
                padding:0cm;
                margin:0cm;
            }
            body{
                padding:0cm;
                margin:0cm;
            }
            .${config.UI.TABLEMAINCLASS}>.${config.UI.TABLEROWCLASS} {
                display: -webkit-inline-box;
                display: -ms-inline-flexbox;
                display: inline-flex;
              }
             .${config.UI.TABLEMAINCLASS} .${config.UI.TABLEROWCLASS} .${config.UI.TABLECOLUMNCLASS} {
                  border: none;
              }
        </style>`
        let clnode = content.cloneNode(true)
        clnode.removeAttribute('id')
        let _div = null
        const {_width,_height,width,height} = CalcWidthHeight(Print,true)
        if(Print.PageCopy>1){
            _div=document.createElement('div')
            _div.style.display='flex'
            _div.style.margin='0'
            _div.style.padding='0'
            let size =`${Print.PageSize.toLowerCase()} ${Print.PageType=='Dikey'?'portrait':'landscape'}`
            _div.style.size=size
            if(Print.PageType=='Dikey'){
                _div.style.width=width+'px'
                _div.style.height=height+'px'
                if(Print.CopyDirection=='Yanyana'){
                    _div.style.flexDirection='row'
                }else{
                    _div.style.flexDirection='column'
                }
            }else{
                _div.style.height=height+'px'
                _div.style.width=width+'px'
                if(Print.CopyDirection=='Yanyana'){
                    _div.style.flexDirection='row'
                }else{
                    _div.style.flexDirection='column'
                }
            }
            console.log(_div.style.cssText)
          
            let cw ={
                width:'',
                height:''
            }
            cw.width = _width
            for (let i = 0; i < parseInt(Print.PageCopy); i++) {
                const cl2 =clnode.cloneNode(true)
                console.log(cl2.outerHTML)
                cl2.style.position='absolute'
                if(Print.CopyDirection=='Yanyana'){
                    if(Print.PageType=='Yatay'){
                        cw.height =_height
                        cw.width =_width
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.left= cw.width*i+'px'
                        cl2.style.top= '0px'
                        console.log(cw)
                    }else{
                        cw.height =_height-1
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.left=cw.width*i +'px'
                        cl2.style.top= '0px'
                    }
                }else{
                    if(Print.PageType=='Yatay'){
                        cw.height =_height-1
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.top= cw.height*i+'px'
                    }else{
                        cw.height =_height
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.top= cw.height*i+'px'
                    }
                }
                _div.appendChild(cl2)
            }
            resolve({element:_div,hbodystyle:hbodystyle,pagestyle:hstyle})
        }else{
            clnode.style.margin='0'
            clnode.style.padding='0'
            let size =`${Print.PageSize.toLowerCase()} ${Print.PageType=='Dikey'?'portrait':'landscape'}`
            clnode.style.size=size
            let cw ={
                width:'',
                height:''
            }
            cw.width = _width
            cw.height =_height-1
            clnode.style.width=cw.width + 'px'
            clnode.style.height=cw.height+'px'
            clnode.style.left= '0px'
            clnode.style.top= '0px'
            resolve({element:clnode,hbodystyle:hbodystyle,pagestyle:hstyle})
        }
       
    })
}

const AddCloneItem= async (payload,success)=>{
    const {Print,Clons,config } =  payload

    let value
    if(payload && typeof payload === 'object' && payload.constructor === Array){
        value=payload[0]
    }else if(payload && typeof payload === 'object' && payload.constructor === Object){
        value=payload
    }
    if(value!=undefined){
        const content =document.createElement('div')
       
        for (let i = 0; i < Clons.length; i++) {
            const item = Clons[i]
            let items =null
            switch (item.value.ItemType) {
            case config.TEXT.FIELD:
                items ={...await AddCloneTextItem(item,config)}
                content.appendChild(items.element)
                break
            case config.TABLE.DEFAULT:
                items ={...await AddCloneTable(item,config)}
                content.appendChild(items.element)
                break
            default:
                break
            }
        }
        for (let i = 0; i < Clons.length; i++) {
            const item = Clons[i]
            if(item.value.ItemType==config.TABLE.FIELD){
                await AddCloneTableItem(item,content,config)
            }
        }

        const {element,hbodystyle,pagestyle} =await SetPrintInit({Print,content,config})

        success({element,hbodystyle,pagestyle})
    }
}
const AddCloneTableItem = (item,content,config)=>{
    return new Promise((resolve)=>{
        const $table = $(content).find('.table-'+item.value.TableKey).first()
        let rowQuery='div[data--row-index="'+item.value.RowIndex+'"]'
        let _divrow
        const _divrow0 = $table[0].querySelector(rowQuery)
        if(_divrow0==null){
            _divrow= document.createElement('div')
            _divrow.classList.add(config.UI.TABLEROWCLASS)
            _divrow.dataset.RowIndex=item.value.RowIndex
            $table[0].appendChild(_divrow)
        }else{
            _divrow=_divrow0
        }
        const _divcolumn = document.createElement('div')
        _divcolumn.classList.add(config.UI.TABLECOLUMNCLASS)
        _divcolumn.innerHTML=item.value.ItemValue
        $(_divcolumn).css(item.value.Style)
        _divrow.appendChild(_divcolumn)
        resolve()
    })
}
const AddCloneTable = (menuitem,config)=>{
    return new Promise((resolve)=>{
        const { value}=menuitem
        const _div = document.createElement('div')
        _div.classList.add(config.UI.TABLEMAINCLASS)
        _div.classList.add('table-'+value.TableKey)
        _div.style.position='absolute'
        const $div =$(_div)
        $div.css(value.Style)
        resolve({element:_div})
    })
}
const AddCloneTextItem= (menuitem)=>{
    return new Promise((resolve)=>{
        const {value} =menuitem
        const textclone= document.createElement('div')
        textclone.innerHTML= value.ItemValue
        if(value.Style!='' && value.Style!=undefined && value.Style!=null)
            $(textclone).css(value.Style)
        resolve({element:textclone})
    })
}