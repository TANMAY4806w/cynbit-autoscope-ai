"""
Cynbit AutoScope AI — Audio & Voice Transcription Module
Powered by AssemblyAI. Enables clients to submit voice notes or meeting recordings
that are transcribed into structured technical specifications.
"""

import os
from typing import Optional, Tuple


def transcribe_client_audio(audio_file_path: str, api_key: Optional[str] = None) -> Tuple[bool, str]:
    """
    Transcribes audio using AssemblyAI SDK.
    Returns (success: bool, transcript_or_error: str).
    """
    key = api_key or os.getenv("ASSEMBLYAI_API_KEY")
    if not key:
        return False, "AssemblyAI API key not configured."

    try:
        import assemblyai as aai
        aai.settings.api_key = key
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(audio_file_path)

        if transcript.status == aai.TranscriptStatus.error:
            return False, f"Transcription error: {transcript.error}"

        return True, transcript.text or ""
    except Exception as e:
        return False, f"Failed to transcribe audio: {str(e)}"
