 Ext.define('SPT.model.SPTDelete', {
    extend: 'Ext.data.Model',
    fields:[]//fields are empty because BCTAgent.deleteConcern only return whether successful or not
});

Ext.define('SPT.store.SPTDelete', {
    extend: 'Ext.data.Store',
	storeId: 'deleteStore',
    model: 'SPT.model.SPTDelete',
    proxy: {
        type: 'jsonp',
        url : 'http://pgistdev.geog.uw.edu/dwr/jsonp/BCTAgent/delete',
        reader: {
            type: 'json',
			//root: 'reply',
			successProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
	