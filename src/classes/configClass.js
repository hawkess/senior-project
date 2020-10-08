class Config {
    constructor(config = { accountname: '', sessionID: '', league: '', platform: '', tabs: [] }) {
        this._accountname = config.accountname || '';
        this._sessionID = config.sessionID || '';
        this._league = config.league || '';
        this._platform = config.platform || '';
        this._tabs = config.tabs || [];
    }

    isEmpty(obj) {
        if (obj == null || obj.length === 0)
            return true;
        return false;
    }

    getAccountname() {
        return this._accountname || '';
    }

    setAccountname(accountname) {
        this._accountname = accountname;
    }

    getLeague() {
        return this._league || '';
    }

    setLeague(league) {
        this._league = league;
    }

    getPlatform() {
        return this._platform || '';
    }

    setPlatform(platform) {
        this._platform = platform;
    }

    getSessionID() {
        return this._sessionID || '';
    }

    setSessionID(sessionID) {
        this._sessionID = sessionID;
    }

    getTabs() {
        return this._tabs || [];
    }

    setTabs(tabs) {

        this._tabs = tabs;
    }

    static localRead() {
        let cfg = new Config();
        return localStorage.getItem('config') != null ? Object.assign(cfg, JSON.parse(localStorage.getItem('config'))) : cfg;
    }

    static localWrite(config) {
        localStorage.setItem('config', JSON.stringify(config));
    }

    isInit() {
        return !(this.isEmpty(this._accountname) ||
            this.isEmpty(this._league) ||
            this.isEmpty(this._platform) ||
            this.isEmpty(this._sessionID) ||
            this.isEmpty(this._tabs));
    }

    accountIsSet() {
        return !(this.isEmpty(this._accountname) || this.isEmpty(this._sessionID));
    }

    configIsSet() {
        return !(this.isEmpty(this._league) || this.isEmpty(this._platform));
    }

    tabsIsSet() {
        return !(this.isEmpty(this._tabs));
    }
}

module.exports.Config = Config;