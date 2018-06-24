/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

import {SVGDocumentWrapper} from "./svg/SVGDocumentWrapper";
import {Presentation} from "./model/Presentation";
import {Viewport} from "./player/Viewport";
import {Player} from "./player/Player";
import * as Media from "./player/Media";
import * as FrameList from "./player/FrameList";
import * as FrameNumber from "./player/FrameNumber";
import * as FrameURL from "./player/FrameURL";

window.addEventListener("load", function () {
    const svgRoot = document.querySelector("svg");
    const videoRoot = document.querySelector("video");
    svgRoot.style.display = "inline";

    SVGDocumentWrapper.init(svgRoot);
    Presentation.init().setSVGDocument(SVGDocumentWrapper);
    Viewport.init(Presentation, false).onLoad();

    Presentation.fromStorable(window.soziPresentationData);
    Player.init(Viewport, Presentation);

    Media.init(Player);
    FrameList.init(Player);
    FrameNumber.init(Player);
    FrameURL.init(Player);

    window.sozi = {
        presentation: Presentation,
        viewport: Viewport,
        player: Player
    };

    Player.addListener("stateChange", () => {
        if (Player.playing) {
            document.title = Presentation.title;
        }
        else {
            document.title = Presentation.title + " (Paused)";
        }
    });

    window.addEventListener('resize', () => Viewport.repaint());

    if (Presentation.frames.length) {
        Player.playFromFrame(FrameURL.getFrame());
    }

    Viewport.repaint();
    Player.disableBlankScreen();

    document.querySelector(".sozi-blank-screen .spinner").style.display = "none";
    
    let videoUrl = window.sozi.presentation.video;

    if (videoUrl) {
        let presentation = window.sozi.presentation;
        let player = window.sozi.player;
        let videoElement = document.querySelector("#sozi-video");

        videoElement.querySelector("source").setAttribute("src", videoUrl);
        videoElement.load();
        videoElement.addEventListener("pause", () => player.pause());
        videoElement.addEventListener("play", () => player.resume());
        videoElement.style.width = presentation.videoWidth + "px";
        videoElement.style.height = presentation.videoHeight + "px";
        videoElement.style.position = "absolute";
        videoElement.style.display = "block";
        player.pause();

        if (presentation.videoPosition == 0) { 
            videoElement.style.top = "0px";
            videoElement.style.left = "0px";
        } else if(presentation.videoPosition == 1) {
            videoElement.style.top = "0px";
            videoElement.style.right = "0px";
        } else if(presentation.videoPosition == 2) {
            videoElement.style.bottom = "0px";
            videoElement.style.left = "0px";
        } else if(presentation.videoPosition == 3) {
            videoElement.style.bottom = "0px";
            videoElement.style.right = "0px";
        }
    }
});
