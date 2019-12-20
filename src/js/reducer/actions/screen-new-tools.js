/* eslint-disable no-undef */
import copyObject from './copy-object'
import {CalcWidthHeight,cmToPixel} from './convert'
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
        let hstyle=`<style>
            @page {
                size:${state.Print.PageSize.toLowerCase()} ${state.Print.PageType=='Dikey'?'portrait':'landscape'};
                padding:0cm;
                margin:0cm;
            }
            body{
                margin:0;
                padding:0;
            }
        }</style>`
        let clnode = $(state.UI.DROPID)[0].cloneNode(true)
        clnode.removeAttribute('id')
        let _div = null
        if(state.Print.PageCopy>1){
            _div=document.createElement('div')
            _div.style.display='flex'
            _div.style.margin='0'
            _div.style.padding='0'
            let size =`${state.Print.PageSize.toLowerCase()} ${state.Print.PageType=='Dikey'?'portrait':'landscape'}`
            _div.style.size=size
            if(state.Print.PageType=='Dikey'){
                _div.style.width=Math.floor(cmToPixel(state.Print.PageWidth))+'px'
                _div.style.height=Math.floor(cmToPixel(state.Print.PageHeight))+'px'
                if(state.Print.CopyDirection=='Yanyana'){
                    _div.style.flexDirection='row'
                }else{
                    _div.style.flexDirection='column'
                }
            }else{
                _div.style.height=Math.floor(cmToPixel(state.Print.PageWidth))+'px'
                _div.style.width=Math.floor(cmToPixel(state.Print.PageHeight))+'px'
                if(state.Print.CopyDirection=='Yanyana'){
                    _div.style.flexDirection='row'
                }else{
                    _div.style.flexDirection='column'
                }
            }
            const {_width,_height} = CalcWidthHeight(state.Print)
            let cw ={
                width:'',
                height:''
            }
            cw.width = _width
            for (let i = 0; i < parseInt(state.Print.PageCopy); i++) {
                const cl2 =clnode.cloneNode(true)
                cl2.style.position='absolute'
                if(state.Print.CopyDirection=='Yanyana'){
                    if(state.Print.PageType=='Yatay'){
                        cw.height =_height-1
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.left= cw.width*i+'px'
                        cl2.style.top= '0px'
                    }else{
                        cw.height =_height
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.left=cw.width*i +'px'
                        cl2.style.top= '0px'
                    }
                }else{
                    if(state.Print.PageType=='Yatay'){
                        cw.height =_height
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
            $(_div.innerHTML).printThis({
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
            const {_width,_height} = CalcWidthHeight(state.Print)
            clnode.style.margin='0'
            clnode.style.padding='0'
            let size =`${state.Print.PageSize.toLowerCase()} ${state.Print.PageType=='Dikey'?'portrait':'landscape'}`
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