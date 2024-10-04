from flask import Flask, request, jsonify
from groq import Groq
import requests
import PyPDF2
from io import BytesIO
from PyPDF2 import PdfReader
import requests
import re
import json

app = Flask(__name__)
client = Groq()

# GRADE API 

@app.route('/upload', methods=['POST'])
def upload_file():
    data = request.get_json()

    # Check if required fields are present
    if not data or 'pdf_url' not in data or 'criteria' not in data:
        return jsonify({"error": "Missing 'pdf_url' or 'criteria' in the request."}), 400

    pdf_url = data['pdf_url']
    criteria = data['criteria']

    # Download the PDF from the given URL

    try:
        # Download the PDF content
        response = requests.get(pdf_url)
        response.raise_for_status()  # Ensure the request was successful
        
        # Load the PDF content into memory using BytesIO
        file = BytesIO(response.content)
        
        # Use PyPDF2 to read and extract text from the PDF
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""  # Extract text from each page
        text
    except requests.exceptions.RequestException as e:
        return f"Failed to download PDF: {str(e)}"
    except Exception as e:
        return f"Failed to extract text from PDF: {str(e)}"

    # Create a prompt with the criteria
    criteria_list = ", ".join(criteria)
    prompt = f"""
    You are a grading assistant. Grade the assignment based on the following criteria: {criteria_list}.
    Provide a grade between 1 and 10 for the overall quality of the PDF content, followed by one line descriptions for each criterion.

    Output the result in the following JSON format

    {{
        "grade": (1-10),
        "{criteria[0]}": "Description for criterion {criteria[0]}",
        "{criteria[1]}": "Description for criterion {criteria[1]}",
        "{criteria[2]}": "Description for criterion {criteria[2]}"
    }}

    PDF text:
    {text}
    """

    # Create a completion request to grade the assignment
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    # Collect and process the response
    graded_response = ""
    for chunk in completion:
        graded_response += chunk.choices[0].delta.content or ""

    # Extract only the content between curly braces using a regular expression
    print(graded_response)
    graded_response = extract_json_from_response(graded_response)
    # Assuming the model returns JSON directly, you can return the response
    try:
        return jsonify(graded_response)
    except Exception as e:
        return jsonify({"error": f"Failed to parse model response: {str(e)}"}), 500

def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""  # Handle potential None values
    return text

def extract_json_from_response(response_text):
    try:
        # Simplified regex to find the first block of content between curly braces
        json_match = re.search(r'\{.*?\}', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            json_str = json_str.replace("'", "\"")
            # Load the extracted string into a Python dictionary
            json_data = json.loads(json_str)
            return json_data
        else:
            return {"error": "No valid JSON found in the response."}
    except json.JSONDecodeError as e:
        return {"error": f"Failed to parse JSON: {str(e)}"}

if __name__ == '__main__':
    app.run(debug=True)
