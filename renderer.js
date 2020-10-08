const electron = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');
const { ClipboardJS } = require('clipboard');
const { Config } = require('./src/classes/configClass');
const league = require('./src/utils/leagueUtil');
const { Inventory, ItemDict, InvItem } = require('./src/classes/itemClasses');
const { TabInfo, Tab } = require('./src/classes/tabClasses');
const { filterInventory } = require('./src/utils/inventoryUtil');

let cfg = Config.localRead();
Config.localWrite(cfg);
let wikidata = ItemDict.localRead();
ItemDict.localWrite(wikidata);
let tabinfo = TabInfo.localRead();
TabInfo.localWrite(tabinfo);
let configSet = false;
let credsSet = false;
let filteredinv = new Inventory();
let importedinv = new Inventory();
let localinv = new Inventory();


$(() => {
    if (!cfg.accountIsSet())
        credsOpen();
    else if (cfg.configIsSet()) {
        retrieveTabData();
        accountNavToggle('show', cfg.getAccountname());
    }
    else
        accountNavToggle('show', cfg.getAccountname());

    if (cfg.isInit()) {
        console.log("Config initialized");
        retrieveIntentoryData();
        inventoryListPopulate();
    }

    if (league.leagues() == null || !league.isSeasonCurrent(league.leagues())) {
        retrieveLeagueData();
        retrieveWikiData();
    }

    if (!wikidata.isInit())
        retrieveWikiData();

    $('#accountIcon').on('click', () => {
        if (!isEmpty(cfg.getAccountname())) {
            cfg.setAccountname('');
            cfg.setSessionID('');
            Config.localWrite(cfg);
            accountNavToggle('hide', '');
        }
        $('#credsModal').modal('show');

    });

    $('.config-input').on('change', configModalHandler);
    $('.creds-input').on('keyup change', credsModalHandler);
    $('#configCloseBtn').on('click', () => {
        $('#configModal').modal('hide');
    });

    $('#configSaveBtn').on('click', () => {
        configSave();
        $('#configModal').modal('hide');
        if (cfg.configIsSet() && cfg.accountIsSet() && cfg.tabsIsSet()) {
            retrieveIntentoryData();
            inventoryListPopulate();
        }
    });

    $('#credsContinue').on('click', () => {
        credsSave();
        accountNavToggle('show', cfg.getAccountname());
        $('#credsModal').modal('hide');
        $('[data-toggle="tooltip"]').tooltip('enable');
        retrieveTabData();
    });

    $('#credsModal').on('hidden.bs.modal', () => {
        if (!cfg.configIsSet())
            configOpen();
    })

    $('#exportClose').on('click', () => {
        $('#exportModal').modal('hide');
    });

    $('#refreshBtn').on('click', () => {
        if (!cfg.configIsSet())
            configOpen();
        else {
            retrieveIntentoryData();
            inventoryListPopulate();
        }
    });

    $('#settingsBtn').on('click', () => {
        $('#configModal').modal('show');
    })

    $('#tabSelect option').on('mousedown', (e) => {
        e.preventDefault();
        this.selected = !this.selected;
    })

    $('#pastebinUrl').on('click', () => {
        $('#pastebinUrl').select();
    });
});

function accountNavToggle(visibility, content) {
    $('#navAccount').text(content);
    switch (visibility) {
        case 'show':
            $('[data-toggle="tooltip"]').tooltip('enable');
            $('#loggedIn').removeAttr('disabled');
            $('#loggedIn').show();
            break;
        case 'hide':
            $('[data-toggle="tooltip"]').tooltip('disable');
            $('#loggedIn').attr('disabled', 'disabled');
            $('#loggedIn').hide();
            break;
    }
}

function credsOpen() {
    $('#credsModal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#loggedIn').hide();
}

function credsSave() {
    cfg.setAccountname($('#accountInput').val());
    cfg.setSessionID($('#sessionInput').val());
    Config.localWrite(cfg);
}

function configOpen() {
    initValues();
    $('#configModal').modal();
}

function configModalHandler() {
    if (!isEmpty($('#leagueSelect').val()) && isEmpty($('#platformSelect').val())) {
        retrieveTabDataOnChange();
    }
}

function configSave() {
    cfg.setPlatform($('#platformSelect').val());
    cfg.setLeague($('#leagueSelect').val());
    cfg.setTabs($('#tabSelect').val());
    Config.localWrite(cfg);
}

function credsModalHandler() {
    let invalid = false;
    $('.creds-input').each(function () {
        if (isEmpty($(this).val())) {
            invalid = true;
        }
    });

    if ($('#sessionInput').val().length !== 32) {
        invalid = true;
    }

    if (invalid) {
        $('#credsContinue').removeClass('btn-success');
        $('#credsContinue').addClass('btn-dark');
        $('#credsContinue').attr('disabled', 'disabled');
    } else {
        $('#credsContinue').removeClass('btn-dark');
        $('#credsContinue').addClass('btn-success');
        $('#credsContinue').removeAttr('disabled');
    }

    /*
    clipboard.on('success', (e) => {
        $('#pastebinHelp').text('Copied to clipboard!');
        $('#pastebinHelp').addClass('text-success');
    });

    clipboard.on('error', (e) => {
        $('#pastebinHelp').text('Failed to copy.');
        $('#pastebinHelp').addClass('text-danger');
    });*/
};

function initValues() {
    if (!isEmpty(cfg.getPlatform()))
        //$(`#platformSelect[value="${cfg.getPlatform()}]"`).prop('selected', true);
        $('#platformSelect').val(cfg.getPlatform());
    if (!isEmpty(cfg.getLeague()))
        //$(`#leagueSelect[value="${cfg.getLeague()}]"`).prop('selected', true);
        $('#leagueSelect').val(cfg.getLeague());
    if (!isEmpty(cfg.getTabs())) {
        let tabs = [];
        cfg.getTabs().forEach((tab) => {
            let temp = new Tab();
            Object.assign(temp, tab);
            tabs.push(temp.getIndex());
            //$(`#tabSelect[value="${temp.getIndex()}]"`).prop('selected', true);
        });
        $('#tabSelect').val(tabs);
    }
}

function inventoryListPopulate() {
    $('#inventoryList').html('');
    $('#inventoryList').append(`<li class="list-group-item"><div class="row"><div class="col-6">Item Name</div><div class="col-6 text-right">Amount</div></div></li>`);
    Object.assign(filteredinv, filterInventory(localinv, wikidata));
    let items = filteredinv.getItems();
    console.log(items);
    items._items.forEach((temp) => {
        let item = new InvItem();
        Object.assign(item, temp);
        let currstack = item.getCurrStack();
        let maxstack = item.getMaxStack();
        let displaystack = `${currstack % maxstack}/${maxstack}`;
        let html = !isEmpty(item.getName()) ? `<li class="list-group-item"></li><div class="row"><div class="col-6">${item.getName()}<small class="text-muted">${item.getTypeline()}</small></div><div class="col-6 text-right">${displaystack}</div></div></li>`
            : `<li class="list-group-item"><div class="row"><div class="col-6">${item.getTypeline()}</div><div class="col-6 text-right">${displaystack}</div></div></li>`;
        $('#inventoryList').append(html);
    });
}

function leagueSelectGenerateHTML() {
    let leagueSelectHTML = '<option class="text-muted" value="">Select a league</option>';
    JSON.parse(league.leagues()).forEach((l) => {
        let name = league.leagueName(l);
        leagueSelectHTML += `<option value="${name}">${name}</option>`;
    });
    return leagueSelectHTML;
}


function retrieveIntentoryData() {
    (async () => {
        let query = {
            league: cfg.getLeague(),
            platform: cfg.getPlatform(),
            accountname: cfg.getAccountname(),
            sessionID: cfg.getSessionID(),
            tabs: cfg.getTabs().join(',')
        }
        const data = await ipc.callMain('get-inventory', query);
        Object.assign(localinv, new Inventory(data));
        inventoryListPopulate();
    })();
}

function retrieveLeagueData() {
    (async () => {
        const data = await ipc.callMain('get-leagues');
        league.leaguesSet(JSON.stringify(data));
        $('#leagueSelect').html(leagueSelectGenerateHTML());
    })();
}

function retrieveTabDataOnChange() {
    (async () => {
        let query = {
            league: $('#leagueSelect').val(),
            platform: $('#platformSelect').val(),
            accountname: cfg.getAccountname(),
            sessionID: cfg.getSessionID()
        };
        const tabs = await ipc.callMain('get-tabs', query);
        TabInfo.localWrite(new TabInfo(tabs));
        $('#tabSelect').html(tabSelectGenerateHTML());
    })();
}

function retrieveTabData() {
    (async () => {
        const data = await ipc.callMain('get-tabs', {
            league: cfg.getLeague(),
            platform: cfg.getPlatform(),
            accountname: cfg.getAccountname(),
            sessionID: cfg.getSessionID()
        });
        TabInfo.localWrite(new TabInfo(data));
        $('#tabSelect').html(tabSelectGenerateHTML());
    })();
}

function retrieveWikiData() {
    (async () => {
        const data = await ipc.callMain('get-wikidata');
        ItemDict.localWrite(new ItemDict(data));
    })();
}

function tabSelectGenerateHTML() {
    let tabSelectHTML = '<option class="text-muted" value="">Select tabs</option>';
    tabinfo.getTabs().forEach((tab) => {
        let temp = new Tab();
        Object.assign(temp, tab);
        tabSelectHTML += `<option value="${temp.getIndex()}">${temp.getName()}</option>`;
    });
    return tabSelectHTML;
}

function isEmpty(obj) {
    if (obj == null || obj.length === 0)
        return true;
    return false;
}