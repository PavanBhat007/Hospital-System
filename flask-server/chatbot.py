import faiss
from sentence_transformers import SentenceTransformer
import vertexai
from vertexai.generative_models import GenerativeModel
import vertexai.preview.generative_models as generative_models
import pandas as pd
from datasets import load_dataset


# Load the datasets
ds = load_dataset("ashnaz/symptoms_diagnose_doctors_data")['train']  # Access the train split

# Load the medicines dataset
medicines_df = pd.read_csv("Dataset.csv")

# Preprocess the datasets to combine symptoms and descriptions into a single text for embedding
combined_data = []
for item in ds:
    text = f"Disease: {item['disease']}\nSymptoms: {item['symptoms']}\nCures: {item['cures']}\nRisk Level: {item['risk level']}"
    combined_data.append(text)

for _, row in medicines_df.iterrows():
    text = f"Medicine: {row['Medicine_name']}\nDescription: {row['Description']}\nAlternatives: {row['Alternatives']}"
    combined_data.append(text)

# Load the FAISS index and the embedding model
index = faiss.read_index("vector_database.index")
model = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize the LLM
vertexai.init(project="gen-lang-client-0165577326", location="asia-south1")
llm_model = GenerativeModel("gemini-1.5-pro-001")

def retrieve_and_generate(query):
    # Embed the query
    query_embedding = model.encode([query], convert_to_tensor=True).cpu().numpy()
    
    # Retrieve relevant documents
    D, I = index.search(query_embedding, k=5)
    relevant_docs = [combined_data[i] for i in I[0]]
    # Format the input for the LLM
    context = "\n".join(relevant_docs)
    input_text = f"Act like an assistant Doctor, For the query of symptoms, Give the following following, Potential Diagnosis, Other Symptoms, Risk LEvel, Additional Information about the disease, Quick remidies and holistic remidies to ease the pain or reduce the symptoms, Possible medicines(For indians so please recommend brands relevant in india). relevant Query: {query}\n\nContext: {context}"
    
    # Generate response using the LLM
    responses = llm_model.generate_content(
        [input_text],
        generation_config=generation_config,
        safety_settings=safety_settings,
        stream=True,
    )
    
    for response in responses:
        print(response.text, end="")

generation_config = {
    "max_output_tokens": 8192,
    "temperature": 1,
    "top_p": 0.95,
}

safety_settings = {
    generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}


retrieve_and_generate("fever, cough, sore throat")
