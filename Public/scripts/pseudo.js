/**
 * analisar:
 *  @param str string a ser tratada
 *  Parametros de tratamento:
 *      - Retirar espaços, substituir por '«»'
 *      - Dividir str por cada '«»', transformar num vetor
 *      - Filtrar todos os ''/vazio do vetor
 */
let formatarConteudoEditor = (str) => {
    return str
        .replace(/(\s)/gm, '«»')
        .split('«»')
        .filter(a => a != '');
};

let main = () => {
    //window.editor é a referencia ao editor criado em ide-setup.js
    var conteudo = window.editor.getValue();

    console.log(formatarConteudoEditor(conteudo));
};