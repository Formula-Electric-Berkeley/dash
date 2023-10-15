from flask import Flask
from db import run_data_db, run_data_collection

app = Flask(__name__)


@app.route("/")
def index():
    return "DASH"


if __name__ == "__main__":
    app.run(port=8000)
