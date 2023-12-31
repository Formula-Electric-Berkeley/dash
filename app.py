import datetime
import os
import bson
import db
import parsing
from bson.json_util import dumps, loads
from flask import Flask, flash, redirect, render_template, request, url_for
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId

ALLOWED_EXTENSIONS = {"csv"}

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "./uploads/"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/analysis")
def analysis():
    return render_template(
        "analysis.html",
        data_headers_json=loads(dumps(db.dash_headers_collection.find())),
    )


@app.route("/graph", methods=["POST"])
def graph():
    source_id = request.json["source"]
    device = request.json["device"]
    parameter = request.json["parameter"]

    source_document = db.dash_data_collection.find_one({"_id": ObjectId(source_id)})

    graph_data = {"timestamps": source_document["timestamps"], "data": source_document[parameter]}
    source_name = source_document["name"]
    graph_data["name"] = f"{source_name} {device} {parameter}"

    return graph_data


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

            data_header = {
                "name": request.form["title"],
                "filename": filename,
                "date": datetime.date.today().strftime("%x"),
            }

            data = parsing.parse_csv(filepath)
            # data = parsing.parse_csv_dynamics(filepath)

            insert_header_result = db.dash_headers_collection.insert_one(data_header)

            data_header.update(data)
            data_header.update({"_id": insert_header_result.inserted_id})

            db.dash_data_collection.insert_one(data_header)

            db.dash_headers_collection.update_one(
                {
                    "_id": insert_header_result.inserted_id,
                },
                {
                    "$set": {
                        "size": round(
                            len(
                                bson.BSON.encode(
                                    db.dash_data_collection.find_one(
                                        {"_id": insert_header_result.inserted_id}
                                    )
                                )
                            )
                            / 1e6,
                            1,
                        ),
                        "devices": db.dash_data_collection.find_one(
                            {"_id": insert_header_result.inserted_id}
                        )["devices"],
                        "parameters": db.dash_data_collection.find_one(
                            {"_id": insert_header_result.inserted_id}
                        )["parameters"],
                    },
                },
            )

            os.remove(filepath)

            return redirect("/storage")

    return render_template(
        "storage.html",
        data_headers=db.dash_headers_collection.find(),
        storage_size=round(db.dash_db.command("dbstats")["dataSize"] / 1e6, 1),
        storage_size_percent=round(
            (db.dash_db.command("dbstats")["dataSize"] / 1e6) / 512 * 100, 2
        ),
    )


@app.route("/delete_document/<id>", methods=["DELETE"])
def delete(id):
    db.dash_headers_collection.delete_one({"_id": ObjectId(id)})
    db.dash_data_collection.delete_one({"_id": ObjectId(id)})
    return f"Sucessfully deleted document with id: {id}"


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html")


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


if __name__ == "__main__":
    app.run(port=8000, threaded=True, use_reloader=True, debug=True)
