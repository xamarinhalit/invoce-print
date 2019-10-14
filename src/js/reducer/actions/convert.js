import moment from 'moment'

const f =[
    {
        'TableKey': 'VatWithholdingRate',
        'ItemKey': 'VatWithholdingRate',
        'ItemTitle': 'Tevkifat Oranı',
        'ItemValue': '3',
        'Icon': 'fa fa-arrows-v',
        'Width': '120',
        'Height': '25',
        'ItemType': 'Field',
        'Format': 'N2',
        'Style': ''
    },
    {
        'Index': 3,
        'ToolValue': 'Fatura Bilgileri',
        'value': {
            'TableKey': 'InvoiceDate',
            'ItemKey': 'InvoiceDate',
            'ItemTitle': 'Fatura Tarihi',
            'ItemValue': '22.01.2017',
            'Icon': 'fa fa-calendar',
            'Width': '150',
            'Height': '35',
            'ItemType': 'Field',
            'Format': 'dd.MM.yyyy',
            'Style': ''
        }
    },
    {
        'Index': 4,
        'ToolValue': 'Fatura Bilgileri',
        'value': {
            'TableKey': 'PaymentDate',
            'ItemKey': 'PaymentDate',
            'ItemTitle': 'Ödeme Tarihi',
            'ItemValue': '22.07.2017 17:45',
            'Icon': 'fa fa-calendar',
            'Width': '150',
            'Height': '30',
            'ItemType': 'Field',
            'Format': 'dd.MM.yyyy HH:mm',
            'Style': ''
        }
    },
    {
        'Index': 5,
        'ToolValue': 'Fatura Bilgileri',
        'value': {
            'TableKey': 'InvoiceTime',
            'ItemKey': 'InvoiceTime',
            'ItemTitle': 'Fatura Saati',
            'ItemValue': '12:30',
            'Icon': 'fa fa-clock-o',
            'Width': '100',
            'Height': '35',
            'ItemType': 'Field',
            'Format': 'HH:mm'

        }
    },
    {
        'Index': 14,
        'ToolValue': 'Alt Toplamlar',
        'value': {
            'TableKey': 'GrossTotal',
            'ItemKey': 'GrossTotal',
            'ItemTitle': 'Alt Toplam',
            'ItemValue': '100,00',
            'Icon': 'fa fa-money',
            'Width': '80',
            'Height': '20',
            'ItemType': 'Field',
            'Format': '0,00',
            'Style': ''
        }
    },
    {
        'Index': 17,
        'ToolValue': 'Alt Toplamlar',
        'value': {
            'TableKey': 'InvoiceTaxRates',
            'ItemKey': 'TaxRate',
            'ItemTitle': 'Kdv Oranı',
            'ItemValue': '%18',
            'Icon': 'fa fa-arrows-v',
            'Width': '20',
            'Height': '20',
            'ItemType': 'TableField',
            'Format': 'fa fa-money',
            'Style': {
                'font-size': '10pt',
                'font-style': 'normal',
                'font-weight': 'normal',
                'width': '69.5667px',
                'height': '20px'
            }
        }
    },
    {
        'Index': 29,
        'ToolValue': 'Ürün bilgisi',
        'value': {
            'TableKey': 'InvoiceMovements',
            'ItemKey': 'UnitName',
            'ItemTitle': 'Birim',
            'ItemValue': 'Adet',
            'Icon': 'fa fa-arrows-v',
            'Width': '100',
            'Height': '50',
            'ItemType': 'TableField',
            'Format': 'Adet',
            'Style': ''
        }
    },
]



export const CalcLeftTop = (uioffset ,mainoffset)=>{
    const { left: uleft, top: utop } =uioffset
    const { left: mleft, top: mtop } = mainoffset
    let left = uleft - mleft
    let top = utop - mtop
    if (top < 0) top = 0
    if (left < 0) left = 0
    return {
        left,top
    }
}

export const GetFormat =(value,format,isTest =true)=>{
    if(isTest==false){
        switch (value) {
        case '0,00':
                
            break
        case 'Adet':
            break
        case 'fa fa-money':
            break
        case 'N2':
            break
        default:
            return moment(value,format)
        }
    }
    return value
}

export const styleToObject = (element,_root=null)=>{
    const out={}
    const elementStyle = element.style
    for (const prop of elementStyle) {
        if(prop!=undefined){
            const el =elementStyle[prop]
            out[prop]=el
        }
    }
    return out
}
export const stylePxToViewPortObject = (element,$root)=>{
    return new Promise((resolve)=>{
        const out={}
        const elementStyle = element.style
        for (const prop of elementStyle) {
            if(prop!=undefined){
                const el =elementStyle[prop]
                switch (prop) {
                case 'top':
                    out[prop]=PixelTo($root,el,'vh')
                    break
                case 'height':
                    out[prop]=PixelTo($root,el,'vh')
                    break
                case 'width' :
                    out[prop]=PixelTo($root,el,'vw')
                    break
                case 'left' :
                    out[prop]=PixelTo($root,el,'vw')
                    break
                default:
                    out[prop]=el
                    break
                }
            }
        }
        resolve(out)
    })
}

const PixelTo = ($root,pixel,types)=>{
    let pix  = pixel.replace('px','')
    let size
    if(pix==0)
        return 0 + types
    switch (types) {
    case 'vh':
        return (pix/$root.clientHeight*100).toFixed(4) + 'vh'
    case 'vw':
        return (pix/$root.clientWidth*100).toFixed(4) + 'vw'
    case 'em':
        size = getComputedStyle($root).fontSize
        if (size != undefined) {
            size = size.replace('px', '')
            size = parseFloat(size)
            if (size < 11) size = 16
        } else {
            size = 16
        }
        return (pix/ size) + 'em'
    default:
        break
    }

}

const ToPixel = ($root,pixel,types)=>{
    let pix  = pixel.replace(types,'')
    let size
    if(pix==0)
        return 0 + 'px'
    switch (types) {
    case 'vh':
        return (pix*$root.clientHeight/100).toFixed(2) + 'px'
    case 'vw':
        return (pix*$root.clientWidth/100).toFixed(2) + 'px'
    case 'em':
        size = getComputedStyle($root).fontSize
        if (size != undefined) {
            size = size.replace('px', '')
            size = parseFloat(size)
            if (size < 11) size = 16
        } else {
            size = 16
        }
        return (pix* size) + 'px'
    default:
        break
    }

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