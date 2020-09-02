/**
 *  @author Tomás Carruço Pedro Marques
 *  @license MIT Copyright (c) 2020 Tomás Carruço Pedro Marques.
 */

/**
 * @name formatarConteudoEditor()
 * @param str string a ser tratada
 * @returns {String} str/param
 * ===========================================================================================
 * @Funcionamento
 *      Retira as tabs, divide o conteudo em blocos de 'código' 
 *      (o separador de blocos é a linha vazia entre cada bloco do conteúdo)
 *      em cada elemento do novo vetor, pós .split(/^\s*$/gm), vai dividir cada linha 
 *      que tenha uma new-line, filtra cada elemento do vetor para retirar comentários
 *      e linhas vaizas. O resultado é um vetor de 'blocos de código' criados a partir 
 *      do conteúdo do editor, esse blocos são depois separados por linhas, 
 *      deixando no final só o código do PseudoPT.
 * ===========================================================================================
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
 * @name func_Process()
 * @param {Vetor 2D} arr
 * @returns {Vetor[Objeto/s]} funcsConteudo[]
 * =========================================================================================== 
 * @Funcionamento
 *      A função vai receber o conteudo formatado, através da formatarConteudoEditor().
 *      Vai usar regex para encontar o padrão de uma/mais função,
 *      e de seguida var retirar o conteúdo na forma de um objeto, com os seguintes param.
 *      ==> nome
 *      ==> parametros (da função)
 *      ==> corpo (conteúdo)
 *      ==> tipo do objeto (função)
 * ===========================================================================================
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


/**
 * @name variaveis_Process()
 * @param {Array} arr 
 * @returns {Object} variaveis{}
 * ===========================================================================================
 *  @Funcionamento
 *      Recebe o conteudo formatado, analisa cada bloco de código,
 *      linha a linha, e verifica se existem variáveis no código.
 *      Se existir uma variável na linha atual, retira o nome e valor, tendo em atençao
 *      as misturas que podem haver entre tipos númericos e strings (ex: 123(int) 12r3(str)),
 *      de seguida adicona esse conteúdo ao objeto 'variaveis{}' (valor de retorno),
 *      desta forma:
 *          ==> variaveis[varNome] = varValor;
 *      Desta maneira, o objeto agora tem uma propriedade x com valor y,
 *      e quando eu precisar dessa variável na execução do código PseudoPT, só tenho 
 *      de acessar esse objeto com a variável que eu quero, para obter o seu valor.
 * ===========================================================================================
 */
let variaveis_Process = (arr) => {
    // Contentor das variáveis
    var variaveis = {};

    for (j in arr) {
        for (x in arr[j]) {
            // Verifica se a linha é atribuição de valor a uma var
            if (arr[j][x].includes('inteiro')) {
                // Retira o nome da var com regex da linha
                var varNome = arr[j][x]
                    .match(/\s[a-zA-Z]{1,}/gm)
                    .toString()
                    .trim();

                //Retira o valor da var com regex da linha
                var varValor = arr[j][x]
                    .match(/(=)(\s|)[0-9|a-zA-Z]{1,}/gm)
                    .toString()
                    .slice(2);

                // Tenta converter o valor para um número real/inteiro
                // Se der, adiciona o valor númerico no objeto de retorno
                // Se não, (deu catch no NaN) introduz como string.
                try {
                    varValor = Number(varValor);
                    variaveis[varNome] = varValor;
                    console.log('VARIAVEL: ', typeof varValor, ' N ', varValor);
                } catch (NaN) {
                    variaveis[varNome] = varValor;
                    console.log('VARIAVEL: ', typeof varValor, ' S ', varValor);
                };
            };

            if (arr[j][x].includes('real')) {
                var varNome = arr[j][x]
                    .match(/\s[a-zA-Z]{1,}/gm)
                    .toString()
                    .trim();

                var varValor = arr[j][x]
                    .match(/[0-9]{1,}.[0-9]{1,}/gm)
                    .toString();

                try {
                    varValor = Number(varValor);
                    variaveis[varNome] = varValor;
                    console.log('VARIAVEL: ', typeof varValor, ' F ', varValor);
                } catch (NaN) {
                    variaveis[varNome] = varValor;
                    console.log('VARIAVEL: ', typeof varValor, ' S ', varValor);
                };
            };

            if (arr[j][x].includes('booleano')) {
                var varNome = arr[j][x]
                    .match(/\s[a-zA-Z]{1,}(\s{1,})/gm)
                    .toString()
                    .trim();

                var varValor = arr[j][x]
                    .match(/(verdade|falso)/gm)
                    .toString();

                // Traduz o falso/verdade do Pseudo para true/false
                if (varValor == 'verdade')
                    variaveis[varNome] = true;
                else
                    variaveis[varNome] = false;
            };

            if (arr[j][x].includes('string')) {
                var varNome = arr[j][x]
                    .match(/\s[a-zA-Z]{1,}/gm)
                    .toString()
                    .trim();

                var varValor = arr[j][x]
                    .match(/"[0-9|a-zA-Z]{1,}"/gm)
                    .toString()
                    .slice(1, -1);

                // Como o valor já é uma string, introduz logo o valor no objeto
                variaveis[varNome] = varValor;
            };
        };
    };
    return variaveis;
};

/**
 * @name criar_Call_StacK()
 * @param {Array} arr
 * @returns {Array} callStack[] 
 * ===========================================================================================
 *  @Funcionamento 
 *      Recebe um array 2d como input, e por cada elemento que não é uma função
 *      adiciona ao stack. Resumindo, só adiciona operações como ciclos, output, atribuição
 *      e chamada de funções, tudo o resto fica de fora deste stack.
 * ===========================================================================================
 */
let criar_Call_Stack = (arr) => {
    let callStack = [];

    // Só adiciona ao callStack se não for,
    // uma criação de uma Função, 
    // mas adicona se for chamada.
    for (x in arr)
        if (!(arr[x][0].includes('Func')))
            callStack.push(arr[x]);

    return callStack;
};

// var keyWords = {
//     enviar: (str) => {
//         str == str || '';
//         return str;
//     },
// };

// let chamar_Call_Stack = (callStack, funcoesProcess) => {
//     let funcoes = func_Process;
//     for (x in callStack) {

//     }
// };

let main = () => {
    var codigo_output = ' ';

    //window.editor é a referencia ao editor criado em ide-setup.js
    var conteudo = formatarConteudoEditor(window.editor.getValue());
    console.log(conteudo);

    let pseudoFuncs = func_Process(conteudo);
    console.log('-> Func-Geter', pseudoFuncs);

    let ordemLogica = criar_Call_Stack(conteudo);
    console.log('-> call_stack', ordemLogica);

    document.getElementById('output').value = ordemLogica;
};