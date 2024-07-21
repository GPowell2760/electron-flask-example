from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/api/message", methods=["GET"])
def get_message():
    return jsonify({"message": "Hello from Flask!"})


if __name__ == "__main__":
    app.run(port=8000)
