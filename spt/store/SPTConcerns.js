Ext.define('SPT.store.SPTConcerns', {
    extend: 'Ext.data.Store',
	storeId: 'allConcernsStore',
    model: 'SPT.model.SPTConcerns',
    pageSize: 500,
    proxy: {
        type: 'jsonp',
        url : 'http://pgist.geog.uw.edu/dwr/jsonp/BCTAgent/getContextConcerns/',
        reader: {
            type: 'json',
			//root: 'reply'
        }
    }
});
	