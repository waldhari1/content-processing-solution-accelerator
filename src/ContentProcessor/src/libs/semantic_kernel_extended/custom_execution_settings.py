from typing import Any

from semantic_kernel.connectors.ai.open_ai import AzureChatPromptExecutionSettings
from semantic_kernel.connectors.ai.open_ai.prompt_execution_settings.azure_chat_prompt_execution_settings import (
    ExtraBody,
)


class CustomChatCompletionExecutionSettings(AzureChatPromptExecutionSettings):
    logprobs: bool = False
