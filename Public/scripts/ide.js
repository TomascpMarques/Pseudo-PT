'use strict';

let plrv_resrv = [
    'inteiro', 'Funcao', 'por',
    'FALSSO', 'VERDADE', 'real',
    'devolve', 'enquanto', 'vetor',
    'string', 'receber', 'enviar',
];

/**
 * analisar:
 *  @param str string a ser tratada
 *  Parametros de tratamento:
 *      - Retirar espaços, substituir por '«»'
 *      - Dividir str por cada '«»', transformar num vetor
 *      - Filtrar todos os ''/vazio do vetor
 */
let analisar = (str) => {
    return str.value
        .replace(/(\s)/gm, '«»')
        .split('«»')
        .filter(a => a != '');
};

let main = (x) => {
    //defalut = ideText se não se especificar o x
    x = 'ideText' || x
    const ide = document.getElementById(x);

    let conteudo = analisar(ide);

    console.log(conteudo);
    console.log(ide[1]);
};