/*:
 * @target MZ
 * @plugindesc v2.0 No title screen + clickable pink Game Over (restart / load save).
 * @author ChatGPT
 *
 * @param StartMapId
 * @text 시작 마을 맵 ID
 * @type number
 * @min 1
 * @default 1
 *
 * @param StartX
 * @text 시작 X 좌표
 * @type number
 * @min 0
 * @default 8
 *
 * @param StartY
 * @text 시작 Y 좌표
 * @type number
 * @min 0
 * @default 6
 *
 * @help
 * PinkGameOver.js v2.0 (RPG Maker MZ)
 *
 * 1. Put PinkGameOver.png in img/pictures/.
 * 2. Put this file in js/plugins/ and turn it ON.
 * 3. Configure StartMapId, StartX, StartY.
 * 4. Disable/remove the OLD PinkGameOver plugin entry before enabling this one.
 *
 * On game boot: bypasses title, starts a fresh game at village.
 * On Game Over: shows pink image with clickable buttons:
 *   Upper button: fresh new game at village (all progress reset).
 *   Lower button: directly load the most recent MZ save (including autosave).
 *   If no save exists, buzzer + notice.
 * Keyboard: up/down and Enter/Space. Mouse/touch: click buttons.
 * The menu's "Game End" command is hidden to prevent title navigation.
 * This does not return to the external HTML visual novel.
 *
 * NOTE: "Load save" requires a saved game created earlier.
 * NOTE: New Game triggers autorun map events again. To avoid replaying
 * the opening after Game Over, use a separate retry start map or logic.
 */
(() => {
  "use strict";
  const PLUGIN_NAME = "PinkGameOver";
  const params = PluginManager.parameters(PLUGIN_NAME);
  const startMapId = Math.max(1, Number(params.StartMapId || 1));
  const startX = Math.max(0, Number(params.StartX ?? 8));
  const startY = Math.max(0, Number(params.StartY ?? 6));
  const IMAGE_W = 1583;
  const IMAGE_H = 993;
  const BUTTONS = [
    { x: 524, y: 791, w: 520, h: 63 }, // Restart
    { x: 542, y: 861, w: 482, h: 62 }  // Load
  ];

  function newVillageGame() {
    DataManager.setupNewGame();
    $gamePlayer.reserveTransfer(startMapId, startX, startY, 2, 0);
    SceneManager.goto(Scene_Map);
  }

  // Bypass title at startup; preserve MZ battle/event testing behavior.
  Scene_Boot.prototype.startNormalGame = function() {
    this.checkPlayerLocation();
    newVillageGame();
  };

  // Safety net for any other "go to title" command.
  // Prevent the title scene from ever being displayed.
  Scene_Title.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    newVillageGame();
  };

  // The normal menu's Game End -> To Title would be confusing here.
  Window_MenuCommand.prototype.addGameEndCommand = function() {};

  function hitTest(x, y, r) {
    return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
  }

  Scene_Gameover.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.playGameoverMusic();
    this._selected = 0;
    this._noticeUntil = 0;
    this._loadingSave = false;
    this._pinkBackdrop = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    this._pinkBackdrop.bitmap.fillAll("#f7c9db");
    this.addChild(this._pinkBackdrop);
    this._pinkBackground = new Sprite(ImageManager.loadPicture("PinkGameOver"));
    this.addChild(this._pinkBackground);
    this._ui = new Sprite(new Bitmap(IMAGE_W, IMAGE_H));
    this.addChild(this._ui);
    this.refreshPinkUi();
  };

  Scene_Gameover.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this._pinkScale = Math.min(Graphics.width / IMAGE_W, Graphics.height / IMAGE_H);
    this._pinkOffsetX = (Graphics.width - IMAGE_W * this._pinkScale) / 2;
    this._pinkOffsetY = (Graphics.height - IMAGE_H * this._pinkScale) / 2;
    for (const sprite of [this._pinkBackground, this._ui]) {
      sprite.scale.set(this._pinkScale, this._pinkScale);
      sprite.x = this._pinkOffsetX;
      sprite.y = this._pinkOffsetY;
    }
    this.startFadeIn(this.slowFadeSpeed(), false);
  };

  Scene_Gameover.prototype.refreshPinkUi = function() {
    const b = this._ui.bitmap;
    b.clear();
    const r = BUTTONS[this._selected];
    const p = 3;
    const t = 4;
    const c = "#fff7ff";
    b.paintOpacity = 235;
    b.fillRect(r.x-p, r.y-p, r.w+2*p, t, c);
    b.fillRect(r.x-p, r.y+r.h+p-t, r.w+2*p, t, c);
    b.fillRect(r.x-p, r.y-p, t, r.h+2*p, c);
    b.fillRect(r.x+r.w+p-t, r.y-p, t, r.h+2*p, c);
    b.paintOpacity = 255;
    if (this._noticeUntil > Graphics.frameCount) {
      b.fontFace = $gameSystem ? $gameSystem.mainFontFace() : "sans-serif";
      b.fontSize = 23;
      b.textColor = "#a3435b";
      b.outlineColor = "rgba(255,255,255,0.85)";
      b.outlineWidth = 3;
      b.drawText(this._loadError ? "저장 파일을 불러오지 못했습니다." : "저장 파일이 없습니다.", 560, 740, 470, 40, "center");
    }
  };

  Scene_Gameover.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    if (!this.isActive() || this.isBusy() || this._loadingSave || SceneManager.isSceneChanging()) return;
    if (Input.isTriggered("down") || Input.isTriggered("up")) {
      this._selected = 1 - this._selected;
      SoundManager.playCursor();
      this.refreshPinkUi();
    }
    const x = (TouchInput.x - this._pinkOffsetX) / this._pinkScale;
    const y = (TouchInput.y - this._pinkOffsetY) / this._pinkScale;
    if (TouchInput.isMoved()) {
      const hovered = BUTTONS.findIndex(r => hitTest(x, y, r));
      if (hovered !== -1 && hovered !== this._selected) {
        this._selected = hovered;
        SoundManager.playCursor();
        this.refreshPinkUi();
      }
    }
    if (TouchInput.isTriggered()) {
      const clicked = BUTTONS.findIndex(r => hitTest(x, y, r));
      if (clicked !== -1) {
        this._selected = clicked;
        this.activatePinkButton();
      }
    } else if (Input.isTriggered("ok")) {
      this.activatePinkButton();
    }
    if (this._noticeUntil && Graphics.frameCount >= this._noticeUntil) {
      this._noticeUntil = 0;
      this.refreshPinkUi();
    }
  };

  Scene_Gameover.prototype.activatePinkButton = function() {
    if (this._selected === 0) {
      SoundManager.playOk();
      this.fadeOutAll();
      newVillageGame();
    } else if (DataManager.isAnySavefileExists()) {
      this._loadingSave = true;
      const savefileId = DataManager.latestSavefileId();
      DataManager.loadGame(savefileId).then(() => {
        SoundManager.playLoad();
        this.fadeOutAll();
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
          $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
          $gamePlayer.requestMapReload();
        }
        $gameSystem.onAfterLoad();
        SceneManager.goto(Scene_Map);
      }).catch(error => {
        console.error("PinkGameOver: save load failed", error);
        this._loadingSave = false;
        SoundManager.playBuzzer();
        this._noticeUntil = Graphics.frameCount + 120;
        this._loadError = true;
        this.refreshPinkUi();
      });
    } else {
      SoundManager.playBuzzer();
      this._noticeUntil = Graphics.frameCount + 120;
      this._loadError = false;
      this.refreshPinkUi();
    }
  };
})();
