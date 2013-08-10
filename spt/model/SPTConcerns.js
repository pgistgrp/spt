 Ext.define('SPT.model.SPTConcerns', {
    extend: 'Ext.data.Model',
    fields:['content', {name: 'createTime', type: 'date', dateFormat: 'm/d/y h:iA'}, 
            {name: 'deleted', type: 'boolean'}, 'id', {name: 'author', mapping: 'author.loginname'}],
    associations: [{type:'hasMany', model: 'ConcernTags', name: 'tags'}]
});
 

 Ext.define('ConcernTags', {
	    extend: 'Ext.data.Model',
	    fields:['bctId', 'id','times', {name: 'keyword', mapping: 'tag.name'}],
	    belongsTo: 'SPT.model.SPTConcerns',
	    instanceName: 'concern2'
	});

	
