const test = true;

enum cssClasses {
    attributesDiv = "attributesDiv",
    attributeValueParagraph = "attributeValueParagraph",
    attributeNameParagraph = "attriubteNameParagraph",
    nodeDiv = "nodeDiv",
    attributeHeaderParagraph = "attributeHeaderParagraph",
    attributesTable = "attributesTable",
    attributesTableHeader = "attributesTableHeader",
    attributesTableCaption = "attributesTableCaption",
    attributesTd = "attributesTd",
    attributesTh = "attributesTh",
    colapseButton = "colapseButton",
    nodeHeaderDiv = "nodeHeaderDiv",
    nodeBodyDiv = "nodeBodyDiv"
}

document.getElementById('files')!.addEventListener("change", createGridForSelectedFile, false);

if(test){
    createAndFillGrid(readExampleFileAsString());
}

function createGridForSelectedFile(event: any){
    let files = event.target.files;
    let file: File = files[files.length - 1];
    let fileReader = new FileReader();
    fileReader.onload = function(event){
        let stringContent = fileReader.result;
        createAndFillGrid(stringContent as string);
        console.log("file: " +  stringContent);

    }
    fileReader.readAsText(file);
}

function createAndFillGrid(stringContent: string){
    let domParser = new DOMParser();
    let xmlDoc = domParser.parseFromString(stringContent, "text/xml") as Document;
    let root = xmlDoc.childNodes[0] as Element;
    let gridViewDiv = document.getElementById('gridViewDiv');
    if(gridViewDiv){
        createRecursiveTreeForNode(root, gridViewDiv);
    } else {
        console.error('HTMLElement with id \'gridViewDiv\' not found!')
    }
}

function createNodeDiv(node: Element, id: string): HTMLElement{
    let div: HTMLElement = ce('div', cssClasses.nodeDiv);
    let divForTitleButton = ce('div', cssClasses.nodeHeaderDiv);
    let divForContent = ce('div', cssClasses.nodeBodyDiv);
    let divForAttributeContent = createAttributesDiv(node);
    let titleButton = createTitleButton(node.tagName, divForContent);
    div.id = id;
    divForTitleButton.appendChild(titleButton);
    divForContent.id = 'divForContent';
    divForContent.style.display = 'none';
    divForContent.appendChild(divForAttributeContent);
    div.appendChild(divForTitleButton);
    div.appendChild(divForContent);
    return div;
}
function createTitleButton(title: string, collapseElement: HTMLElement) : HTMLButtonElement {
    let titleButton = ce('button', cssClasses.colapseButton, title) as HTMLButtonElement;
    titleButton.onclick = function() {
        titleButton.classList.toggle("active");
        if(collapseElement.style.display === 'none'){
            collapseElement.style.display = 'block';
        } else {
            collapseElement.style.display = 'none';
        }
    }; 
    return titleButton;
}

function createAttributesDiv(node: Element): HTMLElement{
    let attributesDiv: HTMLElement = ce('DIV', cssClasses.attributesDiv);
    attributesDiv.id = node.id + "_attributes";
   if(node.attributes.length > 0){
        let attributesTable = createAttributesTable(node);
        attributesDiv.appendChild(attributesTable);
    }
    return attributesDiv;
}

function createAttributesTable(node: Element){
    let table = ce('table', cssClasses.attributesTable);
    let tableCaption = ce('caption', cssClasses.attributesTableCaption, 'Attributes');
    let tableRowForHead = ce('tr');
    let tableRowHeadName = ce('th', cssClasses.attributesTh);
    let tableRowHeadValue = ce('th', cssClasses.attributesTh);
    let tableRowHeadNameP = ce('p', cssClasses.attributeHeaderParagraph, 'Name');
    let tableRowHeadValueP = ce('p', cssClasses.attributeHeaderParagraph, 'Value');

    tableRowHeadName.appendChild(tableRowHeadNameP);
    tableRowHeadValue.appendChild(tableRowHeadValueP);
    tableRowForHead.appendChild(tableRowHeadName);
    tableRowForHead.appendChild(tableRowHeadValue);
    table.appendChild(tableCaption);
    table.appendChild(tableRowForHead);
    for(var i = 0; i <= node.attributes.length; i++){
        if(node.attributes[i]){
            let tableRowForAttribute = ce('tr');
            let tableDForName = ce('td', cssClasses.attributesTd);
            let tableDForValue = ce('td', cssClasses.attributesTd);
            let attributeNameParagraph = ce('p', cssClasses.attributeNameParagraph, node.attributes[i].name);
            let attributeValueParagraph = ce('p', cssClasses.attributeValueParagraph, node.attributes[i].value);
            
            tableDForName.appendChild(attributeNameParagraph);
            tableDForValue.appendChild(attributeValueParagraph);
            tableRowForAttribute.appendChild(tableDForName);
            tableRowForAttribute.appendChild(tableDForValue);
            table.appendChild(tableRowForAttribute);
        }
    }

    return table;
}

function createRecursiveTreeForNode(node: Node, currentDiv: HTMLElement){
    if(node && node instanceof Element){
        let createdDiv: HTMLElement = createNodeDiv(node, node.tagName);
        for(let i = 0; i < currentDiv.children.length; i++){
            if(currentDiv.children[i].getAttribute('id') === 'divForContent'){
                currentDiv.children[i].appendChild(createdDiv);
            }
        }
        node.childNodes.forEach( childNode => {
            createRecursiveTreeForNode(childNode, createdDiv);
        });
    }

}

/**
 * 
 * @param elementName the name of the html element for creation via document.createElement(elementName)
 * @param className the css class name
 * @param innerHtml the inner html content
 * @param childHtmlElement an html element that will be appended as child
 * @returns the created html element
 */
function ce(elementName: string, className?: string, innerHtml?: string, childHtmlElement?: HTMLElement): HTMLElement{
    let element = document.createElement(elementName);
    if(className){
        element.className = className;
    }
    if(innerHtml){
        element.innerHTML = innerHtml;
    }
    if(childHtmlElement){
        element.appendChild(childHtmlElement);
    }
    return element;
}

function readExampleFileAsString(): string{
    return '<catalog> <book id="bk101" meta="meta123" ref="http://123.de"> <author ref="http://author.de" id="test111">Gambardella, Matthew</author> <title>XML Developers Guide</title> <genre>Computer</genre> <price>44.95</price> <publish_date>2000-10-01</publish_date> <description>An in-depth look at creating applications with XML.</description> </book> <book id="bk102"> <author>Ralls, Kim</author> <title>Midnight Rain</title> <genre>Fantasy</genre> <price>5.95</price> <publish_date>2000-12-16</publish_date> <description>A former architect battles corporate zombies, an evil sorceress, and her own childhood to become queen of the world.</description> </book> <book id="bk103"> <author>Corets, Eva</author> <title>Maeve Ascendant</title> <genre>Fantasy</genre> <price>5.95</price> <publish_date>2000-11-17</publish_date> <description>After the collapse of a nanotechnology society in England, the young survivors lay the foundation for a new society.</description> </book> <book id="bk104"> <author>Corets, Eva</author> <title>Oberons Legacy</title> <genre>Fantasy</genre> <price>5.95</price> <publish_date>2001-03-10</publish_date> <description>In post-apocalypse England, the mysterious agent known only as Oberon helps to create a new life for the inhabitants of London. Sequel to Maeve Ascendant.</description> </book> <book id="bk105"> <author>Corets, Eva</author> <title>The Sundered Grail</title> <genre>Fantasy</genre> <price>5.95</price> <publish_date>2001-09-10</publish_date> <description>The two daughters of Maeve, half-sisters, battle one another for control of England. Sequel to Oberons Legacy.</description> </book> <book id="bk106"> <author>Randall, Cynthia</author> <title>Lover Birds</title> <genre>Romance</genre> <price>4.95</price> <publish_date>2000-09-02</publish_date> <description>When Carla meets Paul at an ornithology conference, tempers fly as feathers get ruffled.</description> </book> <book id="bk107"> <author>Thurman, Paula</author> <title>Splish Splash</title> <genre>Romance</genre> <price>4.95</price> <publish_date>2000-11-02</publish_date> <description>A deep sea diver finds true love twenty thousand leagues beneath the sea.</description> </book> <book id="bk108"> <author>Knorr, Stefan</author> <title>Creepy Crawlies</title> <genre>Horror</genre> <price>4.95</price> <publish_date>2000-12-06</publish_date> <description>An anthology of horror stories about roaches, centipedes, scorpions and other insects.</description> </book> <book id="bk109"> <author>Kress, Peter</author> <title>Paradox Lost</title> <genre>Science Fiction</genre> <price>6.95</price> <publish_date>2000-11-02</publish_date> <description>After an inadvertant trip through a Heisenberg Uncertainty Device, James Salway discovers the problems of being quantum.</description> </book> <book id="bk110"> <author>OBrien, Tim</author> <title>Microsoft .NET: The Programming Bible</title> <genre>Computer</genre> <price>36.95</price> <publish_date>2000-12-09</publish_date> <description>Microsoft\'s .NET initiative is explored in detail in this deep programmer\'s reference.</description> </book> <book id="bk111"> <author>O\'Brien, Tim</author> <title>MSXML3: A Comprehensive Guide</title> <genre>Computer</genre> <price>36.95</price> <publish_date>2000-12-01</publish_date> <description>The Microsoft MSXML3 parser is covered in detail, with attention to XML DOM interfaces, XSLT processing, SAX and more.</description> </book> <book id="bk112"> <author>Galos, Mike</author> <title>Visual Studio 7: A Comprehensive Guide</title> <genre>Computer</genre> <price>49.95</price> <publish_date>2001-04-16</publish_date> <description>Microsoft Visual Studio 7 is explored in depth, looking at how Visual Basic, Visual C++, C#, and ASP+ are integrated into a comprehensive development environment.</description> </book> </catalog>'
}
