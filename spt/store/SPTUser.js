Ext.define('SPT.store.SPTUser', {
    extend: 'Ext.data.Store',
	storeId: 'userStore',
    model: 'SPT.model.SPTUser',
    proxy: {
        type: 'jsonp',
        url : 'http://pgistdev.geog.washington.edu:8080/dwr/jsonp/SystemAgent/loadUserByName/',
        reader: {
            type: 'json',
			root: 'reply',
        }
    }
});
	
