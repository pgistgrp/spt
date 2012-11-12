Ext.application({
    name: 'SPT',
    appFolder: 'spt',
    
    controllers:[
    	'SPTLogin',
    	'SPTWorkflowInit',
    	'SPTBrainstorm'
    ],
    
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'vbox',
            items: [
               	{
                    region:'north',
                    xtype: 'workflow',
                    title: 'Discussion'
                    
                },
                {
                	region: 'south',
                	xtype:'brainstorm',
                	title:'Brainstorm'
                }
            ]
        });
    }
});