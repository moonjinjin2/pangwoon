/*:
 * @target MZ
 * @plugindesc v2.0 Cream fantasy dialogue: fitted portrait, integrated name, no default frames.
 * @author ChatGPT
 *
 * @help
 * [Korean / 한국어]
 * 1. CozyVNFrame.png -> img/pictures/
 * 2. CozyVNFixed.js -> js/plugins/
 * 3. Disable old dialogue plugins (CozyPortraitDialogue, VNPortraitUI).
 * 4. Plugin Manager -> CozyVNFixed -> ON.
 * 5. Event > Show Text (문장의 표시): choose face, speaker name, Window, Bottom.
 *    The name is printed on the PNG nameplate; the stock namebox is hidden.
 *    The stock blue border and pause triangle are hidden.
 * 6. Requires RPG Maker MZ. Designed for 816x624; fits narrower resolutions.
 *
 * Name is taken from $gameMessage.speakerName().
 * Faces use img/faces/ standard sheets (144x144 per face, eight per sheet).
 * Do not use other message-window plugins simultaneously.
 * The PNG face aperture is transparent, so the sprite is drawn BEHIND the frame.
 *
 * @param frameImage
 * @text 대화창 PNG 파일
 * @type file
 * @dir img/pictures/
 * @default CozyVNFrame
 *
 * @param faceX
 * @text 초상화 X
 * @type number
 * @default 29
 *
 * @param faceY
 * @text 초상화 Y
 * @type number
 * @default 40
 *
 * @param faceSize
 * @text 초상화 크기
 * @type number
 * @min 50
 * @default 130
 *
 * @param nameX
 * @text 이름표 글자 X
 * @type number
 * @default 181
 *
 * @param nameY
 * @text 이름표 글자 Y
 * @type number
 * @default 5
 *
 * @param nameWidth
 * @text 이름표 글자 영역 너비
 * @type number
 * @default 205
 *
 * @param nameFontSize
 * @text 이름 글자 크기
 * @type number
 * @default 22
 *
 * @param textX
 * @text 대사 시작 X (내용 좌표)
 * @type number
 * @default 196
 *
 * @param textY
 * @text 대사 시작 Y (내용 좌표)
 * @type number
 * @default 54
 *
 * @param textFontSize
 * @text 대사 글자 크기
 * @type number
 * @default 24
 *
 * @param lineHeight
 * @text 한 줄 높이
 * @type number
 * @default 30
 */
(() => {
    'use strict';

    const PLUGIN = 'CozyVNFixed';
    const p = PluginManager.parameters(PLUGIN);
    const frameName = String(p.frameImage || 'CozyVNFrame');
    const number = (key, fallback) => {
        const n = Number(p[key]);
        return Number.isFinite(n) && p[key] !== undefined && p[key] !== '' ? n : fallback;
    };
    const cfg = {
        faceX: number('faceX', 29),
        faceY: number('faceY', 40),
        faceSize: number('faceSize', 130),
        nameX: number('nameX', 181),
        nameY: number('nameY', 5),
        nameWidth: number('nameWidth', 205),
        nameFontSize: number('nameFontSize', 22),
        textX: number('textX', 196),
        textY: number('textY', 54),
        textFontSize: number('textFontSize', 24),
        lineHeight: number('lineHeight', 30)
    };
    const scaleOf = window => window.width / 816;
    const scaled = (value, scale) => Math.round(value * scale);

    // One window whose dimensions match the 816x210 PNG; centered if game is wider.
    const _messageWindowRect = Scene_Message.prototype.messageWindowRect;
    Scene_Message.prototype.messageWindowRect = function() {
        const r = _messageWindowRect.call(this);
        const s = Math.min(1, Graphics.boxWidth / 816, Graphics.boxHeight / 230);
        r.width = Math.round(816 * s);
        r.height = Math.round(210 * s);
        r.x = Math.floor((Graphics.boxWidth - r.width) / 2);
        // RPG Maker MZ's Window_Message.updatePlacement() positions Y by event setting.
        return r;
    };

    const _messageInitialize = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function(rect) {
        _messageInitialize.call(this, rect);
        this._cozyVN = true;
        const s = scaleOf(this);

        // Sprite drawing order, bottom -> top: cream placeholder, face, frame, text/name.
        // addChildToBack inserts in reverse, so the following order matters.
        this._cozyNameSprite = new Sprite(new Bitmap(scaled(cfg.nameWidth, s), scaled(50, s)));
        this._cozyNameSprite.x = scaled(cfg.nameX, s);
        this._cozyNameSprite.y = scaled(cfg.nameY, s);
        this.addChild(this._cozyNameSprite); // Above message frame, within nameplate.

        this._cozyFrame = new Sprite(ImageManager.loadPicture(frameName));
        this._cozyFrame.scale.set(s, s);
        this.addChildToBack(this._cozyFrame);

        this._cozyPortrait = new Sprite();
        this._cozyPortrait.x = scaled(cfg.faceX, s);
        this._cozyPortrait.y = scaled(cfg.faceY, s);
        this.addChildToBack(this._cozyPortrait);

        const blank = new Bitmap(Math.ceil(cfg.faceSize), Math.ceil(cfg.faceSize));
        blank.fillAll('#fff8e8');
        this._cozyFaceBlank = new Sprite(blank);
        this._cozyFaceBlank.x = scaled(cfg.faceX, s);
        this._cozyFaceBlank.y = scaled(cfg.faceY, s);
        this._cozyFaceBlank.scale.set(s, s);
        this.addChildToBack(this._cozyFaceBlank);

        this.opacity = 0;
        this.backOpacity = 0;
    };

    // MZ calls updateBackground when a new message starts; it can restore opacity.
    // Hide it *each time*, not only inside initialize.
    const _messageUpdateBackground = Window_Message.prototype.updateBackground;
    Window_Message.prototype.updateBackground = function() {
        _messageUpdateBackground.call(this);
        this.opacity = 0;
        this.backOpacity = 0;
        if (this._dimmerSprite) this._dimmerSprite.visible = false;
    };

    const _messageUpdate = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        _messageUpdate.call(this);
        this.opacity = 0;
        this.backOpacity = 0;
        if (this._dimmerSprite) this._dimmerSprite.visible = false;
        if (this._pauseSignSprite) this._pauseSignSprite.visible = false;
        const alpha = this.visible ? this.openness / 255 : 0;
        if (this._cozyFrame) this._cozyFrame.alpha = alpha;
        if (this._cozyPortrait) this._cozyPortrait.alpha = alpha;
        if (this._cozyFaceBlank) this._cozyFaceBlank.alpha = alpha;
        if (this._cozyNameSprite) this._cozyNameSprite.alpha = alpha;
    };

    // Faces are composed as sprites BEHIND the PNG, so the border masks the edges.
    Window_Message.prototype.cozyRefreshPortrait = function() {
        const faceName = $gameMessage.faceName();
        const index = $gameMessage.faceIndex();
        const sprite = this._cozyPortrait;
        if (!sprite) return;
        if (!faceName) {
            sprite.visible = false;
            sprite.bitmap = null;
            return;
        }
        const fw = ImageManager.faceWidth;
        const fh = ImageManager.faceHeight;
        const s = scaleOf(this);
        sprite.bitmap = ImageManager.loadFace(faceName);
        sprite.setFrame((index % 4) * fw, Math.floor(index / 4) * fh, fw, fh);
        sprite.scale.set(cfg.faceSize * s / fw, cfg.faceSize * s / fh);
        sprite.visible = true;
    };

    // Draw speaker names in the integrated ivory nameplate, not in Window_NameBox.
    Window_Message.prototype.cozyRefreshName = function() {
        if (!this._cozyNameSprite) return;
        const bmp = this._cozyNameSprite.bitmap;
        const s = scaleOf(this);
        bmp.clear();
        const name = String($gameMessage.speakerName() || '');
        if (!name) return;
        bmp.fontFace = $gameSystem.mainFontFace();
        bmp.fontSize = scaled(cfg.nameFontSize, s);
        bmp.fontBold = true;
        bmp.textColor = '#63452e';
        bmp.outlineColor = 'rgba(255, 249, 230, 0.75)';
        bmp.outlineWidth = 2;
        bmp.drawText(name, 0, 0, bmp.width, bmp.height, 'center');
    };

    const _messageStart = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _messageStart.call(this);
        this.cozyRefreshPortrait();
        this.cozyRefreshName();
    };

    // The original drawMessageFace paints on top of decorations and spills out.
    // The custom Sprite above replaces it. No change to other windows' face drawing.
    Window_Message.prototype.drawMessageFace = function() {};

    // Body text begins to the right of the portrait, whether a face is present or not.
    Window_Message.prototype.newLineX = function(_textState) {
        return scaled(cfg.textX, scaleOf(this));
    };

    const _messageNewPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
        _messageNewPage.call(this, textState);
        const s = scaleOf(this);
        textState.x = scaled(cfg.textX, s);
        textState.left = textState.x;     // MZ uses left on newline.
        textState.startX = textState.x;   // Kept for alternative MZ text addons.
        textState.y = scaled(cfg.textY, s);
        textState.startY = textState.y;
    };

    const _messageLineHeight = Window_Message.prototype.lineHeight;
    Window_Message.prototype.lineHeight = function() {
        return this._cozyVN ? scaled(cfg.lineHeight, scaleOf(this)) : _messageLineHeight.call(this);
    };

    const _messageResetFont = Window_Message.prototype.resetFontSettings;
    Window_Message.prototype.resetFontSettings = function() {
        _messageResetFont.call(this);
        if (this._cozyVN && this.contents) {
            this.contents.fontSize = scaled(cfg.textFontSize, scaleOf(this));
            this.contents.textColor = '#503a2a';
            this.contents.outlineColor = 'rgba(255,248,233,0.75)';
            this.contents.outlineWidth = 2;
        }
    };

    // Block the original separate MZ name box entirely; names are drawn above.
    const _nameUpdate = Window_NameBox.prototype.update;
    Window_NameBox.prototype.update = function() {
        _nameUpdate.call(this);
        if (this._messageWindow && this._messageWindow._cozyVN) {
            this.visible = false;
            this.opacity = 0;
            this.backOpacity = 0;
            this.contentsOpacity = 0;
        }
    };
})();
