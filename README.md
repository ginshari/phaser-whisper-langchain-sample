## 前提
- Pythonがインストール済であること
- Poetryがインストール済であること
- FFmpegがインストール済であること

## 準備

アプリインストール

```bash
poetry install --no-root
```

.envを作成

```dotenv
OPENAI_API_KEY={YOUR_API_KEY}
```

## 起動

```bash
poetry run python ./src/app.py
```

## 操作方法
スペースキー : 録音を開始

入力した音声を元に、プレイヤーが上下左右に動きます  
内容が理解できなかった場合はプレイヤーが考え込みます

## スクリーンショット
![20240703-1](https://github.com/ginshari/phaser-whisper-langchain-sample/assets/55611279/c5b4cecd-4fb4-4d06-b19d-dd3fa4224fac)
