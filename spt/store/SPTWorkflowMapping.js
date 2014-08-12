Ext.define('SPT.store.SPTWorkflowMapping', {
    extend: 'Ext.data.Store',
    storeId: 'SPTWorkflowMapping',
	fields: [   
		      {name: 'key', type: 'string'},
		      {name: 'value', type: 'string'}],
	data : [
		      {key: 'viewshed', value: 'Viewshed'},
		      {key: 'spreg', value: 'CGPySAL'},
		      {key: 'taudem', value: 'TauDEM'},
		      {key: 'bioscope', value: 'BioScope'},
		      {key: 'move', value: 'MovePattern'}
		    ]
	
});
	
//no proxy specified because in memory store