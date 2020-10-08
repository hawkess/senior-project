class InvItem {
    constructor(item = { name: '', typeLine: '', stackSize: '' }) {
        this._name = item.name;
        this._typeline = item.typeLine;
        this._currstack = item.stackSize;
        this._maxstack = 0;
    }

    getCurrStack() {
        return this._currstack || 0;
    }

    getName() {
        return this._name || '';
    }

    getTypeline() {
        return this._typeline || '';
    }

    getMaxStack() {
        return this._maxstack || 0;
    }

    setMaxStack(stacksize) {
        this._maxstack = stacksize;
    }
}

class Inventory {
    constructor(itemJSON = { items: [new InvItem()] }) {
        this._items = itemJSON.hasOwnProperty('items') ? itemJSON.items.map(item => {
            return new InvItem(item)
        }) : itemJSON;
    }

    getItems() {
        return this._items || [new InvItem()];
    }
}

class Item {
    constructor(item = { title: { name: '', tags: '', 'stack size': 0 } }) {
        if (item.hasOwnProperty('title')) {
            this._name = item.title.name || '';
            this._tags = item.title.tags || '';
            this._stacksize = item.title['stack size'] || 0;
        }
        else {
            this._name = item.name || '';
            this._tags = item.tags || '';
            this._stacksize = item.stacksize || 0;
        }
    }

    getName() {
        return this._name || '';
    }

    getTags() {
        return this._tags || [];
    }

    getStackSize() {
        return this._stacksize || 0;
    }
}

class ItemDict {
    constructor(itemJSON = {
        "cargoquery": [
            {
                "title": {
                    "class id": '',
                    "name": '',
                    "tags": '',
                    "stack size": ''
                }
            }
        ]
    }) {
        this._items = {};
        if (itemJSON.hasOwnProperty('cargoquery')) {
            ItemDict.trimData(itemJSON).forEach(item => {
                this._items[item.title.name] = new Item(item);
            });
        }
        else
            this._items = itemJSON;
    }

    getItems() {
        return this._items;
    }

    setItems(items) {
        this._items = items;
    }

    static localRead() {
        let items = new ItemDict();
        return localStorage.getItem('itemdict') != null ? Object.assign(items, JSON.parse(localStorage.getItem('itemdict'))) : items;
    }

    static localWrite(items) {
        localStorage.setItem('itemdict', JSON.stringify(items));
    }

    static trimData(itemJSON) {
        return itemJSON.cargoquery;
    }

    isInit() {
        return this._items.size > 1;
    }
}

module.exports.InvItem = InvItem;
module.exports.Inventory = Inventory;
module.exports.Item = Item;
module.exports.ItemDict = ItemDict;
