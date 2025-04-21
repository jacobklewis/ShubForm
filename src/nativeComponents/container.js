function execute(data, componentHTML, style) {
    componentHTML = componentHTML.replace(/{{text}}/g, data.join(''));
    componentHTML = componentHTML.replace(/{{theme}}/g, style['theme']);
    return componentHTML;
}