from flask import Flask, render_template
import db

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html", all_run_data=db.get_all_run_data)


if __name__ == "__main__":
    app.run(threaded=True, use_reloader=True, debug=True)
