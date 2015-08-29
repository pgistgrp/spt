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
        url : 'http://pgist.geog.uw.edu/dwr/jsonp/BCTAgent/createConcernComment/',
        reader: {
            type: 'json',
			//root: 'reply',
			successProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
	