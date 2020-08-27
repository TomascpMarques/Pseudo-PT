'use strict';


/**
 * 
 * @param str string a ser tratada
 * Parametros de tratamento:
 *  - Retirar espaços, substituir por '«»'
 *  - Dividir str por cada '«»', transformar num vetor
 *  - Filtrar todos os ''/vazio do vetor
 */
let parse = (str) => {
    return str.value
        .replace(/(\s*)/gm, '«»')
        .split('«»')
        .filter(a => a != '');
};

let main = (x) => {
    //defalut = ideText se não se especificar o x
    x = 'ideText' || x
    const ide = document.getElementById(x);

    let content = parse(ide);

    console.log(content);
};