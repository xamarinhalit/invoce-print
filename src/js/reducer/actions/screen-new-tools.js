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

const GetPrintInit = (state)=> {
    return new Promise((resolve)=>{
        const Clons =state.Clone.Items.Clons
        // CloneType=> 'Field','Table','TableField,
        const CloneType = state.Clone.Type









    })
}
export default GetPrintInit