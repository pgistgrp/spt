 Ext.define('SPT.model.SPTConcerns', {
    extend: 'Ext.data.Model',
    fields:['content', {name: 'createTime', type: 'date', dateFormat: 'MM/dd/yy, hh:mm'}, 
            {name: 'deleted', type: 'boolean'}, 'id', {name: 'author', mapping: 'author.loginname'}],
    associations: [{type:'hasMany', model: 'ConcernTags', name: 'tags'}]
});
 

 Ext.define('ConcernTags', {
	    extend: 'Ext.data.Model',
	    fields:['bctId', 'id','times'],
	    belongsTo: 'SPT.model.SPTConcerns',
	    instanceName: 'concern2',
	    associations:[{type:'hasOne', model: 'ConcernTag', name:'tag'}]
	});

 Ext.define('ConcernTag', {
	    extend: 'Ext.data.Model',
	    fields:['count', 'id', 'name', 'status', 'type'],
	    belongsTo: 'ConcernTags'
	});
	
