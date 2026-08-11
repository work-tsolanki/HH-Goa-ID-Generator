import { randomInt } from "node:crypto";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);

/** Short, URL-safe id used for the blob path and the /share/[id] route. */
export function generateCardId(): string {
  return nanoid();
}

/** Cosmetic builder id printed on the card face, e.g. HH-GOA-2654. */
export function generateBuilderCode(): string {
  return `HH-GOA-${randomInt(1000, 9999)}`;
}
