module.exports = {
    leagues: () => {
        return localStorage.getItem('leagues') != null ? localStorage.getItem('leagues') : [];
    },

    leaguesSet: (leagues) => {
        localStorage.setItem('leagues', leagues);
    },

    leagueName: (league) => {
        return league.id || "";
    },    

    leagueNames: (leagues) => {
        let leagueNames = [];
        for (const league of leagues) {
            leagueNames.push(league.id);
        }
        return leagueNames;
    },
    
    leagueEndDate: (league) => {
        return league.endAt || '';
    },

    leagueEndDateToDate: (league) => {
        return new Date(module.exports.leagueEndDate(league)) || '';
    },

    isLeagueEnded: (league) => {
        return new Date() > module.exports.leagueEndDateToDate((league));
    },

    isSeasonal: (league) => {
        return league.hasOwnProperty('timedEvent');
    },

    isSeasonCurrent: (leagues) => {
        if (leagues == null) {
            return false;
        }            
        for (const league of leagues) {
            if (module.exports.isSeasonal(league) === true) {
                return module.exports.isLeagueEnded(league);
            }
        }
    }
};