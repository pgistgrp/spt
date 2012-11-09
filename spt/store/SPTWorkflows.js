Ext.define('SPT.store.SPTWorkflows', {
    extend: 'Ext.data.Store',
    fields: ['name','workflowId', 'contextId', 'activityId'],
    data: [
        {name: 'Feedback', workflowId: '', contextId: '', activityId: ''}
    ]
});