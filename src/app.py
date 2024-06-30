from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from game_controller import GameController
import whisper

load_dotenv()

app = Flask(__name__)
model = whisper.load_model("base")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/action", methods=["POST"])
def action():

    # Whisperで音声認識を行う
    audio = request.files["audio"]
    audio.save("tmp/temp.wav")
    result = model.transcribe("tmp/temp.wav")
    text = result["text"]

    # LangChainでアクションを決定する
    controller = GameController()
    response = controller.execute_command(text)

    return jsonify({"message": response})


if __name__ == "__main__":
    app.run(debug=True)
