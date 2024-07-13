import spacy

# Load SpaCy model
nlp = spacy.load("en_core_web_sm")


def extract_usage_and_side_effects(text):
    # Process the text with SpaCy
    doc = nlp(text)

    usage = None
    side_effects = None

    # Look for sentences containing usage instructions
    for sent in doc.sents:
        sent_text = sent.text.strip()
        if any(keyword in sent_text.lower() for keyword in ['usage:', 'directions for use:', 'taken', 'regularly', 'schedule', 'dose']):
            usage = sent_text

        # Look for sentences containing side effects
        if any(keyword in sent_text.lower() for keyword in ['side effects:', 'common side effects include']):
            side_effects = sent_text

        # Break the loop if both usage and side effects are found
        if usage and side_effects:
            break
        
    
    return {
        "usage": usage,
        "side_effects": side_effects
    }


# Example usage
example_text = "Biodipin 5mg Tablet belongs to a class of medicines known as calcium channel blockers. It is used to treat high blood pressure (hypertension) and prevent angina (heart-related chest pain). It lowers blood pressure and reduces the heart's workload, which helps prevent heart attacks and strokes.Biodipin 5mg Tablet may be prescribed alone or along with other medicines. The dose depends on what you are taking it for and the severity of your condition. You can take it at any time of the day, with or without food, but it is best to take it at about the same time each day. You should take this medicine for as long as it is prescribed for you. Even if you feel well, do not stop this medicine on your own because high blood pressure often has no symptoms. If you stop taking it, your condition may get worse. Keeping yourself active with regular exercise, managing your weight, and eating a healthy diet will also help control your blood pressure.The most common side effects include headache, fatigue, nausea, abdominal pain, and sleepiness. Consult your doctor if any of these side effects bother you or do not go away. They may be able to suggest ways to prevent or reduce the side effects.Before taking it, let your doctor know if you have any liver, heart, or kidney problems. PregNo price availablet or breastfeeding women should also consult their doctor before taking this medicine. You also need to tell your doctor about all the other medicines you are taking, especially those used to treat high blood pressure or heart conditions. You should have your blood pressure checked regularly to make sure that this medicine is working properly."

result = extract_usage_and_side_effects(example_text)
print(result)
