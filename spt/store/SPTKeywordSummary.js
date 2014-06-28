Ext.define('SPT.store.SPTKeywordSummary', {
    extend: 'Ext.data.Store',
    pageSize: 500,
    storeId: 'SPTKeywordSummary',
	fields: [   
		      {name: 'keyword', type: 'string'},
		      {name: 'times', type: 'int'}]
});
	
//no proxy specified because in memory store