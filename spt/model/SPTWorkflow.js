Ext.define('SPT.model.SPTWorkflow', {
    extend: 'Ext.data.Model',
    fields: ['workflowId', 'type','description', 'contextId'],
    associations:[{type:'hasMany', model: 'PGameActivity', name: 'pgameActivityList'}]
});

Ext.define('PGameActivity', {
    extend: 'Ext.data.Model',
    fields: ['type', 'contextId', 'title','activityId', 'beginTime', 'endTime'],
    belongsTo: 'SPT.model.SPTWorkflow'
});




    

