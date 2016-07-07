function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}

[].forEach.call(document.querySelectorAll('.article__header'), function(a){
    var b = null, P = 0;
    window.addEventListener('scroll', Ascroll, false);
    document.body.addEventListener('scroll', Ascroll, false);
    function Ascroll() {
        if (b == null) {
            var s = '';
            b = document.createElement('div');
            a.insertBefore(b, a.firstChild);
            var l = a.childNodes.length;
            for (var i = 1; i < l; i++) {
                b.appendChild(a.childNodes[1]);
            }
            b.style.width = '100%';
            a.style.height = b.getBoundingClientRect().height + 'px';
        }
        var Ra = a.getBoundingClientRect(),
            R = Math.round(Ra.top + b.getBoundingClientRect().height - a.parentNode.getBoundingClientRect().bottom + parseFloat(getComputedStyle(a.parentNode, '')));
        if ((Ra.top - P) <= 0) {
            if ((Ra.top - P) <= R) {
                b.classList.add('stop');
                b.classList.remove('sticky');
                b.style.top = - R +'px';
            } else {
                b.classList.add('sticky');
                b.classList.remove('stop');
                b.style.top = P + 'px';
            }
        } else {
            b.className = '';
            b.style.top = '';
        }
        window.addEventListener('resize', debounce(function() {
            a.children[0].style.width = getComputedStyle(a, '').width;
            a.style.height = a.children[0].getBoundingClientRect().height + 'px';
        }, 200), false);
    }
});
