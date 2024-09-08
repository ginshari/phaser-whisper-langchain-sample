from langchain_openai import ChatOpenAI
import os


class GameController:
    def __init__(self):
        # LLMの初期化
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        CHATGPT_MODEL = os.getenv("CHATGPT_MODEL")
        self.model = ChatOpenAI(
            openai_api_key=OPENAI_API_KEY, model=CHATGPT_MODEL, temperature=0
        )
        # 関数呼び出し用の辞書
        self.available_functions = {
            "move_up": self.move_up,
            "move_down": self.move_down,
            "move_left": self.move_left,
            "move_right": self.move_right,
        }

    def move_up(self):
        return "move-up"

    def move_down(self):
        return "move-down"

    def move_left(self):
        return "move-left"

    def move_right(self):
        return "move-right"

    # 入力テキストに応じた関数を呼び出す
    def execute_command(self, user_message):
        # 利用できる関数の説明書
        functions = [
            {"name": "move_up", "description": "Move the player up"},
            {"name": "move_down", "description": "Move the player down"},
            {"name": "move_left", "description": "Move the player left"},
            {"name": "move_right", "description": "Move the player right"},
        ]
        message = self.model.invoke([user_message], functions=functions)
        function_call = message.additional_kwargs.get("function_call")
        if function_call:
            # 判断できた場合は関数を呼び出す
            function_name = function_call["name"]
            response = self.available_functions[function_name]()
            return response
        else:
            # 判断できない場合はunknownを返す
            return "unknown"
