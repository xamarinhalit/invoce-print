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