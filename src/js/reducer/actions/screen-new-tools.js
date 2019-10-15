/* eslint-disable no-undef */
import copyObject from './copy-object'
const EmtoPixel=(point)=> {
    let size = getComputedStyle(document.documentElement).fontSize
    if (size != undefined) {
        size = size.replace('px', '')
        size = parseFloat(size)
        if (size < 11) size = 16
    } else {
        size = 16
    }
    return (parseFloat(point) * size).toFixed(0)
}
const PixeltoEm=(pixcel)=> {
    let size = getComputedStyle(document.documentElement).fontSize
    if (size != undefined) {
        size = size.replace('px', '')
        size = parseFloat(size)
        if (size < 11) size = 16
    } else {
        size = 16
    }
    return (pixcel/ size)
}

const pxToVw=($root,pixel)=>{
    return ($root.clientWidth/100)*pixel
}
const pxToVh=($root,pixel)=>{
    return ($root.clientHeight/100)*pixel
}
export const SetJsonData = (state,success)=>{
    let Items =copyObject(state,true)
    let JsonData = {}
    JsonData.Tables =Items.Clone.Items.Tables.map(x=>{
        return {
            Index:x.Index,
            key:x.key,
            children:x.children.map(y=>{
                return {
                    Index:y.Index,
                    value:y.value,
                    ColumIndex:y.ColumIndex,
                    RowIndex:y.RowIndex,
                    ToolValue:y.ToolValue,
                    menuindex:y.menuindex,
                }
            }),
            childIndex:x.childIndex,
            ColumIndex:x.ColumIndex,
            RowIndex:x.RowIndex,
            value:x.value,
            Style:x.Style
        }
    })
    JsonData.Menu =Items.UI.PANEL.Menu.map(x=>{
        return {
            Index:x.Index,
            ToolValue:x.ToolValue,
            value:x.value,
            Sort:x.Sort
        }
    })
    JsonData.Clons =Items.Clone.Items.Clons.map(x=>{
        return {
            Index:x.Index,
            ToolValue:x.ToolValue,
            value:x.value,
            menuindex:x.menuindex
        }
    })
    let _data = JSON.stringify(JsonData)
    var n = window.open('','')
    const pre = document.createElement('pre')
    pre.innerText=_data
    n.document.body.appendChild(pre)
    success(JsonData)
}

const GetPrintInit = (state)=> {
    return new Promise((resolve)=>{
    
        let hstyle= '<style>'
        hstyle+='@page {'
        hstyle+='size: '+state.Print.PageSize+ ' '
        hstyle+=state.Print.PageType=='Dikey'?'landscape':'portrait' +';'
        hstyle+='padding:0;margin:0cm;}</style>'
        let clnode = $(state.UI.DROPID)[0].cloneNode(true)
        clnode.removeAttribute('id')
        let _div = null
        if(state.Print.PageCopy>1){
            _div=document.createElement('div')
            _div.style.display='flex'
            if(state.Print.CopyDirection=='Yanyana'){
                _div.style.flexDirection='row'
            }else{
                _div.style.flexDirection='column'
            }
            for (let i = 0; i < parseInt(state.Print.PageCopy); i++) {
                const cl2 =clnode.cloneNode(true)
                cl2.style.position='absolute'
                if(state.Print.CopyDirection=='Yanyana'){
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
          
            // var myWindow = window.open("", "MsgWindow")
            // myWindow.document.write(_div.innerHTML)
            $(_div).printThis({
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
        }else{
            $(clnode).printThis({
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
        }
      

        
   
         resolve()
    })
}
export default GetPrintInit