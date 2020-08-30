/**
 *  @author Tomás Carruço Pedro Marques
 *  @license MIT Copyright (c) 2020 Tomás Carruço Pedro Marques
 */

/**
 *  formatarConteudoEditor()
 *  @param str string a ser tratada
 *  Parametros de tratamento:
 *      Substitui todos os '\t' por null's,
 *      depois separa por linhas, filtra todas as strings vazias
 *      e/ou que tenham null como valor, e depois ignora 
 *      todos os comentários que possam haver no editor
 */
//[A-z_$][\w$]*
let formatarConteudoEditor = (str) => {
    return str
        .replace(/\t/gm, '')
        .split(/^\s*$/gm)
        .map(a => a.split(/\n/gm))
        .map(a => a.filter(b => !(b.includes('//'))))
        .map(a => a.filter(b => b != ''));
};

let main = () => {
    //window.editor é a referencia ao editor criado em ide-setup.js
    var conteudo = window.editor.getValue();
    console.log(formatarConteudoEditor(conteudo));
    document.getElementById('output').value = conteudo;


};