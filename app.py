from flask import Flask, render_template
import db

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/analysis")
def analysis():
    return render_template("analysis.html")


@app.route("/storage")
def storage():
    return render_template("storage.html", all_run_data=db.get_all_run_data())


if __name__ == "__main__":
    app.run(port=8000, threaded=True, use_reloader=True, debug=True)
