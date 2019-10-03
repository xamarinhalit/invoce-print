
export const fn ={
    PixeltoPoint: function(Pixel) {
        return (parseFloat(Pixel) / 1.33).toFixed(0)
    },
    GetRemSize: function() {
        let size = getComputedStyle(document.documentElement).fontSize
        if (size != undefined) {
            size = size.replace('px', '')
            size = parseFloat(size)
            return size
        } else {
            return 16
        }
    },
    EmtoPixel: function(point) {
        let size = getComputedStyle(document.documentElement).fontSize
        if (size != undefined) {
            size = size.replace('px', '')
            size = parseFloat(size)
            if (size < 11) size = 16
        } else {
            size = 16
        }
        return (parseFloat(point) * size).toFixed(0)
    },
    PixeltoCm: function(Pixel) {
        return (parseFloat(Pixel) / 32).toFixed(2)
    },
    CmtoPixel: function(Cm) {
        return (parseFloat(Cm) * 32).toFixed(4)
    },
    vwTOpx: function(value) {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            // eslint-disable-next-line no-unused-vars
            y = w.innerHeight || e.clientHeight || g.clientHeight
  
        var result = (x * value) / 100
        return result
    },
  
    vhTOpx: function(value) {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            // eslint-disable-next-line no-unused-vars
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight
  
        var result = (y * value) / 100
        return result
    },
  
    pxTOvw: function(value) {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            // eslint-disable-next-line no-unused-vars
            y = w.innerHeight || e.clientHeight || g.clientHeight
  
        var result = (100 * value) / x
        return result
    },
  
    pxTOvh: function(value) {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            // eslint-disable-next-line no-unused-vars
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight
  
        var result = (100 * value) / y
        return result
    }
}