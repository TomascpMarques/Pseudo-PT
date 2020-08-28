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
            'Funcao', 'por', 'falso', 'enquanto', 'verdade',
            'receber', 'enviar', 'devolver', 'se', 'senao',
        ],

        typeKeywords: [
            'booleano', 'inteiro', 'real', 'vetor', 'string', 'caracter'
        ],

        operators: [
            '=', '>', '<', '!', '', '<=', '>=', "diferente",
            'e', 'ou', '+', '-', '*', '/', '+=', '-=', '*=', '/='
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
                [/[A-Z][\w\$]*/, 'type.identifier'], // mostra os nomes das classes 

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

    /**
     * Tema PseudoPT, baseado no vs-dark, erda algumas características
     */
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

    monaco.languages.registerCompletionItemProvider('PseudoPT', {
        provideCompletionItems: () => {
            var sugestoes = [{
                    label: 'se',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: [
                        'se (${1:condição}) {',
                        '\t// código',
                        '}',
                    ].join('\n'),
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Estrutura de decisão:\n<se cond>\n\t-> <código>\n -> <fim>\nEquivalente ao IF clássico'
                },
                {
                    label: 'se/senao',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: [
                        'se (${1:condição}) {',
                        '\t// código se verdadeiro',
                        '\t${2:->}',
                        '} senao {',
                        '\t// código se falsso',
                        '\t${3:->}',
                        '}',
                    ].join('\n'),
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Estrutura de decisão:\n<se cond>\n\t-> <código>\n-> <senao>\n\t-> <código>\n -> <fim>\nEquivalente ao IF/ELSE clássico'
                },
                {
                    label: 'por',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: [
                        'por (${1:variável}, ${1:variável} < 10, ${2:maneira de iteração}) {',
                        '\t// código a executar em cada ciclo',
                        '\t${3:->}',
                        '}',
                    ].join('\n'),
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Cilco/Loop:\n<por -> var,cond,iter>\n\t-> <código> \n-> <fim>\nEquivalente ao ciclo FOR'
                },
                {
                    label: 'enquanto',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: [
                        'enquanto (${1:variável} != 25) {',
                        '\t// código enquanto a condição for verdadeira',
                        '\t${2:-> }',
                        '}',
                    ].join('\n'),
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Cilco/Loop:\n<enquanto -> cond>\n\t-> <código/iteração> \n-> <fim>\nEquivalente ao ciclo WHILE'
                },
                {
                    label: 'Func',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: [
                        'Func ${1:nome da função}(${2:paramêtros}) {',
                        '\t// Código da função //',
                        '\t${3:-> }',
                        '\tdevolver ${4:"valor a devolver"}',
                        '}'
                    ].join('\n'),
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Função:\n<funcção (param)>\n\t-> <código>\n-> <devolver valor>\n -> <fim>\nEquivalente a uma função clássica'
                },
                {
                    label: 'inteiro',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'inteiro ${1:variável} = ${2:valor}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Valor inteiro.\nExemplo: inteiro x = 5'
                },
                {
                    label: 'real',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'real ${1:variável} = ${2:valor}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Valor real.\nExemplo: real y = 34.234'
                },
                {
                    label: 'string',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'string ${1:variável} = "${2:valor}"',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Valor string/frase/palavra.\nExemplo: string i x = "PseudoPT"'
                },
                {
                    label: 'booleano',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'boolenao ${1:variável} = ${2:falsso/verdade}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Valor booleano.\nExemplo: booleano b = verdade'
                },
                {
                    label: 'enviar',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'enviar(${1:texto/variavel})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Função enviar.\nExemplo: enviar(x)'
                },
            ];
            return {
                suggestions: sugestoes
            };
        }
    });

    // O editor monaco vai ser o valor do objeto window.editor
    // Assim posso recuperar o seu conteúdo quando precisar;
    window.editor = monaco.editor.create(document.getElementById('container'), {
        //texto inicial do editor
        value: [
            '// Função x com saída //',
            'Func x()',
            '\tenviar("Olá Mundo");',
            '\tdevolver (0);',
            '',
            '\n// Estrutura de decisão \'IF\'//',
            'se (5 + 4 igual 9)',
            '\tenviar(5+4);',
        ].join('\n'),
        //a implementação do Pseudo-PT
        language: 'PseudoPT',
        //Aspeto do editor
        theme: "PseudoTema",
        //Aparência do Texto
        fontSize: '20px',
        fontWeight: 'bold',
    });
});