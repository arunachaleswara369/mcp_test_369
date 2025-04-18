# ML Model Serving API

A Flask API that serves a machine learning model with endpoints for single and batch predictions.

## Setup

1. Clone the repository:
```bash
git clone https://github.com/arunachaleswara369/mcp_test_369.git
cd mcp_test_369
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

## API Endpoints

### Single Prediction
- **URL**: `/predict/single`
- **Method**: POST
- **Input Format**:
```json
{
    "features": [0.1, 0.2, 0.3, 0.4]
}
```

### Batch Prediction
- **URL**: `/predict/batch`
- **Method**: POST
- **Input Format**:
```json
{
    "features": [
        [0.1, 0.2, 0.3, 0.4],
        [0.5, 0.6, 0.7, 0.8]
    ]
}
```

## Example Usage

### Single Prediction
```bash
curl -X POST http://localhost:5000/predict/single \
    -H "Content-Type: application/json" \
    -d '{"features": [0.1, 0.2, 0.3, 0.4]}'
```

### Batch Prediction
```bash
curl -X POST http://localhost:5000/predict/batch \
    -H "Content-Type: application/json" \
    -d '{"features": [[0.1, 0.2, 0.3, 0.4], [0.5, 0.6, 0.7, 0.8]]}'
```