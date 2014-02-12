Ext.define('SPT.controller.SPTLogin', {
    extend: 'Ext.app.Controller',
    
    stores: ['SPTUser'],
    
    models: ['SPTUser'],
    
    requires: ['Ext.util.Cookies'],

    init: function() {
    			
    	 var username; 
    	 var token = null;
    	 var loginStore = this.getSPTUserStore();
    	 //Check to see if CSFUser
    	 var cookie = Ext.util.Cookies.get('csfuser');
    	 if (cookie != null){
    		username = cookie;
    	 	loginStore.getProxy().url =  loginStore.getProxy().url + username +'/' + token + '/'+ 'csf';
    	 }else{
    		username = CG.global.Env.authuser;
    	    token = CG.global.Env.token;
    		//username = 'roderimj';
        	//token = 'cybergis_token_akNIS9pYXjzrRXjF';
        	loginStore.getProxy().url =  loginStore.getProxy().url + username +'/' + token + '/'+ 'cybergis';
    	 }
    			
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