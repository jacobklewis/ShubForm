function execute(data, componentHTML, style) {
    componentHTML = componentHTML.replace(/{{text}}/g, data[0]);
    componentHTML = componentHTML.replace(/{{class}}/g, style['class']);
    return componentHTML;
}