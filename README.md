# MLExpert - ML Model Serving API with Web Interface

This repository contains a Flask application that serves both:
1. A machine learning model API with endpoints for single and batch predictions
2. A web interface that replicates the MLExpert "Get Started with AI" page

## Project Structure

```
mcp_test_369/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── static/                 # Static assets
│   ├── css/
│   │   └── styles.css      # CSS styles for the web interface
│   └── images/
│       └── mlexpert-logo.svg  # Logo for the MLExpert page
└── templates/
    └── index.html          # HTML template for the MLExpert page
```

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

## ML API Endpoints

### Single Prediction
- **URL**: `/api/predict/single`
- **Method**: POST
- **Input Format**:
```json
{
    "features": [0.1, 0.2, 0.3, 0.4]
}
```

### Batch Prediction
- **URL**: `/api/predict/batch`
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

## Web Interface

The web interface is accessible at the root URL (`/`) and replicates the MLExpert "Get Started with AI" page with the following features:

- Navigation header with logo, links, search bar, and user actions
- Left sidebar with course navigation
- Main content area with the "Get Started with AI" title and chatbot diagram
- Right sidebar with page contents navigation

## Example API Usage

### Single Prediction
```bash
curl -X POST http://localhost:5000/api/predict/single \
    -H "Content-Type: application/json" \
    -d '{"features": [0.1, 0.2, 0.3, 0.4]}'
```

### Batch Prediction
```bash
curl -X POST http://localhost:5000/api/predict/batch \
    -H "Content-Type: application/json" \
    -d '{"features": [[0.1, 0.2, 0.3, 0.4], [0.5, 0.6, 0.7, 0.8]]}'
```