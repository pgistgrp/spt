 Ext.define('SPT.model.SPTConcernReply', {
    extend: 'Ext.data.Model',
    fields:[]
});

Ext.define('SPT.store.SPTConcernReply', {
    extend: 'Ext.data.Store',
	storeId: 'concernReply',
    model: 'SPT.model.SPTConcernReply',
    proxy: {
        type: 'jsonp',
        url : 'http://pgistdev.geog.washington.edu:8080/dwr/jsonp/BCTAgent/createConcernComment/',
        reader: {
            type: 'json',
			root: 'reply',
			successProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
	