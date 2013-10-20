 Ext.define('SPT.model.SPTUser', {
    extend: 'Ext.data.Model',
    fields:['username',{name:'successful', type:'boolean'},'error']
});