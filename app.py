from flask import Flask, request, jsonify
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

app = Flask(__name__)

# Initialize a dummy model (in production, you would load your trained model)
model = RandomForestRegressor(n_estimators=100, random_state=42)
X_dummy = np.random.rand(100, 4)
y_dummy = np.random.rand(100)
model.fit(X_dummy, y_dummy)

@app.route('/predict/single', methods=['POST'])
def predict_single():
    try:
        data = request.get_json()
        features = np.array([data['features']])
        prediction = model.predict(features)
        return jsonify({
            'status': 'success',
            'prediction': float(prediction[0])
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    try:
        data = request.get_json()
        features = np.array(data['features'])
        predictions = model.predict(features)
        return jsonify({
            'status': 'success',
            'predictions': predictions.tolist()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)