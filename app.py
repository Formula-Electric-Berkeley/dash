from flask import Flask
import db

app = Flask(__name__)


@app.route("/")
def index():
    return "DASH"


if __name__ == "__main__":
    app.run(port=8000)
