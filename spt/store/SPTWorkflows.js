Ext.define('SPT.store.SPTWorkflows', {
    extend: 'Ext.data.Store',
    id: 'workflowStore',
    model: 'SPT.model.SPTWorkflow',
    proxy: {
        type: 'jsonp',
        url : 'http://localhost:8080/dwr/jsonp/WorkflowAgent/getOpenWorkflows/',
        reader: {
            type: 'json',
			root: 'reply',
			totalProperty: 'openRunningTotal',
			sucessfulProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
