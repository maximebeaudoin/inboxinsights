// Centralized type definitions for email violations
export interface EmailViolation {
  id: string;
  email_entry_id: string;
  flagged: boolean;

  // Category flags (boolean values)
  sexual: boolean;
  hate: boolean;
  harassment: boolean;
  self_harm: boolean;
  sexual_minors: boolean;
  hate_threatening: boolean;
  violence_graphic: boolean;
  self_harm_intent: boolean;
  self_harm_instructions: boolean;
  harassment_threatening: boolean;
  violence: boolean;

  // Category scores (numeric values between 0.0 and 1.0)
  sexual_score?: number;
  hate_score?: number;
  harassment_score?: number;
  self_harm_score?: number;
  sexual_minors_score?: number;
  hate_threatening_score?: number;
  violence_graphic_score?: number;
  self_harm_intent_score?: number;
  self_harm_instructions_score?: number;
  harassment_threatening_score?: number;
  violence_score?: number;

  created_at: string;
}

// Interface for creating new email violations
export interface CreateEmailViolation {
  email_entry_id: string;
  flagged: boolean;

  // Category flags
  sexual: boolean;
  hate: boolean;
  harassment: boolean;
  self_harm: boolean;
  sexual_minors: boolean;
  hate_threatening: boolean;
  violence_graphic: boolean;
  self_harm_intent: boolean;
  self_harm_instructions: boolean;
  harassment_threatening: boolean;
  violence: boolean;

  // Category scores (optional)
  sexual_score?: number;
  hate_score?: number;
  harassment_score?: number;
  self_harm_score?: number;
  sexual_minors_score?: number;
  hate_threatening_score?: number;
  violence_graphic_score?: number;
  self_harm_intent_score?: number;
  self_harm_instructions_score?: number;
  harassment_threatening_score?: number;
  violence_score?: number;
}

// Interface for violation categories
export interface ViolationCategories {
  sexual: boolean;
  hate: boolean;
  harassment: boolean;
  self_harm: boolean;
  sexual_minors: boolean;
  hate_threatening: boolean;
  violence_graphic: boolean;
  self_harm_intent: boolean;
  self_harm_instructions: boolean;
  harassment_threatening: boolean;
  violence: boolean;
}

// Interface for violation scores
export interface ViolationScores {
  sexual_score?: number;
  hate_score?: number;
  harassment_score?: number;
  self_harm_score?: number;
  sexual_minors_score?: number;
  hate_threatening_score?: number;
  violence_graphic_score?: number;
  self_harm_intent_score?: number;
  self_harm_instructions_score?: number;
  harassment_threatening_score?: number;
  violence_score?: number;
}

// Combined interface for API responses
export interface EmailViolationWithEntry extends EmailViolation {
  mood_entry?: {
    id: string;
    from: string;
    from_name: string;
    original_text: string;
    created_at: string;
  };
}
