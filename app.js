//upgrade from 4.1.1a to 4.1.1 seems to require this, otherwise getting an error!
Ext.Loader.setConfig({enabled:true});
Ext.Loader.setPath('Ext.ux', './extjs/src/ux/');

Ext.application({
	id: 'cg_pgist_app',
    name: 'SPT',
    appFolder: 'spt',
    appProperty: 'app',
    autoCreateViewport: false,

    controllers:[
    	'SPTLogin',
    	'SPTWorkflowInit',
    	'SPTBrainstorm',
    	//'SPTReview'
    ],
    
    
    launch: function() {
    	
    	var workflowStore = this.getStore('SPTWorkflows');
    	var initController = this.getController('SPTWorkflowInit');
    	workflowStore.on({
	    	//afterload is a custom event, store.load doesn't allow combobox.store to be set
    		afterload: function(){initController.selectWorkflow('Viewshed Feedback');}
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
    	
    	//need this to access Controllers from Views 
    	SPT[this.appProperty] = this;
    }
    
});
