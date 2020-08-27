'use strict';

let parse = (str) => {
    return str.value
        .replace(/\s/gm, '«»')
        .split('«»')
        .filter(a => a != '');
};

let main = (x) => {
    const ide = document.getElementById(x);

    let content = parse(ide);

    console.log(content);
};