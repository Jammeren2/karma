from flask import Flask, jsonify
import json
import subprocess
import threading
import time
from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
# Загружаем данные из файла
def load_group_data():
    with open('group_data.json', 'r', encoding='utf-8') as f:
        return json.load(f)

# Запускаем get_info.py и обновляем данные
def update_data():
    while True:
        try:
            print("Запускаю get_info.py для обновления данных...")
            subprocess.run(["python", "get_info.py"], check=True)
            print("Данные успешно обновлены!")
        except Exception as e:
            print(f"Ошибка при обновлении данных: {e}")
        time.sleep(600)  # 10 минут = 600 секунд

# Запускаем фоновый поток для обновления данных
def start_update_thread():
    thread = threading.Thread(target=update_data, daemon=True)
    thread.start()

@app.route('/api/group', methods=['GET'])
def get_group_data():
    return jsonify(load_group_data())

if __name__ == '__main__':
    start_update_thread()  # Запускаем автообновление
    app.run(port=8453, host='0.0.0.0')  # Запускаем Flask