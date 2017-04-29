export class ValidationResult {
    level:LevelType;
    message: string;
}

export type LevelType = "ERROR" | "PROMPT_TO_CONTINUE" | "WARNING"  | "SUCCESS";
