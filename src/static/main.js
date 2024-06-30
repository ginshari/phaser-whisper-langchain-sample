const SETTINGS = {
  PLAYER_SIZE: 64,
  MOVE_DISTANCE: 64,
};

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    create: create,
  },
};

const game = new Phaser.Game(config);
let recText;
let player;
let audioChunks = [];

function create() {

  // 画面右上に表示する「SPACE:録音開始」テキストを配置
  this.add.text(790, 10, 'SPACE:録音開始', { fontSize: 32, fill: '#fff' })
    .setOrigin(1, 0)
    .setPadding({
      top: 10,
    });

  // 録音中に表示する「●REC」テキストを配置
  recText = this.add.text(10, 10, '●REC', { fontSize: 32, fill: '#f00' })
    .setOrigin(0, 0)
    .setVisible(false);

  // プレイヤーを配置
  player = this.add
    .text(400, 300, "😊", { fontSize: SETTINGS.PLAYER_SIZE, fill: "#000" })
    .setOrigin(0.5)
    .setStyle({ align: "center" })
    .setPadding({
      top: SETTINGS.PLAYER_SIZE / 4,
      bottom: SETTINGS.PLAYER_SIZE / 4,
    });

  // スペースキーで録音開始
  this.input.keyboard.on("keydown-SPACE", startRecording);

  // 録音の準備
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        recText.setVisible(false);
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioChunks = [];
        sendAudioToServer(audioBlob);
      };
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// 2秒間録音する
function startRecording() {
  if (mediaRecorder && mediaRecorder.state === "inactive") {
    recText.setVisible(true);
    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
    }, 2000);
  }
}

// サーバーに録音データを送信する
async function sendAudioToServer(blob) {
  const formData = new FormData();
  formData.append("audio", blob);

  try {
    const response = await fetch("/api/action", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    movePlayer(data.message);
  } catch (error) {
    console.error("Error:", error);
  }
}

// レスポンスに応じてプレイヤーを移動させる
function movePlayer(message) {
  if (message === "move-up") {
    player.y -= SETTINGS.MOVE_DISTANCE;
  } else if (message === "move-down") {
    player.y += SETTINGS.MOVE_DISTANCE;
  } else if (message === "move-left") {
    player.x -= SETTINGS.MOVE_DISTANCE;
  } else if (message === "move-right") {
    player.x += SETTINGS.MOVE_DISTANCE;
  } else {
    // 不明なアクションなら3秒考える
    player.setText('🤔');
    setTimeout(() => {
      player.setText('😊');
    }, 3000);
  }
}
