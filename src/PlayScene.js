
var PlayLayer = cc.Layer.extend({
    bgSprite:null,
    SushiSprites:null,

    scoreLabel:null,
    score:0,
    timeoutLabel:null,
    timeout:5,

    ctor:function () {
        this._super();
        this.SushiSprites = [];

        var size = cc.winSize;

        //add timeout and score

        this.scoreLabel = new cc.LabelTTF("Score:0", "Arial", 30);
        //this.scoreLabel.setColor(0,0,0,100);//Wrong arguments in JSBinding
        this.scoreLabel.attr({
               x:size.width / 2 + 100,
               y:size.height - 20
        });
        this.addChild(this.scoreLabel, 5);

               // timeout 60
        this.timeoutLabel = cc.LabelTTF.create("" + this.timeout, "Arial", 30);
        //this.timeoutLabel.setColor(0,0,0,100); //Wrong arguments in JSBinding
        this.timeoutLabel.x = 20;
        this.timeoutLabel.y = size.height - 20;
        this.addChild(this.timeoutLabel, 5);


        // add bg
        this.bgSprite = new cc.Sprite(res.BackGround_png);
        this.bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            //scale: 0.5,
            rotation: 180
        });
        this.addChild(this.bgSprite, 0);

        this.addSushi();

        this.schedule(this.update,0.5,36*1024,0.5);
        this.schedule(this.timer,1,this.timeout,1);
        return true;
    },

    update : function() {
            this.addSushi();
            this.removeSushi();
    },
    addScore:function(){
            this.score +=1;
            this.scoreLabel.setString("score:" + this.score);
    },

    timer : function() {

            isSuccess=false;
    		if (this.timeout == 0) {
    			//alert('游戏结束');
    			var gameOver = new cc.LayerColor(cc.color(0,0,0,100));
    			var size = cc.winSize;
    			var titleLabel = new cc.LabelTTF("Game Over", "Arial", 38);
    			titleLabel.attr({
    				x:size.width / 2 ,
    				y:size.height / 2
    			});
    			gameOver.addChild(titleLabel, 5);

    			var titleLabel = new cc.LabelTTF("Your Score is " +this.score, "Arial", 38);
                    			titleLabel.attr({
                    				x:size.width / 2 ,
                    				y:size.height / 2 -60
                    			});
                gameOver.addChild(titleLabel, 5);

    			var TryAgainItem = new cc.MenuItemFont(
    					"Try Again",
    					function () {
    						cc.log("Try Again Menu is clicked!");
    						//var transition= cc.TransitionFade(1, new PlayScene(),cc.color(255,255,255,255));
    						cc.director.runScene(new PlayScene());

    					}, this);
    			TryAgainItem.attr({
    				x: size.width/2,
    				y: size.height / 2 - 120,
    				anchorX: 0.5,
    				anchorY: 0.5
    			});
    			var RecordItem = new cc.MenuItemFont(
                    					"Record into Database",
                    					function () {
                    						cc.log("Record Menu is clicked!");
                    						//input it into the database
                                            if (isSuccess==false){
                                                post({
                                                        "Action":"Update",
                                                        //"name":getById("name").value.trim(),
                                                        "Name":"Jin",
                                                        //"score": getById("score").value.trim(),
                                                        "Score" : this.score,
                                                        "Origin": "Wechat"
                                                    }, function (result) {

                                                        if (result["status"] == 1) {
                                                            isSuccess = true;
                                                            cc.log("信息已经成功提交！");

                                                            var titleLabel1 = new cc.LabelTTF("Record Successfully!", "Arial", 38);
                                                                			titleLabel1.attr({
                                                                				x:size.width / 2 ,
                                                                				y:size.height / 2+60
                                                                			});
                                                            gameOver.addChild(titleLabel1, 4);

                                                        } else {
                                                            cc.log("信息提交失败！");
                                                            var titleLabel2 = new cc.LabelTTF("Record Failed!", "Arial", 38);
                                                                      titleLabel2.attr({
                                                                      x:size.width / 2 ,
                                                                      y:size.height / 2+60
                                                                      });
                                                            gameOver.addChild(titleLabel2, 4);


                                                        }
                                                    });
                                            }

                    					}, this);
                    			RecordItem.attr({
                    				x: size.width/2,
                    				y: size.height / 2 - 180,
                    				anchorX: 0.5,
                    				anchorY: 0.5
                    			});

    			var menu = new cc.Menu(TryAgainItem,RecordItem);
    			menu.x = 0;
    			menu.y = 0;
    			gameOver.addChild(menu, 1);
    			this.getParent().addChild(gameOver);

    			this.unschedule(this.update);
    			this.unschedule(this.timer);
    			return;
    		}

    		this.timeout -=1;
    		this.timeoutLabel.setString("" + this.timeout);

    	},

    removeSushi : function() {
            //移除到屏幕底部的sushi
            for (var i = 0; i < this.SushiSprites.length; i++) {
                cc.log("removeSushi.........");
                if(0 == this.SushiSprites[i].y) { //Invalid Native Objective
                    cc.log("==============remove:"+i);
                    this.SushiSprites[i].removeFromParent();
                    this.SushiSprites[i] = undefined;
                    this.SushiSprites.splice(i,1);
                    i= i-1;
                }
            }
    },

    //addsushi

    addSushi:function () {

        //var sushi = new cc.Sprite(res.Sushi_png);
        var sushi = new SushiSprite(res.Sushi_png);
        //var sushi = new SushiSprite();
        var size = cc.winSize;

        var x = sushi.width/2+size.width/2*cc.random0To1();
        sushi.attr({
                x: x,
                y:size.height - 30
         });

         this.addChild(sushi,5);
         this.SushiSprites.push(sushi);
         var dorpAction = cc.MoveTo.create(4, cc.p(sushi.x,-30));
         sushi.runAction(dorpAction);

      }


});

var PlayScene = cc.Scene.extend({

    onEnter:function () {
        this._super();
        var layer = new PlayLayer();

        this.addChild(layer);

//        initMusic();
//
    }


});

var musicPlayStatus = true;

var post = function (data, callfunc) {
    var self = this;
    var xhr = cc.loader.getXMLHttpRequest();

    //var oUrl = window.location.host; //+servlet
    var oUrl = "http://sushiwechatgame.sinaapp.com/TestServlet";
    //oUrl = encodeURIComponent(oUrl);

    //xhr.open("POST", oUrl, true);
    //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");

    xhr.timeout = 10000;
    xhr.ontimeout = function () {
        reclick = true;
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            reclick = true;
        }
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(xhr.responseText);
            callfunc(result);
        }
    };
    var param = "";
    for (var key in data) {
        param = param + key + "=" + data[key] + "&";
    }
    //param = encodeURI(param);
    oUrl=oUrl+"?"+param;
    //oUrl = encodeURIComponent(oUrl);
    cc.log(oUrl);
    xhr.open("GET", oUrl, true);
    //cc.log(param);
    xhr.send();
};
var initMusic = function () {
    var audio = getById("myAudio");
    audio.src = "res/bg.mp3";
}
var playMusic = function (status) {
    var audio = getById("myAudio");
    /*if (status) {
        if (audio.paused) {
            audio.play();
            musicPlayStatus = true;
        }
    } else {
        if (!audio.paused) {
            audio.pause();
            musicPlayStatus = false;
        }
    }*/
}

var getById = function (id) {
    return document.getElementById(id);
}
//
//function hasClass(ele, cls) {
//    var result = ele && ele.className && (ele.className.search(new RegExp('(\\s|^)' + cls + '(\\s|$)')) != -1);
//    return !!result;
//}
//
//function addClass(ele, cls) {
//    if (!hasClass(ele, cls) && ele)
//        ele.className += " " + cls;
//}
//
//function removeClass(ele, cls) {
//    if (hasClass(ele, cls)) {
//        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
//        ele.className = ele.className.replace(reg, ' ');
//    }
//}