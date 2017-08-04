// 截字点点点
// 参数 
// 1. toggle 默认为 false，是否可以收起
// 2. lines 默认为 2，几行点点点
// 示例
// <p v-line-clamp="{ toggle: true, lines: 5 }">xxxxx</p>

const line = 2
Vue.directive('line-clamp', {
    bind(el, binding) {
        el.style.webkitLineClamp = binding.value.lines || line
    },
    inserted(el, binding) {
        setTimeout(() => {
            const toggle = binding.value.toggle
            const $up = el.querySelector('.ff-top-arr')
            const $down = el.querySelector('.ff-bottom-arr')
            if (el.offsetHeight < el.scrollHeight) {
                $down.style.display = 'inline-block'
                el.addEventListener('click', () => {
                    if (toggle && el.style.webkitLineClamp != (binding.value.lines || line)) {
                        $down.style.display = 'inline-block'
                        $up.style.display = 'none'
                        el.style.webkitLineClamp = binding.value.lines || line
                    } else {
                        $down.style.display = 'none'
                        toggle && ( $up.style.display = 'inline-block')
                        el.style.webkitLineClamp = 'inherit'
                    }
                })
            } else {
                $up.style.display = 'none'
                $down.style.display = 'none'
            }
        }, 500)
    }
})