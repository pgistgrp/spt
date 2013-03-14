Ext.define('SPT.model.SPTWorkflows', {
    extend: 'Ext.data.Model',
    associations:[{type:'hasMany', model: 'OpenWorkflows', name: 'openWorkflows'}]
});

Ext.define('OpenWorkflows', {
    extend: 'Ext.data.Model',
    fields: ['name','id', {name: 'selected', type: 'boolean', defaultValue: false}],
    belongsTo: 'SPT.model.SPTWorkflows'
});
