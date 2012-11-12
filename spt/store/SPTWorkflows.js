Ext.define('SPT.store.SPTWorkflows', {
    extend: 'Ext.data.Store',
    fields: ['name','workflowId', 'contextId', 'activityId'],
    data: [
        {name: 'Feedback', workflowId: '2837', contextId: '2857', activityId: '2850'}
    ]
});