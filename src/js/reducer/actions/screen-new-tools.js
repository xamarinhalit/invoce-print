/* eslint-disable no-undef */
import copyObject from './copy-object'
// const SetMenuToJson = (Menu)=>{
//     const obj = {}


// }
export const SetJsonData = (state,payload,success)=>{
    let Items =copyObject(state,true)
    let JsonData={}
    if(payload!=undefined && payload!=null && payload.data!=undefined && payload.data!=null){
        JsonData=payload.data
    }

    JsonData.Print = Items.Print
    let tablesinc =0
    const incTables= ()=>{
        tablesinc--
        return tablesinc
    }
    JsonData.Clons =Items.Clone.Items.Clons.map(x=>{
        return {
            id:x.id!=undefined?x.id:incTables(),
            ToolValue:x.ToolValue,
            value:x.value,
        }
    })
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