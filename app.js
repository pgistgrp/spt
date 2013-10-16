Ext.application({
    id: 'cg_pgist_app',
    name: 'SPT',
    appFolder: 'spt',
    autoCreateViewport: false, 
    
    controllers:[
    	'SPTLogin',
    	'SPTWorkflowInit',
    	'SPTBrainstorm'
    ],
    
    
    launch: function() {
    	var workflowStore = this.getStore('SPTWorkflows');
    	var initController = this.getController('SPTWorkflowInit');
    	workflowStore.on({
	    	//afterload is a custom event, store.load doesn't allow combobox.store to be set
    		afterload: function(){initController.selectWorkflow('SPT Grid Test');}
    	});

    	Ext.create('Ext.container.Viewport', {
//    	Ext.create('Ext.window.Window', { //for CyberGIS
//            id: 'cg_pgist_win',
//            xtype: 'window',
//            title: 'Participatory Panel',
//            modal: true,
//            closeAction: 'hide',
//            y:100,
//            autoScroll: true,
//            autoHeight: true,
//            maxHeight: 600,
//            minHeight: 500,
//            autoWidth: true,
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
