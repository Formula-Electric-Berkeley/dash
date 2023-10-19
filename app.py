import datetime
import os
import db
import parsing
from flask import Flask, flash, redirect, render_template, request, url_for
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"csv"}

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "./uploads/"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/analysis")
def analysis():
    return render_template("analysis.html")


@app.route("/storage", methods=["GET", "POST"])
def storage():
    if request.method == "POST":
        if "file" not in request.files:
            flash("No file part")
            return redirect(request.url)
        file = request.files["file"]

        if file.filename == "":
            flash("No selected file")
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

            file.save(filepath)

            data_info = {
                "name": request.form["title"],
                "filename": filename,
                "date": datetime.date.today().strftime("%x"),
            }

            data = parsing.parse_csv(filepath)

            data_info.update(data)

            db.run_data_collection.insert_one(data_info)

            os.remove(filepath)

            return redirect("/storage")

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


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


if __name__ == "__main__":
    app.run(port=8000, threaded=True, use_reloader=True, debug=True)
