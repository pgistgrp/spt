Ext.define('SPT.controller.SPTLogin', {
    extend: 'Ext.app.Controller',

    init: function() {
    	 Ext.define('LoginUser', {
    		 extend: 'Ext.data.Model',
    		 fields:[{name:'successful', type:'boolean'},{name:'error', type:'String'}]
    	 });
    			
    	//var username = CG.global.Env.authuser;
    	//var token = CG.global.Env.token;
    	 
    	 var username = 'roderimj';
    	 var token = 'cybergis_token_2ZmclEumNY4P3w9h';
    		    
    	 var loginStore = Ext.create('Ext.data.Store', {
    		 id: 'loginStore',
    		 model: 'LoginUser',
    		 proxy: {
    		    type: 'jsonp',
    		    url : 'http://localhost:8080/dwr/jsonp/SystemAgent/loadUserByName/',
    		    reader: {
    		       type: 'json',
    		       root: 'reply'
    		    }
    		  }
    	 });
    			
    	loginStore.getProxy().url =  loginStore.getProxy().url + username +'/' + token + '/'+ 'cybergis';
    	loginStore.load(function(records, operation, success) {
    		var record = loginStore.getAt(0);
    		if(! record.get('successful')){
    			  Ext.Msg.show({
                      title: 'Login failed',
                      msg: record.get('error'),
                      buttons: Ext.Msg.OK
                  });	
    		};
		});
}

});