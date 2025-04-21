function execute(data, componentHTML) {
    componentHTML = componentHTML.replace(/{{title}}/g, data[0]);
    // console.log("Jumbotron component executed:", componentHTML);
    return componentHTML;
}