(function () {
    'use strict';

    class BackGround extends Laya.Sprite {
        constructor() {
            super();
            this.init();
        }
        init() {
            this.bg1 = new Laya.Sprite();
            this.bg1.loadImage("war/background.png");
            this.addChild(this.bg1);
            this.bg2 = new Laya.Sprite();
            this.bg2.loadImage("war/background.png");
            this.bg2.pos(0, -852);
            this.addChild(this.bg2);
            Laya.timer.frameLoop(1, this, this.onLoop);
        }
        onLoop() {
            this.y += 1;
            if (this.bg1.y + this.y >= 852) {
                this.bg1.y -= 852 * 2;
            }
            if (this.bg2.y + this.y >= 852) {
                this.bg2.y -= 852 * 2;
            }
        }
    }

    var View = Laya.View;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class GameInfoUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(GameInfoUI.uiView);
            }
        }
        GameInfoUI.uiView = { "type": "View", "props": { "width": 480, "height": 852 }, "compId": 1, "child": [{ "type": "Button", "props": { "y": 57, "x": 399, "width": 81, "var": "pauseBtn", "stateNum": 1, "skin": "war/btn_pause.png", "height": 63 }, "compId": 2 }, { "type": "Label", "props": { "y": 74, "x": 4, "width": 80, "var": "hpLabel", "text": "HP:5", "styleSkin": "war/label.png", "strokeColor": "#000000", "stroke": 2, "height": 33, "fontSize": 24, "color": "#5fff05", "align": "center" }, "compId": 3 }, { "type": "Label", "props": { "y": 74, "x": 97, "width": 106, "var": "levelLabel", "text": "Level:50", "styleSkin": "war/label.png", "strokeColor": "#000000", "stroke": 2, "height": 33, "fontSize": 24, "color": "#fbfbfb", "align": "center" }, "compId": 4 }, { "type": "Label", "props": { "y": 68.5, "x": 225, "width": 79, "var": "scoreLabel", "text": "Score:100", "styleSkin": "war/label.png", "strokeColor": "#000000", "stroke": 2, "height": 33, "fontSize": 36, "color": "#f1701b", "align": "center" }, "compId": 5 }, { "type": "Label", "props": { "y": 327, "x": 21, "wordWrap": true, "width": 445, "var": "infoLabel", "text": "战斗结束", "styleSkin": "war/label.png", "strokeColor": "#000000", "stroke": 2, "height": 186, "fontSize": 24, "color": "#fbfbfb", "align": "center" }, "compId": 6 }], "loadList": ["war/btn_pause.png", "war/label.png"], "loadList3D": [] };
        ui.GameInfoUI = GameInfoUI;
        REG("ui.GameInfoUI", GameInfoUI);
    })(ui || (ui = {}));

    class GameInfo extends ui.GameInfoUI {
        constructor(gi) {
            super();
            this.gameInstance = gi;
            this.pauseBtn.on(Laya.Event.CLICK, this, this.onPauseBtnClick);
            this.reset();
        }
        reset() {
            this.infoLabel.text = "";
            this.hp(5);
            this.level(0);
            this.score(0);
        }
        onPauseBtnClick(e) {
            e.stopPropagation();
            this.infoLabel.text = "游戏已暂停，点击任意地方恢复游戏";
            this.gameInstance.pause();
            Laya.stage.once(Laya.Event.CLICK, this, this.onStageClick);
        }
        onStageClick(e) {
            this.infoLabel.text = "";
            this.gameInstance.resume();
        }
        hp(value) {
            this.hpLabel.text = "HP: " + value;
        }
        level(value) {
            this.levelLabel.text = "Level: " + value;
        }
        score(value) {
            this.scoreLabel.text = "Score: " + value;
        }
    }

    class Role extends Laya.Sprite {
        constructor() {
            super();
            this.shootType = 0;
            this.shootInterval = 500;
            this.shootTime = Laya.Browser.now() + 2000;
            this.action = "";
            this.isBullet = false;
            this.heroType = 0;
        }
        init(_type, _camp, _hp, _speed, _hitRadius, _heroType = 0) {
            this.type = _type;
            this.camp = _camp;
            this.hp = _hp;
            this.speed = _speed;
            this.hitRadius = _hitRadius;
            this.heroType = _heroType;
            if (!Role.cached) {
                Role.cached = true;
                Laya.Animation.createFrames(["war/hero_fly1.png", "war/hero_fly2.png"], "hero_fly");
                Laya.Animation.createFrames(["war/hero_fly1.png", "war/hero_down1.png", "war/hero_fly2.png"], "hero_hit");
                Laya.Animation.createFrames(["war/hero_down1.png", "war/hero_down2.png",
                    "war/hero_down3.png", "war/hero_down4.png"], "hero_down");
                Laya.Animation.createFrames(["war/enemy1_fly1.png"], "enemy1_fly");
                Laya.Animation.createFrames(["war/enemy1_down1.png", "war/enemy1_down2.png", "war/enemy1_down3.png",
                    "war/enemy1_down4.png"], "enemy1_down");
                Laya.Animation.createFrames(["war/enemy2_fly1.png"], "enemy2_fly");
                Laya.Animation.createFrames(["war/enemy2_down1.png", "war/enemy2_down2.png", "war/enemy2_down3.png",
                    "war/enemy2_down4.png"], "enemy2_down");
                Laya.Animation.createFrames(["war/enemy2_hit.png"], "enemy2_hit");
                Laya.Animation.createFrames(["war/enemy3_fly1.png", "war/enemy3_fly2.png"], "enemy3_fly");
                Laya.Animation.createFrames(["war/enemy3_down1.png", "war/enemy3_down2.png", "war/enemy3_down3.png",
                    "war/enemy3_down4.png", "war/enemy3_down5.png", "war/enemy3_down6.png"], "enemy3_down");
                Laya.Animation.createFrames(["war/enemy3_hit.png"], "enemy3_hit");
                Laya.Animation.createFrames(["war/bullet1.png"], "bullet1_fly");
                Laya.Animation.createFrames(["war/ufo1.png"], "ufo1_fly");
                Laya.Animation.createFrames(["war/ufo2.png"], "ufo2_fly");
            }
            if (!this.body) {
                this.body = new Laya.Animation();
                this.addChild(this.body);
                this.body.on(Laya.Event.COMPLETE, this, this.onPlayComplete);
            }
            this.playAction("fly");
        }
        onPlayComplete() {
            if (this.action === "down") {
                this.body.stop();
                this.visible = false;
            }
            else if (this.action === "hit") {
                this.playAction("fly");
            }
        }
        playAction(action) {
            this.action = action;
            this.body.play(0, true, this.type + "_" + action);
            var bound = this.body.getBounds();
            this.body.pos(-bound.width / 2, -bound.height / 2);
        }
    }
    Role.cached = false;

    class Game {
        constructor() {
            this.bulletPos = [[0], [-15, 15], [-30, 0, 30], [-45, -15, 15, 45]];
            this.level = 0;
            this.score = 0;
            this.levelUpScore = 10;
            this.bulletLevel = 0;
            this.hps = [1, 2, 2];
            this.speeds = [3, 2, 1];
            this.radius = [15, 30, 70];
        }
        onLoaded() {
            var bg = new BackGround();
            Laya.stage.addChild(bg);
            this.roleBox = new Laya.Sprite();
            Laya.stage.addChild(this.roleBox);
            this.gameInfo = new GameInfo(this);
            Laya.stage.addChild(this.gameInfo);
            this.hero = new Role();
            this.roleBox.addChild(this.hero);
            this.restart();
        }
        onLoop() {
            for (var i = this.roleBox.numChildren - 1; i > -1; i--) {
                var role = this.roleBox.getChildAt(i);
                if (role && role.speed) {
                    role.y += role.speed;
                    if (role.y > 1000 || !role.visible || (role.isBullet && role.y < -20)) {
                        role.removeSelf();
                        role.isBullet = false;
                        role.visible = true;
                        Laya.Pool.recover("role", role);
                    }
                }
                if (role.shootType > 0) {
                    var time = Laya.Browser.now();
                    if (time > role.shootTime) {
                        role.shootTime = time + role.shootInterval;
                        var pos = this.bulletPos[role.shootType - 1];
                        for (var index = 0; index < pos.length; index++) {
                            var bullet = Laya.Pool.getItemByClass("role", Role);
                            bullet.init("bullet1", role.camp, 1, -4 - role.shootType - Math.floor(this.level / 15), 1, 1);
                            bullet.pos(role.x + pos[index], role.y - role.hitRadius - 10);
                            this.roleBox.addChild(bullet);
                        }
                        Laya.SoundManager.playSound("res/sound/bullet.mp3");
                    }
                }
            }
            for (var i = this.roleBox.numChildren - 1; i > -1; i--) {
                var role1 = this.roleBox.getChildAt(i);
                if (role1.hp < 1)
                    continue;
                for (var j = i - 1; j > -1; j--) {
                    if (!role1.visible)
                        continue;
                    var role2 = this.roleBox.getChildAt(j);
                    if (role2.hp > 0 && role1.camp != role2.camp) {
                        var hitRadius = role1.hitRadius + role2.hitRadius;
                        if (Math.abs(role1.x - role2.x) < hitRadius && Math.abs(role1.y - role2.y) < hitRadius) {
                            this.lostHp(role1, 1);
                            this.lostHp(role2, 1);
                            this.score++;
                            this.gameInfo.score(this.score);
                            if (this.score > this.levelUpScore) {
                                this.level++;
                                this.gameInfo.level(this.level);
                                this.levelUpScore += this.level * 5;
                            }
                        }
                    }
                }
            }
            if (this.hero.hp < 1) {
                Laya.SoundManager.playSound("res/sound/game_over.mp3");
                Laya.timer.clear(this, this.onLoop);
                this.gameInfo.infoLabel.text = "GameOver\n\n你的分数：" + this.score + "\n\n点击重新开始游戏";
                this.gameInfo.infoLabel.once(Laya.Event.CLICK, this, this.restart);
            }
            var cutTime = this.level < 30 ? this.level * 2 : 60;
            var speedUp = Math.floor(this.level / 6);
            var hpUp = Math.floor(this.level / 8);
            var numUp = Math.floor(this.level / 10);
            if (Laya.timer.currFrame % (80 - cutTime) === 0) {
                this.createEnemy(0, 2 + numUp, 3 + speedUp, 1);
            }
            if (Laya.timer.currFrame % (150 - cutTime * 4) === 0) {
                this.createEnemy(1, 1 + numUp, 2 + speedUp, 2 + hpUp * 2);
            }
            if (Laya.timer.currFrame % (900 - cutTime * 4) === 0) {
                this.createEnemy(2, 1, 1 + speedUp, 10 + hpUp * 6);
                Laya.SoundManager.playSound("res/sound/enemy3_out.mp3");
            }
        }
        lostHp(role, lostHp) {
            role.hp -= lostHp;
            if (role.heroType === 2) {
                this.bulletLevel++;
                this.hero.shootType = Math.min(Math.floor(this.bulletLevel / 2) + 1, 4);
                this.hero.shootInterval = 500 - 20 * (this.bulletLevel > 20 ? 20 : this.bulletLevel);
                role.visible = false;
                Laya.SoundManager.playSound("res/sound/achievement.mp3");
            }
            else if (role.heroType === 3) {
                this.hero.hp++;
                this.gameInfo.hp(this.hero.hp);
                if (this.hero.hp > 10)
                    this.hero.hp = 10;
                role.visible = false;
                Laya.SoundManager.playSound("res/sound/achievement.mp3");
            }
            else if (role.hp > 0) {
                role.playAction("hit");
            }
            else {
                if (role.heroType > 0) {
                    role.visible = false;
                }
                else {
                    if (role.type != "hero") {
                        Laya.SoundManager.playSound("res/sound/" + role.type + "_down.mp3");
                    }
                    role.playAction("down");
                    if (role.type == "enemy3") {
                        var type = Math.random() < 0.7 ? 2 : 3;
                        var item = Laya.Pool.getItemByClass("role", Role);
                        item.init("ufo" + (type - 1), role.camp, 1, 1, 15, type);
                        item.pos(role.x, role.y);
                        this.roleBox.addChild(item);
                    }
                }
            }
            if (role == this.hero) {
                this.gameInfo.hp(role.hp);
            }
        }
        restart() {
            this.score = 0;
            this.level = 0;
            this.levelUpScore = 10;
            this.bulletLevel = 0;
            this.gameInfo.reset();
            this.hero.init("hero", 0, 5, 0, 30);
            this.hero.shootType = 1;
            this.hero.pos(200, 500);
            this.hero.shootInterval = 500;
            this.hero.visible = true;
            for (var i = this.roleBox.numChildren - 1; i > -1; i--) {
                var role = this.roleBox.getChildAt(i);
                if (role != this.hero) {
                    role.removeSelf();
                    role.visible = true;
                    Laya.Pool.recover("role", role);
                }
            }
            this.resume();
        }
        pause() {
            Laya.timer.clear(this, this.onLoop);
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        }
        resume() {
            Laya.timer.frameLoop(1, this, this.onLoop);
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        }
        onMouseMove() {
            this.hero.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        }
        createEnemy(type, num, speed, hp) {
            for (var i = 0; i < num; i++) {
                var enemy = Laya.Pool.getItemByClass("role", Role);
                enemy.init("enemy" + (type + 1), 1, hp, speed, this.radius[type]);
                enemy.pos(Math.random() * 400 + 40, -Math.random() * 200 - 100);
                this.roleBox.addChild(enemy);
            }
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 480;
    GameConfig.height = 852;
    GameConfig.scaleMode = "exactfit";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "GameInfo.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = true;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            var gameInstance = new Game();
            gameInstance.onLoaded();
        }
    }
    new Main();

}());
