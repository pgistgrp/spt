Ext.define('SPT.store.SPTWorkflows', {
    extend: 'Ext.data.Store',
    storeId: 'workflowStore',
    model: 'SPT.model.SPTWorkflows',
    autoLoad: false,
    proxy: {
        type: 'jsonp',
        url : 'http://pgistdev.geog.uw.edu/dwr/jsonp/WorkflowAgent/getOpenWorkflows/',
        reader: {
            type: 'json',
			//root: 'reply',
			totalProperty: 'openRunningTotal',
			successProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
