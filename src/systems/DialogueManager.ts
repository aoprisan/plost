import { Story } from 'inkjs';

export interface DialogueLine {
  text: string;
  speaker?: string;
  tags: string[];
}

export interface DialogueChoice {
  text: string;
  index: number;
}

export class DialogueManager {
  private story: Story | null = null;

  loadStory(inkJson: string): void {
    this.story = new Story(inkJson);
  }

  /** Set an Ink variable */
  setVariable(name: string, value: string | number | boolean): void {
    if (this.story) {
      this.story.variablesState.$(name, value);
    }
  }

  /** Get the next line of dialogue, or null if waiting for a choice / end */
  continue(): DialogueLine | null {
    if (!this.story || !this.story.canContinue) return null;

    const text = this.story.Continue()!;
    const tags = this.story.currentTags ?? [];

    // Parse speaker from tags (e.g., #speaker:Satan)
    let speaker: string | undefined;
    for (const tag of tags) {
      if (tag.startsWith('speaker:')) {
        speaker = tag.slice('speaker:'.length).trim();
      }
    }

    return { text: text.trim(), speaker, tags };
  }

  /** Get all available lines until a choice point or end */
  continueAll(): DialogueLine[] {
    const lines: DialogueLine[] = [];
    let line = this.continue();
    while (line) {
      lines.push(line);
      line = this.continue();
    }
    return lines;
  }

  /** Get current choices (empty array if none) */
  getChoices(): DialogueChoice[] {
    if (!this.story) return [];
    return this.story.currentChoices.map((c, i) => ({
      text: c.text,
      index: i,
    }));
  }

  /** Select a choice by index */
  choose(index: number): void {
    if (this.story) {
      this.story.ChooseChoiceIndex(index);
    }
  }

  /** Check if the story has ended */
  isEnded(): boolean {
    if (!this.story) return true;
    return !this.story.canContinue && this.story.currentChoices.length === 0;
  }

  /** Jump to a specific knot */
  goTo(knotName: string): void {
    if (this.story) {
      this.story.ChoosePathString(knotName);
    }
  }
}
