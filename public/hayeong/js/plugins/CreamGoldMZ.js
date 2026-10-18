/*:
 * @target MZ
 * @plugindesc v1.0 Cream & Gold theme for MZ's STANDARD windows; preserves face, name and dialogue layout.
 * @author ChatGPT
 *
 * @help
 * Install with img/system/Window.png from the same package.
 * Keep Message 'Background: Window' and 'Position: Bottom'.
 * Uses default MZ face/name window position, choice mechanics, text flow.
 * DISABLE older custom dialogue plugins first (CozyVNFixed, etc.).
 * This plugin only restyles text/tone/opacity. Does not move windows.
 *
 * @param textColor
 * @text Default text color
 * @type string
 * @default #49382D
 *
 * @param systemColor
 * @text Label/system color
 * @type string
 * @default #976334
 *
 * @param outlineColor
 * @text Text outline color
 * @type string
 * @default rgba(255,250,236,0.85)
 *
 * @param outlineWidth
 * @text Text outline width
 * @type number
 * @min 0
 * @max 8
 * @default 2
 *
 * @param opaqueBackground
 * @text Keep window background fully opaque
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param neutralTone
 * @text Ignore game window tint
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 */
(() => {
    'use strict';
    const params = PluginManager.parameters('CreamGoldMZ');
    const textColor = String(params.textColor || '#49382D');
    const systemColor = String(params.systemColor || '#976334');
    const outlineColor = String(params.outlineColor || 'rgba(255,250,236,0.85)');
    const outlineWidth = Math.max(0, Math.min(8, Number(params.outlineWidth ?? 2)));
    const opaqueBackground = String(params.opaqueBackground ?? 'true') === 'true';
    const neutralTone = String(params.neutralTone ?? 'true') === 'true';

    // ColorManager is MZ's standard source for normal and system text colors.
    ColorManager.normalColor = function() { return textColor; };
    ColorManager.systemColor = function() { return systemColor; };
    ColorManager.outlineColor = function() { return outlineColor; };

    const _resetFontSettings = Window_Base.prototype.resetFontSettings;
    Window_Base.prototype.resetFontSettings = function() {
        _resetFontSettings.call(this);
        if (this.contents) {
            this.contents.outlineWidth = outlineWidth;
            this.contents.outlineColor = outlineColor;
        }
    };

    if (opaqueBackground) {
        const _updateBackOpacity = Window_Base.prototype.updateBackOpacity;
        Window_Base.prototype.updateBackOpacity = function() {
            _updateBackOpacity.call(this);
            this.backOpacity = 255;
        };
    }

    if (neutralTone) {
        Window_Base.prototype.updateTone = function() {
            this.setTone(0, 0, 0);
        };
    }
})();
