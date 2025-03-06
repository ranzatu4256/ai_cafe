document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('tileCanvas');
    const ctx = canvas.getContext('2d');

    // キャンバスのサイズを画面サイズに合わせる関数
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawTileMap(); // リサイズ後に再描画
        drawCharacter(); // キャラクターの描画も再実行
    }

    const tileSize = 32; // タイル１つのサイズ (ピクセル)
    const scale = 1; // 拡大率を追加(変更)
    const tileSetImage = new Image(); // タイルセット画像を格納する変数
    const characterImage = new Image(); // キャラクター画像を格納する変数 ★追加★
    const backgroundTileData = [ // 背景レイヤーのデータ (ステップ１で定義)
        [21,18,18,18,18,18,18,18,18,18,18,18,18,18],
        [29,26,26,26,26,26,26,26,26,26,26,26,26,26],
        [4,3,3,3,3,3,3,3,3,3,3,3,3,3],
        [4,3,3,3,3,3,3,3,3,3,3,3,3,3],
        [4,3,3,3,3,3,3,3,3,3,3,3,3,3],
        [4,3,3,3,3,3,3,3,3,3,3,3,3,3],
        [4,3,3,3,3,3,3,3,3,3,3,3,3,3]
    ];
    const foregroundTileData = [ // 前景レイヤーのデータ (ステップ１で定義)
        [0,0,0,0,0,0,0,0,0,0,175,176],
        [0,116,160,121,122,123,0,0,0,0,183,184],
        [0,124,168,129,130,131,0,0,0,0,191,192],
        [0,133,121,122,122,122,123,0,0,0,0],
        [0,129,130,130,130,130,131,0,0,103,97,99,102],
        [0,0,0,110,110,110,110,0,0,0,105,107],
        [0,0,0,0,0,0,0,0]
    ];
    const itemTileData = [ // 前景レイヤーのデータ (ステップ１で定義)
        [0,0,0,0,0,0,0,0],
        [0,0,0,161,162,120,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];

    // キャラクター関連の変数 ★追加★
    let characterRow = 3; // キャラクターの初期行
    let characterCol = 2; // キャラクターの初期列
    let direction = 1; // 移動方向 (1: 右, -1: 左)
    const characterSpeed = 0.05; // キャラクターの移動速度(1コマあたり進む割合）

    // キャラクターの移動範囲
    const startCol = 2
    let endCol = 12 //初期値
    const charaRow = 3

    // Pythonから受け取るendColの値を格納する変数
    let newEndCol = endCol;

    // 到達したかを管理する変数
    let hasReachedEnd = false;

     // endColの値を更新する関数
    function updateEndCol(newValue) {
        newEndCol = newValue;
    }

    // Pythonから値を受け取る関数（例：fetch APIを使う）
    // 実際の連携方法に合わせて変更してください
    function fetchEndColFromPython() {
        // Promiseを返すように変更
        return fetch('http://127.0.0.1:5000/get_end_col')
            .then(response => response.json())
            .then(data => {
                console.log("endCol updated from python:" + data.endCol);
                updateEndCol(data.endCol); // endColを更新
            })
            .catch(error => {
                console.error('Error fetching endCol:', error);
                throw error; // エラーを再スロー（呼び出し元で処理できるように）
            });
    }

    // キャラクターの描画関数 ★追加★
    function drawCharacter() {
        if (!ctx) return;

        // キャンバスの中心座標を計算
        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;

        // (拡大)
        // タイルマップの中心座標を計算
        const mapWidth = backgroundTileData[0].length * tileSize * scale; //マップの幅
        const mapHeight = backgroundTileData.length * tileSize * scale;  //マップの高さ
        const mapCenterX = mapWidth / 2; // マップの中心座標X
        const mapCenterY = mapHeight / 2; // マップの中心座標Y

        const dx = (characterCol * tileSize * scale) + canvasCenterX - mapCenterX; // 描画先のX座標 (キャンバス内)
        const dy = (characterRow * tileSize * scale) + canvasCenterY - mapCenterY; // 描画先のY座標 (キャンバス内)
        const dw = tileSize * scale;                     // 描画先の幅
        const dh = tileSize * scale;                     // 描画先の高さ
        // (拡大)

        // characterImageがタイルセットではないので、sx,sy,sw,shを削除
        ctx.drawImage(characterImage, dx, dy, dw, dh);
    }

    // キャラクターの移動を更新する関数 ★追加★
    function updateCharacterPosition() {
        characterCol += characterSpeed * direction; // speedの分だけ移動

        // 端に到達したら方向転換
        if (characterCol >= endCol + 1 - 1) {
            if (!hasReachedEnd) {
              hasReachedEnd = true;
              direction = -1;
              //Pythonとの通信を記述する
              fetchEndColFromPython().then(() => {
                  // fetchEndColFromPython が完了した後にendColを更新
                  endCol = newEndCol;
              }).then(() => {
                //endColの更新後に、reset_end_colを実行する。
                fetch('/reset_end_col')
                .then(response => {
                  console.log("/reset_end_col executed");
                })
                .catch(error => {
                    console.error('/reset_end_col error:', error);
                });
              });
            }
        } else if (characterCol <= startCol) {
            direction = 1;
            hasReachedEnd = false; // 反転したらフラグをリセット
        } else{
          hasReachedEnd = false;
        }

        drawTileMap(); // タイルマップを再描画
        //drawCharacter(); // キャラクターを再描画
        requestAnimationFrame(updateCharacterPosition); // 次のフレームで再呼び出し
    }

    // タイルセット画像の読み込み完了後に処理を開始
    tileSetImage.onload = function() {
        resizeCanvas(); // 画像読み込み完了後にキャンバスをリサイズ
    };
    tileSetImage.src = 'cafe_map/cafe_pic.png'; // タイルセット画像のファイルパス

    // キャラクター画像の読み込み完了後に処理を開始 ★追加★
    characterImage.onload = function() {
        updateCharacterPosition();
        // 初期時にendColをPythonから取得
        fetchEndColFromPython();
    };
    characterImage.src = 'cafe_map/chara.png'; // キャラクター画像のファイルパス ★画像の変更★


    // タイルマップを描画する関数 (2重レイヤー対応版)
    function drawTileMap() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア

        // キャンバスの中心座標を計算
        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;

        // 1. 背景レイヤーを描画
        for (let row = 0; row < backgroundTileData.length; row++) {
            for (let col = 0; col < backgroundTileData[row].length; col++) {
                const tileIndex = backgroundTileData[row][col];
                drawTile(tileIndex, row, col, canvasCenterX, canvasCenterY); // タイル描画関数を呼び出す
            }
        }
        drawCharacter(); // キャラクターを再描画

        // 2. 前景レイヤーを描画 (背景レイヤーの上に重ねて描画)
        for (let row = 0; row < foregroundTileData.length; row++) {
            for (let col = 0; col < foregroundTileData[row].length; col++) {
                const tileIndex = foregroundTileData[row][col];
                if (tileIndex > 0) { // 透明なタイル (0) 以外の場合のみ描画
                    drawTile(tileIndex, row, col, canvasCenterX, canvasCenterY); // タイル描画関数を呼び出す
                }
            }
        }

        // 3. 最前列レイヤーを描画 (背景レイヤーの上に重ねて描画)
        for (let row = 0; row < itemTileData.length; row++) {
            for (let col = 0; col < itemTileData[row].length; col++) {
                const tileIndex = itemTileData[row][col];
                if (tileIndex > 0) { // 透明なタイル (0) 以外の場合のみ描画
                    drawTile(tileIndex, row, col, canvasCenterX, canvasCenterY); // タイル描画関数を呼び出す
                }
            }
        }
    }

    // タイルを1つ描画する関数 (共通化)
    function drawTile(tileIndex, row, col, canvasCenterX, canvasCenterY) {
        if (!ctx) return;

        const tilesPerRow = 8; // タイルセット画像の横方向のタイル数 (★追加★)

        // タイルセット画像からタイルを切り出す座標を計算
        const tileCol = (tileIndex - 1) % tilesPerRow; // タイルセット内での列番号 (0始まり) (★変更★)
        const tileRow = Math.floor((tileIndex - 1) / tilesPerRow); // タイルセット内での行番号 (0始まり) (★追加★)

        const sx = tileCol * tileSize; // 切り出すタイルのX座標 (タイルセット内) (★変更★)
        const sy = tileRow * tileSize; // 切り出すタイルのY座標 (タイルセット内) (★変更★)
        const sw = tileSize; // 切り出すタイルの幅
        const sh = tileSize; // 切り出すタイルの高さ

        // (拡大)
        // タイルマップの中心座標を計算
        const mapWidth = backgroundTileData[0].length * tileSize * scale; //マップの幅
        const mapHeight = backgroundTileData.length * tileSize * scale; //マップの高さ
        const mapCenterX = mapWidth / 2; // マップの中心座標X
        const mapCenterY = mapHeight / 2; // マップの中心座標Y

        //タイル描画座標の計算。キャンバス中心からマップ中心をずらして描画
        const dx = (col * tileSize * scale) + canvasCenterX - mapCenterX; // 描画先のX座標 (キャンバス内)
        const dy = (row * tileSize * scale) + canvasCenterY - mapCenterY; // 描画先のY座標 (キャンバス内)
        const dw = tileSize * scale; // 描画先の幅
        const dh = tileSize * scale; // 描画先の高さ
        // (拡大)

        ctx.drawImage(
            tileSetImage, // 描画する画像 (タイルセット画像)
            sx, sy, sw, sh, // 切り出す範囲 (タイルセット画像内)
            dx, dy, dw, dh  // 描画先の位置とサイズ (キャンバス内)
        );
    }

    // ウィンドウのリサイズイベントを監視
    window.addEventListener('resize', resizeCanvas);
});