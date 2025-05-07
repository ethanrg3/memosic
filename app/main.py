from flask import Flask, request, jsonify
import whisper
import os
from werkzeug.utils import secure_filename

# Here, app becomes a WSGI (Web Server Gateway Interface) application object
# The WSGI server passes HTTP requests to the Flask app and returns HTTP responses to the client
app = Flask(__name__)

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400 # serialize and return flask.Response object (error is bad request)
    
    file = request.files["file"]
    filename = secure_filename(file.filename)
    upload_path = "uploads"
    os.makedirs(upload_path, exist_ok=True)
    filepath = os.path.join(upload_path, filename)
    file.save(filepath)

    model = whisper.load_model("base")
    result = model.transcribe(filepath)
    os.remove(filepath)

    return jsonify({"transcript": result["text"]})

if __name__ == "__main__":
    app.run()
