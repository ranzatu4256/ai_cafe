#!/usr/bin/env python3
from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # すべてのオリジンからのリクエストを許可する場合

# 特定のオリジンのみ許可する場合(例)
#CORS(app, resources={r"/get_end_col": {"origins": "http://127.0.0.1:5000"}})

# ここにendColの値を管理する変数
endCol = 12  # 初期値

@app.route('/get_end_col')
def get_end_col():
    global endCol
    # ここでendColを更新する処理を入れる。例ではランダムな値を返す
    endCol = random.randint(3,6)
    print(endCol)
    return jsonify({'endCol': endCol})

if __name__ == '__main__':
    app.run(debug=True)
