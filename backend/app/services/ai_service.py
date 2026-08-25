import httpx
from typing import List, Dict, Any
from app.config import settings

class AIService:
    def __init__(self):
        self.provider = settings.AI_PROVIDER
        self.api_key = settings.AI_API_KEY
        self.model = settings.AI_MODEL
        
    async def chat(self, messages: List[Dict[str, str]], context_data: Dict[str, Any]) -> str:
        if self.provider == "rule_based" or not self.api_key:
            return self._rule_based_chat(messages[-1]["content"], context_data)
            
        # Example implementation for a generic LLM (like OpenAI/Gemini compatible API)
        # We would use httpx to make the API call here.
        # For safety, falling back to rule_based if not fully implemented.
        return self._rule_based_chat(messages[-1]["content"], context_data)
        
    def _rule_based_chat(self, user_msg: str, context: Dict[str, Any]) -> str:
        msg = user_msg.lower()
        if "expire" in msg and "week" in msg:
            urgent_count = sum(1 for p in context.get("products", []) if p["status"] == "URGENT")
            return f"You have {urgent_count} products expiring this week. Please check your dashboard!"
        if "recipe" in msg:
            return "Based on your expiring items, you could make a quick vegetable stir-fry or a smoothie. Would you like a detailed recipe?"
        return "I am FreshBot! I can help you track expiry dates and reduce food waste. How can I assist you today?"
        
    async def generate_recipe(self, products: List[Dict[str, Any]]) -> str:
        expiring = [p["product_name"] for p in products if p["status"] in ["URGENT", "EXPIRING SOON"]]
        if not expiring:
            return "You have no urgently expiring food! Great job. You can make a classic pasta dish with your pantry staples."
        
        ingredients = ", ".join(expiring)
        return f"AI Recommendation: Since you have {ingredients} expiring soon, I recommend making a customized casserole or mixed salad. \n\nIngredients:\n- {ingredients}\n- Olive oil\n- Salt and pepper\n\nInstructions:\n1. Chop all ingredients.\n2. Toss with oil and seasoning.\n3. Roast or stir-fry until cooked."
        
ai_service = AIService()
