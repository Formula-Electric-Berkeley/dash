import os
import db
import datetime
from flask import Flask, flash, redirect, render_template, request
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin

ALLOWED_EXTENSIONS = {"csv"}

app = Flask(__name__)
CORS(app, expose_headers='Authorization', support_credentials=True)
app.config["UPLOAD_FOLDER"] = "./uploads/"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["GET", "POST", "OPTIONS"])
@cross_origin(supports_credentials=True)
def upload():
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

            db.add_file(filename, filepath, os.stat(filepath).st_size /
                        (1024 * 1024), datetime.date.today().strftime("%x"))

        return "SUCCESS"


@app.route("/get_db_size_usage", methods=["GET"])
def get_db_size_usage():
    return db.get_db_size_usage()


@app.route("/get_files_info", methods=["GET"])
def get_files_info():
    return db.get_all_file_info()


@app.route("/get_file_data_columns", methods=["GET"])
def get_file_data_columns():
    return db.get_file_data_columns(request.args.get('id'))


@app.route("/get_file_data", methods=["GET"])
def get_file_data():
    return db.get_file_data(request.args.get('id'))


@app.route("/get_column_data", methods=["GET"])
def get_column_data():
    return db.get_column_data(request.args.get('id'), request.args.get('column'))


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html")


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


if __name__ == "__main__":
    app.run(port=8000, threaded=True, use_reloader=True, debug=True)
