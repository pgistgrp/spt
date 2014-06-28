 Ext.define('SPT.model.SPTInfoObject', {
    extend: 'Ext.data.Model',
    fields:['id', 'title', 'target', {name: 'closed', type: 'boolean'}, 
            'numAgree', 'numVote'],
    associations: [{type:'hasMany', model: 'DRTAnnouncements', name: 'announcements'}]
});
 

 Ext.define('DRTAnnouncements', {
	    extend: 'Ext.data.Model',
	    fields:['id','title', 'desdcription', 'numAgree', 'numVote', {name: 'done', type: 'boolean'} ],
	    belongsTo: 'SPT.model.SPTInfoObject',
	    instanceName: 'announ'
	});

	
