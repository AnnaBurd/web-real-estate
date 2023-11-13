export interface DropdownMenu extends HTMLElement {
  hide(): void;
  open(): void;
  toggle(): void;
  isOpen(): boolean;
}
