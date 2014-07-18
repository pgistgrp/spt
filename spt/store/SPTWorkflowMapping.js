Ext.define('SPT.store.SPTWorkflowMapping', {
    extend: 'Ext.data.Store',
    storeId: 'SPTWorkflowMapping',
	fields: [   
		      {name: 'key', type: 'string'},
		      {name: 'value', type: 'string'}],
	data : [
		      {key: 'viewshed', value: 'Viewshed Feedback'},
		      {key: 'spreg', value: 'CGPySAL'},
		      {key: 'taudem', value: 'TauDEM'},
		      {key: 'bioscope', value: 'BioScope'},
		      {key: 'move', value: 'Move Pattern'},
		      {key: 'spt', value:  'SPT Feedback'},
		    ]
	
});
	
//no proxy specified because in memory store