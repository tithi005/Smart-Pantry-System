import React from 'react';

export const DevSpecs: React.FC = () => {
  const pythonCode = `
import functions_framework
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json

@functions_framework.http
def analyze_pantry_image(request):
    """
    Cloud Function to analyze pantry images using Gemini 1.5 Pro.
    Expects a JSON body with 'image_uri' (GCS path) or 'image_base64'.
    """
    request_json = request.get_json(silent=True)
    
    # Initialize Vertex AI
    vertexai.init(project="smart-pantry-project", location="us-central1")
    model = GenerativeModel("gemini-1.5-pro-preview-0409")

    image_part = None
    if request_json and 'image_base64' in request_json:
         image_part = Part.from_data(
             data=request_json['image_base64'], 
             mime_type="image/jpeg"
         )
    else:
        return 'Invalid Request: Missing image data', 400

    prompt = """
    Analyze this pantry shelf image. 
    Return a JSON object with a list of items found:
    {
      "items": [
        {"name": "string", "count": int, "category": "string"}
      ]
    }
    """

    responses = model.generate_content(
        [image_part, prompt],
        generation_config={
            "response_mime_type": "application/json",
            "max_output_tokens": 2048,
            "temperature": 0.4
        }
    )

    return responses.text, 200, {'Content-Type': 'application/json'}
  `;

  const schemaCode = `
-- BIGQUERY / SQL SCHEMA FOR LSTM TRAINING DATA

CREATE TABLE pantry_inventory_logs (
    log_id STRING NOT NULL,
    item_id STRING NOT NULL,
    item_name STRING,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    quantity_observed INT64,
    action_type STRING, -- 'RESTOCK', 'CONSUMPTION', 'AUDIT'
    weather_condition STRING, -- External factor for LSTM
    day_of_week INT64, -- 1-7
    is_holiday BOOL
);

CREATE TABLE item_consumption_sequences (
    sequence_id STRING NOT NULL,
    item_id STRING NOT NULL,
    history_window_days INT64,
    daily_consumption_array ARRAY<INT64>, -- Input feature for LSTM
    target_days_until_empty INT64 -- Label for training
);
  `;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-panel p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-4">Backend: Python Cloud Function (Vertex AI)</h2>
        <pre className="bg-slate-950/50 p-4 rounded-xl overflow-x-auto text-sm text-indigo-300 font-mono border border-indigo-500/20">
          {pythonCode.trim()}
        </pre>
      </div>

      <div className="glass-panel p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-4">Data Architecture: LSTM Schema</h2>
        <pre className="bg-slate-950/50 p-4 rounded-xl overflow-x-auto text-sm text-emerald-300 font-mono border border-emerald-500/20">
          {schemaCode.trim()}
        </pre>
      </div>
    </div>
  );
};
