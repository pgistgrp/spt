Ext.define('SPT.controller.SPTLogin', {
    extend: 'Ext.app.Controller',
    
    stores: ['SPTUser'],
    
    models: ['SPTUser'],

    init: function() {
    			
    	//var username = CG.global.Env.authuser;
    	//var token = CG.global.Env.token;
    	 
    	 var username = 'roderimj';
    	 var token = 'cybergis_token_FgH4hJkJ7IqYNn0S';
    		    
    	 var loginStore = this.getSPTUserStore();
    			
    	loginStore.getProxy().url =  loginStore.getProxy().url + username +'/' + token + '/'+ 'cybergis';
    	loginStore.load(function(records, operation, success) {
    		var record = loginStore.getAt(0);
    		if(! record.get('successful')){
    			  Ext.Msg.show({
                      title: 'Login failed',
                      msg: record.get('error'),
                      buttons: Ext.Msg.OK
                  });	
    		}else{
    			record.set('username', username);
    		};
		});
}

});