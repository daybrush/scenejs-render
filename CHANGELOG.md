# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.15.0 (2023-01-19)
### :sparkles: Packages
* `@scenejs/recorder` 0.15.0
* `@scenejs/render` 0.15.0


### :rocket: New Features

* All
    * add recorder ([d84e97a](https://github.com/daybrush/scenejs-render/commit/d84e97a737a08f1f0b39a6cc49b68ad6bfc9b7e6))
    * add recorder demo ([4e64808](https://github.com/daybrush/scenejs-render/commit/4e648080b4dd6d13232ad1fe1b388073289b510a))
    * add setAnimator options ([048102b](https://github.com/daybrush/scenejs-render/commit/048102b1d2f220367d4262e7aaeffe42141858a1))
    * setFetchFile ([4a394d8](https://github.com/daybrush/scenejs-render/commit/4a394d86fcdda6bf1d76492a2b40db900c8fd374))
* `@scenejs/render`
    * add ffmpegPath option ([fe3f91b](https://github.com/daybrush/scenejs-render/commit/fe3f91bc11fa99d386f8f27cf2bf15d2f09e34a1))
    * add render-core ([94bf5ec](https://github.com/daybrush/scenejs-render/commit/94bf5ec60011d384653129560bf8d4315825b4be))
    * use recorder ([b6a9f6d](https://github.com/daybrush/scenejs-render/commit/b6a9f6d919d14563fdebfcbe844dea507c064b7d))
* `@scenejs/recorder`
    * add recorder events ([a01b5b6](https://github.com/daybrush/scenejs-render/commit/a01b5b6ce0b72c5bfdbb5eee5e6b4448b46474c8))
    * add state ([3fbe8e6](https://github.com/daybrush/scenejs-render/commit/3fbe8e6ac868d22b7e60fc6f78531aa6fc464020))
* Other
    * add cache option ([445e2d2](https://github.com/daybrush/scenejs-render/commit/445e2d26e32438f885e3054937d8bd46050595c0))
    * add cacheFolder arg #19 ([2491c54](https://github.com/daybrush/scenejs-render/commit/2491c54ab3eb24e317e3104e90ea5923add14727))
    * add codec option ([215c559](https://github.com/daybrush/scenejs-render/commit/215c559ee96632e41619aac12db26fb08538b146))
    * add ffmpegPath ([c689b10](https://github.com/daybrush/scenejs-render/commit/c689b108dab5a737bba26e4e9455483eb744af73))
    * add imageType, alpha ([3ce5d94](https://github.com/daybrush/scenejs-render/commit/3ce5d94b8dcbf4f097cbf54491f38d1e33a53180))
    * add input url address ([23b3b8d](https://github.com/daybrush/scenejs-render/commit/23b3b8d7c1d2ac7d1205cebbbebf0e7fc133ad7e))
    * add multiprocess option ([7994e00](https://github.com/daybrush/scenejs-render/commit/7994e009a5245c821f73689d695b37a9dceb6e68))
    * add referer option ([4426374](https://github.com/daybrush/scenejs-render/commit/442637486dedd44e47ff6d18ec286d5ee4b34776))
    * add Renderer module ([e0c9c8c](https://github.com/daybrush/scenejs-render/commit/e0c9c8cff5f3d7317303640656950829e2d974fe))
    * add Renederer class ([d6af158](https://github.com/daybrush/scenejs-render/commit/d6af1589637742186bafab057c5e70d207288b67))
    * add scale option ([a0974b4](https://github.com/daybrush/scenejs-render/commit/a0974b41e64bb67432fc222488290c3d5ed2454d))
    * add useragent ([fccb175](https://github.com/daybrush/scenejs-render/commit/fccb175d8461f7cbf8e3c7c646cfcdddfe58c963))
    * fix duration and add iteration option ([3b6fb95](https://github.com/daybrush/scenejs-render/commit/3b6fb95719469ecaf6a9da3c40f625ce9003958e))
    * sendMessage for process ([a798cdc](https://github.com/daybrush/scenejs-render/commit/a798cdc490e4b98185d9db74589cab490bae416e))
    * support mediascene for mp3 ([fb353fc](https://github.com/daybrush/scenejs-render/commit/fb353fc4ccfe50f8d15eb708d57db0d4918910ea))
    * support webm code and add bitrate option ([ec7b638](https://github.com/daybrush/scenejs-render/commit/ec7b6382640b1ed6d61ef478fb01d2c8495257a2))
    * update modules ([865bf13](https://github.com/daybrush/scenejs-render/commit/865bf139562702394b69b209358a55291c1e82ed))


### :bug: Bug Fix

* `@scenejs/recorder`
    * fix amix volume #24 ([944b55f](https://github.com/daybrush/scenejs-render/commit/944b55fe32da9ac3149347aa5d7e043e6c19386e))
    * fix Recorder accessor ([b9a735a](https://github.com/daybrush/scenejs-render/commit/b9a735a338efe9002f6f68fae04a3db97f03a3bf))
* Other
    * add FFMPEG_PATH env ([6e019a4](https://github.com/daybrush/scenejs-render/commit/6e019a418951786c8b639b52bce0664b38ec9133))
    * add types ([4108055](https://github.com/daybrush/scenejs-render/commit/41080552c0335996f31b2e7c6186a1ab21021e65))
    * change multiprocess to multi ([5c98211](https://github.com/daybrush/scenejs-render/commit/5c9821183ba05698e477b031833318931ab4f938))
    * convert TypeScript ([7a836e8](https://github.com/daybrush/scenejs-render/commit/7a836e8abfeac3a1826d98ff55fc532f82c122e3))
    * fix audio channel count ([e06d86d](https://github.com/daybrush/scenejs-render/commit/e06d86d9413dbd6a179e590e518226f3135737e0))
    * fix build config ([35350c7](https://github.com/daybrush/scenejs-render/commit/35350c7bc5d5c38299e5b0c87e42f70856f67c8e))
    * fix default resolution ([67b1a7f](https://github.com/daybrush/scenejs-render/commit/67b1a7f923b01d1898f9a1f503d4b3936c78e701))
    * fix exit code and split module ([a050075](https://github.com/daybrush/scenejs-render/commit/a05007549013c2f887693ed13f66083edeac2f0b))
    * fix frame number for startTime #15 ([af04ac4](https://github.com/daybrush/scenejs-render/commit/af04ac482c275bc4e5e9e6fe3e006adc9d6d57b6))
    * fix lerna options ([4b3b8fd](https://github.com/daybrush/scenejs-render/commit/4b3b8fd89203f30fc63bfe524cbed971b18d8063))
    * fix media info ([8fdbb3c](https://github.com/daybrush/scenejs-render/commit/8fdbb3ca9edb4f9b30753029db760f5e69b37b82))
    * Fix media url ([0d651e9](https://github.com/daybrush/scenejs-render/commit/0d651e9c47286b9510d0bacc55868693211b6c48))
    * fix no sandbox issue #9 ([534c596](https://github.com/daybrush/scenejs-render/commit/534c596ecd262174b98cc583b817df4cab03519c))
    * fix openPage bug ([97b6a22](https://github.com/daybrush/scenejs-render/commit/97b6a22188c39984cbabc49f97ae0922f3808edc))
    * fix package and add examples ([eab6403](https://github.com/daybrush/scenejs-render/commit/eab64035935da53be1329bf1a9810f4143014d8a))
    * fix README ([b27886e](https://github.com/daybrush/scenejs-render/commit/b27886e753bffaa463df1692cfce7fa2afec2a1f))
    * fix README ([dbc4c8e](https://github.com/daybrush/scenejs-render/commit/dbc4c8e5cbe1fa2c732cf6fe742aa6e3d9cd10fc))
    * fix README ([08f4e66](https://github.com/daybrush/scenejs-render/commit/08f4e664918556740487a43eed8e326018740115))
    * fix README ([e6f1ec8](https://github.com/daybrush/scenejs-render/commit/e6f1ec814abfc400383933e2031fa421d55a93d4))
    * fix README ([db7ee75](https://github.com/daybrush/scenejs-render/commit/db7ee757824be1f0f5542e6c855da68696434f9e))
    * fix recordMedia for updated @scenejs/media ([1a64901](https://github.com/daybrush/scenejs-render/commit/1a64901fcebffc85d15ad84d5a22bf07d0ea03a4))
    * fix scale ([c5e551f](https://github.com/daybrush/scenejs-render/commit/c5e551fb6fd63a2cba427976f153ba6be1e44e97))
    * fix seeking timing issue #14 ([bd315dc](https://github.com/daybrush/scenejs-render/commit/bd315dcd17621396ca8ec6112b244e002ea8aaf0))
    * fix setTime loop ([bc2c46f](https://github.com/daybrush/scenejs-render/commit/bc2c46ff4ee6a3f22c0ee78c72d9db17d78e596a))
    * fix type ([33e546c](https://github.com/daybrush/scenejs-render/commit/33e546c3da0abde0294105b9a7be45633f1a3c1c))
    * fix types ([d288e38](https://github.com/daybrush/scenejs-render/commit/d288e38fa410c7ce84dba329cf55f76454a28599))
    * split modules & functions ([11c0de9](https://github.com/daybrush/scenejs-render/commit/11c0de9e66f6f315729dc8dec5086b6fc7602f00))
    * update packages ([e3dd183](https://github.com/daybrush/scenejs-render/commit/e3dd183435c5d5a9ac6d2b326a860671a78a7ccb))


### :memo: Documentation

* All
    * fix README ([25e0795](https://github.com/daybrush/scenejs-render/commit/25e0795c00f1d87bdf6c6625e2f1856052b6f9b6))
    * fix README ([9dbae78](https://github.com/daybrush/scenejs-render/commit/9dbae78daaecc0ae08948f56ca44efd83fd911c7))
    * fix README ([9d368bf](https://github.com/daybrush/scenejs-render/commit/9d368bff00c679181d5a902c3daeb818a257911d))
* `@scenejs/recorder`
    * add docs ([5d27ee9](https://github.com/daybrush/scenejs-render/commit/5d27ee9604af7c84ad824e1a10f9219ac7222989))
* `@scenejs/render`
    * fix README ([3352c1c](https://github.com/daybrush/scenejs-render/commit/3352c1cd679d296fdaa2e3878ae99ef51a295f58))
    * move paths ([aa10170](https://github.com/daybrush/scenejs-render/commit/aa10170927c415edfa2f0f519a2f71c2449355fc))


### :mega: Other

* All
    * publish packages ([551ae6d](https://github.com/daybrush/scenejs-render/commit/551ae6d9b65c77dcd85307fc8c8eab9ae0129703))
    * publish packages ([6278907](https://github.com/daybrush/scenejs-render/commit/6278907961dea2fbce948d83e437c2abcd313f79))
    * publish packages ([2eb076e](https://github.com/daybrush/scenejs-render/commit/2eb076ec637830a8a6b226d4999d7fd2b6c41146))
* Other
    * remove ffmpeg ([889363a](https://github.com/daybrush/scenejs-render/commit/889363ae3de7419b2f6dd6213a1c1680db777561))
