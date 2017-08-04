export default {
    getUserInfo({ commit }) {
        return GLOBAL.ajax.get('/test/getBaseInfo').then((resData) => {
            commit('SET_USER_INFO', resData);
            return resData;
        });
    }
}
