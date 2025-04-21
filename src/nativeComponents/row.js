function execute(data, componentHTML, style) {
    // console.log("Executing row component with data:", data);
    let cols = "";
    const extraClasses = style["colClass"] ? " " + style["colClass"] : "";
    for (let i = 0; i < data.length; i++) {
        cols += "<div class='col" + extraClasses + "'>" + data[i] + "</div>";
    }
    componentHTML = componentHTML.replace(/{{cols}}/g, cols);
    return componentHTML;
}