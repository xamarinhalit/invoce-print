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
const SetPrintInit = ({Print,content})=> {
    return new Promise((resolve)=>{
        let hbodystyle= `<style>
        body {
            size: ${Print.PageSize} ${Print.PageType=='Dikey'?'landscape':'portrait'};
            padding:0;margin:0cm;
        }
         .p-main .p-row {
            display: -webkit-inline-box;
            display: -ms-inline-flexbox;
            display: inline-flex;
          }
         .p-main .p-row .p-column {
              border: none;
          }
        </style>`
        let hstyle= `<style>
        @page {
            size: ${Print.PageSize} ${Print.PageType=='Dikey'?'landscape':'portrait'};
            padding:0;margin:0cm;
        }
        </style>`
        let clnode = content.cloneNode(true)
        let _div = null
        if(Print.PageCopy>1){
            _div=document.createElement('div')
            _div.style.display='flex'
            if(Print.CopyDirection=='Yanyana'){
                _div.style.flexDirection='row'
            }else{
                _div.style.flexDirection='column'
            }
            for (let i = 0; i < parseInt(Print.PageCopy); i++) {
                const cl2 =clnode.cloneNode(true)
                cl2.style.position='absolute'
                if(Print.CopyDirection=='Yanyana'){
                    //   let cw = state.Cache.Print.width
                    let cw = $(cl2).width()
                    cl2.style.width=cw + 'px'
                    cl2.style.left=cw*i +'px'
                }else{
                    let cw = $(cl2).height()
                    //let cw = state.Cache.Print.height
                    cl2.style.height=cw + 'px'
                    cl2.style.top=cw*i +'px'
                }
                _div.appendChild(cl2)
            }
            resolve({element:_div,hbodystyle:hbodystyle,pagestyle:hstyle})
        }else{
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

        const {element,hbodystyle,pagestyle} =await SetPrintInit({Print,content})

        success({element,hbodystyle,pagestyle})
    }
}
const AddCloneTableItem = (item,content,config)=>{
    return new Promise((resolve)=>{
        console.log('tableitem',item)
        const $table = $(content).find('#table-'+item.value.TableKey).first()
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
        console.log('table',menuitem)
        const { value}=menuitem
        const _div = document.createElement('div')
        _div.classList.add(config.UI.TABLEMAINCLASS)
        _div.style.position='absolute'
        const $div =$(_div)
        $div.prop('id','table-'+value.TableKey)
        $div.css(value.Style)
        resolve({element:_div})
    })
}
const AddCloneTextItem= (menuitem)=>{
    return new Promise((resolve)=>{
        console.log('text',menuitem)
        const {value} =menuitem
        const textclone= document.createElement('div')
        textclone.innerHTML= value.ItemValue
        if(value.Style!='' && value.Style!=undefined && value.Style!=null)
            $(textclone).css(value.Style)
        resolve({element:textclone})
    })
}