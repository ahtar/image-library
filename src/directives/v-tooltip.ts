
//https://github.com/vuejs/vue/issues/6385#issuecomment-1024312396
const tooltip = () => {
    const tooltip = Symbol();
    const timerHandle = Symbol();
    const enterCallback = Symbol();
    const leaveCallback = Symbol();
    const rendered = Symbol();

    function changeStyle(el: any, binding: any) {
        const tooltipRect = el[tooltip].getBoundingClientRect();
        const targetRect = el.getBoundingClientRect();

        //default вверхний правый угол
        _top();
        _right();

        //левая сторона
        if (binding.modifiers?.left) _left();

        //правая сторона
        if (binding.modifiers?.right) _right();

        //центр
        if (binding.modifiers?.middle) _middle();

        //низ
        if (binding.modifiers?.bottom) _bottom();

        //автоопределение
        if (binding.modifiers?.auto) _auto();

        function _left() {
            el[tooltip].style.setProperty('--left', tooltipRect.width - 17 + 'px');
            el[tooltip].style.left = -tooltipRect.width + (targetRect.width * 0.2) + 'px';
        }

        function _right() {
            el[tooltip].style.setProperty('--left', '4px');
            el[tooltip].style.left = targetRect.width - targetRect.width * 0.2 + 'px';
        }

        function _middle() {
            el[tooltip].style.setProperty('--left', (tooltipRect.width / 2) - 6 + 'px');
            const diff = targetRect.width - tooltipRect.width;
            el[tooltip].style.left = diff / 2 + 'px';
        }

        function _top() {
            el[tooltip].style.top = -tooltipRect.height - 13 + 'px';
        }

        function _bottom() {
            el[tooltip].style.top = targetRect.height + 13 + 'px';
            el[tooltip].style.setProperty('--bottom-outer', tooltipRect.height - 2 + 'px');
            el[tooltip].style.setProperty('--bottom-inner', tooltipRect.height - 2 + 'px');
            el[tooltip].style.setProperty('--path', 'polygon(50% 0, 100% 100%, 0 100%)');
        }

        function _auto() {
            const tooltipRect: DOMRect = el[tooltip].getBoundingClientRect();

            const topOffScreen = tooltipRect.top <= 0;
            const rightOffScreen = tooltipRect.right >= (window.innerWidth || document.documentElement.clientWidth);

            if (topOffScreen) _bottom();
            if (rightOffScreen) _left();
        }
    }

    return {
        mounted: (el: any, binding: any) => {
            //parent
            const parent = document.createElement('div');
            parent.style.position = 'relative';
            parent.style.display = 'inline-block';

            //tooltip
            el[tooltip] = document.createElement('div');
            el[tooltip].innerHTML = `<p>${binding.value}</p>`;
            el[tooltip].style.position = 'absolute';
            el[tooltip].style.zIndex = 10;
            el[tooltip].className = 'tooltip';

            //замена div
            el.parentNode!.insertBefore(parent, el);
            el.parentNode!.removeChild(el);
            parent.appendChild(el);

            //mouseenter callback
            el[enterCallback] = () => {

                el[timerHandle] = setTimeout(() => {
                    el[rendered] = true;
                    parent.appendChild(el[tooltip]);
                    changeStyle(el, binding);
                }, 800);
            };

            //mouseleave callback
            el[leaveCallback] = () => {
                if (el[rendered]) parent.removeChild(el[tooltip]);
                clearTimeout(el[timerHandle]);
                el[rendered] = false;
            }

            el.addEventListener('mouseenter', el[enterCallback]);
            el.addEventListener('mouseleave', el[leaveCallback]);

        },
        unmounted: (el: any, binding: any) => {
            el.removeEventListener('mouseenter', el[enterCallback]);
            el.removeEventListener('mouseleave', el[leaveCallback]);
        },
    }
}



export default tooltip;