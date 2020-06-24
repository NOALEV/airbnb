"use strict";
var ɵngcc0 = require('@angular/core');
var ɵngcc1 = require('@angular/common');
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var embed_video_service_1 = require("./src/embed-video.service");
__export(require("./src/embed-video.service"));
var EmbedVideo = /** @class */ (function () {
    function EmbedVideo() {
    }
    EmbedVideo_1 = EmbedVideo;
    EmbedVideo.forRoot = function () {
        return {
            ngModule: EmbedVideo_1,
            providers: [embed_video_service_1.EmbedVideoService]
        };
    };
    var EmbedVideo_1;
EmbedVideo.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: EmbedVideo });
EmbedVideo.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function EmbedVideo_Factory(t) { return new (t || EmbedVideo)(); }, providers: [embed_video_service_1.EmbedVideoService], imports: [[common_1.CommonModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(EmbedVideo, { imports: [ɵngcc1.CommonModule] }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(EmbedVideo, [{
        type: core_1.NgModule,
        args: [{
                imports: [common_1.CommonModule],
                declarations: [],
                exports: [],
                providers: [embed_video_service_1.EmbedVideoService]
            }]
    }], function () { return []; }, null); })();
    return EmbedVideo;
}());
exports.EmbedVideo = EmbedVideo;

//# sourceMappingURL=index.js.map