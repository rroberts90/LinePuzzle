

const freezeLinks = (node) =>{ 
    node.links.forEach(linkedNode =>{
        if(linkedNode.symbol === node.symbol){
            linkedNode.frozen++;
        }
    });

}

const unFreezeLinks = (node) =>{
    node.links.forEach(linkedNode =>{
        if(linkedNode.symbol === node.symbol){
            linkedNode.frozen--;
        }
    });
}

export {freezeLinks, unFreezeLinks};