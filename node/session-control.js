
module.exports = {

    sessions: {},

    newSession: function(session) {
        this.sessions[session.user.userid] = session;
    },
    delSession: function(id) {
        delete this.sessions[id];
    },
    findSession: function(id) {
        return this.sessions[id];
    }

}