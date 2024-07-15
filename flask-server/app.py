from flask import Flask, request, jsonify
from fuzzywuzzy import fuzz, process
import pandas as pd
import spacy

from parser import get_med_data, med_list

app = Flask(__name__)
df = pd.read_csv("./Dataset.csv")
nlp = spacy.load("en_core_web_sm")
    

def extract_usage_and_side_effects(text):
    doc = nlp(text)
    usage = None
    side_effects = None

    for sent in doc.sents:
        sent_text = sent.text.strip()
        if any(keyword in sent_text.lower() for keyword in ['usage', 'directions for use:', 'taken', 'regularly', 'schedule', 'dose']):
            usage = sent_text

        if any(keyword in sent_text.lower() for keyword in ['side effects', 'common side effects include']):
            side_effects = sent_text

        if usage and side_effects:
            break
        
    
    return {
        "usage": usage,
        "side_effects": side_effects
    }


@app.route('/med', methods=['POST'])
def med_data():
    med_name = request.get_json()
    medicines = med_list()
    
    if not med_name:
        return jsonify({"error": "No medicine name provided"}), 400

    best_match = process.extractOne(med_name, medicines, scorer=fuzz.partial_ratio)
    print(best_match)
    if best_match and best_match[1] > 80:
        med_data = get_med_data(best_match[0])[0]
        res = extract_usage_and_side_effects(med_data["Description"])
        med_data["Usage"] = res["usage"]
        med_data["SideEffects"] = res["side_effects"]
        
        return med_data
    else:
        return jsonify({"error": "No matching medicine found"}), 404
    



if __name__ == '__main__':
    app.run(debug=True, port=3000)
