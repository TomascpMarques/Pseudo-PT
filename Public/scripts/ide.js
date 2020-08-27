'use strict';

//importar o modulo do monaco editor dos ficheiros
//especificar o path do modulo para a abreviação 'vs'
require.config({
    paths: {
        'vs': './scripts/node_modules/monaco-editor/min/vs'
    }
});

//Criar o editor monaco no browser
require(['vs/editor/editor.main'], function() {
    monaco.languages.register({ id: 'PseudoPT' });


    monaco.languages.setMonarchTokensProvider('PseudoPT', {
        tokenizer: {
            type

            operators: [
                '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
                '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
                '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
                '%=', '<<=', '>>=', '>>>='
            ],

            root: [

            ],
        }
    });

    window.editor = monaco.editor.create(document.getElementById('container'), {
        //texto inicial do editor
        value: [
            'function x() {',
            '\tconsole.log("Hello world!");',
            '}'
        ].join('\n'),
        //a linguagem do Pseudo-PT
        language: 'PseudoPT',
        //Aspeto do editor
        theme: "vs-dark",
        //Aparência do Texto
        fontSize: '18px',
        fontWeight: 'bold',
    });
});

/**
 * analisar:
 *  @param str string a ser tratada
 *  Parametros de tratamento:
 *      - Retirar espaços, substituir por '«»'
 *      - Dividir str por cada '«»', transformar num vetor
 *      - Filtrar todos os ''/vazio do vetor
 */
let analisar = (str) => {
    return str
        .replace(/(\s)/gm, '«»')
        .split('«»')
        .filter(a => a != '');
};

let main = () => {
    var conteudo = window.editor.getValue();

    console.log(analisar(conteudo));
};