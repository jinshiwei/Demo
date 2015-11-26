var SushiSprite = cc.Sprite.extend({
//        disappearAction:null,//消失动画
        onEnter:function () {
            cc.log("onEnter");
            this._super();
            this.addTouchEventListener();
//            this.disappearAction = this.createDisappearAction();
//            this.disappearAction.retain();
        },

        onExit:function () {
            cc.log("onExit");
//            this.disappearAction.release();
            this._super();
        },

        addTouchEventListener:function () {
            this.touchListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
                swallowTouches: true,
                //onTouchBegan event callback function
                onTouchBegan: function (touch, event) {
                    var pos = touch.getLocation();
                    var target = event.getCurrentTarget();
                    if ( cc.rectContainsPoint(target.getBoundingBox(),pos)) {
                        cc.log("touched");

//                         this.removeTouchEventListenser(); //Type error, is not a function.

                         //cc.eventManager.removeListener(this.touchListener);//Wrong Processing arguments
                         //cc.eventManager.removeTouchEventListenser(target, true);
                          //响应精灵点中
                          cc.log("pos.x="+pos.x+",pos.y="+pos.y);
                          target.getParent().addScore();
//                        target.stopAllActions();
//
//                        var ac = target.disappearAction;
//                        var seqAc = cc.Sequence.create( ac, cc.CallFunc.create(function () {
//                        cc.log("callfun........");
                        target.runAction(cc.FadeOut.create(6));
                        target.removeFromParent();

//
//                        },target) );
//
//                        target.runAction(seqAc);

                        return true;
                    }
                    return false;
                }

            })
            cc.eventManager.addListener(this.touchListener,this);
        }

    });




