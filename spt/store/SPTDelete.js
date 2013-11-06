Ext.define('SPT.store.SPTDelete', {
    extend: 'Ext.data.Store',
	storeId: 'deleteStore',
    model: 'SPT.model.SPTDelete',
    proxy: {
        type: 'jsonp',
        url : 'http://localhost:8080/dwr/jsonp/BCTAgent/delete',
        reader: {
            type: 'json',
			root: 'reply',
			sucessfulProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
	