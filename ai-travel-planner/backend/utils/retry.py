import logging

logger = logging.getLogger(__name__)

async def retry_agent(func, retries=2):
    for i in range(retries):
        try:
            return await func()
        except Exception as e:
            logger.warning(f"Attempt {i+1} failed: {e}")
            if i == retries - 1:
                raise
