/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
$.fn.extend({
    ReloadPanel: function(options, e) {
        const { up, down, extclass, activeClass } = options
        let $children = $(this)
        for (let i = 0; i < $children.length; i++) {
            const v = $children[i]
            if (v != undefined) {
                if (e == undefined) {
                    let $v = $(v)
                    let $ul = $v.find('ul')
                    let $i = $(extclass, $v[0]).find('i')
                    if ($($v[0]).hasClass(activeClass)) {
                        $v.find('ul').css({ display: 'block' })
                        $i.addClass(up)
                        $i.removeClass(down)
                    } else {
                        $v.find('ul').css({ display: 'none' })
                        $i.removeClass(up).addClass(down)
                    }
                } else {
                    let $v = $(v)
                    let $i = $(extclass, $v).find('i')
                    if ($(v).hasClass(activeClass)) {
                        $v.removeClass(activeClass)
                        $v.find('ul').css({ display: 'none' })
                        $i.removeClass(up).addClass(down)
                    } else {
                        if (e == v) {
                            $v.addClass(activeClass)
                            $v.find('ul').css({ display: 'block' })
                            $i.removeClass(down).addClass(up)
                        } else {
                            $i.removeClass(up).addClass(down)
                        }
                    }
                }
            }
        }
    },
    PanelGroup: function(options) {
        let $t = $(this)
        $t.ReloadPanel(options)
        $t.find('h2').click(function(e) {
            let $el=$(e.currentTarget)
            let $ed=$el.parents('div.m-Tool')
            $t.ReloadPanel(options, $ed[0])
        })
    }
})
