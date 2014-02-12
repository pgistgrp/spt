 Ext.define('SPT.model.SPTConcern', {
    extend: 'Ext.data.Model',
    fields:[]//fields are empty because BCTAgent.saveConcern only return whether successful or not
});

Ext.define('SPT.store.SPTConcern', {
    extend: 'Ext.data.Store',
	storeId: 'concernStore',
    model: 'SPT.model.SPTConcern',
    proxy: {
        type: 'jsonp',
        url : 'http://pgistdev.geog.washington.edu:8080/dwr/jsonp/BCTAgent/saveConcern/',
        reader: {
            type: 'json',
			root: 'reply',
			successProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
	