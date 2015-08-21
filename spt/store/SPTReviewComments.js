Ext.define('SPT.store.SPTReviewComments', {
    extend: 'Ext.data.Store',
	storeId: 'drtCommentsStore',
    model: 'SPT.model.SPTReviewComments',
    pageSize: 500,
    proxy: {
        type: 'jsonp',
        url : 'http://pgistdev.geog.uw.edu/dwr/jsonp/DRTAgent/getComments/',
        reader: {
            type: 'json',
			//root: 'reply'
        }
    }
});
	