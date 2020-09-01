/**
 *  @author Tomás Carruço Pedro Marques
 *  @license MIT Copyright (c) 2020 Tomás Carruço Pedro Marques
 */

/**
 *  formatarConteudoEditor()
 *  @param str string a ser tratada
 *  Funcionamento:
 *      Retira as tabs, divide o conteudo em blocos de 'código' 
 *      (o separador de blocos é a linha vazia entre cada bloco do conteúdo)
 *      em cada elemento do novo vetor, pós .split(/^\s*$/gm), vai dividir cada linha 
 *      que tenha uma new-line, filtra cada elemento do vetor para retirar comentários
 *      e linhas vaizas. O resultado é um vetor de 'blocos de código' criados a partir 
 *      do conteúdo do editor, esse blocos são depois separados por linhas, 
 *      deixando no final só o código do PseudoPT
 */
let formatarConteudoEditor = (str) => {
    return str
        .replace(/\t/gm, '')
        .split(/^\s*$/gm)
        .map(a => a.split(/\n/gm))
        .map(a => a.filter(b => !(b.includes('//'))))
        .map(a => a.filter(b => b != ''));
};

/**
 * func_Process()
 * @param {array} arr 
 * Funcionamento:
 *      A função vai receber o conteudo formatado, através da formatarConteudoEditor().
 *      Vai usar regex para encontar o padrão de uma/mais função,
 *      e de seguida var retirar o conteúdo na forma de um objeto, com os seguintes param.
 *      ==> nome
 *      ==> parametros (da função)
 *      ==> corpo (conteúdo)
 *      ==> tipo do objeto (função)
 */
let func_Process = (arr) => {
    // array com os objetos (funções)
    var funcsConteudo = [];

    //iteração por cada bloco de conteúdo
    for (x in arr) {
        // se tiver 'Func' na string continua
        if (arr[x][0].includes('Func')) {
            // Verifica se é mesmo o início de uma função
            if (arr[x][0].match(/Func [a-zA-Z]{1,} \(([^]+)\)|$/gm)) {
                funcsConteudo.push({
                    nome: (arr[x][0].match(/ [a-zA-Z]{1,} /gm))
                        .toString()
                        .trim(),

                    //formata os parametros
                    //retira os '()' e separa os arg por ','
                    params: (arr[x][0].match(/ \(([^]+)\)|$/gm))
                        .toString()
                        .trim()
                        .slice(1, -2)
                        .split(/,/gm),

                    corpo: arr[x].slice(1, arr[x].length),
                    tipo: 'Função',
                });
            };
        };
    };
    return funcsConteudo;
};

let main = () => {
    //window.editor é a referencia ao editor criado em ide-setup.js
    var conteudo = formatarConteudoEditor(window.editor.getValue())
    console.log(conteudo);
    document.getElementById('output').value = conteudo;

    console.log('-> ', func_Process(conteudo));
};