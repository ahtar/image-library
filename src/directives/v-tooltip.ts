/*eslint-disable */
//https://github.com/vuejs/vue/issues/6385#issuecomment-1024312396

/*import { Directive, DirectiveBinding } from 'vue'

//https://github.com/microsoft/TypeScript/pull/44512
interface HTMLElementDirective extends HTMLElement {
    [key: symbol]: any
}*/

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
            /**
             * создается новый родительский div, который добавляется к родителю el.
             * el удаляется из прежнего родительского элемента и добавляется в новый созданный div.
             * при наведении на el в div добавляется tooltip элемент, положение которого относительно
             * el зависит от модификатора директивы.
             * при отведении курсора с el из div удаляется вставленный tooltip элемент.
             */

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
