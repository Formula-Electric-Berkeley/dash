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
    return render_template(
        "storage.html",
        all_run_data=db.get_all_run_data(),
        storage_size=round(db.run_data_db.command("dbstats")["dataSize"] / 1e6, 1),
        storage_size_percent=round(
            (db.run_data_db.command("dbstats")["dataSize"] / 1e6) / 512 * 100, 2
        ),
    )


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html")


if __name__ == "__main__":
    app.run(port=8000, threaded=True, use_reloader=True, debug=True)
