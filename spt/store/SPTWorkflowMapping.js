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
		      {key: 'flumapper', value: 'FluMapper'},
		      {key: 'geoenrichment', value: 'ESRI GeoEnrichment'}
		    ]
	
});
	
//no proxy specified because in memory store