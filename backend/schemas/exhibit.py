from typing import List, Literal, Optional, Union
from pydantic import BaseModel

class TextBlock(BaseModel):
    type: Literal["text"]
    text: str

class ImageBlock(BaseModel):
    type: Literal["image"]
    mime_type: str = "image/png"
    data_base64: str

class InterleavedExhibitResponse(BaseModel):
    interaction_id: Optional[str] = None
    blocks: List[Union[TextBlock, ImageBlock]]
