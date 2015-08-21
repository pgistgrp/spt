Ext.define('SPT.store.SPTUser', {
    extend: 'Ext.data.Store',
	storeId: 'userStore',
    model: 'SPT.model.SPTUser',
    proxy: {
        type: 'jsonp',
        url : 'http://pgistdev.geog.uw.edu/dwr/jsonp/SystemAgent/loadUserByName/',
        reader: {
            type: 'json',
			//root: 'reply',
        }
    }
});
	
