Ext.define('SPT.model.SPTWorkflow', {
    extend: 'Ext.data.Model',
    fields:['openRunningTotal', 'reason', {name:'successful', type:'boolean'}],
    associations:[{type:'hasMany', model: 'OpenWorkflows', name: 'openWorkflows'}]
});

Ext.define('OpenWorkflows', {
    extend: 'Ext.data.Model',
    fields: ['name','id'],
    belongsTo: 'SPT.model.SPTWorkflow'
});