export interface DropdownMenu extends HTMLElement {
  hide(): Promise<void>;
  open(): void;
  toggle(): void;
  isOpen(): boolean;
}
