function execute(data, componentHTML, style) {
    componentHTML = componentHTML.replace(/{{src}}/g, style['src']);
    componentHTML = componentHTML.replace(/{{class}}/g, style['class']);
    componentHTML = componentHTML.replace(/{{width}}/g, style['width'] ?? '100%');
    return componentHTML;
}