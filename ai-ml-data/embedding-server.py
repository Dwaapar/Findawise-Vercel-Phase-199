#!/usr/bin/env python3
"""
Embedding Model Server for Findawise Empire
Provides high-performance embedding generation with GPU acceleration
Supports Universal Sentence Encoder, MiniLM, E5-Small and other models
"""

import os
import json
import logging
import threading
import time
from typing import List, Dict, Any, Optional, Union

try:
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    import uvicorn
    import torch
    from sentence_transformers import SentenceTransformer
    import numpy as np
    from transformers import AutoTokenizer, AutoModel
    
    DEPENDENCIES_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Missing dependencies for embedding server: {e}")
    print("This is normal for Replit environment. Dependencies will be available in local deployment.")
    DEPENDENCIES_AVAILABLE = False
    
    # Create minimal stubs to prevent import errors
    class BaseModel:
        pass
    
    class FastAPI:
        def __init__(self, **kwargs):
            pass
    
    class HTTPException(Exception):
        def __init__(self, status_code, detail):
            self.status_code = status_code
            self.detail = detail
    
    torch = None
    SentenceTransformer = None
    np = None

# Only define classes if dependencies are available
if not DEPENDENCIES_AVAILABLE:
    print("Embedding server running in stub mode for Replit environment")
    
    def create_stub_app():
        app = FastAPI()
        
        @app.get("/")
        def root():
            return {"status": "stub_mode", "message": "Embedding server dependencies not available in this environment"}
        
        @app.get("/health")
        def health():
            return {"status": "stub_mode", "dependencies_available": False}
            
        return app
    
    app = create_stub_app()
else:

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Findawise Embedding Server", version="1.0.0")

class EmbeddingRequest(BaseModel):
    text: str | List[str]
    model: str = "all-MiniLM-L6-v2"
    normalize: bool = True

class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    model: str
    dimensions: int
    processing_time: float

class ModelManager:
    def __init__(self):
        self.models: Dict[str, SentenceTransformer] = {}
        self.model_configs = {
            "all-MiniLM-L6-v2": {"dimensions": 384, "max_length": 512},
            "all-mpnet-base-v2": {"dimensions": 768, "max_length": 514},
            "paraphrase-multilingual-MiniLM-L12-v2": {"dimensions": 384, "max_length": 512},
            "universal-sentence-encoder": {"dimensions": 512, "max_length": 512},
            "e5-small": {"dimensions": 384, "max_length": 512},
        }
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {self.device}")
        
        # Pre-load default models
        self._preload_models()
    
    def _preload_models(self):
        """Pre-load commonly used models for faster inference"""
        default_models = ["all-MiniLM-L6-v2", "all-mpnet-base-v2"]
        
        for model_name in default_models:
            try:
                self.load_model(model_name)
                logger.info(f"Pre-loaded model: {model_name}")
            except Exception as e:
                logger.warning(f"Failed to pre-load {model_name}: {e}")
    
    def load_model(self, model_name: str) -> SentenceTransformer:
        """Load a model if not already loaded"""
        if model_name not in self.models:
            try:
                # Handle model name mapping
                actual_model_name = self._map_model_name(model_name)
                
                model = SentenceTransformer(actual_model_name, device=self.device)
                self.models[model_name] = model
                logger.info(f"Loaded model {model_name} ({actual_model_name}) on {self.device}")
                
                # GPU memory optimization
                if self.device == "cuda":
                    model.half()  # Use FP16 for memory efficiency
                    
            except Exception as e:
                logger.error(f"Failed to load model {model_name}: {e}")
                raise HTTPException(status_code=500, detail=f"Failed to load model: {model_name}")
        
        return self.models[model_name]
    
    def _map_model_name(self, model_name: str) -> str:
        """Map custom model names to actual model identifiers"""
        mapping = {
            "universal-sentence-encoder": "all-mpnet-base-v2",  # Use mpnet as USE alternative
            "minilm": "all-MiniLM-L6-v2",
            "e5-small": "intfloat/e5-small-v2",
        }
        return mapping.get(model_name, model_name)
    
    def generate_embeddings(self, texts: List[str], model_name: str, normalize: bool = True) -> np.ndarray:
        """Generate embeddings for given texts"""
        model = self.load_model(model_name)
        
        try:
            start_time = time.time()
            embeddings = model.encode(
                texts,
                normalize_embeddings=normalize,
                show_progress_bar=False,
                batch_size=32,
                convert_to_numpy=True
            )
            processing_time = time.time() - start_time
            
            logger.info(f"Generated {len(embeddings)} embeddings in {processing_time:.3f}s using {model_name}")
            return embeddings, processing_time
            
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            raise HTTPException(status_code=500, detail=f"Embedding generation failed: {str(e)}")
    
    def get_model_info(self, model_name: str) -> Dict[str, Any]:
        """Get information about a model"""
        return self.model_configs.get(model_name, {"dimensions": 384, "max_length": 512})

# Initialize model manager
model_manager = ModelManager()

@app.get("/")
async def root():
    return {
        "service": "Findawise Embedding Server",
        "status": "operational",
        "device": model_manager.device,
        "loaded_models": list(model_manager.models.keys()),
        "available_models": list(model_manager.model_configs.keys())
    }

@app.get("/health")
async def health_check():
    gpu_available = torch.cuda.is_available()
    gpu_count = torch.cuda.device_count() if gpu_available else 0
    
    return {
        "status": "healthy",
        "gpu_available": gpu_available,
        "gpu_count": gpu_count,
        "loaded_models": len(model_manager.models),
        "memory_usage": torch.cuda.memory_allocated() if gpu_available else 0
    }

@app.post("/embed", response_model=EmbeddingResponse)
async def generate_embeddings(request: EmbeddingRequest):
    """Generate embeddings for text(s)"""
    texts = [request.text] if isinstance(request.text, str) else request.text
    
    if not texts:
        raise HTTPException(status_code=400, detail="No text provided")
    
    if len(texts) > 1000:
        raise HTTPException(status_code=400, detail="Too many texts (max 1000)")
    
    try:
        embeddings, processing_time = model_manager.generate_embeddings(
            texts, request.model, request.normalize
        )
        
        model_info = model_manager.get_model_info(request.model)
        
        return EmbeddingResponse(
            embeddings=embeddings.tolist(),
            model=request.model,
            dimensions=model_info["dimensions"],
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"Embedding request failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def list_models():
    """List available embedding models"""
    return {
        "available_models": model_manager.model_configs,
        "loaded_models": list(model_manager.models.keys())
    }

@app.post("/models/{model_name}/load")
async def load_model(model_name: str):
    """Pre-load a specific model"""
    try:
        model_manager.load_model(model_name)
        return {"status": "loaded", "model": model_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    if DEPENDENCIES_AVAILABLE:
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8001,
            workers=1,  # Single worker for GPU efficiency
            log_level="info"
        )
    else:
        print("Cannot start embedding server: dependencies not available")
        print("This is expected in Replit environment. Use local deployment for full functionality.")