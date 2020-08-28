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
        keywords: [
            'Funcao', 'por', 'falsso', 'enquanto', 'verdade',
            'receber', 'enviar', 'devolver', 'se', 'senao',
        ],

        typeKeywords: [
            'booleano', 'inteiro', 'real', 'vetor', 'string', 'caracter'
        ],

        operators: [
            '=', '>', '<', '!', '', '<=', '>=', 'diferente',
            'e', 'ou', '+', '-', '*', '/', ':'
        ],

        symbols: /[=><!~?:&|+\-*\/\^%]+/,

        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        tokenizer: {
            root: [
                // identifiers e keywords
                [/[a-z_$][\w$]*/, {
                    cases: {
                        '@typeKeywords': 'keyword',
                        '@keywords': 'keyword',
                        '@default': 'identifier'
                    }
                }],
                [/[A-Z][\w\$]*/, 'type.identifier'], // mostra bonito os nomes das classes 

                // espaço
                { include: '@whitespace' },

                // delimitadores e operadores
                [/[{}()\[\]]/, '@brackets'],
                [/[<>](?!@symbols)/, '@brackets'],
                [/@symbols/, {
                    cases: {
                        '@operators': 'operator',
                        '@default': ''
                    }
                }],

                // @ annotations.
                // As an example, we emit a debugging log message on these tokens.
                // Note: message are supressed during the first load -- change some lines to see them.
                [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],

                // numbers
                [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                [/\d+/, 'number'],

                // delimiter: after number because of .\d floats
                [/[;,.]/, 'delimiter'],

                // strings
                [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
                [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

                // characters
                [/'[^\\']'/, 'string'],
                [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
                [/'/, 'string.invalid']
            ],

            comment: [
                [/[^\/*]+/, 'comment'], //comentário
                [/\/\*/, 'comment', '@push'], // nested comment
                ["\\*/", 'comment', '@pop'],
                [/[\/*]/, 'comment']
            ],

            string: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
            ],

            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
            ],
        },
    });

    monaco.editor.defineTheme('PseudoTema', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'string', foreground: '056CF2' },
            { token: 'comment', foreground: '99ff33' },
            { token: 'number', foreground: '66ffff' },
            { token: 'delimiter', foreground: 'ffff00' },
            { token: 'identifier', foreground: 'e6ffe6' },
            { token: 'operator', foreground: 'ffa64d' },
        ]
    });

    /**
     *  FALTA O AUTOCOMPLETE
     */

    window.editor = monaco.editor.create(document.getElementById('container'), {
        //texto inicial do editor
        value: [
            '// Função x com saída',
            'Funcao x() {',
            '\tenviar("Olá Mundo");',
            '\tdevolver 0;',
            '}',
            '\n// Estrutura de decisão \'IF\'',
            'se 5 + 4 igual 9 {',
            '\tenviar(5+4);',
            '}'
        ].join('\n'),
        //a linguagem do Pseudo-PT
        language: 'PseudoPT',
        //Aspeto do editor
        theme: "PseudoTema",
        //Aparência do Texto
        fontSize: '20px',
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