/*eslint-disable */
//https://github.com/vuejs/vue/issues/6385#issuecomment-1024312396

/*import { Directive, DirectiveBinding } from 'vue'

//https://github.com/microsoft/TypeScript/pull/44512
interface HTMLElementDirective extends HTMLElement {
    [key: symbol]: any
}

*/

const tooltip = () => {
    //символы для сохранения данных в элементе
    const tooltip = Symbol();
    const timerHandle = Symbol();
    const enterCallback = Symbol();
    const leaveCallback = Symbol();
    const rendered = Symbol();

    //смена стиля отображения tooltip элемента
    function changeStyle(el: any, binding: any) {
        const tooltipRect = el[tooltip].getBoundingClientRect();
        const targetRect = el.getBoundingClientRect();

        //Если никакой модификатор не указан, то tooltip отображается
        //в верхнем правом углу относительно el
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

        //автоопределение положения tooltip
        if (binding.modifiers?.auto) _auto();

        /**
         * --left - отступ указателя от левой стороный toolip
         * --path - path для придания указателю нужной формы
         * --bottom-outer отступ внутреннего слоя указателя от нижней границы tooltip
         * --bottom-inner отступ внешнего слоя указателя от нижней границы tooltip
         */

        function _left() {
            el[tooltip].style.setProperty(
                '--left',
                tooltipRect.width - 17 + 'px'
            );
            el[tooltip].style.left =
                -tooltipRect.width + targetRect.width * 0.2 + 'px';
        }

        function _right() {
            el[tooltip].style.setProperty('--left', '4px');
            el[tooltip].style.left =
                targetRect.width - targetRect.width * 0.2 + 'px';
        }

        function _middle() {
            el[tooltip].style.setProperty(
                '--left',
                tooltipRect.width / 2 - 6 + 'px'
            );
            const diff = targetRect.width - tooltipRect.width;
            el[tooltip].style.left = diff / 2 + 'px';
        }

        function _top() {
            el[tooltip].style.top = -tooltipRect.height - 13 + 'px';
        }

        function _bottom() {
            el[tooltip].style.top = targetRect.height + 13 + 'px';
            el[tooltip].style.setProperty(
                '--bottom-outer',
                tooltipRect.height - 2 + 'px'
            );
            el[tooltip].style.setProperty(
                '--bottom-inner',
                tooltipRect.height - 2 + 'px'
            );
            el[tooltip].style.setProperty(
                '--path',
                'polygon(50% 0, 100% 100%, 0 100%)'
            );
        }

        function _auto() {
            const tooltipRect: DOMRect = el[tooltip].getBoundingClientRect();

            //4vh от верхнего края экрана
            const topOffScreen = tooltipRect.top <= window.innerHeight * 0.04;
            const rightOffScreen =
                tooltipRect.right >=
                (window.innerWidth || document.documentElement.clientWidth);

            if (topOffScreen) _bottom();
            if (rightOffScreen) _left();
        }
    }

    return {
        mounted: (el: any, binding: any) => {
            el.style.position = 'relative';
            //tooltip элемент
            el[tooltip] = document.createElement('div');
            el[tooltip].innerHTML = `<p>${binding.value}</p>`;
            el[tooltip].style.position = 'absolute';
            el[tooltip].style.zIndex = 10;
            el[tooltip].style.fontSize = '1rem';
            el[tooltip].style.opacity = '0';
            el[tooltip].style.transition = 'transition: opacity 0.3 ease-out';
            el[tooltip].className = 'tooltip';

            //mouseenter callback
            el[enterCallback] = () => {
                el[timerHandle] = setTimeout(() => {
                    el[rendered] = true;
                    el.appendChild(el[tooltip]);
                    changeStyle(el, binding);
                    el[tooltip].style.opacity = '1';
                }, 800);
            };
            //mouseleave callback
            el[leaveCallback] = () => {
                if (el[rendered]) {
                    el[tooltip].style.opacity = '0';
                    setTimeout(() => {
                        el.removeChild(el[tooltip]);
                    }, 350);
                }
                clearTimeout(el[timerHandle]);
                el[rendered] = false;
            };

            el.addEventListener('mouseenter', el[enterCallback]);
            el.addEventListener('mouseleave', el[leaveCallback]);
        },
        unmounted: (el: any, binding: any) => {
            el.removeEventListener('mouseenter', el[enterCallback]);
            el.removeEventListener('mouseleave', el[leaveCallback]);
        },
        beforeUpdate: (el: any, binding: any) => {
            el[tooltip].innerHTML = `<p>${binding.value}</p>`;
        },
    } /*as Directive<HTMLElementDirective, DirectiveBinding>*/;
};

export default tooltip;
