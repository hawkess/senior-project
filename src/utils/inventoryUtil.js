const { Inventory, InvItem, ItemDict, Item } = require('../classes/itemClasses');

module.exports = {
    filterInventory: (inv, itemdict) => {
        let filtereditems = [];
        let tempinv = new Inventory();
        let tempdict = new ItemDict();
        Object.assign(tempdict, wikidata);
        let items = tempdict.getItems();
        Object.assign(tempinv, inv);
        tempinv.getItems().forEach((temp) => {
            let item = new InvItem();
            Object.assign(item, temp);
            if (items.hasOwnProperty(item.getTypeline())) {
                let tempitem = new Item();
                Object.assign(tempitem, items[item.getTypeline()]);
                item.setMaxStack(tempitem.getStackSize());
                filtereditems.push(item);
            }
        });
        return new Inventory({ _items: filtereditems });
    }
};