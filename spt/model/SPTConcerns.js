 Ext.define('SPT.model.SPTConcerns', {
    extend: 'Ext.data.Model',
    fields:['content', {name: 'createTime', type: 'date', dateFormat: 'MM/dd/yy, hh:mm aaa'}, 
            {name: 'deleted', type: 'boolean'}, 'id'],
    associations: [{type:'hasOne', model: 'ConcernAuthor', name: 'author'},
                   {type:'hasMany', model: 'ConcernTags', name: 'tags'}]
});
 
 Ext.define('ConcernAuthor', {
	    extend: 'Ext.data.Model',
	    fields:['id', 'loginname'],
	    belongsTo: 'SPT.model.SPTConcerns'
	});
 
 Ext.define('ConcernTags', {
	    extend: 'Ext.data.Model',
	    fields:['bctId', 'id','times'],
	    belongsTo: 'SPT.model.SPTConcerns',
	    associations:[{type:'hasOne', model: 'ConcernTag', name:'tag'}]
	});

 Ext.define('ConcernTag', {
	    extend: 'Ext.data.Model',
	    fields:['count', 'id', 'name', 'status', 'type'],
	    belongsTo: 'ConcernTags'
	});
	
