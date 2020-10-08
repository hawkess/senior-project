class Tab {
    constructor(tab = { n: '', i: 0, id: '', colour: { r: 0, g: 0, b: 0} }) {
        this._id = tab.id;
        this._index = tab.i;
        this._name = tab.n;
        this._color = tab.colour;
    }

    getColor() {
        return this._color;
    }

    setColor() {
        this._color = color;
    }

    getId() {
        return this.id || '';
    }

    setId(id) {
        this._id = id;
    }

    getIndex() {
        return this._index || 0;
    }

    setIndex(index) {
        this._index = index;
    }

    getName() {
        return this._name || '';
    }

    setName(name) {
        this._name = name;
    }
}

class TabInfo {
    constructor(tabsJSON = {
        "numTabs": 166,
        "tabs": [
            {
                "n": "",
                "i": 0,
                "id": "",
                "type": "",
                "hidden": false,
                "selected": true,
                "colour": {
                    "r": 0,
                    "g": 0,
                    "b": 0
                },
                "srcL": "https://web.poecdn.com/gen/image/WzIzLDEseyJ0IjoibCIsImMiOi0yMjAxNn1d/317f9d2d8c/Stash_TabL.png",
                "srcC": "https://web.poecdn.com/gen/image/WzIzLDEseyJ0IjoibSIsImMiOi0yMjAxNn1d/c06c5980a6/Stash_TabL.png",
                "srcR": "https://web.poecdn.com/gen/image/WzIzLDEseyJ0IjoiciIsImMiOi0yMjAxNn1d/9a7ac3c720/Stash_TabL.png"
            }]
    }) {
        this._tabs = tabsJSON.hasOwnProperty('numTabs') ? TabInfo.trimData(tabsJSON).map(tab => {
            return new Tab(tab);
        }) : tabsJSON;
    }

    getTabs() {
        return this._tabs;
    }

    setTabs(tabs) {
        this._tabs = tabs;
    }

    static localRead() {
        let tabs = new TabInfo();
        return localStorage.getItem('tabinfo') != null ? Object.assign(tabs, JSON.parse(localStorage.getItem('tabinfo'))) : tabs;
    }

    static localWrite(tabs) {
        localStorage.setItem('tabinfo', JSON.stringify(tabs));
    }

    static trimData(tabsJSON) {
        return tabsJSON.tabs;
    }
}

module.exports.Tab = Tab;
module.exports.TabInfo = TabInfo;