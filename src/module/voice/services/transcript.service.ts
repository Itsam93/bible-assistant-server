import {
  canSearchForScriptureText,
} from "./scripture-detector.service";

export interface TranscriptSegment {
  text: string;
  isFinal: boolean;
  timestamp?: number;
}

export interface TranscriptState {
  currentText: string;
  finalText: string;
  updatedAt: number;
}

export class TranscriptService {
  private state: TranscriptState = {
    currentText: "",
    finalText: "",
    updatedAt: Date.now(),
  };

  /**
   * Update the current speech transcript.
   *
   * This is called whenever the speech-recognition
   * layer produces a new transcript segment.
   */
  update(
    segment: TranscriptSegment,
  ): TranscriptState {
    const text =
      segment.text.trim();

    if (!text) {
      return this.state;
    }

    if (segment.isFinal) {
      this.state = {
        currentText: "",
        finalText:
          this.state.finalText
            ? `${this.state.finalText} ${text}`
            : text,
        updatedAt: Date.now(),
      };
    } else {
      this.state = {
        ...this.state,
        currentText: text,
        updatedAt: Date.now(),
      };
    }

    return this.state;
  }

  /**
   * Get the latest transcript state.
   */
  getState(): TranscriptState {
    return {
      ...this.state,
    };
  }

  /**
   * Get the text currently being processed
   * for scripture detection.
   *
   * Final transcript is preferred because it is
   * generally more stable than interim recognition.
   */
  getDetectionText(): string {
    if (
      this.state.finalText.trim()
    ) {
      return this.state.finalText.trim();
    }

    return this.state.currentText.trim();
  }

  /**
   * Determine whether the current transcript
   * contains enough meaningful words to send
   * through the scripture matching pipeline.
   */
  canDetectScripture(): boolean {
    const text =
      this.getDetectionText();

    if (!text) {
      return false;
    }

    return canSearchForScriptureText(
      text,
    );
  }

  /**
   * Clear the current transcript.
   */
  clear(): void {
    this.state = {
      currentText: "",
      finalText: "",
      updatedAt: Date.now(),
    };
  }

  /**
   * Replace the transcript completely.
   *
   * Useful when a new speech-recognition session
   * starts.
   */
  reset(text = ""): void {
    const normalized =
      text.trim();

    this.state = {
      currentText: "",
      finalText: normalized,
      updatedAt: Date.now(),
    };
  }
}

export const transcriptService =
  new TranscriptService();